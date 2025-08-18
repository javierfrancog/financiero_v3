<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-box-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Estudiantes</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="success"
                class="ma-2 white--text"
                large
                depressed
                @click="agregar_item()"
              >
                Agregar
                <v-icon right dark class="ml-4"
                  >mdi-map-marker-plus-outline</v-icon
                >
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
              class="elevation-1"
            >
              <template v-slot:item.estadoestud_rep="{ item }">{{
                item.estadoestud_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

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
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Basico</v-tab>
            <v-tab>Cargos</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Año"
                      clearable
                      outlined
                      required
                      v-model="form.año"
                      :error="errores.año"
                      @input="errores.año = false"
                      autocomplete = off
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>                  
                <v-row>
                  <v-col class="d-flex" cols="12" sm="8">
                    <v-autocomplete
                      label="Estudiante"
                      v-model="form.estudiante"
                      :items="ruts3"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                      @change="errores.estudiante = false"
                      :error="errores.estudiante"
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="4">
                    <v-autocomplete
                      label="Grado"
                      v-model="form.grado"
                      :items="grado"
                      :item-text="format_grado"
                      item-value="llavegrado_rep"
                      hide-details
                      return-object
                      outlined
                      @change="errores.grado = false"
                      :error="errores.grado"
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaIng"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_ing"
                          label="Fecha Ingreso"
                          append-icon="event"
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_ing"
                        @input="pickerFechaIng = false"
                        autocmplete = off
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaRet"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_ret"
                          label="Fecha Retiro"
                          append-icon="event"
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_ret"
                        @input="pickerFechaRet = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col class="d-flex" cols="6" sm="6">
                    <v-autocomplete
                      label="Acudiente"
                      v-model="form.acudiente"
                      :items="ruts3"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      outlined
                      return-object
                      @change="errores.agencia = false"
                      :error="errores.agencia"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>


            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex">
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Cargos"
                      v-model="form.bases"
                      :items="tablaBases"
                      :item-text="format_bases"
                      hide-details
                      return-object
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex justify-center align-center" cols="2">
                    <v-btn
                      color="blue"
                      fab
                      small
                      depressed
                      class="white--text"
                      @click="add_devengo()"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="5">
                    <v-card>
                      <v-card-text>
                        <v-simple-table
                          height="350"
                          class="elevation-0"
                          fixed-header
                        >
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left" colspan="2">
                                  Descripcion
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="item in form.listado_cargos"
                                :key="item.llavebase_rep"
                              >
                                <td>{{ item.descrbase_rep }}</td>

                                <td class="d-flex align-center justify-end">
                                  <v-btn
                                    icon
                                    color="blue"
                                    small
                                    @click="editar_devengo(item)"
                                  >
                                    <v-icon
                                      >mdi-file-document-edit-outline</v-icon
                                    >
                                  </v-btn>
                                </td>
                                <td class="d-flex align-center justify-end">
                                  <v-btn
                                    icon
                                    color="red"
                                    small
                                    @click="delete_devengo(item)"
                                  >
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>



          </v-tabs-items>

          <v-divider color="succes"></v-divider>

          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.estado" label="Bloquear"></v-switch>
            </v-col>

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
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar()"
            >Guardar</v-btn
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
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      error: {
        rut: false,
      },

      dialog: true,
      valid: false,
      pickerFechaRet: false,
      pickerFechaIng: false,
      singleExpand: true,
      expanded: [],
      ruts3: [],
      ruts4: [],
      rutsadmon: [],
      contenido: [],
      grado: [],
      tablaccosto: [],
      tablaPuc: [],
      tablaBases: [],
      agencias: [],

      search: "",
      form: {
        listado_cargos: [],
      },
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Id", align: "left", value: "idestud_rep" },
        {
          text: "Primer Apellido",
          align: "left",
          value: "Apellido1estud_rep",
        },
        {
          text: "Segundo Apellido",
          align: "left",
          value: "Apellido2estud_rep",
        },
        { text: "Nombres", align: "left", value: "nombresestud_rep" },

        { text: "Estado", align: "center", value: "estadoestud_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        ccosto: false,
        estudiante: false,
        grado: false,
        descripcion: false,
        estado: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      tab: 0,
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },

      money: {
        decimal: ".",
        thousands: ",",
        precision: 3,
        masked: false,
      },
    };
  },
  created() {
    this.cargarcontenido();
    this.get_grados();
    this.get_ruts();
    this.get_basico();
  },
  computed: {},
  methods: {
    delete_devengo(item) {
      let index = this.form.listado_cargos.indexOf(item);
      this.form.listado_cargos.splice(index, 1);
    },
    add_devengo() {
      var item = this.form.bases;
      if (item) {
        let buscar = this.form.listado_cargos.find(
          (el) => el.llavebase_rep == item.llavebase_rep
        );

        if (!buscar) {
          this.form.listado_cargos.push(item);
          this.form.bases = null;
        } else {
          this.send_error("El item ya fue registrado");
        }
      } else {
        this.send_error("Debes seleccionar un item");
      }
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.año = item.anoestud_rep;

      var busqueda_estudiante = this.ruts3.find(
        (el) => el.identificacion_rut == item.idestud_rep
      );
      this.form.estudiante = busqueda_estudiante;

      var busqueda_acudiente = this.ruts3.find(
        (el) => el.identificacion_rut == item.idacud_rep
      );
      this.form.acudiente = busqueda_acudiente;

      var busqueda_grado = this.grado.find(
        (el) => el.llavegrado_rep == item.gradoestud_rep
      );
      this.form.grado = busqueda_grado;

      var fechaing_format = this.$moment(item.fechaingestud_rep).format(
        "YYYY-MM-DD"
      );
      var fecharet_format = this.$moment(item.fecharetestud_rep).format(
        "YYYY-MM-DD"
      );
      this.form.fecha_ing = fechaing_format;
      this.form.fecha_ret = fecharet_format;

      this.form.estado = item.estadogrado_rep == "1" ? true : false;

      var devengos = item.basesestud_rep;
      devengos.forEach((el) => {
        let busqueda = this.tablaBases.find(
          (base) => base.llavebase_rep == el.codigo_rep
        );
        if (busqueda) {
          this.form.listado_cargos.push(busqueda);
        }
      });
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      // console.log(data);
      this.format_envio(data);
    },
    get_plano(data) {
      var _this = this;
      return new Promise((resolve, reject) => {
        var detalle = data.listado_cargos;
        var estudiante = data.estudiante ? data.estudiante : "0";
        var nuevo = [];

        detalle.forEach((el) => {
          nuevo.push({
            estudiante: estudiante.identificacion_rut,
            llavebase_rep: el.llavebase_rep,
          });
        });

        // console.log(nuevo);

        var formData = new FormData();
        formData.append("tipo", "colCargos");
        formData.append("data", JSON.stringify(nuevo));
        fetch("https://server1ts.net//financiero/inc/planos.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.code == "0") resolve(result.mensaje);
            else reject(result.mensaje);
          })
          .catch((error) => reject(error));
      });
    },
    format_envio(data) {
      this.card_estado = true;
      var ano = data.año;
      var estudiante = data.estudiante ? data.estudiante.identificacion_rut : "0";
      var grado = data.grado.llavegrado_rep || "0";
      var fechaing = data.fecha_ing ? data.fecha_ing.replace(/\-/g, "") : "";
      var fecharet = data.fecha_ret
        ? data.fecha_ret.indexOf("Invalid date") == 0
          ? "0"
          : data.fecha_ret.replace(/\-/g, "")
        : "0";
      var acudiente = data.acudiente ? data.acudiente.identificacion_rut : "0";
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      this.get_plano(data).then((plano) => {
        // console.log("PLano", plano);
        let datos = {
          url: "Colegios/dlls/Cfestudiante.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            ano +
            "|" +
            estudiante +
            "|" +
            grado +
            "|" +
            fechaing +
            "|" +
            fecharet +
            "|" +
            acudiente +
            "|" +
            estado +
            "|" +
            eliminar +
            "|" +
            plano +
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
            this.init_form();
            this.cargarcontenido();
          })
          .catch((error) => {
            this.card_estado = false;
            this.send_error("Error al grabar Registro");
          });
      });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        eliminar: false,
        listado_cargos: [],
      };

      if (this.$refs.input_basico)
        this.$refs.input_basico.$el.getElementsByTagName("input")[0].value =
          "0";

      if (this.$refs.input_arl)
        this.$refs.input_arl.$el.getElementsByTagName("input")[0].value = "0";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Colegios/dlls/CfEstudianteJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Estudiantes",
            estado: true,
          });
        });
    },
    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },

    format_grado: function (val) {
      return `${val.llavegrado_rep + " - " + val.descrgrado_rep} `;
    },
    
    format_bases: function (val) {
      return `${val.llavebase_rep} - ${val.descrbase_rep}`;
    },

    get_ruts() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 5 + "|",
          method: "",
        })
        .then((data) => {
          this.ruts3 = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Estudiantes",
            estado: true,
          });
        });
    },

    get_grados() {
      this.loader = true;
      post
        .postData({
          url: "Colegios/dlls/CfGradosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.grado = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Grados",
            estado: true,
          });
        });
    },

    get_basico: function () {
      post
        .postData({
          url: "Colegios/dlls/CfBasecolJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaBases = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Bases");
        });
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
