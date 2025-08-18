<template>
  <v-layout wrap>
    <v-container class="blue-background" fluid>
      <v-row>
        <!-- <v-col cols="12" align="center">
          <v-img :src="logo_empresa" max-width="300" />
        </v-col>
        <v-col cols="12" align="center">
          <h2 class="text-h4 font-weight-medium blue--text">
            ASIGNACIÓN DE TURNOS
          </h2>
          <h3 class="text-h5 font-weight-medium">{{ punto_recaudo }}</h3>
        </v-col> -->
        <v-col cols="12" align="center">
          <v-card
            elevation="10"
            class="py-10"
            outlined
            shaped
            tiled
            max-width="1100"
            color="#2196f3"
          >
            <v-card-text class="pb-0">
              <v-tabs v-model="tab" centered slider-color="green">
                <v-tab>Turno</v-tab>
              </v-tabs>
              <v-divider color="succes"></v-divider>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <v-card color="basil" flat>
                    <v-row class="d-flex mt-3 mb-2 justify-center">
                      <v-col cols="3" align="center">
                        <v-chip
                          variant="flat"
                          color="orange"
                          class="white--text"
                          @click="buscar_cedula()"
                          @keyup.enter="buscar_cedula()"
                          fab
                          depressed
                          id="buscar_cedula"
                          size="x-large"
                        >
                          Buscar Paciente
                        </v-chip>
                      </v-col>

 
                    </v-row>
                    <v-row class="d-flex mt-3 mb-2 justify-center">
                      <v-col class="d-flex" cols="4">
                        <v-text-field
                          background-color="white"
                          color="black"
                          outlined
                          v-model="form.paciente"
                          hide-details
                          clearable
                          :error="error.identificacion"
                          class="text-h4"
                          height="70px"
                          label="Digite su Cedula"
                          @keyup.enter="buscar_cedula()"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row v-if="paciente.identificacion">
                      <v-col >
                        <p class="text-h4">
                          {{
                            paciente.primerApellido.trim() +
                            " " +
                            paciente.nombres.trim() + " Edad:" +
                            paciente.edad.trim()
                          }}
                        </p>
                      </v-col>
                    </v-row>
                    <v-row v-if="paciente.identificacion">
                      <v-col>
                        <p class="text-h4 purple--text flex bg-surface-variant">
                          {{ paciente.descripeps.trim() }}
                        </p>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>

            <v-divider color="#FF6F00"></v-divider>

            <v-divider color="#FF6F00"></v-divider>

            <!-- <v-card-text class="mt-0 pt-0">
              <v-col cols="12" v-if="filaturno.cod_rep">
                <v-btn
                  outlined
                  dark
                  class="text-h4 font-weight-medium"
                  @click="asignarTurno()"
                >
                  {{ filaturno.descrip_rep.trim() }}
                </v-btn>
              </v-col>
            </v-card-text> -->

            <v-card-text class="mt-0 pt-0" v-if="filaturno.length != 0">
              <v-col cols="12" v-for="turno in filaturno" :key="turno.cod_rep">
                <v-btn
                  outlined
                  dark
                  class="text-h4 font-weight-medium"
                  @click="asignarTurno(turno, 0)"
                >
                  {{ turno.descrip_rep.trim() }}
                </v-btn>
              </v-col>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#ffffff" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="900px">
      <v-card class="px-6" color="blue darken-2">
        <v-card-title>
          <span class="title col-12 white--text">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0 text-center">
          <v-col cols="12" v-for="subfila in subfilas" :key="subfila.cod_rep">
            <v-btn
              outlined
              dark
              class="text-h4 font-weight-medium"
              @click="asignarTurno(subfila, 1)"
            >
              {{ subfila.descrip_rep.trim() }}
            </v-btn>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            dark
            color="red darken-1"
            @click="
              dialogo.estado = false;
              dialogo.titulo = '';
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-col cols="12" align="center" class="mt-3">
      <v-img
        :src="require('@/assets/titan_logo.png')"
        max-height="120"
        max-width="120"
      />
    </v-col>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";
import { turnos_pos } from "../../_formatos_disp.js";
import { novedad_pos } from "../../_formatos_disp.js";

