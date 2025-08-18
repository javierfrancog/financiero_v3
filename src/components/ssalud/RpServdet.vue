<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1400"
        elevation="2"
        :loading="card.loader"
        :disabled="card.disabled"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-abacus</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Reporte Prestación de Servicios Detallada ss</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="12" sm="5">
                <v-autocomplete
                  outlined
                  label="Contrato"
                  clearable
                  :loading="load_contrato"
                  :items="selectObjContratos"
                  item-value="value"
                  hide-details
                  v-model="selectContrato"
                ></v-autocomplete>
              </v-col>
              <v-col class="d-flex" cols="12" sm="7">
                <v-text-field
                  label="Descripcion"
                  outlined
                  hide-details
                  v-model="descripContrato"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex" cols="12" sm="3">
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

              <v-col class="d-flex" cols="12" sm="3">
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
                      v-on="on"
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_final"
                    @input="pickerFechaFinal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="d-flex justify-center" cols="4">
                <v-switch
                  v-model="form.pendientes"
                  @change="consultarServicios()"
                  label="Solo Pendientes por facturar"
                ></v-switch>
              </v-col>

            </v-row>
           <v-row>
              <v-col class="d-flex" cols="12" sm="3">
                <v-btn
                  color="indigo"
                  class="ma-2 white--text"
                  @click="consultarServicios"
                  depressed
                  large
                >
                  Consultar
                  <v-icon right dark>mdi-file-upload-outline</v-icon>
                </v-btn>
              </v-col>
            <v-col
            class="d-flex mb-4 justify-end"
             v-if="prest_servicios.length != 0">
              <v-btn
                color="green darken-2"
                class="ma-2 white--text px-12"
                large
                depressed
                @click="print_reporte_excel()"
                :disabled="prest_servicios.length == 0"
              >
                Generar Excel
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn>
            </v-col>

            </v-row>
            <v-divider color="succes"></v-divider>

            <v-divider color="succes"></v-divider>

            <v-row
              class="d-flex mb-4 justify-center"
              no-gutters
              v-if="prest_servicios.length != 0"
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
              :loading="load_table"
              :headers="headers"
              :items="prest_servicios"
              item-key="numero"
              :search="search"
              class="elevation-1"
              v-if="prest_servicios.length != 0"
           >
            </v-data-table>
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


