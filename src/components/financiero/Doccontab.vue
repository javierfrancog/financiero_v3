<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="13"  :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-two-factor-authentication</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Configuración Documentos Contables</v-list-item-title>
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="indigo"
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
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr>
                        <th>Tipo_Oper_Invent</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{item.tipoper_docc}}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)">edit</v-icon>
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
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Codigo"
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
              <v-autocomplete
                label="Agencia"
                v-model="form.agencia"
                :items="agencias"
                :item-text="format_agencias"
                item-value="codigo_agc"
                outlined
                hide-details
                :error="errores.agencia"
                @change="errores.agencia = false"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>          
            <v-col class="d-flex" cols="9" sm="7">
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
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                                { text: 'Contable', value: 1 },
                                { text: 'Facturación', value: 2 },                                
                                { text: 'Inventarios', value: 3 },                                
                                { text: 'Dev.Ventas', value: 5 },                                                                
                                { text: 'No Aplica', value: 99 }
                              ]"
                label="Tipo Documento"
                outlined
                clearable
                hide-details
                v-model="form.tipodoc"
                item-text="text"
                item-value="value"
                :error="errores.tipodoc"
                @input="errores.tipodoc = false"
                required
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="2" sm="2">
              <v-text-field
                label="Abreviacion"
                clearable
                outlined
                type="text"
                required
                counter="2"
                v-model="form.abreviacion"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-switch v-model="form.inventarios" label="Asociar a Inventarios" hide-details></v-switch>
            </v-col>
            <v-col>
              <v-switch v-model="form.reservado" label="Reservado/Titán" hide-details></v-switch>
            </v-col>

            <!-- <v-col class="d-flex" cols="8" sm="6">
              <v-autocomplete
                label="Operación Inventarios"
                v-model="form.tipooper"
                :items="tpoper"
                :item-text="format_tpoper"
                item-value="llave_tpoper"
                outlined
                hide-details
                :error="errores.tpoper"
                @change="errores.tpoper = false"
              ></v-autocomplete>
            </v-col> -->
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                                { text: 'Anual', value: 0 },
                                { text: 'Mensual', value: 1 }
                              ]"
                label="Tipo de Numeración"
                outlined
                clearable
                hide-details
                v-model="form.numeracion"
                item-text="text"
                item-value="value"
                required
                :error="errores.numeracion"
                @change="errores.numeracion = false"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="anios_select"
                label="Año"
                outlined
                clearable
                hide-details
                v-model="form.ano"
                item-text="text"
                item-value="value"
                required
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                                { text: 'Enero', value: 1 },
                                { text: 'Febrero', value: 2 },                                
                                { text: 'Marzo', value: 3 },                                
                                { text: 'Abril', value: 4 },
                                { text: 'Mayo', value: 5 },                                
                                { text: 'Junio', value: 6 },
                                { text: 'Julio', value: 7 },
                                { text: 'Agosto', value: 8 },
                                { text: 'Septiembre', value: 9 },
                                { text: 'Octubre', value: 10 },                                
                                { text: 'Noviembre', value: 11 },
                                { text: 'Diciembre', value: 12 }
                              ]"
                label="Mes"
                outlined
                clearable
                hide-details
                v-model="form.mes"
                item-text="text"
                item-value="value"
                required
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="3" sm="3">
              <v-text-field
                label="Nvo.Consecutivo"
                clearable
                outlined
                type="number"
                required
                counter="6"
                v-model="form.consecutivo"
                hide-details
              ></v-text-field>
            </v-col>

          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="[
                                { text: 'Activo', value: 0 },
                                { text: 'Desactivado', value: 1 }
                              ]"
                label="Estado"
                outlined
                clearable
                hide-details
                v-model="form.estado"
                item-text="text"
                item-value="value"
                required
                :error="errores.estado"
                @change="errores.estado = false"
              ></v-select>
            </v-col>
            <v-col>
            <v-switch v-model="form.eliminar" label="Eliminar" hide-details></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="dialogo.estado = false;init_form()">Cancelar</v-btn>
          <v-btn class="ma-2 px-4" color="success" depressed large @click="guardar()">Guardar</v-btn>
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
      styleObject: { border: '2px solid #01579B'},            
      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      agencias: [],
      tpoper: [],      
      contenido: [],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "codigo_docc" },
        { text: "Descripción", align: "left", value: "descrip_docc" },
        { text: "Cod_Agencia", align: "center", value: "agencia_docc" },
        { text: "Agencia", align: "center", value: "descripag_docc" },
        { text: "", align: "center", value: "numeracion_docc" },
        { text: "Numeración", align: "center", value: "descripnum_docc" },
        { text: "Abreviacion", align: "center", value: "abrev_docc" },
        { text: "Estado", align: "center", value: "estado_docc" },
        { text: "Opciones", value: "edit", align: "center" }
      ],
      anios_select: [],      
      errores: {
        codigo: false,
        descripcion: false,
        numeracion: false,
        tipodoc: false,
        estado: false
      },
      card_estado: false
    };
  },
  created() {
    this.cargar_anios()    
    this.cargarcontenido();
    this.cargaragencias();
    this.cargartpoper();

  },
  computed: {},
  methods: {
    cargar_anios() {
      var anios = []
      var anioActual = new Date().getFullYear()
      for (let i = 3; i > 0; i--) anios.push(anioActual - i)
      for (let i = 0; i < 4; i++) anios.push(anioActual + i)

      anios = anios.map((el) => (el = { text: el, value: el }))
      this.anios_select = anios
    },

    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.codigo = item.codigo_docc;
      this.form.descripcion = item.descrip_docc;
      this.form.agencia = item.agencia_docc;
      // this.form.tipooper = item.tipoper_docc;
      this.form.abreviacion = item.abrev_docc;      
      this.form.numeracion = parseInt(item.numeracion_docc);
      this.form.inventarios = parseInt(item.inventario_docc);
      this.form.reservado = parseInt(item.reservado_docc);

      this.form.estado = parseInt(item.estado_docc);

    },
    guardar: function() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Campo Obligatorio!");
      } else  if (!data.tipodoc) {
        this.errores.tipodoc = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.agencia) {
        this.errores.agencia = true;
        this.send_error("Agencia Obligatoria!");
      } else if (data.numeracion == null) {
        this.errores.numeracion = true;
        this.send_error("Tipo Numeracion Obligatoria!");
      } else if (data.estado == null) {
        this.errores.estado = true;
        this.send_error("Estado Obligatoria!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var codigo = data.codigo;
      var descripcion = data.descripcion;
      var agencia = data.agencia;
      var numeracion = data.numeracion;
      // var tipoper = data.tipooper;    
      var tipodoc = data.tipodoc;  
      var estado = data.estado;
      var inventarios = data.inventarios ? "1" : "0";
      var reservado = data.reservado ? "1" : "0";
      var ano = data.ano;
      var mes = data.mes;      
      var consecutivo = this.form.consecutivo || "0";
      var abreviacion = this.form.abreviacion;      
      var eliminar = data.eliminar ? "1" : "0";
      console.log(inventarios)

      let datos = {
        url: "Financiero/dlls/CfDoccontab.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          agencia +
          "|" +
          descripcion +
          "|" +
          numeracion +
          "|" +
          tipodoc +
          "|" +          
          inventarios +
          "|" +
          // tipoper +
          // "|" +
          consecutivo +
          "|" +
          abreviacion +
          "|" +
          ano +
          "|" +          
          mes +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          reservado +
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
        agencia: null,
        descripcion: null,
        numeracion: null,
        eliminar: false
      };

      this.errores = {
        codigo: false,
        agencia: null,
        numeracion: null,
        descripcion: null,
        estado: false
      };
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfDoccontabJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
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
            text: "Error al cargar documentos contables",
            estado: true
          });
        });
    },

    cargartpoper: function() {
      post
        .postData({
          url: "Financiero/dlls/CfTpOperInvJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: ""
        })
        .then(data => {
          this.tpoper = data;
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Tipo operación",
            estado: true
          });
        });
    },

    cargaragencias: function() {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: ""
        })
        .then(data => {
          this.agencias = data;
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true
          });
        });
    },

    format_tpoper(val) {
      return `${val.llave_tpoper} - ${val.descrip_tpoper.trim()}`;
    },

    format_agencias(val) {
      return `${val.codigo_agc} - ${val.descripcion_agc.trim()}`;
    },

    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true
      });
    }
  }
};
</script>
