const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgIconPath = path.join(__dirname, 'public', 'logo-pwa.svg');
const assetsDir = path.join(__dirname, 'assets');

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

const generateAssets = async () => {
    try {
        console.log('Generating Capacitor assets...');
        const svgBuffer = fs.readFileSync(svgIconPath);
        
        // icon.png - 1024x1024
        await sharp(svgBuffer)
            .resize(1024, 1024, { fit: 'contain', background: { r: 15, g: 23, b: 42, alpha: 1 } }) // slate-900 background
            .toFile(path.join(assetsDir, 'icon.png'));
            
        // splash.png - 2732x2732 (with smaller icon in center)
        await sharp({
            create: {
                width: 2732,
                height: 2732,
                channels: 4,
                background: { r: 15, g: 23, b: 42, alpha: 1 } // slate-900
            }
        })
        .composite([{
            input: await sharp(svgBuffer).resize(800, 800, { fit: 'contain' }).toBuffer(),
            gravity: 'center'
        }])
        .png()
        .toFile(path.join(assetsDir, 'splash.png'));
        
        console.log('Assets generated successfully in /assets directory!');
    } catch (err) {
        console.error('Failed to generate assets:', err);
    }
};

generateAssets();
