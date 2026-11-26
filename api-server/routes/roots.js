var Router = require('restify-router').Router;
var router = new Router();
var {getPgClient} = require('../models/db');

router.get('/', async function(req, res) {
    const client = getPgClient();

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

module.exports = router;