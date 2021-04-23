import express, { Request, Response, NextFunction } from "express";
import { createWriteStream, writeFile } from "fs";

const socketio = require("socket.io");

const app = express();

app.use(express.static(__dirname + "/public"));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(__dirname + "/public/index.html");
});

const server = app.listen(3000, () => {
  console.log("Listening to port 3000");
});

const io = socketio(server);

io.on("connection", (socket: any) => {
  let fileChunks: any[] = [];
  console.log("A device connected");

  socket.on("chunk-upload", (chunk: any) => {
    fileChunks.push(chunk);
  });

  socket.on("chunk-upload-finished", (fileObj: any) => {
    console.log("Total chunks = " + fileChunks.length);
    writeFile(
      __dirname + "/public/upload" + "/" + fileObj.name,
      Buffer.concat(fileChunks),
      (err) => {
        if (err) throw err;
        console.log("It's saved!");
        io.emit("file-upload-finished", {
          link: "http://localhost:3000/upload/" + fileObj.name,
        });
      }
    );
  });

  socket.on("error", () => {
    console.log("An error occured");
  });
});
