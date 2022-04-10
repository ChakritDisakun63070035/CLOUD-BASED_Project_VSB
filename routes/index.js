const express = require("express");
const pool = require("../config");

router = express.Router();

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

exports.router = router;
