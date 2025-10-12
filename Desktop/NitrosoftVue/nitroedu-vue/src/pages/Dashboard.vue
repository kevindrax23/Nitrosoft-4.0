<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-[#141914] to-green-900 font-mono flex">
    <aside
      :class="sidebarOpen ? 'w-64' : 'w-16'"
      class="fixed top-0 left-0 h-screen z-30 bg-black/80 border-r border-green-600 flex flex-col transition-all duration-300 rounded-r-2xl shadow-xl"
    >
      <!-- Toggle circular, borde derecho, centrado vertical -->
      <button
        @click="toggleSidebar"
        class="absolute right-[-22px] top-1/2 transform -translate-y-1/2 w-11 h-11 rounded-full bg-green-500 hover:bg-green-700 text-white 
               flex items-center justify-center shadow-lg border-4 border-green-400 z-40 transition"
        aria-label="Alternar menú"
      >
        <span :class="sidebarOpen ? 'bi bi-chevron-left text-2xl' : 'bi bi-chevron-right text-2xl'"></span>
      </button>

      <div class="flex-1 flex flex-col justify-between pt-14 pb-6 h-full">
        <div>
          <div class="flex flex-col items-center mb-8 relative">
            <div class="relative group">
              <!-- Avatar circular grande (64px) -->
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                class="w-16 h-16 rounded-full border-2 border-green-400 shadow-lg object-cover"
                alt="Avatar"
              />
              <div
                v-else
                class="w-16 h-16 rounded-full bg-gradient-to-br from-green-700 to-green-400 flex justify-center items-center text-2xl font-extrabold text-white shadow-lg border-2 border-green-400 select-none">
                U
              </div>
              <!-- Lápiz debajo y centrado -->
              <button
                class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-green-500 hover:bg-green-700 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md transition"
                @click.prevent="triggerFileInput"
                aria-label="Cambiar imagen"
              >
                <span class="bi bi-pencil text-[1rem]"></span>
              </button>
              <input
                ref="fileInput"
                @change="onFileChange"
                type="file"
                accept="image/*"
                class="hidden"
              />
            </div>
            <div class="text-lg font-semibold mb-2 transition-opacity duration-300 text-green-400 mt-3"
                 :class="sidebarOpen ? 'opacity-100' : 'opacity-0'">Usuario</div>
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
          <ul class="flex flex-col list-none p-0 m-0 space-y-2">
            <li v-for="(item, i) in menuItems" :key="item.path">
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
          class="w-full flex items-center gap-2 justify-center py-3 px-5 bg-black text-green-400 rounded-xl font-bold
                 transition-all hover:bg-green-800 hover:text-white shadow-lg"
          :class="sidebarOpen ? 'text-base' : 'text-xl'"
        >
          <span class="bi bi-box-arrow-right"></span>
          <span v-if="sidebarOpen">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
    <main class="flex-1 p-6 overflow-auto text-gray-100 font-mono min-h-screen ml-16 md:ml-64 flex items-center justify-center">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from "firebase/firestore";

const router = useRouter();
const connection = ref("conectado");
const sidebarOpen = ref(true);

const avatarUrl = ref(null);
const fileInput = ref(null);
const usuarioId = "usuario123"; // Cambia por tu UID real o el del usuario autenticado

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

function triggerFileInput() {
  fileInput.value?.click();
}

async function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    // Preview local (opcional)
    const reader = new FileReader();
    reader.onload = (e) => { avatarUrl.value = e.target.result; };
    reader.readAsDataURL(file);

    // Subida a Storage
    const storage = getStorage();
    const avatarStorageRef = storageRef(storage, `avatars/${usuarioId}/${file.name}`);
    await uploadBytes(avatarStorageRef, file);

    // Obtener y guardar URL global
    const downloadURL = await getDownloadURL(avatarStorageRef);
    avatarUrl.value = downloadURL;
    const userDoc = doc(db, "usuarios", usuarioId);
    await updateDoc(userDoc, { avatarUrl: downloadURL });
  }
}

// Cargar avatar al entrar:
onMounted(async () => {
  const userDoc = doc(db, "usuarios", usuarioId);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists() && docSnap.data().avatarUrl) {
    avatarUrl.value = docSnap.data().avatarUrl;
  } else {
    avatarUrl.value = null; // usa placeholder si no hay imagen
  }
});

function handleLogout() {
  localStorage.removeItem('token')
  router.push("/")
}
</script>
