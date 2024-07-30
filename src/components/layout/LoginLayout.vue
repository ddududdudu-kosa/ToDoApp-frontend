<template>
    <div class="login-layout">
        <router-view/>
        <footer-compo class="footer"/>
    </div>
</template>

<script>
import FooterCompo from '@/components/layout/FooterCompo.vue';

export default {
components: {
    FooterCompo
}
}
</script>

<style scoped>
    @import "@/assets/base.css";
</style>