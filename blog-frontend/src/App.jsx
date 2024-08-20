import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { jwtDecode } from "jwt-decode";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const loginRef = useRef(null);
  const blogRef = useRef(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));

    if (userInfo) {
      if (!isTokenExpired(userInfo.token)) {
        setUser(userInfo);
        blogService.setToken(userInfo.token);
      } else {
        window.localStorage.removeItem("userInfo");
      }
    }
  }, []);

  const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };

  const addBlog = async (blogObject) => {
    try {
      const res = await blogService.createPost(blogObject);
      setNotification(
        `New blog added  ${blogObject.title} by ${blogObject.author}`
      );
      setTimeout(() => setNotification(""), 5000);
      setBlogs(blogs.concat(res));
      blogRef.current.toggleVisibility();
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
      setTimeout(() => setError(""), 5000);
    }
  };

  const loginHandler = async ({ username, password }) => {
    try {
      const res = await loginService.loginUser({ username, password });
      setUser(res.data);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      blogService.setToken(res.data.token);
      loginRef.current.toggleVisibility();
    } catch (err) {
      setError(err.response.data.error);
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <>
      {error && (
        <h2
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "1px",
            border: "1px solid red",
          }}
        >
          Error - {error}
        </h2>
      )}
      {user ? (
        <div>
          <h3>Welcome {user.username} </h3>
          <button
            onClick={() => {
              window.localStorage.removeItem("userInfo");
              setUser(null);
            }}
          >
            Log out
          </button>
          <br />
          <br />

          {notification && (
            <h2
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "1px",
                border: "1px solid green",
              }}
            >
              {notification}
            </h2>
          )}
          <Togglable ref={blogRef} buttonLabel="Add Blog">
            <BlogForm addBlog={addBlog} />
          </Togglable>
        </div>
      ) : (
        <Togglable ref={loginRef} buttonLabel="log in">
          <LoginForm handleSubmit={loginHandler} />
        </Togglable>
      )}
      <h2>blogs</h2>
      {blogs && blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
    </>
  );
};

export default App;
