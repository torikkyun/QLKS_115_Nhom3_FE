export async function getCustomers(page = 1, pageSize = 10) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/KhachHang?page=${page}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw API Response (getCustomers):', data);

        // Đảm bảo phản hồi có cấu trúc đầy đủ
        const result = {
            data: Array.isArray(data.data) ? data.data : [],
            totalRecords: data.totalRecords || data.data?.length || 0,
            page: data.page || page,
            pageSize: data.pageSize || pageSize,
            totalPages: data.totalPages || Math.ceil((data.totalRecords || data.data?.length || 0) / (data.pageSize || pageSize)) || 1,
        };

        return result;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách khách hàng:', error.message);
        throw error; // Ném lỗi để xử lý ở component
    }
}

export async function addCustomers(customer) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/KhachHang`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Lỗi khi thêm khách hàng:', error.message);
        throw error; // Ném lỗi để xử lý ở component
    }
}

export async function updateCustomers(customer) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/KhachHang/${customer.maKhachHang}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data; // Giả định API trả về phòng vừa cập nhật trong data.data
    } catch (error) {
        console.error('Lỗi khi cập nhật khách hàng:', error.message);
        throw error; // Ném lỗi để xử lý ở component
    }
}

export async function deleteCustomers(maKhachHang) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/KhachHang/${maKhachHang}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        return true; // Trả về true nếu xóa thành công
    } catch (error) {
        console.error('Lỗi khi xóa phòng:', error.message);
        throw error; // Ném lỗi để xử lý ở component
    }
}







/*
export async function getCustomerId(cccd, retries = 10, delay = 1000) {
  let page = 1;
  const pageSize = 100;
  let allMatchingCustomers = [];

  for (let i = 0; i < retries; i++) {
    try {
      // Gọi API với phân trang để lấy toàn bộ khách hàngzz
      while (true) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/KhachHang?page=${page}&pageSize=${pageSize}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch customers`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }

        const data = await response.json();
        console.log(`getCustomerId response (page ${page}):`, data);

        // Lọc khách hàng theo cccd
        const matchingCustomers = data.data.filter((customer) => customer.cccd === cccd);
        allMatchingCustomers = [...allMatchingCustomers, ...matchingCustomers];

        // Kiểm tra nếu đã lấy hết dữ liệu (không còn trang tiếp theo)
        if (!data.data || data.data.length < pageSize) {
          break;
        }
        page++;
      }

      // Nếu không tìm thấy khách hàng nào khớp với cccd, thử lại
      if (allMatchingCustomers.length === 0) {
        console.warn(`No matching customers found with cccd ${cccd} on attempt ${i + 1}, retrying...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        page = 1; // Reset page để thử lại từ đầu
        continue;
      }

      // Lấy khách hàng có maKhachHang cao nhất (khách hàng mới nhất)
      const latestCustomer = allMatchingCustomers.reduce((latest, customer) =>
        customer.maKhachHang > latest.maKhachHang ? customer : latest
      );
      return latestCustomer.maKhachHang; // Chỉ trả về maKhachHang
    } catch (error) {
      console.error(`getCustomerId error (attempt ${i + 1}):`, error);
      if (i === retries - 1) return null;
      await new Promise((resolve) => setTimeout(resolve, delay));
      page = 1; // Reset page nếu có lỗi
    }
  }
  return null;
}

export async function createCustomer(customerData) {
  try {
    const createdAt = new Date();
    let existingCustomerId = await getCustomerId(customerData.cccd);
    if (existingCustomerId) {
      console.log('Customer with this CCCD already exists with maKhachHang:', existingCustomerId);
      return { maKhachHang: existingCustomerId };
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/KhachHang`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    console.log('createCustomer response status:', response.status);
    console.log('createCustomer response headers:', Object.fromEntries(response.headers.entries()));

    const contentType = response.headers.get('content-type');
    let data = {};

    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        throw new Error(data.message || `HTTP ${response.status}: Failed to create customer`);
      } else {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text || 'Failed to create customer'}`);
      }
    }

    if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
      console.warn('Non-JSON or empty response received');
      const text = await response.text();
      console.log('Response text:', text);

      const match = text.match(/maKhachHang\D*(\d+)/i);
      if (match && match[1]) {
        data.maKhachHang = parseInt(match[1]);
      } else {
        console.warn('Could not extract maKhachHang from response, attempting to fetch latest customer');
        const latestCustomerId = await getCustomerId(customerData.cccd);
        if (latestCustomerId) {
          data.maKhachHang = latestCustomerId;
        } else {
          throw new Error('Could not retrieve maKhachHang after creation');
        }
      }
    } else {
      data = await response.json();
      console.log('createCustomer JSON response:', data);
    }

    return data;
  } catch (error) {
    console.error('createCustomer error:', error);
    throw error;
  }
}
*/