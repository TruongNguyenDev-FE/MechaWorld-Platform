import { Upload, Button, message, Tooltip } from "antd";
import { DeleteOutlined, QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';

const ImageUpload = ({ primaryImage, setPrimaryImage, secondaryImages, setSecondaryImages }) => {

  // Xử lý chọn ảnh chính
  const handlePrimaryUpload = ({ file }) => {
    const selectedFile = file.originFileObj || file; // Đảm bảo lấy đúng file

    if (!selectedFile) {
      message.error("Lỗi: Không tìm thấy file hợp lệ!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPrimaryImage({ url: e.target.result, file: selectedFile });
      message.success("Đã chọn ảnh chính!");
    };
    reader.readAsDataURL(selectedFile); // Đọc file để hiển thị trước khi upload
  };


  // Xử lý ảnh phụ (tối đa 5 ảnh)
  const handleSecondaryUpload = ({ fileList }) => {
    // Lọc danh sách ảnh mới chưa có trong secondaryImages
    const newFiles = fileList.filter(
      (file) => !secondaryImages.some((img) => img.uid === file.uid)
    );
    // Nếu tổng số ảnh mới + ảnh hiện tại > 5 thì báo lỗi
    if (secondaryImages.length + newFiles.length > 5) {
      message.error("Chỉ có thể tải lên tối đa 5 ảnh phụ!");
      return;
    }
    console.log("File list sau khi thay đổi:", fileList);
    // Cập nhật state chỉ với ảnh mới
    // setSecondaryImages([...secondaryImages, ...newFiles]);
    setSecondaryImages(fileList);
  };

  // Xử lý khi xóa ảnh
  const handleRemoveImage = (file) => {
    setSecondaryImages((prevImages) => prevImages.filter((img) => img.uid !== file.uid));
    console.log("đã xóa");
  };



  return (
    <div>
      {/* Upload ảnh chính */}
      <div className="mb-4">
        <label className="font-bold flex items-center gap-1">
          <span className="text-red-500">*</span> Ảnh Chính
          <Tooltip title="Ảnh đại diện chính của sản phẩm, sẽ hiển thị đầu tiên với người mua.">
            <QuestionCircleOutlined className="text-gray-500 cursor-pointer" />
          </Tooltip>
        </label>

        <br />

        <Upload
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handlePrimaryUpload}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Tải ảnh chính lên</Button>
        </Upload>
        {primaryImage && (
          <div className="mt-3">
            <img src={primaryImage.url} alt="Ảnh chính" className="w-[200px] h-[200px] object-cover border rounded-lg" />
          </div>
        )}
      </div>

      {/* Upload nhiều ảnh phụ */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <label className="font-bold flex items-center gap-1">
            <span className="text-red-500">*</span> Ảnh Phụ
            <Tooltip title="Ảnh phụ để minh họa rõ hơn về sản phẩm từ nhiều góc độ khác nhau.">
              <QuestionCircleOutlined className="text-gray-500 cursor-pointer" />
            </Tooltip>
          </label>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => setSecondaryImages([])}
          >
            Xóa ảnh phụ
          </Button>
        </div>

        <br />

        <Upload
          multiple
          listType="picture-card"
          fileList={secondaryImages}
          onChange={handleSecondaryUpload}
          onRemove={handleRemoveImage}
          beforeUpload={() => false}
          maxCount={5}
        >
          {secondaryImages.length < 5 && "+ Thêm ảnh"}
        </Upload>
      </div>
    </div>
  );
};
ImageUpload.propTypes = {
  primaryImage: PropTypes.object,
  setPrimaryImage: PropTypes.func.isRequired,
  secondaryImages: PropTypes.array.isRequired,
  setSecondaryImages: PropTypes.func.isRequired,
};

export default ImageUpload;
