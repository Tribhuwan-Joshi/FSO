import { useState } from "react";
const App = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [allClicks, setAll] = useState([]);

  const [total, setTotal] = useState(0);

  const handleLeftClick = () => {
    setAll(allClicks.concat("L"));
    setLeft((prev) => prev + 1);
    const updatedLeft = left + 1;
    setTotal(updatedLeft + right);
  };

  const IncrementBy = () => () => setAll(allClicks.concat("LOL"));

  const handleRightClick = () => {
    setAll(allClicks.concat("R"));
    setRight((right) => right + 1);
    const updatedRight = right + 1;
    setTotal(updatedRight + left);
    setTotal(left + updatedRight);
  };

  const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>{text}</button>
  );

  return (
    <div>
      {left}
      <Button handleClick={handleLeftClick} text="left" />
      <Button handleClick={handleRightClick} text="right" />
      <button onClick={IncrementBy()}>Add LOL to stack</button>

      {right}
      <History allClicks={allClicks} />

      <p>total {total}</p>
    </div>
  );
};

const History = ({ allClicks }) =>
  allClicks.length ? (
    <p>Clicked history - {allClicks.join(" ")}</p>
  ) : (
    <p>App is used by pressing Button</p>
  );

export default App;
