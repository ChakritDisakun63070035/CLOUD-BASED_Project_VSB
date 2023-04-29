const express = require("express");
const pool = require("../config");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");
const Joi = require("joi");
router = express.Router();

const requiredLogin = async function requiredLogin(req, res, next) {
  if (!req.session.user && !req.session.role) {
    console.log("You aren't logged-in! Please sign-in first.");
    req.flash("message", "You aren't signed-in! Please sign-in first.");
    return res.redirect("/sign-in");
  } else {
    next();
  }
};

const alreadyLoggedin = async function (req, res, next) {
  if (req.session.user && req.session.role) {
    console.log("You already logged-in🤗");
    req.flash("message", "You already logged-in.");
    return res.redirect("/allcourse/" + req.session.user);
  } else if (req.session.user) {
    console.log("You already logged-in🤗");
    req.flash("message", "You already logged-in.");
    return res.redirect("/admin/" + req.session.user + "/checkpayment");
  } else {
    next();
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./static/uploads");
  },
  filename: function (req, file, callback) {
    const ext = file.mimetype.split("/")[1];
    callback(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage: storage });

router.get("/", async function (req, res, next) {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM course");
    return res.render("index", { courses: JSON.stringify(rows) });
  } catch (err) {
    return next(err);
  }
});

router.get("/home/:id", requiredLogin, async function (req, res, next) {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM course");
    const [users] = await pool.query("SELECT * FROM user WHERE user_id=?", [
      req.params.id,
    ]);
    return res.render("user/index", {
      courses: JSON.stringify(rows),
      users: JSON.stringify(users),
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/allcourse/:id", requiredLogin, async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const [rows, fields] = await conn.query("SELECT * FROM `course`");
    const [rows1, fields1] = await conn.query(
      "SELECT * FROM `user` WHERE user_id=?",
      [req.params.id]
    );
    return res.render("allcourse", {
      courses: JSON.stringify(rows),
      users: JSON.stringify(rows1),
      message: req.flash("message"),
    });
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    await conn.release();
  }
});

router.get("/allcourse/", async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const [rows, fields] = await conn.query("SELECT * FROM course");
    res.render("allcoursenotsignin", { courses: JSON.stringify(rows) });
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    await conn.release();
  }
});

// my cart --> กดไอคอนตะกร้า
router.get("/mycart/:id/", requiredLogin, async function (req, res, next) {
  try {
    const [rows1, fields1] = await pool.query(
      "SELECT * FROM `order` WHERE user_id=? AND order_status=?",
      [req.params.id, "pending"]
    );
    const [rows4, fields4] = await pool.query(
      "SELECT * FROM `order` join my_course using(order_id) WHERE user_id=? AND order_status=?",
      [req.params.id, "pending"]
    );
    if (rows1.length > 0) {
      let order_id = rows1[0].order_id;
      const [rows2, fields2] = await pool.query(
        "SELECT * FROM `order_item` JOIN `course` USING(course_id) WHERE order_id=?",
        [order_id]
      );
      const [rows3, fields3] = await pool.query(
        "SELECT * FROM `user` WHERE user_id=?",
        [req.params.id]
      );
      return res.render("user/cart", {
        items: JSON.stringify(rows2),
        users: JSON.stringify(rows3),
        carts: JSON.stringify(rows1),
        course: JSON.stringify(rows4),
      });
    } else {
      const [rows3, fields3] = await pool.query(
        "SELECT * FROM `user` WHERE user_id=?",
        [req.params.id]
      );
      res.render("user/cart-no", {
        carts: JSON.stringify(rows1),
        users: JSON.stringify(rows3),
        course: JSON.stringify(rows4),
      });
    }
  } catch (err) {
    return next(err);
  }
});

// create cart buy now
router.get(
  "/course/:course_id/create/cart/:user_id/:price/buynow",
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    const admin = Math.floor(Math.random() * (7 - 1)) + 1;
    try {
      const [order, fields1] = await conn.query(
        "SELECT * FROM `order` WHERE user_id=? AND order_status=?",
        [req.params.user_id, "pending"]
      );
      if (order.length > 0) {
        let order_status = order[0].order_status;
        let order_id = order[0].order_id;
        const [additem1, fields1] = await conn.query(
          "INSERT INTO order_item (item_price, course_id, order_id) VALUES(?, ?, ?)",
          [req.params.price, req.params.course_id, order_id]
        );
        const [additem2, fields2] = await conn.query(
          "INSERT INTO my_course (course_id, order_id) VALUES(?, ?)",
          [req.params.course_id, order_id]
        );
        const [itemprice1, fields4] = await conn.query(
          "SELECT SUM(item_price) AS total FROM `order_item` WHERE order_id=?",
          [order_id]
        );
        let total1 = itemprice1[0].total;
        const [orderprice1, fields5] = await conn.query(
          "UPDATE `order` SET price_total=? WHERE order_id=?",
          [total1, order_id]
        );
      } else {
        const [createcart, fields2] = await conn.query(
          "INSERT INTO `order` (order_date, user_id, admin_id) VALUES(CURDATE(), ?, ?)",
          [req.params.user_id, admin]
        );
        const [additem2, fields6] = await conn.query(
          "INSERT INTO `order_item` (item_price, course_id, order_id) VALUES(?, ?, ?)",
          [req.params.price, req.params.course_id, createcart.insertId]
        );
        const [additem3, fields3] = await conn.query(
          "INSERT INTO my_course (course_id, order_id) VALUES(?, ?)",
          [req.params.course_id, createcart.insertId]
        );
        const [itemprice2, fields7] = await conn.query(
          "SELECT SUM(item_price) AS total FROM `order_item` WHERE order_id=?",
          [createcart.insertId]
        );
        let total2 = itemprice2[0].total;

        const [orderprice2, fields8] = await conn.query(
          "UPDATE `order` SET price_total=? WHERE order_id=?",
          [total2, createcart.insertId]
        );
      }
      await conn.commit();
      res.redirect("/mycart/" + req.params.user_id);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  }
);

