<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-[#141914] to-green-900 font-sans flex">
    <aside
      :class="sidebarOpen ? 'w-64' : 'w-16'"
      class="fixed top-0 left-0 h-screen z-30 bg-black/80 border-r border-green-600 flex flex-col transition-all duration-300 rounded-r-2xl shadow-xl"
    >
      <!-- Botón toggle -->
      <button
        @click="toggleSidebar"
        class="absolute right-[-22px] top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-green-500 hover:bg-green-700 text-white
               flex items-center justify-center shadow-lg border-4 border-green-400 z-40 transition"
        aria-label="Alternar menú"
      >
        <span :class="sidebarOpen ? 'bi bi-chevron-left text-2xl' : 'bi bi-chevron-right text-2xl'"></span>
      </button>

      <div class="flex-1 flex flex-col justify-between pt-14 pb-6 h-full">
        <div>
          <div class="flex flex-col items-center mb-8 relative">
            <div class="relative group">
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                class="w-16 h-16 rounded-full border-2 border-green-400 shadow-lg object-cover"
                alt="Avatar"
              />
              <div
                v-else
                class="w-16 h-16 rounded-full bg-gradient-to-br from-green-700 to-green-400 flex justify-center items-center text-2xl font-extrabold text-white shadow-lg border-2 border-green-400 select-none"
              >
                U
              </div>
              <button
                class="absolute -bottom-3 left-1/4 -translate-x-1/2 w-7 h-7 bg-green-500 hover:bg-green-700 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md transition"
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
            <!-- Nombre dinámico -->
            <div class="text-lg font-semibold mb-2 transition-opacity duration-300 text-green-400 mt-3"
                 :class="sidebarOpen ? 'opacity-100' : 'opacity-0'">
              Hola {{ displayName ? displayName : "Usuario" }}
            </div>
            <div class="flex items-center gap-2">
              <span :style="{ backgroundColor: getConnectionColor() }" class="inline-block w-3 h-3 rounded-full border border-[#121212]" />
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
    <main class="flex-1 p-6 overflow-auto text-gray-100 font-sans min-h-screen ml-16 md:ml-64 flex items-center justify-center">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
// Si usas auth de Firebase Web modular:
import { getAuth } from "firebase/auth";

const router = useRouter();
const connection = ref("conectado");
const sidebarOpen = ref(true);
const avatarUrl = ref(null);
const fileInput = ref(null);
const displayName = ref(null);
const usuarioId = ref(null);  // ahora será dinámica, NO string

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
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const base64Image = reader.result.split(",")[1];
    const apiKey = "3edcf912c57b1c0be549e47595bb034d";
    const formData = new FormData();
    formData.append("image", base64Image);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      const url = data.data.url;
      avatarUrl.value = url;
      // Guardar imagen y nombre en Firestore (merge para no pisar nada)
      const userDoc = doc(db, "usuarios", usuarioId.value);
      await setDoc(userDoc, { avatarUrl: url }, { merge: true });
    } else {
      alert("Error subiendo imagen a ImgBB");
    }
  };
}

// Carga datos usuario y avatar en mount
onMounted(async () => {
  // Autenticación
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    // Redirige a login si hace falta:
    router.push("/login");
    return;
  }
  usuarioId.value = user.uid;
  let nombreCalculado = null;
  if (user.email) {
    nombreCalculado = user.email.split("@")[0];
  }
  // Lee Firestore por si ya hay nombre guardado:
  const userDoc = doc(db, "usuarios", usuarioId.value);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    avatarUrl.value = docSnap.data().avatarUrl || null;
    // Si ya hay nombre guardado, úsalo; si no, pon el deducido
    displayName.value = docSnap.data().nombre || nombreCalculado;
    // Si aún no hay campo 'nombre', guárdalo junto al correo
    if (!docSnap.data().nombre) {
      await setDoc(userDoc, {
        nombre: nombreCalculado,
        email: user.email
      }, { merge: true });
    }
  } else {
    // Si no existe, crea documento con nombre y email
    await setDoc(userDoc, {
      email: user.email,
      nombre: nombreCalculado,
      avatarUrl: null
    });
    displayName.value = nombreCalculado;
    avatarUrl.value = null;
  }
});

function handleLogout() {
  localStorage.removeItem("token");
  router.push("/");
}
</script>
