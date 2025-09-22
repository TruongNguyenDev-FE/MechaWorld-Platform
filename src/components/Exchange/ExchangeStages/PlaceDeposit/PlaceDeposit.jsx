/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Divider, Input, Descriptions, Spin, Space, Alert } from 'antd';
import { HomeOutlined, SendOutlined, CarOutlined, DollarOutlined, TruckOutlined } from '@ant-design/icons';

import { checkTimeDeliver } from "../../../../apis/GHN/APIGHN";
import { getDeliveryFee } from "../../../../utils/exchangeUtils";

import AOS from 'aos';
import 'aos/dist/aos.css';

import moment from "moment/min/moment-with-locales";
moment.locale("vi");

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function PlaceDeposit({
  exchangeDetails,
  firstUser,
  secondUser,
  deliverData,
  deliverPartnerData,
  setDeliverPartnerData,
  setDeliverData,
  setIsLoading,
}) {
  const [deliveryDetails] = useState(deliverData);
  const [total, setTotal] = useState(0);
  const [note, setNote] = useState(null);
  const [deliverDate, setDeliverDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const exchange = exchangeDetails;
  console.log(deliverData, "deliverData");
  const formatCurrency = (value) => {
    if (!value || value === 0) return "0";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const fetchDeliveryFeeAndDeliveryTime = async () => {
    setIsLoading(true);
    setLoading(true);
    try {
      let storedata;
      await getDeliveryFee(exchange.current_user.id, exchange.id)
        .then((yourDeliFee) => {
          setDeliverData(yourDeliFee);
          console.log(yourDeliFee, "yourDeliFee");
          setTotal(yourDeliFee?.total);
          storedata = yourDeliFee;
        })
        .catch((error) => {
          console.error("Error fetching delivery fee:", error);
        });

      await getDeliveryFee(exchange.partner.id, exchange.id)
        .then((yourDeliFee) => {
          setDeliverPartnerData(yourDeliFee);
        })
        .catch((error) => {
          console.error("Error fetching delivery fee:", error);
        });

      const deliverDataCheck = {
        from_district_id: exchange.partner.from_address.ghn_district_id,
        from_ward_code: exchange.partner.from_address.ghn_ward_code,
        to_district_id: exchange.current_user.to_address.ghn_district_id,
        to_ward_code: exchange.current_user.to_address.ghn_ward_code,
        service_id: 53321
      };

      // setTotal(deliverData?.total );

      await checkTimeDeliver(deliverDataCheck).then((res) => {
        console.log(res, "res checkTimeDeliver");
        setDeliverDate(res.data);
        const key = `${firstUser.id}_${exchange.id}_deliverDate`;

        const data = {
          ...res.data.data.leadtime_order,
          total: storedata?.total,
          note: note
        };
        localStorage.setItem(key, JSON.stringify(data));
      });

    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 100,
      once: true,
    });
    fetchDeliveryFeeAndDeliveryTime();
  }, [note]);

  const formatDate = deliverDate?.data.leadtime_order
    ? `${moment(deliverDate.data.leadtime_order.from_estimate_date).format('DD/MM')} - ${moment(deliverDate.data.leadtime_order.to_estimate_date).format('DD/MM/YYYY')}`
    : "Đang tính toán...";

  return (
    <Spin spinning={loading} tip="Đang tải dữ liệu...">
      <div data-aos="fade-up" data-aos-duration="800">
        <Alert
          type="info"
          showIcon
          message="Vui lòng kiểm tra kỹ trước khi thanh toán"
          description={
            <div className="text-gray-700 text-sm space-y-3 mt-2">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Kiểm tra lại <strong>phí vận chuyển</strong>, nếu có, và phương thức thanh toán bạn đã chọn.
                </li>
                <li>
                  Hệ thống <strong>chỉ cho phép thanh toán bằng Ví</strong> để đảm bảo quyền lợi và an toàn cho người dùng trong giao dịch.
                </li>
                <li>
                  Sau khi xác nhận thanh toán, bạn <strong>không thể thay đổi</strong> đơn hàng hoặc hủy giao dịch.
                </li>
                <li>
                  Bấm "Thanh toán" đồng nghĩa với việc bạn đã đồng ý với <strong>điều khoản trao đổi và chính sách vận chuyển</strong>.
                </li>
              </ul>
            </div>
          }
        />
      </div>

      <div className="px-4 pt-6">
        <Card
          bordered={true}
          className="shadow-md rounded-lg overflow-hidden"
        >
          {/* Phần thông tin địa chỉ */}
          <div className="mb-6">
            <div className="bg-blue-50 -mt-5 -mx-6 px-6 py-3 mb-4 border-b border-blue-100">
              <Title level={4} className="flex items-center text-blue-700 mb-0">
                <HomeOutlined className="mr-2" />Thông tin vận chuyển
              </Title>
            </div>

            <Row gutter={24}>
              
              {/* Người gửi */}
              <Col span={12}>
                <div data-aos="fade-left" className="mb-4">
                  <div className="flex items-center mb-3">
                    <SendOutlined className="mr-2 text-blue-600 text-lg" />
                    <Text strong className="text-lg">Người gửi</Text>
                  </div>
                  <Descriptions column={1} bordered size="small" className="ml-6">
                    <Descriptions.Item label="Họ tên">{firstUser?.full_name}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">
                      {exchange.current_user.to_address?.detail}, {exchange.current_user.to_address?.ward_name}, {exchange.current_user.to_address?.district_name}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Col>
              
              {/* Người nhận */}
              <Col span={12} className="border-r">
                <div data-aos="fade-right" className="mb-4">
                  <div className="flex items-center mb-3">
                    <HomeOutlined className="mr-2 text-green-600 text-lg" />
                    <Text strong className="text-lg">Người nhận</Text>
                  </div>
                  <Descriptions column={1} bordered size="small" className="ml-6">
                    <Descriptions.Item label="Họ tên">{secondUser?.full_name}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">
                      {exchange.partner.from_address?.detail}, {exchange.partner.from_address?.ward_name}, {exchange.partner.from_address?.district_name}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Col>
            </Row>
          </div>

          <Divider className="my-4" />

          {/* Phần phí vận chuyển */}
          <div data-aos="fade-up">
            <div className="bg-gray-50 -mx-6 px-6 py-3 mb-4 border-y border-gray-100">
              <Title level={4} className="flex items-center mb-0">
                <CarOutlined className="mr-2" />Chi tiết phí vận chuyển
              </Title>
            </div>

            <Space direction="vertical" size="middle" className="w-full">
              <div>
                <div className="flex items-center mb-2">
                  <TruckOutlined className="mr-2 text-blue-600 text-lg" />
                  <Text className="text-lg" strong>Thông tin vận chuyển</Text>
                </div>
                <div className="flex justify-between items-center px-4">
                  <Text>Phí giao hàng:</Text>
                  <Text strong>{formatCurrency(total )} đ</Text>
                </div>
                <div className="flex justify-between items-center px-4 italic text-gray-500">
                  <Text italic>Ngày nhận hàng dự kiến:</Text>
                  <Text italic>{formatDate}</Text>
                </div>
              </div>

              <Divider className="my-2" />

              <div className="flex justify-between items-center">
                <Text strong className="text-lg flex items-center">
                  <DollarOutlined className="mr-2 text-red-500" />
                  Tổng tiền:
                </Text>
                <Text strong type="danger" className="text-xl">
                  {formatCurrency(total)} đ
                </Text>
              </div>

              <TextArea
                placeholder="Ghi chú cho đối tác"
                value={note || ""}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2"
                rows={3}
              />

              {/* <Button type="primary" size="large" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                Thanh toán
              </Button> */}
            </Space>
          </div>
        </Card>
      </div>
    </Spin>
  );
}

PlaceDeposit.propTypes = {
  exchangeDetails: PropTypes.object,
  firstUser: PropTypes.shape({
    id: PropTypes.string,
    full_name: PropTypes.string,
  }),
  secondUser: PropTypes.shape({
    id: PropTypes.string,
    full_name: PropTypes.string,
  }),
  fetchExchangeDetails: PropTypes.func,
  setIsLoading: PropTypes.func,
  setDeliverPartnerData: PropTypes.func,
  setDeliverData: PropTypes.func,
  deliverPartnerData: PropTypes.object,
  deliverData: PropTypes.object,
};