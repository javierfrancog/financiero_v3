<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-details</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Perfiles de Usuarios</v-list-item-title
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
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="descrip_rep"
              :search="search"
              :single-expand="singleExpand"
            >
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
            <v-col class="d-flex" cols="4" sm="3">
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
            <v-col class="d-flex" cols="8" sm="5">
              <v-text-field
                label="Descripción Perfil"
                clearable
                outlined
                required
                v-model="form.descripcion"
                :error="errores.descripcion"
                @input="errores.descripcion = false"
                hide-details
              ></v-text-field>
            </v-col>
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
                @change="
                  get_tipo();
                  errores.modulo = false;
                "
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6" sm="5">
              <v-autocomplete
                label="Punto de Entrega"
                v-model="form.punto_fact"
                :items="agencias"
                :item-text="format_punto_fact"
                item-value="codigo_agc"
                hide-details
                outlined
                return-object
                :error="errores.punto_fact"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="6" sm="7">
              <v-autocomplete
                label="Ubicacion"
                :items="ubica"
                outlined
                clearable
                return-object
                persistent-hint
                required
                hide-details
                item-value="codigo_ubic"
                v-model="form.ubicacion"
                :item-text="format_ubicacion"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                label="Cuenta Caja"
                v-model="form.ctacaja"
                :items="tablaPuc"
                :item-text="format_cuentac"
                item-value="cod_puc"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                label="Cuenta Banco"
                v-model="form.ctabanco"
                :items="tablaPuc"
                :item-text="format_cuentac"
                item-value="cod_puc"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-divider color="succes"></v-divider>

          <v-col class="d-flex justify-center" cols="12" sm="12">
            <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
          </v-col>

          <v-row class="d-flex mb-4 justify-center" no-gutters>
            <v-col class="mb-4" cols="6" sm="6">
              <v-text-field
                v-model="search2"
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
                :headers="[
                  { text: 'Descripcion', value: 'descrip_rep' },
                  { text: 'Estado', value: 'estado', align: 'center' },
                ]"
                :items="contmodulo"
                item-key="descrip_rep"
                :single-expand="singleExpand"
                :search="search2"
              >
                <template v-slot:item.estado="{ item }">
                  <div class="d-flex justify-center">
                    <v-switch
                      v-model="item.estado"
                      :label="`${item.estado ? 'Activo' : 'Inactivo'}`"
                    ></v-switch>
                  </div>
                </template>
              </v-data-table>
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
      singleExpand: true,
      expanded: [],
      contenido: [],
      contmodulo: [],
      agencias: [],
      tablaPuc: [],
      ubica: [],

      search: "",
      search2: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "cod_rep" },
        { text: "Descripción", align: "left", value: "descrip_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      modulos: [
        { text: "Financiero", value: "FIN" },
        { text: "Mercancías", value: "MER" },
        { text: "G.Talento H", value: "GTH" },
        { text: "Recaudos", value: "RSP" },
        { text: "Transporte", value: "TRA" },
        { text: "Clinico", value: "CLI" },
        { text: "Molinos", value: "MOL" },
        { text: "Serv.Salud", value: "SSA" },
        { text: "H.Clinica", value: "HCL" },
        { text: "Dispensación", value: "DSP" },
        { text: "Serv.Domiciliarios", value: "SDM" },
      ],
      errores: {
        codigo: false,
        estado: false,
        modulo: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarcontenido();
    this.cargarTablaAg();
    this.cargarTablaubica();
    this.get_puc();
  },
  computed: {},
  methods: {
    get_tipo() {
      let tipo = this.dialogo.tipo;

      if (tipo == 0) this.getModulos();
      else if (tipo == 1) this.getPerfil();
    },
    getModulos() {
      var modulo = this.form.modulo.value;
      if (modulo) {
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/CfopcionesJ.dll",
            data: sessionStorage.Sesion + "|" + modulo + "|",
            method: "",
          })
          .then((res) => {
            this.loader = false;
            res.pop();
            let data = JSON.parse(JSON.stringify(res));

            this.contmodulo = data.map((el) => {
              el.estado = el.estado_rep == "0" ? false : true;
              return el;
            });
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.send_error("Error al cargar Modulos");
          });
      }
    },
    getPerfil() {
      var modulo = this.form.modulo.value;
      var perfil = this.form.codigo;
      if (modulo) {
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/CfPerfil02J.dll",
            data: sessionStorage.Sesion + "|" + perfil + "|" + modulo + "|",
            method: "",
          })
          .then((res) => {
            this.loader = false;
            let data = JSON.parse(JSON.stringify(res));
            data.pop();

            this.contmodulo = data.map((el) => {
              el.estado = el.estado_rep == "0" ? false : true;
              return el;
            });
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.send_error("Error al cargar Modulos");
          });
      }
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Perfil";
      this.dialogo.tipo = 1;
      this.form.codigo = item.cod_rep;
      this.form.descripcion = item.descrip_rep;

      var busqueda_pto = this.agencias.find(
        (el) => el.codigo_agc == item.punto_rep
      );
      this.form.punto_fact = busqueda_pto;

      var busqueda_ubic = this.ubica.find(
        (el) => el.codigo_ubic == item.ubica_rep
      );
      this.form.ubicacion = busqueda_ubic;

      var busqueda_caja = this.tablaPuc.find(
        (el) => el.cod_puc == item.ctacaja_rep
      );
      this.form.ctacaja = busqueda_caja;

      var busqueda_banco = this.tablaPuc.find(
        (el) => el.cod_puc == item.ctabancos_rep
      );
      this.form.ctabanco = busqueda_banco;

      this.contmodulo = [];
    },
    cerrar_opc() {},
    guardar: function () {
      const _this = this;
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Codigo Obligatorio!");
      } else if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Descripcion Obligatoria!");
      } else if (!data.modulo) {
        this.errores.modulo = true;
        this.send_error("Modulo Obligatorio!");
      } else {
        let items = JSON.parse(JSON.stringify(this.contmodulo));
        if (items.length === 0) {
          this.send_error("Modulo Sin Opciones!");
        } else {
          let detalle_format = [];
          items.forEach((el) => {
            let obj = {
              menu_rep: el.menu_rep,
              modulo_rep: el.modulo_rep,
              submenu1_rep: el.submenu1_rep,
              submenu2_rep: el.submenu2_rep,
              estado_rep: el.estado,
              opcion_rep: el.opcion_rep,
            };
            detalle_format.push(obj);
          });
          this.get_plano(detalle_format).then((plano) => {
            _this.format_envio(data, plano);
          });
        }
      }
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
    cargarTablaubica: function () {
      post
        .postData({
          url: "Financiero/dlls/CfUbicacionesJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.ubica = data;
          // this.form.ubicacion = {
          //   codigo_ubic: "0001",
          //   estado_ubic: "0",
          //   descrip_ubic: "BODEGA PRINCIPAL",
          // };
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ubicaciones",
            estado: true,
          });
        });
    },
    get_puc: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaPuc = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
    format_cuentac: function (val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },

    // format_perfil() {
    //   return new Promise((res) => {
    //     let pasajeros_list = this.sillas_list;
    //     let obj = {};
    //     pasajeros_list.forEach((el, index) => {
    //       let format_index = (index + 1).toString().padStart(3, "0");
    //       obj[`DATOJ-${format_index}`] = `${
    //         el.pasajero.id.id_pas
    //           ? el.pasajero.id.id_pas.trim()
    //           : el.pasajero.id
    //       }|${el.silla.silla}|${el.pasajero.temperatura}|${
    //         el.pasajero.nombre
    //       }|`;
    //     });

    //     res(obj);
    //   });
    // },

    get_plano(array) {
      return new Promise((resolve, reject) => {
        let data = array.map((el) => {
          el.estado_rep = el.estado_rep ? "1" : "0";
          return el;
        });

        var formData = new FormData();
        formData.append("tipo", "perfiles");
        formData.append("data", JSON.stringify(data));

        fetch("https://server1ts.net//financiero/inc/planos.php", {
          // fetch("https://server1ts.net//financiero/inc/compContab_plano.php", {
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
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_ubicacion: function (val) {
      return `${val.codigo_ubic} - ${val.descrip_ubic}`;
    },

    format_envio(data, plano) {
      this.card_estado = true;
      let codigo = data.codigo;
      let descripcion = data.descripcion.trim();
      let modulo = data.modulo ? data.modulo.value : "0";
      let punto = data.punto_fact ? data.punto_fact.codigo_agc : "0";
      let ubicacion = data.ubicacion ? data.ubicacion.codigo_ubic : "0";
      var ctacaja = data.ctacaja ? data.ctacaja.cod_puc : "0";
      var ctabanco = data.ctabanco ? data.ctabanco.cod_puc : "0";
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Financiero/dlls/Cfperfil.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          descripcion +
          "|" +
          modulo +
          "|" +
          punto +
          "|" +
          ubicacion +
          "|" +
          plano +
          "|" +
          eliminar +
          "|" +
          ctacaja +
          "|" +
          ctabanco +
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
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
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
          url: "Financiero/dlls/CfPerfilJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar perfiles",
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
