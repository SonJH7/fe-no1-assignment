import { TMDB_API_KEY } from './config.js';

const BASE_URL = 'https://api.themoviedb.org/3';

/*
GET 요청을 보내고 JSON을 반환.
 */
async function _get(endpoint) {
    const sep = endpoint.includes('?') ? '&' : '?';
    const url = `${BASE_URL}${endpoint}${sep}api_key=${TMDB_API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.status_message || 'API 호출 실패');
        }
        return data;
    } catch (err) {
        console.error(`API 요청 오류 (${endpoint}):`, err);
        throw err;
    }
}

/* 주간 트렌딩 영화 목록 조회 */
export async function getTrending() {
    try {
        const { results } = await _get('/trending/movie/week');
        return results;
    } catch (err) {
        throw new Error(`주간 트렌딩 조회 실패: ${err.message}`);
    }
}

/* 영화 검색 */
export async function searchMovies(query) {
    try {
        const { results } = await _get(`/search/movie?query=${encodeURIComponent(query)}`);
        return results;
    } catch (err) {
        throw new Error(`영화 검색 실패: ${err.message}`);
    }
}

/* 영화 상세 정보 조회 한국어로,, */
export async function getMovieDetail(id) {
    try {
        return await _get(`/movie/${id}?language=ko`);
    } catch (err) {
        throw new Error(`영화 상세 조회 실패: ${err.message}`);
    }
}
