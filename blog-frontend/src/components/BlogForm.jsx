import { useState } from "react";
const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addBlog({ title, author, url });
    setAuthor("");
    setTitle("");
    setUrl("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        Title
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        Author
        <input
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <div>
        Url
        <input id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
      </div>
      <button type="submit">Add blog</button>
    </form>
  );
};

export default BlogForm;
