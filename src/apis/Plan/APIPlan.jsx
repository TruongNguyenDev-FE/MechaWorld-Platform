import axios from '../../utils/axios-custome';

export const GetPlan = () => {
    return axios.get('/subscription-plans');
}

export const UpgradePlan = (planId, userId) => {
    return axios.post(`/sellers/${userId}/subscriptions/upgrade`, {
        plan_id: planId
    });
}