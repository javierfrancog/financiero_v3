<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-human-capacity-increase</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Generar Facturación</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-row>
          <v-col class="d-flex" cols="3">
            <v-menu
              v-model="pickerMes"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fecha"
                  label="Periodo"
                  append-icon="event"
                  hide-details
                  outlined
                  v-on="on"
                  Autocomplete="off"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fecha"
                scrollable
                no-title
                @change="cargarciclos()"
                type="month"
                @input="pickerMes = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col class="d-flex" cols="4">
            <v-select
              label="Ciclo"
              :items="ciclos"
              :item-text="format_ciclos"
              outlined
              clearable
              return-object
              hide-details
              v-model="form.ciclo"
              required
              :disabled="dialogo.tipo == 1"
            ></v-select>
          </v-col>
          <v-col class="d-flex" cols="4">
            <v-select
              label="Corregimientos"
              :items="corregimientos"
              :item-text="format_corregimientos"
              outlined
              clearable
              return-object
              hide-details
              v-model="form.corregimientos"
              required
              :disabled="dialogo.tipo == 1"
            ></v-select>
          </v-col>
        </v-row>

        <v-row class="justify-end">
          <v-btn
            color="indigo"
            class="ma-2 white--text px-12 d-flex justify-end"
            large
            depressed
            @click="cargarcontenido"
            :loading="btnEnvio.loader"
            :disabled="btnEnvio.disabled"
          >
            Consultar
            <v-icon right dark>mdi-file-upload-outline</v-icon>
          </v-btn>

          <v-btn
            color="success"
            class="ma-2 white--text"
            large
            depressed
            @click="agregar_item()"
          >
            Generar Facturación
            <v-icon right dark class="ml-4">mdi-plus-thick</v-icon>
          </v-btn>
          <v-btn
            color="orange"
            class="ma-2 white--text px-12 d-flex justify-end"
            large
            depressed
            @click="validar()"
            :disabled="contenido.length > 0 ? false : true"
            :loading="btnEnvio.loader"
          >
            Validar
            <v-icon right dark>mdi-file-upload-outline</v-icon>
          </v-btn>
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
              :headers="headers"
              :items="contenido"
              :expanded.sync="expanded"
              show-expand
              item-key="consecutivo_rep"
              :search="search"
              class="elevation-1"
              @item-expanded="getBases"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <!-- <th class="orange--text">Base</th> -->
                          <th class="orange--text text-center">Descripción</th>
                          <th class="orange--text text-center">Cantidad</th>
                          <th class="orange--text text-center">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="el in item.basesfactura_rep"
                          :key="el.codigo_rep"
                        >
                          <!-- <td>{{ el.codigo_rep }}</td> -->
                          <td class="text-center">{{ el.descripcion_rep }}</td>
                          <td class="text-center">{{ el.cantidad_rep }}</td>
                          <td class="text-center">{{ el.valor_rep }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </td>
              </template>

              <template v-slot:item.estadobase_rep="{ item }">{{
                item.estadobase_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

              <template v-slot:item.imprimir="{ item }">
                <v-btn
                  fab
                  small
                  depressed
                  color="blue darken-2"
                  class="white--text"
                  @click="cargarfactura(item)"
                >
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
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
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>

    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="6" sm="6">
              <v-autocomplete
                label="Agencia"
                v-model="form.agencia"
                :items="agencias"
                :item-text="format_agencias"
                item-value="codigo_agc"
                hide-details
                outlined
                return-object
                @change="errores.agencia = false"
                :error="errores.agencia"
              ></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="8" sm="12">
              <v-text-field
                label="Información para los usuarios"
                clearable
                outlined
                required
                v-model="form.informacion"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="cancelar_generar"
            >Cancelar</v-btn
          >
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar()"
            >Generar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoModificar.estado" max-width="600" persistent>
      <v-card
        :loading="dialogoModificar.load"
        :disabled="dialogoModificar.load"
      >
        <v-card-title class="headline">Modificar registro</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                color="primary"
                depressed
                @click="dialogoAgregar.estado = true"
                >Agregar nuevo</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                :items="dialogoModificar.data.basesfactura_rep"
                item-text="descripcion_rep"
                item-value="codigo_rep"
                label="Cargos / Descuentos"
                outlined
                hide-details
                clearable
                return-object
                @change="editarDevengo"
                v-model="dialogoModificar.select"
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end">
            <v-col cols="6">
              <v-text-field
                label="Cantidad"
                outlined
                hide-details
                v-model="dialogoModificar.select.cantidad_rep"
                v-money="money"
                ref="input_cantidad"
                :disabled="dialogoModificar.select.editcant_rep == '0'"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end">
            <v-col cols="6">
              <v-text-field
                label="Valor"
                outlined
                hide-details
                v-model="dialogoModificar.select.valor_rep"
                v-money="money"
                :disabled="dialogoModificar.select.editvlr_rep == '0'"
                ref="input_valor"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider color="orange"></v-divider>
          <v-row
            class="d-flex"
            v-if="dialogoModificar.select.codigo_rep == 1100"
          >
            <v-col cols="4">
              <v-text-field
                label="Nro_Factura"
                outlined
                hide-details
                v-model="dialogoModificar.select.nrofactant_rep"
                v-money="money"
                :disabled="dialogoModificar.select.editvlr_rep == '0'"
                ref="input_nrofactant"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row
            class="d-flex"
            v-if="
              dialogoModificar.select.codigo_rep == 1003 ||
              dialogoModificar.select.codigo_rep == 1050 ||
              dialogoModificar.select.codigo_rep == 1051 ||
              dialogoModificar.select.codigo_rep == 1052 ||
              dialogoModificar.select.codigo_rep == 1054 ||
              dialogoModificar.select.codigo_rep == 1054
            "
          >
            <v-col cols="4">
              <v-text-field
                label="Nro_Financiacion"
                outlined
                hide-details
                v-model="dialogoModificar.select.nrocred_rep"
                v-money="money"
                :disabled="dialogoModificar.select.editvlr_rep == '0'"
                ref="input_financia"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Nro_Cuota"
                outlined
                hide-details
                v-model="dialogoModificar.select.cuota_rep"
                v-money="money"
                :disabled="dialogoModificar.select.editvlr_rep == '0'"
                ref="input_cuota"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Total_Cuotas"
                outlined
                hide-details
                v-model="dialogoModificar.select.totcuotas_rep"
                v-money="money"
                :disabled="dialogoModificar.select.editvlr_rep == '0'"
                ref="input_totcuotas"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
            class="d-flex"
            v-if="
              dialogoModificar.select.codigo_rep == 1003 ||
              dialogoModificar.select.codigo_rep == 1050 ||
              dialogoModificar.select.codigo_rep == 1051 ||
              dialogoModificar.select.codigo_rep == 1052 ||
              dialogoModificar.select.codigo_rep == 1054 ||
              dialogoModificar.select.codigo_rep == 1054
            "
          >
            <v-col cols="3">
              <v-text-field
                label="vlr_Inicial"
                outlined
                hide-details
                v-model="dialogoModificar.select.vlrini_rep"
                v-money="money"
                :disabled="dialogoModificar.select.editvlr_rep == '0'"
                ref="input_vlrini"
              ></v-text-field>
            </v-col>

            <v-col cols="3">
              <v-text-field
                label="Capital"
                outlined
                hide-details
                v-model="dialogoModificar.select.vlrcap_rep"
                v-money="money"
                :disabled="dialogoModificar.select.editvlr_rep == '0'"
                ref="input_vlrcap"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Intereses"
                outlined
                hide-details
                v-model="dialogoModificar.select.vlrint_rep"
                v-money="money"
                :disabled="dialogoModificar.select.editvlr_rep == '0'"
                ref="input_vlrint"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn
                color="red"
                outlined
                depressed
                :disabled="dialogoModificar.select.codigo_rep ? false : true"
                @click="eliminar_devengo"
                >Eliminar</v-btn
              >
            </v-col>
          </v-row>
          <v-divider />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-1"
            class="white--text"
            depressed
            @click="cancelar_modificar"
            >Cancelar</v-btn
          >
          <v-btn
            color="green"
            class="white--text"
            depressed
            @click="guardar_cambios"
            >Guardar cambios</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogoAgregar.estado" max-width="600" persistent>
      <v-card>
        <v-card-title class="headline">Agregar nuevo</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                label="Cargos / descuentos"
                :items="tablaBases"
                :item-text="format_bases"
                item-value="cod_puc"
                v-model="dialogoModificar.nuevo_devengo"
                return-object
                outlined
                hide-details
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                color="red"
                outlined
                depressed
                @click="
                  dialogoAgregar.estado = false;
                  dialogoModificar.nuevo_devengo = null;
                "
                class="mr-2"
                >Cancelar</v-btn
              >
              <v-btn
                color="primary"
                depressed
                @click="agregar_devengo"
                :disabled="!dialogoModificar.nuevo_devengo"
                >Agregar</v-btn
              >
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
import { factura_logigas, factura_coingasco } from "../../_formatos_sdm.js";

export default {

  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      pickerMes: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      agencias: [],
      contenido: [],
      datosEmpresa: [],
      ciclos: [],
      ruts3: [],
      colaborador: [],
      corregimientos: [],
      search: "",
      form: {},

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Id_Usuario", align: "center", value: "codcliente_rep" },
        { text: "Ruta", align: "center", value: "rutacliente_rep" },
        {
          text: "Nombres y Apellidos",
          align: "left",
          value: "nombrecliente_rep",
        },
        { text: "Medidor", align: "center", value: "medidor_rep" },
        { text: "Factura", align: "center", value: "nrofact_rep" },
        { text: "Consumo", align: "center", value: "consumo_rep" },
        // { text: "Neto", align: "center", value: "neto_rep" },
        { text: "Imprimir", value: "imprimir", align: "center" },
        { text: "Editar", value: "edit", align: "center" },
      ],
      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      dialogoModificar: {
        estado: false,
        data: {},
        select: {},
        nuevo_devengo: null,
        load: false,
      },
      tablaBases: [],
      dialogoAgregar: {
        estado: false,
      },
    };
  },
  created() {
    this.get_empresa();
    this.cargarTablaAg();
    this.get_basico();
    this.get_ruts3();
    this.cargarcorregim();
  },
  methods: {
    // async get_file() {
    //   return new Promise((resolve) => {
    //     let idempresa = this.datosEmpresa.id_empr;
    //     let folder = "D:\\TITAN\\Log\\Masiva_000000901122935.txt";

    //     if (idempresa == "000000901355090") {
    //       folder = "D:\\TITAN\\Log\\Masiva_000000901355090.txt";
    //     }
    //     var archivo_obj = new FormData();
    //     archivo_obj.append("ruta", folder);
    //     fetch("https://server1ts.net//financiero/inc/get.file.php", {
    //       method: "POST",
    //       body: archivo_obj,
    //     })
    //       .then((res) => res.text())
    //       .then((response) => {
    //         const linkSource = `data:application/text;base64,${response}`;
    //         const downloadLink = document.createElement("a");
    //         let name_file = "VALIDACION_FACTURACION.CSV";

    //         downloadLink.href = linkSource;
    //         downloadLink.download = name_file;
    //         downloadLink.click();
    //         resolve();
    //       })

    //       .then(resolve);
    //   });
    // },
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
    cargarcorregim() {
      this.loader = true;
      post
        .postData({
          url: "servdm/dlls/CfsdmcorregJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.corregimientos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Corregiminetos",
            estado: true,
          });
        });
    },
    async getBases({ item }) {
      let basesFactura = await this.getBasesFactura(item);
      let indexItem = this.contenido.indexOf(item);
      if (indexItem > 0) {
        item.basesfactura_rep = basesFactura;
        this.contenido[indexItem] = item;
      }
    },
    validar() {
      var periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var ciclo = this.form.ciclo.cod_rep;
      let datos = {
        url: "Servdm//dlls/PrValidaF.dll",
        data: sessionStorage.Sesion + "|" + periodo + "|" + ciclo + "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.print_reporte_excel(data);
        })
        .catch((error) => {
          this.send_error(error.Mensaje[0]);
        });
    },
    print_reporte_excel(data) {
      var data_parse = data;

      // data.forEach((el) => {
      //   let copia = JSON.parse(JSON.stringify(el));
      //   copia.usuario_rep = parseFloat(el.usuario_rep) || 0;
      // });
      // data_parse.push(copia);

      var columnas = [
        {
          title: "Medidor",
          value: "medidor_rep",
          format: "string",
        },
        {
          title: "Factura",
          value: "factura_rep",
          format: "string",
        },
        {
          title: "Usuario",
          value: "usuario_rep",
          format: "string",
        },
      ];
      var header_format = [
        { text: "VALIDACION FACTURACION", bold: true, size: 16 },
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Validacion facturacion",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `VALIDACION-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    async getBasesFactura(data) {
      let periodo = this.form.fecha.replace("-", "");
      let ciclo = this.form.ciclo.cod_rep;

      let response = await post.postData({
        url: "Servdm//dlls/PrFact04J.dll",
        method: "",
        data:
          [sessionStorage.Sesion, periodo, ciclo, data.consecutivo_rep].join(
            "|"
          ) + "|",
      });
      response[0].basesfactura_rep.pop();
      return response[0].basesfactura_rep;
    },
    guardar_cambios() {
      this.dialogoModificar.load = true;
      let sesion = sessionStorage.Sesion;
      let fecha = this.form.fecha;
      let ciclo = this.form.ciclo.cod_rep;
      let agencia = this.dialogoModificar.data.agencia_rep;
      let prefijo = this.dialogoModificar.data.prefijo_rep.trim();
      let consecutivo = this.dialogoModificar.data.consecutivo_rep;
      let tablajson = {};

      let registros = this.dialogoModificar.data.basesfactura_rep;
      registros.forEach((item, index) => {
        let format_index = (index + 1).toString().padStart(3, "0");
        let aboncap = item.vlrcap_rep
          ? item.vlrcap_rep.replace(/\,/g, "").trim()
          : 0;
        let sdoini = item.vlrini_rep
          ? item.vlrini_rep.replace(/\,/g, "").trim()
          : 0;
        let cuota = item.cuota_rep
          ? item.cuota_rep.replace(/\,/g, "").trim()
          : 0;
        let totcuota = item.totcuotas_rep
          ? item.totcuotas_rep.replace(/\,/g, "").trim()
          : 0;
        let intereses = item.valorinter_rep
          ? item.valorinter_rep.replace(/\,/g, "").trim()
          : 0;
        let nrocredito = item.nrocred_rep ? item.nrocred_rep : 0;
        let nrofactura = item.nrofactant_rep
          ? item.nrofactant_rep.replace(/\,/g, "").trim()
          : 0;

        if (item.valor_rep != "0") {
          let cantidad = item.cantidad_rep.trim() || 1;
          tablajson[`DATOJ-${format_index}`] = `${
            item.codigo_rep
          }|${cantidad}|${item.valor_rep
            .replace(/\,/g, "")
            .trim()}|${intereses}|${aboncap}|${sdoini}|${cuota}|${totcuota}|${nrocredito}|${nrofactura}|`;
        }
      });

      let importarhtml =
        sesion +
        "|" +
        fecha.replace(/\-/g, "") +
        "|" +
        ciclo +
        "|" +
        agencia +
        "|" +
        prefijo +
        "|" +
        consecutivo +
        "|";
      let datos = {
        url: "Servdm/dlls/PrFacturaM.dll",
        data: { importarhtml, ...tablajson },
        method: "",
        json: true,
      };
      post
        .postData(datos)
        .then((data) => {
          this.dialogoModificar.load = false;
          this.$emit("snack", {
            color: "success",
            text: "Factura Grabada correctamente",
            estado: true,
          });
          this.cancelar_modificar();
          this.cargarcontenido();
        })
        .catch((err) => {
          console.log(err);
          this.dialogoModificar.load = false;
          this.send_error("Ha ocurrido un error al grabar los datos");
        });
    },
    agregar_devengo() {
      var nuevo = this.dialogoModificar.nuevo_devengo;
      var actuales = this.dialogoModificar.data.basesfactura_rep || [];

      var busqueda = actuales.find(
        (el) => el.codigo_rep == nuevo.llavebase_rep
      );

      if (!busqueda) {
        actuales.push({
          cantidad_rep: "1",
          valor_rep: nuevo.valorbase_rep.replace(/\,/g, "").trim(),
          codigo_rep: nuevo.llavebase_rep,
          descripcion_rep: nuevo.descrbase_rep.trim(),
          clasifbase_rep: nuevo.clasifbase_rep,
          cajacantidad_rep: nuevo.cajacantidad_rep,
          cajavlr_rep: nuevo.cajavlr_rep,
        });

        this.$emit("snack", {
          color: "green",
          text: "Item agregado correctamente",
          estado: true,
        });

        this.dialogoModificar.data.basesfactura_rep = actuales;
        this.dialogoModificar.nuevo_devengo = null;
        this.dialogoAgregar.estado = false;
      } else {
        this.$emit("snack", {
          color: "error",
          text: "El item ya está agregado",
          estado: true,
        });
      }
    },
    format_bases: function (val) {
      return `${val.llavebase_rep.trim()} - ${val.descrbase_rep.trim()}`;
    },
    cancelar_generar() {
      this.dialogo.estado = false;
      this.dialogo.titulo = null;

      this.form.agencia = null;
      this.form.informacion = null;
    },
    cancelar_modificar() {
      this.dialogoModificar.estado = false;
      this.dialogoModificar.data = {};
      this.dialogoModificar.select = {};

      if (this.$refs.input_cantidad)
        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          "0";

      if (this.$refs.input_valor)
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
    },

    eliminar_devengo() {
      var actual = JSON.parse(JSON.stringify(this.dialogoModificar.data));
      var select = this.dialogoModificar.select;
      var bases = actual.basesfactura_rep;

      var busqueda = bases.findIndex(
        (el) => el.codigo_rep == select.codigo_rep
      );

      if (busqueda >= 0) {
        bases.splice(busqueda, 1);
        this.dialogoModificar.data = actual;
        this.dialogoModificar.select = {};
        this.dialogoModificar.select.cantidad_rep = null;
        this.dialogoModificar.select.valor_rep = null;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          "0";
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
      }
    },
    editarDevengo() {
      var item = this.dialogoModificar.select;
      if (item) {
        var cantidad =
          parseFloat(item.cantidad_rep.toString().replace(/\,/g, "")) || 0;
        var valor =
          parseFloat(item.valor_rep.toString().replace(/\,/g, "")) || 0;
        var nrofinancia = parseFloat(item.nrocred_rep) || 0;
        var nrocuota = parseFloat(item.cuota_rep) || 0;
        var totcuotas = parseFloat(item.totcuotas_rep) || 0;
        var intereses =
          parseFloat(item.valorinter_rep.toString().replace(/\,/g, "")) || 0;

        this.dialogoModificar.select.cantidad_rep = cantidad;
        this.dialogoModificar.select.valor_rep = valor;
        this.dialogoModificar.select.nrofinancia = nrofinancia;
        this.dialogoModificar.select.nrocuota = nrocuota;
        this.dialogoModificar.select.totcuotas = totcuotas;
        this.dialogoModificar.select.vlrint_rep = intereses;

        // this.dialogoModificar.select.clasifbase_rep = item.clasifbase_rep;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          cantidad;
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value =
          valor;
      } else {
        this.dialogoModificar.select = {};
        this.dialogoModificar.select.cantidad_rep = null;
        this.dialogoModificar.select.valor_rep = null;
        this.dialogoModificar.select.nrofinancia = null;
        this.dialogoModificar.select.nrocuota = null;
        this.dialogoModificar.select.totcuotas = null;
        this.dialogoModificar.select.vlrint_rep = null;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          "0";
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
      }
    },
    async editar_item(data) {
      let bases_factura = await this.getBasesFactura(data);
      let info = JSON.parse(JSON.stringify(data));
      if (bases_factura) info.basesfactura_rep = bases_factura;
      this.dialogoModificar.estado = true;
      this.dialogoModificar.data = info;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.fecha) {
        this.errores.fecha = true;
        this.send_error("Periodo Obligatorio!");
      } else if (!data.agencia.codigo_agc) {
        this.errores.agencia = true;
        this.send_error("Agencia Obligatoria!");
      } else if (!data.ciclo.cod_rep) {
        this.errores.ciclo = true;
        this.send_error("Ciclo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var periodo = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      var agencia = data.agencia.codigo_agc || "0001";
      var ciclo = data.ciclo.cod_rep;
      var detalle = data.detalle || "";
      let corregimientos = data.corregimientos.cod_rep;

      let datos = {
        url: "Servdm//dlls/PrMasiva.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          agencia +
          "|" +
          periodo +
          "|" +
          ciclo +
          "|" +
          detalle +
          "|" +
          corregimientos +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Facturación Generada correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          // this.init_form();
          this.cargarcontenido();
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    agregar_item() {
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo =
        "Generar Nueva Facturación" +
        this.form.ciclo.cod_rep +
        " " +
        this.form.fecha;
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },

    format_agencias: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
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

    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },
    cargarfactura(item) {
      let periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      let ciclo = this.form.ciclo.cod_rep || "0";
      let consec = item.consecutivo_rep;
      this.loader = true;
      post
        .postData({
          url: "Servdm//dlls/PrFact03J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            periodo +
            "|" +
            ciclo +
            "|" +
            consec +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.imprimir_factura(data[0]);
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Factura",
            estado: true,
          });
        });
    },
    async imprimir_factura(item) {
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      let logo = await this.pdfs.getBase64(logo_src);
      let idempresa = this.datosEmpresa.id_empr;
      let imagenpie = null;
      let superservicios = await this.pdfs.getBase64(
        require(`../../assets/image/clientes/LOGO_SUPERSERVICIOS.png`)
      );
      let firma = await this.pdfs.getBase64(
        require(`../../assets/image/firmas/${parseFloat(
          item.nitemp_rep.replace(/\,/g, "")
        )}.png`)
      );
      if (idempresa == "000000901355090") {
        imagenpie = "assets/image/clientes/LOGOPIE_COINGASCO.png";
      } else if (idempresa == "000000901122935") {
        imagenpie = "assets/image/clientes/LOGOPIE_LOGIGAS.png";
      }

      let logopie = await this.pdfs.getBase64(require(`../../` + imagenpie));
      let grafico = await this.get_grafico(item.historico_rep);

      item.superservicios = superservicios;
      item.firma = firma;
      item.logopie = logopie;
      item.grafico = grafico;
      item.color3 = this.datosEmpresa.color3_empr;
      item.color4 = this.datosEmpresa.color4_empr;

      if (idempresa == "000000901355090") {
        factura_coingasco(item, logo).then(() => {
          console.log("Impresion terminada");
        });
      } else {
        factura_logigas(item, logo).then(() => {
          console.log("Impresion terminada");
        });
      }

      // factura_serpub(item, logo).then(() => {
      //   console.log("Impresion terminada");
      // });
    },
    cargarcontenido() {
      var periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      var ciclo = this.form.ciclo.cod_rep;
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Servdm/dlls/PrFact01J.dll",
          data: sessionStorage.Sesion + "|" + periodo + "|" + ciclo + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = [];
          let res = JSON.parse(JSON.stringify(data));
          this.contenido = res.map((el) => {
            el.basesfactura_rep = [];
            return el;
          });
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Facturación",
            estado: true,
          });
        });
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
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    format_corregimientos(val) {
      return `${val.descrip_rep}`;
    },

    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    get_ruts3() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 3 + "|",
          method: "",
        })
        .then((data) => {
          this.ruts3 = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar Ruts",
            estado: true,
          });
        });
    },
    format_ciclos: function (val) {
      return `${val.cod_rep} - ${val.descrip_rep}`;
    },
    cargarciclos() {
      let fecha = this.form.fecha.replace(/\-/g, "");
      this.loader = true;
      post
        .postData({
          url: "servdm/dlls/Cfciclos01J.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.ciclos = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ciclos",
            estado: true,
          });
        });
    },
    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    get_basico: function () {
      post
        .postData({
          url: "servdm/dlls/CfsdmbaseJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaBases = data;
        })
        .catch((err) => {
          this.send_error("Error al consultar Cargos");
        });
    },
    async get_grafico(data) {
      return new Promise((resolve) => {
        let labels = data.map((item) => {
          return item.periodo_rep;
        });

        let datasets = data.map((item) => {
          return item.cant_rep;
        });

        let colors = data.map((item) => {
          return "#3f51b5";
        });

        var newDiv = document.createElement("canvas");
        document.body.appendChild(newDiv);

        let chart_bar;
        chart_bar = new Chart(newDiv, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                data: datasets,
                backgroundColor: colors,
              },
            ],
          },
          options: {
            animation: {
              onComplete: function () {
                let url = chart_bar.toBase64Image();
                newDiv.remove();
                resolve(url);
              },
            },
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontSize: 42,
                  },
                },
              ],
              xAxes: [
                {
                  ticks: {
                    fontSize: 42,
                  },
                },
              ],
            },
          },
        });
      });
    },
  },
};
</script>
