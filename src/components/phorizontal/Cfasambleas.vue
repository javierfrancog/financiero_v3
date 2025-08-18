<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card_estado"
        :disabled="card_estado"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4">mdi-bank-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pl-3">
              <v-list-item-title class="headline"
                >Configuración asambleas</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="green darken-2"
                class="ma-2 white--text"
                large
                depressed
                @click="dialogo.estado = true"
              >
                Agregar
                <v-icon right dark>mdi-bank-outline</v-icon>
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
              :headers="tabla.headers"
              :items="tabla.data"
              item-key="identificacion"
              :single-expand="false"
              :expanded.sync="expanded"
              :search="search"
            >
              <!-- <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>-->
              <template v-slot:item.fecha="{ item }">
                <b>{{ item.fecha }} {{ item.hora }}</b>
              </template>
              <template v-slot:item.tipo_asamblea="{ item }">
                <v-chip
                  label
                  small
                  :color="
                    (item.tipo_asamblea == 1 ? 'light-blue' : 'orange') +
                    '  darken-2'
                  "
                  class="white--text overline"
                  >{{
                    item.tipo_asamblea == 1 ? "Ordinaria" : "Extraordinaria"
                  }}</v-chip
                >
              </template>
              <template v-slot:item.estado="{ item }">
                <v-chip
                  label
                  small
                  :color="validar_estado(item.estado).color"
                  class="white--text overline"
                  >{{ validar_estado(item.estado).text }}</v-chip
                >
              </template>
              <template v-slot:item.edit="{ item }">
                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      v-on="on"
                      color="red darken-2"
                      depressed
                      :disabled="item.estado == 1"
                    >
                      <v-icon @click="anular(item)">mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Anular asamblea</span>
                </v-tooltip>-->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-switch
                      v-model="item.activar"
                      v-on="on"
                      color="green darken-2"
                      class="mx-auto"
                      @change="cambiar_estado(item)"
                      label
                      inset
                    ></v-switch>
                  </template>
                  <span>Cambiar estado</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="600px">
      <v-card class="px-6" :loading="load.dialogo" :disabled="load.dialogo">
        <v-card-title>
          <span class="title col-12">Nueva asamblea</span>
        </v-card-title>
        <v-card-text class="px-0 pb-0">
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Descripción"
                clearable
                outlined
                required
                v-model="formulario.descripcion"
                :error="errores.descripcion"
                @input="errores.descripcion = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                :items="[
                  { text: 'Ordinaria', value: 1 },
                  { text: 'Extraordinaria', value: 2 },
                ]"
                label="Tipo Asamblea"
                outlined
                hide-details
                clearable
                v-model="formulario.tipo_asamblea"
                :error="errores.tipo_asamblea"
                @change="errores.tipo_asamblea = false"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="6">
              <v-menu
                ref="menu"
                v-model="dialogPicker"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Fecha Asamblea"
                    outlined
                    hide-details
                    v-model="formulario.fecha"
                    :error="errores.fecha"
                    @input="errores.fecha = false"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formulario.fecha"
                  @input="dialogPicker = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Hora:"
                type="time"
                clearable
                outlined
                v-model="formulario.hora"
                :error="errores.hora"
                @input="errores.hora = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-textarea
                label="Observaciones"
                clearable
                outlined
                rows="2"
                hide-details
                v-model="formulario.observaciones"
                :error="errores.observaciones"
                @input="errores.observaciones = false"
              ></v-textarea>
            </v-col>
          </v-row>

          <!-- <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.estado" label="Bloquear"></v-switch>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
          </v-row>-->
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
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="crear_asamblea()"
          >
            <v-icon left>mdi-content-save-outline</v-icon>Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
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
      tabla: {
        headers: [
          { text: "Descripción", align: "left", value: "descripcion" },
          { text: "Fecha", align: "center", value: "fecha" },
          { text: "Tipo", align: "center", value: "tipo_asamblea" },
          { text: "Estado", align: "center", value: "estado" },
          { text: "Opciones", value: "edit", align: "center" },
        ],
        data: [],
      },
      dialogPicker: false,
      expanded: [],
      search: null,
      formulario: {},
      errores: {
        descripcion: false,
        tipo_asamblea: false,
        fecha: false,
        hora: false,
        observaciones: false,
      },
      load: {
        dialogo: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.consultar_asambleas();
    this.init_formulario();
  },
  methods: {
    cambiar_estado(item) {
      var $this = this;
      var buscar_activos = this.tabla.data.find(
        (el) => el.activar == true && el.id != item.id
      );
      if (buscar_activos) {
        var data = JSON.parse(JSON.stringify(this.tabla.data));
        var index = this.tabla.data.indexOf(item);
        data[index].activar = false;
        setTimeout(() => {
          this.tabla.data = [];
          this.tabla.data = data;
        }, 100);
        $this.$emit("msj", "Ya hay una asamblea activa");
      } else {
        $this.card_estado = true;
        this.fb.$asambleas
          .doc(item.id)
          .set(
            {
              estado: item.activar ? 0 : 1,
            },
            { merge: true }
          )
          .then(() => {
            $this.$emit("msj", "Asamblea actualizada exitosamente", "green");
            $this.card_estado = false;
          })
          .catch(() => {
            $this.$emit("msj", "Ha ocurrido un error durante la consulta");
            $this.card_estado = false;
          });
      }
    },
    consultar_asambleas() {
      var $this = this;
      $this.card_estado = true;
      this.fb.$asambleas.onSnapshot(
        (snapshot) => {
          $this.tabla.data = [];
          snapshot.forEach((doc) => {
            let data = doc.data();
            data.id = doc.id;
            data.activar = data.estado == 1 ? false : true;
            $this.tabla.data.push(data);
          });

          $this.card_estado = false;
        },
        (err) => {
          $this.$emit("msj", "Ha ocurrido un error durante la consulta");
        }
      );
    },
    crear_asamblea() {
      var data = this.formulario;
      if (!data.descripcion) {
        this.errores.descripcion = true;
        this.$emit("msj", "Ingresa una descripción");
      } else if (!data.tipo_asamblea) {
        this.errores.tipo_asamblea = true;
        this.$emit("msj", "Selecciona el tipo de asamblea");
      } else if (!data.fecha) {
        this.errores.fecha = true;
        this.$emit("msj", "Ingresa la fecha de la asamblea");
      } else if (!data.hora) {
        this.errores.hora = true;
        this.$emit("msj", "Ingresa la hora de la asamblea");
      } else {
        this.load.dialogo = true;
        this.format_envio(data);
      }
    },
    format_envio(data) {
      console.log(data)
      var nit_empresa = parseFloat(sessionStorage.Sesion.substr(0, 15));
      data.nit_empresa = nit_empresa;
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "PHorizontal/dlls/CfAsamblea.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          clasifica +
          "|" +
          codigo +
          "|" +
          descripcion +
          "|" +
          estado +
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
          this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    crear_asamblea_fb() {
      var data = this.formulario;
      if (!data.descripcion) {
        this.errores.descripcion = true;
        this.$emit("msj", "Ingresa una descripción");
      } else if (!data.tipo_asamblea) {
        this.errores.tipo_asamblea = true;
        this.$emit("msj", "Selecciona el tipo de asamblea");
      } else if (!data.fecha) {
        this.errores.fecha = true;
        this.$emit("msj", "Ingresa la fecha de la asamblea");
      } else if (!data.hora) {
        this.errores.hora = true;
        this.$emit("msj", "Ingresa la hora de la asamblea");
      } else {
        this.load.dialogo = true;

        var nit_empresa = parseFloat(sessionStorage.Sesion.substr(0, 15));
        data.nit_empresa = nit_empresa;
        data.estado = 1;

        this.fb.$asambleas
          .add(data)
          .then((ref) => {
            this.load.dialogo = false;
            this.dialogo.estado = false;
            this.$emit("msj", "Asamblea creada exitosamente", "green");
            this.init_formulario();
          })
          .catch((err) => {
            console.error(err);
            this.$emit("msj", "Ha ocurrido un error durante el registro");
            this.load.dialogo = false;
          });
      }
    },
    validar_estado(estado) {
      if (estado == 0) return { text: "Activo", color: "green darken-2" };
      else if (estado == 1) return { text: "Inactivo", color: "red darken-2" };
    },
    init_formulario() {
      this.formulario = {
        descripcion: null,
        tipo_asamblea: null,
        fecha: null,
        hora: null,
        observaciones: null,
      };

      this.errores = {
        descripcion: false,
        tipo_asamblea: false,
        fecha: false,
        hora: false,
        observaciones: false,
      };
    },
  },
};
</script>
