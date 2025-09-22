import { useState, useEffect } from 'react';
import { Modal, Descriptions, Typography, Spin } from 'antd';
import { formatPrice, formatDate } from './withdrawalColumns';
import { getUser } from '../../../apis/User/APIUser';

const { Text } = Typography;

const WithdrawalDetailModal = ({ visible, onCancel, withdrawalData }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (withdrawalData?.user_id) {
                try {
                    setLoading(true);
                    const response = await getUser(withdrawalData.user_id);
                    setUserInfo(response.data);
                } catch (error) {
                    console.error('Lỗi khi lấy thông tin người dùng:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (visible) {
            fetchUserData();
        } else {
            // Reset khi đóng modal
            setUserInfo(null);
        }
    }, [visible, withdrawalData?.user_id]);

    return (
        <Modal
            title={`Chi tiết yêu cầu #${withdrawalData?.id?.slice(0, 8)}`}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={700}
            destroyOnClose
        >
            <Spin spinning={loading}>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Người dùng" span={2}>
                        {userInfo ? (
                            <div>
                                <Text strong>{userInfo.name}</Text>
                                <br />
                                <Text type="secondary">ID: {userInfo.full_name}</Text>
                                <br />
                                <Text type="secondary">Email: {userInfo.email || 'N/A'}</Text>
                                <br />
                                <Text type="secondary">SĐT: {userInfo.phone_number || 'N/A'}</Text>
                            </div>
                        ) : (
                            <Text>Đang tải thông tin...</Text>
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Số tiền">
                        <Text type="danger">{formatPrice(withdrawalData?.amount)}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Trạng thái">
                        {withdrawalData?.status === 'completed'
                            ? 'Đã hoàn tiền'
                            : withdrawalData?.status === 'rejected'
                            ? 'Từ chối'
                            : withdrawalData?.status === 'pending'
                            ? 'Chờ xử lý'
                            : withdrawalData?.status}
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngân hàng" span={2}>
                        {withdrawalData?.bank_account?.bank_name} 
                        ({withdrawalData?.bank_account?.bank_short_name})
                    </Descriptions.Item>

                    <Descriptions.Item label="Số tài khoản">
                        {withdrawalData?.bank_account?.account_number}
                    </Descriptions.Item>

                    <Descriptions.Item label="Tên tài khoản">
                        {withdrawalData?.bank_account?.account_name}
                    </Descriptions.Item>

                    <Descriptions.Item label="Thời gian tạo">
                        {formatDate(withdrawalData?.created_at)}
                    </Descriptions.Item>

                    {withdrawalData?.processed_at && (
                        <Descriptions.Item label="Thời gian xử lý">
                            {formatDate(withdrawalData?.processed_at)}
                        </Descriptions.Item>
                    )}
                </Descriptions>
            </Spin>
        </Modal>
    );
};

export default WithdrawalDetailModal;