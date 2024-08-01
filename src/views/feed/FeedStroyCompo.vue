<template>
    <div>
        <ul>
        <li v-for="(user, index) in users" :key="user.id || index">
            {{ user.name }} <!-- user.title 대신 user.name으로 수정, 이미지 사용 예제도 추가 -->
            <img :src="user.profileImage" alt="Profile Image">
        </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
    return {
        users: [
            { id: 1, name: 'JohnDoe', profileImage: 'path/to/image1.jpg' },
            { id: 2, name: 'JaneDoe', profileImage: 'path/to/image2.jpg' },
            { id: 3, name: 'JaneDoe', profileImage: 'path/to/image2.jpg' },
            { id: 4, name: 'JaneDoe', profileImage: 'path/to/image2.jpg' },
        ]
    }
    }
}
</script>

<style scoped>
    @import "@/assets/feed.css"
</style>