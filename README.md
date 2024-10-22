# React로 게시판 사이트 만들기📝
- http://freeboard.store
- REST API 작성부터 프론엔드 개발까지 혼자만의 개발 레퍼런스 만들기 

#### 메인화면
![1](https://github.com/somi9954/BoardReact/assets/137499604/92bd2f2d-f87e-4c4c-9c7d-38537e1da0e0)
#### 게시물 전체보기(페이지네이션)
![2](https://github.com/somi9954/BoardReact/assets/137499604/94b9635a-ec80-45b0-b975-b39e4678868c)
#### 게시물 상세보기(댓글 기능)
![3](https://github.com/somi9954/BoardReact/assets/137499604/c6d721ab-3dd9-4df6-a095-ca4d87ddf65b)

## 개발 환경
- IntellJ IDEA (API 개발 개발환경, REACT PROJECT) 
- MySQL Workbench 8.0 CE(DB 툴)
- AWS EC2, RDS (배포 툴, DB 툴)

## 개발 기간 
- 2024.02.27 ~ 2024.04.17

## ⚙️기술 스택
#### ✔️프론트엔드
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"><img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"><img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
#### ✔️Back-end
<img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white"><img src="https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=Spring&logoColor=green"><img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=for-the-badge&logo=Spring Boot&logoColor=yellow"><img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"><img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtoken&logoColor=white"><img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=for-the-badge&logo=Amazon%20AWS&logoColor=white"/>

## 프로젝트 주요 기능
#### 회원가입
- 회원가입 시 암호화(hashing)화 되어 DB에 저장.
- id, password, nickname validation을 통해 필수 항목 검증
#### 로그인, 로그아웃
- 로그인 성공시 .yml에 jwt 시간을 저장 ➔ 새로고침해도 로그인 상태 유지
- 로그아웃시 jwt 삭제
#### 관리자 페이지 
- 사이트 설정 관리
- 게시판 추가, 수정, 삭제
- 게시판 목록에서 선택시 수정
#### 게시물 CRUD
- 게시물 등록, 삭제, 수정 (로그인한 사용자만 가능)
- 게시물 수정의 경우 사용자가 이전에 작성한 게시물의 상태를 그대로 불러와서 보여줌
- 게시판 페이지에서 모든 사용자가 작성한 게시물을 확인할 수 있음
- 게시판과 내 게시물 페이지는 모두 pagination 기능이 포함되어 있어서 렌더링 시간과 서버의 response 대기 시간을 줄임
#### 댓글 기능
- 게시물 상세보기 페이지에서 댓글 등록 및 수정, 삭제 (로그인한 사용자만 가능)
- pagination으로 댓글 목록 보기
- 댓글의 pagination은 누르면 다음 페이지에 해당하는 댓글을 가져오도록 구현

### 돌아보며
- FrontEnd를 개발할 때 꼭 들어가야 하는 회원가입, 게시물 CRUD, 크로스 브라우징, pagination, 상태 관리 등 여러 기술을 포함해서 개발환경 설정부터 배포까지 나만의 레퍼런스를 만들기 위해 프로젝트를 진행했습니다. 혼자 기획, FrontEnd와 BackEnd 개발을 진행하고 문제가 생기면 혼자 찾아보며 해결을 해야 해서 힘들었으나 배포까지 해서 매우 뿌듯하였습니다. 배포 후 보안할점이 많이 보여서 다음 프로젝트시에는 보안한점들을 적용해서 배포를 할거 같습니다. 다음에는 typeScript를 사용해보고 더욱 다양한 상태 관리 라이브러리와 기술을 이용해서 많은 기능이 추가된 프로젝트를 진행해보고 싶다. 그리고 SSL을 사용하여 https를 만드는것도 배포시에 해보고 싶습니다.

