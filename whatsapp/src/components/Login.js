import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';
// import { useUser } from '../context/userContext';

function Login() {
    const navigate = useNavigate();

    const [loginUser, setLoginUser] = useState({ email: "", password: "" });
    const [loginStatus, setLoginStatus] = useState({
        loading: false,
        error: null,
        message: null
    })

    const handleLogin = async (e) => {

        // Update login status to loading
        setLoginStatus({ ...loginStatus, loading: true, error: null });
    
        try {
            // Perform login
            const loginData = await login(loginUser.email, loginUser.password);
    
            // Save the auth token securely in localStorage
            if (loginData && loginData.token) {
                localStorage.setItem('authToken', loginData.token);
            }
    
            // Update login status and redirect
            setLoginStatus({ loading: false, error: null, message: "Redirecting..." });
            window.location.href = "/dashboard/search";
        } catch (err) {
            setLoginStatus({ loading: false, error: err, message: "Try again" });
        }
    };

    return (
        <div className="container">
            <div className="row align-items-center justify-content-center min-vh-100 gx-0">

                <div className="col-12 col-md-5 col-lg-4">
                    <div className="card card-shadow border-0">
                        <div className="card-body">
                            <div className="row g-6">
                                <div className="col-12">
                                    <div className="text-center">
                                        <h3 className="fw-bold mb-2">Sign In</h3>
                                        <p>Login to your account</p>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="signin-email" onChange={(e) => { setLoginUser({ ...loginUser, email: e.target.value }) }} placeholder="Email" />
                                        <label htmlFor="signin-email">Email</label>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-floating">
                                        <input type="password" className="form-control" id="signin-password" onChange={(e) => { setLoginUser({ ...loginUser, password: e.target.value }) }} placeholder="Password" />
                                        <label htmlFor="signin-password">Password</label>
                                    </div>
                                </div>
                                {loginStatus.error && <p className="small text-danger mx-0 mb-0 mt-3">{loginStatus.error}</p>}
                                <div className="col-12">
                                    <button className="btn btn-block btn-lg btn-primary w-100" onClick={handleLogin} type="submit">
                                        {!loginStatus.loading ?
                                            <>
                                                {loginStatus.message ? loginStatus.message : 'Sign In'}
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

                    {/* <!-- Text --> */}
                    <div className="text-center mt-8">
                        <p>Don't have an account yet? <Link to="/signup">Sign up</Link></p>
                    </div>
                </div>
            </div>
            {/* <!-- / .row --> */}
        </div>
    );
}

export default Login;