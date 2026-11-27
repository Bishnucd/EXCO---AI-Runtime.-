const path = require('path');
const fs = require('fs');

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== 'win32') return;

  const { rcedit } = require('rcedit');
  const exePath = path.join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.exe`
  );
  const iconPath = path.resolve(__dirname, '../build-resources/icon.ico');

  if (!fs.existsSync(exePath) || !fs.existsSync(iconPath)) {
    console.warn('[afterPack] Skipping icon embed: missing exe or icon.ico');
    return;
  }

  const version = context.packager.appInfo.version || '1.0.0';
  await rcedit(exePath, {
    icon: iconPath,
    'file-version': version,
    'product-version': version,
    'version-string': {
      ProductName: context.packager.appInfo.productName || 'EXCO',
      FileDescription: 'EXCO — Autonomous Engineering Intelligence Platform',
      CompanyName: 'EXCO Team',
      InternalName: 'EXCO',
      OriginalFilename: 'EXCO.exe',
    },
  });
  console.log('[afterPack] Embedded icon.ico into', exePath);
};
