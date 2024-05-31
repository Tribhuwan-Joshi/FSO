import { useEffect, useState } from "react";
import AddPerson from "./components/AddPerson";
import Filter from "./components/Filter";
import axios from "axios";
import contacts from "./services/contacts";
const checkDuplicate = (persons, newPerson) => {
  return persons.some((p) => p.name == newPerson.name);
};

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNumber] = useState("");
  const [filterPerson, setFilterPerson] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then((res) => setPersons(res.data));
  });

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
      contacts
        .getContacts()
        .then((persons) => setPersons(persons.concat(persons)))
        .catch((err) => console.log(err.message));
      setNewName("");
      setNumber("");
    }
  };

  const handleNumberChange = (event) => setNumber(event.target.value);

  const deletePerson = (id) =>
    contacts.deletePerson(id).catch(() => console.log("unable to delete"));

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
      <PhoneBook deletePerson={deletePerson} personsLists={personsLists} />
    </div>
  );
};

const PhoneBook = ({ personsLists, deletePerson }) =>
  personsLists.map((p) => (
    <PersonInfo
      key={p.id}
      handleDeleteContact={() => deletePerson(p.id)}
      person={p}
    />
  ));

const PersonInfo = ({ person, handleDeleteContact }) => (
  <div>
    {person.name} - {person.number}{" "}
    <button onClick={handleDeleteContact}>Delete</button>
  </div>
);
export default App;
