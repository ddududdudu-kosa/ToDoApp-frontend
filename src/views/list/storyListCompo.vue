<template>
    <div class="story-bar">
        <div class="story">
            <img class="story-image" />
        </div>

        <!-- RelationType 1 -->
        <div v-for="user in typeOneUsers" :key="user.id" class="user-entry">
            <img :src="user.profileImg" alt="profile image" class="profile-img" />
            <p>Nickname: {{ user.nickname }}</p>
            <p>Relation Type: {{ user.relationType }}</p>
        </div>

        <hr />

        <!-- Filtered RelationType 2 Users with actStory true -->
        <div v-for="user in filteredTypeTwoUsers" :key="user.id" class="user-entry">
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
            typeOneUsers: [],
            typeTwoUsers: [],
        };
    },
    components: {},
    computed: {
        filteredTypeTwoUsers() {
            // Filter typeTwoUsers based on actStory being true
            return this.typeTwoUsers.filter((user) => user.actStory);
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
                this.users = res.data;
                // one : 나 , two : 팔로잉 , three: 공개
                this.typeOneUsers = this.users.filter((user) => user.relationType === '1');
                this.typeTwoUsers = this.users.filter((user) => user.relationType === '2');
            } catch (error) {
                console.error('Error fetching List Page:', error);
            }
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
</style>
