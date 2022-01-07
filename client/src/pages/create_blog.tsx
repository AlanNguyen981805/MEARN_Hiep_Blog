import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardHoriz from '../components/cards/CardHoriz';
import CreateForm from '../components/cards/CreateForm';
import ReactQuill from '../components/editors/ReactQuill';
import NotFound from '../components/global/NotFound';
import { IBlog, RootStore } from '../utils/TypeScript';

const CreateBlog = () => {
    const initialState = {
        user: '',
        title: '',
        content: '',
        description: '',
        thumbnail: '',
        category: '',
        createdAt: new Date().toISOString()
    }

    const [blog, setBlog] = useState<IBlog>(initialState)
    const dispath = useDispatch()
    const { auth, categories } = useSelector((state: RootStore) => state)
    const [body, setBody] = useState('')

    if(!auth.accessToken) return <NotFound />
    return (
        <div className='row mt-4'>
            <div className="col-md-6">
                <h5>Create</h5>
                <CreateForm 
                    blog={blog}
                    setBlog={setBlog}
                />
            </div>
            <div className="col-md-6">
                <h5>Preview</h5>
                <CardHoriz blog={blog} />
            </div>

            <ReactQuill setBody={setBody} />
        </div>
    );
};

export default CreateBlog;