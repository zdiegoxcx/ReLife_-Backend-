-- ######################################
-- # 1. INSERCIÓN DE REGIONES (tab_reg) #
-- ######################################

-- Inserta las 16 regiones de Chile
INSERT INTO tab_reg (treg_nom) VALUES
('Arica y Parinacota'),                       -- ID 1 (XV)
('Tarapacá'),                                 -- ID 2 (I)
('Antofagasta'),                              -- ID 3 (II)
('Atacama'),                                  -- ID 4 (III)
('Coquimbo'),                                 -- ID 5 (IV)
('Valparaíso'),                               -- ID 6 (V)
('Metropolitana de Santiago'),                 -- ID 7 (RM)
('Libertador General Bernardo O’Higgins'),    -- ID 8 (VI)
('Maule'),                                    -- ID 9 (VII)
('Ñuble'),                                    -- ID 10 (XVI)
('Biobío'),                                   -- ID 11 (VIII)
('La Araucanía'),                             -- ID 12 (IX)
('Los Ríos'),                                 -- ID 13 (XIV)
('Los Lagos'),                                -- ID 14 (X)
('Aysén del General Carlos Ibáñez del Campo'),-- ID 15 (XI)
('Magallanes y de la Antártica Chilena');     -- ID 16 (XII)


-- ######################################
-- # 2. INSERCIÓN DE COMUNAS (tab_com)  #
-- ######################################

-- Se asume que los treg_id son correlativos desde 1 hasta 16,
-- basados en el orden de inserción anterior (Arica y Parinacota = 1, Tarapacá = 2, etc.)
-- Si los IDs no son secuenciales, deberías usar subconsultas para obtener el ID de la región.

