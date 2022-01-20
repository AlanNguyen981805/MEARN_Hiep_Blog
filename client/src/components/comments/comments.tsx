import React from 'react';
import { IComment } from '../../utils/TypeScript';
import AvatarComment from './AvatarComment';
import CommentsList from './CommentsList';

interface IPorps {
    comment: IComment
}

const Comments: React.FC<IPorps> = ({comment}) => {
    return (
        <div className="my-3 d-flex" style={{
            opacity: comment._id ? 1 : 0.5,
            pointerEvents: comment._id ? 'initial' : 'none'
        }}>
            {comment.user && <AvatarComment user={comment.user} />}

            <CommentsList comment={comment} />
        </div>
    );
};

export default Comments;