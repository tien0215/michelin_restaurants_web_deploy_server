const router = require("express").Router();
const Comment = require("../models").comment;
const Restaurant = require("../models").restaurant;

router.use((req, res, next) => {
  console.log("comment route正在接受一個request...");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("成功連結 comment route...");
});

router.post("/:restaurantId", async (req, res) => {
  const { content, user } = req.body; // `user` can be optional
  const { restaurantId } = req.params;
  console.log({ content, user, restaurantId });
  try {
    // Step 1: Create a new comment
    const newComment = new Comment({
      text: content,
      createdBy: user,
      restaurant: restaurantId,
    });
    const savedComment = await newComment.save();

    // Step 2: Add the comment ID to the restaurant's comments array
    await Restaurant.findByIdAndUpdate(restaurantId, {
      $push: { comment: savedComment._id },
    });

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: savedComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
});

module.exports = router;
