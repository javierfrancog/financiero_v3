<template>
  <v-app :style="{ background: 'transparent' }" class="mx-auto">
    <v-img
      :src="modulo_src"
      class="mx-auto"
      height="100"
      width="800"
      contain
    ></v-img>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      imagenes: {
        financiero: "https://server1ts.net//Datos/image/botonfin.png",
        punto_venta: "https://server1ts.net//Datos/image/boton_mcia.png",
        gestion_th: "https://server1ts.net//Datos/image/boton_gth.png",
        clinico: "https://server1ts.net//Datos/image/boton_cladmon.png",
        hclinica: "https://server1ts.net//Datos/image/boton_hclinica.png",
        ssalud: "https://server1ts.net//Datos/image/boton_ssalud.png",
        colegio: "https://server1ts.net//Datos/image/boton_col.png",
        molino: "https://server1ts.net//Datos/image/boton_mol.png",
        servdm: "https://server1ts.net//Datos/image/boton_servdm.png",
        tablero: "https://server1ts.net//Datos/image/boton_tablero.png",
        recaudos: "https://server1ts.net//Datos/image/boton_recaudos.png",
        transporte: "https://server1ts.net//Datos/image/boton_transporte.png",
        manuales: "https://server1ts.net//Datos/image/boton_manual.png",
        resmed: "https://server1ts.net//Datos/image/boton_resmed.png",
        agendamed: "https://server1ts.net//Datos/image/boton_agendamed.png",
        trespecial: "https://server1ts.net//Datos/image/boton_trespecial.png",
        docselect: "https://server1ts.net//Datos/image/boton_docelectr.png",
        dispensa: "https://server1ts.net//Datos/image/boton_dispensa.png",
        plazos: "https://server1ts.net//Datos/image/boton_plazos.png",
        testeo: "https://server1ts.net//Datos/image/boton_testeo.png",
        autocolabora:
          "https://server1ts.net//Datos/image/boton_autocolabora.png",
        phorizontal: "https://server1ts.net//Datos/image/boton_phorizontal.png",
        trmcias: "https://server1ts.net//Datos/image/boton_trmcias.png",
        hseq: "https://server1ts.net//Datos/image/boton_hseq.png",
      },
      modulo_src: null,
    };
  },
  mounted() {
    let path = this.$route.path;
    let modulo = path.split("/")[2];
    this.modulo_src = this.imagenes[modulo];
  },
};
</script>

