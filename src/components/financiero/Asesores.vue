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
                >Asesores Comerciales</v-list-item-title
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
              <template v-slot:item.estado_ases="{ item }">{{
                item.estado_ases == "1" ? "Bloqueado" : "Activo"
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
      <v-card class="px-2" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
        </v-card-title>
        <v-card-text class="pb-2">
          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Basico</v-tab>
            <v-tab>Comisiones x Recaudo</v-tab>
            <v-tab>Comisiones x Venta</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="7">
                    <v-autocomplete
                      label="Asesor"
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
                      label="Agencia"
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
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex">
                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      label="1._Clasificación"
                      v-model="form.clasifica1"
                      :items="clasifica"
                      :item-text="format_clasifica"
                      item-value="codigo_clas"
                      hide-details
                      return-object                      
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dia Inicial"
                      clearable
                      v-model="form.dia1_ini"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dia Final"
                      clearable
                      v-model="form.dia1_fin"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Valor"
                      clearable
                      v-model="form.valor1"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-select
                      :items="unidades"
                      label="Unidad"
                      clearable
                      hide-details
                      v-model="form.unidad1"
                      return-object
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row class="d-flex">
                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      label="2._Clasificación"
                      v-model="form.clasifica2"
                      :items="clasifica"
                      :item-text="format_clasifica"
                      item-value="codigo_clas"
                      hide-details
                      return-object
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dia Inicial"
                      clearable
                      v-model="form.dia2_ini"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dia Final"
                      clearable
                      v-model="form.dia2_fin"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Valor"
                      clearable
                      v-model="form.valor2"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-select
                      :items="[
                        { text: 'Unidad', value: 1 },
                        { text: 'Caja', value: 2 },
                        { text: 'Bolsa', value: 3 },
                        { text: 'Kilo', value: 4 },
                        { text: 'Bulto', value: 5 },
                        { text: 'Paquete', value: 6 },
                        { text: 'Hectárea', value: 7 },
                        { text: 'Metro', value: 8 },
                        { text: 'Arroba', value: 9 },
                      ]"
                      label="Unidad"
                      clearable
                      hide-details
                      v-model="form.unidad2"
                      return-object
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="d-flex">
                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      label="3._Clasificación"
                      v-model="form.clasifica3"
                      :items="clasifica"
                      :item-text="format_clasifica"
                      item-value="codigo_clas"
                      hide-details
                      return-object
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dia Inicial"
                      clearable
                      v-model="form.dia3_ini"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dia Final"
                      clearable
                      v-model="form.dia3_fin"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Valor"
                      clearable
                      v-model="form.valor3"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-select
                      :items="[
                        { text: 'Unidad', value: 1 },
                        { text: 'Caja', value: 2 },
                        { text: 'Bolsa', value: 3 },
                        { text: 'Kilo', value: 4 },
                        { text: 'Bulto', value: 5 },
                        { text: 'Paquete', value: 6 },
                        { text: 'Hectárea', value: 7 },
                        { text: 'Metro', value: 8 },
                        { text: 'Arroba', value: 9 },
                      ]"
                      label="Unidad"
                      clearable
                      hide-details
                      v-model="form.unidad3"
                      return-object
                    ></v-select>
                  </v-col>
                </v-row>

                  <v-row class="d-flex">
                    <v-col class="d-flex" cols="4">
                      <v-autocomplete
                        label="4._Clasificación"
                        v-model="form.clasifica4"
                        :items="clasifica"
                        :item-text="format_clasifica"
                        item-value="codigo_clas"
                        hide-details
                        return-object
                      ></v-autocomplete>
                    </v-col>

                    <v-col class="d-flex" cols="2">
                      <v-text-field
                        label="Dia Inicial"
                        clearable
                        v-model="form.dia4_ini"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="2">
                      <v-text-field
                        label="Dia Final"
                        clearable
                        v-model="form.dia4_fin"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="2">
                      <v-text-field
                        label="Valor"
                        clearable
                        v-model="form.valor4"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="2">
                      <v-select
                        :items="[
                          { text: 'Unidad', value: 1 },
                          { text: 'Caja', value: 2 },
                          { text: 'Bolsa', value: 3 },
                          { text: 'Kilo', value: 4 },
                          { text: 'Bulto', value: 5 },
                          { text: 'Paquete', value: 6 },
                          { text: 'Hectárea', value: 7 },
                          { text: 'Metro', value: 8 },
                          { text: 'Arroba', value: 9 },
                        ]"
                        label="Unidad"
                        clearable
                        hide-details
                        v-model="form.unidad4"
                        return-object
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-row class="d-flex">
                    <v-col class="d-flex" cols="4">
                      <v-autocomplete
                        label="5._Clasificación"
                        v-model="form.clasifica5"
                        :items="clasifica"
                        :item-text="format_clasifica"
                        item-value="codigo_clas"
                        hide-details
                        return-object
                      ></v-autocomplete>
                    </v-col>

                    <v-col class="d-flex" cols="2">
                      <v-text-field
                        label="Dia Inicial"
                        clearable
                        v-model="form.dia5_ini"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="2">
                      <v-text-field
                        label="Dia Final"
                        clearable
                        v-model="form.dia5_fin"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="2">
                      <v-text-field
                        label="Valor"
                        clearable
                        v-model="form.valor5"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="2">
                      <v-select
                        :items="[
                          { text: 'Unidad', value: 1 },
                          { text: 'Caja', value: 2 },
                          { text: 'Bolsa', value: 3 },
                          { text: 'Kilo', value: 4 },
                          { text: 'Bulto', value: 5 },
                          { text: 'Paquete', value: 6 },
                          { text: 'Hectárea', value: 7 },
                          { text: 'Metro', value: 8 },
                          { text: 'Arroba', value: 9 },
                        ]"
                        label="Unidad"
                        clearable
                        hide-details
                        v-model="form.unidad5"
                        return-object
                      ></v-select>
                    </v-col>
                  </v-row>

              </v-card>
            </v-tab-item>

            <!-- comisiones por venta -->
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row class="d-flex">
                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      label="1._Clasificación"
                      v-model="form.clasifica1_vta"
                      :items="clasifica"
                      :item-text="format_clasifica"
                      item-value="codigo_clas"
                      hide-details
                      return-object                      
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dia Inicial"
                      clearable
                      v-model="form.dia1_ini_vta"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dia Final"
                      clearable
                      v-model="form.dia1_fin_vta"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Valor"
                      clearable
                      v-model="form.valor1_vta"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-select
                      :items="unidades"
                      label="Unidad"
                      clearable
                      hide-details
                      v-model="form.unidad1_vta"
                      return-object
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row class="d-flex">
                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      label="2._Clasificación"
                      v-model="form.clasifica2_vta"
                      :items="clasifica"
                      :item-text="format_clasifica"
                      item-value="codigo_clas"
                      hide-details
                      return-object
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dia Inicial"
                      clearable
                      v-model="form.dia2_ini_vta"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dia Final"
                      clearable
                      v-model="form.dia2_fin_vta"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Valor"
                      clearable
                      v-model="form.valor2_vta"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-select
                      :items="[
                        { text: 'Unidad', value: 1 },
                        { text: 'Caja', value: 2 },
                        { text: 'Bolsa', value: 3 },
                        { text: 'Kilo', value: 4 },
                        { text: 'Bulto', value: 5 },
                        { text: 'Paquete', value: 6 },
                        { text: 'Hectárea', value: 7 },
                        { text: 'Metro', value: 8 },
                        { text: 'Arroba', value: 9 },
                      ]"
                      label="Unidad"
                      clearable
                      hide-details
                      v-model="form.unidad2_vta"
                      return-object
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="d-flex">
                  <v-col class="d-flex" cols="4">
                    <v-autocomplete
                      label="3._Clasificación"
                      v-model="form.clasifica3_vta"
                      :items="clasifica"
                      :item-text="format_clasifica"
                      item-value="codigo_clas"
                      hide-details
                      return-object
                    ></v-autocomplete>
                  </v-col>

                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dia Inicial"
                      clearable
                      v-model="form.dia3_ini_vta"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Dia Final"
                      clearable
                      v-model="form.dia3_fin_vta"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Valor"
                      clearable
                      v-model="form.valor3_vta"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-select
                      :items="[
                        { text: 'Unidad', value: 1 },
                        { text: 'Caja', value: 2 },
                        { text: 'Bolsa', value: 3 },
                        { text: 'Kilo', value: 4 },
                        { text: 'Bulto', value: 5 },
                        { text: 'Paquete', value: 6 },
                        { text: 'Hectárea', value: 7 },
                        { text: 'Metro', value: 8 },
                        { text: 'Arroba', value: 9 },
                      ]"
                      label="Unidad"
                      clearable
                      hide-details
                      v-model="form.unidad3_vta"
                      return-object
                    ></v-select>
                  </v-col>
                </v-row>

                  <v-row class="d-flex">
                    <v-col class="d-flex" cols="4">
                      <v-autocomplete
                        label="4._Clasificación"
                        v-model="form.clasifica4_vta"
                        :items="clasifica"
                        :item-text="format_clasifica"
                        item-value="codigo_clas"
                        hide-details
                        return-object
                      ></v-autocomplete>
                    </v-col>

                    <v-col class="d-flex" cols="2">
                      <v-text-field
                        label="Dia Inicial"
                        clearable
                        v-model="form.dia4_ini_vta"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="2">
                      <v-text-field
                        label="Dia Final"
                        clearable
                        v-model="form.dia4_fin_vta"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="2">
                      <v-text-field
                        label="Valor"
                        clearable
                        v-model="form.valor4_vta"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="2">
                      <v-select
                        :items="[
                          { text: 'Unidad', value: 1 },
                          { text: 'Caja', value: 2 },
                          { text: 'Bolsa', value: 3 },
                          { text: 'Kilo', value: 4 },
                          { text: 'Bulto', value: 5 },
                          { text: 'Paquete', value: 6 },
                          { text: 'Hectárea', value: 7 },
                          { text: 'Metro', value: 8 },
                          { text: 'Arroba', value: 9 },
                        ]"
                        label="Unidad"
                        clearable
                        hide-details
                        v-model="form.unidad4_vta"
                        return-object
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-row class="d-flex">
                    <v-col class="d-flex" cols="4">
                      <v-autocomplete
                        label="5._Clasificación"
                        v-model="form.clasifica5_vta"
                        :items="clasifica"
                        :item-text="format_clasifica"
                        item-value="codigo_clas"
                        hide-details
                        return-object
                      ></v-autocomplete>
                    </v-col>

                    <v-col class="d-flex" cols="2">
                      <v-text-field
                        label="Dia Inicial"
                        clearable
                        v-model="form.dia5_ini_vta"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="2">
                      <v-text-field
                        label="Dia Final"
                        clearable
                        v-model="form.dia5_fin_vta"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="2">
                      <v-text-field
                        label="Valor"
                        clearable
                        v-model="form.valor5_vta"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex" cols="2">
                      <v-select
                        :items="[
                          { text: 'Unidad', value: 1 },
                          { text: 'Caja', value: 2 },
                          { text: 'Bolsa', value: 3 },
                          { text: 'Kilo', value: 4 },
                          { text: 'Bulto', value: 5 },
                          { text: 'Paquete', value: 6 },
                          { text: 'Hectárea', value: 7 },
                          { text: 'Metro', value: 8 },
                          { text: 'Arroba', value: 9 },
                        ]"
                        label="Unidad"
                        clearable
                        hide-details
                        v-model="form.unidad5_vta"
                        return-object
                      ></v-select>
                    </v-col>
                  </v-row>

              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card color="basil" flat> </v-card>
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
      clasifica: [],
      unidades: [
        { text: "Unidad", value: 1 },
        { text: "Caja", value: 2 },
        { text: "Bolsa", value: 3 },
        { text: "Kilo", value: 4 },
        { text: "Bulto", value: 5 },
        { text: "Paquete", value: 6 },
        { text: "Hectárea", value: 7 },
        { text: "Metro", value: 8 },
        { text: "Arroba", value: 9 },
      ],
      search: "",
      form: {},
      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Id", align: "left", value: "idases" },
        {
          text: "Primer Apellido",
          align: "left",
          value: "apell1_ases",
        },
        {
          text: "Segundo Apellido",
          align: "left",
          value: "apell2_ases",
        },
        { text: "Nombres", align: "left", value: "nombres_ases" },

        { text: "Correo", align: "center", value: "correo_ases" },
        { text: "Estado", align: "center", value: "estado_ases" },
        { text: "Opciones", value: "edit", align: "center" },
      ],
      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
      },
      card_estado: false,
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
    this.cargarTablaclasifica();
    this.get_ruts3();
  },
  computed: {},
  methods: {
    cargarTablaclasifica: function () {
      post
        .postData({
          url: "Financiero/dlls/CfClasificaJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.clasifica = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clasificación",
            estado: true,
          });
        });
    },
    format_clasifica(val) {
      return `${val.codigo_clas} - ${val.descripcion_clas}`;
    },
    editar_item(data) {
      let item = JSON.parse(JSON.stringify(data));
      console.log(data);

      this.show2 = false;
      var busqueda_id = this.ruts3.find(
        (el) => el.identificacion_rut == item.idases
      );
      this.form.colabora = busqueda_id;

      var busqagencia = this.agencias.find(
        (el) => el.codigo_agc == item.agencia_ases
      );
      this.form.punto_fact = busqagencia;

      var busq_clas1 = this.clasifica.find(
        (el) => el.codigo_clas == item.clasif1_ases
      );
      this.form.clasifica1 = busq_clas1;

      var busq_clas2 = this.clasifica.find(
        (el) => el.codigo_clas == item.clasif2_ases
      );
      this.form.clasifica2 = busq_clas2;

      var busq_clas3 = this.clasifica.find(
        (el) => el.codigo_clas == item.clasif3_ases
      );
      this.form.clasifica3 = busq_clas3;

      var busq_clas4 = this.clasifica.find(
        (el) => el.codigo_clas == item.clasif4_ases
      );
      this.form.clasifica4 = busq_clas4;

      var busq_clas = this.clasifica.find(
        (el) => el.codigo_clas == item.clasif5_ases
      );
      this.form.clasifica5 = busq_clas;

      busq_clas = this.clasifica.find(
        (el) => el.codigo_clas == item.clasif1_vta_ases
      );
      this.form.clasifica1_vta = busq_clas;

      busq_clas = this.clasifica.find(
        (el) => el.codigo_clas == item.clasif2_vta_ases
      );
      this.form.clasifica2_vta = busq_clas;

      busq_clas = this.clasifica.find(
        (el) => el.codigo_clas == item.clasif3_vta_ases
      );
      this.form.clasifica3_vta = busq_clas;

      busq_clas = this.clasifica.find(
        (el) => el.codigo_clas == item.clasif4_vta_ases
      );
      this.form.clasifica4_vta = busq_clas;

      busq_clas = this.clasifica.find(
        (el) => el.codigo_clas == item.clasif5_vta_ases
      );
      this.form.clasifica5_vta = busq_clas;

      this.form.dia1_ini = parseInt(item.dia1_ini_ases);
      this.form.dia2_ini = parseInt(item.dia2_ini_ases);
      this.form.dia3_ini = parseInt(item.dia3_ini_ases);
      this.form.dia4_ini = parseInt(item.dia4_ini_ases);
      this.form.dia5_ini = parseInt(item.dia5_ini_ases);      

      this.form.dia1_ini_vta = parseInt(item.dia1_ini_vta_ases);
      this.form.dia2_ini_vta = parseInt(item.dia2_ini_vta_ases);
      this.form.dia3_ini_vta = parseInt(item.dia3_ini_vta_ases);
      this.form.dia4_ini_vta = parseInt(item.dia4_ini_vta_ases);
      this.form.dia5_ini_vta = parseInt(item.dia5_ini_vta_ases);      

      this.form.dia1_fin = parseInt(item.dia1_fin_ases);
      this.form.dia2_fin = parseInt(item.dia2_fin_ases);
      this.form.dia3_fin = parseInt(item.dia3_fin_ases);
      this.form.dia4_fin = parseInt(item.dia4_fin_ases);
      this.form.dia5_fin = parseInt(item.dia5_fin_ases);      

      this.form.dia1_fin_vta = parseInt(item.dia1_fin_vta_ases);
      this.form.dia2_fin_vta = parseInt(item.dia2_fin_vta_ases);
      this.form.dia3_fin_vta = parseInt(item.dia3_fin_vta_ases);
      this.form.dia4_fin_vta = parseInt(item.dia4_fin_vta_ases);
      this.form.dia5_fin_vta = parseInt(item.dia5_fin_vta_ases);      

      this.form.valor1 = parseFloat(item.valor1_ases.trim());
      this.form.valor2 = parseFloat(item.valor2_ases.trim());
      this.form.valor3 = parseFloat(item.valor3_ases.trim());
      this.form.valor4 = parseFloat(item.valor4_ases.trim());
      this.form.valor5 = parseFloat(item.valor5_ases.trim());

      this.form.valor1_vta = parseFloat(item.valor1_vta_ases.trim());
      this.form.valor2_vta = parseFloat(item.valor2_vta_ases.trim());
      this.form.valor3_vta = parseFloat(item.valor3_vta_ases.trim());
      this.form.valor4_vta = parseFloat(item.valor4_vta_ases.trim());
      this.form.valor5_vta = parseFloat(item.valor5_vta_ases.trim());

      var busq_unidad1 = this.unidades.find(
        (el) => el.value == parseInt(item.unidad1_ases)
      );
      this.form.unidad1 = busq_unidad1;

      var busq_unidad2 = this.unidades.find(
        (el) => el.value == parseInt(item.unidad2_ases)
      );
      this.form.unidad2 = busq_unidad2;

      var busq_unidad3 = this.unidades.find(
        (el) => el.value == parseInt(item.unidad3_ases)
      );
      this.form.unidad3 = busq_unidad3;

      var busq_unidad4 = this.unidades.find(
        (el) => el.value == parseInt(item.unidad4_ases)
      );
      this.form.unidad4 = busq_unidad4;

      var busq_unidad5 = this.unidades.find(
        (el) => el.value == parseInt(item.unidad5_ases)
      );
      this.form.unidad5 = busq_unidad5;

      let busq_unidad = this.unidades.find(
        (el) => el.value == parseInt(item.unidad1_vta_ases)
      );
      this.form.unidad1_vta = busq_unidad;

      busq_unidad = this.unidades.find(
        (el) => el.value == parseInt(item.unidad2_vta_ases)
      );
      this.form.unidad2_vta = busq_unidad;

      busq_unidad = this.unidades.find(
        (el) => el.value == parseInt(item.unidad3_vta_ases)
      );
      this.form.unidad3_vta = busq_unidad;

      busq_unidad = this.unidades.find(
        (el) => el.value == parseInt(item.unidad4_vta_ases)
      );
      this.form.unidad4_vta = busq_unidad;

      busq_unidad = this.unidades.find(
        (el) => el.value == parseInt(item.unidad5_vta_ases)
      );
      this.form.unidad5_vta = busq_unidad;


      this.dialogo.estado = true;
      this.dialogo.titulo = "Modificar Registro";
      this.dialogo.tipo = 1;
    },
    format_punto_fact: function (val) {
      return `${val.codigo_agc} - ${val.descripcion_agc}`;
    },

    guardar: function () {
      console.log(this.form);
      let colabora = this.form.colabora
        ? this.form.colabora.identificacion_rut
        : "0";
      if (colabora > 0) {
        this.format_envio();
      } else {
        this.send_error("Debe Seleccionar un Asesor");
      }
    },
    format_envio() {
      this.card_estado = true;
      let colabora = this.form.colabora
        ? this.form.colabora.identificacion_rut
        : "0";
      let agencia = this.form.punto_fact.codigo_agc;
      let clasifica1 = this.form.clasifica1 ? this.form.clasifica1.codigo_clas : 0;
      let clasifica2 = this.form.clasifica2 ? this.form.clasifica2.codigo_clas : 0;
      let clasifica3 = this.form.clasifica3 ? this.form.clasifica3.codigo_clas : 0;
      let clasifica4 = this.form.clasifica4 ? this.form.clasifica4.codigo_clas : 0;
      let clasifica5 = this.form.clasifica5 ? this.form.clasifica5.codigo_clas : 0;

      let dia1_ini = this.form.dia1_ini ? this.form.dia1_ini : 0;
      let dia2_ini = this.form.dia2_ini ? this.form.dia2_ini : 0;
      let dia3_ini = this.form.dia3_ini ? this.form.dia3_ini : 0;
      let dia4_ini = this.form.dia4_ini ? this.form.dia4_ini : 0;
      let dia5_ini = this.form.dia5_ini ? this.form.dia5_ini : 0;

      let dia1_fin = this.form.dia1_fin ? this.form.dia1_fin : 0;
      let dia2_fin = this.form.dia2_fin ? this.form.dia2_fin : 0;
      let dia3_fin = this.form.dia3_fin ? this.form.dia3_fin : 0;
      let dia4_fin = this.form.dia4_fin ? this.form.dia4_fin : 0;
      let dia5_fin = this.form.dia5_fin ? this.form.dia5_fin : 0;

      let valor1 = this.form.valor1 ? this.form.valor1 : 0;
      let valor2 = this.form.valor2 ? this.form.valor2 : 0;
      let valor3 = this.form.valor3 ? this.form.valor3 : 0;
      let valor4 = this.form.valor4 ? this.form.valor4 : 0;
      let valor5 = this.form.valor5 ? this.form.valor5 : 0;

      let unidad1 = this.form.unidad1 ? this.form.unidad1.value : 0;
      let unidad2 = this.form.unidad2 ? this.form.unidad2.value : 0;
      let unidad3 = this.form.unidad3 ? this.form.unidad3.value : 0;
      let unidad4 = this.form.unidad4 ? this.form.unidad4.value : 0;
      let unidad5 = this.form.unidad5 ? this.form.unidad5.value : 0;

      let clasifica1_vta = this.form.clasifica1_vta ? this.form.clasifica1_vta.codigo_clas : 0;
      let clasifica2_vta = this.form.clasifica2_vta ? this.form.clasifica2_vta.codigo_clas : 0;
      let clasifica3_vta = this.form.clasifica3_vta ? this.form.clasifica3_vta.codigo_clas : 0;
      let clasifica4_vta = this.form.clasifica4_vta ? this.form.clasifica4_vta.codigo_clas : 0;
      let clasifica5_vta = this.form.clasifica5_vta ? this.form.clasifica5_vta.codigo_clas : 0;

      let dia1_ini_vta = this.form.dia1_ini_vta ? this.form.dia1_ini_vta : 0;
      let dia2_ini_vta = this.form.dia2_ini_vta ? this.form.dia2_ini_vta : 0;
      let dia3_ini_vta = this.form.dia3_ini_vta ? this.form.dia3_ini_vta : 0;
      let dia4_ini_vta = this.form.dia4_ini_vta ? this.form.dia4_ini_vta : 0;
      let dia5_ini_vta = this.form.dia5_ini_vta ? this.form.dia5_ini_vta : 0;

      let dia1_fin_vta = this.form.dia1_fin_vta ? this.form.dia1_fin_vta : 0;
      let dia2_fin_vta = this.form.dia2_fin_vta ? this.form.dia2_fin_vta : 0;
      let dia3_fin_vta = this.form.dia3_fin_vta ? this.form.dia3_fin_vta : 0;
      let dia4_fin_vta = this.form.dia4_fin_vta ? this.form.dia4_fin_vta : 0;
      let dia5_fin_vta = this.form.dia5_fin_vta ? this.form.dia5_fin_vta : 0;

      let valor1_vta = this.form.valor1_vta ? this.form.valor1_vta : 0;
      let valor2_vta = this.form.valor2_vta ? this.form.valor2_vta : 0;
      let valor3_vta = this.form.valor3_vta ? this.form.valor3_vta : 0;
      let valor4_vta = this.form.valor4_vta ? this.form.valor4_vta : 0;
      let valor5_vta = this.form.valor5_vta ? this.form.valor5_vta : 0;

      let unidad1_vta = this.form.unidad1_vta ? this.form.unidad1_vta.value : 0;
      let unidad2_vta = this.form.unidad2_vta ? this.form.unidad2_vta.value : 0;
      let unidad3_vta = this.form.unidad3_vta ? this.form.unidad3_vta.value : 0;
      let unidad4_vta = this.form.unidad4_vta ? this.form.unidad4_vta.value : 0;
      let unidad5_vta = this.form.unidad5_vta ? this.form.unidad5_vta.value : 0;



      let estado = this.form.estado ? 0 : 1;
      let eliminar = this.form.eliminar ? 1 : 0;

      var datos = {
        url: "Financiero/dlls/CfAsesor.dll",
        data:
          sessionStorage.Sesion +
          "|" +
          colabora +
          "|" +
          agencia +
          "|" +
          clasifica1 +
          "|" +
          dia1_ini +
          "|" +
          dia1_fin +
          "|" +
          valor1 +
          "|" +
          unidad1 +
          "|" +
          clasifica2 +
          "|" +
          dia2_ini +
          "|" +
          dia2_fin +
          "|" +
          valor2 +
          "|" +
          unidad2 +
          "|" +
          clasifica3 +
          "|" +
          dia3_ini +
          "|" +
          dia3_fin +
          "|" +
          valor3 +
          "|" +
          unidad3 +
          "|" +
          clasifica4 +
          "|" +
          dia4_ini +
          "|" +
          dia4_fin +
          "|" +
          valor4 +
          "|" +
          unidad4 +
          "|" +
          clasifica5 +
          "|" +
          dia5_ini +
          "|" +
          dia5_fin +
          "|" +
          valor5 +
          "|" +
          unidad5 +
          "|" +
          clasifica1_vta +
          "|" +
          dia1_ini_vta +
          "|" +
          dia1_fin_vta +
          "|" +
          valor1_vta +
          "|" +
          unidad1_vta +
          "|" +
          clasifica2_vta +
          "|" +
          dia2_ini_vta +
          "|" +
          dia2_fin_vta +
          "|" +
          valor2_vta +
          "|" +
          unidad2_vta +
          "|" +
          clasifica3_vta +
          "|" +
          dia3_ini_vta +
          "|" +
          dia3_fin_vta +
          "|" +
          valor3_vta +
          "|" +
          unidad3_vta +
          "|" +
          clasifica4_vta +
          "|" +
          dia4_ini_vta +
          "|" +
          dia4_fin_vta +
          "|" +
          valor4_vta +
          "|" +
          unidad4_vta +
          "|" +
          clasifica5_vta +
          "|" +
          dia5_ini_vta +
          "|" +
          dia5_fin_vta +
          "|" +
          valor5_vta +
          "|" +
          unidad5_vta +
          "|" +
          estado +
          "|" +
          eliminar +
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
          url: "Financiero/dlls/CfAsesorJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.contenido = [];
          this.contenido = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al cargar registro",
            estado: true,
          });
        });
    },
    format_ruts(val) {
      return `${parseInt(val.identificacion_rut) || 0} - ${
        val.descripcion_rut ? val.descripcion_rut.trim() : ""
      }`;
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
