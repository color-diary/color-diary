# color-diary

## 협업 룰

npm

css: tailwind css

전역관리: zustand

변수명: 축약하지말고 시멘틱하게(btn X → button) ,카멜케이스

함수명 : 동사로 , 이벤트핸들러 함수는 handle로 시작

컴포넌트 : 화살표함수(기본) , rafce

주석: 주석 X, pr템플릿 꼼꼼히 작성 리뷰 꼼꼼히 하기

- main, dev, feature 브랜치로 관리
- 브랜치명: feature/기능 , feature/signup, feature/article, hotfix/login 형식으로 사용

기능별로 브랜치파고 머지하고 브랜치 바로 삭제하기

- PR 사용 필수 (2명) 코드리뷰 간단히라도 하기

| 작업 타입   | 작업내용                       |
| ----------- | ------------------------------ |
| ✨ update   | 해당 파일에 새로운 기능이 생김 |
| 🎉 add      | 없던 파일을 생성함, 초기 세팅  |
| 🐛 bugfix   | 버그 수정                      |
| ♻️ refactor | 코드 리팩토링                  |
| 🩹 fix      | 코드 수정                      |
| 🚚 move     | 파일 옮김/정리                 |
| 🔥 del      | 기능/파일을 삭제               |
| 🍻 test     | 테스트 코드를 작성             |
| 💄 style    | css                            |
| 🙈 gitfix   | gitignore 수정                 |
| 🔨script    | package.json 변경(npm 설치 등) |

## ❗Button 컴포넌트 사용 시 svg 적용하는 법

```tsx
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
  <path d="도형 경로" fill="currentColor" />
</svg>
```
