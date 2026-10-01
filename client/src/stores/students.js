import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE = 'http://localhost:3000'

export const useStudentsStore = defineStore('students', () => {
  const foundStudent = ref(null)
  const allStudents = ref([])
  const loading = ref(false)
  const error = ref('')
  const successMessage = ref('')

  async function fetchAllStudents() {
    loading.value = true
    error.value = ''
    try {
      const response = await fetch(`${API_BASE}/students`)
      const data = await response.json()
      if (!response.ok) {
        error.value = data.error || 'Could not load students'
        return
      }
      allStudents.value = data
    } catch (err) {
      error.value = 'Could not reach the server'
    } finally {
      loading.value = false
    }
  }

  async function searchStudent(name) {
    loading.value = true
    error.value = ''
    successMessage.value = ''
    foundStudent.value = null
    try {
      const response = await fetch(`${API_BASE}/find-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      const data = await response.json()
      if (!response.ok) {
        error.value = data.error || 'Student not found'
        return
      }
      foundStudent.value = data
    } catch (err) {
      error.value = 'Could not reach the server'
    } finally {
      loading.value = false
    }
  }

  async function addStudent(student) {
    loading.value = true
    error.value = ''
    successMessage.value = ''
    try {
      const response = await fetch(`${API_BASE}/add-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      })
      const data = await response.json()
      if (!response.ok) {
        error.value = data.error || 'Could not add student'
        return false
      }
      successMessage.value = data.message
      await fetchAllStudents()
      return true
    } catch (err) {
      error.value = 'Could not reach the server'
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteStudent(name) {
    loading.value = true
    error.value = ''
    successMessage.value = ''
    try {
      const response = await fetch(`${API_BASE}/delete-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      const data = await response.json()
      if (!response.ok) {
        error.value = data.error || 'Could not delete student'
        return false
      }
      successMessage.value = data.message
      if (foundStudent.value && foundStudent.value.name === name) {
        foundStudent.value = null
      }
      await fetchAllStudents()
      return true
    } catch (err) {
      error.value = 'Could not reach the server'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    foundStudent,
    allStudents,
    loading,
    error,
    successMessage,
    fetchAllStudents,
    searchStudent,
    addStudent,
    deleteStudent
  }
})