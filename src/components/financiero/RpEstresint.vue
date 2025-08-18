<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2" :loading="loader.card">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-apple-keyboard-option</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline">Estado de Resultados Integrales</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  v-model="pickerPeriodo"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="periodo_cargue"
                      label="Periodo de cargue"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periodo_cargue"
                    type="month"
                    no-title
                    scrollable
                    @input="pickerPeriodo = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="12" sm="2">
                <v-select
                  :items="[
                    { text: 'Solo Niif', value: 1 },
                    { text: 'Mayor', value: 2 },
                    { text: 'Subcuenta', value: 3 },
                    { text: 'Auxiliar', value: 4 },
                    { text: 'Rut', value: 5 },
                  ]"
                  label="Nivel"
                  outlined
                  clearable
                  hide-details
                  return-object
                  v-model="form.nivel"
                  required
                  :rules="[v => !!v || 'Campo es obligatorio']"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="3">
                <v-select
                  :items="[
                    { text: 'Todas las cuentas', value: 1 },
                    { text: 'Seleccion Unica', value: 2 },
                  ]"
                  label="Cuentas a Procesar"
                  outlined
                  clearable
                  hide-details
                  return-object
                  v-model="form.selcta"
                  required
                  :rules="[v => !!v || 'Campo es obligatorio']"
                ></v-select>
              </v-col>
              <v-col
                class="d-flex"
                cols="12"
                sm="4"
                v-if="form.selcta ? form.selcta.value == 2 : false"
              >
                <v-autocomplete
                  label="Codigo"
                  v-model="form.ctacontab"
                  :items="datosctas"
                  :item-text="format_ctas"
                  item-value="cod_puc"
                  hide-details
                  return-object
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" class="white--text px-6" @click="get_reporte" large depressed>
              Generar
              <v-icon right dark>mdi-cloud-upload</v-icon>
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-flex>
    <div id="impresion_estados">
      <div id="cargando_pdf">
        <h3>Cargando impresión...</h3>
      </div>
      <!-- <div id="page_activos">
        <div class="titulo_doc">
          <b>Estados</b>
          de situación financiera
        </div>
        <table id="activos_table">
          <tbody></tbody>
        </table>
      </div> -->
      <!-- <div id="page_pasivos">
        <div class="titulo_doc">
          <b>Estados</b>
          de situación financiera
        </div>
        <table id="pasivos_table">
          <tbody></tbody>
        </table>
      </div> -->
      <div id="page_ingresos">
        <div class="titulo_doc">
          <b>Estados</b>
          de resultados integrales
        </div>
        <table id="ingresos_table">
          <tbody></tbody>
        </table>
      </div>
      <div id="page_footer">
        <div>
          <a class="firma1_footer"></a>
          <br />
          <a class="cargo1_footer"></a>
        </div>
        <div>
          <a class="firma2_footer"></a>
          <br />
          <a class="cargo2_footer"></a>
        </div>
        <div>
          <a class="firma3_footer"></a>
          <br />
          <a class="cargo3_footer"></a>
        </div>
      </div>
    </div>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
