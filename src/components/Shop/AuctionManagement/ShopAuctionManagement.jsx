import { Tabs, Card } from "antd";
import { useState } from "react";
import { TrophyOutlined, FileTextOutlined } from "@ant-design/icons";

import AuctionList from "./AuctionList";
import AuctionRequests from "./AuctionRequests";

const { TabPane } = Tabs;

const ShopAuctionManagement = () => {
  const [activeTab, setActiveTab] = useState("auctions");

  return (
    <div className="w-full px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="">
          <h1 className="text-2xl uppercase font-bold text-gray-800 mb-2">Quản lý đấu giá</h1>
          <p className="text-gray-600">Theo dõi và quản lý các phiên đấu giá của bạn</p>
        </div>

        {/* Tabs Card */}
        <Card style={{padding: 0}} className="border-0 overflow-hidden">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="auction-management-tabs"
            size="large"
            tabBarStyle={{
              borderBottom: '2px solid #f0f0f0'
            }}
          >
            <TabPane
              tab={
                <div className="flex items-center space-x-2 px-2">
                  <TrophyOutlined className="text-lg" />
                  <span className="font-semibold">Đấu giá đang diễn ra</span>
                </div>
              }
              key="auctions"
            >
              <div className="w-full">
                <AuctionList />
              </div>
            </TabPane>

            <TabPane
              tab={
                <div className="flex items-center space-x-2 px-2">
                  <FileTextOutlined className="text-lg" />
                  <span className="font-semibold">Yêu cầu đấu giá</span>
                </div>
              }
              key="requests"
            >
              <div className="w-full">
                <AuctionRequests />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ShopAuctionManagement;
