<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-human-handsup</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Usuarios</v-list-item-title
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
                <v-icon right dark class="ml-4"
                  >mdi-map-marker-plus-outline</v-icon
                >
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
              class="elevation-1"
            >
              <template v-slot:item.estadocolabora_rep="{ item }">{{
                item.estadocolabora_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="editar_item(item)"
                      color="green"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-invoice-text-edit-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="bloqueo_item(item)"
                      color="orange"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-account-cancel-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Bloquear</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="cerrar_item(item)"
                      color="red"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Cerrar Sesión</span>
                </v-tooltip>


              </template>

              <template v-slot:item.estado_rep="{ item }">
                {{ item.estado_rep === "1" ? "Bloquedo" : "Activo" }}
              </template>

              <template v-slot:item.idusuario_rep="{ item }">
                {{ parseInt(item.idusuario_rep) }}
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
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Basico</v-tab>
            <v-tab>Módulos</v-tab>
            <v-tab>Agencias</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="7">
                    <v-autocomplete
                      label="Colaborador"
                      v-model="form.colabora"
                      :items="ruts3"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                      @change="errores.colabora = false"
                      :error="errores.colabora"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="10" sm="5">
                    <v-autocomplete
                      label="Agencia Principal"
                      v-model="form.punto_fact"
                      :items="agencias"
                      :item-text="format_punto_fact"
                      item-value="codigo_agc"
                      hide-details
                      outlined
                      autocomplete="off"
                      return-object
                      @change="errores.punto_fact = false"
                      :error="errores.punto_fact"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="3" sm="4">
                    <v-text-field
                      label="Contraseña"
                      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show2 ? 'text' : 'password'"
                      outlined
                      required
                      v-model="form.contrasena"
                      @click:append="show2 = !show2"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="8">
                    <v-autocomplete
                      label="Perfil"
                      v-model="form.perfil"
                      :items="perfil"
                      :item-text="format_perfil"
                      item-value="id_perfil"
                      hide-details
                      return-object
                      outlined
                      @change="errores.perfil = false"
                      :error="errores.perfil"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      label="Centro de costos"
                      v-model="form.ccosto"
                      :items="tablaccosto"
                      :item-text="format_ccosto"
                      item-value="llavecentro_cost"
                      hide-details
                      return-object
                      outlined
                      :error="errores.ccosto"
                      @change="errores.ccosto = false"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      label="Ubicacion Inventarios"
                      v-model="form.ubicacion"
                      :items="tablaubica"
                      :item-text="format_ubicacion"
                      item-value="codigo_ubic"
                      hide-details
                      return-object
                      outlined
                      :error="errores.ubica"
                      @change="errores.ubica = false"
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Id_Externo"
                      clearable
                      outlined
                      required
                      hide-details
                      v-model="form.idexterno"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex">
                  <v-col
                    class="d-flex"
                    cols="12"
                    sm="4"
                    v-if="empresa.financ_empr"
                  >
                    <v-switch
                      v-model="form.financ"
                      label="Financiero"
                    ></v-switch>
                  </v-col>

                  <v-col
                    class="d-flex"
                    cols="12"
                    sm="4"
                    v-if="empresa.mercancias_empr"
                  >
                    <v-switch
                      v-model="form.mercancias"
                      label="Mercancias"
                    ></v-switch>
                  </v-col>
                  <v-col
                    class="d-flex"
                    cols="12"
                    sm="4"
                    v-if="empresa.gth_empr"
                  >
                    <v-switch
                      v-model="form.gth"
                      label="Gestión Talento Humano"
                    ></v-switch>
                  </v-col>
                  <v-col
                    class="d-flex"
                    cols="12"
                    sm="4"
                    v-if="empresa.transporte_empr"
                  >
                    <v-switch
                      v-model="form.transp"
                      label="Transp_Intermunicipal"
                    ></v-switch>
                  </v-col>

                  <v-col
                    class="d-flex"
                    cols="12"
                    sm="4"
                    v-if="empresa.cajarec_empr"
                  >
                    <v-switch
                      v-model="form.cajarec"
                      label="Recaudos"
                    ></v-switch>
                  </v-col>

                  <v-col
                    class="d-flex"
                    cols="12"
                    sm="4"
                    v-if="empresa.molino_empr"
                  >
                    <v-switch
                      v-model="form.molino"
                      label="Molineria"
                    ></v-switch>
                  </v-col>

                  <v-col
                    class="d-flex"
                    cols="12"
                    sm="4"
                    v-if="empresa.hclinica_empr"
                  >
                    <v-switch
                      v-model="form.hclinica"
                      label="H.Clinica"
                    ></v-switch>
                  </v-col>

                  <v-col
                    class="d-flex"
                    cols="12"
                    sm="4"
                    v-if="empresa.dispensa_empr"
                  >
                    <v-switch
                      v-model="form.dispensa"
                      label="Dispensación"
                    ></v-switch>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="4" v-if="empresa.rx_empr">
                    <v-switch v-model="form.rx" label="Imagenología"></v-switch>
                  </v-col>

                  <v-col
                    class="d-flex"
                    cols="12"
                    sm="4"
                    v-if="empresa.ssalud_empr"
                  >
                    <v-switch
                      v-model="form.ssalud"
                      label="Serv.Salud"
                    ></v-switch>
                  </v-col>

                  <v-col
                    class="d-flex"
                    cols="12"
                    sm="4"
                    v-if="empresa.servdm_empr"
                  >
                    <v-switch
                      v-model="form.servdm"
                      label="Serv.Domiciliarios"
                    ></v-switch>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch
                      v-model="form.tabadmon"
                      label="Tablero Admon"
                    ></v-switch>
                  </v-col>

                  <v-col
                    class="d-flex"
                    cols="12"
                    sm="4"
                    v-if="empresa.asociados_empr"
                  >
                    <v-switch
                      v-model="form.asociados"
                      label="Asociados"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Agencia 2"
                      v-model="form.punto_fact2"
                      :items="agencias"
                      :item-text="format_punto_fact"
                      item-value="codigo_agc"
                      hide-details
                      outlined
                      autocomplete="off"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Agencia 3"
                      v-model="form.punto_fact3"
                      :items="agencias"
                      :item-text="format_punto_fact"
                      item-value="codigo_agc"
                      hide-details
                      outlined
                      autocomplete="off"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Agencia 4"
                      v-model="form.punto_fact4"
                      :items="agencias"
                      :item-text="format_punto_fact"
                      item-value="codigo_agc"
                      hide-details
                      outlined
                      autocomplete="off"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Agencia 5"
                      v-model="form.punto_fact5"
                      :items="agencias"
                      :item-text="format_punto_fact"
                      item-value="codigo_agc"
                      hide-details
                      outlined
                      autocomplete="off"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Agencia 6"
                      v-model="form.punto_fact6"
                      :items="agencias"
                      :item-text="format_punto_fact"
                      item-value="codigo_agc"
                      hide-details
                      outlined
                      autocomplete="off"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Agencia 7"
                      v-model="form.punto_fact7"
                      :items="agencias"
                      :item-text="format_punto_fact"
                      item-value="codigo_agc"
                      hide-details
                      outlined
                      autocomplete="off"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Agencia 8"
                      v-model="form.punto_fact8"
                      :items="agencias"
                      :item-text="format_punto_fact"
                      item-value="codigo_agc"
                      hide-details
                      outlined
                      autocomplete="off"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Agencia 9"
                      v-model="form.punto_fact9"
                      :items="agencias"
                      :item-text="format_punto_fact"
                      item-value="codigo_agc"
                      hide-details
                      outlined
                      autocomplete="off"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Agencia 10"
                      v-model="form.punto_fact10"
                      :items="agencias"
                      :item-text="format_punto_fact"
                      item-value="codigo_agc"
                      hide-details
                      outlined
                      autocomplete="off"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider color="succes"></v-divider>

          <v-row justify="center">
            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.estado" label="Bloquear"></v-switch>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
              <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
            </v-col>
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
            class="ma-2 px-4 white--text"
            color="indigo"
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
      show2: false,
      loader: false,
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      error: {
        rut: false,
      },

      dialog: true,
      valid: false,
      pickerFechaRet: false,
      pickerFechaIng: false,
      singleExpand: true,
      expanded: [],
      agencias: [],
      rutsadmon: [],
      contenido: [],
      empresa: {},
      ruts3: [],
      ruts4: [],
      perfil: [],
      tablaccosto: [],
      tablaubica: [],

      search: "",
      form: {
        listado_devengos: [],
      },
      headers: [
        { text: "Opciones", value: "edit", align: "center" },

        { text: "", value: "data-table-expand" },
        { text: "Id", align: "left", value: "idusuario_rep" },
        {
          text: "Primer Apellido",
          align: "left",
          value: "Apellido1_rep",
        },
        {
          text: "Segundo Apellido",
          align: "left",
          value: "Apellido2_rep",
        },
        { text: "Nombres", align: "left", value: "nombres_rep" },

        { text: "Perfil", align: "center", value: "descperfil_rep" },
        { text: "Agencia", align: "center", value: "Descragencia_rep" },

        { text: "Estado", align: "center", value: "estado_rep" },
      ],
      errores: {
        codigo: false,
        ccosto: false,
        colabora: false,
        cargo: false,
        descripcion: false,
        estado: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      tab: 0,
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },

      money: {
        decimal: ".",
        thousands: ",",
        precision: 3,
        masked: false,
      },
    };
  },
  created() {
    this.cargar_empresa();
    this.cargarcontenido();
    this.cargarTablaAg();
    this.get_ccostos();
    this.cargarTablaubica();
    this.get_ruts3();
    this.get_perfil();
  },
  computed: {},
  methods: {
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));

      this.show2 = false;
      var busqueda = this.ruts3.find(
        (el) => el.identificacion_rut == item.idusuario_rep
      );
      this.form.idexterno = item.iderp_rep.trim();

      this.form.colabora = busqueda || null;

      var busqperfil = this.perfil.find(
        (el) => parseInt(el.cod_rep) == parseInt(item.perfilm_rep)
      );
      this.form.perfil = busqperfil || null;

      var busqccosto = this.tablaccosto.find(
        (el) => parseInt(el.llavecentro_cost) == parseInt(item.ccosto1_rep)
      );
      this.form.ccosto = busqccosto || null;

      var busqubica = this.tablaubica.find(
        (el) => parseInt(el.codigo_ubic) == parseInt(item.ubicacion_rep)
      );
      this.form.ubicacion = busqubica || null;

      var busqagencia = this.agencias.find(
        (el) => el.codigo_agc == item.agencia_rep
      );
      this.form.punto_fact = busqagencia || null;

      var busqagencia2 = this.agencias.find(
        (el) => el.codigo_agc == item.agencia2_rep
      );
      this.form.punto_fact2 = busqagencia2 || null;

      var busqagencia3 = this.agencias.find(
        (el) => el.codigo_agc == item.agencia3_rep
      );
      this.form.punto_fact3 = busqagencia3 || null;

      var busqagencia4 = this.agencias.find(
        (el) => el.codigo_agc == item.agencia4_rep
      );
      this.form.punto_fact4 = busqagencia4 || null;

      var busqagencia5 = this.agencias.find(
        (el) => el.codigo_agc == item.agencia5_rep
      );
      this.form.punto_fact5 = busqagencia5 || null;

      var busqagencia6 = this.agencias.find(
        (el) => el.codigo_agc == item.agencia6_rep
      );
      this.form.punto_fact6 = busqagencia6 || null;

      var busqagencia7 = this.agencias.find(
        (el) => el.codigo_agc == item.agencia7_rep
      );
      this.form.punto_fact7 = busqagencia7 || null;

      var busqagencia8 = this.agencias.find(
        (el) => el.codigo_agc == item.agencia8_rep
      );
      this.form.punto_fact8 = busqagencia8 || null;

      var busqagencia9 = this.agencias.find(
        (el) => el.codigo_agc == item.agencia9_rep
      );
      this.form.punto_fact9 = busqagencia9 || null;

      var busqagencia10 = this.agencias.find(
        (el) => el.codigo_agc == item.agencia10_rep
      );
      this.form.punto_fact10 = busqagencia10 || null;

      this.form.financ = parseInt(item.financ_rep);
      this.form.contrasena = item.ps_rep.trim();
      this.form.mercancias = parseInt(item.mercanc_rep);
      this.form.gth = parseInt(item.gth_rep);
      this.form.rx = parseInt(item.rx_rep);
      this.form.cajarec = parseInt(item.recaudo_rep);
      this.form.molino = parseInt(item.mol_rep);
      this.form.hclinica = parseInt(item.hcli_rep);
      this.form.ssalud = parseInt(item.ssalud_rep);
      this.form.servdm = parseInt(item.servdm_rep);
      this.form.transp = parseInt(item.transp_rep);
      this.form.hclinica = parseInt(item.hclinica_rep);
      this.form.dispensa = parseInt(item.dispensa_rep);
      this.form.asociados = parseInt(item.asociados_rep);

      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },
    format_ccosto: function (val) {
      return `${val.centro_cost + val.subcentro_cost} - ${val.descrip_cost}`;
    },

    get_ccostos: function () {
      post
        .postData({
          url: "Financiero/dlls/CfcostosJ.dll",
          data: sessionStorage.Sesion + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.tablaccosto = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Centro Costos");
        });
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      this.format_envio(data);
    },
    format_envio(data) {
      this.card_estado = true;
      var colabora = data.colabora ? data.colabora.identificacion_rut : "0";
      var contrasena = data.contrasena;
      var financ = this.form.financ ? 1 : 0;
      var mercancias = this.form.mercancias ? 1 : 0;
      var gth = this.form.gth ? 1 : 0;
      var rx = this.form.rx ? 1 : 0;
      var tabadmon = this.form.tabadmon ? 1 : 0;
      var servdm = this.form.servdm ? 1 : 0;
      var recaudos = this.form.cajarec ? 1 : 0;
      var molino = this.form.molino ? 1 : 0;
      var hclinica = this.form.hclinica ? 1 : 0;
      var dispensa = this.form.dispensa ? 1 : 0;
      var ssalud = this.form.ssalud ? 1 : 0;
      var transporte = this.form.transp ? 1 : 0;
      var asociados = this.form.asociados ? 1 : 0;

      var perfil = this.form.perfil.cod_rep;
      var agencia = this.form.punto_fact.codigo_agc;
      var agencia2 = this.form.punto_fact2
        ? this.form.punto_fact2.codigo_agc
        : 0;
      var agencia3 = this.form.punto_fact3
        ? this.form.punto_fact3.codigo_agc
        : 0;
      var agencia4 = this.form.punto_fact4
        ? this.form.punto_fact4.codigo_agc
        : 0;
      var agencia5 = this.form.punto_fact5
        ? this.form.punto_fact5.codigo_agc
        : 0;
      var agencia6 = this.form.punto_fact6
        ? this.form.punto_fact6.codigo_agc
        : 0;
      var agencia7 = this.form.punto_fact7
        ? this.form.punto_fact7.codigo_agc
        : 0;
      var agencia8 = this.form.punto_fact8
        ? this.form.punto_fact8.codigo_agc
        : 0;
      var agencia9 = this.form.punto_fact9
        ? this.form.punto_fact9.codigo_agc
        : 0;
      var agencia10 = this.form.punto_fact10
        ? this.form.punto_fact10.codigo_agc
        : 0;

      var eliminar = this.form.eliminar ? 1 : 0;
      var estado = this.form.estado ? 1 : 0;
      var ccosto = this.form.ccosto
        ? this.form.ccosto.llavecentro_cost
        : "0000";
      var ubicacion = this.form.ubicacion
        ? this.form.ubicacion.codigo_ubic
        : "0000";
      var idexterno = this.form.idexterno ? this.form.idexterno : "";

      let datos = {
        url: "Financiero/dlls/Usuarios2.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          colabora +
          "|" +
          contrasena +
          "|" +
          financ +
          "|" +
          mercancias +
          "|" +
          gth +
          "|" +
          rx +
          "|" +
          tabadmon +
          "|" +
          servdm +
          "|" +
          recaudos +
          "|" +
          molino +
          "|" +
          perfil +
          "|" +
          agencia +
          "|" +
          transporte +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          idexterno +
          "|" +
          hclinica +
          "|" +
          ssalud +
          "|" +
          dispensa +
          "|" +
          ccosto +
          "|" +
          agencia2 +
          "|" +
          agencia3 +
          "|" +
          agencia4 +
          "|" +
          agencia5 +
          "|" +
          agencia6 +
          "|" +
          agencia7 +
          "|" +
          agencia8 +
          "|" +
          agencia9 +
          "|" +
          agencia10 +
          "|" +
          ubicacion +
          "|" +
          asociados +
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
      this.init_form();
      this.form.estado = 0;
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        eliminar: false,
      };
    },
    bloqueo_item(item) {
      let colabora = item.idusuario_rep;
      post
        .postData({
          url: "Financiero/dlls/PrusuarioB.dll",
          data: sessionStorage.Sesion + "|" + colabora + "|",
          method: "",
        })
        .then((data) => {
          this.cargarcontenido()
          this.$emit("snack", {
            color: "success",
            text: "Usuario procesado correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          console.log(err);
          this.loader.facturas = false;
          this.send_error("Error al cargar creditos pendientes");
        });

      console.log(item);
    },
    cerrar_item(item) {
      let colabora = item.idusuario_rep;
      post
        .postData({
          url: "Financiero/dlls/PrusuarioC.dll",
          data: sessionStorage.Sesion + "|" + colabora + "|",
          method: "",
        })
        .then((data) => {
          this.cargarcontenido()
          this.$emit("snack", {
            color: "success",
            text: "Usuario procesado correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          console.log(err);
          this.loader.facturas = false;
          this.send_error("Error al cargar creditos pendientes");
        });

      console.log(item);
    },
    cargarTablaAg: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfagenciasj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          var filtro = data.filter((el) => el.estado_agc == "0");
          this.agencias = filtro;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Agencias",
            estado: true,
          });
        });
    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfUsuarios2J.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Colaboradores",
            estado: true,
          });
        });
    },
    format_ruts(val) {
      return `${parseInt(val.identificacion_rut) || 0} - ${
        val.descripcion_rut ? val.descripcion_rut.trim() : ""
      }`;
    },

    format_perfil(val) {
      return `${val.cod_rep || 0} - ${
        val.descrip_rep ? val.descrip_rep.trim() : ""
      }`;
    },
    get_perfil() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfPerfilJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          data.pop();
          this.perfil = data;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar perfiles",
            estado: true,
          });
        });
    },

    get_ruts3() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 3 + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.ruts3 = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Ruts3",
            estado: true,
          });
        });
    },

    get_ruts4() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 4 + "|",
          method: "",
        })
        .then((data) => {
          this.ruts4 = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Administradoras",
            estado: true,
          });
        });
    },

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
    cargarTablaubica: function () {
      post
        .postData({
          url: "Financiero/dlls/CfUbicacionesJ.dll",
          data: sessionStorage.Sesion + "|" + 1 + "|",
          method: "",
        })
        .then((data) => {
          this.tablaubica = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar ubicaciones",
            estado: true,
          });
        });
    },
    format_ubicacion: function (val) {
      return `${val.descrip_ubic}`;
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
