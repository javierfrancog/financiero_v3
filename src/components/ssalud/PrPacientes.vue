<template>
  <v-card class="pa-0" elevation="2">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Registro de Pacientes</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('cerrar')" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form @submit.prevent="guardarPaciente" ref="form">
        <v-container>
          <v-row>
            <v-col class="d-flex" cols="12" sm="4">
              <v-select
                :error="errores.pac_tipoid"
                :items="[
                  { text: 'Cedula Ciudadania', value: 'CC' },
                  { text: 'Tarjeta Identidad', value: 'TI' },
                  { text: 'Registro Civil', value: 'RC' },
                  { text: 'Permiso Esp.Permanencia', value: 'PE' },
                  { text: 'Cedula Extranjería', value: 'CE' },
                  { text: 'Adulto Sin Identificar', value: 'AS' },
                  { text: 'Menor Sin Identificar', value: 'MS' },
                  { text: 'Certificado Nacido Vivo', value: 'NV' },
                  { text: 'Pasaporte', value: 'PA' },
                  { text: 'Carnet Diplomatico', value: 'CD' },
                  { text: 'Salvo Conducto', value: 'SC' },
                  { text: 'Permiso por Proteccion Temporal', value: 'PT' },
                ]"
                @change="errores.pac_tipoid = false"
                clearable
                hide-details
                item-text="text"
                item-value="value"
                label="Tipo identificacion"
                ref="pac_tipoid"
                required
                v-model="form.pac_tipoid"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="2">
              <v-text-field
                :error="errores.pac_identificacion"
                @change="errores.pac_identificacion = false"
                clearable
                counter="15"
                label="Identificacion"
                ref="pac_identificacion"
                required
                type="text"
                v-model="form.pac_identificacion"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                :error="errores.pac_apellido1"
                @change="errores.pac_apellido1 = false"
                clearable
                label="1er apellido"
                ref="pac_apellido1"
                required
                v-model="form.pac_apellido1"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                clearable
                label="2do apellido"
                v-model="form.pac_apellido2"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                :error="errores.pac_nombre1"
                @change="errores.pac_nombre1 = false"
                clearable
                label="Primer Nombre"
                ref="pac_nombre1"
                required
                v-model="form.pac_nombre1"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                clearable
                label="Segundo Nombre"
                required
                v-model="form.pac_nombre2"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                :error="errores.pac_telefono1"
                @change="errores.pac_telefono1 = false"
                clearable
                counter="10"
                label="Telefono"
                ref="pac_telefono1"
                type="number"
                v-model="form.pac_telefono1"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                :error="errores.pac_telefono2"
                @change="errores.pac_telefono2 = false"
                clearable
                counter="10"
                label="Telefono 2"
                ref="pac_telefono2"
                type="number"
                v-model="form.pac_telefono2"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-text-field
                :error="errores.pac_email"
                @change="errores.pac_email = false"
                clearable
                label="Correo"
                ref="pac_email"
                v-model="form.pac_email"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="6">
              <v-text-field
                :error="errores.pac_direccion"
                @change="errores.pac_direccion = false"
                clearable
                label="Direccion"
                ref="pac_direccion"
                required
                v-model="form.pac_direccion"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-autocomplete
                :error="errores.pac_departamento"
                :items="departamentos"
                @change="get_Municipios(), (errores.pac_departamento = false)"
                item-value="value"
                label="Departamento"
                ref="pac_departamento"
                v-model="form.pac_departamento"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-autocomplete
                :error="errores.pac_municipio"
                :items="filterMunicipios"
                @change="errores.pac_municipio = false"
                item-value="value"
                label="Ciudad"
                ref="pac_municipio"
                v-model="form.pac_municipio"
              ></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-menu
                :close-on-content-click="false"
                min-width="290px"
                offset-y
                required
                transition="scale-transition"
                v-model="pickerNacimiento"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :error="errores.pac_fechaNacimiento"
                    @change="errores.pac_fechaNacimiento = false"
                    append-icon="event"
                    label="Fecha de nacimiento"
                    ref="pac_fechaNacimiento"
                    v-model="form.pac_fechaNacimiento"
                    v-on="on"
                    v-bind="attrs"
                  ></v-text-field>
                </template>
                <v-date-picker
                  @change="calcularEdad()"
                  @input="pickerNacimiento = false"
                  v-model="form.pac_fechaNacimiento"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                disabled
                label="Edad"
                type="text"
                v-model="form.pac_edad"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :error="errores.pac_estadoCivil"
                :items="[
                  { text: 'Soltero', value: 2 },
                  { text: 'Casado', value: 1 },
                  { text: 'Union libre', value: 3 },
                  { text: 'Viudez', value: 5 },
                ]"
                @change="errores.pac_estadoCivil = false"
                clearable
                hide-details
                item-text="text"
                item-value="value"
                label="Estado civil"
                ref="pac_estadoCivil"
                required
                v-model="form.pac_estadoCivil"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :error="errores.pac_regimen"
                :items="[
                  { text: 'Subsidiado', value: 1 },
                  { text: 'Contributivo', value: 8 },
                  { text: 'Particular', value: 2 },
                  { text: 'Especial', value: 3 },
                  { text: 'Excepción', value: 4 },
                  { text: 'Plan Complementario', value: 5 },
                  { text: 'Otro', value: 9 },
                ]"
                @change="errores.pac_regimen = false"
                clearable
                hide-details
                item-text="text"
                item-value="value"
                label="Regimen"
                ref="pac_regimen"
                required
                v-model="form.pac_regimen"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-select
                :error="errores.pac_tipousuario"
                :items="[
                  { text: 'Contributivo cotizante', value: 1 },
                  { text: 'Contributivo beneficiario', value: 2 },
                  { text: 'Contributivo adicional', value: 3 },
                  { text: 'Subsidiado', value: 4 },
                  { text: 'No afiliado', value: 5 },
                  { text: 'Especial o Excepcion cotizante', value: 6 },
                  { text: 'Especial o Excepcion beneficiario', value: 7 },
                  {
                    text: 'Personas privadas de la libertad a cargo del Fondo Nacional de Salud',
                    value: 8,
                  },
                  { text: 'Tomador / Amparado ARL', value: 9 },
                  { text: 'Tomador / Amparado SOAT', value: 10 },
                  {
                    text: 'Tomador / Amparado Planes  voluntarios de salud',
                    value: 11,
                  },
                  { text: 'Particular', value: 12 },
                  {
                    text: 'Especial o Exepcion no cotizante Ley 352 de 1997',
                    value: 13,
                  },
                ]"
                @change="errores.pac_tipousuario = false"
                clearable
                hide-details
                item-text="text"
                item-value="value"
                label="Tipo Usuario"
                ref="pac_tipousuario"
                required
                v-model="form.pac_tipousuario"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-autocomplete
                :error="errores.pac_eps"
                :items="eps"
                :label="label_Eps"
                @change="errores.pac_eps = false"
                item-value="value"
                ref="pac_eps"
                required
                v-model="form.pac_eps"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :error="errores.pac_genero"
                :items="[
                  { text: 'Masculino', value: 2 },
                  { text: 'Femenino', value: 1 },
                ]"
                @change="errores.pac_genero = false"
                clearable
                hide-details
                item-text="text"
                item-value="value"
                label="Genero"
                ref="pac_genero"
                required
                v-model="form.pac_genero"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :error="errores.pac_zona"
                :items="[
                  { text: 'Urbana', value: 2 },
                  { text: 'Rural', value: 1 },
                ]"
                @change="errores.pac_zona = false"
                clearable
                hide-details
                item-text="text"
                item-value="value"
                label="Zona"
                ref="pac_zona"
                required
                v-model="form.pac_zona"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :error="errores.pac_nivel"
                :items="[
                  { text: 'Nivel 1', value: 1 },
                  { text: 'Nivel 2', value: 2 },
                  { text: 'Nivel 3', value: 3 },
                ]"
                @change="errores.pac_nivel = false"
                clearable
                hide-details
                item-text="text"
                item-value="value"
                label="Nivel"
                ref="pac_nivel"
                required
                v-model="form.pac_nivel"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                clearable
                label="Contraseña"
                required
                v-model="form.pac_contrasena"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                append-icon="event"
                disabled
                label="Fecha de activacion"
                v-model="form.pac_factivacion"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :error="errores.pac_estado"
                :items="[
                  { text: 'Activo', value: 9 },
                  { text: 'InacActivo', value: 1 },
                ]"
                @change="errores.pac_estado = false"
                clearable
                hide-details
                item-text="text"
                item-value="value"
                label="Estado"
                outlined
                ref="pac_estado"
                required
                v-model="form.pac_estado"
              ></v-select>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-switch label="Eliminar" v-model="form.eliminar"></v-switch>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn @click="ValidarPaciente()" color="primary">Guardar</v-btn>
      <v-btn @click="$emit('cerrar')" color="grey">Cerrar</v-btn>
    </v-card-actions>
    <v-snackbar
      :color="snackbar.color"
      timeout="3000"
      v-model="snackbar.estado"
    >
      {{ snackbar.texto }}
    </v-snackbar>
  </v-card>
