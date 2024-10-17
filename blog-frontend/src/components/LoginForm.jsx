import { useState } from "react";
const LoginForm = ({ handleSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginHandler = async (e) => {
    e.preventDefault();
    await handleSubmit({ username, password });
    setPassword("");
    setUsername("");
  };
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={loginHandler}>
        <div>
          username
          <input
            required
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          password
          <input
            required
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Let me in</button>
      </form>
    </div>
  );
};

export default LoginForm;
