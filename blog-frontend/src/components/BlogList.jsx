import React from "react";
import { Link } from "react-router-dom";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
const BlogLinkType = {
  border: "2px solid black",
  padding: "5px",
  margin: "6px 0px",
};

const BlogList = ({ blogs, addBlog, blogRef, user }) => {
  return (
    <>
      <h2>Blogs</h2>
      {user && (
        <Togglable ref={blogRef} buttonLabel="Add Blog">
          <BlogForm addBlog={addBlog} />
        </Togglable>
      )}
      {blogs?.map((b) => (
        <div key={b.id} style={BlogLinkType}>
          <Link to={`/blogs/${b.id}`}>
            {b.title} - {b.author}
          </Link>
        </div>
      ))}
    </>
  );
};

export default BlogList;
