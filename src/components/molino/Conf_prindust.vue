<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1200"
        elevation="13"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-cog-transfer-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Productos para Proceso Industrial</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="d-flex" cols="12" sm="4">
                <v-switch
                  v-model="form.soloind"
                  label="Solo Proceso Industrial"
                ></v-switch>
              </v-col>
              <v-btn
                color="indigo"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="cargarcontenido"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="index"
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
                        <th>Cod.Barras</th>
                        <th>Venta</th>
                        <th>Consumo</th>
                        <th>Ppe</th>
                        <th>Impoconsumo</th>
                        <th>F.Creacion</th>

                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.barras_pr }}</td>
                        <td>{{ item.vta_pr }}</td>
                        <td>{{ item.consumo_pr }}</td>
                        <td>{{ item.ppe_pr }}</td>
                        <td>{{ item.timpocons_pr }}</td>
                        <td>{{ item.f_crea_pr }}</td>

                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>
              <!-- <template v-slot:item.descripcion_completa="{ item }">
                {{ item.descripcion_pr }} {{ item.descripcion2_pr }}
              </template> -->

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
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Información Básica</v-tab>
            <v-tab>Precios de Referencia</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="4">
                    <v-text-field
                      label="Codigo"
                      clearable
                      outlined
                      type="text"
                      required
                      counter="15"
                      disabled
                      v-model="form.codigo"
                      :error="errores.codigo"
                      @input="errores.codigo = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="8" sm="6">
                    <v-autocomplete
                      label="Clasificación"
                      v-model="form.clasifica"
                      :items="clasifica"
                      :item-text="format_clasifica"
                      item-value="codigo_clas"
                      outlined
                      hide-details
                      :error="errores.clasifica"
                      @change="errores.clasifica = false"
                    ></v-autocomplete>
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
                <v-divider color="#FF6F00"></v-divider>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="[
                        { text: 'Unidad', value: 1 },
                        { text: 'Caja', value: 2 },
                        { text: 'Bolsa', value: 3 },
                        { text: 'Kilo', value: 4 },
                        { text: 'Bulto', value: 5 },
                        { text: 'Paquete', value: 6 },
                        { text: 'Hectárea', value: 7 },
                      ]"
                      label="Empaque"
                      outlined
                      clearable
                      hide-details
                      v-model="form.empaque"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="2">
                    <v-text-field
                      label="Cantidad"
                      clearable
                      outlined
                      type="numeric"
                      required
                      v-model="form.cantempaque"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-select
                      :items="[
                        { text: 'Arroz Paddy Verde', value: 1 },
                        { text: 'Arroz Paddy Seco', value: 2 },
                        { text: 'Arroz Blanco', value: 3 },
                        { text: 'Arroz Empaquetado', value: 4 },
                        { text: 'Subproducto de Arroz', value: 5 },
                        { text: 'Soya Verde', value: 6 },
                        { text: 'Soya Seca', value: 7 },
                        { text: 'Maiz', value: 8 },
                        { text: 'No Aplica', value: 0 },
                      ]"
                      label="Asociado a:"
                      outlined
                      clearable
                      hide-details
                      v-model="form.asociado"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row sm="12" no-gutters>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      label="Producto Destino"
                      :items="productos"
                      outlined
                      clearable
                      return-object
                      required
                      item-value="codigo_pr"
                      v-model="form.prodest"
                      :item-text="format_productos"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-col class="d-flex" cols="2">
                    <p class="Heading 3 ml-4 mt-4">-Enero</p>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Precio Venta"
                      clearable
                      :value="formatNumero(form.mes1)"
                      @input="input_mask('mes1')"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-divider vertical></v-divider>                  
                  <v-col class="d-flex" cols="2">
                    <p class="Heading 3 ml-4 mt-4">-Febrero</p>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Precio Venta"
                      clearable
                      :value="formatNumero(form.mes2)"
                      @input="input_mask('mes2')"
                      hide-details
                    ></v-text-field>
                  </v-col>

                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="2">
                    <p class="Heading 3 ml-4 mt-4">-Marzo</p>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Precio Venta"
                      clearable
                      :value="formatNumero(form.mes3)"
                      @input="input_mask('mes3')"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-divider vertical></v-divider>                  
                  <v-col class="d-flex" cols="2">
                    <p class="Heading 3 ml-4 mt-4">-Abril</p>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Precio Venta"
                      clearable
                      :value="formatNumero(form.mes4)"
                      @input="input_mask('mes4')"
                      hide-details
                    ></v-text-field>
                  </v-col>

                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="2">
                    <p class="Heading 3 ml-4 mt-4">-Mayo</p>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Precio Venta"
                      clearable
                      :value="formatNumero(form.mes5)"
                      @input="input_mask('mes5')"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-divider vertical></v-divider>                  
                  <v-col class="d-flex" cols="2">
                    <p class="Heading 3 ml-4 mt-4">-Junio</p>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Precio Venta"
                      clearable
                      :value="formatNumero(form.mes6)"
                      @input="input_mask('mes6')"
                      hide-details
                    ></v-text-field>
                  </v-col>

                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="2">
                    <p class="Heading 3 ml-4 mt-4">-Julio</p>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Precio Venta"
                      clearable
                      :value="formatNumero(form.mes7)"
                      @input="input_mask('mes7')"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-divider vertical></v-divider>                  
                  <v-col class="d-flex" cols="2">
                    <p class="Heading 3 ml-4 mt-4">-Agosto</p>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Precio Venta"
                      clearable
                      :value="formatNumero(form.mes8)"
                      @input="input_mask('mes8')"
                      hide-details
                    ></v-text-field>
                  </v-col>

                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="2">
                    <p class="Heading 3 ml-4 mt-4">-Septiembre</p>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Precio Venta"
                      clearable
                      :value="formatNumero(form.mes9)"
                      @input="input_mask('mes9')"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-divider vertical></v-divider>                  
                  <v-col class="d-flex" cols="2">
                    <p class="Heading 3 ml-4 mt-4">-Octubre</p>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Precio Venta"
                      clearable
                      :value="formatNumero(form.mes10)"
                      @input="input_mask('mes10')"
                      hide-details
                    ></v-text-field>
                  </v-col>

                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="2">
                    <p class="Heading 3 ml-4 mt-4">-Noviembre</p>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Precio Venta"
                      clearable
                      :value="formatNumero(form.mes11)"
                      @input="input_mask('mes11')"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-divider vertical></v-divider>                  
                  <v-col class="d-flex" cols="2">
                    <p class="Heading 3 ml-4 mt-4">-Diciembre</p>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Precio Venta"
                      clearable
                      :value="formatNumero(form.mes12)"
                      @input="input_mask('mes12')"
                      hide-details
                    ></v-text-field>
                  </v-col>

                </v-row>
                
              </v-card>
            </v-tab-item>
          </v-tabs-items>
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
      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      clasifica: [],
      productos: [],
      datosctas: [],
      datosEmpresa: [],
      tablaccosto: [],
      tab: 0,
      search: null,
      form: {
        soloind: true,
      },
      error: {
        ccosto: false,
      },

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "left", value: "codigo_pr" },
        { text: "Descripción", align: "left", value: "descripcion_completa" },
        { text: "Asociado a:", align: "left", value: "descrasoc_pr" },
        { text: "Estado", align: "center", value: "estado" },

        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();
    this.cargarcontenido();
    this.get_productos();
    this.cargarTablaclasifica();
  },
  computed: {},
  methods: {
    filtrarTabla(value, search, item) {
      return true;
    },
    input_mask(index, callback) {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");

      this.$set(this.form, index, val_edit);
      if (callback) callback();
    },
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    get_productos() {
      post
        .postData({
          url: "Ptovta/dlls/CfProductosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          var data_parse = JSON.parse(JSON.stringify(data));
          let descripcion64 = " ";

          data_parse.map((el, index) => {
            descripcion64 = window.atob(
              el.base1_pr.trim() +
                el.base2_pr.trim() +
                el.base3_pr.trim() +
                el.base4_pr.trim() +
                el.base5_pr.trim() +
                el.base6_pr.trim() +
                el.base7_pr.trim() +
                el.base8_pr.trim() +
                el.base9_pr.trim() +
                el.base10_pr.trim()
            );
            if (descripcion64) {
              el.descripcion_completa = descripcion64;
            } else {
              el.descripcion_completa =
                el.descripcion_pr.trim() + " " + el.descripcion2_pr.trim();
              el.descripcion_pr = el.descripcion_pr.trim();
              el.descripcion2_pr = el.descripcion2_pr.trim();
              el.index = index;
            }
            return el;
          });
          this.productos = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar los productos",
            estado: true,
          });
        });
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.codigo = item.codigo_pr.trim();
      this.form.descripcion = `${item.descripcion_completa.trim()} `;
      this.form.clasifica = item.clasifica_pr;
      this.form.asociado = parseInt(item.asociado_pr);
      this.form.empaque = parseInt(item.empaque_pr);
      this.form.cantempaque = item.unidad_pr.trim();
      this.form.estado = item.estado_pr;
      var busqueda_prdest = this.productos.find(
        (el) => el.codigo_pr.trim() == item.codest_pr.trim()
      );
      this.form.prodest = busqueda_prdest;
      this.form.mes1 = item.mes1_pr;
      this.form.mes2 = item.mes2_pr;
      this.form.mes3 = item.mes3_pr;
      this.form.mes4 = item.mes4_pr;
      this.form.mes5 = item.mes5_pr;
      this.form.mes6 = item.mes6_pr;
      this.form.mes7 = item.mes7_pr;
      this.form.mes8 = item.mes8_pr;
      this.form.mes9 = item.mes9_pr;
      this.form.mes10 = item.mes10_pr;
      this.form.mes11 = item.mes11_pr;
      this.form.mes12 = item.mes12_pr;                                                                  
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
      var clasifica = data.clasifica || "0";
      var descripcion = data.descripcion;
      var cantempaque = data.cantempaque;
      var empaque = data.empaque;
      var asociado = data.asociado || "0";      
      var prdest = data.prodest.codigo_pr || "0";
      let pmes1 = data.mes1 || 0;
      let pmes2 = data.mes2 || 0;
      let pmes3 = data.mes3 || 0;
      let pmes4 = data.mes4 || 0;
      let pmes5 = data.mes5 || 0;
      let pmes6 = data.mes6 || 0;
      let pmes7 = data.mes7 || 0;
      let pmes8 = data.mes8 || 0;
      let pmes9 = data.mes9 || 0;
      let pmes10 = data.mes10 || 0;
      let pmes11 = data.mes11 || 0;
      let pmes12 = data.mes12 || 0;
      let datos = {
        url: "Molinos/dlls/CfProdind.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          clasifica +
          "|" +
          descripcion +
          "|" +
          cantempaque +
          "|" +
          empaque +
          "|" +
          asociado +
          "|" +
          prdest +
          "|" +
          pmes1 +
          "|" +
          pmes2 +
          "|" +
          pmes3 +
          "|" +
          pmes4+
          "|" +
          pmes5 +
          "|" +
          pmes6 +
          "|" +
          pmes7 +
          "|" +
          pmes8 +
          "|" +
          pmes9 +
          "|" +
          pmes10 +
          "|" +
          pmes11 +
          "|" +
          pmes12 +
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
    init_form() {
      this.form = {
        codigo: null,
        clasifica: null,
        descripcion: null,
        barras: null,
        vta: false,
        consumo: null,
        ppe: null,
        tariva: null,
        tarcons: null,
        basevta: null,
        eliminar: false,
      };

      this.errores = {
        codigo: false,
        clasifica: false,
        descripcion: false,
      };
    },
    format_ctas(val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    format_productos(val) {
      return `${val.codigo_pr.trim()} - ${val.descripcion_completa.trim()}`;
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    cargarTablaclasifica: function () {
      post
        .postData({
          url: "Financiero/dlls/CfClasificaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clasifica = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clasificación",
            estado: true,
          });
        });
    },
    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
    },
    format_clasifica(val) {
      return `${val.codigo_clas} - ${val.descripcion_clas}`;
    },
    cargarcontenido() {
      this.loader = true;
      var soloind = this.form.soloind ? "1" : "0";

      post
        .postData({
          url: "Molinos/dlls/CfProdindJ.dll",
          data: sessionStorage.Sesion + "|" + soloind + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          var data_parse = JSON.parse(JSON.stringify(data));
          let descripcion64 = " ";

          data_parse.map((el, index) => {
            descripcion64 = window.atob(
              el.base1_pr.trim() +
                el.base2_pr.trim() +
                el.base3_pr.trim() +
                el.base4_pr.trim() +
                el.base5_pr.trim()
            );
            if (descripcion64) {
              el.descripcion_completa = descripcion64;
            } else {
              el.descripcion_completa =
                el.descripcion_pr.trim() + " " + el.descripcion2_pr.trim();
              el.descripcion_pr = el.descripcion_pr.trim();
              el.descripcion2_pr = el.descripcion2_pr.trim();
              el.index = index;
            }
            return el;
          });

          this.contenido = data_parse;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar productos",
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
