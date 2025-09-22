import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Form, message, notification, Steps, Card, Button, Space, Breadcrumb } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, CheckCircleOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons';

import { GetGrades } from '../../../apis/Gundams/APIGundam';
import { PostGundam } from "../../../apis/User/APIUser";

// Import các components con
import BasicInfoStep from "./FormSteps/BasicInfoStep";
import ConditionVersionStep from "./FormSteps/ConditionVersionStep";
import ImagesAndPriceStep from "./FormSteps/ImagesAndPriceStep";

const { Step } = Steps;

const ShopProductCreate = ({ setIsCreating, gundamData}) => {
  const [form] = Form.useForm();
  const user = JSON.parse(Cookies.get("user"));
  const [condition, setCondition] = useState("");
  const [grades, setGrades] = useState([]);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [secondaryImages, setSecondaryImages] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState(null);

  // Tạo array năm phát hành từ 1980 đến năm hiện tại
  const currentYear = new Date().getFullYear();
  const releaseYearOptions = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear - i);

  useEffect(() => {
    GetGrades()
      .then((response) => {
        setGrades(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách phân khúc:", error);
      });
  }, []);

  const handleAddAccessory = () => {
    setAccessories([...accessories, { name: "", quantity: 1 }]);
  };

  const handleRemoveAccessory = (index) => {
    setAccessories(accessories.filter((_, i) => i !== index));
  };

  const handleAccessoryChange = (index, field, value) => {
    const newAccessories = [...accessories];
    newAccessories[index][field] = value;
    setAccessories(newAccessories);
  };

  const handleVersionSelect = (versionId) => {
    setSelectedVersion(versionId);
    form.setFieldsValue({ version: versionId });
  };

  // Validate form theo từng bước
  const validateStep = async () => {
    try {
      let fieldsToValidate = [];

      switch (currentStep) {
        case 0:
          // Bước 1: Thông tin cơ bản
          fieldsToValidate = ['name', 'series', 'grade_id', 'scale', 'parts_total', 'material', 'manufacturer'];
          break;
        case 1:
          // Bước 2: Tình trạng & Phiên bản
          fieldsToValidate = ['version', 'condition', 'release_year', 'description'];
          if (condition === 'open box' || condition === 'used') {
            fieldsToValidate.push('condition_description');
          }
          break;
        case 2:
          // Bước 3: Ảnh & giá bán
          fieldsToValidate = ['price', 'weight'];
          // Kiểm tra ảnh
          if (!primaryImage) {
            message.error("Vui lòng tải lên ảnh chính của sản phẩm!");
            return false;
          }
          break;
        default:
          break;
      }

      await form.validateFields(fieldsToValidate);
      return true;
    } catch (error) {
      console.log('Validation error:', error);
      return false;
    }
  };

  // Next step
  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinish = async () => {
    const isValid = await validateStep();
    if (!isValid) {
      return;
    }

    const values = form.getFieldsValue(true);
    setIsUploading(true);

    // const hideLoading = message.loading("Đang xử lý...", 0);
    const formData = new FormData();

    // Thêm các trường cơ bản
    formData.append("name", values.name?.trim() || '');
    formData.append("grade_id", values.grade_id);
    formData.append("series", values.series);
    formData.append("condition", values.condition);
    formData.append("manufacturer", values.manufacturer?.trim() || '');
    formData.append("parts_total", values.parts_total);
    formData.append("material", values.material?.trim() || '');
    formData.append("scale", values.scale);
    formData.append("version", values.version);
    formData.append("release_year", values.release_year || "");
    formData.append("weight", values.weight);
    formData.append("description", values.description?.trim() || '');
    formData.append("price", values.price);

    if (values.condition_description && values.condition_description.trim() !== "") {
      formData.append("condition_description", values.condition_description.trim());
    }

    // Thêm ảnh chính
    formData.append("primary_image", primaryImage.file);

    // Thêm các ảnh phụ
    secondaryImages.forEach((file) => {
      formData.append("secondary_images", file.originFileObj);
    });

    // Thêm phụ kiện
    const validAccessories = accessories.filter(
      (item) => item.name.trim() !== "" && item.quantity > 0
    );
    validAccessories.forEach((item) => {
      const accessoryData = JSON.stringify({
        name: item.name.trim(),
        quantity: item.quantity
      });
      formData.append("accessory", accessoryData);
    });

    PostGundam(user.id, formData)
      .then((response) => {
        // hideLoading();
        if (response.status === 201) {
          notification.success({
            message: "Thêm thành công Gundam!",
            description: "Sản phẩm đã được thêm vào kho của bạn.",
            duration: 2
          });
          form.resetFields();
          setPrimaryImage(null);
          setSecondaryImages([]);
          setTimeout(() => setIsCreating(false), 800);
        }
      })
      .catch((error) => {
        // hideLoading();
        console.error("Error details:", error);
        message.error("Lỗi khi đăng ký sản phẩm! Vui lòng thử lại.");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // Nội dung các bước
  const steps = [
    {
      title: 'Thông tin cơ bản',
      content: (
        <BasicInfoStep
          form={form}
          grades={grades}
        />
      ),
    },
    {
      title: 'Tình trạng & Phiên bản',
      content: (
        <ConditionVersionStep
          form={form}
          condition={condition}
          setCondition={setCondition}
          releaseYearOptions={releaseYearOptions}
          selectedVersion={selectedVersion}
          handleVersionSelect={handleVersionSelect}
          accessories={accessories}
          handleAddAccessory={handleAddAccessory}
          handleRemoveAccessory={handleRemoveAccessory}
          handleAccessoryChange={handleAccessoryChange}
        />
      ),
    },
    {
      title: 'Ảnh & giá bán',
      content: (
        <ImagesAndPriceStep
          form={form}
          primaryImage={primaryImage}
          setPrimaryImage={setPrimaryImage}
          secondaryImages={secondaryImages}
          setSecondaryImages={setSecondaryImages}
        />
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mx-auto">

      <h2 className="text-2xl font-semibold text-gray-800 pb-3 uppercase mb-6 border-b">Thêm Sản Phẩm Gundam Mới</h2>

      <Steps current={currentStep} className="mb-8">
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="vertical"
        validateTrigger={["onBlur", "onChange"]}
        className="mt-4"
      >
        <Card className="mb-6">
          {steps[currentStep].content}
        </Card>

        <div className="flex justify-between mt-4">
          <div>
            {currentStep > 0 && (
              <Button
                onClick={prevStep}
                icon={<ArrowLeftOutlined />}
                disabled={isUploading}
              >
                Quay lại
              </Button>
            )}
          </div>
          <div>
            {currentStep < steps.length - 1 && (
              <Space>
                <Button
                  onClick={() => setIsCreating(false)}
                  disabled={isUploading}
                >
                  Hủy 
                </Button>
                <Button
                  type="primary"
                  onClick={nextStep}
                  className="bg-blue-500"
                >
                  Tiếp theo <ArrowRightOutlined />
                </Button>
              </Space>
            )}
            {currentStep === steps.length - 1 && (
              <Space>
                <Button
                  type="primary"
                  onClick={handleFinish}
                  className="bg-green-600 hover:bg-green-500"
                  icon={<CheckCircleOutlined />}
                  disabled={isUploading}
                  loading={isUploading}
                >
                  {isUploading ? "Đang tiến hành thêm..." : "Thêm sản phẩm"}
                </Button>
              </Space>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

ShopProductCreate.propTypes = {
  setIsCreating: PropTypes.func.isRequired,
  gundamData: PropTypes.object
};

export default ShopProductCreate;