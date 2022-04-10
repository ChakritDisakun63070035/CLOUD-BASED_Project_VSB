const express = require("express")
const pool = require("../config")
const path = require("path")
const bodyParser = require("body-parser")

router = express.Router()

router.get("/", async function (req, res, next) {
<<<<<<< HEAD
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

exports.router = router;
=======
  try {
    const [rows, fields] = await pool.query("SELECT * FROM course")
    return res.render("index", { courses: JSON.stringify(rows) })
  } catch (err) {
    return next(err)
  }
})

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

exports.router = router
>>>>>>> 64811421082c9a0f29860997d27a36a56fd926ba
