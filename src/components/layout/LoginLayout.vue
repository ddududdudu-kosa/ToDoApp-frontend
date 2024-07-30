<template>
    <div class="login-layout">
        <router-view />
        <footer-compo class="footer" />
    </div>
</template>

<script>
import FooterCompo from '@/components/layout/FooterCompo.vue';

export default {
    components: {
        FooterCompo,
    },
};
</script>

<style scoped>
@import '@/assets/base.css';
.login-layout {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
}
</style>
