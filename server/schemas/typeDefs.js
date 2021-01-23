const { gpl } = require('apollo-server-express')

const typeDefs = gpl`

type Book {
    authors: [String]
    description: String
    bookId: ID
    image: String
    link: String
    title: String!
}

type User {
    _id: ID!
    username: String!
    email: string
    savedBooks: [Book]
    bookCount: Int
}

input BookData {
    authors: [String]
    desscription: String
    bookId: String
    image: String
    link: String
    titel: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
}

type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login:(email: String!, password: String!): Auth
    saveBook(bookData: BookData!): User
    removeBook(bookId: ID!): User
}

`

module.exports = typeDefs