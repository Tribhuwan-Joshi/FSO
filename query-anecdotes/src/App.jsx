import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, updateAnecdote } from "./requests";
import { useNotificationDispatch } from "./NotificationContext";

const App = () => {
  const query = useQueryClient();
  const notificationDispatch = useNotificationDispatch();
  const handleVote = (anecdote) => {
    updateMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    notificationDispatch({
      type: "SET_NOTIF",
      payload: `You voted ${anecdote.content}`,
    });
    setTimeout(
      () =>
        notificationDispatch({
          type: "CLEAR_NOTIF",
        }),
      5000
    );
  };
  const updateMutation = useMutation({
    queryKey: ["anecdotes"],
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = query.getQueryData(["anecdotes"]);
      query.setQueriesData(
        ["anecdotes"],
        anecdotes
          .map((a) => (a.id === updatedAnecdote.id ? updatedAnecdote : a))
          .sort((a, b) => b.votes - a.votes)
      );
    },
  });
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading App...</div>;
  if (isError) {
    notificationDispatch({
      type: "SET_NOTIF",
      payload: `Error - ${error.response.data.error}}`,
    });
    setTimeout(
      () =>
        notificationDispatch({
          type: "CLEAR_NOTIF",
        }),
      5000
    );
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />
      {data.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
