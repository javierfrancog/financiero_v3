<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" elevation="13" :style="styleObject">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-cart-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Productos</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-col class="d-flex">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  large
                  depressed
                  @click="agregar_item()"
                >
                  Agregar
                  <v-icon right dark class="ml-4">mdi-cart-plus</v-icon>
                </v-btn>
              </v-col>
              <v-col class="d-flex">
                <v-btn
                  color="success"
                  class="ma-2 white--text"
                  large
                  depressed
                  :disabled="contenido.length == 0"
                  @click="get_data_excel"
                >
                  Imprimir excel
                  <v-icon right dark class="ml-4">mdi-file-excel-box</v-icon>
                </v-btn>
              </v-col>
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
              item-key="index"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <!-- <thead>
                      <tr>
                        <th>Cod.Barras</th>
                        <th>Venta</th>
                        <th>Consumo</th>
                        <th>Ppe</th>
                        <th>Impoconsumo</th>
                        <th>F.Creacion</th>

                        <th>Estado</th>
                      </tr>
                    </thead> -->
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
              <template v-slot:item.conecta_pr="{ item }">
                {{ item.conecta_pr == "1" ? "No" : "Si" }}
              </template>
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
      <flower-spinner :animation-duration="1500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Información Básica</v-tab>
            <v-tab>Información Contable</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 d-flex">
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
                  <v-col class="d-flex" cols="4">
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
                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      label="Marca"
                      v-model="form.marcas"
                      :items="marcas"
                      :item-text="format_marcas"
                      item-value="cod_rep"
                      outlined
                      return-object
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="8" sm="8">
                    <v-textarea
                      label="Descripción"
                      clearable
                      outlined
                      required
                      v-model="form.descripcion"
                      :error="errores.descripcion"
                      @input="errores.descripcion = false"
                      hide-details
                    ></v-textarea>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Código Barras"
                      clearable
                      outlined
                      type="text"
                      v-model="form.barras"
                      counter="15"
                      max
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-switch
                      v-model="form.vta"
                      label="Activar Venta"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-switch
                      v-model="form.consumo"
                      hide-details
                      label="Consumo Interno"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-switch
                      v-model="form.ppe"
                      hide-details
                      label="Propiedad, Planta y Equipo"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-switch
                      v-model="form.invent"
                      hide-details
                      label="Conecta Inventarios"
                    ></v-switch>
                  </v-col>
                </v-row>
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
                        { text: 'Metro', value: 8 },
                        { text: 'Dias', value: 9 },
                        { text: 'Mes', value: 10 },
                        { text: 'Hora', value: 11 },
                        { text: 'Kilometro', value: 12 },
                      ]"
                      label="Empaque"
                      outlined
                      clearable
                      hide-details
                      v-model="form.empaque"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Cantidad"
                      clearable
                      outlined
                      type="numeric"
                      required
                      v-model="form.cantempaque"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col
                    class="d-flex"
                    cols="12"
                    sm="3"
                    v-if="this.datosEmpresa.tipoempresa_empr == '05'"
                  >
                    <v-select
                      :items="[
                        { text: 'Arroz Paddy', value: 1 },
                        { text: 'Maiz', value: 2 },
                        { text: 'Soya', value: 3 },
                        { text: 'Sorgo', value: 4 },
                        { text: 'Algodón', value: 5 },

                        { text: 'No aplica', value: 0 },
                      ]"
                      label="Asociado a:"
                      outlined
                      clearable
                      hide-details
                      v-model="form.asociado"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Factor Cant"
                      clearable
                      outlined
                      type="numeric"
                      required
                      v-model="form.factorcant"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider color="#FF6F00"></v-divider>

                <v-row>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-select
                      :items="[
                        { text: 'Iva 19%', value: 19 },
                        { text: 'Iva 16%', value: 16 },
                        { text: 'Iva 5%', value: 5 },
                        { text: 'Iva Exento 0%', value: 0 },
                        { text: 'Iva Excluido', value: 99 },
                      ]"
                      label="Tarifa Iva"
                      outlined
                      clearable
                      hide-details
                      v-model="form.tariva"
                      required
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-select
                      :items="[
                        { text: '0%', value: 0 },
                        { text: '8%', value: 8 },
                        { text: '16%', value: 16 },
                      ]"
                      label="Impoconsumo"
                      outlined
                      clearable
                      hide-details
                      v-model="form.tarcons"
                      required
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Base Venta (iva incluido)"
                      clearable
                      outlined
                      type="numeric"
                      required
                      hide-details
                      v-model="form.basevta"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="mt-1 d-flex">
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      label="Cuenta Ventas"
                      v-model="form.ctavtas"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      label="Cuenta Iva Ventas(opcional)"
                      v-model="form.ivavtas"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      label="Cuenta Compras"
                      v-model="form.ctacompra"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      label="Cuenta Costo"
                      v-model="form.ctacosto"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex pb-0" cols="4">
                    <v-autocomplete
                      label="Centro de costos"
                      v-model="form.ccosto"
                      :items="tablaccosto"
                      :item-text="format_ccosto"
                      item-value="llavecentro_cost"
                      hide-details
                      return-object
                      outlined
                      :error="error.ccosto"
                      @change="error.ccosto = false"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      label="Débito Depreciación"
                      v-model="form.debdeprec"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-autocomplete
                      label="Crédito Depreciación"
                      v-model="form.credeprec"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-text-field
                      label="Vida Util (Meses)"
                      clearable
                      outlined
                      type="numeric"
                      required
                      v-model="form.vida"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <!-- <v-row sm="12" no-gutters>
              <v-col>
                <v-autocomplete
                  label="Producto Cargue Inventarios"
                  :items="productos"
                  outlined
                  clearable
                  return-object
                  hide-details
                  persistent-hint
                  item-value="codigo_pr"
                  v-model="form.producto"
                  :item-text="format_productos"
                ></v-autocomplete>
              </v-col>
            </v-row>      -->

          <v-divider color="#FF6F00"></v-divider>
          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.bloquear" label="Bloquear"></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="light-blue accent-4 white--text"
            class
            @click="cargarTablactas()"
            depressed
            small
          >
            <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
          </v-btn>
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
      marcas: [],
      datosctas: [],
      productos: [],
      datosEmpresa: [],
      tablaccosto: [],
      tab: 0,
      search: null,
      form: {
        invent: null,
        marcas: null,
      },
      error: {
        ccosto: false,
      },

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Opciones", value: "edit", align: "center" },
        { text: "Codigo", align: "left", value: "codigo_pr" },
        { text: "Descripción", align: "left", value: "descripcion_completa" },
        { text: "Clasificación", align: "left", value: "descrip_clasif_pr" },
        { text: "% Iva", align: "center", value: "tiva_pr" },
        { text: "Conecta Inv.", align: "center", value: "conecta_pr" },
        { text: "Cta Compra", align: "left", value: "ctacompras_pr" },
        { text: " ", align: "left", value: "_" },
        { text: "Cta Venta", align: "left", value: "ctavtas_pr" },
        { text: " ", align: "left", value: "_" },
        { text: "Cta Costo", align: "left", value: "ctacosto_pr" },
        { text: " ", align: "left", value: "_" },
        // { text: "Codigo Barras", align: "center", value: "barras_pr" },
        { text: "Estado", align: "center", value: "estado" },
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
    this.cargarTablactas();
    this.cargarTablaclasifica();
    this.cargarTablaccostos();
    this.get_marcas();
  },
  computed: {},
  methods: {
    filtrarTabla(value, search, item) {
      return true;
    },
    cargarTablaccostos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfcostosJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaccosto = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Centro Costos");
        });
    },
    get_marcas() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfMarcasJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.marcas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clasificaciones",
            estado: true,
          });
        });
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
          this.cargarcontenido();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    format_productos(val) {
      return `${val.base1_pr.trim()}`;
    },
    editar_item(data) {
      let codigo = data.codigo_pr;
      post
        .postData({
          url: "PtoVta/dlls/CfProductos01J.dll",
          data: sessionStorage.Sesion + "|" + codigo + "|",
          method: "",
        })
        .then((data) => {
          let descripcion = "";
          var item = JSON.parse(JSON.stringify(data[0]));
          let descripcion64 = window.atob(
            item.base1_pr.trim() +
              item.base2_pr.trim() +
              item.base3_pr.trim() +
              item.base4_pr.trim() +
              item.base5_pr.trim() +
              item.base6_pr.trim() +
              item.base7_pr.trim() +
              item.base8_pr.trim() +
              item.base9_pr.trim() +
              item.base10_pr.trim()
          );
          if (descripcion64) {
            descripcion = descripcion64;
          } else {
            descripcion = `${item.descripcion_pr.trim()} ${item.descripcion2_pr.trim()} ${item.descripcion3_pr.trim()} ${item.descripcion4_pr.trim()}`;
          }
          // let descripcion = `${item.descripcion_pr.trim()} ${item.descripcion2_pr.trim()} ${item.descripcion3_pr.trim()} ${item.descripcion4_pr.trim()}`
          this.dialogo.estado = true;
          this.dialogo.titulo = "Modificar Registro";
          this.dialogo.tipo = 1;
          this.form.codigo = item.codigo_pr.trim();
          this.form.descripcion = descripcion.trim();
          this.form.clasifica = item.clasifica_pr;
          this.form.barras = item.barras_pr.trim();
          this.form.vta = parseInt(item.vta_pr);
          this.form.consumo = parseInt(item.consumo_pr);
          this.form.ppe = parseInt(item.ppe_pr);
          if (parseInt(item.inv_pr) == 0) {
            this.form.invent = true;
          }
          this.form.tariva = parseInt(item.tiva_pr);
          this.form.tarcons = parseInt(item.timpocons_pr);
          this.form.basevta = item.bventa_pr.trim() || 0;
          this.form.ctavtas = item.ctavtas_pr;
          this.form.asociado = parseInt(item.asociado_pr);
          this.form.ctacosto = item.ctacosto_pr;
          this.form.ctacompra = item.ctacompras_pr;
          this.form.ctacompra = item.ctacompras_pr;
          this.form.debdeprec = item.ctadebdeprec_pr;
          this.form.ivavtas = item.ctaivavtas_pr;
          this.form.empaque = parseInt(item.empaque_pr);
          this.form.cantempaque = item.unidad_pr.trim();
          this.form.factorcant = item.factorcant_pr.trim();

          this.form.vida = item.vidaut_pr.trim();
          this.form.estado = item.estado_pr;

          var ccosto = this.tablaccosto.find(
            (el) => el.llavecentro_cost == item.ccosto_pr
          );
          this.form.ccosto = ccosto;

          var marca = this.marcas.find((el) => el.cod_rep == item.marca_pr);
          this.form.marcas = marca;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar lista de precios",
            estado: true,
          });
        });

      // var busqueda_vta = this.datosctas.find(
      //   (el) => el.vtas_puc == item.ctadeb_conc
      // );
      // var busqueda_cons = this.datosctas.find(
      //   (el) => el.cons_puc == item.ctacre_conc
      // );
      // var busqueda_compras = this.datosctas.find(
      //   (el) => el.compras_puc == item.ctaret_conc
      // );
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
    async format_envio(data) {
      this.card_estado = true;
      var codigo = data.codigo;
      var clasifica = data.clasifica || "0";
      let descr_producto = data.descripcion.replace(/(\r\n|\n|\r)/gm, "");
      let descripb64 = await this.enviar_tabla(descr_producto);
      var descripcion = data.descripcion ? descr_producto : "";
      // var descripcion = data.descripcion  ? data.descripcion : '';
      var barras = data.barras || "";
      var vta = data.vta ? "1" : "0";
      var consumo = data.consumo ? "1" : "0";
      var ppe = data.ppe ? "1" : "0";
      var cantempaque = data.cantempaque;
      var factorcant = data.factorcant || "0";
      var empaque = data.empaque;
      var inv = data.invent ? "0" : "1";
      var tariva = data.tariva || "0";
      var tarcons = data.tarcons || "0";
      var basevta = data.basevta || "0";
      var asociado = data.asociado || "0";
      var bloquear = data.bloquear ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";
      var marca = data.marcas ? data.marcas.cod_rep : "0000";
      var ctavtas = data.ctavtas ? data.ctavtas : "9999999999";
      var ctacosto = data.ctacosto ? data.ctacosto : "9999999999";
      var ctacompra = data.ctacompra ? data.ctacompra : "9999999999";
      let ctadebdepr = data.debdeprec ? data.debdeprec : "9999999999";
      let ctacredepr = data.credeprec ? data.credeprec : "9999999999";
      let ivavtas = data.ivavtas ? data.ivavtas : "";

      let vida = data.vida ? data.vida.trim() : "0";
      var ccosto = data.ccosto ? data.ccosto.llavecentro_cost : "1001";
      post
        .postData({
          url: "Ptovta/dlls/CfProductos.dll",
          data: {
            importarhtml:
              sessionStorage.Sesion +
              "|" +
              codigo +
              "|" +
              clasifica +
              "|" +
              descripcion +
              "|" +
              barras +
              "|" +
              vta +
              "|" +
              consumo +
              "|" +
              ppe +
              "|" +
              tariva +
              "|" +
              tarcons +
              "|" +
              basevta +
              "|" +
              ctavtas +
              "|" +
              ctacosto +
              "|" +
              ctacompra +
              "|" +
              inv +
              "|" +
              cantempaque +
              "|" +
              empaque +
              "|" +
              ccosto +
              "|" +
              bloquear +
              "|" +
              eliminar +
              "|" +
              asociado +
              "|" +
              descripcion +
              "|" +
              vida +
              "|" +
              ctadebdepr +
              "|" +
              ctacredepr +
              "|" +
              factorcant +
              "|" +
              ivavtas +
              "|" +
              marca +
              "|",
            ...descripb64,
          },
          json: true,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true,
          });
          this.dialogo.estado = false;
          this.loader = true;
          this.init_form();
          this.carguejson();
          this.cargueproductosjson();
        })
        .catch((error) => {
          console.log(error);
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    },
    enviar_tabla(descripcion) {
      return new Promise((res) => {
        let tablajson = {};

        let format_index = "001";
        let textob64 = window.btoa(unescape(encodeURIComponent(descripcion)));

        tablajson[`DATOJ-${format_index}`] = `${textob64}|`;

        res(tablajson);
      });
    },
    async carguejson() {
      var lista = "0001";
      return post
        .postData({
          url: "Financiero/dlls/CflistasJson.dll",
          data: sessionStorage.Sesion + "|" + lista + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.card_estado = false;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar lista de precios",
            estado: true,
          });
        });
    },
    async cargueproductosjson() {
      return post
        .postData({
          url: "PtoVta/dlls/CfProducJson.dll",
          data: sessionStorage.Sesion + "|" + 0 + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.cargarcontenido();
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar lista de precios",
            estado: true,
          });
        });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");

      let busqueda_ccosto = this.tablaccosto.find(
        (el) => el.llavecentro_cost == "1001"
      );
      this.form.ccosto = busqueda_ccosto;
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
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
    format_marcas: function (val) {
      return `${val.descrip_rep}`;
    },
    format_clasifica(val) {
      return `${val.codigo_clas} - ${val.descripcion_clas}`;
    },
    cargarcontenido() {
      this.loader = true;
      let ciudad = this.datosEmpresa.codciudad_empr;
      let id = this.datosEmpresa.id_empr;
      let ruta = "Datos/" + ciudad + "/" + id + "/PRODUCTOS.JSON";
      post
        .postData({
          url: ruta,
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.loader = false;
          var data_parse = data.productos;
          data_parse.pop();
          let descripcion64 = " ";
          let textob64 = "";

          data_parse.map((el, index) => {
            if (el.base1_pr) {
              textob64 =
                el.base1_pr.trim() +
                el.base2_pr.trim() +
                el.base3_pr.trim() +
                el.base4_pr.trim() +
                el.base5_pr.trim() +
                el.base6_pr.trim() +
                el.base6a_pr.trim() +
                el.base7_pr.trim() +
                el.base8_pr.trim() +
                el.base9_pr.trim() +
                el.base10_pr.trim();
              // console.log("texto64", textob64);
            }
            try {
              this.error = "";
              descripcion64 = this.decode_uno(textob64);
            } catch (err) {
              descripcion64 = this.decode_dos(textob64);
            }

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
          console.log("Error Json:", err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar productos json",
            estado: true,
          });
        });
    },
    get_data_excel() {
      this.loader = true;
      var data_parse = [];
      post
        .postData({
          url: "Ptovta/dlls/CfProductosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          var data_excel = JSON.parse(JSON.stringify(data));
          this.print_reporte_excel(data_excel);
        });
    },
    print_reporte_excel(data_excel) {
      var data = data_excel;
      var data_parse = [];
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.bventa_pr = parseFloat(el.bventa_pr.replace(/\,/g, "")) || 0;
        if (copia.base1_pr.trim()) {
          copia.descripcion_pr = window.atob(
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
        }

        data_parse.push(copia);
      });
      var columnas = [
        {
          title: "Codigo",
          value: "codigo_pr",
          format: "string",
        },
        {
          title: "Descripción",
          value: "descripcion_pr",
          format: "string",
          
        },
        {
          title: "Clasificación",
          value: "descrip_clasif_pr",
          format: "string",
        },
        {
          title: "% Iva",
          value: "tiva_pr",
        },
        {
          title: "% Impoconsumo",
          value: "timpocons_pr",
        },
        {
          title: "Base Venta",
          value: "bventa_pr",
          format: "money",
        },
        {
          title: "Cuenta Compras",
          value: "ctacompras_pr",
        },
        {
          title: "Cuenta Ventas",
          value: "ctacompras_pr",
        },
        {
          title: "Cuenta Costo",
          value: "ctacosto_pr",
        },
        {
          title: "Codigo Barras",
          value: "barras_pr",
          format: "string",
        },
        {
          title: "Centro de Costos",
          value: "ccosto_pr",
        },
        {
          title: "Venta",
          value: "vta_pr",
        },
        {
          title: "Consumo Interno",
          value: "consumo_pr",
        },
        {
          title: "Conecta Inventarios",
          value: "inv_pr",
        },
        {
          title: "PPE",
          value: "ppe_pr",
        },
        {
          title: "Débito Depreciación",
          value: "ctadebdeprec_pr",
        },
        {
          title: "Crédito Depreciación",
          value: "ctacredeprec_pr",
        },
        {
          title: "Vida Util",
          value: "vidaut_pr",
        },
        {
          title: "Empaque",
          value: "empaque_pr",
        },
        {
          title: "Cant.Empaque",
          value: "unidad_pr",
        },
        {
          title: "Asociado",
          value: "asociado_pr",
        },
        {
          title: "Factor",
          value: "factorcant_pr",
        },
        {
          title: "Estado",
          value: "estado_pr",
        },
      ];

      var header_format = [{ text: "REPORTE PRODUCTOS", bold: true, size: 16 }];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Reporte Productos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-PRODUCTOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.datosctas = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cuentas Contables",
            estado: true,
          });
        });
    },
    decode_uno(base64) {
      return decodeURIComponent(escape(atob(base64)));
    },
    decode_dos(base64) {
      return atob(base64);
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
