import { Rate } from 'antd';
import { useState } from 'react';

const initialComments = [
    {
        name: 'Nguyễn Văn A',
        rating: 5,
        comment: 'Sản phẩm rất đẹp và chất lượng, giao hàng nhanh.',
        date: '2025-01-20',
    },
    {
        name: 'Trần Thị B',
        rating: 4,
        comment: 'Mô hình chi tiết, nhưng giao hàng hơi chậm.',
        date: '2025-01-18',
    },
];

export default function ReviewProduct() {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState({ name: '', rating: 0, comment: '' });

    const handleAddComment = () => {
        if (!newComment.name || !newComment.comment || newComment.rating === 0) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const updatedComments = [
            ...comments,
            { ...newComment, date: new Date().toISOString().split('T')[0] },
        ];
        setComments(updatedComments);
        setNewComment({ name: '', rating: 0, comment: '' });
    };
    return (
        <>
            <div className="comment-section bg-white rounded-lg shadow-lg">
                {/* Comments Section */}
                <div className="mt-12 p-4 border rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900">Đánh giá và Bình luận</h2>

                    {/* Rating Summary */}
                    <div className="flex items-center gap-4 mt-4">
                        <Rate disabled value={4.5} />
                        <p className="text-sm text-gray-500">4.5/5 từ {comments.length} đánh giá</p>
                    </div>

                    {/* Comment List */}
                    <div className="mt-6 space-y-6">
                        {comments.map((comment, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-medium text-gray-800">{comment.name}</p>
                                    <Rate disabled value={comment.rating} className="text-sm" />
                                </div>
                                <p className="text-sm text-gray-600">{comment.comment}</p>
                                <p className="text-xs text-gray-400 mt-2">Ngày: {comment.date}</p>
                            </div>
                        ))}
                    </div>

                    {/* Add Comment Form */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900">Thêm bình luận</h3>
                        <div className="mt-4 space-y-4">
                            <input
                                type="text"
                                placeholder="Tên của bạn"
                                value={newComment.name}
                                onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <Rate
                                value={newComment.rating}
                                onChange={(value) => setNewComment({ ...newComment, rating: value })}
                            />
                            <textarea
                                placeholder="Nhập bình luận của bạn"
                                value={newComment.comment}
                                onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                rows={4}
                            />
                            <button
                                onClick={handleAddComment}
                                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                            >
                                Gửi bình luận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}