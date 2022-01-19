import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
interface IProps {
    body: string,
    setBody: (value: string) => void
}

const Quill: React.FC<IProps> = ({setBody, body}) => {
    const modules: any = { toolbar: { container }}
    const handleChange = (e: any) => {
        setBody(e)
    }
 
    return (
        <div>
             <ReactQuill 
                modules={modules}
                theme="snow"
                onChange={handleChange}
                value={body}
            />
        </div>
    );
};

let container = [
    [{ 'font': [] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'script': 'sub'}, { 'script': 'super' }],
  ]
  
  

export default Quill;