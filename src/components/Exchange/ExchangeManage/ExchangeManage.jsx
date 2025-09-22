import { useState } from "react";
import { Tabs, Card } from "antd";

import ExchangeManageList from "./ExchangeManageList";
import ExchangeManageNegotiation from "./ExchangeManageNegotiation";

const { TabPane } = Tabs;


export default function ExchangeManage() {
    const [activeTab, setActiveTab] = useState("1");

    return (
        <div className="max-w-7xl mx-auto mt-36 px-4 py-6">
            <Card
                className="shadow-md px-3 py-5"
            >
                <Tabs
                    centered
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    type="card"
                    size="large"
                    className="gundam-tabs"
                >
                    <TabPane tab="Quản lý các cuộc trao đổi" key="1">
                        {/* List các Trao đổi Request */}
                        <ExchangeManageList />
                    </TabPane>

                    <TabPane tab="Quản lý các đề xuất trao đổi" key="2">
                        {/* List các Trao đổi đang Thương lượng */}
                        <ExchangeManageNegotiation />
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
}