# App Comute Key

## Setup

Please follow the "Getting started" guide from React Native ("Building Projects with Native Code", both iOS and Android): https://facebook.github.io/react-native/docs/getting-started

## Install

Clone the repo and type:

```sh
sudo apt-get install gradle
sudo npm install -g react-native-cli
sudo npm install -g react-native-git-upgrade

npm install


react-native link

```
create android/local.properties

```
    sdk.dir=/home/benoit/Android/Sdk
```
### Manual steps

#### iOS

Follow the steps: https://github.com/Crypho/react-native-scrypt#manual-installation

## Run

### iOS

```sh
react-native run-ios
```

### Android

```sh
react-native run-android
```

## Dev

### Lint

```sh
npm lint
```

### Jest

```sh
npm jest
```

### Test (Lint + Jest)

```sh
npm test
```

## Common issues

### iOS

> No bundle url present

Solution:

```sh
rm -rf ios/build/
react-native run-ios
```

## Release

### Android

#### Generating a signing key

```sh
keytool -genkey -v -keystore coinplus.keystore -alias coinplus -keyalg RSA -keysize 2048 -validity 10000
```

#### Setting up gradle variables

1. Place the `coinplus.keystore` file under the `android/app` directory in your project folder.
2. Edit the file ``~/.gradle/gradle.properties` and add the following (replace **\*** with the correct keystore password, alias and key password),

```
COINPLUS_RELEASE_STORE_FILE=coinplus.keystore
COINPLUS_RELEASE_KEY_ALIAS=coinplus
COINPLUS_RELEASE_STORE_PASSWORD=*****
COINPLUS_RELEASE_KEY_PASSWORD=*****
```

#### Generating the release APK

```sh
cd android
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
./gradlew assembleRelease
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

```

The generated APK can be found under `android/app/build/outputs/apk/app-release.apk`, and is ready to be distributed.

You can install it with adb: `adb install -r app-release.apk`

Next steps:

- [Testing the release build of your app](https://facebook.github.io/react-native/docs/signed-apk-android#testing-the-release-build-of-your-app)
- [Split APKs by ABI to reduce file size](https://facebook.github.io/react-native/docs/signed-apk-android#split-apks-by-abi-to-reduce-file-size)
- [Enabling Proguard to reduce the size of the APK (optional)](https://facebook.github.io/react-native/docs/signed-apk-android#enabling-proguard-to-reduce-the-size-of-the-apk-optional)

### iOS

...
