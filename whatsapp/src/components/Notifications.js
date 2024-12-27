import { useState, useEffect } from "react";
import { useNotification } from "../context/notificationContext";
import { updatedNotification } from "../api/notificationApi";
import {useUser} from "../context/userContext";

function Notifications({ socket }) {
    const { user } = useUser();
    const { notifications, setNotifications } = useNotification();
    const [requestStatus, setRequestStatus] = useState([]);
    const handleRequest = async (e) => {
        const status = e.currentTarget.getAttribute('data-status');
        const receiverId = e.currentTarget.getAttribute('senderid');
        const notificationId = e.currentTarget.getAttribute('notificationid');
        try {
            const response = await updatedNotification(notificationId, status);
            setRequestStatus([
                ...requestStatus,
                { id: notificationId, status }
            ]);
            socket && socket.emit('send_notification', {
                sender: user.name,
                receiverId,
                type: 'friend_request',
                socketID: socket.id,
                data: response.data.data
            });
        } catch (err) {
            console.log(err);
        }
    }

    // console.log(requestStatus);
    useEffect(() => {
        socket && socket.on("receive_notification", (data) => {
            // setNotifications((prevNotifications) => [...prevNotifications, data.data]);
            setNotifications((prevNotifications) => {
                // Check if the notification already exists
                const exists = prevNotifications.some(
                    (notification) => notification._id === data.data._id
                );
                // If it doesn't exist, append it to the state
                return exists ? prevNotifications : [data.data, ...prevNotifications];
            });
        });
    }, []);

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

    return <>
        <div className="d-flex flex-column h-100">
            <div className="hide-scrollbar">
                <div className="container py-8">

                    {/* <!-- Title --> */}
                    <div className="mb-8">
                        <h2 className="fw-bold m-0">Notifications</h2>
                    </div>

                    {/* <!-- Search --> */}
                    <div className="mb-6">
                        <form action="#">
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

                    {/* <!-- Today --> */}
                    <div className="card-list">

                        {/* <!-- Card --> */}
                        {
                            notifications && notifications.length > 0 ? (
                                notifications.map((notification) => {
                                    if (notification.type === 'message') {
                                        return (
                                            <div className="card border-0" key={notification._id}>
                                                <div className="card-body">
                                                    <div className="row gx-5">
                                                        <div className="col-auto">
                                                            <a href="#" className="avatar">
                                                                <span className="avatar-text">{notification.metadata.senderName[0]}</span>
                                                            </a>
                                                        </div>
                                                        <div className="col">
                                                            <div className="d-flex align-items-center mb-2">
                                                                <h5 className="me-auto mb-0">
                                                                    <a href="#">{notification.metadata.senderName}</a>
                                                                </h5>
                                                                <span className="extra-small text-muted ms-2">{formatDateTime(notification.updatedAt)}</span>
                                                            </div>
                                                            <div className="d-flex">
                                                                <div className="me-auto">{notification.content}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    } else {

                                        return (
                                            <div className="card border-0 mb-5" key={notification._id} >
                                                <div className="card-body">
                                                    <div className="row gx-5">
                                                        <div className="col-auto">
                                                            <a href="#" className="avatar">
                                                                <span className="avatar-text">{notification.metadata.senderName[0]}</span>
                                                            </a>
                                                        </div>

                                                        <div className="col">
                                                            <div className="d-flex align-items-center mb-2">
                                                                <h5 className="me-auto mb-0">
                                                                    <a href="#">{notification.metadata.senderName}</a>
                                                                </h5>
                                                                <span className="extra-small text-muted ms-2">{formatDateTime(notification.updatedAt)}</span>
                                                            </div>

                                                            <div className="d-flex">
                                                                <div className="me-auto">{notification.content}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {notification.metadata.status === 'pending' && (
                                                    <div className="card-footer">
                                                        <div className="row gx-4">
                                                            {
                                                                requestStatus && requestStatus.find((item) => item.id === notification._id) ? (
                                                                    requestStatus.find((item) => item.id === notification._id).status === 'accept' ? (
                                                                        <div className="col">
                                                                            <button onClick={handleRequest}
                                                                                data-status="accept"
                                                                                disabled={true}
                                                                                className="btn btn-sm btn-primary w-100">Accepted</button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="col">
                                                                            <button onClick={handleRequest}
                                                                                data-status="decline"
                                                                                disabled={true}
                                                                                className="btn btn-sm btn-soft-primary w-100">Declined</button>
                                                                        </div>
                                                                    )
                                                                ) : (
                                                                    <>
                                                                        <div className="col">
                                                                            <button onClick={handleRequest}
                                                                                data-status="decline"
                                                                                notificationid={notification._id}
                                                                                senderid={notification.metadata.senderId}
                                                                                className="btn btn-sm btn-soft-primary w-100">Decline</button>
                                                                        </div>
                                                                        <div className="col">
                                                                            <button
                                                                                onClick={handleRequest}
                                                                                data-status="accept"
                                                                                senderid={notification.metadata.senderId}
                                                                                notificationid={notification._id}
                                                                                className="btn btn-sm btn-primary w-100">Accept</button>
                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        )
                                    }
                                })
                            ) : (
                                <p className="text-center py-5">No Notifications</p>
                            )
                        }
                        {/* <!-- Card --> */}

                    </div>
                </div>
            </div>
        </div>
    </>;
}

export default Notifications;