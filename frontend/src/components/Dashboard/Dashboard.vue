<script setup>
import { ref } from 'vue'
import BasicStats from './BasicStats.vue'
import Evaluation from './Evaluation.vue'
import RecentExercises from './RecentExercises.vue'
import Goals from './Goals.vue'
import Metronome from './Metronome.vue'
import PracticeControl from './PracticeControl.vue'
defineProps({
    //   msg: String,
})
const title = ref('GUITAR PRACTICE APP')
const currentBpm = ref(65)
const handleBpmChange = (newBpm) => {
    currentBpm.value = newBpm
    console.log(currentBpm.value)
}
const getSeconds = (seconds) => {
    console.log(seconds.value)
}
</script>

<template>
    <header>
        <div class="home">
            <router-link to="/dashboard">{{ title }}</router-link>
        </div>
        <!--change link-->
        <nav class="">
            <router-link to="/library" class="nav-button"
                >Exercise Library</router-link
            >
        </nav>
    </header>
    <div class="dashboard-layout">
        <div class="basic-stats"><BasicStats /></div>
        <div class="evaluation"><Evaluation /></div>
        <div class="recent-exercises"><RecentExercises /></div>
        <div class="goals"><Goals /></div>
        <div class="metronome">
            <Metronome ref="metronomeRef" @bpm-changed="handleBpmChange" />
            <!-- metronomeRef is an object with all the values passed from Metronome.vue, the event is bpm-changed will call handleBpmChange -->
        </div>
        <div class="practice-control">
            <PracticeControl
                ref="practiceControlRef"
                @end-practice="getSeconds"
            />
        </div>
    </div>
</template>
<style scoped>
@import url('../../assets/styles/Dashboard.css');
</style>
