const { faker } = require("@faker-js/faker");
const mysql2 = require("mysql2");
// Create the connection to database
const connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "Gargi1516",
});

// try {
//   connection.query("SHOW TABLES",(err,res)=>{
//   console.log(res);
//   })
// } catch(err){
//   console.log("Error",err);
// }
//INSERTING SINGLE VALUE INTO USER DATABASE
// let q ="INSERT INTO user (id,username,email,password) VALUES (?,?,?,?)";
// let user=[1,"Sujal","Sujal@gamil.com","sujal2004"];
// try {
//   connection.query(q,user,(err,res)=>{
//   if(err) throw err;
//   console.log(res);
//   })
// } catch(err){
//   console.log("Error",err);
// }

//INSERTING MULTIPLE VALUE INTO USER DATABASE
// let q ="INSERT INTO user (id,username,email,password) VALUES ?";
// let user=[[2,"Harshala","Harshala@gamil.com","Harshala2003"],
//           [3,"Anuja","Anuja@gamil.com","Anuja2004"]];
// try {  //   connection.query(q,[user],(err,res)=>{
//   if(err) throw err;
//   console.log(res);
//   })
// } catch(err){
//   console.log("Error",err);
// }

// let getRandomUser= ()=> {
//   return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.email(),
//      faker.internet.password(),
//   ];
// }
// let q ="INSERT INTO user (id,username,email,password) VALUES ?";
// let data =[]; // To Store 97 users
// for(let i=1;i<=97;i++){
//   data.push(getRandomUser());
// }

// try {
//     connection.query(q,[data],(err,res)=>{
//     if(err) throw err;
//     console.log(res);
//     })
//   } catch(err){
//     console.log("Error",err);
//   }

const express = require("express");
const app = express();
const port = 3000;

const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const { v4: uuidv4 } = require("uuid");

const path = require("path");
const { name } = require("ejs");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.render("home.ejs");
    });
  } catch (err) {
    console.log("Error", err);
  }
});

app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let users = result; // database mdla result users mde store kela
      res.render("showusers.ejs", { users });
    });
  } catch (err) {
    console.log("Error", err);
  }
});

// Edit Root
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`; // observe carefully this line
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log("Error", err);
  }
});
// upadate existing value
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password, username } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`; // observe carefully this line
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (password !== user.password) res.send("Wrong Password");
      else {
        let q2 = `UPDATE user SET username='${username}' WHERE id='${id}'`; // observe carefully this line
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log(result);
            console.log("updated!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    console.log("Error", err);
    res.send("Some Error In Database");
  }
});

//new user
app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  //Query to Insert New User observe cacrefully values are in the form string
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/user");
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

// Delte user
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

app.delete("/user/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("WRONG Password Entered!");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log("deleted!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});
