const express = require("express");
// const { parse } = require("url");
// const fs = require("fs");
const idGen = require("shortid");
const { MongoClient, ObjectID,  } = require('mongodb')
const studentSchema = require('./schema')
const mongoServerURL = 'mongodb://localhost:27017'

// getStudents = async (filter = {}) => {
//   try {
//     const mongo = await MongoClient.connect(mongoServerURL, {
//       useNewUrlParser: true
//     })
//     const collection = mongo.db("Students").collection("Students")
//     const students = collection.find(filter).toArray()
//     return students ? students : []
//   } catch (error) {
//     console.log(error)
//   }
// }

const router = express.Router();

//////Mongo Driver 'GET'///////

// router.get("/", async (req, res) => {
//   const students = await getStudents(req.query);
//   res.send(students)
// })

////////////////////////////////

router.get("/", async (req, res) => {
  try {
      const students = await studentSchema.find({}, {projects: 0})
      res.send(students)
      console.log(students)
      
  } catch (error) {
      console.log(error.body)
  }
})

// router.get("/:id", async (req, res) => {
//   try {
//     const students = await getStudents({ _id: new ObjectID(req.params.id) });
//     res.send(students)
//   } catch (error) {
//     res.send("id not found")
//   }
// })

// router.post("/", async (req, res) => {
//   try {
//     const mongo = await MongoClient.connect(mongoServerURL, {
//       useNewUrlParser: true
//     })
//     const collection = mongo.db("Students").collection("Students")
//     const { insertedId } = await collection.insertOne(req.body)
//     res.send(insertedId)
//   } catch (error) {
//     res.send(error)
//   }
// })

// router.put("/:id", async (req, res) => {
//   try {
//     const mongo = await MongoClient.connect(mongoServerURL, {
//       useNewUrlParser: true
//     })

//     const collection = mongo.db("Students").collection("Students")

//     const { modifiedCount } = await collection.updateOne({ _id: new ObjectID(req.params.id) })

//     if (modifiedCount > 0) {
//       res.send('OK')
//     } else {
//       res.send('NOTHING TO MODIFY')
//     }

//   } catch (error) {

//   }
// })

// router.delete("/:id", async (req, res) => {
//   try {
//     const mongo = await MongoClient.connect(mongoServerURL, {
//       useNewUrlParser: true
//     })
//     const collection = mongo.db("Students").collection("Students")
//     const { deletedCount } = await collection.deleteOne({ _id: new ObjectID(req.params.id) });
//     if (deletedCount > 0) {
//       res.send('OK')
//     } else {
//       res.send('NOTHING TO DELETE')
//     }
//   } catch (error) {
//   }
// })

// router.get("/:id/projects", async (req, res) => {
//   try {
//     const student = await getStudents({ _id: new ObjectID(req.params.id) });
//     console.log(student)
//     var projects = student[0].Projects
//     console.log(projects)
//     res.send(projects)
//   } catch (error) {
//     res.send("id not found")
//   }
// })

// router.post("/:id/projects", async (req, res) => {
//   try {
//     const mongo = await MongoClient.connect(mongoServerURL, {
//       useNewUrlParser: true
//     })
//     const collection = mongo.db("Students").collection("Students")
//     req.body.id = idGen.generate();
//     const project = await collection.updateOne({ _id: new ObjectID(req.params.id)}, {$push: {Projects: req.body}} )
//     res.send(project)    
//   } catch (error) {
//     res.send(error.body)
//   }
// })

//////////////////////////////////////////////////////////////////////////////////////////////////////////
router.delete(":id/projects/:projectId", async (req, res) => {
  try {
    const mongo = await MongoClient.connect(mongoServerURL, {
      useNewUrlParser: true
    })
    const collection = mongo.db("Students").collection("Students")
    // const project = await collection.updateOne({ _id: new ObjectID(req.params.id)}, {$pull: {Projects: {id: req.params.projectId} }} )
    const project = await collection.deleteOne({ _id: req.params.id, $pull:{"Projects._id": req.params.projectId}})
    res.send(project)
  } catch (error) {
  }
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////




//-----------------> File System Code//
// router.get("/:id", (req, res) => {
//   var projects = fs.readFileSync("student.json");
//   const { id } = req.params;
//   var students = JSON.parse(projects);
//   var projectId = students.find(project => project.StudentID == id);
//   res.send(projectId);
// });

// router.post("/", (req, res) => {
//   var student = req.body; // get student from request.body (is an object that contains the data you sent with the post)
//   const buffer = fs.readFileSync("student.json"); //read the file as buffer

//   const file = buffer.toString(); //we re converting it to string for the system to read it
//   var students = JSON.parse(file);//converting it back to a JSON file coz now the system read it
//   students.StudentID = students.length + 1;
//   students.push(student);
//   fs.writeFileSync("student.json", JSON.stringify(students));//writing the new file and converting it to string to post it back.
//   res.send(students);
// });


// router.delete("/:id", (req, res) => {
//   const buffer = fs.readFileSync("student.json");
//   const file = buffer.toString();
//   var allProjects = JSON.parse(file);
//   allProjects = allProjects.filter(project => project.StudentID != req.params.id);
//   fs.writeFileSync("student.json", JSON.stringify(allProjects));
//   res.send( allProjects );
// });

// router.put("/:id", (req, res) => {
//   const buffer = fs.readFileSync("student.json");
//   const file = buffer.toString();//read buffer file
//   var allProjects = JSON.parse(file); //Once read convert to JSON
//   allProjects = allProjects.filter(project => project.StudentID != req.params.id); //filtering all and removing previous item
//   var project = req.body; //the body inserted is now called project
//   project.StudentID = req.params.id;//the ID should be equal to the param
//   allProjects.push(project); //adding new item  
//   fs.writeFileSync("student.json", JSON.stringify(allProjects));

//   res.send(allProjects);
// });

module.exports = router;
