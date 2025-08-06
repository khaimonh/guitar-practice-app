<script setup>
import { ref } from 'vue'
const moduleName = ref('Recent Exercises:')
const recentExercises = ref([
    { id: 1, name: 'Chord Progressions', url: '/exercises/chord-progressions' },
    { id: 2, name: 'Scale Practice', url: '/exercises/scales' },
    { id: 3, name: 'Fingerpicking Patterns', url: '/exercises/fingerpicking' },
    { id: 4, name: 'Rhythm Training', url: '/exercises/rhythm' },
    { id: 5, name: 'Barre Chords', url: '/exercises/barre-chords' },
])
</script>
<template>
    <div class="content">
        <div class="moduleName">{{ moduleName }}</div>
        <div class="exercises-list">
            <a
                v-for="exercise in recentExercises"
                :key="exercise.id"
                :href="exercise.url"
                class="exercise-link"
            >
                {{ exercise.name }} 
                <br>
            </a>
        </div>
    </div>
</template>
<style scoped>
.moduleName {
    font-size: larger;
    text-decoration: underline;
}
</style>
