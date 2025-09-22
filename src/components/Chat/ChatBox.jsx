import { useState } from "react";
import { Modal, Tooltip, Input } from "antd";
import { MessageOutlined, SendOutlined } from "@ant-design/icons";

import Shop1 from '../../assets/image/logo.png';
import Shop2 from '../../assets/image/logo2.png'

const sellers = [
    { id: 1, name: "Nghiện Gundam", avatar: Shop1 },
    { id: 2, name: "Gundam Master", avatar: Shop2 }
];

const sampleMessages = {
    1: [
        { text: "Chào bạn!", sender: "user" },
        { text: "Chào bạn! Bạn cần hỗ trợ gì ạ?", sender: "seller" },
        { text: "Mình muốn hỏi về mẫu Gundam RX-78-2.", sender: "user" }
    ],
    2: [
        { text: "Xin chào!", sender: "user" },
        { text: "Chào bạn! Bạn đang quan tâm đến sản phẩm nào?", sender: "seller" }
    ]
};

export default function ChatBox() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(sellers[0]);
    const [messages, setMessages] = useState(sampleMessages);
    const [inputMessage, setInputMessage] = useState("");

    const openChat = () => setIsChatOpen(true);
    const closeChat = () => setIsChatOpen(false);

    const sendMessage = () => {
        if (!inputMessage.trim()) return;
        setMessages({
            ...messages,
            [selectedSeller.id]: [...messages[selectedSeller.id], { text: inputMessage, sender: "user" }]
        });
        setInputMessage("");
    };

    return (
        <>
            <Tooltip placement="bottom" title="Tin nhắn">
                <button onClick={openChat}>
                    <MessageOutlined className="text-2xl" />
                </button>
            </Tooltip>

            <Modal open={isChatOpen} onCancel={closeChat} footer={null} width={700} className="chat-modal">
                <div className="flex h-[500px]">
                    {/* Left Sidebar - Chat List */}
                    <div className="w-2/6 p-4 border-r flex flex-col">
                        <div className="flex items-center mb-8 space-x-4">
                            <MessageOutlined className="cursor-pointer text-3xl text-blue-500" />
                            <h3 className="text-2xl font-semibold">CHAT</h3>
                        </div>
                        {sellers.map((seller) => (
                            <div
                                key={seller.id}
                                onClick={() => setSelectedSeller(seller)}
                                className={`p-3 flex items-center gap-2 cursor-pointer rounded-lg ${selectedSeller.id === seller.id ? "bg-blue-200" : "hover:bg-gray-200"
                                    }`}
                            >
                                <img src={seller.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                                {seller.name}
                            </div>
                        ))}
                    </div>

                    {/* Right Side - Chat Box */}
                    <div className="w-4/6 flex flex-col">
                        {/* Header */}
                        <div className="p-4 bg-white border-b flex items-center gap-3">
                            <img src={selectedSeller.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                            <div>
                                <div className="font-semibold">{selectedSeller.name}</div>
                                <div className="text-sm text-gray-500">Hoạt động 2 tháng trước</div>
                            </div>
                        </div>
                        {/* <div className="p-3 bg-orange-100 flex items-center justify-between text-sm">
                            <span>Đang chờ yêu cầu được chấp nhận...</span>
                            <Button size="small">Xem thông tin yêu cầu</Button>
                        </div> */}

                        {/* Chat Messages */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                            {messages[selectedSeller.id].map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 p-2 max-w-[70%] rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-300"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 border-t flex items-center gap-2 bg-white">
                            <Input
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onPressEnter={sendMessage}
                                placeholder="Gửi tin nhắn..."
                            />
                            <button onClick={sendMessage} className="text-blue-500 text-2xl">
                                <SendOutlined />
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