// Vue.component("downloadExcel", JsonExcel);
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
      pickeFechaIni: false,
      fecha_ini: this.$moment().format("YYYY-MM-DD"),
      pickerFechaFinal: false,
      selectContrato: null,
      identificacion: null,
      soloanulados: null,
      pteradicar: null,
      ptedian: null,      
      prest_servicios: [],
      headerCsv: [],
      fecha_final: this.$moment().format("YYYY-MM-DD"),
      selectObjContratos: [],
      contratos: [],
      headers: [
        { text: "Sede", align: "center", value: "sede_rep" },
        { text: "Numero", align: "left", value: "nroprserv_rep" },
        { text: "Fecha", align: "left", value: "fecha_servicio_rep" },
        { text: "Id_Paciente", align: "left", value: "idpaciente_rep" },
        { text: "Apellido", align: "left", value: "apellido1_rep" },
        { text: "Nombre", align: "left", value: "nombre1_rep" },
        { text: "Servicio", align: "left", value: "nombreserv_rep" },     
        { text: "Estado", align: "left", value: "estado_rep" },
   
      ],
      empresa: [],
      card: {
        loader: false,
        disabled: false,
      },
      logoSrc:
        "https://server1ts.net/datos/image/clientes/" +
        parseFloat(sessionStorage.Sesion.substr(0, 15)) +
        ".png",
      masivo: {
        data: [],
        jsonEnvio: [],
        res: [],
      },
      form:{
        pendientes: false
      },
      masivo_pdf: {
        data: [],
      },
      dialogo_rango: {
        estado: false,
        tipo: 0,
        numInicial: null,
        numFinal: null,
        loader: false,
      },
    };
  },
  created() {
    this.cargarContratos();
    this.get_empresa();
  },
  computed: {
    descripContrato() {
      if (this.selectContrato == null) return undefined;
      let retornar = this.contratos.filter((e) => {
        if (e.nro == this.selectContrato) {
          return e.descripcion;
        }
      });
      return retornar[0].descripcion;
    },
  },
  watch: {
    fecha_final() {
      this._validarFechas();
    },
  },
  methods: {
    print_reporte_excel() {
      var data = this.prest_servicios;
      var data_parse = [];
      var dato_contrato = this.selectContrato; 

      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
         copia.valor = parseFloat(el.valor_rep.replace(/\,/g, "")) || 0;
         copia.nroprserv_rep = parseInt(el.nroprserv_rep);
        
        data_parse.push(copia);
      });

      var columnas = [
        {
          title: "Fecha solicitud Cita",
          value: "fechasol_rep",                    
          format: "fecha",                    
        },
        {
          title: "Dias Oportunidad",
          value: "oportcita_rep",                              
        },
        {
          title: "Fecha de la Cita",
          value: "fechacita_rep",   
          format: "fecha",
        },
        {
          title: "Hora de la Cita",
          value: "horacita_rep",          
          format: "string",          
        },
        {
          title: "Usuario que Asigna",
          value: "asignaag_rep",                    
        },
        {
          title: "Hora de Ingreso",
          value: "horaingreso_rep",     
          format: "string",                                   
        },
        {
          title: "Hora de llamado",
          value: "horallamado_rep",                    
          format: "string",                                             
        },
        {
          title: "Tiempo de Espera",
        },
        {
          title: "Hora Terminacion de Atencion",
          value: "horaatencion_rep",                    
          format: "string",                                             
        },
        {
          title: "Fecha de Entrega",
          format: "fecha",                    
        },
        {
          title: "Oportunidad de Entrega",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",          
        },
        {
          title: "Segundo Nombre",
          value: "nombre2_rep",          
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Tipo Documento",
          value: "tipodoc_rep",                    
        },
        {
          title: "Nro Documento",
          value: "idpaciente_rep",                              
        },
        {
          title: "Fecha Nacimiento",
          value: "fechanac_rep",                                        
          format: "fecha",          
        },
        {
          title: "Edad",
          value: "edad_rep",                                                  
        },
        {
          title: "Urgencias",
          value: "urgencias_rep",                                                            
        },
        {
          title: "Consulta Externa",
          value: "consultaex_rep",                                                                      
        },
        {
          title: "Telefono",
          value: "telefono_rep",
        },
        {
          title: "Femenino",
          value: "femenino_rep",
        },
        {
          title: "Masculino",
          value: "masculino_rep",
        },
        {
          title: "Direccion",
          value: "direccion_rep",
        },
        {
          title: "Cliente",
          value: "cliente_rep",
        },
        {
          title: "Reg.Subsidiado",
          value: "subsidiado_rep",
        },
        {
          title: "Reg.Contributivo",
          value: "contributivo_rep",
        },
        {
          title: "Reg.Otro",
          value: "otro_rep",
        },
        {
          title: "Medico",
          value: "med_ordena_rep",
        },
        {
          title: "Fecha Servicio",
          value: "fecha_servicio_rep",
          format: "fecha",          
        },
        {
          title: "Nro.Servicio",
          value: "nroprserv_rep",
        },
        {
          title: "Estado_Servicio",
          value: "estado_rep",
        },

        {
          title: "Cod.Servicio",
          value: "codserv_rep",
          format: "string",                                   
        },
        {
          title: "Descripcion Servicio",
          value: "nombreserv_rep",
        },
        {
          title: "Cantidad",
          value: "cantidad_rep",
          format: "money",
          totalsRowFunction: "sum",          
        },
        {
          title: "Valor",
          value: "valor_rep",
          format: "money",
          totalsRowFunction: "sum",          
        },
        {
          title: "Copago",
          value: "copago_rep",
          format: "money",
          totalsRowFunction: "sum",          
        },
        {
          title: "Cuota Moderadora",
          value: "moderadora_rep",
          format: "money",
          totalsRowFunction: "sum",          
        },
        {
          title: "Medico/Sala Agendado",
          value: "atiende_rep",
        },

        {
          title: "Especialidad",
          value: "especialidad_rep",
        },
        {
          title: "Medico que Ordena",
          value: "med_ordena_rep",
        },
        {
          title: "Autorizacion",
          value: "autorizacion_rep",
        },
        {
          title: "Usuario que Recepciona",
          value: "recepcion_rep",                    
        },
        {
          title: "Prefijo",
          value: "pref_rep",
        },
        {
          title: "Factura",
          value: "numero_rep",
        },
        {
          title: "Fecha Factura",
          value: "fecha_Factura_rep",
          format: "fecha",
        },
        {
          title: "Prefijo Copago",
          value: "prefcp_rep",
        },
        {
          title: "Factura Copago",
          value: "numerocp_rep",
        },

        {
          title: "Aux_enfermeria",
          value: "auxatencion_rep",                    
        },
        {
          title: "Medico Lectura",
          value: "medreporte_rep",                    
        },
        {
          title: "Usuario Modifica",
          value: "modifica_rep",                    
        },
        {
          title: "Fecha Modifica",
          value: "fechamod_rep",                                        
          format: "fecha",          
        },
        {
          title: "Hora Modifica",
          value: "horamod_rep",                                        
          format: "string",          
        },


      ];
      var fecha_inicial = this.fecha_ini;
      var fecha_final = this.fecha_final;
      var contrato = dato_contrato;
      var header_format = [
        { text: "REPORTE PRESTACION DE SERVICIOS", bold: true, size: 16 },
        `Fecha inicial: ${fecha_inicial} - Fecha final: ${fecha_final}`,
        `Contrato: ${contrato}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Prestacion Servicios",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `REPORTE-PRESTACION SERVICIOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },


    _validarFechas() {
      let fecha_ini = this.fecha_ini.split("-").join(""),
        fecha_final = this.fecha_final.split("-").join(""),
        retornar = true;
      if (parseFloat(fecha_final) < parseFloat(fecha_ini)) {
        this.$emit("snack", {
          color: "error",
          text: "La fecha final no puede ser menor a la fecha inicial",
          estado: true,
        });
        retornar = false;
      }
      return retornar;
    },
    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos.forEach((k, v) => {
            this.selectObjContratos.push({
              value: k.nro,
              text: k.nro + " - " + k.descripcion + "-" + k.detalle,
            });
          });
          this.load_contrato = false;
        })
        .catch((err) => {
          this.load_contrato = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar contratos",
            estado: true,
          });
        });
    },
    consultarServicios() {
      let consulta = this.contratos.filter((e) => {
          if (e.nro == this.selectContrato) {
            return e;
          }
        }),
        estado_fecha = this._validarFechas();
      consulta = consulta[0];

      this.headerCsv = [
        "Reporte: , Facturacion por paciente," +
          "Contrato: ," +
          this.selectContrato +
          " - " +
          this.descripContrato +
          " , Fecha inicial: ," +
          this.fecha_ini +
          ", Fecha final: , " +
          this.fecha_final.replace(/-/g, "/"),
        "",
      ];
      if (consulta) {
        let pendientes = this.form.pendientes ? "1" : "0";

        if (estado_fecha) {
          this.loader = true;
          post
            .postData({
              url: "Clinico/dlls/ClRpServdetJ.dll",
              data:
                sessionStorage.Sesion +
                "|" +
                consulta.nro +
                "|" +
                consulta.identificacion +
                "|" +
                this.fecha_ini.split("-").join("") +
                "|" +
                this.fecha_final.split("-").join("") +
                "|" +
                pendientes +
                "|",
              method: "",
            })
            .then((data) => {
              this.loader = false;
              data.pop();
              this.prest_servicios = data;
            })
            .catch((err) => {
              this.load_contrato = false;
              this.loader = false;
              this.$emit("snack", {
                color: "error",
                text: "Error al cargar servicios",
                estado: true,
              });
            });
        }
      } else {
        this.$emit("snack", {
          color: "error",
          text: "Debe selecionar un contrato",
          estado: true,
        });
      }
    },
    get_empresa() {
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
            text: "Error al cargar información de la empresa",
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
  },
};
</script>
<style lang="sass">
.v-data-table__wrapper td
  line-height: 2!important
</style>