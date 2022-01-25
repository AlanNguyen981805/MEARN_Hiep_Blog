import React, { useEffect, useState } from 'react';
import { IComment } from '../../utils/TypeScript';
import AvatarComment from './AvatarComment';
import AvatarReply from './AvatarReply';
import CommentsList from './CommentsList';

interface IPorps {
    comment: IComment
}

const Comments: React.FC<IPorps> = ({comment}) => {
    const [showReply, setShowReply] = useState<IComment[]>([])
    const [next, setNext] = useState(2)
    useEffect(() => {
        if(!comment.replyCM) return;
        setShowReply(comment.replyCM)
      },[comment.replyCM])
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
                {showReply.slice(0, next).map((comment, index) => (
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

                <div style={{ cursor: 'pointer' }}>
                    {
                        showReply.length - next > 0
                            ? <small style={{ color: 'crimson' }}
                                onClick={() => setNext(next + 5)}>
                                See more comments...
                            </small>
                            : showReply.length > 2 &&
                            <small style={{ color: 'teal' }}
                                onClick={() => setNext(2)}>
                                Hide comments...
                            </small>
                    }
                </div>
            </CommentsList>
        </div>
    );
};

export default Comments;