import React, { useEffect, useState } from "react";
import { getAllUsers, getAllFriendsByUser } from "../api/userApi";
import { useUser } from "../context/userContext";
import { addNotification } from '../api/notificationApi';

function SearchAllUsers({ socket, onlineUsers }) {
    const { user } = useUser();
    const [allUsers, setAllUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [icon, setIcon] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllFriendsByUser();
                setFriends(data.data);
            } catch (err) {
                console.log("Failed to fetch users");
            }
        };
        fetchData();
    }, []); // Dependency array

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllUsers();
                setAllUsers(data);
            } catch (err) {
                console.log("Failed to fetch users");
            }
        };
        fetchData();
    }, []); // Dependency array

    const handleSendRequest = async (e) => {
        const receiverId = e.currentTarget.getAttribute('userid');
        if (!socket) return;
        try {
            const response = await addNotification(receiverId, 'friend_request');
            setIcon({ id: receiverId, iconClass: "bi bi-check2-circle" });
            socket.emit('send_notification', {
                sender: user.name,
                receiverId,
                type: 'friend_request',
                socketID: socket.id,
                data: response.data
            });
            console.log("Notification sent", response.data);
        } catch (err) {
            console.log("Notification not sent");
            setIcon({ id: receiverId, iconClass: "bi bi-exclamation-circle" });
        }
    }

    return <>
        <div className="d-flex flex-column h-100">
            <div className="hide-scrollbar">
                <div className="container py-8">

                    {/* <!-- Title --> */}
                    <div className="mb-8">
                        <h2 className="fw-bold m-0">All Users</h2>
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
                        {allUsers && allUsers.length > 0 ? (
                            allUsers.map((user) => (
                                <div className="card border-0" key={user._id}>
                                    <div className="card-body">

                                        <div className="row align-items-center gx-5">
                                            <div className="col-auto">
                                                <a href="/" className="avatar "><span className="avatar-text">
                                                    {user.name[0].toUpperCase()}</span>
                                                </a>
                                            </div>

                                            <div className="col">
                                                <h5>{user.name}</h5>
                                                <p>
                                                {onlineUsers && onlineUsers.find((item) => item.userId === user._id)
                                                    ? <p>Online</p>
                                                    : <p>Offline</p>}
                                                </p>
                                            </div>

                                            <div className="col-auto">
                                                {
                                                    friends.some((friend) => friend._id === user._id) ? (
                                                        <button
                                                            className="text-muted bg-transparent border-0 p-0 fs-1"
                                                            userid={user._id}
                                                            title="Friend Request Sent"
                                                            onClick={handleSendRequest} disabled={true}>
                                                            <i className="bi bi-person-fill-check"></i>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="text-muted bg-transparent border-0 p-0 fs-1"
                                                            userid={user._id}
                                                            onClick={handleSendRequest}
                                                            title="Add Friend">
                                                            <i className={icon && icon.id === user._id ? icon.iconClass : "bi bi-person-fill-add"}></i>
                                                        </button>
                                                    )
                                                }
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="card border-0 text-reset">
                                    <div className="card-body">
                                        <div className="row gx-5">
                                            <div className="col-auto">
                                                <div className="avatar">
                                                    <svg className="avatar-img placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false">
                                                        <title>Placeholder</title>
                                                        <rect width="100%" height="100%" fill="#868e96"></rect>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="d-flex align-items-center mb-3">
                                                    <h5 className="placeholder-glow  w-100  mb-0">
                                                        <span className="placeholder col-5"></span>
                                                    </h5>
                                                </div>
                                                <div className="placeholder-glow">
                                                    <span className="placeholder col-12"></span>
                                                    <span className="placeholder col-8"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- .card-body --> */}
                                </div>
                                <div className="card border-0 text-reset">
                                    <div className="card-body">
                                        <div className="row gx-5">
                                            <div className="col-auto">
                                                <div className="avatar">
                                                    <svg className="avatar-img placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false">
                                                        <title>Placeholder</title>
                                                        <rect width="100%" height="100%" fill="#868e96"></rect>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="d-flex align-items-center mb-3">
                                                    <h5 className="placeholder-glow  w-100  mb-0">
                                                        <span className="placeholder col-5"></span>
                                                    </h5>
                                                </div>
                                                <div className="placeholder-glow">
                                                    <span className="placeholder col-12"></span>
                                                    <span className="placeholder col-8"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- .card-body --> */}
                                </div>
                            </>
                        )}

                    </div> { /* Cards List End */}

                </div>
            </div>
        </div>
    </>;
}

export default SearchAllUsers