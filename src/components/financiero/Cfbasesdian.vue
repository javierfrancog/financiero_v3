<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-orbit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline ml-2">Bases Información Exógena</v-list-item-title>
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

              <v-col class="justify-end d-flex align-center">
                <v-btn
                  color="light-blue accent-4 white--text"
                  class
                  @click="cargarPeriodos()"
                  depressed
                >
                  <v-icon size="20" left>mdi-book-outline</v-icon>Buscar
                </v-btn>
              </v-col>
            </v-row>

            <div class="pa-0 px-0">
              <v-data-table
                :headers="headers"
                :items="contenido"
                :search="search"
                :single-expand="false"
                item-key="consecutivo"
                :loading="loader.tabla_datos"
                calculate-widths
                :sort-by="['consecutivo']"
                :sort-desc="[true, false]"
              >
              <!-- <template v-slot:item.edit="{ item }">
                <v-icon small class="mr-2" @click="editar_item(item)">edit</v-icon>
              </template> -->

              </v-data-table>
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>

    <v-dialog v-model="dialogo.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo}}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
          <v-col class="d-flex" cols="12" sm="4">
            <v-autocomplete
              :items="formatos"
              label="Formato Exógena"
              v-model="form.format_exogena"
              hide-details
              return-object
              outlined
                  required
                  :error="errores.formato"

            ></v-autocomplete>
          </v-col>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Base"
                clearable
                outlined
                required
                v-model="form.base"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="4">
              <v-text-field
                label="Capital Suscrito y pagado"
                clearable
                outlined
                required
                v-model="form.capital"
                hide-details
              ></v-text-field>
            </v-col>

          </v-row>

          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" color="red" text @click="dialogo.estado = false;init_form()">Cancelar</v-btn>
          <v-btn class="ma-2 px-4" color="success" depressed large @click="guardar()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
</template>
<style lang="sass">
.v-data-table tbody tr.v-data-table__expanded__content
  box-shadow: none!important
  background: #f5f9ff
</style>
<script>

import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  components: {
    FlowerSpinner
  },


  data() {
    return {
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null
      },
      card_estado: false,
      errores: {
        periodo_cargue: false,
        formato: false
      },

      formatos: [
        { text: "Formato 1001", value: 1001 },
        // { text: "Formato 1003", value: 1003 },
        // { text: "Formato 1004", value: 1004 },
        { text: "Formato 1005", value: 1005 },
        { text: "Formato 1006", value: 1006 },
        { text: "Formato 1007", value: 1007 },
        { text: "Formato 1008", value: 1008 },
        { text: "Formato 1009", value: 1009 },
        { text: "Formato 1010", value: 1010 },
        // { text: "Formato 1011", value: 1011 },
        // { text: "Formato 1012", value: 1012 },
      ],

      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false
      },
      dialogPicker: false,
      singleExpand: true,
      pickerPeriodo: false,
      años_select: [],      
      contenido: [],
      search: "",
      form: {},
      drawer: false,
      headers: [
        { text: "Formato", align: "center", value: "formato_rep" },
        { text: "Base", align: "center", value: "valor_rep" },        
        { text: "Opción", align: "center", value: "action", width: "15%" },        

      ],
      detalle: [],
      loader: {
        tabla_datos: false,
        tipoDocumento: false
      }
    };
  },
  created() {
    this.loader = false;
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
    agregar_item() {
      this.form.estado = 0;
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false
      };
    },
    cargarPeriodos: function() {
      var periodo = this.form.periodo_cargue;

      post
        .postData({
          url: "Financiero/dlls//CfBasesDianJ.dll",
          data: sessionStorage.Sesion + "|" + periodo + "|",
          method: ""
        })
        .then(data => {
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch(err => {
          this.send_error("Error al cargar Bases");
        });
    },

    guardar: function() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.periodo_cargue) {
        this.errores.periodo_cargue = true;
        this.send_error("Periodo Obligatorio!");
      } else  if (!data.format_exogena) {
        this.errores.formato = true;
        this.send_error("Formato Obligatorio!");
      } else 
      {
        this.format_envio(data);
      }
    },
    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true
      });
    },

    format_envio(data) {
      console.log(data)
      this.card_estado = true;
      var periodo = this.form.periodo_cargue;
      var formato = data.format_exogena.value;
      var base = data.base;
      var capital = data.capital;      

      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Financiero/dlls/CfBasesDian.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          periodo +
          "|" +
          formato +
          "|" +
          base +
          "|" +
          capital +
          "|" +          
          eliminar +
          "|",
        method: ""
      };
      post
        .postData(datos)
        .then(data => {
          this.$emit("snack", {
            color: "success",
            text: "Registro guardado correctamente",
            estado: true
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.cargarPeriodos();
        })
        .catch(error => {
          console.log(error)
          this.card_estado = false;
          this.send_error("Error al grabar Registro");
        });
    }
  }
};
</script>
