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
              <v-icon size="30" color="blue darken-4">mdi-check-circle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pl-3">
              <v-list-item-title class="headline">Registro de Actividades</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
          <v-row>
            <v-col class="d-flex" cols="8" sm="8">
              <v-autocomplete
                label="Proceso"
                v-model="formulario.proceso"
                :items="procesos"
                :item-text="format_proceso"
                item-value="nroproc_rep"
                outlined
                hide-details
                :error="errores.proceso"
                @change="buscar_actividades()"                
              ></v-autocomplete>
            </v-col>
          </v-row>

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
              <template v-slot:item.rgtitan_rep="{ item }">
                <v-switch
                  :input-value=" item.rgtitan_rep == '1' ? true : false"
                  @click="cambio_estado('rgtitan_rep', item.rgtitan_rep)"
                ></v-switch>
              </template>
              <template v-slot:item.actpbdian_rep="{ item }">
                <v-switch
                  :input-value=" item.actpbdian_rep == '1' ? true : false"
                  @click="cambio_estado('actpbdian_rep', item.actpbdian_rep)"
                ></v-switch>
              </template>
              <template v-slot:item.actpbfacse_rep="{ item }">
                <v-switch
                  :input-value=" item.actpbfacse_rep == '1' ? true : false"
                  @click="cambio_estado('actpbfacse_rep', item.actpbfacse_rep)"
                ></v-switch>
              </template>
              <template v-slot:item.tkpbfb_rep="{ item }">
                <v-switch
                  :input-value=" item.tkpbfb_rep == '1' ? true : false"
                  @click="cambio_estado('tkpbfb_rep', item.tkpbfb_rep)"
                ></v-switch>
              </template>
              <template v-slot:item.pruebatitan_rep="{ item }">
                <v-switch
                  :input-value=" item.pruebatitan_rep == '1' ? true : false"
                  @click="cambio_estado('pruebatitan_rep', item.pruebatitan_rep)"
                ></v-switch>
              </template>
              <template v-slot:item.actproddian_rep="{ item }">
                <v-switch
                  :input-value=" item.actproddian_rep == '1' ? true : false"
                  @click="cambio_estado('actproddian_rep', item.actproddian_rep)"
                ></v-switch>
              </template>
              <template v-slot:item.actprodfacse_rep="{ item }">
                <v-switch
                  :input-value=" item.actprodfacse_rep == '1' ? true : false"
                  @click="cambio_estado('actprodfacse_rep', item.actprodfacse_rep)"
                ></v-switch>
              </template>
              <template v-slot:item.reiniciofb_rep="{ item }">
                <v-switch
                  :input-value=" item.reiniciofb_rep == '1' ? true : false"
                  @click="cambio_estado('reiniciofb_rep', item.reiniciofb_rep)"
                ></v-switch>
              </template>
              <template v-slot:item.tkproducfb_rep="{ item }">
                <v-switch
                  :input-value=" item.tkproducfb_rep == '1' ? true : false"
                  @click="cambio_estado('tkproducfb_rep', item.tkproducfb_rep)"
                ></v-switch>
              </template>
              <template v-slot:item.actprodtitan_rep="{ item }">
                <v-switch
                  :input-value=" item.actprodtitan_rep == '1' ? true : false"
                  @click="cambio_estado('actprodtitan_rep', item.actprodtitan_rep)"
                ></v-switch>
              </template>
              <template v-slot:item.correo_rep="{ item }">
                <v-switch
                  :input-value=" item.correo_rep == '1' ? true : false"
                  @click="cambio_estado('correo_rep', item.correo_rep)"
                ></v-switch>
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
          <span class="title col-12">Nueva Actividad</span>
        </v-card-title>
        <v-card-text class="px-0 pb-0">
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Consecutivo"
                clearable
                outlined
                required
                v-model="formulario.consecutivo"
                :error="errores.consecutivo"
                @input="errores.consecutivo = false"
                hide-details
              ></v-text-field>
            </v-col>

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
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="formulario.eliminar" label="Eliminar"></v-switch>
            </v-col>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="dialogo.estado = false; init_formulario()"
          >Cancelar</v-btn>
          <v-btn class="ma-2 px-4" color="success" depressed large @click="guardar()">
            <v-icon left>mdi-content-save-outline</v-icon>Guardar
          </v-btn>
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
      procesos: [],      

      tabla: {
        headers: [
          { text: "Descripción", align: "left", value: "descrip_rep" },
          { text: "Reg_Titán", align: "center", value: "rgtitan_rep" },
          { text: "Act_Prueba_Dian", align: "center", value: "actpbdian_rep" },
          {
            text: "Act_Prueba_Facse",
            align: "center",
            value: "actpbfacse_rep",
          },
          {
            text: "Token_Prueba_Firebase",
            align: "center",
            value: "tkpbfb_rep",
          },
          { text: "Pruebas_Titan", align: "center", value: "pruebatitan_rep" },
          {
            text: "Act_Produc_Dian",
            align: "center",
            value: "actproddian_rep",
          },
          {
            text: "Act_Produc_Facse",
            align: "center",
            value: "actprodfacse_rep",
          },
          {
            text: "Reinicio_Firebase",
            align: "center",
            value: "reiniciofb_rep",
          },
          {
            text: "Token_Produc_Firebase",
            align: "center",
            value: "tkproducfb_rep",
          },
          {
            text: "Act_Produc_Titan",
            align: "center",
            value: "actprodtitan_rep",
          },
          { text: "Correo_Facse", align: "center", value: "correo_rep" },
          { text: "Editar", align: "center", value: "editar" },
        ],
        data: [],
      },
      dialogPicker: false,
      expanded: [],
      regactividad: [],                        
      search: null,
      formulario: {},
      errores: {
        descripcion: false,
        observaciones: false,
      },
      load: {
        dialogo: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargar_datos();
    this.init_formulario();
    this.cargarProcesos();    
  },
  methods: {
    cambio_estado(campo, valor) {
      this.card_estado = true;
      // post
      //   .postData({
      //     url: "Financiero/dlls/CfProductosJB.dll",
      //     data:
      //       sessionStorage.Sesion + "|" + listaCliente + "|1|" + codigo + "|",
      //     method: "",
      //   })
      //   .then((data) => {
      //     this.card_estado = false;
      //     this.cargar_datos();
      //   })
      //   .catch((err) => {
      //     this.card_estado = false;
      //     console.log("Error", err);
      //     this.send_error("Ha ocurrido un error realizando el proceso.");
      //   });
    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrActiv01j.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch(err => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Actividades",
            estado: true
          });
        });
    },


    cargar_datos() {
      /////////
      var data =
        '[{"estado": "0","descrip_rep": "PEDRO PEREZ","rgtitan_rep": "1","actpbdian_rep": "0","actpbfacse_rep": "1","tkpbfb_rep": "1","pruebatitan_rep": "0","actproddian_rep": "1","actprodfacse_rep": "1","reiniciofb_rep": "0","tkproducfb_rep": "1","actprodtitan_rep": "1","correo_rep": "0","identificacion": "86007243"},{"estado":"1","descrip_rep": "MARY ISCOS","rgtitan_rep": "0","actpbdian_rep": "0","actpbfacse_rep": "0","tkpbfb_rep": "0","pruebatitan_rep": "0","actproddian_rep": "0","actprodfacse_rep": "1","reiniciofb_rep": "0","tkproducfb_rep": "1","actprodtitan_rep": "1","correo_rep": "0","identificacion": "525315556"}]';
      // console.log(JSON.parse(data));
      this.tabla.data = JSON.parse(data);
      /////////
    },

    guardar: function() {
      var data = JSON.parse(JSON.stringify(this.formulario));
      if (!data.consecutivo) {
        this.errores.consecutivo = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var nro = data.consecutivo;
      var descripcion = data.descripcion;
      var eliminar = data.eliminar ? "1" : "0";
      let datos = {
        url: "Financiero/dlls/PrActiv01.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          nro +
          "|" +
          descripcion +
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
          // this.init_form();
          // this.cargarcontenido();
        })
        .catch(error => {
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
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
    format_proceso(val) {
      return `${val.nroproc_rep} - ${val.descriproc_rep}`;
    },

    cargaractividades() {
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


    buscar_actividades: function() {
      var data = JSON.parse(JSON.stringify(this.formulario));      
      var proceso = data.proceso;
      post
        .postData({
          url: "Financiero/dlls/CfActRegactividadJ.dll",
          data: sessionStorage.Sesion +
           "|" +
           proceso +
           "|" +           
            0  +
           "|" +
            1  +
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


    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    init_formulario() {
      this.formulario = {
        descripcion: null,
        observaciones: null,
      };
    },
  },
};
</script>
