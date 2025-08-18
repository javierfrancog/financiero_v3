<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid class="d-flex" fullscreen>
        <v-layout align-center justify-center fill-height>
          <v-flex class="d-flex align-center justify-center">
            <v-card
              flat
              elevation="10"
              
              class="ml-6 mb-5 px-5 pa-5 col-12 col-lg-8 col-xl-6 col-md-10"
            >
              <div :style="fondoEstilo" class="mt-0 mb-0">
              </div>                
                <v-row class="mt-0 d-flex align-center justify-center">
                  <v-col class="d-flex align-center justify-center" cols="12" >
                    <span class="Heading 1 font-weight-medium"
                       >Registro de Pasajeros</span>

                  </v-col>
                </v-row>

                <v-row class="mt-3">
                  <v-col class="d-flex" cols="12">
                    <v-select
                      :items="[
                        { text: 'Nit', value: 31 },
                        { text: 'Cedula', value: 13 },
                        { text: 'Pasaporte', value: 41 },
                        { text: 'Permiso Esp.Permanencia', value: 47 },
                        { text: 'Cedula Extranjería', value: 21 },
                        { text: 'Registro Civil', value: 11 },
                        { text: 'Tarjeta Identidad', value: 12 },

                        {
                          text: 'Documento de identificación extranjero',
                          value: 42,
                        },
                        { text: 'NIT de otro país', value: 50 },
                      ]"
                      label="Tipo identificacion"
                      clearable
                      v-model="form.tipoid"
                      required
                      :error="errores.tipoid"
                      @change="
                        errores.tipoid = false;
                        form.rsocial = null;
                        form.apellido1 = null;
                        form.apellido2 = null;
                        form.nombres = null;
                      "
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12">
                    <v-text-field
                      label="Numero Identificación"
                      clearable
                      type="text"
                      required
                      v-model="form.numero"
                      :error="errores.numero"
                      @input="errores.numero = false"
                      hide-details
                      :disabled="form.tipoid == 42"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="8">
                    <v-text-field
                      label="Dígito Verificador"
                      clearable
                      type="text"
                      required
                      v-model="form.dv"
                      :error="errores.dv"
                      @input="errores.dv = false"
                      hide-details
                      :disabled="form.tipoid == 42"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex align-center justify-center">
                    <v-btn
                      color="light-blue accent-4 white--text"
                      class
                      @click="calculardv()"
                      depressed
                    >
                      <v-icon size="25" left>mdi-autorenew</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row class="d-flex">
                  <v-col class="d-flex" cols="12">
                    <v-text-field
                      label="Nombres y Apellidos / Razón Social"
                      clearable
                      outlined
                      required
                      v-model="form.rsocial"
                      :error="errores.rsocial"
                      @input="errores.rsocial = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row v-if="form.tipoid">
                  <v-col class="d-flex" cols="12">
                    <v-text-field
                      label="Direccion"
                      clearable
                      required
                      v-model="form.direccion"
                      :error="errores.direccion"
                      @input="errores.direccion = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      label="Departamento"
                      v-model="form.departamento"
                      :items="departamentos"
                      item-value="value"
                      :error="errores.departamento"
                      @change="
                        errores.departamento = false;
                        get_municipios();
                      "
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      label="Ciudad"
                      v-model="form.ciudad"
                      :items="filterMunicipios"
                      item-value="value"
                      :error="errores.ciudad"
                      @change="errores.ciudad = false"
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row v-if="form.tipoid">
                  <v-col class="d-flex" cols="12">
                    <v-text-field
                      label="Teléfono"
                      clearable
                      type="number"
                      v-model="form.telefono"
                      :error="errores.telefono"
                      @input="errores.telefono = false"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12">
                    <v-text-field
                      label="Correo"
                      clearable
                      v-model="form.correo"
                      type="email"
                      :error="errores.correo"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider color="#FF6F00"></v-divider>
                <v-row class="d-flex align-center justify-center">
                  <v-col class="mt-3 mb-5 d-flex" cols="5">
                    <v-btn
                      color="blue darken-3"
                      large
                      block
                      class="mt-3 mb-3 white--text"
                      depressed
                      @click="guardar()"
                      :loading="loader"
                      :disabled="loader"
                      >Guardar</v-btn
                    >
                  </v-col>
                </v-row>

            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
    <v-snackbar
      v-model="snackbar.estado"
      :color="snackbar.color"
      :timeout="1000"
      bottom
      right
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          @click="snackbar.estado = false"
          icon
          class="white--text"
          v-bind="attrs"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
<style lang="sass" scoped>
.main-content
  box-shadow: 0 17px 17px 0 rgba(0, 0, 0, 0.2)

.v-application .error--text
  color: var(--v-error-darken1) !important
  caret-color: var(--v-error-darken1) !important
</style>
<script>
import post from "../methods.js";

