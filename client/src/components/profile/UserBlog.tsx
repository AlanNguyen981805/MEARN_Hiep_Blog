import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { getBlogsByUserId } from '../../redux/actions/blogAction';
import { IBlog, IParams, RootStore } from '../../utils/TypeScript';
import CardHoriz from '../cards/CardHoriz';
import CardVert from '../cards/CardVert';
import Loading from '../global/Loading';
import Pagination from '../global/Pagination';

const UserBlog = () => {
    const params: any = useParams();
    const dispatch = useDispatch()
    const { blogsUser } = useSelector((state: RootStore) => state)
    const [blogs, setBlogs] = useState<IBlog[]>()
    const [total, setTotal] = useState(0)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        if(!params.slug) return;
        const search = `?page=${searchParams.get('page')}`
        // dispatch(getBlogsByUserId(params.slug))
        if(blogsUser.every((item: any) => item.id !== params.slug)) {
            dispatch(getBlogsByUserId(params.slug, search))
        } else {
            const data = blogsUser.find((item: any) => item.id === params.slug)
            if(!data) return;
            setBlogs(data.blogs)
            setTotal(data.total)

        }
        console.log(blogs)
    }, [params.slug, dispatch, blogs, params, blogsUser])

    const handlePagination = (num: number) => {
        const search = `?page=${num}`
        dispatch(getBlogsByUserId(params.slug, search))
    }

    if(!blogs) return <Loading />

    if(blogs.length === 0) return (
        <h1>No blogs</h1>
    )
    return (
        <div>
            <div>
                {
                    blogs?.map((blog: any) => (
                        <CardHoriz key={blog._id} blog={blog} />
                    ))
                }
            </div>
            <div>
                {
                    total > 1 && <Pagination total={total} callback={handlePagination} />
                }
            </div>
        </div>
    );
};

export default UserBlog;