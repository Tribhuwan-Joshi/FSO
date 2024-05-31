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
    {" "}
    {person.name} - {person.number}
    <button onClick={handleDeleteContact}>Delete</button>
  </div>
);

export default PhoneBook;
