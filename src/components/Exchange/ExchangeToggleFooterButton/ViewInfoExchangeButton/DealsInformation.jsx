import { Card, Tag, Typography, Alert, Space, Statistic, Divider } from 'antd';
import {
  WalletOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const DealsInformation = ({ exchangeDetails, self, theOther }) => {
  if (!exchangeDetails) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Alert
          message="Đang tải thông tin..."
          type="info"
          showIcon
          className="w-full"
        />
      </div>
    );
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '0 đ';
    return Number(value).toLocaleString('vi-VN') + ' đ';
  };

  const hasCompensation = exchangeDetails.compensation_amount > 0;
  const isCurrentUserPaying = exchangeDetails.payer_id === self?.id;

  return (
    <div className="h-full flex flex-col p-4">
      {/* Title */}
      <div className="mb-4">
        <Title level={4} className="m-0">
          <WalletOutlined className="mr-2" />
          Thông tin giao dịch
        </Title>
      </div>

      {/* Compensation Amount Card */}
      {hasCompensation ? (
        <Card
          className={`mb-4 border-2 ${isCurrentUserPaying ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
            }`}
        >
          <Statistic
            title="Số tiền bù trừ"
            value={formatCurrency(exchangeDetails.compensation_amount)}
            valueStyle={{
              color: isCurrentUserPaying ? '#cf1322' : '#3f8600',
              fontSize: '24px'
            }}
            prefix={<DollarOutlined />}
          />
          <Divider className="my-3" />
          <div className="text-center">
            {isCurrentUserPaying ? (
              <Tag color="red" className="px-4 py-1">
                <ArrowDownOutlined /> Bạn bù tiền cho {theOther?.full_name}
              </Tag>
            ) : (
              <Tag color="green" className="px-4 py-1">
                <ArrowUpOutlined /> {theOther?.full_name} bù tiền cho bạn
              </Tag>
            )}
          </div>
        </Card>
      ) : (
        <Card className="mb-4 bg-blue-50 border-blue-200">
          <div className="text-center">
            <CheckCircleOutlined className="text-3xl text-blue-600 mb-2" />
            <Title level={5}>Không có tiền bù trừ</Title>
            <Text type="secondary">Giao dịch cân bằng</Text>
          </div>
        </Card>
      )}

      {/* Important Notes */}
      <div className="flex-1 overflow-y-auto">
        <Space direction="vertical" size="small" className="w-full">
          <Alert
            message="Lưu ý thông tin sau:"
            type="warning"
            description={
              <>
                <ul className="list-disc">
                  <li>
                    Số tiền cọc này sẽ phải đảm bảo được HOÀN TOÀN thiệt hại nếu có
                    tình huống ngoài mong muốn xảy ra với truyện của bạn trong quá
                    trình thực hiện trao đổi.
                  </li>
                  <li className='mt-2'>
                    Tiền cọc chỉ được đưa ra từ đầu ngay trước khi bắt đầu trao đổi.
                    Mức cọc KHÔNG THỂ thay đổi từ khi quá trình trao đổi bắt đầu diễn
                    ra cho đến khi kết thúc.
                  </li>
                  <li className='mt-2'>
                    Số tiền bù sẽ được chuyển cho người nhận tiền bù chỉ khi quá trình
                    trao đổi hoàn tất mà không có sự cố nào.
                  </li>
                  <li className="font-semibold mt-2">
                    MechaWorld sẽ KHÔNG chịu trách nhiệm cho những sự cố xảy ra vì tiền
                    cọc không đảm bảo.
                  </li>
                </ul>
              </>
            }
            showIcon
            className="mb-2"
          />
          {/* 
          <Alert
            message="Quy định thanh toán"
            description="Không thể thay đổi sau khi bắt đầu"
            type="warning"
            showIcon
            className="mb-2"
          />

          <Alert
            message="Hoàn tiền"
            description="Chỉ hoàn trả khi giao dịch thành công"
            type="success"
            showIcon
            className="mb-2"
          /> */}
        </Space>
      </div>
    </div>
  );
};

export default DealsInformation;