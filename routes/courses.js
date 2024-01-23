const express = require("express");
//const router = express(); This doesn't work when separete the routes in separete modules
const router = express.Router(); // Replacing router object to router object. When not in the main index.js file.

//MOCKUP DATA
const courses = [
  { id: 1, name: "Course 1" },
  { id: 2, name: "Course 2" },
  { id: 3, name: "Course 3" },
];

//Display Mockup Data
console.log(courses);

router.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
  res.render("index", { title: "Express-Demo", message: "Hello World!" }); //index = the name of file in ./views to use
});

//using MOCKUP DATA

//GET
router.get("/", (req, res) => {
  // Changed "/api/courses" to "/" because in index.js this "start entry point" is already set with "app.use("/api/courses", courses);"

  res.send(courses);
});
router.get("/:id", (req, res) => {
  // res.send(req.params.id); // enviando o req.params.id para o client com res.send()
  let requestedCourse = parseInt(req.params.id);
  let foundedCourse = courses.find((c) => c.id === requestedCourse);
  if (!foundedCourse) return res.status(404).send("Course was not found.");
  res.status(200).send(foundedCourse);
});

// POST request : With Joi Validation
router.post("/", (req, res) => {
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  const validationResult = validateCourse(course);
  //console.log(validationResult.error);

  if (validationResult.error) {
    // Condition based on Joi result
    // res.status(400).send(validationResult.error.details[0].message); Old Way
    res.status(400).send(validationResult.error.message);
    return;
  }
  courses.push(course);
  res.send(course);
});

// PUT: Updating data
router.put("/api/courses/:id", (req, res) => {
  // Look up for the course > If !exist = 404 > Validate > If invalid = 400 > Update object atribute = 200 > Return updated Object
  let courseIdToUpdate = parseInt(req.params.id);
  let course = courses.find((c) => c.id === courseIdToUpdate);
  if (!course) {
    res.status(404).send("No course with the given Id was found.");
    return;
  }
  //let validation = validateCourse(course);
  let { error } = validateCourse(course); // Destructuring to replace validation.error for error
  if (error) {
    res.status(400).send(validation.error.message);
    return;
  }

  /* FIND INDEX WAY TO REPLACE OBJECT ELEMENT
  let course = {
    id: courseIdToUpdate,
    name: req.body.name,
  };
  let index = courses.findIndex((c) => c.id === course.id);
  courses[index] = course;
*/
});

// DELETE
router.delete("/:id", (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("Could not find course with the given ID."); // Forma abreviada de usar o return numa linha só.

  let { error } = validateCourse(course);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  // Using Filter to delete (courses could not be a const, change it to let)
  //courses = courses.filter((c) => c.id !== course.id);

  // Using Splice to delete (splice could be used even if courses is a const)
  let index = courses.indexOf(course);
  courses.splice(index, 1);

  res.status(200).send(course);
});

// Consoidating validation schema in one place for reuse
function validateCourse(course) {
  const schema = Joi.object({
    id: Joi.number(),
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}

module.exports = router;
