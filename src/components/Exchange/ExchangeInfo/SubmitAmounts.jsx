import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Radio, Avatar } from 'antd';

const SubmitAmounts = ({ 
  exchangeId,
  self,
  theOther,
  fetchExchangeDetails, 
  setIsLoading,
}) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [applyOffset, setApplyOffset] = useState(true);
  const [offsetPayer, setOffsetPayer] = useState(self.id);
  const [offsetAmount, setOffsetAmount] = useState('');
  const options = [
    { label: 'Bạn', value:  self.id},
    { label: (
      <div>
        <Avatar src={theOther.avatar} alt={theOther.full_name} style={{ marginRight: '8px' }} />
        <span>{theOther.full_name}</span>
      </div>
    ), value: theOther.id },
  ];
  const options2 = [
    { label: 'Bạn', value: self.id },
    { label: (
      <div>
        <Avatar src={theOther.avatar} alt={theOther.full_name} style={{ marginRight: '8px' }} />
        <span>{theOther.full_name}</span>
      </div>
    ), value: theOther.id },
  ];
  const handleDepositChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setDepositAmount(formatCurrency(value));
  };

  const handleOffsetAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setOffsetAmount(formatCurrency(value));
  };

  const formatCurrency = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Nửa trái: Form nhập liệu */}

        <Form className='flex-1'>
            <Form.Item label="Mức tiền cọc" name="depositAmount">
                <Input
                    className='w-2/6'
                    type="text"
                    value={depositAmount}
                    onChange={handleDepositChange}
                    placeholder="0"
                />
            </Form.Item>
            <Form.Item label="Áp dụng trao đổi bù trừ tiền" name="applyOffset">
              <Radio.Group
                options={options}
                onChange={(e) => setApplyOffset(e.target.value)}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
            <Form.Item label="Người thực hiện bù trừ tiền" name="offsetPayer">
                <Radio.Group
                    options={options2}
                    onChange={(e) => setOffsetPayer(e.target.value)}
                    value={offsetPayer}
                    optionType="button"
                    buttonStyle="solid"
                />
            </Form.Item>
            <Form.Item label="Mức đền bù" name="offsetAmount">
                <Input
                    className='w-2/6'
                    type="text"
                    value={offsetAmount}
                    onChange={handleOffsetAmountChange}
                    placeholder="0"
                />
            </Form.Item>
        </Form>
      

      {/* Nửa phải: Lưu ý */}
      <div style={{ flex: 1, padding: '20px', color: 'red' }}>
        <h2 className='bo'> Lưu ý</h2>
        <p>Vui lòng đảm bảo rằng bạn đã hiểu rõ các điều khoản về tiền cọc và bù trừ trước khi tiếp tục.</p>
        {/* Thêm các lưu ý khác nếu cần */}
      </div>
    </div>
  );
};
SubmitAmounts.propTypes = {
  exchangeData: PropTypes.shape({
    exchange: PropTypes.shape({
        post: PropTypes.shape({
            user: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default SubmitAmounts;
