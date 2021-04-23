const socket = io("http://localhost:3000");
const fileUpload = document.getElementById("fileButton");

const chunkSize = 1000;
let remainingSize = chunkSize + 100; //any number greater than chunksize

fileUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const noOfChunk = Math.ceil(file.size / chunkSize);
  for (let i = 0; i < noOfChunk; i++) {
    remainingSize = calculateRemainingSize(file.size, i);
    sendBuffer(file.slice(i, i + Math.min(chunkSize, remainingSize)));
  }
  let customFileObj = {
    name: file.name,
  };
  socket.emit("chunk-upload-finished", customFileObj);
});

socket.on("file-upload-finished", (fileObj) => {
  console.log("File is uploaded");
  console.log(fileObj.link);
});

function sendBuffer(dataChunk) {
  socket.emit("chunk-upload", dataChunk);
}

function calculateRemainingSize(fileSize, i) {
  return fileSize - i * chunkSize;
}
