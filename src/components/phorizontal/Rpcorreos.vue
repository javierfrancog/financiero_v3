<template>
  <v-layout wrap justify-center class="pa-6">
    <v-flex xs12 md12>
      <v-card
        class="mx-auto col-12"
        max-width="1300"
        elevation="2"
        :loading="card_loader"
        :disabled="card_loader"
      >
        <v-card-title>
          <v-list-item>
            <v-list-item-icon>
              <v-icon size="30" color="blue darken-4">mdi-at</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pl-3">
              <v-list-item-title class="headline">Envío de convocatoria</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <div class="pa-0 px-8">
          <v-card-text class="px-0 pa-0">
            <v-row class="d-flex justify-center">
              <v-col cols="8">
                <v-autocomplete
                  label="Seleccionar asamblea activa"
                  outlined
                  hide-details
                  v-model="asamblea"
                  :items="asambleas"
                  item-text="descripcion"
                  item-value="id"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  label="Enlace de video-llamada"
                  outlined
                  hide-details
                  v-model="enlace_zoom"
                ></v-text-field>
              </v-col>
              <v-col cols="8">
                <v-file-input label="Adjuntar archivo" outlined hide-details v-model="archivo_csv"></v-file-input>
              </v-col>
              <v-col cols="12" class="text-right">
                <v-btn
                  depressed
                  color="green"
                  class="white--text"
                  large
                  @click="leer_csv"
                >Enviar coreos</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      archivo_csv: null,
      asambleas: [],
      asamblea: null,
      enlace_zoom: null,
      correos: [],
      validados: [],
      card_loader: false
    };
  },
  created() {
    this.get_asambleas();
  },
  methods: {
    fin_verificacion() {
      var $this = this;
      var asamblea = this.asamblea;
      var enlace = this.enlace_zoom;

      var lista_envio = [];
      this.validados.forEach(el => {
        lista_envio.push({
          correo: el.correo,
          token: el.token,
          nombres: el.nombres
        });
      });

      // var usuarios_envio = [];
      // for (var i = 0; i < 10; i++) {
      //   usuarios_envio.push({
      //     correo: `jhohan${i}@mailinator.com`,
      //     // correo: `jhohanf.silva@gmail.com`,
      //     token: i + 502,
      //     nombres: `Jhohan - ${i}`
      //   });
      // }
      // console.log("Fake", usuarios_envio);

      console.log("Real", lista_envio);
      var formData = new FormData();
      formData.append("usuarios", JSON.stringify(lista_envio));
      formData.append("enlace_zoom", enlace);
      formData.append("asamblea", JSON.stringify(asamblea));

      fetch("https://titansoluciones.cloud/votaciones/email.service.php", {
        method: "POST",
        body: formData
      })
        .then(response => response.json())
        .then(result => {
          $this.card_loader = false;
          console.log("Respuesta correos:", result);
          $this.asamblea = null;
          $this.enlace_zoom = null;
          $this.archivo_csv = null;
          $this.$emit("msj",
            "Se han enviado correctamente los correos electrónicos",
            "green"
          );
        })
        .catch(error => {
          $this.card_loader = false;
          console.error(error);
          $this.$emit("msj",
            "Ha ocurrido un error durante el envío de los correos",
            "error"
          );
        });
    },
    validar_correos(correos) {
      this.correos = correos;
      // console.log(this.correos)
      var $this = this;
      this.validados = [];
      this.card_loader = true;
      this.consultar(0);
    },
    consultar(index) {
      var $this = this;
      var email = this.correos[index];
      var query = this.fb.$usuarios.where("correo", "==", email);
      query.get().then(data => {
        console.log(email, data.empty);
        if (!data.empty) {
          data.forEach(doc => {
            let data = doc.data();
            data.id = doc.id;
            $this.validados.push(data);
          });
        }
        index++;
        if (index == $this.correos.length) $this.fin_verificacion();
        else $this.consultar(index);
      });
    },
    leer_csv() {
      var $this = this;
      var data = this.archivo_csv;
      var reader = new FileReader();
      reader.readAsText(data);
      reader.onloadend = function() {
        var CSV = reader.result;
        var lineas = CSV.split(/\r\n|\n/);
        // lineas.pop();
        $this.validar_correos(lineas);
      };
    },
    get_asambleas() {
      var $this = this;
      $this.card_estado = true;
      this.fb.$asambleas.where("estado", "==", 0).onSnapshot(
        snapshot => {
          $this.asambleas = [];
          snapshot.forEach(doc => {
            let data = doc.data();
            data.id = doc.id;
            $this.asambleas.push(data);
          });

          $this.card_estado = false;
        },
        err => {
          $this.$emit("msj", "Ha ocurrido un error durante la consulta");
        }
      );
    }
  }
};
</script>