export default {
  data() {
    return {
      periodo_cargue: this.$moment().format("YYYY-MM"),
      condition: false,
      search: null,
      pickerPeriodo: false,
      pickerCargue: false,
      pickerActual: false,
      datosctas: [],
      form: [],
      headers: [{ text: "Opciones", value: "edit", align: "center" }],
      loader: {
        card: false
      }
    };
  },
  created() {
    this.cargarTablactas();
    // setTimeout(() => {
    //   this.format_pdf(
    //     JSON.parse(
    //       '[{"BALANCE":[{"NIVEL":"1      ","DESCRIPCION":"ACTIVO                                                      ","CTANIIF":"1    ","VALOR1":"   208,260,170.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"11     ","DESCRIPCION":"ACTIVO CORRIENTE                                            ","CTANIIF":"101  ","VALOR1":"   201,986,490.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"111    ","DESCRIPCION":"Efectivo y Equivalentes al Efectivo                         ","CTANIIF":"10101","VALOR1":"   201,986,490.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"1111   ","DESCRIPCION":"CAJA                                                        ","CTANIIF":"10101","VALOR1":"     1,986,490.00","VALOR2":"                 ","CTAPUC":"1105000000","NEGRILLA":"N "},{"NIVEL":"11111  ","DESCRIPCION":"CAJA GENERAL                                                ","CTANIIF":"10101","VALOR1":"     1,986,490.00","VALOR2":"                 ","CTAPUC":"1105050000","NEGRILLA":"N "},{"NIVEL":"111111 ","DESCRIPCION":"Caja Villavicencio                                          ","CTANIIF":"10101","VALOR1":"     1,986,490.00","VALOR2":"                 ","CTAPUC":"1105050101","NEGRILLA":"N "},{"NIVEL":"1111111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"10101","VALOR1":"-    1,430,000.00","VALOR2":"                 ","CTAPUC":"1105050101","NEGRILLA":"N "},{"NIVEL":"1111111","DESCRIPCION":"TITAN SOLUCIONES SAS                                        ","CTANIIF":"10101","VALOR1":"     3,416,490.00","VALOR2":"                 ","CTAPUC":"1105050101","NEGRILLA":"N "},{"NIVEL":"1111   ","DESCRIPCION":"BANCOS                                                      ","CTANIIF":"10101","VALOR1":"   200,000,000.00","VALOR2":"                 ","CTAPUC":"1110000000","NEGRILLA":"N "},{"NIVEL":"11111  ","DESCRIPCION":"BANCOS NACIONALES                                           ","CTANIIF":"10101","VALOR1":"   200,000,000.00","VALOR2":"                 ","CTAPUC":"1110050000","NEGRILLA":"N "},{"NIVEL":"111111 ","DESCRIPCION":"Bancolombia Ahorros 4715                                    ","CTANIIF":"10101","VALOR1":"   200,000,000.00","VALOR2":"                 ","CTAPUC":"1110050101","NEGRILLA":"N "},{"NIVEL":"1111111","DESCRIPCION":"TITAN SOLUCIONES SAS                                        ","CTANIIF":"10101","VALOR1":"   200,000,000.00","VALOR2":"                 ","CTAPUC":"1110050101","NEGRILLA":"N "},{"NIVEL":"11T    ","DESCRIPCION":"Total ACTIVO CORRIENTE                                      ","CTANIIF":"     ","VALOR1":" 1,420,179,110.00","VALOR2":"                 ","CTAPUC":"          ","NEGRILLA":"NN"},{"NIVEL":"12     ","DESCRIPCION":"ACTIVO NO CORRIENTE                                         ","CTANIIF":"102  ","VALOR1":"     6,273,680.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"112    ","DESCRIPCION":"Cuentas Comerciales y Otras Cuentas por Cobrar              ","CTANIIF":"10202","VALOR1":"     6,273,680.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"1121   ","DESCRIPCION":"CLIENTES                                                    ","CTANIIF":"10202","VALOR1":"     6,273,680.00","VALOR2":"                 ","CTAPUC":"1305000000","NEGRILLA":"N "},{"NIVEL":"11211  ","DESCRIPCION":"CLIENTES NACIONALES                                         ","CTANIIF":"10202","VALOR1":"     6,273,680.00","VALOR2":"                 ","CTAPUC":"1305050000","NEGRILLA":"N "},{"NIVEL":"112111 ","DESCRIPCION":"Clientes                                                    ","CTANIIF":"10202","VALOR1":"     6,273,680.00","VALOR2":"                 ","CTAPUC":"1305050101","NEGRILLA":"N "},{"NIVEL":"1121111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"10202","VALOR1":"     6,273,680.00","VALOR2":"                 ","CTAPUC":"1305050101","NEGRILLA":"N "},{"NIVEL":"12T    ","DESCRIPCION":"Total ACTIVO NO CORRIENTE                                   ","CTANIIF":"     ","VALOR1":"    37,642,080.00","VALOR2":"                 ","CTAPUC":"          ","NEGRILLA":"NN"},{"NIVEL":"2      ","DESCRIPCION":"PASIVO                                                      ","CTANIIF":"2    ","VALOR1":"-      547,170.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"21     ","DESCRIPCION":"PASIVO CORRIENTE                                            ","CTANIIF":"201  ","VALOR1":"     1,000,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"213    ","DESCRIPCION":"Beneficios a Empleados                                      ","CTANIIF":"20103","VALOR1":"     1,000,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"2131   ","DESCRIPCION":"SALARIOS POR PAGAR                                          ","CTANIIF":"20103","VALOR1":"     1,000,000.00","VALOR2":"                 ","CTAPUC":"2505000000","NEGRILLA":"N "},{"NIVEL":"21311  ","DESCRIPCION":"SALARIOS                                                    ","CTANIIF":"20103","VALOR1":"     1,000,000.00","VALOR2":"                 ","CTAPUC":"2505010000","NEGRILLA":"N "},{"NIVEL":"213111 ","DESCRIPCION":"Nominas por pagar                                           ","CTANIIF":"20103","VALOR1":"     1,000,000.00","VALOR2":"                 ","CTAPUC":"2505010101","NEGRILLA":"N "},{"NIVEL":"2131111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"20103","VALOR1":"     1,000,000.00","VALOR2":"                 ","CTAPUC":"2505010101","NEGRILLA":"N "},{"NIVEL":"21T    ","DESCRIPCION":"Total PASIVO CORRIENTE                                      ","CTANIIF":"     ","VALOR1":"     6,000,000.00","VALOR2":"                 ","CTAPUC":"          ","NEGRILLA":"NN"},{"NIVEL":"22     ","DESCRIPCION":"PASIVO NO CORRIENTE                                         ","CTANIIF":"202  ","VALOR1":"-    1,547,170.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"214    ","DESCRIPCION":"Impuestos Diferidos                                         ","CTANIIF":"20204","VALOR1":"-    1,547,170.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"2141   ","DESCRIPCION":"IMPUESTO SOBRE LAS VENTAS POR PAGAR                         ","CTANIIF":"20204","VALOR1":"-    1,547,170.00","VALOR2":"                 ","CTAPUC":"2408000000","NEGRILLA":"N "},{"NIVEL":"21411  ","DESCRIPCION":"IVA GENERADO                                                ","CTANIIF":"20204","VALOR1":"-    1,547,170.00","VALOR2":"                 ","CTAPUC":"2408010000","NEGRILLA":"N "},{"NIVEL":"214111 ","DESCRIPCION":"Generado al 19%                                             ","CTANIIF":"20204","VALOR1":"-    1,547,170.00","VALOR2":"                 ","CTAPUC":"2408010119","NEGRILLA":"N "},{"NIVEL":"2141111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"20204","VALOR1":"-    1,001,680.00","VALOR2":"                 ","CTAPUC":"2408010119","NEGRILLA":"N "},{"NIVEL":"2141111","DESCRIPCION":"TITAN SOLUCIONES SAS                                        ","CTANIIF":"20204","VALOR1":"-      545,490.00","VALOR2":"                 ","CTAPUC":"2408010119","NEGRILLA":"N "},{"NIVEL":"22T    ","DESCRIPCION":"Total PASIVO NO CORRIENTE                                   ","CTANIIF":"     ","VALOR1":"-    9,283,020.00","VALOR2":"                 ","CTAPUC":"          ","NEGRILLA":"NN"},{"NIVEL":"3      ","DESCRIPCION":"PATRIMONIO                                                  ","CTANIIF":"3    ","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"31     ","DESCRIPCION":"Capital Social                                              ","CTANIIF":"301  ","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"31 1   ","DESCRIPCION":"CAPITAL AUTORIZADO                                          ","CTANIIF":"301  ","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"3105000000","NEGRILLA":"N "},{"NIVEL":"31 11  ","DESCRIPCION":"CAPITAL AUTORIZADO                                          ","CTANIIF":"301  ","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"3105050000","NEGRILLA":"N "},{"NIVEL":"31 111 ","DESCRIPCION":"Acciones pagadas                                            ","CTANIIF":"301  ","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"3105050101","NEGRILLA":"N "},{"NIVEL":"31 1111","DESCRIPCION":"TITAN SOLUCIONES SAS                                        ","CTANIIF":"301  ","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"3105050101","NEGRILLA":"N "},{"NIVEL":"39     ","DESCRIPCION":"3105050101                                                  ","CTANIIF":"39999","VALOR1":"-6,500,000,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"4      ","DESCRIPCION":"INGRESOS                                                    ","CTANIIF":"4    ","VALOR1":"-    8,143,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"41     ","DESCRIPCION":"INGRESOS ACTIVIDADES ORDINARIAS                             ","CTANIIF":"401  ","VALOR1":"-    8,143,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"411    ","DESCRIPCION":"Ingresos por Ventas                                         ","CTANIIF":"40101","VALOR1":"-    8,143,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"4111   ","DESCRIPCION":"ACTIVIDADES EMPRESARIALES                                   ","CTANIIF":"40101","VALOR1":"-    8,462,000.00","VALOR2":"                 ","CTAPUC":"4155000000","NEGRILLA":"N "},{"NIVEL":"41111  ","DESCRIPCION":"ACTIVIDADES EMPRESARIALES DE CONSULTORIA                    ","CTANIIF":"40101","VALOR1":"-    8,462,000.00","VALOR2":"                 ","CTAPUC":"4155500000","NEGRILLA":"N "},{"NIVEL":"411111 ","DESCRIPCION":"Consultoria en Costos                                       ","CTANIIF":"40101","VALOR1":"-    8,462,000.00","VALOR2":"                 ","CTAPUC":"4155500101","NEGRILLA":"N "},{"NIVEL":"4111111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"40101","VALOR1":"-    5,272,000.00","VALOR2":"                 ","CTAPUC":"4155500101","NEGRILLA":"N "},{"NIVEL":"4111111","DESCRIPCION":"TITAN SOLUCIONES SAS                                        ","CTANIIF":"40101","VALOR1":"-    3,190,000.00","VALOR2":"                 ","CTAPUC":"4155500101","NEGRILLA":"N "},{"NIVEL":"4111   ","DESCRIPCION":"DEVOLUCIONES Y DESCUENTOS                                   ","CTANIIF":"40101","VALOR1":"       319,000.00","VALOR2":"                 ","CTAPUC":"4175000000","NEGRILLA":"N "},{"NIVEL":"41111  ","DESCRIPCION":"ACTIVIDADES DE CONSULTORIA                                  ","CTANIIF":"40101","VALOR1":"       319,000.00","VALOR2":"                 ","CTAPUC":"4175500000","NEGRILLA":"N "},{"NIVEL":"411111 ","DESCRIPCION":"Descuentos                                                  ","CTANIIF":"40101","VALOR1":"       319,000.00","VALOR2":"                 ","CTAPUC":"4175500101","NEGRILLA":"N "},{"NIVEL":"4111111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"40101","VALOR1":"                 ","VALOR2":"                 ","CTAPUC":"4175500101","NEGRILLA":"N "},{"NIVEL":"4111111","DESCRIPCION":"TITAN SOLUCIONES SAS                                        ","CTANIIF":"40101","VALOR1":"       319,000.00","VALOR2":"                 ","CTAPUC":"4175500101","NEGRILLA":"N "},{"NIVEL":"5      ","DESCRIPCION":"GASTOS                                                      ","CTANIIF":"5    ","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"S "},{"NIVEL":"519    ","DESCRIPCION":"5135350101                                                  ","CTANIIF":"51353","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "},{"NIVEL":"5191   ","DESCRIPCION":"SERVICIOS                                                   ","CTANIIF":"51353","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"5135000000","NEGRILLA":"N "},{"NIVEL":"51911  ","DESCRIPCION":"SERVICIOS                                                   ","CTANIIF":"51353","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"5135350000","NEGRILLA":"N "},{"NIVEL":"519111 ","DESCRIPCION":"SERVICIOS                                                   ","CTANIIF":"51353","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"5135350101","NEGRILLA":"N "},{"NIVEL":"5191111","DESCRIPCION":"FRANCO    GONZALEZ  JAVIER                                  ","CTANIIF":"51353","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"5135350101","NEGRILLA":"N "},{"NIVEL":"59     ","DESCRIPCION":"5135350101                                                  ","CTANIIF":"59999","VALOR1":"       430,000.00","VALOR2":"                 ","CTAPUC":"0000000000","NEGRILLA":"N "}]},{"CIERRE":{"FIRMA1":"JAVIER FRANCO GONZALEZ        ","CARGO1":"Representante Legal           ","FIRMA2":"PILA CANO HERRERA             ","CARGO2":"Revisora Fiscal TP 147963-T   ","FIRMA3":"PAOLA ANDREA TELLO            ","CARGO3":"Contadora TP 182471-T         "}}]',
    //     ),
    //   )
    // }, 500)
  },
  methods: {
    format_pdf(data) {
      var $this = this;
      var balance = data[0].BALANCE;
      var info = balance.reduce((r, a) => {
        var key = a.NIVEL.trim().substr(0, 1);
        r[key] = r[key] || [];
        if (key == key) r[key].push(a);
        return r;
      }, Object.create(null));

      var fecha = this.periodo_cargue;
      var añoActual = parseInt(fecha.split("-")[0]);
      var añoAnterior = añoActual - 1;
      var mes = fecha.split("-")[1];
      var mesText = this.get_mes(mes);

      Object.getOwnPropertyNames(info).forEach(function(val) {
        // console.log(val + " -> ", result[val]);
        if (
          // val == "1" ||
          // val == "2" ||
          // val == "3" ||
          val == "4" ||
          val == "5"
        ) {
          var tablas = {
            1: "activos",
            2: "pasivos",
            3: "pasivos",
            4: "ingresos",
            5: "ingresos"
          };

          let parent = document
            .getElementById(`${tablas[val]}_table`)
            .getElementsByTagName("tbody")[0];
          let activos = info[val];

          let actual_row = parent.rows.length;
          let row = parent.insertRow(actual_row);
          let cell1 = row.insertCell(0);
          cell1.colSpan = 3;

          let cell2 = row.insertCell(1);
          cell2.innerHTML = `<i>${mesText}</i>`;
          cell2.colSpan = 2;
          cell2.style.paddingTop = "20px";

          var totalTabla = 0,
            totalTabla2 = 0;

          activos.forEach(item => {
            var nivel = item.NIVEL.trim();
            var padding = nivel.length * 10;
            var negrilla = item.NEGRILLA.trim() == "S" ? true : false;
            var actual_row = parent.rows.length;
            var row = parent.insertRow(actual_row);

            var cell2 = null,
              cell3 = null,
              cell4 = null,
              cell5 = null;

            var cell1 = row.insertCell(0);
            cell1.innerHTML = item.DESCRIPCION;
            cell1.style.paddingLeft = `${padding}px`;
            cell1.style.fontWeight = negrilla ? "600" : "normal";
            if (nivel.length == 1) {
              row.classList.add("titulo_row");

              cell1.colSpan = 3;

              cell2 = row.insertCell(1);
              cell2.innerHTML = añoActual;
              cell2.style.fontWeight = "600";

              cell3 = row.insertCell(2);
              cell3.innerHTML = añoAnterior;
              cell3.style.fontWeight = "600";
            } else if (nivel.length == 2 && nivel.trim() != "31") {
              row.classList.add("pt-15");
              row.classList.add("subtitulo_row");
              cell1.colSpan = 5;
            } else if (nivel.length == 3 || nivel.trim() == "31") {
              cell1.colSpan = 3;

              if (
                nivel.substr(-1) == "T" ||
                nivel.substr(0, 1) == "3" ||
                nivel.substr(0, 1) == "4" ||
                nivel.substr(0, 1) == "5"
              ) {
                totalTabla +=
                  parseFloat(
                    item.VALOR1.replace(/\,/g, "").replace(/ /g, "")
                  ) || 0;
                totalTabla2 +=
                  parseFloat(
                    item.VALOR2.replace(/\,/g, "").replace(/ /g, "")
                  ) || 0;

                if (nivel.substr(0, 1) != "3") row.classList.add("total_row");
                else row.classList.add("pt-15");
              } else row.classList.add("pt-15");

              cell2 = row.insertCell(1);
              cell2.innerHTML = item.VALOR1.trim();

              cell3 = row.insertCell(2);
              cell3.innerHTML = item.VALOR2.trim() || "0";
            } else if (nivel.length == 4) {
              row.insertCell(1).innerHTML = "";
              row.insertCell(2).innerHTML = item.VALOR1.trim();
            } else {
              row.insertCell(1).innerHTML = item.VALOR1;
              row.insertCell(2).innerHTML = "";
              row.insertCell(3).innerHTML = "";
              row.insertCell(4).innerHTML = "";
            }
          });

          let descripcionNivel = activos[0].DESCRIPCION.trim();
          // console.log(descripcionNivel);
          let rowTotal = parent.insertRow(parent.rows.length);
          rowTotal.classList.add("total_final_row");
          let cellTotal = rowTotal.insertCell(0);
          cellTotal.innerHTML = `<div>TOTAL ${descripcionNivel}</div>`;
          cellTotal.colSpan = 3;

          let cellSub20 = rowTotal.insertCell(1);
          cellSub20.innerHTML = `${$this.formatNumero(
            totalTabla.toFixed(2).toString()
          )}`;
          cellSub20.classList.add("total20_" + descripcionNivel);

          let cellSub19 = rowTotal.insertCell(2);
          cellSub19.innerHTML = `${$this.formatNumero(
            totalTabla2.toFixed(2).toString()
          )}`;
          cellSub19.classList.add("total19_" + descripcionNivel);
          // console.log(totalTabla2.toFixed(2), totalTabla.toFixed(2))

          // console.log(val);
          if (val == "3" || val == "5") {
            let label = null;
            let nivel1 = null;
            let nivel2 = null;

            if (val == "3") {
              label = `TOTAL PASIVOS + PATRIMONIO`;
              nivel1 = "PASIVO";
              nivel2 = "PATRIMONIO";
            } else if (val == "5") {
              label = `RESULTADO DEL EJERCICIO`;
              nivel1 = "INGRESOS";
              nivel2 = "GASTOS";
            }

            let rowSpace = parent.insertRow(parent.rows.length);
            let cellSpace = rowSpace.insertCell(0);
            cellSpace.colSpan = 5;
            cellSpace.style.paddingTop = "40px";

            let rowTotal = parent.insertRow(parent.rows.length);
            rowTotal.classList.add("total_final_row");
            rowTotal.classList.add("row_margin");
            let cellTotal = rowTotal.insertCell(0);
            cellTotal.innerHTML = label;
            cellTotal.colSpan = 3;

            // console.log("total20_" + nivel1);

            let totalPasivo20 = 0;
            if (document.getElementsByClassName("total20_" + nivel1)[0]) {
              totalPasivo20 = document.getElementsByClassName(
                "total20_" + nivel1
              )[0].innerHTML;
              totalPasivo20 =
                parseFloat(
                  totalPasivo20.replace(/\,/g, "").replace(/ /g, "")
                ) || 0;
            }

            let totalPatrimonio20 = 0;
            if (document.getElementsByClassName("total20_" + nivel2)[0]) {
              totalPatrimonio20 = document.getElementsByClassName(
                "total20_" + nivel2
              )[0].innerHTML;
              totalPatrimonio20 =
                parseFloat(
                  totalPatrimonio20.replace(/\,/g, "").replace(/ /g, "")
                ) || 0;
            }

            let totalPasivo19 = 0;
            if (document.getElementsByClassName("total19_" + nivel1)[0]) {
              totalPasivo19 = document.getElementsByClassName(
                "total19_" + nivel1
              )[0].innerHTML;
              totalPasivo19 =
                parseFloat(
                  totalPasivo19.replace(/\,/g, "").replace(/ /g, "")
                ) || 0;
            }

            let totalPatrimonio19 = 0;
            if (document.getElementsByClassName("total19_" + nivel2)[0]) {
              totalPatrimonio19 = document.getElementsByClassName(
                "total19_" + nivel2
              )[0].innerHTML;
              totalPatrimonio19 =
                parseFloat(
                  totalPatrimonio19.replace(/\,/g, "").replace(/ /g, "")
                ) || 0;
            }

            let total20 = 0;
            let total19 = 0;

            if (val == "3") {
              total20 = totalPasivo20 + totalPatrimonio20;
              total19 = totalPasivo19 + totalPatrimonio19;
            } else if (val == "5") {
              total20 = totalPasivo20 - totalPatrimonio20;
              total19 = totalPasivo19 - totalPatrimonio19;
            }

            rowTotal.insertCell(1).innerHTML = `<div>${$this.formatNumero(
              total20.toFixed(2).toString()
            )}</div>`;
            rowTotal.insertCell(2).innerHTML = `<div>${$this.formatNumero(
              total19.toFixed(2).toString()
            )}</div>`;
          }
        }
      });

      var footer = data[1].CIERRE;
      document.getElementsByClassName("firma1_footer")[0].innerHTML +=
        footer.FIRMA1;
      document.getElementsByClassName("cargo1_footer")[0].innerHTML +=
        footer.CARGO1;

      document.getElementsByClassName("firma2_footer")[0].innerHTML +=
        footer.FIRMA2;
      document.getElementsByClassName("cargo2_footer")[0].innerHTML +=
        footer.CARGO2;

      document.getElementsByClassName("firma3_footer")[0].innerHTML +=
        footer.FIRMA3;
      document.getElementsByClassName("cargo3_footer")[0].innerHTML +=
        footer.CARGO3;

      imprimir_pdf();
    },
    format_ctas(val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    cargarTablactas: function() {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: ""
        })
        .then(data => {
          this.datosctas = data;
        })
        .catch(err => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cuentas Contables",
            estado: true
          });
        });
    },
    get_reporte() {
      this.loader.card = true;
      var cuentaContable = this.form.ctacontab
        ? this.form.ctacontab.cod_puc
        : "0";

      var datos = {
        url: "Financiero/dlls/RpEstsitfinJ.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          this.periodo_cargue.split("-").join("") +
          "|" +
          this.form.nivel.value +
          "|" +
          this.form.selcta.value +
          "|" +
          cuentaContable +
          "|" +
           1  +
          "|",
        method: ""
      };
      post
        .postData(datos)
        .then(data => {
          this.loader.card = false;
          // console.log('Res', data)
          this.format_pdf(data);
        })
        .catch(error => {
          console.error(error);
          this.loader.card = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar estado",
            estado: true
          });
        });
    },
    get_mes(id) {
      var meses = {
        "01": "Enero",
        "02": "Febrero",
        "03": "Marzo",
        "04": "Abril",
        "05": "Mayo",
        "06": "Junio",
        "07": "Julio",
        "08": "Agosto",
        "09": "Septiembre",
        "10": "Octubre",
        "11": "Noviembre",
        "12": "Diciembre"
      };

      return meses[id];
    },
    formatNumero: function(val) {
      var mask = IMask.createMask({
        mask: Number,
        scale: 2,
        thousandsSeparator: ",",
        radix: ".",
        min: -999999999999
      });

      mask.resolve(val.toString());
      return mask.value;
    }
  }
};

