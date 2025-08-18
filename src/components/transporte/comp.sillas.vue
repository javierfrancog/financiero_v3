<template>
  <div>
    <div class="car" :id="plantilla" v-if="plantilla">
      <section
        v-for="(fila, index) in plantillas[plantilla].sillas"
        :key="index"
      >
        <div
          v-for="(item, idx) in fila"
          :id="plantilla + '_' + item"
          :key="idx"
          :class="item ? 'silla' : 'pass'"
          :ref="'silla-' + index + '-' + idx"
          v-on="
            item && item != 'Puerta' && item != 'Conductor'
              ? {
                  click: () =>
                    select(item, index, idx, 'silla-' + index + '-' + idx),
                }
              : {}
          "
        >
          {{ item || "" }}
        </div>
      </section>
    </div>

    <v-dialog v-model="modal_pasajero.estado" persistent max-width="800">
      <v-card>
        <v-card-title class="text-h5"> Información de pasajero</v-card-title>
        <p class="text-h6 ml-6"><strong>Máximo 3 Pasajeros por Tiquete</strong></p>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-combobox
                label="Identificación"
                :items="list_pasajeros"
                :item-text="format_pasajeros"
                v-model="form_pasajero.id"
                @change="asignarNombres()"
                :error="errores_pasajero.id"
                @input="errores_pasajero.id = false"
                outlined
                clearable
                return-object
                hide-details
                hide-no-data
                :search-input.sync="search_pasajero"
                :loading="loading"
                tabindex="1"
              >
              </v-combobox>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Nombres y apellidos"
                v-model="form_pasajero.nombre"
                :error="errores_pasajero.nombre"
                @input="errores_pasajero.nombre = false"
                outlined
                hide-details
                clearable
                tabindex="1"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="Temperatura"
                v-model="form_pasajero.temperatura"
                :error="errores_pasajero.temperatura"
                @input="errores_pasajero.temperatura = false"
                outlined
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="7" wrap>
              <v-text-field
                label="Escanear cédula"
                outlined
                hide-details
                clearable
                v-model="form_pasajero.escaneo"
                tabindex="1"
                id="cedula_escaner"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                id="1apellido_esacaner"
                hide-details
                tabindex="2"
                style="opacity: 0"
              ></v-text-field>
              <v-text-field
                id="2apellido_esacaner"
                hide-details
                tabindex="3"
                dense
                style="opacity: 0"
              ></v-text-field>
              <v-text-field
                id="1nombre_escaner"
                hide-details
                tabindex="4"
                dense
                style="opacity: 0"
              ></v-text-field>
              <v-text-field
                id="2nombre_escaner"
                hide-details
                tabindex="5"
                dense
                style="opacity: 0"
              ></v-text-field>
              <v-text-field
                hide-details
                tabindex="6"
                dense
                style="opacity: 0"
              ></v-text-field>
              <v-text-field
                hide-details
                tabindex="7"
                dense
                style="opacity: 0"
              ></v-text-field>
              <v-text-field
                id="pause_escaner"
                hide-details
                tabindex="8"
                dense
                style="opacity: 0"
                @keydown.prevent="escanearCedula"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeModalPasajero()">
            Cancelar
          </v-btn>
          <v-btn
            color="blue darken-2"
            class="white--text"
            @click="guardarPasajero()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import post from "../../methods.js";

