<template>
  <div class="p-8">
    <button
      @click="sembrarPreguntas"
      class="py-3 px-6 rounded bg-blue-600 text-white font-bold hover:bg-blue-800 transition"
    >
      Crear preguntas avanzadas Matemáticas 2
    </button>
  </div>
</template>

<script setup>
import { db } from '../firebase' // Ajusta la ruta si es distinta
import { collection, addDoc } from 'firebase/firestore'

const preguntasMatematicasAvanzadas = [
  {
    materia: "mat2",
    pregunta: "¿Cuál es la derivada de x³?",
    opciones: ["3x²", "x²", "3x", "No existe"],
    respuestaCorrecta: "3x²"
  },
  {
    materia: "mat2",
    pregunta: "Resuelve la integral ∫ 2x dx",
    opciones: ["x² + C", "2x + C", "x + C", "No existe"],
    respuestaCorrecta: "x² + C"
  },
  {
    materia: "mat2",
    pregunta: "¿Cuál es el resultado de (a+b)²?",
    opciones: ["a² + 2ab + b²", "a² + b²", "(a+b)³", "Ninguno"],
    respuestaCorrecta: "a² + 2ab + b²"
  },
  {
    materia: "mat2",
    pregunta: "Solución de 2x + 3 = 7",
    opciones: ["2", "3", "4", "5"],
    respuestaCorrecta: "2"
  },
  {
    materia: "mat2",
    pregunta: "Logaritmo base 10 de 1000",
    opciones: ["2", "3", "4", "10"],
    respuestaCorrecta: "3"
  },
  {
    materia: "mat2",
    pregunta: "Resuelve x² - 5x + 6 = 0",
    opciones: ["x=2,3", "x=1,6", "x=3,4", "x=0,5"],
    respuestaCorrecta: "x=2,3"
  },
  {
    materia: "mat2",
    pregunta: "Valor de sin 90°",
    opciones: ["0", "1", "0.5", "-1"],
    respuestaCorrecta: "1"
  },
  {
    materia: "mat2",
    pregunta: "Valor aproximado de π",
    opciones: ["3.14", "2.71", "3.41", "3.15"],
    respuestaCorrecta: "3.14"
  },
  {
    materia: "mat2",
    pregunta: "Suma de ángulos internos triángulo",
    opciones: ["180°", "360°", "90°", "270°"],
    respuestaCorrecta: "180°"
  },
  {
    materia: "mat2",
    pregunta: "Si f(x) = 2x+3, ¿cuánto vale f(2)?",
    opciones: ["5", "6", "7", "8"],
    respuestaCorrecta: "7"
  }
]

async function sembrarPreguntas() {
  try {
    for (const pregunta of preguntasMatematicasAvanzadas) {
      await addDoc(collection(db, 'preguntas'), pregunta)
    }
    alert('Preguntas avanzadas creadas correctamente')
  } catch (error) {
    alert('Error al crear preguntas')
    console.error(error)
  }
}
</script>
