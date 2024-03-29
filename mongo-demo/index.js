const mongoose = require("mongoose");
//mongodb://localhost:27017
mongoose
  .connect("mongodb://localhost:27017/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((error) => console.log("DB Error: " + error));

// In SQL you can maek a field as "required" in DB. Not in MongoDB, needs to put this requeriment in Schema.
const courseSchema = new mongoose.Schema({
  name: { type: String, require: true }, //Create a requeriment to validade
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

  try {
    await course.validate(); // Make a validation check, without sending anything to database. Return void, so, can't store anything to use. Must use callback to get sometihing, ex: "course.validate((err) => { if (err){...}})"
    //Handle Validation error
    const result = await course.save(); // is a promise
    console.log(result);
  } catch (error) {
    console.log(error.message);
  }
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

// Approach 1: Query first -> findById() > Modify Property > save()
/* async function updateCourse(id) {
  const course = await Course.findById(id);
  if (!course) return;
  //course.isPublished = true;
  //course.author = "Another Author";
  course.set({
    isPublished: true,
    author: "Another Author",
  });
  const result = await course.save();
  console.log(result);
}*/

// Approach 2: Update first -> Update directly > Optionally get the updated docuument
async function updateCourse2(id) {
  //if (course.isPublished) return; //Verifying condition BEFORE update it
  //or multi update courses by {îsPublished: false}
  const result = await Course.updateOne(
    // .findByIdAndUpdate() além de atualizar, retornaria o objeto ANTES da modificação. Adicionando o argumento {new: true} retornara o Obj DEPOIS de alterado.
    { _id: id },
    {
      //or multi update courses by {îsPublished: false}
      $set: {
        author: "Mosh",
        isPublished: false,
      },
    }
  );

  console.log(result);
}

async function removeCourse(id) {
  const result = await Course.deleteOne({ _id: id }); //or multi update courses by {îsPublished: false}, .deleteOne() will delete ONLY THE FIRST ONE FOUNDED.
  // .deleteMany() to delete various objexts simultaneously
  // .findByIdAndRemove() delete and return the object that was deleted, if not found, will return "null".
  console.log(result);
}

//removeCourse("65c4ed7aabe38e29daea128c");
//updateCourse2("65b58f66c1d0fd324da523af");
//getCourses();
createCourse();

/*
 método update foi descontinuado no Mongoose a partir da versão 4.0.0.
 Em vez disso, você deve usar o método updateOne, updateMany, findOneAndUpdate ou replaceOne para atualizar documentos no banco de dados.
*/

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
