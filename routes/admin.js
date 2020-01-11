const express = require("express");
const router = express.Router();
var oracledb = require("oracledb");
var oraLogin = "";
var username = "";
var password = "";

router.post("/", function (req, res) {
  if (req.body.username == "sys") {
    oracledb.getConnection({
        user: req.body.username,
        password: req.body.password,
        connectString: "192.168.56.103/dmtdss",
        privilege: oracledb.SYSDBA
      },
      function (err, connection) {
        if (err) {
          console.error(err.message);
          res.json({
            message_error_sys: err.message
          });
          return;
        } else {
          oraLogin = connection;
          username = req.body.username;
          password = req.body.password;
          res.json({
            message_success_sys: "Success"
          });
        }
      }
    );
  } else {
    oracledb.getConnection({
        user: req.body.username,
        password: req.body.password,
        connectString: "192.168.56.103/dmtdss"
      },
      function (err, connection) {
        if (err) {
          console.error(err.message);
          res.json({
            message_error_normal: err.message
          });
          return;
        } else {
          oraLogin = connection;
          username = req.body.username;
          password = req.body.password;
          res.json({
            message_success_normal: "Success"
          });
        }
      }
    );
  }
});

router.get("/username", function (req, res) {
  if (oraLogin) {
    res.json({
      username: username
    });
  }
});

router.get("/getCustomers", function (req, res) {
  if (oraLogin) {
    oraLogin.execute("SELECT * FROM " + username + ".customers", function (
      err,
      result
    ) {
      if (err) {
        console.error(err.message);
        res.json({
          execute_error: err.message
        });
        return;
      }
      res.send(result.rows);
    });
  } else {
    res.json({
      message_connection_error: "Not logged in"
    });
  }
});

router.get("/gettop10Customers", function (req, res) {
  if (oraLogin) {
    oraLogin.execute(
      "SELECT * FROM " + username + ".top_ten_customers_mv",
      function (err, result) {
        if (err) {
          console.error(err.message);
          res.json({
            execute_error: err.message
          });
          return;
        }
        res.send(result.rows);
      }
    );
  } else {
    res.json({
      message_connection_error: "You're not logged in."
    });
  }
});

router.get("/getTopCustomerProdCategory", function (req, res) {
  if (oraLogin) {
    oraLogin.execute(
      "SELECT * FROM " + username + ".top_customer_prod_category_mv",
      function (err, result) {
        if (err) {
          console.error(err.message);
          res.json({
            execute_error: err.message
          });
          return;
        }
        res.send(result.rows);
      }
    );
  } else {
    res.json({
      message_connection_error: "Not logged in"
    });
  }
});

router.get("/getTop3SellingProductsChannels", function (req, res) {
  if (oraLogin) {
    oraLogin.execute(
      "SELECT * FROM " + username + ".top_three_products_channels",
      function (err, result) {
        if (err) {
          console.error(err.message);
          res.json({
            execute_error: err.message
          });
          return;
        }
        res.send(result.rows);
      }
    );
  } else {
    res.json({
      message_connection_error: "You're not logged in."
    });
  }
});

router.get("/userRoles", function (req, res) {
  if (oraLogin) {
    oraLogin.execute(
      "select * from dba_role_privs connect by prior granted_role = grantee start with grantee =upper('" +
      username +
      "') order by 1,2,3",
      function (err, result) {
        if (err) {
          console.error(err.message);
          res.json({
            execute_error: err.message
          });
          return;
        }
        res.send(result.rows);
      }
    );
  } else {
    res.json({
      message_connection_error: "You're not logged in."
    });
  }
});

router.post("/updateProfile", function (req, res) {
  var cur_password = req.body.cur_password;
  if (password != cur_password) {
    res.json({
      message_error: "Current Password is Incorrect"
    });
    return;
  } else {
    var na_password = req.body.n_password;
    //console.log(na_password);
    if (oraLogin) {
      oraLogin.execute(
        "alter user " + username + " identified by " + na_password,
        function (err, result) {
          if (err) {
            console.error(err.message);
            res.json({
              message_error: err.message
            });
            return;
          } else {
            res.json({
              message_success: "Password Updated Successfully"
            });
          }
        }
      );
    } else {
      res.json({
        message_connection_error: "You're not logged in."
      });
    }
  }
});

router.post("/logout", function (req, res) {
  if (oraLogin) {
    oraLogin.release(function (err) {
      if (err) {
        res.json({
          message_error: err.message
        });
      } else {
        res.json({
          message_success: "Success"
        });
        doRelease(oraLogin);
        username = null;
      }
    });
  }
});

function doRelease(connection) {
  connection.release(function (err) {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Success");
    }
  });
}

module.exports = router;