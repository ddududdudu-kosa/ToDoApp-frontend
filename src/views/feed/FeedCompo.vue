<template>
    <div>
        <feed-stroy-compo/>
        <feed-my-info-compo/>
        <b-row>
            <b-col cols="5">
                <b-calendar style="height: 500px;" block v-model="value"  width="100%" @context="onContext" locale="ko"></b-calendar>
            </b-col>
            <b-col>
                <feed-list-compo/>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import FeedListCompo from "./FeedListCompo.vue";
import FeedMyInfoCompo from "./FeedMyInfoCompo.vue"
import FeedStroyCompo from "./FeedStroyCompo.vue"
export default {
    components: { FeedStroyCompo, FeedMyInfoCompo, FeedListCompo },
    
}
</script>

<style scoped>
@import "@/assets/feed.css";

</style>