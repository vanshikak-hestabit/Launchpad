const fs = require('fs');
const {performance} = require("perf_hooks");
const start = performance.now();
const stream = fs.createReadStream('textFile.txt', 'utf8');
stream.on("data", () => {});

stream.on('end', ()=> {
const end = performance.now();
//const used = process.memoryUsage().heapUsed/1024/1024;
const mem = process.memoryUsage().heapUsed/1024/1024;
let result = {};
if (fs.existsSync('result.json')) result = JSON.parse(fs.readFileSync('result.json'));
const res = {stream:{time:end-start,memory:mem}};
fs.writeFileSync("result.json",JSON.stringify(res,null,2));
});
