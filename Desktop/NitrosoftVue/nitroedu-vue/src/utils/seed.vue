<template>
  <div class="p-4">
    <button
      @click="crearPreguntasMatematicas"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
    >
      Crear preguntas de Matemáticas en Firestore
    </button>
  </div>
</template>

<script setup>
import { db } from '../firebase' // Ajusta esta ruta según donde tengas firebase.js
import { collection, addDoc } from 'firebase/firestore'

const preguntasMatematicas = [
  {
    materia: "mat1",
    pregunta: "¿Cuánto es 5 × 3?",
    opciones: ["8", "15", "35", "10"],
    respuestaCorrecta: "15"
  },
  {
    materia: "mat1",
    pregunta: "¿Cuánto es la raíz cuadrada de 49?",
    opciones: ["7", "14", "6", "8"],
    respuestaCorrecta: "7"
  },
  {
    materia: "mat1",
    pregunta: "¿Cuánto es 12 ÷ 4?",
    opciones: ["8", "3", "5", "6"],
    respuestaCorrecta: "3"
  },
  {
    materia: "mat1",
    pregunta: "¿Cuál es el valor de 2^4?",
    opciones: ["8", "16", "6", "4"],
    respuestaCorrecta: "16"
  },
  {
    materia: "mat1",
    pregunta: "¿Cuánto es 10 + 7?",
    opciones: ["16", "15", "17", "14"],
    respuestaCorrecta: "17"
  },
  {
    materia: "mat1",
    pregunta: "¿Cuál es el resultado de 21 - 9?",
    opciones: ["12", "13", "10", "11"],
    respuestaCorrecta: "12"
  },
  {
    materia: "mat1",
    pregunta: "¿Cuánto es 6 × 7?",
    opciones: ["42", "36", "49", "52"],
    respuestaCorrecta: "42"
  },
  {
    materia: "mat1",
    pregunta: "¿Cuál es el valor de 9^2?",
    opciones: ["18", "81", "27", "72"],
    respuestaCorrecta: "81"
  },
  {
    materia: "mat1",
    pregunta: "¿Cuánto es 100 ÷ 20?",
    opciones: ["2", "5", "10", "20"],
    respuestaCorrecta: "5"
  },
  {
    materia: "mat1",
    pregunta: "¿Cuánto es 4 × 4 × 2?",
    opciones: ["16", "24", "32", "28"],
    respuestaCorrecta: "32"
  }
]

async function crearPreguntasMatematicas() {
  try {
    for (const pregunta of preguntasMatematicas) {
      await addDoc(collection(db, 'preguntas'), pregunta)
    }
    alert('Preguntas agregadas correctamente a Firestore')
  } catch (error) {
    console.error('Error agregando preguntas:', error)
    alert('Ocurrió un error al agregar las preguntas')
  }
}
</script>
