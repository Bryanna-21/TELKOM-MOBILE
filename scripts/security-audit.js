// 🔒 Security Audit Script
// Run: node scripts/security-audit.js
//
// FIXED: every check used to read only App.js — which is just the
// navigation shell and contains none of the actual implementation. Encryption,
// network monitoring, GSM fallback and secure storage all live in
// src/services/*.js and src/hooks/*.js, so checks 3/6/7/9 always failed
// (or, if someone "fixed" it by pasting keywords into App.js, would pass
// without verifying anything real). Each check now reads the file that
// actually implements the feature it claims to verify.

const fs = require('fs');

console.log('🔒 TELKOM PLUS - Security Audit Report');
console.log('=======================================\n');

let passed = 0;
let failed = 0;

function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

// ✅ Check 1: Verify .env is in .gitignore
console.log('📁 Checking .gitignore...');
const gitignore = readIfExists('.gitignore');
if (gitignore.includes('.env')) {
  console.log('✅ .env is properly ignored');
  passed++;
} else {
  console.log('❌ .env NOT in .gitignore - SECURITY RISK');
  failed++;
}

// ✅ Check 2: Verify .env.example exists
console.log('\n📋 Checking .env.example...');
if (fs.existsSync('.env.example')) {
  console.log('✅ .env.example exists for team reference');
  passed++;
} else {
  console.log('❌ .env.example missing - team onboarding issue');
  failed++;
}

// ✅ Check 3: Verify encryption is implemented (and not hardcoded)
console.log('\n🔐 Checking encryption implementation...');
const encryptionSrc = readIfExists('src/services/encryption.js');
const usesAes = encryptionSrc.includes('CryptoJS.AES');
const usesDeviceKey = encryptionSrc.includes('SecureStore') && encryptionSrc.includes('WordArray.random');
const hasHardcodedKeyLiteral = /ENCRYPTION_KEY\s*=\s*['"][^'"]+['"]/.test(encryptionSrc);
if (usesAes && usesDeviceKey && !hasHardcodedKeyLiteral) {
  console.log('✅ AES encryption with a per-device, SecureStore-backed key (no hardcoded key)');
  passed++;
} else if (hasHardcodedKeyLiteral) {
  console.log('❌ Hardcoded encryption key literal found in src/services/encryption.js - SECURITY RISK');
  failed++;
} else {
  console.log('❌ No encryption implementation found in src/services/encryption.js - SECURITY RISK');
  failed++;
}

// ✅ Check 4: Verify biometric auth
console.log('\n👤 Checking biometric authentication...');
const biometricSrc = readIfExists('src/hooks/useBiometricAuth.js');
if (biometricSrc.includes('LocalAuthentication') && biometricSrc.includes('authenticateAsync')) {
  console.log('✅ Biometric authentication implemented');
  passed++;
} else {
  console.log('❌ No biometric authentication - SECURITY RISK');
  failed++;
}

// ✅ Check 5: Verify permissions in app.json
console.log('\n📱 Checking permissions...');
const appJson = JSON.parse(readIfExists('app.json') || '{}');
const permissions = appJson.expo?.android?.permissions || [];
// Camera/location match what app.json actually declares (Section: QR scan +
// merchant locator). CALL_PHONE isn't needed — USSD dialing goes through
// Linking.openURL('tel:...'), which doesn't require a runtime permission.
const required = ['CAMERA', 'ACCESS_FINE_LOCATION'];
const missing = required.filter((p) => !permissions.some((perm) => perm.includes(p)));

if (missing.length === 0) {
  console.log('✅ All required permissions declared');
  passed++;
} else {
  console.log(`❌ Missing permissions: ${missing.join(', ')}`);
  failed++;
}

