<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-tune</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Configuración Parámetros</v-list-item-title
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
            </v-row>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-data-table
              :headers="headers"
              :items="contenido"
              item-key="identificacion"
              :search="search"
              class="elevation-1"
            >
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
    <v-dialog v-model="dialogo.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Año"
                      clearable
                      required
                      v-model="form.año"
                      :error="errores.año"
                      @input="errores.año = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
              <v-col class="d-flex" cols="2">
                <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
              </v-col>

              <v-col cols="6" class="d-flex justify-end">
            <v-btn
              class="ma-2 white--text"
              color="red"
              depressed
              large
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
          </v-col>

        </v-card-title>
        <v-divider color="#FF6F00"></v-divider>

        <v-card-text class="pb-0">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Arroz Paddy</v-tab>
            <v-tab>Maíz</v-tab>
            <v-tab>Soya</v-tab>
            <v-tab>Sorgo</v-tab>
            <v-tab>Algodón</v-tab>
            
          </v-tabs>

          <v-divider color="succes"></v-divider>
          <v-tabs-items v-model="tab">
<!-- PADDY  -->            
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="px-6 mt-1 justify-center">
                  <span class="subtitle-1">Base de Compra</span>
                </v-row>
                <v-divider class="px-6 mt-4" color="orange"></v-divider>

                <v-row class="px-6 ml-1 mt-2" >
                  <v-col class="d-flex" cols="2" sm="2">
                    <v-text-field
                      label="Humedad"
                      clearable
                      outlined
                      v-model="form.humcpaddy"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="2" sm="2">
                    <v-text-field
                      label="Impureza"
                      clearable
                      outlined
                      v-model="form.imcpaddy"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3" sm="3">
                    <v-text-field
                      label="Grano Partido"
                      clearable
                      outlined
                      v-model="form.gpcpaddy"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2" sm="2">
                    <v-text-field
                      label="Grano Rojo"
                      clearable
                      outlined
                      v-model="form.rojopaddy"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2" sm="2">
                    <v-text-field
                      label="Yesado"
                      clearable
                      outlined
                      v-model="form.yesopaddy"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider class="px-6 mt-4" color="orange"></v-divider>

                <v-row class="px-6 mt-0 justify-center">
                  <span class="subtitle-1">Secamiento Final</span>
                </v-row>
                <v-row class="px-6 ml-1">
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Humedad"
                      clearable
                      outlined
                      v-model="form.humsec"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Impureza"
                      clearable
                      outlined
                      v-model="form.impsec"
                      hide-details
                    ></v-text-field>
                  </v-col>
            <v-col class="d-flex" cols="12" sm="6">              
              <v-autocomplete
                label="Codigo Paddy Seco"
                :items="productos"
                outlined
                clearable
                return-object
                required
                item-value="codigo_pr"
                v-model="form.paddyseco"
                :item-text="format_productos"
              ></v-autocomplete>
            </v-col>              

                </v-row>
                <v-divider color="orange"></v-divider>
                <v-row class="px-6 mt-0 justify-center">
                  <span class="subtitle-1">Trilla</span>
                </v-row>
                <v-row class="ml-1">
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="%Cascarilla"
                      clearable
                      outlined
                      v-model="form.cascarilla"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider class="mt-2" color="orange"></v-divider>
                <v-row class="px-6 mt-0 justify-center">
                  <span class="subtitle-1">Contable</span>
                </v-row>
                <v-row class="px-6 ml-1">
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="% F.Arrocero"
                      clearable
                      outlined
                      v-model="form.farroz"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Pasivo Fomento Arrocero"
                      v-model="form.ctafomento"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      return-object                      
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Id Fomento"
                      v-model="form.idfomento"
                      :items="tablaruts"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      return-object
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="px-6 ml-1">
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="% B.N.A."
                      clearable
                      outlined
                      v-model="form.fbolsa"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Pasivo Bolsa Nal Agropecuaria"
                      v-model="form.ctabolsa"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      return-object                      
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Id Bolsa"
                      v-model="form.idbolsa"
                      :items="tablaruts"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      return-object
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="px-6 ml-1">
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Vlr.Descargue x Ton"
                      clearable
                      outlined
                      v-model="form.descargue"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Pasivo Descargues"
                      v-model="form.ctadescargues"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      return-object                      
                      outlined
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Id Cuadrillero"
                      v-model="form.idcuadrilla"
                      :items="tablaruts"
                      :item-text="format_ruts"
                      item-value="identificacion_rut"
                      return-object
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="px-6 ml-1">
                  <v-col class="d-flex" cols="12" sm="7">
                    <v-autocomplete
                      label="Cuenta Proveedores"
                      v-model="form.ctaprovarr"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      return-object
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Cuenta Compras"
                      v-model="form.ctacompra"
                      :items="datosctas1"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      return-object                      
                      outlined
                    ></v-autocomplete>
                  </v-col>

                </v-row>
                <v-row class="px-6 ml-1">
                  <v-col class="d-flex" cols="5">
                    <v-autocomplete
                      label="Cuenta Retención en la Fuente"
                      v-model="form.ctartefte"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      return-object                      
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
<!-- MAIZ             -->
            <v-tab-item>
              <v-card color="basil" flat>
                <v-divider color="orange"></v-divider>
                <v-row class="px-6 ml-1 mt-0 justify-center">
                  <span class="subtitle-1">Base de Compra</span>
                </v-row>

                <v-row class="ml-2">
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Humedad"
                      clearable
                      outlined
                      v-model="form.hcmaiz"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Impureza"
                      clearable
                      outlined
                      v-model="form.icmaiz"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider color="succes"></v-divider>
              </v-card>
            </v-tab-item>
