<template>
    <div>
        <!--        <h1>{{ this.$route.params.userId }}번 유저의 Stories</h1>-->
        <story-compo :user="user"></story-compo>
    </div>
</template>

<script>
import axios from 'axios';
import StoryCompo from '@/views/list/StoryCompo.vue';

export default {
    components: { StoryCompo },
    data() {
        return {};
    },
    props: {
        user: {
            type: Object,
            default: () => ({
                id: '',
                name: '',
                imgUrl: '',
            }),
        },
    },
    computed: {},
    methods: {},
    created() {
        console.log(this.user + 'userStory created');
    },
};
</script>
<style scoped></style>