</template>

<script>
import post from "../../methods.js";
export default {
  name: "PrPacientes",
  props: {
    datapaciente: {
      type: Object,
      default: () => ({
        pac_tipoid: "",
        pac_identificacion: "",
        pac_apellido1: "",
        pac_apellido2: "",
        pac_nombre1: "",
        pac_nombre2: "",
        pac_telefono1: "",
        pac_telefono2: "",
        pac_email: "",
        pac_direccion: "",
        pac_departamento: "",
        pac_municipio: "",
        pac_fechaNacimiento: "",
        pac_edad: "",
        pac_estadoCivil: "",
        pac_regimen: "",
        pac_tipousuario: "",
        pac_eps: "",
        pac_genero: "",
        pac_zona: "",
        pac_nivel: "",
        pac_contrasena: "",
        pac_factivacion: "",
        pac_estado: "",
      }),
    },
  },
  data() {
    return {
      info_paciente: { ...this.datapaciente },
      label_Eps: "EPS",
      form: {
        ...this.datapaciente,
        eliminar: false,
      },
      errores: {
        pac_tipoid: false,
        pac_identificacion: false,
        pac_nombre1: false,
        pac_apellido1: false,
        pac_direccion: false,
        pac_departamento: false,
        pac_municipio: false,
        pac_fechaNacimiento: false,
        pac_estadoCivil: false,
        pac_regimen: false,
        pac_tipousuario: false,
        pac_eps: false,
        pac_genero: false,
        pac_zona: false,
        pac_nivel: false,
        pac_telefono1: false,
        pac_telefono2: false,
        pac_email: false,
      },
      pickerNacimiento: false,
      pickerActivacion: false,
      ciudades_dian: [],
      departamentos: [],
      filterMunicipios: [],
      eps: [],
      snackbar: {
        estado: false,
        texto: "",
        color: "",
      },
      rules: {
        requerido: (v) =>
          (v && (typeof v === "string" || v.value)) || "Campo obligatorio",
      },
    };
  },
  created() {
    this.get_cuidades_dian();
    // this.get_Municipios();

    if (this.form.pac_genero == 0) {
      this.form.pac_genero = 2;
    }
    if (this.form.pac_zona == 0) {
      this.form.pac_zona = 2;
    }
  },
  computed: {
    // filterMunicipios() {
    //   if (this.datapaciente.pac_departamento == null) return undefined;
    //   var registro = [];
    //   this.ciudades_dian.filter((e) => {
    //     if (e.codigo == this.datapaciente.pac_departamento) {
    //       e.municipios.forEach((k) => {
    //         registro.push({
    //           value: k.c_digo_dane_del_municipio,
    //           text: k.municipio,
    //         });
    //       });
    //     }
    //   });
    //   return registro;
    // },
  },
  methods: {
    get_cuidades_dian() {
      post
        .postData({
          url: "Datos/BASE/CIUDADES_DIAN.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          this.ciudades_dian = data.departamentos;
          this.ciudades_dian.forEach((k) => {
            this.departamentos.push({
              value: k.codigo,
              text: k.departamento,
            });
          });
          this.cargarEps();
          if (this.datapaciente.pac_municipio) {
            this.calcularEdad();
            this.get_Municipios();
          } else {
            this.filterMunicipios = [];
          }
        })
        .catch(() => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ciudades",
            estado: true,
          });
        });
    },

    get_Municipios() {
      if (!this.form.pac_departamento) return undefined;

      let registro = [];

      this.ciudades_dian.forEach((e) => {
        if (String(e.codigo) === String(this.form.pac_departamento)) {
          e.municipios.forEach((k) => {
            registro.push({
              value: k.c_digo_dane_del_municipio,
              text: k.municipio,
            });
          });
        }
      });
      this.filterMunicipios = registro;
    },
    ValidarPaciente() {
      let send_color = "warning";

      if (!this.form.pac_tipoid) {
        this.errores.pac_tipoid = true;
        this.send_error("Seleccione Tipo de Documento!", send_color);
      } else if (!this.form.pac_identificacion) {
        this.errores.pac_identificacion = true;
        this.send_error("Registre un numero de Documento!", send_color);
      } else if (!this.form.pac_apellido1) {
        this.errores.pac_apellido1 = true;
        this.send_error("Registre el primer Apellido!", send_color);
      } else if (!this.form.pac_nombre1) {
        this.errores.pac_nombre1 = true;
        this.send_error("Registre el primer Nombre!", send_color);
      } else if (!this.form.pac_telefono1) {
        this.errores.pac_telefono1 = true;
        this.send_error("Registre el primer Teléfono!", send_color);
      } else if (!this.form.pac_telefono2) {
        this.errores.pac_telefono2 = true;
        this.send_error("Registre el segundo Teléfono!", send_color);
      } else if (!this.form.pac_email) {
        this.errores.pac_email = true;
        this.send_error("Registre el correo electrónico!", send_color);
      } else if (!this.form.pac_direccion) {
        this.errores.pac_direccion = true;
        this.send_error("Registre la dirección!", send_color);
      } else if (!this.form.pac_departamento) {
        this.errores.pac_departamento = true;
        this.send_error("Seleccione el Departamento!", send_color);
      } else if (!this.form.pac_municipio) {
        this.errores.pac_municipio = true;
        this.send_error("Seleccione la ciudad!", send_color);
      } else if (!this.form.pac_fechaNacimiento) {
        this.errores.pac_fechaNacimiento = true;
        this.send_error("Seleccione la fecha de Nacimiento!", send_color);
      } else if (!this.form.pac_estadoCivil) {
        this.errores.pac_estadoCivil = true;
        this.send_error("Seleccione el Estado civil!", send_color);
      } else if (!this.form.pac_regimen) {
        this.errores.pac_regimen = true;
        this.send_error("Seleccione el Régimen!", send_color);
      } else if (!this.form.pac_tipousuario) {
        this.errores.pac_tipousuario = true;
        this.send_error("Seleccione el Tipo Usuario!", send_color);
      } else if (!this.form.pac_eps) {
        this.errores.pac_eps = true;
        this.send_error("Seleccione la Entidad!", send_color);
      } else if (!this.form.pac_genero) {
        this.errores.pac_genero = true;
        this.send_error("Seleccione el Género!", send_color);
      } else if (!this.form.pac_zona) {
        this.errores.pac_zona = true;
        this.send_error("Seleccione la Zona!", send_color);
      } else if (!this.form.pac_nivel) {
        this.errores.pac_nivel = true;
        this.send_error("Seleccione el Nivel!", send_color);
      } else if (!this.form.pac_estado) {
        this.errores.pac_estado = true;
        this.send_error("Seleccione el Estado!", send_color);
      } else {
        this.guardarPaciente();
      }
    },
    guardarPaciente() {
      let eliminar = this.form.eliminar ? 1 : 0;
      let send_color = "success";
      if (this.form.pac_genero == 2) {
        this.form.pac_genero = 0;
      }
      if (this.form.pac_zona == 2) {
        this.form.pac_zona = 0;
      }

      var datos = {
        url: "Clinico/dlls/titcl301.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          this.form.pac_identificacion +
          "|" +
          this.form.pac_nombre1.trim() +
          "|" +
          this.form.pac_apellido1.trim() +
          "|" +
          this.form.pac_apellido2 +
          "|" +
          this.form.pac_tipoid +
          "|" +
          this.form.pac_direccion.trim() +
          "|" +
          this.form.pac_telefono1 +
          "|" +
          this.form.pac_email.trim() +
          "|" +
          this.form.pac_municipio +
          "|" +
          this.form.pac_fechaNacimiento.split("-").join("") +
          "|" +
          this.form.pac_estadoCivil +
          "|" +
          this.form.pac_regimen +
          "|" +
          this.form.pac_eps +
          "|" +
          this.form.pac_genero +
          "|" +
          this.form.pac_zona +
          "|" +
          this.form.pac_nivel +
          "|" +
          this.form.pac_contrasena +
          "|" +
          this.form.pac_estado +
          "|" +
          0 +
          "|" +
          eliminar +
          "|" +
          this.form.pac_nombre2 +
          "|" +
          this.form.pac_telefono2 +
          "|" +
          this.form.pac_tipousuario +
          "|",
        method: "",
      };
      post
        .postData(datos)
        .then(() => {
          this.send_error("Paciente Actualizado", send_color);
          setTimeout(() => {
            this.$emit("cerrar");
          }, 500);
        })
        .catch(() => {
          send_color = "error";
          this.send_error("Error al guardar paciente", send_color);
        });
    },
    send_error(msj, color) {
      this.snackbar = {
        estado: true,
        texto: msj,
        color: "warning",
      };
    },
    cargarEps() {
      let empresa = sessionStorage.Sesion.substr(0, 15);
      if (empresa == 900108793) {
        this.label_Eps = "Convenio";
      }
      post
        .postData({
          url: "Datos/BASE/eps.json",
          data: "",
          method: "GET",
        })
        .then((data) => {
          data.eps.forEach((k) => {
            this.eps.push({
              value: k.codigo,
              text: k.nombre,
            });
          });
        })
        .catch(() => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar eps's",
            estado: true,
          });
        });
    },
    calcularEdad() {
      if (this.form.pac_fechaNacimiento) {
        const fechaNacimiento = new Date(this.form.pac_fechaNacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        if (
          mes < 0 ||
          (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())
        ) {
          edad--;
        }
        this.form.pac_edad = edad;
      } else {
        this.form.pac_edad = "";
      }
    },
  },
};
</script>