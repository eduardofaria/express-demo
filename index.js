//import "dotenv/config";
const dotenv = require("dotenv"); // or without a const call it use process.env
dotenv.config();
const env = process.env;

const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan"); // Not to be uses in production, impact response perfomance
const express = require("express");
const { string } = require("joi");
const logger = require("./logger");
const authenticate = require("./authenticate");
const Joi = require("joi"); // "J" because returns a Class

//require("joi")(Joi); // Other way to import
const app = express();

console.log(`Enviroment: ${process.env.NODE_ENV}`); // returns undefined if nothing is set
console.log(`App: ${app.get("env")}`); // app.get brings a object with info about the application. If process.env.NODE_ENV not set, returns "development" by default.

/*
Setting enviromment
On Mac: export NODE_ENV=production
On Windows: set NODE_ENV=production
*/

app.use(express.json()); // A middleware. Need to be enable for express receive JSON in the req.body
app.use(express.urlencoded({ extended: true })); //transform forms input in this: key=value&key=value
// extended: true enable to pass arrays and complex objects in url encoded format
app.use(express.static("public")); // for serving static files. Use a folder to use, as argument.
app.use(helmet()); // is a function, so, need "()"

//CONFIGURATION
console.log("Application Name: " + config.get("name"));
console.log(`Mail Server: ${config.get("mail.host")}`);
console.log(`Mail Password: ${config.get("mail.password")}`); // add this to env in terminal: set app_password=1234
// If using npm config pkg, the json file with variables in config folder must me named: custom-environment-variables.json
// password in .env INTENCIONALLY NOT IN .gitignore to show the magic. Add this in .gitignore in real world BEFORE the first commit of sensitive data.
console.log(`Mail Password: ${env.secure_app_password}`);

if (app.get("env") === "development") {
  app.use(morgan("tiny")); // a logger. Is a functions "()", "tiny" is the simplest argument. Tiny display a simple log in console
  console.log("[INFO] Morgan enabled...");
}
app.use(logger);
app.use(authenticate);

//MOCKUP DATA
const courses = [
  { id: 1, name: "Course 1" },
  { id: 2, name: "Course 2" },
  { id: 3, name: "Course 3" },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

//using MOCKUP DATA

//GET
app.get("/api/courses", (req, res) => {
  res.send(courses);
});
app.get("/api/courses/:id", (req, res) => {
  // res.send(req.params.id); // enviando o req.params.id para o client com res.send()
  let requestedCourse = parseInt(req.params.id);
  let foundedCourse = courses.find((c) => c.id === requestedCourse);
  if (!foundedCourse) return res.status(404).send("Course was not found.");
  res.status(200).send(foundedCourse);
});

// POST request : With Joi Validation
app.post("/api/courses", (req, res) => {
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
app.put("/api/courses/:id", (req, res) => {
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
app.delete("/api/courses/:id", (req, res) => {
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

// POST request : Without Joi validation
/*
app.post("/api/courses", (req, res) => {
  if (!req.body.name || req.body.name.length < 3) {
    // 400 Bad Request
    res.status(400).res.send("Name is required and more than 3 characters.");
    return;
  }
  const course = {
    id: courses.length + 1, //fake id, for no database code
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
  //if (!course) res.status(404).send("No data added.");
  //res.status(200).send(course);
});
*/

//course.name = req.body.name;
//res.status(200).send(course);
console.log(courses);

app.get("/api/posts/:year/:month", (req, res) => {
  //res.send(req.query);
  //res.send(req.params.year);
  let post = req.params;
  let date = new Date();
  let m = parseInt(post.month) - 1;
  date.setMonth(m);
  // Se a URL tem parâmetros como "?" ex: http://localhost:3000/api/posts/2018/1?sortBy=name use .query
  let query = req.query;
  res.send(
    `
    <code>
    req.query["sortBy"] => ${req.query["sortBy"]}
    <br>
    query["sortBy"] => ${query["sortBy"]}
    <br>
    Object.keys(query)[0] => ${Object.keys(query)[0]}
    <br>
    Object.keys(query)[0] => ${Object.values(query)[0]}
    </code>
    <br>
      Os parâmetros passados são: <strong>filtro:</strong> ${Object.keys(
        query
      )} <strong>valor do filtro:</strong> ${Object.values(query)}
        <br>
      Você quer posts do ano de ${post.year} do mês de ${date.toLocaleString(
      "pt-BR",
      {
        month: "long",
      }
    )}.`
  );
});

// PORT
//process.env.PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
