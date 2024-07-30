<template>
        <div class="default-layout">
            <menu-compo class="menu"/>
            <div class="content">
                <router-view/> <!-- 주요 컨텐츠가 로드됩니다 -->
                <div class="bg-black mt-3" style="height: 900px;">aaaaa</div>
                <footer-compo class="footer sticky-bottom"/>
            </div>
        </div>
</template>

<script>
import MenuCompo from '@/components/layout/MenuCompo.vue';
import FooterCompo from '@/components/layout/FooterCompo.vue';

export default {
    components: {
        MenuCompo,
        FooterCompo
    }
}
</script>

<style scoped>
    @import "@/assets/base.css";

</style>