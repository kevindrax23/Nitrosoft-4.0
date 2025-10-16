<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-black via-[#171d17] to-green-950 px-4 py-10 flex flex-col items-center">
    <div class="max-w-lg w-full mx-auto mb-8 bg-black/70 border border-green-700 rounded-2xl shadow-lg p-7 flex flex-col gap-5">
      <label for="busqueda" class="block mb-1 text-green-400 font-bold text-lg">Buscar materia o examen:</label>
      <input
        id="busqueda"
        type="text"
        v-model="busqueda"
        class="w-full py-3 px-4 rounded-lg bg-[#161e16] border border-green-600 text-green-300 font-semibold text-lg transition focus:ring-2 focus:ring-green-500 focus:outline-none"
        placeholder="Buscar por nombre o materia..."
      />
      <label for="materia-select" class="block mt-4 mb-1 text-green-400 font-bold text-lg">Selecciona la materia:</label>
      <select
        id="materia-select"
        v-model="materiaSeleccionada"
        class="w-full py-3 px-4 rounded-lg bg-[#161e16] border border-green-600 text-green-300 font-semibold text-lg transition focus:ring-2 focus:ring-green-500 focus:outline-none"
      >
        <option v-for="mat in materiasFiltradas" :key="mat" :value="mat">{{ materiasNombres[mat] || mat }}</option>
      </select>
      <button
        @click="recargarResultados"
        class="mt-4 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-white shadow transition whitespace-nowrap"
      >
        Recargar Resultados
      </button>
    </div>

    <div class="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center items-center">
      <template v-if="cargando">
        <div class="col-span-full text-center text-green-400 font-semibold text-lg py-20 animate-pulse">
          Cargando resultados...
        </div>
      </template>

      <template v-else>
        <div
          v-for="card in examenesFiltrados"
          :key="card.id"
          class="bg-gradient-to-br from-[#171d17f3] to-[#244d24e6] border border-green-700 rounded-2xl shadow-xl flex flex-col justify-between p-8 min-h-[260px]
                 hover:scale-105 hover:border-green-400 transition-transform duration-200 mx-auto w-full max-w-sm animate__animated animate__fadeIn"
        >
          <h2 class="text-2xl font-extrabold mb-4 text-green-300 text-center break-words">{{ card.nombre }}</h2>
          <div v-if="resultadosExamenes[card.id]" class="mb-4 text-green-200 text-center space-y-1">
            <div class="font-bold text-lg">
              Último puntaje: {{ resultadosExamenes[card.id].puntaje }}
            </div>
            <div class="text-green-400 text-xs">
              Fecha: {{ resultadosExamenes[card.id].fechaString }}
            </div>
            <div class="relative w-full h-4 bg-green-900 rounded-full overflow-hidden mt-3 shadow-inner" role="progressbar" :aria-valuenow="resultadosExamenes[card.id].puntaje" aria-valuemin="0" aria-valuemax="100">
              <div
                class="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
                :style="{ width: resultadosExamenes[card.id].puntaje + '%' }"
              ></div>
            </div>
            <div :class="estadoClass(card.id)" class="mt-1 font-semibold text-sm">
              {{ estadoText(card.id) }}
            </div>
          </div>
          <div v-else class="mb-4 text-green-500 text-center italic font-semibold">
            Sin intento registrado
          </div>
          <div class="flex justify-between items-center mt-auto gap-4">
            <button
              class="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-400 text-white font-bold shadow
                     hover:from-green-700 hover:to-green-500 transition focus:outline-none focus:ring-2 focus:ring-green-500"
              @click="accederExamen(card.id)"
            >
              Acceder Examen
            </button>
            <button 
              @click="toggleFavorito(card.id)" 
              :class="['px-4 py-2 rounded-lg font-bold transition shadow', favoritos.has(card.id) ? 'bg-yellow-400 text-black' : 'bg-green-700 hover:bg-green-800 text-white']"
            >
              {{ favoritos.has(card.id) ? '★ Favorito' : '☆ Favorito' }}
            </button>
          </div>
        </div>
        <div v-if="!examenesFiltrados.length" class="col-span-full text-red-500 text-center font-bold text-lg py-20">
          No se encontraron exámenes para la búsqueda y materia seleccionadas.
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { db } from "../firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

const usuarioId = "usuario_demo_1";

const materiaSeleccionada = ref("matematicas");
const busqueda = ref("");
const cargando = ref(false);

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

const materiasNombres = {
  matematicas: "Matemáticas",
  geometria: "Geometría",
  algebra: "Álgebra",
  trigonometria: "Trigonometría"
};

const examenesFiltrados = computed(() =>
  examenes.filter(card => {
    return (
      card.materia === materiaSeleccionada.value &&
      (card.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
        materiasNombres[card.materia].toLowerCase().includes(busqueda.value.toLowerCase()))
    );
  })
);

const resultadosExamenes = ref({});
const favoritos = ref(new Set());

const cargarResultadosMateria = async () => {
  cargando.value = true;
  resultadosExamenes.value = {};
  for (const card of examenesFiltrados.value) {
    const q = query(
      collection(db, "resultados_examen"),
      where("usuarioId", "==", usuarioId),
      where("materia", "==", card.materia),
      where("examenId", "==", card.id),
      orderBy("fecha", "desc"),
      limit(1)
    );
    const docs = await getDocs(q);
    if (!docs.empty) {
      const dato = docs.docs[0].data();
      resultadosExamenes.value[card.id] = {
        puntaje: dato.puntaje,
        fechaString: dato.fecha?.toDate().toLocaleDateString() || ""
      };
    }
  }
  cargando.value = false;
};

const accedeEstadoMap = {
  completado: "Completado",
  en_progreso: "En progreso",
  no_iniciado: "No iniciado",
};

const estadoText = (id) => {
  if (!resultadosExamenes.value[id]) return accedeEstadoMap.no_iniciado;
  if (resultadosExamenes.value[id].puntaje >= 75) return accedeEstadoMap.completado;
  return accedeEstadoMap.en_progreso;
};

const estadoClass = (id) => {
  if (!resultadosExamenes.value[id]) return "text-red-500 font-semibold";
  if (resultadosExamenes.value[id].puntaje >= 75) return "text-green-400 font-semibold";
  return "text-yellow-300 font-semibold";
};

const accederExamen = (cardId) => {
  router.push(`/examen/${cardId}`);
};

const toggleFavorito = (id) => {
  const newFavoritos = new Set(favoritos.value);
  if (newFavoritos.has(id)) newFavoritos.delete(id);
  else newFavoritos.add(id);
  favoritos.value = newFavoritos;
  localStorage.setItem("favoritosExamenes", JSON.stringify(Array.from(newFavoritos)));
};

const cargarFavoritos = () => {
  const fav = localStorage.getItem("favoritosExamenes");
  favoritos.value = fav ? new Set(JSON.parse(fav)) : new Set();
};

const recargarResultados = () => {
  cargarResultadosMateria();
};

onMounted(() => {
  cargarFavoritos();
  cargarResultadosMateria();
});

const router = useRouter();
watch(materiaSeleccionada, cargarResultadosMateria);
watch(busqueda, cargarResultadosMateria);
</script>

<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css";
</style>
