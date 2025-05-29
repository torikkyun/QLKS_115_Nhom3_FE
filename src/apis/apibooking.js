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

        const data = await response.json();
        console.log('Raw API Response (getBooking):', data);

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
        console.error('Lỗi khi lấy danh sách đặt phòng:', error.message);
        throw error; // Ném lỗi để xử lý ở component
    }
}
export async function addBooking() {
    const booking = [{
        phongDichVus: [
            {
                maPhong: 0,
                dichVuIds: [0],
                ngayNhanPhong: "2025-05-29",
                ngayTraPhong: "2025-05-29"
            }
        ],
        khuyenMaiId: 0,
        ghiChu: "string",
        maKhachHang: 0,
    }];
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/DatTraPhong/dat-phong`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking),
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

export async function updateBooking() {
    const booking = {
        maPhong: 0,
        maKhachHang: 0
    };
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/DatTraPhong/tra-phong/${booking.maKhachHang}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data; // Giả định API trả về phòng vừa cập nhật trong data.data
    } catch (error) {
        console.error('Lỗi khi cập nhật danh sách:', error.message);
        throw error; // Ném lỗi để xử lý ở component
    }
}