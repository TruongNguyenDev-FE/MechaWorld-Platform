import Cookies from 'js-cookie';
import { Cropper } from 'react-cropper';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UploadOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Upload, Button, message, Modal, Row, Col } from 'antd';

import { updateUser } from '../../../features/auth/authSlice';
import { updateUserData, uploadAvatar } from '../../../apis/User/APIUser';
import { verifyToken, verifyOtp, verifyPhone } from '../../../apis/Authentication/APIAuth';

import "cropperjs/dist/cropper.css";


const ProfilePage = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(useSelector((state) => state.auth.user));
  const [avatar, setAvatar] = useState(user?.avatar_url);
  const [cropVisible, setCropVisible] = useState(false);
  const [cropper, setCropper] = useState(null);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const cropperRef = useRef(null);
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isCounting, setIsCounting] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState(user?.phone_number || "")

  const [step, setStep] = useState(1); // Step 1: Nhập SĐT, Step 2: Nhập OTP

  useEffect(() => {

    // const userData = Cookies.get("user");

    const Access_token = Cookies.get('access_token');
    if (Access_token) {
      try {
        verifyToken(Access_token).then(response => {
          // console.log(response.data);
          setUser(response.data);
          setAvatar(response.data.avatar_url);
          setFullName(response.data.full_name);
        })
      } catch (error) {
        console.error("Lỗi từ API:", error);
      }
    }
    const savedAvatar = localStorage.getItem("user_avatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);


  const dispatch = useDispatch();

  // Cập nhật các State khi user có thay đổi
  useEffect(() => {
    setNewPhoneNumber(user?.phone_number || "");
  }, [user]);

  const handleUpload = ({ file }) => {

    const reader = new FileReader();

    reader.onload = (e) => {

      const img = new Image();
      img.src = e.target.result;

      // console.log("img file data: ", file);

      img.onload = async () => {
        if (img.width > 400 || img.height > 400) {
          setCropVisible(true);
          setAvatar(e.target.result);
        } else {
          setAvatar(e.target.result);
          const response = await uploadAvatar(user.id, file);
          if (response.status === 200) {
            message.success("Đổi ảnh thành công!");
          } else {
            message.error("Vui lòng kiểm tra lại ảnh!");
          }
        }
      };
    };
    reader.readAsDataURL(file);
  };


  const handleCrop = async () => {

    if (cropper) {

      const croppedCanvas = cropper.getCroppedCanvas();

      if (!croppedCanvas) return;

      croppedCanvas.toBlob(async (blob) => {

        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        const response = await uploadAvatar(user.id, file);

        if (response.status === 200) {
          message.success("Đổi ảnh thành công!");
        } else {
          message.error("Vui lòng kiểm tra lại ảnh!");
        }

        const newAvatarURL = URL.createObjectURL(blob);
        setAvatar(newAvatarURL);

        // console.log("load thành công đến đây")

        localStorage.setItem("user_avatar", newAvatarURL);

        setCropVisible(false);
      }, "image/jpeg");
    }
  };


  //   const handleUpdateUser = async () => {
  //     if (!fullName.trim()) {
  //         message.error("Tên không được để trống!");
  //         return;
  //     }

  //     try {
  //         await updateUserData(user.id, fullName);
  //         const updatedUser = { ...user, full_name: fullName };
  //         setUser(updatedUser); // Cập nhật vào state
  //         dispatch(updateUserProfile(updatedUser)); // Cập nhật vào Redux
  //         message.success("Cập nhật thông tin thành công!");
  //     } catch (error) {
  //         message.error("Lỗi khi cập nhật tên người dùng.");
  //     }
  // };
  // const handleSendOtp = async () => {
  //     try {
  //       const response = await verifyPhone(user.phone_number);
  //       if (response.status === 200) {
  //         message.success("OTP đã được gửi!");
  //         setOtpVisible(true);
  //       }
  //     } catch (error) {
  //       message.error("Không thể gửi OTP! Vui lòng thử lại.");
  //     }
  //   };
  //   const handleOtp = (e) => {
  //     setOtp(e.target.value);
  //     console.log(e.target.value);
  //   }



  //   // Xác thực OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp(user.id, newPhoneNumber, otp);
      console.log("response", response);


      if (response.status === 200) {
        message.success("Xác thực thành công!");
        // console.log(otpVisible);
        setOtpVisible(false);
        setPhoneModalVisible(false);
        setStep(1);

        // Cập nhật thông tin người dùng với số điện thoại mới
        dispatch(updateUser({
          ...user,  // giữ lại các thông tin hiện có
          phone_number: newPhoneNumber  // cập nhật số điện thoại
        }));
        setUser({
          ...user,
          phone_number: newPhoneNumber
        });
      }

      if (response.status === 400) {
        message.error("OTP không đúng! Vui lòng kiểm tra lại.");
      }

    } catch (error) {
      message.error("Lỗi khi xác thực OTP.");
    }
  };


  const handlePhoneSubmit = async () => {
    if (!newPhoneNumber) {
      message.error("Vui lòng nhập số điện thoại!");
      return;
    }
    try {
      const response = await verifyPhone(newPhoneNumber);
      if (response.status === 200) {
        console.log("Gửi OTP thành công", response);
        message.success("OTP đã được gửi!");
        setStep(2); // Chuyển qua bước nhập OTP
        setOtpVisible(true);
        setIsCounting(true);
        setCountdown(60);
        startCountdown();
      }
    } catch (error) {
      message.error("Không thể gửi OTP! Vui lòng thử lại.");
    }
  };


  const startCountdown = () => {
    let timeLeft = 60;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft === 0) {
        clearInterval(interval);
        setIsCounting(false);
      }
    }, 1000);
  };


  const onFinish = (values) => {

    // console.log('Success:', values);
    updateUserData(user.id, fullName).then(response => {

      // console.log(response);

      if (response.status == 200) {
        message.success('Cập nhật thông tin thành công!');
      }
    }).catch(error => {
      return message.error(error);
    })

  };


  const maskPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
      return "Chưa đăng kí";
    }
    const visibleDigits = phoneNumber.slice(-4); // Lấy 4 số cuối
    const maskedDigits = "*".repeat(phoneNumber.length - 4); 
    return maskedDigits + visibleDigits; 
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
    <div className="container w-full p-10">
      <h2 className="text-2xl font-semibold">Hồ Sơ Của Tôi</h2>
      <p className="text-gray-500 mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      <div className="border-t-2 p-6">
        <Row ow gutter={24} align="middle">
          <Col span={14}>
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              className="max-w-lg"
            >
              {/* Tên tài khoản */}
              <Form.Item label="Tên tài khoản">
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </Form.Item>

              {/* Email */}
              <Form.Item label="Email">
                <div className="flex items-center">
                  <Input value={user.email} disabled className="bg-gray-100" />
                  <Button type="link" className="ml-2 text-blue-500">Thay Đổi</Button>
                </div>
              </Form.Item>

              {/* Số điện thoại */}
              <Form.Item label="Số điện thoại">
                <div className="flex items-center">
                  <Input value={maskPhoneNumber(user?.phone_number) || "Chưa đăng kí"} disabled className="bg-gray-100" />
                  <Button type="link" className="ml-2 text-blue-500" onClick={() => setPhoneModalVisible(true)}>{newPhoneNumber ? "Thay đổi" : "Đăng ký"}</Button>
                </div>
              </Form.Item>

              {/* Nút Lưu */}
              <Form.Item wrapperCol={{ offset: 6 }}>
                <Button type="primary" className="bg-blue-500 px-6 py-2 rounded text-white" onClick={onFinish}>
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </Col>

          <Modal
            open={phoneModalVisible}
            onCancel={() => {
              setPhoneModalVisible(false);
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
                      placeholder="Nhập số điện thoại"
                      value={newPhoneNumber}
                      onChange={(e) => setNewPhoneNumber(e.target.value)}
                      className="mb-1"
                    />
                    {!/^[0-9]{10}$/.test(newPhoneNumber) && newPhoneNumber &&
                      <div className="text-red-500 text-center text-sm mt-1">Số điện thoại không hợp lệ!</div>
                    }
                  </div>

                  <Button
                    type="primary"
                    className="w-full bg-blue-500 hover:bg-blue-600 h-10"
                    onClick={handlePhoneSubmit}
                    disabled={!/^[0-9]{10}$/.test(newPhoneNumber)}
                  >
                    Gửi mã OTP
                  </Button>
                </>
              )}

              {/* Nhập OTP */}
              {step === 2 && (
                <>
                  <LockOutlined className="text-4xl text-blue-500 mb-2" />
                  <p className="text-gray-600 text-base">Nhập mã OTP đã gửi đến <strong>{newPhoneNumber}</strong></p>
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
                    {isCounting ? (
                      `Gửi lại mã sau ${countdown}s`
                    ) : (
                      <Button type="link" onClick={handlePhoneSubmit}>
                        Gửi lại OTP
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </Modal>




          <Col span={10} className="flex flex-col items-center">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 border rounded-full overflow-hidden mb-4">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <Upload showUploadList={false} customRequest={handleUpload} accept="image/*">
                <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
              </Upload>
              <p className="text-gray-500 text-sm text-center mt-2">
                Dung lượng tối đa 1MB<br />Định dạng: JPEG, PNG
              </p>
            </div>
          </Col>
        </Row>
        {/* Modal Cropper */}
        <Modal
          open={cropVisible}
          onCancel={() => setCropVisible(false)}
          onOk={handleCrop}
          title="Cắt ảnh"
          // okButtonProps={{ styles:{ defaultHoverBorderColor}  }}
          footer={[
            <Button key="cancel" onClick={() => setCropVisible(false)} className="custom-cancel">
              Hủy
            </Button>,
            <Button
              key="crop"
              type="primary"
              onClick={handleCrop}
              className="bg-[#0056b3] hover:bg-[#4a90e2] text-white px-4 py-2 rounded"
            >
              Cắt ảnh
            </Button>,
          ]}>
          <Cropper
            ref={cropperRef}
            style={{ height: 300, width: "100%" }}
            aspectRatio={1}
            preview=".img-preview"
            src={avatar}
            viewMode={1}
            minCropBoxHeight={100}
            minCropBoxWidth={100}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            onInitialized={(instance) => setCropper(instance)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;