import React from "react";
import { Link } from "react-router-dom";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";

// Function to format date as '12 Sep 2023'

const BlogList = ({ blogs, addBlog, blogRef, user }) => {
  return (
    <>
      <h2>Blogs</h2>
      {user && (
        <Togglable ref={blogRef} buttonLabel="Add Blog">
          <BlogForm addBlog={addBlog} />
        </Togglable>
      )}
      <table style={{ margin: "10px 0px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid black", padding: "8px" }}>Title</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Author
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Date</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Likes</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              More Info
            </th>
          </tr>
        </thead>
        <tbody>
          {blogs?.map((b, index) => (
            <tr
              key={b.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#87CEEB",
                border: "1px solid black",
              }}
            >
              <td style={{ padding: "8px" }}>{b.title}</td>
              <td style={{ padding: "8px" }}>
                <Link to={`/users/${b.user.id}`}>{b.user.username}</Link>
              </td>
              <td style={{ padding: "8px" }}>{b.formattedDate}</td>
              <td style={{ padding: "8px" }}>{b.likes}</td>
              <td style={{ padding: "8px" }}>
                <Link to={`/blogs/${b.id}`}>Read</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default BlogList;
