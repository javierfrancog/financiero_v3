<template>
  <v-layout wrap justify-center class="pa-6" id="prfact01">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-flask-empty-plus-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Registro Laboratorio</v-list-item-title
              >
            </v-list-item-content>
            <v-col cols="3">
              <v-menu
                v-model="pickeFechaIni"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                @change="get_pesaje()"
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="fecha_ini"
                    label="Fecha Inicial"
                    append-icon="event"
                    hide-details
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="fecha_ini"
                  @input="pickeFechaIni = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="3">
              <v-menu
                v-model="pickerFechaFinal"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="fecha_final"
                    label="Fecha Final"
                    append-icon="event"
                    outlined
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="fecha_final"
                  @input="pickerFechaFinal = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                ref="menu"
                v-model="dialogPicker3"
                transition="scale-transition"
                offset-y
                min-width="290px"
                required
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Fecha Registro"
                    outlined
                    v-model="form.fecha"
                    hide-details
                    disabled
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha"
                  @input="dialogPicker3 = false"
                ></v-date-picker>
              </v-menu>
            </v-col> -->
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="10" sm="5">
                <v-autocomplete
                  label="Agencia"
                  v-model="form.punto_fact"
                  :items="agencias"
                  :item-text="format_punto_fact"
                  item-value="codigo_agc"
                  hide-details
                  outlined
                  clearable
                  return-object
                  @change="
                    get_pesaje();
                    errores.punto_fact = false;
                  "
                  :error="errores.punto_fact"
                ></v-autocomplete>
              </v-col>

              <v-col class="d-flex" cols="10" sm="5">
                <v-autocomplete
                  label="Consecutivo"
                  v-model="form.consecutivo"
                  :items="pesajes"
                  :item-text="format_consecutivo"
                  item-value="consecut_pes"
                  hide-details
                  outlined
                  clearable
                  @change="cargar_datos"
                  return-object
                  :error="errores.consecutivo"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="10" sm="2">
                <v-text-field
                  label="Placa"
                  v-model="form.placa"
                  hide-details
                  outlined
                  disabled
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="10" sm="5">
                <v-text-field
                  label="Tipo Operación"
                  v-model="form.tipo_oper"
                  hide-details
                  outlined
                  disabled
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Documento"
                  outlined
                  v-model="form.documento"
                  hide-details
                  disabled
                  type="text"
                  :error="errores.documento"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
                <v-text-field
                  label="Ciudad de Origen"
                  v-model="form.ciudad"
                  outlined
                  hide-details
                  disabled
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex" cols="12" sm="5">
                <v-text-field
                  label="Cliente/Proveedor"
                  v-model="form.proveedor"
                  outlined
                  hide-details
                  disabled
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="5">
                <v-text-field
                  label="Conductor"
                  v-model="form.conductor"
                  outlined
                  hide-details
                  disabled
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>

            <v-row class="d-flex">
              <v-col cols="2">
                <v-text-field
                  label="Peso Bruto"
                  outlined
                  hide-details
                  autocomplete="off"
                  v-model="form.pbruto"
                  height="80"
                  class="inputPesolab"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Destara"
                  outlined
                  hide-details
                  autocomplete="off"
                  v-model="form.destara"
                  height="80"
                  class="inputPesolab"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Empaques"
                  outlined
                  hide-details
                  autocomplete="off"
                  v-model="form.empaques"
                  height="80"
                  class="inputPesolab"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="Peso Neto"
                  outlined
                  hide-details
                  disabled
                  v-model="form.pneto"
                  height="80"
                  class="inputPesolab"
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  label="Kilos Compra"
                  outlined
                  hide-details
                  disabled
                  v-model="form.kgscompra"
                  height="80"
                  class="inputPesolab"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider color="#FF6F00"></v-divider>

            <v-row>
              <v-col>
                <v-card-subtitle
                  class="
                    subtitle-1
                    font-weight-medium
                    grey--text
                    text--darken-2
                    m0
                  "
                  >Detalle Productos/Servicios</v-card-subtitle
                >
              </v-col>
            </v-row>
            <div class="pa-0 px-0">
              <v-data-table
                :headers="tablaDetalle.headers"
                :items="tablaDetalle.data"
              >
                <template v-slot:body.append>
                  <td colspan="2" class="text-right text-h6">
                    <strong>TOTALES</strong>
                  </td>
                  <td class="text-center text-h6">
                    {{ formatNumero(tablaDetalle.totales.cantidad || 0) }}
                  </td>
                  <td class="text-center text-h6">
                    {{ formatNumero(tablaDetalle.totales.kilos || 0) }}
                  </td>
                  <td></td>
                </template>
              </v-data-table>
            </div>
            <v-divider color="#FF6F00"></v-divider>
            <v-row>
              <v-card-subtitle
                class="
                  subtitle-1
                  font-weight-medium
                  grey--text
                  text--darken-2
                  ma-0
                  mx-0
                "
                >Cierre de Proceso</v-card-subtitle
              >
              <v-col class="d-flex" cols="12" sm="2">
                <v-text-field
                  label="Humedad"
                  v-model="form.humedad"
                  outlined
                  hide-details
                  type="number"
                  @input="form.kcompra = null"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="2">
                <v-text-field
                  label="Impureza"
                  v-model="form.impureza"
                  outlined
                  hide-details
                  type="number"
                  @input="form.kcompra = null"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="2">
                <v-text-field
                  label="Grano Rojo"
                  v-model="form.grojo"
                  outlined
                  disabled
                  hide-details
                  type="number"
                  @input="form.kcompra = null"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="12" sm="2">
                <v-text-field
                  label="Grano Partido"
                  v-model="form.gpartido"
                  outlined
                  hide-details
                  type="number"
                  @input="form.kcompra = null"
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="12" sm="2">
                <v-text-field
                  label="Grano Yesado"
                  v-model="form.gyesado"
                  outlined
                  hide-details
                  type="number"
                  @input="form.kcompra = null"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="d-flex justify-center align-center"
                cols="12"
                sm="2"
              >
                <v-btn
                  @click="calcular_kilos"
                  depressed
                  color="blue darken-2"
                  class="white--text"
                  large
                  block
                >
                  Calcular
                </v-btn>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="Kilos Compra"
                  outlined
                  hide-details
                  v-model="form.kfcompra"
                  disabled
                  height="80"
                  type="text"
                  class="inputPeso"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" cols="4">
                <v-textarea
                  outlined
                  clearable
                  label="Observaciones"
                  v-model="form.observaciones"
                  hide-details
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-row class="d-flex justify-end col-12">
            <v-col class="pa-0 px-0 mr-6" sm="3">
              <v-btn
                color="green darken-1"
                class="white--text"
                block
                large
                depressed
                :loading="load.btn_enviar"
                :disabled="disabled.btn_enviar"
                @click="grabar_documento()"
                >Grabar Documento</v-btn
              >
            </v-col>
            <!-- <v-col class="pa-0 px-0" sm="3">
              <v-btn
                color="blue darken-1"
                class="white--text"
                block
                large
                depressed
                >Imprimir Documento</v-btn
              >
            </v-col> -->
          </v-row>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<style>
