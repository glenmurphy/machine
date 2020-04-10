var express = require('express');

var path = require("path");
const app = express();

express.static.mime.define({'application/javascript': ['mjs', 'js']});
app.use( '/core', express.static( __dirname + '/../core' ));
app.use( '/', express.static( __dirname + '/src' ));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/src/index.html'));
});

app.listen(8080, () => console.log('Listening on port 8080!'));