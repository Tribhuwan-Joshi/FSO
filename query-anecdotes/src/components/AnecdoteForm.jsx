import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNew } from "../requests";
import { useNotificationDispatch } from "../NotificationContext";

const AnecdoteForm = () => {
  const query = useQueryClient();
  const notificationDispatch = useNotificationDispatch();
  const createMutation = useMutation({
    queryKey: ["anecdotes"],
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = query.getQueryData(["anecdotes"]);
      query.setQueriesData(["anecdotes"], anecdotes.concat(newAnecdote));
      notificationDispatch({
        type: "SET_NOTIF",
        payload: `New anecdote created - ${newAnecdote.content}`,
      });
      setTimeout(
        () =>
          notificationDispatch({
            type: "CLEAR_NOTIF",
          }),
        5000
      );
    },
    onError: (error) => {
      notificationDispatch({
        type: "SET_NOTIF",
        payload: `Error - ${error.response.data.error}`,
      });
      setTimeout(
        () =>
          notificationDispatch({
            type: "CLEAR_NOTIF",
          }),
        5000
      );
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    createMutation.mutate(content);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
