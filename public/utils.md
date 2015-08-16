* MERLO
* TRES DE FEBRERO
* FLORENCIO VARELA
* MALVINAS ARGENTINAS
* ITUZAINGO
* SAN ISIDRO
* HURLINGHAM
* LA MATANZA
* MORENO
* QUILMES
* LANUS
* SAN MIGUEL
* ESTEBAN ECHEVERRIA
* AVELLANEDA
* MORON
* SAN FERNANDO
* LOMAS DE ZAMORA
* BERAZATEGUI
* GENERAL SAN MARTIN
* VICENTE LOPEZ
* JOSE C PAZ
* ALMIRANTE BROWN
* TIGRE
* EZEIZA

`update actuales set cargo = initcap(cargo);`

UPDATE precandidatos
SET distrito = 'General San Martín'
WHERE id = 7;

`update nuevos_poligonos_gba set distrito = initcap(distrito);`

`update conourbano set sucedio_a = initcap(sucedio_a);`

`SELECT cabecera, departamento, codigo, the_geom_webmercator , ST_PointOnSurface(the_geom) the_geom FROM  departamentos_buenos_aires`


`SELECT * FROM departamentos_buenos_aires WHERE departamento LIKE  '%MERLO%' OR departamento LIKE '%TRES DE FEBRERO%' OR departamento LIKE '%FLORENCIO VARELA%' OR departamento LIKE '%MALVINAS ARGENTINAS%' OR departamento LIKE '%ITUZAINGO%' OR departamento LIKE '%SAN ISIDRO%' OR departamento LIKE '%HURLINGHAM%' OR departamento LIKE '%LA MATANZA%' OR departamento LIKE '%MORENO%' OR departamento LIKE '%QUILMES%' OR departamento LIKE '%LANUS%' OR departamento LIKE '%SAN MIGUEL%' OR departamento LIKE '%ESTEBAN ECHEVERRIA%' OR departamento LIKE '%AVELLANEDA%' OR departamento LIKE '%MORON%' OR departamento LIKE '%SAN FERNANDO%' OR departamento LIKE '%LOMAS DE ZAMORA%' OR departamento LIKE '%BERAZATEGUI%' OR departamento LIKE '%GENERAL SAN MARTIN%' OR departamento LIKE '%VICENTE LOPEZ%' OR departamento LIKE '%JOSE C PAZ%' OR departamento LIKE '%ALMIRANTE BROWN%' OR departamento LIKE '%TIGRE%' OR departamento LIKE '%EZEIZA%'
`


https://pixelbeat.cartodb.com/tables/poligonos_gba/map

topojson -o public/data/gba.json --bbox -p antes,cabecera,distrito,codigo,mandatos,frente_2011,frente_alianza,intendente,tiempocargo,votos_2011,pt2011,particularidades conourbano.geojson


topojson -o gba.json --bbox -p distrito,intendente,cargo,compite,mandatos,tiempo,antes,pt2011,votos_2011,frentealianza_2015,frente_2011 conurbano.geojson

/* Version Final, post PASO */

topojson -o gba.json --bbox -p tiempo,cargo,compite,distrito,frente_2011,frente_alianza_2015,intendente,mandatos,ptp2015,pt2011,generales,antes,votos_2011,votos_p2015 conurbano.geojson


http://bl.ocks.org/bycoffe/3230965

http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/

https://egghead.io/lessons/integrating-components-with-d3-and-angularjs

http://bl.ocks.org/mbostock/1129492

http://bl.ocks.org/eesur/be2abfb3155a38be4de4

http://plnkr.co/edit/1A11aXGBE0RPB0lC4jgA?p=preview

http://jsfiddle.net/cuckovic/FWKt5/

http://bl.ocks.org/zross/6a31f4ef9e778d94c204

http://bl.ocks.org/mpmckenna8/2fb0ffd4aa38990aff57

http://techslides.com/d3-world-maps-tooltips-zooming-and-queue

http://eyeseast.github.io/visible-data/2013/08/27/responsive-legends-with-d3/

http://bl.ocks.org/jczaplew/4444770

http://eyeseast.github.io/visible-data/2013/08/26/responsive-d3/

http://bl.ocks.org/herrstucki/5710596

http://bl.ocks.org/herrstucki/5694697

http://bl.ocks.org/timelyportfolio/7774986

http://bl.ocks.org/dougdowson/10734337

http://bl.ocks.org/dougdowson/9755247

http://bl.ocks.org/rveciana/f46df2272b289a9ce4e7

http://bl.ocks.org/dougdowson/11214484

http://bl.ocks.org/dougdowson/c169c74342fa705305c4

http://bl.ocks.org/dougdowson/8dd258e91d44c9ed637d

http://bl.ocks.org/bricedev/8aa78379efd19ca584c9

http://bl.ocks.org/bricedev/a0c5ef180272fac3aea6