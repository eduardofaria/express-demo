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
    const pageNumber = 2;
    const pageSize = 10;
    // Ex: /api/courses?pageNumber=2&pageSize=10

    const courses = await Course.find({ author: /^Mosh/ }) // Starts with "Mosh" with Regular Expressions (/pattern/)
      // Ends with Hamedani: /Hamedani$/ or for NON Case sensitive /Hamedani$/i (add "i" after the "/")
      // Contains Mosh: /.*Mosh.*/ "."(zero) or "*"(more) characters before or after Mosh
      //.find().or([{ author: "Mosh" }, { isPublished: true }]) //find results that match this author OR publish status. An array o objects to filter
      //.find({ author: "Mosh", isPublished: true })
      //.find({ price: { $in: [10, 15, 20] } }) //.find({ price: 10 }) -> .find({ price: { $gt: 10, $lte: 20 } })
      //.and([{}]) // using OR || AND you can let .find() without any arguments.
      .skip((pageNumber - 1) * pageSize) //Pagination, means that page starts after page 1
      .limit(pageSize)
      //.limit(10)
      .sort({ name: 1 }) // 1: ascending / -1: descending
      .select({ name: 1, tags: 1 });
    //.count(); // Number of matches found !!!Cannot be used with .select()!!!
    console.log(courses);
  } catch (error) {
    console.log(error.message);
  }
}

getCourses();
//createCourse();

/*
# MongoDB Comparison Operators
eq (equal)
ne (not equal)
gt (greater)
gte (greater than or equal to)
lt (less than)
lte (less than or equal to)
in 
nin (not in)

# MongoDB Logical Operators
or
and
*/
