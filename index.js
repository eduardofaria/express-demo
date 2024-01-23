//import "dotenv/config";
const startuDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const dotenv = require("dotenv"); // or without a const call it use process.env
dotenv.config();
const env = process.env;

const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan"); // Not to be uses in production, impact response perfomance
const express = require("express");
const { string } = require("joi");
const logger = require("./middleware/logger");
const authenticate = require("./middleware/authenticate");
const Joi = require("joi"); // "J" because returns a Class
const courses = require("./routes/courses"); // Router
const home = require("./routes/home");
//require("joi")(Joi); // Other way to import
const app = express();

//Popular Template Engines for Express: Pug (used here), Mustache, EJS
app.set("view engine", "pug"); //With this syntax, Express auto load this module, no need to "require".
//app.set("views", "./views"); // default value, change it is optional.

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

//Router (its a middleware too)
app.use("/api/courses", courses); // Any request for api/courses url, goes to courses.js
app.use("/", home);

//CONFIGURATION
console.log("Application Name: " + config.get("name"));
console.log(`Mail Server: ${config.get("mail.host")}`);
console.log(`Mail Password: ${config.get("mail.password")}`); // add this to env in terminal: set app_password=1234
// If using npm config pkg, the json file with variables in config folder must me named: custom-environment-variables.json
// password in .env INTENCIONALLY NOT IN .gitignore to show the magic. Add this in .gitignore in real world BEFORE the first commit of sensitive data.
console.log(`Mail Password: ${env.secure_app_password}`);

if (app.get("env") === "development") {
  app.use(morgan("tiny")); // a logger. Is a functions "()", "tiny" is the simplest argument. Tiny display a simple log in console
  //console.log("[INFO] Morgan enabled...");

  startuDebugger("[INFO] Morgan enabled...");
  // In console: set DEBUG=app:startup
  // To reset: set DEBUG=
  // For multiple debugs: DEBUG=app:startup,app:db
  // For all debug of a namespaces to debug: DEBUG=app:*
  // Enable in command line, start server with: DEBUG=app.db nodemon index.js
}

// Database work...
dbDebugger("Connected to the database...");

app.use(logger);
app.use(authenticate);

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
