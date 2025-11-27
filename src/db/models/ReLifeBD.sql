-- ==============================================================
-- BASE DE DATOS: MARKETPLACE DE ROPA USADA
-- Descripción: Modelo normalizado con tablas para imágenes, tallas y direcciones
-- ==============================================================

-- Obviamente Crear la base de Datos con el nombre ReLifeDB

-- ==============================================================
-- 1. TABLA DIRECCIONES
-- ==============================================================

CREATE TABLE tab_reg (
    treg_id SERIAL PRIMARY KEY,
    treg_nom VARCHAR(100) NOT NULL
);

CREATE TABLE tab_com (
    tcom_id SERIAL PRIMARY KEY,
    tcom_nom VARCHAR(100) NOT NULL,
    tcom_reg INT NOT NULL REFERENCES tab_reg(treg_id)
);

-- ==============================================================
-- 3. TABLA USUARIOS
-- ==============================================================

CREATE TABLE tab_usr (
    tus_eml VARCHAR(150) PRIMARY KEY UNIQUE NOT NULL,
    tus_nmb VARCHAR(50) NOT NULL,
    tus_ape VARCHAR(50) NOT NULL,
    tus_psw VARCHAR(100) NOT NULL,
    tus_fec DATE NOT NULL,
    tus_con VARCHAR(50) NOT NULL,
    tus_rol VARCHAR(20) NOT NULL,
    tus_com INT REFERENCES tab_com(tcom_id)
);

-- ==============================================================
-- 3. TABLA CATEGORÍAS
-- ==============================================================

CREATE TABLE tab_cat (
    tct_id SERIAL PRIMARY KEY,
    tct_nmb VARCHAR(50) NOT NULL
);

-- ==============================================================
-- 4. TABLA TALLAS
-- ==============================================================

CREATE TABLE tab_talla (
    ttal_id SERIAL PRIMARY KEY,
    ttal_tipo VARCHAR(10) NOT NULL,     -- 'Letra' o 'Número'
    ttal_valor VARCHAR(10) NOT NULL     -- Ej: 'M', 'L', '42'
);

-- ==============================================================
-- 5. TABLA PRODUCTOS
-- ==============================================================

CREATE TABLE tab_prd (
    tdp_id SERIAL PRIMARY KEY,
    tdp_nmb VARCHAR(50) NOT NULL,
    tdp_des VARCHAR(255) NOT NULL,
    tdp_pre INT NOT NULL,
    tdp_est BOOLEAN NOT NULL,           -- disponible (TRUE) o vendido (FALSE)
    tdp_fch DATE NOT NULL,
    tdp_usr VARCHAR(150) NOT NULL,
    tdp_cat INT NOT NULL,
    tdp_talla INT NOT NULL,
    FOREIGN KEY (tdp_usr) REFERENCES tab_usr(tus_eml),
    FOREIGN KEY (tdp_cat) REFERENCES tab_cat(tct_id),
    FOREIGN KEY (tdp_talla) REFERENCES tab_talla(ttal_id)
);

-- ==============================================================
-- 6. TABLA IMÁGENES
-- ==============================================================

CREATE TABLE tab_img (
    timg_id SERIAL PRIMARY KEY,
    timg_url VARCHAR(255) NOT NULL,      -- ruta o nombre del archivo
    timg_alt VARCHAR(100),               -- descripción o texto alternativo
    timg_prd INT NOT NULL,
    FOREIGN KEY (timg_prd) REFERENCES tab_prd(tdp_id)
);

-- ============================================================== 
-- FIN DEL MODELO 
-- ==============================================================
