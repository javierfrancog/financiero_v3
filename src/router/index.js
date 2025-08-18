import { createRouter, createWebHashHistory } from 'vue-router';

import Login from "@/views/Login.vue";

import Recuperar from "@/views/recuperarClave.vue";
import NotFound from "@/components/404.vue";

// Menu controlador
import menu from "@/components/menu_principal.vue";

// menu base
import MenuBase from "@/views/MenuBase.vue";

// Dispensación Medicamentos

import Prdispcompra from "@/components/dispensam/Prdispcompra.vue";
import Prdisphistprod from "@/components/dispensam/Prdisphistprod.vue";
import Prdisptraslado from "@/components/dispensam/Prdisptraslado.vue";
import Prdspsoltraslado from "@/components/dispensam/Prsoltraslado.vue";
import Prdsptrasexpress from "@/components/dispensam/Prtrasexpress.vue";

import Prdispproctraslado from "@/components/dispensam/Proctraslado.vue";
import Prdspprecargue from "@/components/dispensam/Prdspprecargue.vue";
import Prdspalistaped from "@/components/dispensam/Pralistaped.vue";
import Prdispvalcompra from "@/components/dispensam/Prvalcompra.vue";



import Prdispalista from "@/components/dispensam/Prdisalista.vue";
import Prdispinvfisico from "@/components/dispensam/Prdispinvfisico.vue";
import Prdspciclicos from "@/components/dispensam/Prciclicos.vue";
import PrdispCierreinv from "@/components/dispensam/PrCierreInv.vue";
import Prdispnovinvent from "@/components/dispensam/Prnovinvent.vue";
import Prdspreimpinvent from "@/components/dispensam/PrImpinv.vue";
import Prdispasignatur from "@/components/dispensam/Prasignatur.vue";
import Prdspdigiturno from "@/components/dispensam/Prdigiturno.vue";
import Prdispatiendetur from "@/components/dispensam/Pratiendetur.vue";
import Prdspentrptes from "@/components/dispensam/Prentrptes.vue";
import Prdispturnos from "@/components/dispensam/Prturnos.vue";
import Prdispconspaciente from "@/components/dispensam/Prconspaciente.vue";
import SsprCargueusu from "@/components/ssalud/PrCargueusu.vue";
import Prdspcierrecj from "@/components/dispensam/PrCierrerc.vue";
import Prdspdispmipres from "@/components/dispensam/PrDispmipres.vue";
import Prdispgenfacotros from "@/components/dispensam/PrFact01.vue";
import Prdispncredito from "@/components/dispensam/PrNcredito01.vue";
import Prdispncredito02 from "@/components/dispensam/PrNcredito02.vue";
import PrdispReimpfact from "@/components/dispensam/PrFact02.vue";
import Prdspdspeventos from "@/components/dispensam/Preventosdsp.vue";
import Prdspnovptes from "@/components/dispensam/Prdspnovptes.vue";
import Prdspbloqueos from "@/components/dispensam/PrBloqueos.vue";
import Prdsptraslfisico from "@/components/dispensam/PrTrasFisico.vue";
import Prdspcorrecinvf from "@/components/dispensam/PrCorrecinvF.vue";
import Prdispgenfact from "@/components/dispensam/PrFactDsp01.vue";
import Prdispradica from "@/components/clinico/ClprRadica.vue";
import PrdispRips from "@/components/dispensam/Prcarguerips.vue";
import PrdispGenRips from "@/components/dispensam/Prgenrips.vue";
import Prdspconsolida from "@/components/dispensam/Prdspconsolida.vue";
import Prdispeventfact from "@/components/dispensam/Prdspeventfact.vue";
import Prdisprotacion from "@/components/dispensam/Prrotacion.vue";
import Prdispordcompra from "@/components/dispensam/Prordcompra.vue";
import Prdsprpordcompra from "@/components/dispensam/PrRordcompra.vue";
// import Prdsprvalcompra from "@/components/dispensam/PrRordcompra.vue";








import Rpturnos from "@/components/dispensam/Rpturnos.vue";
import Rpdspsaldos from "@/components/dispensam/RpSaldos1.vue";
import Rpdspsaldofis from "@/components/dispensam/RpSaldofis.vue";
import Rpdispensa01 from "@/components/dispensam/Rpdispensa01.vue";
import Rpdispensa02 from "@/components/dispensam/Rpdispensa02.vue";
import Rpdispensa03 from "@/components/dispensam/Rpdispensa03.vue";
import Rppendientes01 from "@/components/dispensam/Rppendientes01.vue";
import Rpdspmasivas from "@/components/dispensam/RpMasivas.vue";
import RpdspKardex1 from "@/components/dispensam/RpKardex1.vue";
import RpdspKardexf from "@/components/dispensam/RpKardexf.vue";
import Rpdspconsumos from "@/components/dispensam/RpConsumos.vue";



import Cfmedicamentos from "@/components/dispensam/CfMedicamentos.vue";
import Cfagrpmoleculas from "@/components/dispensam/CfAgrpmolecula.vue";
import Cflaboratorios from "@/components/dispensam/CfLaboratorios.vue";
import Cfformafarm from "@/components/dispensam/Cfformafarm.vue";
import CfGrpFama from "@/components/dispensam/CfGrpFama.vue";
import Cfcontratos from "@/components/dispensam/CfContratos.vue";
import Cfcarguecontr from "@/components/dispensam/Cfcarguecttos.vue";
import Cfeps from "@/components/dispensam/Cfeps.vue";
import Cfexpediente from "@/components/dispensam/Cfexpediente.vue";
import Cfhomologa from "@/components/dispensam/Cfhomologa.vue";
import CfPacientes from "@/components/dispensam/Cfpacientes.vue";




import Cfsistemas from "@/components/dispensam/Cfsistemas.vue";
import Cffilaturnos from "@/components/dispensam/Cffilaturnos.vue";
import Cfsubfilaturnos from "@/components/dispensam/Cfsubfilaturnos.vue";
import Cfventanilla from "@/components/dispensam/CfVentanilla.vue";
import Cfmoleculas from "@/components/dispensam/CfMolecula.vue";
import Cfconcentrac from "@/components/dispensam/Cfconcentrac.vue";
import Cfunconcentrac from "@/components/dispensam/Cfunconcentrac.vue";
import Cfunidadrefer from "@/components/dispensam/Cfunidrefer.vue";
import Cfdescrcomerc from "@/components/dispensam/Cfdescrcomerc.vue";

import Cfprescomerc from "@/components/dispensam/Cfprescomerc.vue";
import CfNombrecomerc from "@/components/dispensam/CfNombcomerc.vue";
import Cfipsremite from "@/components/dispensam/Cfipsremite.vue";
import Cfmedremite from "@/components/dispensam/Cfmedremite.vue";
import Cfdspnovedadat from "@/components/dispensam/Cfdspnovedadat.vue";
import Cfdsppacientes from "@/components/clinico/Titcl301.vue";







// Comercio a Plazos
import PrplzFact01 from "@/components/plazos/PrFact01.vue";
import PrplzFact02 from "@/components/financiero/PrFact02.vue";
import Prplzrecaudo from "@/components/plazos/Prplzrecaudo.vue";
import Prplzreimp from "@/components/plazos/PrReimpCb.vue";

import Plzruts from "@/components/financiero/Conf_ruts.vue";
import Plzcontrato01 from "@/components/plazos/PrContr01.vue";
import Plzcontrato02 from "@/components/plazos/PrContr02.vue";
import Plzcartera01 from "@/components/plazos/RpCartera1.vue";

// Autogestion colaborador
import Prautocsolicitudes from "@/components/autocolabora/PrSolicitudes.vue";
import Prautonovedad from "@/components/autocolabora/Prautonovedad.vue";


import Rpautoccupon from "@/components/autocolabora/RpCPago.vue";
import Rpautoingrte from "@/components/autocolabora/RpCertidian.vue";
import Rpautocertlab from "@/components/autocolabora/RpCertlab.vue";

// PROPIEDAD HORIZONTAL
import Prvotacion from "@/components/phorizontal/Prvotacion.vue";

import Prphfact01 from "@/components/phorizontal/Prfact01.vue";
import Prphfact02 from "@/components/phorizontal/Prfact02.vue";
import Prphfact03 from "@/components/phorizontal/Prfact03.vue";
import Prphfact04 from "@/components/phorizontal/Prfact04.vue";

import Prphrecaudos01 from "@/components/phorizontal/Prphrecaudos01.vue";
import Prphrecaudos02 from "@/components/phorizontal/Prphrecaudos02.vue";
import Prphrecaudos03 from "@/components/phorizontal/Prphrecaudos03.vue";
import Prphrecaudos04 from "@/components/phorizontal/Prphrecaudos04.vue";
import Prphanticipado01 from "@/components/phorizontal/Prphanticipado01.vue";
import Prphpresupuesto from "@/components/phorizontal/Prphpresupuesto.vue";



import Prphnovedad01 from "@/components/phorizontal/Prphnovedad01.vue";

import Rpphfact01 from "@/components/phorizontal/Rpfact01.vue";
import Rpphfact02 from "@/components/phorizontal/Rpfact02.vue";

import Rpphcartera1 from "@/components/phorizontal/RpCartera1.vue";
import Rpphcartera2 from "@/components/phorizontal/RpCartera2.vue";
import Rpphcartera3 from "@/components/phorizontal/RpCartera3.vue";
import Rpphestadocta from "@/components/phorizontal/RpEstadocta.vue";
import Rpphpresup from "@/components/phorizontal/Rppresup.vue";




import Cfcopropiedad from "@/components/phorizontal/Cfcopropiedad.vue";
import Cfareasph from "@/components/phorizontal/Cfareasph.vue";
import Cftarifas from "@/components/phorizontal/Cftarifas.vue";
import Cfcargosph from "@/components/phorizontal/Cfcargos.vue";
import Cfvehiculosph from "@/components/phorizontal/CfVehiculos.vue";
import Cfnovedadesph from "@/components/phorizontal/CfNovedades.vue";
import Cfpresupph from "@/components/phorizontal/Cfpresupph.vue";
import Cfcextraph from "@/components/phorizontal/CfCuotaextra.vue";








import Cfasambleas from "@/components/phorizontal/Cfasambleas.vue";
import Cfpreguntas from "@/components/phorizontal/Cfpreguntas.vue";

// HSEQ
import Prhseqpeso from "@/components/hseq/Prhseqpeso.vue";

// TRMCIAS
import Cftrmproductos from "@/components/trmcias/Cfproductos.vue";
import Cftrmconductor from "@/components/trmcias/CfConductor.vue";
import Cftrmvehiculos from "@/components/trmcias/Cfvehiculos.vue";
import Cftrubicaciones from "@/components/trmcias/CfEmbarques.vue";
import Prtrmsolicitud from "@/components/trmcias/Prsolicitud.vue";
import Prtrmordencomb from "@/components/trmcias/Prordencomb.vue";
import Prtrmordencargue from "@/components/trmcias/Prordencargue.vue";

import Prtregreso from "@/components/trmcias/Prtregreso.vue";
import Prtrmremision from "@/components/trmcias/PrRemision.vue";
import Prtrrecepdocs from "@/components/trmcias/Prrecepdocs.vue";
import Prtrliqcliente from "@/components/trmcias/Prliqcliente.vue";
import Prtrliqproveedor from "@/components/trmcias/Prliqproveedor.vue";


import RptrOrdenes from "@/components/trmcias/RpOrdenes.vue";
import RptrRecepcion from "@/components/trmcias/RpRecepcion.vue";
import Rptrproforma from "@/components/trmcias/PrReimproforma.vue";
import Rptrordencompra from "@/components/trmcias/PrReimpocompra.vue";











// menu Actividad
import PrActiv01 from "@/components/actividad/PrActiv01.vue";
import CfActprocesos from "@/components/actividad/CfActprocesos.vue";
import CfActprocedim from "@/components/actividad/CfActprocedim.vue";
import CfActactividad from "@/components/actividad/CfActactividad.vue";
import CfActvincular from "@/components/actividad/CfActvincular.vue";

// menu Servicios Domiciliarios
//import Prsdmfact01 from "@/components/servdm/Prsdmfact01.vue";
import Prsdmfact02 from "@/components/servdm/Prsdmfact02.vue";
import Prsdmfact03 from "@/components/servdm/Prsdmfact03.vue";

