import { useEffect, useState } from "react";
import AddPerson from "./components/AddPerson";
import Filter from "./components/Filter";

import contacts from "./services/contacts";
import PhoneBook from "./components/Phonebook";
const checkDuplicate = (persons, newPerson) => {
  return persons.some((p) => p.name == newPerson.name);
};

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNumber] = useState("");
  const [filterPerson, setFilterPerson] = useState("");

  useEffect(() => {
    contacts.getContacts().then((contacts) => setPersons(contacts));
  }, []);

  // set filter
  const handleFilterChange = (event) => setFilterPerson(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const isDuplicate = checkDuplicate(persons, newPerson);

    if (isDuplicate) {
      if (
        window.confirm(
          `${newName} already exist in phonebook,replace the old number with new one?`
        )
      ) {
        const person = persons.find((p) => p.name == newName);
        contacts
          .updateContact(person.id, newPerson)
          .then((res) =>
            setPersons(persons.map((p) => (p.name != res.name ? p : res)))
          );
        setNewName("");
        setNumber("");
      }
    } else {
      contacts
        .createContact(newPerson)
        .then((res) => setPersons(persons.concat(res)))
        .catch((err) => console.log(err.message));
      setNewName("");
      setNumber("");
    }
  };

  const handleNumberChange = (event) => setNumber(event.target.value);

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id == id);

    if (window.confirm(`Delete ${person.name}?`)) {
      contacts
        .deletePerson(id)
        .then((res) => setPersons(persons.filter((p) => p.id != res.id)))
        .catch(() => console.log("Unable to delete this person"));
    }
  };

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

export default App;
