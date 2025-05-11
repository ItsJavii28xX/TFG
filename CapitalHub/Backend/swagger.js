const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi    = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'CapitalHub API',
      version:     '1.0.0',
      description: 'Documentación de la API de CapitalHub'
    },
    servers: [
      { url: 'http://localhost:3000/api',       description: 'Entorno local' },
      { url: 'https://tu-backend.vercel.app/api', description: 'Producción' }
    ],
    components: {

      securitySchemes: {
        BearerAuth: {
          type:         'http',
          scheme:       'bearer',
          bearerFormat: 'JWT'
        }
      },

      schemas: {
        Usuario: {
          type:       'object',
          properties: {
            id_usuario:    { type: 'integer' },
            nombre:        { type: 'string'  },
            apellidos:     { type: 'string'  },
            email:         { type: 'string'  },
            telefono:      { type: 'string'  },
            imagen_perfil: { type: 'string'  }
          }
        },

      }
    },

    security: [
      { BearerAuth: [] }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js'
  ]
};

module.exports = {
  swaggerUi,
  specs: swaggerJsdoc(options)
};
