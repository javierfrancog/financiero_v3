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
              <v-icon size="30" color="blue darken-4">mdi-help-circle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pl-3">
              <v-list-item-title class="headline">Configuración preguntas</v-list-item-title>
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
                <v-icon right dark>mdi-help-circle-outline</v-icon>
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
              :loading="load.preguntas"
              :headers="tabla.headers"
              :items="tabla.data"
              item-key="id"
              :single-expand="false"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table class="col-6 mx-auto">
                    <thead>
                      <tr>
                        <th colspan="2">
                          <b>Asamblea:</b>
                          {{item.asamblea.descripcion}}
                        </th>
                      </tr>
                      <tr>
                        <th colspan="2">
                          <b>Opciones de respuesta</b>
                        </th>
                      </tr>
                      <tr>
                        <th>
                          <b>Código</b>
                        </th>
                        <th>
                          <b>Descripción</b>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item,id) in item.respuestas" :key="id">
                        <td
                          class="text-uppercase text-center font-weight-bold"
                        >{{String.fromCharCode(97 + id)}}</td>
                        <td class="text-left">{{item}}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.fecha="{ item }">
                <b>{{item.fecha}} {{item.hora}}</b>
              </template>
              <template v-slot:item.descripcion="{ item }">
                <b>{{item.descripcion}}</b>
              </template>
              <template v-slot:item.tipo_pregunta="{ item }">
                <v-chip
                  label
                  small
                  :color="(item.tipo_pregunta.value == 1 ? 'light-blue' : 'orange') + '  darken-2'"
                  class="white--text overline"
                >{{item.tipo_pregunta.text}}</v-chip>
              </template>
              <template v-slot:item.estado="{ item }">
                <v-chip
                  label
                  small
                  :color="validar_estado(item.estado).color"
                  class="white--text overline"
                >{{validar_estado(item.estado).text}}</v-chip>
              </template>
              <template v-slot:item.edit="{ item }">
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
    <v-dialog v-model="dialogo.estado" persistent max-width="800px">
      <v-card class="px-6" :loading="load.dialogo" :disabled="load.dialogo">
        <v-card-title>
          <span class="title col-12">Nueva pregunta</span>
        </v-card-title>
        <v-card-text class="px-0 pb-0">
          <v-row>
            <v-col class="d-flex" cols="8">
              <v-select
                label="Asamblea"
                clearable
                :items="asambleas"
                outlined
                v-model="formulario.asamblea"
                return-object
                :error="errores.asamblea"
                @change="errores.asamblea = false"
                :loading="load.asambleas"
                hide-details
                item-value="id"
                item-text="descripcion"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Fecha asamblea"
                disabled
                outlined
                v-model="fecha_asamblea"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                :items="[
                    { text: 'Opción múltiple', value: 1 },
                    { text: 'Única respuesta', value: 2 }
                  ]"
                label="Tipo de pregunta"
                outlined
                hide-details
                clearable
                return-object
                v-model="formulario.tipo_pregunta"
                :error="errores.tipo_pregunta"
                @change="errores.tipo_pregunta = false"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-text-field
                label="Descripción pregunta"
                outlined
                hide-details
                v-model="formulario.descripcion"
                :error="errores.descripcion"
                @input="errores.descripcion = false"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider />
          <v-row>
            <v-col class="d-flex" cols="10">
              <v-text-field
                label="Respuesta"
                outlined
                hide-details
                dense
                clearable
                v-model="respuesta_input"
                :error="errores.respuesta_input"
                @input="errores.respuesta_input = false"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-center align-center" cols="2">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    color="blue darken-2"
                    depressed
                    class="white--text"
                    @click="agregar_respuesta"
                  >
                    <v-icon>mdi-help-circle-outline</v-icon>
                  </v-btn>
                </template>
                <span>Agregar respuesta</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-simple-table fixed-header height="300">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left" colspan="3">Opciones de respuesta</th>
                    </tr>
                    <tr>
                      <th class="text-center">Código</th>
                      <th class="text-left">Descripción</th>
                      <th class="text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,id) in formulario.respuestas" :key="id">
                      <td class="text-uppercase text-center">{{String.fromCharCode(97 + id)}}</td>
                      <td class="text-left">{{item}}</td>
                      <td class="text-right">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on" color="red darken-2" depressed>
                              <v-icon @click="borrar_respuesta(id)">mdi-close</v-icon>
                            </v-btn>
                          </template>
                          <span>Borrar</span>
                        </v-tooltip>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
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
            @click="dialogo.estado = false; init_formulario()"
          >Cancelar</v-btn>
          <v-btn class="ma-2 px-4" color="success" depressed large @click="crear_pregunta()">
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
    FlowerSpinner
  },
  data() {
    return {
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null
      },
      tabla: {
        headers: [
          { text: "Descripción", align: "left", value: "descripcion" },
          { text: "Tipo", align: "center", value: "tipo_pregunta" },
          { text: "Estado", align: "center", value: "estado" },
          { text: "Opciones", value: "edit", align: "center" }
        ],
        data: []
      },
      expanded: [],
      search: null,
      formulario: {},
      errores: {},
      load: {
        dialogo: false,
        asambleas: true,
        preguntas: true
      },
      card_estado: false,
      preguntas: [],
      asambleas: [],
      fecha_asamblea: null,
      respuesta_input: null
    };
  },
  watch: {
    "formulario.asamblea": function(data) {
      this.fecha_asamblea = data ? data.fecha + " " + data.hora : null;
    }
  },
  created() {
    this.consultar_preguntas();
    this.consultar_asambleas();
    this.init_formulario();
  },
  methods: {
    cambiar_estado(item) {
      console.log(item.id);
      var $this = this;
      var buscar_activos = this.tabla.data.find(
        el => el.activar == true && el.id != item.id
      );
      if (buscar_activos) {
        var data = JSON.parse(JSON.stringify(this.tabla.data));
        var index = this.tabla.data.indexOf(item);
        data[index].activar = false;
        setTimeout(() => {
          this.tabla.data = [];
          this.tabla.data = data;
        }, 100);
        $this.$emit("msj", "Existe una Pregunta Activa!");
      } else {
        $this.card_estado = true;
        this.fb.$preguntas
          .doc(item.id)
          .set(
            {
              estado: item.activar ? 0 : 1
            },
            { merge: true }
          )
          .then(() => {
            $this.$emit("msj", "Pregunta actualizada exitosamente", "green");
            $this.card_estado = false;
          })
          .catch(() => {
            $this.$emit("msj", "Ha ocurrido un error durante la consulta");
            $this.card_estado = false;
          });
      }
    },
    borrar_respuesta(id) {
      this.formulario.respuestas.splice(id, 1);
    },
    agregar_respuesta() {
      let respuesta = this.respuesta_input;
      if (!respuesta) {
        this.errores.respuesta_input = true;
        this.$emit("msj", "Ingresa una opción de respuesta");
      } else {
        this.respuesta_input = null;
        this.formulario.respuestas.push(respuesta);
      }
    },
    consultar_preguntas() {
      var $this = this;
      this.fb.$preguntas.onSnapshot(
        snapshot => {
          $this.tabla.data = [];
          snapshot.forEach(doc => {
            let data = doc.data();
            data.id = doc.id;
            data.activar = data.estado == 1 ? false : true;
            $this.tabla.data.push(data);
          });

          $this.load.preguntas = false;
        },
        err => {
          $this.load.preguntas = false;
          $this.$emit("msj", "Ha ocurrido un error durante la consulta");
        }
      );
    },
    consultar_asambleas() {
      var $this = this;
      this.fb.$asambleas.where("estado", "==", 0).onSnapshot(
        snapshot => {
          $this.asambleas = [];
          snapshot.forEach(doc => {
            let data = doc.data();
            data.id = doc.id;
            $this.asambleas.push(data);
          });

          $this.load.asambleas = false;
        },
        err => {
          $this.load.asambleas = false;
          $this.$emit("msj", "Ha ocurrido un error durante la consulta");
        }
      );
    },
    crear_pregunta() {
      var data = this.formulario;

      if (!data.asamblea) {
        this.errores.asamblea = true;
        this.$emit("msj", "Selecciona una asamblea");
      } else if (!data.tipo_pregunta) {
        this.errores.tipo_pregunta = true;
        this.$emit("msj", "Selecciona un tipo de pregunta");
      } else if (!data.descripcion) {
        this.errores.descripcion = true;
        this.$emit("msj", "Ingresa la descripción de la pregunta");
      } else if (data.respuestas.length < 2) {
        this.$emit("msj", "Debes ingresar al menos 2 opciones de respuesta");
      } else {
        // console.log(data);
        this.load.dialogo = true;

        data.nit_empresa = parseFloat(sessionStorage.Sesion.substr(0, 15));
        data.estado = 1; // Inactiva

        this.fb.$preguntas
          .add(data)
          .then(ref => {
            this.load.dialogo = false;
            this.dialogo.estado = false;
            this.$emit("msj", "Pregunta creada exitosamente", "green");
            this.init_formulario();
          })
          .catch(err => {
            console.error(err);
            this.$emit("msj", "Ha ocurrido un error durante el registro");
            this.load.dialogo = false;
          });
      }
    },
    validar_estado(estado) {
      if (estado == 0) return { text: "Activo", color: "green darken-2" };
      else if (estado == 1) return { text: "Cerrada", color: "red darken-2" };
    },
    init_formulario() {
      this.formulario = {
        asamblea: null,
        tipo_pregunta: null,
        descripcion: null,
        respuestas: []
      };

      this.errores = {
        asamblea: false,
        tipo_pregunta: false,
        descripcion: false,
        respuestas: false
      };
    }
  }
};
</script>
