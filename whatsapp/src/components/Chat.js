import React, { useState, useEffect, use } from 'react'
import { useUser } from '../context/userContext';
import { getChatById } from '../api/chatApi';
import { getUserById } from '../api/userApi';
import { getMessageByChatId, addMessageByChatId } from '../api/messageApi'

function Chat({ socket, chatId }) {
    const { user } = useUser();
    const [message, setMessage] = useState('');
    const [receiver, setReceiver] = useState(null);
    const [allMsgs, setAllMsgs] = useState(null);

    // Fetch messages and receiver when chatId or user changes
    useEffect(() => {
        if (!chatId || !user) return; // Don't proceed if either chatId or user is missing

        const fetchMessages = async () => {
            try {
                const messages = await getMessageByChatId(chatId);
                setAllMsgs(messages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const fetchReceiver = async () => {
            try {
                // Fetch chat data by chatId
                const chatData = await getChatById(chatId);
                if (chatData.data && chatData.data.participants && user) {
                    // Find the receiverId by excluding the current user's _id
                    const receiverId = chatData.data.participants.find((id) => id !== user._id);

                    // Fetch user data for the receiver
                    const userData = await getUserById(receiverId);
                    setReceiver(userData);
                }
            } catch (error) {
                console.error('Error fetching chat data:', error);
            }
        };
        fetchMessages();
        fetchReceiver();
    }, [chatId, user]); // Re-run when chatId or user state changes

    // Helper function to format date
    const formatDateTime = (date) => {
        const options = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };
        return new Date(date).toLocaleString("en-US", options).replace(",", "");
    };

    // Listen for incoming messages
    useEffect(() => {
        const handleReceiveMessage = async (data) => {
            setAllMsgs((prevMessages) => [...prevMessages, data.message]);
        };
        if (!socket) return;
        // Listen for incoming messages
        socket.on("receive_message", handleReceiveMessage);

        // Cleanup when the component unmounts or socket changes
        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket]);

    const sendMessage = async () => {
        if (!message.trim()) {
            console.error("Cannot send an empty message");
            return;
        }
        if (!socket) return;
        try {
            // Send the message to the server
            const response = await addMessageByChatId(receiver._id, chatId, message);
            if (response && response.data) {
                // Emit the message via socket
                socket.emit("send_message", {
                    senderId: user._id,
                    receiverId: receiver._id,
                    message: response.data,
                });

                // Add the message to the state
                setAllMsgs((prevMessages) => [...prevMessages, response.data]);

                // Clear the message input
                setMessage('');
            } else {
                console.error("Failed to send message: No data in response");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
    // Handle key press
    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const handleSendMessage = () => {
        sendMessage();
    };

    return (

        <div className="d-flex flex-column h-100 position-relative">
            {/* <!-- Chat: Header --> */}
            <div className="chat-header border-bottom py-4 py-lg-7">
                <div className="row align-items-center">

                    {/* <!-- Content --> */}
                    <div className="col-8 col-xl-12">
                        <div className="row align-items-center text-center text-xl-start">
                            {/* <!-- Title --> */}
                            <div className="col-12 col-xl-6">
                                <div className="row align-items-center gx-5">
                                    <div className="col-auto">
                                        <div className="avatar d-none d-xl-inline-block">
                                            <span className="avatar-text">{receiver && receiver.name[0]}</span>
                                        </div>
                                    </div>

                                    <div className="col overflow-hidden">
                                        <h5 className="text-truncate">{receiver && receiver.name}</h5>
                                        <p className="text-truncate">
                                            {/* Online */}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Title --> */}
                        </div>
                    </div>
                    {/* <!-- Content --> */}

                </div>
            </div>
            {/* <!-- Chat: Header --> */}

            {/* <!-- Chat: Content --> */}
            <div className="chat-body hide-scrollbar flex-1 h-100">
                <div className="chat-body-inner" style={{ paddingBottom: '87px' }}>
                    <div className="py-6 py-lg-12">
                        {allMsgs && allMsgs.map((msg) => (
                            <div key={msg._id} className={(msg.senderId === user._id) ? "message message-out" : "message"}>
                                <div className="message-inner">
                                    <div className="message-body">
                                        <div className="message-content">
                                            <div className="message-text">
                                                <p>{msg.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="message-footer">
                                        <span className="extra-small text-muted">{formatDateTime(msg.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
            {/* <!-- Chat: Content --> */}

            {/* <!-- Chat: Footer --> */}
            <div className="chat-footer pb-3 pb-lg-7 position-absolute bottom-0 start-0">
                {/* <!-- Chat: Files --> */}
                <div className="dz-preview bg-dark" id="dz-preview-row" data-horizontal-scroll="">
                </div>
                {/* <!-- Chat: Files --> */}

                {/* <!-- Chat: Form --> */}
                <div className="chat-form rounded-pill bg-dark" data-emoji-form="">
                    <div className="row align-items-center gx-0">

                        <div className="col">
                            <div className="input-group">
                                <textarea
                                    id='messageBox'
                                    className="form-control pr-0"
                                    onChange={(e) => setMessage(e.target.value)}
                                    value={message}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type your message..." rows="1" data-emoji-input="" data-autosize="true"
                                    style={{ overflow: 'hidden', overflowWrap: 'break-word', resize: 'none', height: '47.2px' }}></textarea>
                            </div>
                        </div>

                        <div className="col-auto">
                            <button className="btn btn-icon btn-primary rounded-circle ms-5" onClick={handleSendMessage}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                    </div>
                </div>
                {/* <!-- Chat: Form --> */}
            </div>
            {/* <!-- Chat: Footer --> */}
        </div >
    )
}

export default Chat;