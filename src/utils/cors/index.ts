// enable CORS - Cross Origin Resource Sharing
const corsOptions = {
  origin: "*", // Permitir cualquier origen
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Permitir todos los métodos
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ], // Permitir todos los encabezados comunes
};

export { corsOptions };
