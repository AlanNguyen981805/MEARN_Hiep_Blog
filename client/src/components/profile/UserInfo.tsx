import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, updateUser } from '../../redux/actions/profileAction';
import { FormSubmit, InputChange, IUserProfile, RootStore } from '../../utils/TypeScript';
import NotFound from '../global/NotFound';

const UserInfo = () => {
    const initialState = {name: '', account: '', avatar: '', password: '', cf_password: ''}
    const {auth} = useSelector((state: RootStore) => state)
    const dispatch = useDispatch();
    const [user, setUser] = useState<IUserProfile>(initialState)
    const [typePass, setTypePass] = useState(false)
    const [typeCfPass, setTypeCfPass] = useState(false)
    const {name, account, avatar, password, cf_password} = user

    const handleChangeInput = (e: InputChange) => {
        const {name, value} = e.target
        setUser({...user, [name]: value})
    }
    
    const handleChangeFile = (e: InputChange) => {
        const target = e.target as HTMLInputElement
        const files = target.files
        console.log(files);
        if(files) {
            const file = files[0]
            setUser({...user, avatar: file})
        }
    } 

    const handleSubmit = (e: FormSubmit) => {
        e.preventDefault()
        if(name || avatar) {
            dispatch(updateUser((avatar as File), name, auth))     
        }

        if(password && auth.accessToken) {
            dispatch(resetPassword(password, cf_password, auth.accessToken))
        }
    }
        
    if(!auth.user) return <NotFound />
    return (
        <form className='profile_info' onSubmit={handleSubmit}>
            <div className="info_avatar">
                <img src={avatar ? URL.createObjectURL(avatar) : auth.user?.avatar} alt="" />
                <span>
                    <p>change</p>
                    <input 
                        type="file" 
                        accept='image/*' 
                        name='file' 
                        id='file_up' 
                        onChange={handleChangeFile}
                    />
                </span>
            </div>
            <div className="form-group">
                <label htmlFor="account">Name</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    name="name" 
                    defaultValue={auth.user?.name} 
                    onChange={handleChangeInput}
                />
            </div>
            <div className="form-group">
                <label htmlFor="account">Account</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="ccount" 
                    name="account" 
                    defaultValue={auth.user?.account} 
                    onChange={handleChangeInput}
                    disabled={true}
                />
            </div>
            <div className="form-group">
                <label htmlFor="account">Password</label>
                <input 
                    type={typePass ? "text": "password"} 
                    className="form-control" 
                    id="password" 
                    name="password" 
                    value={password}
                    onChange={handleChangeInput}
                    disabled={auth.user.type !== 'register'}
                />
                <small onClick={() => setTypePass(!typePass)}>{typePass ? "Show" : "hidden"}</small>
            </div>
            {
                auth.user.type !== 'register' && 
                <small className='text-danger'>
                    * Quick login account with {auth.user.type} can't use this function
                </small>
            }
            <div className="form-group">
                <label htmlFor="account">Confirm Password</label>
                <input 
                    type={typeCfPass ? "text": "password"} 
                    className="form-control" 
                    id="cf_password" 
                    name="cf_password" 
                    value={cf_password}
                    onChange={handleChangeInput}
                    disabled={auth.user.type !== 'register'}
                />
                <small onClick={() => setTypePass(!typePass)}>{typePass ? "Show" : "hidden"}</small>
            </div>

            <button className='btn btn-info' type='submit'>Update</button>
        </form>
    );
};

export default UserInfo;