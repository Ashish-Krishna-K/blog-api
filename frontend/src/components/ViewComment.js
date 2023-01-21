import { useEffect, useState } from "react";
import { clientAxios } from "../backendInteraction";

export default function Comment({ postId, commentId }) {
  const [comment, setComment] = useState({});

  const getCommentFromServer = async (id) => {
    try {
      const response = await clientAxios.get(`/post/${postId}/comment/${commentId}`);
      setComment(response.data);
    } catch (error) {
      console.log(error.response);
    }
  }
  useEffect(() => {
    getCommentFromServer();
  }, [postId, commentId])

  return (
    <p>
      <span>{comment.comment_content}</span>
      <span>By: {comment.created_by}</span>
      <span>added on: {comment.time_stamp}</span>
    </p>
  )
}