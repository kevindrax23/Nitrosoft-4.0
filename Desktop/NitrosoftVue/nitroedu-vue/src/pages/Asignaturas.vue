<template>
  <div class="min-h-screen font-sans px-2 py-6 bg-gradient-to-br from-black via-[#161d14] to-green-950">
    <div class="w-full max-w-7xl mx-auto">
      <div class="mb-8 flex flex-col md:flex-row gap-6 items-center">
        <input
          v-model="busqueda"
          placeholder="Buscar tema, concepto o ejemplo..."
          class="flex-1 py-3 px-6 rounded-lg bg-[#101910] border border-green-600 text-green-200 font-semibold text-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition"
        />
        <button class="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-bold shadow hover:from-green-700 hover:to-green-500 transition animate__animated animate__bounce" @click="resetBusqueda">
          Limpiar búsqueda
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 md:gap-10">
        <div
          v-for="tema in temasFiltrados"
          :key="tema.id"
          class="bg-gradient-to-br from-[#171d17ee] to-[#1b381bdb] border border-green-700 rounded-3xl shadow-xl px-8 py-8 flex flex-col gap-5 
                backdrop-blur-md group hover:scale-105 hover:shadow-green-600 transition-all duration-200 animate__animated animate__fadeInUp"
        >
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-3xl font-extrabold text-green-400 text-center w-full">{{ tema.titulo }}</h3>
            <button @click="toggleFavorito(tema)" class="text-xl ml-2">
              <span :class="[tema.favorito ? 'text-yellow-300' : 'text-green-700']" class="transition">
                {{ tema.favorito ? '★' : '☆' }}
              </span>
            </button>
          </div>
          <p class="mb-1 text-gray-200 text-center">{{ tema.descripcion }}</p>
          <!-- Barra de progreso simulada -->
          <div class="mt-1 mb-2">
            <div class="text-green-200 text-sm mb-1 text-center">
              Progreso: {{ tema.progreso }}%
            </div>
            <div class="h-3 w-full bg-green-900/80 rounded overflow-hidden shadow">
              <div :style="{ width: tema.progreso + '%' }" class="bg-gradient-to-r from-green-400 to-green-700 h-3 transition-all duration-700"></div>
            </div>
          </div>
          <!-- Video -->
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
          <!-- Ejercicios -->
          <ul class="list-disc pl-6 mb-2 text-green-200 text-[16px] text-left">
            <li v-for="ej in tema.ejercicios" :key="ej">
              <span>{{ ej }}</span>
              <button @click="responderEjercicio(tema, ej)" class="ml-2 px-3 py-1 text-xs font-bold bg-green-800 hover:bg-green-700 rounded text-green-100 transition">
                Resolver
              </button>
            </li>
          </ul>
          <div class="flex gap-2 justify-center">
            <button
              class="px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-400 text-white font-bold shadow
                    hover:from-green-700 hover:to-green-500 transition focus:outline-none focus:ring-2 focus:ring-green-500"
              @click="accederTema(tema)"
            >
              Acceder
            </button>
            <button
              class="px-6 py-2 rounded-lg bg-gradient-to-r from-green-700 to-green-700 text-white font-bold shadow
                    hover:bg-green-800 transition focus:outline-none focus:ring-1 focus:ring-green-800"
              @click="verDetalles(tema)"
            >
              Detalles
            </button>
          </div>
        </div>
      </div>
      <!-- Modal interactivo ejercicio -->
      <div v-if="modalEjercicio" class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 px-4">
        <div class="bg-[#121d12] rounded-3xl p-8 max-w-md w-full border border-green-800 shadow-2xl animate__animated animate__fadeIn">
          <h3 class="text-green-400 text-2xl text-center font-extrabold mb-4">{{ ejercicioActivo.titulo }}</h3>
          <div class="text-green-200 mb-4 font-semibold">{{ ejercicioActivo.ej }}</div>
          <input v-model="respuestaEjercicio" placeholder="Tu respuesta..." class="w-full px-4 py-2 rounded-lg bg-green-100/10 border border-green-600 text-green-300 mb-4" />
          <div class="flex gap-2 mt-2">
            <button @click="enviarRespuesta" class="px-4 py-2 bg-green-700 rounded font-bold text-white hover:bg-green-800 transition">Enviar</button>
            <button @click="cerrarEjercicio" class="px-4 py-2 bg-red-700 rounded font-bold text-white hover:bg-red-800 transition">Cancelar</button>
          </div>
          <div v-if="ejercicioFeedback" class="mt-3 text-green-400 text-center">{{ ejercicioFeedback }}</div>
        </div>
      </div>
      <!-- Modal detalles -->
      <div v-if="modalDetalles" class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 px-4">
        <div class="bg-[#121d12] rounded-3xl p-8 max-w-md w-full border border-green-800 shadow-2xl animate__animated animate__fadeIn">
          <h3 class="text-green-400 text-2xl text-center font-extrabold mb-4">{{ detallesActivo.titulo }}</h3>
          <div class="text-green-200 mb-3 font-semibold">{{ detallesActivo.descripcion }}</div>
          <div>
            <b>Ejercicios:</b>
            <ul class="list-disc ml-6 text-green-100">
              <li v-for="ej in detallesActivo.ejercicios" :key="ej">{{ ej }}</li>
            </ul>
          </div>
          <div class="flex justify-end gap-2 mt-5">
            <button @click="cerrarDetalles" class="px-4 py-2 bg-green-700 rounded font-bold text-white hover:bg-green-800 transition">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import 'animate.css';

