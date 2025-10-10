<template>
  <div class="min-h-screen font-mono px-3 py-6 bg-gradient-to-br from-[#181C25] via-blue-900 to-[#007fff]">
    <h2 class="text-3xl font-bold mb-10 text-center tracking-wide">Asignaturas</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div
        v-for="tema in temas"
        :key="tema.id"
        class="bg-[#202634cc] rounded-2xl shadow-xl p-7 flex flex-col gap-3 border border-blue-700 backdrop-blur-md hover:scale-105 transition-transform duration-200"
      >
        <h3 class="text-2xl font-bold mb-2 text-blue-400">{{ tema.titulo }}</h3>
        <p class="mb-3 text-gray-200 flex-1">{{ tema.descripcion }}</p>
        <div class="relative w-full overflow-hidden pt-[56.25%] rounded-lg mb-3 ring-2 ring-[#007fff]/30">
          <iframe
            :src="tema.videoUrl"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="absolute top-0 left-0 w-full h-full"
            :title="'Video de ' + tema.titulo"
          ></iframe>
        </div>
        <ul class="list-disc pl-4 mb-3 text-blue-200">
          <li v-for="ej in tema.ejercicios" :key="ej">{{ ej }}</li>
        </ul>
        <button
          class="self-end px-5 py-2 rounded-lg bg-gradient-to-r from-[#007fff] to-[#005fcc] text-white font-bold shadow hover:from-[#005fcc] hover:to-[#007fff] transition"
          @click="accederTema(tema.titulo)"
        >
          Acceder
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const temas = ref([
  {
    id: 1,
    titulo: "Cinemática",
    descripcion: "Estudio del movimiento de los cuerpos sin atender las causas que lo producen.",
    ejercicios: ["¿Qué es la velocidad?", "Ejemplo de MRU", "Calcula aceleración."],
    videoUrl: "https://www.youtube.com/embed/F4U7Ab_lKjY" // Física, Cinemática básica
  },
  {
    id: 2,
    titulo: "Dinámica",
    descripcion: "Analiza las fuerzas y su influencia en el movimiento.",
    ejercicios: ["Enuncia la Segunda Ley de Newton.", "Fuerza neta sobre un bloque de 2kg."],
    videoUrl: "https://www.youtube.com/embed/Jk31Nwjb6ms" // Dinámica y Leyes de Newton
  },
  {
    id: 3,
    titulo: "Termodinámica",
    descripcion: "Estudia el calor y la temperatura, y sus efectos sobre la materia.",
    ejercicios: ["¿Qué es la energía interna?", "Ejemplo del primer principio de la termodinámica."],
    videoUrl: "https://www.youtube.com/embed/U3vYsZudOqo" // Principios de Termodinámica
  }
]);

function accederTema(titulo) {
  alert(`Acceder a tema: ${titulo}`);
}
</script>
