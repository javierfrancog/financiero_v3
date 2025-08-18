<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-file-download</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Generación de Rips</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-row>
            <v-col class="d-flex" cols="12" sm="5">
              <v-text-field
                label="Consecutivo"
                outlined
                hide-details
                v-model="consecutivo"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                @click="_cargarTablaFacturas"
              >
                Buscar
                <v-icon right dark>mdi-card-search-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="anios_select"
                label="Año de la factura"
                outlined
                clearable
                hide-details
                v-model="form.anoserv"
                item-text="text"
                item-value="value"
                required
                :error="errores.anoserv"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="1" sm="3">
              <v-text-field
                label="Prefijo"
                outlined
                hide-details
                v-model="form.prefijo"
                text-transform:uppercase
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="2" sm="3">
              <v-text-field
                label="Consecutivo"
                outlined
                hide-details
                v-model="form.nrofact"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-btn
                v-if="facturas.length != 0"
                color="success"
                class="ma-2 white--text"
                @click="agregarfact()"
              >
                Agregar Factura
                <v-icon dark>mdi-file-download-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider color="succes"></v-divider>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  v-if="facturas.length != 0"
                  color="orange"
                  class="ma-2 white--text"
                  @click="generarArchivos"
                >
                  Descargar Rips
                  <v-icon right dark>mdi-file-download-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col class="d-flex justify-end" cols="12" sm="3">
                <v-btn
                  v-if="facturas.length != 0"
                  color="red"
                  class="ma-2 white--text"
                  @click="eliminar_rips"
                >
                  Eliminar Rips
                  <v-icon right dark>mdi-file-download-outline</v-icon>
                </v-btn>
              </v-col>

            </v-row>
            <v-divider color="succes" v-if="facturas.length != 0"></v-divider>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="consecutivo !== null"
            >
              <v-col class="mb-4" cols="6" sm="6">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-data-table
              v-if="consecutivo != null"
              :loading="load_table"
              :headers="headers"
              :items="facturas"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.edit="{ item }">
                <v-btn
                  color="error"
                  class="ma-2 white--text"
                  @click="borrarRips('0', item.nro_factura)"
                  >Eliminar Factura</v-btn
                >
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      search: null,
      load_contrato: true,
      load_table: false,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      pickerActual: false,
      selectContrato: null,
      consecutivo: null,
      facturas: [],
      form: [],
      empresa: [],      
      errores: {
        anoserv: false,
      },

      headers: [
        { text: "Nro", align: "center", value: "nro" },
        { text: "Nro factura", align: "center", value: "nro_factura" },
        {
          text: "Fecha",
          align: "center",
          value: "fecha",
        },
        { text: "Opciones", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.cargar_años();
    this.cargar_empresa();    
  },
  watch: {},
  computed: {},

  methods: {
    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },    
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.anios_select = anios;
    },

    _cargarTablaFacturas() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/titcl104j.dll",
          data: sessionStorage.Sesion + "|" + this.consecutivo + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;

          let id = 1;
          data.map((elem) => {
            elem.nro = id++;
          });
          this.facturas = data;
          this.periodo_cargue = data[0].fecha.substr(0, 6);
        })
        .catch((err) => {
          this.loader = false;
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar facturas",
            estado: true,
          });
        });
    },
    eliminar_rips() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/titcl104x.dll",
          data: sessionStorage.Sesion + "|" + this.consecutivo + "|" + this.periodo_cargue + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this._cargarTablaFacturas();          
        })
        .catch((err) => {
          this.loader = false;
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al Eliminar Rips",
            estado: true,
          });
        });
    },    
    generarArchivos() {     
      let time = new Date()
      let hora = time.getMinutes() + time.getSeconds()      	
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.consecutivo +
        "|" +
        this.periodo_cargue +
        "|";
      post
        .postData({
          url: "Clinico/dlls/titcl104r.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          var formData = new FormData();
          var json = [
            sessionStorage.Sesion.substr(0, 15),
            "Rips" + this.consecutivo + "_" + this.periodo_cargue + "_" + hora + ".zip",
            this.empresa.codciudad_empr || 95001
          ];
          formData.append("archivos", JSON.stringify(data[0].archivos));
          formData.append("datos", JSON.stringify(json));
          fetch("https://server1ts.net//financiero/inc/ajaxFile.php", {
            method: "POST",
            body: formData,
          })
            .then((res) => res.text())
            .then((response) => {
              window.open(response, "_blank");
            })
            .catch((err) => {
              console.log(err);
              this.$emit("snack", {
                color: "error",
                text: "Ocurrio error al descargar archivo",
                estado: true,
              });
            });
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al modificar factura",
            estado: true,
          });
        });
    },
    borrarRips(estado, key) {
      console.log(this.facturas);

      let retornar = this.facturas.filter((e) => {
        if (e.nro_factura == key) {
          return e;
        }
      });
      retornar = retornar[0] || false;

      if (retornar) {
        let datos =
          sessionStorage.Sesion +
          "|" +
          this.consecutivo +
          "|01|" +
          retornar.prefijo +
          " |" +
          retornar.nro_factura +
          "|" +
          0 +
          "|";
        post
          .postData({
            url: "Clinico/dlls/titcl104a.dll",
            data: datos,
            method: "",
          })
          .then((data) => {
            this.$emit("snack", {
              color: "success",
              text: data[0],
              estado: true,
            });
            this._cargarTablaFacturas();
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: data[0],
              estado: true,
            });
          });
      }
    },
    agregarfact() {
      console.log();
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.consecutivo +
        "|01|" +
        this.form.prefijo +
        "|" +
        this.form.nrofact +
        "|" +
        this.form.anoserv +
        "|" +
        1 +
        "|";
      post
        .postData({
          url: "Clinico/dlls/titcl104a.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: data[0],
            estado: true,
          });
          this._cargarTablaFacturas();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0],
            estado: true,
          });
        });
    },
  },
};
</script>
