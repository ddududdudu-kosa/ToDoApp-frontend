<!-- 작성자 : 전민재
    기능 :  투두 리스트 -->

<template>
    <div>
        <div v-for="user in todoList" :key="user.memberId" class="user-entry mb-3">
            <div class="profile-container">
                <div class="profile-header row">
                    <img
                        :src="user.profileImg"
                        alt="profile image"
                        style="margin-left: 50px; padding: 0px"
                        class="profile-img col-3"
                    />
                    <h3 class="col-7" style="text-align: start; padding-top: 5px; margin-left: 10px">
                        {{ user.nickname }}
                    </h3>
                </div>
                <ul class="todo-list">
                    <li v-for="(todo, index) in user.checkedTodos.slice(0, 4)" :key="index" class="todo-entry">
                        <i
                            class="fa fa-check-circle"
                            :style="{ color: todo.color }"
                            style="font-size: 24px; margin-right: 10px"
                        ></i>
                        <span style="padding-bottom: 3px">{{ todo.contents }}</span>
                    </li>
                </ul>
            </div>
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
.profile-container {
    max-width: 1200px;
    margin: 20px auto;
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-header {
    text-align: center;
}

.profile-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-bottom: 10px;
}

.todo-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.todo-entry {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.todo-entry span {
    flex: 1; /* Ensure the text takes up the rest of the line */
}
</style>
