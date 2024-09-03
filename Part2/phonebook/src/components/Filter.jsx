const Filter = ({ filterPerson, handleFilterChange }) => {
  return (
    <div>
      Filter shown with
      <input value={filterPerson} onChange={handleFilterChange} />
    </div>
  );
};

export default Filter;