// ✅ Check 6: Verify network fallback
console.log('\n📡 Checking network fallback...');
const networkRouterSrc = readIfExists('src/services/networkRouter.js');
if (networkRouterSrc.includes('NetInfo') && networkRouterSrc.includes('isInternetReachable')) {
  console.log('✅ Network monitoring implemented');
  passed++;
} else {
  console.log('❌ No network monitoring - GSM fallback broken');
  failed++;
}

// ✅ Check 7: Verify GSM/USSD fallback
console.log('\n📞 Checking GSM fallback...');
const ussdSrc = readIfExists('src/services/ussdEngine.js');
if (ussdSrc.includes('Linking') && ussdSrc.includes('tel:')) {
  console.log('✅ GSM USSD fallback implemented');
  passed++;
} else {
  console.log('❌ No GSM fallback - offline mode broken');
  failed++;
}

// ✅ Check 8: Check for hardcoded secrets across source files
console.log('\n🔍 Scanning for hardcoded secrets...');
const sensitivePatterns = [
  /API_KEY\s*=\s*['"][^'"]+['"]/,
  /SECRET\s*=\s*['"][^'"]+['"]/,
  /PASSWORD\s*=\s*['"][^'"]+['"]/,
  /TOKEN\s*=\s*['"][^'"]+['"]/,
];

function listJsFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const full = `${dir}/${entry.name}`;
    if (entry.isDirectory()) listJsFiles(full, out);
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

let secretsFound = 0;
const scannedFiles = ['App.js', 'app.json', 'package.json', ...listJsFiles('src')];
scannedFiles.forEach((file) => {
  const content = readIfExists(file);
  if (!content) return;
  sensitivePatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      console.log(`⚠️  Potential secret in ${file}`);
      secretsFound++;
    }
  });
});

if (secretsFound === 0) {
  console.log('✅ No hardcoded secrets found');
  passed++;
} else {
  console.log(`❌ ${secretsFound} potential secrets found - SECURITY RISK`);
  failed++;
}

// ✅ Check 9: Verify secure storage
console.log('\n💾 Checking secure storage...');
if (encryptionSrc.includes('SecureStore') || biometricSrc.includes('SecureStore')) {
  console.log('✅ Secure storage implemented');
  passed++;
} else {
  console.log('❌ No secure storage - data exposed');
  failed++;
}

// ✅ Check 10: API endpoint scheme
// Local LAN development (EXPO_PUBLIC_API_URL pointing at a dev machine's
// http://192.168.x.x:5000) is expected and fine — flag it as informational,
// not a failure, but do fail on any http:// URL that isn't a private LAN
// address (a real warning sign for a production config).
console.log('\n🔗 Checking API endpoint scheme...');
const envExample = readIfExists('.env.example');
const apiUrlMatch = envExample.match(/EXPO_PUBLIC_API_URL\s*=\s*(\S+)/);
const apiUrl = apiUrlMatch ? apiUrlMatch[1] : null;
const isPrivateLan = apiUrl && /^http:\/\/(localhost|127\.0\.0\.1|10\.|192\.168\.|YOUR-)/.test(apiUrl);

if (!apiUrl) {
  console.log('⚠️  EXPO_PUBLIC_API_URL not found in .env.example - skipping');
  passed++;
} else if (apiUrl.startsWith('https://')) {
  console.log('✅ API endpoint uses HTTPS');
  passed++;
} else if (isPrivateLan) {
  console.log('ℹ️  API endpoint is http:// but points at a local dev machine - fine for local dev, must be https:// in production');
  passed++;
} else {
  console.log(`❌ Insecure non-local HTTP endpoint: ${apiUrl}`);
  failed++;
}

// 📊 Summary
console.log('\n=======================================');
console.log('📊 Audit Complete:');
console.log(`   ✅ ${passed} checks passed`);
console.log(`   ❌ ${failed} checks failed`);

if (failed === 0) {
  console.log('\n🎉 All checks passed.');
} else {
  console.log('\n⚠️  Issues found - review the ❌ lines above before shipping.');
}
