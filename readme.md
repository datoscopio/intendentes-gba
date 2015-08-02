MERLO
TRES DE FEBRERO
FLORENCIO VARELA
MALVINAS ARGENTINAS
ITUZAINGO
SAN ISIDRO
HURLINGHAM
LA MATANZA
MORENO
QUILMES
LANUS
SAN MIGUEL
ESTEBAN ECHEVERRIA
AVELLANEDA
MORON
SAN FERNANDO
LOMAS DE ZAMORA
BERAZATEGUI
GENERAL SAN MARTIN
VICENTE LOPEZ
JOSE C PAZ
ALMIRANTE BROWN
TIGRE
EZEIZA



SELECT cabecera, departamento, codigo, the_geom_webmercator , ST_PointOnSurface(the_geom) the_geom FROM  departamentos_buenos_aires

http://bl.ocks.org/bycoffe/3230965

http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/

https://egghead.io/lessons/integrating-components-with-d3-and-angularjs


SELECT * FROM gran_buenos_aires WHERE departamento LIKE '%TIGRE%' OR departamento LIKE '%EZEIZA%'

SELECT cabecera, departamento, codigo, the_geom_webmercator , ST_PointOnSurface(the_geom) the_geom FROM  puntos_gba

SELECT cabecera, departamento, codigo, the_geom_webmercator , ST_PointOnSurface(the_geom) the_geom FROM  departamentos_buenos_aires


SELECT * FROM departamentos_buenos_aires WHERE departamento LIKE  '%MERLO%' OR departamento LIKE '%TRES DE FEBRERO%' OR departamento LIKE '%FLORENCIO VARELA%' OR departamento LIKE '%MALVINAS ARGENTINAS%' OR departamento LIKE '%ITUZAINGO%' OR departamento LIKE '%SAN ISIDRO%' OR departamento LIKE '%HURLINGHAM%' OR departamento LIKE '%LA MATANZA%' OR departamento LIKE '%MORENO%' OR departamento LIKE '%QUILMES%' OR departamento LIKE '%LANUS%' OR departamento LIKE '%SAN MIGUEL%' OR departamento LIKE '%ESTEBAN ECHEVERRIA%' OR departamento LIKE '%AVELLANEDA%' OR departamento LIKE '%MORON%' OR departamento LIKE '%SAN FERNANDO%' OR departamento LIKE '%LOMAS DE ZAMORA%' OR departamento LIKE '%BERAZATEGUI%' OR departamento LIKE '%GENERAL SAN MARTIN%' OR departamento LIKE '%VICENTE LOPEZ%' OR departamento LIKE '%JOSE C PAZ%' OR departamento LIKE '%ALMIRANTE BROWN%' OR departamento LIKE '%TIGRE%' OR departamento LIKE '%EZEIZA%'

https://pixelbeat.cartodb.com/tables/poligonos_gba/map

topojson -o gba.json --bbox -p cabecera,departamento,codigo gba.geojson poligonos_gba.geojson


http://bl.ocks.org/mbostock/1129492

http://bl.ocks.org/eesur/be2abfb3155a38be4de4

http://plnkr.co/edit/1A11aXGBE0RPB0lC4jgA?p=preview