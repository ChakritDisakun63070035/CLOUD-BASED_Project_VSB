const express = require("express")
const pool = require("../config")
const path = require("path")
const bodyParser = require("body-parser")

router = express.Router()

router.get("/", async function (req, res, next) {
    try {
        const [rows, fields] = await pool.query(
          'SELECT * FROM course'
        );
        return res.render("index", { courses: JSON.stringify(rows) });
      } catch (err) {
        return next(err)
      }
});

router.get("/allcourse", async function (req, res, next) {
  try {
      const [rows, fields] = await pool.query(
        'SELECT * FROM course'
      );
      return res.render("allcourse", { courses: JSON.stringify(rows) });
    } catch (err) {
      return next(err)
    }
});

// exports.router = router;
//   try {
//     const [rows, fields] = await pool.query("SELECT * FROM course")
//     return res.render("index", { courses: JSON.stringify(rows) })
//   } catch (err) {
//     return next(err)
//   }
// })

exports.router = router;
  

router.get("/sign-up", async function (req, res, next) {
  res.render("user/sign-up")
})

router.post("/sign-up", async function (req, res, next) {
  const fname = req.body.fname
  const lname = req.body.lname
  const email = req.body.email
  const password = req.body.password
  const dob = req.body.dob
  const gender = req.body.gender

  const conn = await pool.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await conn.query("INSERT INTO user (user_fname, user_lname, email, password, dateofbirth, gender) VALUES(?, ?, ?, ?, ?, ?)", [
      fname,
      lname,
      email,
      password,
      dob,
      gender
    ])

    await conn.commit()
    res.redirect("/")
  } catch (err) {
    await conn.rollback()
    next(err)
  } finally {
    console.log("finally")
    await conn.release()
  }
})

router.get("/course/:id",async function (req, res, next) {
  const promise1 = pool.query("SELECT * FROM course WHERE course_id=?", [
    req.params.id,
    
    console.log(req.body),
    // res.render("preview")
  ]);
  
  Promise.all([promise1])
    .then((results) => {
      const course = results[0];
      
      //เอาตัวแปรมารับ
      console.log(course)
      res.render("preview", {
        course: course[0][0],
        error: null,
      });
    })
    .catch((err) => {
      return next(err);
    });
});

exports.router = router
