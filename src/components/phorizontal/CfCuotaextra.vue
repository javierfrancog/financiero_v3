<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4">mdi-cash-refund</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">
                Configuración Cuotas Extraordinarias
              </v-list-item-title>
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item"
              >
                Agregar
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters>
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
            >
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)"
                  >edit</v-icon
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

    <v-dialog v-model="dialogo.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-5">
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-select
                :items="tipo"
                label="Tipo"
                clearable
                return-object
                hide-details
                v-model="form.tipo"
                :error="errores.tipo"
                @change="errores.tipo = false"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-select
                :items="ubicacion"
                label="Ubicación"
                clearable
                return-object
                hide-details
                v-model="form.ubicacion"
                required
                :error="errores.ubicacion"
                @change="errores.ubicacion = false"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Id Ubicacion"
                clearable
                required
                filled
                v-model="form.idubicación"
                :error="errores.idubicación"
                @input="errores.idubicación = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Valor Cuota Extraordinaria"
                clearable
                outlined
                v-model="form.vlr_extra"
                :error="errores.vlr_extra"
                @input="errores.vlr_extra = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-menu
                v-model="pickerMes"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaini"
                    label="Periodo Inicial de Cobro"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                    autocomplete="off"
                    :error="errores.fechaini"
                    @change="errores.fechaini = false"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechaini"
                  scrollable
                  no-title
                  type="month"
                  @input="pickerMes = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-menu
                v-model="pickerMesfin"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechafin"
                    label="Periodo Final de Cobro"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                    autocomplete="off"
                    :error="errores.fechafin"
                    @change="errores.fechafin = false"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fechafin"
                  scrollable
                  no-title
                  type="month"
                  @input="pickerMesfin = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
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
              init_form();
            "
          >
            Cancelar
          </v-btn>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { FlowerSpinner } from "epic-spinners";
import post from "../../methods.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerMes: false,
      pickerMesfin: false,
      card_estado: false,

      dialogo: {
        estado: false,
        titulo: null,
      },
      moneyConfig: {
        decimal: ".",
        thousands: ",",
        precision: 0, // Número de decimales
        masked: false, // Si es true, el valor será una cadena formateada
      },

      search: "",
      contenido: [],
      form: {
        vlr_extra: null,
        fechaini: null,
        fechafin: null,
        tipo: null,
        ubicacion: null,
        idubicación: null,
        eliminar: false,
      },

      tipo: [
        { text: "Casa", value: 1 },
        { text: "Apartamento", value: 2 },
        { text: "Parqueadero", value: 3 },
      ],
      ubicacion: [
        { text: "Manzana", value: 1 },
        { text: "Torre", value: 2 },
        { text: "Bahía", value: 3 },
        { text: "Sótano", value: 4 },
      ],
      headers: [
        { text: "Tipo", align: "left", value: "desctipo_rep" },
        { text: "Detalle", align: "left", value: "descubica_rep" },
        { text: "Ubicación", align: "center", value: "idubicacion_rep" },
        { text: "Periodo Inicial", align: "center", value: "periodoini_rep" },
        { text: "Periodo Final", align: "center", value: "periodofin_rep" },
        { text: "Valor", align: "left", value: "vlrcuota_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        tipo: false,
        ubicacion: false,
        idubicación: false,
        vlr_extra: false,
        fechaini: false,
        fechafin: false,
      },
    };
  },
  created() {
    this.cargarcontenido();
  },

  methods: {
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Phorizontal/dlls/CfCExtraJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar Cuotas Extraoridnarias",
            estado: true,
          });
        });
    },
    editar_item(item) {
      this.init_form();
      this.dialogo.estado = true;
      this.dialogo.titulo = "Actualizar Registro";
      let busqueda = this.tipo.find((el) => el.value == item.tipo_rep);
      this.form.tipo = busqueda;

      busqueda = this.ubicacion.find((el) => el.value == item.ubicacion_rep);
      this.form.ubicacion = busqueda;

      this.form.idubicación = item.idubicacion_rep;
      this.form.vlr_extra = parseFloat(
        item.vlrcuota_rep.replace(/,/g, "").trim()
      );
      this.form.fechaini = item.periodoini_rep;
      this.form.fechafin = item.periodofin_rep;
    },
    guardar() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!this.form.tipo) {
        this.errores.tipo = true;
        this.send_error("Seleccione un tipo");
        hasError = true;
      } else if (!this.form.ubicacion) {
        this.errores.ubicacion = true;
        this.send_error("Seleccione una ubicación");
        hasError = true;
      } else if (!this.form.idubicación) {
        this.errores.idubicación = true;
        this.send_error("Ingrese un Id de Ubicación");
        hasError = true;
      } else if (!this.form.vlr_extra) {
        this.errores.vlr_extra = true;
        this.send_error("Ingrese un Valor");
        hasError = true;
      } else if (!this.form.fechaini) {
        this.errores.fechaini = true;
        this.send_error("Ingrese una fecha Inicial");
        hasError = true;
      } else if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.send_error("Ingrese una fecha Final");
        hasError = true;
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      let tipo = data.tipo.value;
      let ubicacion = data.ubicacion.value;
      let idubicacion = data.idubicación.trim();
      let vlr_extra = data.vlr_extra;
      let fechaini = data.fechaini.split("-").join("");
      let fechafin = data.fechafin.split("-").join("");
      let eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Phorizontal/dlls/CfCExtra.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          tipo +
          "|" +
          ubicacion +
          "|" +
          idubicacion +
          "|" +
          vlr_extra +
          "|" +
          fechaini +
          "|" +
          fechafin +
          "|" +
          eliminar +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.dialogo.estado = false;
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    agregar_item() {
      this.form = {
        vlr_extra: 0,
        fechaini: null,
        fechafin: null,
        tipo: null,
        ubicacion: null,
        idubicación: null,
      };
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
    },
    init_form() {
      this.form = {
        vlr_extra: null,
        fechaini: null,
        fechafin: null,
        tipo: null,
        ubicacion: null,
        idubicación: null,
      };
      this.errores = {
        tipo: false,
        ubicacion: false,
        idubicación: false,
        vlr_extra: false,
        fechaini: false,
        fechafin: false,
      };
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
