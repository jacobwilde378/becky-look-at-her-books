const { User, Book } = require('../models')
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('savedBooks')
        },

        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__V -password')
                .populate('savedBooks')
        },

        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks')

                return userData
            }

            throw new AutheticationError('You must be logged in!')
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user)

            return { token, user }
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email })

            if (!user) {
                throw new AuthenticationError('Your Email & Password combination is incorrect!')
            }

            const correctPW = await user.isCorrectPassword(password)

            if (!correctPW) {
                throw new AutheticationError('Your Email & Password combination is incorrect!')
            }

            const token = signToken(user)

            return { token, user }
        },

        saveBook: async (parent, { bookData }, context) => {
            console.log(bookData)
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks:  bookData  } },
                    { new: true }
                )

                return updatedUser

            }

            throw new AutheticationError('You must be logged in to save a book to your profile!')

        },

        removeBook: async (parent, { bookId }, context) => {
            console.log(bookId)
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                )

                return updatedUser
            }

            throw new AuthenticationError('You must be logged in to delete a book from your profile!')
        }

    }
}

module.exports = resolvers