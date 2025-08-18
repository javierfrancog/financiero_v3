import Papa from 'papaparse';
import Fuse from 'fuse.js';

class ManualService {
  constructor() {
    this.manual = [];
    this.fuse = null;
    this.CACHE_KEY = 'manualDatosV5';
    this.CACHE_TIEMPO_HORAS = 12;
    this.URL_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRgZ1eFiMZ5zU_UG-0R-WBFFepwDzTDHLpPGJWBP1pXKXMavfdmmtaL7faeW2a37ner2PK0UwO6NwRW/pub?output=csv';
  }

  // async inicializar() {
  //   const cache = localStorage.getItem(this.CACHE_KEY);
  //   const cacheTime = localStorage.getItem(this.CACHE_KEY + '_time');
  //   const ahora = Date.now();

  //   if (cache && cacheTime && (ahora - cacheTime < this.CACHE_TIEMPO_HORAS * 60 * 60 * 1000)) {
  //     this.manual = JSON.parse(cache);
  //   } else {
  //     await this.cargarManual();
  //   }

  //   this.inicializarBuscador();
  // }

  async cargarManual() {
    const response = await fetch(this.URL_CSV);
    const text = await response.text();

    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

    const datos = parsed.data
      .filter(row => row.Pregunta?.trim() && row.Respuesta?.trim())
      .map(row => ({
        pregunta: this.limpiarTexto(row.Pregunta),
        respuesta: row.Respuesta.trim(),
        tema: row.Tema?.trim() || "",
        modulo: row.Módulo?.trim() || "",
        imagen: row.imagen?.trim() || ""
      }));

    this.manual = datos;
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(datos));
    localStorage.setItem(this.CACHE_KEY + '_time', Date.now());
  }
  async inicializar(force = false) {
    const cache = localStorage.getItem(this.CACHE_KEY);
    const cacheTime = localStorage.getItem(this.CACHE_KEY + '_time');
    const ahora = Date.now();

    if (!force && cache && cacheTime && (ahora - cacheTime < this.CACHE_TIEMPO_HORAS * 60 * 60 * 1000)) {
      this.manual = JSON.parse(cache);
    } else {
      await this.cargarManual();
    }

    this.inicializarBuscador();
  }



  inicializarBuscador() {
    this.fuse = new Fuse(this.manual, {
      keys: ['pregunta', 'tema', 'modulo'],
      threshold: 0.35,
      distance: 100,
      includeScore: true
    });
  }

  buscar(preguntaUsuario) {
    const entrada = this.limpiarTexto(preguntaUsuario);

    const resultados = this.fuse.search(entrada);
    if (resultados.length > 0) {
      return resultados.slice(0, 3).map(res => res.item.respuesta);
    } else {
      return ['No encontré información relacionada con tu pregunta.'];
    }
  }

  limpiarTexto(texto) {
    if (!texto) return '';
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }
}

export default new ManualService();

