<script setup>
import { ref } from 'vue'
import { useStudentsStore } from '../stores/students'

const store = useStudentsStore()

const searchName = ref('')
const newStudent = ref({ name: '', id: '', phone: '', zip: '' })

function handleSearch() {
  if (!searchName.value.trim()) return
  store.searchStudent(searchName.value.trim())
}

async function handleAdd() {
  const { name, id, phone, zip } = newStudent.value
  if (!name || !id || !phone || !zip) {
    store.error = 'All fields are required'
    return
  }
  const ok = await store.addStudent(newStudent.value)
  if (ok) {
    newStudent.value = { name: '', id: '', phone: '', zip: '' }
  }
}

function handleDelete(name) {
  store.deleteStudent(name)
}
</script>

<template>
  <div>
    <h1>Students</h1>

    <section>
      <h2>Add Student</h2>
      <form @submit.prevent="handleAdd">
        <label>
          Name
          <input v-model="newStudent.name" type="text" />
        </label>
        <label>
          Student ID
          <input v-model="newStudent.id" type="text" />
        </label>
        <label>
          Phone
          <input v-model="newStudent.phone" type="text" />
        </label>
        <label>
          ZIP Code
          <input v-model="newStudent.zip" type="text" />
        </label>
        <button type="submit" :disabled="store.loading">Add Student</button>
      </form>
    </section>

    <section>
      <h2>Search Student</h2>
      <form @submit.prevent="handleSearch">
        <label>
          Name
          <input v-model="searchName" type="text" />
        </label>
        <button type="submit" :disabled="store.loading">Search</button>
      </form>

      <div v-if="store.foundStudent">
        <p><strong>Name:</strong> {{ store.foundStudent.name }}</p>
        <p><strong>Student ID:</strong> {{ store.foundStudent.studentId }}</p>
        <p><strong>Phone:</strong> {{ store.foundStudent.phone }}</p>
        <p><strong>ZIP:</strong> {{ store.foundStudent.zip }}</p>
        <button @click="handleDelete(store.foundStudent.name)" :disabled="store.loading">
          Delete Student
        </button>
      </div>
    </section>

    <p v-if="store.loading">Loading...</p>
    <p v-if="store.error" style="color: red">{{ store.error }}</p>
    <p v-if="store.successMessage" style="color: green">{{ store.successMessage }}</p>
  </div>
</template>