export default {
  name: "login",
  data() {
    return {
      fondoEstilo: {
        backgroundImage:
          "url(https://titansoluciones.cloud/img/892000113.png)",
        backgroundPosition: "top",
        height: "15vh", // Ajusta el tamaño según sea necesario
      },
      snackbar: {
        estado: false,
      },
      loader: false,
      // empresa: "901099286",
      ciudades_dian: [],
      paises_dian: [],
      departamentos: [],
      filterMunicipios: [],

      show1: false,
      loginValidate: false,
      rules: [(v) => !!v || "Campo requerido"],
      form: {
        contacto: null,
      },
      errores: {
        tipoid: false,
        numero: false,
        dv: false,
        rsocial: false,
        apellido1: false,
        apellido2: false,
        nombres: false,
        direccion: false,
        departamento: false,
        ciudad: false,
        telefono: false,
        correo: false,
        contacto: false,
        estado: false,
      },
    };
  },
  created() {
    this.cargarCiudades();
  },
  methods: {
    guardar() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.tipoid) {
        this.errores.tipoid = true;
        this.send_error("Debe seleccionar un tipo de identificación");
      } else if (!data.numero) {
        this.errores.numero = true;
        this.send_error("Debe ingresar un número de identificación");
      } else if (!data.dv && data.dv != 0) {
        this.errores.dv = true;
        this.send_error("Debe ingresar el Digito de Verificación");
      } else if (!data.rsocial) {
        this.errores.rsocial = true;
        this.send_error("Debe ingresar nombres y/o razón social");
      } else if (!data.direccion) {
        this.errores.direccion = true;
        this.send_error("Debe ingresar una dirección");
      } else if (!data.departamento) {
        this.errores.departamento = true;
        this.send_error("Debe seleccionar un departamento");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Debe seleccionar una ciudad");
      } else if (!data.telefono) {
        this.errores.telefono = true;
        this.send_error("Debe ingresar un teléfono");
      } else if (!data.correo) {
        this.errores.correo = true;
        this.send_error("Debe registrar un correo");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      let sessionStorage = "5c89783aed9ff7411f229c2a08400bce";
      var identificacion = data.numero;
      var digitoVerificacion = data.dv || "";
      var tipoId = data.tipoid;
      var rsocial = data.rsocial.trim();
      var direccion = data.direccion;
      var ciudad = data.ciudad;
      var telefono = data.telefono;
      var correo = data.correo.trim();
      let datos = {
        url: "Transporte/dlls/Cfpasajero.dll",
        data:
          sessionStorage +
          "|" +
          identificacion +
          "|" +
          digitoVerificacion +
          "|" +
          tipoId +
          "|" +
          rsocial +
          "|" +
          direccion.trim() +
          "|" +
          ciudad +
          "|" +
          telefono +
          "|" +
          correo.trim() +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.snackbar.color = "indigo";
          this.snackbar.text = "Pasajero guardado correctamente",
            this.snackbar.estado = true;
          this.ini_form();
        })

        .catch((error) => {
          this.send_error("Error al grabar pasajero");
        });
    },
    ini_form() {
      this.form.numero = null;
      this.form.dv = null;
      this.form.tipoid = null;
      this.form.rsocial = null;
      this.form.direccion = null;
      this.form.ciudad = null;
      this.form.telefono = null;
      this.form.correo = null;
    },
    get_municipios() {
      if (this.form.departamento == null) return undefined;
      var registro = [];
      this.ciudades_dian.filter((e) => {
        if (e.codigo == this.form.departamento) {
          e.municipios.forEach((k, v) => {
            registro.push({
              value: k.c_digo_dane_del_municipio,
              text: k.municipio,
            });
          });
          return registro;
        }
      });

      this.filterMunicipios = registro;
    },
    cargarCiudades() {
      post
        .postData({
          url: "Datos/BASE/CIUDADES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.ciudades_dian = data.departamentos;
          this.ciudades_dian.forEach((k, v) => {
            this.departamentos.push({
              value: k.codigo,
              text: k.departamento,
            });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },
    cargarpaises() {
      post
        .postData({
          url: "Datos/BASE/PAISES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.paises_dian = data.paises;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },
    calculardv() {
      var arreglo, x, y, documentoElementos, i, documento, dv1;
      documento = this.form.numero;
      if (!documento) {
        alert("Debe escribir el número de Identificación sin puntos.");
      } else {
        arreglo = [];
        x = 0;
        y = 0;
        documentoElementos = documento.length;
        arreglo[1] = 3;
        arreglo[2] = 7;
        arreglo[3] = 13;
        arreglo[4] = 17;
        arreglo[5] = 19;
        arreglo[6] = 23;
        arreglo[7] = 29;
        arreglo[8] = 37;
        arreglo[9] = 41;
        arreglo[10] = 43;
        arreglo[11] = 47;
        arreglo[12] = 53;
        arreglo[13] = 59;
        arreglo[14] = 67;
        arreglo[15] = 71;
        for (i = 0; i < documentoElementos; i++) {
          y = documento.substr(i, 1);
          x += y * arreglo[documentoElementos - i];
        }
        y = x % 11;
        if (y > 1) {
          dv1 = 11 - y;
        } else {
          dv1 = y;
        }
        var copia = JSON.parse(JSON.stringify(this.form));
        copia.dv = parseInt(dv1);
        this.form = null;
        this.form = JSON.parse(JSON.stringify(copia));
      }
    },
    send_error(msj) {
      this.snackbar.estado = true;
      this.snackbar.color = "red";
      this.snackbar.text = msj;
    },
  },
};
</script>


