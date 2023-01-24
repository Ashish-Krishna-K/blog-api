import { useEffect, useState } from "react"
import { clientAxios, formatDates } from "../helperModule"
import { Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [errors, setErrors] = useState(null);

  const getPostsListFromServer = async () => {
    try {
      const response = await clientAxios.get('/post');
      setPosts(response.data)
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }

  useEffect(() => {
    getPostsListFromServer();
  }, []);

  return (
    <>
      <h2>Home</h2>
      <section>
        {
          errors ? <p>{errors}</p> :
            posts.length === 0 ? <p>No Posts available</p> :
              posts.map(post => {
                const published = formatDates(post.published_at);
                return (
                  <div className="view-post" key={post._id}>
                    <Link to={`/posts/${post._id}`}>{post.title}</Link>
                    <p>{`${post.content.slice(0, 101)}...`}</p>
                    <p className="flex-vertical">
                      <span>{published}</span>
                      <span>Comments: {post.comments.length}</span>
                    </p>
                  </div>
                )
              })
        }
      </section>
    </>
  )
}