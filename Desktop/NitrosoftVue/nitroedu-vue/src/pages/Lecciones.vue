<template>
  <div class="min-h-screen font-sans px-2 py-10 bg-gradient-to-br from-black via-[#161d14] to-green-950 flex justify-center">
    <div v-if="leccion"
      class="bg-gradient-to-br from-[#171d17ee] to-[#1b381bdb] border border-green-700 rounded-3xl shadow-2xl px-6 sm:px-10 py-8 flex flex-col gap-7 w-full max-w-4xl relative animate__animated animate__fadeIn">
      
      <!-- HEADER PROGRESO Y TITULO -->
      <div class="flex flex-col sm:flex-row items-center mb-3 gap-3">
        <div class="flex-1 flex flex-col">
          <h1 class="text-3xl sm:text-4xl font-extrabold mb-0 text-green-400 text-left tracking-tight drop-shadow">{{ leccion.titulo }}</h1>
          <h2 v-if="leccion.descripcion" class="text-lg sm:text-xl text-green-200 mt-1 mb-2 font-medium text-left">{{ leccion.descripcion }}</h2>
        </div>
        <div class="flex flex-col items-end gap-2 sm:ml-8">
          <div class="w-40 bg-green-900 h-3 rounded-xl overflow-hidden shadow-inner border border-green-700 relative">
            <div class="h-full rounded-xl bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700"
                :style="{ width: progreso + '%' }"/>
          </div>
          <div class="text-xs text-green-300 font-bold tracking-widest mt-0">{{ progreso }}% completado</div>
        </div>
      </div>

      <!-- VIDEO YOUTUBE CARD (opcional) -->
      <div v-if="leccion.videoUrl" class="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow border border-green-700 mb-4">
        <iframe allowfullscreen="true"
          :src="youtubeEmbed(leccion.videoUrl)"
          class="aspect-video w-full h-64 bg-black"></iframe>
      </div>

      <!-- CONTENIDO PRINCIPAL -->
      <div class="prose prose-invert max-w-none text-gray-200 text-lg" v-html="leccion.contenido"></div>

      <!-- RECURSOS/ARCHIVOS/DESCARGAS -->
      <div v-if="leccion.recursos?.length" class="flex flex-wrap gap-4 items-center mb-2">
        <div v-for="rec in leccion.recursos" :key="rec.titulo" class="flex items-center gap-3 bg-[#162d16]/60 px-4 py-2 rounded-lg border border-green-900 shadow">
          <span v-if="rec.tipo === 'pdf'" class="bi bi-file-earmark-pdf-fill text-xl text-red-300"></span>
          <span v-if="rec.tipo === 'link'" class="bi bi-link-45deg text-lg text-green-300"></span>
          <a :href="rec.url" target="_blank" class="text-green-200 underline font-semibold hover:text-green-400">{{ rec.titulo }}</a>
        </div>
      </div>

      <!-- EJERCICIO INTERACTIVO COMPONENTE -->
      
       <ejercicio-cinematica />
    
      <!-- LISTA DE EJERCICIOS -->
      <ul v-if="leccion.ejercicios?.length" class="list-disc pl-7 mb-2 text-green-200 text-base space-y-2">
        <li v-for="(ej, idx) in leccion.ejercicios" :key="idx" class="hover:bg-[#134b2280] rounded transition px-2 py-1 cursor-pointer">{{ ej }}</li>
      </ul>

      <!-- FEEDBACK/COMMENTS Y MOTIVADOR -->
      <div class="flex flex-col sm:flex-row gap-4 mt-1 sm:items-center">
        <div class="flex gap-2 items-center">
          <button @click="like++" class="rounded-full px-3 py-2 bg-green-700/90 hover:bg-green-500 text-white font-bold text-lg shadow">
            <span class="bi bi-emoji-smile"></span> {{ like }}
          </button>
          <button @click="dislike++" class="rounded-full px-3 py-2 bg-red-600/80 hover:bg-red-500 text-white font-bold text-lg shadow">
            <span class="bi bi-emoji-frown"></span> {{ dislike }}
          </button>
          <span class="text-green-300 ml-3 text-[15px]">¿Te fue útil?</span>
        </div>
        <div class="flex-1 flex items-center ml-auto justify-end">
          <input v-model="comentario" placeholder="¿Tienes dudas? Deja tu comentario..." maxlength="140"
            class="w-full max-w-[250px] px-3 py-2 rounded-lg border border-green-600 bg-[#162516] text-green-100 text-sm focus:ring-2 focus:ring-green-500" />
          <button @click="enviarComentario" :disabled="!comentario.trim()" class="ml-2 px-4 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-green-700 to-green-400 hover:from-green-800 hover:to-green-500 disabled:opacity-40 shadow">Enviar</button>
        </div>
      </div>
      <div v-if="comentarios.length" class="mt-4 bg-[#131914]/70 rounded-xl p-3 border border-green-700 space-y-1 max-h-32 overflow-y-auto">
        <div v-for="c in comentarios" :key="c.id" class="text-green-200 text-sm font-semibold flex items-center"><span class="bi bi-chat-left-text mr-2 text-green-400"></span>{{ c.texto }}</div>
      </div>

      <!-- SUGERENCIAS LECCIONES SIGUIENTES -->
      <div v-if="leccion.siguientes?.length" class="mt-5 pt-2 border-t border-green-800">
        <div class="text-green-400 font-bold mb-2">¿Te gustaría continuar con...?</div>
        <div class="flex flex-wrap gap-3">
          <a v-for="sig in leccion.siguientes" :key="sig.id"
            :href="`/leccion/${sig.id}`"
            class="px-3 py-2 rounded-lg bg-gradient-to-r from-green-900 to-green-800 hover:from-green-800 hover:to-green-600 text-green-200 font-semibold shadow"
          >{{ sig.titulo }}</a>
        </div>
      </div>

      <!-- FINAL MOTIVADOR -->
      <div class="w-full mt-4 pt-4 text-center font-extrabold text-lg text-green-300 tracking-wide border-t border-green-900 rounded-b-xl animate__animated animate__pulse animate__infinite">
        ¡Sigue aprendiendo todos los días! 
      </div>
    </div>
    <div v-else class="text-green-400 text-center mt-20">Cargando lección o no encontrada...</div>
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
const progreso = ref(35+Math.floor(Math.random()*60)); // Simula progreso aleatorio
const like = ref(0);
const dislike = ref(0);
const comentario = ref('');
const comentarios = ref([]);

function youtubeEmbed(url) {
  if (!url) return "";
  return url.includes("embed") ? url : url.replace("watch?v=", "embed/");
}

function enviarComentario() {
  if (!comentario.value.trim()) return;
  comentarios.value.unshift({
    id: Date.now(),
    texto: comentario.value
  });
  comentario.value = "";
}

onMounted(async () => {
  const temaIdBuscado = Number(route.params.id);
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
      recursos: [],
      siguientes: [],
    };
  }
});
</script>

<style scoped>
/* Sobrecarga para dar vida y spacing educativo real */
.prose :where(h1, h2, h3) { color: #72fa84 !important; }
.prose :where(strong) { color: #42e672 !important; }
::-webkit-scrollbar-thumb { background: #17d68c77 !important; }
input:focus { outline: 2px solid #3dffb3; }
</style>
