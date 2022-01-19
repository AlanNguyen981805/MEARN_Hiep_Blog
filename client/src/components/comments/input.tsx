import React, { useRef, useState } from 'react';
import LiteQuill from '../editors/LiteQuill'

interface IProps {
    callback: (body: string) => void
}

const Input: React.FC<IProps> = ({callback}) => {
    const [body, setBody] = useState('')
    const divRef = useRef<HTMLDivElement>(null)

    const handleSubmit = () => {
        const div = divRef.current
        const text = (div?.innerText as string)
        if(!text.trim()) return
        
        callback(body)
    }

    return (
        <div>
            <LiteQuill body={body} setBody={setBody} />

            <div ref={divRef} dangerouslySetInnerHTML={{
                __html: body
            }} style={{display: 'none'}}/>

            <div className="btn btn-success ms-auto d-block" onClick={handleSubmit}>
                Send
            </div>
        </div>
    );
};

export default Input;