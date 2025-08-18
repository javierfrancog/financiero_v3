<template>
  <v-app>
    <GlobalLoader :show="globalLoader" :text="loaderText" />

    <router-view />
  </v-app>
</template>

<script>
import GlobalLoader from "@/components/GlobalLoader.vue";

export default {
  components: {
    GlobalLoader,
  },
  data() {
    return {
      globalLoader: false,
      loaderText: "",
    };
  },
  provide() {
    return {

    setLoader: (estado, texto = "Cargando, por favor espere...") => {
      this.loaderText = estado ? texto : "";
      this.globalLoader = estado;
    },
    setLoaderText: (texto) => {
      this.loaderText = texto;
    },

    };
  },
};
</script>

<style>
.section-header {
  background-color: #3563ad;
}

/* .mytable table tr {
    background-color: rgb(135, 174, 216);
    border-bottom: none !important;
 } */
tbody tr:nth-of-type(odd) {
  background-color: rgba(84, 107, 147, 0.05);
}
tbody tr:nth-of-type(even) {
  background-color: rgb(220, 224, 233);
}
.v-data-table-header {
  /* background-color: rgb(21, 101, 192); */
  background-color: rgb(167, 204, 247);
}

.v-card {
  border: 1px solid #01579b !important;
}
</style>
<style lang="sass">
a:link
  text-decoration: none
</style>