import Prsdmrecaudos from "@/components/servdm/PrRecaudo01.vue";
import Prsdmrecfinancia from "@/components/servdm/PrRecFinancia.vue";
import Prsdmcontafact from "@/components/servdm/Prsdmcontafact.vue";
import Prsdmeliminafact from "@/components/servdm/Prsdmeliminafact.vue";
import Prsdmeliminalect from "@/components/servdm/Prsdmeliminalect.vue";

import Prsdmcierrerc from "@/components/servdm/PrCierrerc.vue";
import Prsdmcontarec from "@/components/servdm/Prsdmcontarec.vue";


import Prsdmlect00 from "@/components/servdm/Prsdmlect00.vue";
import Prsdmlect01 from "@/components/servdm/Prsdmlect01.vue";
import Prsdmfinancia from "@/components/servdm/PrFinancia.vue";
import Prsdmfinancia01 from "@/components/servdm/PrFinancia01.vue";
import Prsdmactfinanc from "@/components/servdm/PrActfinanc.vue";



import Rpsdmdetfactura from "@/components/servdm/Rpdetfact.vue";
import Rpsdmcartera1 from "@/components/servdm/RpCartera1.vue";
import Rpsdmcartera2 from "@/components/servdm/RpCartera2.vue";
import Rpsdmrecaudos from "@/components/servdm/Rpsdmrecaudos.vue";
import RpsdmRecdetallado from "@/components/servdm/RpRecdetallado.vue";
import Rpsdmfinancia from "@/components/servdm/Rpsdmfinancia.vue";
import Prsdmsuspens from "@/components/servdm/PrSuspension.vue";
import Prsdmcargfinanc from "@/components/servdm/Prcarguefinac.vue";



import Prsdmprintreconexion from "@/components/servdm/PrPrintreconex.vue";
import Prsdmreconexion from "@/components/servdm/PrReconexion.vue";

import RpsdmSui from "@/components/servdm/RpsdmSui.vue";

import Cfsdmusuarios from "@/components/servdm/Cfsdmusuarios.vue";
import Cfsdmruts from "@/components/servdm/Conf_ruts.vue";
import Cfsdmbarrios from "@/components/servdm/Cfsdmbarrios.vue";
import Cfsdmtarifas from "@/components/servdm/Cfsdmtarifas.vue";
import Cfsdmciclos from "@/components/servdm/Cfsdmciclos.vue";
import Cfsdmcargos from "@/components/servdm/Cfsdmcargos.vue";
import Cfsdmdesctos from "@/components/servdm/Cfsdmdesctos.vue";
import Cfsdmcorreg from "@/components/servdm/Cfsdmcorregim.vue";

import Cfsdmcarguecoord from "@/components/servdm/Cfcarguecoord.vue";

// menu Colegio
import PrCol01 from "@/components/colegio/PrCol01.vue";
import PrCol02 from "@/components/colegio/PrCol02.vue";
import PrCol03 from "@/components/colegio/PrCol03.vue";

import Conf_estud from "@/components/colegio/Cf_estud.vue";
import Conf_colruts from "@/components/colegio/Conf_ruts.vue";
import Conf_grados from "@/components/colegio/Conf_grados.vue";
import Conf_colcargos from "@/components/colegio/Conf_colcargos.vue";

// menu Molino
import PrEntradavh from "@/components/molino/PrEntradavh.vue";
import PrSalidavh from "@/components/molino/PrSalidavh.vue";
import PrLaboratorio from "@/components/molino/PrLaboratorio.vue";
import PrActbascula from "@/components/molino/PrActbascula.vue";

import PrPrecios from "@/components/molino/PrPrecios.vue";
import PrLiquidacion from "@/components/molino/PrLiquidacion.vue";
import PrpreLiquidacion from "@/components/molino/PrpreLiquidacion.vue";
import PrActliquida from "@/components/molino/PrActliquida.vue";
import PrReprobasc from "@/components/molino/PrReprobasc.vue";


import PrDespachos from "@/components/molino/PrRemision01.vue";
import PrSecamiento from "@/components/molino/PrSecamiento.vue";
import PrTrilla from "@/components/molino/PrTrilla.vue";
import PrEmpaque from "@/components/molino/PrEmpaq.vue";
import PrExtrusion from "@/components/molino/PrExtrusion.vue";
import PrTraslados from "@/components/molino/PrTraslados.vue";
import PrReimpproc from "@/components/molino/PrImpproc.vue";
import PrActualiza from "@/components/molino/PrActualiza.vue";

import Rp_Reimpesaje from "@/components/molino/RpReimpesaje.vue";
import Rp_Reimpliquida from "@/components/molino/RpReimpliquida.vue";
import Rp_Reimppreliquida from "@/components/molino/RpReimppreliquida.vue";
import Rp_Reimpremis from "@/components/molino/PrRemision02.vue";
import Rpmol_compras from "@/components/molino/Rpmolcompras.vue";




import Conf_molruts from "@/components/molino/Conf_ruts.vue";
import Conf_molconduc from "@/components/molino/Conf_conductor.vue";
import Conf_molvehic from "@/components/molino/Conf_vehiculo.vue";
import Conf_molvariedad from "@/components/molino/Conf_variedad.vue";
import Conf_prodind from "@/components/molino/Conf_prindust.vue";
import CfParammol from "@/components/molino/CfParammol.vue";

// menu Gestion Th
import PrGenera from "@/components/gth/PrGenera.vue";
import PrGenera2 from "@/components/gth/PrGenera2.vue";
import PrGenera3 from "@/components/gth/PrGenera3.vue";
import PrGenera4 from "@/components/gth/PrGenera4.vue";
import PrGenera5 from "@/components/gth/PrGenera5.vue";

import PrCierregth from "@/components/gth/PrCierregth.vue";
import PrEliminagth from "@/components/gth/PrEliminagth.vue";
import PrClonagth from "@/components/gth/PrClonagth.vue";
import Pr_pagonom from "@/components/gth/Prpagonom.vue";
import PrPilagth from "@/components/gth/PrPila.vue";
import PrImportgth from "@/components/gth/PrImportgth.vue";
import PrExportcontgth from "@/components/gth/PrExportcontgth.vue";
import PrGeneracc from "@/components/gth/PrGeneracc.vue";
import PrNovedades from "@/components/gth/PrNovedades.vue";
import Prvalnovedad from "@/components/gth/Prvalnovedad.vue";
import Prvalsolicitud from "@/components/gth/Prvalsolicitud.vue";


import PrDotacion from "@/components/gth/PrDotacion.vue";


import RpImpNom from "@/components/gth/RpImpNom.vue";
import RpCPago from "@/components/gth/RpCPago.vue";
import RpDetNom1 from "@/components/gth/RpDetalle1.vue";
import RpProvNom from "@/components/gth/RpProvNom.vue";

import RpImpCes from "@/components/gth/RpImpCes.vue";
import RpImpPrim from "@/components/gth/RpImpPrim.vue";
import RpImp_Liq from "@/components/gth/RpImpLiq.vue";
import RpImp_Vac from "@/components/gth/RpImpVac.vue";
import RpNomElect from "@/components/gth/RpElectr.vue";
import RpPila from "@/components/gth/RpPila.vue";
import RpDotaciones from "@/components/gth/RpDotaciones.vue";
import RpCertidian from "@/components/gth/RpCertidian.vue";
import RpimpNovgth from "@/components/gth/RpimpNovgth.vue";
import Rpcertlab from "@/components/gth/RpCertlab.vue";


import Cfcolaborador from "@/components/gth/CfColaborador.vue";
import Cfdevengos from "@/components/gth/CfDevengos.vue";
import Cfdeduccion from "@/components/gth/CfDeduccion.vue";
import Cfcargos from "@/components/gth/CfCargos.vue";
import CfParamgth from "@/components/gth/CfParamgth.vue";
import Cfrutsgth from "@/components/gth/Conf_ruts.vue";
import Cf_Eqbasegth from "@/components/gth/CfEqbase.vue";


// FINANCIERO
//    -Procesos
import Compcontab from "@/components/financiero/Compcontab.vue";
import PrReimpCb from "@/components/financiero/PrReimpCb.vue";
import PrCorrecCb from "@/components/financiero/PrCorrecCb.vue";
import Docsoporte from "@/components/financiero/PrDocsoporte01.vue";
import PrReimpDocsp from "@/components/financiero/PrReimpDocsp.vue";
import PrImpDocsp from "@/components/financiero/PrImportdsp.vue";
//import PrAcusefact from "@/components/financiero/PrAcusefact01.vue";
import PrAcusefact from "@/components/financiero/PrAcusefact.vue";

import PrAnulaCb from "@/components/financiero/PrAnulaCb.vue";
import PrCierreCb from "@/components/financiero/PrCierreCb.vue";
import PrBloqueoCb from "@/components/financiero/PrBloqueoCb.vue";
import PrConcBancos from "@/components/financiero/PrConcBancos.vue";
import PrCartera from "@/components/financiero/PrCartera.vue";
import PrClonarCb from "@/components/financiero/PrClonarCb.vue";
import PrImportcont from "@/components/financiero/PrImportcb.vue";
import Prtraslcont from "@/components/financiero/PrTraslcont.vue";
import PrActprov from "@/components/financiero/PrActProvv.vue";

// import PrActprov from "@/components/financiero/PrProveedor.vue";

import PrpptoCom from "@/components/financiero/PrPptoCom.vue";
import PrEliminacont from "@/components/financiero/PrEliminaCb.vue";

import Testtitan from "@/components/financiero/PrAcusefact01.vue";

import RpEstsitfin from "@/components/financiero/RpEstsitfin.vue";
import RpEstsitfin2 from "@/components/financiero/RpEstsitfin2N.vue";
import Rpesfperiodo from "@/components/financiero/RpEstsitfinper.vue";

import RpEstsitfin3 from "@/components/financiero/RpEstsitfin3.vue";
import RpEstsitfin4 from "@/components/financiero/RpEstSitFin4.vue";
import Rplbmayor from "@/components/financiero/RpLbmayor.vue";
import Rplbdiario from "@/components/financiero/RpLbdiario.vue";
import Rplbdiariodet from "@/components/financiero/RpLbdiariodet.vue";
import RpBalancecc from "@/components/financiero/RpBalancecc1.vue";

import RpEstcambios from "@/components/financiero/RpEstcambios.vue";
import RpEstresint from "@/components/financiero/RpEstresint.vue";
import RpAuxiliar1 from "@/components/financiero/RpAuxiliar1.vue";
import RpProveedores from "@/components/financiero/RpProveedor.vue";
import RpConcilia from "@/components/financiero/RpConcilia.vue";
import PrResumenCb from "@/components/financiero/PrResumenCb.vue";
import Rpvalrecaudo from "@/components/financiero/Rpvalrecaudo.vue";

import RpInfoDian from "@/components/financiero/RpInfodian.vue";
import RpInfoIcav from "@/components/financiero/RpInfoicav.vue";
import Rpicamun from "@/components/financiero/RpIcamun.vue";
import Rpformrtefte from "@/components/financiero/Rpformrtefte.vue";
import Rpformiva from "@/components/financiero/Rpformiva.vue";
import RpFormrenta from "@/components/financiero/RpFormrenta.vue";


import Rpformica from "@/components/financiero/Rpformica.vue";
import Rpformicanual from "@/components/financiero/Rpformicanual.vue";

import Rpcertrtefte from "@/components/financiero/RpCertretfte.vue";
import Rpcertrteica from "@/components/financiero/RpCertretica.vue";
import Rpcertrteiva from "@/components/financiero/RpCertretiva.vue";


import RpSsalud from "@/components/financiero/RpSsalud.vue";

//    -Configuracion
import Cuentasc from "@/components/financiero/Cuentasc.vue";
import Ccostos from "@/components/financiero/Ccostos.vue";
import Conceptosc from "@/components/financiero/Conceptosc.vue";
import Clasniif from "@/components/financiero/Clasniif.vue";
import Doccontab from "@/components/financiero/Doccontab.vue";
import Resdian from "@/components/financiero/Resdian.vue";
import Cfcajaspos from "@/components/financiero/CfCajaspos.vue";
import Cfhomolprod from "@/components/financiero/Cfhomolprod.vue";
import Agencias from "@/components/financiero/Agencias.vue";
import Cfmarcas from "@/components/financiero/Marcas.vue";

