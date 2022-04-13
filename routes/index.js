const express = require("express")
const pool = require("../config")
const path = require("path")
const bodyParser = require("body-parser")

router = express.Router()

router.get("/", async function (req, res, next) {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM course")
    return res.render("index", { courses: JSON.stringify(rows) })
  } catch (err) {
    return next(err)
  }
})

router.get("/allcourse", async function (req, res, next) {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM course")
    return res.render("allcourse", { courses: JSON.stringify(rows) })
  } catch (err) {
    return next(err)
  }
})

router.get("/sign-up", async function (req, res, next) {
  res.render("user/sign-up", { message: req.flash("message") })
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
      gender,
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

router.get("/sign-in", async function (req, res, next) {
  res.render("user/sign-in")
})

router.post("/sign-in", async function (req, res, next) {
  const email = req.body.email
  const password = req.body.password

  const conn = await pool.getConnection()
  await conn.beginTransaction()

  try {
    const [rows, fields] = await conn.query("SELECT * FROM user WHERE email=? AND password=?", [email, password])

    await conn.commit()

    if (rows.length > 0) {
      res.redirect("/allcourse")
    } else {
      req.flash("message", "Please Sign-up First")
      res.redirect("/sign-up")
    }
  } catch (err) {
    await conn.rollback()
    next(err)
  } finally {
    console.log("finally")
    await conn.release()
  }
})

router.get("/reset_password", async function (req, res, next) {
  res.render("user/reset_password")
})

router.post("/reset_password", async function (req, res, next) {
  res.redirect("/")
})

router.get("/course/:id", async function (req, res, next) {
  const [rows, fields] = await pool.query("SELECT * FROM course join teacher using(teacher_id) WHERE course_id=?", [req.params.id])
  return res.render("preview", { data: JSON.stringify(rows) })
})

exports.router = router
