f<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-hospital-building</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Servicios y Procedimientos ss</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end">
              <v-btn
                color="indigo"
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
              <v-btn
                large
                depressed
                color="green darken-2"
                class="ma-2 white--text"
                @click="imprimir_excel"
              >
                Imprimir EXCEL
                <v-icon right dark>mdi-file-excel-box</v-icon>
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
              item-key="identificacion_cups"
              :single-expand="singleExpand"
              :search="search"
              class="elevation-1 mytable"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <table>
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ descripcionEstado(item.estado) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
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
    <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Basico</v-tab>
            <v-tab>Rips</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat class="mt-3">
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="4" sm="4">
                    <v-text-field
                      label="Codigo"
                      clearable
                      outlined
                      type="text"
                      required
                      counter="4"
                      v-model="form.codigo"
                      :error="errores.codigo"
                      @input="errores.codigo = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="8" sm="8">
                    <v-text-field
                      label="Descripción"
                      clearable
                      outlined
                      required
                      v-model="form.descripcion"
                      :error="errores.descripcion"
                      @input="errores.descripcion = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="Cod.Soat"
                      clearable
                      outlined
                      required
                      v-model="form.codsoat"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="Vlr Soat"
                      clearable
                      outlined
                      required
                      v-model="form.vsoat"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="Cod.Iss"
                      clearable
                      outlined
                      required
                      v-model="form.codiss"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="Vlr Iss"
                      clearable
                      outlined
                      required
                      v-model="form.viss"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1">
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="Edad Min (Años)"
                      clearable
                      outlined
                      required
                      v-model="form.edad"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="[
                        { text: 'Femenino', value: 1 },
                        { text: 'Masculino', value: 2 },
                        { text: 'Todos', value: 3 },
                      ]"
                      label="Genero"
                      outlined
                      clearable
                      hide-details
                      v-model="form.genero"
                      item-text="text"
                      item-value="value"
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="6" sm="6">
                    <v-autocomplete
                      label="Cuenta Ventas"
                      v-model="form.ctavta"
                      :items="cuentas"
                      :item-text="format_cuentas"
                      item-value="cod_puc"
                      return-object
                      outlined
                      hide-details
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mb-1">
                  <v-col class="d-flex" cols="8" sm="4">
                    <v-select
                      :items="categorias"
                      label="Categoria"
                      outlined
                      clearable
                      return-object
                      hide-details
                      :item-text="format_categorias"
                      v-model="form.categorias"
                      required
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="8" sm="4">
                    <v-select
                      :items="subcategorias"
                      label="Sub_Categoria"
                      outlined
                      clearable
                      return-object
                      hide-details
                      :item-text="format_subcategorias"
                      v-model="form.subcategorias"
                      required
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="8" sm="4">
                    <v-select
                      :items="clasif256"
                      label="Clasificacion Res.256"
                      outlined
                      clearable
                      return-object
                      hide-details
                      v-model="form.clasif256"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mb-1">
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Cod.Equiv.Rips"
                      clearable
                      outlined
                      required
                      v-model="form.cod_rips"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat class="mt-3">
                <v-row justify="center" class="mt-4">
                  <td colspan="2" class="text-right">Resolucion 2275</td>
                </v-row>
                <v-divider class="mt-4" color="orange"></v-divider>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="5">
                    <v-select
                      :items="modalidades"
                      label="Modalidad Atención"
                      outlined
                      clearable
                      return-object
                      hide-details
                      v-model="form.modalidad"
                      required
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="7">
                    <v-select
                      :items="agrpserv"
                      label="Grupo de Servicio"
                      outlined
                      clearable
                      return-object
                      hide-details
                      v-model="form.agrpserv"
                      @change="get_servicio(0, 0, 1)"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mr-1">
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      :items="servicios"
                      :item-text="format_servicios"
                      label="Servicio"
                      outlined
                      clearable
                      return-object
                      hide-details
                      v-model="form.servicio"
                      required
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-1 ml-1 mb-1 mr-1">
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      label="Finalidad (Opcional cuando no hay Historia Clínica)"
                      v-model="form.finalidad"
                      :items="items_finalidad"
                      outlined
                      hide-details
                      return-object
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row class="mt-1 ml-1 mb-1 mr-1">
                  <v-col class="d-flex" cols="12">
                    <v-autocomplete
                      label="Motivo Atención (Opcional cuando no hay Historia Clínica)"
                      v-model="form.motivo"
                      :items="items_motivos"
                      outlined
                      hide-details
                      return-object
                    ></v-autocomplete>
                  </v-col>
                </v-row>

                <v-row justify="center" class="mt-4">
                  <td colspan="2" class="text-right">Resolucion 3374</td>
                </v-row>
                <v-divider class="mt-4" color="orange"></v-divider>
                <v-row class="mt-1 ml-1 mr-1 mb-1">
                  <v-col class="d-flex" cols="8" sm="4">
                    <v-select
                      :items="clasifserv"
                      label="Clasificación Res.3374"
                      outlined
                      clearable
                      return-object
                      hide-details
                      v-model="form.clasifserv"
                      required
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="8">
                    <v-select
                      :items="tiposerv"
                      label="Tipo Servicio"
                      outlined
                      clearable
                      return-object
                      hide-details
                      v-model="form.tiposerv"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

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
      dialog: true,
      valid: false,
      dialogPicker: false,
      dialogPickerfin: false,
      singleExpand: true,
      expanded: [],
      contenido: [],
      categorias: [],
      subcategorias: [],
      cuentas: [],
      tab: 0,

      clasif256: [
        { text: "Primera Vez Medicina General", value: 1 },
        { text: "Primera Vez Odontologia General", value: 2 },
        { text: "Primera Vez Medicina Interna", value: 3 },
        { text: "Primera Vez Pediatria", value: 4 },
        { text: "Primera Vez Ginecologia", value: 5 },
        { text: "Primera Vez Obstetricia", value: 6 },
        { text: "Primera Vez Cirugia General", value: 7 },
        { text: "Primera Vez Ecografias", value: 8 },
        { text: "Primera Vez Resonancia Magnetica", value: 9 },
      ],
      items_motivos: [
        { text: "Enfermedad General", value: 38 },
        { text: "Enfermedad Laboral", value: 39 },

        { text: "Accidente de Trabajo", value: 21 },
        { text: "Accidente en el hogar", value: 22 },
        { text: "Accidente de tránsito común", value: 23 },
        { text: "Accidente de tránsito laboral", value: 24 },
        { text: "Accidente en entorno educativo", value: 25 },
        { text: "Otro tipo de accidente", value: 26 },
        { text: "Evento Catastrofico", value: 27 },
        { text: "Lesion por agresion", value: 28 },
        { text: "Lesion Autoinfringida", value: 29 },
        { text: "Sospecha Violencia fisica", value: 30 },
        { text: "Sospecha De Violencia Psicologica", value: 31 },
        { text: "Sospecha De Violencia Sexual", value: 32 },
        { text: "Sospecha De Negligencia Y Abandono", value: 33 },
        {
          text: "Ive Relacionado Con Peligro A La Salud O  Vida De La Mujer",
          value: 34,
        },
        {
          text: "Ive Por Malformacion Congenita  Incompatible Con La Vida",
          value: 35,
        },
        {
          text: "Ive Por Violencia Sexual, Incesto O Por Inseminacion Artificial O  Transferencia De Ovulo Fecundado No Consentida",
          value: 36,
        },
        { text: "Evento Adverso En Salud", value: 37 },
        {
          text: "Promocion Y Mantenimiento De La Salud ? Intervenciones Individuales",
          value: 40,
        },
        { text: "Intervencion Colectiva", value: 41 },
        { text: "Atencion De Poblacion Materno Perinatal", value: 42 },
        { text: "Riesgo Ambiental", value: 43 },
        { text: "Otros Eventos Catastroficos", value: 44 },
        { text: "Accidente De Mina Antipersonal ? Map", value: 45 },
        {
          text: "Accidente De Artefacto Explosivo Improvisado ? Aei",
          value: 46,
        },
        { text: "Accidente De Municion Sin Explotar- Muse", value: 47 },
        { text: "Otra Victima De Conflicto Armado Colombiano", value: 48 },
        {
          text: "Ive Por Decision O Manifestacion De Voluntad De La Persona Gestante Hasta La Semana 24 De Gestacion",
          value: 49,
        },
      ],
      items_finalidad: [
        {
          text: "Valoracion Integral Para La Promocion Y Mantenimiento",
          value: "11",
        },
        { text: "Deteccion Temprana De Enfermedad General -12-", value: "12" },
        { text: "Deteccion Temprana De Enfermedad Laboral -13-", value: "13" },
        { text: "Proteccion Especifica -14-", value: "14" },
        { text: "Diagnostico -15-", value: "15" },
        { text: "Tratamiento -16-", value: "16" },
        { text: "Rehabilitacion", value: "17" },
        { text: "Paliacion -18-", value: "18" },
        { text: "Planificacion Familiar Y Anticoncepcion -19-", value: "19" },
        { text: "Promocion Y Apoyo A La Lactancia Materna -20-", value: "20" },
        { text: "Atencion Basica De Orientacion Familiar -21-", value: "21" },
        { text: "Atencion Para El Cuidado Preconcepcional -22-", value: "22" },
        { text: "Atencion Para El Cuidado Prenatal -23-", value: "23" },
        { text: "Interrupcion Voluntaria Del Embarazo -24-", value: "24" },
        { text: "Atencion Del Parto Y Puerperio -25-", value: "25" },
        {
          text: "Atencion Para El Cuidado Del Recien Nacido -26-",
          value: "26",
        },
        {
          text: "Atencion Para El Seguimiento Del Recien Nacido -27-",
          value: "27",
        },
        {
          text: "Preparacion Para La Maternidad Y La Paternidad -28-",
          value: "28",
        },
        { text: "Promocion De Actividad Fisica -29-", value: "29" },
        { text: "Promocion De La Cesacion Del Tabaquismo -30-", value: "30" },
        {
          text: "Prevencion Del Consumo De Sustancias Psicoactivas -31-",
          value: "31",
        },
        { text: "Promocion De La Alimentacion Saludable -32-", value: "32" },
        {
          text: "Promocion Para El Ejercicio De Los Derechos Sexuales Y Derechos Reproductivos -33-",
          value: "33",
        },
        {
          text: "Promocion Para El Desarrollo De Habilidades Para La Vida -34-",
          value: "34",
        },
        {
          text: "Promocion Para La Construccion De Estrategias De Afrontamiento Frente A  Sucesos Vitales -35-",
          value: "35",
        },
        {
          text: "Promocion De La Sana Convivencia Y El Tejido  Social -36-",
          value: "36",
        },
        {
          text: "Promocion De Un Ambiente Seguro Y De Cuidado Y Proteccion Del Ambiente -37-",
          value: "37",
        },
        {
          text: "Promocion Del Empoderamiento Para El Ejercicio Del Derecho A La Salud -38-",
          value: "38",
        },
        {
          text: "Promocion Para La Adopcion De Practicas De Crianza Y Cuidado Para La Salud -39-",
          value: "39",
        },
        {
          text: "Promocion De La Capacidad De La Agencia Y Cuidado De La Salud -40-",
          value: "40",
        },
        { text: "Desarrollo De Habilidades Cognitivas -41-", value: "41" },
        { text: "Intervencion Colectiva -42-", value: "42" },
        {
          text: "Modificacion De La Estetica Corporal Fines Esteticos -43-",
          value: "43",
        },
        { text: "Otra", value: "44" },
      ],
      clasifserv: [
        { text: "Consultas-AC-", value: 1 },
        { text: "Medicamentos-AM-", value: 2 },
        { text: "Procedimientos-AP-", value: 3 },

        { text: "Otros Servicios-AT", value: 99 },
      ],
      modalidades: [
        { text: "Intramural", value: 1 },
        { text: "Extramural unidad movil", value: 2 },
        { text: "Extraural domiciliaria", value: 3 },
        { text: "Extraural Jornada de Salud", value: 4 },
        { text: "Telemedicina Interactiva", value: 6 },
        { text: "Telemedicina No Interactiva", value: 7 },
        { text: "Telemedicina Telexperticia", value: 8 },
        { text: "Telemedicina Telemonitoreo", value: 9 },
      ],

      tiposerv: [
        { text: "Dispositivos Médicos e Insumos", value: 1 },
        { text: "Traslados", value: 2 },
        { text: "Estancias", value: 3 },
        { text: "Servicios complementarios", value: 4 },
        { text: "Honorarios", value: 5 },
        // { text: "No aplica", value: 0 },
      ],

      agrpserv_3374: [
        { text: "Consultas", value: 1 },
        { text: "Procedimientos de Diagnosticos", value: 2 },
        { text: "Procedimientos Terapeuticos No Quirurgicos", value: 3 },
        { text: "Procedimientos Terapeuticos Quirurgicos", value: 4 },
        { text: "Procedimientos de PyP", value: 5 },
        { text: "Estancias", value: 6 },
        { text: "Honorarios", value: 7 },
        { text: "Derechos de Sala", value: 8 },
        { text: "Materiales e Insumos", value: 9 },
        { text: "Banco de Sangre", value: 10 },
        { text: "Prótesis y órtesis", value: 11 },
        { text: "Medicamentos Pos", value: 12 },
        { text: "Medicamentos No Pos", value: 13 },
        { text: "Traslado de pacientes", value: 14 },
      ],

      agrpserv: [
        { text: "Consulta externa", value: 21 },
        { text: "Apoyo diagnóstico y complementación terapéutica", value: 22 },
        { text: "Internación", value: 23 },
        { text: "Quirúrgico", value: 24 },
        { text: "Atención inmediata", value: 25 },
      ],

      servicios: [],

      search: "",
      form: {},
      headers: [
        {
          text: "Opciones",
          value: "edit",
          align: "center",
          class: "section-header",
        },

        {
          text: "Codigo",
          align: "center",
          value: "identificacion_cups",
          class: "section-header",
        },
        {
          text: "Descripción",
          align: "left",
          value: "descripcion_cups",
          class: "section-header",
        },
        {
          text: "Clasificación",
          align: "center",
          value: "descclasif_cups",
          class: "section-header",
        },
        {
          text: "Tipo Serv",
          align: "center",
          value: "tiposer_cups",
          class: "section-header",
        },
        {
          text: "Agrp. Serv",
          align: "center",
          value: "agrpsevr_cups",
          class: "section-header",
        },
        {
          text: "Vlr Soat",
          align: "right",
          value: "vlrsoat_cups",
          class: "section-header",
        },
        {
          text: "Vlr Iss2001",
          align: "right",
          value: "vlriss_cups",
          class: "section-header",
        },
        {
          text: "Cod Rips",
          align: "right",
          value: "idrips_cups",
          class: "section-header",
        },

        {
          text: "Categoría",
          align: "center",
          value: "descripcat_cups",
          class: "section-header",
        },
        {
          text: "Cuenta",
          align: "right",
          value: "cuenta_cups",
          class: "section-header",
        },
        {
          text: "Estado",
          align: "center",
          value: "estado_cups",
          class: "section-header",
        },
      ],
      errores: {
        codigo: false,
        estado: false,
      },
      card_estado: false,
    };
  },
  created() {
    this.cargarcontenido();
    this.cargarcuentas();
    this.cargarcategorias();
    this.cargarsubcategorias();
  },
  computed: {},
  methods: {
    async editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
      await this.get_servicio(item.agrpsevr_cups, item.codserv_cups, 0);

      this.form.codigo = item.identificacion_cups;
      this.form.descripcion = item.descripcion_cups;
      this.form.codsoat = item.idsoat_cups.trim();
      this.form.vsoat = item.vlrsoat_cups.trim();
      this.form.cod_rips = item.idrips_cups.trim();
      this.form.codiss = item.codiss;
      this.form.viss = item.viss;
      this.form.edad = item.edad;
      this.form.genero = item.genero;
      this.form.ctavta = item.cuenta_cups;

      var busqueda_ctavtas = this.cuentas.find(
        (el) => parseInt(el.cod_puc) == parseInt(item.cuenta_cups)
      );
      this.form.ctavta = busqueda_ctavtas;

      var busqueda_tiposerv = this.tiposerv.find(
        (el) => parseInt(el.value) == parseInt(item.tiposer_cups)
      );
      this.form.tiposerv = busqueda_tiposerv;

      var busqueda_clasifserv = this.clasifserv.find(
        (el) => parseInt(el.value) == parseInt(item.clasifsevr_cups)
      );
      this.form.clasifserv = busqueda_clasifserv;

      let busqueda_select = this.modalidades.find(
        (el) => parseInt(el.value) == parseInt(item.modalidad_cups)
      );
      this.form.modalidad = busqueda_select;

      busqueda_select = this.items_motivos.find(
        (el) => parseInt(el.value) == parseInt(item.motivo_cups)
      );
      this.form.motivo = busqueda_select;

      var busqueda_agrpserv = this.agrpserv.find(
        (el) => parseInt(el.value) == parseInt(item.agrpsevr_cups)
      );
      this.form.agrpserv = busqueda_agrpserv;

      var busqueda_finalidad = this.items_finalidad.find(
        (el) => el.value == item.finalidad_cups
      );
      this.form.finalidad = busqueda_finalidad;

      var busqueda_categoria = this.categorias.find(
        (el) => parseInt(el.codigo_rep) == parseInt(item.categoria_cups)
      );
      this.form.categorias = busqueda_categoria;

      var busqueda_subcategoria = this.subcategorias.find(
        (el) => parseInt(el.codigo_rep) == parseInt(item.subcategoria_cups)
      );
      this.form.subcategorias = busqueda_subcategoria;

      var busqueda_res256 = this.clasif256.find(
        (el) => parseInt(el.value) == parseInt(item.tipores256_cups)
      );
      this.form.clasif256 = busqueda_res256;

      this.form.estado = item.estado_cups == "2" ? true : false;
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      if (!data.codigo) {
        this.errores.codigo = true;
        this.send_error("Campo Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },

    format_envio(data) {
      this.card_estado = true;
      var codigo = data.codigo;
      var descripcion = data.descripcion;
      var codsoat = data.codsoat ? data.codsoat : "0";
      var vlrsoat = data.vsoat ? data.vsoat : "0";
      var codiss = data.codiss ? data.codiss : "0";
      var vlriss = data.viss ? data.viss : "0";
      var edad = data.edad ? data.edad : "0";
      var genero = data.genero;
      var ctavta = data.ctavta ? data.ctavta.cod_puc : "";
      let cod_rips = data.cod_rips ? data.cod_rips.trim() : "";
      var tiposerv = data.tiposerv ? data.tiposerv.value : "0";
      var clasifserv = data.clasifserv ? data.clasifserv.value : "0";
      var agrpserv = data.agrpserv ? data.agrpserv.value : "0";
      var codservicio = data.servicio ? data.servicio.cod_rep : "0";
      var finalidad = data.finalidad ? data.finalidad.value : "0";
      var categoria = data.categorias ? data.categorias.codigo_rep : "0";
      var motivo = data.motivo ? data.motivo.value : "0";
      var modalidad = data.modalidad ? data.modalidad.value : "0";
      var subcategoria = data.subcategorias
        ? data.subcategorias.codigo_rep
        : "0";

      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";
      let clasif256 = data.clasif256 ? data.clasif256.value : "0";

      let datos = {
        url: "Clinico/dlls/ClCfServProc.DLL",
        data:
          sessionStorage.Sesion +
          "|" +
          codigo +
          "|" +
          descripcion +
          "|" +
          codsoat +
          "|" +
          vlrsoat +
          "|" +
          codiss +
          "|" +
          vlriss +
          "|" +
          genero +
          "|" +
          edad +
          "|" +
          ctavta +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          tiposerv +
          "|" +
          clasifserv +
          "|" +
          agrpserv +
          "|" +
          categoria +
          "|" +
          subcategoria +
          "|" +
          clasif256 +
          "|" +
          codservicio +
          "|" +
          cod_rips +
          "|" +
          finalidad +
          "|" +
          modalidad +
          "|" +
          motivo +
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
      this.form.activacion = this.$moment().format("YYYY-MM-DD");
      this.dialogo.titulo = "Agregar nuevo Registro";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    cargarcategorias() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/CfCategoriaJ.dll",
          data: sessionStorage.Sesion + "|" + "1" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.categorias = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error en Categorias",
            estado: true,
          });
        });
    },
    cargarsubcategorias() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/CfCategoriaJ.dll",
          data: sessionStorage.Sesion + "|" + "2" + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.subcategorias = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error en SubCategorias",
            estado: true,
          });
        });
    },
    init_form() {
      this.form = {
        codigo: null,
        eliminar: false,
      };

      this.errores = {
        codigo: false,
      };
    },

    descripcionEstado(e) {
      return e == "1" ? "Desactivado" : "Activo";
    },
    imprimir_excel() {
      let data = this.contenido;
      let data_parse = [];

      data_parse = [...data];

      let columnas = [
        {
          title: "Codigo",
          value: "identificacion_cups",
          format: "string",
        },
        {
          title: "Descripción",
          value: "descripcion_cups",
          format: "string",
        },
        {
          title: "Clasificación Rips",
          value: "descclasif_cups",
        },
        {
          title: "Tipo Serv.",
          value: "tiposer_cups",
        },
        {
          title: "Agrp_Servicio",
          value: "agrpsevr_cups",
          format: "string",
        },
        {
          title: "Cod_Soat",
          value: "idsoat_cups",
          format: "string",
        },
        {
          title: "Vlr_Soat",
          value: "vlrsoat_cups",
        },
        {
          title: "Cod_Iss",
          value: "idiss_cups",
          format: "string",
        },
        {
          title: "Vrl_Iss_2001",
          value: "vlriss_cups",
        },
        {
          title: "Categoria",
          value: "categoria_cups",
        },
        {
          title: "Cta_Contable",
          value: "cuenta_cups",
        },
        {
          title: "Genero",
          value: "genero_cups",
        },
        {
          title: "Edad",
          value: "edad_cups",
        },
        {
          title: "Id_Rips",
          value: "idrips_cups",
          format: "string",
        },
        {
          title: "Grupo",
          value: "grupo_cups",
        },
        {
          title: "Estado",
          value: "estado_cups",
        },
      ];

      let header_format = [
        { text: "SERVICIOS Y PROCEDIMIENTOS", bold: true, size: 16 },
        "",
        "",
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Informe Servicios y Procedimientos",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `INFORME SERVICIOS Y PROCEDIMIENTOS-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/ClCfServProcJ.dll",
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
            text: "Error al cargar Cups",
            estado: true,
          });
        });
    },
    cargarcuentas: function () {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.cuentas = data;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar cuentas",
            estado: true,
          });
        });
    },
    format_categorias(val) {
      return `${val.descripcion_rep}`;
    },

    format_subcategorias(val) {
      return `${val.descripcion_rep}`;
    },
    format_cuentas(val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },
    format_servicios(val) {
      return `${val.descripcion_rep}`;
    },

    async get_servicio(agrpsevr_cups, codserv_cups, tipo) {
      this.servicios = [];
      let grupo = 0;
      if (tipo == 1) {
        grupo = this.form.agrpserv.value;
      } else {
        grupo = agrpsevr_cups;
      }
      this.loader = true;
      post
        .postData({
          url: "Clinico/dlls/ClCfServ2275J.dll",
          data: sessionStorage.Sesion + "|" + grupo + "|",
          method: "",
        })
        .then((data) => {
          data.pop();
          this.loader = false;
          this.servicios = data;
          if (tipo == 0) {
            var busqueda_servicio = this.servicios.find(
              (el) => parseInt(el.cod_rep) == parseInt(codserv_cups)
            );
            this.form.servicio = busqueda_servicio;
          }
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error en Servicios",
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
  },
};
</script>