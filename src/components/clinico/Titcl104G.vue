<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-file-download</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Generación de Rips cl</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-text-field
                label="Consecutivo"
                outlined
                hide-details
                v-model="consecutivo"
                @keyup.enter="_cargarTablaFacturas"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                @click="_cargarTablaFacturas"
                @keyup.enter="_cargarTablaFacturas"
              >
                Buscar
                <v-icon right dark>mdi-card-search-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="anios_select"
                label="Año de la factura"
                outlined
                clearable
                hide-details
                v-model="form.anoserv"
                item-text="text"
                item-value="value"
                required
                :error="errores.anoserv"
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="1" sm="3">
              <v-text-field
                label="Prefijo"
                outlined
                hide-details
                v-model="form.prefijo"
                text-transform:uppercase
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="2" sm="3">
              <v-text-field
                label="Consecutivo"
                outlined
                hide-details
                v-model="form.nrofact"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-btn
                color="success"
                class="ma-2 white--text"
                @click="agregarfact()"
              >
                Agregar Factura
                <v-icon dark>mdi-file-download-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider color="succes"></v-divider>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  v-if="facturas.length != 0"
                  color="orange"
                  class="ma-2 white--text"
                  @click="open_resolucion()"
                >
                  Descargar Rips
                  <v-icon right dark>mdi-file-download-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col class="d-flex justify-end" cols="12" sm="3">
                <v-btn
                  v-if="facturas.length != 0"
                  color="red"
                  class="ma-2 white--text"
                  @click="eliminar_rips"
                >
                  Eliminar Rips
                  <v-icon right dark>mdi-file-download-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-divider color="succes" v-if="facturas.length != 0"></v-divider>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="consecutivo !== null"
            >
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
              v-if="consecutivo != null"
              :loading="load_table"
              :headers="headers"
              :items="facturas"
              item-key="nro"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.getjson="{ item }">
                <v-btn
                  color="purple"
                  class="ma-2 white--text"
                  @click="get_json(item)"
                  >Ver Json</v-btn
                >
              </template>

              <template v-slot:item.edit="{ item }">
                <v-btn
                  color="error"
                  class="ma-2 white--text"
                  @click="borrarRips(item)"
                  >Eliminar Factura</v-btn
                >
              </template>
              <template v-slot:item.nro_factura="{ item }">
                {{ parseInt(item.nro_factura) }}
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo_rips.estado" persistent max-width="800px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Generación Rips</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-select
                :items="tipos"
                label="Seleccione la Resolución"
                outlined
                clearable
                return-object
                hide-details
                :error="errores.resolucion"
                @change="errores.resolucion = false"
                v-model="form.resolucion"
                required
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-btn
                class="ma-2"
                color="red"
                text
                @click="dialogo_rips.estado = false"
                >Cancelar</v-btn
              >
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                depressed
                large
                @click="generarArchivos()"
                >Generar</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
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
      search: null,
      load_contrato: true,
      load_table: false,
      pickerPeriodo: false,
      periodo_cargue: this.$moment().format("YYYY-MM"),
      pickerActual: false,
      selectContrato: null,
      consecutivo: null,
      facturas: [],
      form: [],
      empresa: [],
      errores: {
        anoserv: false,
        resolucion: false,
      },
      dialogo_rips: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      card_estado: false,
      tipos: [
        { text: "Resolución 2275_2023", value: 1 },
        { text: "Resolución 3374_2000", value: 2 },
      ],
      headers: [
        { text: "Nro", align: "center", value: "nro" },
        { text: "Nro factura", align: "center", value: "nro_factura" },
        {
          text: "Fecha",
          align: "center",
          value: "fecha",
        },

        { text: "Ver Json", value: "getjson", align: "center" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.cargar_años();
    this.cargar_empresa();
  },
  watch: {},
  computed: {},

  methods: {
    open_resolucion() {
      this.dialogo_rips.estado = true;
    },

    get_json(item) {
  let pref = item.prefijo.trim();
  let consec = parseFloat(item.nro_factura);
  let idempr = this.empresa.id_empr;
  let ruta = `D:/TITAN/Tmp/RIPS/${idempr}/${pref}${consec}.json`;

  let formData = new FormData();
  formData.append("file", ruta); // Se manda correctamente en FormData

  fetch("https://server1ts.net/financiero/inc/get.archivo.php", {
    method: "POST", // Cambio de GET a POST para que funcione con FormData
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("No se pudo descargar el archivo");
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      let nombreArchivo = `${pref}${consec}.json`; // Se define el nombre del archivo
      a.href = url;
      a.download = nombreArchivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("Error en la descarga:", error));
},



    // get_json(item) {
    //   console.log(this.empresa);
    //   let pref = item.prefijo.trim();
    //   let consec = parseFloat(item.nro_factura);
    //   let idempr = this.empresa.id_empr;
    //   let formData = new FormData();
    //   let ruta = "D:/TITAN/Tmp/RIPS/" + idempr + "/" + pref + consec + ".json";

    //   formData.append("file", JSON.stringify(ruta));
    //   fetch("https://server1ts.net//financiero/inc/get.archivo.php", {
    //     method: "POST",
    //     body: formData,
    //   })
    //     .then((res) => res.text())
    //     .then((response) => {
    //       return response.blob();
    //     })
    //     .then((blob) => {
    //       const url = window.URL.createObjectURL(blob);
    //       const a = document.createElement("a");
    //       a.href = url;
    //       a.download = nombreArchivo;
    //       document.body.appendChild(a);
    //       a.click();
    //       document.body.removeChild(a);
    //       window.URL.revokeObjectURL(url);
    //     })
    //     .catch((error) => console.error("Error:", error));
    // },

    cargar_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.empresa = data[0];
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar empresa",
            estado: true,
          });
        });
    },
    cargar_años() {
      var anios = [];
      var anioActual = new Date().getFullYear();
      for (let i = 3; i > 0; i--) anios.push(anioActual - i);
      for (let i = 0; i < 4; i++) anios.push(anioActual + i);

      anios = anios.map((el) => (el = { text: el, value: el }));
      this.anios_select = anios;
    },
    _cargarTablaFacturas() {
      this.loader = true;
      this.facturas = [];
      post
        .postData({
          url: "Clinico/dlls/titcl104j.dll",
          data: sessionStorage.Sesion + "|" + this.consecutivo + "|",
          method: "",
        })
        .then((data) => {
          if(!data[0].nro_factura){
            data.pop();
          }
          this.loader = false;

          let id = 1;
          data.map((elem) => {
            elem.nro = id++;
          });
          this.facturas = data;
          this.periodo_cargue = data[0].fecha.substr(0, 6);
        })
        .catch((err) => {
          this.loader = false;
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar facturas",
            estado: true,
          });
        });
    },
    eliminar_rips() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/titcl104x.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            this.consecutivo +
            "|" +
            this.periodo_cargue +
            "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this._cargarTablaFacturas();
        })
        .catch((err) => {
          this.loader = false;
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al Eliminar Rips",
            estado: true,
          });
        });
    },
    async generarArchivos() {
      let ruta_url = null;
      if (this.form.resolucion) {
        let resolucion = this.form.resolucion.value;
        ruta_url =
          resolucion == 1
            ? "Clinico/dlls/Rips2275.dll"
            : "Clinico/dlls/titcl104r.dll";

        let time = new Date();
        let hora = time.getMinutes() + time.getSeconds();
        let datos = `${sessionStorage.Sesion}|${this.consecutivo}|${this.periodo_cargue}|`;

        try {
          let data = await post.postData({
            url: ruta_url,
            data: datos,
            method: "",
          });

          var json = [
            sessionStorage.Sesion.substr(0, 15),
            `Rips${this.consecutivo}_${this.periodo_cargue}_${hora}.zip`,
            this.empresa.codciudad_empr || 95001,
          ];

          if (resolucion == 2) {
            this.borrar_lineas(data[0].archivos, json);
          } else {
            let data_envio = data;
            await this.extraer_facturas(data_envio, json);
          }
        } catch (err) {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al generar Rips",
            estado: true,
          });
        }
      } else {
        this.errores.resolucion = true;
        this.$emit("snack", {
          color: "error",
          text: "Debe seleccionar una resolución",
          estado: true,
        });
      }
    },
    async extraer_facturas(data, json) {
      let ruta = data.flatMap((item) =>
        item.archivos.map((file) => file.archivo)
      );
      let prefijo = null;
      let consecutivo = 0;
      let factura = null;
      for (const item of ruta) {
        factura = item.substr(34, 15).replace(/\.[^.]+$/, "");
        prefijo = factura.match(/[A-Za-z]+/g)[0];
        consecutivo = factura.match(/\d+/g)[0];
        await this.get_cufe(prefijo, consecutivo, data, json);
      }
    },
    async borrar_lineas(data, json) {
      var formData = new FormData();

      formData.append("archivos", JSON.stringify(data));
      formData.append("datos", JSON.stringify(json));
      fetch("https://server1ts.net//financiero/inc/borra_linea.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.text())
        .then((response) => {
          fetch("https://server1ts.net//financiero/inc/ajaxFile.php", {
            method: "POST",
            body: formData,
          })
            .then((res) => res.text())
            .then((response) => {
              window.open(response, "_blank");
              this.dialogo_rips.estado = false;
            })
            .catch((err) => {
              console.log(err);
              this.$emit("snack", {
                color: "error",
                text: "Ocurrio error al descargar archivo",
                estado: true,
              });
            });
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Ocurrio error al descargar archivo",
            estado: true,
          });
        });
    },
    async get_cufe(prefijo, consecutivo, data_envio, json) {
      post
        .postData({
          url: "Clinico/dlls/PrFactcufe.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            prefijo +
            "|" +
            consecutivo +
            "|" +
            2025 +
            "|",
          method: "POST",
        })
        .then((data) => {
          this.loader = false;
          let cufe = data[0];
          this.get_text(data_envio, json);
          this.get_xml_dian(consecutivo, prefijo);
          this.dialogo_rips.estado = false;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar cufe",
            estado: true,
          });
        });
    },
    async get_xml_dian(consecutivo, prefijo) {
      let idempresa = this.empresa.id_empr.substr(5, 15);
      consecutivo = prefijo.trim() + consecutivo;
      let fileName = "Attachment-" + consecutivo + ".xml"; 
      let idempr = this.empresa.tokentitan_empr.trim();
      let urlEnvio =
        "https://server1ts.net/financiero/inc/api_dian/attach_fact.php";

      var formData = new FormData();
      formData.append("token", idempr);
      formData.append(
        "factura",
        parseFloat(idempresa) + "/" + fileName + "/BASE64"
      );

      try {
        const response = await fetch(urlEnvio, {
          method: "POST",
          body: formData,
        }).then((res) => res.json());

        if (response.filebase64) {
          this.downloadBase64File(response.filebase64, fileName);
        } else {
          console.error("Error: No se recibió un archivo en base64.");
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    },

    downloadBase64File(base64, fileName) {
      const link = document.createElement("a");
      link.href = "data:application/xml;base64," + base64;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // downloadBase64File(base64Data, fileName) {
    //   this.loader = false;
    //   const binaryData = atob(base64Data);
    //   const arrayBuffer = new Uint8Array(binaryData.length);
    //   for (let i = 0; i < binaryData.length; i++) {
    //     arrayBuffer[i] = binaryData.charCodeAt(i);
    //   }
    //   const blob = new Blob([arrayBuffer], { type: "application/xml" });
    //   const link = document.createElement("a");
    //   link.href = URL.createObjectURL(blob);
    //   link.download = fileName;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    //   URL.revokeObjectURL(link.href);
    // },
    async get_text(data) {
      var formData = new FormData();
      let archivos = data[0].archivos; // Acceder a la lista de archivos
      let nro_factura = null;

      archivos.forEach((archivo, index) => {
        formData.append(`archivo${index}`, archivo.archivo); // Enviar las rutas como texto
        nro_factura = archivo.archivo.substr(34, 46);
      });

      fetch("https://server1ts.net/financiero/inc/clear_json.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data[0] && data[0].contenido) {
            try {
              let contenidoLimpio = Array.from(data[0].contenido)
                .filter((char) => {
                  return char.charCodeAt(0) >= 32 && char.charCodeAt(0) !== 127;
                })
                .join("");
              let contenidoJSON = JSON.parse(contenidoLimpio);
              let resultados = [
                {
                  contenido: contenidoJSON,
                },
              ];

              let jsonResult = JSON.stringify(resultados[0].contenido);
              const blob = new Blob([jsonResult], { type: "application/json" });

              // Crear un enlace de descarga
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = nro_factura; // Nombre del archivo a descargar

              // Simular el clic en el enlace para iniciar la descarga
              link.click();
            } catch (error) {
              console.error("Error al parsear el contenido:", error);
            }
          }
        })
        .catch((error) => {
          console.error("Error al leer los archivos:", error);
        });
    },
    borrarRips(item) {
      let factura = item.nro_factura;
      let prefijo = item.prefijo;
      let fecha = item.fecha.substr(0, 4);
      if(fecha < 2000){
        fecha = 2025
      }
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.consecutivo +
        "|01|" +
        prefijo +
        " |" +
        factura +
        "|" +
        fecha +
        "|" +
        0 +
        "|";
      post
        .postData({
          url: "Clinico/dlls/titcl104a.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: data[0],
            estado: true,
          });
          this._cargarTablaFacturas();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: data[0],
            estado: true,
          });
        });
    },
    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
    },
    agregarfact() {
      let datos =
        sessionStorage.Sesion +
        "|" +
        this.consecutivo +
        "|01|" +
        this.form.prefijo +
        "|" +
        this.form.nrofact +
        "|" +
        this.form.anoserv +
        "|" +
        1 +
        "|";
      post
        .postData({
          url: "Clinico/dlls/titcl104a.dll",
          data: datos,
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Factura Agregada",
            estado: true,
          });
          this._cargarTablaFacturas();
        })
        .catch((err) => {
          console.log(err)
          this.$emit("snack", {
            color: "error",
            text: err,
            estado: true,
          });
        });
    },
  },
};
</script>
