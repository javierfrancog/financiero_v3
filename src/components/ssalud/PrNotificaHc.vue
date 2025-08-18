<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1400"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-volume-high</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Notificación a Pacientes en consultorio</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  v-model="pickeFechaIni"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fecha_ini"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_ini"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  v-model="pickerFechaFinal"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fecha_final"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="cargarcontenido()"
                  depressed
                  large
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  color="success"
                  class="mt-1 white--text"
                  large
                  depressed
                  @click="agregar_item()"
                >
                  Nueva Notificación
                  <v-icon right dark class="mt-1 ma-2 white--text"
                    >mdi-plus-box</v-icon
                  >
                </v-btn>
              </v-col>
            </v-row>
            <v-divider color="succes"></v-divider>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="contenido.length != 0"
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
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :search="search"
              class="elevation-1"
              v-if="contenido.length != 0"
            >
              <template v-slot:item.nro_rep="{ item }">
                {{ parseFloat(item.nro_rep) }}
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>

    <v-dialog v-model="dialogo.estado" persistent max-width="1200px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Notificación a Pacientes</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="3" class="justify-end d-flex align-center">
              <v-text-field
                label="Consecutivo"
                outlined
                v-model="form.consecutivo"
                disabled
                hide-details
                filled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Id_Paciente"
                outlined
                hide-details
                v-model="form.id_paciente"
                @keyup.enter="buscar_paciente()"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-start align-center" cols="1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="buscar_paciente()"
                    color="indigo accent-3"
                    fab
                    small
                    icon
                    outlined
                    v-on="on"
                    class="mr-10"
                  >
                    <v-icon>mdi-account-search-outline</v-icon>
                  </v-btn>
                </template>
                <span>Buscar Paciente</span>
              </v-tooltip>
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Descripcion Paciente"
                outlined
                disabled
                v-model="form.descripaciente"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-0" v-if="form.descripaciente">
            <v-col class="d-flex" cols="10" >
              <v-autocomplete
                outlined
                label="Médico"
                :items="medicos"
                :item-text="format_medico"
                item-value="nro"
                hide-details
                v-model="form.medico"
                return-object
                clearable
                :error="errores.medico"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="11" v-if="form.descripaciente">
              <v-textarea
                outlined
                clearable
                label="Observaciones"
                v-model="form.observaciones"
                hide-details
                :error="errores.observaciones"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo.estado = false;
              init_formulario();
            "
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 white--text"
            color="indigo"
            depressed
            large
            @click="guardar_notifica()"
            >Enviar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      card_estado: false,
      search: null,
      load_table: false,
      pickeFechaIni: false,
      pickerFechaFinal: false,
      contenido: [],
      medicos: [],

      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      headers: [
        // { text: "Numero", align: "left", value: "nro_rep" },
        { text: "Fecha", align: "center", value: "fechagenera_rep",width: '120px' },
        { text: "Paciente", align: "left", value: "paciente_rep" },
        { text: "Estado", align: "left", value: "estado_rep" },
        { text: "Fecha Lee", align: "left", value: "fechalee_rep", width: '120px' },
        { text: "Detalle", align: "left", value: "detalle_rep" },

      ],
      empresa: [],
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      form: {
        descripaciente: null,
        consecutivo: 0,
        fecha_final: this.$moment().format("YYYY-MM-DD"),
        fecha_ini: this.$moment().format("YYYY-MM-DD"),
      },
      errores: {
        observaciones: false,
        medico: false,
      },
    };
  },
  created() {
    this.get_profesionales();
  },
  watch: {
    fecha_final() {
      this._validarFechas();
    },
  },
  methods: {
    guardar_notifica() {
      console.log("Guardando Notificacion", this.form );
      if (!this.form.observaciones) {
        this.errores.observaciones = true;
        this.send_error("Debe indicar alguna observacion!!");
      } else       if (!this.form.medico) {
        this.errores.medico = true;
        this.send_error("Debe seleccionar un medico!!");
      } else {
        let plano = {};
        let cantidad_lineas = 0;
        let num = 0;
        let name = "";
        let end = 0;

        let paciente = this.form.id_paciente.trim();
        let medico = parseFloat(this.form.medico.id);
        let consec = this.form.consecutivo;
        let observacion = this.form.observaciones.trim();
        observacion = window.btoa(unescape(encodeURIComponent(observacion)));

        cantidad_lineas = Math.ceil(observacion.length / 900);

        for (let index = 0; index < cantidad_lineas; index++) {
          num = parseFloat(index + 1);
          name = `DATOJ_${String(num).padStart(3, "0")}`;
          end = parseFloat(parseFloat(index + 1) * 900);
          plano[name] = `${num}|${observacion.substring(end - 900, end)}`;
        }
        let datosEnvio =
          sessionStorage.Sesion +
          "|" +
          "02" +
          "|" +
          consec +
          "|" +
          paciente +
          "|" +
          medico +
          "|";
        let data = {
          url: "clinico/dlls/PrNotificaP.dll",
          data: { importarhtml: datosEnvio, ...plano },
          method: "",
          json: true,
        };

        post.postData(data).then((response) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });
          this.dialogo.estado = false;
          this.cargarcontenido(true);
          this.init_formulario()
        });
      }
    },
    async get_profesionales() {
      this.loader = true;
      let dll = "Clinico/dlls/CfAsistecJ.dll";
      try {
        const data = await post.postData({
          url: dll,
          data: sessionStorage.Sesion + "|" + 0 + "|",
          method: "",
        });
        this.medicos = JSON.parse(JSON.stringify(data));
        this.loader = false;
      } catch (err) {
        this.loader = false;
        this.$emit("snack", {
          color: "error",
          text: "Error al cargar Personal Asistencial",
          estado: true,
        });
      }
    },
    agregar_item() {
      this.form.observaciones = "";
      this.dialogo.estado = true;
      this.get_consec();
    },
    buscar_paciente() {
      let paciente = this.form.id_paciente.trim();
      post
        .postData({
          url: "clinico/dlls/PrCl101J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "POST",
        })
        .then((data) => {
          this.form.descripaciente = data[0].descrip_rep.trim();
        })
        .catch((err) => {
          console.log(err);
          this.card_estado = false;
          this.$emit("snack", {
            color: "warning",
            text: err.Mensaje[0].msg,
            estado: true,
          });
        });
    },
    get_consec() {
      post
        .postData({
          url: "Clinico/dlls/PrNotificaN.dll",
          data: sessionStorage.Sesion + "|",
          method: "POST",
        })
        .then((data) => {
          this.form.consecutivo = data[0].msg;
        })
        .catch((err) => {
          console.error("Error: ", err);
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo: " + err.Mensaje[0].Error,
            estado: true,
          });
        });
    },
    format_medico(val) {
      return (
        parseFloat(val.id) + " - " + val.descripcion + " - " + val.descr_tipo
      );
    },
    _validarFechas() {
      let fecha_ini = this.form.fecha_ini.split("-").join(""),
        fecha_final = this.form.fecha_final.split("-").join(""),
        retornar = true;
      if (parseFloat(fecha_final) < parseFloat(fecha_ini)) {
        this.$emit("snack", {
          color: "error",
          text: "La fecha final no puede ser menor a la fecha inicial",
          estado: true,
        });
        retornar = false;
      }
      return retornar;
    },
    cargarcontenido() {
      this.contenido = [];
      if (this.form.fecha_ini) {
        this.loader = true;
        let fecha_ini = this.form.fecha_ini.replace(/\-/g, "");
        let fecha_final = this.form.fecha_final.replace(/\-/g, "");
        post
          .postData({
            url: "/Clinico/dlls/PrNotificaJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              "2" +
              "|" +
              fecha_ini +
              "|" +
              fecha_final +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            data.pop();
            // this.contenido = JSON.parse(JSON.stringify(data));
            data.forEach((el) => {
              let copia = JSON.parse(JSON.stringify(el));
              let base64String =
                copia.base1_rep.trim() +
                copia.base2_rep.trim() +
                copia.base3_rep.trim() +
                copia.base3_rep.trim() +
                copia.base4_rep.trim() +
                copia.base5_rep.trim() +
                copia.base6_rep.trim() +
                copia.base7_rep.trim() +
                copia.base8_rep.trim() +
                copia.base9_rep.trim() +
                copia.base10_rep.trim() +
                copia.base11_rep.trim() +
                copia.base12_rep.trim() +
                copia.base13_rep.trim() +
                copia.base14_rep.trim() +
                copia.base15_rep.trim() +
                copia.base16_rep.trim() +
                copia.base17_rep.trim() +
                copia.base18_rep.trim() +
                copia.base19_rep.trim() +
                copia.base20_rep.trim() +
                copia.base21_rep.trim() +
                copia.base22_rep.trim() +
                copia.base23_rep.trim() +
                copia.base24_rep.trim() +
                copia.base25_rep.trim() +
                copia.base26_rep.trim() +
                copia.base27_rep.trim() +
                copia.base28_rep.trim() +
                copia.base29_rep.trim() +
                copia.base30_rep.trim() +
                copia.base31_rep.trim() +
                copia.base32_rep.trim() +
                copia.base33_rep.trim() +
                copia.base34_rep.trim() +
                copia.base35_rep.trim() +
                copia.base36_rep.trim() +
                copia.base37_rep.trim() +
                copia.base38_rep.trim() +
                copia.base39_rep.trim() +
                copia.base40_rep.trim() +
                copia.base41_rep.trim() +
                copia.base42_rep.trim() +
                copia.base43_rep.trim();
              const decodedText = Buffer.from(base64String, "base64").toString(
                "utf8"
              );
              copia.detalle_rep = decodedText;

              this.contenido.push(copia);
            });
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Notificaciones",
              estado: true,
            });
          });
      } else {
        this.send_error("Debe seleccionar una fecha");
      }
    },
    init_formulario() {
      this.form.observaciones = null;
      this.form.descripaciente = null;
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
<style lang="sass">
.v-data-table__wrapper td
  line-height: 2!important
</style>