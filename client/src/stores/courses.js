import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE = 'http://localhost:3000'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref([])
  const loading = ref(false)
  const error = ref('')
  const successMessage = ref('')

  async function fetchCourses() {
    loading.value = true
    error.value = ''
    try {
      const response = await fetch(`${API_BASE}/courses`)
      const data = await response.json()
      if (!response.ok) {
        error.value = data.error || 'Could not load courses'
        return
      }
      courses.value = data
    } catch (err) {
      error.value = 'Could not reach the server'
    } finally {
      loading.value = false
    }
  }

  async function addCourse(course) {
    loading.value = true
    error.value = ''
    successMessage.value = ''
    try {
      const response = await fetch(`${API_BASE}/add-course`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      })
      const data = await response.json()
      if (!response.ok) {
        error.value = data.error || 'Could not add course'
        return false
      }
      successMessage.value = data.message
      await fetchCourses()
      return true
    } catch (err) {
      error.value = 'Could not reach the server'
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteCourse(courseId) {
    loading.value = true
    error.value = ''
    successMessage.value = ''
    try {
      const response = await fetch(`${API_BASE}/delete-course`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })
      const data = await response.json()
      if (!response.ok) {
        error.value = data.error || 'Could not delete course'
        return false
      }
      successMessage.value = data.message
      await fetchCourses()
      return true
    } catch (err) {
      error.value = 'Could not reach the server'
      return false
    } finally {
      loading.value = false
    }
  }

  return { courses, loading, error, successMessage, fetchCourses, addCourse, deleteCourse }
})