import ConfListas from "@/components/financiero/ConfListas.vue";
import CargueListas from "@/components/financiero/CargueListas.vue";
import Asesores from "@/components/financiero/Asesores.vue";
import Ubicaciones from "@/components/financiero/Ubicaciones.vue";
import TpOperInv from "@/components/financiero/TpOperInv.vue";
import CfActprod from "@/components/financiero/CfActprod.vue";

import CfPrgFact from "@/components/financiero/CfPrgFact.vue";
import Formrtefte from "@/components/financiero/CfFormRtefte.vue";
import Cfformiva from "@/components/financiero/CfFormiva.vue";
import Cfformrenta from "@/components/financiero/CfFormRenta.vue";
import Cfbasesdian from "@/components/financiero/Cfbasesdian.vue";
import Cftarica from "@/components/financiero/CfTarica.vue";
// import Cf_exoica from "@/components/financiero/Cfexoica.vue";

import Tit303 from "@/components/financiero/Tit303.vue";

import Usuarios from "@/components/financiero/CfUsuarios.vue";
import Empresa from "@/components/financiero/Empresa.vue";
import Cfsocios from "@/components/financiero/CfSocios.vue";
import Consecutivos from "@/components/financiero/Consecutivos.vue";

//menu ptoventa
import Conf_ruts from "@/components/financiero/Conf_ruts.vue";
import Clasifica from "@/components/financiero/Clasifica.vue";
import UnidadPr from "@/components/financiero/Cfunidadpr.vue";

import Productos from "@/components/financiero/Productos.vue";
import PrFact01 from "@/components/financiero/PrFact01.vue";
import PrFact02 from "@/components/financiero/PrFact02.vue";
import PrFact03 from "@/components/financiero/PrFact03.vue";
import PrFact04 from "@/components/financiero/PrFact04.vue";
import PrCotiza01 from "@/components/financiero/PrCotiza01.vue";
import PrCotiza02 from "@/components/financiero/PrCotiza02.vue";
import PrPedido01 from "@/components/financiero/PrPedido01.vue";
import PrPedido02 from "@/components/financiero/PrPedido02.vue";
import PrRemision01 from "@/components/financiero/PrRemision01.vue";
import PrRemision02 from "@/components/financiero/PrRemision02.vue";
import PrRemision03 from "@/components/financiero/PrRemision03.vue";
import PrRemision04 from "@/components/financiero/PrRemision04.vue";
import PrNcredito01 from "@/components/financiero/PrNcredito01.vue";
import PrNcredito02 from "@/components/financiero/PrNcredito02.vue";
import PrNdebito01 from "@/components/financiero/PrNdebito01.vue";
import PrNdebito02 from "@/components/financiero/PrNdebito02.vue";

import PrProforma01 from "@/components/financiero/Prproforma01.vue";
import PrReimpproforma from "@/components/financiero/PrReimproforma.vue";

import Prptocierre from "@/components/financiero/PrPtocierre.vue";
import Comprobpto from "@/components/financiero/Comprobpto.vue";

import Prdespacho01 from "@/components/financiero/Prdespacho.vue";
import Prdespacho03 from "@/components/financiero/Prdespacho3.vue";

import PrReginvent from "@/components/financiero/PrReginvent.vue";
import PrReimpinvent from "@/components/financiero/PrImpinv.vue";
import PrCorrecinv from "@/components/financiero/PrCorrecinv.vue";
import PrTrasinvent from "@/components/financiero/PrTrasinvent.vue";
import PrAnulainvent from "@/components/financiero/PrAnulaInv.vue";
import PrCierreinv from "@/components/financiero/PrCierreInv.vue";
import Prordencotiza from "@/components/financiero/PrOrdcotiza.vue";
import Preimpordcotiza from "@/components/financiero/PrReimpOrdcotiza.vue";
import Prordencompra from "@/components/financiero/PrOrdcompra.vue";
import Preimpordcomp from "@/components/financiero/PrReimpOrdcomp.vue";
import Prautordcomp from "@/components/financiero/PrautOrdcomp.vue";
import Prppyeq01 from "@/components/financiero/Prppyeq01.vue";
import PrCarguecart from "@/components/financiero/PrFact05.vue";
import PrImpfisicoinv from "@/components/financiero/PrImpfisicoinv.vue";





import Contafact from "@/components/financiero/PrComContfact.vue";
import ContaNcr from "@/components/financiero/PrComContNcr.vue";
import ContaRemr from "@/components/financiero/PrComContRemr.vue";
import Importfact from "@/components/financiero/PrImpfact.vue";
import Exportfact from "@/components/financiero/PrExpfact.vue";
import Ncredcufe from "@/components/financiero/PrNcredcufe.vue";
import Importinv from "@/components/financiero/PrImportInv.vue";
import PrDeprectos from "@/components/financiero/PrDeprectos.vue";

import Cierrecart from "@/components/financiero/PrCierrecart.vue";

import RpResVta from "@/components/financiero/RpResVta.vue";
import RpVtaprod from "@/components/financiero/RpVtaprod.vue";
import RpResVtacli from "@/components/financiero/RpResVtaCli.vue";
import RpResVtadet from "@/components/financiero/RpResVtaDet.vue";
import RpVtastar from "@/components/financiero/RpVtasTar.vue";
import RpVtasconsec from "@/components/financiero/RpVtasconsec.vue";


import RpPedrem from "@/components/financiero/RpPedrem.vue";

import Rpcomisvta from "@/components/financiero/RpComVta.vue";
import Rpcomisrec from "@/components/financiero/RpComRec.vue";

import RpProducto from "@/components/financiero/RpProducto.vue";
import RpMarca from "@/components/financiero/RpMarca.vue";
import RpSaldos1 from "@/components/financiero/RpSaldos1.vue";
import RpKardex1 from "@/components/financiero/RpKardex1.vue";
import RpVended1 from "@/components/financiero/RpVended1.vue";
import RpPpequipo from "@/components/financiero/RpPpequipo.vue";
import RpresComprob from "@/components/financiero/RpresComprob.vue";

import RpCartera1 from "@/components/financiero/RpCartera1.vue";
import RpProveedores2 from "@/components/financiero/RpProveedor.vue";

// transporte especial

import Trprextracto from "@/components/trespecial/Trprextracto.vue";
import Trimpextracto from "@/components/trespecial/Trimpextracto.vue";
import Rpsdopropiet from "@/components/trespecial/Rpsdopropiet.vue";

import TrCfvehiculo from "@/components/trespecial/Cfvehiculo.vue";
import TrCfconductor from "@/components/trespecial/CfConductor.vue";
import TrCfcontratos from "@/components/trespecial/Cfcontratos.vue";

// tablero
import tabfinanciero from "@/components/tablero/RpTabFinac.vue";
import tabcomercial from "@/components/tablero/RpComercial.vue";
import tabtest from "@/components/tablero/Test.vue";
import tabtest2 from "@/components/tablero/Test2.vue";

// testeo
//import Test_test2 from "@/components/testeo/Test2.vue";

// asociados
import PrSimulacred from "@/components/asociados/PrSimula.vue";
import PrAssolcred from "@/components/asociados/PrAssolcred.vue";
import PrAsestcred from "@/components/asociados/PrEstudio.vue";
import PrAprobcred from "@/components/asociados/PrAprCred.vue";
import PrEmisioncred from "@/components/asociados/PrEmisionCred.vue";
import PrCategorizar from "@/components/asociados/Prcategoriza.vue";
import PrAscarguecr from "@/components/asociados/Prcarguecr.vue";
import PrAsimpcred from "@/components/asociados/PrFinancia01.vue";
import Prcargueaporte from "@/components/asociados/Prcargueaporte.vue";

import Rpcartedad from "@/components/asociados/RpCartera1.vue";
import Rpsaldoaportes from "@/components/asociados/Rpsdoaportes.vue";
import Rpmovaportes from "@/components/asociados/Rpmovaportes.vue";
import Rpasoccreditos from "@/components/asociados/Rpasoccreditos.vue";


import cfasociados from "@/components/asociados/CfAsociados.vue";
import cfasocmodal from "@/components/asociados/CfAsocmodal.vue";
import Cfasoctipos from "@/components/asociados/ClcfTipos.vue";
import Cfasocparam from "@/components/asociados/Cfasocparam.vue";


// hclinica
import Pr_atpaciente from "@/components/hclinica/Pratpaciente.vue";
import Pr_notamedica from "@/components/hclinica/PrNotamedica.vue";
import Practhc from "@/components/hclinica/Practhc.vue";
import Hc_atpacientenf from "@/components/hclinica/Pratpacientenf.vue";
import Prpreconsulta from "@/components/hclinica/Preconsulta.vue";
import Cf_plantillahc from "@/components/hclinica/Cfplantillahc.vue";

import Prcirugcheck from "@/components/hclinica/Prcirugcheck.vue";
import Prpreanestesia from "@/components/hclinica/PrPreanestesia.vue";
import Pranestesia from "@/components/hclinica/PrAnestesia.vue";
import PrInformeqx from "@/components/hclinica/PrInformeqx.vue";
import Prcirhojagto from "@/components/hclinica/Prcirhojagto.vue";
import Prcirconteo from "@/components/hclinica/Prcirconteo.vue";







// soporte
import practivacion from "@/components/soporte/PrActivacion.vue";
import Preliminardsp from "@/components/soporte/PrEliminardsp.vue";
import Preliminaracuse from "@/components/soporte/PrEliminaracuse.vue";
import Preliminarfact from "@/components/soporte/PrEliminafact.vue";
import Preliminarnc from "@/components/soporte/PrEliminanc.vue";
import Preliminarhc from "@/components/soporte/PrEliminarhc.vue";

import Rpdocseletronicos from "@/components/soporte/Rpdocseletronicos.vue";



import Prmovernc from "@/components/soporte/Prmovernc.vue";
import Prfechafact from "@/components/soporte/Prfechafact.vue";
import Practtiquete from "@/components/soporte/PrActTiquete.vue";
import Practcierre from "@/components/soporte/PrActCierreCj.vue";
import Prcopydll from "@/components/soporte/Prcopydll.vue";


// Manuales
import man_prfin from "@/components/manual/ManprFin.vue";



// transporte
import PrTiquetes from "@/components/transporte/PrTiquetes.vue";
import PrCargues from "@/components/transporte/PrCargues.vue";
import PrComprob from "@/components/transporte/PrComprob.vue";
import PrComprobtr2 from "@/components/transporte/PrComprob2.vue";
import PrOrdsar from "@/components/transporte/PrOrdsar.vue";
import Prtrpreopera from "@/components/transporte/PreOpera.vue";



import PrTrCcaja from "@/components/transporte/PrTrCcaja.vue";
import Prtrconvenios from "@/components/transporte/PrConvenios.vue";

import RpLviajes from "@/components/transporte/RpLviajes.vue";
import Rptrlviajespr from "@/components/transporte/RpLviajespr.vue";
import Rptrrpcpr from "@/components/transporte/RpRpcpr.vue";
import RpResLviajes from "@/components/transporte/RpResLviajes.vue";
import Rptrproducido from "@/components/transporte/RpProducido.vue";
import Rptrresvtasdia from "@/components/transporte/Rpresvtasdia.vue";
import Rptrresvtasuser from "@/components/transporte/Rpresvtasuser.vue";
import Rphpasajero from "@/components/transporte/Rphpasajero.vue";
import Rpresvtastr from "@/components/transporte/Rpresvtastr.vue";
import Rpcomprobtr from "@/components/transporte/RpComprobtr.vue";
import Rptrtiquetes from "@/components/transporte/RpTiquetes.vue";
import Rptrordconvenio from "@/components/transporte/RpConvenios2.vue";
import Rpcierrestr from "@/components/transporte/Rpcierrestr.vue";
import Rptrvalidalv from "@/components/transporte/Rptrvalidalv.vue";
import Rptrreteica from "@/components/transporte/Rptrreteica.vue";
import Rptrcargues from "@/components/transporte/RpCargues.vue";
import Rptrdocselect from "@/components/transporte/Rpdocselect.vue";
import Rptrpapeleria from "@/components/transporte/Rppapeleria.vue";










