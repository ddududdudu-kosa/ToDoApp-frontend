<!-- 작성자 : 전민재
    기능 :  스토리 리스트 -->

<template>
    <div class="story-bar" style="height: 150px">
        <!-- RelationType 1 -->
        <div
            style="margin-left: 10px; margin-right: 10px"
            v-if="typeOneUsers.length > 0"
            class="user-entry scroll"
            @click="goToUserStories(typeOneUsers[0].id, typeOneUsers[0].profileImg, typeOneUsers[0].nickname)"
        >
            <div class="storyCircle" style="z-index: 1">
                <img src="https://goo.gl/zYrXX3" alt="" />
                <svg viewbox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" />
                </svg>
            </div>
            <img
                :src="typeOneUsers[0].profileImg"
                alt="profile image"
                :class="['profile-img', { noStory: !typeOneUsers[0].actStory }]"
            />
            <p class="nickname">{{ typeOneUsers[0].nickname }}</p>
        </div>

        <hr />

        <!-- Filtered RelationType 2 Users with actStory true -->
        <div
            v-for="user in filteredTypeTwoUsers"
            :key="user.id"
            class="user-entry scroll"
            @click="goToUserStories(user.id, user.profileImg, user.nickname)"
        >
            <div class="storyCircle" style="z-index: 1">
                <img src="https://goo.gl/zYrXX3" alt="" />
                <svg viewbox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" />
                </svg>
            </div>
            <img :src="user.profileImg" alt="profile image" :class="['profile-img', { visited: user.visited }]" />
            <p class="nickname">{{ user.nickname }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            hovering: false,
            users: [],
            userIdList: [],
            typeOneUsers: [],
            typeTwoUsers: [],
        };
    },
    components: {},
    computed: {
        filteredTypeTwoUsers() {
            // 먼저 actStory가 true인 사용자들을 필터링
            const activeUsers = this.typeTwoUsers.filter((user) => user.actStory);
            // visited 값에 따라 정렬: false가 true보다 먼저 오도록
            activeUsers.sort((a, b) => a.visited - b.visited);
            return activeUsers;
        },
    },
    methods: {
        async getMyPage() {
            try {
                const res = await axios.get('http://localhost:8080/relevant', {
                    headers: {
                        access: sessionStorage.getItem('access'),
                    },
                    withCredentials: true,
                });
                console.log(res.data);
                this.userIdList = res.data.filter((user) => !user.visited).map((user) => user.id);
                console.log(this.userIdList);
                // one : 나 , two : 팔로잉 , three: 공개
                this.typeOneUsers = res.data.filter((user) => user.relationType === '1');
                this.typeTwoUsers = res.data.filter((user) => user.relationType === '2');
            } catch (error) {
                console.error('Error fetching List Page:', error);
            }
        },
        goToUserStories(userId, imgUrl, nickname) {
            this.$router.push({
                name: 'UserStoryCompo',
                params: { userId: userId },
                query: {
                    name: nickname,
                    imgUrl: imgUrl,
                },
            });
        },
    },
    created() {
        if (sessionStorage.getItem('access')) {
            this.getMyPage();
        }
    },
    mounted: function () {},
};
</script>

<style scoped>
.story-bar {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
}
.user-entry {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative; /* 부모를 상대 위치로 설정 */
    margin: 20px 5px 10px;
    padding: 10px;
    border-radius: 5px;
}
.profile-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover; /* 이미지 비율 유지 */
    z-index: 2; /* 이미지를 위로 */
}
.nickname {
    position: absolute; /* 절대 위치 사용 */
    color: #343434; /* 글씨 색상 */
    z-index: 3; /* 텍스트를 이미지 위에 위치 */
    padding: 5px 10px; /* 패딩 설정 */
    border-radius: 15px; /* 경계 둥글게 */
    bottom: -20%; /* 텍스트 위치 조정 */
}
.visited {
    border: 5px solid grey;
}
.noStory {
    border: 3px solid blue;
}

.storyCircle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    overflow: hidden;
}
.storyCircle img {
    width: 70px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.storyCircle svg {
    fill: none;
    stroke: #8a3ab8;
    stroke-width: 4px;
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: loading 4500ms ease-in-out infinite alternate;
}
@keyframes loading {
    100% {
        stroke: #cd476b;
        stroke-dasharray: 10;
        transform: rotate(0deg);
    }
}

/* ( 크롬, 사파리, 오페라, 엣지 ) 동작 */
.scroll::-webkit-scrollbar {
    display: none;
}

/* 스크롤바 생성 */
.scroll {
    overflow-y: scroll;
}
</style>
