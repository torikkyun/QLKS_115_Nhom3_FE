export async function fetchPromotions(page = 1, pageSize = 10) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/KhuyenMai?page=${page}&pageSize=${pageSize}`, {
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
    console.log('Raw API Response (fetchPromotions):', data);
    return {
      data: data.data || [],
      totalRecords: data.totalRecords || data.data?.length || 0,
      page: data.page || page,
      pageSize: data.pageSize || pageSize,
      totalPages: data.totalPages || Math.ceil((data.totalRecords || data.data?.length || 0) / (data.pageSize || pageSize)) || 1,
    };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khuyến mãi:', error.message);
    throw error;
  }
}

export async function getPromotionById(id) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/KhuyenMai/${id}`, {
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
    return data;
  } catch (error) {
    console.error(`Lỗi khi lấy khuyến mãi với ID ${id}:`, error.message);
    throw error;
  }
}

export async function fetchPromotionTypes() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/KhuyenMai`, {
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
    return data.data || [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách kiểu khuyến mãi:', error.message);
    throw error;
  }
}

export async function createPromotion(promotion) {
  try {
    if (
      !promotion.tenKhuyenMai ||
      !promotion.moTaKhuyenMai ||
      !promotion.ngayBatDau ||
      !promotion.ngayKetThuc ||
      promotion.giaTriKhuyenMai === undefined ||
      promotion.kieuKhuyenMai === undefined
    ) {
      throw new Error('Thiếu các trường bắt buộc!');
    }

    const kieuKhuyenMaiByte = parseInt(promotion.kieuKhuyenMai);
    if (isNaN(kieuKhuyenMaiByte) || kieuKhuyenMaiByte < 0 || kieuKhuyenMaiByte > 255) {
      throw new Error('kieuKhuyenMai phải là số từ 0 đến 255!');
    }

    const payload = {
      model: "KhuyenMai",
      tenKhuyenMai: promotion.tenKhuyenMai,
      moTaKhuyenMai: promotion.moTaKhuyenMai,
      ngayBatDau: promotion.ngayBatDau,
      ngayKetThuc: promotion.ngayKetThuc,
      kieuKhuyenMai: kieuKhuyenMaiByte,
      giaTriKhuyenMai: parseFloat(promotion.giaTriKhuyenMai),
      ghiChu: promotion.ghiChu || '',
    };

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/KhuyenMai`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Nếu có lỗi, cố gắng parse JSON, nếu không được thì trả về lỗi mặc định
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch { }
      throw new Error(errorMessage);
    }

    // Xử lý trường hợp response không có body hoặc không phải JSON
    const text = await response.text();
    if (!text) return {}; // hoặc return { success: true }
    try {
      return JSON.parse(text);
    } catch {
      return {}; // hoặc throw new Error('Phản hồi API không hợp lệ!');
    }
  } catch (error) {
    console.error('Lỗi khi tạo khuyến mãi:', error.message);
    throw error;
  }
}

export async function updatePromotion(id, promotion) {
  try {
    const payload = {
      tenKhuyenMai: promotion.tenKhuyenMai,
      moTaKhuyenMai: promotion.moTaKhuyenMai,
      ngayBatDau: promotion.ngayBatDau,
      ngayKetThuc: promotion.ngayKetThuc,
      kieuKhuyenMai: parseInt(promotion.kieuKhuyenMai),
      giaTriKhuyenMai: parseFloat(promotion.giaTriKhuyenMai),
      ghiChu: promotion.ghiChu,
    };

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/KhuyenMai/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch { }
      throw new Error(errorMessage);
    }

    const text = await response.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  } catch (error) {
    console.error(`Lỗi khi cập nhật khuyến mãi với ID ${id}:`, error.message);
    throw error;
  }
}

export async function deletePromotion(id) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/KhuyenMai/${id}`, {
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
    console.error(`Lỗi khi xóa khuyến mãi với ID ${id}:`, error.message);
    throw error;
  }
}