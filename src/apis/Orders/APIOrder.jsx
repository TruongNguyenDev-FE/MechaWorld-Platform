import axios from '../../utils/axios-custome';


// ************ GET - POST - PUT - PATCH - DELETE **************


// 1. List all orders of a member with optional filtering by order status
export const GetListOrderHistory = () => {
  return axios.get(`/orders`);
}

// 2. Create a new order for purchasing Gundam models
export const CheckoutCart = (checkoutData) => {
  return axios.post('/orders', {
    buyer_address_id: checkoutData.buyer_address_id,
    delivery_fee: checkoutData.delivery_fee,
    expected_delivery_time: checkoutData.expected_delivery_time,
    gundam_ids: checkoutData.gundam_ids,
    items_subtotal: checkoutData.items_subtotal,
    payment_method: checkoutData.payment_method,
    seller_id: checkoutData.seller_id,
    total_amount: checkoutData.total_amount,
    note: checkoutData.note || ''
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 3. Get details of a specific order for a member
export const GetOrderDetail = (id) => {
  return axios.get(`/orders/${id}`)
}

// 4. Allows the buyer to cancel a regular order that is only in pending. (Cancel Order)


// 5. Confirm that the receiver has received the order. (Confirm Order)
export const ConfirmOrderDelivered = (orderId) => {
  return axios.patch(`/orders/${orderId}/complete`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
}

// 6. Upload package images, create a delivery order, and update order status for a specified order.
export const PackagingOrder = (orderId, packagingData) => {
  return axios.patch(`/orders/${orderId}/package`, packagingData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
 



