<template>
    <div class="story-container">
        <div class="story" v-for="user in users" :key="user.id">
            <img :src="user.profileImage" :alt="user.name" class="profile-image"/>
            <span class="user-name">{{ user.name }}</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
    return {
        users: [
            { id: 1, name: 'JohnDoe', profileImage: 'path/to/image1.jpg' },
            { id: 2, name: 'JaneDoe', profileImage: 'path/to/image2.jpg' },
            { id: 2, name: 'JaneDoe', profileImage: 'path/to/image2.jpg' },
            { id: 2, name: 'JaneDoe', profileImage: 'path/to/image2.jpg' },
        ]
    }
    }
}
</script>

<style scoped>
    @import "@/assets/feed.css"
</style>