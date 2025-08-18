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
                type="month"
                @input="pickerMes = false"
              ></v-date-picker>
            </v-menu>
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
              item-key="numero_fact"
              :search="search"
              class="elevation-1"
              @item-expanded="getBases"
            >
              <!-- <template v-slot:item.numero_fact="{ item }">
                {{ parseInt(item.numero_fact) }}
              </template> -->

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
                          <td class="text-center">{{ el.nombre_servicio }}</td>
                          <td class="text-center">{{ el.cantidad }}</td>
                          <td class="text-center">{{ el.tot_producto }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </td>
              </template>

              <template v-slot:item.estadobase_rep="{ item }">{{
                item.estadobase_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

              <template v-slot:item.idcliente_fact="{ item }">
                {{ parseInt(item.idcliente_fact) }}
              </template>

              <template v-slot:item.numero_fact="{ item }">
                {{ parseInt(item.numero_fact) }}
              </template>

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
                label="Cargos / descuentos"
                v-model="dialogoModificar.select"
                :items="dialogoModificar.data.basesfactura"
                item-text="descripcion_rep"
                item-value="codigo_rep"
                outlined
                hide-details
                clearable
                return-object
                @change="editarDevengo"
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
                type="number"
                ref="input_cantidad"
                :disabled="dialogoModificar.select.editcant_rep == '0'"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end">
            <v-col cols="6">
              <!-- <v-text-field
                label="Valor"
                outlined
                hide-details
                v-model="dialogoModificar.select.valor_rep"
                v-money="money"
                :disabled="dialogoModificar.select.cajacantidad_rep == '0' || dialogoModificar.select.clasifbase_rep == '04' ? false : true"
                ref="input_valor"
              ></v-text-field> -->
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
                label="Devengos / deducciones"
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
import { factura_titan } from "../../_formatos_ph.js";

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
      contenido: [],
      datosEmpresa: [],
      ruts3: [],
      search: "",
      form: {},

      headers: [
        { text: "Id Unidad", align: "center", value: "idcliente_fact" },
        { text: "Unidad", align: "center", value: "unidadph_fact" },
        {
          text: "Nombres y Apellidos",
          align: "left",
          value: "cliente_fact",
        },
        { text: "Factura", align: "center", value: "numero_fact" },
        { text: "Valor", align: "center", value: "valor_fact" },
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
    this.get_basico();
    this.get_ruts3();
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
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
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
    async getBasesFactura(item) {
      let consec = item.numero_fact;
      let prefijo = "PH";
      let agencia = "0001";
      let fecha = item.fecha_fact.substring(0, 4);
      let response = await post.postData({
        url: "Phorizontal/dlls/PrFact01J.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          agencia +
          "|" +
          prefijo +
          "|" +
          consec +
          "|" +
          fecha +
          "|",
        method: "",
      });
      return response[0].productos;
    },
    guardar_cambios() {
      this.dialogoModificar.load = true;
      var items = this.dialogoModificar.data.basesfactura;
      this.get_plano(items).then((plano) => {
        let consec = this.dialogoModificar.data.numero_fact;
        let prefijo = "PH";
        let agencia = "0001";
        let fecha = this.dialogoModificar.data.fecha_fact.substring(0, 4);
        this.loader = true;
        post
          .postData({
            url: "Phorizontal/dlls/PrFactM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              agencia +
              "|" +
              prefijo +
              "|" +
              consec +
              "|" +
              fecha +
              "|" +
              plano +
              "|",
            method: "",
          })

          .then((data) => {
            this.dialogoModificar.load = false;
            this.cancelar_modificar();
            this.cargarcontenido();
          })
          .catch((err) => {
            console.log(err.Mensaje[0]);
            this.dialogoModificar.load = false;
            this.send_error(err.Mensaje[0]);
          });
      });
    },
    get_plano(items) {
      return new Promise((resolve, reject) => {
        var array = [];

        items.forEach((el) => {
          array.push({
            codigo: el.codigo_rep.substr(0, 4),
            cantidad: el.cantidad_rep
              ? el.cantidad_rep.toString().replace(/\,/g, "")
              : "1",
            valor: el.valor_rep.replace(/\,/g, "").replace(/\-/g, "").trim(),
            intereses: "0",
            ccosto: "9999",
          });
        });

        var formData = new FormData();
        formData.append("tipo", "prGenera");
        formData.append("data", JSON.stringify(array));

        fetch("https://server1ts.net//financiero/inc/planos.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.code == "0") resolve(result.mensaje);
            else reject(result.mensaje);
          })
          .catch((error) => reject(error));
      });
    },
    agregar_devengo() {
      var nuevo = this.dialogoModificar.nuevo_devengo;
      var actuales = this.dialogoModificar.data.basesfactura;

      var busqueda = actuales.find(
        (el) => el.codigo_rep == nuevo.llavebase_rep
      );

      if (!busqueda) {
        actuales.push({
          cantidad_rep: "0",
          valor_rep: "0",
          ccostonomina_rep: "9999",
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
      var bases = actual.basesfactura;

      var busqueda = bases.findIndex(
        (el) => el.codigo_rep.trim() == select.codigo_rep.trim()
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

        this.dialogoModificar.select.cantidad_rep = cantidad;
        this.dialogoModificar.select.valor_rep = valor;
        // this.dialogoModificar.select.clasifbase_rep = item.clasifbase_rep;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          cantidad;
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value =
          valor;
      } else {
        this.dialogoModificar.select = {};
        this.dialogoModificar.select.cantidad_rep = null;
        this.dialogoModificar.select.valor_rep = null;
        this.dialogoModificar.select.ccostonomina_rep = null;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          "0";
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
      }
    },
    // editar_item(data) {
    //   this.dialogoModificar.estado = true;
    //   this.dialogoModificar.data = JSON.parse(JSON.stringify(data));
    // },
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
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var periodo = data.fecha ? data.fecha.replace(/\-/g, "") : "";
      var detalle = data.informacion? data.informacion.trim() : "";

      let datos = {
        url: "Phorizontal/dlls/PrFact01.dll",
        data: sessionStorage.Sesion + "|" + periodo + "|" + detalle + "|",
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
      this.dialogo.titulo = "Generar Nueva Facturación" + " " + this.form.fecha;
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

    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },
    cargarfactura(item) {
      let consec = item.numero_fact;
      let prefijo = "PH";
      let agencia = "0001";
      let fecha = item.fecha_fact.substring(0, 4);
      this.loader = true;
      post
        .postData({
          url: "Phorizontal/dlls/PrFact01J.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            agencia +
            "|" +
            prefijo +
            "|" +
            consec +
            "|" +
            fecha +
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
    async imprimir_factura(data, getBase64) {
      let descripcion64 = " ";

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);

      const logo = await this.pdfs.getBase64(logo_src);
      data.logo = logo;
      data.condicion = this.condicion_pdf;

      await factura_titan(data);
    },
    cargarcontenido() {
      var periodo = this.form.fecha ? this.form.fecha.replace(/\-/g, "") : "";
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Phorizontal/dlls/PrFact02J.dll",
          data: sessionStorage.Sesion + "|" + periodo + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
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
            text: "Error al consultar Facturación",
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
    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    get_basico: function () {
      post
        .postData({
          url: "Phorizontal/dlls/CfCargosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaBases = data;
        })
        .catch((err) => {
          this.send_error("Error al consultar bases");
        });
    },
  },
};
</script>
