<template>
    <div>
        <h1>Register Diary</h1>
        <form @submit.prevent="submitDiaryForm">
            <label for="title">Title:</label>
            <input type="text" v-model="diary.title" required /><br /><br />

            <label for="contents">Contents:</label>
            <textarea v-model="diary.contents" required></textarea><br /><br />

            <label for="dDate">Date:</label>
            <input type="date" v-model="diary.dDate" required /><br /><br />

            <label for="emoji">Emoji:</label>
            <button type="button" @click="toggleEmojiPicker">{{ selectedEmoji }}</button>
            <emoji-picker :show="showEmojiPicker" @select-emoji="setEmoji" /><br /><br />

            <label for="temperature">Temperature:</label>
            <input type="range" v-model="diary.temperature" min="0" max="100" @input="updateTemperature" /><br />
            <span>{{ diary.temperature }}</span
            ><br /><br />

            <label for="file">Upload Image:</label>
            <input type="file" @change="handleFileUpload" />
            <img v-if="uploadedImage" :src="uploadedImage" alt="Uploaded Image" />
            <input type="hidden" id="uploadedImageUri" name="uploadedImage" :value="uploadedImage" />
            <br /><br />

            <button type="submit">Add Diary</button>
        </form>
        <div>{{ responseMessage }}</div>
    </div>
</template>

<script>
import axios from 'axios';
import EmojiPicker from './EmojiPickerCompo.vue';

export default {
    components: {
        EmojiPicker,
    },
    data() {
        return {
            diary: {
                title: '',
                contents: '',
                dDate: '',
                temperature: 36,
                status: '',
                emoji: '',
                memberId: '',
            },
            file: null,
            responseMessage: '',
            uploadedImage: '', // 업로드된 이미지의 URL을 저장하기 위한 변수 추가
            errorMessage: '',
            showEmojiPicker: false,
            selectedEmoji: '😊', // 기본 이모지
        };
    },
    methods: {
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
        setEmoji(emoji) {
            this.selectedEmoji = emoji;
            this.diary.emoji = emoji;
            this.showEmojiPicker = false;
        },
        async submitDiaryForm() {
            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('diaryDTO', new Blob([JSON.stringify(this.diary)], { type: 'application/json' }));

            try {
                const response = await fetch('http://localhost:8080/diary/register', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Diary creation failed');
                }

                const imageUrl = await response.text();
                this.uploadedImage = imageUrl;
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
                temperature: 36,
                status: '',
                emoji: '',
                memberId: '',
            };
            this.file = null;
        },
    },
};
</script>

<style>
/* 필요한 스타일을 여기에 추가하세요 */
</style>
