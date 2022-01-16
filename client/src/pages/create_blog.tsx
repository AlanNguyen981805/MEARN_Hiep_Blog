import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardHoriz from '../components/cards/CardHoriz';
import CreateForm from '../components/cards/CreateForm';
import ReactQuill from '../components/editors/ReactQuill';
import NotFound from '../components/global/NotFound';
import { createBlog } from '../redux/actions/blogAction';
import { ALERT } from '../redux/types/alertType';
import { imageUpload } from '../utils/ImgUpload';
import { IBlog, RootStore } from '../utils/TypeScript';
import { validCreateBlog } from '../utils/Valid';

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
    const [text, setText] = useState('')
    const divRef = useRef<HTMLDivElement>(null)

    const handleSubmit = async () => {
        if(!auth.access_token) return;
        let url = ''

        const check = validCreateBlog({...blog, content: text})
        if(check.errLength !== 0) {
            return dispath({type: ALERT, payload: {errors: check.errMsg}})
        }

        let newData = {...blog, content: body}
        dispath(createBlog(newData, auth.access_token))
        
    }

    useEffect(() => {
        const div = divRef?.current;
        if(!div) return
        const text = (div?.innerText as string)
        setText(text)
    }, [body])

    if(!auth.access_token) return <NotFound />
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
            <div ref={divRef} dangerouslySetInnerHTML={{
                __html: body
            }} style={{display: 'none'}} />
            <small>{text.length}</small>
            <button className="btn btn-dark mt-3 d-block mx-auto"
            onClick={handleSubmit}>
                Create Post
            </button>
        </div>
    );
};

export default CreateBlog;