import React, { useState } from 'react';
import { IComment } from '../../utils/TypeScript';
import AvatarComment from './AvatarComment';
import AvatarReply from './AvatarReply';
import CommentsList from './CommentsList';

interface IPorps {
    comment: IComment
}

const Comments: React.FC<IPorps> = ({comment}) => {
    const [showReply, setShowReply] = useState<IComment[]>([])

    return (
        <div className="my-3 d-flex" style={{
            opacity: comment._id ? 1 : 0.5,
            pointerEvents: comment._id ? 'initial' : 'none'
        }}>
            {comment.user && <AvatarComment user={comment.user} />}
            <CommentsList
                comment={comment} 
                showReply={showReply}
                setShowReply={setShowReply}
            >
                {showReply.map((comment, index) => (
                    <div key={index} className='my-3 d-flex' style={{
                        opacity: comment._id ? 1 : 0.5,
                        pointerEvents: comment._id ? 'initial' : 'none'
                    }}>
                        {
                            comment.user && (
                                <AvatarReply
                                    user={comment.user}
                                    user_reply={comment.reply_user}
                                />
                            )
                        }
                        
                        <CommentsList
                            comment={comment} 
                            showReply={showReply}
                            setShowReply={setShowReply}
                        />
                    </div>
                ))}
            </CommentsList>
        </div>
    );
};

export default Comments;