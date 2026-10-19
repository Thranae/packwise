const fs = require('fs');
const path = require('path');

const blurViewBuild = path.join(__dirname, '..', 'node_modules', 'expo-blur', 'build', 'BlurView.js');

if (fs.existsSync(blurViewBuild)) {
  let content = fs.readFileSync(blurViewBuild, 'utf8');
  if (!content.includes("Platform.OS === 'android'")) {
    const target = "const { tint = 'default', intensity = 50, blurReductionFactor = 4, style, children, ...props } = this.props;";
    const replacement = `const { tint = 'default', intensity = 50, blurReductionFactor = 4, style, children, ...props } = this.props;
        if (Platform.OS === 'android') {
            const backgroundColor = getBackgroundColor(intensity, tint) || 'rgba(255, 255, 255, 0.4)';
            return (_jsxs(View, { ...props, style: [styles.container, style], children: [_jsx(View, { style: [StyleSheet.absoluteFill, { backgroundColor }] }), children] }));
        }`;
    
    if (content.includes(target)) {
      if (!content.includes("import getBackgroundColor from './getBackgroundColor';")) {
        content = "import getBackgroundColor from './getBackgroundColor';\n" + content;
      }
      content = content.replace(target, replacement);
      fs.writeFileSync(blurViewBuild, content, 'utf8');
      console.log('Successfully patched expo-blur for Android compatibility.');
    }
  }
}
