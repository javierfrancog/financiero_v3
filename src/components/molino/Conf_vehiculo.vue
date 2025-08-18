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
              <v-icon size="30" color="blue darken-4 ">mdi-truck</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Vehículos</v-list-item-title
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
              item-key="placa"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.estadoestud_rep="{ item }">{{
                item.estadoestud_rep == "1" ? "Bloqueado" : "Activo"
              }}</template>

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
            <v-tab>Información General</v-tab>
            <v-tab>Imagenes y Documentos</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="2">
                    <v-text-field
                      label="Placa"
                      clearable
                      outlined
                      required
                      v-model="form.placa"
                      :error="errores.placa"
                      @input="errores.placa = false"
                      autocomplete="off"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="5">
                    <v-autocomplete
                      label="Conductor"
                      v-model="form.conductor"
                      :items="ruts3"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                      @change="errores.estudiante = false"
                      :error="errores.estudiante"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="5">
                    <v-autocomplete
                      label="Propietario"
                      v-model="form.propietario"
                      :items="ruts3"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      hide-details
                      return-object
                      outlined
                      @change="errores.propietario = false"
                      :error="errores.propietario"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="[
                        { text: 'TractoCamión', value: 1 },
                        { text: 'Camión', value: 2 },
                        { text: 'Volqueta', value: 3 },
                        { text: 'Camioneta', value: 4 },
                        { text: 'Tractor', value: 5 },
                        { text: 'Motocarguero', value: 6 },                        
                        { text: 'Motocicleta', value: 7 },                        
                      ]"
                      label="Tipo Vehículo"
                      outlined
                      clearable
                      hide-details
                      v-model="form.tipo"
                      required
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Marca"
                      clearable
                      outlined
                      required
                      v-model="form.marca"
                      :error="errores.marca"
                      @input="errores.marca = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Modelo"
                      clearable
                      outlined
                      required
                      v-model="form.modelo"
                      :error="errores.modelo"
                      @input="errores.modelo = false"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Color"
                      clearable
                      outlined
                      required
                      v-model="form.color"
                      :error="errores.color"
                      @input="errores.color = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="6">
                    <v-text-field
                      label="Nro. Motor"
                      clearable
                      outlined
                      required
                      v-model="form.motor"
                      :error="errores.motor"
                      @input="errores.motor = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="6">
                    <v-text-field
                      label="Nro. Chasis"
                      clearable
                      outlined
                      required
                      v-model="form.chasis"
                      :error="errores.chasis"
                      @input="errores.chasis = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Nro. Trailer"
                      clearable
                      outlined
                      required
                      v-model="form.trailer"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Marca Trailer"
                      clearable
                      outlined
                      required
                      v-model="form.marcatrailer"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickerFecha"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.vencesoat"
                          label="Vence Soat"
                          append-icon="event"
                          hide-details
                          required
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.vencesoat"
                        @input="pickerFecha = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col class="d-flex" sm="3">
                    <v-menu
                      v-model="pickerFechatec"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.vencetecno"
                          label="Vence Tecnomecanica"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.vencetecno"
                        @input="pickerFechatec = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="4" sm="6">
                    <v-text-field
                      label="Url Satelital"
                      clearable
                      outlined
                      required
                      v-model="form.satelital"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-menu
                      ref="menu"
                      v-model="pickerFechaReg"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                      required
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_reg"
                          label="Fecha Registro"
                          append-icon="event"
                          outlined
                          disabled
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_reg"
                        @input="pickerFechaReg = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex justify-center">
                  <v-col class="d-flex" cols="4">
                    <v-file-input
                      label="Cargar Documentos"
                      accept=".pdf"
                      outlined
                      hide-details
                      v-model="pdf"
                    ></v-file-input>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-file-input
                      label="Foto Vehiculo"
                      accept=".png"
                      outlined
                      hide-details
                      multiple
                      v-model="img_actual"
                    ></v-file-input>
                  </v-col>
                </v-row>
                <v-divider v-if="pdf" color="succes"></v-divider>
                <v-row v-if="pdf">
                  <v-col class="d-flex justify-center">
                    <v-card
                      color="grey lighten-2"
                      height="200"
                      width="200"
                      elevation="0"
                      class="d-flex align-center justify-center"
                      link
                      @click="mostrar_pdf"
                    >
                      <v-icon size="60" color="red darken-2">
                        mdi-pdf-box
                      </v-icon>
                    </v-card>
                  </v-col>
                </v-row>
                <v-divider color="succes"></v-divider>
                <v-row>
                  <v-col
                    v-for="(img, idx) in imagenes_src"
                    :key="idx"
                    class="d-block justify-center relative"
                    cols="4"
                  >
                    <v-img
                      :src="img.url"
                      class="grey lighten-2"
                      contain
                      height="200"
                    />
                    <v-card
                      :style="{ position: 'relative', bottom: '25px' }"
                      color="transparent"
                      flat
                    >
                      <v-row
                        align="end"
                        class="lightbox white--text fill-height pa-0 px-1"
                        no-gutters
                      >
                        <v-col cols="12" class="d-flex justify-center">
                          <v-btn
                            x-small
                            color="red darken-2"
                            class="white--text"
                            depressed
                            @click="_eliminarImagen(img)"
                          >
                            Eliminar
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
                <v-divider color="succes"></v-divider>
                <v-row>
                  <v-col
                    class="d-block justify-center relative"
                    cols="4"
                    v-for="(img, idx) in imagenes_subidas"
                    :key="idx"
                  >
                    <div v-if="img.tipo != 'PDF'">
                      <v-img
                        :src="img.url"
                        class="grey lighten-2"
                        contain
                        height="200"
                      />
                      <v-card
                        :style="{ position: 'relative', bottom: '25px' }"
                        color="transparent"
                        flat
                      >
                        <v-row
                          align="end"
                          class="lightbox white--text fill-height pa-0 px-1"
                          no-gutters
                        >
                          <v-col cols="12" class="d-flex justify-center">
                            <v-btn
                              x-small
                              color="red darken-2"
                              class="white--text"
                              depressed
                              @click="_eliminarImagen(img)"
                            >
                              Eliminar
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card>
                    </div>
                    <div v-else>
                      <v-card
                        color="grey lighten-2"
                        height="200"
                        width="200"
                        elevation="0"
                        class="d-flex align-center justify-center"
                        link
                        @click="mostrar_pdf_subido(img.url)"
                      >
                        <v-icon size="60" color="red darken-2">
                          mdi-pdf-box
                        </v-icon>
                      </v-card>
                    </div>
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
        estado: true,
        titulo: null,
        tipo: null,
      },
      error: {
        rut: false,
      },
      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,
      pickerFechaReg: false,
      pickerFechatec: false,
      pickerFecha: false,      
      singleExpand: true,
      expanded: [],
      ruts3: [],
      contenido: [],
      modelo: [],
      agencias: [],

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Placa", align: "left", value: "placa_rep" },
        {
          text: "Conductor",
          align: "left",
          value: "conductor_rep",
        },
        {
          text: "Propietario",
          align: "left",
          value: "propietario_rep",
        },
        { text: "Marca", align: "center", value: "marca_rep" },
        { text: "Modelo", align: "center", value: "modelo_rep" },
        { text: "Color", align: "center", value: "color_rep" },

        { text: "Estado", align: "center", value: "estadoestud_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        ccosto: false,
        estudiante: false,
        modelo: false,
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
      img_actual: null,
      imagenes: [],
      imagenes_src: [],
      pdf: null,
      imagenes_subidas: [],
    };
  },
  created() {
    this.dialogo.estado = false;
    this.cargarcontenido();
    this.get_ruts();
  },
  watch: {
    img_actual: function (val) {
      this.add_img();
    },
  },
  methods: {
    subir_archivos(data) {
      var _this = this;
      return new Promise((resolve, reject) => {
        var empresa = sessionStorage.Sesion.substr(0, 15);
        var placa = _this.form.placa;

        var adjuntos = [];
        var imagenes = this.imagenes;
        adjuntos = imagenes;
        var pdf = this.pdf;

        adjuntos.push(pdf);
        var archivos = new FormData();

        adjuntos.forEach((el, index) => {
          archivos.append(index, el);
        });

        archivos.append("nombre_archivo", empresa + placa);
        fetch("https://server100ts.net/up.file.php", {
          method: "POST",
          body: archivos,
        })
          .then((res) => res.json())
          .then((res) => {
            var formData = new FormData();
            formData.append("tipo", "adjuntosVeh");
            // console.log('Data', data.imagenes, res.correcto)

            data.imagenes = data.imagenes || [];

            data.imagenes.forEach((el) => {
              res.correcto.push(el.valor.trim());
            });

            formData.append("data", JSON.stringify(res.correcto));

            fetch("https://server1ts.net//financiero/inc/planos.php", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((result) => {
                _this.imagenes = [];
                _this.imagenes_src = [];
                _this.pdf = null;
                // console.log("Adjuntos ->", result.mensaje, res);
                resolve(result.mensaje);
              })
              .catch((error) => reject(error));
          });
      });
    },
    mostrar_pdf_subido(base64) {
      var fileName = "PDF";
      let pdfWindow = window.open("");
      pdfWindow.document.write(
        "<html<head><title>" +
          fileName +
          "</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>"
      );
      pdfWindow.document.write(
        "<body><embed width='100%' height='100%' src='data:application/pdf;base64, " +
          encodeURI(base64) +
          "#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>"
      );
    },
    mostrar_pdf() {
      var val = this.pdf;
      const fr = new FileReader();
      fr.readAsDataURL(val);
      fr.addEventListener("load", () => {
        let replace = fr.result.replace("data:application/pdf;base64,", "");
        var fileName = "PDF";
        let pdfWindow = window.open("");
        pdfWindow.document.write(
          "<html<head><title>" +
            fileName +
            "</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>"
        );
        pdfWindow.document.write(
          "<body><embed width='100%' height='100%' src='data:application/pdf;base64, " +
            encodeURI(replace) +
            "#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>"
        );
      });
    },
    _eliminarImagen(img) {
      let index = this.imagenes_src.findIndex((el) => el.name == img.name);
      this.imagenes.splice(index, 1);
      this.imagenes_src.splice(index, 1);
    },
    validar_imagenes() {
      var val = this.imagenes;
      this.imagenes_src = [];
      val.forEach((item, index) => {
        const fr = new FileReader();
        fr.readAsDataURL(item);
        fr.addEventListener("load", () => {
          this.imagenes_src.push({ url: fr.result, index, name: item.name });
        });
      });
    },
    add_img() {
      this.imagenes = [...this.img_actual, ...this.imagenes];
      this.validar_imagenes();
    },
    async get_imagenes(images) {
      var data = [];
      for (const img of images) {
        let folder = img.tipo == "PDF" ? "pdfs/" : "imagenes/";
        var archivo_obj = new FormData();
        archivo_obj.append("ruta", folder + img.valor.trim());
        var res = await fetch("https://server100ts.net/get.file.php", {
          method: "POST",
          body: archivo_obj,
        }).then((res) => res.text());

        if (img.tipo != "PDF") {
          data.push({
            name: img.valor.trim(),
            tipo: img.tipo,
            url: "data:image/png;base64," + res,
          });
        } else {
          data.push({
            name: img.valor.trim(),
            tipo: img.tipo,
            url: res,
          });
        }
      }

      // console.log("Res", data);
      this.imagenes_subidas = data;
    },
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      // console.log("item", item);
      this.get_imagenes(item.TablaArchivos_rep).then(() => {
        this.dialogo.estado = true;
        this.dialogo.titulo = "Modificar Registro";
        this.dialogo.tipo = 1;
        this.form.placa = item.placa_rep;
        var busqueda_conductor = this.ruts3.find(
          (el) => el.identificacion_rut == item.idcond_rep
        );
        this.form.conductor = busqueda_conductor;

        var busqueda_propietario = this.ruts3.find(
          (el) => el.identificacion_rut == item.idprop_rep
        );
        this.form.propietario = busqueda_propietario;

        // var busqueda_tipo = this.ruts3.find(
        //   (el) => el.identificacion_rut == item.tipo_rep
        // );
        this.form.tipo = parseInt(item.tipo_rep) || 0;

        this.form.marca = item.marca_rep;
        this.form.modelo = item.modelo_rep;
        this.form.color = item.color_rep;
        this.form.motor = item.motor_rep;
        this.form.chasis = item.chasis_rep;
        this.form.fecha_reg = item.fechamod_rep;
        this.form.trailer = item.trailer_rep;
        this.form.marcatrailer = item.marcatr_rep;
        this.form.vencesoat = item.vsoat_rep;
        this.form.vencetecno = item.vtecno_rep;
        this.form.satelital = item.satelite_rep;
        this.form.imagenes = item.TablaArchivos_rep;
        this.form.estado = item.estado_rep == "1" ? true : false;
      });
    },
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));

      this.card_estado = true;
      let nom_plano = "";
      this.subir_archivos(data).then((nom_plano) => {
        this.format_envio(data, nom_plano);
      });
      // this.format_envio(data, nom_plano);
    },
    format_envio(data, nom_plano) {
      var placa = data.placa;
      var conductor = data.conductor ? data.conductor.identificacion_rut : "0";
      var propietario = data.propietario
        ? data.propietario.identificacion_rut
        : "0";
      var marca = data.marca;
      var modelo = data.modelo.trim();
      var color = data.color;
      var motor = data.motor;
      var chasis = data.chasis;
      var trailer = data.trailer;
      var marcatr = data.marcatrailer;
      var vsoat = data.vencesoat.replace(/\-/g, "");
      var vtecno = data.vencetecno.replace(/\-/g, "");
      var satelital = data.satelital;
      var tipo = data.tipo;

      var estado = data.estado ? "1" : "0";
      var eliminar = data.eliminar ? "1" : "0";

      let datos = {
        url: "Molinos/dlls/Cfvehiculo.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          placa +
          "|" +
          propietario +
          "|" +
          conductor +
          "|" +
          marca +
          "|" +
          modelo +
          "|" +
          color +
          "|" +
          motor +
          "|" +
          chasis +
          "|" +
          trailer +
          "|" +
          marcatr +
          "|" +
          vsoat +
          "|" +
          vtecno +
          "|" +
          satelital +
          "|" +
          tipo +
          "|" +
          estado +
          "|" +
          eliminar +
          "|" +
          nom_plano +
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

    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Molinos/dlls/CfvehiculoJ.dll",
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
            text: "Error al cargar Vehiculos",
            estado: true,
          });
        });
    },
    format_ruts(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },

    get_ruts() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|" + 7 + "|",
          method: "",
        })
        .then((data) => {
          this.ruts3 = data;
          this.ruts3.pop();
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Vehiculos",
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