function imprimir_pdf() {
  var impresion = window.open("test_titulo", "_blank");
  impresion.document.write(
    `<style>${document.getElementById("css_estados").innerHTML}</style>`
  );
  impresion.document.write(
    document.getElementById("impresion_estados").innerHTML
  );
  setTimeout(() => {
    impresion.document.close();
    impresion.focus();
    impresion.print();
    impresion.close();
    reset_impresion();
  }, 1000);
}

function reset_impresion() {
  // document
  //   .getElementById("activos_table")
  //   .getElementsByTagName("tbody")[0].innerHTML = "";
  // document
  //   .getElementById("pasivos_table")
  //   .getElementsByTagName("tbody")[0].innerHTML = "";
  document
    .getElementById("ingresos_table")
    .getElementsByTagName("tbody")[0].innerHTML = "";

  document.getElementsByClassName("firma1_footer")[0].innerHTML = "";
  document.getElementsByClassName("cargo1_footer")[0].innerHTML = "";
  document.getElementsByClassName("firma2_footer")[0].innerHTML = "";
  document.getElementsByClassName("cargo2_footer")[0].innerHTML = "";
  document.getElementsByClassName("firma3_footer")[0].innerHTML = "";
  document.getElementsByClassName("cargo3_footer")[0].innerHTML = "";
}
</script>
