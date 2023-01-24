import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { clientAxios, formatDates } from "../helperModule";
import AddComment from "./AddComment";
import Comment from "./ViewComment";

export default function SinglePost() {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [errors, setErrors] = useState(null);
  const [addComment, setAddComment] = useState(false);

  const getPostFromServer = async (id) => {
    try {
      const response = await clientAxios.get(`/user/post/${id}`);
      setPost(response.data);
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }

  useEffect(() => {
    getPostFromServer(postId)
  }, [postId]);

  const handleAddComment = () => setAddComment(addComment => !addComment);

  return (
    <section className="single-post-view">
      {
        errors ? <p>{errors}</p> :
          <>
            {!post._id ? <p>Loading...</p> :
              <>
                <section className="post-content-section">
                  {
                    <>
                      <h2 className="post-title">{post.title}</h2>
                      <p className="post-published-timestamp">{formatDates(post.published_at)}</p>
                      <p className="post-content">{post.content}</p>
                    </>
                  }
                </section>
                <section className="add-comment-section">
                  {
                    !addComment ? <button onClick={handleAddComment}>Add comment</button> :
                      <AddComment postId={post._id} />
                  }
                </section>
                <section className="view-comments-section">
                  {
                    post._id &&
                    <ul>
                      <h3>Comments: </h3>
                      {post.comments.length > 0 &&
                        post.comments.map(comment => {
                          return (
                            <li key={comment}>
                              <Comment postId={post._id} commentId={comment} />
                            </li>
                          )
                        })
                      }
                    </ul>
                  }
                </section>
              </>
            }
          </>
      }
    </section>
  )
}
