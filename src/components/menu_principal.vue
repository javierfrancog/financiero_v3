<template>
  <v-app>
    <appBar @toggleNav="toggleNav" @msj="msj" />
    <Nav v-model:drawer="drawer" />
    <v-main>
      <v-container fluid>
        <router-view @snack="snack" @msj="msj"></router-view>
      </v-container>
    </v-main>
    <v-footer app></v-footer>
    <v-snackbar v-model="snackbar.estado" :color="snackbar.color" :timeout="snackbar.timeout" bottom right>
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn @click="snackbar.estado = false" icon class="white--text" v-bind="attrs">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
<script>
import Nav from "@/components/Nav.vue";
import appBar from "@/components/appBar.vue";

export default {
  name: "Home",
  data: () => ({
    drawer: true,
    snackbar: {
      estado: false
    }
  }),
  mounted() {
    console.log("menu_principal mounted, drawer:", this.drawer);
  },
  components: {
    Nav,
    appBar
  },
  methods: {
    msj(text, color, timeout) {
      this.snackbar.estado = true;
      this.snackbar.text = text;
      this.snackbar.color = color ? `${color} darken-2` : "red darken-3";
      this.snackbar.timeout = timeout || 10000;
    },
    toggleNav(data) {
      this.drawer = !this.drawer;
    },
    snack(data) {
      this.snackbar = data;
    }
  }
};
</script>

