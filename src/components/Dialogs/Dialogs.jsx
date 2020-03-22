import React from "react";
import s from './Dialogs.module.css'
import Message from "./Message/Message";
import DialogItem from "./DialogItem/DialogsItem";
import {Button, TextareaAutosize} from '@material-ui/core';


const Dialogs = (props) => {
    let state = props.dialogsPage;

    let dialogsElements = state.dialogs.map(d => <DialogItem name={d.name} id={d.id} />);
    let messagesElements = state.messeges.map(m => <Message message={m.message}/>);
    let newMessagesBody = state.newMessagesBody;

    let onSendMessageClick = () => {
        props.sendMessage();
    };
    let onNewMessageChange = (e) => {
        let body = e.target.value;
        props.updateNewMessageBody(body);
    };

    return (
        <div className={s.dialogs}>
            <div className={s.dialogsItems}>
                { dialogsElements }
            </div>
            <div className={s.messages}>
                <div>{ messagesElements }</div>
                <div>
                    <div><TextareaAutosize aria-label="minimum height" rowsMin={3} cols={100} value={ newMessagesBody }
                            onChange={ onNewMessageChange }
                            placeholder='Enter your messages'/></div>
                    <div><Button variant="outlined" onClick={ onSendMessageClick }>Send</Button></div>
                </div>
            </div>

        </div>

    )
};


export default Dialogs;
