export async function getRooms(page = 1, pageSize = 10) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Phong?page=${page}&pageSize=${pageSize}`, {
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
        console.log('Raw API Response (getRooms):', data);
        const result = {
            data: Array.isArray(data.data) ? data.data : [],
            totalRecords: data.totalRecords || data.data?.length || 0,
            page: data.page || page,
            pageSize: data.pageSize || pageSize,
            totalPages: data.totalPages || Math.ceil((data.totalRecords || data.data?.length || 0) / (data.pageSize || pageSize)) || 1,
        };
        return result;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng:', error.message);
        throw error;
    }
}

export async function getRoom(maPhong) {
    try {
        console.log('Fetching room from URL:', `${import.meta.env.VITE_API_BASE_URL}/Phong/${maPhong}`); // Debug URL
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Phong/${maPhong}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw API Response (getRoom):', data); // Debug phản hồi
        if (data && Object.keys(data).length > 0) {
            return data; // Trả về dữ liệu trực tiếp
        }
        throw new Error('Không tìm thấy dữ liệu phòng');
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết phòng:', error.message);
        throw error;
    }
}


export async function addRoom(room) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Phong`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(room),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Lỗi khi thêm phòng:', error.message);
        throw error;
    }
}

export async function updateRoom(room) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Phong/${room.maPhong}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(room),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật phòng:', error.message);
        throw error;
    }
}

export async function deleteRoom(maPhong) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Phong/${maPhong}`, {
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

        return true;
    } catch (error) {
        console.error('Lỗi khi xóa phòng:', error.message);
        throw error;
    }
}


export async function bookRoom(bookingData) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/DatPhong`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || `HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (response.status === 201 || !contentType || !contentType.includes('application/json')) {
            return bookingData;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi khi đặt phòng:', error.message);
        throw error;
    }
}