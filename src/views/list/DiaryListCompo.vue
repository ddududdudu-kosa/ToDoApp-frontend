<template>
    <div>
        <!--        <hr />-->
        <!--        <hr />-->
        <!--        <div v-if="diaryList.length > 0" class="diary-entry">-->
        <!--            <p class="diaryDate">{{ diaryList[0].diaryDate }}</p>-->
        <!--            &lt;!&ndash; 날짜 데이터가 필요한 경우 추가 &ndash;&gt;-->
        <!--            <p class="emoji">{{ diaryList[0].emoji }}</p>-->
        <!--            &lt;!&ndash; 이모티콘 데이터가 필요한 경우 추가 &ndash;&gt;-->
        <!--            <p class="id">{{ diaryList[0].id }}</p>-->
        <!--            <p class="memberId">{{ diaryList[0].memberId }}</p>-->
        <!--            <p class="nickname">{{ diaryList[0].nickname }}</p>-->
        <!--            <p class="privacy">{{ diaryList[0].privacy }}</p>-->
        <!--            <img-->
        <!--                :src="diaryList[0].profileImg"-->
        <!--                alt="profile image"-->
        <!--                class="profile-img"-->
        <!--                style="width: 50px; height: 50px"-->
        <!--            />-->
        <!--            <p class="temperature">{{ diaryList[0].temperature }}</p>-->
        <!--            &lt;!&ndash; 온도 데이터가 필요한 경우 추가 &ndash;&gt;-->
        <!--            <p class="title">{{ diaryList[0].title }}</p>-->
        <!--            &lt;!&ndash; 제목 데이터가 필요한 경우 추가 &ndash;&gt;-->
        <!--        </div>-->

        <hr />
        <hr />

        <div v-for="item in diaryList" :key="item.id" class="diary-entry">
            <p class="diaryDate">{{ item.diaryDate }}</p>
            <!-- 날짜 데이터가 필요한 경우 추가 -->
            <p class="emoji">{{ item.emoji }}</p>
            <!-- 이모티콘 데이터가 필요한 경우 추가 -->
            <p class="id">{{ item.id }}</p>
            <p class="memberId">{{ item.memberId }}</p>
            <p class="nickname">{{ item.nickname }}</p>
            <p class="privacy">{{ item.privacy }}</p>
            <img :src="item.profileImg" alt="profile image" class="profile-img" style="width: 50px; height: 50px" />
            <p class="temperature">{{ item.temperature }}</p>
            <!-- 온도 데이터가 필요한 경우 추가 -->
            <p class="title">{{ item.title }}</p>
            <!-- 제목 데이터가 필요한 경우 추가 -->
            <hr />
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            diaryList: [],
        };
    },
    methods: {
        async getDiaries() {
            try {
                const res = await axios.get('http://localhost:8080/diary/recentList', {
                    headers: {
                        access: sessionStorage.getItem('access'),
                    },
                    withCredentials: true,
                });
                console.log(res.data);
                this.diaryList = res.data; // 직접 데이터를 설정
            } catch (error) {
                console.error('Error fetching diaries:', error);
            }
        },
    },
    created() {
        if (sessionStorage.getItem('access')) {
            this.getDiaries();
        }
    },
    mounted() {
        if (!sessionStorage.getItem('access')) {
            alert('로그인 후 이용가능합니다.');
            this.$router.push('/');
        }
        console.log('현재 로그인 : ' + sessionStorage.getItem('email'));
    },
};
</script>

<style scoped></style>
