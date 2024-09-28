const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");
const { GraphQLError } = require("graphql");
const mongoose = require("mongoose");
require("dotenv").config();
const Book = require("./models/Book");
const Author = require("./models/Author");
const User = require("./models/User");
const jwt = require("jsonwebtoken");

console.log("connecting mongodb...");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected successfully"))
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
type Author {
name: String!
id: ID!
born: Int
bookCount: Int!
}

type Book{
title: String!
published: Int!
author :Author!
id: ID!
genres : [String]!
}

type User{
username:String!
favoriteGenre: String!
id:ID!
}

type Token{
value:String!
}


type Query {
    bookCount: Int!
    authorCount:Int!
    allBooks (author:String,genre:String): [Book!]
    allAuthors: [Author!]
    me: User
  }

type Mutation {
addBook(title:String!,author:String!,published:Int!,genres:[String!]):Book
editAuthor(name:String!,setBornTo:Int!) : Author
  createUser(
    username: String!
    favoriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}

`;

const resolvers = {
  // query resolver -> shows how to resolve it
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) return Book.find({});
      else if (args.author && args.genre) {
        return Book.find({
          "author.name": args.author,
          genres: { $in: [args.genre] },
        });
      } else if (args.author) return Book.find({ "author.name": args.author });
      return Book.find({ genres: { $in: [args.genre] } });
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: (root) => books.filter((b) => b.author == root.name).length,
  },
  Mutation: {
    addBook: async (root, args) => {
      try {
        let newBook;
        const authorExist = await Author.findOne({ name: args.author });
        if (authorExist) {
          newBook = new Book({ ...args, author: authorExist._id });
        } else {
          const newAuthor = new Author({ name: args.author });
          newBook = new Book({ ...args, author: newAuthor._id });
          await newAuthor.save();
        }
        await newBook.save();
        return newBook;
      } catch (err) {
        throw new GraphQLError("Creating the book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            err,
          },
        });
      }
    },
    editAuthor: async (root, args) => {
      try {
        // check if author even exist
        const author = await Author.findOne({ name: args.name });
        if (!author) return null;
        author.born = args.setBornTo;
        await author.save();
        return author;
      } catch (err) {
        throw new GraphQLError("Editing the author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            err,
          },
        });
      }
    },
    createUser: async (root, args) => {
      try {
        const newUser = new User({ ...args });
        return newUser.save();
      } catch (err) {
        throw new GraphQLError("Error Creating User", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            err,
          },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.find({ username: args.username });
      // check password directly
      if (!user || args.password != "secret")
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      const token = { id: user._id, username: args.username };

      return { value: jwt.sign(token, process.env.JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async (req, res) => {
    const auth = req ? req.headers?.authorization : null;
    if (auth && auth.startsWith("Bearer")) {
      const decodeToken = jwt.verify(auth.substring(7), process.env.SECRET);
      const currentUser = await User.findById(decodeToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
