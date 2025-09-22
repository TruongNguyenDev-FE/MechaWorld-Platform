import axios from '../../utils/axios-custome';


// ************ GET - POST - PUT - PATCH - DELETE **************


// 1. Get detailed information about a specific seller
export const GetShopInfoById = (id) => {
    return axios.get(`seller/profile?user_id=${id}`)
}



// 2. Creates a new seller profile
export const CreateShop = (shopName, userId) => {
    return axios.post('/seller/profile', {
        shop_name: shopName,
        user_id: userId
    });
  }


// 3. Update the seller's profile information (ShopName)
export const UpdateShopName = (shop_name, id) => {
    return axios.patch(`seller/profile`, {
        shop_name: shop_name,
        user_id: id,
    })
}

export const SellerDashboard = (sellerID) => {
    return axios.get(`/sellers/${sellerID}/dashboard`)
}