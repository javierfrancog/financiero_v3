<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-checkbox-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Recepción de Documentos
              </v-list-item-title>
            </v-list-item-content>
            <v-col cols="4" class="d-flex">
              <v-menu
                v-model="pickerFechaini"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fechaini"
                    label="Fecha Recepción:"
                    append-icon="event"
                    outlined
                    hide-details
                    :error="errores.fechaini"
                    @input="errores.fechaini = false"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :min="form.activacion"
                  v-model="form.fechaini"
                  @input="
                    pickerFechaini = false;
                    errores.fechaini = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-list-item>
        </v-card-title>

        <v-row class="mt-5">
          <v-col class="d-flex" cols="3">
            <v-select
              :items="años_select"
              label="Año Remisión"
              outlined
              clearable
              hide-details
              v-model="form.periodo"
              item-text="text"
              item-value="value"
              required
            ></v-select>
          </v-col>

          <v-col class="d-flex" cols="2">
            <v-text-field
              label="Nro.Remisión"
              outlined
              hide-details
              v-model="form.consecutivo"
              @keyup.enter="get_remision()"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="3">
            <v-btn
              color="indigo"
              class="ma-2 white--text"
              @click="get_remision()"
            >
              Consultar
              <v-icon right dark>mdi-checkbox-marked-circle</v-icon>
            </v-btn>
          </v-col>
          <v-col class="d-flex" cols="3">
            <v-btn
              color="green darken-4"
              class="ma-2 white--text"
              @click="guardar()"
            >
              Guardar
              <v-icon right dark>mdi-checkbox-marked-circle</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex" cols="10">
            <v-text-field
              label="Nombre Funcionario que Entrega"
              clearable
              v-model="form.entrega"
              :error="errores.entrega"
              @change="errores.entrega = false"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex" cols="10">
            <v-textarea
              label="Observaciones"
              outlined
              clearable
              v-model="form.observaciones"
              rows="3"
              auto-grow
            ></v-textarea>
          </v-col>
        </v-row>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-col class="mb-4" cols="6" md="6">
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
              <template v-slot:item.nro_rep="{ item }">
                {{ parseFloat(item.nro_rep) }}
              </template>

              <template v-slot:item.remision_rep="{ item }">
                {{ parseFloat(item.remision_rep) }}
              </template>

              <template v-slot:item.remesa_rep="{ item }">
                {{ parseFloat(item.remesa_rep) }}
              </template>
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="borrar_item(item)"
                      color="red darken-4"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Borrar</span>
                </v-tooltip>
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
          <span class="title col-12"
            >{{ dialogo.titulo }} Nro: {{ dialogo.consec }}</span
          >
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Cliente"
                hide-details
                disabled
                v-model="form.cliente"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Fecha Remisión"
                hide-details
                disabled
                v-model="form.fecharemision"
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Placa"
                hide-details
                disabled
                v-model="form.placa"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Producto"
                hide-details
                disabled
                v-model="form.producto"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Mts 3"
                hide-details
                disabled
                v-model="form.mts3"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Destino"
                hide-details
                disabled
                v-model="form.destino"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Vlr Tonelada"
                hide-details
                disabled
                v-model="form.vlrtonelada"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Forma de Pago"
                hide-details
                disabled
                v-model="form.fpagoprov"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="mt-5 mb-3" color="#FF6F00"></v-divider>
          <v-row class="d-flex">
            <v-col cols="3" class="d-flex align-center">
              <v-text-field
                label="Nro.Vale Cliente"
                v-model="form.valecliente"
                hide-details
                @change="errores.valecliente = false"
                :error="errores.valecliente"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="d-flex align-center">
              <v-text-field
                label="Nro.Vale Mina"
                v-model="form.valemina"
                hide-details
                @change="errores.valemina = false"
                :error="errores.valemina"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex">
            <v-col cols="3" class="d-flex align-center">
              <v-text-field
                label="M3 Recibo"
                v-model="form.m3_recibido"
                hide-details
                type="number"
                @change="errores.m3_recibido = false"
                :error="errores.m3_recibido"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="d-flex align-center">
              <v-text-field
                label="Km Recibo"
                v-model="form.km_recibido"
                hide-details
                type="number"
                @change="errores.km_recibido = false"
                :error="errores.km_recibido"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="d-flex align-center">
              <v-text-field
                label="Vlr Combustible"
                hide-details
                type="text"
                required
                v-model="form.vlr_combustible"
                v-money="money"
                @change="errores.vlr_combustible = false"
                :error="errores.vlr_combustible"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex">
            <v-col cols="5" class="d-flex align-center">
              <v-checkbox
                v-model="form.rcbo_mina"
                label="Entrega Recibo Mina"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col cols="5" class="d-flex align-center">
              <v-checkbox
                v-model="form.rcbo_cliente"
                label="Entrega Recibo Cliente"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider class="mt-5 mb-3" color="#FF6F00"></v-divider>
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
            class="ma-2 white--text"
            color="indigo"
            depressed
            large
            @click="agregar()"
            >Agregar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { ordenCombustible } from "../../_formatos_trans";


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
        consec: 0,
      },
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      pickerFecha: false,
      pickerFechaini: false,
      pickerHora: false,
      años_select: [],

      btnEnvio: {
        loader: false,
        disabled: false,
      },

      expanded: [],
      contenido: [],
      datosEmpresa: [],
      item_select: [],
      id_producto: "",

      search: "",
      form: {
        m3_recibido: null,
        km_recibido: null,
        vlr_combustible: null,
        valecliente: null,
        valemina: null,
        idcliente: null,
        idpropietario: null,
        observaciones: null,
      },

      headers: [
        { text: "Remision", align: "center", value: "remision_rep" },
        {
          text: "Fecha Despacho",
          align: "center",
          value: "fecha_rep",
          width: "120px",
        },
        { text: "Vehículo", align: "center", value: "placa_rep" },
        { text: "Producto", align: "center", value: "producto_rep" },
        { text: "Destino", align: "center", value: "destino_rep" },

        { text: "Vale Cliente", align: "center", value: "valecliente_rep" },
        { text: "Vale Mina", align: "center", value: "valemina_rep" },
        // { text: "M3 Mina", align: "center", value: "nroexterno_rep" },
        { text: "M3 Recibo", align: "center", value: "m3recibo_rep" },
        { text: "KM Recibo", align: "center", value: "kmrecibo_rep" },
        { text: "Vlr Combustible", align: "center", value: "combustible_rep" },
        { text: "Entrega Vale Mina", align: "center", value: "tab_vale_mina" },
        {
          text: "Entrega Vale Cliente",
          align: "center",
          value: "tab_vale_cliente",
        },
        { text: "Forma de Pago", align: "center", value: "fpagoprov_rep" },
        { text: "Vlr Tonelada", align: "center", value: "vlrtonelada_rep" },

        { text: "Opciones", align: "center", value: "edit" },
      ],
      errores: {
        entrega: false,
        m3_recibido: false,
        km_recibido: false,
        valecliente: false,
        valemina: false,
        vlr_combustible: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.get_empresa();
    this.cargar_años();
    this.form.fechaini = this.$moment().format("YYYY-MM-DD");
  },
  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 1; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
      this.form.periodo = anioActual;
    },
    get_remision() {
      let fecha = this.form.periodo;
      this.init_form();

      if (fecha) {
        let consecutivo = parseFloat(this.form.consecutivo);
        this.form.cliente = null;
        this.form.fecharemision = null;
        var key = "0001" + "|" + "0001" + "|" + consecutivo + "|" + fecha + "|";
        var datosEnvio = sessionStorage.Sesion + "|" + key;

        this.loader = true;
        post
          .postData({
            url: "TrMcias/dlls/PrRemision01J.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.get_numero();
            let base1_pr = data[0].productos[0].base1_pr;
            this.id_producto = data[0].productos[0].codigo;
            
            let decodedBase1Pr = atob(base1_pr);

            this.form.cliente = data[0].nombre_cliente;
            this.form.idcliente = data[0].nit_cliente.replace(/\,/g, "");
            this.form.idpropietario = data[0].nit_cliente.replace(/\,/g, "");
            this.form.fecharemision = data[0].fechacorta_rep;
            this.form.placa = data[0].placa_pago;
            this.form.producto = decodedBase1Pr;
            this.form.mts3 = data[0].productos[0].cantidad.trim();
            this.form.destino = data[0].productos[0].destino.trim();
            this.form.vlrtonelada = data[0].vlrtonen;
            this.form.fpagoprov = data[0].fpago_prov;
            let nrorecepcion = parseFloat(data[0].nrorecepcion_rem);
            if (nrorecepcion > 100) {
              this.send_error(
                "Remisión ya recepcionada con fecha: " +
                  data[0].fecharecepcion_rem
              );
            } else {
              this.dialogo.estado = true;
              this.dialogo.titulo = "Recepción de Documentos";
            }
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Remisión No encontrada",
              estado: true,
            });
          });
      }
    },
    async get_empresa() {
      await post
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
    get_numero() {
      var datosEnvio = sessionStorage.Sesion + "|";

      this.loader = true;
      post
        .postData({
          url: "TrMcias/dlls/PrRecepcionN.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.dialogo.consec = data[0].msg;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar consecutivo",
            estado: true,
          });
        });
    },
    async guardar() {
      if (!this.form.entrega) {
        this.errores.entrega = true;
        this.$emit("snack", {
          color: "error",
          text: "El campo Nombre Funcionario que Entrega es obligatorio.",
          estado: true,
        });
        return;
      }
      let entrega = this.form.entrega.trim() ? this.form.entrega.trim() : " ";

      let fecha = this.form.fechaini.replace(/\-/g, "");
      let consecutivo = parseFloat(this.form.consecutivo);

      let idpropietario = parseFloat(
        this.form.idpropietario.replace(/\,/g, "")
      );
      let observaciones = this.form.observaciones
        ? this.form.observaciones.trim()
        : " ";
      let tabla_remisiones = await this.enviar_tabla();

      post
        .postData({
          url: "TrMcias/dlls/PrRecepcion.dll",

          data: {
            importarhtml:
              sessionStorage.Sesion +
              "|" +
              consecutivo +
              "|" +
              fecha +
              "|" +
              idpropietario +
              "|" +
              entrega +
              "|" +
              observaciones +
              "|",
            ...tabla_remisiones,
          },
          json: true,
          method: "",
        })
        .then((data) => {
          this.dialogo.estado = false;
          this.contenido = [];
          this.init_form();
          this.form.observaciones = null;
          this.$emit("snack", {
            color: "success",
            text: "Recepcion guardada Correctamente",
            estado: true,
          });
        });
    },
    enviar_tabla() {
      return new Promise((res) => {
        let tablajson = {};
        this.contenido.forEach((item, index) => {
          let format_index = (index + 1).toString().padStart(3, "0");

          let fecha = item.fecha_rep.replace(/\-/g, "");
          let combustible = item.combustible_rep.replace(/\,/g, "");
          let mtsdespacho = item.kgsremesa_rep.replace(/\,/g, "");
          let kmrecibo = item.kmrecibo_rep.replace(/\,/g, "");
          let placa = item.placa_rep.replace(/\,/g, "");
          let producto = item.idproducto_rep.trim();
          let destino = item.destino_rep.trim();

          let remision = item.remision_rep.replace(/\,/g, "");
          let idcliente = parseFloat(item.id_cliente_rep);
          let entregvalecliente = item.vale_cliente;
          let entregvalemina = item.vale_mina;
          let valecliente = item.valecliente_rep;
          let valemina = item.valemina_rep;
          let m3recibo = item.m3recibo_rep.replace(/\,/g, "");
          let fpago = item.fpagoprov_rep;
          let vlrtonelada = item.vlrtonelada_rep.replace(/\,/g, "");

          tablajson[
            `DATOJ-${format_index}`
          ] = `${remision}|${idcliente}|${fecha}|${placa}|${producto}|${valecliente}| ${valemina}|${m3recibo}|${kmrecibo}|${combustible}|${entregvalecliente}|${entregvalemina}|${mtsdespacho}|${destino}|${fpago}|${vlrtonelada}|`;
        });
        res(tablajson);
      });
    },
    init_form() {
      (this.form.valecliente = null),
        (this.form.valemina = null),
        (this.form.m3_recibido = null),
        (this.form.km_recibido = null),
        (this.form.vlr_combustible = null),
        (this.form.rcbo_mina = false),
        (this.form.rcbo_cliente = false),
        (this.form.fpagoprov = null),
        (this.errores = {
          m3_recibido: false,
          km_recibido: false,
          valecliente: false,
          valemina: false,
          vlr_combustible: false,
        });
    },
    agregar() {
      let contenido_tmp = {
        periodo: this.form.periodo,
        id_cliente_rep: this.form.idcliente,
        fecha_rep: this.form.fecharemision,
        remision_rep: this.form.consecutivo,
        placa_rep: this.form.placa,
        producto_rep: this.form.producto,
        idproducto_rep: this.id_producto,
        valecliente_rep: this.form.valecliente,
        fpagoprov_rep: this.form.fpagoprov,
        vlrtonelada_rep: this.form.vlrtonelada,
        valemina_rep: this.form.valemina,
        kgsremesa_rep: this.form.mts3,
        m3recibo_rep: this.form.m3_recibido,
        kmrecibo_rep: this.form.km_recibido,
        combustible_rep: this.form.vlr_combustible,
        destino_rep: this.form.destino,
        vale_cliente: this.form.rcbo_cliente ? "1" : "0",
        tab_vale_cliente: this.form.rcbo_cliente ? "SI" : "NO",
        vale_mina: this.form.rcbo_mina ? "1" : "0",
        tab_vale_mina: this.form.rcbo_mina ? "SI" : "NO",
      };
      if (contenido_tmp) {
        this.contenido.push(contenido_tmp);
        this.dialogo.estado = false;
      }
    },
    borrar_item(item) {
      let index = this.contenido.indexOf(item);
      if (index > -1) {
        this.contenido.splice(index, 1);
      }
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
