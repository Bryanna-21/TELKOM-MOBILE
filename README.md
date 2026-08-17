# Telkom Plus — Expo Go fixed baseline

The uploaded project had several hard blockers: missing screen modules, invalid JavaScript syntax in the USSD service, a missing NetInfo dependency, obsolete Expo SDK 50 dependencies, missing assets, and a broken SQLite API for the target Expo version.

This version targets **Expo SDK 54**, which is the Expo Go version currently supported on physical devices. Expo SDK 54 uses React Native 0.81 and React 19.1.

## Fixed in this pass

- **Two conflicting `.gitignore` files.** `gitignore` (no leading dot — invisible to git) held the real, security-conscious rules (keystores, `google-services.json`, `.env.production`, certificates); `.gitignore` (the one git actually reads) was a minimal 6-line version. None of those sensitive-file patterns were actually being enforced. Merged into a single proper `.gitignore`.
- **Missing `react-native-gesture-handler` bootstrap import.** React Navigation's Stack Navigator requires `import 'react-native-gesture-handler';` as the first line of the entry file, or gesture-based screen transitions can misbehave. Added to `App.js`.
- **Hardcoded encryption key baked into the client bundle.** `src/services/encryption.js` used a static string constant (`'telkom_plus_master_key_2024'`) as the AES key — the same key in every install, trivially recoverable from the compiled JS bundle. Replaced with a random key generated once per device and stored in `expo-secure-store` (hardware-backed keychain/keystore).
- **Two duplicate, unused encryption/storage implementations removed.** `src/services/encryptionService.js` and `src/services/secureStorage.js` both depended on `react-native-mmkv`, which was never added to `package.json`, and neither file was imported anywhere in the app. Deleted as dead code from an abandoned refactor.
- **PIN authentication fallback was a dead end.** `authenticateWithPin()` required a `pin` argument that nothing in the app ever collected — meaning on any device without enrolled biometrics, every `requireAuth()`-gated action (Send Money, Pay Bill, Lipa T-Kash) failed permanently with no way to complete it. Added `src/components/PinEntryModal.js` and wired it into `useBiometricAuth` as a real, working fallback.
- **`scripts/security-audit.js` checked the wrong files.** Nearly every check (encryption, network monitoring, GSM fallback, secure storage) only read `App.js`, which is just the navigation shell — none of that logic lives there. Rewritten so each check reads the file that actually implements the feature; verified it runs and genuinely passes with `node scripts/security-audit.js`.

## Known gaps (not silently patched)

- `ScanScreen.js` is an explicit UI placeholder — no real camera/QR integration despite the `expo-camera` permission being declared in `app.json`.
- `MerchantLocatorScreen.js` doesn't call `expo-location` despite the location permission being declared — appears to use static coordinates.
- `HomeScreen.js` and `MoreScreen.js` are fully built but unreachable from any navigator — not wired into `App.js` or `BottomTabNavigator.js`. Left in place rather than deleted since they look like intended future screens, not abandoned drafts.

## Run

```bash
npm install
npx expo install
npx expo start --clear
```

For a physical phone, set `EXPO_PUBLIC_API_URL` to your computer's LAN address rather than `localhost`.

The UI shell can run without a backend. Real financial transactions require a real backend and verified Telkom integration; the app does not magically create a payment rail by being enthusiastic.
