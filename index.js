import express from "express"
import http from "http"
import sqlite3 from "sqlite3"
import {v4 as uuid} from "uuid"

const app = express()

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, access_token'
    )
    if ('OPTIONS' === req.method) {
        res.send(200)
    } else {
        next()
    }
}
app.use(allowCrossDomain)

let db = new sqlite3.Database("todo")

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

db.run("create table if not exists todo(id, title)")

app.post("/post", (req, res) => {
    console.log(req.body)
    db.run("insert into todo(id, title) values(?,?)", uuid(), req.body["title"])
    res.json({})
})

app.post("/delete/:id", (req, res) => {
    db.run("delete from todo where id = ?", req.body["id"])
    console.log(req.body["id"])
    res.json({})
})

app.get("/getall", (req, res) => {
    db.all("select * from todo", (err, rows) => {
        return res.json(rows)
    })
})

const webServer = http.createServer(app)
webServer.listen(8080, () => {
    console.log("server running")
})