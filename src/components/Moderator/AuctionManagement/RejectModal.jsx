import {
  Input,
  Typography,
  Button,
  Modal,
} from "antd";
import {
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export default function RejectModal({
    visible,
    onClose,
    onConfirm,
    rejectReason,
    setRejectReason,
    loading
}) {
    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <CloseCircleOutlined className="text-red-500" />
                    <span>Từ chối yêu cầu đấu giá</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button
                    key="reject"
                    danger
                    onClick={onConfirm}
                    loading={loading}
                >
                    Xác nhận từ chối
                </Button>,
            ]}
        >
            <div className="space-y-4">
                <Text>Vui lòng nhập lý do từ chối yêu cầu đấu giá:</Text>
                <Input.TextArea
                    rows={4}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                />
            </div>
        </Modal>
    );
}