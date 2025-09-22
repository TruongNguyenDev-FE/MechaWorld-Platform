import { Avatar, Button, Space, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    UserOutlined,
    // SyncOutlined,
    // CheckCircleOutlined,
    // CloseCircleOutlined,
    // ClockCircleOutlined,
} from "@ant-design/icons";
import { getAllExchangeParticipating } from "../../../apis/Exchange/APIExchange";
import moment from "moment/min/moment-with-locales";

moment.locale("vi");
const { Text } = Typography;


// Filter only pending negotiations

export default function ExchangeManageList() {
    const [activeFilter, setActiveFilter] = useState("all");

    const [exchangeData, setExchangeData] = useState([]);
    const [filteredData, setFilteredData] = useState(exchangeData);

    console.log("filteredData", filteredData);


    // Filter functionality
    const filterData = (filter) => {
        setActiveFilter(filter);
        if (filter === "all") {
            setFilteredData(exchangeData);
        } else {
            setFilteredData(exchangeData.filter(item => item.status === filter));
        }
    };

    const filterOptions = [
        { label: "Tất cả", value: "all" },
        { label: "Đang trao đổi", value: "pending" },
        { label: "Đang đóng gói", value: "packaging" },
        { label: "Đang vận chuyển", value: "delivering" },
        { label: "Đã được giao", value: "delivered" },
        { label: "Hoàn thành", value: "completed" },
        { label: "Bị hủy", value: "canceled" },
        { label: "Trao đổi thất bại", value: "failed" }
    ];
    const statusMap = {
        pending: "Đang chờ",
        packaging: "Đang đóng gói",
        delivering: "Đang vận chuyển",
        delivered: "Đã giao",
        completed: "Hoàn thành",
        canceled: "Đã hủy",
        failed: "Thất bại",
    };

    const columns = [
        // {
        //     title: "STT",
        //     dataIndex: "key",
        //     key: "key",
        //     width: 60,
        //     align: "center",
        // },
        {
            title: "Người trao đổi",
            dataIndex: "partner",
            key: "partner",
            width: 160,
            render: (user) => {
                // console.log("user", user);
                return (
                    <Space>
                        <Avatar
                            src={user.avatar_url}
                            icon={<UserOutlined />}
                            className="border-2 border-blue-500"
                        />
                        <span className="font-medium">{user.full_name}</span>
                    </Space>

                )

            },
        },
        {
            title: "Tiền bù trừ",
            dataIndex: "compensation_amount",
            key: "compensation_amount",
            width: 220,
            render: (offer) => (
                <Space direction="vertical" size={0}>
                    <Text>
                        {offer === null ? (
                            <Text type="success">
                                Không có bù trừ
                            </Text>
                        ) : (
                            <Text type="success">
                                {offer.toLocaleString()}đ
                            </Text>
                        )}
                    </Text>
                </Space>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 220,
            render: (status) => {
                let color = "";
                switch (status) {
                    case "pending":
                        color = "blue";
                        break;
                    case "packaging":
                        color = "orange";
                        break;
                    case "delivering":
                        color = "cyan";
                        break;
                    case "delivered":
                        color = "green";
                        break;
                    case "completed":
                        color = "success";
                        break;
                    case "canceled":
                        color = "red";
                        break;
                    case "failed":
                        color = "volcano";
                        break;
                    default:
                        color = "default";
                }
                return (
                    <Tag color={color} key={status}>
                        {statusMap[status] || "Không xác định"}
                    </Tag>
                );
            },
        },
        {
            title: "Thời gian",
            dataIndex: "created_at",
            key: "time",
            width: 160,
            render: (src) => (
                <Space direction="vertical" size={0}>
                    {moment(src.created_at).format('LL')
                    }
                </Space>
            ),
        },
        // {
        //     title: "Trạng thái",
        //     dataIndex: "status",
        //     key: "status",
        //     width: 180,
        //     render: (status) => (
        //         <Tag icon={status.icon} color={status.color}>
        //             {status.text}
        //         </Tag>
        //     ),
        // },
        {
            title: "Hành động",
            key: "action",
            width: 100,
            render: (src) => (
                <Link to={`/exchange/detail/${src.id}`}>
                    <Button className="bg-blue-500" type="primary" size="middle">
                        Xem chi tiết
                    </Button>
                </Link>
            ),
        },
    ];

    useEffect(() => {
        // getAllExchangeOffer().then((res) => {
        //     setOfferData(res.data);
        //     console.log(res.data);
        // })
        getAllExchangeParticipating().then((res) => {
            setExchangeData(res.data);
            setFilteredData(res.data);
            // console.log(res.data);
        })
    }, [])


    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <div className="flex justify-center w-full gap-2 overflow-x-auto py-2">
                    {filterOptions.map(option => (
                        <Button
                            className="text-black text-base"
                            key={option.value}
                            type={activeFilter === option.value ? "primary" : "link"}
                            onClick={() => { filterData(option.value) }}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{
                    pageSize: 3,
                    showSizeChanger: true,
                    pageSizeOptions: ['6', '12', '20'],
                    showTotal: (total) => `Tổng ${total} giao dịch`
                }}
                bordered
                className="gundam-table"
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 8,
                }}
                rowClassName={(record, index) =>
                    index % 2 === 0 ? 'bg-gray-50' : ''
                }
            />
        </>
    )
}