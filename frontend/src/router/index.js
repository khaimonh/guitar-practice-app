import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard/Dashboard.vue'
import Library from '../components/ExerciseLibrary/Library.vue'

const routes = [
    //   {
    //     path: '/',
    //     name: 'Dashboard',
    //     component: Dashboard
    //   },
    {
        path: '/',
        redirect: '/dashboard', // Redirect root to /dashboard
    },
    {
        //unnecessary but helpful
        path: '/dashboard',
        name: 'DashboardAlias',
        component: Dashboard,
    },
    {
        //unnecessary but helpful
        path: '/library',
        name: 'Library',
        component: Library,
    },
    {
        path: '/exercise-library',
        name: 'ExerciseLibrary',
        component: Library,
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router
