<template>
  <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="materia in materias"
      :key="materia.id"
      class="bg-[#20283a] rounded-xl shadow-md flex flex-col justify-between p-6 min-h-[200px] transition-transform hover:scale-105"
    >
      <h2 class="text-xl font-semibold mb-3 text-white">{{ materia.nombre }}</h2>
      <button
        class="mt-auto py-2 px-5 rounded bg-gradient-to-r from-[#007fff] to-[#005fcc] text-white font-bold"
        @click="accederExamen(materia.id)"
      >
        Acceder Examen
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Demo: materias estático. En producción, puedes traer de Firestore.
const materias = ref([
  { id: 'mat1', nombre: 'Matemáticas' },
  { id: 'mat2', nombre: 'Historia' },
  { id: 'mat3', nombre: 'Ciencias' },
])

const router = useRouter()
const accederExamen = (materiaId) => {
  router.push(`/examen/${materiaId}`)
}
</script>
