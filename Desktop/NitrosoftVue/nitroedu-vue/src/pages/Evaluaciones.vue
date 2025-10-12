<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-black via-[#171d17] to-green-950 px-4 py-10 flex flex-col items-center">
    <div class="max-w-lg w-full mx-auto mb-8 bg-black/70 border border-green-700 rounded-2xl shadow-lg px-7 py-6 flex flex-col gap-4">
      <label for="materia-select" class="block mb-1 text-green-400 font-bold text-lg">Selecciona la materia:</label>
      <select
        v-model="materiaSeleccionada"
        id="materia-select"
        class="w-full py-3 px-4 rounded-lg bg-[#161e16] border border-green-600 text-green-300 font-semibold text-lg transition focus:ring-2 focus:ring-green-500 focus:outline-none"
      >
        <option value="matematicas">Matemáticas</option>
        <option value="geometria">Geometría</option>
        <option value="algebra">Álgebra</option>
        <option value="trigonometria">Trigonometría</option>
      </select>
    </div>
    <div class="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center items-center">
      <div
        v-for="card in examenesFiltrados"
        :key="card.id"
        class="bg-gradient-to-br from-[#171d17f3] to-[#244d24e6] border border-green-700 rounded-2xl shadow-xl flex flex-col justify-between p-8 min-h-[220px]
              hover:scale-105 hover:border-green-400 transition-transform duration-200 mx-auto w-full max-w-sm"
      >
        <h2 class="text-2xl font-extrabold mb-4 text-green-300 text-center break-words">{{ card.nombre }}</h2>
        <button
          class="mt-auto py-3 px-6 rounded-lg bg-gradient-to-r from-green-600 to-green-400 text-white font-bold shadow
                hover:from-green-700 hover:to-green-500 transition focus:outline-none focus:ring-2 focus:ring-green-500"
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
