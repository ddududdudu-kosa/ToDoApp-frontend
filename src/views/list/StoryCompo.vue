<template>
    <div class="row">
        <div class="col-1" style="background-color: #343434">
            <div style="color: white">뒤로가기</div>
        </div>
        <div class="col-10" style="background-color: #343434; height: 100vh">
            <div class="stories-wrapper">
                <div class="stories" v-if="stories.length > 0" @mouseenter="pauseStory" @mouseleave="play">
                    <!--story.id  storyImg title totalLikes createAt memberId-->
                    <div
                        v-for="(story, index) in stories"
                        :key="index"
                        class="story"
                        :style="
                            index === indexSelected
                                ? `transform: translate(0px)`
                                : `transform: translate(${calculateTransform(index)}px) scale(0.3);cursor:pointer;`
                        "
                        @click="index !== indexSelected ? selectSlide(index) : ''"
                    >
                        <div class="story__source">
                            <div
                                class="like-button"
                                @click="toggleLike(story.images[index].stoId, index)"
                                style="color: hotpink"
                            >
                                {{ story.images[index].totalLikes }}
                                <i :class="{ liked: isLiked(story.images[index].stoId) }" class="fa fa-heart"></i>
                            </div>

                            <!--                            <button @click="toggleLike(story.id)">-->
                            <!--                                <i-->
                            <!--                                    :class="{-->
                            <!--                                        fa: true,-->
                            <!--                                        'fa-heart': isLiked(story.id),-->
                            <!--                                        'fa-heart-o': !isLiked(story.id),-->
                            <!--                                    }"-->
                            <!--                                ></i>-->
                            <!--                            </button>-->

                            <img :src="getSrc(story, index).url" alt="" />
                            <div class="story__header" v-if="index === indexSelected">
                                <div class="time">
                                    <div class="time__item" v-for="(elm, index) in story.images.length" :key="index">
                                        <div
                                            class="time__fill"
                                            :style="
                                                index === key
                                                    ? `width: ${percent}%`
                                                    : key > index
                                                    ? `width:100%`
                                                    : `width:0%`
                                            "
                                        ></div>
                                    </div>
                                </div>
                                <div class="story__top">
                                    <div class="user">
                                        <div class="user__image">
                                            <img :src="story.picture" alt="" />
                                        </div>
                                        <div class="user__name">
                                            {{ story.username }}
                                        </div>
                                    </div>
                                    <div class="story__time">{{ story.images[index].time }}</div>
                                </div>
                            </div>
                            <div class="story__body">
                                <div class="user" v-if="index !== indexSelected">
                                    <div
                                        class="user__image"
                                        :style="getNotViewedIndex(story) === -1 ? `background: #FFFFFF` : ''"
                                    >
                                        <img :src="story.picture" alt="" />
                                    </div>
                                    <div class="user__name">
                                        {{ story.username }}
                                    </div>
                                </div>
                                <slot
                                    v-if="showInnerContent && index === indexSelected"
                                    name="innerContent"
                                    :story="story"
                                ></slot>
                            </div>
                        </div>
                        <div
                            v-if="index === indexSelected"
                            class="story__icon story__icon--prev"
                            @click="prev(index)"
                        ></div>
                        <div
                            v-if="index === indexSelected"
                            class="story__icon story__icon--next"
                            @click="next(index)"
                        ></div>
                        <slot
                            v-if="showOuterContent && index === indexSelected"
                            name="outerContent"
                            :story="story"
                        ></slot>
                    </div>
                </div>
                <!-- 없으면 추가! -->
                <div v-else>스토리 없음 추가 ㄱㄱㄱ</div>
            </div>
        </div>
        <div class="col-1" style="background-color: #343434">
            <button @click="goToMyStories" style="color: white; background: none; border: none; cursor: pointer">
                스토리 추가하러가기
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    components: {},
    data() {
        return {
            stories: [],
            likedStories: {}, // 스토리별 좋아요 상태
            myInfoList: [],
            indexSelected: 0,
            difference: 0,
            key: 0,
            percent: 0,
            timer: 0,
            progress: 0,
            interval: 0,
            isPaused: false,
            newDur: 0,
            pausePer: 0,
            currentImage: null,
            currentStoId: null,
            imageChangeTrigger: 0, // 이미지 변경 강제 감지를 위한 트리거
        };
    },
    name: 'Stories',
    props: {
        user: {
            type: Object,
            default: () => ({
                id: '',
                name: '',
                imgUrl: '',
            }),
        },
        duration: {
            type: Number,
            default: 5000,
        },
        currentIndex: {
            type: Number,
            default: 0,
        },
        showInnerContent: {
            type: Boolean,
            default: true,
        },
        showOuterContent: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        isAllStoriesEnd() {
            return this.indexSelected >= this.stories.length - 1 && this.isCurrentAllImagesEnd;
        },
        isCurrentAllImagesEnd() {
            return this.key >= this.stories[this.indexSelected].images.length - 1;
        },
    },
    watch: {
        // currentImage 속성 감시
        currentImage(newImage, oldImage) {
            if (oldImage) {
                // 초기 이미지 로드 시는 제외하고 실행
                this.sendViewConfirmation(this.currentStoId); // 현재 이미지의 stoId를 사용하여 확인 요청 보냄
            }
        },
    },
    methods: {
        async toggleLike(storyId, index) {
            // 좋아요 상태 토글 로직 구현
            console.log('좋아요 토글');
            const currentState = this.likedStories[storyId] || false;
            this.likedStories[storyId] = !currentState;
            const data = {
                memberId: this.myInfoList.id,
                like: this.likedStories[storyId] ? 1 : 0,
            };
            // 서버에 좋아요 상태 변경 요청
            try {
                const response = await axios.post(`http://localhost:8080/stories/${storyId}/like`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        access: sessionStorage.getItem('access'),
                    },
                    withCredentials: true,
                });
                console.log('좋아요 updated:', response.data);
                // 로컬 상태 업데이
                if (data.like === 1) {
                    this.stories[index].images.find((img) => img.stoId === storyId).totalLikes += 1;
                } else {
                    this.stories[index].images.find((img) => img.stoId === storyId).totalLikes -= 1;
                }
            } catch (error) {
                console.error('좋아요 업데이트 실패:', error);
            }
        },
        isLiked(storyId) {
            return !!this.likedStories[storyId];
        },
        goToMyStories() {
            this.$router.push('/stories/my'); // /stories/my 경로로 라우팅
        },
        async fetchStories() {
            try {
                const currentTime = new Date();
                console.log('현시 ' + currentTime);
                const response = await axios.get(`http://localhost:8080/stories/user/${this.user.id}/active`, {
                    headers: {
                        access: sessionStorage.getItem('access'),
                    },
                    withCredentials: true,
                });
                const formattedStories = [
                    {
                        username: this.user.name,
                        picture: this.user.imgUrl,
                        images: response.data.map((story) => {
                            let storyDate = new Date(story.createAt); // createAt을 Date 객체로 변환
                            let hoursDiff = Math.floor((currentTime - storyDate) / (1000 * 60 * 60)); // 시간 차이 계산 (밀리초 단위를 시간으로 변환)
                            let timeSincePosted = 24 - hoursDiff; // 24시간에서 시간 차이를 빼서 계산

                            console.log('계시 ' + timeSincePosted);
                            return {
                                stoId: story.id,
                                title: story.title,
                                totalLikes: story.totalLikes,
                                url: story.storyImg,
                                viewed: true,
                                time: `${timeSincePosted}h`, // 시간 문자열 설정
                            };
                        }),
                    },
                ];
                this.stories = formattedStories;
                console.log('ㅁㅁㅁ ' + this.stories);
            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        },

        // 서버에 이미지가 보여졌다는 것을 알리는 POST 요청
        async sendViewConfirmation(stoId) {
            try {
                console.log('호출');
                const response = await axios.get(`http://localhost:8080/stories/${stoId}`, {
                    headers: {
                        access: sessionStorage.getItem('access'),
                    },
                    withCredentials: true,
                });
                console.log('ㅁㅁㅁㅁView confirmation sent for stoId:', stoId, 'Response:', response.data);
            } catch (error) {
                console.error('Error sending view confirmation:', error);
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
                this.myInfoList = res.data.myInfoList; // 직접 데이터를 설정
            } catch (error) {
                console.error('Error fetching diaries:', error);
            }
        },
        // 밑으로 복사

        // getSrc(story, index) {
        //     const viewedIndex = this.getLastViewedIndex(story);
        //     return index === this.indexSelected
        //         ? {
        //               url: story.images[this.key].url,
        //           }
        //         : {
        //               url: story.images[viewedIndex].url,
        //           };
        // },
        // getSrc(story, index) {
        //     const viewedIndex = this.getLastViewedIndex(story);
        //     const image = index === this.indexSelected ? story.images[this.key] : story.images[viewedIndex];
        //     this.currentImage = image.url; // 이미지 URL 변경
        //     this.currentStoId = image.stoId; // 현재 이미지의 stoId 저장
        //     return { url: this.currentImage };
        // },
        getSrc(story, index) {
            const image = story.images[this.key];
            if (this.currentImage !== image.url || this.imageChangeTrigger !== this.key) {
                this.currentImage = image.url;
                this.currentStoId = image.stoId;
                this.imageChangeTrigger = this.key; // 트리거 업데이트
                this.sendViewConfirmation(this.currentStoId);
            }
            return { url: this.currentImage };
        },
        getNotViewedIndex(story) {
            return story.images.findIndex((item) => !item.viewed);
        },
        getLastViewedIndex(story) {
            const keyIndex = this.getNotViewedIndex(story);
            const index = story.images.length - 1;
            return keyIndex === -1 ? index : keyIndex;
        },
        selectSlide(index) {
            if (this.stories.length > index && this.stories[index].images) {
                this.isPaused = false;
                this.difference += this.indexSelected - index;
                this.indexSelected = index;
                this.key = this.getLastViewedIndex(this.stories[this.indexSelected]);
                this.reset();
            } else {
                console.log('No story data available for index:', index);
            }
        },
        onAllStoriesEnd() {
            this.difference = 0;
            this.indexSelected = 0;
            this.key = 0;
            this.$emit('allStoriesEnd');
        },
        onCurrentAllImagesEnd(index) {
            this.difference += index - (index + 1);
            this.stories[index].images[this.key].viewed = true;
            this.indexSelected++;
            this.key = this.getLastViewedIndex(this.stories[this.indexSelected]);
            this.$emit('сurrentAllImagesEnd', index);
        },
        onCurrentImageEnd(index) {
            if (this.stories[index] && this.stories[index].images[this.key]) {
                this.stories[index].images[this.key].viewed = true;
            }
            this.$emit('currentImageEnd', this.key);
            this.key++;
        },
        async next(index) {
            this.isPaused = false;
            if (this.isAllStoriesEnd) {
                this.onAllStoriesEnd();
            } else if (this.isCurrentAllImagesEnd || this.stories[this.indexSelected].images.length === 1) {
                // 배열 길이가 1개이거나 모든 이미지 끝에 도달했을 때
                await this.sendViewConfirmation(this.stories[this.indexSelected].images[this.key].stoId);
                setTimeout(() => {
                    this.onCurrentAllImagesEnd(index);
                });
            } else {
                const currentImage = this.stories[this.indexSelected].images[this.key];
                await this.sendViewConfirmation(currentImage.stoId);
                currentImage.viewed = true;
                this.key++;
            }
            this.reset();
        },
        // next(index) {
        //     this.isPaused = false;
        //     if (this.isAllStoriesEnd) {
        //         this.onAllStoriesEnd();
        //     } else if (this.isCurrentAllImagesEnd) {
        //         setTimeout(() => {
        //             this.onCurrentAllImagesEnd(index);
        //         });
        //     } else {
        //         this.stories[this.indexSelected].images[this.key];
        //         this.key++;
        //     }
        //     this.reset();
        // },
        prev(index) {
            this.isPaused = false;
            if (this.indexSelected <= 0 && this.key <= 0) {
                this.key = 0;
            } else if (this.key <= 0) {
                // Without delay
                setTimeout(() => {
                    this.difference += index - (index - 1);
                    this.indexSelected--;
                    this.key = this.getLastViewedIndex(this.stories[this.indexSelected]);
                });
            } else {
                this.key--;
                this.stories[this.indexSelected].images[this.key].viewed = false;
            }
            this.reset();
        },
        autoPlay() {
            if (this.isAllStoriesEnd) {
                this.onAllStoriesEnd();
            } else if (this.isCurrentAllImagesEnd) {
                this.onCurrentAllImagesEnd(this.indexSelected);
            } else if (this.stories[this.indexSelected] && this.stories[this.indexSelected].images[this.key]) {
                this.onCurrentImageEnd(this.indexSelected);
            }
            this.reset();
        },
        play() {
            this.timer = new Date().getTime();
            this.progress = setInterval(() => {
                // forward
                let time = new Date().getTime();
                if (this.newDur > 0) {
                    this.percent = this.pausePer + Math.floor((100 * (time - this.timer)) / this.duration);
                } else {
                    this.percent = Math.floor((100 * (time - this.timer)) / this.duration);
                }
            }, this.duration / 100);
            if (this.newDur > 0) {
                this.interval = setInterval(this.autoPlay, this.newDur);
            } else {
                this.interval = setInterval(this.autoPlay, this.duration);
            }
        },
        reset() {
            this.percent = 0;
            clearInterval(this.interval);
            clearInterval(this.progress);
            this.newDur = 0;
            this.play();
        },
        pauseStory(event) {
            this.isPaused = true;
            this.pausePer = this.percent;
            clearInterval(this.progress);
            clearInterval(this.interval);
            this.newDur = this.duration - (this.pausePer * this.duration) / 100;
        },
        calculateTransform(index) {
            if (this.indexSelected - index === -1 || this.indexSelected - index === 1) {
                return 315 * (index + this.difference);
            }
            if (index > this.indexSelected) {
                return (315 + 315 * (index + this.difference)) * 0.5;
            } else {
                return Math.abs((315 - 315 * (index + this.difference)) * 0.5) * -1;
            }
        },
    },
    mounted() {
        this.play();
        this.selectSlide(this.currentIndex);
    },
    async created() {
        if (sessionStorage.getItem('access')) {
            this.getMyInfo();
        }

        await this.fetchStories();
        console.log(this.user);
    },
};
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.stories-wrapper {
    //position: absolute;
    //top: 45%;
    //left: 30%;
    //background: rgba(16, 16, 16, 0.98);
    font-family: sans-serif;
}