export default {
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      pickerNacimiento: false,
      sortKey: "consec_rep",
      sortDesc: false,
      search: "",
      tab: 0,
      loader: false,
      agencia: "",
      contenido: [],
      contenido_paciente: [],
      novedad: [],
      filaturno: {},
      turno: [],
      eps: null,
      logo_empresa: null,
      punto_recaudo: null,
      card_estado: false,

      dialogopac: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      ciudades_dian: [],
      departamentos: [],
      filterMunicipios: [],
      items_eps: [],

      format_fecha_nacimiento: null,
      errores: {
        contrato: false,
        paciente: false,
        autorizacion: false,
        consultorio: false,
        tipopago: false,
        copago: false,
        cuota: false,
        observaciones: false,
        cita: false,
        diagnostico: false,
        idpaciente: false,
        nombres: false,
        primerApellido: false,
        departamento: false,
        ciudad: false,
        nacimiento: false,
        regimen: false,
        eps: false,
        genero: false,
        zona: false,
        punto_fact: false,
      },

      tipoid: [
        { text: "Cedula Ciudadania", value: "CC" },
        { text: "Tarjeta Identidad", value: "TI" },
        { text: "Registro Civil", value: "RC" },
        { text: "Permiso Esp.Permanencia", value: "PE" },
        { text: "Cedula Extranjería", value: "CE" },
        { text: "Adulto Sin Identificar", value: "AS" },
        { text: "Menor Sin Identificar", value: "MS" },
        { text: "Certificado Nacido Vivo", value: "NV" },
        { text: "Pasaporte", value: "PA" },
        { text: "Carnet Diplomatico", value: "CD" },
        { text: "Salvo Conducto", value: "SC" },
        { text: "Permiso por Proteccion Temporal", value: "PT" },
      ],
      regimen: [
        { text: "Subsidiado", value: 1 },
        { text: "Contributivo", value: 8 },
        { text: "Particular", value: 2 },
        { text: "Especial", value: 3 },
        { text: "Excepción", value: 4 },
        { text: "Plan Complementario", value: 5 },
        { text: "Otro", value: 9 },
      ],

      error: {
        identificacion: false,
      },
      form: {
        tipoid: null,
        paciente: null,
        idpaciente: null,
      },
      paciente: {},

      dialogo: {
        estado: false,
        titulo: "",
      },
      dialogonovedad: {
        estado: false,
        titulo: "",
      },

      subfilas: [],
      tablaPendientes: {
        headers: [
          { text: "Fecha", align: "center", value: "fecha_rep" },
          { text: "Dispensación", align: "center", value: "consec_rep" },
          { text: "Sede", align: "center", value: "agencia_rep" },
          { text: "Medicamento", align: "left", value: "descripprod_rep" },
          { text: "Cantidad", align: "center", value: "cant_rep" },
        ],
        datos: [],
      },

      headers_paciente: [
        { text: "Fecha", align: "center", value: "fecha_rep" },
        { text: "Pendiente", align: "center", value: "consec_rep" },
        { text: "Sede", align: "center", value: "agencia_rep" },
        { text: "Medicamento", align: "left", value: "descripprod_rep" },
        { text: "Cantidad", align: "center", value: "cant_rep" },
        // { text: "Seleccionar", value: "edit", align: "center" },
      ],
    };
  },
  created() {
    this.get_empresa();
    this.cargarcontenido();
    this.cargarnovedad();
    this.cargarEps();
    this.cargarCiudades();

    this.logo_empresa =
      "https://server3ts.com/datos/image/clientes/" +
      `${parseFloat(sessionStorage.Sesion.substr(0, 15))}` +
      ".png";
  },
  computed: {},
  methods: {
    cargarCiudades() {
      post
        .postData({
          url: "Datos/BASE/CIUDADES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.ciudades_dian = data.departamentos;
          this.ciudades_dian.forEach((k, v) => {
            this.departamentos.push({
              value: k.codigo,
              text: k.departamento,
            });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },
    cargarEps: function () {
      post
        .postData({
          url: "Datos/BASE/eps.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          data.eps.forEach((k, v) => {
            this.items_eps.push({
              value: k.codigo,
              text: k.nombre,
            });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar eps's",
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
          this.empresa = data[0];
          this.punto_recaudo = this.empresa.descragencia_rep.trim();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Empresa",
            estado: true,
          });
        });
    },

    get_date() {
      var actual = new Date();
      var fecha_format = actual.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      var hora_format = actual.toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });

      return fecha_format + " " + hora_format;
    },
    focusNextField(nextFieldId) {
      document.getElementById(nextFieldId).focus();
    },
    buscar_cedula() {
      let paciente = this.form.paciente;
      if (!paciente) {
        this.error.paciente = true;
        this.alerta_error("Debe registrar una identificación");
      } else {
        this.buscar(" ", paciente);
      }
    },
    buscar(inicial, paciente) {
      this.inicial = inicial;
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/Clcfpaciente24J.DLL",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.paciente = JSON.parse(JSON.stringify(data[0]));
          this.paciente.edad = this.paciente.edad.replace(/\Anos/g, "Años");

          if (this.paciente.estado == 2) {
            this.$emit("snack", {
              color: "error",
              text: "Paciente Inactivo",
              estado: true,
            });
          } else {
            this.filaturno = this.contenido.filter(
              (el) =>
                parseFloat(el.cod_rep) == 5 ||
                parseFloat(el.cod_rep) == 11 ||
                parseFloat(el.cod_rep) == 4 
                
            );

          }
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;

          if (err.Code == 3) {
            this.logout();
          }
          if (err.Code == 4) {
            this.$emit("snack", {
              color: "error",
              text: "Paciente No Registrado en Base de Datos",
              estado: true,
            });
            this.filaturno = []
          } else {
            this.$emit("snack", {
              color: "error",
              text: "Paciente No Capitado",
              estado: true,
            });
            this.filaturno = []
 
          }

          this.paciente = {};

          // this.activar_evento();
          // this.filaturno.push(
          //   this.contenido.find((el) => parseFloat(el.cod_rep) == 5)
          // );
        });
    },
    get_historial(paciente) {
      this.loader = true;
      this.contenido_paciente = [];
      post
        .postData({
          url: "Dispensa/dlls/PrDispensa05J.DLL",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.contenido_paciente = data;
        })
        .catch((err) => {
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Paciente Sin historial",
            estado: true,
          });
        });
    },
    get_pendientes(paciente) {
      this.loader = true;
      this.contenido_paciente = [];
      post
        .postData({
          url: "Dispensa/dlls/PrPendiente03J.DLL",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.tablaPendientes.datos = data;
        })
        .catch((err) => {
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Paciente Sin historial",
            estado: true,
          });
        });
    },
    logout() {
      let ruta = null;
      let data_auth = sessionStorage.data_auth
        ? JSON.parse(atob(sessionStorage.data_auth))
        : false;
      if (!data_auth) {
        ruta = "/";
      } else if (data_auth && data_auth?.modulo === "rc")
        ruta = { name: "loginrc" };
      else if (data_auth && data_auth?.modulo === "tr")
        ruta = { name: "logintr" };
      else if (data_auth && data_auth?.modulo === "pr")
        ruta = { name: "loginpr" };
      else if (data_auth && data_auth?.modulo === "resmed")
        ruta = { name: "Loginresmerakids" };

      sessionStorage.clear();
      this.$router.push(ruta);
    },
    activar_evento() {
      this.paciente.identificacion = null;
      this.filaturno.length = 0;

      this.filaturno = this.contenido.filter(
        (el) => parseFloat(el.cod_rep) == 3
      );
    },
    print_turno() {
      let paciente = this.form.paciente ? this.form.paciente.trim() : 0;
      let cod_sede = this.agencia;
      post
        .postData({
          url: "Dispensa/dlls/PrPendiente03J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|" + cod_sede + "|",
          method: "",
        })
        .then((dataTurno) => {
          this.loader = false;
          let datos = dataTurno[0];

          const data = {
            cod_rep: datos.consec_rep,
            descrip_rep: datos.descrfila_rep
              ? datos.descrfila_rep
              : datos.descrfila_rep,
            idturno_rep: datos.abreviafila_rep,
            paciente: this.paciente,
            turnonro: parseFloat(datos.consec_rep),
          };
          var logo_src = require(`../../assets/image/clientes/${parseFloat(
            sessionStorage.Sesion.substr(0, 15)
          )}.png`);

          this.pdfs.getBase64(logo_src).then((logo) => {
            data.logo = logo;
            data.fecha = this.get_date();
            turnos_pos(data).then(() => {
              console.log("Impresion terminada");
              this.paciente = {};
              this.filaturno = [];
              this.form.paciente = "";
              this.dialogo = {};
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al imprimir turno",
            estado: true,
          });
        });
    },
    asignarTurno(turno, subfila) {
      if (subfila == 0) {
        this.turno = turno;
      }

      this.loader = true;
      let cod_turno = turno.cod_rep;

      if (parseFloat(cod_turno) !== 5) {
        const cod_sede = this.agencia;
        let codsubfila = 0;
        if (subfila == 1) {
          cod_turno = this.turno.cod_rep;
          codsubfila = turno.cod_rep;
        }
        this.turno = [];

        let paciente = this.form.paciente ? this.form.paciente.trim() : 0;
        post
          .postData({
            url: "Dispensa/dlls/Prfilaturno.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              cod_sede +
              "|" +
              cod_turno +
              "|" +
              paciente +
              "|" +
              codsubfila +
              "|",
            method: "",
          })
          .then((dataTurno) => {
            this.loader = false;

            const data = {
              cod_rep: turno.cod_rep,
              descrip_rep: turno.descripMayor_rep
                ? turno.descripMayor_rep
                : turno.descrip_rep,
              idturno_rep: turno.idturno_rep,
              paciente: this.paciente,
              turnonro: parseFloat(dataTurno[0]),
            };
            var logo_src = require(`../../assets/image/clientes/${parseFloat(
              sessionStorage.Sesion.substr(0, 15)
            )}.png`);

            this.pdfs.getBase64(logo_src).then((logo) => {
              data.logo = logo;
              data.fecha = this.get_date();
              turnos_pos(data).then(() => {
                console.log("Impresion terminada");
                this.paciente = {};
                this.filaturno = [];
                this.form.paciente = "";
                this.dialogo = {};
              });
            });
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al asignar turno",
              estado: true,
            });
          });
      } else {
        this.cargarsubfila(turno);
      }
    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CffilaturnoJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          this.agencia = data[0].agencia_rep;
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Filas",
            estado: true,
          });
        });
    },
    cargarnovedad() {
      this.loader = true;
      post
        .postData({
          url: "Dispensa/dlls/CfNovedadesJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.novedad = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Novedades",
            estado: true,
          });
        });
    },
    cargarsubfila(fila) {
      this.loader = true;
      const codSubfila = fila.cod_rep;
      post
        .postData({
          url: "Dispensa/dlls/CfSubfilaturnoJ.dll",
          data: sessionStorage.Sesion + "|" + codSubfila + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();

          this.subfilas = data.map((el) => ({
            ...el,
            idturno_rep: fila.idturno_rep,
            descripMayor_rep: fila.descrip_rep,
          }));

          this.dialogo = {
            estado: true,
            titulo: "Subfilas",
          };
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Filas",
            estado: true,
          });
        });
    },
    format_novedad: function (val) {
      return `${val.descrip_rep}`;
    },
    guardar_paciente() {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.tipoid) {
        this.errores.tipoid = true;
        this.send_error("Tipo Id Obligatorio!");
      } else if (!data.idpaciente) {
        this.errores.idpaciente = true;
        this.send_error("Id Paciente Obligatorio!");
      } else if (!data.primerApellido) {
        this.errores.primerApellido = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.nombres) {
        this.errores.nombres = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.departamento) {
        this.errores.departamento = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.nacimiento) {
        this.errores.nacimiento = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.regimen) {
        this.errores.regimen = true;
        this.send_error("Campo Obligatorio!");
      } else if (!data.eps) {
        this.errores.eps = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.envio_paciente(data);
      }
    },
    envio_paciente() {
      this.dialogopac.estado = false;
      let segundoApellido = this.form.segundoApellido
        ? this.form.segundoApellido.trim()
        : "";
      let nombre2 = this.form.nombre2 ? this.form.nombre2.trim() : "";

      let eliminar = this.form.eliminar ? 1 : 0,
        nacimiento = this.form.nacimiento.split("-");
      nacimiento = nacimiento[0] + nacimiento[1] + nacimiento[2];
      var datos = {
        url: "Dispensa/dlls/Cfpaciente.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          this.form.idpaciente.trim() +
          "|" +
          this.form.nombres +
          "|" +
          this.form.primerApellido +
          "|" +
          segundoApellido +
          "|" +
          this.form.tipoid.value +
          "|" +
          this.form.direccion +
          "|" +
          this.form.telefono +
          "|" +
          this.form.correo +
          "|" +
          this.form.ciudad +
          "|" +
          this.form.nacimiento.split("-").join("") +
          "|" +
          this.form.estadoCivil.value +
          "|" +
          this.form.regimen.value +
          "|" +
          this.form.eps +
          "|" +
          this.form.genero.value +
          "|" +
          this.form.zona.value +
          "|" +
          this.form.nivel.value +
          "|" +
          "0" +
          "|" +
          "9" +
          "|" +
          "0" +
          "|" +
          "0" +
          "|" +
          nombre2 +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then((data) => {
          this.dialog = false;
          this.$emit("snack", {
            color: "success",
            text: "Paciente Guardado",
            estado: true,
          });
          this.form.paciente = this.form.idpaciente.trim();
        })
        .catch((error) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al guardar paciente",
            estado: true,
          });
        });
    },
    get_municipios() {
      if (this.form.departamento == null) return undefined;
      var registro = [];
      this.ciudades_dian.filter((e) => {
        if (e.codigo == this.form.departamento) {
          e.municipios.forEach((k, v) => {
            registro.push({
              value: k.c_digo_dane_del_municipio,
              text: k.municipio,
            });
          });
          return registro;
        }
      });

      this.filterMunicipios = registro;
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

