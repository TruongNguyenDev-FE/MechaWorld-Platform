/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { Alert } from "antd";
import { useEffect } from "react";

import SubmitAmounts from "../ExchangeInfo/SubmitAmounts";
import SuccessfulExchange from "./SuccessfulExchange/SuccessfulExchange";
import DealsInformation from "../ExchangeToggleFooterButton/ViewInfoExchangeButton/DealsInformation";

import SubmitDeliveryInfo from "./SubmitDeliveryInfo/SubmitDeliveryInfo";
import ConfirmExchangeDelivery from "./ConfirmExchangeDelivery/ConfirmExchangeDelivery";
import PlaceDeposit from "./PlaceDeposit/PlaceDeposit";
import DeliveryProcessInfo from "./DeliveryProcessInfo/DeliveryProcessInfo";

const ExchangeInformationSection = ({
  firstCurrentStage,
  secondCurrentStage,
  exchangeData,
  currentUser,
  partner,
  deliverData,
  deliverPartnerData,
  setDeliverPartnerData,
  setDeliverData,
  setFirstCurrentStage,
  setSecondCurrentStage,
  selectedPickupAddress,
  setSelectedPickupAddress,
  exchangeDetail,
  firstAddress,
  secondAddress,
  address,
  setAddress,
  selectedAddress,
  setSelectedAddress,
  setIsLoading,
  fetchExchangeData,
  fetchUserAddress,
}) => {
  //   const [refundRequestsList, setRefundRequestsList] = useState([]);
  //   const [userRefundRequest, setUserRefundRequest] = useState(null);
  const isFailed = ["failed", "canceled"].includes(exchangeDetail?.status);
  // console.log("check exchange data", exchangeData);

  // console.log("check exchangeDetails", exchangeDetail);
  
  // console.log("check firstUser", currentUser);
  // console.log("check secondUser", partner);
  // console.log("check selectedAddress", selectedAddress);
  // console.log("check selectedPickupAddress", selectedPickupAddress);


  useEffect(() => {
    if (isFailed) {
      fetchUserRefundRequest();
    }
  }, [exchangeData]);

  const fetchUserRefundRequest = async () => {
    setIsLoading(true);
    try {
      console.log("Hoàn tất yêu cầu hoàn tiền cho cuộc trao đổi này");
      // Giả lập gọi API để lấy danh sách yêu cầu hoàn tiền

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    if (isFailed) {
      return {
        title: `Trao đổi ${exchangeData.status === "failed" ? "thất bại" : "đã bị từ chối"
          }`,
        subTitle: (
          <p className="text-red-600 leading-tight">
            {exchangeData.status === "failed"
              ? "Trao đổi được hệ thống ghi nhận là thất bại khi một trong hai người trao đổi dừng trao đổi hoặc xảy ra vấn đề trong lúc trao đổi."
              : "Trao đổi được hệ thống ghi nhận là bị từ chối khi yêu cầu của bạn không được người đăng bài chấp thuận hoặc người đăng bài đã chấp nhận một yêu cầu trao đổi khác."}
          </p>
        ),
      };
    }
    switch (firstCurrentStage) {
      case 1:
        return {
          title: "Điền thông tin vận chuyển",
        };
      case 2:
        return {
          title: "Xác nhận thông tin vận chuyển",
        };
      case 3:
        return {
          title: "Thanh toán",
        };
      case 4:
        return {
          title: "Giao hàng & nhận hàng",
        };
      case 5:
        return {
          title: "Hoàn tất quá trình trao đổi",
        };
      case 6:
        return {
          title: "Trao đổi thành công",
        };
      default:
        return {};
    }
  };

  const renderStepContent = () => {
    if (isFailed) {
      return (
        <div className="w-full text-center border border-gray-500 rounded-lg py-2">
          <p className="text-lg font-semibold">Trao đổi đã bị từ chối</p>
          <p className="text-sm font-light italic">
            Bạn có thể yêu cầu hoàn tiền cho cuộc trao đổi này nếu bạn đã
            thanh toán tiền cọc cho cuộc trao đổi này.
          </p>
          {/* <ViewRefundButton
                refundRequest={userRefundRequest}
                requestsList={refundRequestsList}
            /> */}
        </div>

      );
    }

    switch (firstCurrentStage) {
      case 1:
        return (
          <SubmitDeliveryInfo
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            setSelectedPickupAddress={setSelectedPickupAddress}
            selectedPickupAddress={selectedPickupAddress}
            addresses={address}
            setAddresses={setAddress}
            fetchUserAddress={() => { }}
          />
        )

      case 2:
        return (
          <ConfirmExchangeDelivery
            exchangeDetail={exchangeDetail}
          />
        );
      case 3:
        return (
          <PlaceDeposit
            exchangeDetails={exchangeDetail}
            firstAddress={firstAddress}
            secondAddress={secondAddress}
            firstUser={currentUser}
            deliverData={deliverData}
            deliverPartnerData={deliverPartnerData}
            setDeliverPartnerData={setDeliverPartnerData}
            setDeliverData={setDeliverData}
            secondUser={partner}
            fetchExchangeDetails={fetchExchangeData}
            setIsLoading={setIsLoading}
          />
        );
      case 4:
        return (
          <DeliveryProcessInfo
            exchangeDetails={exchangeDetail}
            firstUser={currentUser}
            secondUser={partner}
            firstAddress={firstAddress}
            secondAddress={secondAddress}
            fetchExchangeDetails={fetchExchangeData}
            setIsLoading={setIsLoading}
          />
        );
      case 5:
        return <SuccessfulExchange exchangeDetails={exchangeDetail} />;
      case 6:
        return <SuccessfulExchange exchangeDetails={exchangeDetail} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 mt-4">
      <div className="flex items-start justify-between gap-16">
        <div className="basis-2/3">
          <p className="text-xl font-bold uppercase">{getTitle()?.title}</p>
          <div className="text-md font-light italic">
            {getTitle()?.subTitle}
          </div>
        </div>
        {!isFailed && (
          <button
            onClick={() => {fetchExchangeData();fetchUserAddress()}}
            className="min-w-fit flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-300 duration-200 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z"></path>
            </svg>
            <p className="text-xs font-semibold">Tải lại trang</p>
          </button>
        )}
      </div>

      {renderStepContent()}
    </div>
  );
};

ExchangeInformationSection.propTypes = {
  firstCurrentStage: PropTypes.number,
  secondCurrentStage: PropTypes.number,
  exchangeData: PropTypes.object,
  firstUser: PropTypes.object,
  secondUser: PropTypes.object,
  setFirstCurrentStage: PropTypes.func,
  setSecondCurrentStage: PropTypes.func,
  firstAddress: PropTypes.string,
  secondAddress: PropTypes.string,
  deliverData: PropTypes.object,
  deliverPartnerData: PropTypes.object,
  address: PropTypes.array,
  setAddress: PropTypes.func,
  fetchExchangeData: PropTypes.func,
  fetchUserAddress: PropTypes.func,
  selectedAddress: PropTypes.object,
  setSelectedAddress: PropTypes.func,
  selectedPickupAddress: PropTypes.object,
  setSelectedPickupAddress: PropTypes.func,
  setDeliverPartnerData: PropTypes.func,
  setDeliverData: PropTypes.func,
  setIsLoading: PropTypes.func,
  exchangeDetail: PropTypes.object,
  currentUser: PropTypes.object,
  partner: PropTypes.object,
};

export default ExchangeInformationSection;
