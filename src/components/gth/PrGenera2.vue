<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-account-star</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Liquidación Prima de Servicios</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="12" sm="2">
            <v-select
              :items="años_select"
              label="Año"
              outlined
              clearable
              hide-details
              v-model="form.periodo_cargue"
              item-text="text"
              item-value="value"
              required
              :error="errores.anoselect"
            ></v-select>
          </v-col>

          <v-col class="d-flex" cols="8" sm="3">
            <v-select
              :items="periodos"
              label="Semestre"
              outlined
              clearable
              return-object
              hide-details
              v-model="form.periodo"
              required
            ></v-select>
          </v-col>
        </v-row>

        <v-row class="justify-end">
          <v-btn
            color="orange"
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
            color="indigo"
            class="ma-2 white--text"
            large
            depressed
            @click="agregar_item()"
          >
            Generar Prima
            <v-icon right dark class="ml-4">mdi-plus-thick</v-icon>
          </v-btn>

          <v-btn
            color="success"
            class="ma-2 white--text"
            large
            depressed
            @click="descargar_soporte()"
          >
            Descargar Bases
            <v-icon right dark class="ml-4">mdi-plus-thick</v-icon>
          </v-btn>

          <!-- <v-btn color="success" class="ma-2 white--text" large depressed @click="agregar_colabora()">
            Agregar Colaborador
            <v-icon right dark class="ml-4">mdi-plus-thick</v-icon>
          </v-btn> -->
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
              item-key="idnomina_rep"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <!-- <th class="orange--text">Base</th> -->
                          <th class="orange--text text-left">Descripción</th>
                          <th class="orange--text text-left">Cantidad</th>
                          <th class="orange--text text-rigth">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="el in item.basesnomina_rep"
                          :key="el.codigo_rep"
                        >
                          <!-- <td>{{ el.codigo_rep }}</td> -->
                          <td class="text-left">{{ el.descripcion_rep }}</td>
                          <td class="text-left">{{ el.cantidad_rep }}</td>
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
                label="Información para desprendibles"
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
              <!-- <v-btn color="primary" depressed @click="dialogoAgregar.estado = true">Agregar nuevo</v-btn> -->
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                :items="dialogoModificar.data.basesnomina_rep"
                item-text="descripcion_rep"
                item-value="codigo_rep"
                label="Devengos / deducciones"
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
      colaborador: [],
      search: "",
      form: {},
      ruta: "",      
      periodos: [
        { text: "1er Semestre", value: 1 },
        { text: "2do Semestre", value: 2 },
      ],

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Apellido1", align: "left", value: "Apellido1nomina_rep" },
        { text: "Nombre", align: "left", value: "nombresnomina_rep" },
        { text: "Cargo", align: "left", value: "descripcargo_rep" },
        { text: "Neto", align: "left", value: "netonomina_rep" },
        { text: "Opciones", value: "edit", align: "center" },
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
    this.cargarTablaAg();
    this.get_basico();
    // this.cargarcolaborador();
    this.cargar_años();
  },
  methods: {
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.años_select = anios;
    },

    guardar_cambios() {
      this.dialogoModificar.load = true;
      var items = this.dialogoModificar.data.basesnomina_rep;
      this.get_plano(items).then((plano) => {
        var sesion = sessionStorage.Sesion;
        var fecha = this.form.periodo.value || "0";
        fecha =  fecha == 1 ? this.form.periodo_cargue + "0630" : this.form.periodo_cargue + "1231";
        var periodo = this.form.periodo.value || "0";
        periodo =  periodo == 1 ? 6 : 12 ;

        var idNomina = this.dialogoModificar.data.idnomina_rep;
        var agencia = this.dialogoModificar.data.agencianomina_rep;
        var datosEnvio =
          sesion +
          "|" +
          fecha +
          "|" +          
          periodo +
          "|" +
          idNomina +
          "|" +
          agencia +
          "|" +
          plano +
          "|";

        // console.log("Terminado", plano, datosEnvio);

        post
          .postData({
            url: "Financiero/dlls/PrGthGeneraM.dll",
            data: datosEnvio,
            method: "",
          })
          .then((data) => {
            this.dialogoModificar.load = false;
            this.cancelar_modificar();
            this.cargarcontenido();
          })
          .catch((err) => {
            this.dialogoModificar.load = false;
            this.send_error("Ha ocurrido un error al grabar los datos");
          });
      });
    },
    get_plano(items) {
      return new Promise((resolve, reject) => {
        var array = [];

        items.forEach((el) => {
          array.push({
            codigo: el.codigo_rep.trim(),
            cantidad: el.cantidad_rep.trim().replace(/\,/g, ""),
            valor: el.valor_rep.trim().replace(/\,/g, ""),
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
      var actuales = this.dialogoModificar.data.basesnomina_rep;

      var busqueda = actuales.find(
        (el) => el.codigo_rep == nuevo.llavebase_rep
      );

      if (!busqueda) {
        actuales.push({
          cantidad_rep: "0",
          valor_rep: "0",
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
    cancelar_modificar() {
      this.dialogoModificar.estado = false;
      this.dialogoModificar.data = {};
      this.dialogoModificar.select = {};

      this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
        "0";
      this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
    },
    eliminar_devengo() {
      var actual = JSON.parse(JSON.stringify(this.dialogoModificar.data));
      var select = this.dialogoModificar.select;
      var bases = actual.basesnomina_rep;

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

        this.dialogoModificar.select.cantidad_rep = cantidad;
        this.dialogoModificar.select.valor_rep = valor;
        // this.dialogoModificar.select.clasifbase_rep = item.clasifbase_rep;

        this.$refs.input_cantidad.$el.getElementsByTagName(
          "input"
        )[0].value = cantidad;
        this.$refs.input_valor.$el.getElementsByTagName(
          "input"
        )[0].value = valor;
      } else {
        this.dialogoModificar.select = {};
        this.dialogoModificar.select.cantidad_rep = null;
        this.dialogoModificar.select.valor_rep = null;

        this.$refs.input_cantidad.$el.getElementsByTagName("input")[0].value =
          "0";
        this.$refs.input_valor.$el.getElementsByTagName("input")[0].value = "0";
      }
    },
    editar_item(data) {
      // console.log("Editar", data);
      this.dialogoModificar.estado = true;
      this.dialogoModificar.data = JSON.parse(JSON.stringify(data));
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.periodo) {
        this.errores.periodo = true;
        this.send_error("Periodo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var año = data.periodo_cargue;
      var periodo = data.periodo.value || "9";
      var agencia = data.agencia.codigo_agc || "0";
      var detalle = data.informacion || "";
      let datos = {
        url: "Financiero/dlls/PrGthGenera2.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          agencia +
          "|" +
          año +
          "|" +
          periodo +
          "|" +
          detalle +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Prima Generada correctamente",
            estado: true,
          });
        this.ruta = data[0];
        console.log(data),
        console.log(this.ruta),
        
        this.cargarcontenido();        
        this.dialogo.estado = false;        
        this.card_estado = false;        
        // this.card_estado = false;
        })
        .catch((error) => {
          this.card_estado = false;
          this.send_error(error.Mensaje[0]);
        });
    },
    descargar_soporte() {
      return new Promise((res) => {
        let archivo = this.ruta;
        let nom_plano = `D:\\TITAN\\TMP\\${archivo}`;
        var formData = new FormData();
        formData.append("ruta", nom_plano);

        fetch("https://server1ts.net//financiero/inc/get.plano.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.text())
          .then((result) => {
            var csvContent = result;
            var blob = new Blob([csvContent], {
              type: "text/csv;charset=utf-8;",
            });
            var url = URL.createObjectURL(blob);
            var pom = document.createElement("a");
            pom.href = url;
            pom.setAttribute("download", archivo);
            pom.click();
            res();
          });
     });
    },    

    agregar_item() {
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Generar Nueva Prima ";
      " " + this.form.periodo;
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

    cargarcontenido() {
      var fecha = this.form.periodo_cargue;
      var periodo = this.form.periodo.value || "0";
      periodo = periodo == 1 ? 6 : 12;
      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrGthGeneraJ.dll",
          data: sessionStorage.Sesion + "|" + fecha + "|" + periodo + "|",
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
            text: "Error al cargar Nóminas",
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

    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    cargarcolaborador() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfColaboraJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.colaborador = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Colaboradores",
            estado: true,
          });
        });
    },

    get_basico: function () {
      post
        .postData({
          url: "Financiero/dlls/CfGthbaseJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaBases = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Cuentas Contables");
        });
    },
  },
};
</script>
