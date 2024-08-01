<template>
    <div>
        <hr />
        <hr />
        <div v-for="user in todoList" :key="user.memberId" class="user-entry mb-3">
            <h3>이름 {{ user.nickname }}</h3>
            <h3>{{ user.memberId }}</h3>
            <img
                :src="user.profileImg"
                alt="profile image"
                class="profile-img mb-2"
                style="width: 50px; height: 50px"
            />
            <p>Privacy: {{ user.privacy }}</p>
            <div v-for="(todo, index) in user.checkedTodos.slice(0, 4)" :key="index" class="todo-entry row">
                <p class="col-md-3">{{ index }} ㅁContents: {{ todo.contents }}</p>
                <p class="col-md-2">Date: {{ todo.date }}</p>
                <p class="col-md-2">
                    Color: <span :style="{ color: todo.color }">{{ todo.color }}</span>
                </p>
                <p class="col-md-2">Category Order: {{ todo.cateOrder }}</p>
                <p class="col-md-3">Todo Order: {{ todo.todoOrder }}</p>
            </div>
            <hr />
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            todoList: [], // todo 리스트 데이터를 저장할 속성 추가
        };
    },
    methods: {
        async getCheckedTodos() {
            try {
                const response = await axios.get('http://localhost:8080/api/todos/checkedList', {
                    headers: {
                        access: sessionStorage.getItem('access'),
                    },
                    withCredentials: true,
                });
                console.log(response.data); // 데이터 확인
                this.todoList = response.data; // 데이터를 todoList에 할당
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        },
        processTodos(user) {
            user.processedTodos = user.checkedTodos.slice(0, 4);
        },
    },
    created() {
        if (sessionStorage.getItem('access')) {
            this.getCheckedTodos();
        }
    },
    mounted() {
        if (sessionStorage.getItem('access') === null) {
            alert('로그인 후 이용가능합니다.');
            this.$router.push('/');
        } else {
            console.log('현재 로그인 : ' + sessionStorage.getItem('email'));
        }
        this.todoList.forEach((user) => {
            this.processTodos(user);
        });
    },
};
</script>

<style scoped>
.user-entry {
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 5px;
}
.todo-entry .col-md {
    padding: 0 5px; /* 열 사이의 패딩 조절 */
}
.profile-img {
    margin-bottom: 10px;
}
</style>
