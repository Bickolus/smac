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
      .populate([
        { path: "thoughts", select: "-__v" },
        { path: "friends", select: "-__v" },
      ])
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user exists with that ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Creating a new user
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
                ? res.json(deletedData)
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
    User.findOneAndDelete({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true, runValidators: true })
      .then((dbUserData) => 
        !dbUserData
          ? res.status(404).json({ message: "No user exists with that ID!" })
          : res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },
};