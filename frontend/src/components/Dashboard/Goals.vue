<script setup>
import { ref } from 'vue'
const moduleName = ref('Goals: ')
</script>
<template>
    <div class="content">
        <div class="moduleName">{{ moduleName }}</div>
    </div>
</template>
<style scoped>
.moduleName {
    font-size: larger;
    text-decoration: underline;
}
</style>
