<template>
    <div id="menucompo">
        <a href="/feed"><img src="@/assets/todotodo-logo.png" alt=""></a>
        <a href="/feed"><div class="menu-list"><label>&#127759;</label> 피드</div></a>
        <a href="/list"><div class="menu-list"><label>&#127960;</label> 둘러보기</div></a>
        <a href="/"><div class="menu-list"><label>&#128477;</label> 로그인/로그아웃</div></a>
        <a href="/mypage"><div class="menu-list"><label>&#128129;</label> 마이페이지</div></a>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
img {
    width: 200px;
    margin: 0 0 0 3vw;
}
.menu-list {
    margin:  3vh 0 0 4vw;
    font-size: 20px;
}
a{
    color: black; /* 기본 글자 색상 설정 */
    text-decoration: none; /* 밑줄 제거 */
}
</style>