<!-- 작성자 : 전민재
    기능 :  일기, 할일목록 리스트 -->

<template>
    <div>
        <b-nav tabs style="display: flex; justify-content: space-around">
            <b-nav-item :class="{ activeItem: activeItem === 'todo' }" @click="setActive('todo')">Todo</b-nav-item>
            <b-nav-item :class="{ activeItem: activeItem === 'diary' }" @click="setActive('diary')">Diary</b-nav-item>
        </b-nav>
        <story-list-compo></story-list-compo>
        <div v-if="activeItem === 'todo'">
            <todo-list-compo></todo-list-compo>
        </div>
        <div v-if="activeItem === 'diary'">
            <diary-list-compo></diary-list-compo>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import TodoListCompo from '@/views/list/TodoListCompo.vue';
import DiaryListCompo from '@/views/list/DiaryListCompo.vue';
import storyListCompo from '@/views/list/StoryListCompo.vue';
export default {
    data() {
        return {
            activeItem: 'todo', // 기본적으로 todo를 보여줍니다.
        };
    },
    components: {
        storyListCompo,
        TodoListCompo,
        DiaryListCompo,
    },
    methods: {
        setActive(item) {
            this.activeItem = item;
        },
    },
    created() {
        if (sessionStorage.getItem('access')) {
            console.log('listPage create');
        }
    },
    mounted: function () {
        if (sessionStorage.getItem('access') === null) {
            alert('로그인 후 이용가능합니다.');
            this.$router.push('/');
        }
        console.log('현재 로그인 : ' + sessionStorage.getItem('email'));
    },
};
</script>

<style scoped>
@import '@/assets/list.css';
.nav-link {
    color: black; /* 활성 탭 글씨 색상 */
}
.activeItem .nav-link {
    color: #0d6efd; /* 활성 탭 글씨 색상 */
}
</style>
