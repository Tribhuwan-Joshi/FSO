import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");
  const addPerson = (event) => {
    event.preventDefault();
    const isDuplicate = persons.some((p) => p.name == newName);
    if (isDuplicate) {
      alert(`${newName} already exist in phonebook`);
    } else {
      const newPerson = {
        name: newName,
      };

      setPersons(persons.concat(newPerson));
      setNewName("");
    }
  };

  const handleChange = (event) => setNewName(event.target.value);
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((p) => (
        <PersonInfo key={p.name} person={p} />
      ))}
    </div>
  );
};

const PersonInfo = ({ person }) => <p>{person.name}</p>;
export default App;
