<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-marker</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Convenios Recaudos</v-list-item-title
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
              class="elevation-1"
            >
              <template v-slot:item.estado_rep="{ item }">{{
                item.estado_rep == "1" ? "Bloqueado" : "Activo"
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
          <v-row>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Identificación"
                clearable
                outlined
                type="text"
                required
                counter="15"
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
          <v-row>
            <v-col class="d-flex" cols="8" sm="6">
              <v-text-field
                label="Identificador de Barras"
                clearable
                outlined
                type="number"
                required
                counter="15"
                v-model="form.idbarras"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="8" sm="6">
              <v-text-field
                label="Dias Hábiles post_vencimiento"
                clearable
                outlined
                type="number"
                required
                counter="2"
                v-model="form.diashabil"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="8" sm="6">
              <v-text-field
                :label="`Recaudo ${label_recaudo} hasta el dia...`"
                clearable
                outlined
                type="number"
                required
                counter="2"
                v-model="form.diashasta"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="8" sm="6" v-if="input_otros_mpios">
              <v-text-field
                label="Recaudo Otros Mpios hasta el dia..."
                clearable
                outlined
                type="number"
                required
                counter="2"
                v-model="form.diashastaotros"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch
                v-model="form.solomes"
                label="Recaudos solo del mes"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch
                v-model="form.consolidado"
                label="Recaudo Consolidado"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch
                v-model="form.cargue"
                label="Cargue Facturas"
              ></v-switch>
            </v-col>
          </v-row>            
          <v-row>          
            <v-col class="d-flex" cols="4">
              <v-switch
                v-model="form.refer"
                label="Referencia Unica"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-switch
                v-model="form.consulta"
                label="Activar Consulta Ws"
              ></v-switch>
            </v-col>

          </v-row>
          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch
                v-model="form.asobancaria"
                label="Asobancaria"
              ></v-switch>
            </v-col>

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
      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      search: "",
      form: {},
      headers: [
        { text: "Codigo", align: "center", value: "cod_rep" },
        { text: "Descripción", align: "left", value: "descrip_rep" },
        { text: "IdBarras", align: "left", value: "idbarras_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },

        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
      input_otros_mpios: true,
      label_recaudo: '',
    };
  },
  created() {
    this.cargarcontenido();
  },
  computed: {},
  methods: {
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.codigo = item.cod_rep.trim();
      this.form.descripcion = item.descrip_rep.trim();
      this.form.idbarras = item.idbarras_rep.trim();
      this.form.diashabil = item.diashabil_rep;
      this.form.diashasta = parseFloat(item.diashasta_rep);
      this.form.diashastaotros = parseFloat(item.diashastaotros_rep);
      this.form.solomes = item.solomes_rep == "1" ? true : false;
      this.form.consolidado = item.consolidado_rep == "1" ? true : false;      
      this.form.asobancaria = item.asobancaria_rep == "1" ? true : false;
      this.form.cargue = item.cargue_rep == "1" ? true : false;      
      this.form.refer = item.refer_rep == "1" ? true : false;     
      this.form.consulta = item.consulta_rep == "1" ? true : false;     

      if (parseInt(item.cod_rep) == 800021272) {
        this.input_otros_mpios = true;
        this.label_recaudo = "Vcio";
      } else {
        this.input_otros_mpios = false;
        this.label_recaudo = '';
      }
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var codigo = data.codigo;
      var descripcion = data.descripcion;
      var idbarras = data.idbarras;
      var diashabil = data.diashabil;
      var diashasta = data.diashasta;
      var diashastaotros = data.diashastaotros || '0';
      var solomes = data.solomes ? "1" : "0";
      var consolidado = data.consolidado ? "1" : "0";
      var asobancaria = data.asobancaria ? "1" : "0";
      var cargue = data.cargue ? "1" : "0";    
      var refer = data.refer ? "1" : "0"; 
      var consulta = data.consulta ? "1" : "0"; 
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Recaudos/dlls/CfConveniorc.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          descripcion +
          "|" +
          idbarras +
          "|" +
          diashabil +
          "|" +
          diashasta +
          "|" +
          diashastaotros +
          "|" +
          solomes +
          "|" +
          consolidado +
          "|" +
          asobancaria +
          "|" +
          cargue +
          "|" +
          refer +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          consulta + 
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
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };

      this.errores = {
        codigo: false,
      };
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Recaudos/dlls/CfConveniorcJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Convenios",
            estado: true,
          });
        });
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
