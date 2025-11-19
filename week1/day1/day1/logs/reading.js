const fs = require('fs');
const {performance} = require("perf_hooks");
const result = { buffer:{}, stream: {}};
//buff
let start = performance.now();
let mem1 = process.memoryUsage().heapUsed;
fs.readFileSync("textFile.txt","utf8");
result.buffer.time = performance.now()-start;
result.buffer.memory = process.memoryUsage().heapUsed-mem1;
//stream
let stream = fs.createReadStream("textFile.txt","utf8");
let st, memo;
stream.on("open", () => {
st = performance.now();
memo = process.memoryUsage().heapUsed;
});

stream.on("end", () => {
result.stream.time=performance.now()-st;
result.stream.memory=Math.abs(process.memoryUsage().heapUsed-memo);
fs.writeFileSync("day1-perf.json",JSON.stringify(result,null));
});
stream.resume();
