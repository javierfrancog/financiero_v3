<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-cash-fast</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Resumen de Venta del Dia</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" sm="3">
                <v-menu
                  v-model="pickeFechaIni"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.fechaInicial"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaInicial"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" sm="3">
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
                      v-model="form.fechaFinal"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.fechaFinal"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-end">
              <v-btn
                color="indigo"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="consultar_reporte"
                :loading="btnEnvio.loader"
                :disabled="btnEnvio.disabled"
              >
                Consultar
                <v-icon right dark>mdi-file-upload-outline</v-icon>
              </v-btn>
                <v-btn
                  color="green darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte_excel()"
                  :disabled="contenido.length == 0"
                >
                  Generar Excel
                  <v-icon right dark>mdi-file-excel-box</v-icon>
                </v-btn>

            </v-row>

            <v-divider
              class="mt-6"
              :style="{ 'border-width': '2px', 'border-color': 'orange' }"
            />
            <v-row>
              <v-col>
                <!-- <v-btn
                  color="red darken-2"
                  class="ma-2 white--text px-12"
                  large
                  depressed
                  @click="print_reporte()"
                  :disabled="contenido.length == 0"
                >
                  Imprimir PDF
                  <v-icon right dark>mdi-pdf-box</v-icon>
                </v-btn> -->

              </v-col>
            </v-row>

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
              :search="search"
            >
              <template v-slot:body.append>
                <tr>
                  <td class="font-weight-medium text-right">Totales</td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_cantidad) }}
                  </td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_valor) }}
                  </td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_rpc) }}
                  </td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_egresos) }}
                  </td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_redbus) }}
                  </td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_pinbus) }}
                  </td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_tdebito) }}
                  </td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_tcredito) }}
                  </td>
                  <td class="font-weight-medium text-center">
                    {{ formatNumero(total_convenios) }}
                  </td> 
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
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
      agencias: [],
      pickeFechaIni: false,
      pickerFechaFinal: false,
      cuentasContables: [],
      loader: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      tablaruts: [],
      ptosrecaudo: [],
      search: "",
      total_valor: 0,
      total_cantidad: 0,
      total_rpc: 0,
      total_egresos: 0,
      total_redbus: 0,
      total_pinbus: 0,
      total_tdebito: 0,
      total_tcredito: 0,
      total_convenios: 0,

      form: {
        fechaInicial: this.$moment().format("YYYY-MM-DD"),
        fechaFinal: this.$moment().format("YYYY-MM-DD"),
      },
      headers: [
        { text: "Taquilla", align: "left", value: "taquilla_rep" },
        { text: "Pasajes", align: "center", value: "cantidad_rep" },
        { text: "Ventas", align: "center", value: "ventas_rep"},        
        { text: "R.P.C", align: "center", value: "rpc_rep" },                
        { text: "Egresos", align: "center", value: "egresos_rep" },                
        { text: "RedBus", align: "center", value: "redbus_rep" },                
        { text: "PinBus", align: "center", value: "pinbus_rep" },                        
        { text: "Tarjeta Debito", align: "center", value: "tdebito_rep" },                
        { text: "Tarjeta Credito", align: "center", value: "tcredito_rep" },                        
        { text: "Convenios", align: "center", value: "convenio_rep" }                        
      ],
      card_estado: false,
      btnEnvio: {
        loader: false,
        disabled: false,
      },
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
    };
  },
  created() {
  },
  methods: {  
    print_reporte_excel() {
      var data = JSON.parse(JSON.stringify(this.contenido));      

      let total_valor = 0;
      let total_cantidad = 0;
      let total_rpc = 0;
      let total_egresos = 0;
      let total_redbus = 0;
      let total_pinbus = 0;
      let total_tdebito = 0;                              
      let total_tcredito = 0;                              
      let total_convenio = 0;                              

      var data_parse = data.map((el) => {
        let cantidad = parseFloat(el.cantidad_rep.replace(/\,/g, "")) || 0;
        let ventas = parseFloat(el.ventas_rep.replace(/\,/g, "")) || 0;
        let rpc = parseFloat(el.rpc_rep.replace(/\,/g, "")) || 0;        
        let egresos = parseFloat(el.egresos_rep.replace(/\,/g, "")) || 0;                
        let redbus = parseFloat(el.redbus_rep.replace(/\,/g, "")) || 0;                        
        let pinbus = parseFloat(el.pinbus_rep.replace(/\,/g, "")) || 0;                                
        let tdebito = parseFloat(el.tdebito_rep.replace(/\,/g, "")) || 0;                                
        let tcredito = parseFloat(el.tcredito_rep.replace(/\,/g, "")) || 0;
        let convenio = parseFloat(el.convenio_rep.replace(/\,/g, "")) || 0;

        el.cantidad_rep = cantidad;
        el.ventas_rep = ventas;
        el.rpc_rep = rpc;        
        el.egresos_rep = egresos;
        el.redbus_rep = redbus;
        el.pinbus_rep = pinbus;
        el.tdebito_rep = tdebito;
        el.tcredito_rep = tcredito;
        el.convenio_rep = convenio;                                                

        if (el.id != 99) {
          total_valor += ventas;
          total_cantidad += cantidad;
          total_rpc += rpc;
          total_egresos += egresos;
          total_redbus += redbus;
          total_pinbus += pinbus;
          total_tdebito += tdebito;
          total_tcredito += tcredito;
          total_convenio += convenio;
        } 

        return el
      });

      data_parse.push({
        taquilla_rep: "Totales",
        cantidad_rep: total_cantidad,
        ventas_rep: total_valor,  
        rpc_rep: total_rpc,        
        egresos_rep: total_egresos,
        redbus_rep: total_redbus,
        pinbus_rep: total_pinbus,
        tdebito_rep: total_tdebito,
        tcredito_rep: total_tcredito,
        convenio_rep: total_convenio,
      });

      var columnas = [
        {
          title: "Taquilla",
          value: "taquilla_rep",
          format: "string",
        },
        {
          title: "Pasajes",
          value: "cantidad_rep",
          totalsRowFunction: "sum",
        },
        {
          title: "Ventas",
          value: "ventas_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "R.P.C",
          value: "rpc_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Egresos",
          value: "egresos_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "RedBus",
          value: "redbus_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "PinBus",
          value: "pinbus_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Tarjeta Debito",
          value: "tdebito_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Tarjeta Credito",
          value: "tcredito_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Convenios",
          value: "convenio_rep",
          format: "money",
          totalsRowFunction: "sum",
        },

      ];
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;

      var header_format = [
        { text: "RESUMEN VENTAS DEL DIA", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Ventas del Dia",
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-VENTAS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_reporte() {
      var data = this.contenido;
      var fecha_inicial = this.form.fechaInicial;
      var fecha_final = this.form.fechaFinal;
      let valor_total = 0;
      let cantidad_total = 0;

      var data_parse = [];
      data.forEach((el) => {
        let valor = parseFloat(el.ventas_rep.replace(/\,/g, "")) || 0;
        valor_total += valor;
        cantidad_total += parseFloat(el.cantidad_rep);
        let item = [
          el.taquilla_rep.trim(),
          { text: el.cantidad_rep.trim(), alignment: "right" },
          { text: el.ventas_rep.trim(), alignment: "right" },
        ];
        data_parse.push(item);
      });

      data_parse.push([
        { text: "Totales " },
        { text: cantidad_total, alignment: "right" },
        { text: this.formatNumero(valor_total), alignment: "right" },
      ]);
      data_parse.unshift([
        { text: "Agencias", style: "header_table" },
        { text: "Cantidad", style: "header_table", alignment: "right" },
        { text: "Ventas", style: "header_table", alignment: "right" },
      ]);

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.pdfs._informe({
          data: data_parse,
          header_pdf: [
            {
              text: [{ text: "Fecha inicial: ", bold: true }, fecha_inicial],
            },
            {
              text: [{ text: "Fecha Final: ", bold: true }, fecha_final],
            },
          ],
          width_table: ["*", "*", "*"],
          logo,
          titulo: "Ventas del Dia",
          fontSize: 8,
        });
      });
    },

    consultar_reporte() {
      this.loader = true;
      var fechaInicial = this.form.fechaInicial.replace(/\-/g, "");
      var fechaFinal = this.form.fechaFinal.replace(/\-/g, "");
      let data = [sessionStorage.Sesion, fechaInicial, fechaFinal];
      this.total_cantidad = 0;
      this.total_valor = 0;
      this.total_rpc = 0;
      this.total_egresos = 0;
      this.total_redbus = 0;
      this.total_pinbus = 0;
      this.total_tdebito = 0;
      this.total_tcredito = 0;
      this.total_convenios = 0;

      this.postData({
        url: "Transporte/dlls/RpresvtastrJ.dll",
        data: data.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
          this.contenido.forEach((el) => {
            let valor = parseFloat(el.ventas_rep.replace(/\,/g, "")) || 0;
            this.total_valor += valor;
            let cantidad = parseFloat(el.cantidad_rep.replace(/\,/g, "")) || 0;
            this.total_cantidad += cantidad;
            let rpc = parseFloat(el.rpc_rep.replace(/\,/g, "")) || 0;
            this.total_rpc += rpc;
            let egresos = parseFloat(el.egresos_rep.replace(/\,/g, "")) || 0;
            this.total_egresos += egresos;
            let redbus = parseFloat(el.redbus_rep.replace(/\,/g, "")) || 0;
            this.total_redbus += redbus;
            let pinbus = parseFloat(el.pinbus_rep.replace(/\,/g, "")) || 0;
            this.total_pinbus += pinbus;
            let tdebito = parseFloat(el.tdebito_rep.replace(/\,/g, "")) || 0;
            this.total_tdebito += tdebito;
            let tcredito = parseFloat(el.tcredito_rep.replace(/\,/g, "")) || 0;
            this.total_tcredito += tcredito;
            let convenios = parseFloat(el.convenio_rep.replace(/\,/g, "")) || 0;
            this.total_convenios += convenios;

           el.ventas_rep = this.formatNumero(el.ventas_rep);
           el.cantidad_rep = this.formatNumero(el.cantidad_rep);
           el.rpc_rep = this.formatNumero(el.rpc_rep);
           el.egresos_rep = this.formatNumero(el.egresos_rep);
           el.redbus_rep = this.formatNumero(el.redbus_rep);
           el.pinbus_rep = this.formatNumero(el.pinbus_rep);
           el.tdebito_rep = this.formatNumero(el.tdebito_rep);
           el.tcredito_rep = this.formatNumero(el.tcredito_rep);
           el.convenio_rep = this.formatNumero(el.convenio_rep);           
          });
        })
        .catch((err) => {
          this.loader = false;
          console.log("Error", err);
          this.$emit(
            "msj",
            err.Mensaje ? err.Mensaje[0].msg : err,
            "red",
            1000
          );
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
