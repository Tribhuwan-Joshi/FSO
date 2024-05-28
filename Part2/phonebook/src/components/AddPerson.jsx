const AddPerson = ({
  addPerson,
  newName,
  handleChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <>
      <h2>Add Person</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default AddPerson;
