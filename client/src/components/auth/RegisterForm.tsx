import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, register } from '../../redux/actions/authAction';
import { FormSubmit, InputChange } from '../../utils/TypeScript';

const RegisterForm = () => {
    const initialState = {name: '', account: '', password: '', cf_password: ''}
    const [userRegister, setUserRegister] = useState(initialState)
    const {name, account, password, cf_password} = userRegister
    const [typePass, setTypePass] = useState(false)
    const [typeCfPass, setTypeCfPass] = useState(false)
    const dispatch = useDispatch()

    const handleChangeInput = (e: InputChange ) => {
        const {value, name} = e.target
        setUserRegister({...userRegister, [name]: value})
    }

    const handleSubmit = (e: FormSubmit) => {
        e.preventDefault()
        dispatch(register(userRegister))
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label htmlFor="name">Name</label>
                <input 
                    type="text" 
                    className="form-control" 
                    name="name" 
                    id="name" 
                    value={name}
                    onChange={handleChangeInput}
                />
            </div>
            <div className="form-group mb-3">
                <label htmlFor="account">Email/Phone number</label>
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
                <label htmlFor="password" className="form-label">Password</label>
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
            <div className="form-group mb-3">
                <label htmlFor="cf_password" className="form-label">Confirm Password</label>
                <input 
                    type={typeCfPass ? "text" : "password"} 
                    className="form-control" 
                    name="cf_password" 
                    id="cf_password" 
                    value={cf_password}
                    onChange={handleChangeInput}
                />
                <small onClick={() => setTypeCfPass(!typeCfPass)}>{typeCfPass ? 'Hide' : 'Show'}</small>
            </div>

            <button 
                type="submit" 
                className="btn btn-dark w-100 mt-1" 
             >Register</button>
        </form>
    );
};

export default RegisterForm;