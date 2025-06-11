
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

        if (Array.isArray(apiResponse.data)) {
            dataArray = apiResponse.data;
            totalRecords = apiResponse.totalRecords || apiResponse.data.length || 0;
            currentPage = apiResponse.page || page;
            current_pageSize = apiResponse.pageSize || pageSize;
            totalPages = apiResponse.totalPages || Math.ceil(totalRecords / current_pageSize) || 1;
        } else if (Array.isArray(apiResponse)) {
            dataArray = apiResponse;
            totalRecords = apiResponse.length;
            totalPages = Math.ceil(totalRecords / pageSize) || 1;
        } else {
            console.warn('Cấu trúc phản hồi API không mong muốn:', apiResponse);
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
        throw error;
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
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Lỗi khi thêm đặt phòng:', error.message);
        throw error;
    }
}

export async function checkoutBooking(checkoutData) {
    try {
        if (!checkoutData || typeof checkoutData !== 'object' || typeof checkoutData.maDatPhong !== 'number' || checkoutData.maDatPhong <= 0) {
            throw new Error('Dữ liệu trả phòng không hợp lệ. Cần có maDatPhong.');
        }
        if (typeof checkoutData.maPhong === 'undefined' || checkoutData.maPhong === null) {
            console.warn('maPhong không được cung cấp cho chức năng trả phòng. Có thể gây lỗi API.');
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/DatTraPhong/tra-phong`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkoutData),
        });

        if (!response.ok) {
            // Khi phản hồi không OK, cố gắng parse JSON lỗi, nếu không được thì dùng statusText
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            } catch (jsonError) {
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText || 'Unknown error'}`);
            }
        }

        try {
            const contentType = response.headers.get('content-type');
            const contentLength = response.headers.get('content-length');

            // Nếu status là 204 No Content, hoặc không có Content-Type JSON, hoặc Content-Length là 0,
            // thì giả định không có JSON body để parse.
            if (response.status === 204 || (contentLength === '0' && response.status !== 200) || (contentType && !contentType.includes('application/json'))) {
                console.log('API "tra-phong" trả về phản hồi thành công nhưng không có nội dung JSON (dựa trên headers/status).');
                return true; // Coi như thành công nếu không có JSON content
            }
            // Nếu có vẻ như có JSON, thử parse
            const data = await response.json();
            return data.data; // Giả định API trả về dữ liệu trong data.data
        } catch (jsonParseError) {
            // Nếu việc parse JSON thất bại cho một phản hồi 2xx OK, giả định không có nội dung đáng kể
            console.warn(`Không thể parse JSON cho phản hồi trả phòng thành công (status ${response.status}). Giả định không có nội dung.`, jsonParseError);
            return true; // Coi như thành công nếu JSON parsing thất bại nhưng status là OK
        }
    } catch (error) {
        console.error('Lỗi khi trả phòng:', error.message);
        throw error;
    }
}
