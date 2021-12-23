import React from 'react';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login-lite';
import { useDispatch } from 'react-redux';
import { loginGoogle } from '../../redux/actions/authAction';

const SocialLogin = () => {
    const dispatch = useDispatch();
    
    const onSuccess = (googleUser: GoogleLoginResponse) => {
        const idToken = googleUser.getAuthResponse().id_token
        dispatch(loginGoogle(idToken))   
    }
    return (
        <div>
             <GoogleLogin 
                client_id='1009919553746-hvqp0gi8k2vv83ose18lhn8fkv9bvol6.apps.googleusercontent.com'
                cookiepolicy='single_host_origin'
                onSuccess={onSuccess}
                isSignedIn={false}
            />
        </div>
    );
};

export default SocialLogin;