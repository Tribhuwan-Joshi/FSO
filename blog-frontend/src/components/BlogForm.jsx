import { useState } from "react";
const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addBlog({ title, author, url, description });
    setAuthor("");
    setDescription("");
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
        <label htmlFor="description">Description</label>
        <textarea
          required
          maxLength={500}
          rows={20}
          cols={30}
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        <input
          id="url"
          placeholder="/demo"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <button type="submit">Add blog</button>
    </form>
  );
};

export default BlogForm;
