from ubuntu:18.04

env DEBIAN_FRONTEND=noninteractive
SHELL ["/bin/bash", "-c"]
run apt-get update
run apt-get install openjdk-8-jdk -y
run apt-get install curl -y
run apt-get install nodejs -y
run apt-get install zip unzip -y
run apt-get install python make  -y
run apt-get install build-essential -y
run apt-get install git -y

workdir /
run curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash
run . /root/.nvm/nvm.sh  &&  nvm install v10.16.3
run curl -o android-studio-ide-linux.tar.gz https://dl.google.com/dl/android/studio/ide-zips/3.5.1.0/android-studio-ide-191.5900203-linux.tar.gz
run tar xf android-studio-ide-linux.tar.gz
workdir /android-studio
run curl  https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip -o tools.zip
run unzip tools.zip
env ANDROID_HOME=/android-studio/ 
run apt-get install expect -y
run expect -c 'spawn /android-studio/tools/bin/sdkmanager "platform-tools" "platforms;android-29"; sleep 5; expect -re "Accept(.)*: "; send "y\r\n"; expect EOF'

copy apk.private.key.keystore /apk.private.key.keystore
workdir /coinplus_app_react
copy ./package.json .
copy ./package-lock.json .
run . /root/.nvm/nvm.sh && npm install
run . /root/.nvm/nvm.sh && npm install bitbox-sdk

run . /root/.nvm/nvm.sh && npm run postinstall
copy . /coinplus_app_react
run true
workdir /coinplus_app_react/android
#run . /root/.nvm/nvm.sh && export ANDROID_HOME=/android-studio/  && ./gradlew  assembleRelease
run . /root/.nvm/nvm.sh && npm install -g react-native-cli
workdir /coinplus_app_react/
cmd bash
