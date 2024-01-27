const mongoose = require("mongoose");
//mongodb://localhost:27017
mongoose
  .connect("mongodb://localhost:27017/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((error) => console.log("DB Error: " + error));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: {
    type: Date, //Date
    default: Date.now,
  },
  isPublished: Boolean,
});

const Course = mongoose.model("courses", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Angular Course",
    author: "Mosh",
    tags: ["angular", "frontend"],
    isPublished: true,
  });

  const result = await course.save(); // is a promise
  console.log(result);
}

async function getCourses() {
  try {
    const courses = await Course.find({ author: "Mosh", isPublished: true })
      .limit(10)
      .sort({ name: 1 }) // 1: ascending / -1: descending
      .select({ name: 1, tags: 1 });
    console.log(courses);
  } catch (error) {
    console.log(error.message);
  }
}

getCourses();
//createCourse();
