const notiStyle = {
  color: "green",
  padding: 10,
  fontSize: 20,
  backgroundColor: "lightgray",
  border: "2px solid green",
};

const Notification = ({ message }) => {
  return message && <div style={notiStyle}>{message}</div>;
};

export default Notification;
