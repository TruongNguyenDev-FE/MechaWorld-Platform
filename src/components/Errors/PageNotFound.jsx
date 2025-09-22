import { Result } from 'antd';

const PageNotFound = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-white px-4 mt-12">
            <Result
                status="404"
                title={<span className="text-7xl font-bold text-gray-800">404</span>}
                subTitle={
                    <div className="text-gray-600 text-base">
                        Trang bạn đang tìm kiếm không tồn tại. Vui lòng quay lại trang chủ hoặc thử lại sau.
                    </div>
                }
                // extra={
                //     <Link to="/">
                //         <Button type="primary" className="rounded-full px-6 py-2 text-white bg-blue-600 hover:bg-blue-700">
                //             Về trang chủ
                //         </Button>
                //     </Link>
                // }
            />
        </div>
    );
};

export default PageNotFound;
