<template>
    <div class="row">
        <div class="col-1" style="background-color: #343434">
            <button id="backButton" @click="goBack" style="font-size: 40px">
                <i class="fa-solid fa-angle-left" style="color: white"> </i>
            </button>
        </div>
        <div class="col-6" style="background-color: #343434; height: 100vh">
            <vueper-slides
                ref="vueperslides1"
                :touchable="false"
                fade
                :autoplay="false"
                :bullets="false"
                @slide="$refs.vueperslides2.goToSlide($event.currentSlide.index, { emit: false })"
                fixed-height="400px"
                style="margin: 7% auto 3%; width: 400px; height: 600px"
            >
                <!--                스토리id-> 방문 totalLikes -->
                <vueper-slide
                    v-for="(slide, i) in myAllStory"
                    :key="i"
                    :image="slide.storyImg"
                    @click.native="setCurrentStoryId(slide.id)"
                >
                    >
                </vueper-slide>
            </vueper-slides>

            <vueper-slides
                class="no-shadow thumbnails"
                ref="vueperslides2"
                @slide="$refs.vueperslides1.goToSlide($event.currentSlide.index, { emit: false })"
                :visible-slides="myAllStory.length"
                fixed-height="75px"
                :bullets="false"
                :touchable="false"
                :gap="2.5"
                :arrows="false"
            >
                <vueper-slide
                    v-for="(slide, i) in myAllStory"
                    :key="i"
                    :image="slide.storyImg"
                    @click.native="$refs.vueperslides2.goToSlide(i)"
                >
                </vueper-slide>
            </vueper-slides>
        </div>
        <div class="col-5" style="background-color: #343434">
            <button @click="toggleCreateSection">스토리 생성</button>
            <div v-if="isCreateVisible" style="color: white">
                <h3>스토리 생성</h3>
                <input type="file" @change="handleFileUpload" accept="image/*" />
                <div v-if="imagePreview">
                    <img :src="imagePreview" alt="Image preview" style="width: 100%; max-height: 300px" />
                </div>
                <button @click="uploadImage">생성하기</button>
                <button @click="toggleCreateSection">닫기</button>
            </div>
            <button @click="toggleVisitSection">방문 기록 불러오기</button>
            <div v-if="isVisitVisible" style="color: white">
                <!--                id  storiesId memberId-->
                <h3>방문 기록</h3>
                <p v-for="visitor in visitDetails.visitors" :key="visitor.id">{{ visitor.memberId }}</p>
                <h3>좋아요 기록</h3>
                <p v-for="like in visitDetails.likes" :key="like.id">{{ like.memberId }}</p>
            </div>
            <button>좋아요 기록 불러오기</button>
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
            isCreateVisible: false,
            uploadedImage: null,
            imagePreview: null, // 이미지 미리보기 URL
            isVisitVisible: false,
            currentStoryId: 0,
            visitDetails: {
                visitors: [],
                likes: [],
            },
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
        goBack() {
            window.history.back();
        },
        setCurrentStoryId(id) {
            this.currentStoryId = id;
            console.log(`현재 선택된 스토리 ID: ${this.currentStoryId}`);
        },
        toggleVisitSection() {
            this.isVisitVisible = !this.isVisitVisible;
            if (this.isVisitVisible && this.currentStoryId) {
                this.fetchVisitDetails(this.currentStoryId);
            } else if (!this.currentStoryId) {
                console.error('스토리 ID가 미확인');
            }
        },
        async fetchVisitDetails(storyId) {
            console.error('방문기록 확인중 ');
            try {
                const response = await axios.get(`http://localhost:8080/stories/${storyId}/details`, {
                    headers: {
                        'Content-Type': 'application/json',
                        access: sessionStorage.getItem('access'),
                    },
                    withCredentials: true,
                });
                this.visitDetails = response.data;

                console.error('방문기록보기 ', response.data);
            } catch (error) {
                console.error('Error fetching visit details:', error);
            }
        },
        toggleCreateSection() {
            this.isCreateVisible = !this.isCreateVisible;
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.uploadedImage = file;
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
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
                    this.myAllStory = res.data.sort((a, b) => b.id - a.id);
                    this.currentStoryId = this.myAllStory[0].id;
                    console.log(this.myAllStory);
                } catch (error) {
                    console.error('Error fetching diaries:', error);
                }
            }
        },

        async uploadImage() {
            if (!this.uploadedImage) {
                alert('먼저 이미지를 선택해주세요.');
                return;
            }
            const formData = new FormData();
            formData.append('file', this.uploadedImage);

            try {
                const response = await axios.post('http://localhost:8080/files/image/diaries', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        access: sessionStorage.getItem('access'),
                    },
                    withCredentials: true,
                });
                console.log('Image upload response:', response.data);
                // 업로드 된 url로 스토리생성
                const imgUrl = response.data; // 서버가 이미지 URL을 반환한다고 가정

                // 스토리 생성 요청
                const storyData = {
                    title: 'vuetitle',
                    storyImg: imgUrl,
                    memberId: this.myInfoList.id,
                };

                const createStoryResponse = await axios.post('http://localhost:8080/stories/create', storyData, {
                    headers: {
                        access: sessionStorage.getItem('access'),
                    },
                    withCredentials: true,
                });
                console.log('Story create response:', createStoryResponse.data);
                alert('이미지가 성공적으로 업로드 되었습니다.스토리가 생성되었습니다.');
                window.location.reload(); // 페이지 새로고침 실행
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('이미지 업로드에 실패했습니다.');
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
<style scoped>
.thumbnails {
    margin: auto;
    max-width: 300px;
}

.thumbnails .vueperslide {
    box-sizing: border-box;
    border: 1px solid #fff;
    transition: 0.3s ease-in-out;
    opacity: 0.7;
    cursor: pointer;
}

.thumbnails .vueperslide--active {
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
    opacity: 1;
    border-color: #000;
}

input[type='file'] {
    margin: 10px 0;
}

#backButton {
    background: none; /* 배경 제거 */
    border: none; /* 테두리 제거 */
    color: inherit; /* 상속된 색상 사용 */
    padding: 0; /* 패딩 제거 */
    cursor: pointer; /* 마우스 커서를 포인터로 설정 */
    outline: none; /* 누를 때 테두리 제거 */
}
</style>
