import { useEffect, useState } from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Row, Button, Breadcrumb, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import FilterSidebar from './ProductFilter';
import { GetGundamByGrade, GetGundams } from '../../apis/Gundams/APIGundam';

const Product = () => {
    const navigate = useNavigate();
    const { Meta } = Card;

    // useState
    const [gundams, setGundams] = useState([]);
    const [filters, setFilters] = useState({
        selectedGrade: null,
        // condition: "all",
        // priceRange: [100, 1000]
    });


    useEffect(() => {
        const fetchGundams = async () => {
            try {
                let response;
                if (filters.selectedGrade) {
                    response = await GetGundamByGrade(filters.selectedGrade);
                    // console.log("Trigger Filter Gundam:", response);
                } else {
                    response = await GetGundams();
                    console.log("Trigger List All Gundam:", response);
                }
                let filteredData = response?.data || [];

                // ❗️Lọc chỉ những Gundam có status là "published"
                filteredData = filteredData.filter(gundam => gundam.status === "published");


                setGundams(filteredData);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách Gundam:", error);
            }
        };

        fetchGundams();
    }, [filters]);


    // Hàm nhận dữ liệu lọc từ FilterSidebar
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };


    // Hàm chuyển tới trang Chi tiết Gundam
    const handleClickedDetailGundam = (slug) => {
        // window.location.assign(`/product/${slug}`);
        navigate(`/product/${slug}`);
    };


    // ************** Hàm Format Tiền Việt *****************
    const formatCurrencyVND = (price) => {
        if (!price) return "0 vnd";
        return price.toLocaleString("vi-VN");
    };

    return (
        <>
            <div className="container mt-24">
                {/* Breadcrumb */}
                <div className="breadcurm-section px-4 py-2 hidden">
                    <Breadcrumb
                        items={[
                            {
                                href: '',
                                title: <HomeOutlined />,
                            },
                            {
                                href: '',
                                title: (
                                    <>
                                        <UserOutlined />
                                        <span>Sản phẩm</span>
                                    </>
                                ),
                            },
                            {
                                title: '....',
                            },
                        ]}
                    />
                </div>

                {/* Content */}
                <div className="content py-10">
                    <Row gutter={24}>
                        {/* Filter */}
                        <Col span={5}><FilterSidebar onFilterChange={handleFilterChange} /></Col>

                        {/* Start List of Products */}
                        <Col span={19}>
                            <div className="product-car bg-white shadow-lg rounded-lg p-4">

                                {/* Top Filter */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">Sắp xếp:</span>
                                        <Button className="border rounded-md">Mới nhất</Button>
                                        <Button className="border rounded-md">Giá tăng dần</Button>
                                        <Button className="border rounded-md">Giá giảm dần</Button>

                                    </div>
                                </div>

                                {/* Products */}
                                <div className="product-list mt-6">
                                    <Row gutter={24}>
                                        {gundams.length > 0 ? (
                                            gundams.map((gundam, index) => (
                                                <Col key={index} span={6}>
                                                    <Card
                                                        onClick={() => handleClickedDetailGundam(gundam.slug)}
                                                        bordered={false}
                                                        className="max-w-fit max-h-fit cursor-pointer mb-2 shadow-2xl p-2 rounded-lg transform transition-transform duration-300 hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                                                        cover={
                                                            <div className="h-auto w-full overflow-hidden">
                                                                <img
                                                                    className="w-[400px] h-[150px] object-cover cursor-pointer transform transition-transform duration-500 hover:scale-110"
                                                                    alt="example"
                                                                    src={gundam?.primary_image_url || "https://via.placeholder.com/150"}
                                                                />
                                                            </div>
                                                        }
                                                    >
                                                        <Meta
                                                            title={gundam.name}
                                                            description={<span className="text-red-600 text-base font-semibold">{formatCurrencyVND(gundam?.price)}<small className='text-sm underline'>đ</small></span>}
                                                        />
                                                    </Card>
                                                </Col>
                                            ))
                                        ) : (
                                            <div className='w-full h-[420px] flex items-center justify-center'>
                                                <Empty description="Không tìm thấy sản phẩm" />
                                            </div>
                                        )}
                                    </Row>
                                </div>

                                {/* Pagination */}
                                {/* <div className="pagination mt-5 flex justify-center">
                                    <Pagination defaultCurrent={1} total={50} />
                                </div> */}
                            </div>
                        </Col>
                        {/* End List of Products */}
                    </Row>
                </div>
            </div>
        </>
    )
}

export default Product