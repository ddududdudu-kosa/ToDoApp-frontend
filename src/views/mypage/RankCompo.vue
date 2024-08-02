<!-- 작성자 : leejongseop(이종섭) -->
<template>
    <div class="bg-secondary bg-opacity-10 p-4 rounded-3 mb-4">
        <span id="rank-title">명예의 전당 (상위 5명)</span>
        <div class="bg-light p-4 rounded-3 mb-4 rank-body">
            <div class="level-item" v-for="item in items" :key="item.id">
                <img :src="item.profileImg" class="level-icon" />
                <div class="info">
                    <div class="level-title">{{ item.email }} ({{ item.nickname }})</div>
                    <div class="level-info">누적 TODO 달성 횟수 {{ item.totalAchievementCount }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
const getTop5 = async () => {
    // ajax응답이 무조건 오고 나서 그 다음 코드가 실행돼야함 (await)
    return await axios.get(
        'http://localhost:8080/mypage/top5',
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
            items: [],
        };
    },
    mounted: function () {
        getTop5().then((response) => {
            console.log('명예의 전당');
            console.log(response.data);
            this.items = response.data;
        });
    },
};
</script>

<style scoped>
.level-item {
    padding: 10px 5px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    width: 100%;
    /* align-items: center; */
}
.level-icon {
    width: 50px;
    height: 50px;
    margin-right: 15px;
    object-fit: cover;
    border-radius: 50%;
    border: solid 1px black;
}
.level-title {
    font-weight: bold;
    font-size: 1.1rem;
    width: 70%;
}
.level-info {
    color: #555;
    align-items: right;
    text-align: right;
    /* margin-left: auto; 왼쪽 여백을 자동으로 늘려서 오른쪽 끝으로 이동 */
}
.info {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 좌우 여백을 자동으로 분배 */
    width: 100%;
}
.rank-body {
    margin-top: 10px;
}
</style>
