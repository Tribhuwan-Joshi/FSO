import { Link, useNavigate } from "react-router-dom";

import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";

const Blog = ({
  blog: initialBlog,
  incrementLike,
  deleteBlog,
  currentUser,
  addComment,
}) => {
  const navigate = useNavigate();
  const [blog, setBlog] = useState(initialBlog);

  useEffect(() => {
    setBlog(initialBlog);
  }, [initialBlog]);
  const handleDelete = async () => {
    try {
      if (!window.confirm(`Delete the Blog - ${blog.title}`)) return;
      await deleteBlog(blog);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const commentInput = e.target.comment;

    // Check if the comment is empty
    if (!commentInput.value.trim()) {
      commentInput.setCustomValidity("Comment cannot be empty!");
      commentInput.reportValidity();
      return;
    } else {
      commentInput.setCustomValidity(""); // Clear the error if the input is valid
    }
    try {
      await addComment(blog?.id, commentInput.value);
      commentInput.value = "";
    } catch (err) {
      console.error(err);
    }
  };

  if (!blog) return null;
  console.log("current blog", blog, typeof blog.id);

  return (
    <>
      <h2>{blog.title.toUpperCase()}</h2>
      <h4 style={{ margin: "5px 0px" }}>
        Added by <Link to={`/users/${blog.user.id}`}>{blog.user.username}</Link>
      </h4>
      <h4>Created at - {blog.formattedDate}</h4>
      <p>{blog.description}</p>
      <div>
        For more info- <a href={blog.url}>{blog.url}</a>
      </div>
      <div style={{ margin: "5px 0px" }}>
        {blog.likes} likes{" "}
        <button onClick={() => incrementLike(blog)}>Like</button>
      </div>
      {currentUser?.username === blog.user.username && (
        <button
          onClick={handleDelete}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Delete
        </button>
      )}

      {currentUser && (
        <div style={{ margin: "10px 0px" }}>
          <form onSubmit={handleCommentSubmit}>
            <input type="text" placeholder="your comment..." name="comment" />
            <button>add</button>
          </form>
        </div>
      )}
      <div style={{ margin: "5px 0px" }}>
        <h4 style={{ textDecoration: "underline" }}>
          Comments - {blog.comments.length}
        </h4>
        {blog.comments ? (
          blog.comments.map((c) => <div key={uuid()}>{c.content}</div>)
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Blog;
