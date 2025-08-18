<template>
  <v-dialog v-model="firmaDialog" max-width="600" persistent>
    <v-card>
      <v-card-title>Firma Consentimientox</v-card-title>
      <v-card-text>
        <FirmaManuscrito @firmaGuardada="imprimirPDF" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="red" text large depressed @click="firmaDialog = false"
          >Cancelar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { consent_infor } from "../../_formatos_sal.js";
import FirmaManuscrito from "../FirmaManuscrito.vue";

export default {
  components: {
    FirmaManuscrito,
  },
  data() {
    return {
      firmaDialog: true,
    };
  },
  methods: {
	imprimirPDF(firma) {
      let data = {};
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      data.firma = firma

      this.pdfs.getBase64(logo_src).then((logo) => {
        data.logo = logo;

        consent_infor(data).then(()=> {
          console.log("Impresion terminada");
        })
      });
    },
  },
};
</script>