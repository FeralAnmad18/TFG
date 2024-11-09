export class Constantes {
    // Definición de constantes estáticas
    static API_KEY_FLIGHT_BY_ID = "cm1z3rse80004mf034y1fq0nl";
    static API_KEY_DATES_FLIGHT_BY_ID = "cm2qesps70001k50345euznls";
    static DISCULPA = "Sentimos las molestias, esperemos que encuentre su vuelo en la siguiente búsqueda";
    static PETICION_CREADA = "Se ha creado la peticion de cambio. Sera redirigido a la pantalla de inicio";
  
    // Método estático opcional para obtener las constantes (no es necesario, pero puede ser útil)
    static obtenerConstante(nombre) {
      return this[nombre];
    }
  }