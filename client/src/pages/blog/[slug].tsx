import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { showErrMsg } from '../../components/alert/Alert';
import DisplayBlog from '../../components/blog/DisplayBlog';
import Loading from '../../components/global/Loading';
import { getApi } from '../../utils/FetchData';
import { IParams } from '../../utils/TypeScript';

const DetailBlog = () => {
    const {slug: id}: IParams = useParams()

    const [blog, setBlog] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

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