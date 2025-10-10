<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#181C25] via-blue-900 to-[#007fff] font-mono">
    <form @submit.prevent="handleLogin"
          class="bg-[#121212cc] backdrop-blur-md rounded-xl shadow-2xl max-w-[400px] w-full flex flex-col gap-6 p-8 border border-[#333]">
      <h2 class="text-2xl font-bold text-center mb-2 tracking-wider">Iniciar Sesión</h2>
      <input
        v-model="email"
        type="email"
        placeholder="Correo electrónico"
        class="w-full py-3 px-4 rounded-md border border-slate-600 bg-[#1e1e1e] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007fff] transition-all"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Contraseña"
        class="w-full py-3 px-4 rounded-md border border-slate-600 bg-[#1e1e1e] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007fff] transition-all"
        required
      />
      <label class="flex items-center space-x-2 text-gray-400 text-sm select-none">
        <input type="checkbox" v-model="remember" class="accent-[#007fff] w-4 h-4" />
        <span>Recordar credenciales</span>
      </label>
      <button
        type="submit"
        class="w-full py-3 rounded-md bg-gradient-to-r from-[#007fff] to-[#005fcc] text-lg font-bold text-white transition-all hover:from-[#005fcc] hover:to-[#007fff] shadow-md"
      >
        Iniciar Sesión
      </button>
      <p v-if="error" class="text-center text-red-400 font-semibold">{{ error }}</p>
      <p class="text-center text-[#007fff] cursor-pointer text-sm mt-2">¿Olvidaste la contraseña?</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const email = ref('');
const password = ref('');
const remember = ref(false);
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  error.value = '';
  try {
    // Autentica con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    // Guarda UID como "token" en localStorage para el guard del router
    localStorage.setItem('token', userCredential.user.uid);
    // Redirige al dashboard
    router.push('/dashboard');
  } catch (err) {
    error.value = "Usuario o contraseña incorrectos";
  }
}
</script>
