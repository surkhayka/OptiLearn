// server.js
import { exec } from 'child_process';
// If not using ES modules, use:
// const { exec } = require('child_process');

const jsonData = { name: "Alice", age: 30 };
const jsonString = JSON.stringify(jsonData);

// Pass the JSON string as an argument, make sure to wrap it in quotes
exec(`python3 deepseek.py '${jsonString}'`, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
  } else if (stderr) {
    console.log(`stderr: ${stderr}`);
  } else {
    console.log(stdout);
  }
});

