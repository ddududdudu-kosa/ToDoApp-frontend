<template>
    <div class="main-content">
        <!-- Profile Info -->
        <div class="d-flex align-items-center mb-4">
            <img :src="myInfo.profileImg" class="profile-img me-3" alt="Profile" />
            <div>
                <h2 class="fs-4">
                    {{ myInfo.nickname }}&nbsp;<small>({{ email }})</small>
                </h2>
                <div class="d-flex">
                    <span class="me-4"
                        >팔로우 <span>{{ nowFollowsLen }}</span></span
                    >
                    <span>
                        소개 <span>{{ myInfo.intro }}</span></span
                    >
                </div>
            </div>
        </div>

        <!-- User Status -->
        <div class="bg-light p-4 rounded-3 mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center">
                    <img :src="nowMyRankImg" class="status-icon me-3" alt="Gold status icon" />
                    <div>
                        <h3 class="fs-5 mb-1">{{ nowMyRank }}</h3>
                        <p class="text-muted mb-0">{{ upRating }}</p>
                    </div>
                </div>
                <!-- <router-link to="/mypage/rating">등급보기</router-link> -->
                <!-- <button class="btn btn-link text-primary">등급 보기</button> -->
            </div>
            <div class="row text-center">
                <div class="col bg-white p-3 m-1 rounded-3">
                    <i class="fas fa-history fa-2x text-muted mb-2"></i>
                    <p class="mb-0"><router-link to="/mypage/rating">등급보기</router-link></p>
                </div>
                <div class="col bg-white p-3 m-1 rounded-3">
                    <i class="fas fa-trophy fa-2x text-muted mb-2"></i>
                    <p class="mb-0"><router-link to="/mypage/rank">명예의 전당</router-link></p>
                </div>
            </div>
        </div>
        <router-view></router-view>
        <!-- Progress Bar -->
        <div class="bg-light p-4 rounded-3 mb-4">
            <p class="text-center mb-3">
                <i>{{ saying }}</i>
            </p>
            <div class="progress mb-2">
                <div
                    class="progress-bar progress-bar-custom"
                    role="progressbar"
                    :style="{ width: progressBarWidth + '%' }"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    :aria-valuenow="progressBarWidth"
                ></div>
            </div>
            <p class="text-end text-muted">{{ completeMessage }}</p>
        </div>

        <!-- Monthly Battle -->
        <div>
            <h3 class="fs-5 mb-3">이번 달 투두 배틀</h3>
            <div class="row">
                <div class="col bg-light p-4 rounded-3 text-center chart">
                    <canvas ref="MyChart"> </canvas>

                    <p>달성갯수</p>
                </div>
                <div class="col bg-light p-4 rounded-3 text-center chart">
                    <canvas ref="MyChart2"> </canvas>

                    <p>달성률</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const getMyPage = async () => {
    // ajax응답이 무조건 오고 나서 그 다음 코드가 실행돼야함 (await)
    return await axios.get(
        'http://localhost:8080/mypage',
        {
            headers: {
                access: sessionStorage.getItem('access'),
            },
        },
        {
            withCredentials: true,
        },
    );
};

const getMyGraph = async () => {
    // ajax응답이 무조건 오고 나서 그 다음 코드가 실행돼야함 (await)
    return await axios.get(
        'http://localhost:8080/mypage/follower/graph',
        {
            headers: {
                access: sessionStorage.getItem('access'),
            },
        },
        {
            withCredentials: true,
        },
    );
};
const getSaying = async () => {
    // ajax응답이 무조건 오고 나서 그 다음 코드가 실행돼야함 (await)
    return await axios.get(
        'http://localhost:8080/mypage/saying',
        {
            headers: {
                access: sessionStorage.getItem('access'),
            },
        },
        {
            withCredentials: true,
        },
    );
};
const getTodayComplete = async () => {
    // ajax응답이 무조건 오고 나서 그 다음 코드가 실행돼야함 (await)
    return await axios.get(
        'http://localhost:8080/mypage/today',
        {
            headers: {
                access: sessionStorage.getItem('access'),
            },
        },
        {
            withCredentials: true,
        },
    );
};

