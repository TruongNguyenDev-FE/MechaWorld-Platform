import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Select, Spin, Typography } from 'antd';

import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { getUserAddresses, postUserAddresses, updateAddress } from '../../apis/User/APIUser';

const { Option } = Select;
const { Text, Paragraph } = Typography;

const SecondForm = ({ user, setUser, setHasAddress }) => {
    user = useSelector((state) => state.auth.user);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // GHN API states
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    // Address properties
    const [isPickupAddress, setIsPickupAddress] = useState(false);
    // const [isPrimary, setIsPrimary] = useState(true);

    // GHN API setup
    const ghn_api = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/';
    const api = axios.create({
        baseURL: ghn_api,
        headers: {
            'Content-Type': 'application/json',
            'token': import.meta.env.VITE_GHN_TOKEN_API
        }
    });


    // Truyền Ngược lại RegisterShop Check xem user đã thêm địa chỉ chưa.
    // Thêm useEffect để cập nhật trạng thái có địa chỉ hay không
    useEffect(() => {
        if (addresses && addresses.length > 0) {
            setHasAddress(true);
        } else {
            setHasAddress(false);
        }
    }, [addresses, setHasAddress]);



    // Fetch user addresses on component mount
    useEffect(() => {

        fetchUserAddresses();
        fetchProvinces();
    }, []);

    // Fetch user addresses from database
    const fetchUserAddresses = async () => {
        try {
            setLoading(true);
            const response = await getUserAddresses(user?.id);
            // setAddresses(response?.data);
            const pickupAddresses = response?.data?.filter(addr => addr.is_pickup_address === true);
            // console.log(pickupAddresses);
            setAddresses(pickupAddresses);
            // console.log("Fetched User Addresses:", response);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách địa chỉ:', error);
            message.error('Không thể tải thông tin địa chỉ');
        } finally {
            setLoading(false);
        }
    };

    // Fetch provinces (cities)
    const fetchProvinces = async () => {
        try {
            const response = await api.get('province');
            let data = response.data.data;
            // Filter out province with ID 286 (if needed)
            data = data.filter(province => province.ProvinceID !== 286 && province.ProvinceID !== 290 && province.ProvinceID !== 298 && province.ProvinceID !== 2002);
            setCities(data);
        } catch (error) {
            console.error('Lỗi khi fetch thành phố:', error);
        }
    };

    // Fetch districts based on selected city
    const fetchDistricts = async (province_id) => {
        try {
            const response = await api.post('district', { province_id });
            setDistricts(response.data.data);
        } catch (error) {
            console.error('Lỗi khi fetch quận:', error);
        }
    };

    // Fetch wards based on selected district
    const fetchWards = async (district_id) => {
        try {
            const response = await api.post('ward', { district_id });
            setWards(response.data.data);
        } catch (error) {
            console.error('Lỗi khi fetch phường/xã:', error);
        }
    };

    // Handle city selection
    const handleCityChange = (value) => {
        setSelectedCity(value);
        setDistricts([]);
        setWards([]);
        form.setFieldsValue({ district: undefined, ward: undefined });
        fetchDistricts(value);
    };

    // Handle district selection
    const handleDistrictChange = (value) => {
        setSelectedDistrict(value);
        setWards([]);
        form.setFieldsValue({ ward: undefined });
        fetchWards(value);
    };
    const handleUpdateAddress = async (values, addresses) => {
        // console.log("Data load: ",values);
        // console.log("Data addresses load: ",addresses);
        const city = cities.find(city => city.ProvinceID === values.city);
        const district = districts.find(district => district.DistrictID === values.district);
        const ward = wards.find(ward => ward.WardCode === values.ward);
        const addressData = {
            full_name: addresses.full_name,
            phone_number: addresses.phone_number,
            detail: values.detail,
            ghn_ward_code: values.ward,
            ghn_district_id: values.district,
            ward_name: ward ? ward.WardName : "",
            province_name: city ? city.ProvinceName : "",
            district_name: district ? district.DistrictName : "",
            is_pickup_address: true,
            is_primary: false
        };
        try {
            await updateAddress(user.id, addresses[0].id, addressData);
            message.success("Cập nhật địa chỉ thành công!");
            setModalVisible(false);
            fetchUserAddresses();
        } catch (error) {
            message.error("Lỗi khi cập nhật địa chỉ!");
            console.error(error);
        }
    };
    // Handle form submission for new address
    const handleAddNewAddress = async (values) => {
        const city = cities.find(city => city.ProvinceID === values.city);
        const district = districts.find(district => district.DistrictID === values.district);
        const ward = wards.find(ward => ward.WardCode === values.ward);

        const addressData = {
            full_name: user.full_name,
            phone_number: user.phone_number,
            detail: values.detail,
            ghn_ward_code: values.ward,
            ghn_district_id: values.district,
            ward_name: ward ? ward.WardName : "",
            province_name: city ? city.ProvinceName : "",
            district_name: district ? district.DistrictName : "",
            is_pickup_address: true,
            is_primary: false
        };

        try {
            setLoading(true);
            await postUserAddresses(user?.id, addressData);
            message.success("Thêm địa chỉ thành công!");
            form.resetFields();
            setIsPickupAddress(true);
            // setIsPrimary(false);
            setModalVisible(false);
            fetchUserAddresses(); // Refresh addresses list
        } catch (error) {
            message.error("Lỗi khi thêm địa chỉ!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Pre-fill form when updating an address
    const handleEdit = async (address) => {
        setModalVisible(true);

        form.setFieldsValue({
            full_name: address.full_name,
            phone_number: address.phone_number,
            detail: address.detail,
        });

        try {
            const filteredCities = cities.filter((city) => city.ProvinceName === address.province_name);
            if (filteredCities.length > 0) {
                const selectedCityId = filteredCities[0].ProvinceID;
                setSelectedCity(selectedCityId);
                //   console.log("Data city: ",filteredCities);

                const districtRes = await api.post(`district`, { province_id: selectedCityId });
                const districtsData = districtRes.data.data;
                setDistricts(districtsData);


                const foundDistrict = districtsData.find((d) => d.DistrictName === address.district_name);
                //   console.log("Data district: ",foundDistrict);
                if (foundDistrict) {
                    const selectedDistrictId = foundDistrict.DistrictID;
                    setSelectedDistrict(selectedDistrictId);

                    const wardRes = await api.post(`ward`, { district_id: selectedDistrictId });
                    const wardsData = wardRes.data.data;
                    setWards(wardsData);


                    const foundWard = wardsData.find((w) => w.WardName === address.ward_name);
                    // console.log("Data ward: ", foundWard);
                    form.setFieldsValue({
                        province_name: filteredCities ? filteredCities.ProvinceName : undefined,
                        city: selectedCityId,
                        district_name: foundDistrict ? foundDistrict.DistrictName : undefined,
                        district: selectedDistrictId,
                        ward_name: foundWard ? foundWard.WardName : undefined,
                        ward: foundWard ? foundWard.WardCode : undefined,
                    });

                } else {
                    console.warn("⚠️ Không tìm thấy quận/huyện phù hợp.");
                }
            } else {
                console.warn("⚠️ Không tìm thấy thành phố phù hợp.");
            }
        } catch (error) {
            console.error("❌ Lỗi khi load địa chỉ:", error);
        }

    };

    return (
        <div className="max-w-2xl mx-auto bg-white">
            <Form
                layout="horizontal"
                labelCol={{ span: 14 }}
                wrapperCol={{ span: 24 }}
                className="address-form"
            >
                <div className="mb-4">
                    <h2 className="text-xl font-bold">NHẬP ĐỊA CHỈ SHOP</h2>
                    <Paragraph className="text-gray-500">
                        Chúng tôi có thu thập địa chỉ lấy hàng của shop để thực hiện việc vận chuyển dễ dàng hơn.
                    </Paragraph>
                    <Text className="text-red-500 italic text-sm" italic>
                        Lưu ý: Chỉ ghi nhận 1 địa chỉ lấy hàng duy nhất.
                    </Text>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spin size="large" tip="Đang tải..." />
                    </div>
                ) : addresses && addresses.length > 0 ? (
                    <div className="flex justify-around gap-4">
                        <div className="space-y-2 w-96">
                            <Form.Item
                                className='m-0'
                                label={<span className="font-bold">Tỉnh/Thành phố</span>}
                            >
                                <span className="block px-4 rounded-md">
                                    {addresses[0].province_name}
                                </span>
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-bold">Quận/Huyện</span>}
                            >
                                <span className="block px-4 rounded-md">
                                    {addresses[0].district_name}
                                </span>
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-bold">Phường/Xã</span>}
                            >
                                <span className="block px-4 rounded-md">
                                    {addresses[0].ward_name}
                                </span>
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-bold">Địa chỉ chi tiết</span>}
                            >
                                <span className="block px-4 rounded-md w-64">
                                    {addresses[0].detail}
                                </span>
                            </Form.Item>
                        </div>

                        <div className="flex items-start justify-end">
                            <Form.Item>
                                <Button
                                    icon={<EditOutlined className='mt-[6px]'/>}
                                    type="primary"
                                    onClick={() => handleEdit(addresses[0])}
                                    className="bg-blue-500"
                                >
                                    Chỉnh sửa
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                ) : (
                    <div className="border border-dashed border-gray-300 rounded-lg p-8 mt-4 bg-gray-50">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="text-5xl text-gray-300 mb-4">
                                <i className="fas fa-map-marker-alt"></i>
                                {/* Thay bằng icon từ thư viện bạn đang dùng nếu không dùng Font Awesome */}
                            </div>
                            <Text className="text-lg uppercase font-medium mb-2">Bạn chưa có địa chỉ lấy hàng</Text>
                            <Text className="text-gray-500 mb-6">Vui lòng cung cấp thêm thông tin địa chỉ để thuận tiện cho việc vận chuyển.</Text>
                            <Button
                                type="primary"
                                onClick={() => setModalVisible(true)}
                                className="bg-blue-500 hover:bg-blue-600"
                                size="large"
                                icon={<PlusOutlined />}
                            >
                                Thêm địa chỉ lấy hàng
                            </Button>
                        </div>
                    </div>
                )}
            </Form>

            {/* Modal Add New Address */}
            <Modal
                title={addresses && addresses.length > 0 ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setModalVisible(false);
                        form.resetFields();
                    }}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        className="bg-blue-500"
                        onClick={async () => {
                            try {
                                const values = await form.validateFields();
                                if (addresses.length > 0) {
                                    // console.log("Dữ liệu address ht: ", addresses);
                                    // console.log("Dữ liệu form: ", values);
                                    handleUpdateAddress(values, addresses);
                                } else {
                                    // console.log("Dữ liệu form: ", values);
                                    handleAddNewAddress(values);
                                }

                            } catch (error) {
                                console.error("Validation Error:", error);
                            }
                        }}
                    >
                        {addresses && addresses.length > 0 ? "Cập nhật" : "Thêm địa chỉ"}
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="horizontal"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                >
                    {/* Chọn Thành phố */}
                    <Form.Item label="Tỉnh/Thành phố" name="city" rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố' }]}>
                        <Select onChange={handleCityChange} placeholder="Chọn thành phố">
                            {cities.map((city) => (
                                <Option key={city.ProvinceID} value={city.ProvinceID}>
                                    {city.ProvinceName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Chọn Quận/huyện */}
                    <Form.Item label="Quận/Huyện" name="district" rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện' }]}>
                        <Select
                            onChange={handleDistrictChange}
                            placeholder="Chọn quận/huyện"
                            disabled={!selectedCity}
                            loading={selectedCity && districts.length === 0}
                        >
                            {districts.map((district) => (
                                <Option key={district.DistrictID} value={district.DistrictID}>
                                    {district.DistrictName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Chọn Phường/xã */}
                    <Form.Item label="Phường/Xã" name="ward" rules={[{ required: true, message: 'Vui lòng chọn Phường/Xã' }]}>
                        <Select
                            placeholder="Chọn phường/xã"
                            disabled={!selectedDistrict}
                            loading={selectedDistrict && wards.length === 0}
                        >
                            {wards.map((ward) => (
                                <Option key={ward.WardCode} value={ward.WardCode}>
                                    {ward.WardName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Nhập địa chỉ cụ thể */}
                    <Form.Item label="Địa chỉ cụ thể" name="detail" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể' }]}>
                        <Input.TextArea
                            placeholder="Ví dụ: 15 Nguyễn Trãi, Tòa nhà ABC, Lầu 10"
                            rows={3}
                        />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
};

export default SecondForm;