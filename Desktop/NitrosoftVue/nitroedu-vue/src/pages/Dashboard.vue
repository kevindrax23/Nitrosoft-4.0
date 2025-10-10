<template>
  <div class="min-h-screen bg-gradient-to-br from-[#181C25] via-blue-900 to-[#007fff] font-mono flex">
    <!-- Sidebar -->
    <aside :class="sidebarOpen ? 'w-64' : 'w-14'"
           class="bg-[#202634cc] border-r border-[#333] flex flex-col justify-between py-6 px-3 transition-all duration-300 rounded-r-2xl shadow-xl">
      <button
        @click="toggleSidebar"
        class="absolute top-1/2 right-0 -translate-y-1/2 bg-transparent border-none text-gray-100 text-2xl cursor-pointer z-10"
        aria-label="Toggle sidebar"
      >
        <span v-if="sidebarOpen">&#8678;</span>
        <span v-else>&#8680;</span>
      </button>

      <div>
        <div class="flex flex-col items-center mb-8">
          <div class="w-14 h-14 bg-[#007fff] rounded-full flex justify-center items-center text-xl font-bold text-white mb-2">U</div>
          <div class="text-lg font-semibold mb-2 transition-opacity duration-300" :class="sidebarOpen ? 'opacity-100' : 'opacity-0'">
            Usuario
          </div>
          <div class="flex items-center gap-2">
            <span :style="{ backgroundColor: getConnectionColor() }"
                  class="inline-block w-3 h-3 rounded-full border border-[#121212]" />
            <select
              v-model="connection"
              class="bg-[#121212] border-none rounded px-2 py-1 text-white font-semibold text-sm cursor-pointer transition-opacity duration-300"
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
              class="flex items-center gap-3 py-3 px-5 rounded-lg transition-all duration-200 bg-transparent hover:bg-blue-950 hover:border-l-4 hover:border-blue-400 text-gray-200"
              :class="sidebarOpen ? 'justify-start' : 'justify-center'"
            >
              <span :class="item.icon + ' text-xl min-w-[24px] text-center'"></span>
              <span v-if="sidebarOpen">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      <button
        @click="handleLogout"
        class="mt-4 w-full flex items-center gap-2 justify-center py-3 px-5 bg-[#252B38] text-[#ff5252] rounded-xl font-bold transition-all hover:bg-[#3c1212]"
        :class="sidebarOpen ? 'text-base' : 'text-xl'"
      >
        <span class="bi bi-box-arrow-right"></span>
        <span v-if="sidebarOpen">Cerrar Sesión</span>
      </button>
    </aside>
    <!-- Content -->
    <main class="flex-1 p-10 overflow-auto text-gray-100 font-mono">
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
    case "conectado": return "#3ddc84";
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
