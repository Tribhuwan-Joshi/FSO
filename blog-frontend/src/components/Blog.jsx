import { useState } from "react";
import PropTypes from "prop-types";
const Blog = ({ blog, incrementLike, deleteBlog, currentUsername }) => {
  const [isDetail, setIsDetail] = useState(false);
  const BlogStyle = {
    border: "2px solid black",
    padding: "5px",
    margin: "6px 0px",
  };

  return (
    <div className="blogInfo" style={BlogStyle}>
      {blog.title} - {blog.author}
      <button onClick={() => setIsDetail(!isDetail)}>
        {isDetail ? "hide" : "view"}
      </button>
      <div className="extraInfo" style={{ display: isDetail ? "" : "none" }}>
        <div className="url">{blog.url}</div>
        <div className="likeCount">
          Likes - {blog.likes}
          <button id="likebtn" onClick={() => incrementLike(blog)}>
            Like
          </button>
        </div>
        <div className="addedBy">Added by {blog.user.name} </div>
        {blog.user.username == currentUsername && (
          <button
            id="deleteBlogBtn"
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "4px",
              cursor: "pointer",
            }}
            onClick={deleteBlog}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  incrementLike: PropTypes.func.isRequired,
  currentUsername: PropTypes.string,
  deleteBlog: PropTypes.func,
};

export default Blog;
