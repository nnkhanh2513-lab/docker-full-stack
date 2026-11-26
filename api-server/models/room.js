const {getPgClient} = require('./db.js');
var format = require('pg-format');

const all = async () => {
    const client = getPgClient();
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
    return result;
} 

const byId = async(id) => {
    const client = getPgClient();
    const sql = format(
        "select * from room where room_id=%s",
        id
    );

    await client.connect();
    result = await client.query(sql);
    await client.end();

    found = result.rows.length > 0;
    return {
        found: found,
        data: result.rows[0]
    };
}

// Thêm phòng mới (dùng cho POST /room)
const insert = async (name, price) => {
    const client = getPgClient();
    const sql = format(
        "insert into room(name, price) values(%L, %L)", name, price
    );
   
    try {
        await client.connect();
        const result = await client.query(sql);
        return result.rowCount > 0;
    } finally {
        await client.end();
    }
};

// Xóa phòng theo ID (dùng cho DEL /room/:id)
const remove = async (id) => {
    const client = getPgClient();
    const sql = format(
        "delete from room where room_id=%L",
        id
    );
    
    try {
        await client.connect();
        const result = await client.query(sql);
        return result.rowCount > 0;
    } finally {
        await client.end();
    }
};

// Cập nhật thông tin phòng (dùng cho PATCH /room/:id)
const update = async (id, name, price) => {
    const client = getPgClient();
    const sql = format(
        "update room set name=%L, price=%L where room_id=%L",
        name, price, id
    );

    try {
        await client.connect();
        const result = await client.query(sql);
        return result.rowCount > 0;
    } finally {
        await client.end();
    }
};

module.exports = {
    all, byId, insert, remove, update
};