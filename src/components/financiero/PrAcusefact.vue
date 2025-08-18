<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card class="mx-auto col-12" max-width="1300" elevation="2">
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4 ">mdi-check-bold</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Acuse Facturas de Compra Test</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <!-- <v-row class="d-flex mb-4 justify-center" no-gutters>
              <v-btn
                color="indigo"
                class="ma-2 white--text"
                large
                depressed
                @click="loadXMLDoc()"
                target="_blank"
              >
              Leer xml prueba
              <v-icon right dark class="ml-4">mdi-check</v-icon>
 
              </v-btn>
              
            </v-row> -->
            <v-data-table
              :headers="headers"
              :items="contenido"
              :loading="contenido.length > 0 ? false : true"
              item-key="codigo"
              :search="search"
            >
              <template v-slot:top>
                <v-text-field
                  v-model="search"
                  label="Buscar"
                  class="mx-4"
                ></v-text-field>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-overlay :value="loader">
      <flower-spinner :animation-duration="2500" :size="100" color="#0d47a1" />
    </v-overlay>
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

      contenido: [],
      search: "",
      headers: [
        { text: "Item", align: "center", value: "id" },
        { text: "Código", align: "left", value: "codigo" },
        { text: "Descripción", align: "left", value: "descripcion" },
        { text: "Unid", align: "left", value: "unit" },
        { text: "Cantidad", align: "left", value: "cantidad" },
        { text: "Vlr. Unit", align: "left", value: "vlrUnit" },
        { text: "Vlr. Total", align: "center", value: "vlrTotal" },
      ],
    };
  },

  computed: {},
  created() {
    this.loadXMLDoc();
  },
  methods: {
    get_acuse() {},
    loadXMLDoc() {
      const _this = this;
      const xhr = new XMLHttpRequest();

      xhr.open("GET", "inc/prueba.xml", true); // Reemplaza 'ruta/al/archivo.xml' con la ruta correcta a tu archivo XML

      xhr.responseType = "document";

      xhr.onload = function () {
        if (xhr.status === 200) {
          const xmlDoc = xhr.responseXML;

          const registrationNameElement = xmlDoc
            .getElementsByTagName("cac:Attachment")[0]
            .getElementsByTagName("cbc:Description")[0].textContent;

          let parser = new DOMParser();

          // Parsear el texto XML y obtener el documento XML
          let xmlParseado = parser.parseFromString(
            registrationNameElement,
            "application/xml"
          );
          console.log("xmlParseado", xmlParseado);

          const xmlproveedor = xmlParseado.getElementsByTagName(
            "cac:AccountingSupplierParty"
          );
          let nombre_proveedor =
            xmlproveedor[0].getElementsByTagName("cac:Party");
          nombre_proveedor =
            nombre_proveedor[0].getElementsByTagName("cac:PartyName");
          nombre_proveedor =
            nombre_proveedor[0].getElementsByTagName("cbc:Name");
          console.log("nombre_proveedor", nombre_proveedor[0].textContent);

          let id_proveedor = xmlproveedor[0].getElementsByTagName("cac:Party");
          id_proveedor =
            id_proveedor[0].getElementsByTagName("cac:PartyTaxScheme");
          id_proveedor = id_proveedor[0].getElementsByTagName("cbc:CompanyID");
          console.log("id _proveedor", id_proveedor[0].textContent);

          let nrofactura = xmlParseado.getElementsByTagName("cbc:ID");
           nrofactura = nrofactura[0].textContent;
          console.log("nrofactura", nrofactura);

          let vencefactura = xmlParseado.getElementsByTagName("cbc:DueDate");
          vencefactura = vencefactura[0].textContent;
          console.log("vencefactura", vencefactura);

          let iva1 = xmlParseado.getElementsByTagName("cac:TaxTotal");
          iva1 = iva1[0].getElementsByTagName("cac:TaxSubtotal");
          iva1 = iva1[0].getElementsByTagName("cbc:TaxAmount");
          iva1 = iva1[0].textContent;
          console.log("iva1", iva1);

          let tipoimpto1 = xmlParseado.getElementsByTagName("cac:TaxTotal");
          tipoimpto1 = tipoimpto1[0].getElementsByTagName("cac:TaxSubtotal");
          tipoimpto1 = tipoimpto1[0].getElementsByTagName("cac:TaxCategory");
          tipoimpto1 = tipoimpto1[0].getElementsByTagName("cac:TaxScheme");
          tipoimpto1 = tipoimpto1[0].getElementsByTagName("cbc:Name");
          tipoimpto1 = tipoimpto1[0].textContent;
          console.log("tipoimpto1", tipoimpto1);

          let tot_gravado = xmlParseado.getElementsByTagName("cac:LegalMonetaryTotal");
          tot_gravado = tot_gravado[0].getElementsByTagName("cbc:TaxExclusiveAmount");
          tot_gravado = tot_gravado[0].textContent;
          console.log("tot_gravado", tot_gravado);

          let tot_excluido = 0;
          console.log("tot_excluido", tot_excluido);

          let total_factura = parseFloat(tot_gravado) + parseFloat(tot_excluido) + parseFloat(iva1)
          console.log("total_factura", total_factura);


          const invoiceLines =
            xmlParseado.getElementsByTagName("cac:InvoiceLine");

          let data = [];

          for (let i = 0; i < invoiceLines.length; i++) {
            let invoiceLine = invoiceLines[i];
            let id = invoiceLine.getElementsByTagName("cbc:ID")[0].textContent;
            let descripcion =
              invoiceLine.getElementsByTagName("cbc:Description")[0]
                .textContent;
            let standardItemIdentification = invoiceLine
              .getElementsByTagName("cac:StandardItemIdentification")[0]
              .getElementsByTagName("cbc:ID")[0].textContent;
            let invoicedQuantity = invoiceLine.getElementsByTagName(
              "cbc:InvoicedQuantity"
            )[0].textContent;
            let unitCode = invoiceLine
              .getElementsByTagName("cbc:InvoicedQuantity")[0]
              .getAttribute("unitCode");
            let priceAmount =
              invoiceLine.getElementsByTagName("cbc:PriceAmount")[0]
                .textContent;
            let lineExtensionAmount = invoiceLine.getElementsByTagName(
              "cbc:LineExtensionAmount"
            )[0].textContent;

            let itemData = {
              id,
              codigo: standardItemIdentification,
              descripcion,
              unit: unitCode == "94" ? "UN" : "MT",
              cantidad: invoicedQuantity,
              vlrUnit: _this.formatNumero(priceAmount),
              vlrTotal: _this.formatNumero(lineExtensionAmount),
            };

            data.push(itemData);
          }

          // console.log(data);
          _this.contenido = data;
        }
      };

      // Enviar la solicitud
      xhr.send();
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
