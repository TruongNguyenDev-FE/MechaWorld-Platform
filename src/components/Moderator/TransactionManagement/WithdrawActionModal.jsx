import { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const WithdrawActionModal = ({ 
  visible, 
  onCancel, 
  onComplete, 
  onReject, 
  currentRecord 
}) => {
  const [form] = Form.useForm();
  const [actionType, setActionType] = useState(null);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (actionType === 'complete') {
        onComplete(currentRecord.id, values.transactionReference);
      } else if (actionType === 'reject') {
        onReject(currentRecord.id, values.reason);
      }
      form.resetFields();
      onCancel();
    });
  };

  return (
    <Modal
      visible={visible}
      title={actionType === 'complete' ? 'Chấp nhận yêu cầu' : 'Từ chối yêu cầu'}
      onCancel={onCancel}
      onOk={handleSubmit}
      cancelText="Hủy"
      okText="Xác nhận"
      okButtonProps={{
      style: {
        color: '#1890ff', // Màu chữ xanh
        borderColor: '#1890ff', // Màu viền xanh
      }
  }}
    >
      <div style={{ marginBottom: 16 }}>
        <Button 
          type={actionType === 'complete' ? 'primary' : 'default'} 
          onClick={() => setActionType('complete')}
          style={{ marginRight: 8 }}
          className='text-[#1890ff] border-[#1890ff] hover:bg-blue-50'
        >
          Chấp nhận
        </Button>
        <Button 
          type={actionType === 'reject' ? 'primary' : 'default'} 
          onClick={() => setActionType('reject')}
          danger
        >
          Từ chối
        </Button>
      </div>

      <Form form={form} layout="vertical">
        {actionType === 'complete' && (
          <Form.Item
            name="transactionReference"
            label="Mã giao dịch"
            rules={[{ required: true, message: 'Vui lòng nhập mã giao dịch' }]}
          >
            <Input placeholder="Nhập mã giao dịch ngân hàng" />
          </Form.Item>
        )}

        {actionType === 'reject' && (
          <Form.Item
            name="reason"
            label="Lý do từ chối"
            rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
          >
            <Input.TextArea placeholder="Nhập lý do từ chối yêu cầu" rows={4} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default WithdrawActionModal;