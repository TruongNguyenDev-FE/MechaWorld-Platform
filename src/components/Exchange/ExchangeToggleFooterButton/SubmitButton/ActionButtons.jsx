import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ArrowRightOutlined, CheckCircleOutlined, TruckOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Alert, notification, Typography } from 'antd';
import { CreditCardIcon, PackageCheck } from 'lucide-react';

import { checkDeliveryFee } from '../../../../apis/GHN/APIGHN';
import { checkWallet } from '../../../../apis/User/APIUser';
import { getDeliveryFee, saveDeliveryFee } from '../../../../utils/exchangeUtils';
import { addressExchange, payDeliveryfee } from '../../../../apis/Exchange/APIExchange';
import { updateDeliveryFee, updateExchangeData } from '../../../../features/exchange/exchangeSlice';

const ActionButtons = ({
  exchangeDetail,
  currentStage,
  oppositeCurrentStage,
  setSecondCurrentStage,
  deliverPartnerData,
  setFirstCurrentStage,
  selectedAddress,
  selectedPickupAddress,
  fetchExchangeData,
  fetchUserAddress,
  deliverData
}) => {

  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.user.id);

  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isConfirmedModalVisible, setIsConfirmedModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [stageButton, setStageButton] = useState();

  const [balance, setBalance] = useState(0);

  // const cacheDeliveryFee = (userId, exchangeId, fee) => {
  //   const key = `${userId}_${exchangeId}`;
  //   localStorage.setItem(key, JSON.stringify(fee));
  //   sessionStorage.setItem(key, JSON.stringify(fee));
  // };

  useEffect(() => {
    if (userId) {
      checkWallet(userId)
        .then((response) => {
          setBalance(response.data.balance);
        })
        .catch((error) => {
          console.error('Lỗi khi lấy số dư ví:', error);
        });
    }
  }, [userId]);

  // 
  const handleConfirmTransaction = () => {
    console.log("Confirming transaction...");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // addressExchange(selectedPickupAddress.id,selectedAddress.id).then((res) => {
      //   if (res.status === 200) {
      //     moveToNextStage();
      //     notification.success({
      //       message: "Xác nhận cung cấp thông tin giao hàng",
      //       description: "Vui lòng "
      //     });
      //   }
      // })

    }, 500);
  };


  // Function to update the stage
  const moveToNextStage = () => {
    setFirstCurrentStage(stageButton + 1);
  };


  // Handle Stage 1
  // Mở Modal xác nhận gửi thông tin vận chuyển của user.
  const showSubmitAddressModalFirstStage = () => {
    if (!selectedAddress) {
      notification.error({
        message: "Không tìm thấy địa chỉ",
        description: "Vui lòng chọn địa chỉ nhận hàng trước khi tiếp tục"
      });
      return;
    }
    if (!selectedPickupAddress) {
      notification.error({
        message: "Không tìm thấy địa chỉ",
        description: "Vui lòng chọn địa chỉ giao hàng trước khi tiếp tục"
      });
      return;
    }
    setIsAddressModalVisible(true);
  };

  // Handle Stage 1
  // Handle Gửi Submit Thông tin vận chuyển của user
  const handleAddressConfirmation = () => {
    // console.log("Confirming delivery address:", selectedAddress);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      addressExchange(exchangeDetail.id, selectedPickupAddress.id, selectedAddress.id).then((res) => {
        if (res.status === 200) {
          moveToNextStage();
          // notification.success({
          //   message: "Xác nhận địa chỉ thành công",
          //   description: "Vui lòng tiến hành thanh toán để hoàn tất giao dịch"
          // });
          fetchExchangeData();
          fetchUserAddress();
        }
      })
      setIsAddressModalVisible(false);

    }, 1000);
  };


  // Handle Stage 2
  // Mở Modal xác nhận đã kiểm tra đủ thông tin vận chuyển 2 bên tại Stage 2
  const openConfirmedAddressModalSecondStage = () => {
    setIsConfirmedModalVisible(true)
  }

  // Handle Stage 2
  // Gọi API tính phí vận chuyển
  const handleDeliverFee = () => {
    // console.log("111");
    // setIsConfirmedModalVisible(false);

    const deliverData = {
      service_type_id: 2,
      from_district_id: exchangeDetail.partner.from_address.ghn_district_id,
      from_ward_code: exchangeDetail.partner.from_address.ghn_ward_code,
      to_district_id: exchangeDetail.current_user.to_address.ghn_district_id,
      to_ward_code: exchangeDetail.current_user.to_address.ghn_ward_code,
      length: 30,
      width: 40,
      height: 20,
      weight: exchangeDetail.partner.items[0].weight,
      insurance_value: 0,
      coupon: null
    }


    checkDeliveryFee(deliverData).then((res) => {
      if (res.status === 200) {
        const deliveryData = {
          deliveryFee: res.data.data,
          userID: exchangeDetail.current_user.id,
          exchange_id: exchangeDetail.id,
        };
        dispatch(updateDeliveryFee(deliveryData));
        // console.log("nhập phí vận chuyển", res.data.data);
        if (res.data.data.total === 0) {
          notification.warning({
            message: "Lỗi khi lấy phí vận chuyển ",
            description: "Check lại response từ GHN."
          });
          // saveDeliveryFee(exchangeDetail.current_user.id, exchangeDetail.id, res.data.data);
        }
        saveDeliveryFee(exchangeDetail.current_user.id, exchangeDetail.id, res.data.data);
        fetchExchangeData();

        moveToNextStage();
        // setIsAddressModalVisible(false);
        setIsConfirmedModalVisible(false);
      } else {
        console.log("xảy ra lỗi");
      }
    })
  }


  const getCachedDeliveryDate = (userId, exchangeId) => {
    try {
      const key = `${userId}_${exchangeId}_deliverDate`;
      // console.log("Fetching from localStorage with key:", key);

      const raw = localStorage.getItem(key);
      if (!raw) {
        console.warn("No data found in localStorage for key:", key);
        return null;
      }

      const parsedData = JSON.parse(raw);
      console.log("Parsed data from localStorage:", parsedData);

      return parsedData;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  };


  // Handler for stage 3 - Process payment
  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // Lấy thông tin delivery fee từ cache
      const raw = getCachedDeliveryDate(exchangeDetail.current_user.id, exchangeDetail.id);
      if (!raw) {
        throw new Error("Không tìm thấy thông tin phí vận chuyển");
      }

      const deliveryFee = raw.total;

      // Kiểm tra số dư
      if (balance < deliveryFee) {
        throw new Error(`Số dư không đủ. Bạn cần ${deliveryFee.toLocaleString()} VND nhưng chỉ có ${balance.toLocaleString()} VND`);
      }

      const data = {
        expected_delivery_time: raw.to_estimate_date || new Date().toISOString(),
        delivery_fee: deliveryFee,
        note: raw?.note || "Không có"
      };

      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await payDeliveryfee(exchangeDetail.id, data);

      if (res.status === 200) {
        moveToNextStage();
        notification.success({
          message: "Thanh toán thành công",
          description: "Thanh toán đã được xử lý, bạn có thể tiếp tục theo dõi đơn hàng"
        });
      } else {
        throw new Error(`Lỗi khi thanh toán: ${res.status}`);
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      notification.error({
        message: "Thanh toán thất bại",
        description: error.message || "Đã xảy ra lỗi khi xử lý thanh toán, vui lòng thử lại"
      });
    } finally {
      setIsLoading(false);
      fetchExchangeData();
    }
  };


  // Handler for stage 4 - Confirm delivery
  const handleConfirmDelivery = () => {
    console.log("Confirming delivery...");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      moveToNextStage();
      notification.success({
        message: "Xác nhận nhận hàng thành công",
        description: "Trao đổi đã được hoàn tất"
      });
    }, 1000);
  };


  useEffect(() => {
    setStageButton(currentStage);
  }, [currentStage])


  // Render button based on current stage
  const renderActionButton = () => {
    if (stageButton > 5) {
      return null; // No action buttons for completed exchanges
    }

    // If current user is waiting for partner
    if (exchangeDetail && oppositeCurrentStage < stageButton) {
      return (
        <Button
          disabled
          block
          className="bg-gray-200 text-gray-500"
        >
          Đang chờ người đối diện thực hiện...
        </Button>
      );
    }

    // Toggle các button theo current Stage
    switch (stageButton) {
      // Stage 1
      case 1:
        return (
          <Button
            type="primary"
            icon={< TruckOutlined className='mt-1' />}
            size="large"
            onClick={showSubmitAddressModalFirstStage}
            loading={isLoading}
            block
            className="bg-blue-500"
          >
            Gửi thông tin vận chuyển
          </Button>
        );

      // Stage 2
      case 2:
        return (
          <Button
            type="primary"
            icon={<TruckOutlined className='text-xl mt-1' />}
            size="large"
            onClick={openConfirmedAddressModalSecondStage}
            loading={isLoading}
            block
            className="bg-blue-500 hover:bg-blue-600"
          >
            Xác nhận thông tin vận chuyển
          </Button>
        );

      // Stage 3
      case 3:
        return (
          <Button
            type="primary"
            icon={<CreditCardIcon />}
            size="large"
            onClick={handlePayment}
            loading={isLoading}
            block
            className="bg-blue-500"
          >
            Thanh toán
          </Button>
        );

      // Stage 4
      // case 4:
      //   if (exchangeDetail.status === 'delivered') {
      //     return (
      //       <Button
      //         type="primary"
      //         icon={<PackageCheck />}
      //         size="large"
      //         onClick={handleConfirmDelivery}
      //         loading={isLoading}
      //         block
      //         className="bg-blue-500 hover:bg-blue-600"
      //       >
      //         Xác nhận đã nhận hàng
      //       </Button>
      //     );
      //   } else {
      //     return null;
      //   } default: return null;
    }
  };

  return (
    <div className="w-full mt-6 mb-8">
      {renderActionButton()}

      {/* MODAL SUBMIT ADDRESS FOR STAGE 1 */}
      <Modal
        title={
          <div className="text-lg font-semibold uppercase">
            Gửi thông tin giao hàng và nhận hàng
          </div>
        }
        open={isAddressModalVisible}
        onCancel={() => setIsAddressModalVisible(false)}
        footer={null}
        className="rounded-xl"
      >
        <div className="py-2 px-1">
          <Alert
            type="warning"
            showIcon
            message="Lưu ý"
            description={
              <span className='text-base'>
                Bạn <strong className='text-red-500'>không thể chỉnh sửa lại thông tin vận chuyển</strong> sau khi đã gửi.
                Vui lòng kiểm tra kỹ thông tin trước khi tiếp tục!
              </span>
            }
            className="mb-6"
          />

          <div className="flex justify-end gap-3">
            <Button onClick={() => setIsAddressModalVisible(false)}>
              Hủy
            </Button>
            <Button
              type="primary"
              icon={<UploadOutlined className='mt-1 text-lg' />}
              onClick={handleAddressConfirmation}
              loading={isLoading}
              className="bg-blue-500"
            >
              Gửi thông tin vận chuyển
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL CONFIRMED ADDRESS FOR STAGE 2 */}
      <Modal
        open={isConfirmedModalVisible}
        onCancel={() => setIsConfirmedModalVisible(false)}
        footer={null}
        className="rounded-xl"
        title={
          <div className="flex items-center gap-2 text-green-600 font-semibold text-base">
            <CheckCircleOutlined className="text-green-500" />
            ĐÃ XÁC NHẬN THÔNG TIN VẬN CHUYỂN
          </div>
        }
      >
        <div className="py-2 px-4 bg-gray-50 rounded-xl shadow-sm">
          <Typography.Paragraph className="text-base text-gray-800 leading-relaxed">
            Bạn đã kiểm tra và xác nhận đầy đủ thông tin vận chuyển của cả hai bên.
            Hệ thống sẽ tiến hành tính phí vận chuyển cho đơn hàng <strong className="text-blue-600">Trao đổi</strong> của bạn.
          </Typography.Paragraph>
        </div>
        <div className="flex justify-end mt-2">
          <Button
            type="primary"
            onClick={handleDeliverFee}
            className="bg-green-500 hover:bg-green-600 transition-all"
          >
            Tiếp theo <ArrowRightOutlined />
          </Button>
        </div>

      </Modal>

    </div>
  );
};

ActionButtons.propTypes = {
  exchangeDetail: PropTypes.object.isRequired,
  currentStage: PropTypes.number.isRequired,
  oppositeCurrentStage: PropTypes.number.isRequired,
  setFirstCurrentStage: PropTypes.func,
  setSecondCurrentStage: PropTypes.func,
  selectedAddress: PropTypes.shape({
    id: PropTypes.number.isRequired,
    full_name: PropTypes.string,
    phone_number: PropTypes.string,
    detail: PropTypes.string,
    ward_name: PropTypes.string,
    district_name: PropTypes.string,
    province_name: PropTypes.string
  }),
  selectedPickupAddress: PropTypes.shape({
    id: PropTypes.number.isRequired,
    full_name: PropTypes.string,
    phone_number: PropTypes.string,
    detail: PropTypes.string,
    ward_name: PropTypes.string,
    district_name: PropTypes.string,
    province_name: PropTypes.string
  }),
  fetchExchangeData: PropTypes.func.isRequired,
  fetchUserAddress: PropTypes.func.isRequired,
  deliverData: PropTypes.object,
};

export default ActionButtons;