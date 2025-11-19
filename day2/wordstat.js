import { readFileSync, writeFileSync } from "fs";

const args = process.argv.slice(2);

const file = args[args.indexOf("--file") + 1];
const topN = parseInt(args[args.indexOf("--top") + 1]) || 10;
const minLen = parseInt(args[args.indexOf("--minLen") + 1]) || 1;
const uniqueOnly = args.includes("--unique");

if (!file) {
  console.log("--file is missing");
  process.exit(1);
}

async function run() {
  const text = readFileSync(file, "utf8");

  let initialCount = text
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);
  let inCount = initialCount.length;
  console.log("Initial count:", inCount);

  let words = text
    .replace(/[^\w\s]/g, "") // remove punctuation
    .split(/\s+/) // split by space
    .filter(w => w.length >= minLen)
    .map(w => w.toLowerCase());

  const totalWords = words.length;
  const uniqueWords = new Set(words).size;
  const longestWord = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const shortestWord = words.reduce((a, b) => (b.length < a.length ? b : a), words[0]);

  const countWordsInChunk = (chunk) => {
    const freqMap = {};
    chunk.forEach(w => {
      freqMap[w] = (freqMap[w] || 0) + 1;
    });
    return freqMap;
  };

  const performanceResults = [];

  let mergedCounts = {};

  const concurrencyLevels = [1, 4, 8];
  for (const level of concurrencyLevels) {
    const chunkSize = Math.ceil(words.length / level);
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize));
    }

    const start = Date.now();
    const allChunksCount = await Promise.all(chunks.map(chunk => countWordsInChunk(chunk)));
    const end = Date.now();

    mergedCounts = allChunksCount.reduce((acc, chunkCount) => {
      for (let word in chunkCount) {
        acc[word] = (acc[word] || 0) + chunkCount[word];
      }
      return acc;
    }, {});

    const runtime = end - start;
    performanceResults.push({ concurrencyLevel: level, runtime });
  }

  // Write performance results to file
  writeFileSync("logs/perf-summary.json", JSON.stringify(performanceResults, null, 2));

  // Sorting words by frequency after concurrency is done
  const topWords = Object.entries(mergedCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  if (uniqueOnly) {
    words = [...new Set(words)];
  }

  console.log("Total words:", totalWords);
  console.log("Unique words:", uniqueWords);
  console.log("Longest word:", longestWord);
  console.log("Shortest word:", shortestWord);
  console.log(`Top ${topN} words:`);
  for (let [w, c] of topWords) {
    console.log(w, c);
  }

  const stats = {
    "total Words": totalWords,
    "unique Words": uniqueWords,
    "longest Word": longestWord,
    "shortest Word": shortestWord,
    "top repeated Words": topWords
  };

  writeFileSync("output/stats.json", JSON.stringify(stats, null, 2));
}

run().catch((error) => {
  console.error("Error occurred:", error);
});
