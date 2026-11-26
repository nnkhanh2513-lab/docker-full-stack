var Router = require('restify-router').Router;
const router = new Router();
var format = require('pg-format');
var {authenticated} = require('./authenticate'); 
var {getPgClient} = require('../models/db');
const Room = require('../models/room');

router.get('/room', async function(req, res) {
  const result = await Room.all();
  res.send( {
    rooms: result
  });
});

router.get('/room/:id', async (req, res) => {
    const id = req.params.id;
    const {found, data} = await Room.byId(id);
       
    if (found) {
        res.send({
            success: true, code: 200, message: "",
            data: result.rows[0]
        });
    } else {
        res.send({
            success: false, code: 404,
            message: "Cannot find room with id: " + id
        });
    }
});

router.post('/room', authenticated, async (req, res) => {
    var {name = "", price = 0} = req.params;
    // Check valid params
    if (typeof name !== 'string' || name.trim().length === 0 || isNaN(price) || Number(price) <= 0) {
        res.send({
            success: false,
            code: 400, // hoặc giữ 403 theo code mẫu
            message: "Invalid parameters"
        });
        return;
    }

    // kiểm tra role có quyền insert trong bảng room hay không
    if (role !== "admin" && role !== "manager") {
        res.send({
            success: false,
            code: 403,
            message: "Forbidden: You don't have permission to add a room"
        });
        return;
    }

    await Room.insert(name, price);

    res.send({
        success: true, code: 200,
        message: "Room added successfully"
    });
    
    return;
});

router.del('/room/:id', authenticated, async(req, res) => {
    var id = req.params.id;
    const found = await Room.remove(id);

    if (found) {
        res.send({
            success: true, code: 200, message: ""
        });
    } else {
        res.send({
            success: true, code: 404, message: "Cannot delete room with id " + id + ". Does not exist."
        });
    }
});

router.patch('/room/:id', authenticated, async(req, res) => {
    const {name = "", price=0} = req.params;
    const id = req.params.id;
    const found = await Room.update(id, name, price);

    if (found) {
        res.send({
            success: true, code: 200, message: ""
        });
    } else {
        res.send({
            success: true, code: 404, message: "Cannot update room with id " + id + ". Does not exist."
        });
    }
});

module.exports = router;