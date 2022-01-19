import React from 'react';
import { IComment } from '../../utils/TypeScript';
import AvatarComment from './AvatarComment';
import CommentsList from './CommentsList';

interface IPorps {
    comment: IComment
}

const Comments: React.FC<IPorps> = ({comment}) => {
    return (
        <div className="my-3 d-flex">
            {comment.user && <AvatarComment user={comment.user} />}

            <CommentsList comment={comment} />
        </div>
    );
};

export default Comments;