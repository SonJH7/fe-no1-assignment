// src/js/app.js
import { getTrending, searchMovies, getMovieDetail } from './api.js';
import {
    renderMovies,
    showModalLoading,
    renderMovieDetail,
    renderErrorInModal,
    setupModalClose,
    getContainer
} from './ui.js';

// debounce 유틸
function debounce(fn, delay = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// 로컬스토리지 북마크 키
const STORAGE_KEY = 'movieBookmarks';

// 북마크 로드/저장/토글
function loadBookmarks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}
function saveBookmarks(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
function toggleBookmark(id) {
    const list = loadBookmarks();
    const idx = list.indexOf(id);
    if (idx > -1) list.splice(idx, 1);
    else list.push(id);
    saveBookmarks(list);
    return loadBookmarks();
}

const container = getContainer();
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const viewBookmarksBtn = document.getElementById('view-bookmarks-btn');


// 1) 초기 로드
document.addEventListener('DOMContentLoaded', async () => {
    container.innerHTML = '<p>로딩 중…</p>';
    try {
        const trending = await getTrending();
        renderMovies(trending, loadBookmarks());
    } catch (err) {
        container.innerHTML = `<p>초기 데이터 로드 실패: ${err.message}</p>`;
    }
});

// 2) 검색 함수 (버튼 또는 Enter)
async function doSearch() {
    const q = searchInput.value.trim();
    if (!q) return;

    container.innerHTML = '<p>로딩 중…</p>';

    try {
        const results = await searchMovies(q);
        renderMovies(results, loadBookmarks());
    } catch (err) {
        container.innerHTML = `<p>검색 중 오류 발생: ${err.message}</p>`;
    }
}
searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') doSearch();
});
// 디바운싱 추가 (입력 시 자동 검색)
searchInput.addEventListener('input', debounce(doSearch, 600));

// 3) 이벤트 위임: 카드 클릭 & 북마크 클릭
container.addEventListener('click', async e => {
    const card = e.target.closest('.movie-card');
    if (!card) return;

    // 북마크 버튼 클릭
    if (e.target.matches('.bookmark-btn')) {
        const id = Number(e.target.dataset.id);
        const updated = toggleBookmark(id);
        // 현재 화면의 영화들만 재렌더링
        const current = Array.from(container.children).map(c => ({
            id: Number(c.dataset.id),
            title: c.querySelector('h3').innerText,
            vote_average: parseFloat(c.querySelector('.rating').innerText.slice(2)),
            poster_path: c.querySelector('img').src.replace('https://image.tmdb.org/t/p/w300', '')
        }));
        renderMovies(current, updated);
        return;
    }

    // 카드 영역 클릭 → 모달 상세 조회
    const id = Number(card.dataset.id);
    try {
        showModalLoading();
        const detail = await getMovieDetail(id);
        renderMovieDetail(detail);
    } catch (err) {
        console.error(err);
        renderErrorInModal(err.message);
    }
});

// 4) “북마크 보기” 클릭 핸들러
viewBookmarksBtn.addEventListener('click', async () => {
    const ids = loadBookmarks();
    // 로딩 표시
    container.innerHTML = '<p>로딩 중…</p>';

    if (ids.length === 0) {
        container.innerHTML = '<p>북마크된 영화가 없습니다.</p>';
        return;
    }

    try {
        // 각 ID별 상세 정보 가져오기
        const details = await Promise.all(
            ids.map(id => getMovieDetail(id))
        );
        // renderMovies는 배열 안의 객체에서 poster_path, title, vote_average, id를 사용합니다.
        renderMovies(details, ids);
    } catch (err) {
        container.innerHTML = `<p>북마크 로드 실패: ${err.message}</p>`;
        console.error(err);
    }
});

// 모달 닫기 세팅
setupModalClose();
