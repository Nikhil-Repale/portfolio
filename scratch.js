const fs = require('fs');
const s1 = fs.readFileSync('c:\\Users\\Nikhil Repale\\Downloads\\AP\\script.js', 'utf8');
const s2 = fs.readFileSync('c:\\Users\\Nikhil Repale\\Downloads\\AP\\assets\\js\\tools-extended-additions.js', 'utf8');

const getScenarios = (content) => {
  const scenarios = [];
  const regex = /name:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    scenarios.push(match[1]);
  }
  return scenarios;
};

console.log('--- script.js scenarios ---');
console.log(getScenarios(s1).join('\n'));
console.log('\n--- tools-extended-additions.js scenarios ---');
console.log(getScenarios(s2).join('\n'));
