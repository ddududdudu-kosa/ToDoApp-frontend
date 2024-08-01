<template>
    <div class="story-bar">
        <div class="story">
            <img class="story-image" />
        </div>

        <!-- RelationType 1 -->
        <div
            v-if="typeOneUsers.length > 0"
            class="user-entry"
            @click="goToUserStories(typeOneUsers[0].id, typeOneUsers[0].profileImg, typeOneUsers[0].nickname)"
        >
            <img
                :src="typeOneUsers[0].profileImg"
                alt="profile image"
                :class="['profile-img', { noStory: !typeOneUsers[0].actStory }]"
            />
            <p>Nickname: {{ typeOneUsers[0].nickname }}</p>
            <p>Relation Type: {{ typeOneUsers[0].relationType }}</p>
        </div>

        <hr />

        <!-- Filtered RelationType 2 Users with actStory true -->
        <div
            v-for="user in filteredTypeTwoUsers"
            :key="user.id"
            class="user-entry"
            @click="goToUserStories(user.id, user.profileImg, user.nickname)"
        >
            <img :src="user.profileImg" alt="profile image" :class="['profile-img', { visited: user.visited }]" />
            <p>Nickname: {{ user.nickname }}</p>
            <p>Relation Type: {{ user.relationType }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
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
.story {
    margin: 5px;
    width: 60px; /* 스토리 이미지의 크기를 조정 */
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
}
.story-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-entry {
    margin-bottom: 20px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
}
.profile-img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 10px;
}
.visited {
    border: 3px solid grey;
}
.noStory {
    border: 3px solid blue;
}
</style>
