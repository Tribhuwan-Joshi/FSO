import React from "react";
const Header = ({ course }) => <h1>{course}</h1>;

const Total = ({ total }) => (
  <p>
    Total of <strong>{total}</strong> exercises
  </p>
);

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);
const Course = ({ name, parts }) => {
  const total = parts.reduce((f, s) => {
    console.log(f, s);
    return f + s.exercises;
  }, 0);

  console.log("total is ", total);
  return (
    <>
      <Header course={name} />
      {parts.map((p) => (
        <Part key={p.id} part={p} />
      ))}
      <Total total={total} />
    </>
  );
};

export default Course;
