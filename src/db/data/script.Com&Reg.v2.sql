-- ##################################################################
-- # SCRIPT DE INSERCIÓN DE REGIONES Y COMUNAS DE CHILE (16 REGIONES)
-- #
-- # MÉTODO DE INSERCIÓN: Subconsultas para asegurar integridad (FK)
-- ##################################################################


-- ===============================================
-- 1. INSERCIÓN DE REGIONES (tab_reg)
-- ===============================================

INSERT INTO tab_reg (treg_nom) VALUES
('Arica y Parinacota'),                       -- XV
('Tarapacá'),                                 -- I
('Antofagasta'),                              -- II
('Atacama'),                                  -- III
('Coquimbo'),                                 -- IV
('Valparaíso'),                               -- V
('Metropolitana de Santiago'),                 -- RM
('Libertador General Bernardo O’Higgins'),    -- VI
('Maule'),                                    -- VII
('Ñuble'),                                    -- XVI
('Biobío'),                                   -- VIII
('La Araucanía'),                             -- IX
('Los Ríos'),                                 -- XIV
('Los Lagos'),                                -- X
('Aysén del General Carlos Ibáñez del Campo'),-- XI
('Magallanes y de la Antártica Chilena');     -- XII


-- ===============================================
-- 2. INSERCIÓN DE COMUNAS (tab_com)
--    Uso de subconsultas (SELECT) para obtener el treg_id
-- ===============================================


