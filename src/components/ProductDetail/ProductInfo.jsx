import React, { useState } from "react";
import { Card, Typography, Divider, List } from "antd";
import { CheckCircleOutlined, ThunderboltOutlined, CustomerServiceOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const ProductInfo = ({ info, assessories = [] }) => {
    // State to track if accessories dropdown is expanded
    const [accessoriesExpanded, setAccessoriesExpanded] = useState(false);

    // Toggle accessories dropdown
    const toggleAccessories = () => {
        setAccessoriesExpanded(!accessoriesExpanded);
    };

    // Features section with icons
    const shoppingFeatures = [
        {
            icon: <CheckCircleOutlined style={{ fontSize: '18px', color: '#52c41a' }} />,
            text: "Được đồng kiểm khi nhận hàng"
        },
        {
            icon: <ThunderboltOutlined style={{ fontSize: '18px', color: '#1890ff' }} />,
            text: "Giao hàng nhanh chóng, đóng gói cẩn thận"
        },
        {
            icon: <CustomerServiceOutlined style={{ fontSize: '18px', color: '#722ed1' }} />,
            text: "Hỗ trợ 24/7 từ đội ngũ chuyên nghiệp"
        }
    ];

    // Product details for display
    const productDetails = [
        { label: "Phân khúc", value: info?.grade },
        { label: "Tỉ lệ", value: info?.scale },
        { label: "Vật liệu sản xuất", value: info?.material },
        { label: "Tổng số mảnh", value: info?.parts_total + " mảnh" },
        { label: "Dòng phim", value: info?.series },
        { label: "Phiên bản", value: info?.version },
        { label: "Khối lượng", value: info?.weight ? `${info.weight} (gam)` : "" },
        { label: "Nhà sản xuất", value: info?.manufacturer },
        { label: "Năm sản xuất", value: info?.release_year },
        {
            label: "Phụ kiện đi kèm",
            value: assessories?.length > 0
                ? (
                    <div
                        onClick={toggleAccessories}
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <Text>{assessories.length} phụ kiện</Text>
                        {accessoriesExpanded ?
                            <UpOutlined style={{ marginLeft: 8, fontSize: 12 }} /> :
                            <DownOutlined style={{ marginLeft: 8, fontSize: 12 }} />
                        }
                    </div>
                )
                : "Không có",
            hasDetails: assessories?.length > 0,
            isDropdown: assessories?.length > 0
        },
    ];

    return (
        <div className="product-info-container">
            {/* Shopping confidence section */}
            <Card title={<span className="text-xl font-bold">An tâm khi mua sắm</span>} style={{ marginBottom: 16 }}>
                <List
                    itemLayout="horizontal"
                    dataSource={shoppingFeatures}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={item.icon}
                                title={item.text}
                            />
                        </List.Item>
                    )}
                />
            </Card>

            {/* Product details section */}
            <Card title={<span className="text-xl font-bold">Thông tin chi tiết</span>} style={{ marginBottom: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        {productDetails.map((detail, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td
                                        style={{
                                            padding: '8px 0',
                                            width: '30%',
                                            verticalAlign: 'top',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <Text strong>{detail.label}</Text>
                                    </td>
                                    <td
                                        style={{
                                            padding: '8px 0',
                                            width: '70%',
                                            textAlign: 'right',
                                            verticalAlign: 'top',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {detail.value}
                                    </td>
                                </tr>

                                {/* Add accessories details if expanded */}
                                {detail.hasDetails && accessoriesExpanded && (
                                    <tr>
                                        <td colSpan={2} style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <tbody>
                                                    {assessories.map((item, idx) => (
                                                        <tr key={item.id}>
                                                            <td style={{
                                                                padding: '4px 16px',
                                                                textAlign: 'left',
                                                            }}>
                                                                <Text className="text-gray-600">+ {item.name}</Text>
                                                            </td>
                                                            <td style={{
                                                                padding: '4px 0',
                                                                textAlign: 'right',
                                                            }}>
                                                                <Text className="text-gray-600">x {item.quantity}</Text>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}

                                {index < productDetails.length - 1 && (
                                    <tr>
                                        <td colSpan={2}>
                                            <Divider style={{ margin: '4px 0' }} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </Card>

            {/* Product description section */}
            <Card title={<span className="text-xl font-bold">Mô tả sản phẩm</span>}>
                <Paragraph
                    style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word"
                    }}
                >
                    {info?.description}
                </Paragraph>
            </Card>
        </div>
    );
};

export default ProductInfo;