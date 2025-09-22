import PropTypes from 'prop-types';
import { Form, Input, Select, InputNumber } from 'antd';

const { Option } = Select;

const BasicInfoStep = ({ form, grades }) => {
    // Danh sách series
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
    ];

    // Danh sách phân khúc Gundam
    const scaleOptions = ["1/144", "1/100", "1/60", "1/48"];

    return (
        <div className="space-y-6">
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