<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-alien</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Actualiza Documentos Proveedor</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Año"
                  clearable
                  outlined
                  type="text"
                  required
                  v-model="form.ano"
                  @keyup.enter="focusNextField('proveedor')"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="2">
                <v-text-field
                  label="Id_Proveedor"
                  clearable
                  outlined
                  type="text"
                  id="proveedor"
                  required
                  v-model="form.id"
                  @keyup.enter="consultar()"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="5">
                <v-text-field
                  label="Proveedor"
                  clearable
                  outlined
                  disabled
                  type="text"
                  required
                  v-model="form.descripcion"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-btn
                  class="ma-2 white--text"
                  color="indigo"
                  depressed
                  large
                  @click="consultar()"
                  >Consultar</v-btn
                >
              </v-col>
            </v-row>

            <v-divider></v-divider>
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

            <v-row>
              <v-col>
                <v-data-table
                  dense
                  :search="search"
                  item-key="conta_prov"
                  :headers="[
                    { text: 'Tipo', value: 'tipo_prov' },
                    { text: 'Agencia', value: 'agencia_prov' },
                    { text: 'Cuenta', value: 'descta_prov' },
                    { text: 'Fecha', value: 'fecha_prov' },
                    {
                      text: 'Factura',
                      value: 'documento_prov',
                      align: 'center',
                    },
                    //                      { text: 'Vence', value: 'fecha_prov' },
                    { text: 'Saldo', value: 'valor_prov', align: 'right' },
                    {
                      text: 'Registro',
                      value: 'registro_prov',
                      align: 'right',
                    },
                    { text: 'Seleccionar', value: 'btn', align: 'center' },
                  ]"
                  :items="facturasPendientes_cancelacion"
                >
                  <template v-slot:body.append>
                    <tr>
                      <td></td>
                      <td></td>
                      <td class="text-right"><b>Total: </b></td>
                      <td class="text-right">
                        $ {{ formatNumero(total_pendientes) }}
                      </td>
                      <td></td>
                    </tr>
                  </template>
                  <template v-slot:item.btn="{ item }">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="blue accent-3"
                          fab
                          small
                          icon
                          v-on="on"
                          @click="editItem(item)"
                        >
                          <v-icon>mdi-pencil-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Editar item</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="red accent-3"
                          fab
                          small
                          icon
                          v-on="on"
                          @click="deleteItem(item)"
                        >
                          <v-icon>mdi-delete-alert-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Eliminar item</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialogo_modificar.estado" persistent max-width="400">
      <v-card class="pa-2">
        <v-card-title>
          <span class="title">Modificar valor</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Valor"
                outlined
                clearable
                hide-details
                :value="formatNumero(dialogo_modificar.valor)"
                @input="input_mask_cancelacion()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                color="red darken-2"
                outlined
                depressed
                class="mr-2"
                @click="
                  dialogo_modificar.estado = false;
                  dialogo_modificar.valor = null;
                "
                >Cancelar</v-btn
              >
              <v-btn
                color="indigo"
                depressed
                class="white--text"
                @click="modificar_valor_item_ctx"
                >Aceptar</v-btn
              >
            </v-col>
          </v-row>
          <v-col class="d-flex" cols="12" sm="3">
            <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>

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
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      buscar_pendientes: null,
      facturasPendientes_cancelacion: [],
      total_pendientes: 0,
      search: "",

      dialog: true,
      valid: false,
      dialogo_modificar: {
        estado: false,
        index: null,
        valor: null,
        agencia: null,
        cuenta: null,
        documento: null,
        registro: null,
        tipo: 0,
        fecha: null,
      },

      form: {
        descripcion: "",
        id: 0,
      },
      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
      },
      disabled: {
        eliminar: true,
      },

      card_estado: false,
    };
  },
  created() {
    this.form.id = 900147238;
    this.form.ano = 2025;
  },
  computed: {},
  methods: {
    consultar() {
      this.form.descripcion = "";
      this.facturasPendientes_cancelacion = [];

      let id = this.form.id;
      let año = this.form.ano;
      post
        .postData({
          url: "Financiero/dlls/PractprovJ.dll",
          data: sessionStorage.Sesion + "|" + id + "|" + año + "|",
          method: "",
        })
        .then((data) => {
          data.pop();

          this.form.descripcion = data[0].proveedor_rep.trim();
          this.facturasPendientes_cancelacion = JSON.parse(
            JSON.stringify(data)
          );

          this.loader = false;
          this.disabled.eliminar = false;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].Msg,
            estado: true,
          });
        });
    },
    editItem(item) {
      let index = this.facturasPendientes_cancelacion.indexOf(item);
      let valor = parseFloat(item.valor_prov.replace(/\,/g, "")) || 0;
      let agencia = item.agencia_prov;
      let cuenta = item.cuenta_prov;
      let documento = item.documento_prov;
      let registro = item.registro_prov;
      let tipo = item.tipo_prov;
      let fecha = item.fecha_prov.replace(/\-/g, "");

      this.dialogo_modificar.index = index;
      this.dialogo_modificar.valor = valor;
      this.dialogo_modificar.agencia = agencia;
      this.dialogo_modificar.cuenta = cuenta;
      this.dialogo_modificar.documento = documento;
      this.dialogo_modificar.registro = registro;
      this.dialogo_modificar.fecha = fecha;
      this.dialogo_modificar.tipo = tipo;

      this.dialogo_modificar.estado = true;
      this.form.eliminar = false;
    },
    modificar_valor_item_ctx() {
      this.dialogo_modificar.estado = false;
      var eliminar = this.form.eliminar ? "1" : "0";
      let valor = this.formatNumero(this.dialogo_modificar.valor).replace(
        /\,/g,
        ""
      );
      let agencia = this.dialogo_modificar.agencia;
      let cuenta = this.dialogo_modificar.cuenta;
      let documento = this.dialogo_modificar.documento;
      let registro = this.dialogo_modificar.registro;
      let fecha = this.form.ano;
      let id = this.form.id;
      let tipo = this.dialogo_modificar.tipo;

      post
        .postData({
          url: "Financiero/dlls/Practprov.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            agencia +
            "|" +
            id +
            "|" +
            cuenta +
            "|" +
            documento +
            "|" +
            registro +
            "|" +
            valor +
            "|" +
            eliminar +
            "|" +
            tipo +
            "|",
          method: "",
        })
        .then((data) => {
          this.consultar();
          this.loader = false;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].Msg,
            estado: true,
          });
        });
    },
    input_mask_cancelacion() {
      let val = event.target.value;
      let val_edit = val.replace(/,/g, "");
      this.$set(this.dialogo_modificar, "valor", val_edit);
    },
    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
    },
    deleteItem(item) {
      let registro = item.registro_prov;
      let fecha = this.form.ano;
      let id = this.form.id;

      post
        .postData({
          url: "Financiero/dlls/Practprovx.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            fecha +
            "|" +
            id +
            "|" +
            registro +
            "|",
          method: "",
        })
        .then((data) => {
          this.consultar();
          this.loader = false;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: err.Mensaje[0].Msg,
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
