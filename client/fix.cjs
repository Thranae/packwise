const sharp = require('sharp');
const src = 'C:/Users/thranae/.gemini/antigravity/brain/c3918793-7879-474a-ad8c-3481e1aa892d/.user_uploaded/media__1785534544061.jpg';
async function run() {
  await sharp(src).extract({ left: 177, top: 380, width: 256, height: 256 }).resize(512, 512).toFile('D:/packwise/client/public/pwa-512x512.png');
  await sharp(src).extract({ left: 177, top: 380, width: 256, height: 256 }).resize(192, 192).toFile('D:/packwise/client/public/pwa-192x192.png');
}
run();
