import React from 'react';
import { Link } from 'react-router-dom';
import { IUser } from '../../utils/TypeScript';

interface IProps {
    user: IUser,
    user_reply?: IUser
}

const AvatarReply: React.FC<IProps> = ({user, user_reply}) => {
    return (
        <div className="avatar_reply">
      <img src={user.avatar} alt="avatar" />

      <div className="ms-1">
        <small>
          <Link to={`/profile/${user._id}`}
          style={{ textDecoration: 'none' }}>
            { user.name }
          </Link>
        </small>

        <small className="reply-text">
          Reply to <Link to={`/profile/${user_reply?._id}`}>
            { user_reply?.name }
          </Link>
        </small>
      </div>
    </div>
    );
};

export default AvatarReply;