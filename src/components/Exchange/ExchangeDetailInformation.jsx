import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getUserAddresses } from "../../apis/User/APIUser";
import { getExchangeDetail } from "../../apis/Exchange/APIExchange";

import ExchangeLoader from "./ExchangeLoader";
import ProgressSection from "./ExchangeProgress/ProgressSection";
import ActionButtons from "./ExchangeToggleFooterButton/SubmitButton/ActionButtons";
import ExchangeDetailInformationSection from "./ExchangeStages/ExchangeInformationSection";
import ExchangeInformation from "./ExchangeToggleFooterButton/ViewInfoExchangeButton/ExchangeInformation";

import { hasDeliveryFee, getDeliveryFee } from "../../utils/exchangeUtils";

const ExchangeDetailInformation = () => {
  const currentUser = useSelector((state) => state.auth.user);

  const [firstCurrentStage, setFirstCurrentStage] = useState(-1);
  const [secondCurrentStage, setSecondCurrentStage] = useState(-1);

  const [exchangeDetail, setExchangeDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firstAddress, setFirstAddress] = useState(null);
  const [secondAddress, setSecondAddress] = useState(null);
  const [currentUser2, setFirstUser] = useState();
  const [partner, setSecondUser] = useState();
  const [deliverData, setDeliverData] = useState(null);
  const [deliverPartnerData, setDeliverPartnerData] = useState(null);
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPickupAddress, setSelectedPickupAddress] = useState(null);
  const ExchangeId = () => {
    const { id } = useParams();
    return id;
  };

  const exchangeId = ExchangeId();

  // Hàm xử lý khi một bên hoàn tất một bước
  // const handleNextStep = () => {
  //   if (firstCurrentStage < 5) {
  //     setFirstCurrentStage(firstCurrentStage + 1);
  //     setSecondCurrentStage(secondCurrentStage + 1);
  //   }
  // };

  // Hàm xử lý khi một bên từ chối bước hiện tại
  // const handleRejectStep = () => {
  //   alert("Giao dịch đã bị từ chối.");
  //   setFirstCurrentStage(0);
  //   setSecondCurrentStage(0);
  // };

  // const fee = useSelector((state) =>
  //   selectDeliveryFee(state, currentUser.id, exchangeDetail?.id)
  // );

  const isFeeAvailable = useSelector((state) =>
    hasDeliveryFee(state, exchangeDetail?.current_user.id, exchangeDetail?.id)
  );
  const isPartnerFeeAvailable = useSelector((state) =>
    hasDeliveryFee(state, exchangeDetail?.partner.id, exchangeDetail?.id)
  );

  // console.log('partner id: ',exchangeDetail?.partner.id);
  // console.log('your id: ',exchangeDetail?.current_user.id);
  // console.log('partner check: ',isPartnerFeeAvailable);
  // console.log('your check: ',isFeeAvailable);



  const fetchExchangeData = async () => {
    try {
      // Giả định gọi API và nhận dữ liệu



      await getExchangeDetail(exchangeId).then(async (res) => {
        console.log(res.data, "exchangeDetail");
        setExchangeDetail(res.data);
        setFirstUser(res.data.current_user);
        setSecondUser(res.data.partner);
        let deliveryFee ;
        let partnerDeliveryFee ;
        await getDeliveryFee(res.data.current_user.id, res.data.id)
          .then((yourDeliFee) => {
            setDeliverData(yourDeliFee);
            console.log('phí giao hàng của bạn: ', yourDeliFee);
            // console.log("Delivery fee:", yourDeliFee);
            deliveryFee = yourDeliFee;
          })
          .catch((error) => {
            console.error("Error fetching delivery fee:", error);
          });

        await getDeliveryFee(res.data.partner.id, res.data.id)
          .then((yourDeliFee) => {
            setDeliverPartnerData(yourDeliFee);
            console.log('phí giao hàng của đối tác: ', yourDeliFee);
            partnerDeliveryFee = yourDeliFee;
          })
          .catch((error) => {
            console.error("Error fetching delivery fee:", error);
          });



        switch (res.data.status) {
          case "pending":
            if (res.data.current_user.from_address === null) {
              setFirstCurrentStage(1); // Nếu from_address là null
            } else if (res.data.current_user.delivery_fee !== null) {
              if (res.data.current_user.delivery_fee_paid == true) {
                setFirstCurrentStage(4); // Nếu delivery_fee_paid = true
              } else {
                setFirstCurrentStage(3); // Nếu có delivery_fee nhưng chưa thanh toán
              }
            } else if (deliverData !== null || deliveryFee !== null) {
              setFirstCurrentStage(3);
            } else {
              // console.log("qua bước này rồi nhé");
              setFirstCurrentStage(2); 
            }

            if (res.data.partner.from_address === null) {
              setSecondCurrentStage(1);
            } else if (res.data.partner.delivery_fee !== null) {
              if (res.data.partner.delivery_fee_paid == true) {
                setSecondCurrentStage(4);
              } else {
                setSecondCurrentStage(3);
              }
            } else if (deliverPartnerData !== null || partnerDeliveryFee !== null) {
              setSecondCurrentStage(3);
            } else {
              setSecondCurrentStage(2)
            }
            break;

          case "packaging":
          case "delivering":
          case "delivered":
            setFirstCurrentStage(4); // Nếu đang đóng gói, giao hàng hoặc đã giao hàng
            setSecondCurrentStage(4);
            break;

          case "completed":
            setFirstCurrentStage(5); // Nếu giao dịch đã hoàn tất
            setSecondCurrentStage(5);
            break;

          default:
            setFirstCurrentStage(0); // Mặc định nếu không khớp trạng thái nào
            setSecondCurrentStage(0);
            break;
        }
      })

    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu trao đổi:", error);
    }
  };

  // Hàm lấy địa chỉ người dùng từ API
  const fetchUserAddress = async () => {
    try {
      const addresses = await getUserAddresses(currentUser.id).then((res) => res.data);

      const pickupAddress = addresses.filter((address) => address.is_pickup_address === true);
      // console.log("pickupAddress" ,pickupAddress);
      const primaryAddress = addresses.filter((address) => address.is_primary === true);

      // console.log(addresses);
      setSelectedAddress(primaryAddress[0]);
      setSelectedPickupAddress(pickupAddress[0]);
      setAddress(addresses);
      // console.log(selectedPickupAddress);
      // console.log("checking data",selectedAddress);
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ người dùng:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchExchangeData(), fetchUserAddress()]);

      setIsLoading(false);
    };
    fetchData();

    // const fetchAddress = async () => {
    //   const response = await getUserAddresses(currentUser.id).then((res) => res.data);
    //   setAddress(response);
    // }
    // fetchAddress();
  }, []);



  return (
    <div className="flex mt-32">
      {firstCurrentStage > -1 ? (
        <>
          {/* Bên trái */}
          <div className="basis-2/3 flex flex-col items-stretch justify-start gap-4 px-4 border-r border-gray-300">
            <ExchangeDetailInformationSection
              firstCurrentStage={firstCurrentStage}
              setFirstCurrentStage={setFirstCurrentStage}
              secondCurrentStage={secondCurrentStage}
              setSecondCurrentStage={setSecondCurrentStage}
              currentUser={currentUser2}
              partner={partner}
              deliverData={deliverData}
              deliverPartnerData={deliverPartnerData}
              setDeliverPartnerData={setDeliverPartnerData}
              setDeliverData={setDeliverData}
              exchangeDetail={exchangeDetail}
              address={address}
              selectedPickupAddress={selectedPickupAddress}
              setSelectedPickupAddress={setSelectedPickupAddress}
              setAddress={setAddress}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              firstAddress={firstAddress}
              secondAddress={secondAddress}
              setIsLoading={setIsLoading}
              fetchExchangeData={fetchExchangeData}
              fetchUserAddress={fetchUserAddress}
            />

            <div className="flex flex-row gap-4 items-center">
              <div className="flex-1">
                <ExchangeInformation
                  firstCurrentStage={firstCurrentStage}
                  secondCurrentStage={secondCurrentStage}
                  firstUser={currentUser2}
                  secondUser={partner}
                  exchangeDetail={exchangeDetail}
                />
              </div>
              <div className="flex-1">
                <ActionButtons
                  currentStage={firstCurrentStage}
                  setFirstCurrentStage={setFirstCurrentStage}
                  oppositeCurrentStage={secondCurrentStage}
                  setSecondCurrentStage={setSecondCurrentStage}
                  deliverData={deliverData}
                  setDeliverData={setDeliverData}
                  deliverPartnerData={deliverPartnerData}
                  exchangeDetail={exchangeDetail}
                  selectedAddress={selectedAddress}
                  selectedPickupAddress={selectedPickupAddress}
                  fetchExchangeData={fetchExchangeData}
                  fetchUserAddress={fetchUserAddress}
                />
              </div>
            </div>
          </div>

          {/* Bên phải */}
          <div className="basis-1/3 min-w-fit ">
            <ProgressSection
              firstCurrentStage={firstCurrentStage}
              secondCurrentStage={secondCurrentStage}
              exchangeDetail={exchangeDetail}
            />
          </div>
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <ExchangeLoader />
        </div>
      )}
    </div>
  );
};

export default ExchangeDetailInformation;
