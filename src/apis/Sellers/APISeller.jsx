import axios from '../../utils/axios-custome';


// ************ GET - POST - PUT - PATCH - DELETE **************

// 1. Get all sales orders that belong to the specified seller ID
export const GetOrder = (orderId) => {
    return axios.get(`/sellers/${orderId}/orders`, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });
}

// 2. Get details of a specific sales order for the seller (excluding exchange order)


// 3. Confirm an order for the specified seller.
export const ConfirmOrder = (sellerId, orderId) => {
    return axios.patch(`/sellers/${sellerId}/orders/${orderId}/confirm`, {}, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });
}

// 4. Get the current active subscription details for the specified seller
export const GetSellerStatus = (id) => {
    return axios.get(`/sellers/${id}/subscriptions/active`);
}

// 5. Publish a gundam for sale for the specified seller.
export const SellingGundam = (id, gundamId) => {
    return axios.patch(`/sellers/${id}/gundams/${gundamId}/publish`);
}

// 6. Unpublish a gundam for the specified seller. 
export const RestoreGundam = (id, gundamId) => {
    return axios.patch(`/sellers/${id}/gundams/${gundamId}/unpublish`);
}

// 7. Cancel a pending order by the seller
export const CancelPendingOrder = (seller_id, order_id, reason) => {
    return axios.patch(`/sellers/${seller_id}/orders/${order_id}/cancel`, {
        reason: reason,
    })
}

// 8. Upgrade seller's subscription to a higher tier plan.


// 9. Get a list of all available subscription plans.

