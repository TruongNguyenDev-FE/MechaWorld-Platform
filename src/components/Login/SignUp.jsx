import { useState } from "react";
import { Form, Input, Button, Typography, Steps, message, Modal, notification } from "antd";
import { NavLink } from "react-router-dom";
import { sendOTPEmail, signupEmail, verifyEmail, checkEmail } from "../../apis/Authentication/APIAuth";

import Footer from "../../layouts/Footer";
import Logo from '../../assets/image/logo4.png';

export default function SignUp() {
    const [form] = Form.useForm();
    const [otpForm] = Form.useForm();
    const { Title, Text } = Typography;

    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [verifiedEmail, setVerifiedEmail] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);


    // Hàm Nhập Email để nhận OTP xác thực
    const sendOTP = async (email) => {
        setLoading(true);
        try {
            // Kiểm tra xem email đã được nhập hay chưa
            const emailCheck = await checkEmail(email);
            // API call để gửi OTP
            // console.log("emailCheck", emailCheck);

            if (emailCheck?.data?.exists === true) {
                notification.error({
                    message: 'Đăng ký không hợp lệ.',
                    description: 'Email đã tồn tại. Vui lòng chọn email khác!'
                });
                return;
            }

            await sendOTPEmail(email);
            // console.log("Đã gửi OTP đến email:", response);

            // Giả lập thành công
            message.success(`Mã OTP đã được gửi đến ${email}`);
            setVerifiedEmail(email);

            // Bắt đầu đếm ngược 60 giây
            setCountdown(60);
            const timer = setInterval(() => {
                setCountdown(prevCount => {
                    if (prevCount <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prevCount - 1;
                });
            }, 1000);

        } catch (error) {
            console.error("Lỗi khi gửi OTP:", error);
            message.error("Có lỗi xảy ra khi gửi mã OTP. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm Xác Thực OTP
    const verifyOTP = async (values) => {
        setLoading(true);
        try {
            // Đảm bảo OTP là string
            const otpString = String(values?.otp);

            // API call để xác thực OTP
            await verifyEmail(verifiedEmail, otpString);

            // Giả lập thành công
            message.success("Xác thực email thành công!");
            setCurrentStep(1); // Chuyển đến bước tiếp theo
        } catch (error) {
            console.error("Lỗi khi xác thực OTP:", error);
            message.error("Mã OTP không chính xác. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };


    // Gửi lại OTP
    const resendOTP = () => {
        if (countdown === 0 && verifiedEmail) {
            sendOTP(verifiedEmail);
        }

    };


    // Xử lý submitting form email
    const onFinishEmail = (values) => {
        sendOTP(values?.email);
    };


    // Hàm xử lý Đăng ký
    const onFinishSignUp = async (values) => {
        // console.log("Submited Form đăng ký:", values);
        // console.log("verifiedEmail:", verifiedEmail);
        setLoading(true);
        try {
            if (values.password !== values["re-password"]) {
                message.error("Mật khẩu và nhập lại mật khẩu không khớp!");
                return;
            }

            await signupEmail(
                verifiedEmail,           // email
                values?.fullname,        // full_name
                values?.password         // password
            );
            setModalVisible(true);
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            message.error("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };


    // Validate email
    const validateEmail = (_, value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || emailRegex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Email không hợp lệ!'));
    };

    // Render form email và OTP
    const renderEmailVerification = () => (
        <>
            {/* {verifiedEmail && !countdown ? ( */}
            {verifiedEmail ? (
                <Form
                    form={otpForm}
                    name="otp-verification"
                    layout="vertical"
                    onFinish={verifyOTP}
                    style={{ width: 310 }}
                >
                    <Form.Item
                        name="otp"
                        label="Mã OTP"
                        rules={[
                            { required: true, message: "Vui lòng nhập mã OTP!" },
                            { pattern: /^[0-9]{6}$/, message: "OTP phải gồm 6 chữ số!" }
                        ]}
                    >
                        <Input.OTP size="large" placeholder="Nhập mã OTP 6 số" maxLength={6} />
                    </Form.Item>

                    <div className="text-sm mb-4">
                        <p>Mã OTP đã được gửi đến: <strong>{verifiedEmail}</strong></p>
                        <Button
                            type="link"
                            className="p-0"
                            onClick={resendOTP}
                            disabled={countdown > 0}
                        >
                            Gửi lại mã OTP {countdown > 0 ? `(${countdown}s)` : ''}
                        </Button>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="bg-blue-500 w-full"
                        >
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <Form
                    name="email-verification"
                    layout="vertical"
                    onFinish={onFinishEmail}
                    style={{ width: 310 }}
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { validator: validateEmail }
                        ]}
                    >
                        <Input size="large" placeholder="Nhập email của bạn" />
                    </Form.Item>

                    {verifiedEmail && countdown > 0 && (
                        <div className="text-sm mb-4">
                            <p>Mã OTP đã được gửi đến: <strong>{verifiedEmail}</strong></p>
                            <p>Vui lòng đợi {countdown}s để gửi lại mã</p>
                        </div>
                    )}

                    {verifiedEmail && (
                        <div className="text-sm mb-4">
                            <p>Mã OTP đã được gửi đến: <strong>{verifiedEmail}</strong></p>
                            <p>Vui lòng đợi ... để gửi lại mã</p>
                        </div>
                    )}

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="bg-blue-500 uppercase w-full"
                        >
                            {verifiedEmail ? "Gửi lại mã OTP" : "Gửi mã xác thực"}
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </>
    );

    // Render form đăng ký
    const renderSignUpForm = () => (
        <Form
            form={form}
            name="signup"
            layout="vertical"
            onFinish={onFinishSignUp}
            style={{ width: 310 }}
            autoComplete="off"
        >
            <Form.Item
                name="fullname"
                label="Tên người dùng"
                rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
            >
                <Input size="large" />
            </Form.Item>

            <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                    {
                        pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                        message: (
                            <>
                                Mật khẩu phải chứa ít nhất 1 chữ hoa <br />
                                Mật khẩu phải chứa ít nhất 1 chữ số <br />
                                Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt!
                            </>
                        ),
                    }
                ]}
            >
                <Input.Password size="large" />
            </Form.Item>


            <Form.Item
                name="re-password"
                label="Nhập lại mật khẩu"
                rules={[
                    { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu không khớp!'));
                        },
                    }),
                ]}
            >
                <Input.Password size="large" />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="bg-blue-500 uppercase w-full"
                >
                    Đăng ký
                </Button>
            </Form.Item>
        </Form>
    );

    return (
        <>
            {/* HEADER */}
            <header className="w-full bg-white py-3 px-40 flex justify-between items-center shadow">
                {/* Logo + Text */}
                <div className="flex items-center space-x-3">
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
                                <Title level={2} className="text-center mb-6">Đăng Ký</Title>

                                <Steps
                                    current={currentStep}
                                />

                                {currentStep === 0 ? renderEmailVerification() : renderSignUpForm()}

                                <div className="flex items-center justify-center mt-4">
                                    <Text className="text-gray-500 mr-2">Đã có Tài khoản ?</Text>
                                    <NavLink
                                        className="text-blue-500 text-xs uppercase hover:underline"
                                        to="/member/login"
                                    >
                                        Quay lại Đăng nhập!
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal thông báo đăng ký thành công */}
            <Modal
                title="ĐĂNG KÝ TÀI KHOẢN THÀNH CÔNG"
                open={modalVisible}
                width={600}
                footer={[
                    <Button
                        key="login"
                        type="primary"
                        onClick={() => window.location.href = '/member/login'}
                        className="bg-blue-500"
                    >
                        Đăng nhập ngay!
                    </Button>
                ]}
                onCancel={() => window.location.href = '/member/login'}
            >
                <p className="text-base">Chúc mừng! Bạn đã đăng ký tài khoản thành công với email: <strong>{verifiedEmail}</strong></p>
                <p className="text-base">Hãy đăng nhập để bắt đầu trải nghiệm MechaWorld!</p>
            </Modal>

            {/* FOOTER */}
            <Footer />
        </>
    );
}