const fs = require('fs');
const {performance} = require("perf_hooks");
const start = performance.now();
fs.readFile('textFile.txt','utf8',(err,data) => {
if(err) throw err;
console.log(data);
const end = performance.now();
const used = process.memoryUsage().heapUsed/1024/1024;
const res = { buffer:{time:end-start,memory:used}};
fs.writeFileSync("result.json",JSON.stringify(res,null,2));
});

