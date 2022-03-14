const { User, Thought } = require("../models");

module.exports = {
  // Get every thought
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single thought by id
  getSingleThought(req, res) {
    User.findOne({ _id: req.params.thoughtId })
    .populate({ path: "reactions", select: "-__v" })
    .select("-__v")
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought exists with that ID!" })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
  }
};