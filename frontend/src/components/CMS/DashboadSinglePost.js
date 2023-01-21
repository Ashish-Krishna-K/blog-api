import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { cmsAxios } from "../../backendInteraction";
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
            <div>
              {
                !post._id ? <p>Loading...</p> :
                  <>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <Link to={`/cms_dashboard/posts/${post._id}/edit_post`}>Edit this post</Link>
                  </>
              }
            </div>
            <div>
              {
                !addComment ? <button onClick={handleAddComment}>Add comment</button> :
                  <AddComment postId={post._id} />
              }
            </div>
            <div>
              {
                post._id && post.comments.length > 0 &&
                <ul>
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
            </div>
          </>
      }
    </section>
  )
}
