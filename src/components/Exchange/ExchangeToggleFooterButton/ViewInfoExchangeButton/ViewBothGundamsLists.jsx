import { Card, Tag, Row, Col, Typography, Empty, Space, Badge, Avatar } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ViewBothGundamsLists = ({ currentGundam, partnerGundam }) => {

  console.log("gundam", currentGundam)

  const GundamCard = ({ gundam, index, type }) => {
    // console.log("gundam", gundam)

    return (
      <>
        <Card
          className={`hover:shadow-lg transition-all duration-300 ${type === 'user' ? 'border-green-200 hover:border-blue-400' : 'border-orange-200 hover:border-orange-400'}`}
        >
          <Row gutter={16} align="middle">
            <Col span={6}>
              <div className="relative">
                <Badge >
                  <div className="h-24 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-2 flex items-center justify-center">
                    <img
                      src={gundam.image_url}
                      alt={gundam.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </Badge>
              </div>
            </Col>
            <Col span={18}>
              <div className="flex flex-col gap-2">
                <Title level={5} className="m-0 line-clamp-1">{gundam.name}</Title>
                <Typography.Text className='text-black'>{gundam.series}</Typography.Text>
                <Space wrap size="small">
                  <Tag
                    color={type === 'user' ? 'green' : 'orange'}
                    className="m-0"
                  >
                    {gundam.grade}
                  </Tag>
                  <Tag
                    color="blue"
                    className="m-0"
                  >
                    {gundam.scale}
                  </Tag>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>
      </>

    )
  }

  return (
    <div className="h-full flex flex-col p-4">
      {/* Gundam Lists - Vertical Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col gap-4">
          {/* Current User's List */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="text-white p-3 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar src={currentGundam?.avatar_url} />
                <Title level={5} className="m-0 text-white">Gundam trao đổi của bạn</Title>
              </div>
              <Tag color="blue-inverse" className="m-0">
                {currentGundam?.items?.length || 0} sản phẩm
              </Tag>
            </div>
            <div className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-b-lg p-3">
              {currentGundam?.items?.length > 0 ? (
                <Row gutter={[12, 12]}>
                  {currentGundam.items.map((gundam, index) => (
                    <Col span={24} key={gundam.id}>
                      <GundamCard gundam={gundam} index={index} type="user" />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty description="Không có Gundam" className="py-8" />
              )}
            </div>
          </div>

          {/* Center Exchange Indicator */}
          <div className="py-2">
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
              <div className="bg-blue-400 rounded-full p-3 shadow-lg">
                <SwapOutlined className="text-2xl text-white animate-pulse" />
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            </div>
          </div>

          {/* Partner's List */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="text-white p-3 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar src={partnerGundam?.avatar_url} />
                <Title level={5} className="m-0 text-white">Gundam trao đổi của đối tác</Title>
              </div>
              <Tag color="red-inverse" className="m-0">
                {partnerGundam?.items?.length || 0} sản phẩm
              </Tag>
            </div>
            <div className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-b-lg p-3">
              {partnerGundam?.items?.length > 0 ? (
                <Row gutter={[12, 12]}>
                  {partnerGundam.items.map((gundam, index) => (
                    <Col span={24} key={gundam.id}>
                      <GundamCard gundam={gundam} index={index} type="partner" />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty description="Không có Gundam" className="py-8" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBothGundamsLists;