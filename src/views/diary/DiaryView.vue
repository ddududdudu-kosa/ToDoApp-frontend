<template>
    <div>
        <h1>Diary Details</h1>
        <p>Diary ID: {{ $route.params.id }}</p>
    </div>
</template>

<script>
export default {
    name: 'DiaryView',
};
</script>
