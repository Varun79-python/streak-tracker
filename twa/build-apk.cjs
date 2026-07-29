const {
  TwaGenerator,
  JdkHelper,
  AndroidSdkTools,
  TwaManifest,
  JarSigner,
  ConsoleLog
} = require('C:/nvm4w/nodejs/node_modules/@bubblewrap/core');

const path = require('path');
const fs = require('fs');

const TWA_DIR = __dirname;
const KEYSTORE_PATH = path.join(TWA_DIR, 'streakify.keystore');
const KEYSTORE_PASS = 'streakify123';
const KEYSTORE_ALIAS = 'streakify';
const KEYSTORE_KEY_PASS = 'streakify123';
const JDK_PATH = 'C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.19.10-hotspot';
const SDK_PATH = 'C:\\Users\\venka\\AppData\\Local\\Android\\Sdk';

async function main() {
  const log = new ConsoleLog();

  // Load manifest
  const manifestPath = path.join(TWA_DIR, 'twa-manifest.json');
  const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const manifest = new TwaManifest(manifestData);

  // Set JDK
  JdkHelper.overrideJdkPath(JDK_PATH);
  log.info(`JDK: ${JDK_PATH}`);

  // Set up Android SDK tools
  const sdkTools = new AndroidSdkTools(SDK_PATH, log);
  log.info(`SDK: ${SDK_PATH}`);

  // Create project
  const projectDir = path.join(TWA_DIR, 'android-project');
  if (fs.existsSync(projectDir)) {
    fs.rmSync(projectDir, { recursive: true });
  }
  fs.mkdirSync(projectDir, { recursive: true });

  const generator = new TwaGenerator(log);
  log.info('Generating Android project from TWA manifest...');
  await generator.createProject(manifest, projectDir, sdkTools);

  // Build
  log.info('Building APK (this may take a while)...');
  await generator.buildAndroid(projectDir, SDK_PATH);

  // Find the unsigned APK
  const apkDir = path.join(projectDir, 'app', 'build', 'outputs', 'apk');
  const apkPaths = [];
  function findApks(dir) {
    if (fs.existsSync(dir)) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) findApks(full);
        else if (entry.name.endsWith('.apk')) apkPaths.push(full);
      }
    }
  }
  findApks(apkDir);
  
  if (apkPaths.length === 0) {
    log.error('No APK was generated');
    process.exit(1);
  }

  log.info(`Found APKs: ${apkPaths.join(', ')}`);

  // Sign the release APK
  let apkToSign = apkPaths.find(p => p.includes('release') && !p.includes('signed'));
  if (!apkToSign) apkToSign = apkPaths[0];
  
  if (apkToSign && apkToSign.includes('unsigned')) {
    log.info(`Signing APK: ${apkToSign}`);
    await JarSigner.signRelease(
      apkToSign,
      KEYSTORE_PATH,
      KEYSTORE_PASS,
      KEYSTORE_ALIAS,
      KEYSTORE_KEY_PASS,
      log
    );
    
    // The signed APK path
    const signedApk = apkToSign.replace('unsigned', 'signed');
    const outputApk = path.join(TWA_DIR, 'streakify.apk');
    if (fs.existsSync(signedApk)) {
      fs.copyFileSync(signedApk, outputApk);
      log.success(`✓ APK created: ${outputApk}`);
    } else {
      // Try the original
      fs.copyFileSync(apkToSign, outputApk);
      log.success(`✓ APK (unsigned) created: ${outputApk}`);
    }
  } else if (apkToSign) {
    const outputApk = path.join(TWA_DIR, 'streakify.apk');
    fs.copyFileSync(apkToSign, outputApk);
    log.success(`✓ APK created: ${outputApk}`);
  }
}

main().catch(e => {
  console.error('Build failed:', e);
  process.exit(1);
});
