import { useContext, useState } from "react";
import PropTypes from "prop-types";
import UserContext from "../UserContext";
const Blog = ({ blog, incrementLike, deleteBlog }) => {
  const [isDetail, setIsDetail] = useState(false);
  const BlogStyle = {
    border: "2px solid black",
    padding: "5px",
    margin: "6px 0px",
  };
  const user = useContext(UserContext);

  const currentUsername = user ? user.username : null;
  return (
    <div className="blogInfo" style={BlogStyle}>
      <span className="blogTitle">{blog.title}</span> -
      <span className="blogAuthor">{blog.author}</span>
      <button data-testid="toggleView" onClick={() => setIsDetail(!isDetail)}>
        {isDetail ? "hide" : "view"}
      </button>
      <div className="extraInfo" style={{ display: isDetail ? "" : "none" }}>
        <div className="url">{blog.url}</div>
        <div>
          Likes - <span className="likeCount">{blog.likes}</span>
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
