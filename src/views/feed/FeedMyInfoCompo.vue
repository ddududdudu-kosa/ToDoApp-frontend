<template>
    <div>
        <img :src="user.profileImage" :alt="user.name" class="profile-image"/>
        <!-- <span class="user-name">{{ user.name }}</span> -->
        <span class="user-name">내정보인데용?</span>
    </div>
</template>

<script>
export default {
    data() {
    return {
        users: [
            { id: 1, name: 'JohnDoe', profileImage: 'path/to/image1.jpg' },
        ]
    }
    }
}
</script>

<style scoped>

</style>