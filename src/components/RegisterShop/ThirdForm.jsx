import { useEffect } from "react";
import { Card, Typography, Form, Checkbox } from "antd";

const { Title, Paragraph } = Typography;

const ThirdForm = ({ formData, setFormData, setCanProceed }) => {
    useEffect(() => {
        setCanProceed(formData?.agreedToTerms || false);
    }, [formData?.agreedToTerms, setCanProceed]);

    return (
        <>
            <Card
                title={<span className="font-bold text-2xl flex justify-center">NHỮNG QUY ĐỊNH KHI TRỞ THÀNH NHÀ BÁN HÀNG TẠI MECHAWORLD</span>}
                bordered={false}
                className="shadow rounded-xl"
            >
                <Typography className="space-y-4 overflow-y-auto pr-2">
                    <div>
                        <Title level={4}>1. Điều kiện trở thành Người Bán</Title>
                        <Paragraph>
                            <ul className="list-disc pl-5">
                                <li>Cung cấp thông tin chính xác về danh tính và cửa hàng.</li>
                                <li>Chịu trách nhiệm về sản phẩm đăng bán, bao gồm nguồn gốc và chất lượng.</li>
                            </ul>
                        </Paragraph>
                    </div>

                    <div>
                        <Title level={4}>2. Quy định về sản phẩm</Title>
                        <Paragraph>
                            <ul className="list-disc pl-5">
                                <li>Chỉ được đăng bán sản phẩm liên quan đến Gundam, hàng hóa phải rõ nguồn gốc, không vi phạm pháp luật hoặc bản quyền.</li>
                                <li>Phải sử dụng hình ảnh thật của sản phẩm và mô tả đúng thực tế, không gây hiểu lầm cho người mua.</li>
                            </ul>
                        </Paragraph>
                    </div>

                    <div>
                        <Title level={4}>3. Chính sách giao hàng và đổi trả</Title>
                        <Paragraph>
                            <ul className="list-disc pl-5">
                                <li>Giao hàng đúng mô tả, đúng thời gian và hỗ trợ xử lý khiếu nại nếu có.</li>
                            </ul>
                        </Paragraph>
                    </div>

                    <div>
                        <Title level={4}>4. Xử lý vi phạm</Title>
                        <Paragraph>
                            <ul className="list-disc pl-5">
                                <li>Nền tảng có quyền khóa shop tạm thời hoặc vĩnh viễn nếu vi phạm.</li>
                            </ul>
                        </Paragraph>
                    </div>
                </Typography>

            </Card>
            <Form.Item className="mt-4">
                <Checkbox
                    checked={formData?.agreedToTerms}
                    onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                >
                    Tôi xác nhận đã đọc và đồng ý với các điều khoản trên
                </Checkbox>
            </Form.Item>
        </>
    );
};

export default ThirdForm;
