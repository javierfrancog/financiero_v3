<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-format-float-left</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Detallado Furips cl</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col cols="3">
                <v-menu
                  v-model="pickeFechaIni"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_ini"
                      label="Fecha Inicial"
                      append-icon="event"
                      hide-details
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_ini"
                    @input="pickeFechaIni = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="3">
                <v-menu
                  v-model="pickerFechaFinal"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="fecha_final"
                      label="Fecha Final"
                      append-icon="event"
                      outlined
                      hide-details
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex justify-center" cols="3">
                <v-btn
                  color="green"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="generar(1)"
                >
                  Furips 1
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col class="d-flex justify-center" cols="3">
                <v-btn
                  color="green"
                  class="ma-2 white--text px-12"
                  depressed
                  large
                  @click="generar(2)"
                >
                  Furips 2
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
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
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-01"),
      pickerFechaFinal: false,
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialog: true,
      item_select: [],
      contenido: [],
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Consecutivo", align: "center", value: "nro_rep" },
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Paciente", align: "left", value: "paciente_rep" },
        { text: "Factura", align: "left", value: "factura_rep" },
        { text: "Estado", align: "center", value: "estado_rep" },
        { text: "Imprimir", value: "edit", align: "center" },
      ],
      card: {
        loader: false,
        disabled: false,
      },
      datosEmpresa: [],
    };
  },
  created() {
    this.get_empresa();
  },
  methods: {
    generar(item) {
      var fechaini = this.fecha_ini.split("-").join("");
      var fechafin = this.fecha_final.split("-").join("");
      let url_envio = null;
      if (item == 1) {
        url_envio = "Clinico/dlls/RpFurips1J.dll";
      } else if (item == 2) {
        url_envio = "Clinico/dlls/RpFurips2J.dll";
      }

      this.contenido = [];
      this.loader = true;
      post
        .postData({
          url: url_envio,
          data: sessionStorage.Sesion + "|" + fechaini + "|" + fechafin + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
          this.contenido.pop();
          if (item == 1) {
            this.csv_formato1();
          } else if (item == 2) {
            this.csv_formato2();
          }
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Furips",
            estado: true,
          });
        });
    },
    get_empresa() {
      post
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
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },
    csv_formato1() {
      let data = this.contenido;
      let perini = this.fecha_ini;
      let perfin = this.fecha_final;

      // Definir las columnas que quieres exportar (puedes ajustar según tus necesidades)
      let columnas = [
        { title: "Numero de radicado anterior", value: "factura_rep" },
        { title: "RGO", value: "rg_rep" },
        { title: "Número de factura", value: "factura_rep" },
        { title: "Número consecutivo de la reclamación", value: "factura_rep" },
        {
          title: "Código de habilitación del prestador de servicios de salud",
          value: "codips_rep",
        },
        { title: "Primer apellido de la víctima", value: "Apellido1_rep" },
        { title: "Segundo apellido de la víctima", value: "Apellido2_rep" },
        { title: "Primer nombre de la víctima", value: "nombre1_rep" },
        { title: "Segundo nombre de la víctima", value: "nombre2_rep" },
        {
          title: "Tipo de documento de identidad de la víctima",
          value: "tipodoc_vic_rep",
        },
        {
          title: "Número de documento de identidad de la víctima",
          value: "nrodoc_vic_rep",
        },
        { title: "Fecha de nacimiento de la víctima", value: "fnacim_vic_rep" },
        { title: "Fecha de fallecimiento", value: "ffallec_vic_rep" },
        { title: "Sexo de la víctima", value: "sexo_vic_rep" },
        {
          title: "Dirección de residencia de la víctima",
          value: "direcc_vic_rep",
        },
        {
          title: "Código del departamento de residencia de la víctima",
          value: "departamentoCodigo_rep",
        },
        {
          title: "Código del municipio de residencia de la víctima",
          value: "ciudadCodigo_rep",
        },
        { title: "Teléfono de la víctima", value: "telepaci_rep" },
        { title: "Condición de la víctima", value: "condicion_rep" },
        { title: "Naturaleza del evento", value: "naturaleza_evt_rep" },
        { title: "Descripción del otro evento", value: "desc01_evt_rep" },
        {
          title: "Dirección de ocurrencia del evento",
          value: "direcc_evt_rep",
        },
        { title: "Fecha de ocurrencia del evento", value: "fecha_evt_rep" },
        { title: "Hora de ocurrencia del evento", value: "hora_evt_rep" },
        {
          title: "Código del departamento de ocurrencia del evento",
          value: "departamentoCodigo_evt_rep",
        },
        {
          title: "Código del municipio de ocurrencia del evento",
          value: "ciudadCodigo_evt_rep",
        },
        { title: "Zona de ocurrencia del evento", value: "zona_evt_rep" },
        { title: "Estado de aseguramiento", value: "estado_aseg_rep" },
        { title: "Marca", value: "marca_veh_rep" },
        { title: "Placa", value: "placas_veh_rep" },
        { title: "Tipo de Vehículo", value: "tipo_veh_rep" },
        { title: "Código de la aseguradora", value: "codaseg_veh_rep" },
        { title: "Número de póliza SOAT", value: "poliza_veh_rep" },
        {
          title: "Fecha de inicio de vigencia de la póliza",
          value: "inicpoliza_veh_rep",
        },
        {
          title: "Fecha final de vigencia de la póliza",
          value: "finpoliza_veh_rep",
        },
        { title: "Número de radicado SIRAS (id_atencion)", value: "" },
        { title: "Cobro por excedente de la póliza", value: "" },
        {
          title: "Código CUPS de servicio principal de hospitalización ",
          value: "",
        },
        { title: "Complejidad del procedimiento quirúrgico", value: "" },
        {
          title: "Código CUPS del procedimiento quirúrgico principal",
          value: "",
        },
        {
          title: "Código CUPS del procedimiento quirúrgico secundario",
          value: "",
        },
        { title: "Se presto servicio UCI", value: "" },
        { title: "Días de UCI reclamados", value: "" },
        {
          title: "Tipo de documento de identidad del propietario",
          value: "tipodoc_prv_rep",
        },
        {
          title: "Número de documento de identidad del propietario",
          value: "idprop_prv_rep",
        },
        {
          title:
            "Primer apellido del propietario o razón social en caso de empresa.",
          value: "apell1_prv_rep",
        },
        { title: "Segundo apellido del propietario", value: "apell2_prv_rep" },
        { title: "Primer nombre del propietario", value: "nombrel_prv_rep" },
        { title: "Segundo nombre del propietario", value: "nombre2_prv_rep" },
        {
          title: "Dirección de residencia del propietario",
          value: "direccprop_prv_rep",
        },
        {
          title: "Teléfono de residencia del propietario",
          value: "telefprop_prv_rep",
        },
        {
          title: "Código del departamento de residencia del propietario",
          value: "departamentoCodigo_prv_rep",
        },
        {
          title: "Código del municipio de residencia del propietario",
          value: "ciudadCodigo_prv_rep",
        },
        { title: "Primer apellido del conductor", value: "apell1_cond_rep" },
        { title: "Segundo apellido del conductor", value: "apell2_cond_rep" },
        { title: "Primer nombre del conductor", value: "nombrel_cond_rep" },
        { title: "Segundo nombre del conductor", value: "nombre2_cond_rep" },
        {
          title: "Tipo de documento de identidad del conductor",
          value: "tipodoc_cond_rep",
        },
        {
          title: "Número de documento de identidad del conductor",
          value: "idprop_cond_rep",
        },
        {
          title: "Dirección de residencia del conductor",
          value: "direccprop_cond_rep",
        },
        {
          title: "Código del departamento de residencia del conductor",
          value: "departamentoCodigo_cond_rep",
        },
        {
          title: "Código del municipio de residencia del conductor",
          value: "ciudadCodigo_cond_rep",
        },
        {
          title: "Teléfono de residencia del conductor",
          value: "telefprop_cond_rep",
        },

        { title: "Tipo de referencia", value: "" },
        { title: "Fecha de remisión", value: "" },
        { title: "Hora de salida", value: "" },
        {
          title:
            "Código de habilitación del prestador de servicios de salud remitente.",
          value: "",
        },
        { title: "Profesional que remite", value: "" },
        { title: "Cargo de la persona que remite", value: "" },
        { title: "Fecha de ingreso Remite", value: "" },
        { title: "Hora de ingreso Remite", value: "" },
        {
          title:
            "Código de habilitación del prestador de servicios de salud que recibe.",
          value: "",
        },
        { title: "Profesional que recibe", value: "" },
        {
          title: "Placa ambulancia que realiza el traslado interinstitucional",
          value: "",
        },
        { title: "Placa ambulancia traslado primario", value: "" },
        {
          title: "Transporte de la víctima desde el sitio del evento",
          value: "",
        },
        {
          title: "Transporte de la víctima hasta el fin del recorrido",
          value: "",
        },
        { title: "Tipo de servicio del transporte", value: "" },
        { title: "Zona donde recoge víctima", value: "" },
        { title: "Fecha de ingreso", value: "fechaing_cer_rep" },
        { title: "Hora de ingreso", value: "horaing_cer_rep" },
        { title: "Fecha de egreso", value: "fechaegr_cer_rep" },
        { title: "Hora de egreso", value: "horaegr_cer_rep" },
        {
          title: "Código de diagnóstico principal de ingreso",
          value: "dx1ing_cer_rep",
        },
        {
          title: "Código de diagnóstico de ingreso asociado 1",
          value: "dx2ing_cer_rep",
        },
        {
          title: "Código de diagnóstico de ingreso asociado 2",
          value: "dx3ing_cer_rep",
        },
        {
          title: "Código diagnóstico principal de egreso",
          value: "dx1egr_cer_rep",
        },
        {
          title: "Código de diagnóstico de egreso asociado 1",
          value: "dx2egr_cer_rep",
        },
        {
          title: "Código de diagnóstico de egreso asociado 2",
          value: "dx3egr_cer_rep",
        },
        {
          title: "Primer apellido del médico o profesional de la salud",
          value: "apell1_cer_rep",
        },
        {
          title: "Segundo apellido del médico o profesional de la salud",
          value: "apell2_cer_rep",
        },
        {
          title: "Primer nombre del médico o profesional de la salud",
          value: "nombre1_cer_rep",
        },
        {
          title: "Segundo nombre del médico o profesional de la salud",
          value: "nombre2_cer_rep",
        },
        {
          title:
            "Tipo de documento de identidad del médico o profesional de la salud",
          value: "tipodoc_cer_rep",
        },
        {
          title:
            "Número de documento de identidad del médico o profesional de la salud",
          value: "docmedico_cer_rep",
        },
        {
          title: "Número de registro del médico ",
          value: "regmedico_cer_rep",
        },
        {
          title: "Total facturado por amparo de gastos médicos quirúrgicos",
          value: "vlrfact_gm_rep",
          format: "money",
        },
        {
          title: "Total reclamado por amparo de gastos médicos quirúrgicos",
          value: "vlrrecl_gt_rep",
          format: "money",
        },
        {
          title:
            "Total facturado por amparo de gastos de transporte y movilización de la víctima",
          value: "vlrfact_gt_rep",
          format: "money",
        },
        {
          title:
            "Total reclamado por amparo de gastos de transporte y movilización de la víctima",
          value: "vlrrecl_gm_rep",
          format: "money",
        },
        {
          title: "Manifestación de servicios habilitados",
          value: "manifserv_rep",
        },
        { title: "Descripcion del evento", value: "desc01_evt_rep" },
      ];

      // Encabezados CSV
      let csv = columnas.map((col) => `"${col.title}"`).join(";") + "\r\n";

      // Filas de datos
      data.forEach((el) => {
        let row = columnas
          .map((col) => {
            let val = el[col.value] !== undefined ? el[col.value] : "";
            // Escapar comillas dobles y reemplazar saltos de línea
            val = String(val)
              .replace(/"/g, '""')
              .replace(/\r?\n|\r/g, " ");
            return `"${val}"`;
          })
          .join(";");
        csv += row + "\r\n";
      });

      // Descargar el archivo CSV
      let blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      });
      let link = document.createElement("a");
      let url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `FURIPS_1-${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    csv_formato2() {
      let data = this.contenido;
      let perini = this.fecha_ini;
      let perfin = this.fecha_final;

      // Definir las columnas que quieres exportar (puedes ajustar según tus necesidades)
      let columnas = [
        {
          title:
            "Número de factura.",
          value: "factura_rep",
          format: "string",
        },
        {
          title: "Número consecutivo de la reclamación",
          value: "consecutivo_rep",
        },
        { title: "Tipo de servicio", value: "tiposerv_rep" },
        { title: "Código de servicio", value: "cups_rep" },
        { title: "Descripción del servicio o elemento reclamado", value: "descrcups_rep" },
        { title: "Cantidad de servicios", value: "cantfact_rep" },
        { title: "Valor unitario", value: "unitario_rep" },
        { title: "Valor total facturado", value: "totalfact_rep" },
        { title: "Valor total reclamado", value: "totalrecl_rep" },
      ];

      // Encabezados CSV
      let csv = columnas.map((col) => `"${col.title}"`).join(";") + "\r\n";

      // Filas de datos
      data.forEach((el) => {
        let row = columnas
          .map((col) => {
            let val = el[col.value] !== undefined ? el[col.value] : "";
            // Escapar comillas dobles y reemplazar saltos de línea
            val = String(val)
              .replace(/"/g, '""')
              .replace(/\r?\n|\r/g, " ");
            return `"${val}"`;
          })
          .join(";");
        csv += row + "\r\n";
      });

      // Descargar el archivo CSV
      let blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      });
      let link = document.createElement("a");
      let url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `FURIPS_2-${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },    
    excel_formato11() {
      let data = this.contenido;
      let data_parse = [];
      let perini = this.fecha_ini;
      let perfin = this.fecha_final;

      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.desc01_evt_rep = atob(
          el.desc01_evt_rep +
            el.desc02_evt_rep +
            el.desc03_evt_rep +
            el.desc04_evt_rep +
            el.desc05_evt_rep
        );
        data_parse.push(copia);
      });

      let columnas = [
        {
          title: "Número de radicado anterior",
          format: "string",
        },
        {
          title: "RG",
          format: "string",
        },
        {
          title: "Número de factura.",
          value: "factura_rep",
          format: "string",
        },
        {
          title: "Número consecutivo de la reclamación",
          format: "string",
        },
        {
          title: "Código de habilitación del prestador de servicios de salud.",
          value: "codips_rep",
          format: "string",
        },
        {
          title: "Primer apellido de la víctima",
          value: "Apellido1_rep",
          format: "string",
        },
        {
          title: "Segundo apellido de la víctima",
          value: "Apellido2_rep",
          format: "string",
        },
        {
          title: "Primer nombre de la víctima",
          value: "nombre1_rep",
          format: "string",
        },
        {
          title: "Segundo nombre de la víctima",
          value: "nombre2_rep",
          format: "string",
        },
        {
          title: "Tipo de documento de identidad de la víctima",
          value: "tipodoc_vic_rep",
          format: "string",
        },
        {
          title: "Número de documento de identidad de la víctima",
          value: "nrodoc_vic_rep",
          format: "string",
        },
        {
          title: "Fecha de nacimiento de la víctima",
          value: "fnacim_vic_rep",
          format: "string",
        },
        {
          title: "Fecha de fallecimiento",
          value: "ffallec_vic_rep",
          format: "string",
        },
        {
          title: "Sexo de la víctima",
          value: "sexo_vic_rep",
          format: "string",
        },
        {
          title: "Dirección de residencia de la víctima",
          value: "direcc_vic_rep",
          format: "string",
        },
        {
          title: "Código del departamento de residencia de la víctima",
          value: "departamentoCodigo_rep",
          format: "string",
        },
        {
          title: "Código del municipio de residencia de la víctima",
          value: "ciudadCodigo_rep",
          format: "string",
        },
        {
          title: "Teléfono de la víctima",
          value: "telepaci_rep",
          format: "string",
        },
        {
          title: "Condición de la víctima",
          value: "condicion_rep",
          format: "string",
        },
        {
          title: "Naturaleza del evento",
          value: "naturaleza_evt_rep",
          format: "string",
        },
        {
          title: "Descripción del otro evento",
          value: "desc01_evt_rep",
          format: "string",
        },
        {
          title: "Dirección de ocurrencia del evento",
          value: "direcc_evt_rep",
          format: "string",
        },
        {
          title: "Fecha de ocurrencia del evento",
          value: "fecha_evt_rep",
          format: "string",
        },
        {
          title: "Hora de ocurrencia del evento",
          value: "hora_evt_rep",
          format: "string",
        },
        {
          title: "Código del departamento de ocurrencia del evento",
          value: "departamentoCodigo_evt_rep",
          format: "string",
        },
        {
          title: "Código del municipio de ocurrencia del evento",
          value: "ciudadCodigo_evt_rep",
          format: "string",
        },
        {
          title: "Zona de ocurrencia del evento",
          value: "zona_evt_rep",
          format: "string",
        },
        {
          title: "Estado de aseguramiento",
          value: "estado_aseg_rep",
          format: "string",
        },
        {
          title: "Marca",
          value: "marca_veh_rep",
          format: "string",
        },
        {
          title: "Placa",
          value: "placas_veh_rep",
          format: "string",
        },
        {
          title: "Tipo de Vehículo",
          value: "tipo_veh_rep",
          format: "string",
        },
        {
          title: "Código de la aseguradora",
          value: "codaseg_veh_rep",
          format: "string",
        },
        {
          title: "Número de póliza SOAT",
          value: "poliza_veh_rep",
          format: "string",
        },
        {
          title: "Fecha de inicio de vigencia de la póliza",
          value: "inicpoliza_veh_rep",
          format: "string",
        },
        {
          title: "Fecha final de vigencia de la póliza",
          value: "finpoliza_veh_rep",
          format: "string",
        },
        {
          title: "Número de radicado SIRAS (id_atencion)",
          format: "string",
        },
        {
          title: "Cobro por excedente de la póliza",
          format: "string",
        },
        {
          title: "Código CUPS de servicio principal de hospitalización ",
          format: "string",
        },
        {
          title: "Complejidad del procedimiento quirúrgico",
          format: "string",
        },
        {
          title: "Código CUPS del procedimiento quirúrgico principal",
          format: "string",
        },
        {
          title: "Código CUPS del procedimiento quirúrgico secundario",
          format: "string",
        },
        {
          title: "Se presto servicio UCI",
          format: "string",
        },
        {
          title: "Días de UCI reclamados",
          format: "string",
        },
        {
          title: "Tipo de documento de identidad del propietario",
          value: "tipodoc_prv_rep",
          format: "string",
        },
        {
          title: "Número de documento de identidad del propietario",
          value: "idprop_prv_rep",
          format: "string",
        },
        {
          title:
            "Primer apellido del propietario o razón social en caso de empresa.",
          value: "apell1_prv_rep",
          format: "string",
        },
        {
          title: "Segundo apellido del propietario",
          value: "apell2_prv_rep",
          format: "string",
        },
        {
          title: "Primer nombre del propietario",
          value: "nombrel_prv_rep",
          format: "string",
        },
        {
          title: "Segundo nombre del propietario",
          value: "nombre2_prv_rep",
          format: "string",
        },
        {
          title: "Dirección de residencia del propietario",
          value: "direccprop_prv_rep",
          format: "string",
        },
        {
          title: "Teléfono de residencia del propietario",
          value: "telefprop_prv_rep",
          format: "string",
        },
        {
          title: "Código del departamento de residencia del propietario",
          value: "departamentoCodigo_prv_rep",
          format: "string",
        },
        {
          title: "Código del municipio de residencia del propietario",
          value: "ciudadCodigo_prv_rep",
          format: "string",
        },
        {
          title: "Primer apellido del conductor",
          value: "apell1_cond_rep",
          format: "string",
        },
        {
          title: "Segundo apellido del conductor",
          value: "apell2_cond_rep",
          format: "string",
        },

        {
          title: "Primer nombre del conductor",
          value: "nombrel_cond_rep",
          format: "string",
        },
        {
          title: "Segundo nombre del conductor",
          value: "nombre2_cond_rep",
          format: "string",
        },
        {
          title: "Tipo de documento de identidad del conductor",
          value: "tipodoc_cond_rep",
          format: "string",
        },
        {
          title: "Número de documento de identidad del conductor",
          value: "idprop_cond_rep",
          format: "string",
        },
        {
          title: "Dirección de residencia del conductor",
          value: "direccprop_cond_rep",
          format: "string",
        },
        {
          title: "Código del departamento de residencia del conductor",
          value: "departamentoCodigo_cond_rep",
          format: "string",
        },
        {
          title: "Código del municipio de residencia del conductor",
          value: "ciudadCodigo_cond_rep",
          format: "string",
        },
        {
          title: "Teléfono de residencia del conductor",
          value: "telefprop_cond_rep",
          format: "string",
        },

        {
          title: "Tipo de referencia",
          format: "string",
        },
        {
          title: "Fecha de remisión",
          format: "string",
        },
        {
          title: "Hora de salida",
          format: "string",
        },
        {
          title:
            "Código de habilitación del prestador de servicios de salud remitente.",
          format: "string",
        },
        {
          title: "Profesional que remite",
          format: "string",
        },
        {
          title: "Cargo de la persona que remite",
          format: "string",
        },
        {
          title: "Fecha de ingreso Remite",
          format: "string",
        },
        {
          title: "Hora de ingreso Remite",
          format: "string",
        },
        {
          title:
            "Código de habilitación del prestador de servicios de salud que recibe.",
          format: "string",
        },
        {
          title: "Profesional que recibe",
          format: "string",
        },
        {
          title: "Placa ambulancia que realiza el traslado interinstitucional",
          format: "string",
        },
        {
          title: "Placa ambulancia traslado primario",
          format: "string",
        },
        {
          title: "Transporte de la víctima desde el sitio del evento",
          format: "string",
        },
        {
          title: "Transporte de la víctima hasta el fin del recorrido",
          format: "string",
        },
        {
          title: "Tipo de servicio del transporte",
          format: "string",
        },
        {
          title: "Zona donde recoge víctima",
          format: "string",
        },
        {
          title: "Fecha de ingreso",
          value: "fechaing_cer_rep",
          format: "string",
        },
        {
          title: "Hora de ingreso",
          value: "horaing_cer_rep",
          format: "string",
        },
        {
          title: "Fecha de egreso",
          value: "fechaegr_cer_rep",
          format: "string",
        },
        {
          title: "Hora de egreso",
          value: "horaegr_cer_rep",
          format: "string",
        },
        {
          title: "Código de diagnóstico principal de ingreso",
          value: "dx1ing_cer_rep",
          format: "string",
        },
        {
          title: "Código de diagnóstico de ingreso asociado 1",
          value: "dx2ing_cer_rep",
          format: "string",
        },
        {
          title: "Código de diagnóstico de ingreso asociado 2",
          value: "dx3ing_cer_rep",
          format: "string",
        },
        {
          title: "Código diagnóstico principal de egreso",
          value: "dx1egr_cer_rep",
          format: "string",
        },
        {
          title: "Código de diagnóstico de egreso asociado 1",
          value: "dx2egr_cer_rep",
          format: "string",
        },
        {
          title: "Código de diagnóstico de egreso asociado 2",
          value: "dx3egr_cer_rep",
          format: "string",
        },
        {
          title: "Primer apellido del médico o profesional de la salud",
          value: "apell1_cer_rep",
          format: "string",
        },
        {
          title: "Segundo apellido del médico o profesional de la salud",
          value: "apell2_cer_rep",
          format: "string",
        },
        {
          title: "Primer nombre del médico o profesional de la salud",
          value: "nombre1_cer_rep",
          format: "string",
        },
        {
          title: "Segundo nombre del médico o profesional de la salud",
          value: "nombre2_cer_rep",
          format: "string",
        },
        {
          title:
            "Tipo de documento de identidad del médico o profesional de la salud",
          value: "tipodoc_cer_rep",
          format: "string",
        },
        {
          title:
            "Número de documento de identidad del médico o profesional de la salud",
          value: "docmedico_cer_rep",
          format: "string",
        },
        {
          title: "Número de registro del médico ",
          value: "regmedico_cer_rep",
          format: "string",
        },
        {
          title: "Total facturado por amparo de gastos médicos quirúrgicos",
          value: "vlrfact_gm_rep",
          format: "money",
        },
        {
          title: "Total reclamado por amparo de gastos médicos quirúrgicos",
          value: "vlrrecl_gt_rep",
          format: "money",
        },
        {
          title:
            "Total facturado por amparo de gastos de transporte y movilización de la víctima",
          value: "vlrfact_gt_rep",
          format: "money",
        },
        {
          title:
            "Total reclamado por amparo de gastos de transporte y movilización de la víctima",
          value: "vlrrecl_gm_rep",
          format: "money",
        },
        {
          title: "Manifestación de servicios habilitados",
          value: "manifserv_rep",
          format: "string",
        },

        {
          title: "Descripcion del evento",
          format: "string",
        },
      ];

      let header_format = [
        {
          text: "FORMATO 1 FURIPS",
          bold: true,
          size: 16,
        },
        `Periodo Inicial: ${perini}`,
        `Periodo Final: ${perfin}`,
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato 1 Furips",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `FURIPS_1-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    excel_formato2() {
      let data = this.contenido;
      let data_parse = [];
      let perini = this.fecha_ini;
      let perfin = this.fecha_final;

      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        data_parse.push(copia);
      });

      let columnas = [
        {
          title: "Número de factura.",
          value: "factura_rep",
          format: "string",
        },
        {
          title: "Número consecutivo de la reclamación",
          value: "consecutivo_rep",
          format: "string",
        },
        {
          title: "Tipo de servicio",
          value: "tiposerv_rep",
          format: "string",
        },
        {
          title: "Código de servicio",
          value: "cups_rep",
          format: "string",
        },
        {
          title: "Descripción del servicio o elemento reclamado",
          value: "descrcups_rep",
          format: "string",
        },
        {
          title: "Cantidad de servicios",
          value: "cantfact_rep",
          format: "money",
        },
        {
          title: "Valor unitario",
          value: "unitario_rep",
          format: "money",
        },
        {
          title: "Valor total facturado",
          value: "totalfact_rep",
          format: "money",
        },
        {
          title: "Valor total reclamado",
          value: "totalrecl_rep",
          format: "money",
        },
      ];

      let header_format = [
        {
          text: "FORMATO 2 FURIPS",
          bold: true,
          size: 16,
        },
        `Periodo Inicial: ${perini}`,
        `Periodo Final: ${perfin}`,
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato 2 Furips",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `FURIPS_2-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
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
  },
};
</script>