export default {
    data() {
        return {
            myRankImg: '', // 나의 랭크 이미지
            saying: '', // 명언
            myStats: '', // 나의 통계정보
            myFollowStats: '', // 나의 팔로우들의 통계정보
            today: '', // 오늘 목표 수
            complete: '', // 오늘 목표 중 달성 갯수
            myInfo: '', // 나의 정보
            totalFollow: '', // 팔로우들 정보
            email: '', // 나의 이메일
            password: '',
            type: 'bar',
            data: {
                labels: ['나', '내 친구들 평균'],
                datasets: [
                    {
                        data: [12, 19],
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                        borderWidth: 1,
                    },
                ],
            },
            data2: {
                labels: ['나', '내 친구들 평균'],
                datasets: [
                    {
                        data: [12, 19],
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
            options2: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100, // y축의 최대값을 100으로 설정 (100%)
                        ticks: {
                            callback: function (value) {
                                return value + '%'; // y축 레이블을 퍼센트로 표시
                            },
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
        };
    },
    mounted: function () {
        if (sessionStorage.getItem('access') === null) {
            alert('로그인 후 이용가능합니다.');
            this.$router.push('/');
        }
        console.log('현재 로그인한 유저명 : ' + sessionStorage.getItem('email'));
        this.email = sessionStorage.getItem('email');
        getMyPage().then((response) => {
            this.myInfo = response.data.myInfoList;
            this.totalFollow = response.data.myFollowsInfoList;
        });
        getMyGraph().then((response) => {
            this.myStats = response.data.myStats;
            this.myFollowStats = response.data.myFollowStats;

            this.data.datasets[0].data = [
                this.myStats.monthlyAchievementCount,
                this.myFollowStats.followMonthlyAchievementCount,
            ];

            this.data2.datasets[0].data = [
                this.myStats.monthlyAchievementRate,
                this.myFollowStats.followMonthlyAchievementRate,
            ];
            console.log(this.data);
            console.log(this.data2);
            this.createChart();
        });
        getSaying().then((response) => {
            this.saying = response.data;
        });
        getTodayComplete().then((response) => {
            this.today = response.data.today;
            this.complete = response.data.complete;
        });
    },
    methods: {
        createChart() {
            console.log('create chart');
            new Chart(this.$refs.MyChart, {
                type: 'bar',
                data: this.data,
                options: this.options,
            });
            new Chart(this.$refs.MyChart2, {
                type: 'bar',
                data: this.data2,
                options: this.options2,
            });
        },
    },
    computed: {
        progressBarWidth() {
            return Math.round((this.complete / this.today) * 100);
        },
        completeMessage() {
            return this.today === 0 ? '오늘 목표를 세우지 않았습니다!!' : this.today - this.complete;
        },
        nowFollowsLen() {
            return this.totalFollow.length;
        },
        nowMyRankImg() {
            if (this.myInfo.rating < 10) {
                return require('@/assets/bronze.png');
            } else if (this.myInfo.rating < 50) {
                return require('@/assets/silver.png');
            } else {
                return require('@/assets/gold.png');
            }
        },
        nowMyRank() {
            if (this.myInfo.rating < 10) {
                return 'BRONZE';
            } else if (this.myInfo.rating < 50) {
                return 'SILVER';
            } else {
                return 'GOLD';
            }
        },
        upRating() {
            if (this.myInfo.rating < 10) {
                return 10 - this.myInfo.rating + '투두 달성 시 SILVER 승급!!';
            } else if (this.myInfo.rating < 50) {
                return 50 - this.myInfo.rating + '투두 달성 시 GOLD 승급!!';
            } else {
                return '더 이상 승급할 단계가 없습니다.';
            }
        },
    },
};
</script>

<style scoped>
@import '@/assets/member.css';
.main-content {
    margin: 50px;
    /* margin-left: 20px;
    margin-top: 20px;
    margin-right: 20px; */
    padding: 20px;
}
.progress-bar-custom {
    background-color: #0d6efd;
}
.profile-img,
.status-icon {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid gray;
}
.user-icon {
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 50%;
}
.chart {
    width: 50%;
}
</style>
