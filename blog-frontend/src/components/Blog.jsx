import { Link, useNavigate } from "react-router-dom";
import blogService from "../services/blogs";
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

  return (
    <>
      <h2>{blog.title}</h2>
      <div>
        For more info- <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
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
      <div>
        Added by <Link to={`/users/${blog.user.id}`}>{blog.user.username}</Link>
      </div>

      {currentUser && (
        <div style={{ margin: "10px 0px" }}>
          <form onSubmit={handleCommentSubmit}>
            <input type="text" placeholder="your comment..." name="comment" />
            <button>add</button>
          </form>
        </div>
      )}
      <div>
        <h4 style={{ textDecoration: "underline" }}>Comments</h4>
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
