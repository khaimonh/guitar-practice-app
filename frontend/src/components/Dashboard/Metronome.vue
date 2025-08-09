<script setup>
import { ref, watch } from 'vue'
// Define emits for parent component communication
const emit = defineEmits(['bpm-changed']) //emits are definable events that parent listens for
const moduleName = ref('Metronome')
const bpm = ref(65) // Default BPM value
const minBpm = 40
const maxBpm = 240

//watch runs every time the variable bpm is changed
//this function is to validate the bpm input
watch(bpm, (newValue) => {
    if (newValue < minBpm) {
        bpm.value = minBpm
    } else if (newValue > maxBpm) {
        bpm.value = maxBpm
    }
    emit('bpm-changed', newValue) //lets parent know that bpm was changed and gives newValue
})

// Handle number input changes
const handleBpmInput = (event) => {
    // Get the raw input value from the event
    const inputValue = event.target.value

    // Convert string to integer
    const numericValue = parseInt(inputValue)

    // Check if the conversion resulted in a valid number
    if (!isNaN(numericValue)) {
        // Update the bpm ref with the new value
        bpm.value = numericValue
    }
    // If input is invalid (NaN), we ignore it and keep the current bpm value
}
// Method to get current BPM (useful for practice session saving)
const getCurrentBPM = () => {
    return bpm.value
}

// Method to reset BPM to default
const resetBPM = () => {
    bpm.value = 65
}

// Method to set BPM programmatically
const setBPM = (newBPM) => {
    if (newBPM >= minBpm && newBPM <= maxBpm) {
        bpm.value = newBPM
    }
}

// Expose methods and reactive values to parent component
defineExpose({
    bpm, // Reactive ref - parent can access bpm.value
    getCurrentBPM, // Method to get current BPM value
    resetBPM, // Method to reset BPM
    setBPM, // Method to set BPM programmatically
    // minBpm, // Min BPM constant
    // maxBpm, // Max BPM constant
})
</script>
<template>
    <div class="content">
        <div class="moduleName">{{ moduleName }}</div>

        <div class="bpm-controls">
            <div class="bpm-display">
                <span class="bpm-label">BPM:</span>
                <span class="bpm-value">{{ bpm }}</span>
            </div>

            <!-- Number input -->
            <div class="input-group">
                <label for="bpm-number">Number:</label>
                <input
                    id="bpm-number"
                    type="number"
                    :value="bpm"
                    @change="handleBpmInput"
                    :min="minBpm"
                    :max="maxBpm"
                    class="bpm-number"
                />
            </div>
            <!-- Slider input -->
            <div class="input-group">
                <label for="bpm-slider">Slider:</label>
                <input
                    id="bpm-slider"
                    type="range"
                    v-model="bpm"
                    :min="minBpm"
                    :max="maxBpm"
                    class="bpm-slider"
                />
            </div>
        </div>
    </div>
</template>
<style scoped>
.moduleName {
    font-size: larger;
    text-decoration: underline;
}
.bpm-controls {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 300px;
}

.bpm-display {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: bold;
}

.bpm-label {
    color: #666;
}

.bpm-value {
    color: #333;
    background: #f0f0f0;
    padding: 5px 10px;
    border-radius: 4px;
    min-width: 50px;
    text-align: center;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.bpm-slider,
.bpm-number {
    padding: 8px 12px;
    border: 2px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}
.bpm-number::-webkit-outer-spin-button,
.bpm-number::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none; /* ← Added standard property */
    margin: 0;
}

/* Firefox */
.bpm-number[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield; /* ← Added standard property */
}
.bpm-number:focus {
    outline: none;
    border-color: #4caf50;
}
</style>
