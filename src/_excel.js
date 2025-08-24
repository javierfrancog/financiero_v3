import Excel from "exceljs";

class _impresion_excel {
  workbook = new Excel.Workbook();
  worksheet = null;
  content = {
    logo: null,
    tabla: null,
    header: [],
    merge_header: ["B", "D"],
    sheetName: null,
  };
  nombre_archivo = null;
  tabla_render = null;

  constructor(params) {
    this.content.sheetName = params.sheetName || "HOJA";
    this.nombre_archivo = params.archivo || `INFORME-${new Date().getTime()}`;
    this.worksheet = this.workbook.addWorksheet(this.content.sheetName);
    this.content.header = params.header || null;
    this.content.logo = params.logo || null;
    this.content.tabla = params.tabla || null;
    this.content.scale = params.scale || 100;
    this.content.orientation = params.orientation || "portrait";
  }

  imprimir() {
    var $this = this;
    return new Promise(function(resolve, reject) {
      if ($this.encabezado_excel())
        if ($this.tabla_excel())
          if ($this.estilo_excel()) writexlsx().then(resolve);
    });

    async function writexlsx() {
      await $this.workbook.xlsx.writeBuffer().then((data) => {
        var blob = new Blob([data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${$this.nombre_archivo}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      });
    }
  }

  tabla_excel() {
    var final_encabezado = this.content.header.length;
    var inicio_tabla = `A${final_encabezado + 2}`;

    this.tabla_render = this.worksheet.addTable({
      name: "table",
      ref: inicio_tabla,
      headerRow: true,
      totalsRow: this.content.tabla.totalsRow || false,
      style: {
        theme: this.content.tabla.theme || "TableStyleMedium16",
        showRowStripes: true,
      },
      columns: this.tabla_header(),
      rows: this.tabla_datos(),
    });

    return true;
  }

  tabla_datos() {
    var datos = this.content.tabla.data;
    var columnas = this.content.tabla.columnas;
    var formato_datos = [];

    datos.forEach((row, index) => {
      formato_datos.push([]);
      columnas.forEach((columna) => {
        if (columna.format != "fecha" && columna.format != "string") {
          let val = row[columna.value] || "";
          val = parseFloat(val) || val.trim();
          formato_datos[index].push(val || "");
        } else {
          if (columna.format == "fecha") {
            let val = row[columna.value] || "";
            val = val.toString().trim();
            if (val.length == 8) {
              val =
                val.substring(0, 4) +
                "/" +
                val.substring(4, 6) +
                "/" +
                val.substring(6, 8);
            } else if (val.length == 6) {
              val =
                val.substring(0, 2) +
                "/" +
                val.substring(2, 4) +
                "/" +
                val.substring(4, 6);
            }
            formato_datos[index].push(val || "");
          } else if (columna.format == "string") {
            let val = row[columna.value] || "";
            val = val.toString().trim();
            formato_datos[index].push(val || "");
          }
        }
      });
    });

    return formato_datos;
  }

  estilo_excel() {
    var final_encabezado2 = this.content.header.length;
    var columnas_final_2 = this.content.tabla.columnas.length;

    var $this = this;
    var tabla = this.tabla_render;
    let rango = tabla.table.tableRef.split(":");
    let limite_ini = rango[0].substr(1);
    let limite_fin = null;
    columnas_final_2 > 26
      ? (limite_fin = rango[1].substr(2))
      : (limite_fin = rango[1].substr(1));

    this.worksheet.pageSetup.scale = this.content.scale;
    this.worksheet.pageSetup.orientation = this.content.orientation;
    this.worksheet.pageSetup.printTitlesRow = `1:${final_encabezado2 + 2}`;

    var heightRow = this.content.tabla.heightRow || false;
    this.worksheet._rows.forEach((row) => {
      if (row._number >= limite_ini && row._number <= limite_fin)
        row.height = heightRow || 20;
    });

    this.worksheet.columns.forEach((column) => {
      let width = 0;
      let id_columna = column._number;
      let config_column = $this.content.tabla.columnas[id_columna - 1] || false;

      column.eachCell({ includeEmpty: false }, (cell) => {
        let coord = null;
        let columna = null;
        let parent_columna = null;
        var col2 = cell._address.substring(1, 2);
        if (isNaN(parseFloat(col2))) {
          coord = parseInt(cell._address.substr(2));
          columna = String.fromCharCode(96 + id_columna).toUpperCase();
          parent_columna = cell._address.substr(0, 2);
        } else {
          coord = parseInt(cell._address.substr(1));
          columna = String.fromCharCode(96 + id_columna).toUpperCase();
          parent_columna = cell._address.substr(0, 1);
        }

        cell.alignment = {
          vertical: "middle",
        };

        if (
          coord >= parseInt(limite_ini) &&
          coord < parseInt(limite_fin) &&
          cell._address != "A1"
        ) {
          let actual = cell.value ? (cell.value.length || 10) + 5 : 10;
          width = actual > width ? actual : width;
        }

        if (
          coord > parseInt(limite_ini) &&
          columna == parent_columna &&
          config_column &&
          config_column.format &&
          config_column.format == "money"
        )
          cell.numFmt = "#,##0.00;[Red]-#,##0.00";

        if (
          coord > parseInt(limite_ini) &&
          columna == parent_columna &&
          config_column &&
          config_column.format &&
          config_column.format == "fecha"
        )
          cell.numFmt = "dd/mm/yyyy";
      });

      column.width = column._number == 1 && width < 20 ? 20 : width;
    });

    return true;
  }

  tabla_header() {
    let columnas = this.content.tabla.columnas;
    columnas.map((el) => {
      el.name = el.title;
    });

    return columnas;
  }

  encabezado_excel() {
    var $this = this;
    var bordes = {
      top: { style: "thin", color: { argb: "000" } },
      left: { style: "thin", color: { argb: "000" } },
      bottom: { style: "thin", color: { argb: "000" } },
      right: { style: "thin", color: { argb: "000" } },
    };

    var header = $this.content.header;

    var columnas_final = $this.content.tabla.columnas.length;
    var columnas_limite = columnas_final > 26 ? 20 : columnas_final;
    var final_text = String.fromCharCode(96 + columnas_limite);

    var inicial = $this.content.merge_header[0];
    var final =
      columnas_final < 4
        ? $this.content.merge_header[1]
        : final_text.toUpperCase();

    header.forEach((val, index) => {
      index++;
      let key_inicial = `${inicial + index}`;
      let key_final = `${final + index}`;
      let text = typeof val == "object" ? val.text : val;
      $this.worksheet.mergeCells(`${key_inicial}:${key_final}`);

      $this.worksheet.getRow(index).height = 20;

      var cell = $this.worksheet.getCell(key_inicial);
      cell.value = text;
      cell.font = {
        bold: typeof val == "object" ? val.bold : false,
        size: typeof val == "object" ? val.size : 12,
      };

      cell.alignment = {
        vertical: "middle",
        horizontal: "left",
      };

      cell.border = bordes;
    });

    let logo_merge = `A1:A${header.length}`;
    var image = $this.workbook.addImage({
      base64: $this.content.logo,
      extension: "png",
    });
    $this.worksheet.addImage(image, logo_merge);
    $this.worksheet.mergeCells(logo_merge);
    $this.worksheet.getColumn("A").width = 20;
    $this.worksheet.getCell("A1").border = bordes;

    return true;
  }
}

// ✅ FUNCIÓN PRINCIPAL QUE ESPERA EL COMPONENTE
var _informe = (params) => {
  return new Promise(function(resolve, reject) {
    try {
      let config = new _impresion_excel(params);
      config.imprimir().then(() => {
        resolve();
      }).catch(reject);
    } catch (error) {
      console.error('❌ Error en _informe:', error);
      reject(error);
    }
  });
};

var formatos_excel = {
  data: () => {
    return {
      excel: {
        _informe,
      },
    };
  },
};

// ✅ ASIGNAR A WINDOW (ESTO ES LO QUE FALTABA)
if (typeof window !== 'undefined') {
  window.excel = {
    _informe
  };
} else {
  console.warn('⚠️ window no disponible (entorno servidor)');
}

export { formatos_excel, _informe };

// ✅ EXPORT DEFAULT PARA COMPATIBILIDAD
export default {
  _informe
};

