import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Avatar, Row, Col, Space, Typography } from 'antd';
import { EyeOutlined, SwapOutlined } from '@ant-design/icons';


import DealsInformation from './DealsInformation';
import ViewBothGundamsLists from './ViewBothGundamsLists';

const ExchangeInformation = ({
  firstUser,
  exchangeDetail,
  secondUser,
  firstGundamGroup,
  secondGundamGroup,
}) => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModal2Visible, setIsModal2Visible] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);


  const handleViewDetails = () => {
    setIsModalVisible(true);
    console.log("first gundam group", firstGundamGroup);
    console.log("second gundam group", secondGundamGroup);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const handleViewDetails2 = () => {
    setIsModal2Visible(true);
  };

  const handleCloseModal2 = () => {
    setIsModal2Visible(false);
    setIsCheckboxChecked(false);
  };

  if (['completed'].includes(exchangeDetail.status)) {
    return null;
  }

  return (
    <div className="exchange-information-container mb-3">
      <div className="flex justify-between items-center gap-[10%]">
        {['delivering', 'delivered'].includes(exchangeDetail.status) && (
          <Button
            type="danger"
            className="flex-3 bg-red-300 hover:bg-red-700 border-red-400 hover:text-white"
            style={{ flex: 3 }}
            onClick={handleViewDetails2}
          >
            Dừng Giao Dịch
          </Button>
        )}
        <Button
          type="primary"
          ghost
          icon={<EyeOutlined className='text-lg mt-[6px]' />}
          className='w-full'
          onClick={handleViewDetails}
        >
          Xem chi tiết trao đổi
        </Button>
      </div>
      <Modal
        title="Xác nhận dừng giao dịch"
        open={isModal2Visible}
        onCancel={handleCloseModal2}
        footer={null}
      >
        <h2>Lưu ý:</h2>
        <div className='flex '>
          <p> Nếu dừng trao đổi, bạn sẽ không thể tiếp tục thảo luận hay trò truyện với <Avatar src={secondUser.avatar_url} /><p className='font-bold'>{secondUser.full_name}</p>về cuộc trao đổi này.</p>
        </div>

        <p className='text-red-500 mt-2'> *Hành động này không thể hoàn tác.</p>
        <br />
        <div className="flex justify-end gap-2 mt-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="confirmStopExchange"
              onChange={(e) => setIsCheckboxChecked(e.target.checked)}
            />
            <label htmlFor="confirmStopExchange" className="text-sm">
              Tôi xác nhận muốn dừng giao dịch
            </label>
          </div>
          <Button type="primary" danger disabled={!isCheckboxChecked} onClick={handleCloseModal2}>
            Dừng trao đổi
          </Button>
          <Button onClick={handleCloseModal2} >Tiếp tục trao đổi</Button>
        </div>

      </Modal>


      {/* Modal Show Chi tiết Trao đổi */}
      <Modal
        title={
          <div className="flex items-center gap-3 py-2">
            <SwapOutlined className="text-2xl text-blue-600" />
            <span className="text-xl font-bold">Chi Tiết Giao Dịch Trao Đổi</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={1000}
        style={{ maxWidth: '1200px' }}
        styles={{ body: { height: 'calc(100vh - 200px)', padding: 0, overflow: 'hidden' } }}
        centered
      >
        <div className="h-full flex flex-col">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-400 to-red-400 text-white p-3 rounded-lg">
            <Row justify="space-between" align="middle">
              <Col span={10}>
                <Space className='flex justify-start'>
                  <Avatar size={48} src={firstUser?.avatar_url} />
                  <div>
                    <Typography.Text className="text-white font-semibold">{firstUser?.full_name}</Typography.Text>
                    <br />
                    <Typography.Text className="text-white/80 text-sm">Người trao đổi</Typography.Text>
                  </div>
                </Space>
              </Col>

              <Col span={4} style={{ textAlign: 'center' }}>
                <SwapOutlined className="text-3xl text-white animate-pulse" />
              </Col>

              <Col span={10}>
                <Space className='flex justify-end'>
                  <div className="text-right">
                    <Typography.Text className="text-white font-semibold">{secondUser?.full_name}</Typography.Text>
                    <br />
                    <Typography.Text className="text-white/80 text-sm">Đối tác</Typography.Text>
                  </div>
                  <Avatar size={48} src={secondUser?.avatar_url} />
                </Space>
              </Col>
            </Row>

          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <Row className="h-full">
              {/* Left Side - Gundam List */}
              <Col xs={24} md={14} className="h-full border-r">
                <ViewBothGundamsLists
                  currentGundam={firstUser}
                  partnerGundam={secondUser}
                />
              </Col>

              {/* Right Side - Deal Information */}
              <Col xs={24} md={10} className="h-full bg-white">
                <DealsInformation
                  exchangeDetails={exchangeDetail}
                  self={firstUser}
                  theOther={secondUser}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    </div>
  );
};

ExchangeInformation.propTypes = {
  firstCurrentStage: PropTypes.number,
  secondCurrentStage: PropTypes.number,
  exchangeData: PropTypes.object,
  firstUser: PropTypes.object,
  secondUser: PropTypes.object,
  firstGundamGroup: PropTypes.array,
  secondGundamGroup: PropTypes.array,
  exchangeDetail: PropTypes.object,
};

export default ExchangeInformation;