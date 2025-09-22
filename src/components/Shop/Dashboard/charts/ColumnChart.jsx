import { Card, Typography } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import { useEffect, useRef } from "react";
import { Column } from "@antv/g2plot";
import { Text } from "lucide-react";

const { Title } = Typography;

const ColumnChart = ({ data }) => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
    console.log(data);
  useEffect(() => {
    if (!containerRef.current) return;
    // Destroy existing chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Create and render column chart
    chartRef.current = new Column(containerRef.current, {
      data,
      isGroup: true,
      xField: "grade",
      yField: "value",
      seriesField: "type",
      columnStyle: { radius: [4, 4, 0, 0] },
      legend: { position: "top-right" },
      animation: {
        appear: {
          animation: "fade-in",
          duration: 800,
        },
      },
    });

    chartRef.current.render();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data]);
  if (!data || data.length === 0) {
    return (
      <Card
        title={
          <Title level={5}>
            <BarChartOutlined /> Doanh thu theo loại đơn hàng
          </Title>
        }
        className="shadow-sm hover:shadow-md transition-shadow"
      >
        <Text type="secondary">Không có dữ liệu để hiển thị</Text>
      </Card>
    );
  }
  return (
    <Card
      title={
        <Title level={5}>
          <BarChartOutlined /> Doanh thu theo loại đơn hàng
        </Title>
      }
      className="shadow-sm hover:shadow-md transition-shadow"
    >
      <div ref={containerRef} style={{ height: 360 }} />
    </Card>
  );
};

export default ColumnChart;
