<template>
    <div class="diary-register-container">
        <div class="header">
            <button @click="goBack" class="back-button">
                <img src="@/assets/image/back.png" alt="Back" class="back-image" />
            </button>
            <h1>일기</h1>
            <button type="button" @click="submitDiaryForm" class="submit-button">완료</button>
        </div>
        <div class="user-info">
            <img :src="user.profileImg" alt="Profile Image" class="profile-image" />
            <div>
                <h4>{{ user.nickname }}</h4>
                <p>{{ privacyText }}</p>
            </div>
        </div>

        <form @submit.prevent="submitDiaryForm" class="diary-form">
            <div class="form-group">
                <input type="date" v-model="diary.dDate" required readonly />
            </div>
            <div class="form-group-head">
                <button type="button" @click="toggleEmojiPicker" class="emoji-button">
                    <img v-if="selectedEmoji === ''" src="@/assets/image/emoji.png" alt="Emoji" />
                    <span id="emojiView" v-else>{{ selectedEmoji }}</span>
                </button>
                <emoji-picker :show="showEmojiPicker" @select-emoji="setEmoji" />
                <div class="temperature-view" v-if="diary.temperature !== ''">
                    <span v-if="diary.temperature !== null">{{ diary.temperature }}°</span>
                    <div class="temperature-gauge" v-if="diary.temperature !== null">
                        <div class="temperature-fill" :style="{ width: diary.temperature + '%' }"></div>
                    </div>
                </div>
            </div>

            <div class="form-group" id="title">
                <input type="text" v-model="diary.title" placeholder="오늘의 하루를 한줄로 요약해주세요" required />
            </div>

            <div class="line"></div>

            <div class="form-group">
                <div class="img">
                    <img v-if="uploadedImage" :src="uploadedImage" alt="Uploaded Image" class="uploaded-image" />
                    <img v-if="uploadedImage" src="@/assets/image/cancel.png" @click="removeImage" class="cancel" />
                </div>
                <textarea
                    v-model="diary.contents"
                    :placeholder="`${user.nickname}님의 오늘은 어떤 하루였나요?`"
                    required
                ></textarea>
            </div>
            <div class="bottom-bar">
                <div class="form-group">
                    <img
                        src="@/assets/image/temperature.png"
                        alt="Temperature"
                        class="temperature-image"
                        @click="toggleTemperatureSelector"
                    />
                </div>

                <div class="form-group">
                    <label class="file-upload-label" @click="triggerFileUpload">
                        <img src="@/assets/image/photo.png" alt="Upload" class="photo-upload-image" />
                    </label>
                    <input type="file" ref="fileUploadInput" @change="handleFileUpload" class="file-upload-input" />
                    <!--img v-if="uploadedImage" :src="uploadedImage" alt="Uploaded Image" class="uploaded-image" /-->
                    <input type="hidden" id="uploadedImageUri" name="uploadedImage" :value="uploadedImage" />
                </div>
            </div>
        </form>
        <div class="response-message">{{ responseMessage }}</div>

        <temperature-selector-compo :show="showTemperatureSelector" @temperature-selected="setTemperature" />
    </div>
</template>

<script>
import axios from 'axios';
import EmojiPicker from './EmojiPickerCompo.vue';
import TemperatureSelectorCompo from './TemperatureSelectorCompo.vue';

export default {
    components: {
        EmojiPicker,
        TemperatureSelectorCompo,
    },
    data() {
        return {
            diary: {
                title: '',
                contents: '',
                dDate: '',
                temperature: '',
                status: '',
                emoji: '',
                memberId: '',
            },
            user: {
                profileImg: '',
                nickname: '',
                privacy: '',
            },
            file: null,
            responseMessage: '',
            uploadedImage: '', // 업로드된 이미지의 URL을 저장하기 위한 변수 추가
            errorMessage: '',
            showEmojiPicker: false,
            showTemperatureSelector: false,
            selectedEmoji: '', // 기본 이모지
        };
    },
    computed: {
        privacyText() {
            switch (this.user.privacy) {
                case '1':
                case 'open':
                    return '🌐 전체공개';
                case '2':
                    return '👥 팔로워 공개';
                case '3':
                    return '🔒 나만보기';
                default:
                    return '';
            }
        },
    },
    methods: {
        async fetchUserInfo() {
            try {
                const res = await axios.get('http://localhost:8080/member/profile', {
                    headers: {
                        // 세션스토리지에 있는 토큰값을 가져와서 header에 넣어준다.
                        access: sessionStorage.getItem('access'),
                    },
                });
                console.log(res.data);
                this.user = res.data;
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        },
        handleFileUpload(event) {
            this.file = event.target.files[0];
            this.previewImage(event); // 파일 선택 시 미리보기 이미지 설정
        },
        previewImage(event) {
            const input = event.target;
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadedImage = e.target.result; // 이미지 미리보기 URL 설정
                };
                reader.readAsDataURL(input.files[0]);
            }
        },
        toggleEmojiPicker() {
            this.showEmojiPicker = !this.showEmojiPicker;
        },
        toggleTemperatureSelector() {
            this.showTemperatureSelector = !this.showTemperatureSelector;
        },
        setEmoji(emoji) {
            this.selectedEmoji = emoji;
            this.diary.emoji = emoji;
            this.showEmojiPicker = false;
        },
        setTemperature(value) {
            this.diary.temperature = value;
            this.showTemperatureSelector = false;
        },
        triggerFileUpload() {
            this.$refs.fileUploadInput.click();
        },
        removeImage() {
            this.uploadedImage = '';
            this.file = null;
        },
        async submitDiaryForm() {
            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('diaryDTO', new Blob([JSON.stringify(this.diary)], { type: 'application/json' }));

            try {
                const token = sessionStorage.getItem('access'); // 세션 스토리지에서 토큰을 가져옴
                const response = await axios.post('http://localhost:8080/diary/register', formData, {
                    headers: {
                        access: `${token}`, // Authorization 헤더에 JWT 토큰 추가
                    },
                });

                if (response.status !== 200) {
                    throw new Error('Diary creation failed');
                }

                this.uploadedImage = response.data;
                this.responseMessage = 'Diary created successfully!';
                this.resetForm();
            } catch (error) {
                this.errorMessage = error.message;
            }
        },
        updateTemperature(event) {
            this.diary.temperature = event.target.value;
        },
        resetForm() {
            this.diary = {
                title: '',
                contents: '',
                dDate: '',
                temperature: '',
                status: '',
                emoji: '',
                memberId: '',
            };
            this.file = null;
        },
        goBack() {
            this.$router.go(-1); // 뒤로 가기
        },
        getTodayDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더합니다.
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
    },
    created() {
        this.fetchUserInfo(); // 컴포넌트가 생성될 때 사용자 정보 가져오기
        this.diary.dDate = this.getTodayDate(); // 오늘 날짜 설정
    },
};
</script>

<style scoped>
@import '@/assets/diaryInsert.css';
</style>
