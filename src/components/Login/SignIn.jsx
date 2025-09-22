import { useDispatch, } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { NavLink, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, notification } from "antd";

import { login } from "../../features/auth/authSlice";
import { loginEmail, loginGoogle } from "../../apis/Authentication/APIAuth";

import Cookies from "js-cookie";
import Footer from "../../layouts/Footer";
import Logo from '../../assets/image/logo4.png';
import { ShowErrorNotification } from "../Errors/ShowErrorNotification";

export default function SignIn() {

  const [form] = Form.useForm();
  const { Title, Text } = Typography;
  const navigate = useNavigate();
  const dispatch = useDispatch();


  async function handleCredentialResponse(response) {
    console.log(response);
    loginGoogle(response.credential)
      .then(response => {
        console.log(response.data);
        dispatch(login(response.data));
        Cookies.set('access_token', response.data.access_token);
        Cookies.set('user', JSON.stringify(response.data.user), {
          expires: new Date(response.data.access_token_expires_at),
          path: "/",
        });

        // Hiển thị thông báo Đăng nhập Google thành công
        showSuccessNotification();

        // Chuyển trang
        setTimeout(() => {
          window.location.href = "/";
        }, 2000)


      })
      .catch(error => {
        console.error("Lỗi đăng nhập:", error);
        ShowErrorNotification(404, error);
      });
  }

  // Hàm Thông báo Đăng nhập Thành công
  const showSuccessNotification = () => {
    notification.success({
      message: 'Đăng nhập thành công.',
      description: 'Chào mừng bạn đến với MechaWorld.',
      placement: 'topRight',
    });
  };

  const onFinish = async (values) => {
    try {
      const response = await loginEmail(values.email, values.password);
      console.log(response.data);

      // Lưu thông tin đăng nhập vào Cookie
      Cookies.set('access_token', response.data.access_token);
      Cookies.set('user', JSON.stringify(response.data.user), {
        expires: new Date(response.data.access_token_expires_at),
        path: "/",
      });

      dispatch(login(response.data));

      // Điều hướng trước rồi hiển thị thông báo
      showSuccessNotification();

      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      // Hiển thị thông báo thất bại
      setTimeout(() => {
        ShowErrorNotification(404, error.response.data.error || 404, error.response.data);
      }, 200);
    }
  };


  // Form Login Submit Failed
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {/* HEADER */}
      <header className="w-full bg-white py-3 px-40 flex justify-between items-center shadow">
        {/* Logo + Text */}
        <div className="flex items-center space-x-3">
          {/* Thay thế phần SVG bằng ảnh logo Shopee nếu bạn có file */}
          <div className="flex items-center text-blue-400 font-bold text-3xl space-x-4">
            <img src={Logo} alt="Ảnh Logo" className="w-14 h-14 rounded-full" />
            <p>MechaWorld</p>
          </div>
        </div>

        {/* Link trợ giúp */}
        <a href="/" className="text-blue-500 hover:text-blue-300">
          QUAY VỀ TRANG CHỦ?
        </a>
      </header>


      {/* CONTENT */}
      <div className="flex-1 bg-blue-400 flex justify-center items-center py-10">
        {/* Container chia layout 50:50 */}
        <div className="max-w-6xl w-full flex">
          {/* Cột bên trái: Logo và thông tin */}
          <div className="w-1/2 flex flex-col justify-center items-center text-white text-center px-8">
            <div>
              {/* SVG logo, có thể thay bằng ảnh thực nếu có */}
              <img src={Logo} alt="Ảnh Logo" className="w-96 h-96 rounded-full" />
            </div>
            <p className="text-2xl font-bold mt-2">
              Nền tảng GUNDAM thương mại điện tử <br /> lần đầu tiên có mặt tại Việt Nam.
            </p>
          </div>

          {/* Cột bên phải: Form đăng nhập */}
          <div className="w-1/2 flex justify-center items-center">
            <div className="relative z-10">
              <div className="bg-white shadow-lg rounded-3xl p-8 md:p-10">
                <Title level={2} className="text-center mb-6">Đăng Nhập</Title>

                <Form
                  form={form}
                  name="signin"
                  layout='vertical'
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email chưa đúng định dạng!" }
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                  >
                    <Input.Password size="large" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-blue-500 uppercase w-full"
                    >
                      Đăng nhập
                    </Button>
                  </Form.Item>
                </Form>

                <div className="flex items-center justify-between mt-6">
                  <span className="flex-1 border-t border-gray-300"></span>
                  <span className="mx-2 text-gray-400 uppercase text-sm">Hoặc</span>
                  <span className="flex-1 border-t border-gray-300"></span>
                </div>

                {/* Login By Google */}
                <div className="flex items-center justify-center mt-6">
                  <GoogleLogin
                    theme="filled_blue"
                    size="large"
                    shape="pill"
                    text="continue_with"
                    onSuccess={(credentialResponse) => {
                      handleCredentialResponse(credentialResponse);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </div>

                <div className="flex items-center justify-center mt-4">
                  <Text className="text-gray-500 mr-2">Bạn chưa có Tài khoản?</Text>
                  <NavLink
                    className="text-blue-500 text-xs uppercase hover:underline"
                    to="/member/signup"
                  >
                    Đăng ký ngay!
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* FOOTER */}
      <Footer />
    </>

  );
}
