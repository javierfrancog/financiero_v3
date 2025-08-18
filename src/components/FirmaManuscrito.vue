<template>
  <div>
    <canvas
      ref="canvas"
      class="signature-canvas"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
    ></canvas>
    <br >
    <v-btn @click="clearSignature" color="blue" class="mr-2" dark
      >Borrar firma</v-btn
    >
    <v-btn @click="saveSignature" color="red" dark>Guardar firma</v-btn>
  </div>
</template>
    
    <script>
export default {
  name: "FirmaManuscrito",

  data() {
    return {
      drawing: false,
      context: null,
      lastX: 0,
      lastY: 0,
    };
  },
  mounted() {
    this.context = this.$refs.canvas.getContext("2d");
    this.clearSignature();
  },

  methods: {
    startDrawing(event) {
      this.drawing = true;
      const { offsetX, offsetY } = event;
      this.lastX = offsetX;
      this.lastY = offsetY;
    },
    draw(event) {
      if (!this.drawing) return;
      const { offsetX, offsetY } = event;
      this.context.beginPath();
      this.context.moveTo(this.lastX, this.lastY);
      this.context.lineTo(offsetX, offsetY);
      this.context.stroke();
      this.lastX = offsetX;
      this.lastY = offsetY;
    },
    stopDrawing() {
      this.drawing = false;
    },
    clearSignature() {
      // Establece el color de fondo en blanco
      // Rellena el fondo con blanco
      this.context.fillStyle = "white";
      this.context.fillRect(
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      );
    },
    saveSignature() {
      const canvas = this.$refs.canvas;
      const signatureDataUrl = canvas.toDataURL(); // Especifica el formato JPEG y la calidad (0.8)
      this.$emit("firmaGuardada", signatureDataUrl);
      // const link = document.createElement('a');
      // link.href = signatureDataUrl;
      // link.download = 'firma.jpg'; // Cambia la extensión a .jpg
      // link.click();
    },
  },
};
</script>
    
    
    <style scoped>
.signature-canvas {
  border: 1px solid #000;
  width: 400px; /* Ancho del canvas */
 /* Altura del canvas */
}
</style>

