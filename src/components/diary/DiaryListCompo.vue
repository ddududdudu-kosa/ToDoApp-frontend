<template>
    <div>
        <h1>Diary List</h1>
        <ul>
            <li v-for="diary in diaries" :key="diary.id">
                <router-link :to="`/diary/${diary.id}`">{{ diary.title }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        diaries: Array, // 부모 컴포넌트로부터 다이어리 목록을 전달받음
    },
};
</script>
