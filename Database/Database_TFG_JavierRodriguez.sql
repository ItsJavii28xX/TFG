CREATE TABLE Usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellidos VARCHAR(150),
  email VARCHAR(150) UNIQUE,
  contraseña VARCHAR(255),
  telefono VARCHAR(20),
  imagen_perfil VARCHAR(255),
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255)
);

CREATE TABLE Grupos (
  id_grupo INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150),
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Usuarios_Grupos (
  id_usuario_grupo INT AUTO_INCREMENT PRIMARY KEY,
  id_grupo INT,
  id_usuario INT,
  es_administrador BOOLEAN DEFAULT FALSE,
  fecha_union DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Presupuestos (
  id_presupuesto INT AUTO_INCREMENT PRIMARY KEY,
  id_grupo INT,
  nombre VARCHAR(150),
  cantidad DECIMAL(10,2),
  descripcion TEXT,
  fecha_inicio DATETIME,
  fecha_fin DATETIME,
  FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo)
);

CREATE TABLE Gastos (
  id_gasto INT AUTO_INCREMENT PRIMARY KEY,
  id_presupuesto INT,
  id_usuario INT,
  id_grupo INT,
  nombre VARCHAR(150),
  cantidad DECIMAL(10,2),
  descripcion TEXT,
  estado ENUM('pendiente', 'aceptado', 'denegado') DEFAULT 'pendiente',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_presupuesto) REFERENCES Presupuestos(id_presupuesto),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
  FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo)
);

CREATE TABLE Categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  id_grupo INT,
  nombre VARCHAR(100),
  descripcion TEXT,
  FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo)
);

CREATE TABLE Contactos (
  id_contacto INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  nombre VARCHAR(150),
  email VARCHAR(150),
  telefono VARCHAR(20),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Alertas_Limites (
  id_alerta INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  limite DECIMAL(10,2),
  email_notificacion VARCHAR(150),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Historico (
  id_historico INT AUTO_INCREMENT PRIMARY KEY,
  id_grupo INT,
  accion VARCHAR(255),
  id_usuario INT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);
