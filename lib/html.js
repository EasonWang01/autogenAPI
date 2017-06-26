
exports.html =
  `<!DOCTYPE html>
    <html>
      <head>
          <meta charset="utf-8">
          <script src="./schema.js"></script>
          <script src="https://fb.me/react-15.0.0.js"></script>
          <script src="https://fb.me/react-dom-15.0.0.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.34/browser.min.js"></script>
        <style>
          .APIblock {
            width: 80%;
            margin: 0 auto;
          }
          .get_title {
            color: white;
            background: #00CCFF;
          }
          .post_title {
            color: white;
            background: #00CCCC;
          }
          .put_title {
            color: white;
            background: #FFCC00;
          }
          .delete_title {
            color: white;
            background: #FF3300;
          }
          .patch_title {
            color: white;
            background: yellow;
          }
          .bar:hover {
            cursor: pointer;
          }
          .dropdown {
            display: none;
          }
        </style>
      </head>
      <body>
        <div id="container"></div>
      </body>

      <script type="text/babel">

        class APIgen extends React.Component {
          constructor(props) {
            super(props);
            this.state = {
              schema: []
            };
          }


          componentDidMount() {
            
            let arr = [];
            let payload = {};
            console.log(schema)
            Object.keys(schema.api).forEach(function(key) {
              Object.keys(schema.api[key]).forEach(d => {
                payload = {...schema.api[key][d], url: key, method: d}
                arr.push(payload)
              })
            });
            console.log(arr)

            this.setState({schema: arr}, () => {
              
            //console.log(this.state.schema[0][Object.keys(this.state.schema[0])]);
              //點擊顯示下拉選項
              document.querySelectorAll('.bar').forEach(d => {
                d.addEventListener('click', (e) => {
                  let id = e.target.parentElement.parentElement.id;
                  if(!document.getElementById(id + 'Bar').style.display || document.getElementById(id + 'Bar').style.display === "none") {
                    document.getElementById(id + 'Bar').style.display = 'block';
                  } else {
                    document.getElementById(id + 'Bar').style.display = 'none';
                  }
                })
              })
            })
          }
          render() {
            return (
              <div>
                {
                  this.state.schema.map((d, idx) => (
                    <div key={idx} id={d.url + d.method} className="APIblock">
                      <div className="bar" style={{display: 'flex', height: '50px', border: '1px solid #c3d9ec'}}>
                        <div style={{width: '20%', lineHeight: '2.5', textAlign: 'center'}} className={d.method + '_title'}>{d.method.toUpperCase()}</div>
                        <div style={{paddingLeft: '10px', width: '80%', lineHeight: '45px'}} className={d.method + '_endpoint'}>/{d.url}</div>
                        <div style={{fontSize: '15px', whiteSpace: 'nowrap'}}>{d.title}</div>
                      </div>
                      <div id={d.url + d.method + 'Bar'} className="dropdown">
                        <div >
                          <p>Describe</p>
                          <div style={{color: 'gray'}}>
                          {d.describe}
                          </div><br />
                          <p>Parameter</p>
                          <div style={{color: 'gray'}}>
                            {
                              Object.keys(d.parameter).map(dd => (
                                <div>{dd}</div>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }

              </div>
            );
          }
        }
        ReactDOM.render(<APIgen />, document.getElementById('container'));

    </script>
    </html>
`