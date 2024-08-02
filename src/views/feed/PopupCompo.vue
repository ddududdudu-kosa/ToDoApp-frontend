<!-- 작성자 : 김가은
    기능 : pop화면 -->
<template>
    <div class="popup">
        <div class="popup-content">
            <span @click="$emit('close')" class="close-button">&times;</span>
            <p>{{ message }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: ['message'],
};
</script>

<style scoped>
.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    position: relative;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
}
</style>
