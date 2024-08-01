<template>
    <div class="temperature-selector" v-if="show">
        <div class="temperature-header">
            <h3>기분 온도</h3>
        </div>
        <div class="temperature-value">
            <img src="@/assets/image/bad.png" />
            <span>{{ temperature }}°</span>
            <img src="@/assets/image/good.png" />
        </div>
        <input type="range" v-model="temperature" min="0" max="100" @input="updateTemperature" :style="inputStyle" />
        <div class="temperature-footer">
            <button @click="confirmTemperature">확인</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['show'],
    data() {
        return {
            temperature: 50,
        };
    },
    computed: {
        inputStyle() {
            const percentage = this.temperature;
            return {
                background: `linear-gradient(90deg, #ff0000 ${percentage}%, #3ea5ff ${percentage}%)`,
            };
        },
    },
    methods: {
        updateTemperature(event) {
            this.temperature = event.target.value;
        },
        confirmTemperature() {
            this.$emit('temperature-selected', this.temperature);
        },
    },
    watch: {
        initialTemperature(newVal) {
            this.temperature = newVal;
        },
    },
};
</script>

<style scoped>
.temperature-selector {
    position: fixed;
    bottom: 0;
    left: 55%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 600px;
    height: 420px;
    background: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    box-sizing: border-box;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.temperature-header {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}
.temperature-value {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    margin-bottom: 20px;
}

.temperature-value > img {
    width: 30px;
    height: 30px;
}
input[type='range'] {
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;
    background: linear-gradient(90deg, #ff0000 0%, #3ea5ff 100%);
    outline: none;
    opacity: 0.7;
    transition: opacity 0.15s ease-in-out;
}
input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transition: box-shadow 0.15s ease-in-out;
}
input[type='range']::-webkit-slider-thumb:hover {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
}
input[type='range']::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: box-shadow 0.15s ease-in-out;
}
input[type='range']::-moz-range-thumb:hover {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
}
.temperature-footer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
button {
    padding: 10px 20px;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
}
button:hover {
    background-color: #0056b3;
}
</style>
