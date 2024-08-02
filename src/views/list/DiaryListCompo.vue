<!-- 작성자 : 전민재
    기능 :  일기 리스트 -->
<template>
    <div class="diary-container">
        <div v-for="item in diaryList" :key="item.id" class="diary-entry" @click="navigateToDiary(item.id)">
            <div class="profile-section">
                <img :src="item.profileImg" alt="profile image" class="profile-img" />
            </div>
            <p class="nickname">{{ item.nickname }}</p>

            <p class="emoji" style="margin-left: 10px">{{ item.emoji }}</p>

            <p class="title" style="margin-left: 10px">{{ item.title }}</p>
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
        navigateToDiary(id) {
            this.$router.push('/diary/' + id);
        },
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

<style scoped>
.diary-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
}

.diary-entry {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    background-color: #f9f9f9;
    margin-bottom: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.diary-entry:hover {
    background-color: #e2e2e2;
}

.profile-section {
    margin-right: 15px;
}

.profile-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.nickname,
.emoji,
.title {
    margin: 2px 0;
    color: #333;
}

.nickname {
    font-weight: bold;
}

.title {
    font-size: 0.9em;
    color: #666;
}
</style>
