/* eslint-disable react-refresh/only-export-components */
import axios from '../../utils/axios-custome';
import Cookies from 'js-cookie';

// ************ GET - POST - PUT - PATCH - DELETE **************

// 1. Get all gundams that belong to the specified user ID
export const GetGundamByID = (id, gundamName) => {
    return axios.get(`/users/${id}/gundams?name=${gundamName}`)
}

// 2. Create a new Gundam model with images and accessories (Create Gundam model)
export const PostGundam = (id, gundamData) => {
    const accessToken = Cookies.get('access_token');
    return axios.post(`/users/${id}/gundams`, gundamData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${accessToken}`
        },
    });
}

// 3. Upgrade the user's role to seller and create the trial subscription (Become Seller)
export const BecomeSeller = () => {
    return axios.post('/users/become-seller');
}

// 4. Get user details using a phone_number number as a query parameter (Get user by Phone)
export const GetUserByPhone = (phone) => {
    return axios.get(`/users/by-phone?phone_number=${phone}`)
}


// 5. Get detailed information about a specific user (Get user by Id)
export const getUser = (id) => {
    return axios.get(`/users/${id}`)
}

// 6. Update specific user details by user ID (Update user's info)
export const updateUserData = (id, fullname) => {
    return axios.put(`/users/${id}`, { full_name: fullname })
}

// 7. Get all addresses for a specific user
export const getUserAddresses = (id) => {
    return axios.get(`/users/${id}/addresses`)
}

// 8. Add a new address for a specific user
export const postUserAddresses = (id, addressData) => {
    return axios.post(`/users/${id}/addresses`, addressData)
}

// 9. Get the pickup address of a specific user (Get Pickup addresss)


// 10. Update an existing address information for a specific user (Update user address)
export const updateAddress = (id, addressId, addressData) => {
    return axios.put(`/users/${id}/addresses/${addressId}`, addressData)
}

// 11. Delete an address of a user (Delete user address)
export const deleteAddress = (id, addressID) => {
    return axios.delete(`/users/${id}/addresses/${addressID}`)
}

// 12. Upload and update a user's profile avatar (Upload user avatar)
export const uploadAvatar = (id, file) => {
    const formData = new FormData();
    formData.append("avatar", file); // Đính kèm file vào FormData

    return axios.patch(`/users/${id}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

// GET Check user wallet amount
export const checkWallet = (id) => {
    return axios.get(`/users/${id}/wallet`)
}


export const getUserAuctionParticipation = () => {
    return axios.get(`/users/me/auctions`)
}

export const getUserAuctionBids = (id) => {
    return axios.get(`/users/me/auctions/:auctionID/bids?auctionID=${id}`)
}