export default {
  props: {
    plantilla: String,
    sillas_model: Array,
  },
  data() {
    return {
      loading: false,
      plantillas: {
        plantilla1: {
          sillas: [
            [16, 15, 14],
            [13, false, 12, 11],
            [10, false, 9, 8],
            [7, false, 6, 5],
            ["Puerta", 4, 3],
            [1, 2, "Conductor"],
          ],
        },
        plantilla2: {
          sillas: [
            [17, 16, 15, 14],
            [13, false, 12, 11],
            [10, false, 9, 8],
            [7, false, 6, 5],
            ["Puerta", 4, 3],
            [1, 2, "Conductor"],
          ],
        },
        plantilla3: {
          sillas: [
            [7, 6, 5],
            [8, false, 4],
            ["Puerta", 3, 2],
            [1, "Conductor"],
          ],
        },
        plantilla4: {
          sillas: [
            [15, 14, 13],
            [12, false, 11, 10],
            [9, false, 8, 7],
            ["", false, 6, 5],
            ["Puerta", false, 4, 3],
            [1, 2, "Conductor"],
          ],
        },
        plantilla14: {
          sillas: [
            [7, 6, 5],
            [8, 9, 4],
            ["Puerta", 3, 2],
            [1, "Conductor"],
          ],
        },

        plantilla5: {
          sillas: [
            [43, 44, false, 42, 41],
            [39, 40, false, 38, 37],
            [35, 36, false, 34, 33],
            [31, 32, false, 30, 29],
            [27, 28, false, 26, 25],
            [23, 24, false, 22, 21],
            [19, 20, false, 18, 17],
            [15, 16, false, 14, 13],
            [11, 12, false, 10, 9],
            [7, 8, false, 6, 5],
            [3, 4, false, 2, 1],
            ["Puerta", "Conductor"],
          ],
        },
        plantilla6: {
          sillas: [
            [14, 13, 12, 11],
            [10, false, 9, 8],
            [7, false, 6, 5],
            ["Puerta", false, 4, 3],
            [1, 2, "Conductor"],
          ],
        },
        plantilla7: {
          sillas: [
            [2, 3, 4],
            [1, "Conductor"],
          ],
        },

        plantilla8: {
          sillas: [
            [17, 16, 15, 14],
            [13, false, 12, 11],
            [10, false, 9, 8],
            [7, false, 6, 5],
            ["Puerta", 18, 4, 3],
            [1, 2, "Conductor"],
          ],
        },
        plantilla9: {
          sillas: [
            [35, 36, false, 34, 33],
            [31, 32, false, 30, 29],
            [27, 28, false, 26, 25],
            [23, 24, false, 22, 21],
            [19, 20, false, 18, 17],
            [15, 16, false, 14, 13],
            [11, 12, false, 10, 9],
            [7, 8, false, 6, 5],
            [3, 4, false, 2, 1],
            ["Puerta", "Conductor"],
          ],
        },
        plantilla19: {
          sillas: [
            [17, 16, 15, 14],
            [13, 19, 12, 11],
            [10, false, 9, 8],
            [7, false, 6, 5],
            ["Puerta", 18, 4, 3],
            [1, 2, "Conductor"],
          ],
        },

        plantilla20: {
          sillas: [
            [43, 44, false, 42, 41],
            [39, 40, false, 38, 37],
            [35, 36, false, 34, 33],
            [31, 32, false, 30, 29],
            [27, 28, false, 26, 25],
            [23, 24, false, 22, 21],
            [19, 20, false, 18, 17],
            [15, 16, false, 14, 13],
            [11, 12, false, 10, 9],
            [7, 8, false, 6, 5],
            [3, 4, false, 2, 1],
            ["Puerta", "Conductor"],
          ],
        },
        plantilla11: {
          sillas: [
            [39, 40, false, 38, 37],
            [35, 36, false, 34, 33],
            [31, 32, false, 30, 29],
            [27, 28, false, 26, 25],
            [23, 24, false, 22, 21],
            [19, 20, false, 18, 17],
            [15, 16, false, 14, 13],
            [11, 12, false, 10, 9],
            [7, 8, false, 6, 5],
            [3, 4, false, 2, 1],
            ["Puerta", "Conductor"],
          ],
        },
        plantilla12: {
          sillas: [
            [false, false, false, 42, 41],
            [39, 40, false, 38, 37],
            [35, 36, false, 34, 33],
            [31, 32, false, 30, 29],
            [27, 28, false, 26, 25],
            [23, 24, false, 22, 21],
            [19, 20, false, 18, 17],
            [15, 16, false, 14, 13],
            [11, 12, false, 10, 9],
            [7, 8, false, 6, 5],
            [3, 4, false, 2, 1],
            ["Puerta", "Conductor"],
          ],
        },
        plantilla13: {
          sillas: [
            [43, 44, false, 42, 41],
            [39, 40, false, 38, 37],
            [35, 36, false, 34, 33],
            [31, 32, false, 30, 29],
            [27, 28, false, 26, 25],
            [23, 24, false, 22, 21],
            [19, 20, false, 18, 17],
            [15, 16, false, 14, 13],
            [11, 12, false, 10, 9],
            [7, 8, false, 6, 5],
            [3, 4, false, 2, 1],
            ["Puerta", "Conductor"],
          ],
        },
        plantilla33: {
          sillas: [
            [16, 15, 14],
            [false, false, false],
            [13, false, 12, 11],
            [10, false, 9, 8],
            [7, false, 6, 5],
            ["Puerta", 4, 3],
            [1, 2, "Conductor"],
          ],
        },
        plantilla25: {
          sillas: [
            [16, 15, 14],
            [13, false, 12, 11],
            [10, false, 9, 8],
            [7, false, 6, 5],
            ["Puerta", 4, 3],
            [1, 2, "Conductor"],
          ],
        },
      },
      modal_pasajero: {
        estado: false,
      },

      search_pasajero: null,
      list_pasajeros: [],
      form_pasajero: {
        id: null,
        nombre: null,
      },
      errores_pasajero: {},

      pasajeros_list: [],
      current_silla: {},
    };
  },
  watch: {
    search_pasajero(val) {
      if (val && val !== this.form_pasajero.id && val.length == 6)
        this.querySelections(val);
      else if (!val || val.length < 7) this.list_pasajeros = [];
    },
    async sillas_model(val) {
      const _this = this;

      let list_selected = document.getElementsByClassName("selected") || [];

      if (list_selected.length)
        [...list_selected].forEach((el) => el.classList.remove("selected"));

      let ids_block = [];
      let list_block = document.getElementsByClassName("block");
      if (list_block.length) {
        [...list_block].forEach((el) => ids_block.push(el.id));
        ids_block.forEach((item) => {
          let el = document.getElementById(item);
          el.classList.remove("block");
        });
      }

      for (const el of val) {
        let { ref, silla } = el.silla;
        let { type } = el;

        if (type === "ocuped") {
          _this.update_silla(silla, "block", "add");
        }

        if (type === "selected") {
          _this.update_silla(silla, "selected", "add");
        }
      }
    },
  },
  methods: {
    querySelections(string) {
      this.loading = true;
      let idpas = string;
      post
        .postData({
          url: "/transporte/dlls/PrPasajerosJ.dll",
          data: sessionStorage.Sesion + "|" + idpas + "|",
          method: "",
        })
        .then((data) => {
          this.loading = false;
          this.list_pasajeros = JSON.parse(JSON.stringify(data));
        })
        .catch((err) => {
          this.loading = false;
          this.send_error("Error al cargar pasajeros!");
        });
    },
    asignarNombres() {
      if (this.form_pasajero.id) {
        this.form_pasajero.nombre = this.form_pasajero.id.descrip_pas.trim();
        if (this.errores_pasajero.nombre) this.errores_pasajero.nombre = false;
      }
    },
    format_pasajeros: function (val) {
      return val.id_pas.trim() + " - " + val.descrip_pas.trim();
    },

    validarCampo(campo, data) {
      if (!data[campo]) {
        this.errores_pasajero[campo] = true;
        this.send_error("Campo Obligatorio!");
      }
    },
    async validarPasajero({ id, nombre }) {
      let idpas = 0;
      if (this.form_pasajero.id.id_pas) {
        idpas = this.form_pasajero.id.id_pas;
      } else {
        idpas = this.form_pasajero.id;
      }
      await post
        .postData({
          url: "/transporte/dlls/PrPasajeros.dll",
          data: sessionStorage.Sesion + "|" + idpas + "|" + nombre + "|",
          method: "",
        })
        .then((data) => {
          console.log("-> RES");
        });

      return true;
    },
    async guardarPasajero() {
      var data = JSON.parse(JSON.stringify(this.form_pasajero));
      let camposllenos = true;

      Object.keys(this.errores_pasajero).forEach((el) => {
        this.validarCampo(el, data);
        if (this.errores_pasajero[el]) camposllenos = false;
      });

      if (camposllenos) {
        await this.validarPasajero(data);
        this.pasajeros_list.push({
          pasajero: data,
          silla: this.current_silla,
        });

        // this.update_silla(this.current_silla.silla, "selected", "add");
        this.current_silla = {};
        this.modal_pasajero.estado = false;
        this.update_model();
        this.init_formPasajero();
      }
    },
    update_silla(silla, status, method) {
      let ref = null;
      let plantilla = this.plantillas[this.plantilla];
      plantilla.sillas.forEach((el, row) => {
        el.forEach((e, col) => {
          if (silla === e) ref = `silla-${row}-${col}`;
        });
      });

      let ref_obj = this.$refs[ref];

      if (ref_obj.length) {
        let el = ref_obj[0];

        if (method === "add") el.classList.add(status);
      }
    },
    reset_pasajeros() {
      this.pasajeros_list = [];
    },

    init_formPasajero() {
      this.search_pasajero = null;

      this.list_pasajeros = [];
      this.form_pasajero = {};
      this.errores_pasajero = this.modal_pasajero.estado
        ? {
            id: false,
            nombre: false,
            temperatura: false,
          }
        : {};
    },

    seleccionar_silla() {
      // this.pasajeros_list.push({
      //       pasajero: {id:99},
      //       silla: this.current_silla,
      //     });
      this.update_model();
      // this.pasajeros_list.shift()
    },

    update_model() {
      this.$emit("modelSillas", this.pasajeros_list);
    },
    closeModalPasajero() {
      let sillaActual = this.current_silla.silla;
      let pasajeros = JSON.parse(JSON.stringify(this.pasajeros_list));

      let indexSilla = pasajeros.findIndex(
        (el) => el.silla.silla === sillaActual
      );

      this.pasajeros_list.splice(indexSilla, 1);
      this.update_model();

      let { ref } = this.current_silla;
      this.$emit("deleteSilla", { ref });

      this.modal_pasajero.estado = false;
      this.init_formPasajero();
    },

    select(silla, row, col, ref) {
      let el = event.target;

      if (el.classList.contains("selected")) {
        let index = this.pasajeros_list.findIndex((el) => el.silla.ref === ref);
        this.pasajeros_list.splice(index, 1);
        this.update_model();
        this.$emit("deleteSilla", { ref });
      } else if (!el.classList.contains("block")) {
        this.modal_pasajero.estado = true;
        this.init_formPasajero();
        this.form_pasajero.temperatura = "36.5";

        this.current_silla = {
          silla,
          row,
          col,
          ref,
          type: "selected",
        };
        this.seleccionar_silla();
      }
    },
    send_error(msj) {
      this.$emit("error", msj);
    },
    escanearCedula() {
      var cedula = document.getElementById("cedula_escaner").value;
      var apellido1 = document.getElementById("1apellido_esacaner").value;
      var apellido2 = document.getElementById("2apellido_esacaner").value;
      var nombre1 = document.getElementById("1nombre_escaner").value;
      var nombre2 = document.getElementById("2nombre_escaner").value;

      this.$set(this.form_pasajero, "id", cedula);
      this.$set(
        this.form_pasajero,
        "nombre",
        `${nombre1} ${nombre2} ${apellido1} ${apellido2}`
      );
    },
  },
};
</script>

<style>
.car {
  width: 200px;
  height: auto;
  background: rgba(0, 0, 0, 0.08);
}

.car section {
  display: flex;
  margin: 0 auto;
}

.car section .silla,
.car section .pass {
  flex: 1 1 0;
  height: 70px;
  text-align: center;
  line-height: 70px;
}

.car section .silla {
  background: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  margin: 2px;
}

.car section .active {
  background: #4caf50 !important;
  color: #fff;
}

.car section .selected {
  background: #ff9800 !important;
  color: #fff;
}

.car section .block {
  background: #d63a3a !important;
  color: #fff;
  cursor: default !important;
}

.car section .silla:hover {
  background: rgba(0, 0, 0, 0.15);
}
</style>
