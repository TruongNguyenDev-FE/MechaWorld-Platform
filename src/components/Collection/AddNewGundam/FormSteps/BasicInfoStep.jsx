import PropTypes from 'prop-types';
import { Form, Input, Select, InputNumber } from 'antd';

const { Option } = Select;

const BasicInfoStep = ({ form, grades, series }) => {
    
    // Danh sách phân khúc Gundam
    const scaleOptions = ["1/144", "1/100", "1/60", "1/48"];

    return (
        <div className="space-y-6 container mx-auto py-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Nhập thông tin cơ bản của Gundam</h3>

            <Form.Item
                name="name"
                label="Tên Gundam"
                rules={[{
                    required: true,
                    message: "Vui lòng nhập tên sản phẩm!"
                }, {
                    min: 5,
                    message: "Tên sản phẩm phải có ít nhất 5 ký tự"
                }]}
            >
                <Input placeholder="VD: MGEX 1/100 Strike Freedom Gundam" maxLength={100} />
            </Form.Item>

            <Form.Item
                name="series"
                label="Thuộc dòng phim hoặc series"
                rules={[{ required: true, message: "Vui lòng chọn dòng phim!" }]}
            >
                <Select
                    placeholder="Chọn phim hoặc series"
                    showSearch
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {series.map((seri) => (
                        <Option key={seri.id} value={seri.id}>
                            {seri.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
                <Form.Item
                    name="grade_id"
                    label="Phân khúc"
                    rules={[{ required: true, message: "Vui lòng chọn phân khúc!" }]}
                >
                    <Select placeholder="Chọn phân khúc">
                        {grades.map((grade) => (
                            <Option key={grade.id} value={grade.id}>
                                {grade.display_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="scale"
                    label="Tỷ lệ"
                    rules={[{ required: true, message: "Vui lòng chọn tỷ lệ sản phẩm!" }]}
                >
                    <Select placeholder="Chọn tỷ lệ">
                        {scaleOptions.map((scale) => (
                            <Option key={scale} value={scale}>
                                {scale}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Form.Item
                    name="parts_total"
                    label="Tổng số linh kiện"
                    rules={[{
                        required: true,
                        message: "Vui lòng nhập số linh kiện!"
                    }]}
                >
                    <InputNumber
                        min={1}
                        style={{ width: "100%" }}
                        type="number"
                        parser={(value) => value.replace(/[^\d]/g, '')}
                        placeholder="VD: 200"
                    />
                </Form.Item>

                <Form.Item
                    name="material"
                    label="Chất liệu"
                    rules={[{ required: true, message: "Vui lòng thêm chất liệu của sản phẩm" }]}
                >
                    <Input placeholder="VD: PE, PVC, PV" maxLength={50} />
                </Form.Item>

                <Form.Item
                    name="manufacturer"
                    label="Thương hiệu"
                    rules={[{ required: true, message: "Vui lòng thêm thương hiệu" }]}
                >
                    <Input placeholder="VD: Bandai, Kotobukiya..." maxLength={50} />
                </Form.Item>
            </div>

            <div className="mt-2 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-700 text-sm">
                    <strong>Mẹo:</strong> Nhập đầy đủ thông tin sản phẩm sẽ giúp người mua dễ dàng tìm thấy sản phẩm của bạn.
                    Đặc biệt là tên sản phẩm nên bao gồm đầy đủ thông tin như grade, tỷ lệ, tên mẫu Gundam.
                </p>
            </div>
        </div>
    );
};

BasicInfoStep.propTypes = {
    form: PropTypes.object.isRequired,
    grades: PropTypes.array.isRequired
};

export default BasicInfoStep;