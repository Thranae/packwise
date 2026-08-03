const fs = require('fs');
const path = require('path');

const iconMap = {
  'LucideIcons.user': 'Icons.person',
  'LucideIcons.arrowLeft': 'Icons.arrow_back',
  'LucideIcons.calendar': 'Icons.calendar_today',
  'LucideIcons.pieChart': 'Icons.pie_chart',
  'LucideIcons.listTodo': 'Icons.list_alt',
  'LucideIcons.folder': 'Icons.folder',
  'LucideIcons.bookOpen': 'Icons.book',
  'LucideIcons.home': 'Icons.home',
  'LucideIcons.compass': 'Icons.explore',
  'LucideIcons.bot': 'Icons.smart_toy',
  'LucideIcons.globe': 'Icons.public',
  'LucideIcons.chevronRight': 'Icons.chevron_right',
  'LucideIcons.upload': 'Icons.upload',
  'LucideIcons.camera': 'Icons.camera_alt',
  'LucideIcons.send': 'Icons.send',
  'LucideIcons.heart': 'Icons.favorite',
  'LucideIcons.search': 'Icons.search',
  'LucideIcons.imageOff': 'Icons.image_not_supported',
  'LucideIcons.fileText': 'Icons.description',
  'LucideIcons.image': 'Icons.image',
  'LucideIcons.download': 'Icons.download',
  'LucideIcons.trash2': 'Icons.delete',
  'LucideIcons.plus': 'Icons.add',
  'LucideIcons.dollarSign': 'Icons.attach_money',
  'LucideIcons.plane': 'Icons.flight',
  'LucideIcons.hotel': 'Icons.hotel',
  'LucideIcons.utensils': 'Icons.restaurant',
  'LucideIcons.ticket': 'Icons.local_activity',
  'LucideIcons.car': 'Icons.directions_car',
  'LucideIcons.moon': 'Icons.dark_mode',
  'LucideIcons.bell': 'Icons.notifications',
  'LucideIcons.logOut': 'Icons.logout',
  'LucideIcons.mapPin': 'Icons.location_on',
  'LucideIcons.eye': 'Icons.visibility',
  'LucideIcons.eyeOff': 'Icons.visibility_off',
  'LucideIcons.mail': 'Icons.email',
  'LucideIcons.lock': 'Icons.lock'
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.dart')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // Remove import
      if (content.includes(import 'package:lucide_icons/lucide_icons.dart';)) {
        content = content.replace(import 'package:lucide_icons/lucide_icons.dart';\n, '');
        changed = true;
      }
      
      // Replace icons
      for (const [lucide, material] of Object.entries(iconMap)) {
        if (content.includes(lucide)) {
          content = content.split(lucide).join(material);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir('lib');