import CfVehiculos from "@/components/transporte/Cfvehiculo.vue";
import Cfconductor from "@/components/transporte/CfConductor.vue";
import Cfconceptotr from "@/components/transporte/CfConcepto.vue";
import CfAgenciastr from "@/components/transporte/CfAgencias.vue";
import Cfdestinostr from "@/components/transporte/CfDestinos.vue";
import Cfembarquestr from "@/components/transporte/CfEmbarques.vue";


// Recaudos
import recaudo01 from "@/components/recaudos/PrRecaudo01.vue";
import prcierrerc from "@/components/recaudos/PrCierrerc.vue";
import prcierreptorc from "@/components/recaudos/PrCierreptorc.vue";
import prbloqueorc from "@/components/recaudos/PrBloqueorc.vue";
import prcarguerc from "@/components/recaudos/PrCarguerc.vue";
import prAsobanca from "@/components/recaudos/PrAsobanca.vue";
import prDAsobanca from "@/components/recaudos/PrDAsobanca.vue";
import prRAsobanca from "@/components/recaudos/PrRAsobanca.vue";

import RpRecxentidad from "@/components/recaudos/RpRecxentidad.vue";
import RpRecxentpto from "@/components/recaudos/RpRecxentpto.vue";
import RpRecxagencia from "@/components/recaudos/RpRecxagencia.vue";
import RpRecxagcent from "@/components/recaudos/RpRecxagcent.vue";
import RpRecxcajero from "@/components/recaudos/RpRecxcajero.vue";
import RpRecdetallado from "@/components/recaudos/RpRecdetallado.vue";
import Rpcierresrc from "@/components/recaudos/RpCierrerrc.vue";
import Rpcierreptorc from "@/components/recaudos/RpCierreptorc.vue";
import Rpgasptorc from "@/components/recaudos/RpGasptorc.vue";
import Rpgasfactrc from "@/components/recaudos/RpGasFactura.vue";
import Rpeaavfactrc from "@/components/recaudos/RpEaavFactura.vue";
import Rpeaavfactdet from "@/components/recaudos/RpEaavFactdet.vue";

import Rpbioagfactrc from "@/components/recaudos/RpBioagfactrc.vue";
import Rpcdaoriente from "@/components/recaudos/Rpcdaoriente.vue";
import Rpsegestud from "@/components/recaudos/Rpsegestud.vue";

import RpEmsa1 from "@/components/recaudos/RpEmsa1.vue";
import RpEmsa2 from "@/components/recaudos/RpEmsa2.vue";
import RpEmsa3 from "@/components/recaudos/RpEmsa3.vue";
import RpEmsasub from "@/components/recaudos/RpEmsasub.vue";
import RpDuplicados from "@/components/recaudos/RpDuplicados.vue";

import cfconveniorc from "@/components/recaudos/CfConveniorc.vue";
import Cfagenciarec from "@/components/recaudos/CfAgenciarec.vue";
import Cfrecruts from "@/components/financiero/Conf_ruts.vue";
import CfrecUsuarios from "@/components/financiero/CfUsuarios.vue";
import Cfperfil from "@/components/financiero/CfPerfil.vue";


//Resultados
import Reshispaciente from "@/components/wspacientes/Rphcpaciente.vue";
// import Resatpacientenf from "@/components/wspacientes/Pratpacientenf.vue";
import ResResultados from "@/components/wspacientes/PrResultados.vue";

//Agenda medica
import Solagenda from "@/components/wspacientes/PrSolAgenda.vue";


// basico
import Clientes from "@/components/basico/Tit101.vue";
import Admin from "@/components/basico/Tit301.vue";
import Vendedores from "@/components/basico/Tit303.vue";
import CfconcDian from "@/components/basico/CfConcDian.vue";
import CfOpciones from "@/components/basico/CfOpciones.vue";
import Cf_hcSeccion from "@/components/basico/CfHcseccion.vue";

// clinico
//import Titcl101 from "@/components/clinico/Titcl101.vue";

import Titcl101 from "@/components/ssalud/PrServicios.vue";

import Clfurips from "@/components/clinico/ClPrfurips.vue";
import Clnotaenferm from "@/components/clinico/PrNotaenf.vue";


import Turnos from "@/components/clinico/turnos.vue";
import Agenda_dia from "@/components/clinico/Titcl102.vue";
import Titcl102 from "@/components/ssalud/PrAgendas.vue";

//import Titcl103 from "@/components/clinico/Titcl103.vue";

import Titcl103 from "@/components/ssalud/PrCarguefact.vue";


import Titcl104 from "@/components/clinico/Titcl104.vue";
import Titcl104G from "@/components/clinico/Titcl104G.vue";
import Titcl105 from "@/components/clinico/Titcl105.vue";
import Turnoscl from "@/components/clinico/Prturnos.vue";

import ClprCargueusu from "@/components/clinico/PrCargueusu.vue";
import Clreactauto from "@/components/clinico/Preactauto.vue";
import ClImportfact from "@/components/clinico/PrImpfact.vue";
import Ssactautoriza from "@/components/ssalud/PrActAuto.vue";
import Ssnotificahc from "@/components/ssalud/PrNotificaHc.vue";
import Sshabilitapr from "@/components/clinico/PrHabPrest.vue";
import Sscontcopago from "@/components/clinico/Contcopago.vue";
import Ssbloqfechahc from "@/components/clinico/PrBloqueohc.vue";


import ClprAnulaf from "@/components/clinico/ClprAnulaf.vue";
import ClprRadicaf from "@/components/clinico/ClprRadica.vue";
import ClprCierreCart from "@/components/clinico/PrCierreCart.vue";

import Contfactcl from "@/components/clinico/ClPrContfact.vue";
import Factptes from "@/components/clinico/ClPrFactptes.vue";

import PrClRefacturar from "@/components/clinico/ClRefactura.vue";
import PrclNcredito from "@/components/clinico/ClprNcredito01.vue";
import PrclNcredito02 from "@/components/clinico/PrNcredito02.vue";
import PrclNcredito03 from "@/components/clinico/PrNcredito03.vue";

import Prclndebito from "@/components/clinico/ClprNdebito01.vue";
import PrclNdebito02 from "@/components/clinico/ClPrNdebito02.vue";
import PrContaNdb from "@/components/clinico/ClPrNdebito03.vue";

import Titcl102_02 from "@/components/clinico/Titcl102_02.vue";

import PrHabagend from "@/components/clinico/PrHabagend.vue";
import ClRpServ0101 from "@/components/clinico/ClRpServ0101.vue";
import ClRphispaciente from "@/components/clinico/ClRphispaciente.vue";
import ClRpagpaciente from "@/components/clinico/ClRpagpaciente.vue";
import ClRpReimprserv from "@/components/clinico/ClRpReimprserv.vue";

import ClRpAgen0101 from "@/components/clinico/ClRpAgen0101.vue";
import ClRpFact0101 from "@/components/clinico/ClRpFact0101.vue";
import ClRpFactdet from "@/components/clinico/ClRpFactdet.vue";
import ClRpresFact from "@/components/clinico/ClRpresFact.vue";

import ClRpServdet from "@/components/clinico/ClRpServdet.vue";

import ClRpfactcups from "@/components/clinico/ClRpFactcups.vue";
import ClRpnvaeps from "@/components/clinico/ClRpnvaeps.vue";
import ClRpfactrad from "@/components/clinico/ClRpRadicado.vue";
import ClRpFurips from "@/components/clinico/ClRpFurips.vue";
import ClRpDetFurips from "@/components/clinico/ClRpDetFurips.vue";

import ClRp1552 from "@/components/clinico/ClRp1552.vue";
import ClRp256 from "@/components/clinico/ClRp256.vue";
import ClRpcir030 from "@/components/clinico/ClRpcir030.vue";
import Rpcajacopi1 from "@/components/clinico/Rpcajacopi1.vue";

import ClRpmamografias from "@/components/clinico/ClRpmamografias.vue";
import ClRpbiopsias from "@/components/clinico/ClRpbiopsias.vue";
import Clrpprodag from "@/components/clinico/Clrpprodag.vue";

import ClprReimpfact from "@/components/clinico/ClprReimpfact.vue";
import ClRpRecaudo from "@/components/clinico/ClRpRecaudo.vue";
import ClRpCartera from "@/components/clinico/ClRpCartera.vue";

import Titcl301 from "@/components/clinico/Titcl301.vue";

import Titcl302 from "@/components/clinico/Titcl302.vue";
//import ClCfcontratos from "@/components/clinico/ClCfContratos.vue";
import ClCfcontratos from "@/components/ssalud/CfContratos.vue";

import ClCfSalas from "@/components/clinico/ClCfSalas.vue";
import ClCfconsult from "@/components/clinico/Clcfconsult.vue";
import ClCfServProc from "@/components/ssalud/ClCfServProc.vue";
import Titcl306 from "@/components/clinico/Titcl306.vue";
import Clcarguecttos from "@/components/clinico/Clcarguecttos.vue";
import ClCategoria from "@/components/clinico/ClCategoria.vue";
import ClSubcategoria from "@/components/clinico/ClSubcategoria.vue";
import CfClventanilla from "@/components/clinico/CfVentanilla.vue";

// ssalud
import PrssServicios from "@/components/ssalud/PrServicios.vue";
// import Clfurips from "@/components/ssalud/ClPrfurips.vue";
// import Turnos from "@/components/ssalud/turnos.vue";
import Prssagendas from "@/components/ssalud/PrAgendas.vue";
import Prlistaespera from "@/components/ssalud/PrListaespera.vue";
import PrtraslAgenda from "@/components/ssalud/PrtraslAgenda.vue";
import Prcancagenda from "@/components/ssalud/Prcancagenda.vue";



// import Titcl103 from "@/components/ssalud/Titcl103.vue";
// import Titcl104 from "@/components/ssalud/Titcl104.vue";
// import Titcl104G from "@/components/ssalud/Titcl104G.vue";
// import Titcl105 from "@/components/ssalud/Titcl105.vue";
// import ClprCargueusu from "@/components/ssalud/PrCargueusu.vue";

// import ClprAnulaf from "@/components/ssalud/ClprAnulaf.vue";
// import ClprRadicaf from "@/components/ssalud/ClprRadica.vue";
// import ClprCierreCart from "@/components/ssalud/PrCierreCart.vue";

// import Contfactcl from "@/components/ssalud/ClPrContfact.vue";
import SsFactptes from "@/components/ssalud/PrFactptes.vue";

// import PrClRefacturar from "@/components/ssalud/ClRefactura.vue";
// import PrclNcredito from "@/components/ssalud/ClprNcredito01.vue";
// import PrclNcredito02 from "@/components/ssalud/PrNcredito02.vue";
// import PrclNcredito03 from "@/components/ssalud/PrNcredito03.vue";

import Prssbloqagenda from "@/components/ssalud/PrBloqagend.vue";
import PrSsHabagend from "@/components/ssalud/PrHabagend.vue";
import SsPrCarguefact from "@/components/ssalud/PrCarguefact.vue";
import SsEgresosproc from "@/components/ssalud/PrEgreso.vue";
import SsImpcomprob from "@/components/ssalud/PrImpcomprob.vue";

// import ClRpServ0101 from "@/components/ssalud/ClRpServ0101.vue";
import SsRphispaciente from "@/components/ssalud/ClRphispaciente.vue";
// import ClRpagpaciente from "@/components/ssalud/ClRpagpaciente.vue";
// import ClRpReimprserv from "@/components/ssalud/ClRpReimprserv.vue";

import SsRpAgen0101 from "@/components/ssalud/RpAgen0101.vue";
import SsRpAgen0102 from "@/components/ssalud/RpAgendadet.vue";
import Ssagendinasist from "@/components/ssalud/RpAgendainas.vue";
import ssrplistaespera from "@/components/ssalud/RpListaespera.vue";

import Rphcpaciente from "@/components/ssalud/Rphcpaciente.vue";
import Rpbusqhc from "@/components/ssalud/Rpbusqhc.vue";

import RpSServdet from "@/components/ssalud/RpServdet.vue";
import RpSSReimpfact from "@/components/ssalud/RpReimpfact.vue";
import TurnosSs from "@/components/clinico/Prturnos.vue";
import prcarguerx from "@/components/clinico/ClPrcarguerx.vue";



// import ClRpFact0101 from "@/components/ssalud/ClRpFact0101.vue";
// import ClRpFactdet from "@/components/ssalud/ClRpFactdet.vue";

