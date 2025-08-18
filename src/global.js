const financiero = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/financiero",
    id: "FIN10000000",
    submenu: [
      {
        text: "Contables",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN10100000",
        submenu2: [
          {
            text: "Registros",
            icono: "mdi-file-edit",
            href: "/Compcontab",
            id: "FIN10100001",
          },
          {
            text: "Reimpresión",
            icono: "mdi-printer-check",
            href: "/PrReimpCb",
            id: "FIN10100002",
          },
          {
            text: "Actualizar",
            icono: "mdi-chemical-weapon",
            href: "/PrCorrecCb",
            id: "FIN10100003",
          },
          {
            text: "Anulación",
            icono: "mdi-delete-forever-outline",
            href: "/PrAnulaCb",
            id: "FIN10100004",
          },
          {
            text: "Documento Soporte",
            icono: "flip_to_front",
            href: "/Docsoporte",
            id: "FIN10100005",
          },
          {
            text: "Reimpresión Doc_Soporte",
            icono: "mdi-printer-check",
            href: "/PrReimpDocsp",
            id: "FIN10100006",
          },
          {
            text: "Importar Doc_Soporte",
            icono: "mdi-arrow-up-bold-outline",
            href: "/PrImpDocsp",
            id: "FIN10100009",
          },
          {
            text: "Acuse Facturación",
            icono: "mdi-biohazard",
            href: "/testtitan",
            id: "FIN10100010",
            // id: "FIN10101099",            
          },

          // {
          //   text: "Acuse Facturación",
          //   icono: "mdi-check-bold",
          //   href: "/PrAcusefact",
          //   id: "FIN10100010",            
          // },
          {
            text: "Concilia Bancos",
            icono: "mdi-bank-check",
            href: "/PrConcBancos",
            id: "FIN10100008",
          },

        ],
      },
      {
        text: "Cierres",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN11800000",
        submenu2: [
          {
            text: "Cierre Nómina",
            icono: "mdi-account-lock",
            href: "/PrCierregth",
            id: "FIN11800001",
          },
          {
            text: "Cierre Inventarios",
            icono: "mdi-check-underline-circle-outline",
            href: "/PrCierreinv",
            id: "FIN11800002",
          },
          {
            text: "Depreciación Y Costos",
            icono: "mdi-finance",
            href: "/Pr_Deprectos",
            id: "FIN11800003",
          },
          {
            text: "Cierre Contable",
            icono: "mdi-lock-alert",
            href: "/PrCierreCb",
            id: "FIN11800004",
          },
          {
            text: "Bloqueo Contable",
            icono: "mdi-attachment-off",
            href: "/PrBloqueoCb",
            id: "FIN11800005",
          },

        ],
      },
      {
        text: "Otros Procesos",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN10101000",
        submenu2: [
          {
            text: "Clonar Documentos",
            icono: "mdi-sheep",
            href: "/PrClonarCb",
            id: "FIN10101001",
          },
          {
            text: "Recalcular Cartera",
            icono: "mdi-rotate-right",
            href: "/PrCartera",
            id: "FIN10101002",
          },
          {
            text: "Trasladar Registros",
            icono: "mdi-shuffle-variant",
            href: "/Prtraslcont",
            id: "FIN10101003",
          },
          {
            text: "Importar Contabilidad",
            icono: "mdi-arrow-up-bold-outline",
            href: "/PrImportcont",
            id: "FIN10101004",
          },
          {
            text: "Eliminar Doc. Contable",
            icono: "mdi-alien-outline",
            href: "/PrEliminacont",
            id: "FIN10101005",
          },
          {
            text: "Actualizar Proveedor",
            icono: "mdi-account-box-outline",
            href: "/Pr_Actprov",
            id: "FIN10101007",
          },
          {
            text: "Presupuesto Comercial",
            icono: "mdi-finance",
            href: "/PrpptoCom",
            id: "FIN10101006",
          },
          {
            text: "Acuse Facturación_Em",
            icono: "mdi-check-bold",
            href: "/PrAcusefact",
            id: "FIN10100010",
          },
        ],
      },
    ],
  },
  // {
  //   text: "Reportes",
  //   icono: "mdi-cloud-print-outline",
  //   submenu: [

  //   ]
  // },

  {
    text: "Reportes",
    icono: "mdi-cloud-print-outline",
    ruta: "/menu/financiero",
    id: "FIN20000000",
    submenu: [
      {
        text: "Reportes Contables",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN20100000",
        submenu2: [
          {
            text: "E.S.F. Comparativa",
            icono: "mdi-finance",
            href: "/rp-estsitfin",
            id: "FIN20100001",
          },
          {
            text: "E.S.F. del Mes",
            icono: "mdi-currency-inr",
            href: "/rp-estsitfin2",
            id: "FIN20100002",
          },
          {
            text: "E.S.F. / Periodos",
            icono: "mdi-alpha-p-box-outline",
            href: "/rp-estsitfin4",
            id: "FIN20100015",
          },

          {
            text: "Balance de Prueba",
            icono: "mdi-currency-rub",
            href: "/rp-esfperiodo",
            id: "FIN20100012",
          },
          {
            text: "Libro Mayor",
            icono: "mdi-numeric",
            href: "/rp-lbmayor",
            id: "FIN20100011",
          },
          {
            text: "Libro Diario",
            icono: "mdi-abacus",
            href: "/rp-lbdiario",
            id: "FIN20100013",
          },
          {
            text: "Libro Diario Detallado",
            icono: "mdi-book-open-variant",
            href: "/rp-lbdiariodet",
            id: "FIN20100014",
          },


          // {
          //   text: "Est.Resultados Integrales",
          //   icono: "mdi-apple-keyboard-option",
          //   href: "/rp-estresint",
          // },
          // {
          //   text: "Est.Flujos de Efectivo",
          //   icono: "mdi-apple-keyboard-command",
          //   href: "/rp-estflujos",
          // },
          {
            text: "Cambios en el Patrimonio",
            icono: "mdi-fast-forward-5",
            href: "/rp-estcambios",
            id: "FIN20100003",
          },
          {
            text: "Auxiliares",
            icono: "mdi-filter-variant-plus",
            href: "/rp-Auxiliar1",
            id: "FIN20100004",
          },
          {
            text: "Balance por Rut",
            icono: "mdi-account-cash",
            href: "/rp-estsitfin3",
            id: "FIN20100005",
          },
          {
            text: "Balance por C.Costo",
            icono: "mdi-circle-multiple",
            href: "/rp-balancecc",
            id: "FIN20100006",
          },
          {
            text: "Proveedores",
            icono: "mdi-briefcase-check-outline",
            href: "/rp-proveedores",
            id: "FIN20100007",
          },
          {
            text: "Cartera",
            icono: "mdi-clipboard-text-play-outline",
            href: "/rp-cartera1",
            id: "FIN20100008",
          },
          {
            text: "Conciliación Bancaria",
            icono: "mdi-bank-check",
            href: "/rp-concilia",
            id: "FIN20100009",
          },

          {
            text: "Comprobantes",
            icono: "mdi-tray-full",
            href: "/rp-PrResumenCb",
            id: "FIN20100010",
          },
          {
            text: "Validación Recaudos",
            icono: "mdi-cash-check",
            href: "/rp-valrecaudo",
            id: "FIN20100011",
          },

        ],
      },
      // {
      //   text: "Proveedores",
      //   icono: "mdi-clipboard-text-play-outline",
      //   submenu: [
      //     {
      //       text: "Reporte Proveedores",
      //       icono: "mdi-currency-php",
      //       href: "/rp-proveedores"
      //     }
      //   ]
      // },
      {
        text: "Tributarios",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN20200000",
        submenu2: [
          {
            text: "Formulario RteFte",
            icono: "mdi-account-cash-outline",
            href: "/Rp-formrtefte",
            id: "FIN20200001",
          },

          {
            text: "Formulario Iva",
            icono: "mdi-cash-check",
            href: "/rp-Formiva",
            id: "FIN20200002",
          },
          {
            text: "Formulario Renta",
            icono: "mdi-alpha-r-circle-outline",
            href: "/rp-Formrenta",
            id: "FIN20200009",
          },
          {
            text: "Exogena Dian",
            icono: "mdi-orbit",
            href: "/rp-infodian",
            id: "FIN20200004",
          },
          {
            text: "Formulario Retención Ica",
            icono: "mdi-align-vertical-center",
            href: "/rp-Formica",
            id: "FIN20200005",
          },
          {
            text: "Formulario Ica Anual",
            icono: "mdi-box-shadow",
            href: "/rp-Formicanual",
            id: "FIN20200008",
          },

          {
            text: "Exogena Ica",
            icono: "mdi-format-line-style",
            href: "/rp-infoicav",
            id: "FIN20200006",
          },
          {
            text: "Ingresos por Municipio",
            icono: "mdi-alpha-m-box-outline",
            href: "/rp-icamun",
            id: "FIN20200010",
          },

          {
            text: "Cert. ReteFte",
            icono: "mdi-shield-edit-outline",
            href: "/rp-certrtefte",
            id: "FIN20200003",
          },
          {
            text: "Cert. ReteIva",
            icono: "mdi-alpha-i-box-outline",
            href: "/rp-certrteiva",
            id: "FIN20200009",
          },

          {
            text: "Cert. ReteIca",
            icono: "mdi-order-numeric-ascending",
            href: "/rp-certrteica",
            id: "FIN20200007",
          },

        ],
      },
      {
        text: "Entidades de Control",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN20300000",
        submenu2: [
          {
            text: "SuperSalud",
            icono: "mdi-clipboard-pulse-outline",
            href: "/rp-Ssalud",
            id: "FIN20300001",
          }
        ]
      },
    ],
  },

  {
    text: "Configuración",
    icono: "mdi-cogs",
    ruta: "/menu/financiero",
    id: "FIN30000000",
    submenu: [
      {
        text: "Configuración Contable",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN30100000",
        submenu2: [
          {
            text: "Ruts",
            icono: "mdi-account-check",
            href: "/ruts",
            id: "FIN30100001",
          },
          {
            text: "Cuentas",
            icono: "mdi-currency-cny",
            href: "/cuentasc",
            id: "FIN30100002",
          },
          {
            text: "C.Costos",
            icono: "mdi-closed-caption",
            href: "/ccostos",
            id: "FIN30100003",
          },
          {
            text: "Conceptos Contables",
            icono: "mdi-currency-twd",
            href: "/conceptosc",
            id: "FIN30100004",
          },
          // {
          //   text: "Clasificación Niif",
          //   icono: "mdi-format-text-rotation-down-vertical",
          //   href: "/clasniif",
          //   id: "FIN30100005",            
          // },
          {
            text: "Resoluciones Dian",
            icono: "mdi-key-wireless",
            href: "/resdian",
            id: "FIN30100006",
          },
          {
            text: "Documentos Contables",
            icono: "mdi-two-factor-authentication",
            href: "/doccontab",
            id: "FIN30100007",
          },
        ],
      },
      {
        text: "Mercancías",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN30400000",
        submenu2: [
          {
            text: "Conf.Listas de Precios",
            icono: "mdi-file-cog-outline",
            href: "/ConfListas",
            id: "FIN30400001",
          },
          {
            text: "Cargue Listas de Precios",
            icono: "mdi-basket-fill",
            href: "/CargueListas",
            id: "FIN30400002",
          },
          {
            text: "Productos",
            icono: "mdi-cart-plus",
            href: "/productos",
            id: "FIN30400003",
          },
          {
            text: "Clasificaciones",
            icono: "mdi-animation-outline",
            href: "/clasifica",
            id: "FIN30400004",
          },
          {
            text: "Marcas",
            icono: "mdi-alpha-r-circle-outline",
            href: "/cf_marcas",
            id: "FIN30400011",
          },
          {
            text: "Agencias/Sucursales",
            icono: "mdi-stretch-to-page",
            href: "/agencias",
            id: "FIN30400005",
          },
          {
            text: "Máquinas POS",
            icono: "mdi-desktop-classic",
            href: "/cf_cajaspos",
            id: "FIN30400012",
          },

          {
            text: "Asesores",
            icono: "mdi-human-handsup",
            href: "/Asesores",
            id: "FIN30400006",
          },
          {
            text: "Ubicaciones",
            icono: "mdi-map-marker-plus-outline",
            href: "/Ubicaciones",
            id: "FIN30400007",
          },
          {
            text: "Tipos de Operación",
            icono: "mdi-swap-horizontal",
            href: "/TpOperInv",
            id: "FIN30400008",
          },
          {
            text: "Actividad Producción",
            icono: "mdi-braille",
            href: "/CfActprod",
            id: "FIN30400009",
          },
          {
            text: "Programar Factura",
            icono: "mdi-alarm-snooze",
            href: "/CfPrgFact",
            id: "FIN30400010",
          },
          {
            text: "Homologar Productos",
            icono: "mdi-arrow-collapse-horizontal",
            href: "/cf_homolprod",
            id: "FIN30400013",
          },

        ],
      },

      {
        text: "Tributario",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN30200000",
        submenu2: [
          // {
          //   text: "Formulario RteFte",
          //   icono: "mdi-account-cash-outline",
          //   href: "/formrtefte",
          //   id: "FIN30200001",
          // },
          // {
          //   text: "Formulario Iva",
          //   icono: "mdi-cash-check",
          //   href: "/cfformiva",
          //   id: "FIN30200002",
          // },
          // {
          //   text: "Formulario Renta",
          //   icono: "mdi-alpha-r-circle-outline",
          //   href: "/cfformrenta",
          //   id: "FIN30200004",
          // },

          {
            text: "Tarifas ICA",
            icono: "mdi-chart-bubble",
            href: "/cftarica",
            id: "FIN30200003",
          },
          // {
          //   text: "Exogena ICA",
          //   icono: "mdi-percent-box-outline",
          //   href: "/cftexoica",
          //   id: "FIN30200004",            
          // },

        ],
      },

      {
        text: "Otras Configuraciones",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN30500000",
        submenu2: [
          {
            text: "Usuarios",
            icono: "mdi-account-key",
            href: "/usuarios",
            id: "FIN30500001",
          },
          {
            text: "Empresa",
            icono: "mdi-message-cog",
            href: "/empresa",
            id: "FIN30500002",
          },
          {
            text: "Perfiles",
            icono: "mdi-account-details",
            href: "/cfperfil",
            id: "FIN30500003",
          },
          {
            text: "Libro de Socios",
            icono: "mdi-card-account-details-outline",
            href: "/cfsocios",
            id: "FIN30500004",
          },


          // {
          //   text: "Consecutivos",
          //   icono: "mdi-numeric",
          //   href: "/consecutivos",
          // },
        ],
      },
    ],
  },
];

