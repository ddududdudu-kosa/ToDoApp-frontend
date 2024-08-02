<template>
    <div>
        <div>민재가 작업할 내용이 들어갈 곳</div>

        <div class="feed-myinfo">
            <img class="myinfo-img" :src="user.profileImage" :alt="user.nickname" />
            <div>
                <p>
                    <b>{{ user.nickname }}</b>
                </p>
                <p>{{ user.intro }}</p>
            </div>
        </div>
        <div class="feedcompo-middle">
            <b-row>
                <b-col cols="5">
                    <b-calendar
                        style="height: 500px"
                        block
                        v-model="dateSelected"
                        @context="onContext"
                        width="100%"
                        locale="ko"
                    ></b-calendar>
                </b-col>
                <b-col>
                    <div>
                        <b-button @click="showCategoryInput = !showCategoryInput" variant="success"
                            >카테고리 추가</b-button
                        >
                        <div v-if="showCategoryInput">
                            <input type="text" v-model="newCategoryContent" placeholder="카테고리 내용" />
                            <input type="text" v-model="newCategoryColor" placeholder="카테고리 색상" />
                            <button @click="addCategory">추가</button>
                        </div>
                    </div>
                    <div v-for="category in categories" :key="category.id" class="category-item">
                        <div class="category-header">
                            <h6 @click="toggleInput(category.id)">
                                <template v-if="editCategory && editCategory.id === category.id">
                                    <input
                                        type="text"
                                        class="input-underline"
                                        v-model="editCategory.contents"
                                        :style="{ backgroundColor: '#7a7a7a', color: '#e8e8e7' }"
                                        @keyup.enter="saveCategory"
                                        @blur="saveCategory"
                                    />
                                </template>
                                <template v-else>
                                    {{ category.contents }}
                                </template>
                            </h6>
                            <div class="category-actions">
                                <!-- <button @click="startEditingCategory(category)">수정</button> -->
                                <b-button @click="startEditingCategory(category)" variant="outline-primary"
                                    >수정</b-button
                                >
                                <b-button @click="deleteCategory(category.id)" variant="outline-danger">삭제</b-button>
                            </div>
                        </div>
                        <ul v-if="category.todos && category.todos.length">
                            <li
                                class="todo-list"
                                v-for="(todo, todoIndex) in category.todos"
                                :key="todo.id || todoIndex"
                            >
                                <input type="checkbox" :checked="todo.status === 1" @change="updateTodoStatus(todo)" />

                                <div v-if="editTodo && editTodo.id === todo.id">
                                    <input
                                        type="text"
                                        v-model="editTodo.contents"
                                        @keyup.enter="saveTodo"
                                        @blur="saveTodo"
                                    />
                                </div>
                                <div v-else @dblclick="startEditing(todo)">
                                    {{ todo.contents }}
                                </div>
                                <b-button
                                    class="small-button"
                                    @click="deleteTodo(todo.id, todoIndex)"
                                    variant="outline-danger"
                                    >삭제</b-button
                                >
                            </li>
                        </ul>

                        <input v-if="showInput[category.id]" class="todo-input-underline" type="text" @keyup.enter.prevent.stop="addTodo(category.id, newTodo[category.id])" v-model="newTodo[category.id]" placeholder="할 일 입력 !"/>

                    </div>
                </b-col>
            </b-row>
        </div>
        <p v-if="!categories.length">No categories available.</p>
        <popup v-if="showPopup" @close="closePopup">{{ popupMessage }}</popup>
        <!-- 가은추가 -->
    </div>
</template>

<script>
import axios from 'axios';
import Popup from './PopupCompo.vue'; // 가은추가

