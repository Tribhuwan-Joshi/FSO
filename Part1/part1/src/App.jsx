const App = () => {
  const course = "Half Stack application development";

  const contents = [
    { part: "Fundamentals of React", exercise: 10 },
    { part: "Using props to pass data", exercise: 7 },
    { part: "State of a component", exercise: 14 },
  ];
  const totalExercise = contents.reduce((f, s) => f + s.exercise, 0); // intial ,acc
  return (
    <div>
      <Header course={course} />
      <Content content={contents} />
      <Footer totalExercise={totalExercise} />
    </div>
  );
};

const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Content = (props) => {
  return props.content.map((c, i) => (
    <p key={i}>
      {c.part} {c.exercise}
    </p>
  ));
};

const Footer = (props) => {
  return <p>Number of exercise {props.totalExercise}</p>;
};
export default App;
