<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-elevator</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Vincular Actividades</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-row>
            <v-col class="d-flex" cols="8" sm="6">
              <v-autocomplete
                label="Proceso"
                v-model="form.proceso"
                :items="procesos"
                :item-text="format_proceso"
                item-value="nroproc_rep"
                outlined
                hide-details
                :error="errores.proceso"
                @change="errores.proceso = false"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="8" sm="6">
              <v-autocomplete
                label="Procedimiento"
                v-model="form.procedimiento"
                :items="procedimiento"
                :item-text="format_procedimiento"
                item-value="nroproced_rep"
                outlined
                hide-details
                :error="errores.procedim"
                @change="buscar_actividades()"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="8" sm="6">
              <v-autocomplete
                label="Actividad"
                v-model="form.actividad"
                :items="actividad"
                :item-text="format_actividad"
                item-value="nroactiv_rep"
                outlined
                hide-details
                :error="errores.actividad"
                @change="errores.actividad = false"
              ></v-autocomplete>
            </v-col>
          </v-row>
            <v-row>
              <v-btn
                color="success"
                class="ma-2 white--text"
                large
                depressed
                @click="guardar()"
              >
                Agregar
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
            </v-row>
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
              :items="regactividad"
              item-key="identificacion"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
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
          <span class="title col-12">{{ dialogo.titulo}}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="8">
              <v-autocomplete
                label="Procedimiento"
                v-model="form.procedimiento"
                :items="procedimiento"
                :item-text="format_procedimiento"
                item-value="llaveproced_rep"
                outlined
                hide-details
                :error="errores.procedimiento"
                @change="errores.procedimiento = false"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Codigo"
                clearable
                outlined
                type="text"
                required
                counter="4"
                v-model="form.codigo"
                :error="errores.codigo"
                @input="errores.codigo = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="8" sm="8">
              <v-text-field
                label="Descripción"
                clearable
                outlined
                required
                v-model="form.descripcion"
                :error="errores.descripcion"
                @input="errores.descripcion = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>



          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
          </v-row>

        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
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
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,      
      singleExpand: true,
      expanded: [],
      contenido: [],
      procesos: [],      
      procedimiento: [],      
      actividad: [],            
      regactividad: [],                  
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "left", value: "codactireg_rep" },
        { text: "Descripción", align: "left", value: "descractreg_rep" },
        { text: "Estado", align: "left", value: "estadoreg_rep" },
        { text: "Opciones", value: "edit", align: "center" }
      ],
      errores: {
        codigo: false,
        estado: false
      },
      card_estado: false
    };
  },
  created() {
    this.cargarProcesos();        
    this.cargarProcedimiento();
    this.cargarActividad();    
    
  },
  computed: {},
  methods: {
    guardar: function() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.proceso) {
        this.errores.proceso = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var proceso = data.proceso;
      var procedimiento = data.procedimiento;
      var actividad = data.actividad;
      var eliminar = "0";
      // var eliminar = data.eliminar ? "1" : "0";
      let datos = {
        url: "Financiero/dlls/CfActRegactividad.DLL",
        data:
          sessionStorage.Sesion +
          "|" +
          proceso +
          "|" +          
          procedimiento +
          "|" +
          actividad +
          "|" +
          eliminar +
          "|",
        method: ""
      };
      post
        .postData(datos)
        .then(data => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.init_form();
          this.cargarcontenido();
        })
        .catch(error => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfActprocedimj.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
          console.log(this.contenido)
        })
        .catch(err => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Procesos",
            estado: true
          });
        });
    },

    cargarProcesos: function() {
      post
        .postData({
          url: "Financiero/dlls/CfActprocesosj.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.procesos = data;
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar procesos",
            estado: true
          });
        });
    },

    cargarProcedimiento: function() {
      post
        .postData({
          url: "Financiero/dlls/CfActprocedimj.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.procedimiento = data;
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar procedimiento",
            estado: true
          });
        });
    },

    buscar_actividades: function() {
      var data = JSON.parse(JSON.stringify(this.form));      
      var proceso = data.proceso;
      var procedimiento = data.procedimiento;
      post
        .postData({
          url: "Financiero/dlls/CfActRegactividadJ.dll",
          data: sessionStorage.Sesion +
           "|" +
           proceso +
           "|" +           
           procedimiento +
           "|" 
           ,
          method: ""
        })
        .then(data => {
          this.regactividad = data;
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar procedimiento",
            estado: true
          });
        });
    },

    cargarActividad: function() {
      post
        .postData({
          url: "Financiero/dlls/CfActactividadj.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.actividad = data;
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar actividades",
            estado: true
          });
        });
    },


    format_proceso(val) {
      return `${val.nroproc_rep} - ${val.descriproc_rep}`;
    },

    format_procedimiento(val) {
      return `${val.nroproced_rep} - ${val.descriproced_rep}`;
    },

    format_actividad(val) {
      return `${val.nroactiv_rep} - ${val.descripactiv_rep}`;
    },


    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true
      });
    }
  }
};
</script>
