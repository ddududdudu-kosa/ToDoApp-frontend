<!-- 작성자 : leejongseop(이종섭) -->
<template>
    <div class="form-signin">
        <b-container>
            <b-form @submit.prevent="onSubmit">
                <img src="@/assets/todotodo-logo.png" alt="" />
                <!-- <h1 class="h3 mb-3 fw-normal" id="login-title">로그인 페이지</h1> -->

                <div class="form-floating">
                    <b-form-input
                        type="text"
                        class="form-control"
                        id="id"
                        v-model="email"
                        placeholder="아이디 입력..."
                    />
                    <label for="id">이메일</label>
                </div>
                <div class="form-floating">
                    <b-form-input
                        type="password"
                        class="form-control"
                        id="pwd"
                        v-model="password"
                        placeholder="Password"
                    />
                    <label for="pwd">비밀번호</label>
                </div>

                <button class="w-100 btn btn-lg btn-primary" type="submit">로그인</button>
                <div class="checkbox mb-3" id="signup-area">
                    <router-link to="/signup" id="signup-text"> 회원가입</router-link>
                </div>
                <p class="mt-5 mb-3 text-muted copy" style="margin-top: 30px">&copy; 2024 KOSA 4조 TODOTODO</p>
            </b-form>
        </b-container>
    </div>
</template>

<script>
import axios from 'axios';

const login = async (email, password) => {
    // ajax응답이 무조건 오고 나서 그 다음 코드가 실행돼야함 (await)
    const res = await axios.post(
        'http://localhost:8080/login',
        {
            email: email,
            password: password,
        },
        {
            withCredentials: true,
        },
    );

    console.log(res.headers['access']);

    if (res.status === 200) {
        // 토큰과 이메일을 세션스토리지에 저장
        if (sessionStorage.getItem('access') !== null) {
            sessionStorage.clear();
        }
        sessionStorage.setItem('access', res.headers['access']);
        sessionStorage.setItem('email', email);
        return true;
    } else {
        return false;
    }
};

export default {
    data() {
        return {
            model: {
                email: '',
                password: '',
            },
        };
    },
    methods: {
        onSubmit() {
            console.log('이메일 : ' + this.email + ', 비밀번호 : ' + this.password);
            login(this.email, this.password).then((result) => {
                if (result) {
                    alert('로그인 성공');
                    this.$router.push('/feed');
                } else {
                    alert('로그인에 실패했습니다.');
                }
            });
        },
        logout() {
            alert('로그아웃 되었습니다.');
            sessionStorage.clear();
        },
    },
    mounted: function () {
        if (sessionStorage.getItem('access') !== null) {
            alert('로그아웃 되었습니다.');
        }
        sessionStorage.clear();
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

.form-signin input[type='email'] {
    margin-bottom: -1px;
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
img {
    width: 100%;
    align-items: center;
    margin-top: 15px;
}
.container {
    background-color: white;
    border-radius: 10%;
}
.copy {
    align-items: center;
    text-align: center;
    margin-top: 20px;
}
#signup-area {
    margin-top: 20px;
    text-align: center;
    align-items: center;
}

#signup-text {
    text-align: center;
    align-items: center;
    color: gray;
    text-decoration-line: none;
}

#signup-text:hover {
    color: #0d6efd;
}
</style>