//ปุ่ม add to cart
router.get(
  "/course/:course_id/create/cart/:user_id/:price",
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    const admin = Math.floor(Math.random() * (7 - 1)) + 1;
    try {
      const [order, fields1] = await conn.query(
        "SELECT * FROM `order` WHERE user_id=? AND order_status=?",
        [req.params.user_id, "pending"]
      );
      if (order.length > 0) {
        let order_status = order[0].order_status;
        let order_id = order[0].order_id;
        const [additem1, fields1] = await conn.query(
          "INSERT INTO order_item (item_price, course_id, order_id) VALUES(?, ?, ?)",
          [req.params.price, req.params.course_id, order_id]
        );
        const [additem2, fields2] = await conn.query(
          "INSERT INTO my_course (course_id, order_id) VALUES(?, ?)",
          [req.params.course_id, order_id]
        );
        const [itemprice1, fields4] = await conn.query(
          "SELECT SUM(item_price) AS total FROM `order_item` WHERE order_id=?",
          [order_id]
        );
        let total1 = itemprice1[0].total;
        const [orderprice1, fields5] = await conn.query(
          "UPDATE `order` SET price_total=? WHERE order_id=?",
          [total1, order_id]
        );
      } else {
        const [createcart, fields2] = await conn.query(
          "INSERT INTO `order` (order_date, user_id, admin_id) VALUES(CURDATE(), ?, ?)",
          [req.params.user_id, admin]
        );
        const [additem2, fields6] = await conn.query(
          "INSERT INTO `order_item` (item_price, course_id, order_id) VALUES(?, ?, ?)",
          [req.params.price, req.params.course_id, createcart.insertId]
        );
        const [additem3, fields3] = await conn.query(
          "INSERT INTO my_course (course_id, order_id) VALUES(?, ?)",
          [req.params.course_id, createcart.insertId]
        );
        const [itemprice2, fields7] = await conn.query(
          "SELECT SUM(item_price) AS total FROM `order_item` WHERE order_id=?",
          [createcart.insertId]
        );
        let total2 = itemprice2[0].total;

        const [orderprice2, fields8] = await conn.query(
          "UPDATE `order` SET price_total=? WHERE order_id=?",
          [total2, createcart.insertId]
        );
      }
      await conn.commit();
      res.redirect(
        "/course/" + req.params.course_id + "/" + req.params.user_id
      );
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  }
);

// del items
router.get(
  "/mycart/:id/:item_no/:order_id",
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      const [rows1, fields1] = await conn.query(
        "DELETE FROM `order_item` WHERE item_no=?",
        [req.params.item_no]
      );
      const [rows2, fields2] = await conn.query(
        "DELETE FROM `my_course` WHERE my_id=?",
        [req.params.item_no]
      );
      const [itemprice, fields4] = await conn.query(
        "SELECT SUM(item_price) AS total FROM `order_item` WHERE order_id=?",
        [req.params.order_id]
      );
      let total = itemprice[0].total;
      const [orderprice, fields5] = await conn.query(
        "UPDATE `order` SET price_total=? WHERE order_id=?",
        [total, req.params.order_id]
      );
      await conn.commit();
      res.redirect("/mycart/" + req.params.id);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  }
);

// payment
router.get(
  "/payment/:id/:order_id",
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      const [rows1, fields1] = await conn.query(
        "SELECT * FROM `order` WHERE order_id=?",
        [req.params.order_id]
      );
      const [rows2, fields2] = await conn.query(
        "SELECT * FROM `user` WHERE user_id=?",
        [req.params.id]
      );
      await conn.commit();
      res.render("user/payment", {
        carts: JSON.stringify(rows1),
        users: JSON.stringify(rows2),
      });
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  }
);

router.post(
  "/payment/:id/:order_id",
  upload.single("slip"),
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    const account = req.body.account;

    const file = req.file;
    const img = file.path.replace("static\\uploads\\", "/uploads/");
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }

    try {
      const [rows1, fields1] = await conn.query(
        "INSERT INTO `payment` (payment_slip, payment_account, order_id) VALUES(?, ?, ?)",
        [img, account, req.params.order_id]
      );
      console.log(rows1.insertId);
      const [rows2, fields2] = await conn.query(
        "SELECT * FROM payment JOIN `order_item` USING(order_id) WHERE payment_id=?",
        [rows1.insertId]
      );

      let order_id_payment = rows2[0].order_id;
      let order_id_order = req.params.order_id;

      if (order_id_payment == order_id_order) {
        const [rows3, fields3] = await conn.query(
          "UPDATE `order` SET order_status=? WHERE order_id=?",
          ["complete", order_id_payment]
        );
        const [rows1, fields1] = await conn.query(
          "DELETE FROM `order_item` WHERE order_id=?",
          [order_id_payment]
        );
      }
      await conn.commit();
      // res.render("own-course", { data: JSON.stringify(rows4), users: JSON.stringify(rows5) })
      res.redirect("/allcourse/" + req.params.id + "/mycourse");
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  }
);

router.get("/sign-up", alreadyLoggedin, async function (req, res, next) {
  res.render("user/sign-up", { message: req.flash("message") });
});

