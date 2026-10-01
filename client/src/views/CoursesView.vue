<script setup>
import { ref, onMounted } from 'vue'
import { useCoursesStore } from '../stores/courses'

const store = useCoursesStore()

const newCourse = ref({ courseId: '', courseName: '' })

onMounted(() => {
  store.fetchCourses()
})

async function handleAdd() {
  const { courseId, courseName } = newCourse.value
  if (!courseId || !courseName) {
    store.error = 'Course ID and name are required'
    return
  }
  const ok = await store.addCourse(newCourse.value)
  if (ok) {
    newCourse.value = { courseId: '', courseName: '' }
  }
}

function handleDelete(courseId) {
  store.deleteCourse(courseId)
}
</script>

<template>
  <div>
    <h1>Courses</h1>

    <section>
      <h2>Add Course</h2>
      <form @submit.prevent="handleAdd">
        <label>
          Course ID
          <input v-model="newCourse.courseId" type="text" />
        </label>
        <label>
          Course Name
          <input v-model="newCourse.courseName" type="text" />
        </label>
        <button type="submit" :disabled="store.loading">Add Course</button>
      </form>
    </section>

    <section>
      <h2>All Courses</h2>
      <p v-if="store.courses.length === 0 && !store.loading">No courses yet.</p>
      <ul>
        <li v-for="course in store.courses" :key="course.courseId">
          {{ course.courseId }} - {{ course.courseName }}
          <button @click="handleDelete(course.courseId)" :disabled="store.loading">Delete</button>
        </li>
      </ul>
    </section>

    <p v-if="store.loading">Loading...</p>
    <p v-if="store.error" style="color: red">{{ store.error }}</p>
    <p v-if="store.successMessage" style="color: green">{{ store.successMessage }}</p>
  </div>
</template>