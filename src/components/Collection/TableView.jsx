import { Button, Tag } from 'antd';
// import {
//     HeartFilled,
//     HeartOutlined,
//     StarFilled,
//     StarOutlined
// } from '@ant-design/icons';
import { getGradeColor } from './utils';

const TableView = ({ data, showDetailModal, toggleFavorite, toggleWishlist }) => {
    return (
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên mô hình</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phân khúc & Tỷ lệ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dòng phim</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                    <tr key={item.gundam_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                    <img className="h-10 w-10 rounded-md object-cover" src={item.primary_image_url} alt="" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    <div className="text-sm text-gray-500">{item.manufacturer}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Tag color={getGradeColor(item.grade)}>{item.grade}</Tag>
                            <span className="text-gray-500 ml-2">{item.scale}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.series}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                            <Button type="link" onClick={() => showDetailModal(item)}>
                                Chi tiết
                            </Button>
                            {/* <Button
                                type="text"
                                icon={item.is_favorite ? <HeartFilled style={{ color: '#f5222d' }} /> : <HeartOutlined />}
                                onClick={() => toggleFavorite(item.gundam_id)}
                            />
                            <Button
                                type="text"
                                icon={item.is_wishlist ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                                onClick={() => toggleWishlist(item.gundam_id)}
                            /> */}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableView;