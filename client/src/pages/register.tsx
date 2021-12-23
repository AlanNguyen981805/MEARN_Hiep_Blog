import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginPass from '../components/auth/LoginPass';
import LoginWithSMS from '../components/auth/LoginWithSMS';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
    const [sms, setSms] = useState(false)

    return (
        <div className="auth_page">
            <div className="auth_box">
                <h3 className="text-uppercase text-center mb-4">Register</h3>

                <RegisterForm />
                <p>
                    You already have  an account ?
                    <Link to={`/login`} style={{color: 'crimson'}}>
                        Login now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;