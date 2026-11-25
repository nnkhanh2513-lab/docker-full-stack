var restify = require('restify');
const { Client } = require('pg');

var server = restify.createServer();
var corsMiddleware = require('restify-cors-middleware2');

var cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders:['X-App-Version'],
    exposeHeaders:[]
  });
  
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser({ mapParams: true })); // POST params
server.use(restify.plugins.queryParser()); // GET query

server.get('/', async function(req, res) {

    const client = new Client({      
        host: `${process.env.POSTGRES_HOST}`,
        port: `${process.env.POSTGRES_PORT}`,
        database: `${process.env.POSTGRES_DB}`,
        user: `${process.env.POSTGRES_USER}`,
        password: `${process.env.POSTGRES_PASSWORD}`,
      })

    var db_info = "Database is up & running";
    try {
        await client.connect();
    } catch (e)
    {
        db_info = "Cannot connect to database!";
        console.log(e);
    } finally {
        await client.end();
    }

    res.send( {
        Server: "Server is working very good",
        Database: db_info
      });
});

var jwt = require('jsonwebtoken');

server.post('/login', async (req, res) => {
    const {username = "", password = ""} = req.params;
    if ((username.length == 0)
        || (password.length == 0)
    ) {
        res.send({
            success: false,
            code: 401,
            message: "Invalid username or password"
        })
    }

    //Trả lại token nếu hợp lệ
    if( ((username == "admin") && (password=="1234") )
        || ((username == "manager01") && (password == "1234"))
        || ((username == "manager02") && (password == "1234"))
        || ((username == "customer01") && (password == "1234"))
    ){
        const secret = "my-secret-key";
        const token = jwt.sign({
            username: username ,
             role: (username == "admin") ? "admin" 
                : ((username == "manager01") 
	                || (username == "manager02") ) ? "manager"
                : "customer"
        }, secret, { expiresIn: '1h' });
        res.send({
            success: true, code: 200,
            message: "Login successfully",
            token: token
        })
    } else {
        res.send({
            success: false,  code: 401,
            message: "Invalid username or password"
        });
    }    
});

var PORT = 8080;
server.listen(PORT, function() {
    console.log('%s listening at %s', server.name, server.url);
});

server.get('/room', async function(req, res) {
  const client = new Client({    
    host: `${process.env.POSTGRES_HOST}`,
    port: `${process.env.POSTGRES_PORT}`,
    database: `${process.env.POSTGRES_DB}`,
    user: `${process.env.POSTGRES_USER}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
  })
  var sql = "select * from room";
  var result = [];

  try {
    await client.connect();
    result = await client.query(sql);    
    result = result.rows
  } catch (e) {
    console.log(e);
  } finally {
    await client.end();
  }

  res.send( {
    rooms: result
  });
});

