<template>
  <div class="min-h-screen font-sans px-2 py-6 bg-gradient-to-br from-black via-[#161d14] to-green-950 flex justify-center">
    <div
      v-if="leccion"
      class="bg-gradient-to-br from-[#171d17ee] to-[#1b381bdb] border border-green-700 rounded-2xl shadow-xl px-10 py-8 flex flex-col gap-4
             backdrop-blur-md w-full max-w-5xl"
    >
      <h1 class="text-4xl font-extrabold mb-4 text-green-400 text-center">{{ leccion.titulo }}</h1>
      <h2 v-if="leccion.descripcion" class="text-xl text-green-200 mb-4 text-center">{{ leccion.descripcion }}</h2>
      <div class="prose prose-invert max-w-none text-gray-200 text-lg" v-html="leccion.contenido"></div>
     <ejercicio-cinematica />
      <ul v-if="leccion.ejercicios?.length" class="list-disc pl-6 mb-2 text-green-200 text-[16px]">
        <li v-for="(ej, idx) in leccion.ejercicios" :key="idx">{{ ej }}</li>
      </ul>
    </div>

    <div v-else class="text-green-400 text-center mt-20">
      Cargando lección o no encontrada...
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import EjercicioCinematica from "../components/EjercicioCinematica.vue";

const route = useRoute();
const leccion = ref(null);

onMounted(async () => {
  const temaIdBuscado = Number(route.params.id); // Asegura que es número
  const q = query(
    collection(db, "lecciones"),
    where("temaId", "==", temaIdBuscado)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    leccion.value = querySnapshot.docs[0].data();
  } else {
    leccion.value = {
      titulo: "Lección no encontrada",
      descripcion: "",
      contenido: "",
      videoUrl: "",
      ejercicios: [],
    };
  }
});
</script>