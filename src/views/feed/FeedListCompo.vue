<template>
    <div class="tasks-container">
        <div v-for="category in categories" :key="category.id">
        <h3 @click="toggleInput(category.id)">{{ category.name }}</h3>
        <ul v-if="category.todos.length">
            <li v-for="todo in category.todos" :key="todo.id">
            {{ todo.task }}
            </li>
        </ul>
        <input v-if="showInput[category.id]" type="text" @keyup.enter="addTodo(category.id, newTodo[category.id])" v-model="newTodo[category.id]" placeholder="Add a new task"/>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        value: new Date(),
        categories: [
            { id: 1, name: 'Work', todos: [{ id: 11, task: 'Meeting at 10am' }] },
            { id: 2, name: 'Home', todos: [] },
            { id: 3, name: 'Other', todos: [{ id: 31, task: 'Gym at 6pm' }] }
        ],
        showInput: {},
        newTodo: {}
        };
    },
    methods: {
        toggleInput(categoryId) {
        // Toggle input display state
        this.$set(this.showInput, categoryId, !this.showInput[categoryId]);
        },
        addTodo(categoryId, task) {
        if (!task) return;
        const category = this.categories.find(c => c.id === categoryId);
        category.todos.push({
            id: Date.now(), // simple unique id generator
            task: task
        });
        this.newTodo[categoryId] = ''; // Clear input field
        this.showInput[categoryId] = false; // Optionally hide the input field after adding
        }
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