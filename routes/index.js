const express = require("express")
const pool = require("../config")
const path = require("path")
const bodyParser = require("body-parser")
const { redirect } = require("express/lib/response")
const multer = require("multer")

router = express.Router()



const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./static")
  },
  filename: function (req, file, callback) {
    const ext = file.mimetype.split("/")[1]
    callback(null, `/uploads-${file.fieldname}-${Date.now()}.${ext}`)
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
    const [rows, fields] = await conn.query("SELECT * FROM `course`")
    const [rows1, fields1] = await conn.query("SELECT * FROM `user` WHERE user_id=?", [req.params.id])
    // const [rows2, fields2] = await conn.query("SELECT * FROM `order` WHERE user_id=?", [req.params.id])
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

// my cart
router.get("/mycart/:id/", async function (req, res, next) {
  try {
    const [rows1, fields1] = await pool.query("SELECT * FROM `order` WHERE user_id=? AND order_status=?", [req.params.id, "pending"])
    if (rows1.length > 0) {
      let order_id = rows1[0].order_id
      const [rows2, fields2] = await pool.query("SELECT * FROM `order_item` JOIN `course` USING(course_id) WHERE order_id=?", [order_id])
      const [rows3, fields3] = await pool.query("SELECT * FROM `user` WHERE user_id=?", [req.params.id])
      return res.render("user/cart", { items: JSON.stringify(rows2), users: JSON.stringify(rows3), carts: JSON.stringify(rows1) })
    } else{
      const [rows3, fields3] = await pool.query("SELECT * FROM `user` WHERE user_id=?", [req.params.id])
      // res.render("user/cart", {  users: JSON.stringify(rows3)})
      // res.send("nothing in your cart.")
      res.render("user/cart-no", { carts: JSON.stringify(rows1), users: JSON.stringify(rows3)})

    }
  } catch (err) {
    return next(err)
  }
})

// create cart
router.get("/course/:course_id/create/cart/:user_id/:price", async function (req, res, next) {
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  const admin = Math.floor(Math.random() * (7 - 1)) + 1
  try {
    const [order, fields1] = await conn.query("SELECT * FROM `order` WHERE user_id=? AND order_status=?", [req.params.user_id, "pending"])
    if (order.length > 0) {
      let order_status = order[0].order_status
      let order_id = order[0].order_id
      const [additem1, fields1] = await conn.query("INSERT INTO order_item (item_price, course_id, order_id) VALUES(?, ?, ?)", [req.params.price, req.params.course_id, order_id])
      const [additem2, fields2] = await conn.query("INSERT INTO my_course (course_id, order_id) VALUES(?, ?)", [req.params.course_id, order_id])
      const [itemprice1, fields4] = await conn.query("SELECT SUM(item_price) AS total FROM `order_item` WHERE order_id=?", [order_id])
      let total1 = itemprice1[0].total
      const [orderprice1, fields5] = await conn.query("UPDATE `order` SET price_total=? WHERE order_id=?", [total1, order_id])
    } else {
      const [createcart, fields2] = await conn.query("INSERT INTO `order` (order_date, user_id, admin_id) VALUES(CURDATE(), ?, ?)", [req.params.user_id, admin])
      const [additem2, fields6] = await conn.query("INSERT INTO `order_item` (item_price, course_id, order_id) VALUES(?, ?, ?)", [
        req.params.price,
        req.params.course_id,
        createcart.insertId,
      ])
      const [additem3, fields3] = await conn.query("INSERT INTO my_course (course_id, order_id) VALUES(?, ?)", [req.params.course_id, createcart.insertId])
      const [itemprice2, fields7] = await conn.query("SELECT SUM(item_price) AS total FROM `order_item` WHERE order_id=?", [createcart.insertId])
      let total2 = itemprice2[0].total

      const [orderprice2, fields8] = await conn.query("UPDATE `order` SET price_total=? WHERE order_id=?", [total2, createcart.insertId])
    }
    await conn.commit()
    res.redirect("/course/" + req.params.course_id + "/" + req.params.user_id)
  } catch (err) {
    await conn.rollback()
    next(err)
  } finally {
    console.log("finally")
    await conn.release()
  }
})

// del items
router.get("/mycart/:id/:item_no/:order_id", async function (req, res, next) {
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  try {
    const [rows1, fields1] = await conn.query("DELETE FROM `order_item` WHERE item_no=?", [req.params.item_no])
    const [itemprice, fields4] = await conn.query("SELECT SUM(item_price) AS total FROM `order_item` WHERE order_id=?", [req.params.order_id])
    let total = itemprice[0].total
    const [orderprice, fields5] = await conn.query("UPDATE `order` SET price_total=? WHERE order_id=?", [total, req.params.order_id])
    await conn.commit()
    res.redirect("/mycart/" + req.params.id)
  } catch (err) {
    await conn.rollback()
    next(err)
  } finally {
    console.log("finally")
    await conn.release()
  }
})

// payment
router.get("/payment/:id/:order_id", async function (req, res, next) {
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  try {
    const [rows1, fields1] = await conn.query("SELECT * FROM `order` WHERE order_id=?", [req.params.order_id])
    const [rows2, fields2] = await conn.query("SELECT * FROM `user` WHERE user_id=?", [req.params.id])
    await conn.commit()
    res.render("user/payment", { carts: JSON.stringify(rows1), users: JSON.stringify(rows2) })
  } catch (err) {
    await conn.rollback()
    next(err)
  } finally {
    console.log("finally")
    await conn.release()
  }
})

router.post("/payment/:id/:order_id", upload.single("slip"), async function (req, res, next) {
  const conn = await pool.getConnection()
  await conn.beginTransaction()

  const account = req.body.account

  const file = req.file
  if (!file) {
    const error = new Error("Please upload a file")
    error.httpStatusCode = 400
    return next(error)
  }

  try {
    const [rows1, fields1] = await conn.query("INSERT INTO `payment` (payment_slip, payment_account, order_id) VALUES(?, ?, ?)", [
      file.path.substring(7),
      account,
      req.params.order_id,
    ])
    console.log(rows1.insertId)
    const [rows2, fields2] = await conn.query("SELECT * FROM payment JOIN `order_item` USING(order_id) WHERE payment_id=?", [rows1.insertId])

    let order_id_payment = rows2[0].order_id
    let order_id_order = req.params.order_id

    if (order_id_payment == order_id_order) {
      const [rows3, fields3] = await conn.query("UPDATE `order` SET order_status=? WHERE order_id=?", ["complete", order_id_payment])
      const [rows1, fields1] = await conn.query("DELETE FROM `order_item` WHERE order_id=?", [order_id_payment])
    }
    await conn.commit()
    // res.render("own-course", { data: JSON.stringify(rows4), users: JSON.stringify(rows5) })
    res.redirect("/allcourse/" + req.params.id + "/mycourse")
  } catch (err) {
    await conn.rollback()
    next(err)
  } finally {
    console.log("finally")
    await conn.release()
  }
})

router.get("/sign-up", async function (req, res, next) {
  res.render("user/sign-up", { message: req.flash("message") })
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
    const [rows1, fields1] = await conn.query("UPDATE `user` SET status_user=? WHERE email=?", ["on", email])
    await conn.commit()
    if (rows.length > 0) {
      let user_id = rows[0].user_id
      res.redirect("/allcourse/" + user_id)
      // res.redirect("/mycourse/" + user_id)
    } else {
      req.flash("message", "Please Sign-up First.")
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
    // const [rows, fields] = await conn.query("SELECT * FROM `user` WHERE user_id=?", [req.params.id])
    const [rows, fields] = await conn.query("SELECT *, dateofbirth, DATE_FORMAT(dateofbirth, GET_FORMAT(DATE, 'ISO')) AS date FROM `user` WHERE user_id=?", [req.params.id])
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
    await conn.query("UPDATE user SET image=? WHERE user_id=?", [file.path.substring(7), req.params.id])
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

// preview page

router.get("/course/:id/:userid", async function (req, res, next) {
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  try {
    const [rows, fields] = await conn.query(
      "SELECT * FROM course join teacher using(teacher_id) join preview using(course_id) join preview_preview_video using(preview_id) WHERE course_id=?",
      [req.params.id]
    )
    const [rows1, fields1] = await conn.query("SELECT * FROM user  WHERE user_id=?", [req.params.userid])

    return res.render("preview", { data: JSON.stringify(rows), users: JSON.stringify(rows1) })
  } catch (err) {
    console.log(err)
    await conn.rollback()
  } finally {
    console.log("finally")
    await conn.release()
  }
})

// preview not-sign-in
router.get("/allcourse/course/:id", async function (req, res, next) {
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  try {
    const [rows, fields] = await conn.query(
      "SELECT * FROM course join teacher using(teacher_id) join preview using(course_id) join preview_preview_video using(preview_id)  WHERE course_id=?",
      [req.params.id]
    )

    return res.render("previewnotsignin", { data: JSON.stringify(rows) })
  } catch (err) {
    console.log(err)
    await conn.rollback()
  } finally {
    console.log("finally")
    await conn.release()
  }
})
// my course
router.get("/allcourse/:id/mycourse", async function (req, res, next) {
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  try {
    const [rows, fields] = await conn.query("SELECT * FROM user WHERE user_id=? ", [req.params.id])
    const [rows1, fields1] = await conn.query(
      "SELECT * FROM my_course join course using(course_id) join `order` using(order_id) join user using(user_id) join course_image using(course_id) WHERE user_id=? AND order_status=?",
      [req.params.id, "complete"]
    )
    return res.render("own-course", { data: JSON.stringify(rows), users: JSON.stringify(rows1) })
  } catch (err) {
    console.log(err)
    await conn.rollback()
  } finally {
    console.log("finally")
    await conn.release()
  }
})

// info-course
router.get("/course/:id/:userid/learn", async function (req, res, next) {
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  try {
    const [rows, fields] = await conn.query(
      "SELECT * FROM course join teacher using(teacher_id) join preview using(course_id) join preview_preview_video using(preview_id) WHERE course_id=?",
      [req.params.id]
    )
    const [rows1, fields1] = await conn.query("SELECT * FROM user  WHERE user_id=?", [req.params.userid])

    return res.render("info-course", { data: JSON.stringify(rows), users: JSON.stringify(rows1) })
  } catch (err) {
    console.log(err)
    await conn.rollback()
  } finally {
    console.log("finally")
    await conn.release()
  }
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
