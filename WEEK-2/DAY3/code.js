let age = 20;
const name = "Clansy";
console.log(`Name: ${name}, Age: ${age}`);

//ARROW FUNCTION
const greet = (person) => `Hello, ${person}!`;
console.log(greet(name));
console.log("These are the list of Clansy's classmates, toppers and average marks of previous test");

//OBJECTS + ARRAYS
const classmates = [
    { name : "Stella", marks: 90},
    { name : "Lake", marks: 93},
    { name : "Harper", marks: 89},
    { name : "Alex", marks: 87},
    { name : "Alessandra", marks: 92}
];

//USING MAP
const names = classmates.map(student => student.name);
console.log("Classmate names: ", names);

//USING FILTER
const toppers = classmates.filter(classmate => classmate.marks > 90);
console.log("Class Toppers: ", toppers);

//USING REDUCE
const avgMarks = classmates.reduce((sum,s) => sum + s.marks, 0) / classmates.length;
console .log("Average Marks of class: ", avgMarks);