<!-- SOYA             -->
            <v-tab-item>
              <v-card color="basil" flat>
                <v-divider color="succes"></v-divider>
                <v-row class="px-6 mt-1 justify-center">
                  <span class="subtitle-1">Base de Compra</span>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Humedad"
                      clearable
                      outlined
                      v-model="form.hcsoya"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Impureza"
                      clearable
                      outlined
                      v-model="form.icsoya"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider class="px-6 mt-2" color="orange"></v-divider>
                <v-row class="px-6 mt-0 justify-center">
                  <span class="subtitle-1">Contable</span>
                </v-row>
              <v-row>

                <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Cuenta Proveedores"
                      v-model="form.ctaprovsoya"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      return-object
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Cuenta Compras"
                      v-model="form.ctacomprasoya"
                      :items="datosctas1"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      return-object                      
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>


              </v-card>
            </v-tab-item>
<!-- SORGO            -->            
            <v-tab-item>
              <v-card color="basil" flat>
                <v-divider color="succes"></v-divider>
                <v-row class="px-6 mt-1 justify-center">
                  <span class="subtitle-1">Base de Compra</span>
                </v-row>
                <v-divider class="px-6 mt-2" color="succes"></v-divider>

                <v-row class="px-6 mt-2">
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Humedad"
                      clearable
                      outlined
                      v-model="form.hcsorgo"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Impureza"
                      clearable
                      outlined
                      v-model="form.icsorgo"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider color="succes"></v-divider>
              </v-card>
            </v-tab-item>
