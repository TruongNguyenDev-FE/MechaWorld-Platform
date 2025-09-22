import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Form, message, notification, Steps, Card, Button, Space } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';

import { GetGrades } from '../../../apis/Gundams/APIGundam';
import { PostGundam } from "../../../apis/User/APIUser";

// Import các components con
import BasicInfoStep from "./FormSteps/BasicInfoStep";
import ConditionVersionStep from "./FormSteps/ConditionVersionStep";
import ImagesAndPriceStep from "./FormSteps/ImagesAndPriceStep";

const { Step } = Steps;

const AddCollection = ({ setIsCreating }) => {
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

  const series = [
    { id: "Mobile Suit Gundam", name: "Mobile Suit Gundam" },
    { id: "Mobile Suit Zeta Gundam", name: "Mobile Suit Zeta Gundam" },
    { id: "Mobile Suit Gundam ZZ", name: "Mobile Suit Gundam ZZ" },
    { id: "Mobile Suit Victory Gundam", name: "Mobile Suit Victory Gundam" },
    { id: "Mobile Fighter G Gundam", name: "Mobile Fighter G Gundam" },
    { id: "Mobile Suit Gundam Wing", name: "Mobile Suit Gundam Wing" },
    { id: "After War Gundam X", name: "After War Gundam X" },
    { id: "Turn A Gundam", name: "Turn A Gundam" },
    { id: "Mobile Suit Gundam SEED", name: "Mobile Suit Gundam SEED" },
    { id: "Superior Defender Gundam Force", name: "Superior Defender Gundam Force" },
    { id: "Mobile Suit Gundam SEED Destiny", name: "Mobile Suit Gundam SEED Destiny" },
    { id: "Mobile Suit Gundam 00", name: "Mobile Suit Gundam 00" },
    { id: "SD Gundam Sangokuden Brave Battle Warriors", name: "SD Gundam Sangokuden Brave Battle Warriors" },
    { id: "Model Suit Gunpla Builders Beginning G", name: "Model Suit Gunpla Builders Beginning G" },
    { id: "Mobile Suit Gundam AGE", name: "Mobile Suit Gundam AGE" },
    { id: "Gundam Build Fighters", name: "Gundam Build Fighters" },
    { id: "Mobile Suit Gundam-san", name: "Mobile Suit Gundam-san" },
    { id: "Gundam Reconguista in G", name: "Gundam Reconguista in G" },
    { id: "Gundam Build Fighters Try", name: "Gundam Build Fighters Try" },
    { id: "Mobile Suit Gundam: Iron-Blooded Orphans", name: "Mobile Suit Gundam: Iron-Blooded Orphans" },
    { id: "Gundam Build Divers", name: "Gundam Build Divers" },
    { id: "SD Gundam World Sangoku Soketsuden", name: "SD Gundam World Sangoku Soketsuden" },
    { id: "Gundam Build Divers Re:Rise", name: "Gundam Build Divers Re:Rise" },
    { id: "SD Gundam World Heroes", name: "SD Gundam World Heroes" },
    { id: "Mobile Suit Gundam: The Witch from Mercury", name: "Mobile Suit Gundam: The Witch from Mercury" },
    { id: "Mobile Suit Gundam GQuuuuuuX", name: "Mobile Suit Gundam GQuuuuuuX" },
    { id: "Mobile Suit Gundam (Compilation Movies)", name: "Mobile Suit Gundam (Compilation Movies)" },
    { id: "Mobile Suit Gundam: Char's Counterattack", name: "Mobile Suit Gundam: Char's Counterattack" },
    { id: "Mobile Suit SD Gundam (Movies)", name: "Mobile Suit SD Gundam (Movies)" },
    { id: "Mobile Suit Gundam 0080: War in the Pocket", name: "Mobile Suit Gundam 0080: War in the Pocket" },
    { id: "Mobile Suit SD Gundam (OVA)", name: "Mobile Suit SD Gundam (OVA)" },
    { id: "Mobile Suit Gundam F91 (1991)", name: "Mobile Suit Gundam F91 (1991)" },
    { id: "Mobile Suit Gundam 0083: Stardust Memory (OVA)", name: "Mobile Suit Gundam 0083: Stardust Memory (OVA" },
    { id: "Mobile Suit Gundam 0083: Stardust Memory (Compilation Movie)", name: "Mobile Suit Gundam 0083: Stardust Memory (Compilation Movie)" },
    { id: "Gundam Wing: Endless Waltz (OVA/Movie)", name: "Gundam Wing: Endless Waltz (OVA/Movie)" },
    { id: "Turn A Gundam (Compilation Movies)", name: "Turn A Gundam (Compilation Movies)" },
    { id: "Mobile Suit Zeta Gundam: A New Translation (Compilation Movies)", name: "Mobile Suit Zeta Gundam: A New Translation (Compilation Movies)" },
    { id: "Mobile Suit Gundam 00 the Movie: A Wakening of the Trailblazer", name: "Mobile Suit Gundam 00 the Movie: A Wakening of the Trailblazer" },
    { id: "SD Gundam Sangokuden Brave Battle Warriors (Movie)", name: "SD Gundam Sangokuden Brave Battle Warriors (Movie)" },
    { id: "Mobile Suit Gundam Unicorn (OVA)", name: "Mobile Suit Gundam Unicorn (OVA)" },
    { id: "Gundam Reconguista in G (Compilation Movies)", name: "Gundam Reconguista in G (Compilation Movies)" },
    { id: "Mobile Suit Gundam Narrative", name: "Mobile Suit Gundam Narrative" },
    { id: "Mobile Suit Gundam Hathaway", name: "Mobile Suit Gundam Hathaway" },
    { id: "Mobile Suit Gundam: Cucuruz Doan's Island", name: "Mobile Suit Gundam: Cucuruz Doan's Island" },
    { id: "Mobile Suit Gundam SEED Freedom", name: "Mobile Suit Gundam SEED Freedom" },
    { id: "Mobile Suit Gundam AGE: Memory of Eden", name: "Mobile Suit Gundam AGE: Memory of Eden" },
    { id: "Gundam Evolve (OVA)", name: "Gundam Evolve (OVA)" },
    { id: "G-Saviour (Live-Action TV Movie)", name: "G-Saviour (Live-Action TV Movie)" },
    { id: "Gundam Breaker Battlogue (ONA)", name: "Gundam Breaker Battlogue (ONA)" },
    { id: "Mobile Suit Gundam: Silver Phantom (VR Movie)", name: "Mobile Suit Gundam: Silver Phantom (VR Movie)" },
    { id: "Mobile Suit Gundam Iron-Blooded Orphans: Urðr-Hunt (ONA)", name: "Mobile Suit Gundam Iron-Blooded Orphans: Urðr-Hunt (ONA)" },
    { id: "Gundam Build Metaverse (ONA)", name: "Gundam Build Metaverse (ONA)" },
  ]

  const version = [
    { id: "Standard / Regular", name: "Standard / Regular", note: "Phiên bản cơ bản, phổ thông nhất được bán rộng rãi." },
    { id: "Ver.Ka (Version Katoki)", name: "Ver.Ka (Version Katoki)", note: "Do Hajime Katoki thiết kế lại, nổi bật với chi tiết máy cao, decal nhiều, form dáng “ngầu” hơn bản gốc. Rất được ưa chuộng trong MG / PG." },
    { id: "P-Bandai (Premium Bandai)", name: "P-Bandai (Premium Bandai)", note: "Phiên bản giới hạn, chỉ bán qua website Bandai hoặc sự kiện, giá cao và hiếm." },
    { id: "Limited Version", name: "Limited Version", note: "Phiên bản đặc biệt, phát hành giới hạn tại sự kiện như Expo, WonderFest,... Có thể là màu lạ, metallic, clear,..." },
    { id: "Clear Version / Translucent", name: "Clear Version / Translucent", note: "Phiên bản nhựa trong suốt (Clear) để thấy rõ chi tiết bên trong. Chủ yếu để trưng bày, ít phù hợp chơi/lắp nhiều." },
    { id: "Metallic / Chrome Version", name: "Metallic / Chrome Version", note: "Sơn ánh kim hoặc mạ chrome sáng bóng, rất bắt mắt." },
    { id: "Titanium Finish", name: "Titanium Finish", note: "Sơn titanium trắng mờ hoặc ánh kim cực kỳ cao cấp, thường dành cho các mẫu flagship." },
    { id: "Rollout Color / Prototype Color", name: "Rollout Color / Prototype Color", note: "Màu sơn mô phỏng bản thử nghiệm đầu tiên của Gundam." },
    { id: "Anniversary Edition", name: "Anniversary Edition", note: "Bản kỷ niệm theo năm" },
    { id: "GFT / Gundam Front Tokyo Edition", name: "GFT / Gundam Front Tokyo Edition", note: "Phiên bản đặc biệt chỉ bán tại Gundam Front Tokyo (nay là Gundam Base Tokyo)." },
    { id: "Ver.2.0 / Ver.3.0 / Ver.ka", name: "Ver.2.0 / Ver.3.0 / Ver.ka", note: "Các phiên bản cải tiến với công nghệ mới hơn, chi tiết và khớp tốt hơn bản cũ." },
  ]
  // Danh sách phân khúc Gundam
  const scaleOptions = ["1/144", "1/100", "1/60", "1/48"];
  useEffect(() => {
    GetGrades()
      .then((response) => {
        setGrades(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách phân khúc:", error);
      });
  }, []);
  
  
  //  Xử lý thêm dòng nhập phụ kiện
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
          fieldsToValidate = ['name', 'series', 'grade_id', 'scale', 'parts_total', 'material', 'manufacturer'];
          break;
        case 1:
          fieldsToValidate = ['version', 'condition', 'release_year', 'description'];
          if (condition === 'open box' || condition === 'used') {
            fieldsToValidate.push('condition_description');
          }
          break;
        case 2:
          fieldsToValidate = ['price', 'weight'];
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
    formData.append("price", values.price || "");

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
          series={series}
          scaleOptions={scaleOptions}
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
          version={version}
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
    <div className="container max-w-7xl px-10 py-10 mt-36 my-10 bg-white rounded-lg shadow-sm mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">Thêm Sản Phẩm Gundam Mới</h2>

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
                  Tiếp theo <ArrowRightOutlined className="ml-1" />
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
                  {isUploading ? "Đang tiến hàng thêm..." : "Thêm sản phẩm"}
                </Button>
              </Space>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

AddCollection.propTypes = {
  setIsCreating: PropTypes.func.isRequired,
};

export default AddCollection;