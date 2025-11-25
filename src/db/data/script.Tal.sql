-- ===============================================
-- SCRIPT DE POBLADO DE TALLAS (tab_talla)
-- ===============================================

-- Opcional: Limpiar la tabla antes de insertar (reinicia los IDs)
-- TRUNCATE TABLE tab_talla RESTART IDENTITY CASCADE;

-- 1. TALLAS POR LETRA (Camisetas, Polerones, Chaquetas, etc.)
INSERT INTO tab_talla (ttal_tipo, ttal_valor) VALUES
('Letra', 'XXS'),
('Letra', 'XS'),
('Letra', 'S'),
('Letra', 'M'),
('Letra', 'L'),
('Letra', 'XL'),
('Letra', 'XXL'),
('Letra', 'XXXL');

-- 2. TALLAS NUMÉRICAS (Pantalones, Jeans - Medida estándar Chile/Europa)
INSERT INTO tab_talla (ttal_tipo, ttal_valor) VALUES
('Numero', '34'),
('Numero', '36'),
('Numero', '38'),
('Numero', '40'),
('Numero', '42'),
('Numero', '44'),
('Numero', '46'),
('Numero', '48'),
('Numero', '50'),
('Numero', '52'),
('Numero', '54');

-- 3. TALLAS DE CALZADO (Zapatillas, Zapatos)
-- Nota: Puedes etiquetarlas como 'Numero' o crear un tipo 'Calzado' si prefieres diferenciarlas.
-- Aquí las pondré como 'Calzado' para mayor claridad en los filtros, 
-- pero si tu frontend solo espera 'Numero', cámbialo a 'Numero'.
INSERT INTO tab_talla (ttal_tipo, ttal_valor) VALUES
('Calzado', '35'),
('Calzado', '36'),
('Calzado', '37'),
('Calzado', '38'),
('Calzado', '39'),
('Calzado', '40'),
('Calzado', '41'),
('Calzado', '42'),
('Calzado', '43'),
('Calzado', '44'),
('Calzado', '45');

-- 4. TALLAS INFANTILES (Opcional)
INSERT INTO tab_talla (ttal_tipo, ttal_valor) VALUES
('Niños', '2'),
('Niños', '4'),
('Niños', '6'),
('Niños', '8'),
('Niños', '10'),
('Niños', '12'),
('Niños', '14'),
('Niños', '16');

-- Fin del script