import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, message, Modal } from "antd";
import { PhoneOutlined, LockOutlined } from "@ant-design/icons";

import { updateUser } from "../../features/auth/authSlice";
import { verifyToken, verifyOtp, verifyPhone } from '../../apis/Authentication/APIAuth';
import { GetShopInfoById } from '../../apis/Seller Profile/APISellerProfile';
import { GetUserByPhone } from '../../apis/User/APIUser';

const FirstForm = ({ form, setIsPhoneVerified }) => {

    const user = useSelector((state) => state.auth.user);
    const vietnamPhoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

    const [email, setEmail] = useState(user?.email || "");
    const [shopName, setShopName] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState(user?.phone_number || "");
    const [shopExists, setShopExists] = useState(false); // Trạng thái để biết shop đã tồn tại hay chưa

    const [phoneNumber, setPhoneNumber] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [step, setStep] = useState(1); // Step 1: Nhập SĐT, Step 2: Nhập OTP

    const [otp, setOtp] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [otpVisible, setOtpVisible] = useState(false);

    const [countdown, setCountdown] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);


    const dispatch = useDispatch();

    // Cập nhật các State khi user có thay đổi
    useEffect(() => {
        setEmail(user?.email || "");
        setNewPhoneNumber(user?.phone_number || "");
    }, [user]);


    // Lấy Thông tin User từ Cookie
    useEffect(() => {
        const access_token = Cookies.get('access_token');
        if (access_token) {
            try {
                verifyToken(access_token).then(response => {
                    // console.log("Data user", response.data);

                    setEmail(response.data.email);
                    // setFullName(response.data.full_name);
                    setNewPhoneNumber(response.data.phone_number);

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


    // Hàm xử lý Thay đổi tên Shop
    useEffect(() => {
        if (user) {
            // form.setFieldsValue({ full_name: user?.shop_name });
            form.setFieldsValue({ email: user?.email });
        }
    }, [user, form]);


    // Hàm Kiểm tra ID user xem đã là Shop chưa, nếu chưa thì TextBox để trống. và Gọi hàm Create Shop Name
    // Fetch Shop Info

    // Kiểm tra xem user đã có Shop chưa
    const shopID = user?.id;

    useEffect(() => {
        if (!shopID) return;

        const fetchShopInfo = async () => {
            try {
                const response = await GetShopInfoById(shopID);
                // console.log("Shop:", response);
                if (response?.data?.shop_name) {
                    setShopName(response.data.shop_name);
                    setShopExists(true); // Đánh dấu đã có shop
                    form.setFieldsValue({ shop_name: response.data.shop_name }); // Đặt giá trị vào form
                }
            } catch (error) {
                console.log("Shop chưa tồn tại:", error);
                setShopExists(false); // Đánh dấu chưa có shop
                form.setFieldsValue({ shop_name: "" }); // Đặt giá trị trống vào form
            }
        };

        fetchShopInfo();
    }, [shopID, form]);

    // Hàm xử lý khi tên shop thay đổi
    const handleNameChange = (e) => {
        setShopName(e.target.value);
        form.setFieldsValue({ shop_name: e.target.value }); // Cập nhật giá trị vào form
    };

    // Nếu shop đã tồn tại và người dùng thay đổi tên, thì cập nhật tên shop
    useEffect(() => {
        // Lưu thông tin tên shop ban đầu để so sánh khi có thay đổi
        const originalShopName = form.getFieldValue('shop_name');

        return () => {
            // Trong cleanup function, kiểm tra xem tên shop có thay đổi không
            if (shopExists && originalShopName !== form.getFieldValue('shop_name')) {
                // Nếu có thay đổi, sẽ được xử lý trong component cha khi người dùng nhấn "Tiếp theo"
                console.log("Tên shop đã thay đổi, sẽ được cập nhật khi tiếp tục");
            }
        };
    }, [shopExists, form]);


    //  Check User Detail by phone
    const CheckIfUserExisted = async () => {
        const response = await GetUserByPhone(phoneNumber);
        // console.log(response);
        return response;
    };

    // Gửi OTP
    const handleSendOtp = async () => {
        // Validate Ko nhập Sđt
        if (!phoneNumber) {
            message.error("Vui lòng nhập số điện thoại!");
            return;
        }

        // Validate Nhập Sđt không hợp lệ
        const vietnamPhoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
        if (!vietnamPhoneRegex.test(phoneNumber)) {
            message.error("Số điện thoại không hợp lệ!");
            return;
        }

        try {
            // ✅ PHẢI GỌI FUNCTION VÀ AWAIT
            const userExistResponse = await CheckIfUserExisted();

            // Kiểm tra sđt tồn tại
            if (userExistResponse.status === 200) {
                message.error("Số điện thoại đã tồn tại.");
                return;
            }
        } catch (error) {
            // Nếu API trả về lỗi 404 (không tìm thấy user) thì OK để tiếp tục
            if (error.response?.status !== 404) {
                message.error("Lỗi khi kiểm tra số điện thoại!");
                return;
            }
            // Nếu 404 thì có nghĩa là số điện thoại chưa tồn tại, tiếp tục gửi OTP
        }

        // Tiếp tục gửi OTP nếu số điện thoại chưa tồn tại
        try {
            const response = await verifyPhone(phoneNumber);
            const otpValue = response.data.otp_code;

            setOtpCode(otpValue);

            if (response.status === 200) {
                setStep(2);
                message.success('Mã OTP đã gửi thành công. Vui lòng kiểm tra tin nhắn.')
                setOtpVisible(true);
                setIsResendDisabled(true);
                setCountdown(60);
                const interval = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev === 1) {
                            clearInterval(interval);
                            setIsResendDisabled(false);
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        } catch (error) {
            message.error("Không thể gửi OTP! Vui lòng thử lại.");
        }
    };


    // Hàm xác thực OTP
    const handleVerifyOtp = async () => {
        // console.log("📩 Đã gọi handleVerifyOtp");
        // console.log("🔢 OTP hiện tại:", otp);

        if (!otp) {
            message.error("Vui lòng nhập mã OTP!");
            return;
        }

        try {
            const response = await verifyOtp(user?.id, phoneNumber, otp);
            console.log("✅ Xác thực OTP Response:", response);

            if (response.status === 200) {
                message.success("Xác thực OTP thành công!");
                setOtpVisible(false);
                setModalVisible(false); // Đảm bảo đúng cách đóng modal
                setIsPhoneVerified(true);
                setOtp("");
                setStep(1);

                // Cập nhật thông tin người dùng với số điện thoại mới
                dispatch(updateUser({
                    ...user,  // giữ lại các thông tin hiện có
                    phone_number: phoneNumber  // cập nhật số điện thoại
                }));

            }
        } catch (error) {
            const statusCode = error.response?.status || error.status;
            switch (statusCode) {
                case 400:
                    message.error("Mã OTP không hợp lệ hoặc đã hết hạn.");
                    break;

                case 401:
                    message.error("Không có quyền truy cập. Vui lòng đăng nhập lại.");
                    break;

                default:
                    // console.error("OTP verification error:", error);
                    message.error("Lỗi khi xác thực OTP. Vui lòng thử lại sau.");
                    break;
            }
        }
    };

    const prefixSelector = (
        <div className="bg-gray-100 border-r border-gray-300 px-2 mr-2 flex items-center h-full">
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
                alt="Vietnam flag"
                className="w-5 h-3 mr-1"
            />
            (+84)
        </div>
    );

    return (
        <>
            <div className="max-w-2xl mx-auto space-y-4 gap-4">

                <div className="first-form-header">
                    <h2 className="text-xl font-bold">NHẬP THÔNG TIN CỦA SHOP</h2>
                    <p className="text-gray-500">
                        Vui lòng cung cấp đầy đủ thông tin cửa hàng của bạn.
                        Những thông tin này sẽ giúp khách hàng dễ dàng nhận diện và tìm kiếm SHOP của bạn trên nền tảng.
                    </p>
                    {/* <p className="text-red-500 mt-2 italic text-sm">Lưu ý: Tài khoản người dùng và tài khoản Shop sẽ có cùng sử dụng một tên duy nhất.</p> */}
                </div>

                {/* Input shop name */}
                <Form.Item
                    label="Tên cửa hàng"
                    name="shop_name"
                    rules={[{ required: true, message: "Vui lòng nhập tên Shop sử dụng!" }]}
                >
                    <Input
                        value={shopName}
                        onChange={handleNameChange}
                        placeholder={shopExists ? "Cập nhật tên Shop" : "Nhập tên Shop mới"}
                    />
                </Form.Item>

                {/* Disply email */}
                <Form.Item
                    label={<span className="font-semibold">Email</span>}
                    name="email"
                    required
                >
                    <Input disabled value={email} />
                </Form.Item>

                {/* Display Phone Number */}
                <Form.Item
                    label={<span className="font-semibold">Số điện thoại</span>}
                    required
                >
                    <div className="flex items-center">
                        {newPhoneNumber ? (
                            <>
                                <span className="">{newPhoneNumber}</span>
                                <Button type="link" className="underline" onClick={() => setModalVisible(true)}>
                                    Thay Đổi
                                </Button>
                            </>
                        ) : (
                            <Button type="link" className="text-blue-500 underline" onClick={() => setModalVisible(true)}>
                                Thêm mới
                            </Button>
                        )}
                    </div>
                </Form.Item>


                <Modal
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        setStep(1);
                    }}
                    footer={null}
                    width={450}
                    centered
                    title={
                        <div className="text-center font-semibold text-lg">
                            {step === 1 ? "Cập nhật số điện thoại" : "Xác Thực Mã OTP"}
                        </div>
                    }
                >
                    <div className="text-center space-y-4">
                        {/* Nhập Số Điện Thoại */}
                        {step === 1 && (
                            <>
                                <div className="flex flex-col items-center mb-4">
                                    <div className="bg-blue-100 p-3 rounded-full mb-2">
                                        <PhoneOutlined className="text-3xl text-blue-500" />
                                    </div>
                                    <p className="text-gray-600 mb-4">Vui lòng nhập số điện thoại để <br /> nhận mã kích hoạt OTP!</p>
                                </div>

                                <div className="mb-4">
                                    <Input
                                        addonBefore={prefixSelector}
                                        size="large"
                                        placeholder="Nhập số điện thoại (VD: 0912345678)"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="mb-1"
                                        maxLength={10}
                                    />
                                    {!vietnamPhoneRegex.test(phoneNumber) && phoneNumber &&
                                        <div className="text-red-500 text-center text-sm mt-1">
                                            Số điện thoại không hợp lệ!
                                        </div>
                                    }
                                </div>

                                <Button
                                    type="primary"
                                    className="w-full bg-blue-500 hover:bg-blue-600 h-10"
                                    onClick={handleSendOtp}
                                    disabled={!vietnamPhoneRegex.test(phoneNumber)}
                                >
                                    Gửi mã OTP
                                </Button>
                            </>
                        )}

                        {/* Nhập OTP */}
                        {step === 2 && (
                            <>
                                <LockOutlined className="text-4xl text-blue-500 mb-2" />
                                <p className="text-gray-600 text-base">Nhập mã OTP đã gửi đến <strong>{phoneNumber}</strong></p>
                                <Input.OTP
                                    size="large"
                                    placeholder="Nhập mã OTP"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(value) => setOtp(value)}
                                />
                                <Button
                                    type="primary"
                                    className="w-full bg-blue-500"
                                    onClick={handleVerifyOtp}
                                >
                                    Xác thực OTP
                                </Button>
                                <div className="text-gray-500 text-sm mt-2">
                                    {isResendDisabled ? (
                                        `Gửi lại mã sau ${countdown}s`
                                    ) : (
                                        <Button type="link" onClick={handleSendOtp}>
                                            Gửi lại OTP
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default FirstForm;
