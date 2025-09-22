import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Form, message, notification, Steps, Card, Button, Space } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, CheckCircleOutlined,   } from '@ant-design/icons';

import { AddSecondaryImages, GetGrades, UpdateGundam, UpdateGundamAccessories, UpdatePrimaryImage } from '../../../apis/Gundams/APIGundam';
import { PostGundam } from "../../../apis/User/APIUser";

// Import các components con
import BasicInfoStep from "./FormSteps/BasicInfoStep";
import ConditionVersionStep from "./FormSteps/ConditionVersionStep";
import ImagesAndPriceStep from "./FormSteps/ImagesAndPriceStep";

const { Step } = Steps;

const ShopProductUpdate = ({ setIsUpdating, gundamData}) => {
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
  useEffect(() => {
  if (gundamData && grades.length > 0) {
    // Tìm grade_id dựa trên display_name nếu cần
    let grade_id = gundamData.grade_id;
    if (!grade_id && gundamData.grade) {
      const found = grades.find(g => g.display_name === gundamData.grade);
      grade_id = found ? found.id : undefined;
    }
    form.setFieldsValue({
      ...gundamData,
      grade_id: grade_id,
    });
    if (gundamData.primary_image_url) {
      setPrimaryImage({ url: gundamData.primary_image_url });
    }
    
    if (Array.isArray(gundamData.secondary_image_urls)) {
      setSecondaryImages(
        gundamData.secondary_image_urls.map((url, idx) => ({
          uid: `init-url-${idx}`,
          url,
          name: `Ảnh phụ ${idx + 1}`,
          status: "done"
        }))
      );
    }
    if (gundamData.accessories) setAccessories(gundamData.accessories);
    if (gundamData.condition) setCondition(gundamData.condition);
    if (gundamData.version) setSelectedVersion(gundamData.version);
  }
}, [gundamData, grades]);
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
  if (!isValid) return;

  const values = form.getFieldsValue(true);
  setIsUploading(true);

  try {
    // 1. Update thông tin cơ bản
    const basicInfo = {
      name: values.name?.trim() || '',
      grade_id: values.grade_id,
      series: values.series,
      condition: values.condition,
      manufacturer: values.manufacturer?.trim() || '',
      parts_total: values.parts_total,
      material: values.material?.trim() || '',
      scale: values.scale,
      version: values.version,
      release_year: values.release_year || "",
      weight: values.weight,
      description: values.description?.trim() || '',
      price: values.price,
      status: gundamData.status || "published",
    };
    if (values.condition_description && values.condition_description.trim() !== "") {
      basicInfo.condition_description = values.condition_description.trim();
    }

    await UpdateGundam(gundamData.gundam_id, user.id, basicInfo);

    // 2. Update phụ kiện
    const validAccessories = accessories.filter(
      (item) => item.name.trim() !== "" && item.quantity > 0
    );
    await UpdateGundamAccessories(gundamData.gundam_id, user.id, validAccessories);

    // 3. Update ảnh chính (nếu có file mới)
    if (primaryImage && primaryImage.file) {
      const formData = new FormData();
      formData.append("primary_image", primaryImage.file);
      await UpdatePrimaryImage(gundamData.gundam_id, user.id, formData);
    }

    // 4. Update ảnh phụ (chỉ gửi file mới)
    const newSecondaryFiles = secondaryImages.filter(img => img.originFileObj);
    if (newSecondaryFiles.length > 0) {
      const formData = new FormData();
      newSecondaryFiles.forEach(file => {
        formData.append("images", file.originFileObj);
      });
      await AddSecondaryImages(gundamData.gundam_id, user.id, formData);
    }

    notification.success({
      message: "Cập nhật thành công Gundam!",
      description: "Sản phẩm đã được cập nhật.",
      duration: 2
    });
    form.resetFields();
    setPrimaryImage(null);
    setSecondaryImages([]);
    setTimeout(() => setIsUpdating(false), 800);
  } catch (error) {
    console.error("Error details:", error);
    message.error("Lỗi khi cập nhật sản phẩm! Vui lòng thử lại.");
  } finally {
    setIsUploading(false);
  }
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
    <div className="bg-white max-w-7xl mt-36 p-6 rounded-lg shadow-sm mx-auto">

      <h2 className="text-2xl font-semibold text-gray-800 pb-3 uppercase mb-6 border-b">Cập Nhập Sản Phẩm Gundam </h2>

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
                  onClick={() => setIsUpdating(false)}
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
                  {isUploading ? "Đang tiến hành cập nhật..." : "Cập nhật sản phẩm"}
                </Button>
              </Space>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

ShopProductUpdate.propTypes = {
  setIsUpdating: PropTypes.func.isRequired,
  gundamData: PropTypes.object
};

export default ShopProductUpdate;