import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CREATE_COMMENT, REPLY_COMMENT } from './redux/types/commentType';
import { IComment, RootStore } from './utils/TypeScript';

const SocketClient = () => {
    const { socket } = useSelector((state: RootStore) => state)
    const dispatch = useDispatch()


    useEffect(() => {
        if(!socket) return

        socket.on('createComment', (data: IComment) => {
            dispatch({
                type: CREATE_COMMENT,
                payload: data
            })
        })
    
        return () => {  socket.off('createComment') }
    }, [socket, dispatch])

    useEffect(() => {
        if(!socket) return

        socket.on('replyComment', (data: IComment) => {
            dispatch({
                type: REPLY_COMMENT,
                payload: data
            })
        })
    
        return () => {  socket.off('replyComment') }
    }, [socket, dispatch])

    return (
        <div>
            
        </div>
    );
};

export default SocketClient;