export default {
    components: {
        // 가은 추가
        Popup,
    },

    data() {
        return {
            user: {
                id: null,
                profileImage: null,
                nickname: null,
                intro: null,
            },
            dateSelected: new Date(),
            categories: [],
            todos: [],
            showInput: {},
            newTodo: {},
            editTodo: null, // 현재 수정 중인 todo를 추적
            editCategory: null, // 현재 수정 중인 category를 추적
            showCategoryInput: false, // 카테고리 입력창 표시 여부
            newCategoryContent: '', // 새로운 카테고리 내용
            newCategoryColor: '', // 새로운 카테고리 색상
        };
    },
    methods: {
        onContext(context) {
            console.log('Calendar context event:', context);
            const selectedDate = new Date(context.selectedDate);
            if (isNaN(selectedDate.getTime())) {
                console.error('Invalid date:', context.selectedDate);
                alert('선택된 날짜가 유효하지 않습니다.');
                return;
            }
            this.dateSelected = selectedDate;
            this.fetchTodosByDate(selectedDate);
        },
        async getMyPage() {
            try {
                const response = await axios.get('http://localhost:8080/mypage', {
                    headers: { access: sessionStorage.getItem('access') },
                    withCredentials: true,
                });

                this.user = {
                    id: response.data.myInfoList.id,
                    profileImage: response.data.myInfoList.profileImg,
                    nickname: response.data.myInfoList.nickname,
                    intro: response.data.myInfoList.intro,
                };

                await this.fetchCategories();
                this.fetchTodosByDate(this.dateSelected);
                console.log('response.data.myInfoList', response.data.myInfoList);
            } catch (error) {
                console.error('Error fetching My Page:', error);
                alert('프로필 정보를 불러오는데 실패했습니다.');
            }
        },
        async fetchCategories() {
            console.log('Fetching categories for user:', this.user.id);

            if (!this.user.id) return;
            try {
                const response = await axios.get(`http://localhost:8080/api/categories/${this.user.id}`, {
                    headers: { access: sessionStorage.getItem('access') },
                    withCredentials: true,
                });
                console.log('Categories fetched:', response.data);
                this.categories = response.data.map((category) => ({
                    ...category,
                    todos: [],
                }));
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        async fetchTodosByDate(date) {
            if (!this.user.id) return;
            if (!(date instanceof Date)) {
                date = new Date(date);
            }
            const adjustedDate = new Date(date);
            adjustedDate.setDate(date.getDate() + 1);
            const formattedDate = adjustedDate.toISOString().split('T')[0];
            console.log('Fetching todos for date:', formattedDate);
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/todos/date/${this.user.id}/${formattedDate}`,
                    {
                        headers: { access: sessionStorage.getItem('access') },
                        withCredentials: true,
                    },
                );
                console.log('Todos fetched:', response.data);
                this.todos = response.data;
                this.updateCategoriesWithTodos();
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        },
        async addTodo(categoryId, task) {
            console.log("addTodo called", { categoryId, task });
            if (!task || !this.user.id) return;
            const adjustedDate = new Date(this.dateSelected);
            adjustedDate.setDate(this.dateSelected.getDate() + 1); // Add one day to the selected date
            const newTodo = {
                task,
                contents: task,
                categoriesId: categoryId,
                date: adjustedDate.toISOString().split('T')[0], // Use the adjusted date
            };
            try {
                const response = await axios.post(`http://localhost:8080/api/todos`, newTodo, {
                    headers: { access: sessionStorage.getItem('access') },
                    withCredentials: true,
                });
                console.log('Todo added:', response.data);
                this.fetchTodosByDate(this.dateSelected); // Refresh the todos
                this.newTodo[categoryId] = ''; // Clear the input field after adding
                this.showInput[categoryId] = false; // Hide the input field after adding
            } catch (error) {
                console.error('Error adding todo:', error);
            }
        },
        async deleteTodo(todoId, index) {
            if (confirm('이 Todo를 삭제하시겠습니까?')) {

            try {
                const response = await axios.delete(`http://localhost:8080/api/todos/${todoId}`, {
                headers: { access: sessionStorage.getItem('access') },
                withCredentials: true,
                });
                console.log("Todo deleted:", response.data);
                this.todos.splice(index, 1); // 클라이언트 상태에서 해당 Todo 제거
                // Todo가 정상적으로 삭제되었는지 화면에 반영되는지 확인
                console.log("Current todos after deletion:", this.todos);
                location.reload(true);
            } catch (error) {
                console.error('Error deleting todo:', error);
            }

            }
        },
        startEditing(todo) {
            this.editTodo = { ...todo };
        },
        async saveTodo() {
            if (!this.editTodo) return;
            try {
                const response = await axios.put(`http://localhost:8080/api/todos/${this.editTodo.id}`, this.editTodo, {
                    headers: { access: sessionStorage.getItem('access') },
                    withCredentials: true,
                });
                console.log('Todo updated:', response.data);
                this.fetchTodosByDate(this.dateSelected); // Refresh the todos
                this.editTodo = null; // Clear the edit state
            } catch (error) {
                console.error('Error updating todo:', error);
            }
        },
        async toggleTodoStatus(todo, index) {
            const newStatus = todo.status === 1 ? 2 : 1; // 상태 토글
            try {
                await axios.post(
                    `http://localhost:8080/api/todos/${todo.id}/status`,
                    { status: newStatus },
                    {
                        headers: { access: sessionStorage.getItem('access') },
                        withCredentials: true,
                    },
                );
                todo.status = newStatus; // 클라이언트 상태 업데이트
            } catch (error) {
                console.error('Error updating todo status:', error);
            }
        },
        async updateTodoStatus(todo) {
            const newStatus = todo.status === 1 ? 2 : 1;
            try {
                const response = await axios.put(
                    `http://localhost:8080/api/todos/${todo.id}`,
                    {
                        ...todo,
                        status: newStatus,
                    },
                    {
                        headers: { access: sessionStorage.getItem('access') },
                        withCredentials: true,
                    },
                );
                todo.status = newStatus;
                console.log('Todo status updated:', response.data);
            } catch (error) {
                console.error('Error updating todo status:', error);
                this.$forceUpdate();
            }
        },
        startEditingCategory(category) {
            this.editCategory = { ...category };
        },
        async saveCategory() {
            if (!this.editCategory) return;
            try {
                const response = await axios.put(
                    `http://localhost:8080/api/categories/${this.editCategory.id}`,
                    this.editCategory,
                    {
                        headers: { access: sessionStorage.getItem('access') },
                        withCredentials: true,
                    },
                );
                console.log('Category updated:', response.data);
                this.fetchCategories(); // Refresh the categories
                this.refreshTodosForCategory(this.editCategory.id);

                this.editCategory = null; // Clear the edit state
            } catch (error) {
                console.error('Error updating category:', error);
            }
        },
        refreshTodosForCategory(categoryId) {
            axios
                .get(`/api/todos/${categoryId}`)
                .then((response) => {
                    const index = this.categories.findIndex((c) => c.id === categoryId);
                    if (index !== -1) {
                        this.categories[index].todos = response.data; // todo 목록 갱신
                    }
                })
                .catch((error) => {
                    console.error('Todo 목록 갱신 실패:', error);
                });
        },
        async deleteCategory(categoryId) {
            if (!confirm('이 카테고리에 포함된 모든 할 일이 삭제됩니다. 계속하시겠습니까?')) {
                return;
            }
            try {
                const response = await axios.delete(`http://localhost:8080/api/categories/${categoryId}`, {
                    headers: { access: sessionStorage.getItem('access') },
                    withCredentials: true,
                });
                console.log('Category deleted:', response.data);
                this.fetchCategories(); // Refresh the categories
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        },
        async addCategory() {
            if (!this.newCategoryContent || !this.user.id) return;
            try {
                const response = await axios.post(
                    `http://localhost:8080/api/categories`,
                    {
                        contents: this.newCategoryContent,
                        color: this.newCategoryColor,
                        memberId: this.user.id,
                    },
                    {
                        headers: {
                            access: sessionStorage.getItem('access'),
                        },
                        withCredentials: true,
                    },
                );
                console.log('Category added:', response.data);
                this.fetchCategories();
                this.newCategoryContent = '';
                this.newCategoryColor = ''; // Clear the color field
                this.showCategoryInput = false;
            } catch (error) {
                console.error('Error adding category:', error);
            }
        },
        invertColor(hex) {
            if (hex.indexOf('#') === 0) {
                hex = hex.slice(1);
            }
            // 헥사 코드를 RGB로 변환하고 밝기를 계산
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            // 밝기에 따라 검은색 또는 흰색 반환
            return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
        },
        updateCategoriesWithTodos() {
            console.log('Updating categories with todos');
            console.log('Current categories:', this.categories);
            console.log('Current todos:', this.todos);
            this.categories = this.categories.map((category) => ({
                ...category,
                todos: this.todos.filter((todo) => todo.categoriesId === category.id),
            }));
            console.log('Updated categories:', this.categories);
        },
        toggleInput(categoryId) {
            this.$set(this.showInput, categoryId, !this.showInput[categoryId]);
        },
        //가은추가,수정 시작
        async navigateToDiary(receivedDate) {
            let date = new Date(receivedDate);
            if (isNaN(date.getTime())) {
                this.showPopupMessage('선택된 날짜가 유효하지 않습니다.');
                return;
            }

            const formattedDate = date.toISOString().split('T')[0];
            const today = new Date().toISOString().split('T')[0];

            if (formattedDate > today) {
                this.showPopupMessage('미래의 일기는 작성할 수 없습니다.');
                setTimeout(() => {
                    this.$router.push('/feed');
                }, 2000);
                return;
            }

            try {
                const response = await axios.post('http://localhost:8080/api/check-diary', {
                    email: sessionStorage.getItem('email'),
                    selectedDate: formattedDate,
                });

                if (response.data.diaryExists) {
                    this.$router.push(`/diary/view/${response.data.diaryId}`);
                } else {
                    this.$router.push('/diary/register');
                }
            } catch (error) {
                console.error('Error navigating to diary:', error);
            }
        },
        showPopupMessage(message) {
            this.popupMessage = message;
            this.showPopup = true;
        },
        closePopup() {
            this.showPopup = false;
        },
        //가은 수정,추가 일단 끝
    },
    mounted() {
        if (sessionStorage.getItem('access') === null) {
            alert('로그인 후 이용가능합니다.');
            this.$router.push('/');
        } else {
            this.getMyPage();
        }
    },
};
</script>

<style scoped>
@import '@/assets/feed.css';
.myinfo-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.feed-myinfo {
    display: flex;
}
.feed-myinfo p {
    margin: 0 0 0 3vw;
}
.feedcompo-middle {
    /* display: flex; */
}
</style>
