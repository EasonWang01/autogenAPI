const fs = require('fs');
const exec = require('child_process').exec;
const opn = require('opn');
const chalk = require('chalk');

const server = require('./server').server();
const html = require('./html').html;
const runScript = require('./childProcess').runScript;

const error = (data) => chalk.red(`Error! ${data}`);
const warning = (data) => chalk.yellow(`Warning! ${data}`);
const success = (data) => chalk.green(`Success! ${data}`);

exports.getDoc = () => {

  if (typeof process.argv[2] === "undefined") {
    console.log('Please enter filename in argument')
  } else {
    if (fs.existsSync(process.argv[2])) {
      if (process.argv[2].indexOf(".js") === -1) {
        console.log("It's not an js file")
      } else {
        var res = {
          host: '',
          api: {}
        };
        var readableStream = fs.createReadStream(process.argv[2])
        var data = '';

        readableStream.setEncoding('utf8'); //如果沒有setEncoding讀出之數據為buffer型態

        readableStream.on('data', function (chunk) {
          data += chunk;
        });
        readableStream.on('end', function () {
          data.match(/\/\*\*([\s\S]*?)\*\//g).forEach(d => {
            if (res.host === "" && d.match(/host:.+/g)) {
              res.host = (d.match(/host:(.+)/i)[1].replace(' ', '').replace(/"|'/g, ''));
            }
            if (d.match(/@path[\s\S]*/g)) {
              let RouteBlock = d.match(/@path[\s\S]*/g)[0]; //full route include [path,return,param]
              let path = RouteBlock.match(/@path(.+)/)[1].replace(' ', '').replace('/', '');
              if (typeof res.api[path] === "undefined") {
                res.api[path] = {
                };
              }

              //加入method
              try {
                var method = RouteBlock.match(/method(.+)/)[1].replace(' ', '');
                res.api[path][method] = {
                  describe: '',
                  parameter: {},
                  return: {}
                };
              } catch (err) {
                console.log(error(`/${path} have no @method field,because http method is required`))
                throw `/${path} have no @method field`
              }

              //加入title
              try {
                let title = RouteBlock.match(/title(.+)/)[1].replace(' ', '');
                res.api[path][method].title = title;
              } catch (err) {
                console.log(warning(`${method} /${path} have no @title field`))
              }

              //加入describe
              try {
                let desc = RouteBlock.match(/desc(.+)/)[1].replace(' ', '');
                res.api[path][method].describe = desc;
              } catch (err) {
                console.log(error(`${method} /${path} have no @desc field,because describe is required`))
                throw `${method} /${path} have no @desc field`
              }

              //加入param
              try {
                let param = d.match(/@param.+/g)
                param.forEach(dd => {
                  let type = dd.match(/{.+}/g)[0].replace('{', '').replace('}', '');
                  let name = dd.match(/}(.[^\s]+)/g)[0].replace('}', '');
                  res.api[path][method].parameter[name] = type;
                })
              } catch (err) {
                console.log(error(`${method} /${path} have no @param field,because parameter is required`))
                throw `${method} /${path} have no @param field`
              }

              //加入return參數
              try {
                let paramReturn = d.match(/@return.+/g)
                paramReturn.forEach(dd => {
                  let type = dd.match(/{.+}/g)[0].replace('{', '').replace('}', '');
                  let name = dd.match(/}(.[^\s]+)/g)[0].replace('}', '');
                  res.api[path][method].return[name] = type;
                })
              } catch (err) {
                console.log(warning(`${method} /${path} have no @return field`))
              }



            }
          })
          const dir = './API-doc';

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }

          try {
            fs.writeFileSync('./API-doc/schema.js', `const schema = ${JSON.stringify(res)}`);
            console.log(success('schema.json has been generated!'));
          } catch (err) {
            console.log(err);
          }

          try {
            fs.writeFileSync('./API-doc/APIdoc.html', html, 'utf8')
            console.log(success('APIdoc.html has been generated!'));
          } catch (err) {
            console.log(err)
          }

          try {
            fs.writeFileSync('./API-doc/server.js', server, 'utf8')
            console.log(success('server.js has been generated!'));
          } catch (err) {
            console.log(err)
          }

          runScript('./API-doc/server', function (err) {
            if (err) throw err;
          });


        });
      }
    } else {
      console.log('filename not exist')
    }
  }


}
