export class Constantes {
    // Definición de constantes estáticas
    static API_KEY_FLIGHT_BY_ID = "cm1z3rse80004mf034y1fq0nl";
    static API_KEY_DATES_FLIGHT_BY_ID = "cm2qesps70001k50345euznls";
    static DISCULPA = "Sentimos las molestias, esperemos que encuentre su vuelo en la siguiente búsqueda";
    static PETICION_CREADA = "Se ha creado la peticion de cambio. Sera redirigido a la pantalla de inicio";
    static PETICION_CANCELADA = "Se ha cancelado la peticion";
    static PETICION_ACEPTADA = "Se ha aceptado la peticion";
    static PETICION_RECHAZADA = "Se ha rechazado la peticion";
    static ERROR = "Ha habido un error, disculpe las molestias";
    static NO_PETICIONES = "Actualmente no hay peticiones creadas por ti"
    static NO_REQUESTED = "Actualmente no hay peticiones pendientes de respuesta"
    static NO_ACCEPTED = "Actualmente no hay peticiones aceptadas"
    static NO_PETICIONES_INDEX = "Actualmente no hay peticiones con los datos proporcionados"
    static LOGIN_OK = "Has iniciado sesión correctamente. Serás redirigido a la página principal.";
    static LOGIN_NOT_OK = "Usuario y/o contraseña incorrectos.";
    static MENSAJE_PETICION_ACEPTADA = (user) => `${user} ha aceptado tu petición`;
    static MENSAJE_PETICION_RECHAZADA = (user) => `${user} ha rechazado tu petición`;
    static MENSAJE_PETICION_CANCELADA = (user) => `${user} ha cancelado el cambio`;

    // Método estático opcional para obtener las constantes (no es necesario, pero puede ser útil)
    static obtenerConstante(nombre) {
      return this[nombre];
    }
  }