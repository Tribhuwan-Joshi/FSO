import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { jwtDecode } from "jwt-decode";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const App = () => {
  const queryClient = useQueryClient();
  const {
    isPending,
    error: qErr,
    data,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: () =>
      blogService
        .getAll()
        .then((blogs) => blogs.sort((a, b) => b.likes - a.likes)),
    refetchOnWindowFocus: false,
  });

  const newBlogMutation = useMutation({
    mutationKey: ["blogs"],
    mutationFn: (blogObject) =>
      blogService.createPost(blogObject).then((res) => res),

    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
    },
  });

  const notificationQuery = useQuery({
    queryKey: ["notification"],
    initialData: "",
  });

  const mutateNotification = useMutation({
    mutationFn: (notice) => notice,
    onSuccess: (notice) => {
      queryClient.setQueryData(["notification"], notice);
    },
  });

  const likeMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.incrementLike(updatedBlog),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      const updatedBlogs = blogs
        .map((b) => (b.id == updatedBlog.id ? updatedBlog : b))
        .sort((a, b) => b.likes - a.likes);
      queryClient.setQueryData(["blogs"], updatedBlogs);
    },
  });

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const loginRef = useRef(null);
  const blogRef = useRef(null);

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
      newBlogMutation.mutate(blogObject);
      // setNotification(
      //   `New blog added  ${blogObject.title} by ${blogObject.author}`
      // );
      mutateNotification.mutate(
        `New blog added  ${blogObject.title} by ${blogObject.author}`
      );
      setTimeout(() => mutateNotification.mutate(``), 5000);
      blogRef.current.toggleVisibility();
    } catch (err) {
      console.log(err);
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
      likeMutation.mutate(updatedData);
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

  if (isPending) return "Loading...";
  if (qErr) return "An error occured " + qErr.message;
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

          {notificationQuery.data && (
            <h2
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "1px",
                border: "1px solid green",
              }}
            >
              {notificationQuery.data}
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

      {data &&
        data.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            deleteBlog={() => deleteBlog(blog)}
            incrementLike={incrementLike}
            currentUsername={user?.username}
          />
        ))}
    </>
  );
};

export default App;
