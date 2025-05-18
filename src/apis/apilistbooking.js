export async function getBookings(page = 1, pageSize = 5) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/DatTraPhong/danh-sach?page=${page}&pageSize=${pageSize}`, {
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
        console.log('Raw API Response (getBookings):', data);

        // Ensure response has a complete structure
        const result = {
            data: Array.isArray(data) ? data : [],
            totalRecords: data.length || 0,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil((data.length || 0) / pageSize) || 1,
        };

        return result;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đặt phòng:', error.message);
        throw error; // Throw error to handle in component
    }
}