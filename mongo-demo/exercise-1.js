const { string } = require("joi");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/mongo-exercises")
  .then(() => {
    console.log("Connected to mongo-exercises (DB)...");
  })
  .catch((err) => {
    console.error("Connection error: " + err);
  });

const courseSchema = new mongoose.Schema({
  author: String,
  date: {
    type: Date,
    default: Date.now,
  },
  isPublished: Boolean,
  name: String,
  price: Number,
  tags: [String],
});

const Course = mongoose.model("Course", courseSchema);

async function getCourses() {
  try {
    return await Course.find({
      isPublished: true,
      tags: "backend",
    })
      .sort({ name: "asc" }) // or ('name') for asc and ('-name') for desc
      .select(["name", "author"]);
  } catch (error) {
    return error("Operation Error: " + error.message);
  }
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();
