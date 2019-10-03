const express = require("express")
const fs = require("fs-extra")
const connection = require('./db')
const Request = require("tedious").Request
const Types = require("tedious").TYPES


const router = express.Router();

////getAll///
router.get("/projects", async (req, res) => {
  var selectProjects = "SELECT * FROM PROJECTS"
  var request = new Request(selectProjects, (err, rowCount, rows) => {
    if (err) res.send(err.message)
    else res.send(projects)
  })
  var projects = [];
  request.on('row', (columns) => {
    var project = {}
    columns.forEach(column => {
      project[column.metadata.colName] = column.value
    })
    projects.push(project);
  })
  connection.execSql(request);
})

// router.get("/", async (req, res) => {
//   var selectStudents = "SELECT * FROM STUDENTS"
//   var request = new Request(selectStudents, (err, rowCount, rows) => {
//     if (err) res.send(err)
//     else res.send(students)
//   })
//   var students = [];
//   request.on('row', (columns) => { //every time we receive back a row from SQLServer
//     var student = {}
//     columns.forEach(column => {
//       student[column.metadata.colName] = column.value //add property to the book object
//     })
//     students.push(student);
//   })
//   connection.execSql(request); //Execute Query
// })

router.get("/", async (req, res) => {
  var selectStudents = "SELECT * FROM STUDENTS" 
  if (req.query.name) //if we specify a category, filter for the category
    selectStudents += " WHERE Name = '" + req.query.name + "'";

  selectStudents += " ORDER BY Name"
  //Skips the first N record where N = req.query.skip or 0 if req.query.skip is undefined
  selectStudents += ` OFFSET ${req.query.skip ? req.query.skip : 0} ROWS`

  if (req.query.limit) //Uses FETCH NEXT to limit the number of results from the query
    selectStudents += " FETCH NEXT " + req.query.limit + " ROWS ONLY"

  console.log(selectStudents)

  var request = new Request(selectStudents, (err, rowCount, rows) => {
    if (err) res.send(err)
    else res.send(students)
  })

  var students = [];
  request.on('row', (columns) => { //every time we receive back a row from SQLServer
    var student = {}
    columns.forEach(column => {
      student[column.metadata.colName] = column.value //add property to the book object
    })
    students.push(student);
  })
  connection.execSql(request); //Execute Query
})


router.get("/:id", async (req, res) => {
  var selectStudent = "SELECT * FROM STUDENTS WHERE StudentId = " + req.params.id
  var request = new Request(selectStudent, (err, rowCount, rows) => {
    if (err) res.send(err)
    else {
      if (rowCount == 1)
        res.send(student)
      else
        res.status(404).send("Cannot find student " + req.params.id)
    }
  })
  var student = {};
  request.on('row', (columns) => { //every time we receive back a row from SQLServer
    columns.forEach(column => {
      student[column.metadata.colName] = column.value //add property to the book object
    })
  })
  connection.execSql(request); //Execute Query
})


router.post("/", async (req, res) => {
  var selectStudents = `INSERT INTO Students (Name, Surname, Email, DOB)
                       VALUES ('${req.body.Name}', '${req.body.Surname}', 
                       '${req.body.Email}', '${req.body.DOB}')`

  var request = new Request(selectStudents, (err) => {
    if (err) res.send(err)
    else res.send("Item added")
  })
  connection.execSql(request); //Execute Query
})


router.put("/:id", async (req, res) => {
  var updateStudents = ` UPDATE STUDENTS SET `
  delete req.body.StudentId

  Object.keys(req.body).forEach(propName => {
    if (propName == 'DOB')
      updateStudents += `${propName} = '${req.body[propName]}' `
    else
      updateStudents += `${propName} = '${req.body[propName]}', `
  })

  updateStudents += ` WHERE StudentId = ${req.params.id} `

  var request = new Request(updateStudents, (err, rowCount, rows) => {
    if (err) res.send(err)
    else res.send("Rows modified " + rowCount)
  })
  connection.execSql(request); //Execute Query
})


router.delete("/:id", async (req, res) => {
  var request = new Request("DELETE FROM STUDENTS WHERE StudentId= " + req.params.id,
    (err, rowCount, rows) => {
      if (err) res.send(err)
      else res.send("Rows deleted: " + rowCount)
    })
  connection.execSql(request);
})


////////PROJECTS///////////////

////get One Student's Projects/////
// router.get("/:id/projects", async(req, res)=>{
//   var selectedProjects = "SELECT Projects.Name, Description, CreationDate, RepoURL, LiveURL FROM STUDENTS JOIN PROJECTS ON Students.StudentId = Projects.StudentId WHERE Students.StudentId = " + req.params.id
//   var request = new Request(selectedProjects, (err, rowCount, rows) => {
//     if (err) res.send(err)
//     else res.send(projects)
//   })
//   var projects = [];
//   request.on('row', (columns) => { //every time we receive back a row from SQLServer
//     var project = {}
//     columns.forEach(column => {
//       project[column.metadata.colName] = column.value //add property to the book object
//     })
//     projects.push(project);
//   })
//   connection.execSql(request); //Execute Query
// })

////get One Student's Projects (different projection than previous)/////
router.get("/:id/projects", async (req, res) => {
  var selectedProjects = "SELECT StudentName = Students.Name, Students.Surname, Projects.Name, Description, CreationDate, RepoURL, LiveURL FROM PROJECTS JOIN STUDENTS ON Students.StudentId = Projects.StudentId WHERE Students.StudentId = " + req.params.id
  var request = new Request(selectedProjects, (err, rowCount, rows) => {
    if (err) res.send(err)
    else res.send(projects)
  })
  var projects = [];
  request.on('row', (columns) => { //every time we receive back a row from SQLServer
    var project = {}
    columns.forEach(column => {
      project[column.metadata.colName] = column.value //add property to the book object
    })
    projects.push(project);
  })
  connection.execSql(request); //Execute Query
})

router.post("/projects", async (req, res) => {
  var insertProject = `INSERT INTO Projects (Name, Description, CreationDate, RepoURL, LiveURL, StudentId)
  VALUES ('${req.body.Name}', '${req.body.Description}', '${req.body.CreationDate}', 
  '${req.body.RepoURL}', '${req.body.LiveURL}', '${req.body.StudentId}')`

  var request = new Request(insertProject, (err) => {
    if (err) res.send(err)
    else res.send("Item added")
  })
  connection.execSql(request); //Execute Query
})

router.put("/:id/projects/:projectId", async (req, res) => {
  var updateProjects = ` UPDATE PROJECTS SET `
  delete req.body.ProjectId

  Object.keys(req.body).forEach(propName => {
    if (propName == 'StudentId')
      updateProjects += `${propName} = '${req.body[propName]}' `
    else
      updateProjects += `${propName} = '${req.body[propName]}', `
  })

  updateProjects += ` WHERE ProjectId = ${req.params.projectId} `
  var request = new Request(updateProjects, (err, rowCount, rows) => {

    if (err) res.send(err)
    else res.send("Rows modified " + rowCount)
  })
  connection.execSql(request); //Execute Query
})

router.delete("/:id/projects/:projectId", async (req, res) => {
  var request = new Request("DELETE FROM PROJECTS WHERE ProjectId= " + req.params.projectId,
    (err, rowCount, rows) => {
      if (err) res.send(err)
      else res.send("Rows deleted: " + rowCount)
    })
  connection.execSql(request);
})

module.exports = router

