<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-[#181C25] via-blue-900 to-[#007fff] px-3 py-10">
    <div class="max-w-xl mx-auto mb-8">
      <label for="materia-select" class="block mb-2 text-white font-bold">Selecciona la materia:</label>
      <select
        v-model="materiaSeleccionada"
        id="materia-select"
        class="w-full py-2 px-4 rounded bg-[#202634] border border-[#333] text-white font-bold"
      >
        <option value="matematicas">Matemáticas</option>
        <option value="geometria">Geometría</option>
        <option value="algebra">Álgebra</option>
        <option value="trigonometria">Trigonometría</option>
      </select>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="card in examenesFiltrados"
        :key="card.id"
        class="bg-[#20283a] rounded-xl shadow-md flex flex-col justify-between p-6 min-h-[200px] transition-transform hover:scale-105"
      >
        <h2 class="text-xl font-semibold mb-3 text-white">{{ card.nombre }}</h2>
        <button
          class="mt-auto py-2 px-5 rounded bg-gradient-to-r from-[#007fff] to-[#005fcc] text-white font-bold"
          @click="accederExamen(card.id)"
        >
          Acceder Examen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

// Opciones de materia para el select
const materiaSeleccionada = ref("matematicas");

// Exámenes disponibles según materia y nivel
const examenes = [
  { id: "mat1", nombre: "Matemáticas 1", materia: "matematicas" },
  { id: "mat2", nombre: "Matemáticas 2 (Avanzado)", materia: "matematicas" },
  { id: "geo1", nombre: "Geometría 1", materia: "geometria" },
  { id: "geo2", nombre: "Geometría 2", materia: "geometria" },
  { id: "alg1", nombre: "Álgebra 1", materia: "algebra" },
  { id: "alg2", nombre: "Álgebra 2", materia: "algebra" },
  { id: "tri1", nombre: "Trigonometría 1", materia: "trigonometria" },
  { id: "tri2", nombre: "Trigonometría 2", materia: "trigonometria" }
];

// Cards filtradas según materia seleccionada
const examenesFiltrados = computed(() =>
  examenes.filter((card) => card.materia === materiaSeleccionada.value)
);

const router = useRouter();
const accederExamen = (cardId) => {
  router.push(`/examen/${cardId}`);
};
</script>
