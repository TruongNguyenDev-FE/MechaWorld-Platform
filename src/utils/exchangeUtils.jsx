import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../features/notification/firebase-config";
export const hasDeliveryFee = (state, userID, exchangeID) => {
  return !!state.exchange?.deliveryFees?.[userID]?.[exchangeID]?.deliveryFee?.total;
};
export const selectDeliveryFee = (state, userID, exchangeID) => {
  return state.exchange?.deliveryFees?.[userID]?.[exchangeID]?.deliveryFee?.total ?? null;
};

/**
 * Lưu DeliveryFee vào Firestore
 * @param {string} userID - ID của người dùng
 * @param {string} exchangeID - ID của giao dịch
 * @param {object} feeData - Dữ liệu phí giao hàng
 */
export const saveDeliveryFee = async (userID, exchangeID, feeData) => {
  try {
    // Lưu vào Firestore
    const docRef = doc(db, "deliveryFees", userID);
    await setDoc(
      docRef,
      {
        [exchangeID]: feeData,
      },
      { merge: true }
    );

    // Lưu vào localStorage với cùng cấu trúc
    // const localStorageKey = `${userID}_${exchangeID}_deliverFee`;
    // localStorage.setItem(localStorageKey, JSON.stringify(feeData));

    console.log("Phí giao hàng đã được lưu thành công.");
  } catch (error) {
    console.error("Lỗi khi lưu phí giao hàng:", error);
  }
};

/**
 * Lấy DeliveryFee từ Firestore
 * @param {string} userID - ID của người dùng
 * @param {string} exchangeID - ID của giao dịch
 * @returns {object|null} - Dữ liệu phí giao hàng hoặc null nếu không tìm thấy
 */
export const getDeliveryFee = async (userID, exchangeID) => {
  try {
    const docRef = doc(db, "deliveryFees", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data[exchangeID] || null;
    } else {
      console.log("Không tìm thấy tài liệu phí giao hàng.");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy phí giao hàng:", error);
    return null;
  }
};

/**
 * lưu DeliveryDate từ Firestore 
 * @param {string} userID - ID của người dùng
 * @param {string} exchangeID - ID của giao dịch
 * @param {object} dateData - Dữ liệu ngày giao hàng
 */

export const saveDeliveryDate = async (userID, exchangeID, dateData) => {
  try {
    // Lưu vào Firestore
    const docRef = doc(db, "deliveryDates", userID);
    await setDoc(
      docRef,
      {
        [exchangeID]: dateData,
      },
      { merge: true }
    );
    console.log('Thông tin giao hàng',dateData)
    // Lưu vào localStorage với cùng cấu trúc
    const localStorageKey = `${userID}_${exchangeID}_deliverDate`;
    localStorage.setItem(localStorageKey, JSON.stringify(dateData));

    console.log("Ngày giao hàng đã được lưu thành công.");
  } catch (error) {
    console.error("Lỗi khi lưu ngày giao hàng:", error);
  }
}
/**
 * Lấy DeliveryDate từ Firestore
 * @param {string} userID - ID của người dùng
 * @param {string} exchangeID - ID của giao dịch
 * @returns {object|null} - Dữ liệu ngày giao hàng hoặc null nếu không tìm thấy
 */
export const getDeliveryDate = async (userID, exchangeID) => {
  try {
    const docRef = doc(db, "deliveryDates", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data[exchangeID] || null;
    } else {
      console.log("Không tìm thấy tài liệu ngày giao hàng.");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy ngày giao hàng:", error);
    return null;
  }
}