// import ClRpfactcups from "@/components/ssalud/ClRpFactcups.vue";
// import ClRpnvaeps from "@/components/ssalud/ClRpnvaeps.vue";
// import ClRpfactrad from "@/components/ssalud/ClRpRadicado.vue";
// import ClRpFurips from "@/components/ssalud/ClRpFurips.vue";

// import ClRp1552 from "@/components/ssalud/ClRp1552.vue";
// import ClRp256 from "@/components/ssalud/ClRp256.vue";
// import ClRpcir030 from "@/components/ssalud/ClRpcir030.vue";
// import ClRpmamografias from "@/components/ssalud/ClRpmamografias.vue";
// import ClRpbiopsias from "@/components/ssalud/ClRpbiopsias.vue";
// import Clrpprodag from "@/components/ssalud/Clrpprodag.vue";

// import ClprReimpfact from "@/components/ssalud/ClprReimpfact.vue";

// import Titcl301 from "@/components/ssalud/Titcl301.vue";

// import Titcl302 from "@/components/ssalud/Titcl302.vue";
import Sscfcontratos from "@/components/ssalud/CfContratos.vue";
// import ClCfSalas from "@/components/ssalud/ClCfSalas.vue";
// import ClCfconsult from "@/components/ssalud/Clcfconsult.vue";
import SsPerasist from "@/components/ssalud/CfAsistencial.vue";
import Sscarguecttos from "@/components/ssalud/Cfcarguecttos.vue";
import SsCfespecialidad from "@/components/ssalud/Cfespecialidad.vue";
import SsCfconceptos from "@/components/ssalud/CfConceptos.vue";
import SsCfordenh from "@/components/ssalud/Cfordenh.vue";



import SsClRpRecaudo from "@/components/ssalud/ClRpRecaudo.vue";
import Ss_RpCartera from "@/components/ssalud/ClRpCartera.vue";
import Ss_Rprepclinico1 from "@/components/ssalud/Rprepclinico1.vue";
import Ss_Rprepclinico2 from "@/components/ssalud/Rprepclinico2.vue";

import Ssrepprevaldx from "@/components/ssalud/Rprepprevaldx.vue";

import Ss_actualizafact from "@/components/ssalud/Ssactfact.vue";
import SsfactAuto from "@/components/ssalud/PrFactAuto.vue";



import SsClCfServProc from "@/components/ssalud/ClCfServProc.vue";
import CfClmedicamentos from "@/components/ssalud/CfMedicamentos.vue";



// import ClCategoria from "@/components/ssalud/ClCategoria.vue";
// import ClSubcategoria from "@/components/ssalud/ClSubcategoria.vue";



// import Agendamiento from "@/components/Agendamiento.vue";


