const express = require("express");
const router = express.Router();
var oracledb = require("oracledb");
var oraLogin = oracledb.connectionClass;

router.post("/", function(req, res) {
  if (req.body.username == "sys") {
    oracledb.getConnection(
      {
        user: req.body.username,
        password: req.body.password,
        connectString: "192.168.56.101/dmtdss",
        privilege: oracledb.SYSDBA
      },
      function(err, connection) {
        if (err) {
          console.error(err.message);
          res.json({
            message_error_sys: err.message
          });
          return;
        } else {
          oraLogin = connection;
          res.json({
            message_success_sys: "Success"
          });
        }
      }
    );
  } else {
    oracledb.getConnection(
      {
        user: req.body.username,
        password: req.body.password,
        connectString: "192.168.56.101/dmtdss"
      },
      function(err, connection) {
        if (err) {
          console.error(err.message);
          res.json({
            message_error_normal: err.message
          });
          return;
        } else {
          oraLogin = connection;
          res.json({
            message_success_normal: "Success"
          });
        }
      }
    );
  }
});

router.get("/", function(req, res) {
  oraLogin.execute("SELECT * FROM EMPLOYEES", function(err, result) {
    if (err) {
      console.error(err.message);
      doRelease(oraLogin);
      return;
    }
    //console.log(result.metaData);
    console.log(result.rows);
    res.send(result.rows);
    doRelease(oraLogin);
  });
});

router.get("/abc", function(req, res) {
  oracledb.getConnection(
    {
      user: "hr",
      password: "hr",
      connectString: "192.168.56.101/dmtdss"
    },
    function(err, connection) {
      if (err) {
        console.error(err.message);
        res.json({
          message: err.message
        });
        return;
      }
      connection.execute("SELECT first_name FROM EMPLOYEES", function(
        err,
        result
      ) {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        //console.log(result.metaData);
        console.log(result.rows);
        res.send(result.rows);
        doRelease(connection);
      });
    }
  );
});

function doRelease(connection) {
  connection.release(function(err) {
    if (err) {
      console.error(err.message);
    }
  });
}

module.exports = router;