const punto_venta = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/punto_venta",
    id: "MER10000001",
    submenu: [
      {
        text: "Comercial",
        icono: "mdi-clipboard-text-play-outline",
        id: "MER10600001",
        submenu2: [
          {
            text: "Expedir Factura",
            icono: "mdi-cart-plus",
            href: "/facturacion",
          },
          {
            text: "Reimpresión Factura",
            icono: "mdi-printer-check",
            href: "/PrReimpfact",
          },
          {
            text: "Consultar Factura",
            icono: "mdi-function-variant",
            href: "/PrConsfact",
          },
          {
            text: "Generar Cotización",
            icono: "mdi-comment-edit-outline",
            href: "/cotizacion",
          },
          {
            text: "Reimpresión Cotización",
            icono: "mdi-printer-check",
            href: "/PrReimpcotiz",
          },
          {
            text: "Generar Pedido",
            icono: "mdi-human-edit",
            href: "/pedido",
          },
          {
            text: "Reimpresión Pedido",
            icono: "mdi-printer-check",
            href: "/PrReimppedido",
          },
          {
            text: "Generar Nota Credito",
            icono: "mdi-minus-box",
            href: "/Ncredito",
          },
          {
            text: "Reimpresión Ncredito",
            icono: "mdi-printer-check",
            href: "/PrReimpNc",
          },
          {
            text: "Generar Nota Débito",
            icono: "mdi-plus-box",
            href: "/pr_Ndebito",
          },
          {
            text: "Reimpresión Débito",
            icono: "mdi-printer-check",
            href: "/pr_ReimpNd",
          },

          {
            text: "Generar Proforma",
            icono: "mdi-file-document-edit",
            href: "/Proforma",
          },
          {
            text: "Reimpresión Proforma",
            icono: "mdi-printer-check",
            href: "/Reimpproforma",
          },

        ],
      },
      {
        text: "Mercancías",
        icono: "mdi-clipboard-text-play-outline",
        id: "MER10800000",
        submenu2: [
          {
            text: "Registro Mercancías",
            icono: "mdi-folder-swap-outline",
            href: "/PrReginvent",
            id: "MER10800001",
          },
          {
            text: "Reimpresión Mercancías",
            icono: "mdi-printer-check",
            href: "/PrReimpinvent",
            id: "MER10800002",
          },
          {
            text: "Actualizar Mercancías",
            icono: "mdi-chemical-weapon",
            href: "/PrCorrecinv",
            id: "MER10800003",
          },
          {
            text: "Traslado Mercancías",
            icono: "mdi-application-export",
            href: "/PrTrasinvent",
            id: "MER10800004",
          },
          {
            text: "Anulación Mercancías",
            icono: "mdi-delete-forever-outline",
            href: "/PrAnulainvent",
            id: "MER10800005",
          },
          {
            text: "Cierre Mercancías",
            icono: "mdi-lock-alert",
            href: "/PrCierreinv",
            id: "MER10800006",
          },
          {
            text: "Importar Inv.Fisico",
            icono: "mdi-arrow-u-right-top",
            href: "/pr_Impfisicoinv",
            id: "MER10800007",
          },

        ],
      },
      {
        text: "Remisiones",
        icono: "mdi-clipboard-text-play-outline",
        id: "MER11500000",
        submenu2: [
          {
            text: "Remisión s/g Factura",
            icono: "mdi-transfer-right",
            href: "/remision",
            id: "MER11500001",
          },
          {
            text: "Remisión para Facturar",
            icono: "mdi-cash-100",
            href: "/pr-remisfact",
            id: "MER11500002",
          },
          {
            text: "Reimpresión Remisiones",
            icono: "mdi-printer-check",
            href: "/PrReimpremision",
            id: "MER11500003",
          },
          {
            text: "Facturar Pendientes",
            icono: "mdi-currency-usd",
            href: "/PrfactRemision",
            id: "MER11500004",
          },

        ],
      },
      {
        text: "Despachos",
        icono: "mdi-clipboard-text-play-outline",
        id: "MER10900000",
        submenu2: [
          {
            text: "Generar Despacho",
            icono: "mdi-cash-100",
            href: "/pr_despacho01",
            id: "MER10900001",
          },
          // {
          //   text: "Reimpresión Despacho",
          //   icono: "mdi-printer-wireless",
          //   href: "/pr-reimpordcotiza",
          //   id: "MER10900002",
          // },
          {
            text: "Facturar Despacho",
            icono: "mdi-currency-usd",
            href: "/pr_despacho03",
            id: "MER10900005",
          },
        ],
      },
      {
        text: "Ordenes Compra",
        icono: "mdi-clipboard-text-play-outline",
        id: "MER10900000",
        submenu2: [
          {
            text: "Orden de Cotización",
            icono: "mdi-cash-100",
            href: "/pr-ordencotiza",
            id: "MER10900001",
          },
          {
            text: "Reimpresión Ord.Cotización",
            icono: "mdi-printer-wireless",
            href: "/pr-reimpordcotiza",
            id: "MER10900002",
          },
          {
            text: "Expedir Orden de Compra",
            icono: "mdi-cart-variant",
            href: "/pr-ordencompra",
            id: "MER10900003",
          },
          {
            text: "Autorizar Orden de Compra",
            icono: "mdi-check-underline-circle-outline",
            href: "/pr-autoordcompra",
            id: "MER10900004",
          },
          {
            text: "Reimpresión Orden Compra",
            icono: "mdi-printer-settings",
            href: "/pr-reimpordcomp",
            id: "MER10900005",
          },
        ],
      },
      {
        text: "Tesorería",
        icono: "mdi-clipboard-text-play-outline",
        id: "MER10700000",
        submenu2: [
          {
            text: "Registros",
            icono: "mdi-file-edit",
            href: "/Comprob_pto",
            id: "MER10700001",
          },
          {
            text: "Reimpresión",
            icono: "mdi-printer-check",
            href: "/PrReimpCb",
            id: "MER10700002",
          },
          {
            text: "Doc_Soporte",
            icono: "flip_to_front",
            href: "/Docsoporte",
            id: "MER10700003",
          },
          {
            text: "Reimpresión Doc_Soporte",
            icono: "mdi-printer-check",
            href: "/PrReimpDocsp",
            id: "MER10700004",
          },
          {
            text: "Cierre de Caja",
            icono: "mdi-hand-coin-outline",
            href: "/pto_cierre",
            id: "MER10700005",
          },
        ],
      },
      {
        text: "Propiedad, Planta & Equipo",
        icono: "mdi-clipboard-text-play-outline",
        id: "MER11100000",
        submenu2: [
          {
            text: "Registro PP & Equipo",
            icono: "mdi-transfer-right",
            href: "/pr-ppyeq01",
            id: "MER11500001",
          },
        ],
      },
      {
        text: "Otros Procesos",
        icono: "mdi-clipboard-text-play-outline",
        id: "MER11000000",
        submenu2: [
          {
            text: "Actualizar Facturas",
            icono: "mdi-rotate-right",
            href: "/Practfact",
            id: "MER11000001",
          },
          {
            text: "ReProcesar Facturas",
            icono: "mdi-ballot-recount",
            href: "/Contafact",
            id: "MER11000002",
          },
          {
            text: "ReProcesar Notas Crédito",
            icono: "mdi-arrow-up-bold-hexagon-outline",
            href: "/ContaNcr",
            id: "MER11000003",
          },
          {
            text: "ReProcesar Remisiones",
            icono: "mdi-transfer-right",
            href: "/ContaRemr",
            id: "MER11000008",
          },

          {
            text: "Importar Facturas",
            icono: "mdi-arrow-up-bold-outline",
            href: "/Importfact",
            id: "MER11000004",
          },
          {
            text: "Exportar Facturas",
            icono: "mdi-arrow-down-bold-outline",
            href: "/Exportfact",
            id: "MER11000005",
          },
          {
            text: "Nota Credito-Cufe-",
            icono: "mdi-alpha-c-box-outline",
            href: "/ncred_cufe",
            id: "MER11000007",
          },

          // {
          //   text: "Importar Mercancías",
          //   icono: "mdi-format-vertical-align-top",
          //   href: "/Importinv",
          //   id: "MER11000006",
          // },
          {
            text: "Cierre Cartera",
            icono: "mdi-cash-multiple",
            href: "/Cierrecart",
            id: "MER11000007",
          },
          {
            text: "Cargue Cartera",
            icono: "mdi-format-vertical-align-top",
            href: "/cargue_cart",
            id: "MER11000007",
          },

        ],
      },
    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print-outline",
    ruta: "/menu/punto_venta",
    class: "red--text",
    id: "MER20000000",
    submenu: [
      {
        text: "Facturación",
        icono: "mdi-clipboard-text-play-outline",
        id: "MER21100000",
        submenu2: [
          {
            text: "Resumen de Ventas",
            icono: "mdi-cash-register",
            href: "/rp-RpResVta",
            id: "MER21100001",
          },
          {
            text: "Ventas por Producto",
            icono: "mdi-animation-outline",
            href: "/rp-RpVtaprod",
            id: "MER21100002",
          },
          {
            text: "Ventas por Cliente",
            icono: "mdi-emoticon-lol-outline",
            href: "/rp-RpVtacli",
            id: "MER21100003",
          },
          {
            text: "Ventas Detalladas",
            icono: "mdi-filter-variant-plus",
            href: "/rp-RpVtadet",
            id: "MER21100004",
          },
          {
            text: "Ventas x Tarifa",
            icono: "mdi-chart-bubble",
            href: "/rp-RpVtastar",
            id: "MER21100005",
          },
          {
            text: "Ventas x Consecutivo",
            icono: "mdi-numeric",
            href: "/rp-RpVtasconsec",
            id: "MER21100006",
          },


        ],
      },
      {
        text: "Mercancías",
        icono: "mdi-clipboard-text-play-outline",
        id: "MER20800000",
        submenu2: [
          {
            text: "Consulta x Producto",
            icono: "mdi-cart-check",
            href: "/rp-RpProducto",
            id: "MER20800001",
          },
          {
            text: "Consulta x Marca",
            icono: "mdi-alpha-r-circle-outline",
            href: "/rp-RpMarca",
            id: "MER20800007",
          },

          {
            text: "Saldo Mercancías",
            icono: "mdi-order-numeric-descending",
            href: "/rp-RpSaldos1",
            id: "MER20800002",
          },
          {
            text: "Kardex",
            icono: "mdi-filter-variant-plus",
            href: "/rp-RpKardex1",
            id: "MER20800003",
          },
          {
            text: "Rentabilidad Asesor",
            icono: "mdi-finance",
            href: "/rp-RpVended1",
            id: "MER20800004",
          },
          {
            text: "P.Planta y Equipos",
            icono: "mdi-golf-cart",
            href: "/rp-Ppequipo",
            id: "MER20800005",
          },
          {
            text: "Resumen Comprobantes",
            icono: "mdi-format-strikethrough-variant",
            href: "/rp-RpresComprob",
            id: "MER20800006",
          },

        ],
      },
      {
        text: "Pedidos",
        icono: "mdi-clipboard-text-play-outline",
        // id: "MER21100000",
        submenu2: [
          {
            text: "Pedidos Remisionados",
            icono: "mdi-truck-check-outline",
            href: "/rp-RpPedrem",
            // id: "MER21100001",
          },
        ],
      },
      {
        text: "Asesores",
        icono: "mdi-clipboard-text-play-outline",
        id: "MER21600000",
        submenu2: [
          {
            text: "Comisiones por venta",
            icono: "mdi-cart-check",
            href: "/rp-comisvta",
          },
          {
            text: "Comision por Recaudo",
            icono: "mdi-order-numeric-descending",
            href: "/rp-comisrec",
          },
        ],
      },
      {
        text: "Cartera",
        icono: "mdi-clipboard-text-play-outline",
        id: "MER21200000",
        submenu2: [
          {
            text: "Cartera",
            icono: "mdi-account-cash-outline",
            href: "/rp-cartera1",
          },
        ],
      },
      {
        text: "Proveedores",
        icono: "mdi-briefcase-check-outline",
        id: "MER21300000",
        submenu2: [
          {
            text: "Proveedores por Edades",
            icono: "mdi-briefcase-check-outline",
            href: "/rp-Proveedores2",
          },
        ],
      },

    ],
  },
  {
    text: "Configuración",
    icono: "mdi-cogs",
    ruta: "/menu/punto_venta",
    id: "MER30000000",
    submenu: [
      {
        text: "Punto de Venta",
        icono: "mdi-clipboard-text-play-outline",
        id: "MER31400001",
        submenu2: [
          {
            text: "Ruts",
            icono: "mdi-account-multiple-plus-outline",
            href: "/ruts",
            id: "MER31400001",
          },
          {
            text: "Productos",
            icono: "mdi-cart-plus",
            href: "/productos",
            id: "MER31400002",
          },
          {
            text: "Clasificaciones",
            icono: "mdi-animation-outline",
            href: "/clasifica",
            id: "MER31400003",
          },
          {
            text: "Unidades de Producto",
            icono: "mdi-consolidate",
            href: "/cf-unidadPr",
            id: "MER31400004",
          },
          {
            text: "Productos XML",
            icono: "mdi-xml",
            href: "/clasifica",
            id: "MER31400005",
          },

        ],
      },
    ],
  },
];
const clinico = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },


  {
    text: "Procesos",
    icono: "mdi-ballot-recount-outline",
    ruta: "/menu/clinico",
    id: "CLI10000000",

    submenu: [
      {
        text: "Prestación Servicios",
        icono: "mdi-clipboard-text-play-outline",
        id: "CLI15000000",
        submenu2: [
          {
            text: "Admision de Pacientes",
            icono: "mdi-account-plus",
            href: "/ingServicios",
            id: "CLI15000001",
          },
          {
            text: "Furips",
            icono: "mdi-human-male-height-variant",
            href: "/cl_furips",
            id: "CLI15000002",
          },
          {
            text: "Nota Enfermeria",
            icono: "mdi-account-details-outline",
            href: "/cl_notaenferm",
            id: "CLI15000003",
          },
        ],
      },

      {
        text: "Agendas",
        icono: "mdi-clipboard-text-play-outline",
        id: "CLI15100000",
        submenu2: [
          {
            text: "Agendar x Calendario",
            icono: "mdi-calendar-account-outline",
            href: "/agendas-proc",
            id: "CLI15100001",
          },
          {
            text: "Agendar x Dia",
            icono: "mdi-account-check-outline",
            href: "/agendasdia-proc",
            id: "CLI15100004",
          },

          {
            text: "Habilitar Agendas",
            icono: "mdi-lock-clock",
            href: "/habagend-proc",
            id: "CLI15100002",
          },
          {
            text: "Bloqueo Agendas",
            icono: "mdi-timer-off",
            href: "/bloqagend-proc",
            id: "CLI15100003",
          },
        ],
      },

      {
        text: "Facturación",
        icono: "mdi-clipboard-text-play-outline",
        id: "CLI11100000",
        submenu2: [
          {
            text: "Cargue Facturación",
            icono: "mdi-cart-arrow-down",
            href: "/cargue-fact",
            id: "CLI11100001",
          },
          // {
          //   text: "Anular Facturas",
          //   icono: "mdi-block-helper",
          //   href: "/Anula-fact",
          // },
          {
            text: "Facturar Pendientes",
            icono: "mdi-account-question-outline",
            href: "/Factptes-fact",
            id: "CLI11100002",
          },
          {
            text: "Actualizar Factura",
            icono: "mdi-list-status",
            href: "/ssactualiza-fact",
            id: "SS11100004",
          },
          {
            text: "ReFacturar",
            icono: "mdi-language-r",
            href: "/PrClRefacturar",
            id: "CLI11100003",
          },
          {
            text: "Cargue Rips",
            icono: "mdi-file-download",
            href: "/cargue-rips",
            id: "CLI11100004",
          },
          {
            text: "Generar Rips",
            icono: "mdi-clipboard-arrow-down-outline",
            href: "/generar-rips",
            id: "CLI11100005",
          },
          {
            text: "Radicar Facturas",
            icono: "mdi-order-bool-descending-variant",
            href: "/Radica-fact",
            id: "CLI11100008",
          },
          {
            text: "Contabilizar Facturas",
            icono: "mdi-file-cog-outline",
            href: "/Contab-factcl",
            id: "CLI11100009",
          },
          {
            text: "Cierre Anual de Cartera",
            icono: "mdi-folder-cog-outline",
            href: "/Cierre-cartcl",
            id: "CLI11100010",
          },

        ],
      },
      {
        text: "Notas Credito",
        icono: "mdi-clipboard-arrow-down-outline",
        id: "CLI11700000",
        submenu2: [
          {
            text: "Generar Nota Crédito",
            icono: "mdi-abugida-thai",
            href: "/prclncredito",
            id: "CLI11700001",
          },
          {
            text: "Reimpresión Ncredito",
            icono: "mdi-printer-check",
            href: "/PrclNcredito02",
            id: "CLI11700002",
          },
          {
            text: "ReProcesar Notas Crédito",
            icono: "mdi-arrow-up-bold-hexagon-outline",
            href: "/PrContaNcr",
            id: "CLI11700003",
          },
        ]
      },
      {
        text: "Otros Procesos",
        icono: "mdi-clipboard-text-play-outline",
        id: "CLI11000000",
        submenu2: [
          // {
          //   text: "Atención de Usuario",
          //   icono: "mdi-human-greeting",
          //   href: "/atusuario-proc",
          //   id: "CLI11000001",
          // },
          // {
          //   text: "Pantalla Turnos",
          //   icono: "mdi-laptop-account",
          //   href: "/turnos-proc",
          //   id: "CLI11000001",
          // },

          {
            text: "Cargue de Usuarios",
            icono: "mdi-account-reactivate-outline",
            href: "/cargueusu-proc",
            id: "CLI11000002",
          },
          {
            text: "Reactivar Autorización",
            icono: "mdi-arrow-decision-auto-outline",
            href: "/reactauto-proc",
            id: "CLI11000003",
          },
          {
            text: "Importar Facturas",
            icono: "mdi-debug-step-out",
            href: "/importfact-proc",
          },

        ],
      },
    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/clinico",
    id: "CLI20000000",
    submenu: [
      {
        text: "Paciente",
        icono: "mdi-clipboard-text-play-outline",
        id: "CLI25200000",
        submenu2: [
          {
            text: "Atencion de Paciente",
            icono: "mdi-account-heart-outline",
            href: "/rp-histpaciente",
            id: "CLI25200001",
          },
          {
            text: "Agenda de Paciente",
            icono: "mdi-account-clock-outline",
            href: "/rp-agendaspaciente",
            id: "CLI25200002",
          },
        ]
      },

      {
        text: "Facturación",
        icono: "mdi-clipboard-text-play-outline",
        id: "CLI21100000",
        submenu2: [
          {
            text: "Reimprimir Facturas",
            icono: "mdi-cloud-print-outline",
            href: "/Reimprime-fact",
            id: "CLI21100001",
          },
          {
            text: "Facturación por Paciente",
            icono: "mdi-emoticon-excited-outline",
            href: "/rp-facturacion",
            id: "CLI21100002",
          },
          {
            text: "Facturación Detallada",
            icono: "mdi-abacus",
            href: "/rp-facturaciondet",
            id: "CLI21100003",
          },
          {
            text: "Resumen de Facturación",
            icono: "mdi-view-dashboard-edit",
            href: "/rp-resfacturacion",
            id: "CLI21100006",
          },

          {
            text: "Facturación por Cups",
            icono: "mdi-prescription",
            href: "/rp-factcups",
            id: "CLI21100004",
          },
          {
            text: "Plano Nueva EPS",
            icono: "mdi-abugida-thai",
            href: "/rp-nvaeps",
            id: "CLI21100005",
          },

          // {
          //   text: "Facturación Radicada",
          //   icono: "mdi-check-decagram",
          //   href: "/rp-factrad",
          // },

        ]
      },

      {
        text: "Prestación Servicios",
        icono: "mdi-clipboard-text-play-outline",
        id: "CLI25000000",
        submenu2: [
          {
            text: "Reimprimir Prestacion",
            icono: "mdi-cloud-print-outline",
            href: "/rp-reimpserv",
            id: "CLI21100005",
          },
          {
            text: "Prestacion Servicios",
            icono: "mdi-account-plus",
            href: "/rp-servicios",
            id: "CLI25000001",
          },
          {
            text: "Servicios Detallados",
            icono: "mdi-abacus",
            href: "/rp-serviciosdet",
            id: "CLI25000002",
          },
          {
            text: "Reporte Mamografias",
            icono: "mdi-face-woman-shimmer-outline",
            href: "/rp-mamografias",
            id: "CLI25000003",
          },
          {
            text: "Reporte Biopsias",
            icono: "mdi-microscope",
            href: "/rp-biopsias",
            id: "CLI25000004",
          }
        ]
      },

      {
        text: "Productividad",
        icono: "mdi-account-details-outline",
        id: "CLI25300000",

        submenu2: [
          {
            text: "Agendas",
            icono: "mdi-alarm",
            href: "/rp-clprodag",
            id: "CLI25300001",
          },
        ]
      },

      {
        text: "Entidades Control",
        icono: "mdi-clipboard-text-play-outline",
        id: "CLI25400000",
        submenu2: [
          {
            text: "Resolución 1552",
            icono: "mdi-movie-edit",
            href: "/rp-1552",
          },
          {
            text: "Resolución 256",
            icono: "mdi-comment-edit",
            href: "/rp-256",
          },
          {
            text: "Circular 030",
            icono: "mdi-digital-ocean",
            href: "/rp-cir030",
          }
        ]
      },
      {
        text: "E.P.S.",
        icono: "mdi-clipboard-text-play-outline",
        id: "CLI25500000",
        submenu2: [
          {
            text: "Cajacopi",
            icono: "mdi-clipboard-pulse-outline",
            href: "/rp-cajacopi1",
          }
        ]
      },


      {
        text: "Agendas",
        icono: "mdi-account-check-outline",
        href: "/rp-agendas",
        id: "CLI20000001",

      },
      {
        text: "Cartera",
        icono: "mdi-cash-100",
        href: "/rp-cartera",
        id: "CLI20000002",
      },
      {
        text: "Formulario Furips",
        icono: "mdi-human-male-height-variant",
        href: "/rp_furips",
        id: "CLI20000004",
      },
      {
        text: "Detallado Furips",
        icono: "mdi-format-float-left",
        href: "/rp_DetFurips",
        id: "CLI20000005",
      },
      {
        text: "Cuadre de Caja",
        icono: "mdi-cash-refund",
        href: "/rp-recaudos",
        id: "CLI20000003",
      },
    ],
  },
  {
    text: "Configuración",
    icono: "mdi-cog-transfer-outline",
    ruta: "/menu/clinico",
    id: "CLI30000000",
    submenu: [
      {
        text: "Pacientes",
        icono: "mdi-account-group",
        href: "/pacientes",
        id: "CLI30000001",
      },
      {
        text: "Clientes",
        icono: "mdi-account-check",
        href: "/clientes",
        id: "CLI30000002",
      },
      {
        text: "Salas Rx",
        icono: "mdi-prescription",
        href: "/CfSalas",
        id: "CLI30000003",
      },
      {
        text: "Contratos",
        icono: "mdi-playlist-edit",
        href: "/CfContratos",
        id: "CLI30000004",
      },
      {
        text: "Cargue Contratos",
        icono: "mdi-application-export ",
        href: "/carguecctos",
        id: "CLI30000005",
      },
      {
        text: "Servicios y procedimientos",
        icono: "mdi-hospital-building",
        href: "/serviciosProce",
        id: "CLI30000006",
      },
      {
        text: "Personal Asistencial",
        icono: "mdi-view-grid-plus-outline",
        href: "/perasist",
        id: "CLI30000007",
      },
      {
        text: "Consultorios",
        icono: "mdi-clipboard-pulse-outline",
        href: "/CfConsult",
        id: "CLI30000008",
      },
      {
        text: "Categorías",
        icono: "mdi-check-all",
        href: "/clcategoria",
        id: "CLI30000009",
      },
      {
        text: "SubCategorías",
        icono: "mdi-abacus",
        href: "/clsubcategoria",
        id: "CLI30000010",
      },
      {
        text: "Ventanillas",
        icono: "mdi-account-check",
        href: "/cf_ventanilla",
        id: "CLI30000011",
      },
    ],
  },
];
const ssalud = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-ballot-recount-outline",
    ruta: "/menu/ssalud",
    id: "SS10000000",

    submenu: [
      {
        text: "Prestación Servicios",
        icono: "mdi-clipboard-text-play-outline",
        id: "SSA15000000",
        submenu2: [
          {
            text: "Admision de Pacientes",
            icono: "mdi-account-plus",
            href: "/ss_prServicios",
            id: "SSA15000001",
          },
          {
            text: "Furips",
            icono: "mdi-human-male-height-variant",
            href: "/cl_furips",
            id: "SSA15000002",
          },
        ],
      },
      {
        text: "Agendas",
        icono: "mdi-clipboard-text-play-outline",
        id: "SSA15100000",
        submenu2: [
          {
            text: "Agendar pacientes",
            icono: "mdi-account-check-outline",
            href: "/ssagendas-proc",
            id: "SSAI15100001",
          },
          {
            text: "Habilitar Agendas",
            icono: "mdi-lock-clock",
            href: "/sshabagend-proc",
            id: "SSA15100002",
          },
          {
            text: "Bloqueo Agendas",
            icono: "mdi-timer-off",
            href: "/ssbloqagend-proc",
            id: "SSA15100003",
          },
          {
            text: "Lista de Espera",
            icono: "mdi-account-reactivate-outline",
            href: "/ssalistaesp-proc",
            id: "SSA15100004",
          },

          {
            text: "Traslado Agenda",
            icono: "mdi-arrow-decision-outline",
            href: "/sstrasagenda-proc",
            id: "SSA15100005",
          },
          {
            text: "Cancelación Masiva",
            icono: "mdi-axis-y-rotate-clockwise",
            href: "/sscancagenda-proc",
            id: "SSA15100006",
          },

        ],
      },
      {
        text: "Tesoreria",
        icono: "mdi-clipboard-text-play-outline",
        id: "SSA10700000",
        submenu2: [
          {
            text: "Comp.Egresos",
            icono: "mdi-account-check-outline",
            href: "/Ss_Egresos-proc",
            id: "SSA10700001",
          },
          {
            text: "Reimpresión Comp",
            icono: "mdi-printer-search",
            href: "/Ss_Impcomprob-proc",
            id: "SSA10700002",
          },

        ],
      },
      {
        text: "Facturación",
        icono: "mdi-clipboard-text-play-outline",
        id: "SSA11100000",
        submenu2: [
          {
            text: "Cargue Facturación",
            icono: "mdi-cart-arrow-down",
            href: "/sscargue-fact",
            id: "SSA11100001",
          },
          // {
          //   text: "Anular Facturas",
          //   icono: "mdi-block-helper",
          //   href: "/Anula-fact",
          // },
          {
            text: "Facturar Pendientes",
            icono: "mdi-account-question-outline",
            href: "/SsFactptes-fact",
            id: "SSA11100002",
          },
          {
            text: "Facturar Autorizaciones",
            icono: "mdi-alphabet-cyrillic",
            href: "/ss_factAuto",
            id: "SSA11100007",
          },

          {
            text: "ReFacturar",
            icono: "mdi-language-r",
            href: "/PrClRefacturar",
            id: "SSA11100003",
          },
          {
            text: "Actualizar Factura",
            icono: "mdi-list-status",
            href: "/ssactualiza-fact",
            id: "SSA11100004",
          },

          {
            text: "Cargue Rips",
            icono: "mdi-file-download",
            href: "/cargue-rips",
            id: "SSA11100004",
          },
          {
            text: "Generar Rips",
            icono: "mdi-clipboard-arrow-down-outline",
            href: "/generar-rips",
            id: "SSA11100005",
          },
          {
            text: "Radicar Facturas",
            icono: "mdi-order-bool-descending-variant",
            href: "/Radica-fact",
            id: "SSA11100008",
          },
          {
            text: "Contabilizar Facturas",
            icono: "mdi-file-cog-outline",
            href: "/Contab-factcl",
            id: "SSA11100009",
          },
                    {
            text: "Contabilizar Copagos Pr.Serv",
            icono: "mdi-alpha-c-box-outline",
            href: "/ss_contcopago",
            id: "SSA11100011",
          },
          {
            text: "Importar Facturas",
            icono: "mdi-debug-step-out",
            href: "/importfact-proc",
            id: "SSA11100012",
          },

          {
            text: "Cierre Anual de Cartera",
            icono: "mdi-folder-cog-outline",
            href: "/Cierre-cartcl",
            id: "SSA11100010",
          },

        ],
      },
      {
        text: "Notas Credito",
        icono: "mdi-clipboard-arrow-down-outline",
        id: "SSA11700000",
        submenu2: [
          {
            text: "Generar Nota Crédito",
            icono: "mdi-abugida-thai",
            href: "/prclncredito",
            id: "SSA11700001",
          },
          {
            text: "Reimpresión Ncredito",
            icono: "mdi-printer-check",
            href: "/PrclNcredito02",
            id: "SSA11700002",
          },
          {
            text: "ReProcesar Notas Crédito",
            icono: "mdi-arrow-up-bold-hexagon-outline",
            href: "/PrContaNcr",
            id: "SSA11700003",
          },
        ]
      },
      {
        text: "Notas Débito",
        icono: "mdi-clipboard-arrow-down-outline",
        id: "SSA11900000",
        submenu2: [
          {
            text: "Generar Nota Débito",
            icono: "mdi-abugida-thai",
            href: "/prcl_ndebito",
            id: "SSA11900001",
          },
          {
            text: "Reimpresión NDébito",
            icono: "mdi-printer-check",
            href: "/prcl_Ndebito02",
            id: "SSA11900002",
          },
          {
            text: "ReProcesar Notas Débito",
            icono: "mdi-arrow-up-bold-hexagon-outline",
            href: "/pr_ContaNdb",
            id: "SSA11900003",
          },
        ]
      },
      {
        text: "Imagenología",
        icono: "mdi-clipboard-arrow-down-outline",
        id: "SSA11700000",
        submenu2: [
          {
            text: "Atención de Usuario",
            icono: "mdi-human-greeting",
            href: "/atusuario-proc",
            id: "CLI11000001",
          },
          {
            text: "Pantalla Turnos",
            icono: "mdi-laptop-account",
            href: "/turnos-proc",
            id: "CLI11000001",
          },
          {
            text: "Cargue Imagenes",
            icono: "mdi-prescription",
            href: "/pr_carguerx",
            id: "CLI11000001",
          },


        ]
      },
      {
        text: "Otros Procesos",
        icono: "mdi-clipboard-text-play-outline",
        id: "SSA11000000",
        submenu2: [
          // {
          //   text: "Atención de Usuario",
          //   icono: "mdi-human-greeting",
          //   href: "/atusuario-proc",
          //   id: "SSA11000001",
          // },
          {
            text: "Pantalla Turnos",
            icono: "mdi-laptop-account",
            href: "/turnos-proc",
            id: "SSA11000001",
          },
          {
            text: "Cargue de Usuarios",
            icono: "mdi-account-reactivate-outline",
            href: "/cargueusu-proc",
            id: "SSA11000002",
          },
          {
            text: "Actualizar Autorizaciones",
            icono: "mdi-timer-off",
            href: "/ss_actautoriza",
            id: "SSA11000004",
          },
          {
            text: "Notificaciones HC",
            icono: "mdi-volume-high",
            href: "/ss_notificahc",
            id: "SSA11000005",
          },
          {
            text: "Habilitar Prestaciones",
            icono: "mdi-spellcheck",
            href: "/ss_habilitapr",
            id: "SSA11000006",
          },
          {
            text: "Bloquear Fechas HC",
            icono: "mdi-calendar-multiple-check",
            href: "/ss_bloqfechahc",
            id: "SSA11000007",
          },



        ],
      },
    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/ssalud",
    id: "SSA20000000",
    submenu: [
      {
        text: "Agendas",
        icono: "mdi-clipboard-text-play-outline",
        id: "SSA25100000",
        submenu2: [
          {
            text: "Agenda Diaria",
            icono: "mdi-account-check-outline",
            href: "/ss_rp-agendas",
            id: "SSA25100001",
          },
          {
            text: "Agenda Detallada",
            icono: "mdi-format-align-center",
            href: "/ss_rp-agendasdet",
            id: "SSA25100002",

          },
          {
            text: "Inasistencia",
            icono: "mdi-account-off-outline",
            href: "/ss_rp-agendinasist",
            id: "SSA25100003",

          },
          {
            text: "Lista de Espera",
            icono: "mdi-alarm-snooze",
            href: "/ss_rp-listaespera",
            id: "SSA25100004",

          },

        ]
      },
      {
        text: "Paciente",
        icono: "mdi-clipboard-text-play-outline",
        id: "SSA25200000",
        submenu2: [
          {
            text: "Atencion de Paciente",
            icono: "mdi-account-heart-outline",
            href: "/rp-histpaciente",
            id: "SSA25200001",
          },
          {
            text: "Agenda de Paciente",
            icono: "mdi-account-clock-outline",
            href: "/rp-agendaspaciente",
            id: "SSA25200002",
          },
          {
            text: "Hc de Paciente",
            icono: "mdi-file-document-edit-outline",
            href: "/rp-hcpaciente",
            id: "SSA25200003",
          },

        ]
      },

      {
        text: "Facturación",
        icono: "mdi-clipboard-text-play-outline",
        id: "SSA21100000",
        submenu2: [
          {
            text: "Reimprimir Factura",
            icono: "mdi-cloud-print-outline",
            href: "/ss_rp-Reimpfact",
            id: "SSA21100001",
          },

          {
            text: "Facturación por Paciente",
            icono: "mdi-emoticon-excited-outline",
            href: "/rp-facturacion",
            id: "SSA21100002",
          },
          {
            text: "Facturación Detallada",
            icono: "mdi-abacus",
            href: "/rp-facturaciondet",
            id: "SSA21100003",
          },
          {
            text: "Resumen de Facturación",
            icono: "mdi-view-dashboard-edit",
            href: "/rp-resfacturacion",
            id: "SSA21100004",
          },

          {
            text: "Facturación por Cups",
            icono: "mdi-prescription",
            href: "/rp-factcups",
            id: "SSA21100005",
          },
          {
            text: "Plano Nueva EPS",
            icono: "mdi-abugida-thai",
            href: "/rp-nvaeps",
            id: "SSA21100006",
          },
          {
            text: "Validacion Dian",
            icono: "mdi-alpha-d-circle-outline",
            href: "/rp-nvaeps",
            id: "SSA21100007",
          },

          // {
          //   text: "Facturación Radicada",
          //   icono: "mdi-check-decagram",
          //   href: "/rp-factrad",
          // },

        ]
      },

      {
        text: "Prestación Servicios",
        icono: "mdi-clipboard-text-play-outline",
        id: "SSA25000000",
        submenu2: [
          {
            text: "Reimprimir Prestacion",
            icono: "mdi-cloud-print-outline",
            href: "/rp-reimpserv",
            id: "SSA25000001",
          },
          {
            text: "Prestacion Servicios",
            icono: "mdi-account-plus",
            href: "/rp-servicios",
            id: "SSA25000002",
          },
          {
            text: "Servicios Detallados",
            icono: "mdi-abacus",
            href: "/rp-sserviciosdet",
            id: "SSA25000003",
          },
        ]
      },
      {
        text: "Historia Clinica",
        icono: "mdi-account-details-outline",
        id: "SSA25400000",
        submenu2: [
          {
            text: "Reportes Clinicos",
            icono: "mdi-hand-heart-outline",
            href: "/rp-ssrepclinico1",
            id: "SSA25400001",
          },
          {
            text: "Prevalencias Dx",
            icono: "mdi-emoticon-sick-outline",
            href: "/rp-ssrepprevaldx",
            id: "SSA25400002",
          },
          {
            text: "Detallado Historia",
            icono: "mdi-text-box-edit",
            href: "/rp-ssrepclinico2",
            id: "SSA25400003",
          },


        ]
      },

      {
        text: "Productividad",
        icono: "mdi-account-details-outline",
        id: "SSA25300000",

        submenu2: [
          {
            text: "Agendas",
            icono: "mdi-alarm",
            href: "/rp-clprodag",
            id: "SSA25300001",
          },
        ]
      },

      {
        text: "Entidades Control",
        icono: "mdi-clipboard-text-play-outline",
        id: "SSA20300000",
        submenu2: [
          {
            text: "Resolución 1552",
            icono: "mdi-movie-edit",
            href: "/rp-1552",
            id: "SSA20300001",
          },
          {
            text: "Resolución 256",
            icono: "mdi-comment-edit",
            href: "/rp-256",
            id: "SSA20300002",
          },
          {
            text: "Circular 030",
            icono: "mdi-digital-ocean",
            href: "/rp-cir030",
            id: "SSA20300003",
          }
        ]
      },

      {
        text: "Cartera",
        icono: "mdi-cash-100",
        href: "/ss_rp-cartera",
        id: "SSA21200000",
      },
      {
        text: "Recaudos",
        icono: "mdi-cash-refund",
        href: "/ss_rp-recaudos",
        id: "SSA25500000",
      },
      {
        text: "Formulario Furips",
        icono: "mdi-human-male-height-variant",
        href: "/rp_furips",
        id: "SSA25600000",
      },
      {
        text: "Detallado Furips",
        icono: "mdi-format-float-left",
        href: "/rp_DetFurips",
        id: "SSA25600001",
      },

    ],
  },
  {
    text: "Configuración",
    icono: "mdi-cog-transfer-outline",
    ruta: "/menu/ssalud",
    id: "SSA30000000",
    submenu: [
      {
        text: "Pacientes",
        icono: "mdi-account-group",
        href: "/pacientes",
        id: "SSA30000001",
      },
      {
        text: "Clientes",
        icono: "mdi-account-check",
        href: "/clientes",
        id: "SSA30000002",
      },
      {
        text: "Contratos",
        icono: "mdi-play  list-edit",
        href: "/sscfContratos",
        id: "SSA30000003",
      },
      {
        text: "Cargue Contratos",
        icono: "mdi-application-export ",
        href: "/sscarguecctos",
        id: "SSA30000004",
      },
      {
        text: "Servicios y procedimientos",
        icono: "mdi-hospital-building",
        href: "/ss_serviciosProce",
        id: "SSA30000005",
      },
      {
        text: "Personal Asistencial",
        icono: "mdi-view-grid-plus-outline",
        href: "/ss_perasist",
        id: "SSA30000006",
      },
      {
        text: "Consultorios",
        icono: "mdi-clipboard-pulse-outline",
        href: "/CfConsult",
        id: "SSA30000007",
      },
      {
        text: "Categorías",
        icono: "mdi-check-all",
        href: "/clcategoria",
        id: "SSA30000008",
      },
      {
        text: "SubCategorías",
        icono: "mdi-abacus",
        href: "/clsubcategoria",
        id: "SSA30000009",
      },
      {
        text: "Especialidades",
        icono: "mdi-backburger",
        href: "/Ss_Cfespecialidad",
        id: "SSA30000010",
      },
      {
        text: "Conceptos Tesoreria",
        icono: "mdi-file-document-edit",
        href: "/ss_Cfconceptos",
        id: "SSA30000011",
      },
      {
        text: "Medicamentos",
        icono: "mdi-pill-multiple",
        href: "/Cf_medicamentos",
        id: "SSA30000012",
      },
      {
        text: "Ordenes H.Clinica",
        icono: "mdi-pencil-remove-outline",
        href: "/Ss_Cfordenhc",
        id: "SSA30000013",
      },

    ],
  },
];
const phorizontal = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },

  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/phorizontal",
    submenu: [
      {
        text: "Tesorería",
        icono: "mdi-clipboard-text-play-outline",
        submenu2: [
          {
            text: "Recaudos",
            icono: "mdi-alpha-r-circle-outline",
            href: "/pr_phrecaudos01",
          },
          {
            text: "Reimprimir Recaudos",
            icono: "mdi-printer-check",
            href: "/pr_phrecaudos02",
          },
          {
            text: "Anular Recaudos",
            icono: "mdi-delete-forever-outline",
            href: "/pr_phrecaudos03",
          },
          {
            text: "Actualizar Recaudos",
            icono: "mdi-chemical-weapon",
            href: "/pr_phrecaudos04",
          },

          // {
          //   text: "Nota Anticipados",
          //   icono: "mdi-alpha",
          //   href: "/pr_phanticipado01",
          // },



        ],
      },
      {
        text: "Facturación",
        icono: "mdi-clipboard-text-play-outline",
        submenu2: [
          // {
          //   text: "Factura Individual",
          //   icono: "mdi-square-root",
          //   href: "/Prsdmfact01",
          // },
          {
            text: "Generar Facturación",
            icono: "mdi-human-capacity-increase",
            href: "/pr_phfact01",
          },
          {
            text: "Reimpresión",
            icono: "mdi-printer-check",
            href: "/pr_phfact02",
          },
          {
            text: "Contabilizar Facturas",
            icono: "mdi-file-sign",
            href: "/pr_phfact03",
          },
          {
            text: "Eliminar Facturas",
            icono: "mdi-alien",
            href: "/pr_phfact04",
          },

        ],
      },
      {
        text: "Presupuesto",
        icono: "mdi-clipboard-text-play-outline",
        submenu2: [
          {
            text: "Cargue Presupuesto",
            icono: "mdi-numeric",
            href: "/pr_phpresupuesto",
          },
        ],
      },
      {
        text: "Novedades",
        icono: "mdi-alert-circle-check-outline",
        href: "/pr_phnovedad01",
      },

      // {
      //   text: "Abrir/Cerrar Votación",
      //   icono: "mdi-lock-open-variant",
      //   href: "/Prvotacion",
      // },
    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print-outline",
    ruta: "/menu/phorizontal",
    submenu: [
      {
        text: "Facturación",
        icono: "mdi-format-align-left",
        href: "/rp_phfact01",
      },
      {
        text: "Facturación Detallada",
        icono: "mdi-clipboard-list-outline",
        href: "/rp_phfact02",
      },
      {
        text: "Cartera por Edades",
        icono: "mdi-currency-usd",
        href: "/rp-phcartera1",
      },
      {
        text: "Cartera por Concepto",
        icono: "mdi-invoice-text-arrow-right-outline",
        href: "/rp-phcartera2",
      },
      {
        text: "Cartera por Estado",
        icono: "mdi-cookie-clock-outline",
        href: "/rp-phcartera3",
      },
      {
        text: "Estado de Cuenta",
        icono: "mdi-qrcode-edit",
        href: "/rp_phestadocta",
      },

      {
        text: "Presupuesto Ejecutado",
        icono: "mdi-numeric",
        href: "/rp-phpresup",
      },

      // {
      //   text: "Resultados",
      //   icono: "mdi-chart-bar",
      //   href: "/Rpresultados",
      // },

    ],
  },
  {
    text: "Configuración",
    icono: "mdi-cogs",
    ruta: "/menu/phorizontal",
    submenu: [
      {
        text: "Copropiedades",
        icono: "mdi-home-city-outline",
        href: "/cf_copropiedad",
      },
      {
        text: "Areas",
        icono: "mdi-abjad-arabic",
        href: "/cf_areasph",
      },
      {
        text: "Cargos",
        icono: "mdi-arrow-up-circle-outline",
        href: "/cf_cargosph",
      },

      {
        text: "Tarifas",
        icono: "mdi-currency-usd",
        href: "/cf_tarifas",
      },

      {
        text: "Vehiculos",
        icono: "mdi-car-multiple",
        href: "/cf_vehiculosph",
      },

      {
        text: "Novedades",
        icono: "mdi-chat-alert-outline",
        href: "/cf_novedadesph",
      },
      {
        text: "Presupuesto",
        icono: "mdi-numeric",
        href: "/cf_presupph",
      },
      {
        text: "Cuotas Extraordinarias",
        icono: "mdi-cash-refund",
        href: "/cf_cextraph",
      },

      // {
      //   text: "Asambleas",
      //   icono: "mdi-human-capacity-increase",
      //   href: "/Cfasambleas",
      // },
      // {
      //   text: "Preguntas",
      //   icono: "mdi-chat-processing-outline",
      //   href: "/Cfpreguntas",
      // },
      // {
      //   text: "Participantes",
      //   icono: "mdi-account-group-outline",
      //   href: "/Cfparticipantes",
      // },
      // {
      //   text: "Enviar correos",
      //   icono: "mdi-at",
      //   href: "/Rpcorreos",
      // },
    ],
  },
];
const basico = [
  {
    text: "Procesos",
    icono: "mdi-ballot-recount-outline",
    ruta: "/menu/basico",
    submenu: [
      {
        text: "Clientes",
        icono: "mdi-bank-outline",
        href: "/clientes",
      },]
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/basico",
    submenu: [
      {
        text: "S/D",
        icono: "mdi-bank-outline",
        href: "/clientes",
      },]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/basico",
    submenu: [
      {
        text: "Admin",
        icono: "mdi-bank-outline",
        href: "/admin",
      },
      {
        text: "Vendedor",
        icono: "mdi-bank-outline",
        href: "/vendedores",
      },
      {
        text: "Conceptos Dian",
        icono: "mdi-atom-variant",
        href: "/CfconcDian",
      },
      {
        text: "Opciones Menu",
        icono: "mdi-qrcode-edit",
        href: "/CfOpciones",
      },
      {
        text: "Seccion_HC",
        icono: "mdi-qrcode-edit",
        href: "/CfhcSeccion",
      },
    ]
  },
];
const colegio = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/colegio",
    submenu: [
      {
        text: "Facturación",
        icono: "mdi-clipboard-text-play-outline",
        submenu2: [
          {
            text: "Factura Individual",
            icono: "mdi-square-root",
            href: "/facturacion",
          },
          {
            text: "Factura Masiva",
            icono: "mdi-human-capacity-increase",
            href: "/factmasiva",
          },
          {
            text: "Reimpresión",
            icono: "mdi-printer-check",
            href: "/PrReimpfact",
          },
        ],
      },
    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/colegio",
    submenu: [
      {
        text: "S/D",
        icono: "mdi-bank-outline",
        href: "/clientes",
      },]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/colegio",
    submenu: [
      {
        text: "Estudiantes",
        icono: "mdi-account-box-outline",
        href: "/cfestudiante",
      },
      {
        text: "Ruts",
        icono: "mdi-account-group-outline",
        href: "/cfcolruts",
      },
      {
        text: "Cargos",
        icono: "mdi-plus-box-outline",
        href: "/cfcolcargos",
      },
      {
        text: "Grados",
        icono: "mdi-numeric",
        href: "/cfgrados",
      }

    ]
  },
];
const molino = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/molino",
    id: "MOL10000000",
    submenu: [
      {
        text: "Báscula",
        icono: "mdi-clipboard-text-play-outline",
        id: "MOL12000000",
        submenu2: [
          {
            text: "Entrada de Vehiculos",
            icono: "mdi-boom-gate",
            href: "/prentradavh",
            id: "MOL12000001",
          },
          {
            text: "Salida de Vehiculos",
            icono: "mdi-boom-gate-up",
            href: "/prsalidavh",
            id: "MOL12000002",
          },
          {
            text: "Laboratorio",
            icono: "mdi-flask-empty-plus-outline",
            href: "/laboratorio",
            id: "MOL12000003",
          },
          {
            text: "Remisión de Mercancias",
            icono: "mdi-rocket-launch-outline",
            href: "/prdespachos",
            id: "MOL12000004",
          },
        ],
      },
      {
        text: "Liquidaciones",
        icono: "mdi-clipboard-text-play-outline",
        id: "MOL12100000",
        submenu2: [
          {
            text: "Precios",
            icono: "mdi-currency-usd",
            href: "/precio",
            id: "MOL12100001",
          },

          {
            text: "Liquidaciones",
            icono: "mdi-pencil-outline",
            href: "/liquidacion",
            id: "MOL12100002",
          },
          {
            text: "Pre_Liquidacion",
            icono: "mdi-abugida-devanagari",
            href: "/pre-liquidacion",
            id: "MOL12100003",
          },

        ],
      },

      {
        text: "Industrial",
        icono: "mdi-clipboard-text-play-outline",
        id: "MOL12200000",
        submenu2: [
          {
            text: "Secamiento",
            icono: "mdi-air-filter",
            href: "/prsecamiento",
            id: "MOL12200001",
          },
          {
            text: "Trilla",
            icono: "mdi-cog-clockwise",
            href: "/prtrilla",
            id: "MOL12200002",
          },
          {
            text: "Empaquetado",
            icono: "mdi-border-top",
            href: "/prempaque",
            id: "MOL12200003",
          },
          {
            text: "Extrusión",
            icono: "mdi-gradient-vertical",
            href: "/prextrusion",
            id: "MOL12200004",
          },
          {
            text: "Traslados",
            icono: "mdi-application-export",
            href: "/prtraslados",
            id: "MOL12200005",
          },
          {
            text: "Reimpresión Procesos",
            icono: "mdi-printer-check",
            href: "/prreimpproc",
            id: "MOL12200006",
          },

          {
            text: "Actualizar Proceso",
            icono: "mdi-file-document-edit-outline",
            href: "/practualiza",
            id: "MOL12200007",
          },

        ],
      },
      {
        text: "Otros Procesos",
        icono: "mdi-clipboard-text-play-outline",
        id: "MOL11000000",
        submenu2: [
          {
            text: "Actualiza Bascula",
            icono: "mdi-chemical-weapon",
            href: "/prActbascula",
            id: "MOL11000001",
          },
          {
            text: "Actualizar Liquidaciones",
            icono: "mdi-rotate-right",
            href: "/prActliquida",
            id: "MOL11000002",
          },
          {
            text: "Actualizar Pre-Liquidaciones",
            icono: "mdi-ballot-recount",
            href: "/prActpreliquida",
            id: "MOL11000003",
          },
          {
            text: "Reprocesar Báscula",
            icono: "mdi-cog-transfer-outline",
            href: "/prReprobasc",
            id: "MOL11000004",
          },
        ],
      },

    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/molino",
    id: "MOL20000000",
    submenu: [
      {
        text: "Bascula",
        icono: "mdi-scale",
        href: "/RpReimpesaje",
        id: "MOL20000001",
      },
      {
        text: "Liquidaciones",
        icono: "mdi-pencil-outline",
        href: "/RpReimpliquida",
        id: "MOL20000002",
      },
      {
        text: "Pre_Liquidaciones",
        icono: "mdi-abugida-devanagari",
        href: "/RpReimppreliquida",
        id: "MOL20000005",
      },
      {
        text: "Remisiones",
        icono: "mdi-truck-delivery",
        href: "/PrReimpremision",
        id: "MOL20000003",
      },
      {
        text: "Compras/Servicios",
        icono: "mdi-chevron-triple-right",
        href: "/Rpmolcompras",
        id: "MOL20000004",
      },

    ]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    id: "MOL30000000",
    ruta: "/menu/molino",
    submenu: [
      {
        text: "Ruts",
        icono: "mdi-account-box-outline",
        href: "/cfmolruts",
        id: "MOL30000001",
      },
      {
        text: "Conductores",
        icono: "mdi-rowing",
        href: "/cfmolconductor",
        id: "MOL30000002",
      },
      {
        text: "Vehiculos",
        icono: "mdi-truck",
        href: "/cfmolvehic",
        id: "MOL30000003",
      },
      {
        text: "Variedades",
        icono: "mdi-barley",
        href: "/cfvariedad",
        id: "MOL30000004",
      },
      {
        text: "Productos Industriales",
        icono: "mdi-cog-transfer-outline",
        href: "/cfprindust",
        id: "MOL30000005",
      },
      {
        text: "Parámetros",
        icono: "mdi-tune",
        href: "/cfparammol",
        id: "MOL30000006",
      }

    ]
  },
];
const servdm = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/servdm",
    id: "SDM10000001",
    submenu: [
      {
        text: "Facturación",
        icono: "mdi-clipboard-text-play-outline",
        id: "SDM11100000",
        submenu2: [
          // {
          //   text: "Factura Individual",
          //   icono: "mdi-square-root",
          //   href: "/Prsdmfact01",
          // },
          {
            text: "Generar Facturación",
            icono: "mdi-human-capacity-increase",
            href: "/Prsdmfact02",
            id: "SDM11100001",
          },
          {
            text: "Reimpresión",
            icono: "mdi-printer-check",
            href: "/Prsdmfact03",
            id: "SDM11100002",
          },
          {
            text: "Contabilizar Facturas",
            icono: "mdi-file-sign",
            href: "/prsdm_contafact",
            id: "SDM11100003",
          },
          {
            text: "Eliminar Facturas",
            icono: "mdi-alien",
            href: "/prsdm_eliminafact",
            id: "SDM11100004",
          },

        ],
      },
      {
        text: "Lecturas",
        icono: "mdi-vector-polyline-edit",
        id: "SDM17000000",
        submenu2: [
          {
            text: "Actualizar Lecturas",
            icono: "mdi-variable",
            href: "/prsdmlect00",
            id: "SDM17000001",
          },

          {
            text: "Importar Lecturas",
            icono: "mdi-arrow-up-thin-circle-outline",
            href: "/prsdmlect01",
            id: "SDM17000002",
          },
          {
            text: "Eliminar Lecturas",
            icono: "mdi-alien",
            href: "/prsdm_eliminalect",
            id: "SDM17000003",
          },

        ],
      },
      {
        text: "Tesoreria",
        icono: "mdi-vector-polyline-edit",
        id: "SDM10700000",
        submenu2: [
          {
            text: "Recaudo Facturas",
            icono: "mdi-cash-fast",
            href: "/prsdm_recaudos",
            id: "SDM10700001",
          },
          {
            text: "Recaudo Financiaciones",
            icono: "mdi-currency-rupee",
            href: "/prsdm_recfinancia",
            id: "SDM10700002",
          },

          {
            text: "Cierre Turno Cajero",
            icono: "mdi-door-closed-lock",
            href: "/prsdm_cierrerc",
            id: "SDM10700003",
          },
          {
            text: "Contabilizar Recaudos",
            icono: "mdi-file-sign",
            href: "/prsdm_contarec",
            id: "SDM10700004",
          },
        ],
      },
      {
        text: "Financiaciones",
        icono: "mdi-clipboard-text-play-outline",
        id: "SDM10710000",
        submenu2: [
          // {
          //   text: "Factura Individual",
          //   icono: "mdi-square-root",
          //   href: "/Prsdmfact01",
          // },
          {
            text: "Generar Financiación",
            icono: "mdi-credit-card-clock-outline",
            href: "/pr_sdmfinancia",
            id: "SDM10710001",
          },
          {
            text: "Reimpresión",
            icono: "mdi-printer-check",
            href: "/pr_sdmfinancia01",
            id: "SDM10710002",
          },
          {
            text: "Actualizar Financiaciones",
            icono: "mdi-file-sign",
            href: "/prsdm_actfinanc",
            id: "SDM10710003",
          },
          {
            text: "Cargue Financiaciones",
            icono: "mdi-apple-keyboard-caps",
            href: "/prsdm_carguefinanc",
            id: "SDM10710004",
          },

        ],
      },
      {
        text: "Suspensiones/Reconexiones",
        icono: "mdi-clipboard-text-play-outline",
        id: "SDM10720000",
        submenu2: [
          // {
          //   text: "Factura Individual",
          //   icono: "mdi-square-root",
          //   href: "/Prsdmfact01",
          // },
          {
            text: "Suspensiones",
            icono: "mdi-sync-off",
            href: "/prsdm_suspens",
            id: "SDM10720001",
          },
          {
            text: "Reconexiones",
            icono: "mdi-upload-network-outline",
            href: "/prsdm_reconexion",
            id: "SDM10720002",
          },
          {
            text: "Reimpresión",
            icono: "mdi-printer-check",
            href: "/prsdm_printreconexion",
            id: "SDM10720003",
          },

        ],
      },

    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/servdm",
    id: "SDM20000000",
    submenu: [
      {
        text: "Recaudos",
        icono: "mdi-cash-sync",
        href: "/rpsdm-recaudos",
        id: "SDM20000001",
      },
      {
        text: "Recaudo Detallado",
        icono: "mdi-view-headline",
        href: "/rpsdm_detallado",
        id: "SDM20000002",
      },
      {
        text: "Financiaciones",
        icono: "mdi-abjad-arabic",
        href: "/rpsdm_financia",
        id: "SDM20000003",
      },

      {
        text: "Cartera",
        icono: "mdi-clipboard-text-play-outline",
        href: "/rpsdm-cartera1",
        id: "SDM20000004",
      },
      {
        text: "Detallado Cartera",
        icono: "mdi-format-wrap-square",
        href: "/rpsdm-cartera2",
        id: "SDM20000005",
      },

      {
        text: "Detallado Facturacion",
        icono: "mdi-format-align-center",
        href: "/rpsdm-detfactura",
        id: "SDM20000006",
      },

      {
        text: "Sui",
        icono: "mdi-google-circles-extended",
        href: "/rpsdmsui",
        id: "SDM20000007",
      },]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/servdm",
    id: "SDM30000000",
    submenu: [
      {
        text: "Usuarios",
        icono: "mdi-account-box-outline",
        href: "/Cfsdmusuarios",
        id: "SDM30000001",
      },
      {
        text: "Barrios",
        icono: "mdi-arrange-send-to-back",
        href: "/Cfsdmbarrios",
        id: "SDM30000002",        
      },
      {
        text: "Tarifas",
        icono: "mdi-currency-usd",
        href: "/Cfsdmtarifas",
        id: "SDM30000003",        
      },
      {
        text: "Ciclos",
        icono: "mdi-google-circles",
        href: "/Cfsdmciclos",
        id: "SDM30000004",        
      },
      {
        text: "Cargos",
        icono: "mdi-bank-plus",
        href: "/Cfsdmcargos",
        id: "SDM30000005",        
      },
      {
        text: "Descuentos",
        icono: "mdi-arrow-collapse-down",
        href: "/Cfsdmdesctos",
        id: "SDM30000006",        
      },
      {
        text: "Corregimientos",
        icono: "mdi-dots-circle",
        href: "/Cfsdmcorreg",
        id: "SDM30000007",        
      },

      {
        text: "Cargue Coordenadas",
        icono: "mdi-cloud-arrow-up-outline",
        href: "/cfsdm_carguecoord",
        id: "SDM30000008",        
      },


    ]
  },
];
const tablero = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/tablero",
    submenu: [
      {
        text: " ",
        icono: "mdi-clipboard-text-play-outline",
        submenu2: [
        ],
      },
    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/tablero",
    submenu: [
      {
        text: "Financiero",
        icono: "mdi-account-cash-outline",
        href: "/tabfinanciero",
      },
      {
        text: "Comercial",
        icono: "mdi-finance",
        submenu2: [
          {
            text: "Gestión Comercial",
            icono: "mdi-sync-off",
            href: "/tabcomercial",
          },
          {
            text: "Ventas",
            icono: "mdi-upload-network-outline",
            href: "/tabcomercial2",
          },
        ],
      },
    ]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/tablero",
    submenu: [
    ]
  },
];
const resmed = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/resmed",
    submenu: [
      {
        text: "Historia Clinica",
        icono: "mdi-format-header-equal",
        href: "/reshc",
      },
      {
        text: "Resultados",
        icono: "mdi-view-dashboard-edit-outline",
        href: "/res_resultados",
      },

    ]
  },
];
const agendamed = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Agendas",
    icono: "mdi-cloud-print",
    ruta: "/menu/agendamed",
    submenu: [
      {
        text: "Solicitar Cita",
        icono: "mdi-account-edit-outline",
        href: "/sol_agenda",
      },

    ]
  },
  // {
  //   text: "Reportesxx",
  //   icono: "mdi-cloud-print",
  //   ruta: "/menu/agendamed",
  //   submenu: [
  //     {
  //       text: "Historia Clinicaxxx",
  //       icono: "mdi-format-header-equal",
  //       href: "/reshc",
  //     },
  //     {
  //       text: "Resultados",
  //       icono: "mdi-view-dashboard-edit-outline",
  //       href: "/resatpacientenf",
  //     },

  //   ]
  // },
];
const trespecial = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-car-arrow-right",
    ruta: "/menu/trespecial",
    submenu: [
      {
        text: "Extracto Contrato",
        icono: "mdi-account-tie-hat-outline",
        href: "/tr_extracto",
      },
      {
        text: "Imprimir Extracto ",
        icono: "mdi-cloud-print-outline",
        href: "/tr_impextracto",
      },

    ]
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/trespecial",
    submenu: [
      {
        text: "Saldos Propietarios",
        icono: "mdi-account-cash-outline",
        href: "/tr_rpsdopropiet",
      },
    ]
  },

  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/trespecial",
    submenu: [
      {
        text: "Conductores",
        icono: "mdi-account-tie-hat-outline",
        href: "/trCf_conductor",
      },

      {
        text: "Vehiculos",
        icono: "mdi-bus-school",
        href: "/trCfvehiculo",
      },
      {
        text: "Contratos",
        icono: "mdi-book-check-outline",
        href: "/trCfcontratos",
      },

    ]
  },
];
const recaudos = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/recaudos",
    id: "RSP10000000",
    submenu: [
      {
        text: "Recaudo Servicios",
        icono: "mdi-account-cash-outline",
        href: "/recaudo01",
        id: "RSP10000001",
      },
      {
        text: "Cierre Turno Cajero",
        icono: "mdi-door-closed-lock",
        href: "/pr_cierrerc",
        id: "RSP10000002",
      },
      {
        text: "Cierre Punto Recaudo",
        icono: "mdi-safe",
        href: "/pr_cierreptorc",
        id: "RSP10000003",
      },
      {
        text: "Bloqueo Pagos",
        icono: "mdi-credit-card-off-outline",
        href: "/pr_bloqueorc",
        id: "RSP10000004",
      },
      {
        text: "Cargue de Facturas",
        icono: "mdi-file-cloud-outline",
        href: "/pr_carguerc",
        id: "RSP10000005",
      },

      {
        text: "AsoBancaria",
        icono: "mdi-clipboard-text-play-outline",
        id: "RSP13000000",
        submenu2: [
          {
            text: "Generar Asobancaria",
            icono: "mdi-bank-transfer-out",
            href: "/pr_asobanca",
            id: "RSP13000001",
          },
          {
            text: "Desmarcar Asobancaria",
            icono: "mdi-upload-off",
            href: "/pr_dasobanca",
            id: "RSP13000002",
          },
          {
            text: "Remarcar Asobancaria",
            icono: "mdi-transfer-up",
            href: "/pr_rasobanca",
            id: "RSP13000003",
          }
        ]
      },
      {
        text: "Documento Soporte",
        icono: "mdi-clipboard-text-play-outline",
        id: "RSP13200000",
        submenu2: [
          {
            text: "Generar Documento",
            icono: "flip_to_front",
            href: "/Docsoporte",
            id: "RSP13200001",
          },
          {
            text: "Reimprimir Documento",
            icono: "mdi-printer-check",
            href: "/PrReimpDocsp",
            id: "RSP13200002",
          }
        ]
      },
    ]
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/recaudos",
    id: "RSP20000000",
    submenu: [
      {
        text: "Resumen Fecha/Entidad",
        icono: "mdi-storefront-outline",
        href: "/rp_recxentidad",
        id: "RSP20000001",
      },
      {
        text: "Entidad/Punto Recaudo",
        icono: "mdi-view-quilt-outline",
        href: "/rp_recxentpto",
        id: "RSP20000002",
      },

      {
        text: "Por Punto Recaudo",
        icono: "mdi-cash-register",
        href: "/rp_recxagencia",
        id: "RSP20000003",
      },
      {
        text: "Punto Recaudo/Entidad",
        icono: "mdi-cash",
        href: "/rp_recxagcent",
        id: "RSP20000004",
      },
      {
        text: "Recaudos Por Cajero",
        icono: "mdi-sticker-emoji",
        href: "/rp_recxcajero",
        id: "RSP20000005",
      },
      {
        text: "Detallado",
        icono: "mdi-view-headline",
        href: "/rp_detallado",
        id: "RSP20000006",
      },
      {
        text: "Duplicados",
        icono: "mdi-music-accidental-double-flat",
        href: "/rp_duplicados",
        id: "RSP20000007",
      },

      {
        text: "Cierres de Caja",
        icono: "mdi-account-lock",
        href: "/rp_cierresrc",
        id: "RSP20000007",
      },
      {
        text: "Cierre de Puntos",
        icono: "mdi-door-closed-lock",
        href: "/rp_cierreptorc",
        id: "RSP20000008",
      },
      {
        text: "Convenios",
        icono: "mdi-clipboard-text-play-outline",
        id: "RSP23100000",
        submenu2: [
          {
            text: "CDA Oriente",
            icono: "mdi-car-cog",
            href: "/rp_cdaoriente",
            id: "RSP23100001",
          },
          {
            text: "Eaav/Factura",
            icono: "mdi-account-details-outline",
            href: "/rp_eaavfactrc",
            id: "RSP23100002",
          },
          {
            text: "Eaav Detallado",
            icono: "mdi-table-edit",
            href: "/rp_eaavfactdet",
            id: "RSP23100003",
          },
          {
            text: "Llano Gas/Factura",
            icono: "mdi-format-list-text",
            href: "/rp_gasfactrc",
            id: "RSP23100004",
          },
          {
            text: "Llano Gas/Pto Recaudo",
            icono: "mdi-sprinkler-variant",
            href: "/rp_gasptorc",
            id: "RSP23100005",
          },
          {
            text: "Bioagricola/Factura",
            icono: "mdi-format-list-text",
            href: "/rp_bioagfactrc",
            id: "RSP23100006",
          },
          {
            text: "Emsa Subnormales",
            icono: "mdi-sprinkler-variant",
            href: "/rp_emsasub",
            id: "RSP23100007",
          },
          {
            text: "Seguro Estudiantil",
            icono: "mdi-face-man-shimmer",
            href: "/rp_segestud",
            id: "RSP23100008",
          },
        ]
      },
      {
        text: "Validación Emsa",
        icono: "mdi-clipboard-text-play-outline",
        id: "RSP13000000",
        submenu2: [
          {
            text: "Inconsistencias",
            icono: "mdi-bank-transfer-out",
            href: "/rp_emsa1",
            id: "RSP13000001",
          },
          {
            text: "Validar Reporte Emsa",
            icono: "mdi-upload-off",
            href: "/rp_emsa2",
            id: "RSP13000002",
          },
          {
            text: "Validacion Siec_Asobanca",
            icono: "mdi-bank-transfer-out",
            href: "/rp_emsa3",
            id: "RSP13000001",
          }



        ]
      },

      // {
      //   text: "Detallado Envios",
      //   icono: "mdi-chevron-double-right",
      //   href: "/tabcomercial",
      // },

    ]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/recaudos",
    id: "RSP30000000",
    submenu: [
      {
        text: "Convenios",
        icono: "mdi-marker",
        href: "/cfconveniorc",
        id: "RSP30000001",
      },
      {
        text: "Puntos de Recaudo",
        icono: "mdi-tooltip-check-outline",
        href: "/Cfagenciarec",
        id: "RSP30000002",
      },
      {
        text: "Ruts",
        icono: "mdi-account-group-outline",
        href: "/rc_ruts",
        id: "RSP30000003",
      },
      {
        text: "Usuarios",
        icono: "mdi-account-key",
        href: "/rc_usuarios",
        id: "RSP30000004",
      },
      {
        text: "Perfiles",
        icono: "mdi-account-details",
        href: "/Cfperfil",
        id: "RSP30000005",
      }

    ]
  },
];
const manual = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/manual",
    submenu: [
      {
        text: "Procesos",
        icono: "mdi-vector-combine",
        href: "/manprfin",
      },
      {
        text: "Reportes",
        icono: "mdi-cloud-print-outline",
        href: "/manrpfin",
      },
      {
        text: "Configuración",
        icono: "mdi-cog-play-outline",
        href: "/mancffin",
      }
    ]
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/manual",
    submenu: [
      {
        text: "Procesos",
        icono: "mdi-vector-combine",
        href: "/manprmer",
      },
      {
        text: "Reportes",
        icono: "mdi-cloud-print-outline",
        href: "/manrpmer",
      },
      {
        text: "Configuración",
        icono: "mdi-cog-play-outline",
        href: "/mancfmer",
      }
    ]
  },
  {
    text: "Configuración",
    icono: "mdi-cogs",
    ruta: "/menu/manual",
    submenu: [
      {
        text: "Procesos",
        icono: "mdi-vector-combine",
        href: "/manprgth",
      },
      {
        text: "Reportes",
        icono: "mdi-cloud-print-outline",
        href: "/manrpgth",
      },
      {
        text: "Configuración",
        icono: "mdi-cog-play-outline",
        href: "/mancfgth",
      }
    ]
  },
];
const plazos = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/plazos",
    submenu: [
      {
        text: "Facturación",
        icono: "mdi-cart-plus",
        href: "/pr_plzFact01",
      },
      {
        text: "Reimprimir Facturación",
        icono: "mdi-printer-check",
        href: "/pr_plzFact02",
      },
      {
        text: "Recaudos",
        icono: "mdi-file-edit",
        href: "/pr_plzrecaudo",
      },
      {
        text: "Reimpresión",
        icono: "mdi-printer-check",
        href: "/pr_plzreimp",
        id: "FIN10100002",
      },
      {
        text: "Contratos",
        icono: "mdi-alpha-c-circle-outline",
        href: "/pr_plzcontrato01",
      },
      {
        text: "Reimprimir Contratos",
        icono: "mdi-cloud-print-outline",
        href: "/pr_plzcontrato02",
      },

    ]
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/plazos",
    submenu: [
      {
        text: "Cartera Contratos",
        icono: "mdi-card-text",
        href: "/rp_plzcartera01",
      },

      {
        text: "Facturación",
        icono: "mdi-vector-combine",
        href: "/manprmer",
      },
    ]
  },
  {
    text: "Configuración",
    icono: "mdi-cogs",
    ruta: "/menu/plazos",
    submenu: [
      {
        text: "Ruts",
        icono: "mdi-account-check",
        href: "/plz_ruts",
      },
    ]
  },
];
const externo = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/externo",
    submenu: [
    ]
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/externo",
    submenu: [
      {
        text: "Resumen Fecha/Entidad",
        icono: "mdi-storefront-outline",
        href: "/rp_recxentidad",
      },
    ]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/externo",
    submenu: [
      {
        text: "Vinculación",
        icono: "mdi-human-edit",
        href: "/cfasociados",
      }
    ]
  },
];
const asociados = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/asociados",
    submenu: [
      {
        text: "Créditos",
        icono: "mdi-clipboard-text-play-outline",
        id: "",
        submenu2: [
          {
            text: "Simulador",
            icono: "mdi-calculator",
            href: "/pr_Simulacred",
          },

          {
            text: "Solicitud",
            icono: "mdi-human-greeting-variant",
            href: "/pr_Assolcred",
          },
          {
            text: "Estudio",
            icono: "mdi-human-male-board-poll",
            href: "/pr_Asestcred",
          },
          {
            text: "Aprobación",
            icono: "mdi-check-circle-outline",
            href: "/pr_Asaprcred",
          },
          {
            text: "Emisión",
            icono: "mdi-bank-check",
            href: "/pr_Emisioncred",
          },
          {
            text: "Categorizar",
            icono: "mdi-auto-download",
            href: "/pr_categoriza",
          },

          {
            text: "Cargue Garantías",
            icono: "mdi-cloud-upload-outline",
            href: "/pr_Asgarant",
          },
          {
            text: "Cargue Creditos",
            icono: "mdi-apple-keyboard-caps",
            href: "/pr_Ascarguecr",
          },
          {
            text: "Impresión Creditos",
            icono: "mdi-apple-keyboard-caps",
            href: "/pr_Asimpcred",
          }

        ]
      },
      {
        text: "Aportes",
        icono: "mdi-clipboard-text-play-outline",
        id: "",
        submenu2: [
          {
            text: "Cargue Aportes",
            icono: "mdi-arrow-top-right-thin-circle-outline",
            href: "/pr_cargueaporte",
          }]
      },


    ]
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/asociados",
    submenu: [
      // {
      //   text: "Estado de Cuenta",
      //   icono: "mdi-file-sign",
      //   href: "/rp_Asestcta",
      // },
      // {
      //   text: "Reporte Codeudores",
      //   icono: "mdi-file-sign",
      //   href: "/rp_Asestcta",
      // },
      // {
      //   text: "Reporte Lineas de Credito",
      //   icono: "mdi-file-sign",
      //   href: "/rp_Asestcta",
      // },
      // {
      //   text: "Cartera por Edades",
      //   icono: "mdi-file-sign",
      //   href: "/rp_cartedad",
      // },

      // {
      //   text: "Libro de Asociados",
      //   icono: "mdi-human-male-female",
      //   href: "/rp_Aslibroas",
      // },
      {
        text: "Créditos",
        icono: "mdi-cash-100",
        href: "/rp_asoccreditos",
      },
      {
        text: "Movimiento Aportes",
        icono: "mdi-hand-coin-outline",
        href: "/rp_movaportes",
      },

      {
        text: "Saldo Aportes",
        icono: "mdi-piggy-bank-outline",
        href: "/rp_saldoaportes",
      },

    ]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/asociados",
    submenu: [
      {
        text: "Vinculación",
        icono: "mdi-human-edit",
        href: "/cf_asociados",
      },
      {
        text: "Tipos de Crédito",
        icono: "mdi-ab-testing",
        href: "/cf_asoctipos",
      },
      {
        text: "Parámetros",
        icono: "mdi-tune-vertical",
        href: "/cf_asocparam",
      }

    ]
  },
];
const transporte = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/transporte",
    id: "TRA10000000",
    submenu: [
      {
        text: "Tiquetes",
        icono: "mdi-hail",
        href: "/pr_trtiquetes",
        id: "TRA10000001",
      },
      {
        text: "Cargues",
        icono: "mdi-bus-clock",
        href: "/pr_trcargues",
        id: "TRA10000002",
      },
      {
        text: "Ordenes y Sar",
        icono: "mdi-arrow-left-thin-circle-outline",
        href: "/pr_ordsar",
        id: "TRA10000003",
      },
      {
        text: "Comprobantes",
        icono: "mdi-format-strikethrough-variant",
        href: "/pr_trcomprob",
        id: "TRA10000004",
      },
      {
        text: "Cierre de Caja",
        icono: "mdi-cash-lock",
        href: "/pr_trccaja",
        id: "TRA10000005",
      },
      {
        text: "Convenios",
        icono: "mdi-human-greeting-proximity",
        href: "/pr_trconvenios",
        id: "TRA10000006",
      },

      {
        text: "Comprob_Jefe",
        icono: "mdi-format-strikethrough-variant",
        href: "/pr_trcomprob2",
        id: "TRA10000007",
      },
      {
        text: "Preoperacional",
        icono: "mdi-checkbox-outline",
        href: "/pr_trpreopera",
        id: "TRA10000008",
      },

      // {
      //   text: "Otros Procesos",
      //   icono: "mdi-clipboard-text-play-outline",
      //   id: "TRA10000008",
      //   submenu2: [
      //     {
      //       text: "Actualizar Cierre",
      //       icono: "mdi-sheep",
      //       href: "/pr_actcierre",
      //     },
      //   ],
      // },

    ]
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/transporte",
    id: "TRA20000000",
    submenu: [
      {
        text: "Tiquetes",
        icono: "mdi-bus-stop-uncovered",
        href: "/rp_trtiquetes",
        id: "TRA20000001",
      },
      {
        text: "Libro de Viajes",
        icono: "mdi-map-clock-outline",
        href: "/rp_trlviajes",
        id: "TRA20000002",
      },
      {
        text: "Reporte Comprobantes",
        icono: "mdi-draw",
        href: "/rp_comprobtr",
        id: "TRA20000003",
      },
      {
        text: "Cierres de Caja",
        icono: "mdi-account-lock",
        href: "/rp_cierrestr",
        id: "TRA20000004",
      },
      {
        text: "Resumen Ventas del Dia",
        icono: "mdi-cash-fast",
        href: "/rp_resvtastr",
        id: "TRA20000005",
      },
      {
        text: "Libro Viajes Propietarios",
        icono: "mdi-content-paste",
        href: "/rp_trlviajespr",
        id: "TRA20000006",
      },
      {
        text: "RPC Propietarios",
        icono: "mdi-cash-check",
        href: "/rp_trrpcpr",
        id: "TRA20000007",
      },
      {
        text: "Resumen Libro Viajes",
        icono: "mdi-order-numeric-descending",
        href: "/rp_trreslviajes",
        id: "TRA20000008",
      },
      {
        text: "Reporte Producido",
        icono: "mdi-cash-100",
        href: "/rp_trproducido",
        id: "TRA20000009",
      },
      {
        text: "Res.Vtas/Dia",
        icono: "mdi-clipboard-text-play-outline",
        href: "/rp_trresvtasdia",
        id: "TRA20000010",
      },
      {
        text: "Res.Vtas/Taquillero",
        icono: "mdi-account-box-multiple-outline",
        href: "/rp_trresvtasuser",
        id: "TRA20000011",
      },
      {
        text: "Historial Pasajero",
        icono: "mdi-seat-recline-extra",
        href: "/rp_hpasajero",
        id: "TRA20000012",
      },
      {
        text: "Ordenes Convenios",
        icono: "mdi-bus-stop-uncovered",
        href: "/rp_trordconvenio",
        id: "TRA20000013",
      },
      {
        text: "Validación LV/Tiquetes",
        icono: "mdi-align-horizontal-center",
        href: "/rp_trvalidalv",
        id: "TRA20000014",
      },
      {
        text: "Reporte Reteica",
        icono: "mdi-cash-100",
        href: "/rp_trreteica",
        id: "TRA20000015",
      },
      {
        text: "Reporte Cargues",
        icono: "mdi-bus-clock",
        href: "/rp_trcargues",
        id: "TRA20000016",
      },
      {
        text: "Docs Electrónicos",
        icono: "mdi-chart-line-variant",
        href: "/rp_trdocselect",
        id: "TRA20000017",
      },
      {
        text: "Reporte Papeleria",
        icono: "mdi-file-document-check-outline",
        href: "/rp_trpapeleria",
        id: "TRA20000018",
      },




    ]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/transporte",
    id: "TRA30000000",
    submenu: [
      {
        text: "Conductores",
        icono: "mdi-account-tie-hat-outline",
        href: "/Cf_conductor",
      },
      {
        text: "Vehiculos",
        icono: "mdi-bus-school",
        href: "/cf_vehiculos",
      },
      {
        text: "Conceptos",
        icono: "mdi-file-document-edit",
        href: "/cf_conceptotr",
      },
      {
        text: "Agencias",
        icono: "mdi-stretch-to-page",
        href: "/cf_agenciastr",
      },
      {
        text: "Destinos Web",
        icono: "mdi-transit-transfer",
        href: "/cf_destinostr",
      },
      {
        text: "Embarques",
        icono: "mdi-sign-yield",
        href: "/cf_embarquestr",
      }

    ]
  },
];
const actividad = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/punto_venta",
    submenu: [
      {
        text: "Facturación",
        icono: "mdi-clipboard-text-play-outline",
        submenu2: [
          {
            text: "Generar Factura",
            icono: "mdi-cart-plus",
            href: "/facturacion",
          },
          {
            text: "Reimpresión",
            icono: "mdi-printer-check",
            href: "/PrReimpfact",
          },
        ],
      },
    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/actividad",
    submenu: [
      {
        text: "S/D",
        icono: "mdi-bank-outline",
        href: "/clientes",
      },]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/actividad",
    submenu: [
      {
        text: "Procesos",
        icono: "mdi-google-circles-group",
        href: "/CfActprocesos",
      },
      {
        text: "Procedimientos",
        icono: "mdi-arrow-decision-outline",
        href: "/CfActprocedim",
      },
      {
        text: "Actividades",
        icono: "mdi-check-circle-outline",
        href: "/CfActactividad",
      },
      {
        text: "Vincular Actividades",
        icono: "mdi-elevator",
        href: "/CfActvincular",
      }

    ]
  },
];
const gestion_th = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/gestion_th",
    id: "GTH10000000",
    submenu: [
      {
        text: "Liquidar Nómina",
        icono: "mdi-human-capacity-increase",
        href: "/PrGenera",
      },
      {
        text: "Liquidar Colaborador",
        icono: "mdi-account-remove-outline",
        href: "/PrGenera3",
      },
      {
        text: "Liquidar Vacaciones",
        icono: "mdi-island",
        href: "/PrGenera5",
      },

      {
        text: "Liquidar Prima",
        icono: "mdi-account-star",
        href: "/PrGenera2",
      },

      {
        text: "Liquidar Cesantias",
        icono: "mdi-card-account-details-star-outline",
        href: "/PrGenera4",
      },

      {
        text: "Cierre Nómina",
        icono: "mdi-account-lock",
        href: "/PrCierregth",
      },
      {
        text: "Eliminar Nómina",
        icono: "mdi-delete-forever-outline",
        href: "/PrEliminagth",
      },
      {
        text: "Pago de Nómina",
        icono: "mdi-cash-fast",
        href: "/Prpagonom",
      },
      {
        text: "Comprobante Pila",
        icono: "mdi-dots-hexagon",
        href: "/Pr_Pila",
      },
      {
        text: "Nómina por C.Costo",
        icono: "mdi-human-capacity-increase",
        href: "/PrGeneracc",
      },
      {
        text: "Entrega Dotación",
        icono: "mdi-tshirt-crew-outline",
        href: "/PrDotacion",
      },
      {
        text: "Novedades Nómina",
        icono: "mdi-eye-settings-outline",
        href: "/pr_novedades",
      },
      {
        text: "Validación Novedades",
        icono: "mdi-checkbox-marked-circle-auto-outline",
        href: "/pr_valnovedad",
      },
      {
        text: "Validación Solicitudes",
        icono: "mdi-check-underline",
        href: "/pr_valsolicitud",
      },

      {
        text: "Clonar Nómina",
        icono: "mdi-sheep",
        href: "/Pr_Clonagth",
      },
      {
        text: "Importar Nómina",
        icono: "mdi-arrow-up-bold-outline",
        href: "/PrImportgth",
      },
      {
        text: "Exportar Contabilización",
        icono: "mdi-transfer-down",
        href: "/Pr_Exportcontgth",
      },




    ]
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print-outline",
    ruta: "/menu/gestion_th",
    id: "GTH20000000",
    submenu: [
      {
        text: "Impresión Nómina",
        icono: "mdi-account-box-multiple-outline",
        href: "/RpImpNom",
      },
      {
        text: "Comp. de Pago",
        icono: "mdi-card-account-details-outline",
        href: "/RpCPago",
      },
      {
        text: "Detallado Nomina",
        icono: "mdi-playlist-edit",
        href: "/RpDetNom1",
      },
      {
        text: "Provisiones Nomina",
        icono: "mdi-currency-php",
        href: "/rp_provNom",
      },

      {
        text: "Impresión Cesantias",
        icono: "mdi-account-box-multiple-outline",
        href: "/RpImpCes",
      },
      {
        text: "Impresión Primas",
        icono: "mdi-account-box-multiple-outline",
        href: "/RpImpPrim",
      },
      {
        text: "Liquidación Prestaciones",
        icono: "mdi-human-capacity-increase",
        href: "/RpImpLiq",
      },
      {
        text: "Liquidación Vacaciones",
        icono: "mdi-island",
        href: "/RpImpVac",
      },
      {
        text: "Nómina Electrónica",
        icono: "mdi-account-convert",
        href: "/RpNomelect",
      },
      {
        text: "Pila",
        icono: "mdi-dots-hexagon",
        href: "/RpPila",
      },
      {
        text: "Dotaciones",
        icono: "mdi-tshirt-crew-outline",
        href: "/rp_Dotaciones",
      },
      {
        text: "Reporte Novedades",
        icono: "mdi-alpha-n-box-outline",
        href: "/rp_impNov",
      },

      {
        text: "Cert. Ingresos y Retenciones",
        icono: "mdi-card-account-details-star-outline",
        href: "/Rpcertidian",
      },
      {
        text: "Certificado Laboral",
        icono: "mdi-certificate-outline",
        href: "/rp_certlab",
      },

    ]


  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/gestion_th",
    id: "GTH30000000",
    submenu: [
      {
        text: "Colaboradores",
        icono: "mdi-human-handsup",
        href: "/Cfcolaborador",
      },
      {
        text: "Ruts",
        icono: "mdi-account-multiple-plus-outline",
        href: "/cf_ruts",
      },
      {
        text: "Devengos",
        icono: "mdi-account-cash",
        href: "/Cfdevengos",
      },
      {
        text: "Deducciones",
        icono: "mdi-currency-usd-off",
        href: "/Cfdeduccion",
      },
      {
        text: "Cargos",
        icono: "mdi-bag-checked",
        href: "/Cfcargos",
      },
      {
        text: "Parámetros",
        icono: "mdi-tune-vertical",
        href: "/CfParamgth",
      },
      {
        text: "Eq_Importación",
        icono: "mdi-arrow-collapse-horizontal",
        href: "/Cfeqbasegth",
      },


    ]
  },
];
const soporte = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/soporte",
    submenu: [
      {
        text: "Activación",
        icono: "mdi-human-edit",
        href: "/Practivacion",
      },
      {
        text: "Eliminar DSP",
        icono: "mdi-alien",
        href: "/preliminardsp",
      },
      {
        text: "Eliminar Acuse",
        icono: "mdi-alien",
        href: "/preliminaracuse",
      },
      {
        text: "Eliminar Factura",
        icono: "mdi-alien",
        href: "/preliminarfact",
      },
      {
        text: "Eliminar NCredito",
        icono: "mdi-alien",
        href: "/preliminarnc",
      },
      {
        text: "Eliminar Historia",
        icono: "mdi-alien",
        href: "/preliminarhc",
      },

      {
        text: "Mover N.Credito",
        icono: "mdi-alien",
        href: "/prmovernc",
      },
      {
        text: "Fecha Factura",
        icono: "mdi-alien",
        href: "/prfechafact",
      },
      {
        text: "Activar Tiq.Transporte",
        icono: "mdi-alien",
        href: "/pr_acttiquete",
      },
      {
        text: "Act. cierre de Caja",
        icono: "mdi-alien",
        href: "/pr_actcierre",
      },

      // {
      //   text: "Copiar_Dlls",
      //   icono: "mdi-auto-mode",
      //   href: "/pr_copydll",
      // },
    ]
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/soporte",
    submenu: [
      {
        text: "Documentos Electronicos",
        icono: "mdi-alpha-e-circle-outline",
        href: "/rp_docseletronicos",
      },

    ]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/soporte",
    submenu: [
      {
        text: "Bases Exógena Dianxxx",
        icono: "mdi-orbit",
        href: "/cfbasesdian",
      }

    ]
  },
];
const hclinica = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/hclinica",
    id: "HCL10000000",
    submenu: [
      {
        text: "Médicos",
        icono: "mdi-clipboard-text-play-outline",
        id: "HCL14000000",
        submenu2: [
          {
            text: "Atención de Paciente",
            icono: "mdi-human-edit",
            href: "/pratpaciente",
            id: "HCL14000001",
          },
          {
            text: "Notas Médicas",
            icono: "mdi-account-details-outline",
            href: "/prnotamedica",
            id: "HCL14000002",
          },
          {
            text: "Actualizar Historia",
            icono: "mdi-alien-outline",
            href: "/pr_acthc",
            id: "HCL14000003",
          },

        ],
      },
      {
        text: "Enfermería",
        icono: "mdi-clipboard-text-play-outline",
        id: "HCL14100000",
        submenu2: [
          {
            text: "Atención de Pacientes",
            icono: "mdi-hand-heart-outline",
            href: "/hc_atpacientenf",
            id: "HCL14100001",
          },
          {
            text: "Preconsulta",
            icono: "mdi-account-search-outline",
            href: "/pr_preconsulta",
            id: "HCL14100002",

          },

        ],
      },
      {
        text: "Cirugía",
        icono: "mdi-clipboard-text-play-outline",
        id: "HCL14000000",
        submenu2: [
          {
            text: "Pre Anestesia",
            icono: "mdi-text-box-edit-outline",
            href: "/pr_preanestesia",
            id: "HCL14000001",
          },
          {
            text: "Registro Anestesia",
            icono: "mdi-needle",
            href: "/pr_anestesia",
            id: "HCL14000001",
          },

          {
            text: "Informe Quirúrgico",
            icono: "mdi-vector-polyline-edit",
            href: "/pr_informeqx",
            id: "HCL14000002",
          },
          {
            text: "Check Cirugia Segura",
            icono: "mdi-checkbox-outline",
            href: "/pr_cirugcheck",
            id: "HCL14000003",
          },
          {
            text: "Hoja de Gastos",
            icono: "mdi-calculator-variant-outline",
            href: "/pr_cirhojagto",
            id: "HCL14000003",
          },
          {
            text: "Conteo Material Quirurgico",
            icono: "mdi-braille",
            href: "/pr_circonteo",
            id: "HCL14000003",
          },

        ],
      },

    ]
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/hclinica",
    id: "HCL20000000",
    submenu: [
      {
        text: "Hc de Paciente",
        icono: "mdi-file-document-edit-outline",
        href: "/rp-hcpaciente",
        id: "HCL20000001",
      },
      {
        text: "Busqueda Historia",
        icono: "mdi-clipboard-text-search-outline",
        href: "/rp-busqhc",
        id: "HCL20000002",
      },

    ]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/hclinica",
    id: "HCL30000000",
    submenu: [
      {
        text: "Plantillas H.C.",
        icono: "mdi-file-document-edit-outline",
        href: "/cfplantillahc",
        id: "HCL30000001",
      }

    ]
  },
];
const contador = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menuconta",
  },
];
const dispensa = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/dispensa",
    id: "DSP10000000",
    submenu: [
      {
        text: "Dispensación",
        icono: "mdi-clipboard-text-play-outline",
        id: "DSP16000000",
        submenu2: [
          {
            text: "Asigna Turnos",
            icono: "mdi-human-capacity-increase",
            href: "/prdisp_asignatur",
            id: "DSP16000001",
          },
          {
            text: "Atención Turnos",
            icono: "mdi-face-man-shimmer",
            href: "/prdisp_atiendetur",
            id: "DSP16000002",
          },
          {
            text: "Entrega Pendientes",
            icono: "mdi-send-check-outline",
            href: "/prdsp_entrptes",
            id: "DSP16000003",
          },
          {
            text: "Pantalla Turnos",
            icono: "mdi-laptop-account",
            href: "/prdisp_pantallatur",
            id: "DSP16000004",
          },
          {
            text: "Consultar Paciente",
            icono: "mdi-account-heart-outline",
            href: "/prdisp_conspaciente",
            id: "DSP16000005",
          },
          {
            text: "Cierre de Caja",
            icono: "mdi-account-cash-outline",
            href: "/prdsp_cierrecj",
            id: "DSP16000006",
          },
          {
            text: "Dispensar Mipres",
            icono: "mdi-file-document-arrow-right",
            href: "/prdsp_dispmipres",
            id: "DSP16000007",
          },
          {
            text: "Novedades Dispensación",
            icono: "mdi-comment-alert-outline",
            href: "/prdsp_dspeventos",
            id: "DSP16000008",
          },
          {
            text: "Novedades Pendientes",
            icono: "mdi-alert-circle-check-outline",
            href: "/prdsp_novptes",
            id: "DSP16000009",
          },
          {
            text: "DigiTurno",
            icono: "mdi-human-capacity-increase",
            href: "/prdisp_digituno",
            id: "DSP16000010",
          },
          {
            text: "Eventos Facturación",
            icono: "mdi-alert-decagram",
            href: "/prdisp_eventfact",
            id: "DSP16000011",
          },


        ]
      },
      {
        text: "Facturación",
        icono: "mdi-clipboard-text-play-outline",
        id: "DSP10300000",
        submenu2: [
          {
            text: "Facturar Dispensación",
            icono: "mdi-cash-check",
            href: "/prdisp_genfact",
            id: "DSP10300001",
          },
          {
            text: "Radicación",
            icono: "mdi-draw",
            href: "/prdisp_radica",
            id: "DSP10300002",
          },
          {
            text: "Cargue Rips",
            icono: "mdi-alpha-r-box-outline",
            href: "/prdisp_rips",
            id: "DSP10300003",
          },
          {
            text: "Generar Rips",
            icono: "mdi-alpha-d-box-outline",
            href: "/prdisp_genrips",
            id: "DSP10300003",
          },

          {
            text: "Facturar Otros",
            icono: "mdi-currency-twd",
            href: "/prdisp_genfacotros",
            id: "DSP16000002",
          },
          {
            text: "Reimpresión Factura",
            icono: "mdi-printer-check",
            href: "/prdisp_Reimpfact",
            id: "DSP16000003",
          },
          {
            text: "Generar Nota Crédito",
            icono: "mdi-abugida-thai",
            href: "/Prdisp_ncredito",
            id: "DSP16000004",
          },
          {
            text: "Reimpresión Ncredito",
            icono: "mdi-printer-check",
            href: "/Prdisp_ncredito02",
            id: "DSP16000005",
          },


        ],


      },
      {
        text: "Compras",
        icono: "mdi-clipboard-text-play-outline",
        id: "DSP10500000",
        submenu2: [
          {
            text: "Análisis Rotación",
            icono: "mdi-arrow-decision",
            href: "/prdisp_rotacion",
            id: "DSP10300001",
          },
          {
            text: "Ordenes de Compra",
            icono: "mdi-draw",
            href: "/prdisp_ordcompra",
            id: "DSP10300002",
          },
          {
            text: "Reimpresión O.Compra",
            icono: "mdi-printer-check",
            href: "/prdsp_rpordcompra",
          },
          {
            text: "Validación y Acuse",
            icono: "mdi-cart-arrow-up",
            href: "/prdisp_valcompra",
            id: "DSP10400015",
          },
          {
            text: "Remisiones",
            icono: "mdi-alpha-r-box-outline",
            href: "/prdisp_remision",
            id: "DSP10300003",
          },
          {
            text: "Cotizaciones",
            icono: "mdi-currency-twd",
            href: "/prdisp_cotiza",
            id: "DSP16000002",
          },
          {
            text: "Notas Débito Compras",
            icono: "mdi-abugida-thai",
            href: "/Prdisp_ndebitoc",
            id: "DSP16000004",
          },
          {
            text: "Reimpresión NDébito",
            icono: "mdi-printer-check",
            href: "/Prdisp_ndebitoc",
            id: "DSP16000005",
          },
          {
            text: "Historial Producto",
            icono: "mdi-alpha-p-box-outline",
            href: "/prdisp_histprod",
            id: "DSP10400007",
          },


        ],


      },
      {
        text: "Mercancías",
        icono: "mdi-clipboard-text-play-outline",
        id: "DSP10400000",
        submenu2: [
          {
            text: "Registrar Compra",
            icono: "mdi-cart-arrow-up",
            href: "/prdisp_compra",
            id: "DSP10400001",
          },
          {
            text: "Traslado Express",
            icono: "mdi-clock-fast",
            href: "/prdsp_trasexpress",
            id: "DSP10400015",
          },
          {
            text: "Solicitar Traslado",
            icono: "mdi-arrow-right-bold-circle-outline",
            href: "/prdsp_soltraslado",
            id: "DSP10400002",
          },
          {
            text: "Procesar Traslados",
            icono: "mdi-arrow-decision-outline",
            href: "/prdisp_proctraslado",
            id: "DSP10400003",
          },
          {
            text: "PreCargue Pedido",
            icono: "mdi-invoice-export-outline",
            href: "/prdisp_precargue",
            id: "DSP10400004",
          },
          {
            text: "Procesar Pedido",
            icono: "mdi-elevator-up",
            href: "/prdsp_alistaped",
            id: "DSP10400005",
          },

          // {
          //   text: "Proceso Empaque",
          //   icono: "mdi-package-variant",
          //   href: "/prdisp_ordcompra",
          //   id: "DSP10400010",
          // },

          // {
          //   text: "Alistamiento",
          //   icono: "mdi-auto-upload",
          //   href: "/prdisp_alista",
          //   id: "DSP10400003",
          // },
          // {
          //   text: "Traslados",
          //   icono: "mdi-arrow-decision-outline",
          //   href: "/prdisp_traslado",
          //   id: "DSP10400004",
          // },
          {
            text: "Cierre Inventarios",
            icono: "mdi-check-underline-circle-outline",
            href: "/prdisp_Cierreinv",
            id: "DSP10400010",
          },
          {
            text: "Ciclicos",
            icono: "mdi-auto-mode",
            href: "/prdsp_ciclicos",
            id: "DSP10400012",
          },
          {
            text: "Novedades Inventario",
            icono: "mdi-alert",
            href: "/prdisp_novinvent",
            id: "DSP10400013",
          },
          {
            text: "Reimpresión Mercancías",
            icono: "mdi-printer-check",
            href: "/prdsp_reimpinvent",
            id: "DSP10400014",

          },
        ]

      },
      {
        text: "Inventario Fisico",
        icono: "mdi-clipboard-text-play-outline",
        id: "DSP10500000",
        submenu2: [
          {
            text: "Inventario Fisico",
            icono: "mdi-align-vertical-bottom",
            href: "/prdisp_invfisico",
            id: "DSP10500001",
          },
          {
            text: "Saldo Inventario",
            icono: "mdi-clipboard-list-outline",
            href: "/rp_dspsaldofis",
            id: "DSP26000002",
          },
          {
            text: "Kárdex Inv.Fisico",
            icono: "mdi-filter-variant-plus",
            href: "/rp-dspKardexf",
            id: "DSP10500002",
          },

          {
            text: "Traslado Inv.Fisico",
            icono: "mdi-arrow-right-top",
            href: "/prdsp_traslfisico",
            id: "DSP10500003",
          },
          {
            text: "Actualizar Inv.Fisico",
            icono: "mdi-chemical-weapon",
            href: "/prdsp_correcinvf",
            id: "DSP10500004",
          },


        ]
      },
      {
        text: "Otros Procesos",
        icono: "mdi-clipboard-text-play-outline",
        id: "DSP11000000",
        submenu2: [
          {
            text: "Cargue Pacientes",
            icono: "mdi-account-reactivate-outline",
            href: "/prdisp_carguepac",
            id: "DSP11000001",
          },
          {
            text: "Procesar Bloqueos",
            icono: "mdi-grid-off",
            href: "/prdsp_bloqueos",
            id: "DSP11000002",
          },
          {
            text: "Consolidar",
            icono: "mdi-set-right",
            href: "/prdsp_consolida",
            id: "DSP11000099",
          },

        ]
      }

    ]
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/dispensa",
    id: "DSP20000000",
    submenu: [
      {
        text: "Dispensación",
        icono: "mdi-clipboard-text-play-outline",
        id: "DSP26000000",
        submenu2: [
          {
            text: "Reporte Turnos",
            icono: "mdi-view-grid-plus-outline",
            href: "/rp_turnos",
            id: "DSP26000001",
          },
          {
            text: "Saldo Medicamentos",
            icono: "mdi-clipboard-list-outline",
            href: "/rp_dspsaldos",
            id: "DSP26000002",
          },
          {
            text: "Resumen Dispensaciones",
            icono: "mdi-cloud-print-outline",
            href: "/rp_dispensa02",
            id: "DSP26000003",
          },
          {
            text: "Detallado Dispensaciones",
            icono: "mdi-format-list-numbered",
            href: "/rp_dispensa01",
            id: "DSP26000004",
          },
          {
            text: "Reporte Pendientes",
            icono: "mdi-timer-edit-outline",
            href: "/rp_pendientes01",
            id: "DSP26000005",
          },
          {
            text: "Reporte Masivas",
            icono: "mdi-text-box-edit-outline",
            href: "/rpdsp_masivas",
            id: "DSP26000006",
          },
          {
            text: "Consumos",
            icono: "mdi-format-list-numbered",
            href: "/rp_dspconsumos",
            id: "DSP26000008",
          },

          {
            text: "Kardex",
            icono: "mdi-filter-variant-plus",
            href: "/rp-dspKardex1",
            id: "DSP26000007",
          },
        ]
      },
      {
        text: "Mercancías",
        icono: "mdi-clipboard-text-play-outline",
        id: "DSP10400000",
        submenu2: [
          {
            text: "Vacio",
            icono: "mdi-account-reactivate-outline",
            href: "/prdisp_carguepac",
            id: "DSP10000007",
          },

        ]
      }

    ]

  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/dispensa",
    id: "DSP30000000",
    submenu: [
      {
        text: "Productos",
        icono: "mdi-pill-multiple",
        href: "/cf_medicamentos",
        id: "DSP30000001",
      },
      {
        text: "Agrupa Moleculas",
        icono: "mdi-asterisk",
        href: "/cf_agrpmoleculas",
        id: "DSP30000002",
      },
      {
        text: "Moléculas",
        icono: "mdi-virus-outline",
        href: "/cf_molecula",
        id: "DSP30000003",
      },
      {
        text: "Grp Farmacologico",
        icono: "mdi-ungroup",
        href: "/cf_GrpFama",
        id: "DSP30000004",
      },
      {
        text: "Concentraciones",
        icono: "mdi-dots-hexagon",
        href: "/cf_concentrac",
        id: "DSP30000005",
      },
      {
        text: "Unidad Concentración",
        icono: "mdi-scale-unbalanced",
        href: "/cf_undconcentrac",
        id: "DSP30000021",
      },
      {
        text: "Unidad Referencia",
        icono: "mdi-scatter-plot-outline",
        href: "/cf_unidadrefer",
        id: "DSP30000022",
      },
      {
        text: "Descripcion Comercial",
        icono: "mdi-alpha-c-circle-outline",
        href: "/cf_descrcomerc",
        id: "DSP30000023",
      },
      {
        text: "Formas Farmaceuticas",
        icono: "mdi-cube-send",
        href: "/cf_formafarm",
        id: "DSP30000006",
      },
      {
        text: "Presentación Comercial",
        icono: "mdi-locker-multiple",
        href: "/cf_prescomerc",
        id: "DSP30000007",
      },
      {
        text: "Nombre Comercial",
        icono: "mdi-registered-trademark",
        href: "/cf_nombrecomerc",
        id: "DSP30000008",
      },
      {
        text: "Laboratorios",
        icono: "mdi-graph-outline",
        href: "/cf_laboratorios",
        id: "DSP30000009",
      },
      {
        text: "Contratos",
        icono: "mdi-file-document-edit-outline",
        href: "/cf_contratos",
        id: "DSP30000010",
      },
      {
        text: "Cargue Contratos",
        icono: "mdi-check-underline-circle-outline",
        href: "/cf_carguecontr",
        id: "DSP30000011",
      },
      {
        text: "Filas Turnos",
        icono: "mdi-apple-keyboard-caps",
        href: "/cf_filaturnos",
        id: "DSP30000012",
      },
      {
        text: "Sub_Filas Turnos",
        icono: "mdi-reddit",
        href: "/cf_subfilaturnos",
        id: "DSP30000013",
      },
      {
        text: "Ventanillas",
        icono: "mdi-account-check",
        href: "/cf_ventanilla",
        id: "DSP30000014",
      },
      {
        text: "Ips Remitente",
        icono: "mdi-transfer-right",
        href: "/cf_ipsremite",
        id: "DSP30000015",
      },
      {
        text: "Medico Remitente",
        icono: "mdi-doctor",
        href: "/cf_medremite",
        id: "DSP30000016",
      },
      {
        text: "Novedades de Atención",
        icono: "mdi-account-remove",
        href: "/cf_dspnovedadat",
        id: "DSP30000017",
      },
      {
        text: "Pacientes",
        icono: "mdi-account-group",
        href: "/cf_pacientes",
        id: "DSP30000018",
      },
      {
        text: "Eps",
        icono: "mdi-hospital-box-outline",
        href: "/cf_eps",
        id: "DSP30000019",
      },
      {
        text: "Especialidades",
        icono: "mdi-backburger",
        href: "/Ss_Cfespecialidad",
        id: "DSP30000020",
      },

      {
        text: "Expedientes",
        icono: "mdi-currency-try",
        href: "/cf_expediente",
        id: "DSP30000021",
      },
      {
        text: "Homologaciones",
        icono: "mdi-align-horizontal-distribute",
        href: "/cf_homologa",
        id: "DSP30000024",
      },
    ]
  },
];
const docselect = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/docselect",
    submenu: [
      {
        text: "Comercial",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN10100000",
        submenu2: [
          {
            text: "Expedir Factura",
            icono: "mdi-cart-plus",
            href: "/facturacion",
          },
          {
            text: "Reimpresión Factura",
            icono: "mdi-printer-check",
            href: "/PrReimpfact",
          },
          {
            text: "Generar Nota Credito",
            icono: "mdi-minus-box",
            href: "/Ncredito",
          },
          {
            text: "Reimpresión Ncredito",
            icono: "mdi-printer-check",
            href: "/PrReimpNc",
          },
        ],
      },

      {
        text: "Documento Soporte",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN11800000",
        submenu2: [
          {
            text: "Documento Soporte",
            icono: "flip_to_front",
            href: "/Docsoporte",
            id: "FIN10100005",
          },
          {
            text: "Reimpresión Doc_Soporte",
            icono: "mdi-printer-check",
            href: "/PrReimpDocsp",
            id: "FIN10100006",
          },
          {
            text: "Importar Doc_Soporte",
            icono: "mdi-arrow-up-bold-outline",
            href: "/PrImpDocsp",
            id: "FIN10100009",
          },
        ],
      },
      {
        text: "Acuse",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN11800000",
        submenu2: [
          {
            text: "Acuse Facturación",
            icono: "mdi-biohazard",
            href: "/testtitan",
            id: "FIN10100010",
            // id: "FIN10101099",            
          },
        ],
      },
      {
        text: "Nómina",
        icono: "mdi-clipboard-text-play-outline",
        id: "FIN11800000",
        submenu2: [
          {
            text: "Liquidar Nómina",
            icono: "mdi-human-capacity-increase",
            href: "/PrGenera",
          },
          {
            text: "Eliminar Nómina",
            icono: "mdi-delete-forever-outline",
            href: "/PrEliminagth",
          },
          {
            text: "Clonar Nómina",
            icono: "mdi-sheep",
            href: "/Pr_Clonagth",
          },
          {
            text: "Importar Nómina",
            icono: "mdi-arrow-up-bold-outline",
            href: "/PrImportgth",
          },
          {
            text: "Envió Nómina Electrónica",
            icono: "mdi-account-convert",
            href: "/RpNomelect",
          },
        ],
      },

    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/soporte",
    submenu: [
    ]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/soporte",
    submenu: [
      {
        text: "Ruts",
        icono: "mdi-account-multiple-plus-outline",
        href: "/ruts",
        id: "MER31400001",
      },
      {
        text: "Productos",
        icono: "mdi-cart-plus",
        href: "/productos",
        id: "MER31400002",
      },
      {
        text: "Clasificaciones",
        icono: "mdi-animation-outline",
        href: "/clasifica",
        id: "MER31400003",
      },
      {
        text: "Colaboradores",
        icono: "mdi-human-handsup",
        href: "/Cfcolaborador",
      },
      {
        text: "Devengos",
        icono: "mdi-account-cash",
        href: "/Cfdevengos",
      },
      {
        text: "Deducciones",
        icono: "mdi-currency-usd-off",
        href: "/Cfdeduccion",
      },
      {
        text: "Cargos",
        icono: "mdi-bag-checked",
        href: "/Cfcargos",
      },
      {
        text: "Parámetros",
        icono: "mdi-tune-vertical",
        href: "/CfParamgth",
      },


    ]
  },
];
const testeo = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/testeo",
    submenu: [
      {
        text: " ",
        icono: "mdi-clipboard-text-play-outline",
        submenu2: [
        ],
      },
    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/testeo",
    submenu: [
      // {
      //   text: "Test",
      //   icono: "mdi-finance",
      //   href: "/tabtest",
      // },
      {
        text: "Test_2",
        icono: "mdi-finance",
        href: "/tab_test2",
      },

    ]
  },

];
const autocolabora = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/autocolabora",
    submenu: [
      {
        text: "Solicitudes",
        icono: "mdi-human-greeting-variant",
        href: "/pr_autocsolicitudes",

      },
      {
        text: "Novedades",
        icono: "mdi-clipboard-text-play-outline",
        href: "/pr_autonovedad",

      },

      // {
      //   text: "Solicitar Préstamos",
      //   icono: "mdi-clipboard-text-play-outline",
      //   href: "/tabtest",
      // },
      // {
      //   text: "Cargar Incapacidades",
      //   icono: "mdi-clipboard-text-play-outline",
      //   href: "/tabtest",
      // },

    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/autocolabora",
    submenu: [
      {
        text: "Cupones de Pago",
        icono: "mdi-card-account-details-outline",
        href: "/rp_autoccupon",
      },
      {
        text: "Ingresos y Retenciones",
        icono: "mdi-card-account-details-star-outline",
        href: "/rp_autoingrte",
      },
      {
        text: "Certificado Laboral",
        icono: "mdi-certificate-outline",
        href: "/rp_autocertlab",
      },
    ]
  },

];
const trmcias = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/trmcias",
    submenu: [
      {
        text: "Orden de Servicio",
        icono: "mdi-human-greeting-variant",
        href: "/pr_trmsolicitud",

      },
      {
        text: "Orden Cargue",
        icono: "mdi-fire-truck",
        href: "/pr_trmordencargue",
      },
      {
        text: "Orden Combustible",
        icono: "mdi-oil",
        href: "/pr_trmordencomb",
      },
      {
        text: "Remisión",
        icono: "mdi-dump-truck",
        href: "/pr_trmremision",

      },
      {
        text: "Comprobante Egreso",
        icono: "mdi-currency-usd",
        href: "/pr_trmegreso",
      },
      {
        text: "Recepción Documentos",
        icono: "mdi-checkbox-outline",
        href: "/pr_trrecepdocs",
      },

      {
        text: "Liquidación Clientes",
        icono: "mdi-shape-polygon-plus",
        href: "/pr_trliqcliente",
      },
      {
        text: "Liquidación Proveedor",
        icono: "mdi-account-cash-outline",
        href: "/pr_trliqproveedor",
      },

    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/trmcias",
    submenu: [
      {
        text: "Orden de Servicio",
        icono: "mdi-human-greeting-variant",
        href: "/rp_trOrdenes",
      },
      {
        text: "Recepción Documentos",
        icono: "mdi-checkbox-outline",
        href: "/rp_trrecepcion",
      },
      {
        text: "Proforma Clientes",
        icono: "mdi-printer-wireless",
        href: "/rp_trproforma",
      },
      {
        text: "Orden de Compra",
        icono: "mdi-printer-wireless",
        href: "/rp_trordencompra",
      },

    ]
  },
  {
    text: "Configuracion",
    icono: "mdi-cogs",
    ruta: "/menu/trmcias",
    id: "DSP30000000",
    submenu: [
      {
        text: "Ruts",
        icono: "mdi-account-check",
        href: "/ruts",
        id: "FIN30100001",
      },

      {
        text: "Productos",
        icono: "mdi-cart-arrow-up",
        href: "/cf_trmproductos",
        id: "DSP30000001",
      },
      {
        text: "Conductores",
        icono: "mdi-account-tie-hat-outline",
        href: "/cf_trmconductor",
        id: "DSP30000001",
      },
      {
        text: "Vehiculos",
        icono: "mdi-truck",
        href: "/cf_trmvehiculos",
        id: "DSP30000001",
      },
      {
        text: "Ubicaciones",
        icono: "mdi-map-marker-right-outline",
        href: "/cf_trmubicaciones",
        id: "DSP30000001",
      }



    ]
  }



];
const hseq = [
  {
    text: "Principal",
    icono: "mdi-home-outline",
    ruta: "/menubase",
  },
  {
    text: "Procesos",
    icono: "mdi-circle-edit-outline",
    ruta: "/menu/hseq",
    submenu: [
      {
        text: "Programas",
        icono: "mdi-clipboard-text-play-outline",
        id: "HSEQ16000000",
        submenu2: [
          {
            text: "EVS-Toma Peso y Tensión",
            icono: "mdi-clipboard-pulse-outline",
            href: "/prhseq_peso",
            id: "HSEQ16000001",
          }
        ]
      },

    ],
  },
  {
    text: "Reportes",
    icono: "mdi-cloud-print",
    ruta: "/menu/autocolabora",
    submenu: [
    ]
  },

];

