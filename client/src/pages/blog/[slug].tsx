import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { showErrMsg } from '../../components/alert/Alert';
import DisplayBlog from '../../components/blog/DisplayBlog';
import Loading from '../../components/global/Loading';
import { getApi } from '../../utils/FetchData';
import { IParams, RootStore } from '../../utils/TypeScript';

const DetailBlog = () => {
    const {slug: id}: IParams = useParams()

    const [blog, setBlog] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { socket } = useSelector((state: RootStore) => state)

    useEffect(() => {
        if(!id) return 
        setLoading(true)

        getApi(`blog/${id}`)
        .then(res => {
            setBlog(res.data)
            setLoading(false)
        })
        .catch(err => {
            setError(err.response.data.msg)
            setLoading(false)
        })

        return () => setBlog(undefined)
    }, [id])

    // Join Room
    useEffect(() => {
        if(!id || !socket) return
        socket.emit('joinRoom', id)

        return () => {
            socket.emit('outRoom', id)
        }
    }, [socket, id])

    if(loading) return <Loading />
    return (
        <>
            <div className='my-4'>
                {error && showErrMsg(error)}

                {blog && <DisplayBlog blog={blog} />}
            </div>
        </>
    );
};

export default DetailBlog;