-- NOTA: Si utilizas otro motor de BD o quieres garantizar la referencia, puedes cambiar los números
-- por una subconsulta: (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Nombre de la Región')

-- Región 1: Arica y Parinacota (XV)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Arica', 1),
('Camarones', 1),
('Putre', 1),
('General Lagos', 1);

-- Región 2: Tarapacá (I)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Iquique', 2),
('Alto Hospicio', 2),
('Pozo Almonte', 2),
('Camiña', 2),
('Colchane', 2),
('Huara', 2),
('Pica', 2);

-- Región 3: Antofagasta (II)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Antofagasta', 3),
('Mejillones', 3),
('Sierra Gorda', 3),
('Taltal', 3),
('Calama', 3),
('Ollagüe', 3),
('San Pedro de Atacama', 3),
('Tocopilla', 3),
('María Elena', 3);

-- Región 4: Atacama (III)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Copiapó', 4),
('Caldera', 4),
('Tierra Amarilla', 4),
('Chañaral', 4),
('Diego de Almagro', 4),
('Vallenar', 4),
('Alto del Carmen', 4),
('Freirina', 4),
('Huasco', 4);

-- Región 5: Coquimbo (IV)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('La Serena', 5),
('Coquimbo', 5),
('Andacollo', 5),
('La Higuera', 5),
('Paiguano', 5),
('Vicuña', 5),
('Ovalle', 5),
('Combarbalá', 5),
('Monte Patria', 5),
('Punitaqui', 5),
('Río Hurtado', 5),
('Illapel', 5),
('Canela', 5),
('Los Vilos', 5),
('Salamanca', 5);

-- Región 6: Valparaíso (V)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Valparaíso', 6),
('Casablanca', 6),
('Concón', 6),
('Juan Fernández', 6),
('Puchuncaví', 6),
('Quintero', 6),
('Viña del Mar', 6),
('Isla de Pascua', 6),
('Los Andes', 6),
('Calle Larga', 6),
('Rinconada', 6),
('San Esteban', 6),
('La Ligua', 6),
('Cabildo', 6),
('Papudo', 6),
('Petorca', 6),
('Zapallar', 6),
('Quillota', 6),
('Calera', 6),
('Hijuelas', 6),
('La Cruz', 6),
('Nogales', 6),
('San Antonio', 6),
('Algarrobo', 6),
('Cartagena', 6),
('El Quisco', 6),
('El Tabo', 6),
('Santo Domingo', 6),
('San Felipe', 6),
('Catemu', 6),
('Llay-Llay', 6),
('Panquehue', 6),
('Putaendo', 6),
('Santa María', 6),
('Limache', 6),
('Olmué', 6),
('Quilpué', 6),
('Villa Alemana', 6);

-- Región 7: Metropolitana de Santiago (RM)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Santiago', 7),
('Cerrillos', 7),
('Cerro Navia', 7),
('Conchalí', 7),
('El Bosque', 7),
('Estación Central', 7),
('Huechuraba', 7),
('Independencia', 7),
('La Cisterna', 7),
('La Florida', 7),
('La Granja', 7),
('La Pintana', 7),
('La Reina', 7),
('Las Condes', 7),
('Lo Barnechea', 7),
('Lo Espejo', 7),
('Lo Prado', 7),
('Macul', 7),
('Maipú', 7),
('Ñuñoa', 7),
('Pedro Aguirre Cerda', 7),
('Peñalolén', 7),
('Providencia', 7),
('Pudahuel', 7),
('Quilicura', 7),
('Quinta Normal', 7),
('Recoleta', 7),
('Renca', 7),
('San Joaquín', 7),
('San Miguel', 7),
('San Ramón', 7),
('Vitacura', 7),
('Puente Alto', 7),
('Pirque', 7),
('San José de Maipo', 7),
('Colina', 7),
('Lampa', 7),
('Tiltil', 7),
('San Bernardo', 7),
('Buin', 7),
('Calera de Tango', 7),
('Paine', 7),
('Melipilla', 7),
('Alhué', 7),
('Curacaví', 7),
('María Pinto', 7),
('San Pedro', 7),
('Talagante', 7),
('El Monte', 7),
('Isla de Maipo', 7),
('Padre Hurtado', 7),
('Peñaflor', 7);

-- Región 8: Libertador General Bernardo O’Higgins (VI)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Rancagua', 8),
('Codegua', 8),
('Coinco', 8),
('Coltauco', 8),
('Doñihue', 8),
('Graneros', 8),
('Las Cabras', 8),
('Machalí', 8),
('Malloa', 8),
('Mostazal', 8),
('Olivar', 8),
('Peumo', 8),
('Pichidegua', 8),
('Quinta de Tilcoco', 8),
('Rengo', 8),
('Requínoa', 8),
('San Vicente', 8),
('Pichilemu', 8),
('La Estrella', 8),
('Litueche', 8),
('Marchihue', 8),
('Navidad', 8),
('Paredones', 8),
('San Fernando', 8),
('Chépica', 8),
('Chimbarongo', 8),
('Lolol', 8),
('Nancagua', 8),
('Palmilla', 8),
('Peralillo', 8),
('Placilla', 8),
('Pumanque', 8),
('Santa Cruz', 8);

-- Región 9: Maule (VII)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Talca', 9),
('Constitución', 9),
('Curepto', 9),
('Empedrado', 9),
('Maule', 9),
('Pelarco', 9),
('Pencahue', 9),
('Río Claro', 9),
('San Clemente', 9),
('San Rafael', 9),
('Cauquenes', 9),
('Chanco', 9),
('Pelluhue', 9),
('Parraguas', 9),
('Linares', 9),
('Colbún', 9),
('Longaví', 9),
('Parral', 9),
('Retiro', 9),
('San Javier', 9),
('Villa Alegre', 9),
('Yerbas Buenas', 9),
('Curicó', 9),
('Hualañé', 9),
('Licantén', 9),
('Molina', 9),
('Rauco', 9),
('Romeral', 9),
('Sagrada Familia', 9),
('Teno', 9),
('Vichuquén', 9);

-- Región 10: Ñuble (XVI)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Chillán', 10),
('Bulnes', 10),
('Cobquecura', 10),
('Coelemu', 10),
('Coihueco', 10),
('El Carmen', 10),
('Ninhue', 10),
('Ñiquén', 10),
('Pemuco', 10),
('Pinto', 10),
('Portezuelo', 10),
('Quillón', 10),
('Quirihue', 10),
('Ránquil', 10),
('San Carlos', 10),
('San Fabián', 10),
('San Ignacio', 10),
('San Nicolás', 10),
('Treguaco', 10),
('Yungay', 10),
('Chillán Viejo', 10);

-- Región 11: Biobío (VIII)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Concepción', 11),
('Coronel', 11),
('Chiguayante', 11),
('Florida', 11),
('Hualqui', 11),
('Lota', 11),
('Penco', 11),
('San Pedro de la Paz', 11),
('Santa Juana', 11),
('Talcahuano', 11),
('Tomé', 11),
('Hualpén', 11),
('Lebu', 11),
('Arauco', 11),
('Cañete', 11),
('Contulmo', 11),
('Curanilahue', 11),
('Los Álamos', 11),
('Tirúa', 11),
('Los Ángeles', 11),
('Antuco', 11),
('Cabrero', 11),
('Laja', 11),
('Mulchén', 11),
('Nacimiento', 11),
('Negrete', 11),
('Quilaco', 11),
('Quilleco', 11),
('San Rosendo', 11),
('Santa Bárbara', 11),
('Tucapel', 11),
('Yumbel', 11),
('Alto Biobío', 11);

-- Región 12: La Araucanía (IX)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Temuco', 12),
('Carahue', 12),
('Cunco', 12),
('Curarrehue', 12),
('Freire', 12),
('Galvarino', 12),
('Gorbea', 12),
('Lautaro', 12),
('Loncoche', 12),
('Melipeuco', 12),
('Nueva Imperial', 12),
('Padre Las Casas', 12),
('Perquenco', 12),
('Pitrufquén', 12),
('Pucón', 12),
('Saavedra', 12),
('Teodoro Schmidt', 12),
('Toltén', 12),
('Vilcún', 12),
('Villarrica', 12),
('Cholchol', 12),
('Angol', 12),
('Collipulli', 12),
('Curacautín', 12),
('Ercilla', 12),
('Lonquimay', 12),
('Los Sauces', 12),
('Lumaco', 12),
('Purén', 12),
('Renaico', 12),
('Traiguén', 12),
('Victoria', 12);

-- Región 13: Los Ríos (XIV)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Valdivia', 13),
('Corral', 13),
('Lanco', 13),
('Los Lagos', 13),
('Máfil', 13),
('Mariquina', 13),
('Paillaco', 13),
('Panguipulli', 13),
('La Unión', 13),
('Futrono', 13),
('Lago Ranco', 13),
('Río Bueno', 13);

-- Región 14: Los Lagos (X)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Puerto Montt', 14),
('Calbuco', 14),
('Cochamó', 14),
('Fresia', 14),
('Frutillar', 14),
('Los Muermos', 14),
('Llanquihue', 14),
('Maullín', 14),
('Puerto Varas', 14),
('Castro', 14),
('Ancud', 14),
('Chonchi', 14),
('Curaco de Vélez', 14),
('Dalcahue', 14),
('Puqueldón', 14),
('Queilén', 14),
('Quellón', 14),
('Quemchi', 14),
('Quinchao', 14),
('Osorno', 14),
('Puerto Octay', 14),
('Purranque', 14),
('Puyehue', 14),
('Río Negro', 14),
('San Juan de la Costa', 14),
('San Pablo', 14),
('Chaitén', 14),
('Futaleufú', 14),
('Hualaihué', 14),
('Palena', 14);

-- Región 15: Aysén del General Carlos Ibáñez del Campo (XI)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Coyhaique', 15),
('Lago Verde', 15),
('Aisén', 15),
('Cisnes', 15),
('Guaitecas', 15),
('Chile Chico', 15),
('Río Ibáñez', 15),
('Cochrane', 15),
('O’Higgins', 15),
('Tortel', 15);

-- Región 16: Magallanes y de la Antártica Chilena (XII)
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Punta Arenas', 16),
('Laguna Blanca', 16),
('Río Verde', 16),
('San Gregorio', 16),
('Cabo de Hornos', 16),
('Antártica', 16),
('Porvenir', 16),
('Primavera', 16),
('Timaukel', 16),
('Natales', 16),
('Torres del Paine', 16);

-- ######################################
-- # FIN DEL SCRIPT DE INSERCIÓN        #
-- ######################################