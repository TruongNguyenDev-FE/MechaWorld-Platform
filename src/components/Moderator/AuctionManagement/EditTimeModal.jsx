import { useState, useEffect } from 'react';
import { Modal, Button, Form, DatePicker, message } from "antd";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { UpdateAuctionTime } from "../../../apis/Moderator/APIModerator";

// Thêm plugins cho dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

const EditTimeModal = ({ 
  visible, 
  onClose, 
  auctionData,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && auctionData) {
      // Chuyển đổi thời gian từ UTC sang giờ Việt Nam trước khi hiển thị
      form.setFieldsValue({
        startTime: dayjs(auctionData.startTime).tz('Asia/Ho_Chi_Minh'),
        endTime: dayjs(auctionData.endTime).tz('Asia/Ho_Chi_Minh')
      });
    }
  }, [visible, auctionData]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Chuyển đổi thời gian từ giờ Việt Nam sang UTC trước khi gửi lên server
      await UpdateAuctionTime(auctionData.id, {
        start_time: values.startTime.tz('UTC').format('YYYY-MM-DDTHH:mm:ssZ'),
        end_time: values.endTime.tz('UTC').format('YYYY-MM-DDTHH:mm:ssZ')
      });
      
      message.success("Cập nhật thời gian thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      message.error("Lỗi khi cập nhật thời gian!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa thời gian đấu giá"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="update"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          Cập nhật
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="startTime"
          label="Thời gian bắt đầu (Giờ Việt Nam)"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
        >
          <DatePicker 
            showTime 
            format="DD/MM/YYYY HH:mm" 
            style={{ width: '100%' }} 
          />
        </Form.Item>
        <Form.Item
          name="endTime"
          label="Thời gian kết thúc (Giờ Việt Nam)"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc' }]}
        >
          <DatePicker 
            showTime 
            format="DD/MM/YYYY HH:mm" 
            style={{ width: '100%' }} 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTimeModal;