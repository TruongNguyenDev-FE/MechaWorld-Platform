import { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Upload, message } from "antd";
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const ExchangeGundamManagement = () => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [data, setData] = useState([
        {
            key: "1",
            name: "MG RX-78-2 Gundam Ver.3.0",
            condition: "80%",
            category: "Master Grade",
        },
    ]);

    const showModal = (item = null) => {
        setEditingItem(item);
        setVisible(true);
        if (item) form.setFieldsValue(item);
        else form.resetFields();
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                if (editingItem) {
                    setData((prev) =>
                        prev.map((item) => (item.key === editingItem.key ? { ...editingItem, ...values } : item))
                    );
                } else {
                    setData((prev) => [...prev, { ...values, key: Date.now().toString() }]);
                }
                setVisible(false);
                form.resetFields();
                setEditingItem(null);
            })
            .catch(() => message.error("Vui lòng điền đầy đủ thông tin"));
    };

    const handleDelete = (key) => {
        setData((prev) => prev.filter((item) => item.key !== key));
    };

    const columns = [
        {
            title: "Tên Gundam",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Tình trạng",
            dataIndex: "condition",
            key: "condition",
        },
        {
            title: "Phân loại",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
                        Sửa
                    </Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)}>
                        Xoá
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Quản lý Gundam để Trao đổi</h2>
                <Button type="primary" className="bg-blue-500" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm Gundam
                </Button>
            </div>

            <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />

            <Modal
                title={editingItem ? "Chỉnh sửa Gundam" : "Thêm Gundam mới"}
                open={visible}
                onOk={handleOk}
                onCancel={() => {
                    setVisible(false);
                    form.resetFields();
                    setEditingItem(null);
                }}
                okText="Lưu"
                cancelText="Huỷ"
            >
                <Form layout="vertical" form={form}>
                    <Form.Item name="name" label="Tên Gundam" rules={[{ required: true, message: "Nhập tên Gundam" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="condition" label="Tình trạng" rules={[{ required: true }]}>
                        <Select placeholder="Chọn tình trạng">
                            <Option value="Mới 100%">Mới 100%</Option>
                            <Option value="80%">Đã lắp 80%</Option>
                            <Option value="Đã sơn">Đã sơn</Option>
                            <Option value="Thiếu phụ kiện">Thiếu phụ kiện</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="category" label="Phân loại" rules={[{ required: true }]}>
                        <Select placeholder="Chọn loại Gundam">
                            <Option value="HG">HG</Option>
                            <Option value="RG">RG</Option>
                            <Option value="MG">MG</Option>
                            <Option value="PG">PG</Option>
                            <Option value="SD">SD</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="image" label="Hình ảnh">
                        <Upload beforeUpload={() => false} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ExchangeGundamManagement;
