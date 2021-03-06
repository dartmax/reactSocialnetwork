import React, {FC} from "react";
import {Button} from 'antd';
import {InjectedFormProps, reduxForm} from "redux-form";
import {maxLengthCreator, required} from "../../../utils/validators/validators";
import {createField, GetStringKeys, Input} from "../../../Common/FormsControls/FormsControls";

const maxLength10 = maxLengthCreator(100)

type PropsType = {}

export type AddPostFormValuesType = {
  newPostText: string
}

type AddPostFormValuesTypeKeys = GetStringKeys<AddPostFormValuesType>

const AddNewPostForm: FC<InjectedFormProps<AddPostFormValuesType, PropsType> & PropsType> = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        {createField<AddPostFormValuesTypeKeys>("Your post", "newPostText", [required, maxLength10], Input)}
      </div>
      <div>
        <Button onClick={props.handleSubmit}>Add Post</Button>
      </div>
    </form>
  )
}

export const AddNewPostFormRedux = reduxForm<AddPostFormValuesType, PropsType>({form: "ProfileAddNewPostForm"})(AddNewPostForm);