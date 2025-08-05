<script setup>
import { ref } from 'vue'
import BasicStats from './BasicStats.vue'
defineProps({
    //   msg: String,
})
const title = ref('GUITAR PRACTICE APP')
</script>

<template>
    <header>
        <div class="home"><a href="http://localhost:5173">{{ title }}</a></div>  <!--change link-->
        <nav class=""></nav>
    </header>
    <div class="dashboard-layout">
        <div class="basic-stats"><BasicStats/></div>
        <div class="evaluation"></div>
        <div class="recent-exercises"></div>
        <div class="goals"></div>
    </div>
</template>
<style scoped>
    @import url('../../assets/styles/Dashboard.css'
    );
</style>