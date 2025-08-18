<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="loaderCard"
        :disabled="loaderCard"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-reactivate-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2"
                >Cargue Pacientes Base de Datos Eps (Separador: Punto y coma ;)
                ms</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="4">
                <v-select
                  :items="[
                    { text: '1.Capital Salud', value: 1 },
                    { text: '2.Salud Total', value: 2 },
                    { text: '3.Famisanar', value: 3 },
                    { text: '4.Multisalud', value: 4 },
                    { text: '5.Cajacopi', value: 5 },
                    // { text: 'Magisterio Guaviare', value: 9 },
                  ]"
                  label="Origen"
                  outlined
                  hide-details
                  @change="select_origen()"
                  v-model="form.origen"
                ></v-select>
              </v-col>

              <v-col cols="6">
                <v-select
                  :items="contratos"
                  label="Contrato"
                  outlined
                  :item-text="format_contrato"
                  hide-details
                  return-object
                  v-model="form.nrocontrato"
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="4">
                <v-select
                  :items="[
                    { text: 'Contributivo', value: 8 },
                    { text: 'Subsidiado', value: 1 },
                    { text: 'Particular', value: 2 },
                    { text: 'Especial', value: 7 },
                    
                    { text: 'Otro', value: 8 },
                    // { text: 'Todos', value: 9 },
                  ]"
                  label="Regimen"
                  outlined
                  clearable
                  hide-details
                  return-object
                  v-model="form.regimen"
                  item-text="text"
                  item-value="value"
                  required
                  :rules="[(v) => !!v || 'Campo es obligatorio']"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="4">
                <v-select
                  :items="[
                    { text: 'Capitado', value: 1 },
                    { text: 'Evento', value: 2 },
                  ]"
                  label="Tipo Contrato"
                  outlined
                  clearable
                  hide-details
                  return-object
                  v-model="form.contrato"
                  item-text="text"
                  item-value="value"
                  required
                  :rules="[(v) => !!v || 'Campo es obligatorio']"
                ></v-select>
              </v-col>

              <v-col class="d-flex" cols="4">
                <v-select
                  :items="[
                    { text: 'Todos los Municipios', value: 1 },
                    { text: 'Seleccionar Municipio', value: 2 },
                  ]"
                  label="Tipo Municipio"
                  outlined
                  clearable
                  hide-details
                  return-object
                  v-model="form.tipomunic"
                  item-text="text"
                  item-value="value"
                  required
                  :error="errores.tipomunic"
                  @input="errores.tipomunic = false"
                ></v-select>
              </v-col>

              <v-col
                class="d-flex"
                cols="3"
                v-if="form.tipomunic ? form.tipomunic.value == 2 : false"
              >
                <v-autocomplete
                  label="Departamento"
                  v-model="form.departamento"
                  :items="departamentos"
                  clearable
                  item-value="value"
                  outlined
                  :error="errores.departamento"
                  @input="errores.departamento = false"
                ></v-autocomplete>
              </v-col>
              <v-col
                class="d-flex"
                cols="12"
                sm="3"
                v-if="form.tipomunic ? form.tipomunic.value == 2 : false"
              >
                <v-autocomplete
                  label="Ciudad"
                  v-model="form.ciudad"
                  :items="filterMunicipios"
                  clearable
                  item-value="value"
                  outlined
                  :error="errores.ciudad"
                  @input="errores.ciudad = false"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="5" v-if="form.origen">
                <v-file-input
                  label="Buscar archivo"
                  outlined
                  chips
                  counter
                  color="blue darken-1"
                  hide-details
                  accept=".csv"
                  v-model="adjunto"
                  id="archivo_adjunto"
                ></v-file-input>
              </v-col>

              <v-col class="d-flex align-center">
                <v-btn
                  color="indigo white--text"
                  class
                  @click="subir_archivo()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Procesar
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  FlowerSpinner,

  components: {
    FlowerSpinner,
  },

  data() {
    return {
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,

      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      errores: {
        codigo: false,
        estado: false,
        ccosto: false,
        tipomunic: false,
        ciudad: false,
        departamento: false,
      },

      card_estado: false,
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      agencias: [],
      expanded: [],
      contenido: [],
      ciudades_dian: [],
      departamentos: [],
      contratos: [],

      data: [],
      search: "",
      form: null,
      drawer: false,
      detalle: [],
      adjunto: null,
      loaderCard: false,

      headers: [
        { text: "Descripcion", align: "left", value: "error_rep" },
        { text: "Base", align: "left", value: "base_rep" },
        { text: "Apellido1", align: "left", value: "Apellido1_rep" },
        { text: "Nombre", align: "left", value: "nombres_rep" },
      ],
    };
  },
  created() {
    this.form = {
      fecha: this.$moment().format("YYYY-MM"),
    };
    this.get_ciudad();
  },
  computed: {
    filterMunicipios() {
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
      return registro;
    },
  },
  methods: {
    get_ciudad() {
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
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },
    select_origen() {
      let origen = this.form.origen;
      let idcontrato = 0;
      this.contratos = [];
      if (origen === 1) {
        idcontrato = 900298372;
      }
      if (origen === 2) {
        idcontrato = 800130907;
      }

      if (origen === 3) {
        idcontrato = 830003564;
      }
      if (origen === 4) {
        idcontrato = 830511298;
      }

      if (origen === 5) {
        idcontrato = 890102044;
      }

      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/PrEnccontratoJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|" + "" + "|" + idcontrato + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.contratos = JSON.parse(JSON.stringify(data));
          this.loader = false;
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Contratos",
            estado: true,
          });
        });
    },
    subir_archivo() {
      console.log(this.form);
      if (!this.form.tipomunic) {
        this.errores.tipomunic = true;
        this.send_error("Debe Seleccionar Tipo de Municipio");
      } else if (this.form.tipomunic.value == 2 && !this.form.departamento) {
        this.errores.ciudad = true;
        this.send_error("Debe Seleccionar Departamento/Municipio");
      } else {
        this.contenido = [];
        var _this = this;
        var adjunto = this.adjunto;
        if (adjunto) {
          _this.loaderCard = true;
          var sesion = sessionStorage.Sesion.substr(0, 15);
          let origen = this.form.origen;
          let nombre_adjunto = "";
          let cod_eps = null;
          if (origen === 1) {
            nombre_adjunto = "capitalsalud";
            cod_eps = "EPSS34";
          }
          if (origen === 2) {
            nombre_adjunto = "saludtotal";
            cod_eps = "EPS002";
          }
          if (origen === 3) {
            nombre_adjunto = "famisanar";
            cod_eps = "EPS017";
          }
          if (origen === 4) {
            nombre_adjunto = "multisalud";
            cod_eps = "MULTI1";
          }
          if (origen === 5) {
            nombre_adjunto = "cajacopi";
            cod_eps = "CCF055";
          }
          // if (origen === 6) {nombre_adjunto = "multisalud"
          //   cod_eps = "CCF055"
          // };
          // if (origen === 9) nombre_adjunto = "MAGISTERIO";
          var archivo = new FormData();
          nombre_adjunto = "CARGUE24C";
          archivo.append("archivo", adjunto);
          archivo.append("nombre", nombre_adjunto);
          // this.procesar_plano(nombre_adjunto);

          fetch(
            "https://server1ts.net//financiero/services/adjunto.impInv.php",
            {
              method: "POST",
              body: archivo,
            }
          )
            .then((res) => res.json())
            .catch((err) => {
              _this.loaderCard = false;
              console.log("-> Error", err);
            })
            .then((res) => {
              console.log("Res", res);
              if (res.code == 0) {
                _this.procesar_plano(nombre_adjunto, cod_eps);
              }
            });
        }
      }
    },
    validar: function () {
      let fecha = this.form.fecha.replace(/\-/g, "");
      var nom_plano = `D:\\TITAN\\Log\\${fecha}.txt`;
      var formData = new FormData();
      formData.append("ruta", nom_plano.trim());

      fetch("https://server1ts.net//financiero/inc/get.plano.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((result) => {
          var csvContent = result;
          var blob = new Blob([csvContent], {
            type: "text/txt;charset=utf-8;",
          });
          var url = URL.createObjectURL(blob);
          var pom = document.createElement("a");
          pom.href = url;
          pom.setAttribute("download", fecha + ".txt");
          pom.click();
        });
    },

    procesar_plano(nombre_adjunto, cod_eps) {
      let origen = this.form.origen;
      let contrato = this.form.contrato.value;
      let nro_contrato = this.form.nrocontrato.nro_rep;
      let regimen = this.form.regimen.value;
      let ciudad = 99999;
      if (this.form.tipomunic.value == 2) {
        ciudad = this.form.ciudad;
      }
      let dll = "0";

      if (regimen === 8) {
        dll = "Clinico/dlls/PrCargue24C.dll";
      } else {
        dll = "Clinico/dlls/PrCargue24C.dll";
      }

      // if (origen === 1) {
      //   if (regimen === 8) {
      //     dll = "Clinico/dlls/PrCargue1C.dll";
      //   } else {
      //     dll = "Clinico/dlls/PrCargue1S.dll";
      //   }
      // } else if (origen === 2) {
      //   dll = "Clinico/dlls/PrCargue2C.dll";
      // } else if (origen === 3) {
      //   if (regimen === 8) {
      //     dll = "Clinico/dlls/PrCargue3C.dll";
      //   } else {
      //     dll = "Clinico/dlls/PrCargue3S.dll";
      //   }
      // } else if (origen === 4) {
      //   if (regimen === 8) {
      //     dll = "Clinico/dlls/PrCargue2C.dll";
      //   } else {
      //     dll = "Clinico/dlls/PrCargue2S.dll";
      //   }
      // } else if (origen === 5) {
      //   if (regimen === 8) {
      //     dll = "Clinico/dlls/PrCargue5C.dll";
      //   } else {
      //     dll = "Clinico/dlls/PrCargue5S.dll";
      //   }
      // } else if (origen === 6) {
      //   if (regimen === 8) {
      //     dll = "Clinico/dlls/PrCargue6C.dll";
      //   } else {
      //     dll = "Clinico/dlls/PrCargue6S.dll";
      //   }
      // } else if (origen === 9) {
      //   dll = "Clinico/dlls/PrCargue9.dll";
      // }
      post
        .postData({
          url: dll,
          data:
            sessionStorage.Sesion +
            "|" +
            nombre_adjunto +
            "|" +
            contrato +
            "|" +
            regimen +
            "|" +
            ciudad +
            "|" +
            cod_eps +
            "|" +
            nro_contrato +
            "|",
          method: "",
        })
        .then((data) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "success",
            text: data[0] + " pacientes cargados correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.loaderCard = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al procesar Archivo",
            estado: true,
          });
        });
    },


    format_contrato(val) {
      return val.descripcion_rep + " - " + val.detalle_rep;
    },
    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
