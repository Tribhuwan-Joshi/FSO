import { createContext, useContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIF":
      return action.payload;
    case "CLEAR_NOTIF":
      return "";
  }
};

const NotificationContext = createContext();

export const useNotificationValue = () => {
  const [notificationValue] = useContext(NotificationContext);
  return notificationValue;
};

export const useNotificationDispatch = () => {
  const notificationContext = useContext(NotificationContext);
  return notificationContext[1];
};

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ""
  );
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
