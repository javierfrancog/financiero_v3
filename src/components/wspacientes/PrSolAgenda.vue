<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-edit-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Solicitud de Citas Médicas</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-text-field
                  label="Id_Paciente"
                  outlined
                  hide-details
                  disabled
                  v-model="form.id_paciente"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-text-field
                  outlined
                  hide-details
                  disabled
                  v-model="form.nombrepaciente"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-autocomplete
                  :error="errores.pac_eps"
                  :items="eps"
                  label="Convenio"
                  @change="errores.pac_eps = false"
                  item-value="value"
                  ref="pac_eps"
                  required
                  v-model="form.pac_eps"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <div>
          <h2>Reconocimiento de PDF</h2>
          <input type="file" @change="onFileChange" accept="application/pdf" />
          <input
            type="text"
            v-model="codigo"
            placeholder="Código de documento (ej: 14-23)"
          />
          <button @click="procesarPDF">Procesar</button>

          <h3 v-if="resultado">Resultado:</h3>
          <pre v-if="resultado">{{ resultado }}</pre>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import post from "../../methods.js";

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export default {
  name: "ReconocimientoPDF",
  components: {},
  data() {
    return {
      search: null,
      pickerActual: false,
      texto_descripcion: null,
      eps: [],
      archivo: null,
      codigo: "",
      resultado: null,

      form: {
        idpaciente: 0,
        nombrepaciente: "",
        pac_eps: "",
      },
      errores: {
        pac_eps: false,
      },

      fecha_actual: this.$moment().format("YYYY-MM-DD"),
    };
  },
  created() {
    this.get_empresa();
    this.get_paciente();
  },
  methods: {
    get_empresa() {
      post
        .postData({
          url: "Financiero/dlls/CfEmpresaJ.dll",
          data: sessionStorage.Sesion + "|" + 98 + "|",
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
    get_paciente() {
      this.form.id_paciente = `${parseFloat(
        sessionStorage.Sesion.substr(16, 14)
      )}`;

      post
        .postData({
          url: "Clinico/dlls/titcl301j.dll",
          data: sessionStorage.Sesion + "|" + "|" + this.form.id_paciente + "|",
          method: "",
        })
        .then((data) => {
          if (data.length > 0) {
            this.form.nombrepaciente = `${data[0].nombres} ${data[0].primerApellido}`;
            let eps = data[0].eps;
            this.cargarEps(eps);
          } else {
            this.send_error("Paciente no encontrado");
          }
        })
        .catch((err) => {
          this.send_error("Error al cargar paciente");
        });
    },

    cargarEps(eps_paciente) {
      post
        .postData({
          url: "Datos/BASE/eps.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.eps = data.eps
            .filter((k) => String(k.codigo) === String(eps_paciente.trim()))
            .map((k) => ({
              value: k.codigo,
              text: k.nombre,
            }));
          // Opcional: si quieres seleccionar automáticamente el EPS filtrado
          if (this.eps.length > 0) {
            this.form.pac_eps = this.eps[0].value;
          }
        })
        .catch(() => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar eps's",
            estado: true,
          });
        });
    },
    onFileChange(e) {
      this.archivo = e.target.files[0];
      console.log(
        "Archivo seleccionado:",
        this.archivo?.name,
        this.archivo?.size
      );
    },
    async procesarPDF() {
      if (!this.archivo || !this.codigo) {
        alert("Selecciona un archivo y escribe el código.");
        return;
      }

      const arrayBuffer = await this.archivo.arrayBuffer(); // asegúrate que this.archivo !== undefined
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let texto = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        texto += pageText + "\n";
      }

      console.log("Texto extraído (longitud):", texto.length);
      console.log("Texto de la primera página:", texto.slice(0, 300));

      const json = this.procesarPorCodigo(this.codigo, texto);
      this.resultado = JSON.stringify(json, null, 2);
    },

    procesarPorCodigo(codigo, texto) {
      switch (codigo) {
        case "14-23":
          return this.parseAutorizacion(texto);
        // Agrega más códigos aquí
        default:
          return { error: `Código '${codigo}' no reconocido.` };
      }
    },

    parseAutorizacion(texto) {
      const extract = (regex, campo = "campo") => {
        const match = texto.match(regex);
        if (!match) console.warn(`No se encontró el campo: ${campo}`);
        return match && match[1] ? match[1].trim() : null;
      };

      return {
        tipo_documento: "AUTORIZACION",
        numero_autorizacion:
          extract(
            /(\d{8})\s+Fecha y hora de la Autorización/i,
            "numero_autorizacion"
          ) || "",
        fecha_autorizacion:
          extract(/Número Autorización\s+([0-9\/]+)/i, "fecha_autorizacion") ||
          "",

        paciente: {
          nombre: extract(/Nombre\s+([A-ZÁÉÍÓÚÑ\s]+)/i, "nombre"),
          documento: extract(/Número de Documento\s+([0-9]+)/i, "documento"),
          fecha_nacimiento: extract(
            /Fecha de Nacimiento\s+([0-9\/]+)/i,
            "fecha_nacimiento"
          ),
          direccion: extract(
            /Dirección Residencial\s+(.+?)(?=\s+Correo Electrónico)/i,
            "direccion"
          ),
          correo: extract(/Correo Electrónico\s+([^\s]+)/i, "correo"),
          celular: extract(/Celular Particular\s+(\d{10})/i, "celular"),
        },

        diagnostico: {
          codigo: extract(/(S\d{3})\s+/i, "diagnostico_codigo"),
          descripcion: extract(
            /S\d{3}\s+([A-Z\s,]+)/i,
            "diagnostico_descripcion"
          ),
        },

        servicio_autorizado: {
          codigo: extract(/(8\d{5})\s+\d+/i, "servicio_codigo"),
          descripcion:
            /CONSULTA DE PRIMERA VEZ POR ESPECIALISTA EN\s+MEDICINA FISICA Y REHABILITACION/i.test(
              texto
            )
              ? "CONSULTA DE PRIMERA VEZ POR ESPECIALISTA EN MEDICINA FISICA Y REHABILITACION"
              : extract(
                  /se autoriza\s+(consulta.*?)(?=\s+\*|cantidad|porcentaje|pagos|cuota|copago|cuota de recuperación)/i,
                  "servicio_descripcion"
                ),
        },
      };
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
  },
};
</script>
<style scoped>
input {
  display: block;
  margin-bottom: 10px;
}
pre {
  background: #f5f5f5;
  padding: 10px;
  border: 1px solid #ccc;
  white-space: pre-wrap;
}
</style>