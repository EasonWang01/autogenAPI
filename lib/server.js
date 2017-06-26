const fs = require('fs');
const opn = require('opn');
const http = require('http');
const port = 8112;
const path = require('path');

exports.server = () => {

  http.createServer(function (request, response) {
    console.log(request.url)
    if (request.url === '/schema.js') {
      fs.createReadStream(path.resolve(__dirname, '../API-doc') + '/schema.js').pipe(response);
    } else {
      fs.createReadStream(path.resolve(__dirname, '../API-doc') + '/APIdoc.html').pipe(response);
    }
  }).listen(port, '127.0.0.1');
  opn('http://localhost:' + port);
}
