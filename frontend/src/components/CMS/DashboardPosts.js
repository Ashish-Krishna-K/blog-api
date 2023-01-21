import { useEffect, useState } from "react"
import { cmsAxios } from "../../helperModule"
import { Link } from "react-router-dom";

export default function DashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [errors, setErrors] = useState(null);

  const getPostsListFromServer = async () => {
    try {
      const response = await cmsAxios.get('/user/post');
      setPosts(response.data)
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }

  const putPublishPostToServer = async (id) => {
    try {
      const response = await cmsAxios.put(`/user/post/${id}/publish`);
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }

  const putUnPublishPostToServer = async (id) => {
    try {
      const response = await cmsAxios.put(`/user/post/${id}/unpublish`);
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }

  const deletePostToServer = async (id) => {
    try {
      const response = await cmsAxios.delete(`/user/post/${id}`);
      window.location.reload();
    } catch (error) {
      setErrors(error.response.data.message);
    }
  }

  useEffect(() => {
    getPostsListFromServer();
  }, []);

  const handlePublish = (e) => {
    putPublishPostToServer(e.target.value);
  };
  const handleUnPublish = (e) => {
    putUnPublishPostToServer(e.target.value);
  };
  const handleDelete = (e) => {
    deletePostToServer(e.target.value);
  };

  return (
    <>
      {
        errors ? <p>{errors}</p> :
          posts.length === 0 ? <p>No Posts available</p> : posts.map(post => {
            return (
              <div key={post._id}>
                <Link to={`/cms_dashboard/posts/${post._id}`}>{post.title}</Link>
                <p>{`${post.content.slice(0, 101)}...`}</p>
                {
                  post.is_published ?
                    <button
                      value={post._id}
                      onClick={handleUnPublish}
                    >
                      Unpublish
                    </button>
                    : <button
                      value={post._id}
                      onClick={handlePublish}
                    >
                      Publish
                    </button>
                }
                <button
                  value={post._id}
                  onClick={handleDelete}
                >
                  Delete Post
                </button>
              </div>
            )
          })
      }
    </>
  )
}