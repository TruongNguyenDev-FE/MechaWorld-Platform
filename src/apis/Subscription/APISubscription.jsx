import axios from '../../utils/axios-custome';
import Cookies from 'js-cookie';

// ************ SUBSCRIPTION RELATED APIs **************

// GET LIST ALL SUBSCRIPTION PLANS
export const GetSubscriptionPlans = () => {
    return axios.get('/subscription-plans', {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });
}

/**
 * Nâng cấp gói đăng ký
 * @param {string} sellerId - ID người bán
 * @param {number} planId - ID gói đăng ký mới
 * @returns {Promise} Promise từ axios
 */
export const upgradeSubscription = (sellerId, planId) => {
  const accessToken = Cookies.get('access_token');
  return axios.post(
    `/sellers/${sellerId}/subscriptions/upgrade`,
    { plan_id: planId },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
    }
  );
};

// GET SELLER CURRENT ACTIVE SUBSCRIPTION
export const GetSellerActiveSubscription = (sellerId) => {
    return axios.get(`/sellers/${sellerId}/subscriptions/active`, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });
}

