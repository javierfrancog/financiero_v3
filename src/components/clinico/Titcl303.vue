<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4">mdi-book-lock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Agendamiento de pacientes</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-dialog v-model="dialog" persistent max-width="650px">
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="success"
                    class="ma-2 white--text"
                    v-on="on"
                    @click="opcionDialog('C', '')"
                  >
                    <v-icon size="20" left>mdi-basket</v-icon>Agregar
                  </v-btn>
                </template>
                <v-form lazy-validation v-model="valid" ref="form">
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ form.text }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="itemEdit.tabla.id"
                              label="Identificacion"
                              single-line
                              outlined
                              required
                              :rules="[
                                v => !!v || 'Identificacion obligatoria'
                              ]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="itemEdit.tabla.descripcion"
                              label="Descripcion"
                              single-line
                              outlined
                              required
                              :rules="[v => !!v || 'Descripcion obligatoria']"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="d-flex" cols="12" sm="12" md="12">
                            <v-select
                              :items="itemEdit.dias"
                              label="Dia"
                              :rules="[v => !!v || 'Dia obligatorio']"
                              v-model="itemEdit.tabla.dia"
                              outlined
                              required
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-data-table
                              :headers="itemEdit.header"
                              :items="itemEdit.tabla.horario"
                              hide-default-footer
                              item-key="nro"
                            >
                              <template v-slot:item.hraini="props">
                                <v-edit-dialog
                                  :return-value.sync="props.item.hraini"
                                >
                                  {{ props.item.hraini }}
                                  <template v-slot:input>
                                    <v-text-field
                                      v-model="props.item.hraini"
                                      label="Edit"
                                      single-line
                                      type="time"
                                    ></v-text-field>
                                  </template>
                                </v-edit-dialog>
                              </template>

                              <template v-slot:item.hrafin="props">
                                <v-edit-dialog
                                  :return-value.sync="props.item.hrafin"
                                >
                                  {{ props.item.hrafin }}
                                  <template v-slot:input>
                                    <v-text-field
                                      v-model="props.item.hrafin"
                                      label="Edit"
                                      single-line
                                      type="time"
                                    ></v-text-field>
                                  </template>
                                </v-edit-dialog>
                              </template>
                              <template v-slot:item.bloquear="props">
                                <v-switch
                                  :messages="
                                    props.item.bloquear ? 'Activo' : 'Desactivo'
                                  "
                                  v-model="props.item.bloquear"
                                ></v-switch>
                              </template>
                            </v-data-table>
                          </v-col>
                        </v-row>
                        <v-row justify="center">
                          <v-switch
                            v-model="form.eliminar"
                            label="Eliminar"
                          ></v-switch>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        class="ma-2"
                        color="red"
                        text
                        @click="dialog = false"
                        >Cancelar</v-btn
                      >
                      <v-btn class="ma-2" color="success" text @click="guardar"
                        >Guardar</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>
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
              :items="agendamiento"
              item-key="id"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
              class="elevation-1"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>Hora inicial</th>
                        <th>Hora final</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        :v-model="item"
                        v-for="(dia, index) in item.horario"
                        :key="index"
                      >
                        <td>{{ dia.nro }}</td>
                        <td>{{ dia.hraini }}</td>
                        <td>{{ dia.hrafin }}</td>
                        <td>{{ dia.bloquear ? "Activo" : "desactivo" }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="opcionDialog('U', item.id)"
                  >edit</v-icon
                >
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import post from "../../methods.js";

export default {
  data() {
    return {
      search: "",
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Id", align: "center", value: "id" },
        { text: "Descripcion", align: "center", value: "descripcion" },
        { text: "Dia", align: "center", value: "dia" },
        { text: "Opciones", value: "edit", align: "center" }
      ],
      agendamiento: [],
      itemEdit: {
        dias: [
          { text: "Lunes", value: 1 },
          { text: "Martes", value: 2 },
          { text: "Miercoles", value: 3 },
          { text: "Jueves", value: 4 },
          { text: "Viernes", value: 5 },
          { text: "Sabado", value: 6 },
          { text: "Domingo", value: 7 }
        ],
        tabla: [],
        header: [
          { text: "#", align: "center", value: "nro" },
          { text: "Hora inicial", align: "center", value: "hraini" },
          { text: "Hora final", align: "center", value: "hrafin" },
          { text: "Bloquear", align: "center", value: "bloquear" }
        ]
      },
      createAgendamiento: {
        id: "",
        descripcion: "",
        dia: "",
        horario: [
          { nro: "1", hraini: "00:00", hrafin: "00:00", bloquear: false },
          { nro: "2", hraini: "00:00", hrafin: "00:00", bloquear: false },
          { nro: "3", hraini: "00:00", hrafin: "00:00", bloquear: false },
          { nro: "4", hraini: "00:00", hrafin: "00:00", bloquear: false },
          { nro: "5", hraini: "00:00", hrafin: "00:00", bloquear: false },
          { nro: "6", hraini: "00:00", hrafin: "00:00", bloquear: false },
          { nro: "7", hraini: "00:00", hrafin: "00:00", bloquear: false },
          { nro: "8", hraini: "00:00", hrafin: "00:00", bloquear: false },
          { nro: "9", hraini: "00:00", hrafin: "00:00", bloquear: false },
          { nro: "10", hraini: "00:00", hrafin: "00:00", bloquear: false }
        ]
      },
      dialog: false,
      valid: false,
      singleExpand: true,
      expanded: [],
      nameRules: [
        v => !!v || "Campo obligatorio",
        v => (v && v.length <= 20) || "Maximo 20 digitos"
      ],
      form: []
    };
  },
  created() {
    this.cargarAgendamiento();
  },
  methods: {
    cargarAgendamiento() {
      post
        .postData({
          url: "Clinico/dlls/titcl303j.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          console.log(data);
          this.agendamiento = data;
        })
        .catch(err => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar agendamiento",
            estado: true
          });
        });
    },
    opcionDialog(opc, key) {
      this.crud = opc;
      if (opc == "C") {
        this.form.text = "Agregar agenda";
        this.itemEdit.tabla = JSON.parse(
          JSON.stringify(this.createAgendamiento)
        );
        this.dialog = true;
      } else if (opc == "U") {
        this.form.text = "Modificar agenda";
        let registro = this.agendamiento.filter(e => {
          return e.id.trim().toUpperCase() == key;
        });
        this.itemEdit.tabla = registro[0];
        this.dialog = true;
      } else {
        alert("Metodo no definido");
      }
    },
    guardar() {
      if (this.$refs.form.validate()) {
        let horario = "",
          eliminar = this.form.eliminar ? 1 : 0;

        this.itemEdit.tabla.horario.forEach((k, v) => {
          let ini = k.hraini.split(":").join(""),
            fin = k.hrafin.split(":").join(""),
            estado = k.bloquear ? 1 : 0;
          horario += ini + "|" + fin + "|" + estado + "|";
        });
        console.log(this.itemEdit.tabla);
        var datos = {
          url: "Clinico/dlls/titcl303.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.itemEdit.tabla.id +
            "|" +
            this.itemEdit.tabla.descripcion +
            "|" +
            this.itemEdit.tabla.dia +
            "|" +
            horario +
            eliminar +
            "|",
          method: ""
        };
        console.log(datos);
        post
          .postData(datos)
          .then(data => {
            this.dialog = false;
            this.$emit("snack", {
              color: "success",
              text: "Agenda mofificada",
              estado: true
            });
            this.cargarAgendamiento();
          })
          .catch(err => {
            this.$emit("snack", {
              color: "error",
              text: "Error al modificar agenda",
              estado: true
            });
          });
      }
    }
  }
};
</script>