<!-- ALGODON          -->            
            <v-tab-item>
              <v-card color="basil" flat>
                <v-divider color="succes"></v-divider>
                <v-row class="px-6 mt-1 justify-center">
                  <span class="subtitle-1">Base de Compra</span>
                </v-row>
                <v-divider class="px-6 mt-2" color="succes"></v-divider>

                <v-row class="px-6 mt-2">
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Humedad"
                      clearable
                      outlined
                      v-model="form.hcalgodon"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Impureza"
                      clearable
                      outlined
                      v-model="form.icalgodon"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider class="px-6 mt-2" color="orange"></v-divider>
                <v-row class="px-6 mt-0 justify-center">
                  <span class="subtitle-1 mt-2">Contable</span>
                </v-row>
              <v-row>

                <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Cuenta Proveedores"
                      v-model="form.ctaprovalgodon"
                      :items="datosctas"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      return-object
                      hide-details
                      outlined
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-autocomplete
                      label="Cuenta Compras"
                      v-model="form.ctacompraalgodon"
                      :items="datosctas1"
                      :item-text="format_ctas"
                      item-value="cod_puc"
                      hide-details
                      return-object                      
                      outlined
                    ></v-autocomplete>
                  </v-col>
                </v-row>


              </v-card>
            </v-tab-item>


          </v-tabs-items>

          <v-divider color="succes"></v-divider>
          <v-col>
            <v-row>
            </v-row>
          </v-col>
        </v-card-text>
        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="dialogo.estado = false;
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
        </v-card-actions> -->
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
      datosctas: [],    
      datosctas1: [],          
      tablaruts:[],  
      productos: [],            

      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Año", align: "left", value: "ano_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        año: false,
      },
      card_estado: false,
      tab: 0,
      años: [],
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
    };
  },
  created() {
    var ano_actual = new Date().getFullYear();
    this.años.push(ano_actual);
    for (let i = 1; i < 3; i++) this.años.push(ano_actual + i);
    for (let i = 1; i < 3; i++) this.años.unshift(ano_actual - i);

    this.cargarcontenido();
    this.cargarTablactas();
    this.cargarTablaruts();
    this.cargarTablactas1();   
    this.get_productos();             
  },
  computed: {},
  methods: {
    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.form.año = item.ano_rep;
      this.form.humcpaddy = item.hcpaddy_rep.trim();
      this.form.imcpaddy = item.icpaddy_rep.trim();
      this.form.gpcpaddy = item.gpcpaddy_rep.trim();
      this.form.humsec = item.hspaddy_rep.trim();
      this.form.impsec = item.ispaddy_rep.trim();
      this.form.rojopaddy = item.rojopaddy_rep.trim();
      this.form.yesopaddy = item.yesopaddy_rep.trim();            

      this.form.cascarilla = item.cascpaddy_rep.trim();
      this.form.descargue = item.descargue_rep.trim();

      var busqueda_paddyseco = this.productos.find(
        (el) => el.codigo_pr == item.codpaddyseco_rep
      );      
      this.form.paddyseco = busqueda_paddyseco;

      var busqueda_cuadrilla = this.tablaruts.find(
        (el) => el.identificacion_rut == item.idcuadrilla_rep
      );      
      this.form.idcuadrilla = busqueda_cuadrilla;

      var busqueda_idfomento = this.tablaruts.find(
        (el) => el.identificacion_rut == item.idfomento_rep
      );      
      this.form.idfomento = busqueda_idfomento;

      var busqueda_bolsa = this.tablaruts.find(
        (el) => el.identificacion_rut == item.idbolsa_rep
      );      
      this.form.idbolsa = busqueda_bolsa;

      var busqueda_ctafom = this.datosctas.find(
        (el) => el.cod_puc == item.ctafomento_rep
      );      
      this.form.ctafomento = busqueda_ctafom;

      var busqueda_ctabolsa = this.datosctas.find(
        (el) => el.cod_puc == item.ctabolsa_rep
      );      
      this.form.ctabolsa = busqueda_ctabolsa;

      var busqueda_ctadescarg = this.datosctas.find(
        (el) => el.cod_puc == item.ctadescarg_rep
      );      
      this.form.ctadescargues = busqueda_ctadescarg;

      var busqueda_ctaprov = this.datosctas.find(
        (el) => el.cod_puc == item.ctaprovarr_rep
      );      
      this.form.ctaprovarr = busqueda_ctaprov;

      var busqueda_ctacompra = this.datosctas1.find(
        (el) => el.cod_puc == item.ctacompra_rep
      );      
      this.form.ctacompra = busqueda_ctacompra;

      var busqueda_ctaret = this.datosctas.find(
        (el) => el.cod_puc == item.ctartefte_rep
      );      
      this.form.ctartefte = busqueda_ctaret;

      
      this.form.hcmaiz = item.hcmaiz_rep.trim();
      this.form.icmaiz = item.icmaiz_rep.trim();
      this.form.farroz = item.farroc_rep.trim();      
      this.form.fbolsa = item.bna_rep.trim();

      this.form.hcsoya = item.hcsoya_rep.trim();
      this.form.icsoya = item.icsoya_rep.trim();

      var busqueda_ctaprovsoya = this.datosctas.find(
        (el) => el.cod_puc == item.ctaprovsoya_rep
      );      
      this.form.ctaprovsoya = busqueda_ctaprovsoya;

      var busqueda_ctacomprasoya = this.datosctas1.find(
        (el) => el.cod_puc == item.ctacomprasoya_rep
      );      
      this.form.ctacomprasoya = busqueda_ctacomprasoya;

      this.form.hcsorgo = item.hcsorgo_rep.trim();
      this.form.icsorgo = item.icsorgo_rep.trim();

      this.form.hcalgodon = item.hcalg_rep.trim();
      this.form.icalgodon = item.icalg_rep.trim();
      var busqueda_ctaprovalg = this.datosctas.find(
        (el) => el.cod_puc == item.ctaprovalgod_rep
      );      
      this.form.ctaprovalgodon = busqueda_ctaprovalg;

      var busqueda_ctacompraalg = this.datosctas1.find(
        (el) => el.cod_puc == item.ctacompraalgod_rep
      );      
      this.form.ctacompraalgodon = busqueda_ctacompraalg;
    

      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Parámetros";
      this.dialogo.tipo = 1;
    },
    get_productos() {
      post
        .postData({
          url: "Ptovta/dlls/CfProductosJ.dll",
          data: sessionStorage.Sesion + "|" + "0" + "|",
          method: "",
        })
        .then((data) => {
          var data_parse = JSON.parse(JSON.stringify(data));
          let descripcion64 = " ";

          data_parse.map((el, index) => {
            descripcion64 = window.atob(
                el.base1_pr.trim() +
                el.base2_pr.trim() +
                el.base3_pr.trim() +
                el.base4_pr.trim() +
                el.base5_pr.trim() +
                el.base6_pr.trim() +
                el.base7_pr.trim() +
                el.base8_pr.trim() +
                el.base9_pr.trim() +
                el.base10_pr.trim()
            );
            if (descripcion64) {
              el.descripcion_completa = descripcion64;
            } else {
              el.descripcion_completa =
                el.descripcion_pr.trim() + " " + el.descripcion2_pr.trim();
              el.descripcion_pr = el.descripcion_pr.trim();
              el.descripcion2_pr = el.descripcion2_pr.trim();
              el.index = index;
            }
            return el;
          });
          this.productos = data_parse;



        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar los productos",
            estado: true,
          });
        });
    },        
    format_productos(val) {
      return `${val.codigo_pr.trim()} - ${val.descripcion_completa.trim()}`;
    },    
    guardar: function () {
      var data = JSON.parse(JSON.stringify(this.form));
      console.log(data)
      if (!data.año) {
        this.errores.año = true;
        this.send_error("Año Obligatorio!");
      } else {
        this.format_envio(data);
      }
    },
    format_envio(data) {

      let año = data.año;
      let hcpaddy = data.humcpaddy ? data.humcpaddy.trim() : "0";
      let icpaddy = data.imcpaddy ? data.imcpaddy.trim() : "0";
      let pgcpaddy = data.gpcpaddy ? data.gpcpaddy.trim() : "0";
      let rojopaddy = data.rojopaddy ? data.rojopaddy.trim() : "0";      
      let yesopaddy = data.yesopaddy ? data.yesopaddy.trim() : "0";            
      let hspaddy = data.humsec ? data.humsec.trim() : "0";
      let ispaddy = data.impsec ? data.impsec.trim() : "0";
      let paddyseco = data.paddyseco ? data.paddyseco.codigo_pr : "0";
      let cascarilla = data.cascarilla ? data.cascarilla.trim() : "0";
      let hcmaiz = data.hcmaiz ? data.hcmaiz.trim() : "0";
      let icmaiz = data.icmaiz ? data.icmaiz.trim() : "0";
      let hcsorgo = data.hcsorgo ? data.hcsorgo.trim() : "0";
      let icsorgo = data.icsorgo ? data.icsorgo.trim() : "0";

      let farroc = data.farroz ? data.farroz.trim() : "0";     

      let ctafomento = data.ctafomento ? data.ctafomento.cod_puc.trim() : "0";
      let idfomento = data.idfomento ? data.idfomento.identificacion_rut.trim() : "0";            

      let fbolsa = data.fbolsa ? data.fbolsa.trim() : "0";
      let ctabolsa = data.ctabolsa ? data.ctabolsa.cod_puc.trim() : "0";
      let idbolsa = data.idbolsa ? data.idbolsa.identificacion_rut.trim() : "0";

      let descargue = data.descargue ? data.descargue.trim() : "0";
      let id_descargue = data.idcuadrilla ? data.idcuadrilla.identificacion_rut.trim() : "0";      
      let ctadescargues = data.ctadescargues ? data.ctadescargues.cod_puc.trim() : "0";

      let ctaprovarr = data.ctaprovarr ? data.ctaprovarr.cod_puc.trim() : "0";
      let ctartefte = data.ctartefte ? data.ctartefte.cod_puc.trim() : "0";
      let ctacompra = data.ctacompra ? data.ctacompra.cod_puc.trim() : "0";

      let hcsoya = data.hcsoya ? data.hcsoya.trim() : "0";
      let icsoya = data.icsoya ? data.icsoya.trim() : "0";
      let ctaprovsoya = data.ctaprovsoya ? data.ctaprovsoya.cod_puc.trim() : "0";
      let ctacomprasoya = data.ctacomprasoya ? data.ctacomprasoya.cod_puc.trim() : "0";

      let hcalgodon = data.hcalgodon ? data.hcalgodon.trim() : "0";
      let icalgodon = data.icalgodon ? data.icalgodon.trim() : "0";
      let ctaprovalgodon = data.ctaprovalgodon ? data.ctaprovalgodon.cod_puc.trim() : "0";
      let ctacompraalgodon = data.ctacompraalgodon ? data.ctacompraalgodon.cod_puc.trim() : "0";

      var eliminar = data.eliminar ? "1" : "0";
      this.card_estado = true;

      let datos = {
        url: "Molinos/dlls/Cfparamol.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          año +
          "|" +
          hcpaddy +
          "|" +
          icpaddy +
          "|" +
          pgcpaddy +
          "|" +
          hspaddy +
          "|" +
          ispaddy +
          "|" +
          cascarilla +
          "|" +
          hcmaiz +
          "|" +
          icmaiz +
          "|" +
          hcsoya +
          "|" +
          icsoya +
          "|" +
          rojopaddy +
          "|" +
          yesopaddy +
          "|" +
          eliminar +
          "|" +          
          descargue +
          "|" +
          id_descargue +
          "|" +
          ctadescargues +
          "|" +
          farroc +
          "|" +
          idfomento +
          "|" +      
          ctafomento +                                  
          "|" +
          fbolsa +
          "|" +
          ctabolsa +
          "|" +
          idbolsa +
          "|" +
          ctaprovarr +
          "|" +          
          ctartefte +
          "|" +          
          ctacompra +
          "|" +                    
          hcsorgo +
          "|" +                              
          icsorgo +
          "|" +                                        
          paddyseco +
          "|" +        
          ctaprovsoya +                                
          "|" +        
          ctacomprasoya +                                          
          "|" +        
          hcalgodon +
          "|" +       
          icalgodon + 
          "|" +        
          ctaprovalgodon +
          "|" +        
          ctacompraalgodon +
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
      this.dialogo.titulo = "Parametros Año ";
      this.dialogo.estado = true;
      this.dialogo.tipo = 0;
    },
    init_form() {
      this.form = {
        eliminar: false,
      };

      this.errores = {
        codigo: false,
      };
    },
    format_ruts: function (val) {
      return `${val.descripcion_rut}`;
    },
    cargarTablaruts: function () {
      post
        .postData({
          url: "Financiero/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.tablaruts = data;
        })
        .catch((err) => {
          this.send_error("Error al cargar Ruts");
        });
    },

    format_ctas(val) {
      return `${val.cod_puc} - ${val.descrip_puc}`;
    },

    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },

    cargarTablactas: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "2" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.datosctas = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cuentas Contables",
            estado: true,
          });
        });
    },
    cargarTablactas1: function () {
      post
        .postData({
          url: "Financiero/dlls/CfCuentasJ.DLL",
          data: sessionStorage.Sesion + "|" + "1" + "|" + "4" + "|",
          method: "",
        })
        .then((data) => {
          this.datosctas1 = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Cuentas Contables",
            estado: true,
          });
        });
    },    
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Molinos/dlls/CfparamolJ.dll",
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
            text: "Error al cargar Parametros",
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
