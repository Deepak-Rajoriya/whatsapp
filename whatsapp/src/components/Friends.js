import React, { useEffect, useState, useCallback } from "react";
import { getAllFriendsByUser } from "../api/userApi";
import { getChatByParticipant, createChat, getChatById } from "../api/chatApi";
import { useNavigate } from "react-router-dom";

function Friends({ onlineUsers }) {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const data = await getAllFriendsByUser();
                setFriends(data.data);
            } catch (err) {
                console.log("Failed to fetch users");
            }
        };
        fetchFriends();
    }, []); // Dependency array

    const handleOpenChat = async (e) => {
        const receiverId = e.currentTarget.getAttribute('userid');
        try {
            const response = await getChatByParticipant(receiverId);
            if (response.data.length > 0) {
                navigate('/dashboard/chats/' + response.data[0]._id);
            } else {
                const response = await createChat(receiverId);
                navigate('/dashboard/chats/' + response.data._id);
            }
        } catch (err) {
            console.log("Failed to fetch chats");
        }
    }
    
    // const getLastMessage = async (receiverId) => {
    //     try {
    //         const response = await getChatByParticipant(receiverId);
    //         if (response.data) {
    //             return response.data[0].lastMessage;
    //         }
    //     } catch (err) {
    //         return 'No last message found';
    //     }
    // }

    return <>
        <div className="d-flex flex-column h-100">
            <div className="hide-scrollbar">
                <div className="container py-8">

                    {/* <!-- Title --> */}
                    <div className="mb-8">
                        <h2 className="fw-bold m-0">Friends</h2>
                    </div>

                    {/* <!-- Search --> */}
                    <div className="mb-6">
                        <form action="/">
                            <div className="input-group">
                                <div className="input-group-text">
                                    <div className="icon icon-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                    </div>
                                </div>

                                <input type="text" className="form-control form-control-lg ps-0" placeholder="Search messages or users" aria-label="Search for messages or users..." />
                            </div>
                        </form>
                    </div>

                    {/* <!-- List --> */}
                    <div className="card-list">
                        {friends && friends.length > 0 ? (
                            friends.map((user) => (
                                <div className="card border-0" userid={user._id} key={user._id} onClick={handleOpenChat}>
                                    <div className="card-body">
                                        <div className="row align-items-center gx-5">
                                            <div className="col-auto">
                                                <div className="avatar "><span className="avatar-text">
                                                    {user.name[0].toUpperCase()}</span>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <h5>{user.name}</h5>
                                                {onlineUsers && onlineUsers.find((item) => item.userId === user._id)
                                                    ? <p>Online</p>
                                                    : <p>Offline</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                <p className="text-center py-5">No Friends</p>
                            </>
                        )}

                    </div> { /* Cards List End */}

                </div>
            </div>
        </div>
    </>;
}

export default Friends