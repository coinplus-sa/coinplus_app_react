
d := $(shell docker ps -a -q)

build:
	docker build -f docker/android/Dockerfile -t android_build .

run:
	docker run --rm -i -t  --name android_build android_build
  

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

getbuild:
	docker cp android_build:/coinplus_app_react/android/app/build/outputs/apk/release/app-release.apk app-release.apk
  
assemble:
	docker exec -it android_build /bin/bash -c 'export ANDROID_HOME=/android-studio/ && cd /coinplus_app_react/android  && ./gradlew  assembleRelease'


clean:
	if [ ! -z "${d}" ] ; then \
		docker rm  ${d} ; \
	fi;


