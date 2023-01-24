import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { cmsAxios, formatDates } from "../../helperModule";
import AddComment from "../AddComment";
import Comment from "../ViewComment";

export default function DashboardSinglePost() {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [errors, setErrors] = useState(null);
  const [addComment, setAddComment] = useState(false);

  const getPostFromServer = async (id) => {
    try {
      const response = await cmsAxios.get(`/user/post/${id}`);
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
    <section>
      {
        errors ? <p>{errors}</p> :
          <>
            {!post._id ? <p>Loading...</p> :
              <>
                <section>
                  {
                    <>
                      <div className="flex-horizontal">
                        <h2 className="post-title">{post.title}</h2>
                        <Link to={`/cms_dashboard/posts/${post._id}/edit_post`}>Edit this post</Link>
                      </div>
                      <p className="post-published-timestamp"> Created on:{formatDates(post.created_at)}</p>
                      {post.is_published && <p className="post-published-timestamp">Published on: {formatDates(post.published_at)}</p>}
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
                    post._id && post.comments.length > 0 &&
                    <ul>
                      <h3>Comments: </h3>
                      {
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
