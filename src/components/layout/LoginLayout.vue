<!-- 작성자 : leejongseop(이종섭)-->
<template>
    <div class="login-layout">
        <router-view />
        <!-- <footer-compo class="footer" /> -->
        <div class="emoji-background">
            <div
                v-for="(emoji, index) in emojis"
                :key="index"
                class="emoji"
                :style="{
                    left: emoji.left,
                    top: emoji.top,
                    fontSize: emoji.fontSize,
                    color: emoji.color,
                }"
            >
                {{ emoji.symbol }}
            </div>
        </div>
    </div>
</template>

<script>
import FooterCompo from '@/components/layout/FooterCompo.vue';

export default {
    // components: {
    //     FooterCompo,
    // },
    data() {
        return {
            emojis: [
                { symbol: '😀', left: '10%', top: '10%', fontSize: '3rem', color: '#FF5733' },
                { symbol: '🚀', left: '20%', top: '10%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '😀', left: '70%', top: '10%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '🚀', left: '90%', top: '10%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '🍕', left: '30%', top: '20%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '🎵', left: '80%', top: '20%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '🍕', left: '30%', top: '30%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '😀', left: '80%', top: '30%', fontSize: '3rem', color: '#FF5733' },
                { symbol: '🚀', left: '90%', top: '30%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '😀', left: '10%', top: '40%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '🎵', left: '70%', top: '40%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '😀', left: '10%', top: '50%', fontSize: '3rem', color: '#FF5733' },
                { symbol: '🍕', left: '20%', top: '50%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '😀', left: '70%', top: '50%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '🍕', left: '20%', top: '70%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '🚀', left: '70%', top: '70%', fontSize: '3rem', color: '#FF5733' },
                { symbol: '😀', left: '80%', top: '70%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '🎵', left: '10%', top: '90%', fontSize: '3rem', color: '#FF5733' },
                { symbol: '🍕', left: '20%', top: '90%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '🍕', left: '70%', top: '90%', fontSize: '3rem', color: '#FF5733' },

                { symbol: '😀', left: '90%', top: '90%', fontSize: '3rem', color: '#FF5733' },

                // 추가 이모지 위치 설정
            ],
        };
    },
    methods: {
        generateEmojis() {
            const emojis = ['😀', '🍕', '🚀', '🌟', '🐶', '🎵', '❤️', '🔥'];
            return Array.from({ length: 20 }, () => ({
                symbol: emojis[Math.floor(Math.random() * emojis.length)],
                left: Math.random() * 100 + 'vw',
                // left: this.getRandomLeftPosition(),
                top: Math.random() * 100 + 'vh',
                fontSize: Math.random() * 3 + 1 + 'rem',
                color: this.getRandomColor(),
            }));
        },

        getRandomColor() {
            const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#F1C40F'];
            return colors[Math.floor(Math.random() * colors.length)];
        },
    },
};
</script>

<style scoped>
@import '@/assets/base.css';
.login-layout {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
    overflow: hidden;
}

.emoji-background {
    position: absolute; /* Position absolutely within the login-layout */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Ensure emojis don't interfere with interactions */
    overflow: hidden; /* Ensure emojis do not go outside the emoji-background */
}
.emoji {
    position: absolute;
}
.router-view-container {
    position: relative;
    z-index: 1; /* Ensure router-view content is on top of emojis */
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.emoji {
    position: absolute;
    /* Limit the maximum size of emojis */
    max-width: 10rem;
    max-height: 10rem;
}
</style>
