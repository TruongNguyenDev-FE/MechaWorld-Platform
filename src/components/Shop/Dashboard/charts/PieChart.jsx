import { Card, Typography } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import { useEffect, useRef } from "react";
import { Pie } from "@antv/g2plot";
import { groupBy } from "@antv/util";

const { Title, Text } = Typography;

const PieChart = ({ shopData, onElementClick, onElementDoubleClick }) => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    
    if (shopData.length === 0) {
      return null;
    }
    if (!containerRef.current) return;
    // Clear previous chart if exists
    // Process data for pie chart
    const pieData = Object.entries(groupBy(shopData, "grade")).map(
      ([type, list]) => ({
        type,
        value: list.reduce((acc, item) => acc + item.value, 0),
      })
    );
    
    // Create and render pie chart
    chartRef.current = new Pie(containerRef.current, {
      data: pieData,
      angleField: "value",
      colorField: "type",
      radius: 0.8,
      innerRadius: 0.7,
      label: {
        type: "spider",
        content: "{name}\n{percentage}",
      },
      legend: { position: "bottom" },
      interactions: [{ type: "element-active" }],
      animation: {
        appear: {
          animation: "wave-in",
          duration: 1000,
        },
      },
      statistic: {
        title: {
          content: "Tổng cộng", 
          style: {
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        content: {
          content: `₫${pieData
            .reduce((acc, item) => acc + item.value, 0)
            .toLocaleString("vi-VN")}`, 
          style: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#1890ff",
          },
        },
      },
    });

    chartRef.current.render();

    // Set up event handlers
    if (onElementClick) {
      chartRef.current.on("element:click", (evt) => {
        const type = evt.data?.data?.type;
        onElementClick(type);
      });
    }

    if (onElementDoubleClick) {
      chartRef.current.on("element:dblclick", () => {
        onElementDoubleClick();
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [shopData, onElementClick, onElementDoubleClick]);

  return (
    <Card
      title={
        <Title level={5}>
          <BarChartOutlined /> Tỷ lệ doanh thu theo loại sản phẩm
        </Title>
      }
      className="shadow-sm hover:shadow-md transition-shadow"
      extra={<Text type="secondary">Nhấp đúp để xem tất cả dữ liệu</Text>}
    >
      <div ref={containerRef} style={{ height: 360 }} />
    </Card>
  );
};

export default PieChart;
