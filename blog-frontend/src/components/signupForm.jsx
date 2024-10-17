import { useState } from "react";
const SignupForm = ({ handleSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const signupHandler = async (e) => {
    e.preventDefault();
    await handleSubmit({ username, name, password });
    setPassword("");
    setUsername("");
  };
  return (
    <div>
      <h2>Signup</h2>

      <form onSubmit={signupHandler}>
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
          name
          <input
            required
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <button type="submit">signup</button>
      </form>
    </div>
  );
};

export default SignupForm;