const passwordValidator = (value, helper) => {
  if (value.length < 8) {
    //เช็คว่าค่าที่รับเข้ามามีขนาดน้อยกว่า8
    throw new Joi.ValidationError("Password must me at least 8 characters");
  }
  if (
    !(value.match(/[a-z]/) || (value.match(/[A-Z]/) && value.match(/[0-9]/)))
  ) {
    let error = new Joi.ValidationError("Password must be harder");
    error.details = "Invalid Password";
    throw error;
  }
  return value;
};

const emailValidator = async (value, helpers) => {
  const [rows, fields] = await pool.query(
    "select email from user WHERE email=?",
    [value]
  );

  if (rows.length > 0) {
    // ถ้าหาเจอในฐานข้อมูล หรือ พบเจอชื่อซ้ำ
    throw new Joi.ValidationError("Duplicate_ERROR", {
      message: "This email is already taken",
    });
  }
  return value; //ถ้าvalidateผ่าน จะreturnค่ากลับไปเพื่อไปเช็คค่า
};

const courseValidator = async (value, helpers) => {
  const [rows, fields] = await pool.query(
    "select course_name from course WHERE course_name=?",
    [value]
  );

  if (rows.length > 0) {
    // ถ้าหาเจอในฐานข้อมูล หรือ พบเจอชื่อซ้ำ
    let invalid = new Joi.ValidationError("Duplicate_ERROR");
    invalid.details = "Duplicate Course Name";
    throw invalid;
  }
  return value; //ถ้าvalidateผ่าน จะreturnค่ากลับไปเพื่อไปเช็คค่า
};

schema = Joi.object({
  fname: Joi.string().required().min(3),
  lname: Joi.string().required().min(3),
  email: Joi.string().email().required().max(99).external(emailValidator),
  password: Joi.string().required().custom(passwordValidator),
  dob: Joi.string().required(),
  gender: Joi.string().required(),
  role: Joi.string().required(),
});
schema2 = Joi.object({
  course_name: Joi.string().required().min(3).external(courseValidator),
  course_info: Joi.string().required(),
  course_time: Joi.string().required(),
  course_price: Joi.string().required(),
  course_des: Joi.string().required(),
  preview_video: Joi.string().required(),
  preview_learn1: Joi.string().required(),
  preview_learn2: Joi.string().required(),
  preview_learn3: Joi.string().required(),
  preview_learn4: Joi.string().required(),
});

router.post("/sign-up", alreadyLoggedin, async function (req, res, next) {
  try {
    await schema.validateAsync(req.body, { abortEarly: false }); //จะvalidateทุกfieldsให้เสร็จก่อน ถ้าเจอปัญหาจะresponseกลับไปเลยว่ามันมีปัญหา
  } catch (error) {
    console.log(error);
    req.flash("message", error.message);
    return res.redirect("/sign-up");
  }

  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 5);
  const dob = req.body.dob;
  const gender = req.body.gender;
  const role = req.body.role;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [rows, fields] = await conn.query(
      "INSERT INTO `user` (user_fname, user_lname, email, password, dateofbirth, gender, role) VALUES(?, ?, ?, ?, ?, ?, ?)",
      [fname, lname, email, password, dob, gender, role]
    );

    if (role === "teacher") {
      const [rows2, fields2] = await conn.query(
        "INSERT INTO `teacher` (teacher_fname, teacher_lname) VALUES(?, ?)",
        [fname, lname]
      );
    }

    await conn.commit();
    res.redirect("/sign-in");
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    await conn.release();
  }
});

router.get("/sign-in", alreadyLoggedin, async function (req, res, next) {
  res.render("user/sign-in", { message: req.flash("message") });
});

router.post("/sign-in", alreadyLoggedin, async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [rows, fields] = await conn.query(
      "SELECT * FROM user WHERE email=?",
      [email]
    );
    //admin
    const [rows3, fields3] = await conn.query(
      "SELECT * FROM admin WHERE email=?",
      [email]
    );

    const user = rows[0];
    const admin = rows3[0];

    // ADMIN
    if (rows3.length > 0) {
      if (!admin) {
        req.flash("message", "This user does not exist");
        return res.redirect("/sign-in");
      }
      if (!(await bcrypt.compare(password, admin.admin_pass))) {
        req.flash("message", "Incorrect Password");
        return res.redirect("/sign-in");
      }
      const date = new Date().toString().substring(0, 25);
      req.session.user = admin.admin_id;
      console.log(date + ": " + "Logged-in! Welcome Admin😀");
      return res.redirect("/admin/" + admin.admin_id + "/checkpayment");
    }

    // USER --> student & teacher
    if (!user) {
      req.flash("message", "This user does not exist");
      return res.redirect("/sign-in");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      req.flash("message", "Incorrect Password");
      return res.redirect("/sign-in");
    }

    const [rows1, fields1] = await conn.query(
      "SELECT * FROM tokens WHERE user_id=?",
      [user.user_id]
    );

    let token = rows1[0]?.token;
    if (!token) {
      // Generate and save token into database
      token = generateToken();
      await conn.query("INSERT INTO tokens(user_id, token) VALUES (?, ?)", [
        user.user_id,
        token,
      ]);
    }

    const [rows2, fields2] = await conn.query(
      "UPDATE `user` SET status_user=? WHERE email=?",
      ["on", email]
    );

    const date = new Date().toString().substring(0, 25);
    if (user.role === "student") {
      req.session.user = user.user_id;
      req.session.role = user.role;
      console.log(date + ": " + "Logged-in! Welcome Learner😀");
      return res.redirect("/allcourse/" + user.user_id);
    } else if (user.role === "teacher") {
      req.session.user = user.user_id;
      console.log(date + ": " + "Logged-in! Welcome Teacher😀");
      return res.redirect("/teacher/" + user.user_id);
    }
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    await conn.release();
  }
});

