// Hàm phụ để lấy khách hàng mới nhất dựa trên email hoặc cccd
async function fetchLatestCustomerByEmailOrCCCD(email, cccd) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/KhachHang?page=1&pageSize=30`, {
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
    console.log('fetchLatestCustomerByEmailOrCCCD response:', data);

    // Tìm khách hàng khớp với email hoặc cccd, lấy khách hàng có maKhachHang cao nhất
    const matchingCustomers = data.data.filter(
      (customer) => customer.email === email || customer.cccd === cccd
    );
    if (matchingCustomers.length === 0) {
      return null;
    }

    const latestCustomer = matchingCustomers.reduce((latest, customer) =>
      customer.maKhachHang > latest.maKhachHang ? customer : latest
    );
    return latestCustomer;
  } catch (error) {
    console.error('fetchLatestCustomerByEmailOrCCCD error:', error);
    return null;
  }
}

export async function createCustomer(customerData) {
  try {
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

    // Xử lý phản hồi thành công
    if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
      console.warn('Non-JSON or empty response received');
      const text = await response.text();
      console.log('Response text:', text);

      // Cố gắng trích xuất maKhachHang từ text
      const match = text.match(/maKhachHang\D*(\d+)/i);
      if (match && match[1]) {
        data.maKhachHang = parseInt(match[1]);
      } else {
        // Nếu không lấy được maKhachHang, gọi API GET để tìm khách hàng mới nhất
        console.warn('Could not extract maKhachHang from response, attempting to fetch latest customer');
        const latestCustomer = await fetchLatestCustomerByEmailOrCCCD(customerData.email, customerData.cccd);
        if (latestCustomer) {
          data.maKhachHang = latestCustomer.maKhachHang;
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