const router = useRouter();
const busqueda = ref('');
const modalEjercicio = ref(false);
const modalDetalles = ref(false);

const respuestaEjercicio = ref('');
const ejercicioFeedback = ref('');
const ejercicioActivo = ref({ titulo: '', ej: '' });

const detallesActivo = ref({});

const temas = ref([
  {
    id: 1,
    titulo: "Cinemática",
    descripcion: "Estudio del movimiento de los cuerpos sin atender las causas que lo producen.",
    ejercicios: ["¿Qué es la velocidad?", "Ejemplo de MRU", "Calcula aceleración."],
    videoUrl: "https://www.youtube.com/embed/F4U7Ab_lKjY",
    progreso: 30,
    favorito: false
  },
  {
    id: 2,
    titulo: "Dinámica",
    descripcion: "Analiza las fuerzas y su influencia en el movimiento.",
    ejercicios: ["Enuncia la Segunda Ley de Newton.", "Fuerza neta sobre un bloque de 2kg."],
    videoUrl: "https://www.youtube.com/embed/Jk31Nwjb6ms",
    progreso: 65,
    favorito: false
  },
  {
    id: 3,
    titulo: "Termodinámica",
    descripcion: "Estudia el calor y la temperatura, y sus efectos sobre la materia.",
    ejercicios: ["¿Qué es la energía interna?", "Ejemplo del primer principio de la termodinámica."],
    videoUrl: "https://www.youtube.com/embed/U3vYsZudOqo",
    progreso: 100,
    favorito: true
  }
]);

const temasFiltrados = computed(() =>
  temas.value.filter(t =>
    t.titulo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    t.descripcion.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    t.ejercicios.some(ej => ej.toLowerCase().includes(busqueda.value.toLowerCase()))
  )
);

const resetBusqueda = () => { busqueda.value = ''; };

// Guardar favoritos en localStorage
const toggleFavorito = tema => {
  tema.favorito = !tema.favorito;
  window.localStorage.setItem('temasFavoritos', JSON.stringify(
    temas.value.filter(t => t.favorito).map(t => t.id)
  ));
};

// Acceder tema (simula navegación y barra de progreso)
const accederTema = tema => {
  tema.progreso = Math.min(100, tema.progreso + 10);
  router.push({ name: "Lecciones", params: { id: tema.id } });
};

const verDetalles = tema => {
  detallesActivo.value = tema;
  modalDetalles.value = true;
};
const cerrarDetalles = () => { modalDetalles.value = false; };

// Interacción ejercicios (simulado)
const responderEjercicio = (tema, ej) => {
  ejercicioActivo.value = { titulo: tema.titulo, ej };
  respuestaEjercicio.value = '';
  ejercicioFeedback.value = '';
  modalEjercicio.value = true;
};
const enviarRespuesta = () => {
  ejercicioFeedback.value = "¡Respuesta enviada! (corrección automática pendiente)";
  setTimeout(() => { modalEjercicio.value = false; ejercicioFeedback.value = ''; }, 1200);
};
const cerrarEjercicio = () => { modalEjercicio.value = false; respuestaEjercicio.value = ''; ejercicioFeedback.value = ''; };

// Cargar favoritos desde localStorage (solo ids)
const favoritosLocal = window.localStorage.getItem('temasFavoritos');
if (favoritosLocal) {
  const favIds = JSON.parse(favoritosLocal);
  temas.value.forEach(t => t.favorito = favIds.includes(t.id));
}
</script>