router.get("/sign-out/:id", requiredLogin, async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const [rows2, fields2] = await conn.query(
      "UPDATE `user` SET status_user=? WHERE user.user_id=?",
      ["off", req.params.id]
    );
    const date = new Date().toString().substring(0, 25);
    req.session.destroy();
    console.log(date + ": " + "Logged-out! Bye-Bye😀");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    await conn.release();
  }
});

// admin
router.get("/sign-out/", requiredLogin, async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const date = new Date().toString().substring(0, 25);
    req.session.destroy();
    console.log(date + ": " + "Logged-out! Bye-Bye😀");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    await conn.release();
  }
});

router.get("/reset_password", async function (req, res, next) {
  res.render("user/reset_password");
});

router.post("/reset_password", async function (req, res, next) {
  res.redirect("/");
});

router.get("/profile/:id", requiredLogin, async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    // const [rows, fields] = await conn.query("SELECT * FROM `user` WHERE user_id=?", [req.params.id])
    const [rows, fields] = await conn.query(
      "SELECT *, dateofbirth, DATE_FORMAT(dateofbirth, GET_FORMAT(DATE, 'ISO')) AS date FROM `user` WHERE user_id=?",
      [req.params.id]
    );
    res.render("user/user_profile", {
      users: JSON.stringify(rows),
    });
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    await conn.release();
  }
});

router.post(
  "/profile/:id",
  upload.single("image"),
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, 5);
    const dob = req.body.dob;
    const gender = req.body.gender;

    const file = req.file;
    const img = file.path.replace("static\\uploads\\", "/uploads/");

    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    if (file) {
      await conn.query("UPDATE user SET image=? WHERE user_id=?", [
        img,
        req.params.id,
      ]);
    }
    try {
      const [rows, fields] = await conn.query(
        "UPDATE `user` SET user_fname=?, user_lname=?, email=?, password=?, dateofbirth=?, gender=? WHERE user_id=?",
        [fname, lname, email, password, dob, gender, req.params.id]
      );

      const [rows1, fields1] = await conn.query(
        "SELECT * FROM `user` WHERE user_id=?",
        [req.params.id]
      );
      let role = rows1[0].role;

      if (role == "teacher") {
        const [rows3, fields3] = await conn.query(
          "SELECT * FROM `user` JOIN `teacher` ON(user.user_fname = teacher.teacher_fname) WHERE user_id=?",
          [req.params.id]
        );
        let teacher_id = rows3[0].teacher_id;
        const [rows2, fields2] = await conn.query(
          "UPDATE `teacher` SET teacher_fname=?, teacher_lname=?, teacher_image=? WHERE teacher_id=?",
          [fname, lname, img, teacher_id]
        );
      }

      let user_id = req.params.id;
      res.redirect("/profile/" + user_id);
    } catch (err) {
      console.log(err);
      await conn.rollback();
    } finally {
      await conn.release();
    }
  }
);

// preview page
router.get(
  "/course/:id/:userid",
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      const [rows, fields] = await conn.query(
        "SELECT * FROM course join teacher using(teacher_id) join preview using(course_id) join preview_preview_video using(preview_id) WHERE course_id=?",
        [req.params.id]
      );
      const [rows1, fields1] = await conn.query(
        "SELECT * FROM user  WHERE user_id=?",
        [req.params.userid]
      );

      const [rows2, fields2] = await conn.query(
        "SELECT *, DATE_FORMAT(comment_date, GET_FORMAT(DATETIME, 'ISO')) AS comm_date  FROM comments JOIN user ON comment_by_id = user_id WHERE comment_course_id=?;",
        [req.params.id]
      );

      const [rows3, fields3] = await conn.query(
        "SELECT * FROM `user` join `order` using (user_id) join my_course using(order_id) join payment using(order_id) WHERE user_id=? and status_payment=? and course_id=?",
        [req.params.userid, 1, req.params.id]
      );
      const [rows6, fields6] = await conn.query(
        "SELECT * FROM `order` join `my_course` using(order_id) WHERE user_id =? and order_status ='pending' and course_id =?",
        [req.params.userid, req.params.id]
      );

      const [path_video] = await conn.query(
        "SELECT * FROM my_video join course using(course_id)  WHERE course_id=?; ",
        [req.params.id]
      );
      const [student] = await conn.query(
        "SELECT * FROM `user` join `order` using (user_id) join my_course using(order_id) join payment using(order_id) WHERE status_payment=? and course_id=?",
        [1, req.params.id]
      );
      if (rows3.length > 0) {
        return res.redirect(
          "/course/" + req.params.id + "/" + req.params.userid + "/learn"
        );
      } else {
        return res.render("preview", {
          data: JSON.stringify(rows),
          users: JSON.stringify(rows1),
          comment: JSON.stringify(rows2),
          check: JSON.stringify(rows3),
          cart: JSON.stringify(rows6),
          video: JSON.stringify(path_video),
          student: JSON.stringify(student),
        });
      }
      // }
    } catch (err) {
      console.log(err);
      await conn.rollback();
    } finally {
      await conn.release();
    }
  }
);

