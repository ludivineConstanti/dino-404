const express = require("express");
const app = express();

// express will automatically render index.html from this folder
// since no instruction is given for any route
app.use(express.static("static"));

// Need to use node or nodemon to start
// if the port 3000 is already in use:
// sudo kill -9 $(sudo lsof -t -i:3000)
app.listen(3000, () => {
  console.log(`Listening on 3000`);
});
