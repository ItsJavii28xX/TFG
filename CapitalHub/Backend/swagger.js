const swaggerJsdoc             = require('swagger-jsdoc');
const express = require('express')
const swaggerUi                = require('swagger-ui-express');
const path = require('path')
const { Categoria, Historico } = require('./models');

const options = {
  definition: {
    openapi: '3.0.0',
    info   : {
      title      : 'CapitalHub API',
      version    : '1.0.0',
      description: 'Documentación de la API de CapitalHub'
    },
    servers: [
      { url: 'http://localhost:3000/api',       description: 'Entorno local' },
      { url: 'https://capitalhub-backend.vercel.app/api', description: 'Producción' }
    ],
    components: {

      securitySchemes: {
        BearerAuth: {
          type        : 'http',
          scheme      : 'bearer',
          bearerFormat: 'JWT'
        }
      },

      schemas: {
        Usuario: {
          type      : 'object',
          properties: {
            id_usuario   : { type: 'integer' },
            nombre       : { type: 'string'  },
            apellidos    : { type: 'string'  },
            email        : { type: 'string'  },
            telefono     : { type: 'string'  },
            imagen_perfil: { type: 'string'  }
          }
        },
        AlertaLimite: {
          type      : 'object',
          properties: {
            id_alerta         : { type: 'integer' },
            limite            : { type: 'number'  },
            email_notificacion: { type: 'string'  }
          }
        },
        Categoria: {
          type      : 'object',
          properties: {
            id_categoria: { type: 'integer' },
            nombre      : { type: 'string'  },
            descripcion : { type: 'string'  },
            id_grupo    : { type: 'integer' }
          }
        },
        Contacto: {
          type      : 'object',
          properties: {
            id_contacto: { type: 'integer' },
            nombre     : { type: 'string'  },
            email      : { type: 'string'  },
            telefono   : { type: 'string'  },
            id_usuario : { type: 'integer' }
          }
        },
        Gasto: {
          type      : 'object',
          properties: {
            id_gasto      : { type: 'integer' },
            nombre        : { type: 'string'  },
            cantidad      : { type: 'number'  },
            descripcion   : { type: 'string'  },
            estado        : { type: 'string'  },
            fecha_creacion: { type: 'string', format: 'date' },
            id_usuario    : { type: 'integer' },
            id_presupuesto: { type: 'integer' }
          }
        },
        Grupo: {
          type      : 'object',
          properties: {
            id_grupo      : { type: 'integer' },
            nombre        : { type: 'string'  },
            fecha_creacion: { type: 'string', format: 'date' }
          }
        },
        Historico: {
          type      : 'object',
          properties: {
            id_historico: { type: 'integer' },
            accion      : { type: 'string'  },
            fecha       : { type: 'string', format: 'date' },
            id_usuario  : { type: 'integer' },
            id_grupo    : { type: 'integer' }
          }
        },
        Presupuesto: {
          type      : 'object',
          properties: {
            id_presupuesto: { type: 'integer' },
            nombre        : { type: 'string'  },
            cantidad      : { type: 'number'  },
            descripcion   : { type: 'string'  },
            fecha_inicio  : { type: 'string', format: 'date' },
            fecha_fin     : { type: 'string', format: 'date' },
            id_grupo      : { type: 'integer' }
          }
        },
        Token: {
          type      : 'object',
          properties: {
            id_token: { type: 'integer' },
            token   : { type: 'string'  }
          }
        },
        UsuarioToken: {
          type      : 'object',
          properties: {
            id_usuario_token: { type: 'integer' },
            id_usuario      : { type: 'integer' },
            id_token        : { type: 'integer' }
          }
        },
        UsuarioGrupo: {
          type      : 'object',
          properties: {
            id_usuario_grupo: { type: 'integer' },
            id_usuario      : { type: 'integer' },
            id_grupo        : { type: 'integer' },
            es_administrador: { type: 'boolean' },
            fecha_union     : { type: 'string', format: 'date' }
          }
        }
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

const swaggerDocs = swaggerJSDoc(options)

const swaggerUiOptions = {
    explorer: true,
    customCss:'.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css'
}

module.exports = (app) => {
    const swaggerUiDistPath = require('swagger-ui-dist').getAbsoluteFSPath()
    app.use('/api-docs', express.static(swaggerUiDistPath))
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions))

    app.get('/swagger.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerDocs);
    })
}
