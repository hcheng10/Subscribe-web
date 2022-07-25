const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public")); // tell server where to find styles.css and images
app.use(bodyParser.urlencoded({extended: true})); // for input values

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  // https.get() is to get data from api provider, https.request() is to send data to api provider
  const url = "https://us9.api.mailchimp.com/3.0/lists/715b632c95";

  const options = {
    method: "POST",
    auth: "HC:3fa92c9afc0c0e636b12f9c395a11b5b-us9"
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData); // comment out this line to test failure case
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){ // 3000(local host) || process.env.PORT(for heroku to get a dynamic port)
  console.log("Serever is running on port 3000");
});

// mailchimp
// API Key
// 3fa92c9afc0c0e636b12f9c395a11b5b-us9

// List Id
// 715b632c95
