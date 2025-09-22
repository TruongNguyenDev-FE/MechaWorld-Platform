import PropTypes from 'prop-types';
import { Form, InputNumber, Alert } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import ImageUpload from './ImageUpload';

const ImagesAndPriceStep = ({
    form,
    primaryImage,
    setPrimaryImage,
    secondaryImages,
    setSecondaryImages
}) => {
    const handlePriceChange = (value) => {
        form.setFieldsValue({ price: value });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Hình ảnh và giá bán</h3>

            <Form.Item label="Hình ảnh sản phẩm" required className="mb-6">
                <div className="border p-4 rounded-md">
                    <ImageUpload
                        primaryImage={primaryImage}
                        setPrimaryImage={setPrimaryImage}
                        secondaryImages={secondaryImages}
                        setSecondaryImages={setSecondaryImages}
                    />
                </div>
                {primaryImage && secondaryImages.length === 0 && (
                    <div className="text-yellow-500 text-sm mt-1">Nên thêm ít nhất một ảnh phụ để người mua có thể xem sản phẩm từ nhiều góc độ</div>
                )}
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
                <Form.Item
                    name="weight"
                    label="Cân nặng"
                    rules={[{ required: true, message: "Vui lòng nhập cân nặng!" }]}
                    tooltip={{
                        title: 'Dùng để tính chi phí vận chuyển. (3.500 vnd / 500g)',
                        icon: <InfoCircleOutlined />,
                    }}
                >
                    <InputNumber
                        min={1}
                        type="number"
                        parser={(value) => value?.replace(/[^\d]/g, '')}
                        addonAfter="gram"
                        style={{ width: "100%" }}
                    />
                </Form.Item>

                <Form.Item
                    label="Giá bán"
                    name="price"
                    rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
                    tooltip={{
                        title: 'Giá bán phải từ 1.000 VNĐ trở lên',
                        icon: <InfoCircleOutlined />,
                    }}
                >
                    <InputNumber
                        onChange={handlePriceChange}
                        min={1000}
                        style={{ width: "100%" }}
                        formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/[^0-9]/g, "")}
                        addonAfter="VNĐ"
                    />
                </Form.Item>
            </div>

            <Alert
                message="Xác nhận thông tin"
                description={
                    <div>
                        <p>Vui lòng kiểm tra lại thông tin sản phẩm trước khi đăng ký.</p>
                        <ul className="list-disc pl-5 mt-2">
                            <li>Đã thêm đầy đủ hình ảnh (ảnh chính và ảnh phụ)</li>
                            <li>Đã điền đầy đủ thông tin về phiên bản và năm phát hành</li>
                            <li>Đã mô tả chính xác tình trạng của sản phẩm</li>
                            <li>Đã nhập giá bán hợp lý</li>
                        </ul>
                    </div>
                }
                type="success"
                showIcon
                className="mt-4"
            />
        </div>
    );
};

ImagesAndPriceStep.propTypes = {
    form: PropTypes.object.isRequired,
    primaryImage: PropTypes.object,
    setPrimaryImage: PropTypes.func.isRequired,
    secondaryImages: PropTypes.array.isRequired,
    setSecondaryImages: PropTypes.func.isRequired
};

export default ImagesAndPriceStep;