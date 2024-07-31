<template>
    <div class="bg-light p-4 rounded-3 mb-4">
        <div class="level-item">
            <img src="@/assets/gold.png" class="level-icon" alt="Level 5 VIP icon" />
            <div div class="info">
                <div class="level-title">GOLD</div>
                <div class="level-info">100회 이상 TODO</div>
            </div>
        </div>

        <div class="level-item">
            <img src="@/assets/silver.png" class="level-icon" alt="Level 4 Master icon" />
            <div div class="info">
                <div class="level-title">SILVER</div>
                <div class="level-info">50회 이하 TODO</div>
            </div>
        </div>

        <div class="level-item">
            <img src="@/assets/bronze.png" class="level-icon" alt="Level 3 Hero icon" />
            <div div class="info">
                <div class="level-title">BRONZE</div>
                <div class="level-info">10회 이하 TODO</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style scoped>
.level-item {
    padding: 10px 20px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
}
.level-icon {
    width: 50px;
    height: 50px;
    margin-right: 15px;
    object-fit: cover;
    border-radius: 50%;
}
.level-title {
    font-weight: bold;
    font-size: 1.1rem;
}
.level-info {
    color: #555;
}
.info {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 좌우 여백을 자동으로 분배 */
    width: 100%;
}
</style>
