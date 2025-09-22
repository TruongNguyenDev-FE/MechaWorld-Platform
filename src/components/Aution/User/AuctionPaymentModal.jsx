import React from 'react';
import { Modal, Form, Input, Radio, Divider, Button } from 'antd';
import { InfoCircleOutlined, ShopOutlined, EnvironmentOutlined, CreditCardOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Title, Caption } from '../Design';

const AuctionPaymentModal = ({
  visible,
  onCancel,
  onOk,
  confirmLoading,
  auctionDetail,
  winnerInfo,
  userAddresses,
  selectedAddress,
  setSelectedAddress,
  shippingFee,
  navigate
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <CreditCardOutlined className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 m-0">Thanh toán đấu giá</h2>
            <p className="text-sm text-gray-500 m-0">Hoàn tất thanh toán để nhận sản phẩm</p>
          </div>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={confirmLoading}
      width={900}
      className="auction-payment-modal"
      footer={[
        <Button key="cancel" size="large" onClick={onCancel}>
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          size="large"
          loading={confirmLoading}
          onClick={onOk}
          className="bg-gradient-to-r from-green-400 to-blue-500 border-0 hover:from-green-500 hover:to-blue-600"
        >
          Xác nhận thanh toán
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Thông tin sản phẩm */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <ShopOutlined className="text-blue-600" />
                <h3 className="font-bold text-gray-800 text-lg m-0">Thông tin sản phẩm</h3>
              </div>

              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={auctionDetail?.auction?.gundam_snapshot?.image_url}
                    alt={auctionDetail?.auction?.gundam_snapshot?.name}
                    className="w-24 h-24 object-cover rounded-xl shadow-md border-2 border-white"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-2 leading-tight">
                    {auctionDetail?.auction?.gundam_snapshot?.name}
                  </h4>
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-3 border border-green-200">
                    <p className="text-sm text-green-700 font-medium mb-1">Giá thắng đấu giá</p>
                    <p className="text-xl font-bold text-green-800">
                      {winnerInfo?.finalPrice?.toLocaleString()} VNĐ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Địa chỉ nhận hàng */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-center gap-2 mb-4">
                <EnvironmentOutlined className="text-orange-600" />
                <h3 className="font-bold text-gray-800 text-lg m-0">Địa chỉ nhận hàng</h3>
              </div>

              {userAddresses.length > 0 ? (
                <Radio.Group
                  value={selectedAddress?.id}
                  onChange={(e) => {
                    const addr = userAddresses.find(a => a.id === e.target.value);
                    setSelectedAddress(addr);
                  }}
                  className="w-full"
                >
                  <div className="space-y-3">
                    {userAddresses.map(address => (
                      <Radio key={address.id} value={address.id} className="w-full">
                        <div className={`
                          p-4 rounded-xl ml-2 transition-all duration-200 cursor-pointer
                          ${selectedAddress?.id === address.id
                            ? 'border-2 border-orange-400 bg-white shadow-md transform scale-[1.02]'
                            : 'border border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm'
                          }
                        `}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-800">{address.full_name}</p>
                                <span className="text-sm text-gray-500">({address.phone_number})</span>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {address.detail}, {address.ward_name}, {address.district_name}, {address.province_name}
                              </p>
                            </div>
                            {address.is_primary && (
                              <span className="text-xs bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-3 py-1 rounded-full font-medium border border-orange-200">
                                Mặc định
                              </span>
                            )}
                          </div>
                        </div>
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>
              ) : (
                <div className="text-center py-8 bg-white rounded-xl border-2 border-dashed border-gray-200">
                  <EnvironmentOutlined className="text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-500 mb-3">Bạn chưa có địa chỉ nào</p>
                  <p className="text-sm text-gray-400">Vui lòng thêm địa chỉ để tiếp tục</p>
                </div>
              )}

              <Button
                type="dashed"
                className="mt-4 w-full h-12 border-2 border-dashed border-orange-300 hover:border-orange-400 hover:bg-orange-50"
                onClick={() => navigate('/member/profile/address-setting')}
                icon={<PlusOutlined />}
              >
                <span className="font-medium text-orange-600">Thêm địa chỉ mới</span>
              </Button>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center gap-2 mb-6">
                <CreditCardOutlined className="text-purple-600" />
                <h3 className="font-bold text-gray-800 text-lg m-0">Chi tiết thanh toán</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Giá thắng đấu giá:</span>
                  <span className="font-semibold text-gray-800">{winnerInfo?.finalPrice?.toLocaleString()} VNĐ</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-semibold text-gray-800">
                    {shippingFee?.toLocaleString()} VNĐ
                  </span>
                </div>

                <Divider className="my-4 border-purple-200" />

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Tổng thanh toán:</span>
                    <span className="text-2xl font-bold text-purple-700">
                      {((winnerInfo?.finalPrice || 0) + (shippingFee || 0)).toLocaleString()} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Form.Item label={<span className="font-semibold text-gray-700">Ghi chú cho người bán</span>} name="note">
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập ghi chú đặc biệt cho người bán (nếu có)..."
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <InfoCircleOutlined className="text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-amber-800 mb-1">Lưu ý quan trọng</p>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Sau khi xác nhận thanh toán, người bán sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận đơn hàng và thời gian giao hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AuctionPaymentModal;