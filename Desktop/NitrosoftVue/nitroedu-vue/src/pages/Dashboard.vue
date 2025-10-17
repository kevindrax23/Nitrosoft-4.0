<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-[#171717] to-[#232323] font-sans flex relative overflow-hidden">
    <!-- Sidebar -->
    <aside
      :class="sidebarOpen ? 'w-64' : 'w-14'"
      class="fixed top-0 left-0 h-screen z-30 bg-[#121212] border-r border-gray-800 flex flex-col transition-all duration-300 rounded-r-2xl shadow-xl"
    >
      <!-- Toggle Btn -->
      <button
        @click="toggleSidebar"
        class="absolute right-[-18px] top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-green-500 hover:bg-green-700 text-white flex items-center justify-center shadow-md border-4 border-gray-900 z-40 transition"
        aria-label="Alternar menú"
      >
        <span :class="sidebarOpen ? 'bi bi-chevron-left text-xl' : 'bi bi-chevron-right text-xl'"></span>
      </button>

      <!-- Avatar + User + Estado -->
      <div class="flex-1 flex flex-col justify-between pt-16 pb-8 h-full">
        <div>
          <div class="flex flex-col items-center mb-6 relative group animate__animated animate__fadeInLeft">
            <div class="relative">
              <transition name="scale">
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  class="w-12 h-12 rounded-full border-2 border-green-500 shadow object-cover animate__animated animate__zoomIn"
                  alt="Avatar"
                  key="imgavatar"
                />
                <div
                  v-else
                  class="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex justify-center items-center text-lg font-bold text-gray-100 shadow border-2 border-green-700 select-none animate__animated animate__rotateIn"
                  key="defaultavatar"
                >
                  {{displayName?.charAt(0) || "U"}}
                </div>
              </transition>
              <button
                class="absolute -bottom-3 left-1/4 -translate-x-1/2 w-6 h-6 bg-green-500 hover:bg-green-700 text-white rounded-full shadow-md border-2 border-gray-900 flex items-center justify-center transition"
                @click.prevent="triggerFileInput"
                aria-label="Cambiar imagen"
              >
                <span class="bi bi-pencil text-xs"></span>
              </button>
              <input
                ref="fileInput"
                @change="onFileChange"
                type="file"
                accept="image/*"
                class="hidden"
              />
            </div>
            <div class="text-base font-semibold mb-2 transition-opacity duration-300 text-green-400 mt-3"
                 :class="sidebarOpen ? 'opacity-100' : 'opacity-0'">
              {{ displayName ? displayName : "Usuario" }}
            </div>
            <div class="flex items-center gap-2">
              <span :style="{ backgroundColor: getConnectionColor() }" class="inline-block w-3 h-3 rounded-full border border-gray-800" />
              <select
                v-model="connection"
                class="bg-[#181818] border-none rounded px-2 py-1 text-green-400 font-semibold text-xs cursor-pointer transition-opacity duration-300"
                :class="sidebarOpen ? 'opacity-100' : 'opacity-0'"
                @change="saveUserConnection"
              >
                <option value="conectado">Conectado</option>
                <option value="ausente">Ausente</option>
                <option value="desconectado">Desconectado</option>
              </select>
            </div>
            <div v-if="avatarFeedback" class="text-green-400 text-xs mt-2">{{ avatarFeedback }}</div>
          </div>
          <ul class="flex flex-col list-none px-0 m-0 space-y-1">
            <li v-for="(item, i) in menuItems" :key="item.path">
              <router-link
                :to="item.path"
                class="flex items-center gap-3 py-3 px-5 rounded-lg transition-all duration-200 bg-transparent hover:bg-gray-800 text-gray-300 hover:text-green-400 md:text-base text-[15px]"
                :class="sidebarOpen ? 'justify-start' : 'justify-center'"
              >
                <span :class="item.icon + ' text-lg min-w-[24px] text-center text-green-500'"></span>
                <span v-if="sidebarOpen">{{ item.label }}</span>
              </router-link>
            </li>
          </ul>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-2 justify-center py-2 px-4 bg-[#171717] text-green-500 border border-gray-800 rounded-lg font-bold
                  transition-all hover:bg-green-600 hover:text-white shadow-md"
          :class="sidebarOpen ? 'text-[15px]' : 'text-lg'"
        >
          <span class="bi bi-box-arrow-right"></span>
          <span v-if="sidebarOpen">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
    <!-- Main -->
    <main class="flex-1 p-6 overflow-auto text-gray-100 font-sans min-h-screen ml-14 md:ml-64 flex items-center justify-center animate__animated animate__fadeIn bg-transparent">
      <!-- Prevenir error si no hay componente router-view válido -->
      <router-view v-slot="{ Component }">
        <component :is="Component" v-if="Component" />
        <div v-else class="text-gray-400 text-xl text-center font-bold w-full py-8">Pantalla no encontrada</div>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import 'animate.css';

const router = useRouter();
const connection = ref("conectado");
const sidebarOpen = ref(true);
const avatarUrl = ref(null);
const fileInput = ref(null);
const displayName = ref(null);
const usuarioId = ref(null);
const avatarFeedback = ref('');

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

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const onFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  avatarFeedback.value = "";
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const base64Image = reader.result.split(",")[1];
    const apiKey = "3edcf912c57b1c0be549e47595bb034d";
    const formData = new FormData();
    formData.append("image", base64Image);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const url = data.data.url;
        avatarUrl.value = url;
        avatarFeedback.value = "¡Avatar actualizado!";
        const userDoc = doc(db, "usuarios", usuarioId.value);
        await setDoc(userDoc, { avatarUrl: url }, { merge: true });
        setTimeout(() => avatarFeedback.value = '', 1800);
      } else {
        avatarFeedback.value = "Error subiendo imagen a ImgBB";
      }
    } catch {
      avatarFeedback.value = "Error de conexión al actualizar el avatar";
    }
  };
};

const saveUserConnection = async () => {
  if (!usuarioId.value) return;
  const userDoc = doc(db, "usuarios", usuarioId.value);
  await setDoc(userDoc, { estado: connection.value }, { merge: true });
};

onMounted(async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    router.push("/login");
    return;
  }
  usuarioId.value = user.uid;
  let nombreCalculado = user.email ? user.email.split("@")[0] : null;
  const userDoc = doc(db, "usuarios", usuarioId.value);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    avatarUrl.value = docSnap.data().avatarUrl || null;
    displayName.value = docSnap.data().nombre || nombreCalculado;
    connection.value = docSnap.data().estado || "conectado";
    if (!docSnap.data().nombre) {
      await setDoc(userDoc, { nombre: nombreCalculado, email: user.email }, { merge: true });
    }
  } else {
    await setDoc(userDoc, {
      email: user.email,
      nombre: nombreCalculado,
      avatarUrl: null,
      estado: "conectado"
    });
    displayName.value = nombreCalculado;
    avatarUrl.value = null;
    connection.value = "conectado";
  }
});

const handleLogout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    localStorage.removeItem("token");
    router.push("/login");
  } catch (e) {
    alert("Error cerrando sesión: " + (e.message || e));
  }
};
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.6);
  opacity: 0.3;
}
::-webkit-scrollbar-thumb { background: #414847 !important; }
::-webkit-scrollbar-track { background: #16181b !important; }
</style>
