<template>
  <div></div>
</template>    
    <script>
import ManualService from "@/services/ManualService";

export default {
  async mounted() {
    await ManualService.inicializar();
  },
  methods: {
    async enviarMensaje() {
      this.respuestas = ManualService.buscar(this.preguntaUsuario);
    },
  },
};
</script>


