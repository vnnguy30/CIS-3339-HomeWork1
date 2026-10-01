import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE = 'http://localhost:3000'

export const useEnrollmentsStore = defineStore('enrollments', () => {
  const roster = ref([])
  const loading = ref(false)
  const error = ref('')
  const successMessage = ref('')

  async function enroll(studentId, courseId) {
    loading.value = true
    error.value = ''
    successMessage.value = ''
    try {
      const response = await fetch(`${API_BASE}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, courseId })
      })
      const data = await response.json()
      if (!response.ok) {
        error.value = data.error || 'Could not enroll student'
        return false
      }
      successMessage.value = data.message
      return true
    } catch (err) {
      error.value = 'Could not reach the server'
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchRoster(courseId) {
    loading.value = true
    error.value = ''
    roster.value = []
    try {
      const response = await fetch(`${API_BASE}/course-roster/${courseId}`)
      const data = await response.json()
      if (!response.ok) {
        error.value = data.error || 'Could not load roster'
        return
      }
      roster.value = data
    } catch (err) {
      error.value = 'Could not reach the server'
    } finally {
      loading.value = false
    }
  }

  return { roster, loading, error, successMessage, enroll, fetchRoster }
})