-- ---------------------------------
-- REGIÓN: Arica y Parinacota (XV)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Arica', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Arica y Parinacota')),
('Camarones', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Arica y Parinacota')),
('Putre', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Arica y Parinacota')),
('General Lagos', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Arica y Parinacota'));

-- ---------------------------------
-- REGIÓN: Tarapacá (I)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Iquique', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Tarapacá')),
('Alto Hospicio', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Tarapacá')),
('Pozo Almonte', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Tarapacá')),
('Camiña', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Tarapacá')),
('Colchane', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Tarapacá')),
('Huara', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Tarapacá')),
('Pica', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Tarapacá'));

-- ---------------------------------
-- REGIÓN: Antofagasta (II)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Antofagasta', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Antofagasta')),
('Mejillones', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Antofagasta')),
('Sierra Gorda', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Antofagasta')),
('Taltal', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Antofagasta')),
('Calama', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Antofagasta')),
('Ollagüe', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Antofagasta')),
('San Pedro de Atacama', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Antofagasta')),
('Tocopilla', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Antofagasta')),
('María Elena', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Antofagasta'));

-- ---------------------------------
-- REGIÓN: Atacama (III)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Copiapó', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Atacama')),
('Caldera', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Atacama')),
('Tierra Amarilla', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Atacama')),
('Chañaral', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Atacama')),
('Diego de Almagro', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Atacama')),
('Vallenar', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Atacama')),
('Alto del Carmen', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Atacama')),
('Freirina', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Atacama')),
('Huasco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Atacama'));

-- ---------------------------------
-- REGIÓN: Coquimbo (IV)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('La Serena', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('Coquimbo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('Andacollo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('La Higuera', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('Paiguano', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('Vicuña', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('Ovalle', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('Combarbalá', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('Monte Patria', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('Punitaqui', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('Río Hurtado', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('Illapel', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('Canela', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('Los Vilos', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo')),
('Salamanca', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Coquimbo'));

-- ---------------------------------
-- REGIÓN: Valparaíso (V)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Valparaíso', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Casablanca', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Concón', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Juan Fernández', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Puchuncaví', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Quintero', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Viña del Mar', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Isla de Pascua', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Los Andes', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Calle Larga', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Rinconada', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('San Esteban', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('La Ligua', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Cabildo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Papudo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Petorca', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Zapallar', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Quillota', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('La Calera', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Hijuelas', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('La Cruz', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Nogales', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('San Antonio', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Algarrobo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Cartagena', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('El Quisco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('El Tabo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Santo Domingo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('San Felipe', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Catemu', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Llay-Llay', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Panquehue', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Putaendo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Santa María', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Limache', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Olmué', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Quilpué', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso')),
('Villa Alemana', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Valparaíso'));

-- ---------------------------------
-- REGIÓN: Metropolitana de Santiago (RM)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Cerrillos', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Cerro Navia', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Conchalí', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('El Bosque', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Estación Central', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Huechuraba', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Independencia', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('La Cisterna', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('La Florida', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('La Granja', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('La Pintana', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('La Reina', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Las Condes', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Lo Barnechea', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Lo Espejo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Lo Prado', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Macul', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Maipú', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Ñuñoa', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Pedro Aguirre Cerda', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Peñalolén', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Providencia', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Pudahuel', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Quilicura', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Quinta Normal', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Recoleta', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Renca', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('San Joaquín', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('San Miguel', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('San Ramón', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Santiago', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Vitacura', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Puente Alto', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Pirque', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('San José de Maipo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Colina', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Lampa', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Tiltil', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('San Bernardo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Buin', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Calera de Tango', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Paine', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Melipilla', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Alhué', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Curacaví', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('María Pinto', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('San Pedro', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Talagante', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('El Monte', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Isla de Maipo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Padre Hurtado', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago')),
('Peñaflor', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Metropolitana de Santiago'));

-- ---------------------------------
-- REGIÓN: Libertador General Bernardo O’Higgins (VI)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Rancagua', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Codegua', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Coinco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Coltauco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Doñihue', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Graneros', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Las Cabras', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Machalí', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Malloa', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Mostazal', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Olivar', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Peumo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Pichidegua', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Quinta de Tilcoco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Rengo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Requínoa', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('San Vicente', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Pichilemu', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('La Estrella', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Litueche', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Marchihue', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Navidad', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Paredones', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('San Fernando', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Chépica', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Chimbarongo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Lolol', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Nancagua', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Palmilla', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Peralillo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Placilla', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Pumanque', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins')),
('Santa Cruz', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Libertador General Bernardo O’Higgins'));

-- ---------------------------------
-- REGIÓN: Maule (VII)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Talca', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Constitución', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Curepto', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Empedrado', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Maule', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Pelarco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Pencahue', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Río Claro', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('San Clemente', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('San Rafael', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Cauquenes', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Chanco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Pelluhue', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Parraguas', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Linares', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Colbún', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Longaví', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Parral', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Retiro', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('San Javier', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Villa Alegre', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Yerbas Buenas', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Curicó', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Hualañé', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Licantén', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Molina', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Rauco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Romeral', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Sagrada Familia', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Teno', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule')),
('Vichuquén', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Maule'));

-- ---------------------------------
-- REGIÓN: Ñuble (XVI)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Chillán', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Bulnes', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Cobquecura', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Coelemu', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Coihueco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('El Carmen', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Ninhue', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Ñiquén', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Pemuco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Pinto', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Portezuelo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Quillón', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Quirihue', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Ránquil', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('San Carlos', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('San Fabián', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('San Ignacio', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('San Nicolás', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Treguaco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Yungay', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble')),
('Chillán Viejo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Ñuble'));

-- ---------------------------------
-- REGIÓN: Biobío (VIII)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Concepción', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Coronel', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Chiguayante', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Florida', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Hualqui', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Lota', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Penco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('San Pedro de la Paz', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Santa Juana', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Talcahuano', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Tomé', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Hualpén', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Lebu', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Arauco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Cañete', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Contulmo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Curanilahue', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Los Álamos', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Tirúa', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Los Ángeles', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Antuco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Cabrero', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Laja', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Mulchén', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Nacimiento', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Negrete', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Quilaco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Quilleco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('San Rosendo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Santa Bárbara', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Tucapel', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Yumbel', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío')),
('Alto Biobío', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Biobío'));

-- ---------------------------------
-- REGIÓN: La Araucanía (IX)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Temuco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Carahue', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Cunco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Curarrehue', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Freire', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Galvarino', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Gorbea', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Lautaro', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Loncoche', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Melipeuco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Nueva Imperial', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Padre Las Casas', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Perquenco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Pitrufquén', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Pucón', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Saavedra', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Teodoro Schmidt', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Toltén', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Vilcún', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Villarrica', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Cholchol', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Angol', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Collipulli', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Curacautín', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Ercilla', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Lonquimay', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Los Sauces', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Lumaco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Purén', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Renaico', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Traiguén', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía')),
('Victoria', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'La Araucanía'));

-- ---------------------------------
-- REGIÓN: Los Ríos (XIV)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Valdivia', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Ríos')),
('Corral', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Ríos')),
('Lanco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Ríos')),
('Los Lagos', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Ríos')),
('Máfil', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Ríos')),
('Mariquina', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Ríos')),
('Paillaco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Ríos')),
('Panguipulli', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Ríos')),
('La Unión', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Ríos')),
('Futrono', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Ríos')),
('Lago Ranco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Ríos')),
('Río Bueno', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Ríos'));

-- ---------------------------------
-- REGIÓN: Los Lagos (X)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Puerto Montt', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Calbuco', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Cochamó', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Fresia', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Frutillar', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Los Muermos', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Llanquihue', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Maullín', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Puerto Varas', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Castro', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Ancud', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Chonchi', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Curaco de Vélez', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Dalcahue', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Puqueldón', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Queilén', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Quellón', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Quemchi', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Quinchao', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Osorno', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Puerto Octay', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Purranque', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Puyehue', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Río Negro', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('San Juan de la Costa', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('San Pablo', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Chaitén', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Futaleufú', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Hualaihué', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos')),
('Palena', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Los Lagos'));

-- ---------------------------------
-- REGIÓN: Aysén del General Carlos Ibáñez del Campo (XI)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Coyhaique', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Aysén del General Carlos Ibáñez del Campo')),
('Lago Verde', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Aysén del General Carlos Ibáñez del Campo')),
('Aisén', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Aysén del General Carlos Ibáñez del Campo')),
('Cisnes', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Aysén del General Carlos Ibáñez del Campo')),
('Guaitecas', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Aysén del General Carlos Ibáñez del Campo')),
('Chile Chico', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Aysén del General Carlos Ibáñez del Campo')),
('Río Ibáñez', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Aysén del General Carlos Ibáñez del Campo')),
('Cochrane', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Aysén del General Carlos Ibáñez del Campo')),
('O’Higgins', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Aysén del General Carlos Ibáñez del Campo')),
('Tortel', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Aysén del General Carlos Ibáñez del Campo'));

-- ---------------------------------
-- REGIÓN: Magallanes y de la Antártica Chilena (XII)
-- ---------------------------------
INSERT INTO tab_com (tcom_nom, tcom_reg) VALUES
('Punta Arenas', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Magallanes y de la Antártica Chilena')),
('Laguna Blanca', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Magallanes y de la Antártica Chilena')),
('Río Verde', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Magallanes y de la Antártica Chilena')),
('San Gregorio', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Magallanes y de la Antártica Chilena')),
('Cabo de Hornos', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Magallanes y de la Antártica Chilena')),
('Antártica', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Magallanes y de la Antártica Chilena')),
('Porvenir', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Magallanes y de la Antártica Chilena')),
('Primavera', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Magallanes y de la Antártica Chilena')),
('Timaukel', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Magallanes y de la Antártica Chilena')),
('Natales', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Magallanes y de la Antártica Chilena')),
('Torres del Paine', (SELECT treg_id FROM tab_reg WHERE treg_nom = 'Magallanes y de la Antártica Chilena'));

-- ##################################################################
-- # FIN DEL SCRIPT
-- ##################################################################