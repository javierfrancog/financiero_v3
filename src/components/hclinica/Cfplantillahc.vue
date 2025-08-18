<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-file-document-edit-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Plantillas H.C.</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="indigo"
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
              :search="search"
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
            <v-col class="d-flex" cols="3">
              <v-text-field
                label="Codigo"
                clearable
                outlined
                type="text"
                disabled
                v-model="form.codigo"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-autocomplete
                label="Tipo Historia"
                v-model="form.tipohc"
                :items="tipohc"
                hide-details
                outlined
                return-object
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="5">
              <v-autocomplete
                label="Sección"
                v-model="form.seccion"
                :items="seccion"
                hide-details
                outlined
                return-object
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="6">
              <v-autocomplete
                label="Sub_Sección"
                v-model="form.subseccion"
                :items="subseccion"
                hide-details
                outlined
                return-object
              ></v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-text-field
                outlined
                clearable
                label="Plantilla"
                v-model="form.plantilla"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-textarea
                outlined
                clearable
                label="Descripción"
                v-model="form.descripcion"
                hide-details
              ></v-textarea>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar"
              label="Eliminar"
              hide-details
            ></v-switch>
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
      tipohc: [
        { text: "Historia Basica", value: 1 },
        { text: "Historia Especializada", value: 2 },
      ],
      seccion: [
        { text: "1.Motivo de Consulta", value: 1 },
        { text: "2.Enfermedad Actual", value: 2 },
        { text: "3.Antecedentes", value: 3 },
        { text: "4.Signos Vitales", value: 4 },                
        { text: "5.Revisión por Sistemas", value: 5 },
        { text: "6.Exámen Físico", value: 6 },
        { text: "7.Paraclínicos", value: 7 },
        { text: "9.Análisis", value: 9 },
        { text: "10.Plan de Tratamiento", value: 10 },
        { text: "11.Ordenes Medicas", value: 11 },
        { text: "12.Recomendaciones", value: 12 },        
      ],

      subseccion: [
        { text: "No Aplica", value: 1 },
        { text: "Antecedentes Personales", value: 2 },
        { text: "Antecedentes Familiares", value: 3 },        
        { text: "Rev.Sistemas -Cabeza/Cuello-", value: 4 },
        { text: "Rev.Sistemas -Cardiopulmonar-", value: 5 },
        { text: "Rev.Sistemas -GastroIntestinal-", value: 6 },
        { text: "Rev.Sistemas -Genitourinario-", value: 7 },
        { text: "Rev.Sistemas -Osteomuscular-", value: 8 },                        
        { text: "Rev.Sistemas -Vascular Periférico-", value: 9 },
        { text: "Rev.Sistemas -Piel-", value: 10 },
        { text: "Rev.Sistemas -Hematopoyético-", value: 11 },
        { text: "Rev.Sistemas -Endocrino-", value: 12 },                        
        { text: "Rev.Sistemas -Neurológico-", value: 13 },
        { text: "Rev.Sistemas -Organos de los sentidos-", value: 14 },
        { text: "Examen fisico -Cabeza-", value: 15 },
        { text: "Examen fisico -Cuello-", value: 16 },
        { text: "Examen fisico -Corazón-", value: 17 },
        { text: "Examen fisico -Pulmones-", value: 18 },
        { text: "Examen fisico -Mamas-", value: 19 },
        { text: "Examen fisico -Abdomen-", value: 20 },
        { text: "Examen fisico -Genitourinario-", value: 21 },
        { text: "Examen fisico -Extremidades-", value: 22 },
        { text: "Examen fisico -Neurologico-", value: 23 },
        { text: "Examen fisico -Piel-", value: 24 },
        { text: "Examen fisico -Toráx-", value: 25 },        


      ],
      plantillas: [
        { text: "General", value: 1 },
        { text: "Movilidad", value: 2 },
        { text: "Masas", value: 3 },
        { text: "Adenopatias", value: 4 },
        // { text: "Cardiovascular", value: 4 },
        // { text: "Rev.Sistemas -Dermatologico-", value: 5 },
        // { text: "Rev.Sistemas -Digestivo-", value: 6 },
        // { text: "Rev.Sistemas -Genitourinario-", value: 7 },
        // { text: "Rev.Sistemas -Neurologico-", value: 8 },
        // { text: "Rev.Sistemas -Ocular-", value: 9 },
        // { text: "Rev.Sistemas -Otorrino-", value: 10 },
        // { text: "Rev.Sistemas -Osteomuscular-", value: 11 },
        // { text: "Rev.Sistemas -Respiratorio-", value: 12 },
        // { text: "Rev.Sistemas -Otros Sistemas-", value: 13 },
        // { text: "Rev.Sistemas -Otros Sistemas-", value: 14 },
        // { text: "Ex.Fisico -Cuello Movilidad-", value: 15 },
        // { text: "Ex.Fisico -Cuello Masas-", value: 16 },
        // { text: "Ex.Fisico -Cuello Adenopatias-", value: 17 },
        // { text: "Ex.Fisico -CardioPulmonar Ruidos Cardiacos-", value: 18 },
        // { text: "Ex.Fisico -Cabeza Cuero Cabelludo-", value: 19 },
        // { text: "Ex.Fisico -Cabeza Otros-", value: 20 },
        // { text: "Ex.Fisico -Abdomen Inspección-", value: 21 },
        // { text: "Ex.Fisico -Abdomen Palpitación-", value: 22 },
      ],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Codigo", align: "center", value: "codigo_rep" },
        { text: "Sección", align: "left", value: "descripseccion_rep" },
        { text: "Subsección", align: "left", value: "subseccion_rep" },        
        { text: "Plantilla", align: "left", value: "plantilla_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
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
    async editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      var busqueda_seccion = this.seccion.find(
        (el) => el.value == item.seccion_rep
      );
      this.form.seccion = busqueda_seccion;

      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar";
      this.dialogo.tipo = 1;
      this.form.codigo = item.codigo_rep;
      this.form.plantilla = item.plantilla_rep.trim();

      var busqueda_tipo = this.tipohc.find((el) => el.value == item.tipo_rep);
      this.form.tipohc = busqueda_tipo;


       var busqueda_subseccion = this.subseccion.find(
         (el) => el.value == item.subseccion_rep
       );
       this.form.subseccion = busqueda_subseccion;

      let descripcion64 = window.atob(
        item.base1_rep.trim() + item.base2_rep.trim() + item.base3_rep.trim()  + item.base4_rep.trim() + item.base5_rep.trim() + item.base6_rep.trim() + item.base7_rep.trim()
      );

      this.form.descripcion = descripcion64;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.descripcion) {
        this.errores.descripcion = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      console.log(data)
      this.card_estado = true;
      let tipohc = data.tipohc.value;
      let seccion = data.seccion.value;
      let subseccion = data.subseccion.value;
      let plantilla = data.plantilla;
      let codigo = data.codigo;
      let descripcion = data.descripcion ? window.btoa(data.descripcion) : "";
      let eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Clinico/dlls/CfHcPlantilla.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          tipohc +
          "|" +
          seccion +
          "|" +
          subseccion +
          "|" +
          plantilla +
          "|" +
          descripcion +
          "|" +
          eliminar +
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
      this.get_consecutivo();
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
          url: "Clinico/dlls/CfHcPlantillaJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar plantillas",
            estado: true,
          });
        });
    },
    get_consecutivo() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/CfHcPlantillaN.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.form.codigo = data[0].nro;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar consecutivo",
            estado: true,
          });
        });
    },
    async get_subsecc() {
      console.log(this.form.tipohc);
      let tipo = this.form.tipohc.value;
      let seccion = this.form.seccion.value;

      await post
        .postData({
          url: "Financiero/dlls/CfHcseccionJ.dll",
          data: sessionStorage.Sesion + "|" + tipo + "|" + seccion + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.subseccion = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Secciones",
            estado: true,
          });
        });
    },
    format_subseccion(val) {
      return `${val.descrip_rep.trim()}`;
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
