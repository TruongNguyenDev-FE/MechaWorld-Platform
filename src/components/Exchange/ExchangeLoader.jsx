import { Spin } from 'antd';

const ExchangeLoader = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin tip={<span className='text-blue-600 text-lg'>Đang tải trao đổi...</span>} size="large" />
    </div>
  );
};

export default ExchangeLoader;
