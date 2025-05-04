# 🎬 Movie Explorer

Movie Explorer는 **TMDB(The Movie Database) API**를 이용해 실시간 영화 정보를 제공하는 순수 HTML/CSS/JavaScript 웹 애플리케이션입니다.  
사용자는 인기(트렌딩) 영화 목록을 확인하고, 키워드 검색으로 영화를 찾고, 상세 정보 모달로 개요를 살펴보며, 관심 영화는 북마크하여 나중에 다시 볼 수 있습니다.

---

## 🚀 주요 기능

1. **주간 트렌딩 영화 조회**  
   - TMDB API의 `/trending/movie/week` 엔드포인트로 요일별 인기 영화 자동 로딩  
2. **영화 검색**  
   - 검색어 입력 후 버튼 클릭 또는 Enter 키로 TMDB `/search/movie` 호출  
   - **디바운싱(debounce)** 적용으로 과도한 API 요청 방지  
3. **영화 상세 모달**  
   - 카드 클릭 시 모달을 오픈하고 `/movie/{id}?language=ko`로 상세 정보 로드  
   - 개봉일, 평점, 장르, 줄거리 제공  
   - “← 뒤로” 버튼으로 모달 닫기  
4. **북마크(좋아요) 기능**  
   - 각 카드에 ★/☆ 버튼으로 토글  
   - `localStorage`에 영화 ID 저장·삭제  
   - “북마크 보기” 버튼으로 저장된 영화만 다시 불러오기  
5. **이벤트 위임(Event Delegation)**  
   - `.movie-card` 클릭, 북마크 버튼 클릭을 상위 컨테이너에 위임 처리  
6. **반응형 디자인**  
   - CSS Grid와 미디어쿼리로 데스크탑·태블릿·모바일 화면 대응  

---

## ⚙️ 동작 과정

1. 페이지 로드 → `DOMContentLoaded` 이벤트  
2. **로딩 메시지** 출력 후 `getTrending()` 호출  
3. API 응답 데이터로 `renderMovies()` 실행 → 카드 그리드 표시  
4. 사용자가  
   - 검색어 입력 → `doSearch()`  
   - Enter 키 → `doSearch()`  
   - 카드 클릭 → `getMovieDetail(id)` → 모달 표시  
   - 북마크 버튼 클릭 → `toggleBookmark(id)` → `renderMovies()` 재호출  
   - 북마크 보기 버튼 클릭 → 저장된 ID 목록으로 `getMovieDetail(id)` 병렬 호출  
5. 비동기 오류 발생 시 UI에 에러 메시지 출력  

---

## 🛠 사용 기술

- **HTML5 / CSS3 / JavaScript(ES6 Modules)**
- **Fetch API** + **async/await**  
- **LocalStorage** (북마크 데이터 저장)
- **CSS Grid & Flexbox** (레이아웃)  
- **Debounce** (성능 최적화)  
- **Event Delegation** (이벤트 효율 개선)

---

## 📁 프로젝트 구조
project-root/
└ src/
├ main.html # 애플리케이션 진입 HTML
├ style.css # 전역 스타일 & 반응형 레이아웃
└ js/
├ config.js # TMDB API 키 (gitignore)
├ api.js # TMDB API 호출 모듈
├ ui.js # DOM 조작·렌더링 모듈
└ app.js # 애플리케이션 로직·이벤트 바인딩


동작과정

메인화면
![스크린샷 2025-05-04 215147](https://github.com/user-attachments/assets/52f878e2-5eea-4bf6-b499-8855969edbae)
![스크린샷 2025-05-04 212501](https://github.com/user-attachments/assets/f55ffafa-2240-44d1-bc75-67ed2fbac497)
북마크 보기
![스크린샷 2025-05-04 215155](https://github.com/user-attachments/assets/7533eac1-d572-410a-82b7-509b14cfab81)
검색 최적화 디바운싱을 활용
![스크린샷 2025-05-04 215230](https://github.com/user-attachments/assets/93383d1e-6b8e-4182-9acc-bca6bae051a9)
![스크린샷 2025-05-04 215240](https://github.com/user-attachments/assets/2b5eb40b-f9f4-475f-b195-15414193340f)
상세정보 모달
![스크린샷 2025-05-04 215328](https://github.com/user-attachments/assets/98d628b8-0102-4530-8aac-610781922785)
