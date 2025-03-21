CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255),
    apellidos VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    contraseña VARCHAR(255)
);

CREATE TABLE familias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255)
);

CREATE TABLE usuarios_familias (
    usuario_id INT,
    familia_id INT,
    es_administrador BOOLEAN,
    fecha_union DATETIME,
    PRIMARY KEY (usuario_id, familia_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (familia_id) REFERENCES familias(id)
);

CREATE TABLE presupuestos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    familia_id INT,
    nombre VARCHAR(255),
    monto_total DECIMAL(10, 2),
    FOREIGN KEY (familia_id) REFERENCES familias(id)
);

CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    familia_id INT,
    nombre VARCHAR(255),
    FOREIGN KEY (familia_id) REFERENCES familias(id)
);

CREATE TABLE transacciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    presupuesto_id INT,
    familia_id INT,
    monto DECIMAL(10, 2),
    tipo ENUM('ingreso', 'gasto'),
    descripcion TEXT,
    estado ENUM('pendiente', 'aprobado', 'rechazado'),
    FOREIGN KEY (presupuesto_id) REFERENCES presupuestos(id),
    FOREIGN KEY (familia_id) REFERENCES familias(id)
);
