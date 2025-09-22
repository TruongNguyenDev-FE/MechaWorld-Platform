import axios from '../../utils/axios-custome';
import Cookies from 'js-cookie';


// 1. List all open exchange posts.
export const viewExchangePost = () => {
    return axios.get('/exchange-posts')
}

export const getAllExchangePost = () => {
    return axios.get(`/exchange-posts`)
}

// 2. Retrieves a list of all exchanges that the authenticated user is participating in.
export const getAllExchangeParticipating = () => {
    return axios.get(`/exchanges`)
}

// 3. Retrieves detailed information about a specific exchange.
export const getExchangeDetail = (id) => {
    return axios.get(`/exchanges/${id}`)
}

// 4. Cancel an exchange transaction that is in pending or packaging status
export const cancelExchange = (exchangeID) => {
    return axios.patch(`/exchanges/${exchangeID}/cancel`)
}

// 5. Provides shipping addresses (from and to) for an exchange transaction. Both participants must provide their addresses before proceeding.
export const addressExchange = (exchangeID, firstID, secondID) => {
    return axios.put(`/exchanges/${exchangeID}/delivery-addresses`, {
        from_address_id: firstID, //địa chỉ gửi
        to_address_id: secondID,   // địa chỉ nhận
    })
}

// 6. Pays the delivery fee for an exchange transaction. When both parties have paid, the system creates two orders.
export const payDeliveryfee = (exchangeID, deliverryData) => {
    return axios.post(`/exchanges/${exchangeID}/pay-delivery-fee`, {
        delivery_fee: deliverryData.delivery_fee,
        expected_delivery_time: deliverryData.expected_delivery_time,
        note: deliverryData.note,
    })
}

// 7. Get a list of all exchange offers created by the authenticated user, including details about the exchange posts, items, and negotiation notes.
export const getAllExchangeOffer = () => {
    return axios.get(`/users/me/exchange-offers`)
}

// 8. Create a new exchange offer for trading multiple Gundams between users with optional compensation.
export const createExchangeOffer = (offerData) => {
    console.log('API function received:', offerData); 

    return axios.post('/users/me/exchange-offers', {
        compensation_amount: offerData.compensation_amount === 0 ? null : offerData.compensation_amount,
        exchange_post_id: offerData.exchange_post_id,
        offerer_gundam_ids: offerData.offerer_gundam_ids,  
        payer_id: offerData.payer_id,
        poster_gundam_ids: offerData.poster_gundam_ids,     
        note: offerData.note
    })
}

// 9. Retrieves detailed information about a specific exchange offer created by the authenticated user.


// 10. Delete an exchange offer created by the authenticated user.
export const rejectOffer = (id) => {
    return axios.delete(`/users/me/exchange-offers/${id}`)
}

// 11. As an offerer, update exchange offer details. Only allowed when a negotiation is requested by the post owner.
export const updateExchangeOffer = (offerID, offerData) => {
    return axios.patch(`/users/me/exchange-offers/${offerID}`,
        {
            compensation_amount: offerData.compensationAmount,
            note: offerData.note,
            payer_id: offerData.id,
            require_compensation: offerData.requireCompensation
        })
}

// 12. List all exchange posts created by the current authenticated user.
export const getAllUserExchangePost = (status) => {
    if (status === 'open' || status === 'closed') {
        return axios.get(`/users/me/exchange-posts?status=${status || 'open'}`)
    } else {
        return axios.get(`/users/me/exchange-posts`)
    }
}

// 13. Create a new exchange post.
export const createExchangePost = (postData) => {
    const accessToken = Cookies.get('access_token');
    return axios.post(`/users/me/exchange-posts`, postData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${accessToken}`
        },
    });
}

// 14. Deletes an exchange post and resets the status of associated gundams. Only the post owner can delete it.
export const deleteExchangePost = (id) => {
    return axios.delete(`/users/me/exchange-posts/${id}`)
}

// 15. Get detailed information about a specific exchange post owned by the authenticated user, including items and offers.


// 16. As a post owner, accept an exchange offer. This will create an exchange transaction and related orders.
export const acceptOffer = (postID, offerID) => {
    return axios.patch(`/users/me/exchange-posts/${postID}/offers/${offerID}/accept`)
}

// 17. As a post owner, request negotiation with an offerer.
export const requestNegotiation = (postId, offerId, note) => {
    return axios.patch(`/users/me/exchange-posts/${postId}/offers/${offerId}/negotiate`, { note: note })
}






