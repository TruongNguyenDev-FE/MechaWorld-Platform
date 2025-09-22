import { useEffect, useState } from "react";
import { Collapse, Input, Radio} from "antd";

import { GetGrades } from "../../apis/Gundams/APIGundam";

const { Panel } = Collapse;

const FilterSidebar = ({ onFilterChange }) => {
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState();
    const [error, setError] = useState("");

    const [condition, setCondition] = useState("all");

    // ************ Fetch ALL Grades *******************
    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await GetGrades();
                setGrades(response?.data || []);
            } catch (err) {
                setError("Grades Error: Lỗi fetch API grades");
                console.log(error);
            }
        };

        fetchGrades();
    }, []);
    // **************************************************


    // **************** Khi giá trị thay đổi, gọi hàm `onFilterChange` ***********************
    useEffect(() => {
        onFilterChange({ selectedGrade, condition });
    }, [selectedGrade, condition]);
    // ***************************************************************************************

    return (
        <div className="bg-white shadow-lg rounded-lg p-4">
            <h1 className="text-lg font-bold mb-4">KHÁM PHÁ GUNDAM</h1>

            {/* Search Bar */}
            <div className="search-bar my-2">
                <Input
                    placeholder="Tìm Gundam..."
                />
            </div>

            <Collapse defaultActiveKey={["1", "2"]} ghost>
                {/* Loại Gundam */}
                <Panel className="font-bold" header="Loại Gundam" key="1">
                    <Radio.Group
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        value={selectedGrade}
                        className="flex flex-col space-y-2 font-normal"
                    >
                        <Radio className="radio-all">Tất cả</Radio>
                        {grades.map((grade, index) => (
                            <Radio key={index} value={grade?.slug}>
                                {grade?.display_name}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Panel>

                {/* Tình trạng */}
                <Panel className="font-bold" header="Tình trạng" key="2">
                    <Radio.Group
                        onChange={(e) => setCondition(e.target.value)}
                        value={condition}
                        className="flex flex-col space-y-2 font-normal"
                    >
                        <Radio value="all">Tất cả tình trạng</Radio>
                        <Radio value="new">Nguyên seal</Radio>
                        <Radio value="builded">Mô hình đã lắp ráp</Radio>
                        <Radio value="used">Đã qua sử dụng</Radio>
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    );
};

export default FilterSidebar;