// preview not-sign-in
router.get("/allcourse/course/:id", async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const [rows, fields] = await conn.query(
      "SELECT * FROM course join teacher using(teacher_id) join preview using(course_id) join preview_preview_video using(preview_id)  WHERE course_id=?",
      [req.params.id]
    );
    const [rows2, fields2] = await conn.query(
      "SELECT *, DATE_FORMAT(comment_date, GET_FORMAT(DATETIME, 'ISO')) AS comm_date FROM comments JOIN user ON comment_by_id = user_id WHERE comment_course_id=?;",
      [req.params.id]
    );

    return res.render("previewnotsignin", {
      data: JSON.stringify(rows),
      comment: JSON.stringify(rows2),
    });
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    await conn.release();
  }
});
// my course
router.get(
  "/allcourse/:id/mycourse",
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      const [rows, fields] = await conn.query(
        "SELECT * FROM user WHERE user_id=? ",
        [req.params.id]
      );
      const [rows1, fields1] = await conn.query(
        "SELECT *,c.image as course_img FROM my_course mc join `order` o on (mc.order_id = o.order_id) join course c on(mc.course_id = c.course_id) join user u on (o.user_id = u.user_id) join payment p on (o.order_id = p.order_id) WHERE u.user_id=? AND order_status=? AND status_payment=?",
        [req.params.id, "complete", 1]
      );
      return res.render("own-course", {
        data: JSON.stringify(rows),
        users: JSON.stringify(rows1),
      });
    } catch (err) {
      console.log(err);
      await conn.rollback();
    } finally {
      await conn.release();
    }
  }
);

// info-course
router.get(
  "/course/:id/:userid/learn",
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      const [rows, fields] = await conn.query(
        "SELECT * FROM course join teacher using(teacher_id) join preview using(course_id) join preview_preview_video using(preview_id) WHERE course_id=?",
        [req.params.id]
      );
      const [rows1, fields1] = await conn.query(
        "SELECT * FROM user  WHERE user_id=?",
        [req.params.userid]
      );
      const [rows2, fields2] = await conn.query(
        "SELECT * FROM my_video join course using(course_id)  WHERE course_id=?; ",
        [req.params.id]
      ); //path video
      const [rows3, fields3] = await conn.query(
        "SELECT * FROM `user` join `order` using (user_id) join my_course using(order_id) join payment using(order_id) WHERE status_payment=? and course_id=?",
        [1, req.params.id]
      );

      return res.render("info-course", {
        data: JSON.stringify(rows),
        users: JSON.stringify(rows1),
        video: JSON.stringify(rows2),
        student: JSON.stringify(rows3)
      });
    } catch (err) {
      console.log(err);
      await conn.rollback();
    } finally {
      await conn.release();
    }
  }
);

//teacher-after-login
router.get("/teacher/:id", requiredLogin, async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [rows, fields] = await conn.query(
      "SELECT * FROM teacher t join user u ON(t.teacher_fname = u.user_fname) join course using (teacher_id) join preview using (course_id) where user_id= ?",
      [req.params.id]
    );
    const [rows1, fields1] = await conn.query(
      "SELECT * FROM `user` WHERE user_id=?",
      [req.params.id]
    );

    const [rows2, fields2] = await conn.query(
      "SELECT * FROM `order` WHERE user_id=?",
      [req.params.id]
    );

    const [rows3, fields3] = await conn.query("SELECT * FROM `my_video`", [
      req.params.id,
    ]);

    return res.render("teacher", {
      courses: JSON.stringify(rows),
      users: JSON.stringify(rows1),
      message: req.flash("message"),
      video: JSON.stringify(rows3),
    });
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    await conn.release();
  }
});

const cpUpload = upload.fields([
  { name: "course_image", maxCount: 1 },
  { name: "preview_image", maxCount: 1 },
]);
router.post("/teacher/:id", cpUpload, async function (req, res, next) {
  try {
    await schema2.validateAsync(req.body, { abortEarly: false }); //จะvalidateทุกfieldsให้เสร็จก่อน ถ้าเจอปัญหาจะresponseกลับไปเลยว่ามันมีปัญหา
  } catch (invalid) {
    console.log(invalid);
    // alert('Duplicate course name')
    req.flash("message", invalid.message);
    return res.redirect("/teacher/" + req.params.id);
    // return res.status(400).json(error2)
  }

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  const course_name = req.body.course_name;
  const course_info = req.body.course_info;
  const course_time = req.body.course_time;
  const course_price = req.body.course_price;
  const course_des = req.body.course_des;
  const preview_video = req.body.preview_video;
  const preview_learn1 = req.body.preview_learn1;
  const preview_learn2 = req.body.preview_learn2;
  const preview_learn3 = req.body.preview_learn3;
  const preview_learn4 = req.body.preview_learn4;

  const file_course = req.files.course_image[0];
  const file_preview = req.files.preview_image[0];
  const img_course = file_course.path.replace("static\\uploads\\", "/uploads/");
  const img_preview = file_preview.path.replace(
    "static\\uploads\\",
    "/uploads/"
  );

  try {
    const [rows3, fields3] = await conn.query(
      "SELECT * FROM `user` JOIN `teacher` ON(user.user_fname = teacher.teacher_fname) WHERE user_id=?",
      [req.params.id]
    );
    let teacher_id = rows3[0].teacher_id;

    const [rows, fields] = await conn.query(
      "INSERT INTO `course` (course_name, course_info, time, course_price, teacher_id, course_des, image) VALUES(?, ?, ?, ?, ?, ?, ?)",
      [
        course_name,
        course_info,
        course_time,
        course_price,
        teacher_id,
        course_des,
        img_course,
      ]
    );

    let course_id = rows.insertId;

    const [rows1, fields1] = await conn.query(
      "INSERT INTO `preview` (preview_info, course_id, preview_img, learn1, learn2, learn3, learn4) VALUES(?, ?, ?, ?, ?, ?, ?)",
      [
        course_info,
        course_id,
        img_preview,
        preview_learn1,
        preview_learn2,
        preview_learn3,
        preview_learn4,
      ]
    );

    let preview_id = rows1.insertId;

    const [rows2, fields2] = await conn.query(
      "INSERT INTO `preview_preview_video` (preview_video, preview_id) VALUES(?, ?)",
      [preview_video, preview_id]
    );

    res.redirect("/teacher/" + req.params.id);
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    await conn.release();
  }
});

