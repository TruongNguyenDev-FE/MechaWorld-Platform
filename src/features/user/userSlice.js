import { } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";

const initialUserState = {
    user: null,
    access_token: null,
    access_token_expires_at: null,
    shop: null,  // Thông tin shop
    sellerPlan: null, // Thông tin gói seller
};

export const userSlice = createAppSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
        updateUserProfile: (state, action) => {
            state.user = action.payload;
        },
        updateShopInfo: (state, action) => {
            state.shop = action.payload;
        },
        updateSellerPlan: (state, action) => {
            state.sellerPlan = action.payload;
        },
        // Action mới: Cập nhật số lượng sản phẩm đăng bán
        incrementListingsUsed: (state) => {
            if (state.sellerPlan) {
                state.sellerPlan.listings_used = (state.sellerPlan.listings_used || 0) + 1;
            }
        },
        // Action mới: Giảm số lượng sản phẩm đăng bán
        decrementListingsUsed: (state) => {
            if (state.sellerPlan && state.sellerPlan.listings_used > 0) {
                state.sellerPlan.listings_used = state.sellerPlan.listings_used - 1;
            }
        },
    },
});


// ✅ Xuất reducers
export const userReducer = userSlice.reducer;

// ✅ Xuất actions
export const { updateUserProfile, updateShopInfo, updateSellerPlan, incrementListingsUsed, decrementListingsUsed } = userSlice.actions;
