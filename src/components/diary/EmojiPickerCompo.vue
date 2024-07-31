<template>
    <div v-if="show" class="emoji-picker">
        <div v-for="emoji in emojis" :key="emoji" @click="selectEmoji(emoji)" class="emoji">
            {{ emoji }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            emojis: [
                '😃',
                '😄',
                '😁',
                '😆',
                '😅',
                '😂',
                '🙂',
                '🙃',
                '😉',
                '😊',
                '😇',
                '🥰',
                '😍',
                '🤩',
                '😘',
                '😗',
                '😚',
                '😙',
                '😋',
                '😛',
                '😜',
                '😝',
                '🤪',
                '🤨',
                '🧐',
                '🤓',
                '😎',
                '🥳',
                '😤',
                '😡',
                '😠',
                '🤬',
                '😈',
                '👿',
                '💀',
                '☠️',
                '👻',
                '👽',
                '🤖',
                '🎃',
                '😺',
                '😸',
                '😹',
                '😻',
                '😼',
                '😽',
                '🙀',
                '😿',
                '😾',
            ],
        };
    },
    methods: {
        selectEmoji(emoji) {
            this.$emit('select-emoji', emoji);
        },
    },
};
</script>

<style scoped>
.emoji-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    background: white;
    border: 1px solid #ccc;
    padding: 10px;
    position: absolute;
    z-index: 1000;
}
.emoji {
    cursor: pointer;
}
</style>
