import post from "@/methods"

let get_libroViaje = async ({ agencia, consecutivo }) => {
    let data = await post.postData({
        url: "/transporte/dlls/PrLviajes03VJ.dll",
        data: sessionStorage.Sesion + "|" + agencia + "|" + consecutivo.trim() + "|",
        method: "",
    });
    return data[0];
}

let contabilizar = async (info_viaje) => {
    console.log(info_viaje);
    let nrocontab = info_viaje.consec_libro;
    let cargue = info_viaje.nrocargue_lvia;
    let fechalibro = info_viaje.fecha_lvia
        ? info_viaje.fecha_lvia.replace(/\//g, "")
        : "";
    // let punto_taquilla = sessionStorage.llave_punto;
    // let punto = JSON.parse(atob(punto_taquilla));
    let agencia = info_viaje.agencia_lvia;
    let placa = info_viaje.placa_lvia.trim();
    let vlrbruto = info_viaje.vlrbruto_lvia.trim();
    let vlrseguro = info_viaje.vlrseguro_lvia.trim();
    let usuario = info_viaje.iderp_lvia.trim();
    let vlrefectivo = info_viaje.vlrefectivo_lvia.trim();
    let vlravances = info_viaje.vlravances_lvia.trim();
    let vlryates = info_viaje.vlryates_lvia.trim();
    let codconv = info_viaje.codconvenio_lvia;
    let vlrconv = info_viaje.vlrbrasilia_lvia.trim();
    let vlrredbus = info_viaje.vlrredbus_lvia.trim();
    let vlrtcred = info_viaje.vlrtcred_lvia.trim();
    let vlrtdeb = info_viaje.vlrtdeb_lvia.trim();
    let vlrreservas = info_viaje.vlrreservas_lvia.trim();
    let vlrotros = info_viaje.vlrotros_lvia.trim();
    //agencia
    let ctacaja = info_viaje.ctacaja_lvia;
    let ctaingreso = info_viaje.ctaingreso_lvia;
    let idprop = info_viaje.idpropietario_lvia;
    let porcfondo = info_viaje.porcfondo_lvia.trim();
    let porcfondor = info_viaje.porcfondor_lvia.trim();
    let porcempresa = info_viaje.porcempresa_lvia.trim();
    let lote = info_viaje.lote_lvia.trim();
    let ctavehiculo = info_viaje.ctavehiculo_lvia;
    let tipovehiculo = 2;
    let idagencia = info_viaje.agencia_lvia;
    let vlrpinbus = info_viaje.vlrpinbus_lvia.trim();
    let vlrgamarra = info_viaje.vlrgamarra_lvia.trim();
    let datos = {
        url: "taxmeta/app//TAX132T1.dll",
        setUrl: "https://server2ts.net/taxmeta/inc/index.php",
        data:
            nrocontab +
            "|" +
            cargue +
            "|" +
            fechalibro +
            "|" +
            agencia +
            "|" +
            placa +
            "|" +
            vlrbruto +
            "|" +
            vlrseguro +
            "|" +
            usuario +
            "|" +
            vlrefectivo +
            "|" +
            vlryates +
            "|" +
            codconv +
            "|" +
            vlrconv +
            "|" +
            vlrredbus +
            "|" +
            vlrtcred +
            "|" +
            vlrtdeb +
            "|" +
            vlrreservas +
            "|" +
            vlrotros +
            "|" +
            ctacaja +
            "|" +
            ctaingreso +
            "|" +
            idprop +
            "|" +
            porcfondo +
            "|" +
            porcfondor +
            "|" +
            porcempresa +
            "|" +
            lote +
            "|" +
            ctavehiculo +
            "|" +
            tipovehiculo +
            "|" +
            idagencia +
            "|" +
            vlrpinbus +
            "|" +
            0 +
            "|" +
            vlrgamarra +
            "|" +
            vlravances +
            "|",
        method: "",
    };

    return new Promise((res, rej) => {
        post.postData(datos)
            .then(res)
            .catch(rej)
    })
}

export { get_libroViaje, contabilizar }