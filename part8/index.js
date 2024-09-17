const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");

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
author : String!
id: ID!
genres : [String]!
}


type Query {
    bookCount: Int!
    authorCount:Int!
    allBooks (author:String,genre:String): [Book!]
    allAuthors: [Author!]
  }

type Mutation {
addBook(title:String!,author:String!,published:Int!,genres:[String!]):Book
editAuthor(name:String!,setBornTo:Int!) : Author
}

`;

const resolvers = {
  // query resolver -> shows how to resolve it
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if (!args.author && !args.genres) return books;
      else if (args.author && args.genre) {
        return books.filter(
          (b) => b.author == args.author && b.genres.includes(args.genre)
        );
      } else if (args.author)
        return books.filter((b) => b.author == args.author);
      else books.filter((b) => b.genres.includes(args.genre));
    },
    allAuthors: () => authors,
  },
  Author: {
    bookCount: (root) => books.filter((b) => b.author == root.name).length,
  },
  Mutation: {
    addBook: (root, args) => {
      if (books.find((b) => b.title === args.title)) {
        throw new GraphQLError("title must be unique", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }
      const book = { ...args, id: uuid() };
      books = books.concat(book);

      const authorExist = authors.find((a) => a.name == args.author);
      if (!authorExist) {
        const author = { name: args.author, id: uuid(), bookCount: 1 };
        authors = authors.concat(author);
      }

      return book;
    },
    editAuthor: (root, args) => {
      const authorExist = authors.find((a) => a.name == args.name);
      if (!authorExist) return null;
      authorExist.born = args.setBornTo;
      authors = authors.map((a) => (a.id == authorExist.id ? authorExist : a));
      return authorExist;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
