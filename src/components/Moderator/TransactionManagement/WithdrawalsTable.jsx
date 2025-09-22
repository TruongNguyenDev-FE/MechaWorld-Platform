import { useState, useEffect } from 'react';
import { Table, Card, Button, Typography, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { GetWithdrawalRequests, CompleteWithdrawalRequest, RejectWithdrawalRequest } from '../../../apis/Moderator/APIModerator';
import WithdrawActionModal from './WithdrawActionModal';
import { getWithdrawalColumns } from './withdrawalColumns';
import WithdrawalDetailModal from './WithdrawalDetailModal';

const { Text } = Typography;

const WithdrawalsTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    
    const fetchWithdrawalRequests = async () => {
        try {
            setLoading(true);
            const response = await GetWithdrawalRequests();
            setData(response.data || []);
        } catch (error) {
            message.error('Không thể tải danh sách yêu cầu rút tiền');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (id, reason) => {
        try {
            setLoading(true);
            await RejectWithdrawalRequest(id, reason);
            message.success('Từ chối yêu cầu thành công');
            fetchWithdrawalRequests();
        } catch (error) {
            message.error(`Từ chối thất bại: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (id, transactionReference) => {
        try {
            setLoading(true);
            await CompleteWithdrawalRequest(id, transactionReference);
            message.success('Chấp thuận yêu cầu thành công');
            fetchWithdrawalRequests();
        } catch (error) {
            message.error(`Chấp thuận thất bại: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleProcessRequest = (record) => {
        setCurrentRecord(record);
        setModalVisible(true);
    };

    const handleViewDetails = (record) => {
        setSelectedWithdrawal(record);
        setIsDetailModalVisible(true);
        console.log('Viewing details for:', record);
    };

    useEffect(() => {
        fetchWithdrawalRequests();
    }, []);

    return (
        <>
            <Card
                title="Danh sách yêu cầu rút tiền"
                extra={
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchWithdrawalRequests}
                        loading={loading}
                    >
                        Làm mới
                    </Button>
                }
            >
                <Table
                    columns={getWithdrawalColumns(handleViewDetails, handleProcessRequest)}
                    dataSource={data}
                    loading={loading}
                    rowKey="id"
                    scroll={{ x: 1500 }}
                />
            </Card>

            <WithdrawActionModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onComplete={handleComplete}
                onReject={handleReject}
                currentRecord={currentRecord}
            />

            <WithdrawalDetailModal
                visible={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                withdrawalData={selectedWithdrawal}
            />
        </>
    );
};

export default WithdrawalsTable;