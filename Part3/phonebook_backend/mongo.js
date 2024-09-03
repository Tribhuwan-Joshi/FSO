const mongoose = require("mongoose");

const cmdInput = process.argv;
if (cmdInput.length < 3) {
  console.log("Provide Password");
  process.exit(1);
}

const uri = `mongodb+srv://tjsm:${cmdInput[2]}@phonebook.xfcttox.mongodb.net/contacts?retryWrites=true&w=majority&appName=phonebook`;
mongoose.connect(uri);
const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (cmdInput.length > 4) {
  const newContact = new Contact({ name: cmdInput[3], number: cmdInput[4] });

  newContact.save().then((res) => {
    console.log(res);
    console.log("Contact Created");
    mongoose.connection.close();
  });
} else {
  Contact.find({}).then((res) => {
    res.forEach((r) => console.log(r));
    mongoose.connection.close();
  });
}
