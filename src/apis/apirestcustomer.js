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