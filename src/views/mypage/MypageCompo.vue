<template>
    <div>mypage</div>
</template>

<script>
import axios from 'axios';

const getMyPage = async () => {
    // ajax응답이 무조건 오고 나서 그 다음 코드가 실행돼야함 (await)
    const res = await axios
        .get(
            'http://localhost:8080/mypage',
            {
                headers: {
                    access: sessionStorage.getItem('access'),
                },
            },
            {
                withCredentials: true,
            },
        )
        .then((response) => {
            // response.data에 스프링에서 반환한 값이 들어있음
            console.log(response.data);
        });
};

const getMyGraph = async () => {
    // ajax응답이 무조건 오고 나서 그 다음 코드가 실행돼야함 (await)
    const res = await axios
        .get(
            'http://localhost:8080/mypage/follower/graph',
            {
                headers: {
                    access: sessionStorage.getItem('access'),
                },
            },
            {
                withCredentials: true,
            },
        )
        .then((response) => {
            // response.data에 스프링에서 반환한 값이 들어있음
            console.log(response.data);
        });
};
const getSaying = async () => {
    // ajax응답이 무조건 오고 나서 그 다음 코드가 실행돼야함 (await)
    const res = await axios
        .get(
            'http://localhost:8080/mypage/saying',
            {
                headers: {
                    access: sessionStorage.getItem('access'),
                },
            },
            {
                withCredentials: true,
            },
        )
        .then((response) => {
            // response.data에 스프링에서 반환한 값이 들어있음
            console.log(response.data);
        });
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
    mounted: function () {
        if (sessionStorage.getItem('access') === null) {
            alert('로그인 후 이용가능합니다.');
            this.$router.push('/');
        }
        console.log('현재 로그인한 유저명 : ' + sessionStorage.getItem('email'));
        getMyPage();
        getSaying();
    },
    methods: {},
};
</script>

<style scoped>
@import '@/assets/member.css';
</style>
