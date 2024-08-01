<template>
    <div class="tasks-container">
        <div v-for="category in categories" :key="category.id">
        <h3 @click="toggleInput(category.id)">{{ category.name }}</h3>
        <ul v-if="category.todos.length">
            <li v-for="todo in category.todos" :key="todo.id">
            {{ todo.task }}
            </li>
        </ul>
        <input v-if="showInput[category.id]" type="text" @keyup.enter="addTodo(category.id, newTodo[category.id])" v-model="newTodo[category.id]" placeholder="할 일을 쓰세요 !"/>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props : ["myInfoId"],
    data() {
    return {
        dateSelected: null,
        categories: [], // 초기 카테고리 배열
        todos: [], // 선택된 날짜에 대한 할 일 배열
        };
    },
    methods: {
    async fetchCategories() {
        try {
            console.log(33)
            console.log("ㅋmyInfoId : " + this.myInfoId)
            
            const response = await axios.get(`http://localhost:8080/api/categories/${this.myInfoId}`);
            this.categories = response.data;
            console.log("111111111111111111111111111")
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
        },
    async fetchTodosByDate(date) {
        console.log("ddddddddddddddddddddddddddd")
        try {
            const response = await axios.get(`http://localhost:8080/api/todos/member/${this.myInfoId}/todos?date=${date}`);
            this.todos = response.data;
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }
    },
    mounted() {
        this.fetchCategories();       
    }
}
</script>

<style scoped>
@import "@/assets/feed.css";
.app-container {
    display: flex;
    justify-content: space-between;
    align-items: start;
    height: 100vh; /* Viewport height */
}
h3 {
    margin-top: 4vh;
}

.calendar-container {
    width: 30%;
}

.tasks-container {
    width: 65%;
    padding-left: 20px;
}

h3 {
    color: #333;
    margin-bottom: 5px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    margin-bottom: 5px;
    background-color: #f0f0f0;
    padding: 5px;
    border-radius: 5px;
}

p {
    color: #666;
}
</style>