// JWT 토큰을 가져오는 유틸리티 함수
export function getToken() {
    return localStorage.getItem('token'); // 로컬 스토리지에서 JWT 토큰을 가져옴
}
