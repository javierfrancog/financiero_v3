<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1400"
        elevation="13"
        :style="styleObject"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 "
                >mdi-account-box-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Activación de Clientes</v-list-item-title
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
                <v-icon right dark class="ml-4">mdi-plus-box</v-icon>
              </v-btn>
              <!-- <v-btn
                color="green darken-1"
                class="ml-3 white--text px-6"
                @click="imprimir_excel"
                large
                depressed
              >
                Generar EXCEL
                <v-icon right dark>mdi-file-excel-box</v-icon>
              </v-btn> -->
              <v-btn
                color="orange darken-1"
                class="mt-2 ml-3 white--text px-6"
                @click="consolidar()"
                large
                depressed
              >
                Consolidar Consumos
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
              item-key="identificacion"
              :search="search"
            >
              <template v-slot:item.edit="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="editar_item(item)"
                      color="#337DFF"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="get_docs(item)"
                      color="purple"
                      fab
                      small
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-abjad-arabic</v-icon>
                    </v-btn>
                  </template>
                  <span>Cargar Doc.Electronicos</span>
                </v-tooltip>
              </template>

              <template v-slot:item.identificacion="{ item }">
                {{ parseInt(item.identificacion) }}
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo.estado" persistent max-width="1300px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">{{ dialogo.titulo }}</span>
          <div class="d-flex justify-end" style="width: 100%">
            <v-btn
              class="ma-2 px-4 white--text"
              color="red"
              depressed
              large
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
          </div>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-sheet elevation="6">
            <v-tabs
              v-model="tab"
              bg-color="red"
              next-icon="mdi-arrow-right-bold-box-outline"
              prev-icon="mdi-arrow-left-bold-box-outline"
              show-arrows
            >
              <v-tab>Información Básica</v-tab>
              <v-tab>Activación Servicios</v-tab>
              <v-tab>Facturación</v-tab>
              <v-tab>Info Dian</v-tab>
              <v-tab>Cargue Logo</v-tab>
              <v-tab>Certificado</v-tab>
              <v-tab>Otros Procesos</v-tab>
              <v-tab>Info Emisión</v-tab>
            </v-tabs>
          </v-sheet>
          <v-divider color="orange"></v-divider>
          <v-tabs-items v-model="tab">
            <!-- Información Básica -->
            <v-tab-item>
              <v-card class="mt-3" color="basil" flat>
                <v-row class="d-flex mt-3">
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="[
                        { text: 'Nit', value: 31 },
                        { text: 'Cedula', value: 13 },
                        { text: 'Cedula Extranjeria', value: 22 },
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
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Nro Identificación"
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
                  <v-col
                    class="d-flex justify-center align-center"
                    cols="12"
                    sm="2"
                  >
                    <v-text-field
                      label="D.V."
                      clearable
                      outlined
                      type="text"
                      required
                      v-model="form.dv"
                      :error="errores.dv"
                      @input="errores.dv = false"
                      hide-details
                    ></v-text-field>
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
                <v-row v-if="form.tipoid == 13">
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
                <v-row v-if="form.tipoid == 31">
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

                  <!-- <v-col class="d-flex" cols="12" sm="8">
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
                  </v-col> -->
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="12" sm="4">
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
                    <v-text-field
                      label="Teléfono"
                      clearable
                      outlined
                      v-model="form.telefono"
                      :error="errores.telefono"
                      @input="errores.telefono = false"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="2">
                    <v-autocomplete
                      label="Dpto"
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
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="16" sm="4">
                    <v-text-field
                      label="Nombre Contacto"
                      clearable
                      outlined
                      v-model="form.contacto"
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
                      :error="errores.correo"
                      @change="errores.correo = false"
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="tipo_empresas"
                      label="Tipo Empresa"
                      outlined
                      clearable
                      hide-details
                      v-model="form.tipo_emp"
                      required
                      return-object
                      :error="errores.tipo_emp"
                      @change="errores.tipo_emp = false"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="tipo_puc"
                      label="Plan de Cuentas"
                      outlined
                      clearable
                      hide-details
                      v-model="form.puc"
                      required
                      return-object
                      :error="errores.puc"
                      @change="errores.puc = false"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      v-model="form.codhab"
                      label="Codigo Habilitacion"
                      outlined
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="prov_fact"
                      label="Proveedor Facturación"
                      outlined
                      clearable
                      hide-details
                      return-object
                      v-model="form.provfact"
                      required
                      :rules="validField"
                      :error="errores.provfact"
                      @change="errores.provfact = false"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="prov_nom"
                      label="Proveedor Nómina"
                      outlined
                      clearable
                      hide-details
                      return-object
                      v-model="form.provnom"
                      required
                      :rules="validField"
                      :error="errores.provnom"
                      @change="errores.provnom = false"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="mt-1">
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      v-model="form.cltoken"
                      label="Cl Token"
                      outlined
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      v-model="form.acctoken"
                      label="Acces Token"
                      outlined
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-btn
                      color="indigo"
                      class="mt-3 white--text px-12"
                      small
                      depressed
                      hide-details
                      @click="generar()"
                    >
                      Solicitar Código
                      <v-icon right dark>mdi-file-upload-outline</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      v-model="form.codactivacion"
                      label="Codigo de Activación"
                      outlined
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Fecha Activación"
                      clearable
                      outlined
                      required
                      disabled
                      v-model="form.factiva"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Fecha Actualización"
                      clearable
                      outlined
                      required
                      disabled
                      v-model="form.fechamod"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <!-- Activación Servicios -->
            <v-tab-item>
              <v-card class="mt-3" color="basil" flat>
                <v-row class="d-flex">
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch
                      v-model="form.financ"
                      label="Financiero"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch
                      v-model="form.mcias"
                      label="Mercancías"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch
                      v-model="form.gth"
                      label="G.Talento Humano"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row class="d-flex">
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch
                      v-model="form.imagenol"
                      label="Imagenología"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch
                      v-model="form.hclinica"
                      label="Historia Clinica"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch
                      v-model="form.ssalud"
                      label="Servicios de Salud"
                    ></v-switch>
                  </v-col>
                </v-row>

                <v-row class="d-flex">
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch
                      v-model="form.industrial"
                      label="Industrial"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch
                      v-model="form.servdom"
                      label="S.Publicos Domiciliarios"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch v-model="form.hseq" label="Hseq"></v-switch>
                  </v-col>
                </v-row>
                <v-row class="d-flex">
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch
                      v-model="form.phorizontal"
                      label="P.Horizontal"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch
                      v-model="form.plazos"
                      label="Ventas a Plazos"
                    ></v-switch>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-switch
                      v-model="form.trmcias"
                      label="Transporte Mercancias"
                    ></v-switch>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex" cols="6">
                    <v-select
                      :items="tiposerv"
                      label="Tipo de Servicio"
                      outlined
                      clearable
                      v-model="form.tservicio"
                      return-object
                      required
                      :error="errores.tservicio"
                      @change="
                        select_modulo();
                        errores.tservicio = false;
                      "
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      v-model="form.iddrive"
                      label="Id. Google Drive"
                      outlined
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <!-- Facturación -->
            <v-tab-item>
              <v-card class="mt-3" color="basil" flat>
                <v-row class="mt-3">
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="cargue_prod"
                      label="Cargue Productos"
                      outlined
                      clearable
                      hide-details
                      return-object
                      v-model="form.cargueprod"
                      required
                      :error="errores.cargueprod"
                      @change="errores.cargueprod = false"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="cuotas"
                      label="Cuotas"
                      outlined
                      clearable
                      hide-details
                      return-object
                      v-model="form.cuotas"
                      required
                      :error="errores.cuotas"
                      @change="errores.cuotas = false"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="listas_prec"
                      label="Listas de Precios"
                      outlined
                      clearable
                      hide-details
                      return-object
                      v-model="form.listas"
                      required
                      :rules="validField"
                      :error="errores.listas"
                      @change="errores.listas = false"
                    ></v-select>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      v-model="form.infoica"
                      label="Información Ica"
                      outlined
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="formatofact"
                      label="Formato Factura"
                      outlined
                      clearable
                      hide-details
                      return-object
                      v-model="form.formatofact"
                      required
                      :error="errores.formatofact"
                      @change="errores.formatofact = false"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-select
                      :items="emisor"
                      label="Tipo Emisor"
                      outlined
                      clearable
                      v-model="form.emisor"
                      required
                      return-object
                      :error="errores.emisor"
                      @change="errores.emisor = false"
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-select
                      :items="regimen"
                      label="Regimen"
                      outlined
                      clearable
                      v-model="form.regimen"
                      return-object
                      required
                      :error="errores.regimen"
                      @change="errores.emisor = false"
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="d-flex mb-3">
                  <v-card-subtitle
                    class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                    >Accesos Sispro
                  </v-card-subtitle>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      v-model="form.cedulasispro"
                      label="Cédula"
                      outlined
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      v-model="form.clavesispro"
                      label="Clave"
                      outlined
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <!-- Info Dian -->
            <v-tab-item>
              <v-row>
                <v-card-subtitle
                  class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0"
                  >Facturación Electrónica
                </v-card-subtitle>
              </v-row>
              <v-card color="basil" flat>
                <v-row class="mt-1">
                  <v-col class="d-flex" cols="10">
                    <v-text-field
                      label="Token Titan"
                      clearable
                      outlined
                      v-model="form.token"
                      :error="errores.token"
                      @input="errores.token = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="5">
                    <v-text-field
                      label="Correo Acuse"
                      clearable
                      outlined
                      required
                      v-model="form.correogmail"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Token Correo"
                      clearable
                      outlined
                      v-model="form.tokengmail"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4">
                    <v-text-field
                      label="Host"
                      clearable
                      outlined
                      required
                      v-model="form.host"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-select
                      :items="estado_fact"
                      label="Estado Facturación"
                      outlined
                      clearable
                      hide-details
                      return-object
                      v-model="form.estfact"
                      required
                      :rules="validField"
                      :error="errores.estfact"
                      @change="errores.estfact = false"
                    ></v-select>
                  </v-col>

                  <v-col sm="3" cols="3">
                    <v-select
                      :items="[
                        { text: 'Factura', value: 1 },
                        // { text: 'Nota Debito', value: 2 },
                        // { text: 'Nota Credito', value: 3 },
                      ]"
                      label="Documento"
                      outlined
                      clearable
                      return-object
                      hide-details
                      v-model="form.tipodoc"
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Nro Sett"
                      type="number"
                      clearable
                      outlined
                      required
                      v-model="form.nrodoc"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-btn
                      color="indigo"
                      class="ma-1 white--text"
                      large
                      depressed
                      target="_blank"
                      @click="get_enviardian"
                    >
                      Enviar Set Pruebas
                      <v-icon right dark class="ml-4">mdi-check</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12">
                    <v-text-field
                      label="Respuesta Pruebas"
                      clearable
                      outlined
                      filled
                      v-model="form.rptadian"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-btn
                      color="orange"
                      class="ma-1 white--text px-12"
                      large
                      depressed
                      hide-details
                      @click="grabar_dian()"
                    >
                      Registrar Server_Dian
                      <v-icon right dark>mdi-file-upload-outline</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-btn
                      color="green"
                      class="ml-5 ma-1 white--text px-12"
                      large
                      depressed
                      hide-details
                      @click="resoluciones_dian()"
                    >
                      Resoluciones Registradas
                      <v-icon right dark>mdi-file-upload-outline</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col class="d-flex" cols="12">
                    <v-data-table
                      v-if="contenido_dian.length != 0"
                      :headers="header_dian"
                      :items="contenido_dian"
                      :single-expand="singleExpand"
                    >
                      <template v-slot:item.edit="{ item }">
                        <v-btn
                          fab
                          small
                          depressed
                          color="red"
                          class="white--text"
                          @click="eliminarResolucion(item)"
                        >
                          <v-icon>mdi-delete-empty</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>

                <v-divider color="orange"></v-divider>
                <v-row class="mt-1">
                  <v-card-subtitle
                    class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-3 mx-0"
                    >Factura
                  </v-card-subtitle>

                  <v-col class="d-flex" cols="5">
                    <v-text-field
                      label="Id Dian"
                      clearable
                      outlined
                      required
                      v-model="form.iddian"
                      :error="errores.iddian"
                      @input="errores.iddian = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Pin Dian"
                      clearable
                      outlined
                      required
                      v-model="form.pindian"
                      :error="errores.pindian"
                      @input="errores.pindian = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-btn
                      color="purple"
                      class="ma-1 white--text px-12"
                      large
                      depressed
                      hide-details
                      @click="grabar_iddian(1)"
                    >
                      Registrar
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row>
                  <v-card-subtitle
                    class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-3 mx-0"
                    >Test.Fac
                  </v-card-subtitle>

                  <v-col class="d-flex" cols="5">
                    <v-text-field
                      label="Test_Id Dian"
                      clearable
                      outlined
                      required
                      v-model="form.idtestdian"
                      :error="errores.idtestdian"
                      @input="errores.idtestdian = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-card-subtitle
                    class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-3 mx-0"
                    >Doc.Sop
                  </v-card-subtitle>
                  <v-col class="d-flex" cols="5">
                    <v-text-field
                      label="Id Dian DSP"
                      clearable
                      outlined
                      required
                      v-model="form.iddiandsp"
                      :error="errores.iddiandsp"
                      @input="errores.iddiandsp = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Pin Dian Dsp"
                      clearable
                      outlined
                      required
                      v-model="form.pindiandsp"
                      :error="errores.pindiandsp"
                      @input="errores.pindiandsp = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-btn
                      color="purple"
                      class="ma-1 white--text px-12"
                      large
                      depressed
                      hide-details
                      @click="grabar_iddian(3)"
                    >
                      Registrar
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider color="orange"></v-divider>
                <v-row class="mt-1">
                  <v-card-subtitle
                    class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-3 mx-0"
                    >Nómina
                  </v-card-subtitle>
                  <v-col class="d-flex" cols="5">
                    <v-text-field
                      label="Id Dian Nómina"
                      clearable
                      outlined
                      required
                      v-model="form.iddiannomina"
                      :error="errores.iddiannomina"
                      @input="errores.iddiannomina = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Pin Dian Nómina"
                      clearable
                      outlined
                      required
                      v-model="form.pindiannomina"
                      :error="errores.pindiannomina"
                      @input="errores.pindiannomina = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-text-field
                      label="Id Test Nómina"
                      clearable
                      outlined
                      required
                      v-model="form.idtestnomina"
                      :error="errores.idtestnomina"
                      @input="errores.idtestnomina = false"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="estado_fact"
                      label="Estado Nómina"
                      outlined
                      clearable
                      hide-details
                      return-object
                      v-model="form.estnom"
                      required
                      :rules="validField"
                      :error="errores.estnom"
                      @change="errores.estnom = false"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-divider class="mt-2" color="orange"></v-divider>

                <v-row class="mt-1">
                  <v-col class="d-flex" cols="3">
                    <v-btn
                      color="purple"
                      class="ma-1 white--text px-12"
                      large
                      depressed
                      hide-details
                      @click="grabar_iddian(2)"
                    >
                      Paso 1 -Registrar-Nomina
                    </v-btn>
                  </v-col>
                  <v-col class="d-flex ml-8" cols="2">
                    <v-text-field
                      label="Incremento"
                      clearable
                      outlined
                      required
                      v-model="form.incremnom"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <!-- <v-col class="d-flex" cols="3">
                    <v-btn
                      color="orange"
                      class="ma-1 white--text px-12"
                      large
                      depressed
                      hide-details
                      @click="send_test_nom(2)"
                    >
                      Paso 2 -Set Pruebas-NOMINA-
                    </v-btn>
                  </v-col> -->
                </v-row>
                <v-divider class="mt-2" color="orange"></v-divider>
                <v-row class="mt-1">
                  <v-card-subtitle
                    class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-3 mx-0"
                    >Doc. Equivalente -Pos-
                  </v-card-subtitle>
                  <v-col class="d-flex" cols="5">
                    <v-text-field
                      label="Id Doc.Equivalente-Pos-"
                      clearable
                      outlined
                      required
                      v-model="form.iddianpos"
                      :error="errores.iddianpos"
                      @input="errores.iddianpos = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Pin Doc.Equivalente-Pos-"
                      clearable
                      outlined
                      required
                      v-model="form.pindianpos"
                      :error="errores.pindianpos"
                      @input="errores.pindianpos = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="5">
                    <v-text-field
                      label="Id Test Doc.Equivalente-Pos-"
                      clearable
                      outlined
                      required
                      v-model="form.idtestpos"
                      :error="errores.idtestpos"
                      @input="errores.idtestpos = false"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-select
                      :items="estado_pos"
                      label="Estado Doc.Equivalente-Pos-"
                      outlined
                      clearable
                      hide-details
                      return-object
                      v-model="form.estpos"
                      required
                      :rules="validField"
                      :error="errores.estpos"
                      @change="errores.estpos = false"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="mt-1">
                  <!-- <v-col class="d-flex" cols="3">
                    <v-btn
                      color="purple"
                      class="ma-1 white--text px-12"
                      large
                      depressed
                      hide-details
                      @click="grabar_iddian(4)"
                    >
                      Paso 1 -Registrar-POS-
                    </v-btn>
                  </v-col> -->
                  <v-col class="d-flex ml-3" cols="2">
                    <v-text-field
                      label="Incremento"
                      clearable
                      outlined
                      required
                      v-model="form.incrempos"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="3">
                    <v-btn
                      color="orange"
                      class="ma-1 white--text px-12"
                      large
                      depressed
                      hide-details
                      @click="send_test_pos"
                    >
                      Paso 2 -Set Pruebas-POS-
                    </v-btn>
                  </v-col>
                </v-row>

                <v-divider color="orange"></v-divider>

                <!-- <v-row>
                  <v-card-subtitle
                    class="
                      subtitle-1
                      font-weight-medium
                      grey--text
                      text--darken-2
                      ma-0
                      mx-0
                      text--center
                    "
                    >Documento Soporte
                  </v-card-subtitle>
                </v-row> -->
                <!-- <v-row>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      label="Id Dian"
                      clearable
                      outlined
                      required
                      v-model="form.iddiandoc"
                      :error="errores.iddiandoc"
                      @input="errores.iddiandoc = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      label="Token Titan"
                      clearable
                      outlined
                      v-model="form.tokendoc"
                      :error="errores.tokendoc"
                      @input="errores.tokendoc = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row> -->

                <!-- <v-row>
                  <v-col class="d-flex" cols="12" sm="3">
                    <v-text-field
                      label="Pin Dian"
                      clearable
                      outlined
                      required
                      v-model="form.pindiandoc"
                      :error="errores.pindiandoc"
                      @input="errores.pindiandoc = false"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row> -->
                <v-divider color="succes"></v-divider>
              </v-card>
            </v-tab-item>

            <!-- Cargue Logo -->
            <v-tab-item>
              <v-card class="mt-2" color="basil" flat>
                <v-divider color="orange"></v-divider>
                <v-row class="mt-1 ml-1">
                  <v-card-subtitle
                    class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0 text--center"
                    >Cargue Logo
                  </v-card-subtitle>
                </v-row>
                <v-row class="mb-3 ml-1">
                  <v-col class="d-flex" cols="4">
                    <v-file-input
                      label="Cargar Logo"
                      accept=".png"
                      outlined
                      hide-details
                      v-model="img_actual"
                    ></v-file-input>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="4">
                    <v-btn
                      color="indigo"
                      class="ma-1 white--text px-12"
                      large
                      depressed
                      hide-details
                      @click="reg_logo()"
                    >
                      Registrar Logo
                      <v-icon right dark>mdi-file-upload-outline</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row class="mt-5 ml-1">
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
                <v-row class="mt-1 ml-1">
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
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <!-- firma -->
            <v-tab-item>
              <v-card color="basil" flat>
                <v-divider color="orange"></v-divider>
                <v-row>
                  <v-card-subtitle
                    class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0 text--center"
                    >Firma Electrónica
                  </v-card-subtitle>
                </v-row>
                <v-row>
                  <!-- <v-col class="d-flex" cols="4">
                    <v-file-input
                      label="Cargar Certificado"
                      accept=".p12"
                      outlined
                      hide-details
                      multiple
                      v-model="file_certificado"
                    ></v-file-input>
                  </v-col>
 -->
                  <v-col class="d-flex" cols="12">
                    <v-textarea
                      outlined
                      clearable
                      label="Firma B64"
                      v-model="form.firma"
                      counter="10000"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row class="d-flex mb-2">
                  <v-col cols="4">
                    <v-text-field
                      label="Clave Firma"
                      clearable
                      outlined
                      required
                      v-model="form.clavefirma"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="3">
                    <v-menu
                      v-model="pickerFiniccert"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="form.fecha_inicert"
                          label="Fecha Expedicion Certificado"
                          append-icon="event"
                          hide-details
                          outlined
                          v-on="on"
                          @change="errores.fechacert = false"
                          :error="errores.fechacert"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.fecha_inicert"
                        @input="pickerFiniccert = false"
                        @change="calcular_vence()"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      label="Vence"
                      clearable
                      outlined
                      required
                      v-model="form.fecha_fincert"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="d-flex mb-2">
                  <v-col class="d-flex" cols="3">
                    <v-btn
                      color="purple"
                      class="ma-1 white--text px-12"
                      large
                      depressed
                      hide-details
                      @click="enviar_certificado()"
                    >
                      Registrar Certificado
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <!-- otros Procesos -->
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-card-subtitle
                    class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0 text--center"
                    >Numeracion Facturacion
                  </v-card-subtitle>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Agencia"
                      clearable
                      outlined
                      required
                      v-model="form.agenciafact"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="2">
                    <v-text-field
                      label="Prefijo"
                      clearable
                      outlined
                      required
                      v-model="form.prefijofact"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-text-field
                      label="Ultimo numero"
                      clearable
                      outlined
                      v-model="form.nrofact"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="3">
                    <v-btn
                      color="indigo"
                      class="ma-1 white--text"
                      large
                      depressed
                      target="_blank"
                      @click="get_numero"
                    >
                      Grabar Numeracion
                      <v-icon right dark class="ml-4">mdi-check</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider color="orange"></v-divider>
                <v-row>
                  <!-- <v-card-subtitle
                    class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0 text--center"
                    >Convertir Nómina
                  </v-card-subtitle>
                  <v-col class="d-flex" cols="3">
                    <v-btn
                      color="purple"
                      class="ma-1 white--text"
                      large
                      depressed
                      target="_blank"
                      @click="get_nomina"
                    >
                      Procesar
                      <v-icon right dark class="ml-4">mdi-check</v-icon>
                    </v-btn>
                  </v-col> -->

                  <v-card-subtitle
                    class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0 text--center"
                    >Copiar Ruts S.Social
                  </v-card-subtitle>
                  <v-col class="d-flex" cols="3">
                    <v-btn
                      color="purple"
                      class="ma-1 white--text"
                      large
                      depressed
                      target="_blank"
                      @click="get_rutsnomina()"
                    >
                      Procesar
                      <v-icon right dark class="ml-4">mdi-check</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <!-- emision -->
            <v-tab-item>
              <v-card color="basil" flat>
                <v-divider color="orange"></v-divider>
                <v-row>
                  <v-card-subtitle
                    class="subtitle-1 font-weight-medium grey--text text--darken-2 ma-0 mx-0 text--center"
                    >Documento Soporte
                  </v-card-subtitle>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="6">
                    <v-text-field
                      label="Correo Vault"
                      clearable
                      outlined
                      required
                      v-model="form.correovault"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="6">
                    <v-text-field
                      label="Token Vault"
                      clearable
                      outlined
                      v-model="form.tokenvault"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider color="succes"></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-switch
                v-model="form.estado"
                label="Bloqueo por Pago"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-switch
                v-model="form.suspendido"
                label="Servicio Suspendido"
              ></v-switch>
            </v-col>

            <v-col class="d-flex" cols="4">
              <v-switch
                v-model="form.basicos"
                label="Copiar Basicos"
              ></v-switch>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-switch
                v-model="form.perfil"
                label="Copiar Solo Perfil"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import post from "../../methods.js";
