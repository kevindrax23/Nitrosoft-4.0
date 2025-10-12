<template>
  <div class="min-h-screen flex flex-col justify-center items-center
    bg-gradient-to-br from-black via-[#1a1a1a] to-green-700 font-mono px-4 py-6">
    <form
      @submit.prevent="handleLogin"
      class="bg-[#141914cc] backdrop-blur-md rounded-2xl shadow-2xl max-w-[400px] w-full flex flex-col gap-6 p-8 border border-green-700"
    >
      <h2 class="text-2xl font-bold text-center mb-2 tracking-wider text-green-400 drop-shadow">Iniciar Sesión</h2>
      
      <input
        v-model="email"
        type="email"
        placeholder="Correo electrónico"
        class="w-full py-3 px-4 rounded-md border border-green-800 bg-[#171717] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Contraseña"
        class="w-full py-3 px-4 rounded-md border border-green-800 bg-[#171717] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
        required
      />

      <label class="flex items-center space-x-2 text-gray-300 text-sm select-none">
        <input type="checkbox" v-model="remember" class="accent-green-500 w-4 h-4" />
        <span>Recordar credenciales</span>
      </label>

      <button
        type="submit"
        class="w-full py-3 rounded-md bg-gradient-to-r from-green-600 to-green-400 text-lg font-bold text-white transition-all hover:from-green-700 hover:to-green-500 shadow-md"
      >
        Iniciar Sesión
      </button>
      <p v-if="error" class="text-center text-red-400 font-semibold">{{ error }}</p>
      <p class="text-center text-green-400 cursor-pointer text-sm mt-2 hover:underline">¿Olvidaste la contraseña?</p>
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
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    localStorage.setItem('token', userCredential.user.uid);
    router.push('/dashboard');
  } catch (err) {
    error.value = "Usuario o contraseña incorrectos";
  }
}
</script>
