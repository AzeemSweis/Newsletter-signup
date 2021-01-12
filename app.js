const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const https = require('https');
const config = require("./config");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/signup.html');
})

app.post('/', (req,res) => {
  const apiKey = config.apiKey;
  const listID = config.listID;
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
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
  }

  const jsonData = JSON.stringify(data);

  const url = 'https://us7.api.mailchimp.com/3.0/lists/' + listID;

  const options = {
    method: "POST",
    auth: "azeem1:" + apiKey
  }

  const request = https.request(url, options, function(response) {
    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
})

app.post("/failure", (req,res) => {
  res.redirect("/")
})

app.listen(port, function() {
  console.log(`Server is running on http://localhost:${port}`);
})
