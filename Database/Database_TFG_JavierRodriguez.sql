CREATE TABLE Usuarios (
  id_usuario      INT AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(100),
  apellidos       VARCHAR(150),
  email           VARCHAR(150) UNIQUE,
  contraseña      VARCHAR(255),
  telefono        VARCHAR(20),
  imagen_perfil   TEXT,
  oauth_provider  VARCHAR(50),
  oauth_id        VARCHAR(255)
);

CREATE TABLE Grupos (
  id_grupo        INT AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(150),
  fecha_creacion  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Usuarios_Grupos (
  id_usuario_grupo INT AUTO_INCREMENT PRIMARY KEY,
  id_grupo         INT NOT NULL,
  id_usuario       INT NOT NULL,
  es_administrador BOOLEAN DEFAULT FALSE,
  fecha_union      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Presupuestos (
  id_presupuesto  INT AUTO_INCREMENT PRIMARY KEY,
  id_grupo        INT NOT NULL,
  nombre          VARCHAR(150),
  cantidad        DECIMAL(10,2),
  descripcion     TEXT,
  fecha_inicio    DATETIME,
  fecha_fin       DATETIME,
  FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo)
);

CREATE TABLE Gastos (
  id_gasto        INT AUTO_INCREMENT PRIMARY KEY,
  id_presupuesto  INT NOT NULL,
  id_usuario      INT NOT NULL,
  id_grupo        INT NOT NULL,
  nombre          VARCHAR(150),
  cantidad        DECIMAL(10,2),
  descripcion     TEXT,
  estado          ENUM('pendiente', 'aceptado', 'denegado') DEFAULT 'pendiente',
  fecha_creacion  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_presupuesto) REFERENCES Presupuestos(id_presupuesto),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
  FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo)
);

CREATE TABLE Categorias (
  id_categoria    INT AUTO_INCREMENT PRIMARY KEY,
  id_grupo        INT NOT NULL,
  nombre          VARCHAR(100),
  descripcion     TEXT,
  FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo)
);

CREATE TABLE Contactos (
  id_contacto            INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario_propietario INT NOT NULL,
  id_usuario_contacto    INT NOT NULL,
  nombre                 VARCHAR(150),
  email                  VARCHAR(150),
  telefono               VARCHAR(20),
  FOREIGN KEY (id_usuario_propietario) REFERENCES Usuarios(id_usuario),
  FOREIGN KEY (id_usuario_contacto) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Alertas_Limites (
  id_alerta         INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario        INT NOT NULL,
  limite            DECIMAL(10,2),
  email_notificacion VARCHAR(150),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Historico (
  id_historico  INT AUTO_INCREMENT PRIMARY KEY,
  id_grupo      INT NOT NULL,
  id_usuario    INT NOT NULL,
  id_gasto      INT,
  accion        VARCHAR(255),
  fecha         DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
  FOREIGN KEY (id_gasto) REFERENCES Gastos(id_gasto)
);

CREATE TABLE Tokens (
  id_token    INT AUTO_INCREMENT PRIMARY KEY,
  token       TEXT NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE UsuarioTokens (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  id_token    INT NOT NULL,
  id_usuario  INT NOT NULL,
  FOREIGN KEY (id_token) REFERENCES Tokens(id_token),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);
