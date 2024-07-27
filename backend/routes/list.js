const express = require("express");
const router = express.Router();
const User = require("../models/user");
const List = require("../models/list");
const Tag = require("../models/tags");

// Define your predefined tags
const predefinedTags = ["Work", "Personal", "Urgent", "Project", "Homework", "Shopping", "Gym"];

// Route to seed predefined tags
router.post("/seedTags", async (req, res) => {
  try {
    // Check if predefined tags already exist
    const existingTags = await Tag.find({ name: { $in: predefinedTags } });
    const existingTagNames = existingTags.map(tag => tag.name);

    // Determine which tags need to be added
    const tagsToAdd = predefinedTags.filter(tag => !existingTagNames.includes(tag));

    if (tagsToAdd.length > 0) {
      const newTags = tagsToAdd.map(tag => new Tag({ name: tag }));
      await Tag.insertMany(newTags);
      res.status(201).json({ message: "Tags added successfully", tags: newTags });
    } else {
      res.status(200).json({ message: "All predefined tags already exist" });
    }
  } catch (error) {
    console.error("Error adding tags: ", error);
    res.status(500).json({ message: "Error adding tags", error });
  }
});

// Route to fetch all tags
router.get('/tags', async (req, res) => {
  try {
    console.log("Fetching tags from the database...");
    const tags = await Tag.find({});
    console.log("Tags fetched: ", tags);
    res.status(200).json({ tags });
  } catch (error) {
    console.error("Error fetching tags: ", error);
    res.status(500).json({ message: 'Error fetching tags', error });
  }
});

// Route to add a new tag (optional, based on your requirements)
router.post('/tags', async (req, res) => {
  const { tag } = req.body;
  try {
    const existingTag = await Tag.findOne({ name: tag });
    if (existingTag) {
      return res.status(400).json({ message: 'Tag already exists' });
    }
    const newTag = new Tag({ name: tag });
    await newTag.save();
    res.status(201).json({ message: 'Tag added', tag: newTag.name });
  } catch (error) {
    res.status(500).json({ message: 'Error adding tag', error });
  }
});

// Route to add a new task
router.post("/addTask", async (req, res) => {
  try {
    const { title, body, id, tags } = req.body;
    const existingUser = await User.findById(id);
    if (existingUser) {
      let tagObjects = [];
      if (tags && tags.length > 0) {
        tagObjects = await Tag.find({ name: { $in: tags } });
      }

      const list = new List({ title: title, body: body, user: existingUser, tags: tagObjects });
      await list.save();
      existingUser.list.push(list);
      await existingUser.save();

      res.status(200).json({ list });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while adding the task" });
  }
});

// Route to update a task
router.put("/updateTask/:id", async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const list = await List.findByIdAndUpdate(req.params.id, { title, body, tags });
    list.save().then(() => res.status(200).json({ message: "Task Updated" }));
  } catch (error) {
    console.log(error);
  }
});

// Route to delete a task
router.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { id } = req.body;
    const existingUser = await User.findByIdAndUpdate(
      id,
      { $pull: { list: req.params.id } }
    );
    if (existingUser) {
      await List.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: "Task Deleted",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// Route to get tasks by user ID
router.get("/getTasks/:id", async (req, res) => {
  const list = await List.find({ user: req.params.id }).sort({ createdAt: -1 });
  if (list.length != 0) {
    res.status(200).json({ list: list });
  } else {
    res.status(200).json({ message: "No task added yet" });
  }
});

// Route to search tasks
router.get("/searchTasks", async (req, res) => {
  const { query, userId } = req.query;

  try {
    const tasks = await List.find({
      user: userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { body: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    if (tasks.length > 0) {
      res.status(200).json({ tasks });
    } else {
      res.status(200).json({ message: "No matching tasks found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while searching for tasks" });
  }
});

// Route to get tasks by tag
router.get("/getTasksByTag/:tag", async (req, res) => {
  try {
    const tag = await Tag.findOne({ name: req.params.tag });
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    const tasks = await List.find({ tags: tag._id }).populate('tags');
    res.status(200).json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while retrieving tasks" });
  }
});

module.exports = router;
