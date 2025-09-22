import Cookies from 'js-cookie';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Steps, Button, Form, message, notification } from "antd";
import { ShopOutlined, TruckOutlined, ContainerOutlined, FileDoneOutlined } from "@ant-design/icons";

import FirstForm from "./FirstForm";
import SecondForm from "./SecondForm";
import ThirdForm from "./ThirdForm";
import FourthForm from "./FourthForm";

import { verifyToken } from '../../apis/Authentication/APIAuth';

import { BecomeSeller } from "../../apis/User/APIUser";
import { CreateShop, GetShopInfoById, UpdateShopName } from '../../apis/Seller Profile/APISellerProfile';

const { Step } = Steps;

export default function RegisterShop() {

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [current, setCurrent] = useState(0);

  const [user, setUser] = useState(useSelector((state) => state.auth.user));

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    agreedToTerms: false,
  });
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [canProceed, setCanProceed] = useState(true);

  // Thêm state kiểm tra trạng thái địa chỉ
  const [hasAddress, setHasAddress] = useState(false);

  // console.log("formData", formData);

  const steps = [
    {
      title: "Thông tin Shop",
      icon: <ShopOutlined />,
      content: <FirstForm
        form={form}
        setIsPhoneVerified={setIsPhoneVerified}
      />,
    },
    {
      title: "Cài đặt vận chuyển",
      icon: <TruckOutlined />,
      content: <SecondForm
        user={user}
        setHasAddress={setHasAddress}
      />,
    },
    {
      title: "Điều khoản sử dụng",
      icon: <ContainerOutlined />,
      content: <ThirdForm
        formData={formData}
        setFormData={setFormData}
        setCanProceed={setCanProceed}
      />,
    },
    {
      title: "Hoàn tất",
      icon: <FileDoneOutlined />,
      content: <FourthForm />,
    },
  ];


  // Lấy Thông tin User từ Cookie
  useEffect(() => {
    const access_token = Cookies.get('access_token');
    if (access_token) {
      try {
        verifyToken(access_token).then(response => {
          setUser(response.data);

          // Kiểm tra số điện thoại và cập nhật trạng thái xác thực
          if (response.data.phone_number) {
            setIsPhoneVerified(true);
          }
        });
      } catch (error) {
        console.error("Lỗi lấy Thông tin User:", error);
      }
    }
  }, []);


  // Hàm btn Next - Prev
  const next = async () => {
    try {
      const values = await form.validateFields();

      if (current === 0) {
        // Xử lý tạo/cập nhật shop
        let shopExists = false;

        // Kiểm tra shop tồn tại
        try {
          const shopResponse = await GetShopInfoById(user?.id);
          shopExists = !!shopResponse?.data;
        } catch (error) {
          shopExists = false;
        }

        // Dựa vào kết quả kiểm tra để quyết định hành động
        if (shopExists) {
          // Cập nhật shop nếu tồn tại
          await UpdateShopName(values.shop_name, user?.id);
          // console.log("Shop name updated");
        } else {
          // Tạo mới nếu chưa tồn tại
          await CreateShop(values.shop_name, user?.id);
          console.log("New shop created");
        }

        console.log("Form 1 done");
      } else if (current === 1) {
        // 🟢 Gọi API cập nhật Cài đặt vận chuyển
        console.log("Form 2 done");

      } else if (current === 2) {
        // 🟢 Gọi API cập nhật Điều khoản sử dụng
        await BecomeSeller();
      }

      // Nếu API thành công thì mới chuyển bước
      setCurrent((prev) => prev + 1);

    } catch (err) {
      console.error("Validation Failed:", err);
      message.error("Vui lòng kiểm tra lại thông tin!");
      if (err.response && err.response.status === 409) {
        message.error("Thông tin Shop đã tồn tại!");
        return;
      }
    }
  };

  const prev = () => setCurrent((prev) => prev - 1);


  const handleSubmit = async () => {
    try {
      await form.validateFields();
      // console.log("Gửi dữ liệu:", values);

      notification.open({
        message: 'Chào mừng Nhà Bán Hàng MECHAWORLD.',
        description: '',
        icon: <ShopOutlined style={{ color: '#108ee9' }} />
      });

      setTimeout(() => {
        navigate("/shop/dashboard");
        window.location.reload();
      }, 1000);

    } catch (err) {
      console.error("Validation Failed:", err);
      message.error("Vui lòng kiểm tra lại thông tin!");
    }
  };

  return (
    <div className="container my-14 mx-auto bg-white">
      <Steps
        current={current}
        // onChange={setCurrent}
        // progressDot
        className="max-w-5xl mx-auto"
      >
        {steps.map((step, index) => (
          <Step key={index} title={step.title} icon={step.icon} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="horizontal"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 12,
        }}
        initialValues={formData}>
        <div className="p-5 mx-auto max-w-5xl">
          {steps[current].content}
        </div>

        <div className="flex justify-end gap-4">
          {current > 0 && current < steps.length - 2 && <Button onClick={prev}>Quay lại</Button>}
          {current < steps.length - 1 ? (
            <Button
              type="primary"
              disabled={
                (current === 0 && (!canProceed || !isPhoneVerified)) ||
                (current === 1 && !hasAddress) ||
                (current === 2 && !canProceed)
              }
              onClick={next}
              className="bg-blue-500 mr-20"
            >
              Tiếp theo
            </Button>
          ) : (
            <Button type="primary" onClick={handleSubmit} className="bg-green-500 mx-4 hover:bg-green-600">
              Đến Shop của bạn
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
