import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import CardVert from '../../components/cards/CardVert';
import NotFound from '../../components/global/NotFound';
import Pagination from '../../components/global/Pagination';
import { getBlogsByCategoryId } from '../../redux/actions/blogAction';
import { IBlog, IParams, RootStore } from '../../utils/TypeScript';

const BlogByCategory = () => {
    const { categories, blogsCategory } = useSelector((state: RootStore) => state)
    const dispatch = useDispatch()
    const { slug }: IParams = useParams()

    const [categoryId, setCategoryId] = useState('')
    const [blogs, setBlogs] = useState<IBlog[]>()
    const [total, setTotal] = useState(0)
    const [searchParams] = useSearchParams();
    let pageParam = searchParams.get('page')

    useEffect(() => {
        const category = categories.find(item => item.name === slug)
        if(category) setCategoryId(category._id)
    }, [slug, categories])

    useEffect(() => {
        if(!categoryId) return

        if(blogsCategory.every(item => item.id !== categoryId)) {
            dispatch(getBlogsByCategoryId(categoryId, pageParam))
        } else {
            const data = blogsCategory.find(item => item.id === categoryId)
            if(!data) return;

            setBlogs(data.blogs)
            setTotal(data.total)
        }
    }, [categoryId, blogsCategory, dispatch])

    const handlePagination = (num: number) => {
        dispatch(getBlogsByCategoryId(categoryId, num))
    } 


    if(!blogs) return <NotFound />
    return (
        <div className="blogs_category">
            <div className="show_blogs">
                {blogs.map(blog => (
                    <CardVert key={blog._id} blog={blog} />
                ))}
            </div>

            {total > 1 && (
                <Pagination 
                    total={total}
                    callback={handlePagination}
                />
            )}
        </div>
    );
};

export default BlogByCategory;