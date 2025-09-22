import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ViewToggle from './ViewToggle';

const CollectionHeader = ({ setIsCreating, viewMode, setViewMode }) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreating(true)}
                className="mr-2 bg-blue-500"
            >
                Thêm mô hình
            </Button>
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
    );
};

export default CollectionHeader;