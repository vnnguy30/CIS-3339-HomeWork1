<script setup>
import { ref, onMounted } from 'vue'
import { useStudentsStore } from '../stores/students'
import { useCoursesStore } from '../stores/courses'
import { useEnrollmentsStore } from '../stores/enrollments'

const studentsStore = useStudentsStore()
const coursesStore = useCoursesStore()
const enrollmentsStore = useEnrollmentsStore()

const selectedStudentId = ref('')
const selectedCourseId = ref('')
const rosterCourseId = ref('')

onMounted(() => {
  studentsStore.fetchAllStudents()
  coursesStore.fetchCourses()
})

async function handleEnroll() {
  if (!selectedStudentId.value || !selectedCourseId.value) {
    enrollmentsStore.error = 'Select a student and a course'
    return
  }
  await enrollmentsStore.enroll(selectedStudentId.value, selectedCourseId.value)
}

function handleViewRoster() {
  if (!rosterCourseId.value) return
  enrollmentsStore.fetchRoster(rosterCourseId.value)
}
</script>

<template>
  <div>
    <h1>Enrollments</h1>

    <section>
      <h2>Enroll a Student</h2>
      <form @submit.prevent="handleEnroll">
        <label>
          Student
          <select v-model="selectedStudentId">
            <option value="" disabled>Select a student</option>
            <option
              v-for="student in studentsStore.allStudents"
              :key="student.studentId"
              :value="student.studentId"
            >
              {{ student.name }} ({{ student.studentId }})
            </option>
          </select>
        </label>
        <label>
          Course
          <select v-model="selectedCourseId">
            <option value="" disabled>Select a course</option>
            <option
              v-for="course in coursesStore.courses"
              :key="course.courseId"
              :value="course.courseId"
            >
              {{ course.courseName }} ({{ course.courseId }})
            </option>
          </select>
        </label>
        <button type="submit" :disabled="enrollmentsStore.loading">Enroll</button>
      </form>
    </section>

    <section>
      <h2>View Course Roster</h2>
      <label>
        Course
        <select v-model="rosterCourseId">
          <option value="" disabled>Select a course</option>
          <option
            v-for="course in coursesStore.courses"
            :key="course.courseId"
            :value="course.courseId"
          >
            {{ course.courseName }} ({{ course.courseId }})
          </option>
        </select>
      </label>
      <button @click="handleViewRoster" :disabled="enrollmentsStore.loading">View Roster</button>

      <p v-if="rosterCourseId && enrollmentsStore.roster.length === 0 && !enrollmentsStore.loading">
        No students enrolled in this course.
      </p>
      <ul>
        <li v-for="student in enrollmentsStore.roster" :key="student.studentId">
          {{ student.name }} ({{ student.studentId }})
        </li>
      </ul>
    </section>

    <p v-if="enrollmentsStore.loading">Loading...</p>
    <p v-if="enrollmentsStore.error" style="color: red">{{ enrollmentsStore.error }}</p>
    <p v-if="enrollmentsStore.successMessage" style="color: green">{{ enrollmentsStore.successMessage }}</p>
  </div>
</template>