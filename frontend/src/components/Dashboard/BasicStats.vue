<script setup>
    import { ref } from 'vue';
    const totalHours = ref(1500)
    const averageBPM = ref (100)
    const moduleName = ref('Basic Stats:')
    // add hardest exercise
</script>
<template>
    <div class="content">
        <div class="moduleName">{{ moduleName }}</div>
        <div class="total-hours">Total Practice Hours: {{ totalHours }}</div>
        <div class="average-bpm">Average BPM: {{ averageBPM }}</div>
    </div>
</template>
<style scoped>
    .moduleName{
        font-size: larger;
        text-decoration: underline;
    }
</style>