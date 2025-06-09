// apiinvoice.js
export async function getInvoices(page = 1, pageSize = 10) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/HoaDon?page=${page}&pageSize=${pageSize}`, {
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
        console.log('Raw API Response (getInvoices):', data);
        const result = {
            data: Array.isArray(data.data) ? data.data : [],
            totalRecords: data.totalRecords || data.data?.length || 0,
            page: data.page || page,
            pageSize: data.pageSize || pageSize,
            totalPages: data.totalPages || Math.ceil((data.totalRecords || data.data?.length || 0) / (data.pageSize || pageSize)) || 1,
        };

        return result;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách hóa đơn:', error.message);
        return [];
    }
}

export async function getInvoiceById(id) {
    try {
        if (!id || isNaN(Number(id))) {
            throw new Error('Mã đặt phòng không hợp lệ');
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/HoaDon/${id}`, {
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
        console.log('Raw API Response (getInvoiceById):', data);

        if (!data || Object.keys(data).length === 0) {
            throw new Error('Không tìm thấy hóa đơn với mã đặt phòng này');
        }

        return data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin hóa đơn:', error.message);
        throw error; 
    }
}

export async function payInvoice(maDatPhong) {
    try {
        if (!maDatPhong || isNaN(Number(maDatPhong))) {
            throw new Error('Mã đặt phòng không hợp lệ');
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/HoaDon/ThanhToan/${maDatPhong}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ maDatPhong }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Payment successful, invoice details:', data);
        return data;
    } catch (error) {
        console.error('Lỗi khi thanh toán hóa đơn:', error.message);
        throw error;
    }
}
export async function getInvoiceByIdPublic(id) {
    try {
        if (!id || isNaN(Number(id))) {
            throw new Error('Mã đặt phòng không hợp lệ');
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/HoaDon/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw API Response (getInvoiceByIdPublic):', data);

        if (!data || Object.keys(data).length === 0) {
            throw new Error('Không tìm thấy hóa đơn với mã đặt phòng này');
        }

        return data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin hóa đơn công khai:', error.message);
        throw error;
    }
}