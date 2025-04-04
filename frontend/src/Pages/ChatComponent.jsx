import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../Components/Sidebar";
import user from "../assets/user.png";
import socket from "../socket";

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [clientId, setClientId] = useState(null);

    // ✅ Fetch username from Redux store
    const username = useSelector((state) => state?.user?.user?.username) || "Anonymous";

    useEffect(() => {
        socket.on("connect", () => {
            setClientId(socket.id);
            socket.emit("registerUser", {
                username: username,
                socketId: socket.id,
            });
        });
    
        socket.on("message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
    
        return () => {
            socket.off("connect");
            socket.off("message");
        };
    }, [username]);
    

    // ✅ Handle sending message
    const handleSendMessage = (e) => {
        e.preventDefault();
    
        if (newMessage.trim() === "") return;
    
        const messageData = {
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            img: user,
            username: username,
            senderId: socket.id,
        };
    
        socket.emit("chatMessage", messageData);
        setNewMessage(""); // ✅ Just clear the input
    };
    

    return (
        <div className="flex">
            <Sidebar />
            <section className="h-[100vh] w-full flex flex-col">
                {/* Header */}
                <div className="upper w-full h-[10vh] flex p-4 gap-5 items-center shadow-md bg-white">
                    <img src={user} alt="User" className="w-12 h-12 rounded-full" />
                    <h1 className="text-2xl font-bold">Pixie Dust</h1>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                    {messages.map((message, index) => {
                        const isSent = message.senderId === clientId;

                        return (
                            <div
                                key={index}
                                className={`flex items-start gap-2 mb-4 max-w-[60%] p-3 rounded-lg 
                                    ${isSent ? 'ml-auto flex-row-reverse bg-[#6F0081] text-white' : 'mr-auto bg-gray-200 text-black'}`}
                            >
                                <img src={message.img || user} alt="User" className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className={`text-xs font-bold mb-1 ${isSent ? 'text-purple-200' : 'text-gray-700'}`}>
                                        {isSent ? "You" : message.username || "Anonymous"}
                                    </p>
                                    <p>{message.text}</p>
                                    <p className={`text-xs mt-1 ${isSent ? 'text-purple-200' : 'text-gray-500'}`}>
                                        {message.time}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F0081]"
                        />
                        <button type="submit" className="p-3 bg-[#6F0081] text-white rounded-lg hover:bg-purple-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ChatComponent;
