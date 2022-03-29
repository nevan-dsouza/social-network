const { User, Thought } = require("../models");

module.exports = {
  // Get every user
  getAllUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get user by id
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate( "thoughts" )
      .populate( "friends" )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user exists with that ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Creating a new user, use this as a template
  // {
  //   "username": "namehere",
  //   "email": "emailhere"
  // }
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },
  // Updating a user
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { new: true, runValidators: true })
      .then((dbUserData) => 
        !dbUserData
          ? res.status(404).json({ message: "No user exists with that ID!" })
          : res.json(dbUserData)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Deleting a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((dbUserData) => 
        !dbUserData
          ? res.status(404).json({ message: "No user exists with that ID!" })
          : Thought.deleteMany({ username: dbUserData.username })
            .then((deletedData) =>
              deletedData
                ? res.json({ message: "User and their thoughts deleted!" })
                : res.status(404).json({ message: "User doesn't have any thoughts to delete."})
            )
      )
      .catch((err) => res.status(500).json(err));
  },
  // Add a friend to a user's friends array
  addFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true, runValidators: true })
      .then((dbUserData) => 
        !dbUserData
          ? res.status(404).json({ message: "No user exists with that ID!" })
          : res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a friend from a user's friends array
  deleteFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } })
      .then((dbUserData) => 
        !dbUserData
          ? res.status(404).json({ message: "No user exists with that ID!" })
          : res.json({ message: "Friend deleted from user's list!" }))
      .catch((err) => res.status(500).json(err));
  },
};