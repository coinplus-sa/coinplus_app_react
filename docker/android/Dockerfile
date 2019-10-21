from ubuntu:18.04
SHELL ["/bin/bash", "-c"]
run apt-get update
run apt-get install openjdk-8-jdk -y
run apt-get install curl -y
run apt-get install nodejs -y
run apt-get install zip unzip -y

run curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash
run . /root/.nvm/nvm.sh  &&  nvm install v10.16.3
run curl -o android-studio-ide-linux.tar.gz https://dl.google.com/dl/android/studio/ide-zips/3.5.1.0/android-studio-ide-191.5900203-linux.tar.gz
run tar xf android-studio-ide-linux.tar.gz
workdir /android-studio
run curl  https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip -o tools.zip
run unzip tools.zip
run export ANDROID_HOME=/android-studio/ 
run apt-get install expect -y
run expect -c 'spawn /android-studio/tools/bin/sdkmanager "platform-tools" "platforms;android-28"; sleep 5; expect -re "Accept(.)*: "; send "y\r\n"; expect EOF'
run apt-get install python make  -y
run apt-get install build-essential -y

copy apk.private.key.keystore /apk.private.key.keystore
copy . /coinplus_app_react
workdir /coinplus_app_react
run . /root/.nvm/nvm.sh && npm install
run . /root/.nvm/nvm.sh && node node_modules/rn-nodeify/cmd.js  --install assert,buffer,crypto,events,process,stream,vm --hack
run true
workdir /coinplus_app_react/android
#run . /root/.nvm/nvm.sh && export ANDROID_HOME=/android-studio/  && ./gradlew  assembleRelease

cmd bash