// const path = req.body.path
// const course_id2 = req.body.course_id

// const [rows5, fields5] = await conn.query("INSERT INTO `my_video` (`course_id`, `path`) VALUES ( ?, ?)", [
//   course_id2,
//   path,
// ])
// const [rows6, fields6] = await conn.query("SELECT * FROM `my_video`")
// await conn.commit()
// return res.json(rows6[0])

// edit-course
router.post(
  "/teacher/:id/:courseId/:previewId",
  cpUpload,
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    const course_name = req.body.course_name;
    const course_info = req.body.course_info;
    const course_time = req.body.course_time;
    const course_price = req.body.course_price;
    const course_des = req.body.course_des;
    const preview_video = req.body.preview_video;
    const preview_learn1 = req.body.preview_learn1;
    const preview_learn2 = req.body.preview_learn2;
    const preview_learn3 = req.body.preview_learn3;
    const preview_learn4 = req.body.preview_learn4;

    const file_course = req.files.course_image[0];
    const file_preview = req.files.preview_image[0];
    const img_course = file_course.path.replace(
      "static\\uploads\\",
      "/uploads/"
    );
    const img_preview = file_preview.path.replace(
      "static\\uploads\\",
      "/uploads/"
    );
    console.log(file_preview);
    try {
      const [rows3, fields3] = await conn.query(
        "SELECT * FROM `user` JOIN `teacher` ON(user.user_fname = teacher.teacher_fname) WHERE user_id=?",
        [req.params.id]
      );
      let teacher_id = rows3[0].teacher_id;

      const [rows2, fields2] = await conn.query(
        "UPDATE `preview_preview_video` SET preview_video=?, preview_id=? WHERE preview_id=?",
        [preview_video, req.params.previewId, req.params.previewId]
      );

      const [rows1, fields1] = await conn.query(
        "UPDATE `preview` SET preview_info=?, course_id=?, preview_img=?, learn1=?, learn2=?, learn3=?, learn4=? WHERE preview_id=?",
        [
          course_info,
          req.params.courseId,
          img_preview,
          preview_learn1,
          preview_learn2,
          preview_learn3,
          preview_learn4,
          req.params.previewId,
        ]
      );

      const [rows, fields] = await conn.query(
        "UPDATE `course` SET course_name=?, course_info=?, time=?, course_price=?, teacher_id=?, course_des=?, image=? WHERE course_id=?",
        [
          course_name,
          course_info,
          course_time,
          course_price,
          teacher_id,
          course_des,
          img_course,
          req.params.courseId,
        ]
      );

      res.redirect("/teacher/" + req.params.id);
    } catch (err) {
      console.log(err);
      await conn.rollback();
    } finally {
      await conn.release();
    }
  }
);

// del course by teachcer
router.get(
  "/teacher/:id/delcourse/:courseId/:previewId",
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      const [preview_preview_video] = await conn.query(
        "DELETE FROM `preview_preview_video` WHERE preview_id=?",
        [req.params.previewId]
      );
      const [preview] = await conn.query(
        "DELETE FROM `preview` WHERE preview_id=?",
        [req.params.previewId]
      );
      const [my_course] = await conn.query(
        "DELETE FROM `my_course` WHERE course_id=?",
        [req.params.courseId]
      );
      const [course] = await conn.query(
        "DELETE FROM `course` WHERE course_id=?",
        [req.params.courseId]
      );

      return res.redirect("/teacher/" + req.params.id);
    } catch (err) {
      console.log(err);
      await conn.rollback();
    } finally {
      console.log("Delete course Id: " + req.params.courseId + " successful");
      await conn.release();
    }
  }
);

//admin-after-login
router.get("/admin/:id", async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [rows, fields] = await conn.query(
      "SELECT * FROM payment join `order` using (order_id) join admin using (admin_id) where admin_id=? and status_payment =?",
      [req.params.id, 0]
    );
    const [rows1, fields1] = await conn.query(
      "SELECT * FROM `admin` WHERE admin_id=?",
      [req.params.id]
    );
    const [rows2, fields2] = await conn.query(
      "SELECT * FROM `admin` WHERE admin_id != ?",
      [req.params.id]
    );

    return res.render("admin_check", {
      data: JSON.stringify(rows),
      users: JSON.stringify(rows1),
      admin: JSON.stringify(rows2),
      message: req.flash("message"),
    });
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    await conn.release();
  }
});

//admin-checkpayment
router.get("/admin/:id/checkpayment", async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [rows, fields] = await conn.query(
      "SELECT * FROM payment join `order` using (order_id) join user using(user_id) join admin using (admin_id)  where admin_id=? and status_payment =?",
      [req.params.id, 0]
    );
    const [rows1, fields1] = await conn.query(
      "SELECT * FROM `admin` WHERE admin_id=?",
      [req.params.id]
    );

    // const [rows2, fields2] = await conn.query("SELECT * FROM `admin` WHERE admin_id != ?", [req.params.id])
    // const [rows2, fields2] = await conn.query("SELECT * FROM `order` WHERE user_id=?", [req.params.id])
    return res.render("admin_check", {
      data: JSON.stringify(rows),
      users: JSON.stringify(rows1),
      message: req.flash("message"),
    });
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    await conn.release();
  }
});

