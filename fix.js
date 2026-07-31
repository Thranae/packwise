const fs = require('fs');
let code = fs.readFileSync('server/services/auth.service.js', 'utf8');

code = code.replace(/  \}\r?\n\r?\n  \}\r?\n\r?\n  return \{ success: true, message: 'OTP sent to email for verification' \};/g, "  }\n\n  return { success: true, message: 'OTP sent to email for verification' };");

code = code.replace(/    throw new ApiError\(500, 'Failed to send OTP email'\);\r?\n    \}\r?\n\r?\n    \/\/ Mock email for development if credentials aren't set/g, "    throw new ApiError(500, 'Failed to send OTP email');\n  }\n\n    // Mock email for development if credentials aren't set");

fs.writeFileSync('server/services/auth.service.js', code);
console.log('Fixed');
