<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const moduleName = ref('Exercise Library')

// Sample exercise data
const exercises = ref([
  { id: 1, name: 'Chromatic Scale', difficulty: 'Beginner', category: 'Technique' },
  { id: 2, name: 'Pentatonic Patterns', difficulty: 'Intermediate', category: 'Scales' },
  { id: 3, name: 'Alternate Picking', difficulty: 'Intermediate', category: 'Technique' },
  { id: 4, name: 'Barre Chords', difficulty: 'Advanced', category: 'Chords' },
  { id: 5, name: 'Sweep Picking', difficulty: 'Advanced', category: 'Technique' }
])

const searchTerm = ref('')
const selectedCategory = ref('All')
const categories = ref(['All', 'Technique', 'Scales', 'Chords', 'Songs'])

const goBackToDashboard = () => {
  router.push('/')
}

const filteredExercises = ref(exercises.value)

const filterExercises = () => {
  filteredExercises.value = exercises.value.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'All' || exercise.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
}
</script>

<template>
    <div class="library-container">
        <!-- Header with navigation -->
        <header class="library-header">
            <div class="header-content">
                <button @click="goBackToDashboard" class="back-button">
                    ← Back to Dashboard
                </button>
                <h1 class="module-name">{{ moduleName }}</h1>
            </div>
        </header>

        <!-- Search and Filter Section -->
        <div class="controls-section">
            <div class="search-container">
                <input 
                    v-model="searchTerm" 
                    @input="filterExercises"
                    type="text" 
                    placeholder="Search exercises..." 
                    class="search-input"
                />
            </div>
            
            <div class="filter-container">
                <label for="category-select">Category:</label>
                <select 
                    id="category-select"
                    v-model="selectedCategory" 
                    @change="filterExercises"
                    class="category-select"
                >
                    <option v-for="category in categories" :key="category" :value="category">
                        {{ category }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Exercise Grid -->
        <div class="exercises-grid">
            <div 
                v-for="exercise in filteredExercises" 
                :key="exercise.id" 
                class="exercise-card"
            >
                <h3 class="exercise-name">{{ exercise.name }}</h3>
                <div class="exercise-details">
                    <span class="difficulty" :class="exercise.difficulty.toLowerCase()">
                        {{ exercise.difficulty }}
                    </span>
                    <span class="category-tag">{{ exercise.category }}</span>
                </div>
                <button class="start-exercise-btn">Start Exercise</button>
            </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredExercises.length === 0" class="empty-state">
            <p>No exercises found matching your criteria.</p>
        </div>
    </div>
</template>

<style scoped>
.library-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
}

.library-header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 30px;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 20px;
}

.back-button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s ease;
}

.back-button:hover {
    background: rgba(255, 255, 255, 0.3);
}

.module-name {
    color: white;
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.controls-section {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.search-container {
    flex: 1;
    min-width: 250px;
}

.search-input {
    width: 100%;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    background: rgba(255, 255, 255, 0.9);
}

.filter-container {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    font-weight: 500;
}

.category-select {
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    background: rgba(255, 255, 255, 0.9);
    cursor: pointer;
}

.exercises-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.exercise-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.exercise-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.exercise-name {
    color: #333;
    font-size: 1.4rem;
    margin: 0 0 15px 0;
    font-weight: 600;
}

.exercise-details {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.difficulty {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.difficulty.beginner {
    background: #d4edda;
    color: #155724;
}

.difficulty.intermediate {
    background: #fff3cd;
    color: #856404;
}

.difficulty.advanced {
    background: #f8d7da;
    color: #721c24;
}

.category-tag {
    background: #e9ecef;
    color: #495057;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
}

.start-exercise-btn {
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.start-exercise-btn:hover {
    opacity: 0.9;
}

.empty-state {
    text-align: center;
    color: white;
    font-size: 1.2rem;
    margin-top: 50px;
}

@media (max-width: 768px) {
    .controls-section {
        flex-direction: column;
    }
    
    .exercises-grid {
        grid-template-columns: 1fr;
    }
    
    .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }
    
    .module-name {
        font-size: 2rem;
    }
}
</style>
<!-- </qodoArtifact> -->

This enhanced Exercise Library component now includes:

## Key Features Added:

1. **Clear Navigation**: 
   - Back button to return to Dashboard
   - Different color scheme (purple gradient vs your dashboard)

2. **Interactive Elements**:
   - Search functionality to filter exercises
   - Category dropdown filter
   - Exercise cards with hover effects

3. **Visual Distinction**:
   - Completely different styling and layout
   - Purple gradient background
   - Card-based layout vs dashboard grid

4. **Sample Data**:
   - Mock exercise data to populate the page
   - Different difficulty levels and categories

5. **Responsive Design**:
   - Mobile-friendly layout
   - Flexible grid system

Now when you navigate between pages, you'll clearly see:
- **Dashboard**: Your existing grid layout with stats, metronome, etc.
- **Exercise Library**: This new purple-themed page with search and exercise cards

The navigation will feel smooth and you'll immediately know you're on a different page!