//admin slip
router.get(
  "/admin/:id/:payment_id/slip/:order_id",
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    const slip = req.body.slip;
    try {
      const [rows, fields] = await conn.query(
        "SELECT *, DATE_FORMAT(order_date, GET_FORMAT(DATE, 'ISO')) AS order_date FROM payment join `order` using (order_id) join admin using (admin_id) join user using(user_id) join my_course using(order_id) join course using(course_id) where admin_id=? and status_payment =? and payment_id = ? and order_id=?",
        [req.params.id, 0, req.params.payment_id, req.params.order_id]
      );
      const [rows1, fields1] = await conn.query(
        "SELECT * FROM `admin` WHERE admin_id=?",
        [req.params.id]
      );
      // const [rows2, fields2] = await conn.query("SELECT * FROM `admin` WHERE admin_id != ?", [req.params.id])
      // const [rows2, fields2] = await conn.query("SELECT * FROM `order` WHERE user_id=?", [req.params.id])
      return res.render("admin_slip", {
        data: JSON.stringify(rows),
        users: JSON.stringify(rows1),
      });
    } catch (err) {
      console.log(err);
      await conn.rollback();
    } finally {
      console.log("ok");

      await conn.release();
    }
  }
);

//admin slip
router.post(
  "/admin/:id/:payment_id/slip/:order_id",
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    const slip = req.body.slip;
    const incorrect = req.body.wrong_slip;
    // console.log(slip)
    try {
      if (slip) {
        // const [rows1, fields1] = await conn.query("INSERT INTO `payment` (status_payment) VALUES(?)", ['1'])
        const [rows, fields] = await conn.query(
          "UPDATE payment join `order` using(order_id) SET status_payment=?, order_status=?  where payment_id = ? and order_id=?",
          [slip, "complete", req.params.payment_id, req.params.order_id]
        );
        // const [rows, fields] = await conn.query("UPDATE `order`  SET order_status=?  where payment_id = ? and ", [slip, req.params.payment_id])
        // const [rows, fields] = await conn.query("UPDATE `order`  SET order_status=?  where payment_id = ?", [slip,req.params.payment_id])
        console.log(rows);
      } else if (incorrect) {
        console.log("hoho");
        const [rows1, fields1] = await conn.query(
          "DELETE FROM `my_course` WHERE order_id=?",
          [req.params.order_id]
        );
        const [rows2, fields2] = await conn.query(
          "DELETE FROM `payment` WHERE order_id=?",
          [req.params.order_id]
        );
        const [rows3, fields3] = await conn.query(
          "DELETE FROM `order` WHERE order_id=?",
          [req.params.order_id]
        );
      }
      let admin_id = req.params.id;
      let payment_id = req.params.payment_id;
      res.redirect("/admin/" + admin_id + "/checkpayment");
    } catch (err) {
      console.log(err);
      await conn.rollback();
    } finally {
      console.log("slip");
      await conn.release();
    }
  }
);

//admin-confirm to check
router.get("/admin/:id/confirm", async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [rows, fields] = await conn.query(
      "SELECT * FROM payment join `order` using (order_id) join user using(user_id) join admin using (admin_id) where admin_id=? and status_payment =? and order_status=?",
      [req.params.id, 1, "complete"]
    );
    const [rows1, fields1] = await conn.query(
      "SELECT * FROM `admin` WHERE admin_id=?",
      [req.params.id]
    );
    // const [rows2, fields2] = await conn.query("SELECT * FROM `admin` WHERE admin_id != ?", [req.params.id])
    // const [rows2, fields2] = await conn.query("SELECT * FROM `order` WHERE user_id=?", [req.params.id])
    return res.render("admin_confirm", {
      data: JSON.stringify(rows),
      users: JSON.stringify(rows1),
    });
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    await conn.release();
  }
});

//admin-team
router.get("/admin/:id/myteam", async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [rows, fields] = await conn.query(
      "SELECT * FROM payment join `order` using (order_id) join admin using (admin_id) where admin_id=? and status_payment =?",
      [req.params.id, 0]
    );
    const [rows1, fields1] = await conn.query(
      "SELECT * FROM `admin` WHERE admin_id=?",
      [req.params.id]
    );
    const [rows2, fields2] = await conn.query("SELECT * FROM `admin` ");
    // const [rows2, fields2] = await conn.query("SELECT * FROM `order` WHERE user_id=?", [req.params.id])
    return res.render("admin", {
      data: JSON.stringify(rows),
      users: JSON.stringify(rows1),
      admin: JSON.stringify(rows2),
    });
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    await conn.release();
  }
});

//admin profile
router.get("/admin/profile/:id", async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    // const [rows, fields] = await conn.query("SELECT * FROM `user` WHERE user_id=?", [req.params.id])
    const [rows, fields] = await conn.query(
      "SELECT *, birth, DATE_FORMAT(birth, GET_FORMAT(DATE, 'ISO')) AS date FROM `admin` WHERE admin_id=?",
      [req.params.id]
    );
    res.render("admin_profile", {
      users: JSON.stringify(rows),
    });
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    await conn.release();
  }
});

router.post(
  "/admin/profile/:id",
  upload.single("image"),
  async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;
    const birth = req.body.birth;
    const gender = req.body.gender;

    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    if (file) {
      await conn.query("UPDATE admin SET admin_img=? WHERE admin_id=?", [
        file.path.substring(7),
        req.params.id,
      ]);
    }
    try {
      const [rows, fields] = await conn.query(
        "UPDATE `admin` SET admin_fname=?, admin_lname=?, email=?, admin_pass=?, birth=?, admin_gender=? WHERE admin_id=?",
        [fname, lname, email, password, birth, gender, req.params.id]
      );

      let admin_id = req.params.id;
      res.redirect("/admin/profile" + "/" + admin_id);
    } catch (err) {
      console.log(err);
      await conn.rollback();
    } finally {
      await conn.release();
    }
  }
);

