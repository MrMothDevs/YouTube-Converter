let express = require('express.js');
let app = express();

app.use(express.json());
app.use(express.static("public"));


app.listen(5000);