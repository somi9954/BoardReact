# AWS 설정 방법
<img width="586" alt="20240411_000214" src="https://github.com/somi9954/BoardReact/assets/137499604/aff2dbbb-f116-43c2-a9e5-e7a6def994ba"><br/>
- https://www.youtube.com/watch?v=3B_yztJwcFU&list=PLbq5jHjpmq7r5vAA6_vf6Nuf-uGi_V3AZ&index=1부터 10까지 있습니다.

### 인스턴스 web 구성(우분투)
```java
sudo apt-get install git
sudo apt install git
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
source ~/.bashrc
nvm list-remote
nvm install v18.16.0
nvm list-remote 현재 버전 확인
node --version
npm --version
npx --version
npm install -g pm2
npm install -g npm @10.5.1
```

### 인스턴스 was 구성(우분투)
```java
sudo apt update
sudo apt install openjdk-17-jdk
java -version
echo $JAVA_HOME
cd /usr/lib/jvm
ubuntu@ip-10-0-41-13:/usr/lib/jvm$ ls
ubuntu@ip-10-0-41-13:/usr/lib/jvm$ cd ~
sudo vi /etc/environment
i 누르고JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"두번째칸에 입력 esc 누르고 :wq 
source /etc/environment
echo $JAVA_HOME 확인
```

### 스프링부트 ec2 빌드 
```java
was01에서 sudo apt install unzip 그래들 설치 wget https://services.gradle.org/distributions/gradle-8.5-bin.zip
sudo /opt/gradle 폴더 생성 하기전에 sudo su - passwd ubuntu ranhee9954! 패스워드 설정 나갔다가 다시 들어온 뒤에 ls 확인 후 sudo mkdir /opt/gradle
sudo unzip -d /opt/gradle gradle-8.5-bin.zip
echo "export PATH=$PATH:/opt/gradle/gradle-8.5/bin" | sudo tee -a /etc/profile.d/gradle.sh
source /etc/profile.d/gradle.sh
git clone https://github.com/somi9954/BoardReact.git
BoardReact  gradle-8.5-bin.zip
ubuntu@ip-10-0-41-13:~$ cd BoardReact
ubuntu@ip-10-0-41-13:~/BoardReact$ gradle clean build
cd build 
ls확인
cd libs
ls 확인

BoardReact-0.0.1-plain.jar  BoardReact-0.0.1.jar
```

### 무중단 배포
```java
pm2 설치 후  ecosystem.config.js 만들기
ecosystem.config.js 설정
module.exports = {
  apps : [{
    name: 'BoardReact',
    script: 'java',
    args: ['-jar', 'BoardReact/build/libs/BoardReact-0.0.1.jar']
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
  설정 후 pm2 start ecosystem.config.js
pm2 status로 상태 확인
pm2 save로 저장
pm2 log로 확인
```
### 리액트 빌드
- pm2와 serve 설치 후 pm2 serve buill 서버코드
pm2 status로 상태 확인
pm2 save로 저장
pm2 log로 확인

#### CI/CD가 아닌 재배포시 
- 재배포 https://velog.io/@kimujin99/Side-project-AWS-EC2%EC%97%90-Spring-project-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B03

#### cors 
- https://velog.io/@wnguswn7/CORS-%EC%97%90%EB%9F%AC-Access-to-XMLHttpRequest-at-from-origin-has-been-blocked-by-CORS-policy

#### 배포 후 사이트 연결 에러
- https://www.inflearn.com/questions/299112/front-%EB%B0%B0%ED%8F%AC-%ED%9B%84-%EC%82%AC%EC%9D%B4%ED%8A%B8-%EC%97%B0%EA%B2%B0%ED%95%A0-%EC%88%98-%EC%97%86%EC%9D%8C-%EB%AC%B8%EC%A0%9C-%EC%A7%88%EB%AC%B8%EB%93%9C%EB%A6%BD%EB%8B%88%EB%8B%A4?commentId=135004

#### 배포 후 미국 시간으로 등록되어 데이터 추가 시 미국 시간 반영 -> 수정 
- https://limdevbasic.tistory.com/5#google_vignette

