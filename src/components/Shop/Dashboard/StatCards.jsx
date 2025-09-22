import { Col, Card, Statistic } from 'antd';

const StatCards = ({ stats }) => {
    return (
        <>
            {stats.map((stat, index) => (
                <Col xs={24} md={12} lg={6} key={index}>
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title={<span className="text-gray-600">{stat.title}</span>}
                            value={stat.value}
                            valueStyle={{ color: stat.color }}
                        />
                    </Card>
                </Col>
            ))}
        </>
    );
};

export default StatCards;