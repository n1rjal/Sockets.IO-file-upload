"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var fs_1 = require("fs");
var socketio = require("socket.io");
var app = express_1.default();
app.use(express_1.default.static(__dirname + "/public"));
app.get("/", function (req, res, next) {
    res.sendFile(__dirname + "/public/index.html");
});
var server = app.listen(3000, function () {
    console.log("Listening to port 3000");
});
var io = socketio(server);
io.on("connection", function (socket) {
    var fileChunks = [];
    console.log("A device connected");
    socket.on("chunk-upload", function (chunk) {
        fileChunks.push(chunk);
    });
    socket.on("chunk-upload-finished", function (fileObj) {
        console.log("Total chunks = " + fileChunks.length);
        fs_1.writeFile(__dirname + "/public/upload" + "/" + fileObj.name, Buffer.concat(fileChunks), function (err) {
            if (err)
                throw err;
            console.log("It's saved!");
            io.emit("file-upload-finished", {
                link: "http://localhost:3000/upload/" + fileObj.name,
            });
        });
    });
    socket.on("error", function () {
        console.log("An error occured");
    });
});
