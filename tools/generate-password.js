(async () => {
  const bcrypt = require('bcrypt');

  const desiredPassword = process.argv[2];

  console.log(`--- Generating password ---
This tool is only for reating an initial password for development purposes.
Take the hashed output and use it to manually create a user in the database.

`);


  if (!desiredPassword || desiredPassword.length < 8) {
    console.error(
      'Please provide a desired password as a command-line argument. \n\nExample: node tools/generate-password.js mySecurePassword123 \nIt must be more than 8 characters long.',
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(desiredPassword, 10);
  console.log('pass: ' + desiredPassword);
  console.log('hash: ' + passwordHash);
  process.exit(0);
})();