.stories {
    height: 100%;
    display: flex;
    //justify-content: center;
    //align-items: center;
}

.story {
    position: absolute;
    top: 2%;
    left: 44%;
    transition: transform 0.2s cubic-bezier(0.4, 0, 1, 1);

    @media screen and (max-width: 768px) {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    &__source {
        position: relative;
        border-radius: 16px;
        background: #000000;
        width: 450px;
        height: 750px;
        background-size: contain;

        @media screen and (max-width: 768px) {
            width: 100%;
            height: auto;
            flex: 1 1 auto;
        }

        img,
        video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    }

    &__header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 8px 11px;
    }

    &__time {
        font-size: 16px;
        line-height: 20px;
        color: #ffffff;
    }

    &__top {
        display: flex;
        align-items: center;
    }

    &__body {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;

        .user {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
        }

        .user__name {
            display: none;
        }

        .user__image {
            width: 140px;
            height: 140px;
            background: linear-gradient(180deg, #4c7cf6 0%, #6200c3 100%);
            margin: 0;
            padding: 5px;

            img {
                border: 5px solid #ffffff;
                border-radius: 100%;
            }
        }
    }

    &__icon {
        width: 24px;
        height: 24px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;

        @media screen and (max-width: 768px) {
            top: 0;
            bottom: 0;
            transform: none;
            width: 100px;
            height: auto;
            background: none;
        }

        &:before {
            content: '';
            position: absolute;
            top: 8px;
            left: 9px;
            border: solid #323232;
            border-width: 0 2px 2px 0;
            display: inline-block;
            padding: 3px;
            transform: rotate(135deg);
            border-radius: 1px;

            @media screen and (max-width: 768px) {
                content: none;
            }
        }

        &--prev {
            left: -10%;

            @media screen and (max-width: 768px) {
                left: 0;
            }
        }

        &--next {
            right: -10%;
            transform: translateY(-50%) rotate(180deg);

            @media screen and (max-width: 768px) {
                right: 0;
            }
        }
    }
}

.user {
    display: flex;
    align-items: center;

    &__image {
        width: 32px;
        height: 32px;
        border-radius: 100px;
        overflow: hidden;
        margin-right: 8px;

        img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
        }
    }

    &__name {
        font-weight: 600;
        font-size: 16px;
        line-height: 18px;
        color: #ffffff;
        margin-right: 5px;
    }
}

.time {
    display: flex;
    margin-bottom: 10px;

    &__item {
        position: relative;
        width: 100%;
        height: 2px;
        margin-right: 4px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 4px;

        &:last-child {
            margin-right: 0;
        }
    }

    &__fill {
        position: absolute;
        width: 100%;
        background: #ffffff;
        height: 2px;
    }
}
.like-button {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 24px; /* 하트 크기 조절 */
}
.like-button i {
    color: grey; /* 기본 상태 */
    cursor: pointer;
}

.like-button .liked {
    color: hotpink; /* 좋아요 눌렀을 때 상태 */
}
</style>
