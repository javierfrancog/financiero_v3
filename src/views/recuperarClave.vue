<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid class="px-0 pa-0 grey lighten-4" fill-height no-gutters>
        <v-row class="fill-height" no-gutters>
          <v-col cols="12" sm="12" md="12" class="bg-right">
            <v-layout align-center justify-center fill-height>
              <v-flex xs11 sm11 md4>
                <v-card elevation="4" color="px-8 pa-2">
                  <v-card-title class="font-weight-medium headline">Recuperación de contraseña</v-card-title>
                  <v-form ref="form" class="px-3 pa-3" v-model="loginValidate">
                    <v-text-field
                      label="Correo"
                      prepend-inner-icon="person"
                      type="text"
                      clearable
                      outlined
                      color="blue darken-4"
                      required
                      :rules="emailRules"
                    ></v-text-field>
                    <v-layout mb-4 justify-end align-center>
                      <v-btn
                        color="primary"
                        text                        
                        class="mt-3 mr-3"
                        depressed
                        to="login"
                      >Cancelar</v-btn>
                      <v-btn color="green" dark large class="mt-3" depressed>Recuperar</v-btn>
                    </v-layout>
                  </v-form>
                </v-card>
              </v-flex>
            </v-layout>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<style scoped>
.bg-right {
  background: linear-gradient(180deg, #06b3e4, #13498f);
}
</style>

<script>
export default {
  name: "recuperarClave",
  data() {
    return {
      loginValidate: false,
      emailRules: [
        v => !!v || "E-mail requerido",
        v => /.+@.+\..+/.test(v) || "E-mail inválido"
      ]
    };
  },
  methods: {}
};
</script>