import { FlowerSpinner } from "epic-spinners";

export default {
  inject: ["setLoader", "setLoaderText"],
  components: {
    FlowerSpinner,
  },
  data() {
    return {
      loader: false,
      validField: [(v) => !!v || "Campo obligatorio"],
      dialogo: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      styleObject: { border: "2px solid #01579B" },
      dialog: true,
      valid: false,
      dialogPicker: false,
      pickerFecha: false,
      pickerFiniccert: false,
      singleExpand: true,
      cune_ant: 0,
      id_company: 0,
      zipkey: null,
      expanded: [],
      clientes: [],
      listas: [],
      item_select: [],
      contenido: [],
      asesor: [],
      tipoid: null,
      eps: [],
      search: "",
      vendedores: [],
      ciudades_dian: [],
      departamentos: [],
      img_actual: null,
      imagenes: [],
      reglogo: [],
      imagenes_src: [],
      contenido_dian: [],
      imagenbase64: null,
      json_id: [],
      imagenes_subidas: [],
      tiposerv: [
        { text: "Básico", value: 1 },
        { text: "Dsp", value: 2 },
        { text: "Acuse", value: 3 },
        { text: "Facturación", value: 4 },
        { text: "Dsp + Acuse", value: 5 },
        { text: "Dsp + Acuse + Nómina", value: 6 },
        { text: "Dsp + Facturación + Nómina", value: 7 },
        { text: "Dsp + Nómina", value: 8 },
        { text: "Dsp + Facturación", value: 9 },

        { text: "Basico + Clinico", value: 15 },
        { text: "Basico + Molinos", value: 16 },
      ],
      emisor: [
        { text: "Autoretenedor", value: 9 },
        { text: "Agente de Retencion Iva", value: 14 },
        { text: "No Aplica -Otros-", value: 117 },
        { text: "Regimen Simple de Tributacion", value: 112 },
        { text: "Gran Contribuyente", value: 7 },
      ],

      regimen: [
        { text: "Responsable de Iva", value: 1 },
        { text: "No Responsable de Iva", value: 2 },
      ],
      form: {
        tipoid: null,
        tipo_emp: null,
        rptadian: null,
        token: null,
        codactivacion: null,
        clavefirma: null,
        fecha_inicert: null,
        fecha_fincert: null,
      },
      tab: 0,
      headers: [
        { text: "Opciones", value: "edit", align: "center" },

        { text: "Identificacion", align: "center", value: "identificacion" },
        { text: "Descripcion", align: "left", value: "descripcion" },
        { text: "Contacto", align: "center", value: "contacto" },
        { text: "Ciudad", align: "center", value: "ciudad" },
        { text: "Financiero", align: "center", value: "mod_financ" },
        { text: "Mercancias", align: "center", value: "mod_mcias" },
        { text: "Gth", align: "center", value: "mod_gth" },
      ],
      header_dian: [
        { text: "Opciones", value: "edit", align: "center" },
        { text: "Id", align: "center", value: "id" },
        { text: "Tipo", align: "center", value: "type_document_id" },
        { text: "Número Resolucion", align: "center", value: "resolution" },
        { text: "Prefijo", align: "center", value: "prefix" },
        { text: "Inicio Resolucion", align: "center", value: "date_from" },
        { text: "Fin Resolucion", align: "center", value: "date_to" },
        { text: "Número Inicial", align: "center", value: "from" },
        { text: "Número Final", align: "center", value: "to" },
      ],
      errores: {
        tipoid: false,
        numero: false,
        dv: false,
        rsocial: false,
        apellido1: false,
        apellido2: false,
        numero_user: false,
        nombres: false,
        apellido1_user: false,
        apellido2_user: false,
        nombres_user: false,
        direccion: false,
        departamento: false,
        ciudad: false,
        estfact: false,
        telefono: false,
        correo: false,
        contacto: false,
        puc: false,
        cuotas: false,
        telecontacto: false,
        cargueprod: false,
        listas: false,
        provfact: false,
        provnom: false,
        estado: false,
        basicos: false,
        emisor: false,
        regimen: false,
        iddian: false,
        idtestdian: false,
        pindian: false,
        iddiannomina: false,
        pindiannomina: false,
        iddiandsp: false,
        pindiandsp: false,
        pindianpos: false,
        idtestpos: false,
        estpos: false,
        formatofact: false,
        tipo_emp: false,
        estnom: false,
        fechacert: false,
      },
      card_estado: false,
      filterMunicipios: [],
      mostrar_cliente: false,
      tipo_puc: [
        { text: "Comercial", value: 1 },
        { text: "Salud Privado", value: 2 },
      ],
      cargue_prod: [
        { text: "Total", value: 1 },
        { text: "Parcial", value: 2 },
      ],
      estado_fact: [
        { text: "En Produccion", value: 1 },
        { text: "En Test", value: 2 },
      ],
      estado_pos: [
        { text: "En Produccion", value: 1 },
        { text: "En Test", value: 2 },
      ],

      listas_prec: [
        { text: "Lista Unica", value: 1 },
        { text: "Multiples Listas", value: 2 },
      ],
      prov_nom: [
        { text: "Emisión", value: 1 },
        { text: "Ekomercio", value: 2 },
        { text: "Delcop", value: 3 },
        { text: "Titán", value: 4 },
        { text: "Sin Asignar", value: 9 },
      ],
      formatofact: [
        { text: "Titan", value: 1 },
        { text: "G&Ro", value: 2 },
      ],

      prov_fact: [
        { text: "Facse", value: 1 },
        { text: "Emisión", value: 2 },
        { text: "Titán", value: 5 },
        { text: "Sin Asignar", value: 9 },
      ],

      cuotas: [
        { text: "Cuota Unica", value: 1 },
        { text: "Multiples Cuotas", value: 2 },
      ],

      tipo_empresas: [
        { text: "Comercial", value: 1 },
        { text: "Ips", value: 2 },
        { text: "Contador", value: 3 },
        { text: "Sub_Contador", value: 4 },
        { text: "Molino", value: 5 },
        { text: "Srv_Domiciliarios", value: 6 },
      ],
    };
  },
  created() {
    document.title = "Soporte";
    this.cargarcontenido();
    this.cargarCiudades();
    this.form.agenciafact = "0001";
    this.$watch(
      "form.departamento",
      (e) => {
        this.get_municipios();
      },
      { deep: true }
    );
  },
  watch: {
    img_actual: function (val) {
      this.add_img();
    },
  },
  methods: {
    async get_enviardian() {
      this.loader = true;
      let tipo = this.form.tipodoc.value;
      let consecutivo = this.form.nrodoc;
      let token = this.form.token.trim();
      let idtest = this.form.idtestdian.trim();
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        tipo +
        "|" +
        consecutivo +
        "|" +
        token +
        "|";
      let urlconsulta = "Ptovta/dlls/PrTest01J.dll";

      const data = await post.postData({
        url: urlconsulta,
        data: datosEnvio,
        method: "",
      });

      const json = JSON.stringify(data[0]);

      var formData = new FormData();
      formData.append("factura", json);
      formData.append("idtest", idtest);
      const response = await fetch(
        "https://server1ts.net/financiero/inc/api_dian/testelect.titan.php",
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());
      this.zipkey =
        response.ResponseDian.Envelope.Body.SendTestSetAsyncResponse.SendTestSetAsyncResult.ZipKey;

      this.$emit("snack", {
        color: "success",
        text: "Factura Enviada Correctamente",
        estado: true,
      });
      this.validar_zip();
    },
    async validar_zip() {
      let zipkey = this.zipkey;
      this.form.rptadian = "";
      let token = this.form.token.trim();
      var formData = new FormData();
      formData.append("token", token);
      formData.append("zipkey", zipkey);
      const response = await fetch(
        "https://server1ts.net/financiero/inc/valida_fact.php",
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());
      let resdian =
        response.ResponseDian.Envelope.Body.GetStatusZipResponse
          .GetStatusZipResult.DianResponse.StatusDescription;
      this.form.rptadian = resdian;

      // this.$emit("snack", {
      //   color: "success",
      //   text: "Factura Enviada Correctamente",
      //   estado: true,
      // });
    },
    async resoluciones_dian() {
      let token = this.form.token.trim();
      let id_Software = this.form.iddian.trim();

      this.json_id.unshift({
        IDSoftware: id_Software,
      });
      var formData = new FormData();
      formData.append("token", token);
      // formData.append("idSoftware", JSON.stringify(this.json_id[0]));

      const response = await fetch(
        "https://server1ts.net/financiero/inc/api_dian/get_resdian_titan.php",
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());

      let respuesta = response.message.resolutions;
      this.contenido_dian = [];
      this.contenido_dian = respuesta;
    },
    async eliminarResolucion(item) {
      this.contenido_dian = [];

      let idresolucion = parseFloat(item.id);
      let token = this.form.token.trim();

      let item_envio = {
        token: token,
        id: idresolucion,
      };
      const json = JSON.stringify(item_envio);
      var formData = new FormData();
      formData.append("json", json);
      await fetch(
        "https://server1ts.net/financiero/inc/api_dian/elimina_resdian_titan.php",
        {
          method: "POST",
          body: formData,
        }
      ).then((response) => response.json());
      await this.resoluciones_dian();
    },
    updatesoft(json_update) {
      var formData = new FormData();
      formData.append("json", JSON.stringify(json_update));

      let urlphp = "https://server1ts.net//financiero/inc/updatesoft.titan.php";

      fetch(urlphp, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        // this.reg_test_resolucion(tipo)
        .catch((err) => {
          this.send_error("Error al actualizar software");
        });
    },
    get_numero() {
      let sesion = sessionStorage.Sesion;
      let prefijo = this.form.prefijofact.trim();
      let consecutivo = this.form.nrofact;
      let cliente = this.form.numero;
      let ciudad = this.form.ciudad;
      let agencia = this.form.agenciafact.trim();

      let datosEnvio = [sesion, cliente, agencia, prefijo, consecutivo, ciudad];
      this.postData({
        url: "Financiero/dlls/PrNumfact.dll",
        data: datosEnvio.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Numeracion Actualizada Correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.send_error("Error al actualizar numero");
        });
    },
    get_rutsnomina() {
      let sesion = sessionStorage.Sesion;
      let idempresa = parseFloat(this.form.numero);
      let ciudad = this.form.ciudad;

      let datosEnvio = [sesion, idempresa, ciudad];
      this.postData({
        url: "Financiero/dlls/PrUneRuts.dll",
        data: datosEnvio.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Ruts Procesados Correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.send_error("Error al actualizar numero");
        });
    },
    get_nomina() {
      let sesion = sessionStorage.Sesion;
      let idempresa = parseFloat(this.form.numero);
      let ciudad = this.form.ciudad;

      let datosEnvio = [sesion, idempresa, ciudad];
      this.postData({
        url: "Financiero/dlls/PrUneRuts.dll",
        data: datosEnvio.join("|") + "|",
        method: "",
      })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Conversion Generada Correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.send_error("Error al actualizar numero");
        });
    },
    cargarcontenido() {
      this.loader = true;
      post
        .postData({
          url: "Financiero/dlls/PrActivacionJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          let list = JSON.parse(JSON.stringify(data));
          list.pop();
          this.contenido = list.map((el) => {
            if (el.apellido1.trim()) {
              el.descripcion = el.apellido1.trim() + " " + el.nombres.trim();
            }
            return el;
          });
        })
        .catch((err) => {
          console.log("err", err);
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Activaciones",
            estado: true,
          });
        });
    },
    format_descripcion(descripcion) {
      let retornar = {};
      retornar.text = descripcion.nombres;

      return retornar;
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
    get_imagenes(imagen) {
      return new Promise((resolve) => {
        let folder = "D:\\TITAN\\Datos\\Image\\clientes\\";
        var archivo_obj = new FormData();
        archivo_obj.append("ruta", folder + imagen.trim() + ".png");
        fetch("https://server1ts.net//financiero/inc/get.file.php", {
          method: "POST",
          body: archivo_obj,
        })
          .then((res) => res.text())
          .then(resolve);
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
    async get_docs(item) {
      this.loader = true;
      let id = item.identificacion;
      let ciudad = item.ciudad;
      post
        .postData({
          url: "Financiero/dlls/Docselectr01.dll",
          data: sessionStorage.Sesion + "|" + id + "|" + ciudad + "|",
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "indigo",
            text: data[0].msg,
            estado: true,
          });
          this.loader = false;
        })
        .catch((err) => {
          this.loader = false;
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar documentos",
            estado: true,
          });
        });
    },

    editar_item(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.item_select = item;
      let ruta = "Datos/certificados/" + item.identificacion + ".txt";
      // post
      //   .postData({
      //     url: ruta,
      //     data: "",
      //     method: "GET",
      //   })
      let formData = new FormData();
      formData.append("url", ruta);
      formData.append("method", "GET");
      formData.append("data", "");
      fetch("https://server1ts.net//financiero/inc/index.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.text())
        .then((data) => {
          this.form.firma = data;
        })
        .catch((err) => {
          console.log(err);
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar certificado",
            estado: true,
          });
        });

      if (item.nombreArchivo) {
        let _this = this;
        this.get_imagenes(item.nombreArchivo).then((base64) => {
          _this.imagenes_subidas.push({
            url: "data:image/png;base64," + base64,
            index: _this.imagenes_src.length,
            tipo: "IMAGE",
          });
        });
      }
      this.dialogo.estado = true;
      this.dialogo.tipo = 1;
      this.form.tipoid = parseInt(item.tipo);
      this.form.numero = item.identificacion;
      this.form.dv = parseInt(item.dv);
      this.form.apellido1 = item.apellido1.trim();
      this.form.apellido2 = item.apellido2.trim();
      this.form.nombres = item.nombres.trim();
      this.form.direccion = item.direccion.trim();
      this.form.telefono = parseInt(item.telefono);
      this.form.departamento = item.ciudad.substring(0, 2);
      this.form.ciudad = item.ciudad.trim() || null;
      this.form.contacto = item.contacto.trim() || null;
      this.form.correo = item.correo.trim() || null;
      this.form.codhab = item.habilitacion.trim() || "0";
      this.form.rsocial = item.descripcion.trim();
      this.dialogo.titulo = item.descripcion.trim();

      let tipo_empresa = this.tipo_empresas.find(
        (el) => el.value == parseInt(item.tipoemp.trim())
      );
      this.form.tipo_emp = tipo_empresa;

      let tipo_puc = this.tipo_puc.find(
        (el) => el.value == parseInt(item.puc.trim())
      );
      this.form.puc = tipo_puc;

      let cargue_prod = this.cargue_prod.find(
        (el) => el.value == parseInt(item.cargueprod.trim())
      );
      this.form.cargueprod = cargue_prod;

      let cuotas = this.cuotas.find(
        (el) => el.value == parseInt(item.cuotas.trim())
      );
      this.form.cuotas = cuotas;

      let listas_prec = this.listas_prec.find(
        (el) => el.value == parseInt(item.listaspr.trim())
      );
      this.form.listas = listas_prec;

      let prov_fact = this.prov_fact.find(
        (el) => el.value == parseInt(item.provfactura.trim())
      );
      this.form.provfact = prov_fact;

      let estado_fact = this.estado_fact.find(
        (el) => el.value == parseInt(item.estadofe.trim())
      );
      this.form.estfact = estado_fact;

      let prov_nom = this.prov_nom.find(
        (el) => el.value == parseInt(item.provnomina.trim())
      );
      this.form.provnom = prov_nom;

      let formatofact = this.formatofact.find(
        (el) => el.value == parseInt(item.formatofact.trim())
      );
      this.form.formatofact = formatofact;

      let regimen = this.regimen.find(
        (el) => el.value == parseInt(item.regimen.trim())
      );
      this.form.regimen = regimen;

      let emisor = this.emisor.find(
        (el) => el.value == parseInt(item.tpemisor.trim())
      );
      this.form.emisor = emisor;

      let tservicio = this.tiposerv.find(
        (el) => el.value == parseInt(item.tiposervicio.trim())
      );
      this.form.tservicio = tservicio;

      this.form.iddian = item.iddian.trim();
      this.form.iddrive = item.iddrive;
      this.form.idtestdian = item.idtestdian.trim();
      this.form.idtestnomina = item.idtestnomdian.trim();

      this.form.iddiandsp = item.iddspdian.trim();
      this.form.pindiandsp = item.pindspdian.trim();

      this.form.iddiannomina = item.idnomdian.trim();
      this.form.pindiannomina = item.pinnomdian.trim();

      this.form.iddianpos = item.idposdian.trim();
      this.form.idtestpos = item.idtestpos.trim();
      this.form.pindianpos = item.pinpos.trim();
      let estado_pos = this.estado_pos.find(
        (el) => el.value == parseInt(item.estadopos.trim())
      );
      this.form.estpos = estado_pos;

      this.form.pindian = item.pindian;
      this.form.token = item.tokentitan.trim();
      this.form.cedulasispro = parseFloat(item.cedulasispro) || 0;
      this.form.clavesispro = item.passsispro.trim();

      // this.form.iddiandoc = item.iddocdian.trim();
      // this.form.pindiandoc = item.pindocdian;
      // this.form.tokendoc = item.tokendoctitan.trim();

      this.form.tipodoc = 1;
      this.form.nrodoc = 1;

      this.form.financ = item.mod_financ == "1" ? true : false;
      this.form.mcias = item.mod_mcias == "1" ? true : false;
      this.form.gth = item.mod_gth == "1" ? true : false;
      this.form.imagenol = item.mod_gth == "1" ? true : false;
      this.form.hclinica = item.mod_hc == "1" ? true : false;
      this.form.ssalud = item.mod_ssalud == "1" ? true : false;
      this.form.industrial = item.mod_industrial == "1" ? true : false;
      this.form.servdom = item.mod_spdom == "1" ? true : false;
      this.form.hseq = item.mod_hseq == "1" ? true : false;
      this.form.phorizontal = item.mod_phorizontal == "1" ? true : false;
      this.form.plazos = item.mod_plazos == "1" ? true : false;
      this.form.trmcias = item.mod_transmcias == "1" ? true : false;
      this.form.estado = item.estado == "1" ? true : false;
      this.form.suspendido = item.suspendido == "1" ? true : false;

      this.form.acctoken = item.actoken;
      this.form.cltoken = item.cltoken;
      this.form.factiva = item.fecha;
      this.form.fechamod = item.fechamod;

      this.form.codactivacion = item.codactiva;

      this.form.clavefirma = item.clavecert ? item.clavecert.trim() : "";
      this.form.correogmail = item.correogmail.trim();
      this.form.tokengmail = item.tokengmail.trim();
      this.form.host = item.hostcorreo.trim();

      this.form.correovault = item.correovault.trim();
      this.form.tokenvault = item.tokenvault.trim();
      this.form.infoica = item.acticafact.trim();
      this.form.fecha_inicert = item.fechaexpcert;
      this.form.fecha_fincert = item.fechavencecert;

      // this.form.codactivacion = "039538";
      this.get_municipios();
    },
    montar_firma(identificacion) {
      if (identificacion == "000000901289171") {
        this.form.firma =
          "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";
      }
    },
    subir_logo() {
      this.setLoader(true, "Subiendo Logo...");
      const adjunto = this.img_actual;
      let identificacion = parseFloat(this.item_select.identificacion);
      var archivo = new FormData();
      archivo.append("archivo", adjunto);
      archivo.append("nombre_archivo", identificacion);

      fetch("https://server1ts.net/financiero/inc/up.logo.php", {
        method: "POST",
        body: archivo,
      })
        .then((res) => res.json())
        .catch((err) => {
          console.log("-> Error", err);
        })
        .then((res) => {
          console.log("res", res);
        });
    },
    guardar: function () {
      this.validar_envio();
    },
    validar_codigo(codigo) {
      return new Promise((res) => {
        var identificacion = this.form.numero;
        post
          .postData({
            url: "Financiero/dlls/Ruts99.dll",
            data:
              sessionStorage.Sesion + "|" + identificacion + "|" + codigo + "|",
            method: "",
          })
          .then((data) => {
            res(data[0].codigo);
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Activación No Válida",
              estado: true,
            });
          });
      });
    },
    async validar_envio() {
      var data = JSON.parse(JSON.stringify(this.form));
      let imagenes = this.imagenes;
      let codigo = this.form.codactivacion;
      let validar_codigo = await this.validar_codigo(codigo);
      let long_tel = data.telefono.length;
      if (validar_codigo != "true") {
        this.send_error("Código de activación incorrecto");
      } else if (!data.tipoid) {
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
      } else if (!data.telefono) {
        this.errores.telefono = true;
        this.send_error("Debe ingresar un numero Telefónico");
      } else if (!data.departamento) {
        this.errores.departamento = true;
        this.send_error("Debe seleccionar un departamento");
      } else if (!data.ciudad) {
        this.errores.ciudad = true;
        this.send_error("Debe seleccionar una ciudad");
      } else if (!data.puc) {
        this.errores.puc = true;
        this.send_error("Debe seleccionar un tipo de Puc");
      } else if (!data.cargueprod) {
        this.errores.cargueprod = true;
        this.send_error("Debe seleccionar tipo Cargue Productos");
      } else if (!data.cuotas) {
        this.errores.cuotas = true;
        this.send_error("Debe seleccionar tipo de cuotas");
      } else if (!data.listas) {
        this.errores.listas = true;
        this.send_error("Debe seleccionar una Lista de Precios");
      } else if (!data.correo) {
        this.errores.correo = true;
        this.send_error("Debe registrar un correo electronico");
      } else if (!data.provfact) {
        this.errores.provfact = true;
        this.send_error("Debe seleccionar un proveedor electrónico");
      } else if (!data.provnom) {
        this.errores.provnom = true;
        this.send_error("Debe registrar un proveedor electronico");
        // } else if (imagenes.length === 0 && this.imagenes_subidas.length == 0) {
        //   this.send_error("Debe adjuntar archivos");
      } else if (!data.tipo_emp) {
        this.errores.tipo_emp = true;
        this.send_error("Debe seleccionar un tipo de empresa");
      } else {
        this.card_estado = true;
        let nom_plano = "";
        this.format_envio(data, nom_plano);

        // this.subir_archivos(data).then((nom_plano) => {
        //   this.format_envio(data, nom_plano);
        // });
      }
    },
    async format_envio(data, nom_plano = "") {
      let plano = {};
      this.card_estado = true;
      var tipoId = data.tipoid;
      var identificacion = data.numero;
      var digitoVerificacion = data.dv || "";
      var apellido1 = data.apellido1 || "";
      var apellido2 = data.apellido2 || "";
      var nombres = data.nombres || "";
      if (nombres) {
        data.rsocial =
          apellido1.trim() + " " + apellido2.trim() + " " + nombres.trim();
      }
      var rsocial = data.rsocial || "";
      var direccion = data.direccion;
      var telefono = data.telefono;
      var ciudad = data.ciudad;
      var contacto = data.contacto || "";
      var correo = data.correo || "";
      var tipo_emp = data.tipo_emp.value;
      var puc = data.puc.value;
      var codhab = data.codhab || "";
      var cargueprod = data.cargueprod.value;
      var cuotas = data.cuotas.value;
      var listas = data.listas.value;
      var cltoken = data.cltoken ? data.cltoken : "";
      var acctoken = data.acctoken ? data.acctoken : "";
      var codactivacion = data.codactivacion;
      let emisor = data.emisor ? data.emisor.value : "";
      let regimen = data.regimen ? data.regimen.value : "";
      let iddian = data.iddian ? data.iddian : "";
      let idtestdian = data.idtestdian ? data.idtestdian : "";
      let idtestnomdian = data.idtestnomina ? data.idtestnomina : "";
      let pindian = data.pindian ? data.pindian : "";
      let token = data.token ? data.token.trim() : "";
      let clavecert = data.clavefirma ? data.clavefirma.trim() : "";

      let iddiandoc = data.iddiandoc ? data.iddiandoc : "";
      let pindiandoc = data.pindiandoc ? data.pindiandoc : "";
      let tokendoc = data.tokendoc ? data.tokendoc.trim() : "";

      let iddiannomina = data.iddiannomina ? data.iddiannomina : "";
      let pindiannomina = data.pindiannomina ? data.pindiannomina : "";
      let iddiandsp = data.iddsp ? data.iddsp : "";
      let pindiandsp = data.pindsp ? data.pindsp : "";

      let iddianpos = data.iddianpos ? data.iddianpos : "";
      let pindianpos = data.pindianpos ? data.pindianpos : "";
      var estadopos = data.estpos ? data.estpos.value : "";
      let idtestpos = data.idtestpos ? data.idtestpos : "";

      let correogmail = data.correogmail ? data.correogmail : "";
      let tokengmail = data.tokengmail ? data.tokengmail : "";
      let hostcorreo = data.host ? data.host : "";

      let correovault = data.correovault ? data.correovault : "";
      let tokenvault = data.tokengmail ? data.tokenvault : "";

      var financ = data.financ ? "1" : "0";
      var mcias = data.mcias ? "1" : "0";
      var gth = data.gth ? "1" : "0";
      var imagenol = data.imagenol ? "1" : "0";
      var hclinica = data.hclinica ? "1" : "0";
      var ssalud = data.ssalud ? "1" : "0";
      var industrial = data.industrial ? "1" : "0";
      var servdom = data.servdom ? "1" : "0";
      var hseq = data.hseq ? "1" : "0";
      var phorizontal = data.phorizontal ? "1" : "0";
      var plazos = data.plazos ? "1" : "0";
      var trmcias = data.trmcias ? "1" : "0";

      var formatofact = data.formatofact ? data.formatofact.value : "";
      var provfact = data.provfact ? data.provfact.value : "";
      var provnom = data.provnom ? data.provnom.value : "";
      var estadofe = data.estfact ? data.estfact.value : "";
      var basicos = data.basicos ? "1" : "0";
      var perfil = data.perfil ? "1" : "0";
      let tservicio = this.form.tservicio ? this.form.tservicio.value : "10";
      let iddrive = data.iddrive;
      let actica = data.infoica ? data.infoica.trim() : "";
      let cedulasispro = data.cedulasispro ? parseFloat(data.cedulasispro) : "";
      let clavesispro = data.clavesispro ? data.clavesispro.trim() : "0";

      let estado = data.estado ? "1" : "0";
      let suspendido = data.suspendido ? "1" : "0";
      var eliminar = "0";
      var datosEnvio =
        sessionStorage.Sesion +
        "|" +
        tipoId +
        "|" +
        identificacion +
        "|" +
        digitoVerificacion +
        "|" +
        apellido1.trim() +
        "|" +
        apellido2.trim() +
        "|" +
        nombres.trim() +
        "|" +
        rsocial.trim() +
        "|" +
        direccion.trim() +
        "|" +
        telefono +
        "|" +
        ciudad +
        "|" +
        contacto.trim() +
        "|" +
        correo.trim() +
        "|" +
        tipo_emp +
        "|" +
        puc +
        "|" +
        codhab +
        "|" +
        cargueprod +
        "|" +
        cuotas +
        "|" +
        listas +
        "|" +
        cltoken +
        "|" +
        acctoken +
        "|" +
        codactivacion.trim() +
        "|" +
        financ +
        "|" +
        mcias +
        "|" +
        gth +
        "|" +
        provfact +
        "|" +
        provnom +
        "|" +
        eliminar +
        "|" +
        estadofe +
        "|" +
        basicos +
        "|" +
        emisor +
        "|" +
        regimen +
        "|" +
        iddian +
        "|" +
        pindian +
        "|" +
        token +
        "|" +
        iddiandoc +
        "|" +
        pindiandoc +
        "|" +
        tokendoc +
        "|" +
        correogmail +
        "|" +
        tokengmail +
        "|" +
        correovault +
        "|" +
        tokenvault +
        "|" +
        idtestdian +
        "|" +
        hostcorreo +
        "|" +
        tservicio +
        "|" +
        perfil +
        "|" +
        estado +
        "|" +
        clavecert +
        "|" +
        actica +
        "|" +
        formatofact +
        "|" +
        iddiannomina +
        "|" +
        pindiannomina +
        "|" +
        iddiandsp +
        "|" +
        pindiandsp +
        "|" +
        idtestnomdian +
        "|" +
        iddrive +
        "|" +
        iddianpos +
        "|" +
        pindianpos +
        "|" +
        estadopos +
        "|" +
        idtestpos +
        "|" +
        imagenol +
        "|" +
        hclinica +
        "|" +
        ssalud +
        "|" +
        industrial +
        "|" +
        servdom +
        "|" +
        hseq +
        "|" +
        phorizontal +
        "|" +
        plazos +
        "|" +
        trmcias +
        "|" +
        suspendido +
        "|" +
        cedulasispro +
        "|" +
        clavesispro +
        "|";
      post
        .postData({
          url: "Financiero/dlls/PrActivacion.dll",
          data: { importarhtml: datosEnvio, ...plano },
          method: "",
          json: true,
        })
        .then((data) => {
          this.enviar_certificado();
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
          console.error(error);
          this.card_estado = false;
          this.send_error("Error al Activar Cliente");
        });
    },
    async enviar_certificado() {
      if (!this.form.fecha_inicert) {
        this.errores.fechacert = true;
        this.$emit("snack", {
          color: "error",
          text: "Debe registrar la fecha de expedición del Certificado",
          estado: true,
        });
        return;
      }

      let texto_firma = this.form.firma ? this.form.firma.trim() : "";
      let empresa = this.form.numero;
      const archivo = new FormData();
      archivo.append("texto", texto_firma);
      archivo.append("empresa", empresa);

      try {
        const response = await fetch(
          "https://server1ts.net/financiero/services/certificado.php",
          {
            method: "POST",
            body: archivo,
          }
        );

        const res = await response.json();

        if (res && res.success === true) {
          this.$emit("snack", {
            color: "indigo",
            text: "Certificado guardado correctamente.",
            estado: true,
          });
          await this.grabar_fecha_certificado();
          await this.reg_certificado(texto_firma);
        } else {
          this.$emit("snack", {
            color: "error",
            text: "No se pudo guardar el certificado.",
            estado: true,
          });
        }
      } catch (err) {
        console.log("-> Error:", err);
        this.$emit("snack", {
          color: "error",
          text: "Error al guardar el certificado.",
          estado: true,
        });
      }
    },

    async grabar_fecha_certificado() {
      if (!this.form.fecha_inicert) {
        this.errores.fechacert = true;
        this.$emit("snack", {
          color: "error",
          text: "Debe registrar la fecha de expedicion del Certificado",
          estado: true,
        });
        return;
      }
      let fechaini = this.form.fecha_inicert.replace(/-/g, "");
      let fechafin = this.form.fecha_fincert.replace(/-/g, "");
      let passfirma = this.form.clavefirma.trim() || "";
      let identificacion = this.item_select.identificacion;
      post
        .postData({
          url: "Financiero/dlls/PrActivacion03.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            identificacion +
            "|" +
            fechaini +
            "|" +
            fechafin +
            "|" +
            passfirma +
            "|",
          method: "",
        })
        .then((data) => {
          this.$emit("snack", {
            color: "success",
            text: "Fecha de certificado actualizada correctamente",
            estado: true,
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al actualizar fecha de certificado",
            estado: true,
          });
        });
    },
    async reg_certificado(texto_firma) {
      let passfirma = this.form.clavefirma || "";

      let json_env = {
        certificate: texto_firma,
        password: passfirma,
      };
      let formData = new FormData();
      formData.append("json", JSON.stringify(json_env));
      formData.append("token", this.form.token);

      let urlphp =
        "https://server1ts.net//financiero/inc/api_titan/put_certificado.php";

      return fetch(urlphp, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((res) => {
          this.$emit("snack", {
            color: "success",
            text: "Certificado procesado exitosamente.",
            estado: true,
          });
          this.dialogo.estado = false;
          return res;
        })
        .catch((err) => {
          console.log("Error en Registrar Certificado", err);
          this.send_error("Error al Registrar Certificado");
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
        listas: false,
        estado: false,
      };

      this.imagenes_subidas = [];
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
          url: "Molinos/dlls/Cfrutsj.dll",
          data: sessionStorage.Sesion + "|" + "7" + "|",
          method: "",
        })
        .then((data) => {
          this.loader = false;
          this.clientes = JSON.parse(JSON.stringify(data));
          this.clientes.pop();
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
    async grabar_dian() {
      var data = JSON.parse(JSON.stringify(this.form));
      var identificacion = data.numero;
      if (!data.emisor) {
        this.errores.emisor = true;
        this.send_error("Debe seleccionar un tipo de identificación");
      } else if (!data.regimen) {
        this.errores.regimen = true;
        this.send_error("Debe Seleccionar un Regimen");
      } else if (!data.iddian) {
        this.errores.iddian = true;
        this.send_error("Debe ingresar un numero de identificador");
      } else if (!data.pindian) {
        this.errores.pindian = true;
        this.send_error("Debe ingresar un numero de Pin");
      } else {
        try {
          const json_dian = await post.postData({
            url: "Financiero/dlls/PrActivacion01J.dll",
            data: sessionStorage.Sesion + "|" + identificacion + "|",
            method: "",
          });

          let json = json_dian[0];
          json.company.mail_password =
            "BC32H9+WZ0RJedQNnCFNXMCZt6OnhrUp/o0Jmst9DrSV";
          json.company.mail_from_name = "Documentos Electrónicos";
          await this.reg_company(json.company);
          await this.reg_enviroment(json.software);
          await this.reg_software(json.software);
          this.$emit("snack", {
            color: "indigo",
            text: "Registros Actualizados correctamente.",
            estado: true,
          });
        } catch (error) {
          console.error("Error al grabar DIAN", error);
          this.$emit("snack", {
            color: "error",
            text: "Error al grabar información DIAN",
            estado: true,
          });
        }
      }
    },
    async grabar_iddian(tipo) {
      var data = JSON.parse(JSON.stringify(this.form));
      let id_dian = null;
      let idtest_dian = null;
      let pin = null;
      let estado = 0;

      if (tipo == 1) {
        if (!data.iddian) {
          this.errores.iddian = true;
          this.send_error("Debe Registrar el Id DIAN");
        } else if (!data.pindian) {
          this.errores.pindian = true;
          this.send_error("Debe Registrar el Pin DIAN");
        } else {
          id_dian = data.iddian.trim();
          pin = data.pindian.trim();
        }
      } else if (tipo == 2) {
        if (!data.iddiannomina) {
          this.errores.iddiannomina = true;
          this.send_error("Debe Registrar el Id DIAN");
        } else if (!data.pindiannomina) {
          this.errores.pindiannomina = true;
          this.send_error("Debe Registrar el Pin DIAN");
        } else if (!data.estnom) {
          this.errores.estnom = true;
          this.send_error("Debe Seleccionar un Estado de Operación");
        } else {
          id_dian = data.iddiannomina.trim();
          pin = data.pindiannomina.trim();
          idtest_dian = data.idtestnomina ? data.idtestnomina.trim() : "";
          estado = data.estnom ? data.estnom.value : "0";
        }
      } else if (tipo == 3) {
        if (!data.iddiandsp) {
          this.errores.iddiandsp = true;
          this.send_error("Debe Registrar el Id DIAN");
        } else if (!data.pindiandsp) {
          this.errores.pindiandsp = true;
          this.send_error("Debe Registrar el Pin DIAN");
        } else {
          id_dian = data.iddiandsp.trim();
          pin = data.pindiandsp.trim();
        }
      } else if (tipo == 4) {
        if (!data.iddianpos) {
          this.errores.iddianpos = true;
          this.send_error("Debe Registrar el Id DIAN");
        } else if (!data.pindianpos) {
          this.errores.pindianpos = true;
          this.send_error("Debe Registrar el Pin DIAN");
        } else {
          id_dian = data.iddianpos.trim();
          idtest_dian = data.idtestpos.trim();
          pin = data.pindianpos.trim();
          estado = data.estpos ? data.estpos.value : "0";
        }
      }

      let empresa = data.numero.trim();

      try {
        const json_dian = await post.postData({
          url: "Financiero/dlls/PrActivacion02.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            empresa +
            "|" +
            id_dian +
            "|" +
            pin +
            "|" +
            tipo +
            "|" +
            estado +
            "|" +
            idtest_dian +
            "|",
          method: "",
        });
        let json_reg = "";
        let tokendian = data.token;
        let url_envio =
          "https://server1ts.net//financiero/inc/api_dian/put_environment.php";

        if (tipo == 2) {
          json_reg = {
            type_environment_id: 1,
            payroll_type_environment_id: estado,
            idpayroll: id_dian,
            pinpayroll: pin,
          };
          url_envio =
            "https://server1ts.net//financiero/inc/api_dian/put_env_nomina.php";
        }

        if (tipo == 4) {
          json_reg = {
            type_environment_id: 1,
            eqdocs_type_environment_id: estado,
          };
        }

        if (tipo == 2 || tipo == 4) {
          const json_put = JSON.stringify(json_reg);

          let data = new FormData();
          data.append("token", tokendian);
          data.append("json", json_put);
          let response = await fetch(url_envio, {
            method: "POST",
            body: data,
          })
            .then((res) =>
              res.json().catch((err) => {
                this.loader = false;
              })
            )
            .catch((err) => {
              this.loader = false;
              console.error(err);
              this.send_error("Error al registrar Modo de Operación");
            });

          if (tipo == 4) {
            this.reg_pos(tipo);
            this.reg_test_resolucion(tipo);
          }
        }
      } catch (error) {
        console.log(error);
        console.error("Error al Cambiar Entorno");
      }
    },
    async reg_company(company) {
      this.id_company = 0;
      let formData = new FormData();
      formData.append("json", JSON.stringify(company));
      formData.append("token", this.form.token.trim());

      let urlphp =
        "https://server1ts.net//financiero/inc/api_titan/put_company.php";

      return fetch(urlphp, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          this.id_company = data.company.id;

          console.log("Response Reg_Company", this.id_company);
        })
        .catch((err) => {
          console.log("Error en Reg_Company", err);
          this.send_error("Error al registrar empresa");
        });
    },
    async reg_software(software) {
      let url_php = "";

      let formData = new FormData();
      formData.append("json", JSON.stringify(software));
      formData.append("token", this.form.token.trim());
      formData.append("idcompany", this.id_company);
      //formData.append("produccion", this.id_company);

      let urlphp =
        "https://server1ts.net//financiero/inc/api_titan/put_software.php";

      return fetch(urlphp, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .catch((err) => {
          console.log("Error en Reg_Software", err);
          this.send_error("Error al registrar software");
        });
    },
    async reg_enviroment(software) {
      let facturacion = this.form.estfact.value || 2;
      let nomina = 1;
      let docs = 1;

      let json_env = {
        type_environment_id: facturacion,
        payroll_type_environment_id: nomina,
        eqdocs_type_environment_id: docs,
      
      };
      let formData = new FormData();
      formData.append("json", JSON.stringify(json_env));
      formData.append("token", this.form.token.trim());

      let urlphp =
        "https://server1ts.net//financiero/inc/api_titan/put_enviroment.php";

      return fetch(urlphp, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .catch((err) => {
          console.log("Error en Cambiar Entorno", err);
          this.send_error("Error al Cambiar Entorno");
        });
    },
    reg_pos(tipo) {
      var formData = new FormData();
      let token = this.form.token;
      let json_regpos = {
        ideqdocs: this.form.iddianpos,
        pineqdocs: this.form.pindianpos,
      };

      formData.append("json", JSON.stringify(json_regpos));
      formData.append("token", token);

      let urlphp =
        "https://server1ts.net//financiero/inc/api_dian/reg_pos.titan.php";

      fetch(urlphp, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .catch((err) => {
          console.log("Error en Reg_Pos", err);
          this.send_error("Error al rtegistrar pos");
        });
    },
    async reg_test_resolucion(tipo) {
      let tokendian = this.form.token.trim();
      let tipo_doc = 0;
      let prefijo = "";
      if (tipo == 4) {
        tipo_doc = 15;
        prefijo = "EPOS";
      }
      let json = {
        type_document_id: tipo_doc,
        prefix: prefijo,
        resolution: "18760000001",
        resolution_date: "2019-01-19",
        from: 1,
        to: 1000000,
        generated_to_date: 0,
        date_from: "2019-01-19",
        date_to: "2030-01-19",
      };

      const json_put = JSON.stringify(json);

      let data = new FormData();
      data.append("token", tokendian);
      data.append("json", json_put);
      let response = await fetch(
        "https://server1ts.net//financiero/inc/api_dian/put_resdian.php",
        {
          method: "POST",
          body: data,
        }
      )
        .then((res) =>
          res.json().catch((err) => {
            this.loader = false;
          })
        )
        .catch((err) => {
          this.loader = false;
          console.error(err);
          this.send_error("Error al registrar Resolución");
        });
    },
    generar() {
      var data = JSON.parse(JSON.stringify(this.form));

      if (!data.tipoid) {
        this.errores.tipoid = true;
        this.send_error("Debe seleccionar un tipo de identificación");
      } else if (!data.numero) {
        this.errores.numero = true;
        this.send_error("Debe ingresar un numero de identificación");
      } else if (data.tipoid == 31 && !data.rsocial) {
        this.errores.rsocial = true;
        this.send_error("Debe ingresar una razón social");
      } else if (data.tipoid == 13 && !data.apellido1) {
        this.errores.apellido1 = true;
        this.send_error("Debe ingresar el primer apellido");
      } else if (data.tipoid == 13 && !data.nombres) {
        this.errores.nombres = true;
      } else {
        let rsocial =
          data.rsocial || data.nombres.trim() + " " + data.apellido1.trim();

        let identificacion = this.form.numero;
        post
          .postData({
            url: "Financiero/dlls/Ruts99j.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              identificacion +
              "|" +
              rsocial +
              "|",
            method: "",
          })
          .then((data) => {
            var formData = new FormData();
            this.form.codactivacion = data[0].codigo_rep;
            formData.append("codigo", data[0].codigo_rep);
            formData.append("cliente", rsocial);
            fetch("https://server1ts.net//financiero/inc/sms0.php", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.text())
              .then((result) => {
                this.$emit("snack", {
                  color: "success",
                  text: "Código",
                  estado: true,
                });
              });
          })
          .catch((err) => {
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Ruts",
              estado: true,
            });
          });
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.base64String = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    },
    async reg_logo() {
      this.setLoader(true, "Codificando Logo...");
      const pdfBase64 = await this.blobToBase64(this.img_actual);
      this.imagenbase64 = pdfBase64.split(",")[1];

      let urlEnvio = null;
      let token = this.form.token.trim();

      urlEnvio = "https://server1ts.net/financiero/inc/logo_fact.php";

      var formData = new FormData();
      formData.append("token", token);
      formData.append("logo", this.imagenbase64);
      fetch(urlEnvio, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          this.setLoader(false);
          this.subir_logo();
          this.setLoader(false);
          this.$emit("snack", {
            color: "success",
            text: "Logo Registrado con éxito",
            estado: true,
          });
        })
        .catch((error) => {
          this.setLoader(false);

          $this.send_error(error);
        })
        .then((data) => {
          this.setLoader(false);
        });
    },
    send_test_nom(index) {
      let plano = null;
      let token = this.form.token;
      let idtest = this.form.idtestnomina.trim();
      let idempresa = this.form.numero;
      let incremento = this.form.incremnom ? this.form.incremnom : 0;

      let datosEnvio =
        sessionStorage.Sesion +
        "|" +
        token +
        "|" +
        idtest +
        "|" +
        index +
        "|" +
        idempresa +
        "|" +
        this.cune_ant +
        "|" +
        incremento +
        "|";
      post
        .postData({
          url: "Financiero/dlls/RpNomTestJ.dll",
          data: datosEnvio,
          method: "",
        })
        .then((data) => {
          let tipo = data[0].type_document_id;
          let url = null;
          if (tipo == 9) {
            url =
              "https://server1ts.net//financiero/inc/api_dian/titan.nominatest.php";
          } else {
            url =
              "https://server1ts.net//financiero/inc/api_dian/titan.nominatest2.php";
          }
          plano = JSON.stringify(data[0]);
          let consecutivo = data[0].consecutive;
          return new Promise((resolve) => {
            var formData = new FormData();
            formData.append("nomina", plano);
            fetch(url, {
              method: "POST",
              body: formData,
            })
              .then((res) => res.json())
              .then((res) => {
                resolve(res);
                let cune = res.cune;
                let new_index = index + 1;

                if (cune) {
                  if (index == 2 || index == 4 || index == 6) {
                    this.cune_ant = cune;
                  }
                  // this.grabar_cune(consecutivo, cune);
                }
                if (new_index < 10) {
                  index = new_index;
                  this.send_test_nom(index);
                }
              });
          });
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al generar Test",
            estado: true,
          });
        });
    },
    async send_test_pos() {
      let token = this.form.token;
      let idtest = this.form.idtestpos.trim();
      let incremento = this.form.incrempos ? this.form.incrempos : 0;
      let consecutivo = 1 + parseFloat(incremento);
      var datosEnvio =
        sessionStorage.Sesion + "|" + 2 + "|" + consecutivo + "|" + token + "|";
      let urlconsulta = "Ptovta/dlls/PrTest01J.dll";

      const data = await post.postData({
        url: urlconsulta,
        data: datosEnvio,
        method: "",
      });

      const json = JSON.stringify(data[0]);

      var formData = new FormData();
      formData.append("factura", json);
      formData.append("idtest", idtest);
      const response = await fetch(
        "https://server1ts.net/financiero/inc/testposelect.titan.php",
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());
      this.zipkey =
        response.ResponseDian.Envelope.Body.SendTestSetAsyncResponse.SendTestSetAsyncResult.ZipKey;

      this.$emit("snack", {
        color: "success",
        text: "Factura Enviada Correctamente",
        estado: true,
      });
      this.validar_zip();
    },
    send_error(msj) {
      this.$emit("snack", {
        color: "error",
        text: msj,
        estado: true,
      });
    },
    grabar_cune(consecutivo, cune) {
      let idempresa = this.form.numero;
      post
        .postData({
          url: "Financiero/dlls/PrCunetest.dll",
          data:
            sessionStorage.Sesion +
            "|" +
            idempresa +
            "|" +
            consecutivo +
            "|" +
            cune +
            "|",
          method: "",
        })
        .then((data) => {})
        .catch((err) => {
          console.log(err);
          this.loader = false;

          this.$emit("snack", {
            color: "error",
            text: "Error al Grabar cune",
            estado: true,
          });
        });
    },
    select_modulo() {
      let tservicio = this.form.tservicio.value;
      if (tservicio == 1) {
        this.form.financ = true;
        this.form.mcias = true;
        this.form.gth = true;
      } else if (tservicio == 2) {
        this.form.financ = true;
        this.form.mcias = false;
        this.form.gth = false;
      } else if (tservicio == 3) {
        this.form.financ = true;
        this.form.mcias = false;
        this.form.gth = false;
      } else if (tservicio == 4) {
        this.form.financ = false;
        this.form.mcias = true;
        this.form.gth = false;
      } else if (tservicio == 5) {
        this.form.financ = true;
        this.form.mcias = false;
        this.form.gth = false;
      } else if (tservicio == 6) {
        this.form.financ = true;
        this.form.mcias = false;
        this.form.gth = true;
      } else if (tservicio == 7) {
        this.form.financ = true;
        this.form.mcias = true;
        this.form.gth = true;
      } else if (tservicio == 8) {
        this.form.financ = true;
        this.form.mcias = true;
        this.form.gth = true;
      }
    },
    calcular_vence() {
      if (this.form.fecha_inicert) {
        let fecha = this.$moment(this.form.fecha_inicert);
        let dias = 364;
        this.form.fecha_fincert = fecha.add(dias, "days").format("YYYY-MM-DD");
      }
    },

    async consolidar() {
      for (const item of this.contenido) {
        await this.get_docs(item);
      }
    },
    imprimir_excel() {
      let data = this.contenido;
      let data_parse = data;

      let columnas = [
        {
          title: "Identificacion",
          value: "identificacion",
          format: "string",
        },
        {
          title: "Descripción",
          value: "descripcion",
          format: "string",
        },
        {
          title: "Contacto",
          value: "contacto",
          format: "string",
        },
      ];

      let header_format = [
        {
          text: "LISTADO DE ACTIVACIONES",
          bold: true,
          size: 16,
        },
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Listado de Activaciones",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `LISTADO DE ACTIVACIONES-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
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
