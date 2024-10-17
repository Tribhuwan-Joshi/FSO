import React from "react";
import { Link } from "react-router-dom";

const User = ({ user }) => {
  if (!user) return null;
  return (
    <>
      <h2>{user.username}</h2>
      <h4>Full name - {user.name}</h4>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.length == 0
          ? "No blog added"
          : user.blogs?.map((b) => (
              <li key={b.id}>
                <Link to={`/blogs/${b.id}`}>{b.title}</Link>
              </li>
            ))}
      </ul>
    </>
  );
};

export default User;
