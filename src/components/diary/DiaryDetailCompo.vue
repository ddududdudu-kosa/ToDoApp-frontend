<template>
    <div v-if="diary">
        <h1>{{ diary.title }}</h1>
        <p>{{ diary.contents }}</p>
        <p>Date: {{ diary.dDate }}</p>
        <p>Temperature: {{ diary.temperature }}</p>
        <p>Emoji: {{ diary.emoji }}</p>
        <div v-if="diary.diaryimg">
            <img :src="diary.diaryimg" alt="Diary Image" style="max-width: 100%; height: auto" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        diaries: Array, // 부모 컴포넌트로부터 다이어리 목록을 전달받음
    },
    computed: {
        diary() {
            return this.diaries.find((diary) => diary.id === parseInt(this.$route.params.id)); // 다이어리 ID로 다이어리 데이터 가져오기
        },
    },
};
</script>
