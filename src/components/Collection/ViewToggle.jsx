import { Button } from 'antd';
import {
    AppstoreOutlined,
    TableOutlined,
    PictureOutlined
} from '@ant-design/icons';

const ViewToggle = ({ viewMode, setViewMode }) => (
    <div className="mb-0">
        <Button.Group>
            <Button
                type={viewMode === 'grid' ? 'primary' : 'default'}
                className={viewMode === 'grid' ? 'bg-blue-400' : 'default'}
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode('grid')}
            />
            <Button
                type={viewMode === 'table' ? 'primary' : 'default'}
                className={viewMode === 'table' ? 'bg-blue-400' : 'default'}
                icon={<TableOutlined />}
                onClick={() => setViewMode('table')}
            />
            <Button
                type={viewMode === 'gallery' ? 'primary' : 'default'}
                className={viewMode === 'gallery' ? 'bg-blue-400' : 'default'}
                icon={<PictureOutlined />}
                onClick={() => setViewMode('gallery')}
            />
        </Button.Group>
    </div>
);

export default ViewToggle;