import { useEffect, useState } from "react"
import { clientAxios } from "../helperModule"
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
    <section>
      {
        errors ? <p>{errors}</p> :
          posts.length === 0 ? <p>No Posts available</p> :
            posts.map(post => {
              return (
                <div key={post._id}>
                  <Link to={`/posts/${post._id}`}>{post.title}</Link>
                  <p>{`${post.content.slice(0, 101)}...`}</p>
                </div>
              )
            })
      }
    </section>
  )
}