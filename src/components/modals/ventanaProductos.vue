<template>
  <v-dialog v-model="dialogo.estado" persistent max-width="1100px">
    <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
      <v-card-title>
        <span class="title col-12">{{ dialogo.titulo }}</span>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-tabs v-model="tab" centered slider-color="green">
          <v-tab>Información Básica</v-tab>
          <v-tab>Información Contable</v-tab>
        </v-tabs>
        <v-divider color="succes"></v-divider>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-card color="basil" flat>
              <v-row>
                <v-col class="d-flex" cols="4" sm="4">
                  <v-text-field
                    label="Codigo"
                    clearable
                    outlined
                    type="text"
                    required
                    counter="15"
                    v-model="form.codigo"
                    :error="errores.codigo"
                    @input="errores.codigo = false"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="8" sm="6">
                  <v-autocomplete
                    label="Clasificación"
                    v-model="form.clasifica"
                    :items="clasifica"
                    :item-text="format_clasifica"
                    item-value="codigo_clas"
                    outlined
                    hide-details
                    :error="errores.clasifica"
                    @change="errores.clasifica = false"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
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
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    label="Código Barras"
                    clearable
                    outlined
                    type="text"
                    v-model="form.barras"
                    counter="15"
                    max
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="12" sm="3">
                  <v-switch v-model="form.vta" label="Activar Venta"></v-switch>
                </v-col>
                <v-col class="d-flex" cols="12" sm="3">
                  <v-switch
                    v-model="form.consumo"
                    hide-details
                    label="Consumo Interno"
                  ></v-switch>
                </v-col>
                <v-col class="d-flex" cols="12" sm="3">
                  <v-switch
                    v-model="form.ppe"
                    hide-details
                    label="Propiedad, Planta y Equipo"
                  ></v-switch>
                </v-col>
                <v-col class="d-flex" cols="12" sm="3">
                  <v-switch
                    v-model="form.invent"
                    hide-details
                    label="Conecta Inventarios"
                  ></v-switch>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="12" sm="3">
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
                    ]"
                    label="Empaque"
                    outlined
                    clearable
                    hide-details
                    v-model="form.empaque"
                  ></v-select>
                </v-col>
                <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Cantidad"
                    clearable
                    outlined
                    type="numeric"
                    required
                    v-model="form.cantempaque"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col
                  class="d-flex"
                  cols="12"
                  sm="3"
                  v-if="this.datosEmpresa.tipoempresa_empr == '05'"
                >
                  <v-select
                    :items="[
                      { text: 'Arroz Paddy', value: 1 },
                      { text: 'Maiz', value: 2 },
                      { text: 'Soya', value: 3 },
                      { text: 'Sorgo', value: 4 },
                      { text: 'Algodón', value: 5 },

                      { text: 'No aplica', value: 0 },
                    ]"
                    label="Asociado a:"
                    outlined
                    clearable
                    hide-details
                    v-model="form.asociado"
                  ></v-select>
                </v-col>
                <v-col class="d-flex" cols="2">
                  <v-text-field
                    label="Factor Cant"
                    clearable
                    outlined
                    type="numeric"
                    required
                    v-model="form.factorcant"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-divider color="#FF6F00"></v-divider>

              <v-row>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-select
                    :items="[
                      { text: 'Iva 19%', value: 19 },
                      { text: 'Iva 16%', value: 16 },
                      { text: 'Iva 5%', value: 5 },
                      { text: 'Iva 0%', value: 0 },
                    ]"
                    label="Tarifa Iva"
                    outlined
                    clearable
                    hide-details
                    v-model="form.tariva"
                    required
                  ></v-select>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-select
                    :items="[
                      { text: '0%', value: 0 },
                      { text: '8%', value: 8 },
                    ]"
                    label="Impoconsumo"
                    outlined
                    clearable
                    hide-details
                    v-model="form.tarcons"
                    required
                  ></v-select>
                </v-col>

                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    label="Base Venta (iva incluido)"
                    clearable
                    outlined
                    type="numeric"
                    required
                    hide-details
                    v-model="form.basevta"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card color="basil" flat>
              <v-row>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-autocomplete
                    label="Cuenta Ventas"
                    v-model="form.ctavtas"
                    :items="datosctas"
                    :item-text="format_ctas"
                    item-value="cod_puc"
                    hide-details
                    outlined
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-autocomplete
                    label="Cuenta Costo"
                    v-model="form.ctacosto"
                    :items="datosctas"
                    :item-text="format_ctas"
                    item-value="cod_puc"
                    hide-details
                    outlined
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-autocomplete
                    label="Cuenta Compras"
                    v-model="form.ctacompra"
                    :items="datosctas"
                    :item-text="format_ctas"
                    item-value="cod_puc"
                    hide-details
                    outlined
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex pb-0" cols="4">
                  <v-autocomplete
                    label="Centro de costos"
                    v-model="form.ccosto"
                    :items="tablaccosto"
                    :item-text="format_ccosto"
                    item-value="llavecentro_cost"
                    hide-details
                    return-object
                    outlined
                    :error="error.ccosto"
                    @change="error.ccosto = false"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-autocomplete
                    label="Débito Depreciación"
                    v-model="form.debdeprec"
                    :items="datosctas"
                    :item-text="format_ctas"
                    item-value="cod_puc"
                    hide-details
                    outlined
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-autocomplete
                    label="Crédito Depreciación"
                    v-model="form.credeprec"
                    :items="datosctas"
                    :item-text="format_ctas"
                    item-value="cod_puc"
                    hide-details
                    outlined
                  ></v-autocomplete>
                </v-col>
              </v-row>

              <v-row>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field
                    label="Vida Util (Meses)"
                    clearable
                    outlined
                    type="numeric"
                    required
                    v-model="form.vida"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card>
          </v-tab-item>
        </v-tabs-items>

        <!-- <v-row sm="12" no-gutters>
              <v-col>
                <v-autocomplete
                  label="Producto Cargue Inventarios"
                  :items="productos"
                  outlined
                  clearable
                  return-object
                  hide-details
                  persistent-hint
                  item-value="codigo_pr"
                  v-model="form.producto"
                  :item-text="format_productos"
                ></v-autocomplete>
              </v-col>
            </v-row>      -->

        <v-divider color="#FF6F00"></v-divider>
        <v-row justify="center">
          <v-col class="d-flex" cols="12" sm="4">
            <v-switch v-model="form.eliminar" label="Eliminar"></v-switch>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-switch v-model="form.bloquear" label="Bloquear"></v-switch>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="light-blue accent-4 white--text"
          class
          @click="cargarTablactas()"
          depressed
          small
        >
          <v-icon size="20" left>mdi-autorenew</v-icon>Refrescar Tablas
        </v-btn>
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
</template>
<script>
export default {
    data (){
        return {
            card_estado: false,
            dialogo: {
                estado: false,
                titulo: null,
                tipo: null
            },
            form: {}
        }
    },
    methods: {
        abrirProductos() {
            this.estado = true
        }
    }
}
</script>