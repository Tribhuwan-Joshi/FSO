import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import User from "./components/User";
import blogService from "../../e2e-noteApp/blogs";
import loginService from "./services/login";
import userService from "./services/users";
import { jwtDecode } from "jwt-decode";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import { Navigate, NavLink, Route, Routes, useMatch } from "react-router-dom";
import BlogList from "./components/BlogList";
import UserList from "./components/UserList";
import SignupForm from "./components/signupForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [users, setUsers] = useState([]);
  const blogMatch = useMatch("/blogs/:id");
  const userMatch = useMatch("/users/:id");

  const routeUser = userMatch
    ? users.find((u) => u.id === String(userMatch.params.id))
    : null;
  const routeBlog = blogMatch
    ? blogs.find((b) => b.id === String(blogMatch.params.id))
    : null;
  const loginRef = useRef(null);
  const signupRef = useRef(null);

  const blogRef = useRef(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    });
    userService.getAll().then((allUsers) => setUsers(allUsers));
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
    if (isTokenExpired(user.token)) {
      setError("Token expired... logging out!");
      window.localStorage.removeItem("userInfo");
      setUser(null);
      setTimeout(() => setError(""), 5000);
      return;
    }
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
  const addComment = async (blogId, comment) => {
    try {
      const updatedBlog = await blogService.addComment({ blogId, comment });
      setBlogs(blogs.map((b) => (b.id === blogId ? updatedBlog : b)));
    } catch (err) {
      setError(err.response.data.error);
      setTimeout(() => setError(""), 5000);
    }
  };

  const deleteBlog = async (blogObject) => {
    try {
      if (!window.confirm(`Delete the Blog - ${blogObject.title}`)) return;
      await blogService.deleteBlog(blogObject);
      const updatedBlogs = blogs.filter((b) => b.id != blogObject.id);
      setBlogs(updatedBlogs);
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
      setTimeout(() => setError(""), 5000);
    }
  };

  const incrementLike = async (blogObject) => {
    try {
      const updatedData = {
        id: blogObject.id,
        likes: blogObject.likes + 1,
        user: blogObject.user.id,
      };
      const res = await blogService.incrementLike(updatedData);
      const newBlogs = blogs.map((b) => {
        if (res.id == b.id) {
          return res;
        }
        return b;
      });
      newBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(newBlogs);
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
  const signupHandler = async ({ username, name, password }) => {
    try {
      const res = await userService.signup({ username, name, password });
      setUser(res.data);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      blogService.setToken(res.data.token);
      signupRef.current.toggleVisibility();
    } catch (err) {
      setError(err.response.data.error);
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <>
      <h3>Blog App</h3>
      <div>
        <NavLink
          style={(isActive) =>
            isActive
              ? { margin: "4px" }
              : { margin: "4px", textDecoration: "none" }
          }
          to="/"
        >
          blogs
        </NavLink>
        <NavLink
          style={(isActive) =>
            isActive
              ? { margin: "4px" }
              : { margin: "4px", textDecoration: "none" }
          }
          to="/users"
        >
          users
        </NavLink>
      </div>
      {error && (
        <h2
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "1px",
            border: "1px solid red",
          }}
          className="error"
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
        </div>
      ) : (
        <div>
          <Togglable ref={loginRef} buttonLabel="log in">
            <LoginForm handleSubmit={loginHandler} />
          </Togglable>
          <Togglable ref={signupRef} buttonLabel="sign up">
            <SignupForm handleSubmit={signupHandler} />
          </Togglable>
        </div>
      )}
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={routeBlog}
              incrementLike={incrementLike}
              currentUser={user || null}
              deleteBlog={deleteBlog}
              addComment={addComment}
            />
          }
        />
        <Route path="/users/:id" element={<User user={routeUser} />} />
        <Route path="/users" element={<UserList users={users} />} />
        <Route path="/*" element={<Navigate to="/" />} />
        <Route
          path="/"
          element={
            <BlogList
              user={user}
              blogRef={blogRef}
              blogs={blogs}
              addBlog={addBlog}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
