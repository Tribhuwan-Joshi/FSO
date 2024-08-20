import { useState } from "react";

const Blog = ({ blog, incrementLike }) => {
  const [isDetail, setIsDetail] = useState(false);
  const BlogStyle = {
    border: "2px solid black",
    padding: "5px",
    margin: "6px 0px",
  };

  return (
    <div style={BlogStyle}>
      {blog.title} - {blog.author}
      <button onClick={() => setIsDetail(!isDetail)}>
        {isDetail ? "hide" : "view"}
      </button>
      <div className="detail" style={{ display: isDetail ? "" : "none" }}>
        <div>{blog.url}</div>
        <div>
          Likes - {blog.likes}{" "}
          <button onClick={() => incrementLike(blog)}>Like</button>
        </div>
        <div>Added by {blog.user.name} </div>
      </div>
    </div>
  );
};

export default Blog;
