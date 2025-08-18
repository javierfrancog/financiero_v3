<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="load.card"
        :disabled="load.card"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4"
                >mdi-account-group-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content class="pl-3">
              <v-list-item-title class="headline"
                >Participantes</v-list-item-title
              >
            </v-list-item-content>
            <v-row justify="end" align="center">
              <!-- <v-btn color="blue darken-2" outlined class="ma-2 white--text" depressed>
                <v-icon left>mdi-qrcode-scan</v-icon>Generar QR's
              </v-btn>-->
              <v-menu offset-y nudge-left="200" nudge-width="200">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon large v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item link @click="dialogo.estado = true">
                    <v-list-item-icon>
                      <v-icon left>mdi-file-delimited-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Subir .csv</v-list-item-title>
                  </v-list-item>
                  <v-list-item link @click="generar_qr">
                    <v-list-item-icon>
                      <v-icon left>mdi-qrcode-scan</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Generar QR's</v-list-item-title>
                  </v-list-item>
                  <v-list-item link @click="eliminar_todos">
                    <v-list-item-icon>
                      <v-icon left>mdi-trash-can-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Borrar participantes</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-row>
          </v-list-item>
        </v-card-title>

        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-data-table
              :loading="load.usuarios"
              :headers="tabla.headers"
              :items="tabla.data"
              item-key="id"
            >
              <template v-slot:item.token="{ item }">
                <v-chip
                  label
                  small
                  color="blue darken-2"
                  class="white--text overline"
                  >{{ item.token }}</v-chip
                >
              </template>
              <template v-slot:item.asistencia="{ item }">
                <v-chip
                  label
                  small
                  :color="
                    (item.asistencia == 1 ? 'blue' : 'orange') + '  darken-2'
                  "
                  class="white--text overline"
                  >{{ item.asistencia == 1 ? "Virtual" : "Presencial" }}</v-chip
                >
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogo.estado" width="500" persistent>
      <v-card :loading="load.csv_form" :disabled="load.csv_form">
        <v-card-title class="headline grey lighten-4" primary-title
          >Subir archivo .csv</v-card-title
        >

        <v-card-text class="pa-5">
          <v-file-input
            label="Adjuntar archivo"
            outlined
            hide-details
            v-model="archivo_csv"
          ></v-file-input>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            @click="
              dialogo.estado = false;
              archivo_csv = null;
            "
            depressed
            class="px-5"
            >Cancelar</v-btn
          >
          <v-btn color="primary" @click="get_csv" depressed class="px-5">
            <v-icon left>mdi-upload</v-icon>Subir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import pdfMake from "pdfmake/build/pdfmake.js";
import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts?.default?.vfs || pdfFonts.pdfMake?.vfs;

