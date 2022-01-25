import React from 'react';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login-lite';
import { FacebookLogin, FacebookLoginAuthResponse } from 'react-facebook-login-lite';
import { useDispatch } from 'react-redux';
import { loginFacebook, loginGoogle } from '../../redux/actions/authAction';

const SocialLogin = () => {
    const dispatch = useDispatch();
    
    const onSuccess = (googleUser: GoogleLoginResponse) => {
        const idToken = googleUser.getAuthResponse().id_token
        dispatch(loginGoogle(idToken))   
    }
    
    const onFbSuccess = (response: FacebookLoginAuthResponse) => {
        const { accessToken, userID } = response.authResponse;
        console.log({ accessToken, userID } );
        dispatch(loginFacebook(accessToken, userID))
    }

    return (
        <div>
             <GoogleLogin 
                client_id='988937493398-nv3qrlqvltn25vtoemu6saon9vl0lo3l.apps.googleusercontent.com'
                cookiepolicy='single_host_origin'
                onSuccess={onSuccess}
                isSignedIn={false}
            />
            <FacebookLogin 
                appId="594614568307578"
                onSuccess={onFbSuccess}
                isSignedIn={true}
            />
            
        </div>
    );
};

export default SocialLogin;