<template>
  <v-layout wrap justify-center class="pa-6" id="rpformrtefte">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-row>
            <v-col>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="headline"
                    >Reporte Información Exógena Dian</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col class="d-flex align-end justify-end">
              <div>
                <v-img
                  src="https://titansoluciones.net/img/dian.png"
                  contain
                  width="250"
                ></v-img>
              </div>
            </v-col>
          </v-row>
        </v-card-title>

        <v-row>
          <v-col class="d-flex" cols="12" sm="3">
            <v-menu
              v-model="pickerMesfin"
              close-on-content-click
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="form.fechafin"
                  label="Fecha de Corte"
                  append-icon="event"
                  hide-details
                  required
                  outlined
                  v-on="on"
                  autocomplete="off"
                  :error="errores.fechafin"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.fechafin"
                scrollable
                no-title
                type="month"
                @input="
                  pickerMes = false;
                  errores.fechafin = false;
                "
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex align-end">
            <v-btn color="red white--text" class @click="validar()" depressed>
              <v-icon size="20" left>mdi-book-outline</v-icon>
              Ver Config Puc
            </v-btn>
          </v-col>
          <v-col class="ml-8 d-flex">
            <v-btn
              color="purple"
              class="mt-4 white--text px-12"
              large
              depressed
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
              @click="balance_exog"
            >
              Balance Exogena
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="mt-1">
          <v-col class="d-flex" cols="12">
            <v-autocomplete
              :items="formatos"
              label="Formato Exógena"
              v-model="form.format_exogena"
              hide-details
              return-object
              clearable
              outlined
              @change="filtrar_conceptos"
            ></v-autocomplete>
          </v-col>

          <v-col class="d-flex" cols="5" v-if="formato_2276 == true">
            <v-switch
              v-model="form.fondo_ces"
              hide-details
              label="Cesantias Consignadas a Fondos ?"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="ml-1 d-flex" cols="2">
            <v-btn
              color="orange"
              class="ma-2 white--text px-12"
              large
              depressed
              @click="generarDian"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Generar
            </v-btn>
          </v-col>

          <v-col class="d-flex" cols="2">
            <v-btn
              color="indigo darken-3 white--text"
              class="ma-2 white--text px-12"
              large
              depressed
              @click="consultarDian"
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
            >
              Consultar
              <v-icon right dark>mdi-file-upload-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col class="ml-0 mr-0 d-flex" cols="2">
            <v-btn
              color="green"
              class="ma-2 white--text px-12"
              large
              depressed
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
              @click="descargar_xml"
            >
              Xml Dian
            </v-btn>
          </v-col>
          <v-col class="ml-0 mr-10 d-flex" cols="2">
            <v-btn
              color="teal lighten-1"
              class="ma-2 white--text px-12"
              large
              depressed
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
              @click="descargar_prev"
            >
              Formato Prevalidador
            </v-btn>
          </v-col>
          <v-col class="ml-8 d-flex" cols="2">
            <v-btn
              color="blue-grey darken-1"
              class="ma-2 white--text px-10"
              large
              depressed
              :loading="btnEnvio.loader"
              :disabled="btnEnvio.disabled"
              @click="descargar_anexo"
            >
              Anexo Contable
            </v-btn>
          </v-col>
        </v-row>

        <v-divider color="#FF6F00"></v-divider>
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
          item-key="index"
          :search="search"
        >
          <template v-slot:item.edit="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="editar_formato(item)"
                  color="indigo accent-3"
                  fab
                  small
                  icon
                  outlined
                  v-on="on"
                  class="mr-2"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
    <v-dialog v-model="dialogo1001.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 1001 -Pagos/Abonos en cuenta y Retenciones
            Practicadas-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                outlined
              >
              </v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Pago/Abono Deducible"
                clearable
                outlined
                required
                v-model="form.pagod"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Pago/Abono No Deducible"
                clearable
                outlined
                required
                v-model="form.pagond"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Iva Costo Deducible"
                clearable
                outlined
                required
                v-model="form.ivactod"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Iva Costo No Deducible"
                clearable
                outlined
                required
                v-model="form.ivactond"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="ReteFte Practicada"
                clearable
                outlined
                required
                v-model="form.retepract"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="ReteFte Asumida"
                clearable
                outlined
                required
                v-model="form.rtefteasum"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="ReteFte Iva Reg.Común"
                clearable
                outlined
                required
                v-model="form.rteivacom"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="ReteFte Iva No Dom."
                clearable
                outlined
                required
                v-model="form.rteivanodom"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_1001"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_1001()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo1001.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_1003.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 1003 -Retenciones en la fuente que le practicaron-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_1003"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_1003"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_1003"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                disabled
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Base"
                clearable
                outlined
                required
                v-model="form.base_1003"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Valor retención"
                clearable
                outlined
                required
                v-model="form.rte_1003"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_1003"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_1003()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_1003.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_1005.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 1005 -Impuesto a las Ventas Descontable-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_1005"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_1005"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_1005"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                disabled
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Imp.Descontable"
                clearable
                outlined
                required
                v-model="form.descontable_1005"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr IVA.Dev"
                clearable
                outlined
                required
                v-model="form.devolucion_1005"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr IVA Gasto/Costo"
                clearable
                outlined
                required
                v-model="form.ivagasto_1005"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_1005"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_1005()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_1005.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogo_1006.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 1006 -Impuesto a las Ventas Generado-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_1006"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_1006"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_1006"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                disabled
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Imp.Generado"
                clearable
                outlined
                required
                v-model="form.generado_1006"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr IVA.Dev"
                clearable
                outlined
                required
                v-model="form.devolucion_1006"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_1006"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_1006()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_1006.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_1007.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12">Formato 1007 -Ingresos Recibidos-</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_1007"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_1007"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_1007"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                disabled
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Ing.Bruto"
                clearable
                outlined
                required
                v-model="form.ingreso_1007"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_1007"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_1007()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_1007.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_1008.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 1008 -Saldo Cuentas por cobrar-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_1008"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_1008"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_1008"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                disabled
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Saldo"
                clearable
                outlined
                required
                v-model="form.saldo_1008"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_1008"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_1008()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_1008.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_1009.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 1009 -Saldo Cuentas por Pagar-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_1009"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_1009"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_1009"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Saldo"
                clearable
                outlined
                required
                v-model="form.saldo_1009"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_1009"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_1009()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_1009.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_1010.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 1010 -Información de Socios/Accionistas-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_1010"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_1010"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_1010"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                disabled
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Saldo"
                clearable
                outlined
                required
                v-model="form.saldo_1010"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="% Participacion"
                clearable
                outlined
                required
                type="text"
                v-model="form.porc_1010"
                v-money="money2"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_1010"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_1010()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_1010.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_1011.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 1011 -Información de las Declaraciones Tributarias-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_1011"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="12">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_1011"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Saldo"
                clearable
                outlined
                required
                v-model="form.saldo_1011"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_1011"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_1011()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_1011.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_1012.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 1012 -Información Declaraciones Tributarias, Aportes e
            inversiones en bonos-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_1012"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_1012"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_1012"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Saldo"
                clearable
                outlined
                required
                v-model="form.saldo_1012"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_1012"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_1012()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_1012.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_2276.estado" persistent max-width="1200px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 2276 -Información Rentas de trabajo y Pensiones-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_2276"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_2276"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
            <v-col class="d-flex" cols="12" sm="4">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_2276"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-tabs v-model="tab" centered slider-color="green">
            <v-tab>Pagos</v-tab>
            <v-tab>Aportes</v-tab>
            <v-tab>Otros Pagos</v-tab>
            <v-tab>Contratos Participación</v-tab>
          </v-tabs>
          <v-divider color="succes"></v-divider>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Salarios"
                      clearable
                      outlined
                      required
                      v-model="form.salario_2276"
                      hide-details
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Emolumentos Ecles."
                      clearable
                      outlined
                      required
                      v-model="form.emolec_2276"
                      hide-details
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Honorarios"
                      clearable
                      outlined
                      required
                      v-model="form.honorarios_2276"
                      hide-details
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Servicios"
                      clearable
                      outlined
                      required
                      v-model="form.servicios_2276"
                      hide-details
                      type="text"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Comisiones"
                      clearable
                      outlined
                      required
                      v-model="form.comisiones_2276"
                      hide-details
                      type="text"
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Prestac.Sociales"
                      clearable
                      outlined
                      required
                      v-model="form.prsocial_2276"
                      hide-details
                      type="text"
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Viaticos"
                      clearable
                      outlined
                      required
                      v-model="form.viaticos_2276"
                      hide-details
                      type="text"
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Gastos Representacion"
                      clearable
                      outlined
                      required
                      v-model="form.gtosrep_2276"
                      hide-details
                      type="text"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Comp.Trabajo Asociativo"
                      clearable
                      outlined
                      required
                      v-model="form.trabajoasoc_2276"
                      hide-details
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Otros Pagos"
                      clearable
                      outlined
                      required
                      v-model="form.otrospagos1_2276"
                      hide-details
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Cesantias"
                      clearable
                      outlined
                      required
                      v-model="form.cesantias_2276"
                      hide-details
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Intereses"
                      clearable
                      outlined
                      required
                      v-model="form.intereses_2276"
                      hide-details
                      type="text"
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Pensiones Jubilacion/vejez"
                      clearable
                      outlined
                      required
                      v-model="form.pensjubi_2276"
                      hide-details
                      type="text"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Aportes Oblig.Salud"
                      clearable
                      outlined
                      required
                      v-model="form.apobsalud_2276"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Aportes Oblig.Pensión"
                      clearable
                      outlined
                      required
                      v-model="form.apobpensión_2276"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Aportes Volunt.Pensión"
                      clearable
                      outlined
                      required
                      v-model="form.apvolpensión_2276"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Aportes Cuentas AFC"
                      clearable
                      outlined
                      required
                      v-model="form.apafc_2276"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Aportes Cuentas AVC"
                      clearable
                      outlined
                      required
                      v-model="form.apavc_2276"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Retención en la Fuente"
                      clearable
                      outlined
                      required
                      v-model="form.rtefte_2276"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Bonos,Cheques,Tarjetas"
                      clearable
                      outlined
                      required
                      v-model="form.bonos_2276"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Apoyos del Estado"
                      clearable
                      outlined
                      required
                      v-model="form.apestado_2276"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Pagos Alim. Mayor 41 UVT"
                      clearable
                      outlined
                      required
                      v-model="form.alimenta1_2276"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Pagos Alim. Hasta 41 UVT"
                      clearable
                      outlined
                      required
                      v-model="form.alimenta2_2276"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card>
                <v-row>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="id_Fideicomiso/contrato"
                      clearable
                      outlined
                      required
                      v-model="form.fideico_2276"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Tipo_id"
                      clearable
                      outlined
                      required
                      v-model="form.tipoid_2276"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="4" sm="3">
                    <v-text-field
                      label="Id.Participante"
                      clearable
                      outlined
                      required
                      v-model="form.idpartic_2276"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_2276"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_2276()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_2276.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_5247.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 5247 -Pagos/Abonos en cuenta y Retenciones
            Practicadas-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_5247"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_5247"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_5247"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                disabled
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Pago/Abono Deducible"
                clearable
                outlined
                required
                v-model="form.pagod_5247"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Pago/Abono No Deducible"
                clearable
                outlined
                required
                v-model="form.pagond_5247"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Iva Costo Deducible"
                clearable
                outlined
                required
                v-model="form.ivactod_5247"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Iva Costo No Deducible"
                clearable
                outlined
                required
                v-model="form.ivactond_5247"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="ReteFte Practicada"
                clearable
                outlined
                required
                v-model="form.retepract_5247"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="ReteFte Asumida"
                clearable
                outlined
                required
                v-model="form.rtefteasum_5247"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="ReteFte Iva Reg.Común"
                clearable
                outlined
                required
                v-model="form.rteivacom_5247"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="ReteFte Iva No Dom."
                clearable
                outlined
                required
                v-model="form.rteivanodom_5247"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_5247"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_5247()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_5247.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_5248.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 5248 -Consorcios Ingresos Recibidos-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_5248"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_5248"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_5248"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                disabled
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Ing.Bruto"
                clearable
                outlined
                required
                v-model="form.ingreso_5248"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_5248"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_5248()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_5248.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_5249.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 5249 -Consorcios Impuesto a las Ventas Descontable-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_5249"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_5249"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_5249"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                disabled
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Imp.Descontable"
                clearable
                outlined
                required
                v-model="form.descontable_5249"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr IVA.Dev"
                clearable
                outlined
                required
                v-model="form.devolucion_5249"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_5249"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_5249()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_5249.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogo_5250.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 5250 -Consorcios Impuesto a las Ventas Generado</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_5250"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_5250"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_5250"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                disabled
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Imp.Generado"
                clearable
                outlined
                required
                v-model="form.generado_5250"
                hide-details
              ></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr IVA.Dev"
                clearable
                outlined
                required
                v-model="form.devolucion_5250"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_5250"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_5250()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_5250.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogo_5251.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 5251 -Saldo Cuentas por cobrar-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_5251"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_5251"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_5251"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                disabled
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Saldo"
                clearable
                outlined
                required
                v-model="form.saldo_5251"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_5251"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_5251()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_5251.estado = false;
              init_form();
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogo_5252.estado" persistent max-width="1000px">
      <v-card class="px-6" :loading="card_estado" :disabled="card_estado">
        <v-card-title>
          <span class="title col-12"
            >Formato 5252 -Saldo Cuentas por Pagar-</span
          >
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="d-flex" cols="8" sm="2">
              <v-text-field
                label="Periodo"
                clearable
                outlined
                type="text"
                required
                disabled
                v-model="form.peredit_5252"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="8">
              <v-autocomplete
                label="Informado"
                v-model="form.informado_5252"
                :items="clientes"
                :item-text="format_clientes"
                hide-details
                return-object
                outlined
                :error="errores.informado"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-autocomplete
                :items="conceptosdian_filtro"
                label="Concepto Exógena"
                v-model="form.concepto_exogena_5252"
                :item-text="format_conceptos"
                item-value="concepto_rep"
                hide-details
                return-object
                disabled
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex" cols="4" sm="3">
              <v-text-field
                label="Vlr Saldo"
                clearable
                outlined
                required
                v-model="form.saldo_5252"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-switch
              v-model="form.eliminar_5252"
              label="Eliminar"
              hide-details
            ></v-switch>
          </v-row>

          <v-divider
            class="mt-6"
            :style="{ 'border-width': '2px', 'border-color': 'orange' }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2 px-4"
            color="success"
            depressed
            large
            @click="guardar_5252()"
            >Guardar</v-btn
          >
          <v-btn
            class="ma-2"
            color="red"
            text
            @click="
              dialogo_5252.estado = false;
              init_form();
            "
            >Cancelar</v-btn
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
      pickerMes: false,
      pickerMesfin: false,
      money0: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false,
      },
      dialogo1001: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_1003: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_1005: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_1006: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_1007: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_1008: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_1009: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_1010: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_1011: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_1012: {
        estado: false,
        titulo: null,
        tipo: null,
      },

      dialogo_2276: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_5247: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_5248: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_5249: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_5250: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_5251: {
        estado: false,
        titulo: null,
        tipo: null,
      },
      dialogo_5252: {
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
      formato_2276: false,
      contenido_bal: [],
      data_excel: [],
      conceptosdian_filtro: [],
      conceptosdian: [],
      clientes: [],
      tab: 0,
      search: "",
      form: {
        pagod: 0,
      },

      headers: [
        { text: "", value: "data-table-expand" },
        { text: "Concepto", align: "center", value: "concepto_rep" },
        { text: "Id Reportado", align: "left", value: "NroId_rep" },
        { text: "Descripcion", align: "left", value: "reportado_rep" },
        { text: "Valor", align: "center", value: "vrlreportado_rep" },
        { text: "Opciones", value: "edit", align: "center" },
      ],

      formatos: [
        {
          text: "Formato 1001 -Pagos/Abonos en cuenta y Retenciones Practicadas-",
          value: 1001,
        },
        {
          text: "Formato 1003 -Retenciones en la fuente que le practicaron-",
          value: 1003,
        },
        {
          text: "Formato 1004 -Descuentos Tributarios Solicitados-",
          value: 1004,
        },
        {
          text: "Formato 1005 -Impuesto a las Ventas Descontable-",
          value: 1005,
        },
        { text: "Formato 1006 -Impuesto a las Ventas Generado", value: 1006 },
        { text: "Formato 1007 -Ingresos Recibidos-", value: 1007 },
        { text: "Formato 1008 -Saldo Cuentas por cobrar-", value: 1008 },
        { text: "Formato 1009 -Saldo Cuentas por Pagar-", value: 1009 },
        {
          text: "Formato 1010 -Información de Socios/Accionistas-",
          value: 1010,
        },
        {
          text: "Formato 1011 -Información de las Declaraciones Tributarias-",
          value: 1011,
        },
        {
          text: "Formato 1012 -Información Declaraciones Tributarias, Aportes e inversiones en bonos-",
          value: 1012,
        },
        {
          text: "Formato 2275 -Ingresos No constitutivos de Renta-",
          value: 2275,
        },
        {
          text: "Formato 2276 -Información Rentas de trabajo y Pensiones-",
          value: 2276,
        },
        {
          text: "Formato 5247 -Consorcios Pagos/Abonos en cuenta y Retenciones Practicadas-",
          value: 5247,
        },
        { text: "Formato 5248 -Consorcios Ingresos Recibidos-", value: 5248 },
        {
          text: "Formato 5249 -Consorcios Impuesto a las Ventas Descontable-",
          value: 5249,
        },
        {
          text: "Formato 5250 -Consorcios Impuesto a las Ventas Generado",
          value: 5250,
        },
        {
          text: "Formato 5251 -Consorcios Saldo Cuentas por cobrar-",
          value: 5251,
        },
        {
          text: "Formato 5252 -Consorcios Saldo Cuentas por Pagar-",
          value: 5252,
        },

        // { text: "Formato 1012", value: 1012 },
      ],

      btnEnvio: {
        loader: false,
        disabled: false,
      },

      errores: {
        codigo: false,
        descripcion: false,
        estado: false,
        fechaini: false,
        fechafin: false,
      },
      card_estado: false,
      estado_porcentaje: false,
      estado_valor: false,
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      money2: {
        decimal: ".",
        thousands: ",",
        precision: 1,
        masked: false,
      },
    };
  },
  created() {
    this.cargarConcDian();
    this.get_Clientes();
  },
  computed: {},
  methods: {
    init_form() {
      this.errores = {
        codigo: false,
      };
    },
    get_Clientes() {
      post
        .postData({
          url: "Financiero/dlls/CfRutsJ.dll",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          // console.log(data)
          this.clientes = data;
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar clientes",
            estado: true,
          });
        });
    },
    format_clientes(val) {
      return `${
        parseInt(val.identificacion_rut) || 0
      } - ${val.descripcion_rut.trim()}`;
    },
    cargarConcDian: function () {
      post
        .postData({
          url: "financiero/dlls/CfConcDianJ.DLL",
          data: sessionStorage.Sesion + "|",
          method: "",
        })
        .then((data) => {
          this.conceptosdian = [];
          this.conceptosdian = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.$emit("snack", {
            color: "error",
            text: "Error al cargar Barrios",
            estado: true,
          });
        });
    },
    format_conceptos(val) {
      return val.concepto_rep + " - " + val.descripcion_rep.trim();
    },
    filtrar_conceptos() {
      let formato = this.form.format_exogena;

      if (formato.value == 2276) {
        this.formato_2276 = true;
      } else {
        this.formato_2276 = false;
      }
      if (formato) {
        this.form.concepto_exogena = null;
        let filtro = this.conceptosdian.filter(
          (el) => el.formato_rep == formato.value
        );
        this.conceptosdian_filtro = filtro;
        this.consultarDian();
      }
    },
    descripcionEstado(estado) {
      return item.estado == "1" ? "Desactivado" : "Activo";
    },
    editar_formato(item) {
      let formato = this.form.format_exogena.value;
      if (formato === 1001) {
        this.editar_1001(item);
      } else if (formato === 1003) {
        this.editar_1003(item);
      } else if (formato === 1005) {
        this.editar_1005(item);
      } else if (formato === 1006) {
        this.editar_1006(item);
      } else if (formato === 1007) {
        this.editar_1007(item);
      } else if (formato === 1008) {
        this.editar_1008(item);
      } else if (formato === 1009) {
        this.editar_1009(item);
      } else if (formato === 1010) {
        this.editar_1010(item);
      } else if (formato === 1011) {
        this.editar_1011(item);
      } else if (formato === 1012) {
        this.editar_1012(item);
      } else if (formato === 2276) {
        this.editar_2276(item);
      } else if (formato === 5247) {
        this.editar_5247(item);
      } else if (formato === 5248) {
        this.editar_5248(item);
      } else if (formato === 5249) {
        this.editar_5249(item);
      } else if (formato === 5250) {
        this.editar_5250(item);
      } else if (formato === 5251) {
        this.editar_5251(item);
      } else if (formato === 5252) {
        this.editar_5252(item);
      }
    },
    editar_1001(data) {
      this.clear_1001();
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo1001.estado = true;
      this.form.eliminar_1001 = false;
      this.form.peredit = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.pagod = this.formatNumero(item.pago_rep.toString());
      this.form.pagond = this.formatNumero(item.pnodeduc_rep.toString());
      this.form.ivactod = this.formatNumero(item.ivadeduc_rep.toString());
      this.form.ivactond = this.formatNumero(item.ivanodeduc_rep.toString());
      this.form.retepract = this.formatNumero(item.rtefte_rep.toString());
      this.form.rtefteasum = this.formatNumero(item.rtefteasum_rep.toString());
      this.form.rteivacom = this.formatNumero(item.rtefteivac_rep.toString());
      this.form.rteivanodom = this.formatNumero(item.rtefteivan_rep.toString());
      var busqueda_informado = this.clientes.find(
        (el) =>
          parseInt(el.identificacion_rut) == parseInt(item.NroId_rep.trim())
      );
      this.form.informado = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena = busqueda_concepto;
    },
    editar_1003(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_1003.estado = true;
      this.form.eliminar_1003 = false;
      this.form.peredit_1003 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.base_1003 = this.formatNumero(item.base_rep.toString());
      this.form.rte_1003 = this.formatNumero(item.retencion_rep.toString());

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_1003 = busqueda_informado;

      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_1003 = busqueda_concepto;
    },
    editar_1005(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_1005.estado = true;
      this.form.eliminar_1005 = false;
      this.form.peredit_1005 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.descontable_1005 = this.formatNumero(
        item.imptogen_rep.toString()
      );
      this.form.devolucion_1005 = this.formatNumero(
        item.devoluc_rep.toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_1005 = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_1005 = busqueda_concepto;
    },
    editar_1006(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_1006.estado = true;
      this.form.eliminar_1006 = false;
      this.form.peredit_1006 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.generado_1006 = this.formatNumero(item.imptogen_rep.toString());
      this.form.devolucion_1006 = this.formatNumero(
        item.devcompras_rep.toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_1006 = busqueda_informado;

      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_1006 = busqueda_concepto;
    },
    editar_1007(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_1007.estado = true;
      this.form.eliminar_1007 = false;
      this.form.peredit_1007 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.ingreso_1007 = this.formatNumero(
        item.vrlreportado_rep.replace(/\,/g, "").toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_1007 = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_1007 = busqueda_concepto;
    },
    editar_1008(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_1008.estado = true;
      this.form.eliminar_1008 = false;
      this.form.peredit_1008 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.saldo_1008 = this.formatNumero(
        item.vrlreportado_rep.replace(/\,/g, "").toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_1008 = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_1008 = busqueda_concepto;
    },
    editar_1009(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_1009.estado = true;
      this.form.eliminar_1009 = false;
      this.form.peredit_1009 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.saldo_1009 = this.formatNumero(
        item.vrlreportado_rep.replace(/\,/g, "").toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_1009 = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_1009 = busqueda_concepto;
    },
    editar_1010(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_1010.estado = true;
      this.form.eliminar_1010 = false;
      this.form.peredit_1010 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.saldo_1010 = this.formatNumero(
        item.vrlreportado_rep.replace(/\,/g, "").toString()
      );
      this.form.porc_1010 = this.formatNumero(
        item.porcentaje_rep.replace(/\,/g, "").toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_1010 = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_1010 = busqueda_concepto;
    },
    editar_1011(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_1011.estado = true;
      this.form.eliminar_1011 = false;
      this.form.peredit_1011 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.saldo_1011 = this.formatNumero(
        item.vrlreportado_rep.replace(/\,/g, "").toString()
      );

      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_1011 = busqueda_concepto;
    },
    editar_1012(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_1012.estado = true;
      this.form.eliminar_1012 = 0;
      this.form.peredit_1012 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.saldo_1012 = this.formatNumero(
        item.vrlreportado_rep.replace(/\,/g, "").toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_1012 = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_1012 = busqueda_concepto;
    },
    editar_2276(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_2276.estado = true;
      this.form.eliminar_2276 = false;
      this.form.peredit_2276 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_2276 = busqueda_informado;

      this.form.salario_2276 = this.formatNumero(
        item.pasa_rep.replace(/\,/g, "").toString()
      );
      this.form.emolec_2276 = this.formatNumero(
        item.paec_rep.replace(/\,/g, "").toString()
      );
      this.form.honorarios_2276 = this.formatNumero(
        item.paho_rep.replace(/\,/g, "").toString()
      );
      this.form.servicios_2276 = this.formatNumero(
        item.pase_rep.replace(/\,/g, "").toString()
      );
      this.form.comisiones_2276 = this.formatNumero(
        item.paco_rep.replace(/\,/g, "").toString()
      );
      this.form.prsocial_2276 = this.formatNumero(
        item.papre_rep.replace(/\,/g, "").toString()
      );
      this.form.viaticos_2276 = this.formatNumero(
        item.pavia_rep.replace(/\,/g, "").toString()
      );
      this.form.gtosrep_2276 = this.formatNumero(
        item.paga_rep.replace(/\,/g, "").toString()
      );
      this.form.trabajoasoc_2276 = this.formatNumero(
        item.patra_rep.replace(/\,/g, "").toString()
      );
      this.form.otrospagos1_2276 = this.formatNumero(
        item.potro_rep.replace(/\,/g, "").toString()
      );
      this.form.cesantias_2276 = this.formatNumero(
        item.cesantias_rep.replace(/\,/g, "").toString()
      );
      this.form.intereses_2276 = this.formatNumero(
        item.interces_rep.replace(/\,/g, "").toString()
      );

      this.form.pensjubi_2276 = this.formatNumero(
        item.peju_rep.replace(/\,/g, "").toString()
      );
      this.form.apobsalud_2276 = this.formatNumero(
        item.apos_rep.replace(/\,/g, "").toString()
      );
      this.form.apobpensión_2276 = this.formatNumero(
        item.apof_rep.replace(/\,/g, "").toString()
      );
      this.form.apvolpensión_2276 = this.formatNumero(
        item.apov_rep.replace(/\,/g, "").toString()
      );
      this.form.apafc_2276 = this.formatNumero(
        item.apafc_rep.replace(/\,/g, "").toString()
      );
      this.form.apavc_2276 = this.formatNumero(
        item.apavc_rep.replace(/\,/g, "").toString()
      );
      this.form.rtefte_2276 = this.formatNumero(
        item.vare_rep.replace(/\,/g, "").toString()
      );
      this.form.bonos_2276 = this.formatNumero(
        item.pabo_rep.replace(/\,/g, "").toString()
      );
      this.form.apestado_2276 = this.formatNumero(
        item.apecofpe_rep.replace(/\,/g, "").toString()
      );
      this.form.alimenta1_2276 = this.formatNumero(
        item.pagamuvt_rep.replace(/\,/g, "").toString()
      );
      this.form.alimenta2_2276 = this.formatNumero(
        item.pagahuvt_rep.replace(/\,/g, "").toString()
      );
      this.form.fideico_2276 = this.formatNumero(
        item.idfideic_rep.replace(/\,/g, "").toString()
      );
      this.form.tipoid_2276 = this.formatNumero(
        item.tipoidct_rep.replace(/\,/g, "").toString()
      );
      this.form.idpartic_2276 = this.formatNumero(
        item.idcontrt_rep.replace(/\,/g, "").toString()
      );

      // this.form.porc_1010 = this.formatNumero(
      //   item.porcentaje_rep.replace(/\,/g, "").toString()
      // );
    },
    editar_5247(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_5247.estado = true;
      this.form.eliminar_5247 = false;
      this.form.peredit_5247 = this.form.fechafin;
      this.form.formatedit_5247 = this.form.format_exogena.text;
      this.form.pagod_5247 = this.formatNumero(item.pago_rep.toString());
      this.form.pagond_5247 = this.formatNumero(item.pnodeduc_rep.toString());
      this.form.ivactod_5247 = this.formatNumero(item.ivadeduc_rep.toString());
      this.form.ivactond_5247 = this.formatNumero(
        item.ivanodeduc_rep.toString()
      );
      this.form.retepract_5247 = this.formatNumero(item.rtefte_rep.toString());
      this.form.rtefteasum_5247 = this.formatNumero(
        item.rtefteasum_rep.toString()
      );
      this.form.rteivacom_5247 = this.formatNumero(
        item.rtefteivac_rep.toString()
      );
      this.form.rteivanodom_5247 = this.formatNumero(
        item.rtefteivan_rep.toString()
      );
      var busqueda_informado = this.clientes.find(
        (el) =>
          parseInt(el.identificacion_rut) == parseInt(item.NroId_rep.trim())
      );
      this.form.informado_5247 = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_5247 = busqueda_concepto;
    },
    editar_5248(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_5248.estado = true;
      this.form.eliminar_5248 = false;
      this.form.peredit_5248 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.ingreso_5248 = this.formatNumero(
        item.vrlreportado_rep.replace(/\,/g, "").toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_5248 = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_5248 = busqueda_concepto;
    },
    editar_5249(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_5249.estado = true;
      this.form.eliminar_5249 = false;
      this.form.peredit_5249 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.descontable_5249 = this.formatNumero(
        item.imptogen_rep.toString()
      );
      this.form.devolucion_5249 = this.formatNumero(
        item.devcompras_rep.toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_5249 = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_5249 = busqueda_concepto;
    },
    editar_5250(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_5250.estado = true;
      this.form.eliminar_5250 = false;
      this.form.peredit_5250 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.generado_5250 = this.formatNumero(item.imptogen_rep.toString());
      this.form.devolucion_5250 = this.formatNumero(
        item.devcompras_rep.toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_5250 = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_5250 = busqueda_concepto;
    },
    editar_5251(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_5251.estado = true;
      this.form.eliminar_5251 = false;
      this.form.peredit_5251 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.saldo_5251 = this.formatNumero(
        item.vrlreportado_rep.replace(/\,/g, "").toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_5251 = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_5251 = busqueda_concepto;
    },
    editar_5252(data) {
      var item = JSON.parse(JSON.stringify(data));
      this.dialogo_5252.estado = true;
      this.form.eliminar_5252 = false;
      this.form.peredit_5252 = this.form.fechafin;
      this.form.formatedit = this.form.format_exogena.text;
      this.form.saldo_5252 = this.formatNumero(
        item.vrlreportado_rep.replace(/\,/g, "").toString()
      );

      var busqueda_informado = this.clientes.find(
        (el) => parseInt(el.identificacion_rut) == parseInt(item.NroId_rep)
      );
      this.form.informado_5252 = busqueda_informado;
      var busqueda_concepto = this.conceptosdian_filtro.find(
        (el) => el.concepto_rep == item.concepto_rep
      );
      this.form.concepto_exogena_5252 = busqueda_concepto;
    },

    descargar_xml() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        var periodo = this.form.fechafin.replace(/\-/g, "");
        var formato = this.form.format_exogena.value;
        let url = `Financiero/dlls/RpDianF${formato}j.dll`;
        post
          .postData({
            url,
            data: sessionStorage.Sesion + "|" + periodo + "|" + formato + "|" + 0 + "|",
            method: "",
          })
          .then((data) => {
            let archivo = data[0].url;
            var formData = new FormData();
            formData.append("ruta", archivo);

            fetch("https://server1ts.net//financiero/inc/get.plano.php", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.text())
              .then((result) => {
                let nombre_archivo = archivo.split("/")[5];
                var xmlContent = result;
                var blob = new Blob([xmlContent], {
                  type: "text/xml",
                });
                var url = URL.createObjectURL(blob);
                var pom = document.createElement("a");
                pom.href = url;
                pom.setAttribute("download", nombre_archivo);
                pom.click();
                this.loader = false;
              });
          });
      }
    },
    descargar_prev() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        var fondoces = this.form.fondo_ces ? "1" : "0";
        var periodo = this.form.fechafin.replace(/\-/g, "");
        var formato = this.form.format_exogena.value;
        let url = `Financiero/dlls/RpDianF${formato}j.dll`;
        this.contenido = [];
        post
          .postData({
            url,
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              "2" +
              "|" +
              fondoces +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.data_excel = JSON.parse(JSON.stringify(data));
            this.contenido = this.data_excel;

            if (formato == "1001") this.print_1001_excel();
            else if (formato == "1003") this.print_1003_excel();
            else if (formato == "1005") this.print_1005_excel();
            else if (formato == "1006") this.print_1006_excel();
            else if (formato == "1007") this.print_1007_excel();
            else if (formato == "1008") this.print_1008_excel();
            else if (formato == "1009") this.print_1009_excel();
            else if (formato == "1010") this.print_1010_excel();
            else if (formato == "1011") this.print_1011_excel();
            else if (formato == "1012") this.print_1012_excel();
            else if (formato == "2276") this.print_2276_excel();
            else if (formato == "5247") this.print_5247_excel();
            else if (formato == "5248") this.print_5248_excel();
            else if (formato == "5249") this.print_5249_excel();
            else if (formato == "5250") this.print_5250_excel();
            else if (formato == "5251") this.print_5251_excel();
            else if (formato == "5252") this.print_5252_excel();
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Reporte",
              estado: true,
            });
          });
      }
    },
    balance_exog() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.contenido_bal = [];
        this.procesar_orden();
      }
    },
    descargar_anexo() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.contenido_bal = [];
        this.procesar_orden_anexo();
      }
    },
    async procesar_orden_anexo() {
      let seccion = 0;
      let tipo = 1;
      let formato = this.form.format_exogena.value;
      if (formato == 2276) {
        this.descargar_prev();
      } else {
        await this.imprimir_balance_anexo(seccion);
      }
    },
    async imprimir_balance_anexo(seccion) {
      this.loader = true;
      var perini = this.form.fechafin.replace(/\-/g, "");
      let perfin = perini;
      let formato = this.form.format_exogena.value;

      return new Promise((res) => {
        post
          .postData({
            url: "Financiero/dlls/RpAnexoDianJ.dll",
            data: sessionStorage.Sesion + "|" + perini + "|" + formato + "|",
            method: "",
          })
          .then(async (data) => {
            this.loader = false;
            this.contenido_bal = JSON.parse(JSON.stringify(data));
            this.imprimir_excel_anexo();
          })
          .catch((err) => {
            res(null);
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Reporte",
              estado: true,
            });
          });
      });
    },
    async procesar_orden() {
      let seccion = 0;
      let tipo = 1;
      if (tipo === 1) {
        seccion = 1;
        await this.imprimir_balance(seccion);
        seccion = 2;
        await this.imprimir_balance(seccion);
        seccion = 3;
        await this.imprimir_balance(seccion);
      } else {
        this.json_1 = await this.imprimir_balance(seccion);
      }
    },
    async imprimir_balance(seccion) {
      this.loader = true;
      var perini = this.form.fechafin.replace(/\-/g, "");
      let perfin = perini;

      return new Promise((res) => {
        post
          .postData({
            url: "Financiero/dlls/RpEstExogenaJ.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              perini +
              "|" +
              perfin +
              "|" +
              5 +
              "|" +
              1 +
              "|" +
              0 +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              seccion +
              "|",
            method: "",
          })
          .then(async (data) => {
            this.loader = false;
            this.contenido_bal = JSON.parse(JSON.stringify(data[0].BALANCE));
            this.imprimir_excel();
          })
          .catch((err) => {
            res(null);
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Reporte",
              estado: true,
            });
          });
      });
    },

    imprimir_excel_anexo() {
      let data = this.contenido_bal;
      data.pop()
      let data_parse = [];
      let perini = this.form.fechafin;
      const safeNumber = (value) => {
        if (typeof value === "string") {
          const cleanedValue = value.replace(/\s+/g, "").replace(/,/g, "");
          const parsedValue = parseFloat(cleanedValue);
          return isNaN(parsedValue) ? 0 : parsedValue;
        }
        return typeof value === "number" ? value : 0;
      };

      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.vrlreportado_rep = safeNumber(el.vrlreportado_rep);
        copia.vrlnoreportado_rep = safeNumber(el.vrlnoreportado_rep);
        data_parse.push(copia);
      });

      let columnas = [
        {
          title: "Cuenta",
          value: "cuenta_rep",
          format: "string",
        },
        {
          title: "Descripción Cuenta",
          value: "descrippuc_rep",
          format: "string",
        },
        {
          title: "Formato",
          value: "Formato1_excel",
          format: "string",
        },
        {
          title: "Concepto",
          value: "Concepto1_excel",
          format: "string",
        },
        {
          title: "Tipo Reporte",
          value: "tipoex1_excel",
          format: "string",
        },

        {
          title: "Valor Reportado",
          value: "vrlreportado_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Descripción Reportado",
          value: "reportado_rep",
          format: "string",
        },

        {
          title: "NO Reportado",
          value: "vrlnoreportado_rep",
          format: "money",
          totalsRowFunction: "sum",
        },
        {
          title: "Descripción No Reportado",
          value: "noreportado_rep",
          format: "string",
        },


      ];
      let formato = this.form.format_exogena.value;
      let header_format = [
        {
          text: `ANEXO EXOGENA FORMATO ${formato}`,
          bold: true,
          size: 16,
        },
        `Periodo :${perini}`,
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Anexo Exogena",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `ANEXO EXOGENA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    imprimir_excel() {
      let data = this.contenido_bal;
      let data_parse = [];
      let perini = this.form.fechafin;
      let perfin = perini;
      data.forEach((el) => {
        let copia = JSON.parse(JSON.stringify(el));
        copia.ant_excel = parseFloat(el.ant_excel.replace(/\,/g, "")) || 0;
        copia.deb_excel = parseFloat(el.deb_excel.replace(/\,/g, "")) || 0;
        copia.cre_excel =
          parseFloat(el.cre_excel.replace(/\,/g, "").trim()) || 0;
        copia.saldo_excel = parseFloat(el.saldo_excel.replace(/\,/g, "")) || 0;

        data_parse.push(copia);
      });

      let columnas = [
        {
          title: "Cuenta",
          value: "CTAPUC",
          format: "string",
        },
        {
          title: "Descripción",
          value: "DESCRIPCION",
          format: "string",
        },
        {
          title: "Saldo",
          value: "saldo_excel",
          format: "money",
        },
        {
          title: "Formato_1",
          value: "Formato1_excel",
          format: "string",
        },
        {
          title: "Concepto_1",
          value: "Concepto1_excel",
          format: "string",
        },
        {
          title: "Reportado_1",
          value: "Rutconcept1",
          format: "string",
        },
        {
          title: "Formato_2",
          value: "Formato2_excel",
          format: "string",
        },
        {
          title: "Concepto_2",
          value: "Concepto2_excel",
          format: "string",
        },
        {
          title: "Reportado_2",
          value: "Rutconcept2",
          format: "string",
        },
      ];

      let header_format = [
        {
          text: "BALANCE VALIDACION EXOGENA",
          bold: true,
          size: 16,
        },
        `Periodo Inicial:${perini}`,
        `Periodo Final:${perfin}`,
        "",
      ];

      let logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Balance Exogena",
            header: header_format,
            logo,
            tabla: {
              columnas,
              totalsRow: false,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `BALANCE EXOGENA-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },

    consultarDian() {
      this.contenido = [];
      this.loader = true;
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        var fondoces = this.form.fondo_ces ? "1" : "0";
        var periodo = this.form.fechafin.replace(/\-/g, "");
        var formato = this.form.format_exogena.value;
        let url = `Financiero/dlls/RpDianF${formato}j.dll`;
        post
          .postData({
            url,
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              "1" +
              "|" +
              fondoces +
              "|",
            method: "",
          })
          .then((data) => {
            data.pop();
            this.loader = false;
            this.contenido = JSON.parse(JSON.stringify(data));
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Reporte",
              estado: true,
            });
          });
      }
    },
    guardar_1001() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo1001.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado.identificacion_rut;
        let concepto = this.form.concepto_exogena
          ? this.form.concepto_exogena.concepto_rep
          : "0000";
        let pagoded = this.form.pagod.replace(/\,/g, "");
        let pagonded = this.form.pagond.replace(/\,/g, "");
        let ivactod = this.form.ivactod.replace(/\,/g, "");
        let ivactond = this.form.ivactond.replace(/\,/g, "");
        let retepract = this.form.retepract.replace(/\,/g, "");
        let reteasum = this.form.rtefteasum.replace(/\,/g, "");
        let reteivacom = this.form.rteivacom.replace(/\,/g, "");
        let rteivanodom = this.form.rteivanodom.replace(/\,/g, "");
        let eliminar = this.form.eliminar_1001 ? "1" : "0";
        this.form.eliminar_1001 = 0;
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              pagoded +
              "|" +
              pagonded +
              "|" +
              ivactod +
              "|" +
              ivactond +
              "|" +
              retepract +
              "|" +
              reteasum +
              "|" +
              reteivacom +
              "|" +
              rteivanodom +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_1003() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_1003.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_1003.identificacion_rut;
        let concepto = this.form.concepto_exogena_1003.concepto_rep;
        let base_1003 = this.form.base_1003.replace(/\,/g, "");
        let rte_1003 = this.form.rte_1003.replace(/\,/g, "");
        let eliminar = this.form.eliminar_1003 ? "1" : "0";
        this.form.eliminar_1003 = 0;
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              base_1003 +
              "|" +
              rte_1003 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_1003();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_1005() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_1005.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_1005.identificacion_rut;
        let concepto = this.form.concepto_exogena_1005.concepto_rep;
        let descontable_1005 = this.form.descontable_1005.replace(/\,/g, "");
        let devolucion_1005 = this.form.devolucion_1005.replace(/\,/g, "");
        let eliminar = this.form.eliminar_1005 ? "1" : "0";
        this.form.eliminar_1005 = 0;
        let base_1003 = 0;
        let rte_1003 = 0;
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +              
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_1005();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            console.log(err)
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_1006() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_1006.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_1006.identificacion_rut;
        let concepto = this.form.concepto_exogena_1006.concepto_rep;
        let generado_1006 = this.form.generado_1006.replace(/\,/g, "");
        let devolucion_1006 = this.form.devolucion_1006.replace(/\,/g, "");
        let eliminar = this.form.eliminar_1006 ? "1" : "0";
        this.form.eliminar_1006 = 0;
        let base_1003 = 0;
        let rte_1003 = 0;
        let descontable_1005 = 0;
        let devolucion_1005 = 0;

        this.loader = true;
        
        post
        .postData({
            url: "Financiero/dlls/RpExogDian1005M.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              base_1003 +
              "|" +
              rte_1003 +
              "|" +
              descontable_1005 +
              "|" +
              devolucion_1005 +
              "|" +
              generado_1006 +
              "|" +
              devolucion_1006 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_1006();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_1007() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_1007.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_1007.identificacion_rut;
        let concepto = this.form.concepto_exogena_1007.concepto_rep;
        let ingreso_1007 = this.form.ingreso_1007.replace(/\,/g, "");
        let eliminar = this.form.eliminar_1007 ? "1" : "0";
        this.form.eliminar_1007 = 0;
        let base_1003 = 0;
        let rte_1003 = 0;
        let descontable_1005 = 0;
        let devolucion_1005 = 0;
        let generado_1006 = 0;
        let devolucion_1006 = 0;

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              base_1003 +
              "|" +
              rte_1003 +
              "|" +
              descontable_1005 +
              "|" +
              devolucion_1005 +
              "|" +
              generado_1006 +
              "|" +
              devolucion_1006 +
              "|" +
              ingreso_1007 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_1007();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_1008() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_1008.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_1008.identificacion_rut;
        let concepto = this.form.concepto_exogena_1008.concepto_rep;
        let saldo_1008 = this.form.saldo_1008.replace(/\,/g, "");
        let eliminar = this.form.eliminar_1008 ? "1" : "0";
        this.form.eliminar_1008 = 0;
        let base_1003 = 0;
        let rte_1003 = 0;
        let descontable_1005 = 0;
        let devolucion_1005 = 0;
        let generado_1006 = 0;
        let devolucion_1006 = 0;
        let ingreso_1007 = 0;
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              base_1003 +
              "|" +
              rte_1003 +
              "|" +
              descontable_1005 +
              "|" +
              devolucion_1005 +
              "|" +
              generado_1006 +
              "|" +
              devolucion_1006 +
              "|" +
              ingreso_1007 +
              "|" +
              saldo_1008 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_1008();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_1009() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_1009.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_1009.identificacion_rut;
        let concepto = this.form.concepto_exogena_1009.concepto_rep;
        let saldo_1009 = this.form.saldo_1009.replace(/\,/g, "");
        let eliminar = this.form.eliminar_1009 ? "1" : "0";
        this.form.eliminar_1009 = 0;
        let base_1003 = 0;
        let rte_1003 = 0;
        let descontable_1005 = 0;
        let devolucion_1005 = 0;
        let generado_1006 = 0;
        let devolucion_1006 = 0;
        let ingreso_1007 = 0;
        let saldo_1008 = 0;
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              base_1003 +
              "|" +
              rte_1003 +
              "|" +
              descontable_1005 +
              "|" +
              devolucion_1005 +
              "|" +
              generado_1006 +
              "|" +
              devolucion_1006 +
              "|" +
              ingreso_1007 +
              "|" +
              saldo_1008 +
              "|" +
              saldo_1009 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_1009();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_1010() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_1010.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_1010.identificacion_rut;
        let concepto = "0000";
        let saldo_1010 = this.form.saldo_1010.replace(/\,/g, "");
        let porc_1010 = this.form.porc_1010.replace(/\,/g, "");
        let eliminar = this.form.eliminar_1010 ? "1" : "0";
        this.form.eliminar_1010 = 0;
        let base_1003 = 0;
        let rte_1003 = 0;
        let descontable_1005 = 0;
        let devolucion_1005 = 0;
        let generado_1006 = 0;
        let devolucion_1006 = 0;
        let ingreso_1007 = 0;
        let saldo_1008 = 0;
        let saldo_1009 = 0;

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              base_1003 +
              "|" +
              rte_1003 +
              "|" +
              descontable_1005 +
              "|" +
              devolucion_1005 +
              "|" +
              generado_1006 +
              "|" +
              devolucion_1006 +
              "|" +
              ingreso_1007 +
              "|" +
              saldo_1008 +
              "|" +
              saldo_1009 +
              "|" +
              saldo_1010 +
              "|" +
              porc_1010 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_1010();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_1011() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_1011.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let concepto = this.form.concepto_exogena_1011.concepto_rep;
        let saldo_1011 = this.form.saldo_1011.replace(/\,/g, "");
        let eliminar = this.form.eliminar_1011 ? "1" : "0";
        // this.form.eliminar_1011 = false;
        console.log(eliminar);
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM1011.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              saldo_1011 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_1011();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_1012() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_1012.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_1012.identificacion_rut;
        let concepto = this.form.concepto_exogena_1012.concepto_rep;
        let saldo_1012 = this.form.saldo_1012.replace(/\,/g, "");
        let eliminar = this.form.eliminar_1012 ? "1" : "0";
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpDianF1012M.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              concepto +
              "|" +
              informado +
              "|" +
              eliminar +
              "|" +
              saldo_1012 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_1012();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_2276() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_2276.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_2276.identificacion_rut;
        let concepto = 2276;
        console.log("guardar form", this.form.salario_2276);
        let salario = this.form.salario_2276
          ? this.form.salario_2276.replace(/\,/g, "")
          : "0";
        console.log("salario", salario);

        let emolec_2276 = this.form.emolec_2276
          ? this.form.emolec_2276.replace(/\,/g, "")
          : "0";
        let honorarios_2276 = this.form.honorarios_2276
          ? this.form.honorarios_2276.replace(/\,/g, "")
          : "0";
        let servicios_2276 = this.form.servicios_2276
          ? this.form.servicios_2276.replace(/\,/g, "")
          : "0";
        let comisiones_2276 = this.form.comisiones_2276
          ? this.form.comisiones_2276.replace(/\,/g, "")
          : "0";
        let prsocial_2276 = this.form.prsocial_2276
          ? this.form.prsocial_2276.replace(/\,/g, "")
          : "0";
        let viaticos_2276 = this.form.viaticos_2276
          ? this.form.viaticos_2276.replace(/\,/g, "")
          : "0";
        let gtosrep_2276 = this.form.gtosrep_2276
          ? this.form.gtosrep_2276.replace(/\,/g, "")
          : "0";
        let trabajoasoc_2276 = this.form.trabajoasoc_2276
          ? this.form.trabajoasoc_2276.replace(/\,/g, "")
          : "0";
        let otrospagos1_2276 = this.form.otrospagos1_2276
          ? this.form.otrospagos1_2276.replace(/\,/g, "")
          : "0";
        let cesantias_2276 = this.form.cesantias_2276
          ? this.form.cesantias_2276.replace(/\,/g, "")
          : "0";
        let intereses_2276 = this.form.intereses_2276
          ? this.form.intereses_2276.replace(/\,/g, "")
          : "0";

        let pensjubi_2276 = this.form.pensjubi_2276
          ? this.form.pensjubi_2276.replace(/\,/g, "")
          : "0";
        let apobsalud_2276 = this.form.apobsalud_2276
          ? this.form.apobsalud_2276.replace(/\,/g, "")
          : "0";
        let apobpensión_2276 = this.form.apobpensión_2276
          ? this.form.apobpensión_2276.replace(/\,/g, "")
          : "0";
        let apvolpensión_2276 = this.form.apvolpensión_2276
          ? this.form.apvolpensión_2276.replace(/\,/g, "")
          : "0";
        let apafc_2276 = this.form.apafc_2276
          ? this.form.apafc_2276.replace(/\,/g, "")
          : "0";
        let apavc_2276 = this.form.apavc_2276
          ? this.form.apavc_2276.replace(/\,/g, "")
          : "0";
        let rtefte_2276 = this.form.rtefte_2276
          ? this.form.rtefte_2276.replace(/\,/g, "")
          : "0";
        let bonos_2276 = this.form.bonos_2276
          ? this.form.bonos_2276.replace(/\,/g, "")
          : "0";
        let apestado_2276 = this.form.apestado_2276
          ? this.form.apestado_2276.replace(/\,/g, "")
          : "0";
        let alimenta1_2276 = this.form.alimenta1_2276
          ? this.form.alimenta1_2276.replace(/\,/g, "")
          : "0";
        let alimenta2_2276 = this.form.alimenta2_2276
          ? this.form.alimenta2_2276.replace(/\,/g, "")
          : "0";
        let fideico_2276 = this.form.fideico_2276
          ? this.form.fideico_2276.replace(/\,/g, "")
          : "0";
        let tipoid_2276 = this.form.tipoid_2276
          ? this.form.tipoid_2276.replace(/\,/g, "")
          : "0";
        let idpartic_2276 = this.form.idpartic_2276
          ? this.form.idpartic_2276.replace(/\,/g, "")
          : "0";

        let eliminar = this.form.eliminar_2276 ? "1" : "0";
        this.form.eliminar_2276 = 0;
        let base_1003 = 0;
        let rte_1003 = 0;
        let descontable_1005 = 0;
        let devolucion_1005 = 0;
        let generado_1006 = 0;
        let devolucion_1006 = 0;
        let ingreso_1007 = 0;
        let saldo_1008 = 0;
        let saldo_1009 = 0;
        let saldo_1010 = 0;
        let porc_1010 = 0;

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              base_1003 +
              "|" +
              rte_1003 +
              "|" +
              descontable_1005 +
              "|" +
              devolucion_1005 +
              "|" +
              generado_1006 +
              "|" +
              devolucion_1006 +
              "|" +
              ingreso_1007 +
              "|" +
              saldo_1008 +
              "|" +
              saldo_1009 +
              "|" +
              saldo_1010 +
              "|" +
              porc_1010 +
              "|" +
              salario +
              "|" +
              emolec_2276 +
              "|" +
              honorarios_2276 +
              "|" +
              servicios_2276 +
              "|" +
              comisiones_2276 +
              "|" +
              prsocial_2276 +
              "|" +
              viaticos_2276 +
              "|" +
              gtosrep_2276 +
              "|" +
              trabajoasoc_2276 +
              "|" +
              otrospagos1_2276 +
              "|" +
              cesantias_2276 +
              "|" +
              pensjubi_2276 +
              "|" +
              apobsalud_2276 +
              "|" +
              apobpensión_2276 +
              "|" +
              apvolpensión_2276 +
              "|" +
              apafc_2276 +
              "|" +
              apavc_2276 +
              "|" +
              rtefte_2276 +
              "|" +
              bonos_2276 +
              "|" +
              apestado_2276 +
              "|" +
              alimenta1_2276 +
              "|" +
              alimenta2_2276 +
              "|" +
              fideico_2276 +
              "|" +
              tipoid_2276 +
              "|" +
              idpartic_2276 +
              "|" +
              intereses_2276 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_2276();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_5247() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_5247.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_5247.identificacion_rut;
        let concepto = this.form.concepto_exogena_5247.concepto_rep;
        let pagoded = this.form.pagod_5247.replace(/\,/g, "");
        let pagonded = this.form.pagond_5247.replace(/\,/g, "");
        let ivactod = this.form.ivactod_5247.replace(/\,/g, "");
        let ivactond = this.form.ivactond_5247.replace(/\,/g, "");
        let retepract = this.form.retepract_5247.replace(/\,/g, "");
        let reteasum = this.form.rtefteasum_5247.replace(/\,/g, "");
        let reteivacom = this.form.rteivacom_5247.replace(/\,/g, "");
        let rteivanodom = this.form.rteivanodom_5247.replace(/\,/g, "");
        let eliminar = this.form.eliminar_5247 ? "1" : "0";
        this.form.eliminar_5247 = 0;
        let base_1003 = "0";
        let rte_1003 = "0";
        let descontable_1005 = "0";
        let devolucion_1005 = "0";
        let generado_1006 = "0";
        let devolucion_1006 = "0";
        let ingreso_1007 = "0";
        let saldo_1008 = "0";
        let saldo_1009 = "0";
        let saldo_1010 = "0";
        let porc_1010 = "0";
        let salario = "0";
        let emolec_2276 = "0";
        let honorarios_2276 = "0";
        let servicios_2276 = "0";
        let comisiones_2276 = "0";
        let prsocial_2276 = "0";
        let viaticos_2276 = "0";
        let gtosrep_2276 = "0";
        let trabajoasoc_2276 = "0";
        let otrospagos1_2276 = "0";
        let cesantias_2276 = "0";
        let intereses_2276 = "0";
        let pensjubi_2276 = "0";
        let apobsalud_2276 = "0";
        let apobpensión_2276 = "0";
        let apvolpensión_2276 = "0";
        let apafc_2276 = "0";
        let apavc_2276 = "0";
        let rtefte_2276 = "0";
        let bonos_2276 = "0";
        let apestado_2276 = "0";
        let alimenta1_2276 = "0";
        let alimenta2_2276 = "0";
        let fideico_2276 = "0";
        let tipoid_2276 = "0";
        let idpartic_2276 = "0";
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              pagoded +
              "|" +
              pagonded +
              "|" +
              ivactod +
              "|" +
              ivactond +
              "|" +
              retepract +
              "|" +
              reteasum +
              "|" +
              reteivacom +
              "|" +
              rteivanodom +
              "|" +
              base_1003 +
              "|" +
              rte_1003 +
              "|" +
              descontable_1005 +
              "|" +
              devolucion_1005 +
              "|" +
              generado_1006 +
              "|" +
              devolucion_1006 +
              "|" +
              ingreso_1007 +
              "|" +
              saldo_1008 +
              "|" +
              saldo_1009 +
              "|" +
              saldo_1010 +
              "|" +
              porc_1010 +
              "|" +
              salario +
              "|" +
              emolec_2276 +
              "|" +
              honorarios_2276 +
              "|" +
              servicios_2276 +
              "|" +
              comisiones_2276 +
              "|" +
              prsocial_2276 +
              "|" +
              viaticos_2276 +
              "|" +
              gtosrep_2276 +
              "|" +
              trabajoasoc_2276 +
              "|" +
              otrospagos1_2276 +
              "|" +
              cesantias_2276 +
              "|" +
              pensjubi_2276 +
              "|" +
              apobsalud_2276 +
              "|" +
              apobpensión_2276 +
              "|" +
              apvolpensión_2276 +
              "|" +
              apafc_2276 +
              "|" +
              apavc_2276 +
              "|" +
              rtefte_2276 +
              "|" +
              bonos_2276 +
              "|" +
              apestado_2276 +
              "|" +
              alimenta1_2276 +
              "|" +
              alimenta2_2276 +
              "|" +
              fideico_2276 +
              "|" +
              tipoid_2276 +
              "|" +
              idpartic_2276 +
              "|" +
              intereses_2276 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_5247();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_5248() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_5248.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_5248.identificacion_rut;
        let concepto = this.form.concepto_exogena_5248.concepto_rep;
        let ingreso_5248 = this.form.ingreso_5248.replace(/\,/g, "");
        let eliminar = this.form.eliminar_5248 ? "1" : "0";
        this.form.eliminar_5248 = 0;
        let base_1003 = 0;
        let rte_1003 = 0;
        let descontable_1005 = 0;
        let devolucion_1005 = 0;
        let generado_1006 = 0;
        let devolucion_1006 = 0;

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              base_1003 +
              "|" +
              rte_1003 +
              "|" +
              descontable_1005 +
              "|" +
              devolucion_1005 +
              "|" +
              generado_1006 +
              "|" +
              devolucion_1006 +
              "|" +
              ingreso_5248 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_5248();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_5249() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_5249.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_5249.identificacion_rut;
        let concepto = this.form.concepto_exogena_5249.concepto_rep;
        let descontable_5249 = this.form.descontable_5249.replace(/\,/g, "");
        let devolucion_5249 = this.form.devolucion_5249.replace(/\,/g, "");
        let eliminar = this.form.eliminar_5249 ? "1" : "0";
        this.form.eliminar_5249 = 0;
        let base_1003 = 0;
        let rte_1003 = 0;
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              base_1003 +
              "|" +
              rte_1003 +
              "|" +
              descontable_5249 +
              "|" +
              devolucion_5249 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_5249();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_5250() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_5250.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_5250.identificacion_rut;
        let concepto = this.form.concepto_exogena_5250.concepto_rep;
        let generado_5250 = this.form.generado_5250.replace(/\,/g, "");
        let devolucion_5250 = this.form.devolucion_5250.replace(/\,/g, "");
        let eliminar = this.form.eliminar_5250 ? "1" : "0";
        this.form.eliminar_5250 = 0;
        let base_1003 = 0;
        let rte_1003 = 0;
        let descontable_1005 = 0;
        let devolucion_1005 = 0;

        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              base_1003 +
              "|" +
              rte_1003 +
              "|" +
              descontable_1005 +
              "|" +
              devolucion_1005 +
              "|" +
              generado_5250 +
              "|" +
              devolucion_5250 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_5250();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_5251() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_5251.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_5251.identificacion_rut;
        let concepto = this.form.concepto_exogena_5251.concepto_rep;
        let saldo_5251 = this.form.saldo_5251.replace(/\,/g, "");
        let eliminar = this.form.eliminar_5251 ? "1" : "0";
        this.form.eliminar_5251 = 0;
        let base_1003 = 0;
        let rte_1003 = 0;
        let descontable_1005 = 0;
        let devolucion_1005 = 0;
        let generado_1006 = 0;
        let devolucion_1006 = 0;
        let ingreso_1007 = 0;
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              base_1003 +
              "|" +
              rte_1003 +
              "|" +
              descontable_1005 +
              "|" +
              devolucion_1005 +
              "|" +
              generado_1006 +
              "|" +
              devolucion_1006 +
              "|" +
              ingreso_1007 +
              "|" +
              saldo_5251 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_5251();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    guardar_5252() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        this.dialogo_5252.estado = false;
        let periodo = this.form.fechafin.replace(/\-/g, "");
        let formato = this.form.format_exogena.value;
        let informado = this.form.informado_5252.identificacion_rut;
        let concepto = this.form.concepto_exogena_5252.concepto_rep;
        let saldo_5252 = this.form.saldo_5252.replace(/\,/g, "");
        let eliminar = this.form.eliminar_5252 ? "1" : "0";
        this.form.eliminar_5252 = 0;
        let base_1003 = 0;
        let rte_1003 = 0;
        let descontable_1005 = 0;
        let devolucion_1005 = 0;
        let generado_1006 = 0;
        let devolucion_1006 = 0;
        let ingreso_1007 = 0;
        let saldo_1008 = 0;
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDianM.dll",
            data:
              sessionStorage.Sesion +
              "|" +
              periodo +
              "|" +
              formato +
              "|" +
              informado +
              "|" +
              concepto +
              "|" +
              eliminar +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              "0" +
              "|" +
              base_1003 +
              "|" +
              rte_1003 +
              "|" +
              descontable_1005 +
              "|" +
              devolucion_1005 +
              "|" +
              generado_1006 +
              "|" +
              devolucion_1006 +
              "|" +
              ingreso_1007 +
              "|" +
              saldo_1008 +
              "|" +
              saldo_5252 +
              "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.consultarDian();
            this.clear_5252();
            this.$emit("snack", {
              color: "success",
              text: "Grabado correctamente",
              estado: true,
            });
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al guardar",
              estado: true,
            });
          });
      }
    },
    generarDian() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        var periodo = this.form.fechafin.replace(/\-/g, "");
        var formato = this.form.format_exogena.value;
        this.loader = true;
        post
          .postData({
            url: "Financiero/dlls/RpExogDian.dll",
            data: sessionStorage.Sesion + "|" + periodo + "|" + formato + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.$emit("snack", {
              color: "success",
              text: "Proceso Terminado",
              estado: true,
            });
            this.consultarDian();
          })
          .catch((err) => {
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al generar Formato",
              estado: true,
            });
          });
      }
    },
    print_valida_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Cuenta",
          value: "cuenta_rep",
        },
        {
          title: "Descripcion",
          value: "descrip_rep",
        },

        {
          title: "Formato_1",
          value: "formato1_rep",
        },
        {
          title: "Concepto_1",
          value: "concepto1_rep",
        },
        {
          title: "Tipo Concepto_1",
          value: "tipo1_rep",
        },
        {
          title: "Rut Concepto_1",
          value: "rut1_rep",
        },
        {
          title: "Formato_2",
          value: "formato2_rep",
        },
        {
          title: "Concepto_2",
          value: "concepto2_rep",
        },
        {
          title: "Tipo Concepto_2",
          value: "tipo2_rep",
        },
        {
          title: "Rut Concepto_2",
          value: "rut2_rep",
        },
        {
          title: "Configuracion a Corregir",
          value: "error1_rep",
        },
      ];

      var header_format = [`Periodo: ${this.form.fechafin}`];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Cuentas",
            header: header_format,
            logo,
            tabla: {
              columnas,
              // totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian_Valida-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_1001_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Concepto",
          value: "concepto_rep",
        },
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },

        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Direccion",
          value: "direccion_rep",
        },
        {
          title: "Codigo Dpto",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "Código Municipio",
          value: "ciudad_rep",
          format: "string",
        },
        {
          title: "Código del Pais",
          value: "pais_rep",
        },
        {
          title: "Pago Abono en Cuenta Deducible",
          value: "pago_rep",
        },
        {
          title: "Pago Abono en Cuenta No Deducible",
          value: "pnodeduc_rep",
        },
        {
          title: "Iva mayor valor Costo Deducible",
          value: "ivadeduc_rep",
        },
        {
          title: "Iva mayor valor Costo No Deducible",
          value: "ivanodeduc_rep",
        },
        {
          title: "Retención en la fuente Practicada",
          value: "rtefte_rep",
        },
        {
          title: "Retención en la fuente Asumida",
          value: "rtefteasum_rep",
        },
        {
          title: "Rete_fuente Iva Regimen Comun",
          value: "rtefteivac_rep",
        },
        {
          title: "Rete_fuente Iva Regimen No Domiciliados",
          value: "rtefteivan_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 1001 -Pagos/Abonos en cuenta y Retenciones Practicadas-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              // totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_1003_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Concepto",
          value: "concepto_rep",
        },
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },

        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "DV",
          value: "dv_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Direccion",
          value: "direccion_rep",
        },
        {
          title: "Codigo Dpto",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "Código Municipio",
          value: "ciudad_rep",
          format: "string",
        },
        {
          title: "Valor Acumulado del pago o abono",
          value: "base_rep",
        },
        {
          title: "Retención que le Practicaron",
          value: "retencion_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 1003 Retenciones en la fuente que le Practicaron",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              // totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_1005_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "DV",
          value: "dv_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Impuesto Descontable",
          value: "imptogen_rep",
        },
        {
          title: "IVA Recuperado en Devoluciones en ventas",
          value: "devoluc_rep",
          format: "money",
        },
        {
          title: "IVA Tratado como mayor Valor del costo o Gasto",
          value: "mayorvlriva_rep",
          format: "money",
        },

      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 1005 Impuesto a las Ventas Descontable",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_1006_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "DV",
          value: "dv_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Impuesto Generado",
          value: "imptogen_rep",
        },
        {
          title: "IVA Recuperado en Devoluciones en compras",
          value: "devcompras_rep",
        },
        {
          title: "Impuesto al Consumo",
          value: "consumo_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        { text: "Formato 1006 Iva Generado", bold: true, size: 16 },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_1007_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Concepto",
          value: "concepto_rep",
        },
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Código del Pais",
          value: "pais_rep",
        },
        {
          title: "Ingresos Brutos Recibidos",
          value: "vrlreportado2_rep",
        },
        {
          title: "Devoluciones, Rebajas y Descuentos",
          value: "vrldevolucion2_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        { text: "Formato 1007 -Ingresos Recibidos-", bold: true, size: 16 },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_1008_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Concepto",
          value: "concepto_rep",
        },
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "DV",
          value: "dv_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Direccion",
          value: "direccion_rep",
        },
        {
          title: "Codigo Dpto",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "Código Municipio",
          value: "ciudad_rep",
          format: "string",
        },
        {
          title: "Código del Pais",
          value: "pais_rep",
        },
        {
          title: "Saldo cuentas por Cobrar",
          value: "vrlreportado2_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 1008 -Saldo Cuentas por cobrar-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_1009_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Concepto",
          value: "concepto_rep",
        },
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "DV",
          value: "dv_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Direccion",
          value: "direccion_rep",
        },
        {
          title: "Codigo Dpto",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "Código Municipio",
          value: "ciudad_rep",
          format: "string",
        },
        {
          title: "Código del Pais",
          value: "pais_rep",
        },
        {
          title: "Saldo cuentas por Pagar",
          value: "vrlreportado2_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 1009 -Saldo Cuentas por Pagar-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_1010_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "DV",
          value: "dv_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Direccion",
          value: "direccion_rep",
        },
        {
          title: "Codigo Dpto",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "Código Municipio",
          value: "ciudad_rep",
          format: "string",
        },
        {
          title: "Código del Pais",
          value: "pais_rep",
        },
        {
          title: "Valor Patrimonial",
          value: "vrlreportado2_rep",
        },
        {
          title: "Porcentaje",
          value: "porcentaje_rep",
        },
        {
          title: "Decimal Porcentaje",
          value: "poscdecimal_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 1010 -Información de Socios/Accionistas-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_1011_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Concepto",
          value: "concepto_rep",
        },
        {
          title: "Saldo a 31 Dic",
          value: "vrlreportado2_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 1011 -Información de las Declaraciones Tributarias-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_1012_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Concepto",
          value: "concepto_rep",
        },
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "DV",
          value: "dv_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Código del Pais",
          value: "pais_rep",
        },
        {
          title: "Valor a 31 Dic",
          value: "vrlreportado2_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 1012 -Información Declaraciones Tributarias, Aportes e inversiones en bonos-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_2276_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Entidad Informante",
          value: "tipocontr_rep",
        },
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },

        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Direccion",
          value: "direccion_rep",
        },
        {
          title: "Departamento",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "Municipio",
          value: "ciudad_rep",
          format: "string",
        },
        {
          title: "Pais",
          value: "pais_rep",
        },
        {
          title: "Pagos por Salarios",
          value: "pasa_rep",
        },
        {
          title: "Pagos Emonumentos Eclesiasticos",
          value: "paec_rep",
        },
        {
          title: "Pagos Realizados con Bonos Electrónicos",
          value: "pabonoelec_rep",
        },
        {
          title: "Valor Exceso Pagos por Alimentación",
          value: "excesoalim_rep",
          format: "string",
        },

        {
          title: "Pagos Honorarios",
          value: "paho_rep",
        },
        {
          title: "Pagos Servicios",
          value: "pase_rep",
        },
        {
          title: "Pagos Comisiones",
          value: "paco_rep",
        },
        {
          title: "Pagos Prestaciones Sociales",
          value: "papre_rep",
        },
        {
          title: "Pagos Viaticos",
          value: "pavia_rep",
        },
        {
          title: "Pagos Gastos de Representacion",
          value: "paga_rep",
        },
        {
          title: "Pagos Trabajo Asociado",
          value: "patra_rep",
        },
        {
          title: "Apoyo economicos no reembolsables",
          value: "apoypnoremb_rep",
        },

        {
          title: "Otros Pagos",
          value: "potro_rep",
        },
        {
          title: "Cesantias e Intereses Pagados",
          value: "cein_rep",
        },
        {
          title: "Cesantias Consignadas a fondos",
          value: "cesconsig_rep",
        },
        {
          title: "Auxilio Cesantias Reconocido a trabajadores Reg.T.",
          value: "auxcesrt_rep",
        },
        {
          title: "Pensiones de Jubilacion",
          value: "peju_rep",
        },
        {
          title: "Total Ingresos Brutos",
          value: "tingbtp_rep",
        },
        {
          title: "Aportes Obligatorios Salud",
          value: "apos_rep",
        },
        {
          title: "Aportes Obligatorios Pension",
          value: "apof_rep",
        },
        {
          title: "Aportes Voluntarios RAIS",
          value: "apovrais_rep",
        },
        {
          title: "Aportes Voluntarios Fondos Pensiones",
          value: "apovFp_rep",
        },
        {
          title: "Aportes Cuentas AFC",
          value: "apafc_rep",
        },
        {
          title: "Aportes Cuentas AVC",
          value: "apavc_rep",
        },
        {
          title: "Valor Retenciones",
          value: "vare_rep",
        },
        {
          title: "Iva mayor valor gasto",
          value: "iva_rep",
        },
        {
          title: "Retencion Iva",
          value: "rteiva_rep",
        },
        {
          title: "Pagos Alimentacion hasta 41 UVT",
          value: "pagahuvt_rep",
        },

        {
          title: "Ingreso Promedio ult. 6 meses",
          value: "prom6meses_rep",
        },

        {
          title: "Tipo Doc Dependiente",
          value: "Tipodocdep_rep",
        },
        {
          title: "Id Doc Dependiente",
          value: "Iddocdep_rep",
        },

        // {
        //   title: "Pagos Alimentacion mayor 41 UVT",
        //   value: "pagamuvt_rep",
        // },

        // {
        //   title: "Apoyos Economicos No reembolsables",
        //   value: "apecofpe_rep",
        // },

        {
          title: "Id Fideicomiso",
          value: "idfideic_rep",
          format: "string",
        },
        {
          title: "Tipo Doc Participante Contrato",
          value: "tipoidpart_rep",
        },
        {
          title: "Identificacion Participante Contrato",
          value: "idpartct_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 2276 -Información Rentas de trabajo y Pensiones-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              // totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_5247_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Tipo Contrato",
          value: "tipocontr_rep",
        },
        {
          title: "Concepto",
          value: "concepto_rep",
        },
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Direccion",
          value: "direccion_rep",
        },
        {
          title: "Codigo Dpto",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "Código Municipio",
          value: "ciudad_rep",
          format: "string",
        },
        {
          title: "Código del Pais",
          value: "pais_rep",
        },
        {
          title: "Pago Abono en Cuenta Deducible",
          value: "pago_rep",
        },
        {
          title: "Iva mayor valor Costo Deducible",
          value: "ivadeduc_rep",
        },
        {
          title: "Retención en la fuente Practicada",
          value: "rtefte_rep",
        },
        {
          title: "Retención en la fuente Asumida",
          value: "rtefteasum_rep",
        },
        {
          title: "Rete_fuente Iva Regimen Comun",
          value: "rtefteivac_rep",
        },
        {
          title: "Rete_fuente Iva Regimen No Domiciliados",
          value: "rtefteivan_rep",
        },
        {
          title: "Id_Fideicomiso",
          value: "idpideicom_rep",
        },
        {
          title: "Tipo doc.Participante",
          value: "tipoidpart_rep",
        },
        {
          title: "Id. Participante en Contrato",
          value: "idpartct_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 5247 -Consorcios Pagos/Abonos en cuenta y Retenciones Practicadas-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];
      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              // totalsRow: true,
              data: data_parse,
              // heightRow: 35,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_5248_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Tipo Contrato",
          value: "tipocontr_rep",
        },
        {
          title: "Concepto",
          value: "concepto_rep",
        },
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Código del Pais",
          value: "pais_rep",
        },
        {
          title: "Ingresos Brutos Recibidos",
          value: "vrlreportado2_rep",
        },
        {
          title: "Devoluciones, Rebajas y Descuentos",
          value: "vrldevolucion2_rep",
        },
        {
          title: "Id_Fideicomiso",
          value: "idpideicom_rep",
        },
        {
          title: "Tipo doc.Participante",
          value: "tipoidpart_rep",
        },
        {
          title: "Id. Participante en Contrato",
          value: "idpartct_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 5248 -Consorcios Ingresos Recibidos-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_5249_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Tipo Contrato",
          value: "tipocontr_rep",
        },
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Impuesto Descontable",
          value: "imptogen_rep",
        },
        {
          title: "IVA Recuperado en Devoluciones en ventas",
          value: "devoluc_rep",
        },
        {
          title: "Tipo doc.Participante",
          value: "tipoidpart_rep",
        },
        {
          title: "Id. Participante en Contrato",
          value: "idpartct_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 5249 -Consorcios Impuesto a las Ventas Descontable-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_5250_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Tipo Contrato",
          value: "tipocontr_rep",
        },
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Impuesto Generado",
          value: "imptogen_rep",
        },
        {
          title: "IVA Recuperado en Devoluciones en compras",
          value: "devcompras_rep",
        },
        {
          title: "Impuesto al Consumo",
          value: "consumo_rep",
        },
        {
          title: "Tipo doc.Participante",
          value: "tipoidpart_rep",
        },
        {
          title: "Id. Participante en Contrato",
          value: "idpartct_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 5250 -Consorcios Impuesto a las Ventas Generado",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_5251_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Tipo Contrato",
          value: "tipocontr_rep",
        },
        {
          title: "Concepto",
          value: "concepto_rep",
        },
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Direccion",
          value: "direccion_rep",
        },
        {
          title: "Codigo Dpto",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "Código Municipio",
          value: "ciudad_rep",
          format: "string",
        },
        {
          title: "Código del Pais",
          value: "pais_rep",
        },
        {
          title: "Saldo cuentas por Cobrar",
          value: "vrlreportado2_rep",
        },
        {
          title: "Tipo doc.Participante",
          value: "tipoidpart_rep",
        },
        {
          title: "Id. Participante en Contrato",
          value: "idpartct_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 5251 -Consorcios Saldo Cuentas por cobrar-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    print_5252_excel() {
      var data = this.data_excel;
      var data_parse = data.map((el) => {
        return el;
      });
      var columnas = [
        {
          title: "Tipo Contrato",
          value: "tipocontr_rep",
        },
        {
          title: "Concepto",
          value: "concepto_rep",
        },
        {
          title: "Tipo de Documento",
          value: "tipodoc_rep",
        },
        {
          title: "Numero Identificacion",
          value: "NroId_rep",
        },
        {
          title: "Primer Apellido",
          value: "apellido1_rep",
        },
        {
          title: "Segundo Apellido",
          value: "apellido2_rep",
        },
        {
          title: "Primer Nombre",
          value: "nombre1_rep",
        },
        {
          title: "Otros Nombres",
          value: "nombre2_rep",
        },
        {
          title: "Razón Social",
          value: "razonsocial_rep",
        },
        {
          title: "Direccion",
          value: "direccion_rep",
        },
        {
          title: "Codigo Dpto",
          value: "dpto_rep",
          format: "string",
        },
        {
          title: "Código Municipio",
          value: "ciudad_rep",
          format: "string",
        },
        {
          title: "Código del Pais",
          value: "pais_rep",
        },
        {
          title: "Saldo cuentas por Pagar",
          value: "vrlreportado2_rep",
        },
        {
          title: "Tipo doc.Participante",
          value: "tipoidpart_rep",
        },
        {
          title: "Id. Participante en Contrato",
          value: "idpartct_rep",
        },
      ];

      let formato = this.form.format_exogena.value;
      var header_format = [
        {
          text: "Formato 5252 -Consorcios Saldo Cuentas por Pagar-",
          bold: true,
          size: 16,
        },
        `Periodo: ${this.form.fechafin}`,
      ];

      var logo_src = require(`../../assets/image/clientes/${parseFloat(
        sessionStorage.Sesion.substr(0, 15)
      )}.png`);
      this.pdfs.getBase64(logo_src).then((logo) => {
        this.excel
          ._informe({
            sheetName: "Formato" + formato,
            header: header_format,
            logo,
            tabla: {
              columnas,
              data: data_parse,
              theme: "TableStyleMedium2",
            },
            archivo: `Dian${formato}-${new Date().getTime()}`,
          })
          .then((data) => {
            console.log("Impresion terminada");
          });
      });
    },
    validar() {
      if (!this.form.fechafin) {
        this.errores.fechafin = true;
        this.$emit("snack", {
          color: "error",
          text: "Debes seleccionar el periodo a Reportar",
          estado: true,
        });
      } else {
        var periodo = this.form.fechafin.replace(/\-/g, "");
        let url = `Financiero/dlls/RpExogDianVJ.dll`;
        post
          .postData({
            url,
            data: sessionStorage.Sesion + "|" + periodo + "|",
            method: "",
          })
          .then((data) => {
            this.loader = false;
            this.data_excel = JSON.parse(JSON.stringify(data));

            this.print_valida_excel();
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.$emit("snack", {
              color: "error",
              text: "Error al cargar Reporte",
              estado: true,
            });
          });
      }
    },
    clear_1001() {
      this.form.pagod = "";
      this.form.pagond = "";
      this.form.ivactod = "";
      this.form.ivactond = "";
      this.form.retepract = "";
      this.form.rtefteasum = "";
      this.form.rteivacom = "";
      this.form.rteivanodom = "";
      this.form.informado = "";
      this.form.concepto_exogena = "";
    },
    clear_1003() {
      this.form.base_1003 = "";
      this.form.rte_1003 = "";
      this.form.informado_1003 = "";
      this.form.concepto_exogena_1003 = "";
    },
    clear_1004() {
      this.form.formatedit = "";
      this.form.descontable_1005 = "";
      this.form.devolucion_1005 = "";
      this.form.informado_1005 = "";
      this.form.concepto_exogena_1005 = "";
    },
    clear_1006() {
      this.form.formatedit = "";
      this.form.generado_1006 = "";
      this.form.devolucion_1006 = "";
      this.form.informado_1006 = "";
      this.form.concepto_exogena_1006 = "";
    },
    clear_1007() {
      this.form.formatedit = "";
      this.form.ingreso_1007 = "";
      this.form.informado_1007 = "";
      this.form.concepto_exogena_1007 = "";
    },
    clear_1008() {
      this.form.formatedit = "";
      this.form.saldo_1008 = "";
      this.form.informado_1008 = "";
      this.form.concepto_exogena_1008 = "";
    },
    clear_1009() {
      this.form.formatedit = "";
      this.form.saldo_1009 = "";
      this.form.informado_1009 = "";
      this.form.concepto_exogena_1009 = "";
    },
    clear_1010() {
      this.form.formatedit = "";
      this.form.saldo_1010 = "";
      this.form.porc_1010 = "";
      this.form.informado_1010 = "";
      this.form.concepto_exogena_1010 = "";
    },
    clear_1011() {
      this.form.formatedit = "";
      this.form.saldo_1011 = "";
      this.form.concepto_exogena_1011 = "";
    },
    clear_1012() {
      this.form.formatedit = "";
      this.form.saldo_1012 = "";
      this.form.informado_1012 = "";
      this.form.concepto_exogena_1012 = "";
    },
    clear_2276() {
      this.form.formatedit = "";
      this.form.informado_2276 = "";
      this.form.salario_2276 = "";
      this.form.emolec_2276 = "";
      this.form.honorarios_2276 = "";
      this.form.servicios_2276 = "";
      this.form.comisiones_2276 = "";
      this.form.prsocial_2276 = "";
      this.form.viaticos_2276 = "";
      this.form.gtosrep_2276 = "";
      this.form.trabajoasoc_2276 = "";
      this.form.otrospagos1_2276 = "";
      this.form.cesantias_2276 = "";
      this.form.intereses_2276 = "";
      this.form.pensjubi_2276 = "";
      this.form.apobsalud_2276 = "";
      this.form.apobpensión_2276 = "";
      this.form.apvolpensión_2276 = "";
      this.form.apafc_2276 = "";
      this.form.apavc_2276 = "";
      this.form.rtefte_2276 = "";
      this.form.bonos_2276 = "";
      this.form.apestado_2276 = "";
      this.form.alimenta1_2276 = "";
      this.form.alimenta2_2276 = "";
      this.form.fideico_2276 = "";
      this.form.tipoid_2276 = "";
      this.form.idpartic_2276 = "";
    },
    clear_5247() {
      this.form.formatedit_5247 = "";
      this.form.pagod_5247 = "";
      this.form.pagond_5247 = "";
      this.form.ivactod_5247 = "";
      this.form.ivactond_5247 = "";
      this.form.retepract_5247 = "";
      this.form.rtefteasum_5247 = "";
      this.form.rteivacom_5247 = "";
      this.form.rteivanodom_5247 = "";
      this.form.informado_5247 = "";
      this.form.concepto_exogena_5247 = "";
    },
    clear_5248() {
      this.form.formatedit = "";
      this.form.ingreso_5248 = "";
      this.form.informado_5248 = "";
      this.form.concepto_exogena_5248 = "";
    },
    clear_5249() {
      this.form.formatedit = "";
      this.form.descontable_5249 = "";
      this.form.devolucion_5249 = "";
      this.form.informado_5249 = "";
      this.form.concepto_exogena_5249 = "";
    },
    clear_5250() {
      this.form.formatedit = "";
      this.form.generado_5250 = "";
      this.form.devolucion_5250 = "";
      this.form.informado_5250 = "";
      this.form.concepto_exogena_5250 = "";
    },
    clear_5251() {
      this.form.formatedit = "";
      this.form.saldo_5251 = "";
      this.form.informado_5251 = "";
      this.form.concepto_exogena_5251 = "";
    },
    clear_5252() {
      this.form.formatedit = "";
      this.form.saldo_5252 = "";
      this.form.informado_5252 = "";
      this.form.concepto_exogena_5252 = "";
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