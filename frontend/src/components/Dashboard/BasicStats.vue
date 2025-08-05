<script setup>
    import { ref } from 'vue';
    const totalHours = ref(1500)
    const averageBPM = ref (100)
    // add hardest exercise
</script>
<template>
    <div class="content">
        <div class="total-hours">Total Practice Hours: {{ totalHours }}</div>
        <div class="average-bpm">Average BPM: {{ averageBPM }}</div>
    </div>
</template>