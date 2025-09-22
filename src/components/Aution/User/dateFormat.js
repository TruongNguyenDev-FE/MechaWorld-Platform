/**
 * Format thời gian giao hàng dự kiến theo chuẩn API
 * @param {Date|string} date - Thời gian cần format
 * @returns {string} Thời gian đã format (YYYY-MM-DDTHH:mm:ss+07:00)
 */
export const formatDeliveryTime = (date) => {
  // Nếu không có date, mặc định là 3 ngày sau
  const dateObj = date ? new Date(date) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date:', date);
    return new Date().toISOString().split('.')[0] + formatTimezoneOffset(new Date()); // Fallback
  }

  // Lấy các thành phần thời gian
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${formatTimezoneOffset(dateObj)}`;
};


/**
 * Kiểm tra và chuyển đổi thời gian từ nhiều định dạng
 * @param {string} timeString - Chuỗi thời gian đầu vào
 * @returns {string} Thời gian đã format
 */
export const normalizeDeliveryTime = (timeString) => {
  if (!timeString) return formatDeliveryTime();
  
  // Xử lý các định dạng phổ biến
  if (timeString.includes('T') && timeString.includes('+')) {
    // Đã đúng định dạng ISO với timezone
    return timeString;
  }
  
  if (timeString.includes(' ')) {
    // Định dạng: "2025-05-28 01:26:21.179 +0700 +07"
    return timeString
      .replace(' ', 'T')
      .replace(/\.\d+/, '') // Bỏ mili giây
      .replace(/(\+\d{4}) \+\d{2}/, (match, p1) => {
        // Chuyển +0700 thành +07:00
        return p1.slice(0, 3) + ':' + p1.slice(3);
      });
  }
  
  // Fallback: dùng hàm format chính
  return formatDeliveryTime(timeString);
};

// Hàm format thời gian chuẩn ISO 8601 với timezone
export const formatToCustomTime = (date) => {
  if (!date) {
    const now = new Date();
    return now.toISOString().replace('Z', '') + formatTimezoneOffset(now);
  }

  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date:', date);
    return new Date().toISOString().replace('Z', '') + formatTimezoneOffset(new Date());
  }

  return dateObj.toISOString().replace('Z', '') + formatTimezoneOffset(dateObj);
};

// Hàm format timezone offset thành +07:00 hoặc -05:00
const formatTimezoneOffset = (date) => {
  const offset = -date.getTimezoneOffset(); // phút
  const sign = offset >= 0 ? '+' : '-';
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
  const minutes = String(Math.abs(offset) % 60).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
};


// Hàm hiển thị thời gian đẹp cho người dùng
export const formatDisplayTime = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid date';
  }
};