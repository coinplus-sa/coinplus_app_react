
d := $(shell docker ps -a -q)

build:
	docker build -f docker/android/Dockerfile -t android_build .
buildnocache:
	docker build -f docker/android/Dockerfile -t android_build --no-cache .

run_test:
	docker exec -it android_build /bin/bash -c '. /root/.nvm/nvm.sh && cd /coinplus_app_react/ && npm test'

run:
	docker run --rm -i -t  --privileged -v /dev/bus/usb:/dev/bus/usb  --name android_build android_build
  

cbr: clean br

br: build run

connect:
	docker exec -it android_build /bin/bash


stop:    
	docker stop  android_build
	
logs:
	docker logs -f android_build

  
update:
	docker cp src android_build:/coinplus_app_react/
	docker cp android android_build:/coinplus_app_react/
	docker cp package.json android_build:/coinplus_app_react/
	docker cp shim.js android_build:/coinplus_app_react/

getbuild:
	docker cp android_build:/coinplus_app_react/android/app/build/outputs/apk/release/app-release.apk app-release.apk
  
assemble:
	docker exec -it android_build /bin/bash -c 'export ANDROID_HOME=/android-studio/ && cd /coinplus_app_react/android  && ./gradlew  assembleRelease'

  
run-android:
	docker exec -it android_build /bin/bash -c '. /root/.nvm/nvm.sh && export ANDROID_HOME=/android-studio/ && cd /coinplus_app_react && react-native run-android'
log-android:
	docker exec -it android_build /bin/bash -c '. /root/.nvm/nvm.sh && export ANDROID_HOME=/android-studio/ && cd /coinplus_app_react && react-native log-android'


clean:
	if [ ! -z "${d}" ] ; then \
		docker rm  ${d} ; \
	fi;


