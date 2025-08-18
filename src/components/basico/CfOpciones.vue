<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-qrcode-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Opciones del Menú</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="success"
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
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
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
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="modulos"
                label="Módulo"
                hide-details
                clearable
                outlined
                type="text"
                required
                v-model="form.modulo"
                return-object
                :error="errores.modulo"
                @input="errores.modulo = false"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="menu"
                label="Menú"
                hide-details
                clearable
                outlined
                type="text"
                required
                v-model="form.menu"
                return-object
                :error="errores.menu"
                @input="errores.menu = false"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="submenu1"
                label="SubMenú_1"
                hide-details
                clearable
                outlined
                type="text"
                required
                v-model="form.submenu1"
                return-object
                :error="errores.submenu1"
                @input="errores.submenu1 = false"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :items="submenu2"
                label="SubMenú_2"
                hide-details
                clearable
                outlined
                type="text"
                required
                v-model="form.submenu2"
                return-object
                :error="errores.submenu2"
                @input="errores.submenu2 = false"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Codigo Opcion"
                clearable
                outlined
                required
                v-model="form.opcion"
                :error="errores.opcion"
                @input="errores.opcion = false"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="12">
              <v-text-field
                label="Descripcion"
                clearable
                outlined
                required
                v-model="form.descrip"
                :error="errores.descrip"
                @input="errores.descrip = false"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.estado" label="Bloquear"></v-switch>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
          </v-row>
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
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      modulos: [
        { text: "Financiero", value: "FIN" },
        { text: "Mercancías", value: "MER" },
        { text: "G.Talento H", value: "GTH" },
        { text: "Recaudos", value: "RSP" },
        { text: "Transporte", value: "TRA" },
        { text: "Imagenologia", value: "CLI" },
        { text: "Molinos", value: "MOL" },
        { text: "Serv.Salud", value: "SSA" },
        { text: "H.Clinica", value: "HCL" },
        { text: "Dispensación", value: "DSP" },
        { text: "Servicios Domiciliarios", value: "SDM" },
      ],
      menu: [
        { text: "Procesos", value: "1" },
        { text: "Reportes", value: "2" },
        { text: "Configuración", value: "3" },
      ],

      submenu1: [
        { text: "No Aplica", value: "0" },
        { text: "Contables", value: "1" },
        { text: "Tributarios", value: "2" },
        { text: "Entidades Control", value: "3" },
        { text: "Mercancias", value: "4" },
        { text: "Otras Configuraciones", value: "5" },
        { text: "Comercial", value: "6" },
        { text: "Tesoreria", value: "7" },
        { text: "Inventarios", value: "8" },
        { text: "Ordenes de Compra", value: "9" },
        { text: "Otros Procesos", value: "10" },
        { text: "Facturación", value: "11" },
        { text: "Cartera", value: "12" },
        { text: "Proveedores", value: "13" },
        { text: "Punto de Venta", value: "14" },
        { text: "Remisiones", value: "15" },
        { text: "Asesores", value: "16" },
        { text: "Notas Crédito", value: "17" },
        { text: "Cierres", value: "18" },
        { text: "Notas Débito", value: "19" },

        { text: "Bascula", value: "20" },
        { text: "Liquidaciones", value: "21" },
        { text: "Industrial", value: "22" },

        { text: "Asobancaria", value: "30" },
        { text: "Convenios", value: "31" },
        { text: "Documento Soporte", value: "32" },

        { text: "Medicos", value: "40" },
        { text: "Enfermeria", value: "41" },

        { text: "Prestación Servicios", value: "50" },
        { text: "Agendas", value: "51" },
        { text: "Pacientes", value: "52" },
        { text: "Productividad", value: "53" },
        { text: "Historia Clinica", value: "54" },
        { text: "Recaudos", value: "55" },
        { text: "Furips", value: "56" },

        { text: "Dispensación", value: "60" },
        { text: "Lecturas", value: "70" },
        { text: "Finaciaciones", value: "71" },
        { text: "Suspensiones", value: "72" },
      ],
      submenu2: [
        { text: "No Aplica", value: "0" },
        { text: "Otros Procesos", value: "1" },
      ],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Modulo", align: "center", value: "modulo_rep" },
        { text: "Menu", align: "center", value: "menu_rep" },
        { text: "SubMenu1", align: "center", value: "submenu1_rep" },
        { text: "SubMenu2", align: "center", value: "submenu2_rep" },
        { text: "Opción", align: "center", value: "opcion_rep" },
        { text: "Descripción", align: "left", value: "descrip_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        modulo: false,
        menu: false,
        submenu1: false,
        submenu2: false,
        opcion: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarcontenido();
  },
  computed: {},
  methods: {
    editar_item(data) {
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      this.form.modulo = data.cod_rep;
      this.form.opcion = data.opcion_rep;
      this.form.descrip = data.descrip_rep.trim();

      let busqueda_menu1 = this.modulos.find(
        (el) => el.value == data.modulo_rep
      );
      this.form.modulo = busqueda_menu1;

      let busqueda_menu2 = this.menu.find((el) => el.value == data.menu_rep);
      this.form.menu = busqueda_menu2;

      let busqueda_menu3 = this.submenu1.find(
        (el) => el.value == parseFloat(data.submenu1_rep)
      );
      this.form.submenu1 = busqueda_menu3;

      let busqueda_menu4 = this.submenu2.find(
        (el) => el.value == parseFloat(data.submenu2_rep)
      );
      this.form.submenu2 = busqueda_menu4;

      this.form.estado = data.estado_rep == "1" ? true : false;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.opcion) {
        this.errores.opcion = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var modulo = data.modulo.value;
      var menu = data.menu.value;
      var submenu1 = data.submenu1 ? data.submenu1.value : "0";
      var submenu2 = data.submenu2 ? data.submenu2.value : "0";
      var descrip = data.descrip.trim();
      var opcion = data.opcion;
      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      let dataenvio = [
        sessionStorage.Sesion,
        modulo,
        menu,
        submenu1,
        submenu2,
        opcion,
        descrip,
        estado,
        eliminar,
      ];
      this.postData({
        url: "Financiero/dlls/Cfopciones.dll",
        data: dataenvio.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.card_estado = false;
          this.$emit("msj", data[0], "green", 1000);
          this.dialogo.estado = false;
          this.cargarcontenido();
        })
        .catch((err) => {
          this.card_estado = false;
          this.dialogo.estado = false;
          this.form.barras = null;
          this.$emit("msj", err[0], "red", 500);
        });
    },
    agregar_item() {
      this.form.estado = 0;
      this.dialogo.titulo = "Agregar nuevo Registro";
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
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfopcionesJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Opciones",
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
