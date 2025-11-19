import { writeFileSync } from "fs";
import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum();
let text = "";
let words = 0;

while (words < 200000) {
  const p = lorem.generateParagraphs(5);
  text += p + "\n";
  words += p.split(/\s+/).length;
}

writeFileSync("corpus.txt", text);
console.log("corpus.txt created with", words, "words");