export default {
  data() {
    return {
      tabla: {
        headers: [
          {
            text: "Nombres",
            align: "Left",
            value: "nombres",
          },
          {
            text: "Token",
            align: "center",
            value: "token",
          },
          {
            text: "Correo",
            align: "left",
            value: "correo",
          },
          {
            text: "Celular",
            align: "left",
            value: "celular",
          },
          {
            text: "Asistencia",
            align: "center",
            value: "asistencia",
          },
        ],
        data: [],
      },
      dialogo: {
        estado: false,
      },
      dialogo_email: false,
      load: {
        card: false,
        usuarios: true,
        csv_form: false,
      },
      archivo_csv: null,
      asambleas: [],
      asamblea: null,
    };
  },
  created() {
    this.get_participantes();
    this.get_asambleas();
  },
  methods: {
    generar_qr() {
      var datos = this.tabla.data.filter((el) => el.asistencia == 2);
      var obj = [];
      datos.forEach((el, index) => {
        var odd = index % 2;
        var nombres = el.nombres;

        let data = [
          {
            qr: `https://titansoluciones.cloud/financiero/#/votaciones/${el.token}`,
            alignment: "center",
            fit: 140,
          },
          {
            text: `${nombres}\n${el.token}`,
            alignment: "center",
            margin: [10, 0, 10, 10],
          },
        ];

        if (odd == 0) {
          obj.push([data]);
        } else {
          let ultimo = obj.length - 1;
          obj[ultimo].push(data);
        }
      });

      var docDefinition = {
        content: [
          {
            layout: "noBorders",
            table: {
              widths: ["*", "*"],
              body: obj,
            },
          },
        ],
      };

      pdfMake.createPdf(docDefinition).open();
    },
    eliminar_todos() {
      var r = confirm(
        "EstÃ¡ seguro que desea eliminar todos los participantes?"
      );

      if (r == true) this.delete_participantes();
    },
    delete_participantes() {
      var $this = this;
      this.load.card = true;
      this.fb.$usuarios.get().then(function (querySnapshot) {
        var total = querySnapshot.docs.length;
        var count = 0;
        querySnapshot.forEach(function (doc) {
          doc.ref
            .delete()
            .then(function () {
              count = count + 1;
              if (count == total) {
                $this.load.card = false;
                $this.$emit(
                  "msj",
                  "Se han eliminado los registros correctamente.",
                  "green"
                );
              }
            })
            .catch(function (error) {
              $this.load.card = false;
              $this.$emit("msj", "Ha ocurrido un error durante la consulta");
            });
        });
      });
    },
    put_participantes(data) {
      // console.log("CSV", data);
      var $this = this;
      this.load.csv_form = true;
      var batch = this.fb.$db.batch();
      data.forEach((el) => {
        let asistencia = el[5].toUpperCase().indexOf("VIRTUAL");
        let obj = {
          empresa: parseInt(el[0]),
          nombres: el[1].trim(),
          correo: el[2].trim(),
          celular: el[3].trim(),
          token: parseInt(el[4]),
          asistencia: asistencia < 0 ? 2 : 1,
          fechaRegistro: this.fb.$firebaseObj.firestore.Timestamp.fromDate(
            new Date()
          ),
        };

        // console.log('User', obj)
        var docRef = this.fb.$usuarios.doc();
        batch.set(docRef, obj);
      });

      batch
        .commit()
        .then((data) => {
          $this.load.csv_form = false;
          $this.archivo_csv = null;
          $this.dialogo.estado = false;
          $this.$emit(
            "msj",
            "El archivo .CSV se ha subido correctamente",
            "green"
          );
        })
        .catch((err) => {
          $this.load.csv_form = false;
          $this.archivo_csv = null;
          $this.$emit(
            "msj",
            "Ha ocurrido un error durante el registro de la informaciÃ³n"
          );
          console.error(err);
        });
    },
    get_csv() {
      var $this = this;
      var data = this.archivo_csv;
      var reader = new FileReader();
      reader.readAsText(data);
      reader.onloadend = function () {
        var CSV = reader.result;
        var lineas = CSV.split(/\r\n|\n/);
        lineas.shift();
        lineas.pop();

        var nuevo = lineas.map((el) => el.split(","));
        $this.put_participantes(nuevo);
      };
    },
    get_asambleas() {
      var $this = this;
      $this.card_estado = true;
      this.fb.$asambleas.where("estado", "==", 0).onSnapshot(
        (snapshot) => {
          $this.asambleas = [];
          snapshot.forEach((doc) => {
            let data = doc.data();
            data.id = doc.id;
            $this.asambleas.push(data);
          });

          $this.card_estado = false;
        },
        (err) => {
          $this.$emit("msj", "Ha ocurrido un error durante la consulta");
        }
      );
    },
    get_participantes() {
      var $this = this;
      this.fb.$usuarios.onSnapshot(
        (snapshot) => {
          $this.tabla.data = [];
          snapshot.forEach((doc) => {
            let data = doc.data();
            data.id = doc.id;
            $this.tabla.data.push(data);
          });

          $this.load.usuarios = false;
        },
        (err) => {
          console.log("Error");
        }
      );
    },
  },
};
</script>
