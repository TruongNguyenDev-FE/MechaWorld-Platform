import axios from '../../utils/axios-custome';

export const GetAdminDashboard = () => {
    return axios.get(`/admin/dashboard`);
}