.inputPesolab {
  font-size: 44px !important;
}

.inputPeso input {
  max-height: initial !important;
  font-size: 60px !important;
}
</style>

<script>

import post from "../../methods.js";

export default {

  data() {
    return {
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),

      agencias: [],
      pesajes: [],
      load: {
        btn_enviar: false,
        impresion: false,
        consecutivo: false,
      },
      tablaDetalle: {
        headers: [
          {
            text: "Item",
            align: "center",
            value: "idItem",
          },
          {
            text: "Descripción",
            align: "left",
            value: "descripcion",
          },
          {
            text: "Cantidad",
            align: "center",
            value: "cantidad",
          },
          {
            text: "Kilos",
            align: "center",
            value: "kilos",
          },

          {
            text: " ",
            align: "center",
            value: "action",
          },
        ],
        data: [],
        totales: {},
      },
      form: {
        observaciones: null,
        ubicacion: null,
        punto_fact: null,
      },
      dialogo: {
        estado: false,
        tipo: false,
      },
      impresion: {
        disabled: true,
        consecutivo: null,
      },
      disabled: {
        btn_enviar: false,
      },
      errores: {
        punto_fact: false,
        consecutivo: false,
      },
      print: {
        comprobante: null,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      data_xml: null,
      dialogPicker: false,
      dialogPicker2: false,
      dialogPicker3: false,
      total_iva_format: null,
      subtotal_format: null,
    };
  },
  created() {
    this.get_empresa();
    this.cargarTablaAg();

    var $this = this;
    this.$watch(
      "tablaDetalle.data",
      (e) => {
        // $this.tablaDetalle.totales.total_descuentos = 0;
        $this.tablaDetalle.totales.cantidad = 0;
        $this.tablaDetalle.totales.kilos = 0;

        e.forEach((val) => {
          var cantidad = parseFloat(val.cantidad.replace(/\,/g, "")) || 0;
          var kilos = parseFloat(val.kilos.replace(/\,/g, "")) || 0;

          $this.tablaDetalle.totales.cantidad += cantidad;
          $this.tablaDetalle.totales.kilos += kilos;
        });
      },
      { deep: true }
    );
  },
  methods: {
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.datosEmpresa = data[0];
          let punto = this.datosEmpresa.ptoperfil_empr;
          let busqueda = this.agencias.find((el) => el.codigo_agc == punto);
          this.form.punto_fact = busqueda;
          this.get_pesaje();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    grabar_documento() {
      var data = this.form;
      var kilos = data.kfcompra;
      if (!kilos) {
        this.send_error("Debe Registrar el laboratorio!");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      let kiloscomp = parseInt(data.kfcompra.replace(/,/g, "").trim())
      if (kiloscomp < 1) {
        this.send_error(" Debe Calcular Kilos Compra!");
      } else {
        this.card_estado = true;
        var agencia = data.punto_fact.codigo_agc;
        var consecutivo = data.consecutivo.consecut_pes.trim();
        var humedad = data.humedad;
        var impureza = data.impureza;
        var gpartido = data.gpartido;
        var grojo = data.grojo;
        var gyesado = data.gyesado;
        var kcompra = data.kfcompra.replace(/,/g, "").trim();
        var descripcion = data.observaciones;
        let datos = {
          url: "Molinos/dlls/PrLaborat.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            consecutivo +
            "|" +
            humedad +
            "|" +
            impureza +
            "|" +
            gpartido +
            "|" +
            kcompra +
            "|" +
            descripcion +
            "|" +
            grojo +
            "|" +
            gyesado +
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
            this.reiniciar_formulario();
          })
          .catch((error) => {
            this.card_estado = false;
            this.send_error("Error al grabar Registro");
            console.log("Error al grabar Registro", error);
          });
      }
    },

    calcular_kilos() {
      console.log(this.form)
      let humedad = this.form.humedad || 0;
      let impureza = this.form.impureza || 0;
      let grano_partido = this.form.gpartido || 0;
      let grano_yeso = this.form.gyesado || 0;
      let grano_rojo = this.form.grojo || 0;
      let asociado = this.tablaDetalle.data[0].asociado || 0;
      let cliente = parseFloat(this.form.consecutivo.nit_pes.replace(/\,/g, ""));
      // let peso_neto = this.form.pneto.replace(/\,/g, "") || 0;
      let peso_neto = this.form.pneto.replace(/\,/g, "") || 0;

      post
        .postData({
          url: "Molinos/dlls/PrLaborat2.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            peso_neto +
            "|" +
            humedad +
            "|" +
            impureza +
            "|" +
            grano_partido +
            "|" +
            asociado +
            "|" +
            grano_rojo +
            "|" +
            grano_yeso +
            "|" +
            cliente +
            "|",
          method: "",
        })
        .then((data) => {
          let copia = JSON.parse(JSON.stringify(this.form));
          copia.kfcompra = data[0];

          this.form = copia;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al calcular Tabla",
            estado: true,
          });
        });
    },
    abrir_popup() {
      this.dialogo.estado = true;
      this.dialogo.tipo = true;
    },
    format_consecutivo(item) {
      return item.consecut_pes.trim() + " - " + item.rutpes_pes.trim();
    },

    reiniciar_formulario() {
      this.form.consecutivo = null;
      this.form.placa = null;
      this.form.tipo_oper = null;
      this.form.documento = null;
      this.form.ciudad = null;
      this.form.proveedor = null;
      this.form.conductor = null;
      this.form.pbruto = null;
      this.form.destara = null;
      this.form.empaques = null;
      this.form.pneto = null;
      this.form.kgscompra = null;
      this.form.humedad = null;
      this.form.impureza = null;            
      this.form.grojo = null;            
      this.form.gpartido = null;            
      this.form.gyesado = null;            
      this.form.kfcompra = null;            
      this.form.observaciones = null;            
      this.tablaDetalle.data = [];
    },
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    cargar_datos() {
      var item = this.form.consecutivo;
      this.form.tipo_oper = item.nombredoc_pes;
      this.form.proveedor = item.rutpes_pes.trim();
      this.form.placa = item.placa_pes;
      this.form.conductor = item.conductor_pes.trim();
      this.form.documento = item.docext_pes.trim();
      this.form.ciudad = item.ciudad_pes.trim();
      this.form.pbruto = item.registros[0].pesoini_pes.trim();
      this.form.destara = item.registros[0].pesodes_pes.trim();
      this.form.pneto = item.registros[0].pesoneto_pes.trim();
      this.form.empaques = item.empaques_pes.trim();      
      this.form.kgscompra = item.registros[0].pesocomp_pes.trim();
      this.form.fecha = item.fechacorta_pes.trim();
      this.form.humedad = item.registros[0].humini_pes.trim();
      this.form.impureza = item.registros[0].impini_pes.trim();
      this.form.gpartido = item.registros[0].gpart_pes.trim();
      this.form.grojo = item.registros[0].rojoini_pes.trim();
      this.form.gyesado = item.registros[0].yesoini_pes.trim();
      this.form.kgscompra = item.registros[0].pesocomp_pes.trim();
      this.form.kfcompra = "0";

      let nuevo_detalle = [];

      item.registros.pop();
      item.registros.forEach((el, index) => {
        let obj = {
          idItem: index + 1,
          descripcion: el.producto_pes.trim(),
          cantidad: el.cantidad_pes.trim(),
          kilos: el.pesoneto_pes.trim(),
          asociado: el.asociado_pes,
        };
        nuevo_detalle.push(obj);
      });

      this.tablaDetalle.data = nuevo_detalle;
    },
    get_pesaje() {
      var $this = this;
      var agencia = this.form.punto_fact;
      let fechaini = this.fecha_ini.replace(/\-/g, "");
      let fechafin = this.fecha_final.replace(/\-/g, "");

      if (agencia) {
        this.load.consecutivo = true;
        post
          .postData({
            url: "Molinos/dlls/PrPesajeJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              agencia.codigo_agc +
              "|" +
              "3" +
              "|" +
              "0" +
              "|" +
              fechaini +
              "|" +
              fechafin +
              "|",
            method: "POST",
          })
          .then((data) => {
            this.load.consecutivo = false;
            let dataParse = JSON.parse(JSON.stringify(data));
            data = dataParse.map((item) => {
              item.registros = item.registros.map((el) => {
                el.producto_pes = el.base1_pr
                  ? window.atob(
                      el.base1_pr.trim() +
                        el.base2_pr.trim() +
                        el.base3_pr.trim() +
                        el.base4_pr.trim() +
                        el.base5_pr.trim()
                    )
                  : el.producto_pes;
                return el;
              });

              return item;
            });
            this.pesajes = data;
          })
          .catch((err) => {
            this.load.consecutivo = false;
            console.error("Error: ", err);
            $this.$emit("snack", {
              color: "error",
              text: "Error al cargar pesajes: " + err.Mensaje[0].Error,
              estado: true,
            });
          });
      }
    },
    clear_form() {
      this.articulo_select = {
        valor: 0,
        cantidad: 0,
        subtotal: 0,
      };
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },

    calcularSubtotal() {
      var item = this.articulo_select;
      var valorFormat =
        parseFloat(item.valor.toString().replace(/\,/g, "")) || 0;
      this.articulo_select.valor = this.formatNumero(valorFormat);

      var iva = parseInt(item.producto.tiva_pr) / 100;

      // var subtotal = item.subtotal;
      // var subtotal = valorFormat - ivaTotal;
      var subtotal = valorFormat;
      var descuento =
        parseFloat(item.descuento.toString().replace(/\,/g, "")) || 0;
      var valorDescuento = subtotal * (descuento / 100);
      var subValor = subtotal - valorDescuento;

      var valorIva = (subValor * iva).toFixed(0);
      // var valor = subValor + parseFloat(valorIva);
      var valor = subValor;

      var cantidad = parseFloat(item.cantidad) || 0;

      var total = valor * cantidad;

      this.articulo_select.descuento = descuento;
      this.articulo_select.cantidad = cantidad;
      this.articulo_select.ivaTotal = this.formatNumero(valorIva);
      this.articulo_select.valorDescuento = this.formatNumero(valorDescuento);
      this.articulo_select.total = this.formatNumero(total);
      this.articulo_select.subtotal = subtotal;
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
