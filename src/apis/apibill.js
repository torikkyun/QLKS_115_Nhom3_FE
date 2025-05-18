
export async function getBill() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token không tồn tại');
      }
  
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/HoaDon`;
      console.log('Calling API:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('API Data:', data);
      return data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hóa đơn:', error.message);
      return { data: [] };
    }
  }
  
  export async function addBill(bill) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/HoaDon/ThanhToan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bill),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Lỗi khi thanh toán hóa đơn:', error.message);
      throw error;
    }
  }
