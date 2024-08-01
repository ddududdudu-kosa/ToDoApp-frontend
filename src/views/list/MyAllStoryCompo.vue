<template>
    <div class="row">
        <div class="col-1" style="background-color: #343434">
            <div style="color: white">뒤로가기</div>
        </div>
        <div class="col-10" style="background-color: #343434; height: 100vh">
            <vueper-slides>
                <vueper-slide v-for="(slide, i) in slides" :key="i" :title="slide.title" :content="slide.content">
                </vueper-slide>
            </vueper-slides>
        </div>
        <div class="col-1" style="background-color: #343434">
            <div style="color: white">스토리 생성</div>
            <div style="color: white">기타</div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';

export default {
    components: { VueperSlides, VueperSlide },
    data() {
        return {
            myInfoList: [],
            myAllStory: [],
            slides: [
                {
                    title: 'Slide #1',
                    content: 'Slide 1 content.',
                },
                {
                    title: 'Slide #2',
                    content: 'Slide 2 content.',
                },
            ],
        };
    },
    props: {},
    computed: {
        sortedStories() {
            // 배열의 사본을 만들고 그 사본을 정렬
            return [...this.myAllStory].sort((a, b) => b.id - a.id);
        },
    },

    methods: {
        async getMyInfo() {
            try {
                const res = await axios.get('http://localhost:8080/mypage', {
                    headers: {
                        access: sessionStorage.getItem('access'),
                    },
                    withCredentials: true,
                });
                console.log(res.data.myInfoList);
                this.myInfoList = res.data.myInfoList; // 직접 데이터를 설정
                this.getMyAllStory();
            } catch (error) {
                console.error('Error fetching diaries:', error);
            }
        },
        async getMyAllStory() {
            if (this.myInfoList && this.myInfoList.id) {
                try {
                    const res = await axios.get(`http://localhost:8080/stories/my/${this.myInfoList.id}`, {
                        headers: {
                            access: sessionStorage.getItem('access'),
                        },
                        withCredentials: true,
                    });
                    this.myAllStory = res.data; // 직접 데이터를 설정
                } catch (error) {
                    console.error('Error fetching diaries:', error);
                }
            }
        },
    },
    created() {
        if (sessionStorage.getItem('access')) {
            this.getMyInfo();
        }
    },
    mounted() {
        if (!sessionStorage.getItem('access')) {
            alert('로그인 후 이용가능합니다.');
            this.$router.push('/');
        }
        console.log('현재 로그인 : ' + sessionStorage.getItem('email'));
    },
};
</script>
<style scoped></style>
