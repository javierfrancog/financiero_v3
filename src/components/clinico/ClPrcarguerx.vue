<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :disabled="load_card"
        :loading="load_card"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-prescription</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Cargue de Imágenes cl</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-menu
                  v-model="pickerActual"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_actual"
                      label="Fecha Servicio"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_actual"
                    @input="pickerActual = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex" cols="12" sm="7">
                <v-autocomplete
                  outlined
                  label="Sala"
                  :items="salas"
                  :item-text="format_salas"
                  item-value="nro"
                  hide-details
                  v-model="selectSala"
                  return-object
                  clearable
                  :error="errores.salas"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center">
              <v-col class="mb-4" cols="6">
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
              v-if="selectSala != null"
              :loading="load_table"
              :headers="headers"
              :items="agendaPaciente"
              item-key="item_rep"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.id_paciente="{ item }">
                {{ parseInt(item.id_paciente) }}
              </template>

              <template v-slot:item.consec_rep="{ item }">
                {{ parseInt(item.consec_rep) }}
              </template>

              <template v-slot:item.btn_cargue1="{ item }">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="indigo"
                      class="ma-2 white--text"
                      @click="subir_soportes(item, 1)"
                      v-on="on"
                      depressed
                      small
                      :disabled="parseInt(item.prservicio_x) == 0"
                    >
                      <v-icon>mdi-file-upload-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Subir Imagen</span>
                </v-tooltip>
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red"
                      class="ma-2 white--text"
                      @click="get_imagen(item, 1)"
                      v-on="on"
                      depressed
                      small
                      :disabled="parseInt(item.prservicio_x) == 0"
                    >
                      <v-icon>mdi-google-classroom</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar Imagen</span>
                </v-tooltip>
              </template>
              <template v-slot:item.btn_cargue2="{ item }">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="indigo"
                      class="ma-2 white--text"
                      @click="subir_soportes(item, 2)"
                      v-on="on"
                      depressed
                      small
                      :disabled="parseInt(item.prservicio_x) == 0"
                    >
                      <v-icon>mdi-file-upload-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Subir Pdf</span>
                </v-tooltip>
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="red"
                      class="ma-2 white--text"
                      @click="get_imagen(item, 2)"
                      v-on="on"
                      depressed
                      small
                      :disabled="parseInt(item.prservicio_x) == 0"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar Pdf</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>

      <v-dialog
        v-model="dialogo_archivo.estado"
        width="600"
        max-width="90%"
        persistent
      >
        <v-card
          :loading="dialogo_archivo.loader"
          :disabled="dialogo_archivo.loader"
        >
          <v-card-title>{{ dialogo_archivo.tituloDialogo }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col class="d-flex" cols="12">
                <v-file-input
                  v-model="archivos"
                  label="Seleccione archivos"
                  outlined
                  multiple
                  chips
                  counter
                  color="blue darken-1"
                  hide-details
                  :show-size="1000"
                  :accept="
                    tipo_cargue === 1
                      ? 'image/*'
                      : tipo_cargue === 2
                      ? 'application/pdf'
                      : ''
                  "
                  @change="handleFiles"
                ></v-file-input>
              </v-col>
            </v-row>

            <!-- Previsualización -->
            <v-row v-if="preview_files.length > 0 && tipo_cargue === 1">
              <v-col
                v-for="(item, index) in preview_files"
                :key="index"
                cols="6"
                md="4"
                class="text-center"
              >
                <v-img :src="item.preview" max-height="150" contain />
                <v-btn text small color="red" @click="eliminarImagen(index)">
                  Eliminar
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="red" text @click="cancelar_subida">Cancelar</v-btn>
            <v-btn
              depressed
              color="blue darken-2"
              class="white--text px-12 mx-5"
              @click="up_file_drive"
              >Subir archivo</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
    <v-overlay :value="!!loader" fixed style="z-index: 3000">
      <v-card
        color="primary"
        dark
        flat
        class="d-flex flex-column align-center pa-6"
      >
        <v-progress-circular indeterminate color="white" size="50" />
        <span v-if="typeof loader === 'string'" class="mt-4">{{ loader }}</span>
      </v-card>
    </v-overlay>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
//import { FlowerSpinner } from "epic-spinners";

export default {
  // components: {
  //   FlowerSpinner,
  // },

  data() {
    return {
      loader: false,

      search: "",
      pickerActual: false,
      load_table: false,
      selectSala: null,
      load_card: false,
      agendaPaciente: [],
      archivos: [],
      salas: [],
      tipo_cargue: 0,
      preview_files: [],
      dialogo_archivo: {
        estado: false,
        model: null,
        loader: false,
        año: 0,
        item: 0,
        ruta: null,
        consecutivo: null,
        tituloDialogo: "",
      },

      fecha_actual: this.$moment().format("YYYY-MM-DD"),
      errores: {
        salas: false,
      },
      headers: [
        { text: "Servicio", align: "center", value: "consec_rep" },
        { text: "Imagenes", align: "center", value: "btn_cargue1" },
        { text: "Pdfs", align: "center", value: "btn_cargue2" },
        {
          text: "Descripcion paciente",
          align: "center",
          value: "descrip_paciente",
        },
        { text: "Examen", align: "center", value: "desc_servicio" },
        { text: "Fecha", align: "center", value: "fecha" },
        {
          text: "Identificacion paciente",
          align: "center",
          value: "id_paciente",
        },
      ],
    };
  },
  created() {
    this.cargar_empresa();
    this.get_profesionales();
  },
  watch: {
    selectSala: function (value) {
      if (value) this.cargarAgendamiento();
    },
  },
  methods: {
    handleFiles(files) {
      const nuevos = Array.from(files);

      nuevos.forEach((file) => {
        // Solo imágenes si tipo_cargue == 1
        if (this.tipo_cargue === 1 && !file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.preview_files.push({
            file,
            preview: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      });
    },
    eliminarImagen(index) {
      this.preview_files.splice(index, 1);
    },
    subir_soportes(item, tipo) {
      this.dialogo_archivo.estado = true;
      this.dialogo_archivo.consecutivo = parseFloat(item.consec_rep);
      this.dialogo_archivo.año = item.fecha.substring(0, 4);
      this.dialogo_archivo.item = item.item_rep;
      this.tipo_cargue = tipo;
      this.preview_files = [];
      this.archivos = [];

      if (tipo == 1) {
        this.dialogo_archivo.tituloDialogo = "Cargue de Imagen";
      } else {
        this.dialogo_archivo.tituloDialogo = "Cargue de Pdf";
      }
    },
    async get_imagen(item, tipo) {
      this.loader = "Buscando archivos...";

      const consecutivo = parseFloat(item.consec_rep);
      const item_envio = item.item_rep;
      const año = item.fecha.substring(0, 4);
      const empresa = parseFloat(this.empresa[0].id_empr);
      const extension = tipo === 2 ? ".pdf" : ".bmp";

      let index = 1;
      let encontrados = 0;

      while (index < 20) {
        const nro_item = String(index).padStart(3, "0");
        const nombre_archivo = `${empresa}_${año}_RX_${consecutivo}_${item_envio}_${nro_item}${extension}`;
        const url = `https://storage.googleapis.com/documentos_titan/SALUD/${nombre_archivo}`;

        const existe = await this.verificarConArchivo(url, tipo);

        if (!existe) break;

        window.open(`${url}?_=${Date.now()}`, "_blank");
        encontrados++;
        index++;
      }

      if (encontrados === 0) {
        this.$emit("snack", {
          color: "error",
          text: "No se encontraron archivos disponibles.",
          estado: true,
        });
      }

      this.loader = false;
    },
    async verificarConArchivo(url, tipo) {
      if (tipo === 1) {
        // Verificación con <img> para imágenes
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url + "?_=" + Date.now(); // Previene caché
        });
      }

      if (tipo === 2) {
        // Verificación HEAD para PDF
        try {
          const response = await fetch(url, {
            method: "HEAD",
            cache: "no-store",
          });

          return response.ok; // true si 200, false si 404
        } catch (error) {
          console.log("Error al verificar PDF:", error);
          return false;
        }
      }

      return false;
    },
    async cargar_empresa() {
      await post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    format_salas(val) {
      return val.descrip_sala;
    },
    get_profesionales() {
      this.loader = true;
      let agencia = "01";
      post
        .postData({
          url: "Clinico/dlls/ClCfSalasJ.dll",
          data: sessionStorage.Sesion + "|" + agencia + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.salas = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Salas",
            estado: true,
          });
        });
    },
    cargarAgendamiento: function () {
      this.load_table = true;
      this.agendaPaciente = [];
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.fecha_actual.split("-").join("") +
        "|" +
        this.selectSala.codigo_sala +
        "|";
      post
        .postData({
          url: "Clinico/dlls/ClRpPrestrx01J.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          data.pop();
          this.agendaPaciente = data;
          this.load_table = false;
        })
        .catch((err) => {
          this.load_table = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar agendamiento",
            estado: true,
          });
        });
    },
    async up_file_drive() {
      for (let i = 0; i < this.preview_files.length; i++) {
        const item = this.preview_files[i];
        await this.procesarImagen(item.file, i); // llamada por cada imagen
      }
      this.dialogo_archivo.estado = false;
    },

    async procesarImagen(file, index) {
      this.loader = "Subiendo Archivos...";

      if (!file) {
        this.send_error("Seleccione un archivo para cargar!");
        return;
      }
      let session = sessionStorage.Sesion;
      let empresa = parseFloat(this.empresa[0].id_empr);
      let consecutivo = this.dialogo_archivo.consecutivo;
      let cargue_pdf = this.dialogo_archivo.tituloDialogo;
      let año = this.dialogo_archivo.año;
      let item = String(index + 1).padStart(3, "0");
      let item_pr = this.dialogo_archivo.item;

      let extension = ".bmp";
      if (this.tipo_cargue == 2) {
        extension = ".pdf";
      }

      let nombre_pdf = `${empresa}_${año}_RX_${consecutivo}_${item_pr}_${item}${extension}`;

      let data = new FormData();
      data.append("empresa", empresa);
      data.append("session", session);
      data.append("cargue_pdf", cargue_pdf);
      data.append("nombre_pdf", nombre_pdf);
      data.append("tipodoc", 0);
      data.append("file", file);

      try {
        let response = await fetch(
          "https://server1ts.net//financiero/inc/api_titan/salud.php",
          {
            method: "POST",
            body: data,
          }
        ).then((res) => res.json());

        this.$emit("snack", {
          color: "success",
          text: `Imagen ${index + 1} subida correctamente`,
          estado: true,
        });
      } catch (error) {
        console.log(`Error al subir imagen ${index + 1}:`, error);
        this.send_error(`Error al subir imagen ${index + 1}`);
      }
      this.loader = false;
    },
    cancelar_subida() {
      this.dialogo_archivo.estado = false;
      this.dialogo_archivo.model = null;
      this.dialogo_archivo.loader = false;
      this.dialogo_archivo.ruta_pdf = null;
      this.dialogo_archivo.consecutivo = null;
      this.preview_files = [];
    },
  },
};
</script>