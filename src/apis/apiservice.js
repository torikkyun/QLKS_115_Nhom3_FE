export async function getService() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token không tồn tại');
        }

        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/DichVu`;
        console.log('Gọi API:', apiUrl);
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Trạng thái phản hồi:', response.status);
        if (!response.ok) {
            let errorMessage = `Lỗi HTTP! Trạng thái: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
                console.error('Không thể phân tích phản hồi lỗi:', jsonError);
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Dữ liệu API:', data);
        return data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách dịch vụ:', error.message);
        return { data: [] };
    }
}

export async function addService(service) {
    try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/DichVu`;
        console.log('Gửi yêu cầu POST đến:', apiUrl, 'với payload:', service);
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(service),
        });

        console.log('Trạng thái phản hồi:', response.status);
        if (!response.ok) {
            let errorMessage = `Lỗi HTTP! Trạng thái: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
                console.error('Không thể phân tích phản hồi lỗi:', jsonError);
            }
            throw new Error(errorMessage);
        }

        const text = await response.text();
        console.log('Nội dung phản hồi:', text);
        return text ? JSON.parse(text).data : null;
    } catch (error) {
        console.error('Lỗi khi thêm dịch vụ:', error.message);
        throw error;
    }
}

export async function updateService(service) {
    try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/DichVu/${service.maDichVu}`;
        console.log('Gửi yêu cầu PUT đến:', apiUrl, 'với payload:', service);
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(service),
        });

        console.log('Trạng thái phản hồi:', response.status);
        if (!response.ok) {
            let errorMessage = `Lỗi HTTP! Trạng thái: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
                console.error('Không thể phân tích phản hồi lỗi:', jsonError);
            }
            throw new Error(errorMessage);
        }

        const text = await response.text();
        console.log('Nội dung phản hồi:', text);
        return text ? JSON.parse(text).data : null;
    } catch (error) {
        console.error('Lỗi khi cập nhật dịch vụ:', error.message);
        throw error;
    }
}

export async function handleDeleteService(maDichVu) {
    try {
        if (!maDichVu) {
            throw new Error('Mã dịch vụ không hợp lệ');
        }
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/DichVu/${maDichVu}`;
        console.log('Gửi yêu cầu DELETE đến:', apiUrl);
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token không tồn tại');
        }

        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Trạng thái phản hồi:', response.status);
        if (!response.ok) {
            let errorMessage = `Lỗi HTTP! Trạng thái: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
                console.error('Không thể phân tích phản hồi lỗi:', jsonError);
            }
            throw new Error(errorMessage);
        }

        // API DELETE thường không trả về nội dung, nên chỉ kiểm tra trạng thái
        const text = await response.text();
        console.log('Nội dung phản hồi:', text || 'Rỗng');
        return true;
    } catch (error) {
        console.error('Lỗi khi xóa dịch vụ:', error.message);
        throw error;
    }
}