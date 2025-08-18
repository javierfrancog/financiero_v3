<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-lock-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Actualizar Autorizaciones</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row>
              <v-col class="d-flex" cols="4">
                <v-text-field
                  outlined
                  label="Autorización"
                  hide-details
                  ref="nroauto_refer"
                  v-model="form.nro_validaauto"
                  @keyup.enter="get_autoriza()"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col class="d-flex" cols="3">
                <v-btn
                  id="validaauto_refer"
                  class="mt-2 white--text"
                  color="indigo"
                  depressed
                  large
                  @click="get_autoriza()"
                  >Consultar</v-btn
                >
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="index"
              :search="search"
               class="mt-3"
            >
              <template v-slot:item.borrar="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                    :disabled="!item.cufe_rep.trim() == ''"

                      @click="anular_item(item)"
                      color="red accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-delete-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar</span>
                </v-tooltip>
              </template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="!item.cufe_rep.trim() == ''"
                      @click="editar_item(item)"
                      color="orange accent-3"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-image-edit-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Actualizar</span>
                </v-tooltip>
              </template>
              <template v-slot:item.factura_rep="{ item }">
                {{ parseInt(item.factura_rep) }}
              </template>

            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-dialog v-model="autorizacion.estado" max-width="1100" persistent>
      <v-card class="text--white pa-2">
        <v-card-title>Registro de Autorizaciones</v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-text-field
                outlined
                label="Autorización Anterior"
                hide-details
                disabled
                ref="nroauto_refer"
                v-model="form.nro_auto"
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-text-field
                outlined
                label="Autorización Actual"
                hide-details
                ref="nroauto_actual"
                v-model="form.nro_actual"
                clearable
                :error="errores.nro_actual"
                @change="errores.nro_actual = false"
              ></v-text-field>
            </v-col>

                        <v-col class="d-flex" cols="3">
              <v-text-field
                outlined
                label="Autorización EPS"
                hide-details
                ref="nroauto_actual"
                v-model="form.autoeps"
                clearable
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" sm="3">
              <v-menu
                v-model="pickeFecha_auto"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.fecha_auto"
                    label="Fecha Autorización"
                    append-icon="event"
                    hide-details
                    outlined
                    :error="errores.fecha_auto"
                    @change="errores.fecha_auto = false"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.fecha_auto"
                  @input="pickeFecha_auto = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Id_Paciente"
                v-model="form.selectPaciente"
                hide-details
                :error="errores.paciente"
                @input="errores.paciente = false"
                @keyup.enter="buscar_paciente(1)"
                @change="errores.paciente = false"
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-start align-center" cols="1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="buscar_paciente(1)"
                    color="indigo accent-3"
                    fab
                    small
                    icon
                    outlined
                    v-on="on"
                    class="mr-3"
                  >
                    <v-icon>mdi-account-search-outline</v-icon>
                  </v-btn>
                </template>
                <span>Buscar Paciente</span>
              </v-tooltip>
            </v-col>
            <!-- <v-col class="d-flex justify-start align-center" cols="1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="crear_paciente()"
                    color="green"
                    fab
                    small
                    icon
                    outlined
                    v-on="on"
                    class="mr-1"
                  >
                    <v-icon>mdi-plus-box-outline</v-icon>
                  </v-btn>
                </template>
                <span>Agregar Paciente</span>
              </v-tooltip>
            </v-col> -->

            <v-col class="d-flex" cols="6">
              <v-text-field
                label="Descripcion Paciente"
                disabled
                v-model="form.descripaciente"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-autocomplete
                label="Contrato Anterior"
                clearable
                :items="selectObjContratos"
                item-value="value"
                hide-details
                return-object
                @change="get_servicios(item, 2)"
                v-model="form.contrato_ant"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-autocomplete
                label="Contrato Actual"
                clearable
                :items="selectObjContratos"
                item-value="value"
                hide-details
                return-object
                @change="get_servicios(item, 2)"
                :error="errores.contrato_act"
                @input="errores.contrato_act = false"
                v-model="form.contrato_act"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Factura"
                v-model="form.factura"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" sm="12">
              <v-autocomplete
                :items="diagnosticos"
                :item-text="format_diagnostico"
                item-value="codigo"
                label="Diagnostico"
                outlined
                clearable
                hide-details
                return-object
                v-model="form.dx_auto"
                :error="errores.diagnostico"
                @change="errores.diagnostico = false"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row class="d-flex mt-4" no-gutters>
            <v-col class="d-flex" sm="12">
              <v-autocomplete
                label="Codigo Paquete para Facturación"
                :items="selectObjEstudios"
                :item-text="format_cups"
                clearable
                return-object
                hint="Si no aplica dejar vacio"
                persistent-hint
                required
                item-value="codigo"
                v-model="form.codpaquete"
              ></v-autocomplete>
            </v-col>

          </v-row>          
          <v-divider class="px-6 mt-4" color="orange"></v-divider>

          <v-row class="px-6 mt-1 justify-center">
                  <span class="subtitle-1">Servicios Autorizados</span>
                </v-row>

          <v-divider class="px-6 mt-4" color="orange"></v-divider>

          <v-row class="d-flex mt-4" no-gutters>
            <v-col class="d-flex" sm="7">
              <v-autocomplete
                label="Servicio"
                :items="selectObjEstudios"
                :item-text="format_cups"
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo"
                v-model="form.servic1_auto"
                @change="errores.servic1_auto = false"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="1"> </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cant. Autorizada"
                v-model="form.cant_auto"
                hide-details
                clearable
                :error="errores.cant_auto"
                @input="errores.cant_auto = false"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Citas Requeridas"
                v-model="form.cantreq_auto"
                hide-details
                clearable
                :error="errores.cantreq_auto"
                @input="errores.cantreq_auto = false"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex mt-4" no-gutters>
            <v-col class="d-flex" sm="7">
              <v-autocomplete
                label="Servicio"
                :items="selectObjEstudios"
                :item-text="format_cups"
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo"
                v-model="form.servic2_auto"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="1"> </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cant. Autorizada"
                v-model="form.cant2_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Citas Requeridas"
                v-model="form.cantreq2_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex mt-4" no-gutters>
            <v-col class="d-flex" sm="7">
              <v-autocomplete
                label="Servicio"
                :items="selectObjEstudios"
                :item-text="format_cups"
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo"
                v-model="form.servic3_auto"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="1"> </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cant. Autorizada"
                v-model="form.cant3_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Citas Requeridas"
                v-model="form.cantreq3_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex mt-4" no-gutters>
            <v-col class="d-flex" sm="7">
              <v-autocomplete
                label="Servicio"
                :items="selectObjEstudios"
                :item-text="format_cups"
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo"
                v-model="form.servic4_auto"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="1"> </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cant. Autorizada"
                v-model="form.cant4_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Citas Requeridas"
                v-model="form.cantreq4_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex mt-4" no-gutters>
            <v-col class="d-flex" sm="7">
              <v-autocomplete
                label="Servicio"
                :items="selectObjEstudios"
                :item-text="format_cups"
                clearable
                return-object
                hint="Busca por código o descripción"
                persistent-hint
                required
                item-value="codigo"
                v-model="form.servic5_auto"
              ></v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="1"> </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Cant. Autorizada"
                v-model="form.cant5_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="2">
              <v-text-field
                label="Citas Requeridas"
                v-model="form.cantreq5_auto"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>



          <v-row>
            <!-- <v-col class="d-flex" cols="4">
              <v-file-input
                label="Cargar Autorización"
                accept=".pdf"
                outlined
                hide-details
                v-model="form.pdf"
                @change="errores.pdf = false"
              ></v-file-input>
            </v-col> -->

            <v-col class="d-flex" cols="6">
              <v-textarea
                label="Observaciones"
                clearable
                outlined
                required
                v-model="form.observ_auto"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />

          <v-col class="d-flex" cols="3">
            <v-btn
              class="mt-2 white--text"
              color="indigo"
              depressed
              :loading="load_guardar"
              large
              @click="grabar_autoriza()"
              >Grabar Autorización</v-btn
            >
          </v-col>
          <v-col class="d-flex" cols="3">
            <v-btn
              class="mt-2 white--text"
              color="red"
              depressed
              large
              @click="autorizacion.estado = false"
              >Cancelar</v-btn
            >
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
export default {
  data() {
    return {
      search: null,
      pickerActual: false,
      pickeFecha_auto: false,
      load_personal: true,
      selectPersonal: null,
      load_table: false,
      autorizacion: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      form: {
        descripaciente: null,
      },
      contenido: [],
      contratos: [],
      diagnosticos: [],
      selectObjEstudios: [],
      selectObjContratos: [],
      item_select: null,
      load_guardar: false,
      errores: {
        paciente: false,
        punto_fact: false,
        tipoid: false,
        nro_actual: false,
        fecha_auto: false,
        idpaciente: false,
        primerApellido: false,
        nombre1: false,
        contrato_act: false,
        tipomotivo: false,
        pdf: false,
        cant_auto: false,
        servic1_auto: false,
        cantreq_auto: false,
      },
      fecha_actual: this.$moment().format("YYYY-MM-DD"),
      headers: [
        { text: "Actualizar", value: "edit", align: "center" },
        { text: "Fecha", align: "left", value: "fecha_rep" },
        { text: "Numero", align: "left", value: "nro_rep" },
        { text: "Entidad", align: "center", value: "descripcion_rep" },
        { text: "Paciente", align: "center", value: "descrpaciente_rep" },
        { text: "Factura", align: "center", value: "factura_rep" },
        { text: "Opciones", value: "borrar", align: "center" },
      ],
    };
  },
  created() {
    this.get_diagnosticos();
    this.cargarContratos();
  },
  computed: {},
  methods: {
    anular_item(item) {
      let nro_auto = item.nro_rep.trim();
      let entidad = item.eps_rep;
      post
        .postData({
          url: "Clinico/dlls/ClAutorizax.dll",
          data: sessionStorage.Sesion + "|" + nro_auto + "|" + entidad + "|",
          method: "",
        })
        .then((data) => {
          this.get_autoriza();
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al eliminar Autorizacion",
            estado: true,
          });
        });
    },
    async editar_item(item) {
      this.form.nro_auto = null;
      this.form.nro_actual = null;
      this.form.fecha_auto = null;
      this.form.selectPaciente = null;
      this.form.descripaciente = null;
      this.form.cant_auto = null;
      this.form.cantreq_auto = null;
      this.form.cant2_auto = null;
      this.form.cantreq2_auto = null;
      this.form.cant3_auto = null;
      this.form.cantreq3_auto = null;
      this.form.cant4_auto = null;
      this.form.cantreq4_auto = null;
      this.form.cant5_auto = null;
      this.form.cantreq5_auto = null;
      this.form.servic1_auto = null;
      this.form.servic2_auto = null;
      this.form.servic3_auto = null;
      this.form.servic4_auto = null;
      this.form.servic5_auto = null;
      this.form.codpaquete = null;
      this.form.contrato_ant = null;
      this.form.contrato_act = null;
      this.form.dx_auto = null;
      this.form.autoeps = null;

      this.item_select = item;

      this.autorizacion.estado = true;
      this.form.nro_auto = item.nro_rep.trim();
      this.form.nro_actual = item.nro_rep.trim();
      this.form.autoeps = item.autoeps_rep.trim();
      this.form.fecha_auto = item.fecha_rep;
      this.form.selectPaciente = parseFloat(item.idpaciente_rep);
      this.form.descripaciente = item.descrpaciente_rep;
      this.form.cant_auto = parseFloat(item.cantauto_rep);
      this.form.cantreq_auto = parseFloat(item.cantcitas_rep);
      this.form.factura = item.factura_rep;

      this.form.cant2_auto = parseFloat(item.cantauto2_rep);
      this.form.cantreq2_auto = parseFloat(item.cantcitas2_rep);
      this.form.cant3_auto = parseFloat(item.cantauto3_rep);
      this.form.cantreq3_auto = parseFloat(item.cantcitas3_rep);
      this.form.cant4_auto = parseFloat(item.cantauto4_rep);
      this.form.cantreq4_auto = parseFloat(item.cantcitas4_rep);
      this.form.cant5_auto = parseFloat(item.cantauto5_rep);
      this.form.cantreq5_auto = parseFloat(item.cantcitas5_rep);


      let busqueda_select = this.diagnosticos.find(
        (el) => el.codigo.trim() == item.dx_rep.trim()
      );
      this.form.dx_auto = busqueda_select;
      const resultado = await this.get_servicios(item, 1);
    },
    async get_servicios(item, tipo) {
      let contrato = null;
      if (tipo == 1) {
        contrato = item.contrato_rep;
      } else {
        contrato = this.form.contrato_act.value;
      }

      var datosEnvio = sessionStorage.Sesion + "|" + contrato + "|";
      let urlconsulta = "Clinico/dlls/titcl304j.dll";

      try {
        const data = await post.postData({
          url: urlconsulta,
          data: datosEnvio,
          method: "",
        });
        this.selectObjEstudios = data[0].servicios;
        if (tipo == 1) {
          let busqueda_select = this.selectObjEstudios.find(
            (el) => el.codigo.trim() == item.cups_rep.trim()
          );
          this.form.servic1_auto = busqueda_select;

          busqueda_select = this.selectObjEstudios.find(
            (el) => el.codigo.trim() == item.cups2_rep.trim()
          );
          this.form.servic2_auto = busqueda_select;

          busqueda_select = this.selectObjEstudios.find(
            (el) => el.codigo.trim() == item.cups3_rep.trim()
          );
          this.form.servic3_auto = busqueda_select;

          busqueda_select = this.selectObjEstudios.find(
            (el) => el.codigo.trim() == item.cups4_rep.trim()
          );
          this.form.servic4_auto = busqueda_select;

          busqueda_select = this.selectObjEstudios.find(
            (el) => el.codigo.trim() == item.cups5_rep.trim()
          );
          this.form.servic5_auto = busqueda_select;

          busqueda_select = this.selectObjEstudios.find(
            (el) => el.codigo.trim() == item.paquete_rep.trim()
          );
          this.form.codpaquete = busqueda_select;



          busqueda_select = this.selectObjContratos.find(
            (el) => parseFloat(el.value) == parseFloat(item.contrato_rep)
          );
          this.form.contrato_ant = busqueda_select;
          this.form.contrato_act = busqueda_select;
        }
      } catch (err) {
        this.load_contrato = false;
        this.$emit("snack", {
          color: "error",
          text: "Error al cargar servicios",
          estado: true,
        });
      }
    },
    cargarContratos() {
      post
        .postData({
          url: "Clinico/dlls/titcl304jl.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.contratos = data;
          this.contratos.forEach((k, v) => {
            this.selectObjContratos.push({
              value: k.nro,
              text: parseInt(k.nro) + "-" + k.detalle,
              id_entidad: parseInt(k.identificacion),
            });
          });
          this.load_contrato = false;
          // this.cargarPacientes();
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
    async get_autoriza() {
      let nro_auto = this.form.nro_validaauto.trim();
      this.item_select = null;
      post
        .postData({
          url: "Clinico/dlls/ClAutoriza02J.dll",
          data: sessionStorage.Sesion + "|" + nro_auto + "|",
          method: "",
        })
        .then((data) => {
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar Autorizacion",
            estado: true,
          });
        });
    },
    async grabar_autoriza() {
      if (!this.form.nro_actual) {
        this.errores.nro_actual = true;
        this.send_error("Debe indicar un numero de autorizacion!");
      } else if (!this.form.fecha_auto) {
        this.errores.fecha_auto = true;
        this.send_error("Debe indicar una fecha de la autorizacion!");
      } else if (!this.form.selectPaciente) {
        this.errores.paciente = true;
        this.send_error("Debe indicar una identificacion de paciente!");
      } else if (!this.form.cant_auto) {
        this.errores.cant_auto = true;
        this.send_error("Debe indicar cantidad del servicio!");
      } else if (!this.form.cantreq_auto) {
        this.errores.cantreq_auto = true;
        this.send_error("Debe indicar cantidad citas requeridas!");
      } else if (!this.form.contrato_act) {
        this.errores.contrato_act = true;
        this.send_error("Debe seleccionar un contrato!");
      } else if (!this.form.dx_auto) {
        this.errores.diagnostico = true;
        this.send_error("Debe indicar un diagnostico!");
      } else if (!this.form.servic1_auto) {
        this.errores.servic1_auto = true;
        this.send_error("Debe indicar codigo del servicio!");
      } else {
        let nro_auto = this.form.nro_auto;
        let id_cliente = this.item_select.eps_rep;
        // await this.subir_pdf(id_cliente, nro_auto);
        await this.guardar_autorizacion(id_cliente, nro_auto);
      }
    },
    async guardar_autorizacion(id_cliente, nro_auto) {
      let nro_actual = this.form.nro_actual;
      let nroauto_eps = this.form.autoeps? this.form.autoeps.trim() : "";
      let fecha = this.form.fecha_auto.replace(/\-/g, "");
      let id_paciente = this.form.selectPaciente;
      let dx = this.form.dx_auto.codigo.trim();
      let servicio = this.form.servic1_auto.codigo.trim();
      let cantidad = this.form.cant_auto;
      let cant_citas = this.form.cantreq_auto;
      let factura = this.form.factura;

      let servicio2 = this.form.servic2_auto
        ? this.form.servic2_auto.codigo.trim()
        : "";
      let cantidad2 = this.form.cant2_auto;
      let cant_citas2 = this.form.cantreq2_auto;

      let servicio3 = this.form.servic3_auto
        ? this.form.servic3_auto.codigo.trim()
        : "";
      let cantidad3 = this.form.cant3_auto;
      let cant_citas3 = this.form.cantreq3_auto;

      let servicio4 = this.form.servic4_auto
        ? this.form.servic4_auto.codigo.trim()
        : "";
      let cantidad4 = this.form.cant4_auto;
      let cant_citas4 = this.form.cantreq4_auto;

      let servicio5 = this.form.servic5_auto
        ? this.form.servic5_auto.codigo.trim()
        : "";
      let cantidad5 = this.form.cant5_auto;
      let cant_citas5 = this.form.cantreq5_auto;

      let cod_paquete = this.form.codpaquete
        ? this.form.codpaquete.codigo.trim()
        : "";

      let contrato = this.form.contrato_ant.value;
      let contr_act = this.form.contrato_act.value;
      let idcontr_act = this.form.contrato_act.id_entidad;

      let observacion = this.form.observ_auto;
      observacion = this.form.observ_auto
        ? observacion.replace(/(\r\n|\n|\r)/gm, "")
        : "";
      let textob64 = window.btoa(unescape(encodeURIComponent(observacion)));
      this.card_estado = true;
      post
        .postData({
          url: "Clinico/dlls/PrAutorizaM.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            nro_auto +
            "|" +
            nro_actual +
            "|" +
            id_cliente +
            "|" +
            fecha +
            "|" +
            id_paciente +
            "|" +
            servicio +
            "|" +
            dx +
            "|" +
            cantidad +
            "|" +
            cant_citas +
            "|" +
            contrato +
            "|" +
            contr_act +
            "|" +
            idcontr_act +
            "|" +
            servicio2 +
            "|" +
            cantidad2 +
            "|" +
            cant_citas2 +
            "|" +
            servicio3 +
            "|" +
            cantidad3 +
            "|" +
            cant_citas3 +
            "|" +
            textob64 +
            "|" +
            factura +
            "|" +
            servicio4 +
            "|" +
            cantidad4 +
            "|" +
            cant_citas4 +
            "|" +
            servicio5 +
            "|" +
            cantidad5 +
            "|" +
            cant_citas5 +
            "|" +
            cod_paquete + 
            "|" +
            nroauto_eps +             
            "|",
          method: "",
        })
        .then((data) => {
          this.get_autoriza();
          this.autorizacion.estado = false;
          this.$emit("snack", {
            color: "success",
            text: "Autorización modificada",
            estado: true,
          });
        })
        .catch((err) => {
          this.card_estado = false;
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al consultar Autorizacion",
            estado: true,
          });
        });
    },
    get_diagnosticos() {
      var $this = this;
      post
        .postData({
          url: "datos/base/CIE10.json",
          data: sessionStorage.Sesion + "|",
          method: "GET",
        })
        .then((data) => {
          $this.diagnosticos = data.cie10;
        })
        .catch((err) => {
          $this.$emit("snack", {
            color: "error",
            text: "Error al cargar diagnosticos",
            estado: true,
          });
        });
    },
    format_diagnostico(val) {
      return val.codigo + " - " + val.descripcion;
    },
    format_cups(val) {
      return val.codigo.trim() + " - " + val.descripcion.trim();
    },
    buscar_paciente(tipo) {
      this.descripaciente = null;
      let paciente = this.form.selectPaciente;
      post
        .postData({
          url: "clinico/dlls/PrCl101J.dll",
          data: sessionStorage.Sesion + "|" + paciente + "|",
          method: "POST",
        })
        .then((data) => {
          this.form.descripaciente = data[0].descrip_rep.trim();
        })
        .catch((err) => {
          console.log(err);
          this.card_estado = false;
          this.$emit("snack", {
            color: "warning",
            text: err.Mensaje[0].msg,
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
