// import axios from '../../utils/axios-custome';
import axios from 'axios';
const token = import.meta.env.VITE_GHN_TOKEN_API;
const shopId = import.meta.env.VITE_GHN_SHOP_ID;


export const checkDeliveryFee = (deliveryData) => {
    return axios.post(`https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,{
        service_type_id:deliveryData.service_type_id,
        from_district_id:deliveryData.from_district_id,
        from_ward_code: deliveryData.from_ward_code,
        to_district_id:deliveryData.to_district_id,
        to_ward_code:deliveryData.to_ward_code,
        length:deliveryData.length,
        width:deliveryData.width,
        height:deliveryData.height,
        weight:deliveryData.weight,
        insurance_value:deliveryData.insurance_value,
        coupon:deliveryData.coupon
    },{
        headers: {
            Token: token,
            ShopId: shopId
        }
    })
}
export const checkTimeDeliver = (deliveryData) => {
    return axios.post(`https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime`,{
        from_district_id:deliveryData.from_district_id,
        from_ward_code: deliveryData.from_ward_code,
        to_district_id:deliveryData.to_district_id,
        to_ward_code:deliveryData.to_ward_code,
        service_id:deliveryData.service_id,
    },{
        headers: {
            token: token,
            ShopId: shopId,
            "Content-Type": "application/json"
        }
    })
}


export const checkDeliverySatus = (orderId) => {
    return axios.post(`https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail`,{
        order_code: orderId
    },{
        headers: {
            token: token,
            "Content-Type": "application/json"
        }
    })
}