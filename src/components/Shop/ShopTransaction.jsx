import {  Table, Row, Space, Input, Tag } from "antd";

const columns = [
  {
    title: "Mã đơn hàng",
    dataIndex: "code",
    width: 40,
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    width: 100,
  },
  {
    title: "Người mua",
    dataIndex: "buyer",
    width: 50,
  },
  {
    title: "Giá bán",
    dataIndex: "price",
    width: 50,
  },
  {
    title: "Trạng thái",
    dataIndex: 'action',
    key: 'action',
    width: 50,
    render: (_, { action }) => {
      if (Array.isArray(action)) { 
        return (
          <>
            {action.map((status) => {
              let color = '';

              switch (status) {
                case 'Sold':
                  color = 'green';
                  break;
                case 'Cancel':
                  color = 'red';
                  break;
                case 'Pending':
                  color = 'orange';
                  break;
                default:
                  color = 'volcano';
              }

              return (
                <Tag color={color} key={status}>
                  {status.toUpperCase()}
                </Tag>
              );
            })}
          </>
        );
      } else { 
        let color = '';
        switch (action) {
          case 'Sold':
            color = 'green';
            break;
          case 'Cancel':
            color = 'red';
            break;
          case 'Pending':
            color = 'orange';
            break;
          default:
            color = 'volcano';
        }
        return <Tag color={color}>{action.toUpperCase()}</Tag>;
      }
    },
  },
];
const dataSource = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i,
  code: `BUY-GD-${i+1}`,
  name: `BANDAI MG 1/100 Gundam 00V 00 Qant[T] Full Saver Painted Plastic Model Kit ${i}`,
  price: 320000,
  buyer: `Huy`,
  action: i % 3 === 0 ? ['Pending'] : 'Sold',
}));

function ShopTransaction() {
  return (
    <div>
      {/*Content */}
      <div className="container-content">
        <Row>
          <Space style={{ marginBottom: 16 }}>
            <Input.Search placeholder="Tìm kiếm sản phẩm" />
          </Space>
        </Row>
        <Row>
          <Table
            className={{}}
            columns={columns}
            dataSource={dataSource}
            pagination={{
                defaultPageSize: 20,
            }}
            scroll={{
              y: 55 * 10,
            }}
          />
        </Row>
      </div>


    </div>
  );
}

export default ShopTransaction;
