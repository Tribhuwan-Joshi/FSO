const errorStyle = {
  color: "red",
  fontSize: 20,
  padding: 10,
  backgroundColor: "lightgray",
  border: "2px solid red",
};

const Error = ({ error }) => {
  return error && <div style={errorStyle}>{error}</div>;
};

export default Error;
