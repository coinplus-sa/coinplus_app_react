# App Comute Key

## Setup

Please follow the "Getting started" guide from React Native ("Building Projects with Native Code", both iOS and Android): https://facebook.github.io/react-native/docs/getting-started

## Install

Clone the repo and type:

```sh
yarn install
```

### Manual steps

#### iOS

Follow the steps: https://github.com/Crypho/react-native-scrypt#manual-installation

#### Android

Update `node_modules/react-native-scrypt/android/build.gradle`

```
android {
    compileSdkVersion 26
    buildToolsVersion "26.0.3"

    defaultConfig {
        ...
        targetSdkVersion 26
```

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
yarn lint
```

### Test

```sh
yarn test
```
