import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition: any = {
  openapi: "3.0.0",
  info: {
    title: "API REST - MDocs",
    description:
      "Esta API es documentada con Swagger, así se puede lograr un correcto y adecuado manejo a la misma.",
    contact: {
      name: "Desarrollador",
      email: "cb961218@gmail.com",
    },
    version: "1.0.0",
  },
  servers: [
    {
      url: process.env.SWAGGER_SERVER_LOCAL,
      description: "Local serve",
    },
    // {
    //   url: process.env.SWAGGER_SERVER_CLOUD,
    //   description: "Cloud server",
    // },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      ApiKeyAuth: {
        type: "apiKey",
        name: "Authorization",
      },
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./docs/*.ts"], // Asegúrate de que esta ruta sea correcta
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