const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
  ,
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/ingreso_v2",
    name: "ingreso_v2",
    component: () => import("@/views/Ingreso_v2.vue"),
  },
  {
    path: "/loginrc",
    name: "loginrc",
    component: () => import("@/views/Loginrc.vue"),
  },

  {
    path: "/logintr",
    name: "logintr",
    component: () => import("@/views/Logintr.vue"),
  },
  {
    path: "/Regpasajero",
    name: "Regpasajero",
    component: () => import("@/views/Regpasajero.vue"),
  },

  {
    path: "/loginasoc",
    name: "loginasoc",
    component: () => import("@/views/Loginasoc.vue"),
  },
  {
    path: "/ventastr",
    name: "ventastr",
    component: () => import("@/views/Ventastr.vue"),
  },
  {
    path: "/loginpr",
    name: "loginpr",
    component: () => import("@/views/Loginpr.vue"),
  },
  {
    path: "/loginresmed_8793",
    name: "loginresmed_8793",
    component: () => import("@/views/Resmed_8793.vue"),
  },
  {
    path: "/agendamed_8793",
    name: "agendamed_8793",
    component: () => import("@/views/Agenda_8793.vue"),
  },
  {
    path: "/loginresmed_9286",
    name: "loginresmed_9286",
    component: () => import("@/views/Resmed_9286.vue"),
  },

  {
    path: "/recuperar",
    name: "recuperar",
    component: Recuperar,
  },

  {
    path: "/turnos/:empresa?",
    name: "turnos",
    component: Turnos,
  },

  {
    path: "/votaciones/:token?",
    name: "votaciones",
    component: () => import("@/components/phorizontal/votaciones.vue"),
  },

  {
    path: "/menu/:modulo",
    name: "menu",
    component: menu,
    redirect: '/menu/:modulo/base',
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/menu/basico",
    name: "basico",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      //Procesos
      {
        path: "clientes",
        component: Clientes,
        meta: {
          requiresAuth: true,
        },
      },

      //Configuracion
      {
        path: "admin",
        component: Admin,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "vendedores",
        component: Vendedores,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfconcDian",
        component: CfconcDian,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfOpciones",
        component: CfOpciones,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfhcSeccion",
        component: Cf_hcSeccion,
        meta: {
          requiresAuth: true,
        },
      },

    ],
  },

  {
    path: "/menu/contador",
    name: "contador",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [],
  },

  {
    path: "/menu/soporte3",
    name: "soporte3",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Compcontab",
        component: Compcontab,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  //pruebas
  {
    path: "/menu/testeo",
    name: "testeo",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Compcontab",
        component: Compcontab,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  //documentos electronicos
  {
    path: "/menu/docselect",
    name: "docselect",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  //dispensacion medicamentos
  {
    path: "/menu/dispensa",
    name: "dispensa",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      // {
      //   path: "pr_dispensar",
      //   component: Prdispensar,
      //   meta: {
      //     requiresAuth: true,
      //   },
      // },

      {
        path: "prdisp_compra",
        component: Prdispcompra,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_histprod",
        component: Prdisphistprod,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prdisp_alista",
        component: Prdispalista,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prdisp_traslado",
        component: Prdisptraslado,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prdsp_soltraslado",
        component: Prdspsoltraslado,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdsp_trasexpress",
        component: Prdsptrasexpress,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prdisp_proctraslado",
        component: Prdispproctraslado,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_precargue",
        component: Prdspprecargue,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdsp_alistaped",
        component: Prdspalistaped,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_Cierreinv",
        component: PrdispCierreinv,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prdisp_invfisico",
        component: Prdispinvfisico,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdsp_ciclicos",
        component: Prdspciclicos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_novinvent",
        component: Prdispnovinvent,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdsp_reimpinvent",
        component: Prdspreimpinvent,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_valcompra",
        component: Prdispvalcompra,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prdisp_asignatur",
        component: Prdispasignatur,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_digituno",
        component: Prdspdigiturno,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_eventfact",
        component: Prdispeventfact,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prdisp_rotacion",
        component: Prdisprotacion,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_ordcompra",
        component: Prdispordcompra,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdsp_rpordcompra",
        component: Prdsprpordcompra,
        meta: {
          requiresAuth: true,
        },
      },


      {
        path: "prdisp_atiendetur",
        component: Prdispatiendetur,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdsp_entrptes",
        component: Prdspentrptes,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prdisp_pantallatur",
        component: Prdispturnos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_conspaciente",
        component: Prdispconspaciente,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdsp_cierrecj",
        component: Prdspcierrecj,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_carguepac",
        component: SsprCargueusu,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Prdsp_bloqueos",
        component: Prdspbloqueos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdsp_consolida",
        component: Prdspconsolida,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prdsp_traslfisico",
        component: Prdsptraslfisico,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdsp_correcinvf",
        component: Prdspcorrecinvf,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_genfact",
        component: Prdispgenfact,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_radica",
        component: Prdispradica,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_rips",
        component: PrdispRips,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_genrips",
        component: PrdispGenRips,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "rp-dspKardexf",
        component: RpdspKardexf,
        meta: {
          requiresAuth: true,
        },
      },




      {
        path: "prdsp_dispmipres",
        component: Prdspdispmipres,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdsp_dspeventos",
        component: Prdspdspeventos,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prdsp_novptes",
        component: Prdspnovptes,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Prdisp_genfacotros",
        component: Prdispgenfacotros,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdisp_Reimpfact",
        component: PrdispReimpfact,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Prdisp_ncredito",
        component: Prdispncredito,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Prdisp_ncredito02",
        component: Prdispncredito02,
        meta: {
          requiresAuth: true,
        },
      },




      {
        path: "rp_turnos",
        component: Rpturnos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_dspsaldos",
        component: Rpdspsaldos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_dspsaldofis",
        component: Rpdspsaldofis,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp_dispensa01",
        component: Rpdispensa01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_dispensa02",
        component: Rpdispensa02,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp_dispensa03",
        component: Rpdispensa03,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp_pendientes01",
        component: Rppendientes01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rpdsp_masivas",
        component: Rpdspmasivas,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-dspKardex1",
        component: RpdspKardex1,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_dspconsumos",
        component: Rpdspconsumos,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cf_medicamentos",
        component: Cfmedicamentos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_agrpmoleculas",
        component: Cfagrpmoleculas,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cf_molecula",
        component: Cfmoleculas,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_concentrac",
        component: Cfconcentrac,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_undconcentrac",
        component: Cfunconcentrac,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_unidadrefer",
        component: Cfunidadrefer,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_descrcomerc",
        component: Cfdescrcomerc,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cf_prescomerc",
        component: Cfprescomerc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_nombrecomerc",
        component: CfNombrecomerc,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "cf_laboratorios",
        component: Cflaboratorios,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_formafarm",
        component: Cfformafarm,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_GrpFama",
        component: CfGrpFama,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_contratos",
        component: Cfcontratos,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cf_carguecontr",
        component: Cfcarguecontr,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "cf_sistemas",
        component: Cfsistemas,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_filaturnos",
        component: Cffilaturnos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_subfilaturnos",
        component: Cfsubfilaturnos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_ventanilla",
        component: Cfventanilla,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_ipsremite",
        component: Cfipsremite,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_medremite",
        component: Cfmedremite,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_dspnovedadat",
        component: Cfdspnovedadat,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_dsppacientes",
        component: Cfdsppacientes,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_eps",
        component: Cfeps,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ss_cfespecialidad",
        component: SsCfespecialidad,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cf_expediente",
        component: Cfexpediente,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_homologa",
        component: Cfhomologa,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_pacientes",
        component: CfPacientes,
        meta: {
          requiresAuth: true,
        },
      },

    ],
  },


  //autocolabora
  {
    path: "/menu/autocolabora",
    name: "autocolabora",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_autocsolicitudes",
        component: Prautocsolicitudes,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_autonovedad",
        component: Prautonovedad,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp_autoccupon",
        component: Rpautoccupon,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_autoingrte",
        component: Rpautoingrte,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_autocertlab",
        component: Rpautocertlab,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  //manual
  {
    path: "/menu/manual",
    name: "manual",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "manprfin",
        component: man_prfin,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  //plazos
  {
    path: "/menu/plazos",
    name: "plazos",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_plzFact01",
        component: PrplzFact01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_plzFact02",
        component: PrplzFact02,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_plzRecaudo",
        component: Prplzrecaudo,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_plzreimp",
        component: Prplzreimp,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_plzcontrato01",
        component: Plzcontrato01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_plzcontrato02",
        component: Plzcontrato02,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_plzcartera01",
        component: Plzcartera01,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "plz_ruts",
        component: Plzruts,
        meta: {
          requiresAuth: true,
        },
      },

    ],
  },
  //transporte intermunicipal
  {
    path: "/menu/transporte",
    name: "transporte",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_trtiquetes",
        component: PrTiquetes,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_trcargues",
        component: PrCargues,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_trcomprob",
        component: PrComprob,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_trcomprob2",
        component: PrComprobtr2,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_ordsar",
        component: PrOrdsar,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_trpreopera",
        component: Prtrpreopera,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp_trtiquetes",
        component: Rptrtiquetes,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trordconvenio",
        component: Rptrordconvenio,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trlviajes",
        component: RpLviajes,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trvalidalv",
        component: Rptrvalidalv,
        meta: {
          requiresAuth: true,
        },
      },


      {
        path: "pr_trconvenios",
        component: Prtrconvenios,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_trccaja",
        component: PrTrCcaja,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp_comprobtr",
        component: Rpcomprobtr,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_resvtastr",
        component: Rpresvtastr,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_cierrestr",
        component: Rpcierrestr,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trlviajespr",
        component: Rptrlviajespr,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp_trrpcpr",
        component: Rptrrpcpr,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trreslviajes",
        component: RpResLviajes,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trproducido",
        component: Rptrproducido,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trresvtasdia",
        component: Rptrresvtasdia,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trreteica",
        component: Rptrreteica,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trcargues",
        component: Rptrcargues,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trdocselect",
        component: Rptrdocselect,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trpapeleria",
        component: Rptrpapeleria,
        meta: {
          requiresAuth: true,
        },
      },


      {
        path: "rp_trresvtasuser",
        component: Rptrresvtasuser,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_hpasajero",
        component: Rphpasajero,
        meta: {
          requiresAuth: true,
        },
      },


      {
        path: "cf_vehiculos",
        component: CfVehiculos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cf_conductor",
        component: Cfconductor,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_conceptotr",
        component: Cfconceptotr,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_agenciastr",
        component: CfAgenciastr,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_destinostr",
        component: Cfdestinostr,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_embarquestr",
        component: Cfembarquestr,
        meta: {
          requiresAuth: true,
        },
      },

    ],
  },
  //financiero  
  {
    path: "/menu/financiero",
    name: "financiero",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      //procesos
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Compcontab",
        component: Compcontab,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrReimpCb",
        component: PrReimpCb,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Docsoporte",
        component: Docsoporte,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrReimpDocsp",
        component: PrReimpDocsp,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrImpDocsp",
        component: PrImpDocsp,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrAcusefact",
        component: PrAcusefact,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrCorrecCb",
        component: PrCorrecCb,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrAnulaCb",
        component: PrAnulaCb,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrCierreCb",
        component: PrCierreCb,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrBloqueoCb",
        component: PrBloqueoCb,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrCierreinv",
        component: PrCierreinv,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Pr_Deprectos",
        component: PrDeprectos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrCierregth",
        component: PrCierregth,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrConcBancos",
        component: PrConcBancos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrClonarCb",
        component: PrClonarCb,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrImportcont",
        component: PrImportcont,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrEliminacont",
        component: PrEliminacont,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrTraslcont",
        component: Prtraslcont,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Pr_Actprov",
        component: PrActprov,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrpptoCom",
        component: PrpptoCom,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "testtitan",
        component: Testtitan,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrCartera",
        component: PrCartera,
        meta: {
          requiresAuth: true,
        },
      },

      //reportes
      {
        path: "rp-estsitfin",
        component: RpEstsitfin,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-estsitfin2",
        component: RpEstsitfin2,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-lbmayor",
        component: Rplbmayor,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-lbdiario",
        component: Rplbdiario,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-lbdiariodet",
        component: Rplbdiariodet,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-esfperiodo",
        component: Rpesfperiodo,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-estsitfin3",
        component: RpEstsitfin3,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-estsitfin4",
        component: RpEstsitfin4,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-balancecc",
        component: RpBalancecc,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "rp-estresint",
        component: RpEstresint,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-estcambios",
        component: RpEstcambios,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-Auxiliar1",
        component: RpAuxiliar1,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-PrResumenCb",
        component: PrResumenCb,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-valrecaudo",
        component: Rpvalrecaudo,
        meta: {
          requiresAuth: true,
        },
      },


      {
        path: "rp-Proveedores",
        component: RpProveedores,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-Concilia",
        component: RpConcilia,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-infodian",
        component: RpInfoDian,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-infoicav",
        component: RpInfoIcav,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-icamun",
        component: Rpicamun,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-Formrtefte",
        component: Rpformrtefte,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-Formiva",
        component: Rpformiva,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-Formica",
        component: Rpformica,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-Formicanual",
        component: Rpformicanual,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-certrtefte",
        component: Rpcertrtefte,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-Formrenta",
        component: RpFormrenta,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-certrteica",
        component: Rpcertrteica,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-certrteiva",
        component: Rpcertrteiva,
        meta: {
          requiresAuth: true,
        },
      },


      {
        path: "rp-Ssalud",
        component: RpSsalud,
        meta: {
          requiresAuth: true,
        },
      },

      ///Procesos Facturacion
      {
        path: "facturacion",
        component: PrFact01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ruts",
        component: Conf_ruts,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Cuentasc",
        component: Cuentasc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Ccostos",
        component: Ccostos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Conceptosc",
        component: Conceptosc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Clasniif",
        component: Clasniif,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Doccontab",
        component: Doccontab,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Resdian",
        component: Resdian,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Clasifica",
        component: Clasifica,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Productos",
        component: Productos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_marcas",
        component: Cfmarcas,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_cajaspos",
        component: Cfcajaspos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_homolprod",
        component: Cfhomolprod,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Agencias",
        component: Agencias,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ConfListas",
        component: ConfListas,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CargueListas",
        component: CargueListas,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Asesores",
        component: Asesores,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Ubicaciones",
        component: Ubicaciones,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "TpOperInv",
        component: TpOperInv,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfActprod",
        component: CfActprod,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "CfPrgFact",
        component: CfPrgFact,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "formrtefte",
        component: Formrtefte,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfformiva",
        component: Cfformiva,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfformrenta",
        component: Cfformrenta,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cftarica",
        component: Cftarica,
        meta: {
          requiresAuth: true,
        },
      },
      // {
      //   path: "cftexoica",
      //   component: Cf_exoica,
      //   meta: {
      //     requiresAuth: true,
      //   },
      // },

      {
        path: "Usuarios",
        component: Usuarios,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Empresa",
        component: Empresa,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfsocios",
        component: Cfsocios,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Consecutivos",
        component: Consecutivos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfPerfil",
        component: Cfperfil,
        meta: {
          requiresAuth: true,
        },
      },


      {
        path: "vendedores",
        component: Tit303,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-cartera1",
        component: RpCartera1,
        meta: {
          requiresAuth: true,
        },
      },
      // {
      //   path: "*",
      //   component: NotFound,
      // },
    ],
  },
  //p-horizontal
  {
    path: "/menu/phorizontal",
    name: "phorizontal",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_phfact01",
        component: Prphfact01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_phfact02",
        component: Prphfact02,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_phfact03",
        component: Prphfact03,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_phfact04",
        component: Prphfact04,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_phnovedad01",
        component: Prphnovedad01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_phrecaudos01",
        component: Prphrecaudos01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_phrecaudos02",
        component: Prphrecaudos02,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_phrecaudos03",
        component: Prphrecaudos03,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_phrecaudos04",
        component: Prphrecaudos04,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_phanticipado01",
        component: Prphanticipado01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_phpresupuesto",
        component: Prphpresupuesto,
        meta: {
          requiresAuth: true,
        },
      },







      {
        path: "rp_phfact01",
        component: Rpphfact01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_phfact02",
        component: Rpphfact02,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-phcartera1",
        component: Rpphcartera1,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-phcartera2",
        component: Rpphcartera2,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-phcartera3",
        component: Rpphcartera3,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_phestadocta",
        component: Rpphestadocta,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-phpresup",
        component: Rpphpresup,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "Prvotacion",
        component: Prvotacion,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_copropiedad",
        component: Cfcopropiedad,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_areasph",
        component: Cfareasph,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_tarifas",
        component: Cftarifas,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_cargosph",
        component: Cfcargosph,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_vehiculosph",
        component: Cfvehiculosph,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cf_novedadesph",
        component: Cfnovedadesph,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cf_presupph",
        component: Cfpresupph,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_cextraph",
        component: Cfcextraph,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Cfasambleas",
        component: Cfasambleas,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cfpreguntas",
        component: Cfpreguntas,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cfparticipantes",
        component: () => import("@/components/phorizontal/Cfparticipantes.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Rpresultados",
        component: () => import("@/components/phorizontal/Rpresultados.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Rpcorreos",
        component: () => import("@/components/phorizontal/Rpcorreos.vue"),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  //actividades
  {
    path: "/menu/actividad",
    name: "actividades",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "PrActiv01",
        component: PrActiv01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfActprocesos",
        component: CfActprocesos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfActprocedim",
        component: CfActprocedim,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "CfActactividad",
        component: CfActactividad,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfActvincular",
        component: CfActvincular,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  //colegios
  {
    path: "/menu/colegio",
    name: "colegio",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "facturacion",
        component: PrCol01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "factmasiva",
        component: PrCol03,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrReimpfact",
        component: PrCol02,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cfcolruts",
        component: Conf_colruts,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfestudiante",
        component: Conf_estud,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfgrados",
        component: Conf_grados,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfcolcargos",
        component: Conf_colcargos,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  //tablero administrativo
  {
    path: "/menu/tablero",
    name: "tablero",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "tabfinanciero",
        component: tabfinanciero,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "tabcomercial",
        component: tabcomercial,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "tabtest",
        component: tabtest,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "tabtest2",
        component: tabtest2,
        meta: {
          requiresAuth: true,
        },
      },

    ],
  },
  //asociados
  {
    path: "/menu/asociados",
    name: "asociados",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cf_asociados",
        component: cfasociados,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_asoctipos",
        component: Cfasoctipos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_asocparam",
        component: Cfasocparam,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cf_asocmodal",
        component: cfasocmodal,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_Simulacred",
        component: PrSimulacred,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_Assolcred",
        component: PrAssolcred,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_Asestcred",
        component: PrAsestcred,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_Asaprcred",
        component: PrAprobcred,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_Emisioncred",
        component: PrEmisioncred,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_categoriza",
        component: PrCategorizar,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_Ascarguecr",
        component: PrAscarguecr,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_Asimpcred",
        component: PrAsimpcred,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_cargueaporte",
        component: Prcargueaporte,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "rp_cartedad",
        component: Rpcartedad,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_asoccreditos",
        component: Rpasoccreditos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_movaportes",
        component: Rpmovaportes,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_saldoaportes",
        component: Rpsaldoaportes,
        meta: {
          requiresAuth: true,
        },
      },

    ],
  },
  //manual
  {
    path: "/menu/soporte2",
    name: "soporte2",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrActivacion",
        component: practivacion,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfbasesdian",
        component: Cfbasesdian,
        meta: {
          requiresAuth: true,
        },
      },

    ],
  },
  //hclinica
  {
    path: "/menu/hclinica",
    name: "hclinica",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pratpaciente",
        component: Pr_atpaciente,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prnotamedica",
        component: Pr_notamedica,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_acthc",
        component: Practhc,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "hc_atpacientenf",
        component: Hc_atpacientenf,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-hcpaciente",
        component: Rphcpaciente,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_preconsulta",
        component: Prpreconsulta,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-busqhc",
        component: Rpbusqhc,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cfplantillahc",
        component: Cf_plantillahc,
        meta: {
          requiresAuth: true,
        },
      },


      {
        path: "pr_preanestesia",
        component: Prpreanestesia,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_anestesia",
        component: Pranestesia,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_cirugcheck",
        component: Prcirugcheck,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_informeqx",
        component: PrInformeqx,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_cirhojagto",
        component: Prcirhojagto,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_circonteo",
        component: Prcirconteo,
        meta: {
          requiresAuth: true,
        },
      },





    ],
  },
  //soporte   
  {
    path: "/menu/soporte",
    name: "soporte",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrActivacion",
        component: practivacion,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "preliminardsp",
        component: Preliminardsp,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "preliminaracuse",
        component: Preliminaracuse,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "preliminarfact",
        component: Preliminarfact,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "preliminarnc",
        component: Preliminarnc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "preliminarhc",
        component: Preliminarhc,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prmovernc",
        component: Prmovernc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prfechafact",
        component: Prfechafact,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_acttiquete",
        component: Practtiquete,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_actcierre",
        component: Practcierre,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "rp_docseletronicos",
        component: Rpdocseletronicos,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cfbasesdian",
        component: Cfbasesdian,
        meta: {
          requiresAuth: true,
        },
      },

    ],
  },
  //resultados medicos
  {
    path: "/menu/resmed",
    name: "resmed",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "reshc",
        component: Reshispaciente,
        meta: {
          requiresAuth: true,
        },
      },
      // {
      //   path: "resatpacientenf",
      //   component: Resatpacientenf,
      //   meta: {
      //     requiresAuth: true,
      //   },
      // },
      {
        path: "res_resultados",
        component: ResResultados,
        meta: {
          requiresAuth: true,
        },
      },



    ],
  },
  //agenda medicos
  {
    path: "/menu/agendamed",
    name: "agendamed",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "sol_agenda",
        component: Solagenda,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  //tr especial
  {
    path: "/menu/trespecial",
    name: "trespecial",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "tr_extracto",
        component: Trprextracto,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "tr_impextracto",
        component: Trimpextracto,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "tr_rpsdopropiet",
        component: Rpsdopropiet,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "trCf_conductor",
        component: TrCfconductor,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "trCfvehiculo",
        component: TrCfvehiculo,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "trCfcontratos",
        component: TrCfcontratos,
        meta: {
          requiresAuth: true,
        },
      },



    ],
  },
  //recaudos
  {
    path: "/menu/recaudos",
    name: "recaudos",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Recaudo01",
        component: recaudo01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_asobanca",
        component: prAsobanca,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_Dasobanca",
        component: prDAsobanca,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_Rasobanca",
        component: prRAsobanca,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "CfConveniorc",
        component: cfconveniorc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfAgenciarec",
        component: Cfagenciarec,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfPerfil",
        component: Cfperfil,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rc_ruts",
        component: Cfrecruts,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rc_usuarios",
        component: CfrecUsuarios,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_recxentidad",
        component: RpRecxentidad,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_recxentpto",
        component: RpRecxentpto,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp_recxagencia",
        component: RpRecxagencia,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_recxagcent",
        component: RpRecxagcent,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_recxcajero",
        component: RpRecxcajero,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_detallado",
        component: RpRecdetallado,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_cierresrc",
        component: Rpcierresrc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_cierreptorc",
        component: Rpcierreptorc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_gasptorc",
        component: Rpgasptorc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_gasfactrc",
        component: Rpgasfactrc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_eaavfactrc",
        component: Rpeaavfactrc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_eaavfactdet",
        component: Rpeaavfactdet,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_bioagfactrc",
        component: Rpbioagfactrc,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "rp_emsa1",
        component: RpEmsa1,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_emsa2",
        component: RpEmsa2,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_emsa3",
        component: RpEmsa3,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_emsasub",
        component: RpEmsasub,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_cdaoriente",
        component: Rpcdaoriente,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_segestud",
        component: Rpsegestud,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp_duplicados",
        component: RpDuplicados,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_cierrerc",
        component: prcierrerc,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_cierreptorc",
        component: prcierreptorc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_bloqueorc",
        component: prbloqueorc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Docsoporte",
        component: Docsoporte,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrReimpDocsp",
        component: PrReimpDocsp,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_carguerc",
        component: prcarguerc,
        meta: {
          requiresAuth: true,
        },
      },

    ],
  },
  //sdm
  {
    path: "/menu/servdm",
    name: "servdm",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      // {
      //   path: "Prsdmfact01",
      //   component: Prsdmfact01,
      //   meta: {
      //     requiresAuth: true,
      //   },
      // },
      {
        path: "Prsdmfact02",
        component: Prsdmfact02,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Prsdmfact03",
        component: Prsdmfact03,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prsdm_contafact",
        component: Prsdmcontafact,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prsdm_eliminafact",
        component: Prsdmeliminafact,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prsdm_eliminalect",
        component: Prsdmeliminalect,
        meta: {
          requiresAuth: true,
        },
      },




      {
        path: "prsdm_recaudos",
        component: Prsdmrecaudos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prsdm_recfinancia",
        component: Prsdmrecfinancia,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prsdm_cierrerc",
        component: Prsdmcierrerc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prsdm_contarec",
        component: Prsdmcontarec,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prsdmlect00",
        component: Prsdmlect00,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfsdm_carguecoord",
        component: Cfsdmcarguecoord,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prsdmlect00",
        component: Prsdmlect00,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prsdmlect01",
        component: Prsdmlect01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_sdmfinancia",
        component: Prsdmfinancia,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_sdmfinancia01",
        component: Prsdmfinancia01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prsdm_actfinanc",
        component: Prsdmactfinanc,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rpsdm-recaudos",
        component: Rpsdmrecaudos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rpsdm_detallado",
        component: RpsdmRecdetallado,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rpsdm_financia",
        component: Rpsdmfinancia,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prsdm_suspens",
        component: Prsdmsuspens,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prsdm_carguefinanc",
        component: Prsdmcargfinanc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prsdm_reconexion",
        component: Prsdmreconexion,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prsdm_printreconexion",
        component: Prsdmprintreconexion,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rpsdm-detfactura",
        component: Rpsdmdetfactura,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rpsdm-cartera1",
        component: Rpsdmcartera1,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rpsdm-cartera2",
        component: Rpsdmcartera2,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rpsdmsui",
        component: RpsdmSui,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Cfsdmusuarios",
        component: Cfsdmusuarios,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cfsdmruts",
        component: Cfsdmruts,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cfsdmbarrios",
        component: Cfsdmbarrios,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cfsdmtarifas",
        component: Cfsdmtarifas,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cfsdmciclos",
        component: Cfsdmciclos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cfsdmcargos",
        component: Cfsdmcargos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cfsdmdesctos",
        component: Cfsdmdesctos,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Cfsdmcorreg",
        component: Cfsdmcorreg,
        meta: {
          requiresAuth: true,
        },
      }



    ],
  },
  //molino
  {
    path: "/menu/molino",
    name: "molino",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prentradavh",
        component: PrEntradavh,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prsalidavh",
        component: PrSalidavh,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "laboratorio",
        component: PrLaboratorio,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "precio",
        component: PrPrecios,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "liquidacion",
        component: PrLiquidacion,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pre-liquidacion",
        component: PrpreLiquidacion,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prdespachos",
        component: PrDespachos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prsecamiento",
        component: PrSecamiento,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prtrilla",
        component: PrTrilla,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prempaque",
        component: PrEmpaque,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prextrusion",
        component: PrExtrusion,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prtraslados",
        component: PrTraslados,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "practualiza",
        component: PrActualiza,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prActbascula",
        component: PrActbascula,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prActliquida",
        component: PrActliquida,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prReprobasc",
        component: PrReprobasc,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "prreimpproc",
        component: PrReimpproc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "RpReimpesaje",
        component: Rp_Reimpesaje,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "RpReimpliquida",
        component: Rp_Reimpliquida,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "RpReimppreliquida",
        component: Rp_Reimppreliquida,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Rpmolcompras",
        component: Rpmol_compras,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrReimpremision",
        component: Rp_Reimpremis,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfmolruts",
        component: Conf_molruts,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfmolconductor",
        component: Conf_molconduc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfmolvehic",
        component: Conf_molvehic,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfvariedad",
        component: Conf_molvariedad,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfprindust",
        component: Conf_prodind,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cfparammol",
        component: CfParammol,
        meta: {
          requiresAuth: true,
        },
      },

    ],
  },
  //gth
  {
    path: "/menu/gestion_th",
    name: "gestion_th",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrGenera",
        component: PrGenera,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrGenera2",
        component: PrGenera2,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrGenera3",
        component: PrGenera3,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrGenera4",
        component: PrGenera4,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrGenera5",
        component: PrGenera5,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrGeneracc",
        component: PrGeneracc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_novedades",
        component: PrNovedades,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_valnovedad",
        component: Prvalnovedad,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_valsolicitud",
        component: Prvalsolicitud,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrDotacion",
        component: PrDotacion,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "RpImpNom",
        component: RpImpNom,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "RpCPago",
        component: RpCPago,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "RpDetNom1",
        component: RpDetNom1,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_provNom",
        component: RpProvNom,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "RpImpCes",
        component: RpImpCes,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "RpImpPrim",
        component: RpImpPrim,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "RpImpLiq",
        component: RpImp_Liq,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "RpImpVac",
        component: RpImp_Vac,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "RpNomelect",
        component: RpNomElect,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "RpPila",
        component: RpPila,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_Dotaciones",
        component: RpDotaciones,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_impNov",
        component: RpimpNovgth,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Rpcertidian",
        component: RpCertidian,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrCierregth",
        component: PrCierregth,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrEliminagth",
        component: PrEliminagth,
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: "Pr_Clonagth",
        component: PrClonagth,
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: "Prpagonom",
        component: Pr_pagonom,
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: "Pr_Pila",
        component: PrPilagth,
        meta: {
          requiresAuth: true,
        }
      },

      {
        path: "PrImportgth",
        component: PrImportgth,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Pr_Exportcontgth",
        component: PrExportcontgth,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_certlab",
        component: Rpcertlab,
        meta: {
          requiresAuth: true,
        },
      },


      {
        path: "Cfcolaborador",
        component: Cfcolaborador,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_ruts",
        component: Cfrutsgth,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "Cfdevengos",
        component: Cfdevengos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cfdeduccion",
        component: Cfdeduccion,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfCargos",
        component: Cfcargos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfParamgth",
        component: CfParamgth,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cfeqbasegth",
        component: Cf_Eqbasegth,
        meta: {
          requiresAuth: true,
        },
      },

    ],
  },
  //pto venta
  {
    path: "/menu/punto_venta",
    name: "punto_venta",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Comprob_pto",
        component: Comprobpto,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrReimpCb",
        component: PrReimpCb,
        name: "prReimpCb",
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Docsoporte",
        component: Docsoporte,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrReimpDocsp",
        component: PrReimpDocsp,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "facturacion",
        component: PrFact01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrReimpfact",
        component: PrFact02,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrConsfact",
        component: PrFact04,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "cotizacion",
        component: PrCotiza01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrReimpcotiz",
        component: PrCotiza02,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pedido",
        component: PrPedido01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrReimppedido",
        component: PrPedido02,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "remision",
        component: PrRemision01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr-remisfact",
        component: PrRemision03,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrfactRemision",
        component: PrRemision04,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrReimpremision",
        component: PrRemision02,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_despacho01",
        component: Prdespacho01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_despacho03",
        component: Prdespacho03,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Ncredito",
        component: PrNcredito01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_Ndebito",
        component: PrNdebito01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_ReimpNd",
        component: PrNdebito02,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Proforma",
        component: PrProforma01,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Reimpproforma",
        component: PrReimpproforma,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pto_cierre",
        component: Prptocierre,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrReimpNc",
        component: PrNcredito02,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrReginvent",
        component: PrReginvent,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrReimpinvent",
        component: PrReimpinvent,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrAnulainvent",
        component: PrAnulainvent,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrCorrecinv",
        component: PrCorrecinv,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrTrasinvent",
        component: PrTrasinvent,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrCierreinv",
        component: PrCierreinv,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_Impfisicoinv",
        component: PrImpfisicoinv,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr-ordencotiza",
        component: Prordencotiza,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr-reimpordcotiza",
        component: Preimpordcotiza,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr-ordencompra",
        component: Prordencompra,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr-reimpordcomp",
        component: Preimpordcomp,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr-autoordcompra",
        component: Prautordcomp,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrReimpfact",
        component: PrFact02,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Practfact",
        component: PrFact03,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Contafact",
        component: Contafact,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ContaNcr",
        component: ContaNcr,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ContaRemr",
        component: ContaRemr,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr-ppyeq01",
        component: Prppyeq01,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Importfact",
        component: Importfact,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ImportInv",
        component: Importinv,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Pr_Deprectos",
        component: PrDeprectos,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Exportfact",
        component: Exportfact,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ncred_cufe",
        component: Ncredcufe,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Cierrecart",
        component: Cierrecart,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cargue_cart",
        component: PrCarguecart,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-RpResVta",
        component: RpResVta,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-RpVtaprod",
        component: RpVtaprod,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-RpVtacli",
        component: RpResVtacli,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-RpVtadet",
        component: RpResVtadet,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-RpVtastar",
        component: RpVtastar,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-RpVtasconsec",
        component: RpVtasconsec,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-RpPedrem",
        component: RpPedrem,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-comisvta",
        component: Rpcomisvta,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-comisrec",
        component: Rpcomisrec,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-cartera1",
        component: RpCartera1,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-Proveedores2",
        component: RpProveedores2,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-RpSaldos1",
        component: RpSaldos1,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-RpProducto",
        component: RpProducto,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-RpMarca",
        component: RpMarca,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-RpKardex1",
        component: RpKardex1,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-Ppequipo",
        component: RpPpequipo,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-RpresComprob",
        component: RpresComprob,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-Rpvended1",
        component: RpVended1,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ruts",
        component: Conf_ruts,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Productos",
        component: Productos,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Clasifica",
        component: Clasifica,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf-unidadPr",
        component: UnidadPr,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "vendedores",
        component: Tit303,
        meta: {
          requiresAuth: true,
        },
      },
      // {
      //   path: "*",
      //   component: NotFound,
      // },
    ],
  },
  //clinico
  {
    path: "/menu/clinico",
    name: "clinico",
    component: menu,
    meta: {
      requiresAuth: true,
    },

    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "ingServicios",
        component: Titcl101,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cl_furips",
        component: Clfurips,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cl_notaenferm",
        component: Clnotaenferm,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "agendas-proc",
        component: Titcl102,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "agendasdia-proc",
        component: Agenda_dia,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "bloqagend-proc",
        component: Titcl102_02,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "habagend-proc",
        component: PrHabagend,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cargue-fact",
        component: Titcl103,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ssactualiza-fact",
        component: Ss_actualizafact,
        meta: {
          requiresAuth: true,
        },
      },


      {
        path: "Factptes-fact",
        component: Factptes,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrClRefacturar",
        component: PrClRefacturar,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prclncredito",
        component: PrclNcredito,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrclNcredito02",
        component: PrclNcredito02,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrContaNcr",
        component: PrclNcredito03,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cargue-rips",
        component: Titcl104,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Generar-rips",
        component: Titcl104G,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Contab-factcl",
        component: Contfactcl,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Reimprime-fact",
        component: ClprReimpfact,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Anula-fact",
        component: ClprAnulaf,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Radica-fact",
        component: ClprRadicaf,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cierre-cartcl",
        component: ClprCierreCart,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "atusuario-proc",
        component: Titcl105,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "turnos-proc",
        component: Turnoscl,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cargueusu-proc",
        component: ClprCargueusu,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "reactauto-proc",
        component: Clreactauto,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "importfact-proc",
        component: ClImportfact,
        meta: {
          requiresAuth: true,
        },
      },
      //reportes
      {
        path: "rp-histpaciente",
        component: ClRphispaciente,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-agendaspaciente",
        component: ClRpagpaciente,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-reimpserv",
        component: ClRpReimprserv,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-servicios",
        component: ClRpServ0101,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-facturacion",
        component: ClRpFact0101,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-facturaciondet",
        component: ClRpFactdet,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-resfacturacion",
        component: ClRpresFact,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-serviciosdet",
        component: ClRpServdet,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-factcups",
        component: ClRpfactcups,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-nvaeps",
        component: ClRpnvaeps,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-factrad",
        component: ClRpfactrad,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-1552",
        component: ClRp1552,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-256",
        component: ClRp256,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-cir030",
        component: ClRpcir030,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-cajacopi1",
        component: Rpcajacopi1,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-mamografias",
        component: ClRpmamografias,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-biopsias",
        component: ClRpbiopsias,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-clprodag",
        component: Clrpprodag,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-clprodag",
        component: Clrpprodag,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-agendas",
        component: ClRpAgen0101,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp_furips",
        component: ClRpFurips,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_DetFurips",
        component: ClRpDetFurips,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-recaudos",
        component: ClRpRecaudo,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-cartera",
        component: ClRpCartera,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pacientes",
        component: Titcl301,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "clientes",
        component: Titcl302,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfSalas",
        component: ClCfSalas,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfConsult",
        component: ClCfconsult,
        meta: {
          requiresAuth: true,
        },
      },


      {
        path: "CfContratos",
        component: ClCfcontratos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "serviciosProce",
        component: ClCfServProc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "carguecctos",
        component: Clcarguecttos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "perasist",
        component: Titcl306,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "clcategoria",
        component: ClCategoria,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "clsubcategoria",
        component: ClSubcategoria,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_ventanilla",
        component: CfClventanilla,
        meta: {
          requiresAuth: true,
        },
      },
      // {
      //   path: "*",
      //   component: NotFound,
      // },
    ],
  },
  //ssalud
  {
    path: "/menu/ssalud",
    name: "ssalud",
    component: menu,
    meta: {
      requiresAuth: true,
    },

    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "ss_prServicios",
        component: PrssServicios,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cl_furips",
        component: Clfurips,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "ssagendas-proc",
        component: Prssagendas,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ssbloqagend-proc",
        component: Prssbloqagenda,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "sshabagend-proc",
        component: PrSsHabagend,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ssalistaesp-proc",
        component: Prlistaespera,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "sstrasagenda-proc",
        component: PrtraslAgenda,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "sscancagenda-proc",
        component: Prcancagenda,
        meta: {
          requiresAuth: true,
        },
      },


      {
        path: "Ss_Egresos-proc",
        component: SsEgresosproc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Ss_Impcomprob-proc",
        component: SsImpcomprob,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "sscargue-fact",
        component: SsPrCarguefact,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ssactualiza-fact",
        component: Ss_actualizafact,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "SsFactptes-fact",
        component: SsFactptes,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ss_factAuto",
        component: SsfactAuto,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "PrClRefacturar",
        component: PrClRefacturar,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prclncredito",
        component: PrclNcredito,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrclNcredito02",
        component: PrclNcredito02,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "PrContaNcr",
        component: PrclNcredito03,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prcl_ndebito",
        component: Prclndebito,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prcl_Ndebito02",
        component: PrclNdebito02,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_ContaNdb",
        component: PrContaNdb,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cargue-rips",
        component: Titcl104,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Generar-rips",
        component: Titcl104G,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Contab-factcl",
        component: Contfactcl,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Reimprime-fact",
        component: ClprReimpfact,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Anula-fact",
        component: ClprAnulaf,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Radica-fact",
        component: ClprRadicaf,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cierre-cartcl",
        component: ClprCierreCart,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "atusuario-proc",
        component: Titcl105,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "turnos-proc",
        component: TurnosSs,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_carguerx",
        component: prcarguerx,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cargueusu-proc",
        component: ClprCargueusu,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "importfact-proc",
        component: ClImportfact,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "ss_actautoriza",
        component: Ssactautoriza,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ss_notificahc",
        component: Ssnotificahc,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "ss_habilitapr",
        component: Sshabilitapr,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "ss_contcopago",
        component: Sscontcopago,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "ss_bloqfechahc",
        component: Ssbloqfechahc,
        meta: {
          requiresAuth: true,
        },
      },


      //reportes ssalud
      {
        path: "rp-histpaciente",
        component: SsRphispaciente,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-agendaspaciente",
        component: ClRpagpaciente,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-hcpaciente",
        component: Rphcpaciente,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-ssrepclinico1",
        component: Ss_Rprepclinico1,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-ssrepclinico2",
        component: Ss_Rprepclinico2,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-ssrepprevaldx",
        component: Ssrepprevaldx,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "ss_rp-cartera",
        component: Ss_RpCartera,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ss_rp-recaudos",
        component: SsClRpRecaudo,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-reimpserv",
        component: ClRpReimprserv,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-servicios",
        component: ClRpServ0101,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-facturacion",
        component: ClRpFact0101,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-facturaciondet",
        component: ClRpFactdet,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-resfacturacion",
        component: ClRpresFact,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-Sserviciosdet",
        component: RpSServdet,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-factcups",
        component: ClRpfactcups,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-nvaeps",
        component: ClRpnvaeps,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-factrad",
        component: ClRpfactrad,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp-1552",
        component: ClRp1552,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-256",
        component: ClRp256,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-cir030",
        component: ClRpcir030,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp-clprodag",
        component: Clrpprodag,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ss_rp-agendas",
        component: SsRpAgen0101,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ss_rp-agendasdet",
        component: SsRpAgen0102,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ss_rp-agendinasist",
        component: Ssagendinasist,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ss_rp-listaespera",
        component: ssrplistaespera,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "ss_rp-Reimpfact",
        component: RpSSReimpfact,
        meta: {
          requiresAuth: true,
        },
      },


      {
        path: "rp_furips",
        component: ClRpFurips,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_DetFurips",
        component: ClRpDetFurips,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pacientes",
        component: Titcl301,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "clientes",
        component: Titcl302,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "CfConsult",
        component: ClCfconsult,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "sscfContratos",
        component: Sscfcontratos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ss_serviciosProce",
        component: SsClCfServProc,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "sscarguecctos",
        component: Sscarguecttos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ss_cfespecialidad",
        component: SsCfespecialidad,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "ss_Cfconceptos",
        component: SsCfconceptos,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "ss_perasist",
        component: SsPerasist,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "clcategoria",
        component: ClCategoria,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "clsubcategoria",
        component: ClSubcategoria,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Cf_medicamentos",
        component: CfClmedicamentos,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "Ss_Cfordenhc",
        component: SsCfordenh,
        meta: {
          requiresAuth: true,
        },
      },

      // {
      //   path: "*",
      //   component: NotFound,
      // },

    ],
  },
  {
    // menubase
    path: "/menubase",
    name: "menubase",
    component: MenuBase,
    meta: {
      requiresAuth: true,
    },
  },
  //contador
  {
    // menubase
    path: "/menuconta",
    name: "menuconta",
    component: () => import("@/views/MenuConta.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  //tr mercancias
  {
    path: "/menu/trmcias",
    name: "trmcias",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_trmsolicitud",
        component: Prtrmsolicitud,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_trmordencargue",
        component: Prtrmordencargue,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "pr_trmordencomb",
        component: Prtrmordencomb,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_trmegreso",
        component: Prtregreso,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_trmremision",
        component: Prtrmremision,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_trrecepdocs",
        component: Prtrrecepdocs,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_trliqcliente",
        component: Prtrliqcliente,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "pr_trliqproveedor",
        component: Prtrliqproveedor,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "rp_trOrdenes",
        component: RptrOrdenes,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trrecepcion",
        component: RptrRecepcion,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trproforma",
        component: Rptrproforma,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "rp_trordencompra",
        component: Rptrordencompra,
        meta: {
          requiresAuth: true,
        },
      },



      {
        path: "ruts",
        component: Conf_ruts,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "cf_trmproductos",
        component: Cftrmproductos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_trmconductor",
        component: Cftrmconductor,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_trmvehiculos",
        component: Cftrmvehiculos,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "cf_trmubicaciones",
        component: Cftrubicaciones,
        meta: {
          requiresAuth: true,
        },
      },


    ],
  },
  //tr hseq
  {
    path: "/menu/hseq",
    name: "hseq",
    component: menu,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "base",
        component: () => import("@/components/base.modulo.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "prhseq_peso",
        component: Prhseqpeso,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  //tr testeo
  // {
  //   path: "/menu/testeo",
  //   name: "testeo",
  //   component: menu,
  //   meta: {
  //     requiresAuth: true,
  //   },
  //   children: [
  //     {
  //       path: "base",
  //       component: () => import("@/components/base.modulo.vue"),
  //       meta: {
  //         requiresAuth: true,
  //       },
  //     },
  //     {
  //       path: "tab_test2",
  //       component: Test_test2,
  //       meta: {
  //         requiresAuth: true,
  //       },
  //     },
  //   ],
  // },    

  // {
  //   path: "tabtest2",
  //   component: tabtest2,
  //   meta: {
  //     requiresAuth: true,
  //   },
  // },


];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.afterEach(() => {
});

const titles = {
  "financiero": "Financiero",
  "punto_venta": "Mercancías",
  "gestion_th": "Talento Humano",
  "clinico": "Imagenología",
  "hclinica": "Historia Clínica",
  "ssalud": "Servicios Salud",
  "molino": "Industrial",
  "servdm": "Servicios Domicialiarios",
  "recaudos": "Recaudos Serv.P.",
  "asociados": "Créditos & Asociados",
  "transporte": "Transporte Intermunicipal",
  "resmed": "Resultados Médicos",
  "agendamed": "Agenda Médica",


  "trespecial": "Transporte Especial",
  "docselect": "Documentos Electronicos",
  "dispensa": "Dispensación Medicamentos",
  "plazos": "Comercio a Plazos",
  "autocolabora": "Autocolaborador",
  "phorizontal": "Propiedad Horizontal",
  "trmcias": "Transporte de Mercancías",
  "hseq": "Hseq",
  "testeo": "Pruebas",




}

router.beforeEach((to, from, next) => {
  const session = sessionStorage.getItem("Sesion");
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (!session && requiresAuth) next("login");
  else if (session && !requiresAuth) next(`${sessionStorage.Form}`);
  else next();

  const module = to.path.split('/')[2]
  const title = titles[module] || 'Titan Soluciones'
  document.title = title
});

export default router;

