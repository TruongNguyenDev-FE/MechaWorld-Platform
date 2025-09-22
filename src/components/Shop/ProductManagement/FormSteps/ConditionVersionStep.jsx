import PropTypes from 'prop-types';
import { Form, Select, Input, Card, Button, InputNumber, Radio, Row, Col } from 'antd';
import { InfoCircleOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const VersionCard = ({ version, isSelected, onSelect }) => {
    return (
        <Card
            hoverable
            className={`mb-3 ${isSelected ? 'border-blue-500 border-2' : ''}`}
            onClick={() => onSelect(version.id)}
        >
            <div className="flex items-start">
                <Radio checked={isSelected} className="mr-2 mt-1" />
                <div>
                    <h4 className="font-medium text-base">{version.name}</h4>
                    <p className="text-gray-500 text-sm">{version.note}</p>
                </div>
            </div>
        </Card>
    );
};

VersionCard.propTypes = {
    version: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired
};

const ConditionVersionStep = ({
    form,
    condition,
    setCondition,
    releaseYearOptions,
    selectedVersion,
    handleVersionSelect,
    accessories,
    handleAddAccessory,
    handleRemoveAccessory,
    handleAccessoryChange
}) => {
    const versions = [
        { id: "Standard / Regular", name: "Standard / Regular", note: "Phiên bản cơ bản, phổ thông nhất được bán rộng rãi." },
        { id: "Ver.Ka (Version Katoki)", name: "Ver.Ka (Version Katoki)", note: "Do Hajime Katoki thiết kế lại, nổi bật với chi tiết máy cao, decal nhiều, form dáng ngầu hơn bản gốc." },
        { id: "P-Bandai (Premium Bandai)", name: "P-Bandai (Premium Bandai)", note: "Phiên bản giới hạn, chỉ bán qua website Bandai hoặc sự kiện, giá cao và hiếm." },
        { id: "Limited Version", name: "Limited Version", note: "Phiên bản đặc biệt, phát hành giới hạn tại sự kiện như Expo, WonderFest,... Có thể là màu lạ, metallic, clear,..." },
        { id: "Clear Version / Translucent", name: "Clear Version / Translucent", note: "Phiên bản nhựa trong suốt (Clear) để thấy rõ chi tiết bên trong. Chủ yếu để trưng bày." },
        { id: "Metallic / Chrome Version", name: "Metallic / Chrome Version", note: "Sơn ánh kim hoặc mạ chrome sáng bóng, rất bắt mắt." },
        { id: "Titanium Finish", name: "Titanium Finish", note: "Sơn titanium trắng mờ hoặc ánh kim cực kỳ cao cấp, thường dành cho các mẫu flagship." },
        { id: "Rollout Color / Prototype Color", name: "Rollout Color / Prototype Color", note: "Màu sơn mô phỏng bản thử nghiệm đầu tiên của Gundam." },
        { id: "Anniversary Edition", name: "Anniversary Edition", note: "Bản kỷ niệm theo năm" },
        { id: "GFT / Gundam Front Tokyo Edition", name: "GFT / Gundam Front Tokyo Edition", note: "Phiên bản đặc biệt chỉ bán tại Gundam Front Tokyo." },
        { id: "Ver.2.0 / Ver.3.0 / Ver.ka", name: "Ver.2.0 / Ver.3.0 / Ver.ka", note: "Các phiên bản cải tiến với công nghệ mới hơn, chi tiết và khớp tốt hơn bản cũ." },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Chọn phiên bản và tình trạng sản phẩm</h3>

            <Form.Item
                name="version"
                label="Phiên bản"
                rules={[{ required: true, message: "Vui lòng chọn phiên bản sản phẩm!" }]}
            >
                <Input type="hidden" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {versions.map((version) => (
                        <VersionCard
                            key={version.id}
                            version={version}
                            isSelected={selectedVersion === version.id}
                            onSelect={handleVersionSelect}
                        />
                    ))}
                </div>
            </Form.Item>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <Form.Item
                    name="condition"
                    label="Tình trạng sản phẩm"
                    rules={[{ required: true, message: "Vui lòng chọn tình trạng sản phẩm" }]}
                    tooltip={{
                        title: 'Mô tả tình trạng sản phẩm trong tường hợp có va trạng hoặc trầy xước thì tình trạng sẽ là - "Đã mở hộp"',
                        icon: <InfoCircleOutlined />,
                    }}
                >
                    <Select value={condition} onChange={setCondition}>
                        <Option value="new">Hàng mới</Option>
                        <Option value="open box">Đã mở hộp</Option>
                        <Option value="used">Đã qua sử dụng</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="release_year"
                    label="Năm phát hành"
                    rules={[{ required: true, message: "Vui lòng chọn năm phát hành" }]}
                >
                    <Select placeholder="Chọn năm phát hành">
                        {releaseYearOptions.map(year => (
                            <Option key={year} value={year.toString()}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>

            {condition === 'new' && (
                <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                    <p className="text-sm"><strong>Lưu ý:</strong> Tình trạng sản phẩm: Hộp mới nguyên dạng, chưa bóc seal, linh kiện không bị hư hại, đủ phụ kiện đi kèm.</p>
                </div>
            )}

            {condition === 'open box' && (
                <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                    <p className="text-sm"><strong>Lưu ý:</strong> Tình trạng sản phẩm: mới mở seal ngoài và kiểm tra mảnh trong. Trong trường hợp mất vỏ nhưng chưa xé seal trong mảnh thì hãy để tình trạng sản phẩm là &quot;Đã qua sử dụng&quot;</p>
                </div>
            )}

            {(condition === 'open box' || condition === 'used') && (
                <Form.Item
                    name="condition_description"
                    label="Mô tả tình trạng"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả tình trạng sản phẩm' }]}
                >
                    <TextArea
                        rows={3}
                        placeholder="Nhập mô tả chi tiết tình trạng sản phẩm (trầy xước, móp vỏ , ect ...)"
                        maxLength={500}
                        showCount
                    />
                </Form.Item>
            )}

            <Form.Item
                name="description"
                label="Mô tả sản phẩm"
                rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm!" }]}
            >
                <TextArea
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    placeholder="Mô tả chi tiết về sản phẩm, đặc điểm nổi bật..."
                    maxLength={2000}
                    showCount
                />
            </Form.Item>

            <div className="border p-4 rounded-md bg-gray-50 mt-4">
                <div className="text-base font-medium mb-2">Phụ kiện thêm (nếu có)</div>
                {accessories.length === 0 && (
                    <div className="text-gray-500 text-sm mb-2">Chưa có phụ kiện nào được thêm</div>
                )}
                {accessories.map((accessory, index) => (
                    <Row key={index} gutter={8} className="mb-2">
                        <Col flex="auto">
                            <Input
                                placeholder="Tên phụ kiện"
                                value={accessory.name}
                                onChange={(e) => handleAccessoryChange(index, "name", e.target.value)}
                                maxLength={100}
                            />
                        </Col>
                        <Col flex="100px">
                            <InputNumber
                                min={1}
                                max={999}
                                placeholder="SL"
                                value={accessory.quantity}
                                style={{ width: '100%' }}
                                onChange={(value) => handleAccessoryChange(index, "quantity", value)}
                            />
                        </Col>
                        <Col flex="40px">
                            <Button
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => handleRemoveAccessory(index)}
                                size="middle"
                            />
                        </Col>
                    </Row>
                ))}
                <Button
                    type="dashed"
                    onClick={handleAddAccessory}
                    icon={<PlusOutlined />}
                    className="mt-2"
                >
                    Thêm Phụ Kiện
                </Button>
            </div>
        </div>
    );
};

ConditionVersionStep.propTypes = {
    form: PropTypes.object.isRequired,
    condition: PropTypes.string.isRequired,
    setCondition: PropTypes.func.isRequired,
    releaseYearOptions: PropTypes.array.isRequired,
    selectedVersion: PropTypes.string,
    handleVersionSelect: PropTypes.func.isRequired,
    accessories: PropTypes.array.isRequired,
    handleAddAccessory: PropTypes.func.isRequired,
    handleRemoveAccessory: PropTypes.func.isRequired,
    handleAccessoryChange: PropTypes.func.isRequired
};

export default ConditionVersionStep;