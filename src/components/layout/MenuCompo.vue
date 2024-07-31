<template>
    <div id="menucompo">
        <a href="/feed"><img src="@/assets/todotodo-logo.png" alt="" /></a>
        <a href="/feed"
            ><div class="menu-list"><label>&#127759;</label> 피드</div></a
        >
        <a href="/list"
            ><div class="menu-list"><label>&#127960;</label> 둘러보기</div></a
        >
        <a href="/"
            ><div class="menu-list">
                <label>&#128477;</label> <span v-if="isLogin">로그아웃</span><span v-if="!isLogin">로그인</span>
            </div></a
        >
        <a href="/mypage"
            ><div class="menu-list"><label>&#128129;</label> 마이페이지</div></a
        >
    </div>
</template>

<script>
export default {
    data() {
        return {
            isLogin: true,
        };
    },
    mounted: function () {
        if (sessionStorage.getItem('access') === null) {
            this.isLogin = false;
            alert('로그인 후 이용가능합니다.');
            this.$router.push('/');
        } else {
            this.isLogin = true;
            console.log('현재 로그인한 유저명 : ' + sessionStorage.getItem('email'));
        }
        console.log('로그인 여부 : ' + this.isLogin);
    },
};
</script>

<style scoped>
img {
    width: 200px;
    margin: 0 0 0 3vw;
}
.menu-list {
    margin: 3vh 0 0 4vw;
    font-size: 20px;
}
a {
    color: black; /* 기본 글자 색상 설정 */
    text-decoration: none; /* 밑줄 제거 */
}
</style>
