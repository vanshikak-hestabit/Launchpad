const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function loadEnv() {
  const order = ['.env.local', '.env.dev', '.env.prod', '.env'];

  for (const name of order) {
    const filePath = path.resolve(process.cwd(), name);

    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath });
      return name;
    }
  }

  return null;
}

module.exports = { loadEnv };

//reads .env.local, .env.dev, .env.prod files
//loads the setting like PORT, DB_URL(database url -> contains db's address+keys+extra instructions),
//  secret key(JWT Token)
// Your config loader tells your app which .env file to use (a helper that reads 
// .env files)so your code works differently 
// in local / dev / production without changing code.
//