const Anecdote = ({ anecdote }) => {
  return (
    <>
      <div>Author - {anecdote.author}</div>
      <div>{anecdote.content}</div>
      <div>Number of votes - {anecdote.votes}</div>
      <div>
        More
        <a href={anecdote.info} rel="noreferrer" target="_blank">
          info
        </a>
      </div>
    </>
  );
};

export default Anecdote;