// Create new content
router.post("/teacher/:id/addcontent", async function (req, res, next) {
  const path = req.body.path;
  const course_id2 = req.body.course_id;
  const conn = await pool.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    const [rows5, fields5] = await conn.query(
      "INSERT INTO `my_video` (`course_id`, `path`) VALUES ( ?, ?)",
      [course_id2, path]
    );
    const [rows6, fields6] = await conn.query(
      "SELECT * FROM `my_video` WHERE `video_id` = ?",
      [rows5.insertId]
    );
    await conn.commit();
    return res.json(rows6[0]);
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
});

// Create new comment
router.post(
  "/course/:id/:userid",
  requiredLogin,
  async function (req, res, next) {
    const comment = req.body.comment;
    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {
      const [rows1, fields1] = await conn.query(
        "INSERT INTO `comments` (`comment_course_id`, `comment`, `comment_date`, `comment_by_id`) VALUES ( ?, ?, CURRENT_TIMESTAMP, ?)",
        [req.params.id, comment, req.params.userid]
      );
      const [rows2, fields2] = await conn.query(
        "SELECT *, DATE_FORMAT(comment_date, GET_FORMAT(DATETIME, 'ISO')) AS comm_date FROM `comments` JOIN `user` ON comment_by_id = user_id WHERE `id` = ?",
        [rows1.insertId]
      );
      await conn.commit();
      return res.json(rows2[0]);
    } catch (err) {
      await conn.rollback();
      return res.status(500).json(err);
    } finally {
      conn.release();
    }
  }
);

// ADD LIKE 2
router.put(
  "/course/:id/:userid",
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();

    try {
      let [rows, fields] = await conn.query(
        "SELECT `like` FROM `course` WHERE `course_id` = ?",
        [req.params.id]
      );
      let like = rows[0].like + 1;

      await conn.query("UPDATE `course` SET `like` = ? WHERE `course_id` = ?", [
        like,
        req.params.id,
      ]);

      await conn.commit();
      res.json({ like: like });
    } catch (err) {
      await conn.rollback();
      return res.status(500).json(err);
    } finally {
      conn.release();
    }
  }
);

// Delete Content
router.delete(
  "/teacher/:videoID/deletecontent/:index",
  async function (req, res, next) {
    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {
      const [rows, fields] = await conn.query(
        "DELETE FROM `my_video` WHERE `video_id` = ?",
        [req.params.videoID]
      );
      await conn.commit();
      res.json();
    } catch (err) {
      console.log(err);
      await conn.rollback();
      return res.status(500).json(err);
    } finally {
      conn.release();
    }
  }
);

// Edit Content
router.put(
  "/teacher/:videoId/editcontent/:index",
  async function (req, res, next) {
    try {
      const [rows1, fields1] = await pool.query(
        "UPDATE my_video SET path=? WHERE video_id=?",
        [req.body.path, req.params.videoId]
      );
      console.log(rows1);
      res.json({ path: req.body.path });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Delete comment
router.delete(
  "/course/:id/:userid/:commentID",
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {
      const [rows, fields] = await conn.query(
        "DELETE FROM `comments` WHERE `id` = ?",
        [req.params.commentID]
      );
      await conn.commit();
      res.json();
    } catch (err) {
      console.log(err);
      await conn.rollback();
      return res.status(500).json(err);
    } finally {
      conn.release();
    }
  }
);

// ADD LIKE 2
router.put(
  "/course/:id/:userid",
  requiredLogin,
  async function (req, res, next) {
    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();

    try {
      let [rows, fields] = await conn.query(
        "SELECT `like` FROM `course` WHERE `course_id` = ?",
        [req.params.id]
      );
      let like = rows[0].like + 1;

      await conn.query("UPDATE `course` SET `like` = ? WHERE `course_id` = ?", [
        like,
        req.params.id,
      ]);

      await conn.commit();
      res.json({ like: like });
    } catch (err) {
      await conn.rollback();
      return res.status(500).json(err);
    } finally {
      conn.release();
    }
  }
);

// Upload document
router.post(
  "/adddocument/:courseid/:userid",
  upload.single("document"),
  async function (req, res, next) {
    const document = req.file;

    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {
      await conn.query(
        "INSERT INTO `course_document` (`document_name`, `course_id`, `user_id`) VALUES ( ?, ?, ?)",
        [document.path.substring(6), req.params.courseid, req.params.userid]
      );

      conn.commit();
      res.send();
    } catch (err) {
      await conn.rollback();
      return res.status(500).json(err);
    } finally {
      conn.release();
    }
  }
);

//get data document teacher
router.get("/getdocumentteacher/:id", async function (req, res, next) {
  const conn = await pool.getConnection();

  await conn.beginTransaction();
  try {
    let result = await conn.query(
      "SELECT * FROM `course_document` JOIN `user` ON(course_document.user_id = user.user_id) WHERE `course_id` = ? AND `role` = 'teacher'",
      [req.params.id]
    );

    conn.commit();
    return res.status(200).json(result[0]);
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
});

//get data document student
router.get("/getdocumentstudent/:id", async function (req, res, next) {
  const conn = await pool.getConnection();

  await conn.beginTransaction();
  try {
    let result = await conn.query(
      "SELECT * FROM `course_document` JOIN `user` ON(course_document.user_id = user.user_id) WHERE `course_id` = ? AND `role` = 'student'",
      [req.params.id]
    );

    conn.commit();
    return res.status(200).json(result[0]);
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
});

//delete document
router.delete(
  "/deletedocument/:courseid/:documentid",
  async function (req, res, next) {
    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {
      const [result, fields] = await conn.query(
        "DELETE FROM `course_document` WHERE `document_id` = ?",
        [req.params.documentid]
      );
      await conn.commit();
      res.json();
    } catch (err) {
      console.log(err);
      await conn.rollback();
      return res.status(500).json(err);
    } finally {
      conn.release();
    }
  }
);

exports.router = router;
