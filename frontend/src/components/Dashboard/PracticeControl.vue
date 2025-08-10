<script setup>
import { ref, computed } from 'vue'
const emit = defineEmits(['end-practice'])
const moduleName = ref('Practice Controls')
//const time = ref('time')
const formattedTime = computed(() => {
    const mins = Math.floor(seconds.value / 60)
    const secs = seconds.value % 60
    return `${mins.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`
})

//timer
const seconds = ref(0)
const isRunning = ref(false)
const isPaused = ref(false)
let intervalId = null

const startPractice = () => {
    if (!isRunning.value) {
        seconds.value = 0
        isRunning.value = true
    }
    if (!intervalId) {
        intervalId = setInterval(() => {
            seconds.value++
        }, 1000)
    }
}
const pausePractice = () => {
    if (isRunning.value) {
        if (isPaused.value) {
            // Resume
            isPaused.value = false
            intervalId = setInterval(() => {
                seconds.value++
            }, 1000)
        } else {
            // Pause
            isPaused.value = true
            clearInterval(intervalId)
            intervalId = null
        }
    }
}
const endPractice = () => {
    emit('end-practice', seconds)
    isRunning.value = false
    isPaused.value = false
    seconds.value = 0

    if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
    }
}
const getSeconds = () => {
    return seconds.value
}
defineExpose({
    seconds,
    getSeconds
})
</script>
<template>
    <div class="content">
        <div class="moduleName">{{ moduleName }}</div>
        <div class="current-session-info">
            <div class="timer">Current time elapsed: {{ formattedTime }}</div>
            <!-- <div class="current-bpm">{{ currentBpm }}</div> -->
        </div>
        <div class="btn-group">
            <button
                class="btn start-btn"
                @click="startPractice"
                :disabled="isRunning"
            >
                START
            </button>
            <button
                class="btn pause-btn"
                @click="pausePractice"
                :disabled="!isRunning"
            >
                {{ isPaused ? 'RESUME' : 'PAUSE' }}
            </button>
            <button
                class="btn end-btn"
                @click="endPractice"
                :disabled="!isRunning"
            >
                END
            </button>
        </div>
    </div>
</template>
<style scoped>
.moduleName {
    font-size: larger;
    text-decoration: underline;
}

.content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
}

.current-session-info {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 75%;
}

.btn-group {
    display: flex;
    gap: 8px;
    justify-content: center;
}

.btn {
    padding: 0.75rem 1.25rem;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 100px;
    font-family: inherit;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.start-btn {
    background-color: #22c55e;
    color: white;
}

/* .start-btn:hover:not(:disabled) {
    background-color: #16a34a;
    transform: translateY(-2px);
} */

.pause-btn {
    background-color: #f59e0b;
    color: white;
}

/* .pause-btn:hover:not(:disabled) {
    background-color: #d97706;
    transform: translateY(-2px);
} */

.end-btn {
    background-color: #ef4444;
    color: white;
}

/* .end-btn:hover:not(:disabled) {
    background-color: #dc2626;
    transform: translateY(-2px);
} */
</style>
