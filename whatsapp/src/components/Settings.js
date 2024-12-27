import React, { useState, useEffect, use } from "react";
import { useUser } from "../context/userContext";
import { updateUser } from "../api/userApi";

function Settings() {
    const { user } = useUser();
    const [userDetails, setUserDetails] = useState({
        name: user.name,
        email: user.email,
        phone: user.usermeta?.phone,
        bio: user.usermeta?.bio,
    });
    const [loginStatus, setLoginStatus] = useState({
        loading: false,
        error: null,
        message: null
    })
    const logout = () => {
        const authToken = localStorage.getItem('authToken') || null;
        if (!authToken) {
            alert("You are already logged out");
        } else {
            localStorage.removeItem('authToken');
            alert("Logged out successfully!");
            window.location.href = "/login";
        }
    }

    const handlesave = async (e) => {

        // Update login status to loading
        setLoginStatus({ ...loginStatus, loading: true, error: null });

        try {
            const response = await updateUser(userDetails);
            console.log(response);
            // Update login status and redirect
            setLoginStatus({ loading: false, error: null, message: "Saved" });
        } catch (err) {
            setLoginStatus({ loading: false, error: err, message: "Try again" });
        }
    };

    console.log(user);

    return <>
        <div className="d-flex flex-column h-100">
            <div className="hide-scrollbar">
                <div className="container py-8">

                    {/* <!-- Title --> */}
                    <div className="mb-8">
                        <h2 className="fw-bold m-0">Settings</h2>
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

                    {/* <!-- Profile --> */}
                    <div className="card border-0">
                        <div className="card-body">
                            <div className="row align-items-center gx-5">
                                <div className="col-auto">
                                    <div className="avatar">
                                        <span className="avatar-text">W</span>

                                        <div className="badge badge-circle bg-secondary border-outline position-absolute bottom-0 end-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2">
                                                </rect>
                                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                <polyline points="21 15 16 10 5 21"></polyline>
                                            </svg>
                                        </div>
                                        <input id="upload-profile-photo" className="d-none" type="file" />
                                        <label className="stretched-label mb-0" htmlFor="upload-profile-photo"></label>
                                    </div>
                                </div>
                                <div className="col">
                                    <h5>{user ? user.name : "Guest"}</h5>
                                    <p>{user ? user.email : "--"}</p>
                                </div>
                                <div className="col-auto">
                                    <button className="text-muted p-0 bg-transparent border-0" onClick={logout} title="Logout" >
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-out">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                                <polyline points="16 17 21 12 16 7"></polyline>
                                                <line x1="21" y1="12" x2="9" y2="12"></line>
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Profile --> */}

                    {/* <!-- Account --> */}
                    <div className="mt-8">
                        <div className="d-flex align-items-center mb-4 px-6">
                            <small className="text-muted me-auto">Account</small>
                        </div>

                        <div className="card border-0">
                            <div className="card-body py-2">
                                {/* <!-- Accordion --> */}
                                <div className="accordion accordion-flush" id="accordion-profile">
                                    <div className="accordion-item">
                                        <div className="accordion-header" id="accordion-profile-1">
                                            <a href="/" className="accordion-button text-reset collapsed" data-bs-toggle="collapse" data-bs-target="#accordion-profile-body-1" aria-expanded="false" aria-controls="accordion-profile-body-1">
                                                <div>
                                                    <h5>Profile settings</h5>
                                                    <p>Change your profile settings</p>
                                                </div>
                                            </a>
                                        </div>

                                        <div id="accordion-profile-body-1" className="accordion-collapse collapse" aria-labelledby="accordion-profile-1" data-parent="#accordion-profile">
                                            <div className="accordion-body">
                                                <div className="form-floating mb-6">
                                                    <input type="text" className="form-control" id="profile-name" placeholder="Name" onChange={(e) => setUserDetails({
                                                        ...userDetails,
                                                        name: e.target.value
                                                    })} value={userDetails && userDetails.name} />
                                                    <label htmlFor="profile-name">Name</label>
                                                </div>

                                                <div className="form-floating mb-6">
                                                    <input type="email" className="form-control" id="profile-email" placeholder="Email address"
                                                        onChange={(e) => setUserDetails({
                                                            ...userDetails,
                                                            email: e.target.value
                                                        })}
                                                        value={userDetails && userDetails.email}
                                                    />
                                                    <label htmlFor="profile-email">Email</label>
                                                </div>

                                                <div className="form-floating mb-6">
                                                    <input type="number" className="form-control" id="profile-phone" placeholder="Phone" onChange={(e) => setUserDetails({
                                                        ...userDetails,
                                                        phone: e.target.value
                                                    })}
                                                        value={userDetails && userDetails.phone}
                                                    />
                                                    <label htmlFor="profile-phone">Phone</label>
                                                </div>

                                                <div className="form-floating mb-6">
                                                    <textarea className="form-control" placeholder="Bio" id="profile-bio" data-autosize="true" style={{ minHeight: "100px", overflow: "hidden", overflowWrap: "break-word", resize: "none" }}
                                                        onChange={(e) => setUserDetails({
                                                            ...userDetails,
                                                            bio: e.target.value
                                                        })}
                                                        value={userDetails && userDetails.bio}
                                                    ></textarea>
                                                    <label htmlFor="profile-bio">Bio</label>
                                                </div>

                                                <button type="button" onClick={handlesave} className="btn btn-block btn-lg btn-primary w-100">
                                                    {!loginStatus.loading ?
                                                        <>
                                                            {loginStatus.message ? loginStatus.message : 'Save'}
                                                        </> :
                                                        <div className="spinner-border spinner-border-sm" role="status">
                                                            {/* <span className="sr-only">Loading...</span> */}
                                                        </div>
                                                    }
                                                </button>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Account --> */}

                    {/* <!-- Security --> */}
                    {/* <div className="mt-8">
                        <div className="d-flex align-items-center my-4 px-6">
                            <small className="text-muted me-auto">Security</small>
                        </div>

                        <div className="card border-0">
                            <div className="card-body py-2">
                                <div className="accordion accordion-flush" id="accordion-security">
                                    <div className="accordion-item">
                                        <div className="accordion-header" id="accordion-security-1">
                                            <a href="/" className="accordion-button text-reset collapsed" data-bs-toggle="collapse" data-bs-target="#accordion-security-body-1" aria-expanded="false" aria-controls="accordion-security-body-1">
                                                <div>
                                                    <h5>Password</h5>
                                                    <p>Change your password</p>
                                                </div>
                                            </a>
                                        </div>

                                        <div id="accordion-security-body-1" className="accordion-collapse collapse" aria-labelledby="accordion-security-1" data-parent="#accordion-security">
                                            <div className="accordion-body">
                                                <form action="#" autoComplete="on">
                                                    <div className="form-floating mb-6">
                                                        <input type="password" className="form-control" id="profile-current-password" placeholder="Current Password" autoComplete="" />
                                                        <label htmlFor="profile-current-password">Current
                                                            Password</label>
                                                    </div>

                                                    <div className="form-floating mb-6">
                                                        <input type="password" className="form-control" id="profile-new-password" placeholder="New password" autoComplete="" />
                                                        <label htmlFor="profile-new-password">New
                                                            password</label>
                                                    </div>

                                                    <div className="form-floating mb-6">
                                                        <input type="password" className="form-control" id="profile-verify-password" placeholder="Verify Password" autoComplete="" />
                                                        <label htmlFor="profile-verify-password">Verify
                                                            Password</label>
                                                    </div>
                                                </form>
                                                <button type="button" className="btn btn-block btn-lg btn-primary w-100">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* <!-- Security --> */}
                </div>
            </div>
        </div>
    </>;
}

export default Settings;