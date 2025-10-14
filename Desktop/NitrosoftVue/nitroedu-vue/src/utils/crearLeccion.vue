<template>
  <div class="min-h-screen font-sans px-4 py-6 bg-gradient-to-br from-black via-[#161d14] to-green-950 flex justify-center items-start">
    <div class="bg-gradient-to-br from-[#171d17ee] to-[#1b381bdb] border border-green-700 rounded-2xl shadow-xl p-8 w-full max-w-xl">
      <h1 class="text-3xl font-bold mb-6 text-green-400 text-center">Crear Nueva Lección</h1>

      <form @submit.prevent="crearLeccion" class="flex flex-col gap-5">
        <label class="text-green-300 font-semibold">ID del Tema (Número)</label>
        <input 
          v-model.number="temaId" 
          type="number" 
          placeholder="Ejemplo: 1" 
          required
          class="px-4 py-2 rounded-lg bg-black text-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
        />

        <label class="text-green-300 font-semibold">Título</label>
        <input 
          v-model="titulo" 
          type="text" 
          placeholder="Título de la lección" 
          required
          class="px-4 py-2 rounded-lg bg-black text-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <label class="text-green-300 font-semibold">Descripción</label>
        <textarea 
          v-model="descripcion" 
          rows="2" 
          placeholder="Descripción breve" 
          class="px-4 py-2 rounded-lg bg-black text-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        ></textarea>

        <label class="text-green-300 font-semibold">Contenido (HTML permitido)</label>
        <textarea 
          v-model="contenido" 
          rows="6" 
          placeholder="Ejemplo: <p>Texto extenso...</p>" 
          class="px-4 py-2 rounded-lg bg-black text-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        ></textarea>
        
        <label class="text-green-300 font-semibold">URL Video (embed)</label>
        <input 
          v-model="videoUrl" 
          type="url" 
          placeholder="https://www.youtube.com/embed/xxxx" 
          class="px-4 py-2 rounded-lg bg-black text-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <label class="text-green-300 font-semibold">Ejercicios (Separados por coma)</label>
        <input 
          v-model="ejerciciosInput" 
          type="text" 
          placeholder="Ejemplo: Ej1, Ej2, Ej3" 
          class="px-4 py-2 rounded-lg bg-black text-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button 
          type="submit" 
          class="self-center px-7 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-400 text-white font-bold shadow
                 hover:from-green-700 hover:to-green-500 transition focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Crear Lección
        </button>
      </form>

      <p v-if="mensaje" class="mt-4 text-center text-green-400 font-semibold">{{ mensaje }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

const temaId = ref(null)
const titulo = ref('')
const descripcion = ref('')
const contenido = ref('')
const videoUrl = ref('')
const ejerciciosInput = ref('')
const mensaje = ref('')

async function crearLeccion() {
  if (!temaId.value || !titulo.value) {
    mensaje.value = 'Debe completar el ID del tema y el título.'
    return
  }

  const ejercicios = ejerciciosInput.value.split(',').map(ej => ej.trim()).filter(Boolean)

  try {
    await addDoc(collection(db, 'lecciones'), {
      temaId: Number(temaId.value),
      titulo: titulo.value,
      descripcion: descripcion.value,
      contenido: contenido.value,
      videoUrl: videoUrl.value,
      ejercicios: ejercicios
    })
    mensaje.value = 'Lección creada con éxito.'
    // Limpia campos
    temaId.value = null
    titulo.value = ''
    descripcion.value = ''
    contenido.value = ''
    videoUrl.value = ''
    ejerciciosInput.value = ''
  } catch (error) {
    mensaje.value = 'Error al crear la lección: ' + error.message
  }
}
</script>
