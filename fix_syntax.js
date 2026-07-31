const fs = require('fs');
let code = fs.readFileSync('server/services/auth.service.js', 'utf8');

// The file currently has:
/*
  if (!resendResponse.ok) {
    const errData = await resendResponse.json();
    console.error('Resend API Error:', errData);
    throw new Error('Failed to send verification email');
  }

  }

  return { success: true, message: 'OTP sent to email for verification' };
*/

code = code.replace(/throw new Error\('Failed to send verification email'\);\r?\n\s*}\r?\n\r?\n\s*}\r?\n\r?\n\s*return/g, "throw new Error('Failed to send verification email');\n  }\n\n  return");

/* And for forgot password:
      if (!resendResponse.ok) {
        throw new Error('Failed to send verification email');
      }
    } catch (err) {
      console.error('Email send error:', err);
      throw new ApiError(500, 'Failed to send OTP email');
    }
  } else {
    // Mock email for development if credentials aren't set
*/
code = code.replace(/throw new ApiError\(500, 'Failed to send OTP email'\);\r?\n\s*}\r?\n\s*} else {/g, "throw new ApiError(500, 'Failed to send OTP email');\n    }\n");

fs.writeFileSync('server/services/auth.service.js', code);
console.log('Fixed syntax errors');
