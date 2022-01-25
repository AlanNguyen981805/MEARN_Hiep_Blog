import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/authAction';
import { FormSubmit, InputChange } from '../../utils/TypeScript';

const LoginPass = () => {
    const initialState = {account: '', password: ''}
    const [userLogin, setUserLogin] = useState(initialState)
    const [typePass, setTypePass] = useState(false)
    const {account, password} = userLogin
    const dispatch = useDispatch()

    const handleChangeInput = (e: InputChange ) => {
        const {value, name} = e.target
        setUserLogin({...userLogin, [name]: value})
    }

    const handleSubmit = (e: FormSubmit) => {
        e.preventDefault()
        dispatch(login(userLogin))
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label htmlFor="account">Email/Phone Number</label>
                <input 
                    type="text" 
                    className="form-control" 
                    name="account" 
                    id="account" 
                    value={account}
                    onChange={handleChangeInput}
                />
            </div>
            <div className="form-group mb-3">
                <label htmlFor="account" className="form-label">Password</label>
                <input 
                    type={typePass ? "text" : "password"} 
                    className="form-control" 
                    name="password" 
                    id="password" 
                    value={password}
                    onChange={handleChangeInput}
                />
                <small onClick={() => setTypePass(!typePass)}>{typePass ? 'Hide' : 'Show'}</small>
            </div>

            <button type="submit" className="btn btn-dark w-100 mt-4" disabled={(account && password) ? false : true}>Login</button>
        </form>
    );
};

export default LoginPass;