import post from "./methods.js";
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import colors from "vuetify/lib/util/colors.js";
// import IMask from "imask"; // Comentado temporalmente hasta que se instale correctamente
const firebaseConfig = {
  apiKey: "AIzaSyBt3Uy8X41IVBw3_KJxYIwNaNadCmixswg",
  authDomain: "titan-dfac7.firebaseapp.com",
  databaseURL: "https://titan-dfac7.firebaseio.com",
  projectId: "titan-dfac7",
  storageBucket: "titan-dfac7.appspot.com",
  messagingSenderId: "960271134865",
  appId: "1:960271134865:web:5ea899b18b2884d62a8f30",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseObj = firebaseApp;
const db = getFirestore(firebaseApp);

function formatNumero(val) {
  // Versión temporal sin IMask
  if (!val) return "0";
  const num = parseFloat(val);
  return num.toLocaleString('es-ES', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

function formatNumerodec3(val) {
  // Versión temporal sin IMask
  if (!val) return "0";
  const num = parseFloat(val);
  return num.toLocaleString('es-ES', { 
    minimumFractionDigits: 3, 
    maximumFractionDigits: 3 
  });
}

var instance = {
  data: () => {
    return {
      nav_menu: {
        financiero,
        punto_venta,
        clinico,
        hclinica,
        ssalud,
        phorizontal,
        basico,
        gestion_th,
        colegio,
        molino,
        servdm,
        tablero,
        recaudos,
        actividad,
        asociados,
        externo,
        manual,
        contador,
        transporte,
        soporte,
        resmed,
        agendamed,
        trespecial,
        trmcias,
        hseq,
        dispensa,
        docselect,
        testeo,
        plazos,
        autocolabora,
      },
      fb: {
        $firebaseObj: firebaseObj,
        $db: db,
        $usuarios: collection(db, "usuarios"),
        $asambleas: collection(db, "asambleas"),
        $preguntas: collection(db, "preguntas"),
        $respuestas: collection(db, "respuestas"),
      },
      postData: post.postData,
      formatNumero
    };
  },
};

export { instance };

