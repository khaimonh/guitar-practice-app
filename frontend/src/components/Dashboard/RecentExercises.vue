<script setup>
    import { ref } from 'vue';
    const recent = ref(1500)
    const moduleName = ref('Recent Exercises:')
</script>
<template>
    <div class="content">
        <div class="moduleName">{{ moduleName }}</div>
        <div class="recent">{{ recent }}</div>
    </div>
</template>
<style scoped>
    .moduleName{
        font-size: larger;
        text-decoration: underline;
    }
</style>