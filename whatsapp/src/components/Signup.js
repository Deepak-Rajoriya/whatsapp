import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { createUser } from '../api/userApi';

function Signup() {
    const navigate = useNavigate();

    const [signupStatus, setSignupStatus] = useState({
        loading: false,
        error: null,
        message: null
    })
    const [user, setUser] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });



    const handleSignup = async () => {
        setSignupStatus({ ...signupStatus, loading: true, error: null })
        try {
            const data = await createUser(user);
            if(!data){
                setSignupStatus({ loading: false, error: "Sign Faild", message: "Try again" });
            }
            setSignupStatus({ loading: false, error: null, message: "Redirecting..." })
            navigate('/login');
        } catch (err) {
            setSignupStatus({ loading: false, error: err, message: "Try again" })
        }
    }


    return (
        <div className="container">
            <div className="row align-items-center justify-content-center min-vh-100 gx-0">
                <div className="col-12 col-md-5 col-lg-4">
                    <div className="card card-shadow border-0">
                        <div className="card-body">
                            <div className="row g-6">
                                <div className="col-12">
                                    <div className="text-center">
                                        <h3 className="fw-bold mb-2">Sign Up</h3>
                                        <p>Follow the easy steps</p>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" onChange={(e) => { setUser({ ...user, name: e.target.value }) }} id="signup-name" placeholder="Name" />
                                        <label htmlFor="signup-name">Name</label>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" onChange={(e) => { setUser({ ...user, username: e.target.value }) }} id="username" placeholder="Username" />
                                        <label htmlFor="username">Username</label>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-floating">
                                        <input type="email" className="form-control" onChange={(e) => { setUser({ ...user, email: e.target.value }) }} id="signup-email" placeholder="Email" />
                                        <label htmlFor="signup-email">Email</label>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-floating">
                                        <input type="password" className="form-control" onChange={(e) => { setUser({ ...user, password: e.target.value }) }} id="signup-password" placeholder="Password" />
                                        <label htmlFor="signup-password">Password</label>
                                    </div>
                                </div>
                                {signupStatus.error && <p className="small text-danger mx-0 mb-0 mt-3">{signupStatus.error}</p>}
                                <div className="col-12">
                                    <button className="btn btn-block btn-lg btn-primary w-100" onClick={handleSignup} type="submit">
                                        {!signupStatus.loading ?
                                            <>
                                                {signupStatus.message ? signupStatus.message : 'Create Account'}
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
                    <div className="text-center mt-8">
                        <p>Already have an account? <Link to="/login">Sign in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;