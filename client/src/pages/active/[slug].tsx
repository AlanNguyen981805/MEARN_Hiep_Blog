import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { showErrMsg, showSuccessMsg } from '../../components/alert/Alert';
import { postApi } from '../../utils/FetchData';
import { IParams } from '../../utils/TypeScript';

const Active = () => {
    const {slug}: IParams = useParams()
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    
    useEffect(() => {
        if(slug) {
            postApi('active', { active_token: slug })
            .then(res => setSuccess(res.data.msg))
            .catch(err => {
                console.log(err.message);
                setError(err.message)
            })
        }
    }, [slug])

    return (
        <div>
            <div>{success && showSuccessMsg(success)}</div>
            <div>{error && showErrMsg(error)}</div>
        </div>
    );
};

export default Active;