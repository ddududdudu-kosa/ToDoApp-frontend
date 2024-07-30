<template>
    <div class="form-signin" role="group">
        <b-container>
            <b-form @submit.prevent="onSubmit">
                <h1 class="h3 mb-3 fw-normal" id="login-title">회원가입 페이지</h1>

                <div class="form-floating">
                    <b-form-input
                        type="text"
                        class="form-control"
                        id="id"
                        placeholder="아이디 입력..."
                        v-model="email"
                    />
                    <b-button class="email-confirm" id="email-confirm" variant="outline-primary" @click="isExist"
                        >중복확인</b-button
                    >
                    <b-button
                        class="email-confirm"
                        id="email-code-confirm"
                        variant="outline-primary"
                        @click="emailConfirm"
                        >인증코드</b-button
                    >
                    <label for="id">이메일</label>
                </div>
                <div class="form-floating">
                    <b-form-input
                        type="password"
                        class="form-control"
                        id="pwd"
                        placeholder="Password"
                        v-model="password"
                    />
                    <label for="pwd">비밀번호</label>
                </div>

                <div class="form-floating">
                    <b-form-input
                        type="password"
                        class="form-control"
                        id="pwd-confirm"
                        placeholder="PasswordConfirm"
                        v-model="passwordConfirm"
                    />

                    <label for="pwd">비밀번호 확인</label>
                </div>

                <div class="form-floating">
                    <b-form-input
                        type="text"
                        class="form-control"
                        id="email-confirm-code"
                        placeholder="아이디 입력..."
                        v-model="emailCodeConfirm"
                    />
                    <label for="id">이메일 인증코드</label>
                </div>

                <div class="form-floating">
                    <b-form-input
                        v-model="nickname"
                        type="text"
                        class="form-control"
                        id="nickname"
                        placeholder="nickname"
                    />

                    <label for="nickname">닉네임</label>
                </div>

                <div class="form-floating">
                    <b-form-textarea class="form-control" id="intro"></b-form-textarea>

                    <label for="intro">소개</label>
                </div>
                <!-- <b-form-group label="프로필 사진:" label-cols-sm="2">
                    <b-form-file id="file-default"></b-form-file>
                </b-form-group> -->
                <!-- Plain mode -->
                <div class="d-flex justify-content-between align-items-center" id="profile">
                    <label for="profile">프로필</label>
                    <b-form-file v-model="file" class="mt-3" plain></b-form-file>
                </div>
                <button class="w-100 btn btn-lg btn-primary" type="submit">회원가입</button>
                <p class="mt-5 mb-3 text-muted">&copy; 2024</p>
            </b-form>
        </b-container>
    </div>
</template>

<script>
import axios from 'axios';

const sendMailCode = async (email) => {
    // ajax응답이 무조건 오고 나서 그 다음 코드가 실행돼야함 (await)
    const res = await axios.post(
        'http://localhost:8080/api/mail/confirm',
        {
            email: email,
        },
        {
            withCredentials: true,
        },
    );
    console.log(res);
    const data = res.data;
    if (data.code === '200') {
        return true;
    } else {
        return false;
    }
};

const mailExist = async (email) => {
    // ajax응답이 무조건 오고 나서 그 다음 코드가 실행돼야함 (await)
    const res = await axios
        .post(
            'http://localhost:8080/api/mail/exist',
            {
                email: email,
            },
            {
                withCredentials: true,
            },
        )
        .then((res) => {
            console.log(res);
            const data = res.data;
            alert(data);
        })
        .catch((error) => {
            // 오류 처리 로직
            console.error('Error occurred while checking email existence:', error);
            alert('이미 사용중인 메일입니다.');
            return false;
        });
};

const joinUser = async (file, jsonData) => {
    const formData = new FormData();
    formData.append('profile', file);
    formData.append('JoinDTO', JSON.stringify(jsonData));
    // formData.append('JoinDTO', jsonData);

    try {
        const response = await axios.post('http://localhost:8080/join', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true, // 필요시 사용
        });
        console.log('Upload successful:', response.data);
        console.log('회원가입 성공');
        alert('회원가입 성공');
        return true;
    } catch (error) {
        console.error('Error uploading:', error);
        console.log('회원가입 실패');
        alert('회원가입 실패');
        return false;
    }
};

export default {
    computed: {
        passwordState() {
            return this.password === this.passwordConfirm ? true : false;
        },
    },
    data() {
        return {
            email: '',
            password: '',
            passwordConfirm: '',
            emailConfirmCode: '',
            nickname: '',
            intro: '',
            file: '',
        };
    },
    methods: {
        onSubmit() {
            if (this.password !== this.passwordConfirm) {
                alert('비밀번호가 일치하지 않습니다');
                return;
            }
            // console.log(this.file);
            joinUser(this.file, {
                email: this.email,
                password: this.password,
                nickname: this.nickname,
                intro: this.intro,
            }).then((result) => {
                if (result) {
                    this.$router.push('/'); // 메인 페이지로 이동
                }
            });
        },
        emailConfirm() {
            if (sendMailCode(this.email)) {
                alert('이메일 인증 코드 발송');
            } else {
                alert('이메일 인증 코드 발송 실패');
            }
        },
        isExist() {
            mailExist(this.email);
        },
    },
};
</script>

<style scoped>

@import '@/assets/member.css';
.form-signin {
    width: 100%;
    max-width: 500px;
    padding: 15px;
    margin: auto;
}

.form-signin .checkbox {
    font-weight: 400;
}

.form-signin .form-floating:focus-within {
    z-index: 2;
}

.form-floating {
    margin-bottom: 10px;
    display: flex;
}

.form-signin input[type='email'] {
    /* margin-bottom: -1px; */
    margin-bottom: 10px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.form-signin input[type='password'] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

#login-title {
    text-align: center;
}

#login-icon {
    justify-content: center;
}

#email-confirm {
    margin-left: 5px;
    margin-right: 5px;
}

.email-confirm {
    font-size: 10px;
    width: 100px;
}
#text-danger {
    color: #dc3545; /* Bootstrap의 text-danger 색상 */
}
#text-success {
    color: #198754; /* Bootstrap의 text-success 색상 */
}
#profile {
    margin-bottom: 10px;
}
</style>
