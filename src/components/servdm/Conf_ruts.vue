<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="13"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-group-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Ruts</v-list-item-title
              >
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
              :items="clientes"
              item-key="identificacion"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              :search="search"
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr>
                        <th>Correo</th>
                        <th>Direcion</th>
                        <th>Ciudad</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.correo }}</td>
                        <td>{{ item.direccion }}</td>
                        <td>{{ item.ciudad }}</td>
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </template>

              <template v-slot:item.relacion_rut="{ item }">
                {{ format_relacion(item.relacion_rut.trim()).text }}
              </template>

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
    <v-dialog v-model="dialogo.estado" persistent max-width="950px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Nit', value: 31 },
                  { text: 'Cedula', value: 13 },
                  { text: 'T.Identidad', value: 12 },                  

                ]"
                label="Tipo identificacion"
                outlined
                clearable
                v-model="form.tipoid"
                required
                :error="errores.tipoid"
                @change="
                  errores.tipoid = false;
                  form.rsocial = null;
                  form.apellido1 = null;
                  form.apellido2 = null;
                  form.nombres = null;
                "
                hide-details
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Numero Identificación"
                clearable
                outlined
                type="number"
                required
                v-model="form.numero"
                :error="errores.numero"
                @input="errores.numero = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-text-field
                label="Dígito Verificador"
                clearable
                outlined
                type="text"
                required
                v-model="form.dv"
                :error="errores.dv"
                @input="errores.dv = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex align-center justify-center">
              <v-btn
                color="light-blue accent-4 white--text"
                class
                @click="calculardv()"
                depressed
              >
                <v-icon size="25" left>mdi-autorenew</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row
            v-if="
              form.tipoid ? form.tipoid.value == 31 || form.tipoid == 31 : false
            "
          >
            <v-col class="d-flex" cols="12" sm="12">
              <v-text-field
                label="Razón Social"
                clearable
                outlined
                required
                v-model="form.rsocial"
                :error="errores.rsocial"
                @input="errores.rsocial = false"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row
            v-if="
              form.tipoid ? form.tipoid.value == 12 || form.tipoid == 12 || form.tipoid.value == 13 || form.tipoid == 13: false
            "
          >
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Primer Apellido"
                clearable
                outlined
                required
                v-model="form.apellido1"
                :error="errores.apellido1"
                @input="
                  errores.apellido1 = false;
                  form.apellido1 = form.apellido1.toUpperCase();
                "
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Segundo Apellido"
                clearable
                outlined
                v-model="form.apellido2"
                @input="
                  errores.apellido2 = false;
                  form.apellido2 = form.apellido2.toUpperCase();
                "
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Nombres"
                clearable
                outlined
                required
                v-model="form.nombres"
                :error="errores.nombres"
                @input="
                  errores.nombres = false;
                  form.nombres = form.nombres.toUpperCase();
                "
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-text-field
                label="Direccion"
                clearable
                outlined
                required
                v-model="form.direccion"
                :error="errores.direccion"
                @input="errores.direccion = false"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-autocomplete
                label="Departamento"
                v-model="form.departamento"
                :items="departamentos"
                item-value="value"
                outlined
                :error="errores.departamento"
                @change="
                  errores.departamento = false;
                  get_municipios();
                "
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="3">
              <v-autocomplete
                label="Ciudad"
                v-model="form.ciudad"
                :items="filterMunicipios"
                item-value="value"
                outlined
                :error="errores.ciudad"
                @change="errores.ciudad = false"
                hide-details
                browser-autocomplete="new-password"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row class="d-flex justify-center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Teléfono"
                clearable
                outlined
                type="number"
                v-model="form.telefono"
                :error="errores.telefono"
                @input="errores.telefono = false"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="5">
              <v-text-field
                label="Correo"
                clearable
                outlined
                v-model="form.correo"
                type="email"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="px-6 mt-5">
            <span class="subtitle-1">Información de contacto</span>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="16" sm="5">
              <v-text-field
                label="Nombre Contacto"
                clearable
                outlined
                v-model="form.contacto"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                label="Telefono Contacto"
                clearable
                outlined
                type="number"
                v-model="form.telecontacto"
                counter="10"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Estudiante', value: 5 },
                  { text: 'Acudiente', value: 6 },
                ]"
                label="Relación"
                outlined
                clearable
                hide-details
                v-model="form.relacion"
                @change="cambio_relacion"
                required
              ></v-select>
            </v-col>
          </v-row>

          <v-row class="d-flex justify-center">
            <v-col class="d-flex" cols="12" sm="3">
              <v-select
                :items="[
                  { text: 'Activo', value: 0 },
                  { text: 'Desactivado', value: 1 },
                ]"
                label="Estado"
                outlined
                clearable
                hide-details
                v-model="form.estado"
                item-text="text"
                item-value="value"
                required
              ></v-select>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-text-field
                v-model="form.activacion"
                label="Fecha de activacion"
                append-icon="event"
                outlined
                hide-details
                disabled
              ></v-text-field>
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
      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,
      dialogPicker: false,
      singleExpand: true,
      expanded: [],
      clientes: [],
      listas: [],
      asesor: [],
      tipoid: null,
      eps: [],
      search: "",
      vendedores: [],
      ciudades_dian: [],
      departamentos: [],
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Tipo Id", align: "center", value: "tipoid_rut" },
        {
          text: "Identificacion",
          align: "center",
          sortable: false,
          value: "identificacion_rut",
        },
        { text: "Descripcion", align: "left", value: "descripcion_rut" },
        { text: "Telefono", align: "center", value: "telefono_rut" },
        { text: "Relación", align: "rigth", value: "relacion_rut" },

        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        tipoid: false,
        numero: false,
        dv: false,
        rsocial: false,
        apellido1: false,
        apellido2: false,
        nombres: false,
        direccion: false,
        departamento: false,
        ciudad: false,
        telefono: false,
        correo: false,
        contacto: false,
        telecontacto: false,
        relacion: false,
        plazo: false,
        asesor: false,
        listas: false,
        estado: false,
      },
      card_estado: false,
      filterMunicipios: [],
      mostrar_cliente: false,
    };
  },
  created() {
    // this.agregar_item();
    this.cargarRuts();
    this.cargarCiudades();
    this.cargarTablaasesor();
    this.cargarTablaenclistas();
    this.$watch(
      "form.departamento",
      (e) => {
        this.get_municipios();
      },
      { deep: true }
    );
  },
  computed: {},
  methods: {
    cambio_relacion() {
      if (this.form.relacion && this.form.relacion == 1)
        this.mostrar_cliente = true;
      else this.mostrar_cliente = false;
    },
    format_relacion(relacion_rut) {
      var retornar = {};
      // O se puede usar un swich case

      switch (relacion_rut) {
        case "05":
          retornar.text = "Estudiante";
          break;
        case "06":
          retornar.text = "Acudiente";
          break;
      }
      return retornar;
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
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar RUT";
      this.dialogo.tipo = 1;

      this.form.tipoid = parseInt(item.tipoid_rut);
      this.form.dv = item.dv_rut.trim() || "";
      this.form.numero = item.identificacion_rut;
      this.form.apellido1 = item.primerApellido_rut;
      this.form.apellido2 = item.segundoApellido_rut;
      this.form.nombres = item.nombres_rut;
      this.form.rsocial = item.descripcion_rut;
      this.form.direccion = item.direccion_rut;
      this.form.departamento = item.ciudad_rut.substring(0, 2);
      this.form.ciudad = item.ciudad_rut.trim() || null;
      this.form.telefono = item.telefono_rut;
      this.form.correo = item.correo_rut.trim() || null;
      this.form.contacto = item.nombrecontac_rut.trim() || null;
      console.log(parseInt(item.relacion_rut));
      this.form.relacion = parseInt(item.relacion_rut);
      this.form.listas = item.listpr_rut;
      this.form.asesor =
        parseInt(item.asesor_rut) != 0 ? item.asesor_rut : null;
      this.form.telecontacto = item.telecontacto_rut;
      this.form.plazo = item.plazo_rut;
      this.form.estado = parseInt(item.estado_rut);
      this.form.activacion = this.$moment(item.fechaAct_rut).format(
        "YYYY-MM-DD"
      );

      this.get_municipios();
      console.log("Form", this.form);
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.tipoid) {
        this.errores.tipoid = true;
        this.send_error("Debe seleccionar un tipo de identificación");
      } else if (!data.numero) {
        this.errores.numero = true;
        this.send_error("Debe ingresar un número de identificación");
      } else if (!data.dv && data.dv != 0) {
        this.errores.dv = true;
        this.send_error("Debe ingresar el Digito de Verificación");
      } else if (data.tipoid == 31 && !data.rsocial) {
        this.errores.rsocial = true;
        this.send_error("Debe ingresar una razón social");
      } else if (data.tipoid == 13 && !data.apellido1) {
        this.errores.apellido1 = true;
        this.send_error("Debe ingresar el primer apellido");
      } else if (data.tipoid == 13 && !data.nombres) {
        this.errores.nombres = true;
        this.send_error("Debe ingresar los nombres");
      } else if (!data.direccion) {
        this.errores.direccion = true;
        this.send_error("Debe ingresar una dirección");
      } else if (!data.departamento) {
        this.errores.departamento = true;
        this.send_error("Debe seleccionar un departamento");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Debe seleccionar una ciudad");
      } else if (!data.telefono) {
        this.errores.telefono = true;
        this.send_error("Debe ingresar un teléfono");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {
      this.card_estado = true;
      var identificacion = data.numero;
      var digitoVerificacion = data.dv || "";
      var tipoId = data.tipoid;
      var rsocial = data.rsocial || "";
      var apellido1 = data.apellido1 || "";
      var apellido2 = data.apellido2 || "";
      var nombres = data.nombres || "";
      var direccion = data.direccion;
      var ciudad = data.ciudad;
      var telefono = data.telefono;
      var correo = data.correo || "";
      var contacto = data.contacto || "";
      var telecontacto = data.telecontacto || "";
      var relacion = data.relacion || "0";
      var estado = data.estado;
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Colegios/dlls/Cfruts.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          identificacion +
          "|" +
          digitoVerificacion +
          "|" +
          tipoId +
          "|" +
          rsocial +
          "|" +
          apellido1.trim() +
          "|" +
          apellido2.trim() +
          "|" +
          nombres.trim() +
          "|" +
          direccion.trim() +
          "|" +
          ciudad +
          "|" +
          telefono +
          "|" +
          correo.trim() +
          "|" +
          contacto.trim() +
          "|" +
          telecontacto +
          "|" +
          relacion +
          "|" +
          estado +
          "|" +
          eliminar +
          "|",
        method: "",
      };
      console.log(datos.data);
      post
        .postData(datos)
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Rut guardado correctamente",
            estado: true,
          });

          this.card_estado = false;
          this.dialogo.estado = false;
          this.init_form();
          this.cargarRuts();
        })
        .catch((error) => {
          this.card_estado = false;
          console.log("Error grabando rut: ", error);
          this.send_error("Error al grabar rut");
        });
    },
    agregar_item() {
      this.init_form();
      this.form.estado = 0;
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo RUT";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        tipoid: null,
        numero: null,
        dv: null,
        rsocial: null,
        apellido1: null,
        apellido2: null,
        nombres: null,
        direccion: null,
        departamento: null,
        ciudad: null,
        telefono: null,
        correo: null,
        contacto: null,
        telecontacto: null,
        relacion: null,
        plazo: null,
        asesor: null,
        listas: null,
        estado: null,
        activacion: this.$moment().format("YYYY-MM-DD"),
        eliminar: false,
      };

      this.errores = {
        tipoid: false,
        numero: false,
        dv: false,
        rsocial: false,
        apellido1: false,
        apellido2: false,
        nombres: false,
        direccion: false,
        departamento: false,
        ciudad: false,
        telefono: false,
        correo: false,
        contacto: false,
        telecontacto: false,
        relacion: false,
        plazo: false,
        asesor: false,
        listas: false,
        estado: false,
      };
    },
    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
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
    cargarRuts() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.clientes = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ruts",
            estado: true,
          });
        });
    },
    send_error(msj) {
      console.error("Error", msj);
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    calculardv() {
      var arreglo, x, y, documentoElementos, i, documento, dv1;
      documento = this.form.numero;
      if (!documento) {
        alert("Debe escribir el número de Identificación sin puntos.");
      } else {
        arreglo = [];
        x = 0;
        y = 0;
        documentoElementos = documento.length;
        arreglo[1] = 3;
        arreglo[2] = 7;
        arreglo[3] = 13;
        arreglo[4] = 17;
        arreglo[5] = 19;
        arreglo[6] = 23;
        arreglo[7] = 29;
        arreglo[8] = 37;
        arreglo[9] = 41;
        arreglo[10] = 43;
        arreglo[11] = 47;
        arreglo[12] = 53;
        arreglo[13] = 59;
        arreglo[14] = 67;
        arreglo[15] = 71;
        for (i = 0; i < documentoElementos; i++) {
          y = documento.substr(i, 1);
          x += y * arreglo[documentoElementos - i];
        }
        y = x % 11;
        if (y > 1) {
          dv1 = 11 - y;
        } else {
          dv1 = y;
        }
        var copia = JSON.parse(JSON.stringify(this.form));
        copia.dv = parseInt(dv1);
        this.form = null;
        this.form = JSON.parse(JSON.stringify(copia));
      }
    },
  },
};
</script>
