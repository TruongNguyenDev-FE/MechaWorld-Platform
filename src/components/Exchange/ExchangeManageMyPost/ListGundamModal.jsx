import { Modal, Button, Badge, List, Card, Space, Image, Typography, Tag, Divider } from "antd";
import TextArea from "antd/es/input/TextArea";

const { Text } = Typography;

export default function ListGundamModal({ visible, post, onClose }) {

    if (!post) return null;

    // console.log("Post", post);


    return (
        <Modal
            title={
                <div>
                    <Text strong>Danh sách Gundam đem trao đổi</Text>
                </div>
            }
            width={800}
            open={visible}
            onCancel={onClose}
            footer={
                <div className="flex justify-end">
                    <Button onClick={onClose}>Đóng</Button>
                </div>
            }
        >
            <TextArea className="mb-4">
                {post.content}
            </TextArea>

            <Divider orientation="left">
                <Space>
                    <Badge>
                        <Text strong>Mô hình Gundam</Text>
                    </Badge>
                </Space>
            </Divider>

            <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
                dataSource={post}
                renderItem={(gunpla) => (
                    <List.Item>
                        <Card
                            hoverable
                            cover={
                                <Image
                                    alt={gunpla.title}
                                    src={gunpla.image}
                                    height={200}
                                    className="object-contain bg-gray-50"
                                />
                            }
                        >
                            <Card.Meta
                                title={gunpla.title}
                                description={
                                    <Space direction="vertical" size={0}>
                                        <Text type="secondary">{gunpla.series}</Text>
                                        <Text>{gunpla.category}</Text>
                                        <Tag color="blue">Tình trạng: {gunpla.condition}</Tag>
                                    </Space>
                                }
                            />
                        </Card>
                    </List.Item>
                )}
            />
        </Modal>
    );
}