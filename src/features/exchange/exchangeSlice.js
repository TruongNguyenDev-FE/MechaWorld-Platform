import { createAppSlice } from "../../app/createAppSlice";

const initialState = {
  exchangeDetail: null,
  deliveryFees: {} // Đây phải là object rỗng
};

export const exchangeSlice = createAppSlice({
  name: 'exchange',
  initialState,
  reducers: {
    updateExchangeData: (state, action) => {
      state.exchangeDetail = action.payload;
    },
    // updateDeliveryFee: (state, action) => {
    //   const { userID, exchange_id, deliveryFee } = action.payload;

    //   // Khởi tạo object nếu cần
    //   if (!state.deliveryFees) {
    //     state.deliveryFees = {};
    //   }

    //   if (!state.deliveryFees[userID]) {
    //     state.deliveryFees[userID] = {};
    //   }

    //   state.deliveryFees[userID][exchange_id] = deliveryFee;
    // },
    updateDeliveryFee: (state, action) => {
      const { userID, exchange_id, ...deliveryFee } = action.payload;
    
      if (!state.deliveryFees) state.deliveryFees = {};
      if (!state.deliveryFees[userID]) state.deliveryFees[userID] = {};
    
      state.deliveryFees[userID][exchange_id] = deliveryFee;
    },
    restoreDeliveryFeesFromLocalStorage: (state, action) => {
      state.deliveryFees = action.payload || {};
    },
    
  }
});

export const { updateExchangeData, updateDeliveryFee,restoreDeliveryFeesFromLocalStorage  } = exchangeSlice.actions;
export default exchangeSlice.reducer;
