import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

export default function Spinner() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-50 z-50 text-white">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 88 }} spin />} />
            <p className="mt-3 text-lg text-blue-500 font-semibold">Vui lòng chờ...</p>
        </div>
    );
}
