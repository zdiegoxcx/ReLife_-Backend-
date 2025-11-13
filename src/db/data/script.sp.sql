CREATE FUNCTION sp_RegistrarProducto(
    p_nombre VARCHAR(50),
    p_descripcion VARCHAR(255),
    p_precio INT,
    p_usuario_email VARCHAR(150),
    p_categoria_id INT,
    p_talla_id INT
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_nuevo_producto_id INT;
BEGIN

    INSERT INTO tab_prd (
        tdp_nmb,
        tdp_des,
        tdp_pre,
        tdp_est,
        tdp_fch,
        tdp_usr,
        tdp_cat,
        tdp_talla
    )
    VALUES (
        p_nombre,
        p_descripcion,
        p_precio,
        TRUE,
        CURRENT_DATE,
        p_usuario_email,
        p_categoria_id,
        p_talla_id
    )
    RETURNING tdp_id INTO v_nuevo_producto_id;


    RETURN v_nuevo_producto_id
END;
$$;