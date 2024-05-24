import { useState } from "react";

const App = () => {
  const [reviews, setReviews] = useState(new Array(3).fill(0));

  const InCount = (i) => {
    const copy = [...reviews];
    copy[i] = copy[i] + 1;
    setReviews(copy);
  };

  return (
    <>
      <h1>Give Feedback</h1>
      <Button text="good" onClick={() => InCount(0)} />
      <Button text="neutral" onClick={() => InCount(1)} />
      <Button text="bad" onClick={() => InCount(2)} />
      <h1>Statistics</h1>
      <Statistics reviews={reviews} />
    </>
  );
};

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;

const Statistics = ({ reviews }) => {
  const total = reviews.reduce((f, s) => f + s, 0);
  const average = (reviews[0] * 1 + reviews[2] * -1) / total;
  const positive = (reviews[0] / total) * 100;
  console.log(reviews, total, positive, average);

  if (total === 0) return <div>No Feedback has been given</div>;

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={reviews[0]} />
        <StatisticLine text="neutral" value={reviews[1]} />
        <StatisticLine text="bad" value={reviews[2]} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive} />
      </tbody>
    </table>
  );
};

const StatisticLine = ({ text, value }) => (
  <tr>
    {text}
    <td>{value}</td>
  </tr>
);

export default App;
