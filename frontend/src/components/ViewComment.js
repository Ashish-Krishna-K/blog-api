import { useEffect, useState } from "react";
import { clientAxios, formatDates } from "../helperModule";

export default function Comment({ postId, commentId }) {
  const [comment, setComment] = useState({});

  const getCommentFromServer = async (postId, commentId) => {
    try {
      const response = await clientAxios.get(`/post/${postId}/comment/${commentId}`);
      setComment(response.data);
    } catch (error) {
      console.log(error.response);
    }
  }
  useEffect(() => {
    getCommentFromServer(postId, commentId);
  }, [postId, commentId])

  return (
    <>
      {
        comment &&
        <p>
          <span>{comment.comment_content}</span>
          <span>By: {comment.created_by}</span>
          <span>added on: {formatDates(comment.time_stamp)}</span>
        </p>
      }
    </>
  )
}