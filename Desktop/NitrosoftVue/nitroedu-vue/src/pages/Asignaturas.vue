<template>
  <div class="min-h-screen font-mono px-2 py-6 bg-gradient-to-br from-black via-[#161d14] to-green-950">
    <h2 class="text-3xl font-bold mb-10 text-center tracking-wide text-green-400 drop-shadow">Asignaturas</h2>
    <div class="w-full max-w-7xl mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 md:gap-10">
        <div
          v-for="tema in temas"
          :key="tema.id"
          class="bg-gradient-to-br from-[#171d17ee] to-[#1b381bdb] border border-green-700 rounded-2xl shadow-xl px-10 py-8 flex flex-col gap-4 
                backdrop-blur-md hover:scale-105 hover:shadow-green-600 transition-transform duration-200 
                w-full max-w-md mx-auto"
        >
          <h3 class="text-3xl font-extrabold mb-2 text-green-400 text-center">{{ tema.titulo }}</h3>
          <p class="mb-2 text-gray-200 flex-1 text-center">{{ tema.descripcion }}</p>
          <div class="relative w-full overflow-hidden pt-[56.25%] rounded-lg mb-2 ring-2 ring-green-800/30 shadow-lg">
            <iframe
              :src="tema.videoUrl"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="absolute top-0 left-0 w-full h-full rounded-lg"
              :title="'Video de ' + tema.titulo"
            ></iframe>
          </div>
          <ul class="list-disc pl-6 mb-2 text-green-200 text-[16px] text-left">
            <li v-for="ej in tema.ejercicios" :key="ej">{{ ej }}</li>
          </ul>
          <button
            class="self-center px-7 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-400 text-white font-bold shadow
                    hover:from-green-700 hover:to-green-500 transition focus:outline-none focus:ring-2 focus:ring-green-500"
            @click="accederTema(tema.titulo)"
          >
            Acceder
          </button>
        </div>
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
    videoUrl: "https://www.youtube.com/embed/F4U7Ab_lKjY"
  },
  {
    id: 2,
    titulo: "Dinámica",
    descripcion: "Analiza las fuerzas y su influencia en el movimiento.",
    ejercicios: ["Enuncia la Segunda Ley de Newton.", "Fuerza neta sobre un bloque de 2kg."],
    videoUrl: "https://www.youtube.com/embed/Jk31Nwjb6ms"
  },
  {
    id: 3,
    titulo: "Termodinámica",
    descripcion: "Estudia el calor y la temperatura, y sus efectos sobre la materia.",
    ejercicios: ["¿Qué es la energía interna?", "Ejemplo del primer principio de la termodinámica."],
    videoUrl: "https://www.youtube.com/embed/U3vYsZudOqo"
  }
]);

function accederTema(titulo) {
  alert(`Acceder a tema: ${titulo}`);
}
</script>
