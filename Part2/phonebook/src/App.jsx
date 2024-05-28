import { useState } from "react";
import AddPerson from "./components/AddPerson";
import Filter from "./components/Filter";

const checkDuplicate = (persons, newPerson) => {
  return persons.some((p) => p.name == newPerson.name);
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "123-45-67", id: "1" },
  ]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNumber] = useState("");
  const [filterPerson, setFilterPerson] = useState("");

  // set filter
  const handleFilterChange = (event) => setFilterPerson(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };

    const isDuplicate = checkDuplicate(persons, newPerson);
    console.log(isDuplicate, "for ", persons, newPerson);
    if (isDuplicate) {
      alert(`${newName} already exist in phonebook`);
    } else {
      setPersons(persons.concat(newPerson));
      setNewName("");
      setNumber("");
    }
  };

  const handleNumberChange = (event) => setNumber(event.target.value);

  const handleChange = (event) => setNewName(event.target.value);

  const personsLists = filterPerson
    ? persons.filter((p) =>
        p.name.toLowerCase().startsWith(filterPerson.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        filterPerson={filterPerson}
        handleFilterChange={handleFilterChange}
      />
      <AddPerson
        addPerson={addPerson}
        handleChange={handleChange}
        newNumber={newNumber}
        newName={newName}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <PhoneBook personsLists={personsLists} />
    </div>
  );
};

const PhoneBook = ({ personsLists }) =>
  personsLists.map((p) => <PersonInfo key={p.id} person={p} />);

const PersonInfo = ({ person }) => (
  <div>
    {person.name} - {person.number}
  </div>
);
export default App;
