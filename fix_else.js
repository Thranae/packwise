const fs = require('fs');
let code = fs.readFileSync('server/services/auth.service.js', 'utf8');

code = code.replace(/  \} else \{\r?\n    \/\/ Mock email for development if credentials aren't set\r?\n    console\.log\(`\\n======================================`\);\r?\n    console\.log\(`MOCK EMAIL SENT TO: \$\{user\.email\}`\);\r?\n    console\.log\(`SUBJECT: Your Password Reset OTP`\);\r?\n    console\.log\(`OTP: \$\{otp\}`\);\r?\n    console\.log\(`======================================\\n`\);\r?\n  \}/g, "");

fs.writeFileSync('server/services/auth.service.js', code);
console.log('Fixed else block');
