import React, { useState } from 'react';

const LoginWithSMS = () => {
    const [phone, setPhone] = useState('')
    return (
        <form >
            <div className="form-group mb-2">
                <label className="form-label">Phone</label>
                <input 
                    type='text' 
                    className="form-control" 
                    id="phone" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <button type="submit" className="btn btn-dark w-100" disabled={phone ? false:  true}>
                    Login
                </button>
            </div>
        </form>
    );
};

export default LoginWithSMS;