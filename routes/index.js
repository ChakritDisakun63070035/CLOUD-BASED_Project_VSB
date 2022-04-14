const express = require("express")
const pool = require("../config")
const path = require("path")
const bodyParser = require("body-parser")
const { redirect } = require("express/lib/response")
const multer = require("multer")

router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./static/uploads")
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })

router.get("/", async function (req, res, next) {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM course")
    return res.render("index", { courses: JSON.stringify(rows) })
  } catch (err) {
    return next(err)
  }
})

router.get("/allcourse/:id", async function (req, res, next) {
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  try {
    const [rows, fields] = await conn.query("SELECT * FROM course")
    const [rows1, fields1] = await conn.query("SELECT * FROM user WHERE user_id=?", [req.params.id])
    return res.render("allcourse", { courses: JSON.stringify(rows), users: JSON.stringify(rows1) })
  } catch (err) {
    console.log(err)
    await conn.rollback()
  } finally {
    console.log("finally")
    await conn.release()
  }
})

router.get("/allcourse/", async function (req, res, next) {
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  try {
    const [rows, fields] = await conn.query("SELECT * FROM course")
    res.render("allcoursenotsignin", { courses: JSON.stringify(rows) })
  } catch (err) {
    console.log(err)
    await conn.rollback()
  } finally {
    console.log("finally")
    await conn.release()
  }
})

router.get("/allcourse/not-sign-in/:id", async function (req, res, next) {
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  try {
    const [rows2, fields2] = await conn.query("UPDATE `user` SET status_user=? WHERE user.user_id=?", ["off", req.params.id])
    res.redirect("/allcourse/")
  } catch (err) {
    console.log(err)
    await conn.rollback()
  } finally {
    console.log("finally")
    await conn.release()
  }
})

router.get("/mycart", async function (req, res, next) {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM order_item", [req.params.id])
    return res.render("user/cart", { data: JSON.stringify(rows) })
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

// router.get("/course/:id", async function (req, res, next) {
//   try {

//     const [rows, fields] = await pool.query(
//       'SELECT * FROM course JOIN teacher USING(teacher_id) JOIN(preview) USING(course_id) JOIN(preview_preview_video) USING(preview_id) WHERE course_id=?',
//       [req.params.id]
    
//     );
    
//     return res.render("preview", { data: JSON.stringify(rows) });
//   } catch (err) {
//     return next(err)
//   }
// });
router.get("/course/:id", async function (req, res, next) {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM course JOIN teacher USING(teacher_id) JOIN(preview) USING(course_id) JOIN(preview_preview_video) USING(preview_id) WHERE course_id=?",
      [req.params.id]
    )

    return res.render("preview", { data: JSON.stringify(rows) })
  } catch (err) {
    return next(err)
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
    const [rows1, fields1] = await conn.query("UPDATE `user` SET status_user=? WHERE email=?", ["on", email])
    await conn.commit()
    let user_id = rows[0].user_id

    if (rows.length > 0) {
      res.redirect("/allcourse/" + user_id)
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

router.get("/profile/:id", async function (req, res, next) {
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  try {
    const [rows, fields] = await conn.query("SELECT * FROM `user` WHERE user_id=?", [req.params.id])
    res.render("user/user_profile", {
      users: JSON.stringify(rows),
    })
  } catch (err) {
    console.log(err)
    await conn.rollback()
  } finally {
    console.log("finally")
    await conn.release()
  }
})

router.post("/profile/:id", upload.single("image"), async function (req, res, next) {

  const conn = await pool.getConnection()
  await conn.beginTransaction()

  const fname = req.body.fname
  const lname = req.body.lname
  const email = req.body.email
  const password = req.body.password
  const dob = req.body.dob
  const gender = req.body.gender

  const file = req.file
  if (!file) {
    const error = new Error("Please upload a file")
    error.httpStatusCode = 400
    return next(error)
  }
  if (file) {
    await conn.query("UPDATE user SET image=? WHERE user_id=?", [file.path.substring(6), req.params.id])
  }
  try {
    const [rows, fields] = await conn.query("UPDATE `user` SET user_fname=?, user_lname=?, email=?, password=?, dateofbirth=?, gender=? WHERE user_id=?", [
      fname,
      lname,
      email,
      password,
      dob,
      gender,
      req.params.id,
    ])

    let user_id = req.params.id
    res.redirect("/profile/" + user_id)
  } catch (err) {
    console.log(err)
    await conn.rollback()
  } finally {
    console.log("finally")
    await conn.release()
  }
})

router.get("/course/:id", async function (req, res, next) {
  const [rows, fields] = await pool.query("SELECT * FROM course join teacher using(teacher_id) join preview using(course_id) join preview_preview_video using(preview_id) WHERE course_id=?", [req.params.id])
  console.log(rows)
  return res.render("preview", { data: JSON.stringify(rows) })
})

// router.get("/courseId/allcourse", async function (req, res, next) {
//   try {
//     const [rows, fields] = await pool.query(
//       'SELECT * FROM course join teacher using(teacher_id) WHERE course_id=?',
//       [req.params.courseId]
//     );
//     return res.render("allcourse", { courses: JSON.stringify(rows) });
//   } catch (err) {
//     return next(err)
//   }
// });
exports.router = router
