<template>
    <div class="diary-view-container">
        <div class="header">
            <h1>일기</h1>
        </div>
        <div class="user-info">
            <img :src="user.profileImg" alt="Profile Image" class="profile-image" />
            <div>
                <h4>{{ user.nickname }}</h4>
                <p>{{ privacyText }}</p>
            </div>
        </div>
        <div v-if="diary" class="diary-entry">
            <p>Date: {{ diary.dDate }}</p>
            <div class="emotem">
                <p>{{ diary.emoji }}</p>
                <div class="temperature-view" v-if="diary.temperature !== ''">
                    <span v-if="diary.temperature !== null">{{ diary.temperature }}°</span>
                    <div class="temperature-gauge" v-if="diary.temperature !== null">
                        <div class="temperature-fill" :style="{ width: diary.temperature + '%' }"></div>
                    </div>
                </div>
            </div>
            <h1>{{ diary.title }}</h1>
            <p>{{ diary.contents }}</p>

            <div v-if="diary.diaryimg">
                <img :src="diary.diaryimg" alt="Diary Image" style="max-width: 100%; height: auto" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        id: String, // 라우터에서 전달된 id를 prop으로 받음
    },
    data() {
        return {
            diary: null,
            user: {
                profileImg: '',
                nickname: '',
                privacy: '',
            },
        };
    },
    computed: {
        privacyText() {
            switch (this.user.privacy) {
                case '1':
                case 'open':
                    return '🌐 전체공개';
                case '2':
                    return '👥 팔로워 공개';
                case '3':
                    return '🔒 나만보기';
                default:
                    return '';
            }
        },
    },
    methods: {
        async fetchUserInfo() {
            try {
                const res = await axios.get('http://localhost:8080/member/profile', {
                    headers: {
                        // 세션스토리지에 있는 토큰값을 가져와서 header에 넣어준다.
                        access: sessionStorage.getItem('access'),
                    },
                });
                console.log(res.data);
                this.user = res.data;
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        },
        async fetchDiaryData() {
            try {
                // 서버로부터 다이어리 데이터 가져오기
                const response = await axios.get(`http://localhost:8080/diary/${this.id}`, {
                    headers: { access: sessionStorage.getItem('access') },
                    withCredentials: true,
                });
                this.diary = response.data; // 다이어리 데이터를 설정
            } catch (error) {
                console.error('Failed to fetch diary data:', error);
            }
        },
        goBack() {
            this.$router.go(-1); // 뒤로 가기
        },
    },
    created() {
        this.fetchUserInfo(); // 컴포넌트가 생성될 때 사용자 정보 가져오기
        this.fetchDiaryData(); // 컴포넌트가 생성될 때 다이어리 데이터 가져오기
    },
};
</script>

<style scoped>
@import '@/assets/diarydetail.css';
</style>
