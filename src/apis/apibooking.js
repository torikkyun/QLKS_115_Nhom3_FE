export async function getBooking(page = 1, pageSize = 10) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/DatTraPhong/danh-sach/?page=${page}&pageSize=${pageSize}`, {
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

        const apiResponse = await response.json();
        console.log('Raw API Response (getBooking):', apiResponse);

        let dataArray = [];
        let totalRecords = 0;
        let currentPage = page;
        let current_pageSize = pageSize;
        let totalPages = 1;

        if (Array.isArray(apiResponse.data)) { // Trường hợp phản hồi có cấu trúc phân trang
            dataArray = apiResponse.data;
            totalRecords = apiResponse.totalRecords || apiResponse.data.length || 0;
            currentPage = apiResponse.page || page;
            current_pageSize = apiResponse.pageSize || pageSize;
            totalPages = apiResponse.totalPages || Math.ceil(totalRecords / current_pageSize) || 1;
        } else if (Array.isArray(apiResponse)) { // Trường hợp phản hồi trực tiếp là một mảng
            dataArray = apiResponse;
            totalRecords = apiResponse.length;
            totalPages = Math.ceil(totalRecords / pageSize) || 1; // Ước tính totalPages dựa trên pageSize client
        } else {
            console.warn('Cấu trúc phản hồi API không hợp lệ:', apiResponse); // Có thể xử lý lỗi hoặc trả về một cấu trúc rỗng nếu phản hồi không đúng định dạng
        }

        const result = {
            data: dataArray,
            totalRecords: totalRecords,
            page: currentPage,
            pageSize: current_pageSize,
            totalPages: totalPages,
        };

        return result;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đặt phòng:', error.message);
        throw error; // Ném lỗi để xử lý ở component
    }
}


export async function addBooking(bookingData) {
    try {
        if (!Array.isArray(bookingData) || bookingData.length === 0) {
            throw new Error('Dữ liệu đặt phòng không hợp lệ. Phải là một mảng không rỗng.');
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/DatTraPhong/dat-phong`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData), // Sử dụng dữ liệu truyền vào
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data; // Giả định API trả về dữ liệu trong data.data
    } catch (error) {
        console.error('Lỗi khi thêm đặt phòng:', error.message);
        throw error; // Ném lỗi để xử lý ở component
    }
}


export async function updateBooking(maKhachHang, updateData) {
    try {
        if (typeof maKhachHang !== 'number' || maKhachHang <= 0) {
            throw new Error('Mã khách hàng không hợp lệ để cập nhật.');
        }
        if (!updateData || typeof updateData !== 'object') {
            throw new Error('Dữ liệu cập nhật không hợp lệ.');
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/DatTraPhong/tra-phong/${maKhachHang}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData), // Sử dụng dữ liệu cập nhật truyền vào
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data; // Giả định API trả về phòng vừa cập nhật trong data.data
    } catch (error) {
        console.error('Lỗi khi cập nhật danh sách (trả phòng):', error.message);
        throw error; // Ném lỗi để xử lý ở component
    }
}
