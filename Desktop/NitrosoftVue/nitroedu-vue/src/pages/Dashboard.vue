<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-[#141914] to-green-900 font-mono flex flex-col md:flex-row">
    <!-- Sidebar -->
    <aside
      :class="sidebarOpen ? 'w-64' : 'w-16'"
      class="relative bg-black/80 border-r border-green-600 flex flex-col justify-between py-6 px-2 transition-all duration-300 rounded-r-2xl shadow-xl min-h-[60px] h-[auto] fixed md:sticky top-0 left-0 z-20"
      style="min-height: 100vh;"
    >
      <!-- Toggle (linea tipo grip) -->
      <div
        @click="toggleSidebar"
        class="absolute top-0 left-0 h-full flex flex-col justify-center items-center cursor-pointer"
        style="width: 12px;"
        aria-label="Toggle sidebar"
      >
        <div
          :class="sidebarOpen
            ? 'bg-green-400 hover:bg-green-600'
            : 'bg-green-700 hover:bg-green-500'"
          class="transition-all duration-200 rounded-full"
          style="width: 4px; height: 50px;"
        ></div>
      </div>

      <div>
        <div class="flex flex-col items-center mb-8">
          <div class="w-14 h-14 bg-gradient-to-br from-green-700 to-green-400 rounded-full flex justify-center items-center text-xl font-bold text-white mb-2 shadow-lg" style="border:2px solid #31c56e;">
            U
          </div>
          <div class="text-lg font-semibold mb-2 transition-opacity duration-300 text-green-400"
               :class="sidebarOpen ? 'opacity-100' : 'opacity-0'">
            Usuario
          </div>
          <div class="flex items-center gap-2">
            <span :style="{ backgroundColor: getConnectionColor() }"
                  class="inline-block w-3 h-3 rounded-full border border-[#121212]" />
            <select
              v-model="connection"
              class="bg-[#181f18] border-none rounded px-2 py-1 text-green-300 font-semibold text-sm cursor-pointer transition-opacity duration-300"
              :class="sidebarOpen ? 'opacity-100' : 'opacity-0'"
            >
              <option value="conectado">Conectado</option>
              <option value="ausente">Ausente</option>
              <option value="desconectado">Desconectado</option>
            </select>
          </div>
        </div>
        <ul class="flex-1 list-none p-0 m-0">
          <li v-for="(item, i) in menuItems" :key="item.path" class="my-2">
            <router-link
              :to="item.path"
              class="flex items-center gap-3 py-3 px-5 rounded-lg transition-all duration-200 bg-transparent hover:bg-green-950 hover:border-l-4 hover:border-green-500 text-gray-200 md:text-base text-sm"
              :class="sidebarOpen ? 'justify-start' : 'justify-center'"
            >
              <span :class="item.icon + ' text-xl min-w-[24px] text-center text-green-400'"></span>
              <span v-if="sidebarOpen">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      <button
        @click="handleLogout"
        class="mt-4 w-full flex items-center gap-2 justify-center py-3 px-5 bg-black text-green-400 rounded-xl font-bold transition-all hover:bg-green-800 hover:text-white shadow-lg"
        :class="sidebarOpen ? 'text-base' : 'text-xl'"
      >
        <span class="bi bi-box-arrow-right"></span>
        <span v-if="sidebarOpen">Cerrar Sesión</span>
      </button>
    </aside>
    <main class="flex-1 p-6 overflow-auto text-gray-100 font-mono min-h-[80vh] flex items-center justify-center">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const connection = ref("conectado");
const sidebarOpen = ref(true);

const menuItems = [
  { icon: "bi bi-journal-text", label: "Asignaturas", path: "/dashboard/asignaturas" },
  { icon: "bi bi-pencil-square", label: "Evaluaciones", path: "/dashboard/evaluaciones" },
  { icon: "bi bi-bar-chart-line", label: "Estadísticas", path: "/dashboard/estadisticas" },
  { icon: "bi bi-gear", label: "Configuración", path: "/dashboard/configuracion" },
  { icon: "bi bi-chat-dots", label: "Chat Interno", path: "/dashboard/chatinterno" },
];

function getConnectionColor() {
  switch (connection.value) {
    case "conectado": return "#31c56e";
    case "ausente": return "#f2cb57";
    case "desconectado": return "#e34234";
    default: return "#ccc";
  }
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

function handleLogout() {
  localStorage.removeItem('token')
  router.push("/")
}
</script>
