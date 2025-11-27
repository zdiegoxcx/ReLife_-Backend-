--
-- PostgreSQL database dump
--

\restrict SnQGGpfgJd0JQY07ee9alzYmTdK1BcujvshjpPGgwMWswh0NRxpXGnyni9Hedpa

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: sp_registrarproducto(character varying, character varying, integer, character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_registrarproducto(p_nombre character varying, p_descripcion character varying, p_precio integer, p_usuario_email character varying, p_categoria_id integer, p_talla_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Variable para guardar el ID del nuevo producto
    v_nuevo_producto_id INT;
BEGIN
    -- Insertamos en la tabla de productos
    INSERT INTO tab_prd (
        tdp_nmb,
        tdp_des,
        tdp_pre,
        tdp_est,        -- Se asigna automáticamente
        tdp_fch,        -- Se asigna automáticamente
        tdp_usr,
        tdp_cat,
        tdp_talla
    )
    VALUES (
        p_nombre,
        p_descripcion,
        p_precio,
        TRUE,           -- Por defecto, el producto está disponible
        CURRENT_DATE,   -- Se inserta la fecha actual
        p_usuario_email,
        p_categoria_id,
        p_talla_id
    )
    -- Esta es la magia de PostgreSQL: captura el ID recién creado
    RETURNING tdp_id INTO v_nuevo_producto_id;

    -- Devolvemos el ID capturado
    RETURN v_nuevo_producto_id;
END;
$$;


ALTER FUNCTION public.sp_registrarproducto(p_nombre character varying, p_descripcion character varying, p_precio integer, p_usuario_email character varying, p_categoria_id integer, p_talla_id integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tab_cat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tab_cat (
    tct_id integer NOT NULL,
    tct_nmb character varying(50) NOT NULL
);


ALTER TABLE public.tab_cat OWNER TO postgres;

--
-- Name: tab_cat_tct_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tab_cat_tct_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tab_cat_tct_id_seq OWNER TO postgres;

--
-- Name: tab_cat_tct_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tab_cat_tct_id_seq OWNED BY public.tab_cat.tct_id;


--
-- Name: tab_com; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tab_com (
    tcom_id integer NOT NULL,
    tcom_nom character varying(100) NOT NULL,
    tcom_reg integer NOT NULL
);


ALTER TABLE public.tab_com OWNER TO postgres;

--
-- Name: tab_com_tcom_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tab_com_tcom_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tab_com_tcom_id_seq OWNER TO postgres;

--
-- Name: tab_com_tcom_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tab_com_tcom_id_seq OWNED BY public.tab_com.tcom_id;


--
-- Name: tab_img; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tab_img (
    timg_id integer NOT NULL,
    timg_url character varying(255) NOT NULL,
    timg_alt character varying(100),
    timg_prd integer NOT NULL
);


ALTER TABLE public.tab_img OWNER TO postgres;

--
-- Name: tab_img_timg_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tab_img_timg_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tab_img_timg_id_seq OWNER TO postgres;

--
-- Name: tab_img_timg_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tab_img_timg_id_seq OWNED BY public.tab_img.timg_id;


--
-- Name: tab_prd; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tab_prd (
    tdp_id integer NOT NULL,
    tdp_nmb character varying(50) NOT NULL,
    tdp_des character varying(255) NOT NULL,
    tdp_pre integer NOT NULL,
    tdp_est boolean NOT NULL,
    tdp_fch date NOT NULL,
    tdp_usr character varying(150) NOT NULL,
    tdp_cat integer NOT NULL,
    tdp_talla integer NOT NULL
);


ALTER TABLE public.tab_prd OWNER TO postgres;

--
-- Name: tab_prd_tdp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tab_prd_tdp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tab_prd_tdp_id_seq OWNER TO postgres;

--
-- Name: tab_prd_tdp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tab_prd_tdp_id_seq OWNED BY public.tab_prd.tdp_id;


--
-- Name: tab_reg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tab_reg (
    treg_id integer NOT NULL,
    treg_nom character varying(100) NOT NULL
);


ALTER TABLE public.tab_reg OWNER TO postgres;

--
-- Name: tab_reg_treg_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tab_reg_treg_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tab_reg_treg_id_seq OWNER TO postgres;

--
-- Name: tab_reg_treg_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tab_reg_treg_id_seq OWNED BY public.tab_reg.treg_id;


--
-- Name: tab_talla; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tab_talla (
    ttal_id integer NOT NULL,
    ttal_tipo character varying(10) NOT NULL,
    ttal_valor character varying(10) NOT NULL
);


ALTER TABLE public.tab_talla OWNER TO postgres;

--
-- Name: tab_talla_ttal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tab_talla_ttal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tab_talla_ttal_id_seq OWNER TO postgres;

--
-- Name: tab_talla_ttal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tab_talla_ttal_id_seq OWNED BY public.tab_talla.ttal_id;


--
-- Name: tab_usr; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tab_usr (
    tus_eml character varying(150) NOT NULL,
    tus_nmb character varying(50) NOT NULL,
    tus_ape character varying(50) NOT NULL,
    tus_psw character varying(100) NOT NULL,
    tus_fec date NOT NULL,
    tus_con character varying(50) NOT NULL,
    tus_com integer,
    tus_rol character varying(20) DEFAULT 'user'::character varying NOT NULL
);


ALTER TABLE public.tab_usr OWNER TO postgres;

--
-- Name: tab_cat tct_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_cat ALTER COLUMN tct_id SET DEFAULT nextval('public.tab_cat_tct_id_seq'::regclass);


--
-- Name: tab_com tcom_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_com ALTER COLUMN tcom_id SET DEFAULT nextval('public.tab_com_tcom_id_seq'::regclass);


--
-- Name: tab_img timg_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_img ALTER COLUMN timg_id SET DEFAULT nextval('public.tab_img_timg_id_seq'::regclass);


--
-- Name: tab_prd tdp_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_prd ALTER COLUMN tdp_id SET DEFAULT nextval('public.tab_prd_tdp_id_seq'::regclass);


--
-- Name: tab_reg treg_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_reg ALTER COLUMN treg_id SET DEFAULT nextval('public.tab_reg_treg_id_seq'::regclass);


--
-- Name: tab_talla ttal_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_talla ALTER COLUMN ttal_id SET DEFAULT nextval('public.tab_talla_ttal_id_seq'::regclass);


--
-- Data for Name: tab_cat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tab_cat (tct_id, tct_nmb) FROM stdin;
1	Chaquetas
2	Pantalones
4	Poleras
5	Pantalones
6	Polerones
7	Chaquetas
8	Zapatos
9	Camisas
10	Vestidos
11	Faldas
12	Shorts
13	Accesorios
14	Ropa Deportiva
15	Abrigos
16	Trajes
17	Blusas
18	Sweaters
19	Jeans
20	Bufanda
21	Calzado Hombre
\.


--
-- Data for Name: tab_com; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tab_com (tcom_id, tcom_nom, tcom_reg) FROM stdin;
1	Arica	1
2	Camarones	1
3	Putre	1
4	General Lagos	1
5	Iquique	2
6	Alto Hospicio	2
7	Pozo Almonte	2
8	Camiña	2
9	Colchane	2
10	Huara	2
11	Pica	2
12	Antofagasta	3
13	Mejillones	3
14	Sierra Gorda	3
15	Taltal	3
16	Calama	3
17	Ollagüe	3
18	San Pedro de Atacama	3
19	Tocopilla	3
20	María Elena	3
21	Copiapó	4
22	Caldera	4
23	Tierra Amarilla	4
24	Chañaral	4
25	Diego de Almagro	4
26	Vallenar	4
27	Alto del Carmen	4
28	Freirina	4
29	Huasco	4
30	La Serena	5
31	Coquimbo	5
32	Andacollo	5
33	La Higuera	5
34	Paiguano	5
35	Vicuña	5
36	Ovalle	5
37	Combarbalá	5
38	Monte Patria	5
39	Punitaqui	5
40	Río Hurtado	5
41	Illapel	5
42	Canela	5
43	Los Vilos	5
44	Salamanca	5
45	Valparaíso	6
46	Casablanca	6
47	Concón	6
48	Juan Fernández	6
49	Puchuncaví	6
50	Quintero	6
51	Viña del Mar	6
52	Isla de Pascua	6
53	Los Andes	6
54	Calle Larga	6
55	Rinconada	6
56	San Esteban	6
57	La Ligua	6
58	Cabildo	6
59	Papudo	6
60	Petorca	6
61	Zapallar	6
62	Quillota	6
63	Calera	6
64	Hijuelas	6
65	La Cruz	6
66	Nogales	6
67	San Antonio	6
68	Algarrobo	6
69	Cartagena	6
70	El Quisco	6
71	El Tabo	6
72	Santo Domingo	6
73	San Felipe	6
74	Catemu	6
75	Llay-Llay	6
76	Panquehue	6
77	Putaendo	6
78	Santa María	6
79	Limache	6
80	Olmué	6
81	Quilpué	6
82	Villa Alemana	6
83	Santiago	7
84	Cerrillos	7
85	Cerro Navia	7
86	Conchalí	7
87	El Bosque	7
88	Estación Central	7
89	Huechuraba	7
90	Independencia	7
91	La Cisterna	7
92	La Florida	7
93	La Granja	7
94	La Pintana	7
95	La Reina	7
96	Las Condes	7
97	Lo Barnechea	7
98	Lo Espejo	7
99	Lo Prado	7
100	Macul	7
101	Maipú	7
102	Ñuñoa	7
103	Pedro Aguirre Cerda	7
104	Peñalolén	7
105	Providencia	7
106	Pudahuel	7
107	Quilicura	7
108	Quinta Normal	7
109	Recoleta	7
110	Renca	7
111	San Joaquín	7
112	San Miguel	7
113	San Ramón	7
114	Vitacura	7
115	Puente Alto	7
116	Pirque	7
117	San José de Maipo	7
118	Colina	7
119	Lampa	7
120	Tiltil	7
121	San Bernardo	7
122	Buin	7
123	Calera de Tango	7
124	Paine	7
125	Melipilla	7
126	Alhué	7
127	Curacaví	7
128	María Pinto	7
129	San Pedro	7
130	Talagante	7
131	El Monte	7
132	Isla de Maipo	7
133	Padre Hurtado	7
134	Peñaflor	7
135	Rancagua	8
136	Codegua	8
137	Coinco	8
138	Coltauco	8
139	Doñihue	8
140	Graneros	8
141	Las Cabras	8
142	Machalí	8
143	Malloa	8
144	Mostazal	8
145	Olivar	8
146	Peumo	8
147	Pichidegua	8
148	Quinta de Tilcoco	8
149	Rengo	8
150	Requínoa	8
151	San Vicente	8
152	Pichilemu	8
153	La Estrella	8
154	Litueche	8
155	Marchihue	8
156	Navidad	8
157	Paredones	8
158	San Fernando	8
159	Chépica	8
160	Chimbarongo	8
161	Lolol	8
162	Nancagua	8
163	Palmilla	8
164	Peralillo	8
165	Placilla	8
166	Pumanque	8
167	Santa Cruz	8
168	Talca	9
169	Constitución	9
170	Curepto	9
171	Empedrado	9
172	Maule	9
173	Pelarco	9
174	Pencahue	9
175	Río Claro	9
176	San Clemente	9
177	San Rafael	9
178	Cauquenes	9
179	Chanco	9
180	Pelluhue	9
181	Parraguas	9
182	Linares	9
183	Colbún	9
184	Longaví	9
185	Parral	9
186	Retiro	9
187	San Javier	9
188	Villa Alegre	9
189	Yerbas Buenas	9
190	Curicó	9
191	Hualañé	9
192	Licantén	9
193	Molina	9
194	Rauco	9
195	Romeral	9
196	Sagrada Familia	9
197	Teno	9
198	Vichuquén	9
199	Chillán	10
200	Bulnes	10
201	Cobquecura	10
202	Coelemu	10
203	Coihueco	10
204	El Carmen	10
205	Ninhue	10
206	Ñiquén	10
207	Pemuco	10
208	Pinto	10
209	Portezuelo	10
210	Quillón	10
211	Quirihue	10
212	Ránquil	10
213	San Carlos	10
214	San Fabián	10
215	San Ignacio	10
216	San Nicolás	10
217	Treguaco	10
218	Yungay	10
219	Chillán Viejo	10
220	Concepción	11
221	Coronel	11
222	Chiguayante	11
223	Florida	11
224	Hualqui	11
225	Lota	11
226	Penco	11
227	San Pedro de la Paz	11
228	Santa Juana	11
229	Talcahuano	11
230	Tomé	11
231	Hualpén	11
232	Lebu	11
233	Arauco	11
234	Cañete	11
235	Contulmo	11
236	Curanilahue	11
237	Los Álamos	11
238	Tirúa	11
239	Los Ángeles	11
240	Antuco	11
241	Cabrero	11
242	Laja	11
243	Mulchén	11
244	Nacimiento	11
245	Negrete	11
246	Quilaco	11
247	Quilleco	11
248	San Rosendo	11
249	Santa Bárbara	11
250	Tucapel	11
251	Yumbel	11
252	Alto Biobío	11
253	Temuco	12
254	Carahue	12
255	Cunco	12
256	Curarrehue	12
257	Freire	12
258	Galvarino	12
259	Gorbea	12
260	Lautaro	12
261	Loncoche	12
262	Melipeuco	12
263	Nueva Imperial	12
264	Padre Las Casas	12
265	Perquenco	12
266	Pitrufquén	12
267	Pucón	12
268	Saavedra	12
269	Teodoro Schmidt	12
270	Toltén	12
271	Vilcún	12
272	Villarrica	12
273	Cholchol	12
274	Angol	12
275	Collipulli	12
276	Curacautín	12
277	Ercilla	12
278	Lonquimay	12
279	Los Sauces	12
280	Lumaco	12
281	Purén	12
282	Renaico	12
283	Traiguén	12
284	Victoria	12
285	Valdivia	13
286	Corral	13
287	Lanco	13
288	Los Lagos	13
289	Máfil	13
290	Mariquina	13
291	Paillaco	13
292	Panguipulli	13
293	La Unión	13
294	Futrono	13
295	Lago Ranco	13
296	Río Bueno	13
297	Puerto Montt	14
298	Calbuco	14
299	Cochamó	14
300	Fresia	14
301	Frutillar	14
302	Los Muermos	14
303	Llanquihue	14
304	Maullín	14
305	Puerto Varas	14
306	Castro	14
307	Ancud	14
308	Chonchi	14
309	Curaco de Vélez	14
310	Dalcahue	14
311	Puqueldón	14
312	Queilén	14
313	Quellón	14
314	Quemchi	14
315	Quinchao	14
316	Osorno	14
317	Puerto Octay	14
318	Purranque	14
319	Puyehue	14
320	Río Negro	14
321	San Juan de la Costa	14
322	San Pablo	14
323	Chaitén	14
324	Futaleufú	14
325	Hualaihué	14
326	Palena	14
327	Coyhaique	15
328	Lago Verde	15
329	Aisén	15
330	Cisnes	15
331	Guaitecas	15
332	Chile Chico	15
333	Río Ibáñez	15
334	Cochrane	15
335	O’Higgins	15
336	Tortel	15
337	Punta Arenas	16
338	Laguna Blanca	16
339	Río Verde	16
340	San Gregorio	16
341	Cabo de Hornos	16
342	Antártica	16
343	Porvenir	16
344	Primavera	16
345	Timaukel	16
346	Natales	16
347	Torres del Paine	16
\.


--
-- Data for Name: tab_img; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tab_img (timg_id, timg_url, timg_alt, timg_prd) FROM stdin;
3	/uploads/imagen-1764212690921-364563922.jpg	Men’s Leather Western Boots	8
4	/uploads/imagen-1764212989904-666748709.jpg	CROCS W6/M4	9
5	/uploads/imagen-1764213184119-694057974.jpg	Zapatos de payaso 	10
6	/uploads/imagen-1764213625541-185856009.jpg	CONVERSE ALL STAR - Poco uso	11
7	/uploads/imagen-1764213705763-799339929.jpg	Botas Cuero De 	12
8	/uploads/imagen-1764213756139-767270226.jpg	Botos Punta Fierro	13
9	/uploads/imagen-1764213954658-728758657.jpg	Botas Viejas	14
10	/uploads/imagen-1764215285447-223697338.jpg	Chaqueta de cuero	15
12	/uploads/imagen-1764217150695-301038890.jpg	Camisa	17
13	/uploads/imagen-1764217150699-415309186.jpg	Camisa	17
\.


--
-- Data for Name: tab_prd; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tab_prd (tdp_id, tdp_nmb, tdp_des, tdp_pre, tdp_est, tdp_fch, tdp_usr, tdp_cat, tdp_talla) FROM stdin;
8	Men’s Leather Western Boots	Como nuevo, solo gente seria 	85000	t	2025-11-27	zdiego926@gmail.com	21	17
9	CROCS W6/M4	Unos par de usos, venta por necesidad...	20000	t	2025-11-27	aalbornoz@it.ucsc.cl	21	15
10	Zapatos de payaso 	Solo reales interesados.... :)	25000	t	2025-11-27	aalbornoz@it.ucsc.cl	21	15
11	CONVERSE ALL STAR - Poco uso	Poco uso, me despido de mis queridas, por necesidad	30000	t	2025-11-27	aalbornoz@it.ucsc.cl	21	15
12	Botas Cuero De 	Impeques, confexionadas en Mexico, cuero 100% 	78000	t	2025-11-27	zdiego926@gmail.com	21	16
13	Botos Punta Fierro	Nuevos, me lo dieron en la pega y me quedaron grandes.	12000	t	2025-11-27	aalbornoz@it.ucsc.cl	21	18
14	Botas Viejas	Mucho valor sentimental 	5000	t	2025-11-27	aalbornoz@it.ucsc.cl	21	16
15	Chaqueta de cuero	Impecable 	60000	t	2025-11-27	aalbornoz@it.ucsc.cl	1	9
17	Camisa	En perfecto estadp	80000	t	2025-11-27	zdiego926@gmail.com	9	9
\.


--
-- Data for Name: tab_reg; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tab_reg (treg_id, treg_nom) FROM stdin;
1	Arica y Parinacota
2	Tarapacá
3	Antofagasta
4	Atacama
5	Coquimbo
6	Valparaíso
7	Metropolitana de Santiago
8	Libertador General Bernardo O’Higgins
9	Maule
10	Ñuble
11	Biobío
12	La Araucanía
13	Los Ríos
14	Los Lagos
15	Aysén del General Carlos Ibáñez del Campo
16	Magallanes y de la Antártica Chilena
\.


--
-- Data for Name: tab_talla; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tab_talla (ttal_id, ttal_tipo, ttal_valor) FROM stdin;
4	Letra	XXS
5	Letra	XS
6	Letra	S
7	Letra	M
8	Letra	L
9	Letra	XL
10	Letra	XXL
11	Letra	XXXL
12	Numero	34
13	Numero	36
14	Numero	38
15	Numero	40
16	Numero	42
17	Numero	44
18	Numero	46
19	Numero	48
20	Numero	50
21	Numero	52
22	Numero	54
23	Calzado	35
24	Calzado	36
25	Calzado	37
26	Calzado	38
27	Calzado	39
28	Calzado	40
29	Calzado	41
30	Calzado	42
31	Calzado	43
32	Calzado	44
33	Calzado	45
34	Niños	2
35	Niños	4
36	Niños	6
37	Niños	8
38	Niños	10
39	Niños	12
40	Niños	14
41	Niños	16
42	Letra	TU
\.


--
-- Data for Name: tab_usr; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tab_usr (tus_eml, tus_nmb, tus_ape, tus_psw, tus_fec, tus_con, tus_com, tus_rol) FROM stdin;
zdiego926@gmail.com	Diego	Zuñiga	diego123	2025-11-10	a wsp	239	admin
aalbornoz@it.ucsc.cl	Adam	Albornoz	123	2025-11-26	instagram => @adam3esh	247	user
\.


--
-- Name: tab_cat_tct_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tab_cat_tct_id_seq', 21, true);


--
-- Name: tab_com_tcom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tab_com_tcom_id_seq', 347, true);


--
-- Name: tab_img_timg_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tab_img_timg_id_seq', 13, true);


--
-- Name: tab_prd_tdp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tab_prd_tdp_id_seq', 17, true);


--
-- Name: tab_reg_treg_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tab_reg_treg_id_seq', 16, true);


--
-- Name: tab_talla_ttal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tab_talla_ttal_id_seq', 42, true);


--
-- Name: tab_cat tab_cat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_cat
    ADD CONSTRAINT tab_cat_pkey PRIMARY KEY (tct_id);


--
-- Name: tab_com tab_com_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_com
    ADD CONSTRAINT tab_com_pkey PRIMARY KEY (tcom_id);


--
-- Name: tab_img tab_img_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_img
    ADD CONSTRAINT tab_img_pkey PRIMARY KEY (timg_id);


--
-- Name: tab_prd tab_prd_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_prd
    ADD CONSTRAINT tab_prd_pkey PRIMARY KEY (tdp_id);


--
-- Name: tab_reg tab_reg_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_reg
    ADD CONSTRAINT tab_reg_pkey PRIMARY KEY (treg_id);


--
-- Name: tab_talla tab_talla_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_talla
    ADD CONSTRAINT tab_talla_pkey PRIMARY KEY (ttal_id);


--
-- Name: tab_usr tab_usr_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_usr
    ADD CONSTRAINT tab_usr_pkey PRIMARY KEY (tus_eml);


--
-- Name: tab_com tab_com_tcom_reg_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_com
    ADD CONSTRAINT tab_com_tcom_reg_fkey FOREIGN KEY (tcom_reg) REFERENCES public.tab_reg(treg_id);


--
-- Name: tab_img tab_img_timg_prd_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_img
    ADD CONSTRAINT tab_img_timg_prd_fkey FOREIGN KEY (timg_prd) REFERENCES public.tab_prd(tdp_id);


--
-- Name: tab_prd tab_prd_tdp_cat_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_prd
    ADD CONSTRAINT tab_prd_tdp_cat_fkey FOREIGN KEY (tdp_cat) REFERENCES public.tab_cat(tct_id);


--
-- Name: tab_prd tab_prd_tdp_talla_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_prd
    ADD CONSTRAINT tab_prd_tdp_talla_fkey FOREIGN KEY (tdp_talla) REFERENCES public.tab_talla(ttal_id);


--
-- Name: tab_prd tab_prd_tdp_usr_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_prd
    ADD CONSTRAINT tab_prd_tdp_usr_fkey FOREIGN KEY (tdp_usr) REFERENCES public.tab_usr(tus_eml);


--
-- Name: tab_usr tab_usr_tus_com_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tab_usr
    ADD CONSTRAINT tab_usr_tus_com_fkey FOREIGN KEY (tus_com) REFERENCES public.tab_com(tcom_id);


--
-- PostgreSQL database dump complete
--

\unrestrict SnQGGpfgJd0JQY07ee9alzYmTdK1BcujvshjpPGgwMWswh0NRxpXGnyni9Hedpa

