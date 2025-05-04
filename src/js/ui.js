const IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';
const container = document.getElementById('movie-container');
const modal = document.getElementById('movie-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

/** 영화 목록 렌더링 */
export function renderMovies(movies, bookmarks = []) {
  container.innerHTML = '';
  if (!Array.isArray(movies) || movies.length === 0) {
    container.innerHTML = '<p>검색 결과가 없습니다.</p>';
    return;
  }

  movies.forEach(m => {
    const isBookmarked = bookmarks.includes(m.id);
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.id = m.id;
    card.innerHTML = `
      <img src="${m.poster_path ? IMAGE_BASE + m.poster_path : ''}" alt="${m.title}" />
      <div class="info">
        <h3>${m.title}</h3>
        <div class="rating">⭐ ${m.vote_average.toFixed(1)}</div>
        <button class="bookmark-btn" data-id="${m.id}">
          ${isBookmarked ? '★' : '☆'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

/** 모달 로딩 표시 및 오픈 */
export function showModalLoading() {
  modalBody.innerHTML = '<p>로딩 중…</p>';
  modal.classList.remove('hidden');
}

/** 모달에 영화 상세 정보 렌더링 */
export function renderMovieDetail(detail) {
  modalBody.innerHTML = `
    <img src="${detail.poster_path ? IMAGE_BASE + detail.poster_path : ''}" alt="${detail.title}" />
    <h2>${detail.title}</h2>
    <div class="details">
      개봉일: ${detail.release_date} | ⭐ ${detail.vote_average.toFixed(1)}<br/>
      장르: ${detail.genres.map(g => g.name).join(', ')}
    </div>
    <p>${detail.overview}</p>
  `;
}

/** 모달에 에러 메시지 표시 */
export function renderErrorInModal(message) {
  modalBody.innerHTML = `<p>상세 정보 로드 실패: ${message}</p>`;
  modal.classList.remove('hidden');
}

/** 모달 닫기 버튼 핸들러 세팅 */
export function setupModalClose() {
  modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
    modalBody.innerHTML = '';
  });
}

/** 외부에서 container 접근용 */
export function getContainer() {
  return container;
}
