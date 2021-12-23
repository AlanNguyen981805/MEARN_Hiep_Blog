import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import LoginPass from '../components/auth/LoginPass';
import LoginWithSMS from '../components/auth/LoginWithSMS';
import { RootStore } from '../utils/TypeScript';

const Login = () => {
    const [sms, setSms] = useState(false)
    const navigate = useNavigate()
    const { auth } = useSelector((state: RootStore) => state)

    console.log(auth);
    useEffect(() => {
        
        if(auth.access_token) navigate('/')
    }, [auth.access_token, navigate])

    return (
        <div className="auth_page">
            <div className="auth_box">
                <h3 className="text-uppercase text-center mb-4">Login</h3>

                {sms ? <LoginWithSMS /> : <LoginPass />}
                <small className="row my-2 text-primary" style={{cursor: 'pointer'}}>
                    <Link to="/forgot_password" className="col-6">
                        Forgot Password
                    </Link> 
                </small>

                <span className="col-6" onClick={() => setSms(!sms)}>
                    { sms ? 'Sign in with password' : 'Sign in with SMS' }
                </span>
                

                <p>
                    You don't have  an account ?
                    <Link to={`/register`} style={{color: 'crimson'}}>
                        Register now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;