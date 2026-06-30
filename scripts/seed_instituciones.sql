-- Generated: instituciones from centros.json
-- Mapped to estados/municipios/parroquias from seed

-- First, ensure the geo seed is loaded
-- Run scripts/seed_geo.sql first if you haven't already

-- Total: 310 instituciones
-- 1 sin municipio

do $$ 
begin

  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('CC Forum Plaza - Lechería', 'Centro Comercial Forum Plaza, Lechería',
    (select id from public.parroquia where nombre = 'LECHERIAS'
      and municipio_id = (select id from public.municipio where nombre = 'L/DIEGO BAUTISTA'
        and estado_id = (select id from public.estado where nombre = 'ANZOATEGUI'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: El Pitazo (elpitazo.net), centros de acopio | Maps: https://maps.google.com/?q=10.188,-64.68',
    10.188, -64.68,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Plaza de Puerto Príncipe (ubicación por confirmar)', 'Plaza de Puerto Príncipe, Anzoátegui',
    (select id from public.parroquia where nombre = 'LECHERIAS'
      and municipio_id = (select id from public.municipio where nombre = 'L/DIEGO BAUTISTA'
        and estado_id = (select id from public.estado where nombre = 'ANZOATEGUI'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: El Pitazo (elpitazo.net), centros de acopio (ubicación aproximada, confirmar) | Maps: https://maps.google.com/?q=10.13,-64.69',
    10.13, -64.69,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sociedad civil', 'Playa Mansa',
    (select id from public.parroquia where nombre = 'LECHERIAS'
      and municipio_id = (select id from public.municipio where nombre = 'L/DIEGO BAUTISTA'
        and estado_id = (select id from public.estado where nombre = 'ANZOATEGUI'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado', 'desde las 10 am hasta las 6 pm aprox.', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.187,-64.696',
    10.187, -64.696,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Gobernación del Estado Anzoátegui — Anzoátegui Solidario', 'Sede de la Gobernación del Estado Anzoátegui, Av. 5 de Julio, Barcelona',
    (select id from public.parroquia where nombre = 'EL CARMEN'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVAR'
        and estado_id = (select id from public.estado where nombre = 'ANZOATEGUI'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | ropa en buen estado | colchones, almohadas y colchones inflables | mantas y cobijas', '', '',
    'Iniciativa “Anzoátegui Solidario”. La red incluye además las Alcaldías y sedes de Protección Civil del estado. Reciben arroz, pasta, granos, enlatados, agua mineral, leche en polvo; ropa y calzado para niños y adultos (en buen estado y previamente lavada); colchones, literas, kit de limpieza, mosquiteros y sábanas; pañales (niños y adultos), toallas sanitarias, jabón, crema dental; medicamentos e insumos médicos. | Fuente: Flyer oficial Gobierno Bolivariano del Estado Anzoátegui | Maps: https://maps.google.com/?q=Gobernaci%C3%B3n+del+Estado+Anzo%C3%A1tegui+Barcelona',
    10.134, -64.685,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Protección Civil — Barcelona', 'Sede de Protección Civil, Av. Fuerzas Armadas, Barcelona, Anzoátegui',
    (select id from public.parroquia where nombre = 'EL CARMEN'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVAR'
        and estado_id = (select id from public.estado where nombre = 'ANZOATEGUI'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | ropa en buen estado | mantas y cobijas', '', '',
    'Iniciativa “Anzoátegui Solidario” — Gobernación del Estado Anzoátegui. | Fuente: Flyer oficial Gobierno Bolivariano del Estado Anzoátegui | Maps: https://maps.google.com/?q=Protecci%C3%B3n+Civil+Av+Fuerzas+Armadas+Barcelona+Anzo%C3%A1tegui',
    10.133, -64.689,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('ugma sede principal Barcelona', 'Avenida intercomunal',
    (select id from public.parroquia where nombre = 'EL CARMEN'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVAR'
        and estado_id = (select id from public.estado where nombre = 'ANZOATEGUI'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario | Maps: https://maps.google.com/?q=10.1664,-64.6834',
    10.1664, -64.6834,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Protección Civil — Puerto La Cruz', 'Sede de Protección Civil, Paseo de la Cruz y el Mar, Puerto La Cruz, Anzoátegui',
    (select id from public.parroquia where nombre = 'POZUELOS'
      and municipio_id = (select id from public.municipio where nombre = 'SOTILLO'
        and estado_id = (select id from public.estado where nombre = 'ANZOATEGUI'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | ropa en buen estado | mantas y cobijas', '', '',
    'Iniciativa “Anzoátegui Solidario” — Gobernación del Estado Anzoátegui. | Fuente: Flyer oficial Gobierno Bolivariano del Estado Anzoátegui | Maps: https://maps.google.com/?q=Paseo+de+la+Cruz+y+el+Mar+Puerto+La+Cruz',
    10.22, -64.63,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('El Elevado — Puerto La Cruz', 'El Elevado, Puerto La Cruz, Anzoátegui',
    (select id from public.parroquia where nombre = 'POZUELOS'
      and municipio_id = (select id from public.municipio where nombre = 'SOTILLO'
        and estado_id = (select id from public.estado where nombre = 'ANZOATEGUI'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Iniciativa “Anzoátegui Solidario” — Gobernación del Estado Anzoátegui. | Fuente: Flyer oficial Gobierno Bolivariano del Estado Anzoátegui | Maps: https://maps.google.com/?q=El+Elevado+Puerto+La+Cruz',
    10.223, -64.628,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Polideportivo La Caraqueña', 'Polideportivo La Caraqueña, Puerto La Cruz, Anzoátegui',
    (select id from public.parroquia where nombre = 'POZUELOS'
      and municipio_id = (select id from public.municipio where nombre = 'SOTILLO'
        and estado_id = (select id from public.estado where nombre = 'ANZOATEGUI'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Iniciativa “Anzoátegui Solidario” — Gobernación del Estado Anzoátegui. | Fuente: Flyer oficial Gobierno Bolivariano del Estado Anzoátegui · @noticiasorienteve | Maps: https://maps.google.com/?q=Polideportivo+La+Caraque%C3%B1a+Puerto+La+Cruz',
    10.216, -64.644,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Hotel Paradise Puerto la Cruz', 'Paseo Colón, Puerto La Cruz',
    (select id from public.parroquia where nombre = 'POZUELOS'
      and municipio_id = (select id from public.municipio where nombre = 'SOTILLO'
        and estado_id = (select id from public.estado where nombre = 'ANZOATEGUI'))),
    'alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Fuente: Reporte comunitario | Maps: https://maps.google.com/?q=10.2278,-64.6329',
    10.2278, -64.6329,
    'paradiseplc');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Club Camarón', 'Calle La Romana frente al Liceo Josefina Crespo, Cagua',
    (select id from public.parroquia where nombre = 'CAGUA'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | ropa en buen estado', '4143456992', '',
    'Fuente: Publicado en redes sociales | Maps: https://maps.google.com/?q=10.17092876,-67.44659363',
    10.17092876, -67.44659363,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Hyper Jumbo — Maracay', 'Hyper Jumbo, Maracay',
    (select id from public.parroquia where nombre = 'LAS DELICIAS'
      and municipio_id = (select id from public.municipio where nombre = 'GIRARDOT'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | mantas y cobijas | ropa en buen estado | alimentos para mascotas', '', '',
    'Fuente: Story @quehayenmaracay · @soysanah | Maps: https://maps.google.com/?q=Hyper+Jumbo+Maracay',
    10.253, -67.601,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Colegio San José — Maristas', 'Aula de Dibujo II (Media General), Colegio San José, Maracay · Horario: a partir del viernes 26 de junio de 2026, de 9:00 a.m. a 12:00 p.m.',
    (select id from public.parroquia where nombre = 'LAS DELICIAS'
      and municipio_id = (select id from public.municipio where nombre = 'GIRARDOT'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | mantas y cobijas | ropa en buen estado | artículos de higiene personal | pañales de bebé', '', '',
    'Campaña “Manos Maristas en Acción” inspirada en la pedagogía de San Marcelino Champagnat. | Fuente: Flyer Colegio San José Maracay — Maristas | Maps: https://maps.google.com/?q=Colegio+San+Jos%C3%A9+Maristas+Maracay',
    10.247, -67.595,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Comando Con Venezuela', 'Avenida 19 de Abril, Centro Comercial La Capilla, Piso 1, Local 21',
    (select id from public.parroquia where nombre = 'LAS DELICIAS'
      and municipio_id = (select id from public.municipio where nombre = 'GIRARDOT'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.2469,-67.5958',
    10.2469, -67.5958,
    'https://www.instagram.com/p/DZ_kBlyIVRI/?hl=es');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Redoma Gran Mariscal', 'Corinsa',
    (select id from public.parroquia where nombre = 'LAS DELICIAS'
      and municipio_id = (select id from public.municipio where nombre = 'GIRARDOT'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario local | Maps: https://maps.google.com/?q=10.17102388,-67.45307849',
    10.17102388, -67.45307849,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sociedad anticancerosa', 'Calle Bolívar frente a la Plaza Sucre',
    (select id from public.parroquia where nombre = 'LAS DELICIAS'
      and municipio_id = (select id from public.municipio where nombre = 'GIRARDOT'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | ropa en buen estado', '4143456992', '',
    'Fuente: Publicado en redes sociales | Maps: https://maps.google.com/?q=10.17451394,-67.43814467',
    10.17451394, -67.43814467,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Teatro de la Ópera (Maracay)', 'Teatro de la Ópera, Maracay',
    (select id from public.parroquia where nombre = 'LAS DELICIAS'
      and municipio_id = (select id from public.municipio where nombre = 'GIRARDOT'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | pañales de bebé | pañales de adulto', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.248,-67.595',
    10.248, -67.595,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Voluntad Popular', 'Paseo de la Libertad, Avenida Las Delicias, frente al Centro Médico Maracay',
    (select id from public.parroquia where nombre = 'LAS DELICIAS'
      and municipio_id = (select id from public.municipio where nombre = 'GIRARDOT'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.245093,-67.593436',
    10.245093, -67.593436,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Burger Latin — CC Palma Center', 'Burger Latin, Centro Comercial Palma Center, La Victoria',
    (select id from public.parroquia where nombre = 'LA VICTORIA'
      and municipio_id = (select id from public.municipio where nombre = 'JOSE FELIX RIVAS'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | pañales de bebé | pañales de adulto | alimentos para mascotas | linternas, pilas y cargadores portátiles', '', '',
    'También reciben baterías, palas y picos. | Fuente: Flyer Venezuela Unida · @cazamosfakenews · @lavidadenos | Maps: https://maps.google.com/?q=Burger+Latin+CC+Palma+Center+La+Victoria+Aragua',
    10.2272, -67.332,
    'https://www.instagram.com/p/DaAk8GWOLGH/?igsh=MXB2NDFyNzlheG54Nw%3D%3D');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Bodega 33 — CC El Solidario', 'Bodega 33, Centro Comercial El Solidario, La Victoria',
    (select id from public.parroquia where nombre = 'LA VICTORIA'
      and municipio_id = (select id from public.municipio where nombre = 'JOSE FELIX RIVAS'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | pañales de bebé | pañales de adulto | alimentos para mascotas | linternas, pilas y cargadores portátiles', '', '',
    'También reciben baterías, palas y picos. | Fuente: Flyer Venezuela Unida · @cazamosfakenews · @lavidadenos | Maps: https://maps.google.com/?q=Bodega+33+CC+El+Solidario+La+Victoria+Aragua',
    10.228, -67.33,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('CEI María de las Mercedes', 'Calle Dr. Vicentelli c/c Rosa María Paredes #7, Sector Centro, La Victoria',
    (select id from public.parroquia where nombre = 'LA VICTORIA'
      and municipio_id = (select id from public.municipio where nombre = 'JOSE FELIX RIVAS'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños', '', '',
    'También reciben fórmulas infantiles. | Fuente: Flyer Venezuela Unida · @cazamosfakenews · @lavidadenos | Maps: https://maps.google.com/?q=Calle+Vicentelli+Rosa+Mar%C3%ADa+Paredes+La+Victoria+Aragua',
    10.227, -67.334,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Parroquia Nuestra Señora del Carmen', 'Calle Colón, La Victoria',
    (select id from public.parroquia where nombre = 'LA VICTORIA'
      and municipio_id = (select id from public.municipio where nombre = 'JOSE FELIX RIVAS'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños', '', '',
    'También reciben fórmulas infantiles. | Fuente: Flyer Venezuela Unida · @cazamosfakenews · @lavidadenos | Maps: https://maps.google.com/?q=Parroquia+Nuestra+Se%C3%B1ora+del+Carmen+La+Victoria+Aragua',
    10.229, -67.332,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Iglesia Jesús de la Misericordia', 'Turmero',
    (select id from public.parroquia where nombre = 'TURMERO'
      and municipio_id = (select id from public.municipio where nombre = 'SANTIAGO MARIÑO'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | abrigos y otros implementos de protección', '4260635514', '',
    'Fuente: Reporte comunitario local | Maps: https://maps.google.com/?q=10.21479566,-67.48666085',
    10.21479566, -67.48666085,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('U.E. Coronel Juan José Rondón', 'Av. Intercomunal Turmero-Maracay, frente al Mercado Mayorista (Instalaciones JJR) · Horario: a partir de las 7:30 a.m.',
    (select id from public.parroquia where nombre = 'TURMERO'
      and municipio_id = (select id from public.municipio where nombre = 'SANTIAGO MARIÑO'
        and estado_id = (select id from public.estado where nombre = 'ARAGUA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | mantas y cobijas | ropa en buen estado', '', '',
    'Fuente: Flyer Unidad Educativa Privada Coronel Juan José Rondón | Maps: https://maps.google.com/?q=Av+Intercomunal+Turmero+Maracay+Mercado+Mayorista',
    10.227, -67.541,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Restaurant O''Maria', 'Carrera 5 con calles 18 y 19, Municipio Ezequiel Zamora, Santa Bárbara de Barinas',
    (select id from public.parroquia where nombre = 'SANTA BARBARA'
      and municipio_id = (select id from public.municipio where nombre = 'EZEQUIEL ZAMORA'
        and estado_id = (select id from public.estado where nombre = 'BARINAS'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal', '+584247141072', '',
    'Fuente: El Diario · eldiario.com/2026/06/25/centros-de-acopio-terremotos-en-venezuela | Maps: https://maps.google.com/?q=Restaurant+O''Maria+Santa+B%C3%A1rbara+de+Barinas',
    8.6213, -70.2051,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Droguería Merecure — La Floresta', 'Droguería Merecure (Local 5), CC Central Plaza, Av. 23 de Enero, La Floresta, Barinas',
    (select id from public.parroquia where nombre = 'ALFREDO A LARRIVA'
      and municipio_id = (select id from public.municipio where nombre = 'BARINAS'
        and estado_id = (select id from public.estado where nombre = 'BARINAS'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | pañales de bebé | mantas y cobijas | ropa en buen estado', '', '',
    'Iniciativa “Barinas Unida — Emergencia Caracas” junto con Galletera Italia y Farmacia Santa Rosa. Camión de Galletera Italia trasladará todos los donativos directamente desde Barinas. | Fuente: Flyer @galleteraitalia · @farmaciasantarosa_oficial · @drogueriamerecure | Maps: https://maps.google.com/?q=Drogueria+Merecure+CC+Central+Plaza+Barinas',
    8.632, -70.208,
    'drogueriamerecure');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Farmacia Santa Rosa — Alto Barinas', 'Calle Justicia con Av. Venezuela, Urb. Alto Barinas Norte (frente a la Clínica Varyna), Barinas',
    (select id from public.parroquia where nombre = 'ALFREDO A LARRIVA'
      and municipio_id = (select id from public.municipio where nombre = 'BARINAS'
        and estado_id = (select id from public.estado where nombre = 'BARINAS'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | pañales de bebé | mantas y cobijas | ropa en buen estado', '', '',
    'Iniciativa “Barinas Unida — Emergencia Caracas” junto con Galletera Italia y Droguería Merecure. | Fuente: Flyer @galleteraitalia · @farmaciasantarosa_oficial · @drogueriamerecure | Maps: https://maps.google.com/?q=Farmacia+Santa+Rosa+Alto+Barinas',
    8.624, -70.22,
    'farmaciasantarosa_oficial');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Galletera Italia — Sede Central La Industrial', 'Galletera Italia, Zona Industrial Cazdeba, Av. 02 Sur, La Industrial, Barinas',
    (select id from public.parroquia where nombre = 'ALFREDO A LARRIVA'
      and municipio_id = (select id from public.municipio where nombre = 'BARINAS'
        and estado_id = (select id from public.estado where nombre = 'BARINAS'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | pañales de bebé | mantas y cobijas | ropa en buen estado', '', '',
    'Sede central — desde aquí saldrá un camión de la directiva de Galletera Italia para trasladar los donativos a Caracas. Iniciativa “Barinas Unida — Emergencia Caracas”. | Fuente: Flyer @galleteraitalia · @farmaciasantarosa_oficial · @drogueriamerecure | Maps: https://maps.google.com/?q=Galletera+Italia+Zona+Industrial+Cazdeba+Barinas',
    8.616, -70.205,
    'galletera.italia');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Inversiones Decolux', 'Inversiones Decolux, Caja de Agua, callejón 2, Barinas',
    (select id from public.parroquia where nombre = 'ALFREDO A LARRIVA'
      and municipio_id = (select id from public.municipio where nombre = 'BARINAS'
        and estado_id = (select id from public.estado where nombre = 'BARINAS'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado', '', '',
    'Reciben también fórmulas y alimento para bebé. Si tienes algo distinto para donar, comunícate al domicilio. | Fuente: Story @soybarinass · @yuss.mb | Maps: https://maps.google.com/?q=Inversiones+Decolux+Barinas',
    8.623, -70.212,
    'decolux');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Delgadillo FerreAgro', 'Av. Coddazi, diagonal al parque Jimmy Flores, Barinas · Horario: 7:30 a.m. a 6:00 p.m.',
    (select id from public.parroquia where nombre = 'ALFREDO A LARRIVA'
      and municipio_id = (select id from public.municipio where nombre = 'BARINAS'
        and estado_id = (select id from public.estado where nombre = 'BARINAS'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Fuente: Flyer Delgadillo FerreAgro | Maps: https://maps.google.com/?q=Delgadillo+FerreAgro+Av+Coddazi+Barinas',
    8.621, -70.216,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Celsas Bocaditos', 'Calle Mérida, entre Av. Olímpica y San Martín, frente a Licocenter, Barinas',
    (select id from public.parroquia where nombre = 'ALFREDO A LARRIVA'
      and municipio_id = (select id from public.municipio where nombre = 'BARINAS'
        and estado_id = (select id from public.estado where nombre = 'BARINAS'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto', '', '',
    'Las donaciones se llevan a Tucacas, edo. Falcón, para las personas afectadas por el terremoto. | Fuente: Story @celsasbocaditos · @soybarinass · @anyeli9880 | Maps: https://maps.google.com/?q=Calle+M%C3%A9rida+Av+Ol%C3%ADmpica+Barinas',
    8.626, -70.211,
    'celsasbocaditos');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Comando Con Venezuela', 'Av. Marqués del Pumar diagonal al Hotel Comercio, Casa Azul',
    (select id from public.parroquia where nombre = 'ALFREDO A LARRIVA'
      and municipio_id = (select id from public.municipio where nombre = 'BARINAS'
        and estado_id = (select id from public.estado where nombre = 'BARINAS'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=8.6231,-70.2075',
    8.6231, -70.2075,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Fe y Alegría "Padre Felipe Salvador Gilij"', 'Fe y Alegría Padre Felipe Salvador Gilij, Barinas',
    (select id from public.parroquia where nombre = 'ALFREDO A LARRIVA'
      and municipio_id = (select id from public.municipio where nombre = 'BARINAS'
        and estado_id = (select id from public.estado where nombre = 'BARINAS'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=8.6050614,-70.1956269',
    8.6050614, -70.1956269,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Comando Con Venezuela', 'Municipio Cruz Paredes, Av. Bolívar diagonal al Hotel del Búfalo, Casa Azul, Barrancas',
    (select id from public.parroquia where nombre = 'BARRANCAS'
      and municipio_id = (select id from public.municipio where nombre = 'CRUZ PAREDES'
        and estado_id = (select id from public.estado where nombre = 'BARINAS'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '4145298154', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=8.623314,-70.210987',
    8.623314, -70.210987,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Comando Con Venezuela', 'Municipio Caroní: Centro Comercial Biblos, primer piso, Local 71 C (antes Todo Limpio, frente a los tráileres de Bauxilum y al lado de la Bomba Biblos), Unare II',
    (select id from public.parroquia where nombre = 'SIMON BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'CARONI'
        and estado_id = (select id from public.estado where nombre = 'BOLIVAR'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=8.120393,-63.547336',
    8.120393, -63.547336,
    'https://www.instagram.com/p/DZ_0rjlljwk/?igsh=MWJwbTk1MXhhYWtkcg%3D%3D');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Cámara de Comercio de Bolívar', 'Sede de la Cámara de Comercio e Industrias del estado Bolívar, Av. Táchira',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'HERES'
        and estado_id = (select id from public.estado where nombre = 'BOLIVAR'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | mantas y cobijas | ropa en buen estado | artículos de higiene personal', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=8.1222,-63.5497',
    8.1222, -63.5497,
    'camaradecomerciobolivar');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Gobierno de Venezuela', 'Fundación Social Bolívar (Sede 911)',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'HERES'
        and estado_id = (select id from public.estado where nombre = 'BOLIVAR'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=8.297,-62.717',
    8.297, -62.717,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Rotaract Santo Ángel', 'Croquínea a un lado de la Clínica Razzeti, Altavista',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'HERES'
        and estado_id = (select id from public.estado where nombre = 'BOLIVAR'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | mantas y cobijas | artículos de higiene personal | pañales de bebé | pañales de adulto', 'Victoria Castillo 04121937746/Desireé Lugo 04249050118', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=8.353,-62.651',
    8.353, -62.651,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Voluntad Popular - Angostura del Orinoco', 'Esquina de Banesco, Avenida República, Municipio Angostura del Orinoco (Ciudad Bolívar)',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'HERES'
        and estado_id = (select id from public.estado where nombre = 'BOLIVAR'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado', '', '',
    'Fuente: El Pitazo (elpitazo.net), centros de acopio | Maps: https://maps.google.com/?q=8.128,-63.543',
    8.128, -63.543,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Comando Con Venezuela', 'Municipio Heres: Av. Pichincha, Edificio Tequendama, Local N° 4',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'HERES'
        and estado_id = (select id from public.estado where nombre = 'BOLIVAR'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=8.122414,-63.553187',
    8.122414, -63.553187,
    'https://www.instagram.com/p/DZ_0rjlljwk/?igsh=MWJwbTk1MXhhYWtkcg%3D%3D');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('UCAB Guayana - Casa del Estudiante', 'Planta alta, Casa del Estudiante, Dirección de Desarrollo Estudiantil, UCAB Guayana, Puerto Ordaz',
    (select id from public.parroquia where nombre = 'SIMON BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'CARONI'
        and estado_id = (select id from public.estado where nombre = 'BOLIVAR'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección', '4249147305', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=8.2965,-62.7185',
    8.2965, -62.7185,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Rotaract Santo Ángel', 'Laboratorio Roraima, Clínica Humana San Félix',
    (select id from public.parroquia where nombre = 'SIMON BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'CARONI'
        and estado_id = (select id from public.estado where nombre = 'BOLIVAR'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | mantas y cobijas | artículos de higiene personal | pañales de bebé | pañales de adulto', 'Victoria Castillo 04121937746/Desireé Lugo 04249050118', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=8.351193,-62.648636',
    8.351193, -62.648636,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Iglesia La Esmeralda', 'Iglesia La Esmeralda, San Diego',
    (select id from public.parroquia where nombre = 'URB SAN DIEGO'
      and municipio_id = (select id from public.municipio where nombre = 'SAN DIEGO'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Flyer comunitario centros de acopio Carabobo | Maps: https://maps.google.com/?q=Iglesia+La+Esmeralda+San+Diego+Carabobo',
    10.24, -67.97,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Iglesia Pueblo de San Diego', 'Iglesia Pueblo de San Diego, San Diego',
    (select id from public.parroquia where nombre = 'URB SAN DIEGO'
      and municipio_id = (select id from public.municipio where nombre = 'SAN DIEGO'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Flyer comunitario centros de acopio Carabobo | Maps: https://maps.google.com/?q=Iglesia+Pueblo+de+San+Diego+Carabobo',
    10.242, -67.972,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Cuerpo de Bomberos de Guacara', 'Sede del Cuerpo de Bomberos, Carretera Nacional, Guacara',
    (select id from public.parroquia where nombre = 'GUACARA'
      and municipio_id = (select id from public.municipio where nombre = 'GUACARA'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: El Pitazo (elpitazo.net), centros de acopio | Maps: https://maps.google.com/?q=10.231,-67.877',
    10.231, -67.877,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Cuerpo de Bomberos Universidad de Carabobo', 'Sede del Cuerpo de Bomberos, Universidad de Carabobo, Valencia',
    (select id from public.parroquia where nombre = 'CANDELARIA'
      and municipio_id = (select id from public.municipio where nombre = 'VALENCIA'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal', '', '',
    'Fuente: El Diario · eldiario.com/2026/06/25/centros-de-acopio-terremotos-en-venezuela | Maps: https://maps.google.com/?q=Cuerpo+de+Bomberos+Universidad+de+Carabobo+Valencia',
    10.164, -68.008,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('G3 Logística — Valencia', 'Calle La Pedrera, Fundo Los Marines, Zona Industrial San Diego',
    (select id from public.parroquia where nombre = 'CANDELARIA'
      and municipio_id = (select id from public.municipio where nombre = 'VALENCIA'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', 'Lunes a viernes, 9:00am - 12:00pm y 2:00pm - 3:30pm',
    'Fuente: AJE Venezuela · ajevenezuela.org/ayuda-venezuela/acopio | Maps: https://maps.google.com/?q=G3+Log%C3%ADstica+Zona+Industrial+San+Diego+Valencia',
    10.243, -68.001,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Asociación de Ejecutivos del estado Carabobo (AEEC)', 'Av. 119 Teodoro Gubaira, Edif. 122-145, Urbanización Valle de Camoruco (4ta Avenida de Prebo), Valencia',
    (select id from public.parroquia where nombre = 'CANDELARIA'
      and municipio_id = (select id from public.municipio where nombre = 'VALENCIA'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | pañales de bebé | pañales de adulto | artículos para niños | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', 'Lunes a viernes, 9:00am - 4:00pm',
    'Fuente: Reporte verificado | Maps: https://maps.app.goo.gl/e9962zFSQRTUVaoC6',
    10.173, -68.009,
    'aeecoficial');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Grupo Nezco Venezuela — Valencia', 'Calle Lisandro Ramírez #97-30, Parroquia San Blas, Valencia',
    (select id from public.parroquia where nombre = 'CANDELARIA'
      and municipio_id = (select id from public.municipio where nombre = 'VALENCIA'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'agua potable | alimentos no perecederos | ropa en buen estado | mantas y cobijas | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal', '+584246491600', '',
    'También reciben calzado. Grupo Nezco coordina con empresas de transporte aliadas la distribución de ayudas a zonas afectadas, incluyendo Caracas y otras comunidades impactadas. | Fuente: Flyer Grupo Nezco Venezuela CA | Maps: https://maps.google.com/?q=Calle+Lisandro+Ram%C3%ADrez+San+Blas+Valencia',
    10.166, -68.003,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Casa Amira — Amira Studio & Mosaico', 'Casa Amira, Calle Alejo Zuluaga, Av. Z, El Trigal Norte, Valencia',
    (select id from public.parroquia where nombre = 'CANDELARIA'
      and municipio_id = (select id from public.municipio where nombre = 'VALENCIA'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas', '', 'Viernes 26 de junio, 10:00am - 3:00pm',
    'Donaciones destinadas a Morón y La Guaira. Específicamente reciben: leche en polvo y fórmulas; alimentos no perecederos (enlatados abre fácil, arroz, pasta); pañales (niños/adultos) y toallitas húmedas; gasas, alcohol, algodón, agua oxigenada; analgésicos y antialérgicos vigentes; jabón, crema dental, toallas sanitarias; agua mineral embotellada; ropa y sábanas limpias en buen estado. | Fuente: Flyer @_amirastudio · Mosaico | Maps: https://maps.google.com/?q=Casa+Amira+Calle+Alejo+Zuluaga+El+Trigal+Norte+Valencia',
    10.17, -68.015,
    '_amirastudio');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Comando Con Venezuela', 'Avenida Monseñor Adams, El Viñedo. Edificio Talislandia, mezzanina.',
    (select id from public.parroquia where nombre = 'CANDELARIA'
      and municipio_id = (select id from public.municipio where nombre = 'VALENCIA'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.160193,-68.005336',
    10.160193, -68.005336,
    'https://www.instagram.com/p/DZ_kBlyIVRI/?hl=es');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Jóvenes por el clima', 'Av. Bolívar frente al Multicentro',
    (select id from public.parroquia where nombre = 'CANDELARIA'
      and municipio_id = (select id from public.municipio where nombre = 'VALENCIA'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.162,-68.0077',
    10.162, -68.0077,
    'https://www.instagram.com/p/DaAB8S-CAiB/?igsh=Njl4YXk4N3drM2tm');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Plaza de las Panelas', 'Indiana Norte',
    (select id from public.parroquia where nombre = 'CANDELARIA'
      and municipio_id = (select id from public.municipio where nombre = 'VALENCIA'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'agua potable | medicamentos e insumos médicos', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=10.25665613,-67.80182411',
    10.25665613, -67.80182411,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Ballroom Valencia / Fundación MAVID', 'Urb. Tarapío, Calle 189 c/c Av. 104, Naguanagua (a 2 cuadras del semáforo de la 190) · Horario: L-V 8:30am-4pm, Sáb 9am-1pm',
    (select id from public.parroquia where nombre = 'CANDELARIA'
      and municipio_id = (select id from public.municipio where nombre = 'VALENCIA'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado', '', '',
    'Fuente: Flyer Ballroom Venezuela / Fundación MAVID | Maps: https://maps.google.com/?q=10.253,-68.012',
    10.253, -68.012,
    'ballroom.vzla');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('CONNECTION ACADEMY', 'SECTOR LA CANDELARIA CENTRO COMERCIAL BAHIA IMPERIAL',
    (select id from public.parroquia where nombre = 'CANDELARIA'
      and municipio_id = (select id from public.municipio where nombre = 'VALENCIA'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'agua potable | medicamentos e insumos médicos | ropa en buen estado', '', '',
    'Fuente: Organizado por la Institucion Academica | Maps: https://maps.google.com/?q=10.1774,-68.0068',
    10.1774, -68.0068,
    'connectionacademy_ve');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Plaza de flor amarillo.', 'Plaza de flor amarillo, c',
    (select id from public.parroquia where nombre = 'CANDELARIA'
      and municipio_id = (select id from public.municipio where nombre = 'VALENCIA'
        and estado_id = (select id from public.estado where nombre = 'CARABOBO'))),
    'medicamentos e insumos médicos | pañales de bebé | ropa en buen estado', '', '',
    'Fuente: Fuí personalmente | Maps: https://maps.google.com/?q=10.1381,-67.9449',
    10.1381, -67.9449,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Escuela Manaure', 'Escuela Manaure',
    (select id from public.parroquia where nombre = 'COJEDES'
      and municipio_id = (select id from public.municipio where nombre = 'ANZOATEGUI'
        and estado_id = (select id from public.estado where nombre = 'COJEDES'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado', 'Berlín Ramírez 0426/0353282', '',
    'Fuente: Reporte por WhatsApp | Maps: https://maps.google.com/?q=9.823081108,-68.43389031',
    9.823081108, -68.43389031,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Cáritas San Carlos', 'Sede Cáritas Diocesana, calle Carabobo con calle Madariaga, San Carlos',
    (select id from public.parroquia where nombre = 'SAN CARLOS DE AUSTRIA'
      and municipio_id = (select id from public.municipio where nombre = 'EZEQUIEL ZAMORA'
        and estado_id = (select id from public.estado where nombre = 'COJEDES'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado', '', '',
    'Fuente: Reporte por WhatsApp | Maps: https://maps.google.com/?q=9.664781388,-68.58874388',
    9.664781388, -68.58874388,
    'caritasdiocesanasancarlos');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Cáritas Venezuela', 'Sede de la Conferencia Episcopal Venezolana, Avenida Teherán, a 200 metros de la Universidad Católica Andrés Bello (UCAB), frente a la Urbanización Juan Pablo II, sector Montalbán',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.461193,-66.939636',
    10.461193, -66.939636,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Caracas FC — Cocodrilos Sports Park', 'Cocodrilos Sports Park, Av. Antonio Guzmán Blanco, entre el Parque El Pinar y La India, El Paraíso, Caracas · Sede administrativa y de entrenamiento del Caracas Fútbol Club · Horario: desde el sábado 27 de junio, 8:00 a.m. a 6:00 p.m.',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | linternas, pilas y cargadores portátiles', '', '',
    'Iniciativa “Juntos por nuestro país”. La institución se encarga de llevar las donaciones a las personas y zonas más necesitadas. Reciben específicamente: solución fisiológica 0.9% (10 cajas), Jelco #18, #20, #24 / Mariposa, inyectadoras 3, 5, 10 y 20 ml, adhesivo, equipo de infusión (macrogoteo), ibuprofeno 800 mg, ketoprofeno 100 mg, diclofenaco potásico (tabletas), hidrocortisona 500 mg, agua potable, alimentos no perecederos, herramientas, linternas y artículos de higiene personal. | Fuente: Flyer oficial @caracas_fc · Cocodrilos Sports Park | Maps: https://maps.google.com/?q=Cocodrilos+Sports+Park+El+Para%C3%ADso+Caracas',
    10.481, -66.932,
    'caracas_fc');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Centro de Acopio UCV — Gestión Menstrual (Plaza del Rectorado)', 'Plaza del Rectorado, Universidad Central de Venezuela (UCV), Caracas · Para mujeres, niñas y adolescentes de La Guaira y El Junquito',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'artículos de higiene personal', '', '',
    'Recolecta específica de insumos de gestión menstrual: toallas sanitarias, protectores diarios, tampones y toallas húmedas. Si no estás en Caracas también puedes apoyar con aporte económico: Pago Móvil Banco de Venezuela (C.I. 18.841.494, Tlf. 0414-335-6422) · Transferencia internacional (Wise): Nashla Alexandra Báez De Andrea, IBAN BE60 9672 3759 2570, SWIFT/BIC TRWIBEB1XXX · PayPal mrosguz@gmail.com · Airtm @marialaurarg (mrosguz@gmail.com). | Fuente: Flyer @marialaurarg — Centro de Acopio UCV | Maps: https://maps.google.com/?q=Plaza+del+Rectorado+UCV+Caracas',
    10.491, -66.891,
    'marialaurarg');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('FCU-UCV — Plaza Rectorado', 'Plaza Rectorado, Universidad Central de Venezuela (UCV), Caracas · Entrega también en la sede del Centro de Estudiantes de Farmacia (FCU)',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal', '', '',
    '🚨 URGENTE — Medicamentos prioritarios para hospitales (ninguno debe estar vencido ni abierto): Dipirona (ampollas), Dexametasona (ampollas), Omeprazol (ampollas), Adrenalina (ampollas), Ceftriaxona (ampollas), Cefepime (ampollas), Cefazolina (ampollas), Ceftazidima (ampollas), Ciprofloxacina (ampollas), Ampicilina/Sulbactam (ampollas), Vitamina K (ampollas), Ácido Tranexámico (ampollas), Heparina (ampollas), Ketoprofeno (ampollas), Metronidazol (solución inyectable), Enoxaparina (jeringas prellenadas), Sulfadiazina de plata (crema), Sales de rehidratación oral (polvo). | Fuente: El Diario · eldiario.com/2026/06/25/centros-de-acopio-terremotos-en-venezuela · Flyer @cefarmaciaucv | Maps: https://maps.google.com/?q=Plaza+Rectorado+UCV+Caracas',
    10.49, -66.89,
    'cefarmaciaucv');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de Chacao — Sede de Desarrollo Social', 'Sede de Desarrollo Social, Calle Los Ángeles, lateral al CC Sambil Chacao, Municipio Chacao',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | sábanas', '', '',
    'Fuente: Flyer oficial @alcaldiachacao · @gustavoduquesaez | Maps: https://maps.google.com/?q=Calle+Los+%C3%81ngeles+Sambil+Chacao+Caracas',
    10.496, -66.854,
    'alcaldiachacao');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Edificio Rita Palace — Los Caobos', 'Edif. Rita Palace, Av. La Salle, Planta Baja, Los Caobos',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '+584145634459', '',
    'Fuente: AJE Venezuela · ajevenezuela.org/ayuda-venezuela/acopio | Maps: https://maps.google.com/?q=Edificio+Rita+Palace+Los+Caobos+Caracas',
    10.501, -66.913,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Colegio Cristo Rey Altamira', 'Colegio Cristo Rey Altamira, 7ma Avenida entre 6ta y 7ma Transversal',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | cascos de protección', '', '',
    'Alimentos específicos: enlatados, frutos secos, harina pan, queso, jamón, pan. Herramientas y protección: cinceles, mandarrias, guantes para escombros, gatos de botella, piquetas, cascos de seguridad y palas. | Fuente: Flyer Venezuela Unida · @cazamosfakenews · @lavidadenos · Lista colaborativa @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.496491,-66.844222',
    10.496491, -66.844222,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Comando Con Venezuela', 'Cuarta Avenida de Altamira, entre novena y décima transversal, Quinta El Bejucal',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.493193,-66.844636',
    10.493193, -66.844636,
    'https://www.instagram.com/p/DZ_kBlyIVRI/?hl=es');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Fundación Cruz Azul', 'Fitness Factory VE, 4ta Avenida de Los Palos Grandes entre 1ra y 2da transversal',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'medicamentos e insumos médicos', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.496193,-66.839636',
    10.496193, -66.839636,
    'cruzazulusm');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Iglesia San Bernardino de Siena', 'Parroquia San Bernardino, Caracas',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Flyer comunitario centros de acopio Venezuela | Maps: https://maps.google.com/?q=Iglesia+San+Bernardino+de+Siena+Caracas',
    10.506, -66.898,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Iglesia La Paz Montalbán I', 'Iglesia La Paz Montalbán I',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: Compartido por Comando Con Venezuela | Maps: https://maps.google.com/?q=10.47599064,-66.95098002',
    10.47599064, -66.95098002,
    'comandoconvzla');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Instituto de Diseño de Caracas', 'Av. Ávila, Caracas 1060, Miranda',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección', '4123212782', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.4806,-66.9036',
    10.4806, -66.9036,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Rescatistas y Vecinos — Altamira CAF', 'Altamira, frente a la sede de la CAF, Caracas',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos', 'Victoria Castillo 0412-1937746 / Desireé Lugo 0424-9050118', '',
    'Fuente: Flyer Venezuela Unida · @cazamosfakenews · @lavidadenos | Maps: https://maps.google.com/?q=CAF+Altamira+Caracas',
    10.495, -66.847,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Rescatistas y vecinos — Edificio Petunia', 'Edificio Petunia, Av. Francisco de Miranda entre Los Palos Grandes y Altamira, Caracas',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | mantas y cobijas | ropa en buen estado | linternas, pilas y cargadores portátiles | cascos de protección | herramientas de rescate (palas, picos, guantes, mascarillas)', '', '',
    'Punto de apoyo para rescatistas y vecinos en el sitio del colapso del Edificio Petunia. Se priorizan equipos e insumos para labores de búsqueda y rescate, además de alimentos, agua y abrigo para los voluntarios y familias afectadas. | Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.498,-66.842',
    10.498, -66.842,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Rotaract Caracas - Terrazas del Club Hípico', 'Terrazas del Club Hípico, Caracas',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | kits de primeros auxilios | mantas y cobijas', '', '',
    'Fuente: El Pitazo (elpitazo.net), centros de acopio | Maps: https://maps.google.com/?q=10.452,-66.843',
    10.452, -66.843,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sede de la Conferencia Episcopal de Venezuela', 'Avenida Teherán, Urbanización Montalbán / Juan Pablo II.',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos', '', '',
    'Fuente: Tomado del Instagram de CevMedios | Maps: https://maps.google.com/?q=10.47020196,-66.96065049',
    10.47020196, -66.96065049,
    'cevmedios');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Toneladas de Alegría', 'Edificio VVZ, Av. Sorocaima, Caracas',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | pañales de bebé | artículos para niños | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles', '', '',
    'Reciben también bebidas hidratantes y leche infantil. ONG con red logística para distribución humanitaria — son la organización receptora de la iniciativa Una Vzlana en Madrid (Sambil Madrid) en España. | Fuente: Flyer @toneladasdealegria · Centro de Acopio Activo | Maps: https://maps.google.com/?q=Edificio+VVZ+Av+Sorocaima+Caracas',
    10.492, -66.858,
    'toneladasdealegria');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sociedad civil', 'Quinta El Bejucal, cuarta Avenida transversal de Altamira, entre novena y décima transversal',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | mantas y cobijas | ropa en buen estado', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.495214,-66.850487',
    10.495214, -66.850487,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Iglesia Santo Domingo Savio', 'A una cuadra de la estación de policia',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | pañales de bebé | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario | Maps: https://maps.google.com/?q=10.445,-66.9276',
    10.445, -66.9276,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Clínica Ciaclab', 'Av. Principal de La Carlota, Caracas 1071',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=Av+Principal+de+La+Carlota+Caracas',
    10.502, -66.876,
    'ciaclab');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Fundación Huellas al Corazón', 'San Bernardino, Calle Blanco, Quinta María, Caracas · Horario: 9:00 a.m. a 7:00 p.m.',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'alimentos no perecederos | artículos de higiene personal | mantas y cobijas | artículos de limpieza | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=San+Bernardino+Calle+Blanco+Caracas',
    10.488, -66.879,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Colegio Champagnat', 'Caurimare, Calle A con Calle 1, por la subida de la Metropolitana, Caracas · Horario: lunes 29/6 y martes 30/6',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | colchones, almohadas y colchones inflables | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/E7MyMvKTeGawxkTZ8',
    10.488, -66.879,
    'champagnatccs');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Apoyo Chamos Solidarios', 'Radio Negro Primero, C. Real Los Cortijos de Sarría, Caracas · Horario: 9:30 a.m. a 7:00 p.m.',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | pañales de bebé | artículos para niños | mantas y cobijas | materiales para refugio | colchones, almohadas y colchones inflables', '', '',
    'Recibe también recreadores, artistas, cirqueros y apoyo emocional. Coordinación por WhatsApp: chat.whatsapp.com/EbJyCBVNdKtAzWXFBAHM6K | Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/Uc7xUL9AYrkvNrC39',
    10.49, -66.835,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Colegio Nacional de Periodistas (CNP) - Paraguaná', 'Sede del Colegio Nacional de Periodistas (CNP), Paraguaná',
    (select id from public.parroquia where nombre = 'NORTE'
      and municipio_id = (select id from public.municipio where nombre = 'CARIRUBANA'
        and estado_id = (select id from public.estado where nombre = 'FALCON'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: El Pitazo (elpitazo.net), centros de acopio | Maps: https://maps.google.com/?q=11.69,-70.21',
    11.69, -70.21,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de Carirubana — Plazoleta del Mercado Turístico', 'Plazoleta del Mercado Turístico, Av. Principal Antiguo Aeropuerto, Parroquia Norte, Punto Fijo (Municipio Carirubana) · Horario: 8:00 a.m. a 8:00 p.m.',
    (select id from public.parroquia where nombre = 'NORTE'
      and municipio_id = (select id from public.municipio where nombre = 'CARIRUBANA'
        and estado_id = (select id from public.estado where nombre = 'FALCON'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Contactos y coordinación: 0412-661-7682 · 0412-672-5298. Reciben también colchonetas y ropa de cama en buen estado. | Fuente: Flyer oficial Alcaldía de Carirubana · @alcariubana · @somosimaseo | Maps: https://maps.google.com/?q=Mercado+Tur%C3%ADstico+Punto+Fijo',
    11.7045, -70.215,
    'alcariubana');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Total Motos Falcón', 'Calle Peninsular, esquina Las Palmas, Local 2, diagonal a Imaseo, Punto Fijo · Horario: a partir de la 1:00 p.m.',
    (select id from public.parroquia where nombre = 'NORTE'
      and municipio_id = (select id from public.municipio where nombre = 'CARIRUBANA'
        and estado_id = (select id from public.estado where nombre = 'FALCON'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado | artículos de higiene personal', '', '',
    'Fuente: Story @punto_fijo_novedades · Total Motos Falcón | Maps: https://maps.google.com/?q=Total+Motos+Falc%C3%B3n+Punto+Fijo',
    11.708, -70.21,
    'punto_fijo_novedades');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('GoldStars Gym — Sede Sambil', 'GoldStars Gym, Sambil Paraguaná, Punto Fijo',
    (select id from public.parroquia where nombre = 'NORTE'
      and municipio_id = (select id from public.municipio where nombre = 'CARIRUBANA'
        and estado_id = (select id from public.estado where nombre = 'FALCON'))),
    'alimentos no perecederos | ropa en buen estado | artículos de higiene personal | pañales de bebé | pañales de adulto | medicamentos e insumos médicos | kits de primeros auxilios | artículos de limpieza | materiales para refugio', '', '',
    'Fuente: Flyer oficial de GoldStars Gym (GSG) | Maps: https://maps.google.com/?q=Sambil+Paragu%C3%A1na+Punto+Fijo',
    11.7068, -70.2086,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('GoldStars Gym — Sede CC Las Virtudes', 'GoldStars Gym, Centro Comercial Las Virtudes, Punto Fijo',
    (select id from public.parroquia where nombre = 'NORTE'
      and municipio_id = (select id from public.municipio where nombre = 'CARIRUBANA'
        and estado_id = (select id from public.estado where nombre = 'FALCON'))),
    'alimentos no perecederos | ropa en buen estado | artículos de higiene personal | pañales de bebé | pañales de adulto | medicamentos e insumos médicos | kits de primeros auxilios | artículos de limpieza | materiales para refugio', '', '',
    'Fuente: Flyer oficial de GoldStars Gym (GSG) | Maps: https://maps.google.com/?q=Centro+Comercial+Las+Virtudes+Punto+Fijo',
    11.685, -70.2106,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alas Viajeras', 'Oficina Alas Viajeras, Hotel Puerto Plata, Punto Fijo',
    (select id from public.parroquia where nombre = 'NORTE'
      and municipio_id = (select id from public.municipio where nombre = 'CARIRUBANA'
        and estado_id = (select id from public.estado where nombre = 'FALCON'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado | artículos de higiene personal | pañales de bebé | artículos para niños | artículos de limpieza | materiales para refugio', 'WhatsApp: +58 414-6522514 · +58 412-0824196 · +58 424-6585459', '',
    'Los insumos son entregados a Cáritas Diócesis de Punto Fijo y a aeropuertos como grandes centros de acopio y distribución nacional. | Fuente: Flyer de Alas Viajeras · @ysnaidarosaspdvsa | Maps: https://maps.google.com/?q=Hotel+Puerto+Plata+Punto+Fijo',
    11.696, -70.2153,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Cáritas Diócesis de Punto Fijo', 'Sector Centro, calle Páez entre Brasil y Perú, frente a la primera casa de Punto Fijo',
    (select id from public.parroquia where nombre = 'NORTE'
      and municipio_id = (select id from public.municipio where nombre = 'CARIRUBANA'
        and estado_id = (select id from public.estado where nombre = 'FALCON'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | pañales de bebé | pañales de adulto', '', 'Lunes a viernes, 8:30am - 2:00pm',
    'Fuente: Flyer oficial de Cáritas Diócesis de Punto Fijo · Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=11.708,-70.199',
    11.708, -70.199,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('RE/MAX Avanti', 'C.C.R ''Las Virtudes'' Local F1-5',
    (select id from public.parroquia where nombre = 'SAN ANTONIO'
      and municipio_id = (select id from public.municipio where nombre = 'MIRANDA'
        and estado_id = (select id from public.estado where nombre = 'FALCON'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | ropa en buen estado', '', '',
    'Fuente: Instagram | Maps: https://maps.google.com/?q=11.6585,-70.2048',
    11.6585, -70.2048,
    'avantiremax.ve');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Tambú Sushi', 'C.C.R ''Las Virtudes'' Nivel galería',
    (select id from public.parroquia where nombre = 'SAN ANTONIO'
      and municipio_id = (select id from public.municipio where nombre = 'MIRANDA'
        and estado_id = (select id from public.estado where nombre = 'FALCON'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado', '', '',
    'Fuente: Instagram | Maps: https://maps.google.com/?q=11.658,-70.2056',
    11.658, -70.2056,
    'tambusushivzla');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Gobernación del Estado Bolivariano de Guárico — Centro Principal', 'Gobernación del Estado Bolivariano de Guárico, San Juan de los Morros, Guárico · Horario: lunes a domingo, 8:00 a.m. a 6:00 p.m.',
    (select id from public.parroquia where nombre = 'GUAYABAL'
      and municipio_id = (select id from public.municipio where nombre = 'SAN GERONIMO DE G'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Centro de acopio principal para la recolección de insumos destinados a las personas afectadas por el terremoto en diferentes ciudades del país. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=9.909,-67.354',
    9.909, -67.354,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Parque Antonio Miguel Martínez', 'Parque Antonio Miguel Martínez, San Juan de los Morros, Guárico',
    (select id from public.parroquia where nombre = 'GUAYABAL'
      and municipio_id = (select id from public.municipio where nombre = 'SAN GERONIMO DE G'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=9.909,-67.355',
    9.909, -67.355,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Paseo Doña Lola', 'CC Paseo Doña Lola, Calle Páez cruce Av. Sendrea con Av. Bolívar, al lado del restaurante The One Place, San Juan de los Morros · Horario: 7:00 a.m. a 8:00 p.m.',
    (select id from public.parroquia where nombre = 'GUAYABAL'
      and municipio_id = (select id from public.municipio where nombre = 'SAN GERONIMO DE G'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/sYv1j6hjGtFhnTAEA',
    9.909, -67.354,
    'Paseo_dona_lola');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Plaza Bolívar — Ortiz', 'Plaza Bolívar, Ortiz, Guárico',
    (select id from public.parroquia where nombre = 'ORTIZ'
      and municipio_id = (select id from public.municipio where nombre = 'ORTIZ'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=9.619,-67.3',
    9.619, -67.3,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Desarrollo Social de la Alcaldía', 'Desarrollo Social de la Alcaldía, calle Vigía, Valle de la Pascua, Guárico',
    (select id from public.parroquia where nombre = 'VALLE DE LA PASCUA'
      and municipio_id = (select id from public.municipio where nombre = 'INFANTE'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=9.215,-65.997',
    9.215, -65.997,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Salón de Usos Múltiples de la Alcaldía — Guayabal', 'Salón de Usos Múltiples de la Alcaldía, Guayabal, Guárico',
    (select id from public.parroquia where nombre = 'GUAYABAL'
      and municipio_id = (select id from public.municipio where nombre = 'SAN GERONIMO DE G'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=8.58,-67.4',
    8.58, -67.4,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Concejo Municipal — Santa María', 'Concejo Municipal, Santa María de Ipire, Guárico',
    (select id from public.parroquia where nombre = 'SANTA MARIA DE IPIRE'
      and municipio_id = (select id from public.municipio where nombre = 'S MARIA DE IPIRE'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=8.961,-65.326',
    8.961, -65.326,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de El Sombrero', 'Alcaldía de El Sombrero, Guárico',
    (select id from public.parroquia where nombre = 'EL SOMBRERO'
      and municipio_id = (select id from public.municipio where nombre = 'MELLADO'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=9.385,-67.05',
    9.385, -67.05,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Salón de Usos Múltiples de la Alcaldía — Calabozo', 'Salón de Usos Múltiples de la Alcaldía, Calabozo, Guárico',
    (select id from public.parroquia where nombre = 'CALABOZO'
      and municipio_id = (select id from public.municipio where nombre = 'MIRANDA'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=8.924,-67.426',
    8.924, -67.426,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Plaza Castor Vásquez y Plaza Bolívar de Puerto Miranda', 'Plaza Castor Vásquez y Plaza Bolívar de Puerto Miranda, Camaguán, Guárico',
    (select id from public.parroquia where nombre = 'CAMAGUAN'
      and municipio_id = (select id from public.municipio where nombre = 'CAMAGUAN'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=8.119,-67.598',
    8.119, -67.598,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Instituto de Deportes IMDRI', 'Instituto de Deportes IMDRI, Tucupido, Guárico',
    (select id from public.parroquia where nombre = 'TUCUPIDO'
      and municipio_id = (select id from public.municipio where nombre = 'RIBAS'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=9.298,-65.771',
    9.298, -65.771,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de Altagracia de Orituco', 'Alcaldía de Altagracia de Orituco, Guárico',
    (select id from public.parroquia where nombre = 'ALTAGRACIA DE ORITUCO'
      and municipio_id = (select id from public.municipio where nombre = 'MONAGAS'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=9.877,-66.383',
    9.877, -66.383,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Casa de la Cultura — Las Mercedes del Llano', 'Casa de la Cultura, Las Mercedes del Llano, Guárico',
    (select id from public.parroquia where nombre = 'LAS MERCEDES'
      and municipio_id = (select id from public.municipio where nombre = 'LAS MERCEDES'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=9.11,-66.4',
    9.11, -66.4,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Cuerpo de Bomberos — Zaraza', 'Cuerpo de Bomberos, Zaraza, Guárico',
    (select id from public.parroquia where nombre = 'ZARAZA'
      and municipio_id = (select id from public.municipio where nombre = 'ZARAZA'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=9.352,-65.321',
    9.352, -65.321,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('PAC de la GNB — Chaguaramas', 'Puesto de Atención al Ciudadano (PAC) de la Guardia Nacional Bolivariana, Chaguaramas, Guárico',
    (select id from public.parroquia where nombre = 'CHAGUARAMAS'
      and municipio_id = (select id from public.municipio where nombre = 'CHAGUARAMAS'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=9.336,-66.253',
    9.336, -66.253,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sala Situacional de Seguridad y Paz', 'Sala Situacional de Seguridad y Paz, Plaza Bolívar, Sector Centro, Guaribe, Guárico',
    (select id from public.parroquia where nombre = 'SAN JOSE DE GUARIBE'
      and municipio_id = (select id from public.municipio where nombre = 'S JOSE DE GUARIBE'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=9.829,-65.595',
    9.829, -65.595,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Comandancia del Sector Calichito', 'Comandancia del Sector Calichito, calle Bolívar, El Socorro, Guárico',
    (select id from public.parroquia where nombre = 'EL SOCORRO'
      and municipio_id = (select id from public.municipio where nombre = 'EL SOCORRO'
        and estado_id = (select id from public.estado where nombre = 'GUARICO'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto de acopio municipal de la Gobernación del Estado Bolivariano de Guárico — iniciativa “Por amor a Guárico, Unidos somos más fuertes”. Coordinación: Centro principal en la Gobernación, San Juan de los Morros. | Fuente: Flyer oficial Gobernación del Estado Bolivariano de Guárico | Maps: https://maps.google.com/?q=8.992,-65.722',
    8.992, -65.722,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Parque del Oeste Alí Primera', 'Av. Sucre, Catia, Caracas',
    (select id from public.parroquia where nombre = 'SUCRE'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVARIANO LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'DISTRITO CAPITAL'))),
    'agua potable | medicamentos e insumos médicos | artículos de higiene personal | pañales de bebé | artículos para niños | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=Parque+del+Oeste+Catia+Caracas',
    10.505, -66.932,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('G3 Logística — Barquisimeto', 'Zona Industrial II, Av. Principal con Calle 6, locales 110-111-112',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'IRIBARREN'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', 'Lunes a viernes, 9:00am - 12:00pm y 2:00pm - 3:30pm',
    'Fuente: AJE Venezuela · ajevenezuela.org/ayuda-venezuela/acopio | Maps: https://maps.google.com/?q=G3+Log%C3%ADstica+Zona+Industrial+II+Barquisimeto',
    10.069, -69.314,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Centro Comercial Churún Merú', 'CC Churún Merú, Avenida Lara, Barquisimeto',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'IRIBARREN'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | pañales de bebé | pañales de adulto', '', 'A partir del viernes 26 de junio, desde las 9:00am',
    'Alimentos específicos: enlatados, pasta, arroz, azúcar, leche en polvo. Medicinas: analgésicos, antibióticos, vitaminas, sueros orales. Higiene: jabón, pasta dental, champú, toallas higiénicas, papel higiénico. Otros: ropa en buen estado, cobijas, toallas, linternas, pilas y pañales. | Fuente: Flyer @yelfraniriera · @eduardokoii | Maps: https://share.google/pg8gz8qIdRu9hm6LG',
    null, null,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Grupo Nezco Venezuela — Barquisimeto', 'Carrera 18 con Calle 49, al lado de SEIPCA, Puerta Negra, Barquisimeto',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'IRIBARREN'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'agua potable | alimentos no perecederos | ropa en buen estado | mantas y cobijas | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal', '+584126938188', '',
    'También reciben calzado. Grupo Nezco coordina con empresas de transporte aliadas la distribución de ayudas a zonas afectadas, incluyendo Caracas y otras comunidades impactadas. | Fuente: Flyer Grupo Nezco Venezuela CA | Maps: https://maps.google.com/?q=Carrera+18+Calle+49+SEIPCA+Barquisimeto',
    10.07, -69.322,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Operación Todos con VZLA — Iribarren', 'Av. Venezuela al lado del Sambil, canal lento desde la Av. Morán hasta el Sambil, al lado de Seguros Altamira, Barquisimeto',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'IRIBARREN'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado | abrigos y otros implementos de protección | cascos de protección | linternas, pilas y cargadores portátiles', '', '',
    'Primeros auxilios: guantes, vendas, alcohol, inyectadoras. Para rescatistas: cascos, guantes de protección, linternas, cinceles, picos, tobos, palas, mandarrias, disco de corte. | Fuente: Flyer @convzlacomando · Operación Todos con VZLA | Maps: https://maps.google.com/?q=Sambil+Barquisimeto+Av+Venezuela',
    10.064, -69.32,
    'convzlacomando');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Cáritas Barquisimeto', 'Cáritas, Carrera 18 entre calles 34 y 35, Barquisimeto',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'IRIBARREN'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | abrigos y otros implementos de protección', '0251-4468402 / caritasbarquisimeto@gmail.com', '',
    'Fuente: El Pitazo (elpitazo.net), centros de acopio | Maps: https://maps.google.com/?q=10.068,-69.323',
    10.068, -69.323,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Colegio Las Colinas', 'Colegio Las Colinas, entrada El Pedregal',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'IRIBARREN'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'medicamentos e insumos médicos', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.064914,-69.350487',
    10.064914, -69.350487,
    'colegiolascolinas1969');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Fitness Factory Cabudare', 'CC Hipermercado Multimall, Avenida El Placer con Av. Libertador',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'IRIBARREN'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'agua potable | alimentos no perecederos | mantas y cobijas | ropa en buen estado | artículos de higiene personal | pañales de bebé', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.0286,-69.2611',
    10.0286, -69.2611,
    'https://www.instagram.com/p/DaApx5TAAkN/?img_index=1&igsh=MWprOWNwODh2eHowdA==');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sociedad civil', 'Tatas Food, carrera 15 entre calles 13A y 13B',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'IRIBARREN'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.0647,-69.347',
    10.0647, -69.347,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Voluntariado Higea', 'Fundación Higea y Biotel Suites',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'IRIBARREN'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | mantas y cobijas | ropa en buen estado', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.062893,-69.344636',
    10.062893, -69.344636,
    'voluntariadohigea');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('FUNDACIÓN TEJIENDO REDES', 'CALLE 41 ENTRE CARRERAS 13 Y 14 CASA 13-50',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'IRIBARREN'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario | Maps: https://maps.google.com/?q=10.0595,-69.3323',
    10.0595, -69.3323,
    'https://www.instagram.com/fundaciontejiendoredes?igsh=MTlqamVjMnBvMjB4cw==');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('ESTADIO DE SOFTBOL Aquiles Machado', 'Calle 64 con carrera 13, detrás de las piscinas Bolivarianas',
    (select id from public.parroquia where nombre = 'CATEDRAL'
      and municipio_id = (select id from public.municipio where nombre = 'IRIBARREN'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'agua potable | alimentos no perecederos | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario | Maps: https://maps.google.com/?q=10.05,-69.3545',
    10.05, -69.3545,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Operación Todos con VZLA — Palavecino', 'Los Rastrojos, Calle 3, esquina Calle Aquilino Juárez, diagonal Centro Deportivo El Cuadrito, detrás de la Escuela Pedro Gual',
    (select id from public.parroquia where nombre = 'CABUDARE'
      and municipio_id = (select id from public.municipio where nombre = 'PALAVECINO'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado | abrigos y otros implementos de protección | cascos de protección | linternas, pilas y cargadores portátiles', '', '',
    'Primeros auxilios: guantes, vendas, alcohol, inyectadoras. Para rescatistas: cascos, guantes de protección, linternas, cinceles, picos, tobos, palas, mandarrias, disco de corte. | Fuente: Flyer @convzlacomando · Operación Todos con VZLA | Maps: https://maps.google.com/?q=Los+Rastrojos+Cabudare+Palavecino+Lara',
    10.015, -69.23,
    'convzlacomando');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Operación Todos con VZLA — Jiménez', 'Avenida 5 entre Calle 13 y 14, Parroquia Juan Bautista Rodríguez, Quíbor',
    (select id from public.parroquia where nombre = 'JUAN B RODRIGUEZ'
      and municipio_id = (select id from public.municipio where nombre = 'JIMENEZ'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado | abrigos y otros implementos de protección | cascos de protección | linternas, pilas y cargadores portátiles', '', '',
    'Primeros auxilios: guantes, vendas, alcohol, inyectadoras. Para rescatistas: cascos, guantes de protección, linternas, cinceles, picos, tobos, palas, mandarrias, disco de corte. | Fuente: Flyer @convzlacomando · Operación Todos con VZLA | Maps: https://maps.google.com/?q=Av+5+Calle+13+Qu%C3%ADbor+Lara',
    9.929, -69.632,
    'convzlacomando');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Operación Todos con VZLA — Crespo', 'Calle 13 entre Carreras 12 y 13, Duaca',
    (select id from public.parroquia where nombre = 'FREITEZ'
      and municipio_id = (select id from public.municipio where nombre = 'CRESPO'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado | abrigos y otros implementos de protección | cascos de protección | linternas, pilas y cargadores portátiles', '', '',
    'Primeros auxilios: guantes, vendas, alcohol, inyectadoras. Para rescatistas: cascos, guantes de protección, linternas, cinceles, picos, tobos, palas, mandarrias, disco de corte. | Fuente: Flyer @convzlacomando · Operación Todos con VZLA | Maps: https://maps.google.com/?q=Calle+13+Carrera+12+Duaca+Lara',
    10.27, -69.139,
    'convzlacomando');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Operación Todos con VZLA — Torres', 'Academia Cecilio Acosta, Av. Dr. Pastor Oropeza entre calles 6 y 7, Sector Antonio José de Sucre, una cuadra antes de Monpet, Carora',
    (select id from public.parroquia where nombre = 'TRINIDAD SAMUEL'
      and municipio_id = (select id from public.municipio where nombre = 'TORRES'
        and estado_id = (select id from public.estado where nombre = 'LARA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado | abrigos y otros implementos de protección | cascos de protección | linternas, pilas y cargadores portátiles', '', '',
    'Primeros auxilios: guantes, vendas, alcohol, inyectadoras. Para rescatistas: cascos, guantes de protección, linternas, cinceles, picos, tobos, palas, mandarrias, disco de corte. | Fuente: Flyer @convzlacomando · Operación Todos con VZLA | Maps: https://maps.google.com/?q=Academia+Cecilio+Acosta+Av+Pastor+Oropeza+Carora',
    10.175, -70.079,
    'convzlacomando');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('El Sistema — Núcleo Mérida', 'El Sistema Nacional de Orquestas y Coros Juveniles e Infantiles, Núcleo Mérida, Calle 37 entre Av. 2 y 3, Sector Glorias Patrias, Mérida · Horario: sábado 27 de junio, 9:00 a.m. a 4:00 p.m.',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | linternas, pilas y cargadores portátiles', '', '',
    'Operativo especial de recolección para Caracas y La Guaira. Insumos médicos específicos: guantes, torniquetes, lidocaína tópica, algodón, diclofenaco, ibuprofeno, acetaminofén, sueros, bebidas con electrolitos, vitamina K, dipirona, gasas, solución 0.9, alcohol, agua oxigenada, vendas, suturas, jeringas, gerdex. También reciben alimentos no perecederos, pañales, toallas sanitarias, bolsas negras, linternas y agua embotellada. | Fuente: Story @meridaven · @programa.musicapopularmerida | Maps: https://maps.google.com/?q=Calle+37+Glorias+Patrias+M%C3%A9rida',
    8.591, -71.15,
    'programa.musicapopularmerida');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Local Scuderia — Mérida se une', 'Local Scuderia, final Av. 16 de Septiembre con calle Miranda, diagonal a las canchas del Luis Ghersi, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Iniciativa “Mérida se une”. Reciben también velas y fósforos. Contactos: Zorimar Quintero +58 424-7659598 · Sthefanny Quintero +58 412-1011049 (por WhatsApp para coordinar entregas o aportes económicos). | Fuente: Flyer @meridaven — Local Scuderia | Maps: https://maps.google.com/?q=Av+16+de+Septiembre+Miranda+M%C3%A9rida',
    8.583, -71.149,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Traki Mérida', 'Edificio Traki, Av. Los Próceres, Mérida · Horario: 8:30 a.m. a 8:00 p.m.',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Story @meridaven · @eri.nunez4 | Maps: https://maps.google.com/?q=Traki+Av+Los+Pr%C3%B3ceres+M%C3%A9rida',
    8.587, -71.162,
    'meridaven');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Universidad de Los Andes (ULA) — Edificio del Rectorado', 'Edificio del Rectorado, Universidad de Los Andes, Mérida · Horario: viernes 26/6/26, 8:30 a.m. a 2:00 p.m.',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos', '', '',
    'Solo reciben enlatados y agua potable. | Fuente: Flyer oficial Universidad de Los Andes | Maps: https://maps.google.com/?q=Rectorado+ULA+M%C3%A9rida',
    8.587, -71.145,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Animales Sin Nombre', 'Centro Comercial El Rodeo, Av. Las Américas, frente a la Estación de Servicio Alba Lago, Mérida 5101 · Contactar también por Instagram',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'alimentos no perecederos | medicamentos e insumos médicos', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.app.goo.gl/UKTLZFxNs1kcWVEZ7',
    8.5899, -71.1611,
    '_asn');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Colegio de Médicos de Mérida', 'Sede del Colegio de Médicos de Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | mantas y cobijas | ropa en buen estado', '', '',
    'Fuente: El Nacional · elnacional.com · Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=Colegio+de+M%C3%A9dicos+M%C3%A9rida',
    8.5916, -71.1448,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('CC Rodeo Plaza — Piso 1', 'CC Rodeo Plaza, Av. Andrés Bello, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=CC+Rodeo+Plaza%2C+Av.+Andrés+Bello%2C+Mérida',
    8.581, -71.148,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Servisalud / Farmacia Micori', 'Servisalud / Farmacia Micori, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Servisalud+/+Farmacia+Micori%2C+Mérida',
    8.587, -71.145,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Fuerza ULA — Patio Central de FACIJUP', 'Patio Central de FACIJUP, Universidad de Los Andes, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Patio+Central+de+FACIJUP%2C+Universidad+de+Los+Andes%2C+Mérida',
    8.59, -71.145,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Edificio Administrativo de la ULA', 'Edificio Administrativo, Universidad de Los Andes, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Edificio+Administrativo%2C+Universidad+de+Los+Andes%2C+Mérida',
    8.591, -71.148,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Escuela Vicente Dávila — Parroquia Milla', 'Escuela Vicente Dávila, Parroquia Milla, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Escuela+Vicente+Dávila%2C+Parroquia+Milla%2C+Mérida',
    8.602, -71.143,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Liceo Ezequiel Zamora — Parroquia Arias', 'Liceo Ezequiel Zamora, Parroquia Arias, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Liceo+Ezequiel+Zamora%2C+Parroquia+Arias%2C+Mérida',
    8.585, -71.153,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Escuela El Educador — Parroquia Jacinto Plaza', 'Escuela El Educador, Parroquia Jacinto Plaza, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Escuela+El+Educador%2C+Parroquia+Jacinto+Plaza%2C+Mérida',
    8.599, -71.139,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Politécnico Santiago Mariño — Mérida', 'Politécnico Santiago Mariño, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Politécnico+Santiago+Mariño%2C+Mérida',
    8.584, -71.141,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Facultad de Medicina ULA', 'Facultad de Medicina, Universidad de Los Andes, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Facultad+de+Medicina%2C+Universidad+de+Los+Andes%2C+Mérida',
    8.5915, -71.147,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Facultad de Ingeniería ULA', 'Facultad de Ingeniería, Universidad de Los Andes, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Facultad+de+Ingeniería%2C+Universidad+de+Los+Andes%2C+Mérida',
    8.5905, -71.149,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Hiper Garzón — Las Américas', 'Hiper Garzón, Av. Las Américas, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Hiper+Garzón%2C+Av.+Las+Américas%2C+Mérida',
    8.575, -71.167,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Cumis Por Venezuela', 'Cumis Por Venezuela, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Cumis+Por+Venezuela%2C+Mérida',
    8.588, -71.144,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('McDonald''s Av. Las Américas', 'McDonald''s, Av. Las Américas, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=McDonald''s%2C+Av.+Las+Américas%2C+Mérida',
    8.577, -71.164,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Plaza de la Parroquia', 'Plaza de la Parroquia, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Plaza+de+la+Parroquia%2C+Mérida',
    8.59, -71.143,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Farmacia Las Tapias', 'Farmacia Las Tapias, Av. Andrés Bello, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Farmacia+Las+Tapias%2C+Av.+Andrés+Bello%2C+Mérida',
    8.567, -71.157,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Estudiantes de Comunicación Social — ULA', 'Escuela de Comunicación Social, Universidad de Los Andes, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Escuela+de+Comunicación+Social%2C+Universidad+de+Los+Andes%2C+Mérida',
    8.591, -71.148,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Liceo Libertador — Parroquia El Llano', 'Liceo Libertador, Parroquia El Llano, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Liceo+Libertador%2C+Parroquia+El+Llano%2C+Mérida',
    8.597, -71.141,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Comisión de Bomberos ULA', 'Comisión de Bomberos ULA, Universidad de Los Andes, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Comisión+de+Bomberos+ULA%2C+Universidad+de+Los+Andes%2C+Mérida',
    8.591, -71.148,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('REFULA — Av. Don Tulio', 'REFULA (Residencia Estudiantil), Av. Don Tulio, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=REFULA+(Residencia+Estudiantil)%2C+Av.+Don+Tulio%2C+Mérida',
    8.5905, -71.147,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Grupo de Rescate Domingo Peña', 'Grupo de Rescate Domingo Peña, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Grupo+de+Rescate+Domingo+Peña%2C+Mérida',
    8.588, -71.144,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Av. Universidad — Mérida', 'Av. Universidad, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Av.+Universidad%2C+Mérida',
    8.584, -71.15,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Plaza Las Heroínas', 'Plaza Las Heroínas, Mérida (al lado del Teleférico)',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Plaza+Las+Heroínas%2C+Mérida+(al+lado+del+Teleférico)',
    8.581, -71.145,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Mérida Grill — CC Rodeo', 'Mérida Grill, CC Rodeo Plaza, Av. Andrés Bello, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Mérida+Grill%2C+CC+Rodeo+Plaza%2C+Av.+Andrés+Bello%2C+Mérida',
    8.581, -71.148,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sede Protección Civil — Mérida', 'Sede de Protección Civil del Estado Mérida, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Sede+de+Protección+Civil+del+Estado+Mérida%2C+Mérida',
    8.5905, -71.146,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Tealca — Av. Universidad', 'Tealca, Av. Universidad, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Tealca%2C+Av.+Universidad%2C+Mérida',
    8.584, -71.15,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('FitnessWorld — Mérida', 'FitnessWorld, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=FitnessWorld%2C+Mérida',
    8.586, -71.148,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('UNEARTE — Mérida', 'UNEARTE, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=UNEARTE%2C+Mérida',
    8.59, -71.145,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Cáritas Mérida', 'Sede de Cáritas, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Sede+de+Cáritas%2C+Mérida',
    8.591, -71.146,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('SPOT — Mérida', 'SPOT, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=SPOT%2C+Mérida',
    8.586, -71.149,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Suraki — Av. Las Américas', 'Suraki, Av. Las Américas, Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Suraki%2C+Av.+Las+Américas%2C+Mérida',
    8.577, -71.164,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Farmabien — todas sus sedes', 'Farmabien (todas sus sedes), Mérida',
    (select id from public.parroquia where nombre = 'ARIAS'
      and municipio_id = (select id from public.municipio where nombre = 'LIBERTADOR'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Farmabien+(todas+sus+sedes)%2C+Mérida',
    8.587, -71.148,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('CETA — El Vigía', 'CETA, Av. 16, Sector Barrio El Carmen, El Vigía, Mérida · Horario: hasta las 6:00 p.m.',
    (select id from public.parroquia where nombre = 'GABRIEL PICON G.'
      and municipio_id = (select id from public.municipio where nombre = 'ALBERTO ADRIANI'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Iniciativa “Apoyemos a Caracas y La Guaira”. Lo recolectado será trasladado en el transporte de Protección Civil. | Fuente: Story @meridaven · @cetaenlinea | Maps: https://maps.google.com/?q=Av+16+Barrio+El+Carmen+El+Vig%C3%ADa+M%C3%A9rida',
    8.624, -71.647,
    'cetaenlinea');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Gaman Grill', 'Gaman Grill, El Vigía, Mérida',
    (select id from public.parroquia where nombre = 'GABRIEL PICON G.'
      and municipio_id = (select id from public.municipio where nombre = 'ALBERTO ADRIANI'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Gaman+Grill%2C+El+Vigía%2C+Mérida',
    8.624, -71.646,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Plaza de Ejido', 'Plaza Bolívar de Ejido, Mérida',
    (select id from public.parroquia where nombre = 'ACEQUIAS'
      and municipio_id = (select id from public.municipio where nombre = 'CAMPO ELIAS'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Plaza+Bolívar+de+Ejido%2C+Mérida',
    8.5443, -71.231,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('CC Centenario', 'Centro Comercial Centenario, Ejido, Mérida',
    (select id from public.parroquia where nombre = 'ACEQUIAS'
      and municipio_id = (select id from public.municipio where nombre = 'CAMPO ELIAS'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.app.goo.gl/tAzSDnB7k78Rvq2K6',
    8.5451, -71.235,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Centro Campesino — Mucuchíes', 'Centro Campesino, Mucuchíes, Mérida',
    (select id from public.parroquia where nombre = 'MUCUCHIES'
      and municipio_id = (select id from public.municipio where nombre = 'RANGEL'
        and estado_id = (select id from public.estado where nombre = 'MERIDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'Punto reportado en el listado consolidado de @meridaaldia. Reciben insumos para los afectados por el terremoto. | Fuente: Lista @meridaaldia · @imjenn.i.fer — Principales centros de acopio Mérida | Maps: https://maps.google.com/?q=Centro+Campesino%2C+Mucuchíes%2C+Mérida',
    8.756, -70.918,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Centro de Acopio San Antonio — Bulevar de Las Minas', 'Bulevar de Las Minas, frente al Farmatodo, San Antonio de Los Altos',
    (select id from public.parroquia where nombre = 'SAN ANTONIO LOS ALTOS'
      and municipio_id = (select id from public.municipio where nombre = 'LOS SALIAS'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal', '', '',
    'Fuente: El Diario · eldiario.com/2026/06/25/centros-de-acopio-terremotos-en-venezuela | Maps: https://maps.google.com/?q=Bulevar+de+Las+Minas+San+Antonio+de+Los+Altos',
    10.37, -66.945,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Complejo Cultural Los Salias', 'Complejo Cultural Los Salias, San Antonio de Los Altos',
    (select id from public.parroquia where nombre = 'SAN ANTONIO LOS ALTOS'
      and municipio_id = (select id from public.municipio where nombre = 'LOS SALIAS'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal', '', '',
    'Fuente: El Diario · eldiario.com/2026/06/25/centros-de-acopio-terremotos-en-venezuela | Maps: https://maps.google.com/?q=Complejo+Cultural+Los+Salias+San+Antonio+de+Los+Altos',
    10.372, -66.946,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de Baruta — Plaza Alfredo Sadel', 'Plaza Alfredo Sadel, Las Mercedes, Municipio Baruta',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: AJE Venezuela · ajevenezuela.org/ayuda-venezuela/acopio | Maps: https://maps.google.com/?q=Plaza+Alfredo+Sadel+Las+Mercedes+Caracas',
    10.4736, -66.8606,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de Baruta — Sede de la Policía', 'Sede de la Policía Municipal de Baruta, Municipio Baruta',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: AJE Venezuela · ajevenezuela.org/ayuda-venezuela/acopio | Maps: https://maps.google.com/?q=Polic%C3%ADa+de+Baruta+Caracas',
    10.435, -66.866,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de Baruta — Sede Protección Civil El Cafetal', 'Sede de Protección Civil El Cafetal, Municipio Baruta',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: AJE Venezuela · ajevenezuela.org/ayuda-venezuela/acopio | Maps: https://maps.google.com/?q=Protecci%C3%B3n+Civil+El+Cafetal+Caracas',
    10.45, -66.835,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de Baruta — Concha Acústica de Bello Monte', 'Concha Acústica, Colinas de Bello Monte, Municipio Baruta · Horario: 24 horas',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: Story @alcaldiabaruta · @darwingonzalezp | Maps: https://maps.google.com/?q=Concha+Ac%C3%BAstica+Bello+Monte+Caracas',
    10.483, -66.865,
    'alcaldiabaruta');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Woman Clinix — Los Dos Caminos', 'Sede de Woman Clinix, Av. Sucre de Los Dos Caminos, Caracas · Horario: desde las 8:00 a.m.',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | sábanas | alimentos para mascotas', '', '',
    'Fuente: Flyer @womanclinix · @dragzambrano | Maps: https://maps.google.com/?q=Av+Sucre+Los+Dos+Caminos+Caracas',
    10.495, -66.844,
    'womanclinix');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Base de Operaciones Tu Gruero — Los Dos Caminos', 'Av. El Carmen de Los Dos Caminos, diagonal a Iglesia Claret',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: AJE Venezuela · ajevenezuela.org/ayuda-venezuela/acopio | Maps: https://maps.google.com/?q=Iglesia+Claret+Los+Dos+Caminos+Caracas',
    10.494, -66.842,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('G3 Logística — Caracas', 'Av. Principal de Los Cortijos de Lourdes, Edificio Maploca, Municipio Sucre',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', 'Lunes a viernes, 9:00am - 12:00pm y 2:00pm - 3:30pm',
    'Fuente: AJE Venezuela · ajevenezuela.org/ayuda-venezuela/acopio | Maps: https://maps.google.com/?q=Edificio+Maploca+Los+Cortijos+Caracas',
    10.49, -66.835,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Polideportivo Los Naranjos (Belisario Academy)', 'Polideportivo Los Naranjos, Av. Este 3, Los Naranjos, Municipio El Hatillo',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: AJE Venezuela · ajevenezuela.org/ayuda-venezuela/acopio | Maps: https://maps.google.com/?q=Polideportivo+Los+Naranjos+Caracas',
    10.443, -66.835,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sociedad civil — Vía La Unión', 'Frente a la iglesia Rumana, en la entrada a la vía de La Unión',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'alimentos no perecederos | pañales de bebé | artículos para niños', '+584142384085', '',
    '⚠️ URGENTE: Alimento para bebés y pañales son las necesidades prioritarias. | Fuente: Flyer Venezuela Unida · @cazamosfakenews · @lavidadenos · Lista colaborativa @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=10.4233,-66.823',
    10.4233, -66.823,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Canchas de fútbol striker', 'El cafetal San Luis',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | medicamentos e insumos médicos | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario | Maps: https://maps.google.com/?q=10.4667,-66.8426',
    10.4667, -66.8426,
    'hibrido.fit');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Las Tabaqueras', 'Av. Sorocaima, Urb Juan Iturbe, Edif. Las Tabaqueras, La Trinidad.',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | artículos para niños | mantas y cobijas | linternas, pilas y cargadores portátiles', '', '',
    'Fuente: Reporte comunitario | Maps: https://maps.google.com/?q=10.433,-66.8593',
    10.433, -66.8593,
    'rodandoenfamiliaporvenezuela');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('UNEFA SEDE PRINCIPAL', 'entre la Av. La Estancia y la Av. Caracas con calle Holanda, frente al Edificio Banaven (Cubo Negro)',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles', '', '',
    'Fuente: Post del rector de la universidad en instagram | Maps: https://maps.google.com/?q=10.4831,-66.8532',
    10.4831, -66.8532,
    'https://www.instagram.com/riverabastardo?igsh=MTU5djY3ZzRvenFtcQ==');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Colegio San Ignacio — Casa Loyola', 'Av. Santa Teresa de Jesús, Colegio San Ignacio, Caracas · Horario: lunes a viernes, 9:00 a.m. a 5:00 p.m.',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/zugcgz1ULwCMiHyx9',
    10.497, -66.847,
    'unidosenlamision');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('C.E.N "Vicente Salias"', 'Liceo Vicente Salias, Calle Roscio, Los Teques 1201, Miranda · Horario: desde 8:00 a.m.',
    (select id from public.parroquia where nombre = 'SAN ANTONIO LOS ALTOS'
      and municipio_id = (select id from public.municipio where nombre = 'LOS SALIAS'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=Liceo+Vicente+Salias+Los+Teques',
    10.345, -67.042,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Diócesis de Los Teques — Vicaría Santa Eulalia', 'Vicaría de Santa Eulalia, cerca del Cabotaje, Centro de Los Teques, Miranda',
    (select id from public.parroquia where nombre = 'SAN ANTONIO LOS ALTOS'
      and municipio_id = (select id from public.municipio where nombre = 'LOS SALIAS'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | artículos para niños | ropa en buen estado | mantas y cobijas | materiales para refugio | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=Vicar%C3%ADa+Santa+Eulalia+Los+Teques',
    10.345, -67.042,
    'vicaria_santaeulalia');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('I.E.E.E. "Francisco de Miranda"', 'Al lado de la parada de autobús de Las Cuatro Esquinas, Los Teques, Miranda',
    (select id from public.parroquia where nombre = 'SAN ANTONIO LOS ALTOS'
      and municipio_id = (select id from public.municipio where nombre = 'LOS SALIAS'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=Cuatro+Esquinas+Los+Teques',
    10.345, -67.042,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('E.T.I. "Roque Pinto"', 'Escuela Técnica Industrial Roque Pinto, Av. Víctor Batista, Los Teques 1201, Miranda',
    (select id from public.parroquia where nombre = 'SAN ANTONIO LOS ALTOS'
      and municipio_id = (select id from public.municipio where nombre = 'LOS SALIAS'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | kits de primeros auxilios | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=Escuela+T%C3%A9cnica+Roque+Pinto+Los+Teques',
    10.345, -67.042,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Protección Civil — Carrizal', 'Carretera Panamericana, Kilómetro 20, Montaña Alta, Carrizal, Miranda',
    (select id from public.parroquia where nombre = 'CARRIZAL'
      and municipio_id = (select id from public.municipio where nombre = 'CARRIZAL'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=Panamericana+Km+20+Carrizal',
    10.338, -67.027,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Centro Comercial El Líder', 'CC El Líder, Av. Francisco de Miranda entre Calle Santa Ana y Capitolio, Urbanización La California, Caracas · Horario: lunes a domingo, 10:00 a.m. a 6:00 p.m.',
    (select id from public.parroquia where nombre = 'PETARE'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'MIRANDA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | mantas y cobijas | abrigos y otros implementos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/kfJCA1NEdxsnxdSa7',
    10.476, -66.812,
    'zonadedescargaoficial');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Tecnosegura', 'Av. Bolívar, frente al Banco de Venezuela, puerta azul al lado del Potente, arriba de Farmapaz, Maturín, Monagas',
    (select id from public.parroquia where nombre = 'EL FURRIAL'
      and municipio_id = (select id from public.municipio where nombre = 'MATURIN'
        and estado_id = (select id from public.estado where nombre = 'MONAGAS'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | mantas y cobijas | ropa en buen estado', '04129425487, 04128757063, @tecnosegura', '',
    'Fuente: Reporte de un representante del centro | Maps: https://maps.google.com/?q=9.74706558,-63.18507021',
    9.74706558, -63.18507021,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Voluntad Popular', 'Calle 6, antigua Bermúdez, casa N° 11, antiguo restaurante El Oeste',
    (select id from public.parroquia where nombre = 'EL FURRIAL'
      and municipio_id = (select id from public.municipio where nombre = 'MATURIN'
        and estado_id = (select id from public.estado where nombre = 'MONAGAS'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=9.7457,-63.1832',
    9.7457, -63.1832,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('UECA "Dr. Braulio Pérez Marcio"', 'Urbanización Alberto ravell, detrás del hospital universitario Manuel Núñez Tovar',
    (select id from public.parroquia where nombre = 'EL FURRIAL'
      and municipio_id = (select id from public.municipio where nombre = 'MATURIN'
        and estado_id = (select id from public.estado where nombre = 'MONAGAS'))),
    'agua potable | alimentos no perecederos | artículos de higiene personal | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario | Maps: https://maps.google.com/?q=9.7429,-63.1997',
    9.7429, -63.1997,
    'uecabraulioperezmarcio.oficial');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Cede postgrado unesr', 'Av libertador',
    (select id from public.parroquia where nombre = 'EL FURRIAL'
      and municipio_id = (select id from public.municipio where nombre = 'MATURIN'
        and estado_id = (select id from public.estado where nombre = 'MONAGAS'))),
    'agua potable | medicamentos e insumos médicos | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario | Maps: https://maps.google.com/?q=9.7313,-63.1947',
    9.7313, -63.1947,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Universidad de oriente', 'Avenida universidad',
    (select id from public.parroquia where nombre = 'EL FURRIAL'
      and municipio_id = (select id from public.municipio where nombre = 'MATURIN'
        and estado_id = (select id from public.estado where nombre = 'MONAGAS'))),
    'agua potable | alimentos no perecederos | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario | Maps: https://maps.google.com/?q=9.7254,-63.1902',
    9.7254, -63.1902,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Iglesia Casa de Dios', 'Av. Libertador, Antiguo galpón de la Mitsubishi, detrás de Papa y son',
    (select id from public.parroquia where nombre = 'EL FURRIAL'
      and municipio_id = (select id from public.municipio where nombre = 'MATURIN'
        and estado_id = (select id from public.estado where nombre = 'MONAGAS'))),
    'medicamentos e insumos médicos | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario | Maps: https://maps.google.com/?q=9.738,-63.1658',
    9.738, -63.1658,
    'Casadediossobrenatural');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Centro Comercial Sambil Margarita', 'Sambil Margarita, Av. Jóvito Villalba, Sector San Lorenzo, Pampatar 6316, Nueva Esparta · Horario: 10:00 a.m. a 9:00 p.m.',
    (select id from public.parroquia where nombre = 'PAMPATAR'
      and municipio_id = (select id from public.municipio where nombre = 'MANEIRO'
        and estado_id = (select id from public.estado where nombre = 'NVA.ESPARTA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/j1oX3igxq24PWDNh7',
    11.005, -63.79,
    'tusambilmgta');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Colegio de Ingenieros del Estado Portuguesa (CEINPORT)', 'Sede del Colegio de Ingenieros del Estado Portuguesa, Guanare',
    (select id from public.parroquia where nombre = 'GUANARE'
      and municipio_id = (select id from public.municipio where nombre = 'GUANARE'
        and estado_id = (select id from public.estado where nombre = 'PORTUGUESA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | ropa en buen estado | mantas y cobijas', '', '',
    'Iniciativa S.O.S. Venezuela junto con FundaVidan, Fondaris y Talento 58. Contactos: 0416-756-1364 · 0414-522-8424 · 0414-506-4142 · 0414-555-0870. Reciben principalmente alimentos no perecederos, agua, bebidas isotónicas, suero oral (pediátrico), compotas, pañales, colchones, mantas y ropa. También canalizan insumos médicos y herramientas con priorización. | Fuente: Story @jesusjavieraleman · @valvulapolitica | Maps: https://maps.google.com/?q=Colegio+de+Ingenieros+Portuguesa+Guanare',
    9.044, -69.751,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('General Service 8a', 'Corredor vial esquina calle 7, al lado del Centro Comercial Giramara, Guanare · Horario: lunes a sábado, 8:00 a.m. a 6:00 p.m.',
    (select id from public.parroquia where nombre = 'GUANARE'
      and municipio_id = (select id from public.municipio where nombre = 'GUANARE'
        and estado_id = (select id from public.estado where nombre = 'PORTUGUESA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://share.google/SOjMmm3Jlc0jJnr1i',
    9.044, -69.751,
    'generalservice8a');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Centro de Acopio 5ta Transversal', '5ta transversal, Av. Gran Mariscal y Av. Santa Rosa, entre Zen y Los Hermanos Wasi',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'SUCRE'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado', '', '9:00am - 6:00pm',
    'Insumos médicos: gasas, alcohol, algodón y jeringas. | Fuente: Flyer Centro de Acopio Sucre | Maps: https://maps.google.com/?q=5ta+transversal+Av+Gran+Mariscal+Santa+Rosa+Cuman%C3%A1',
    10.461, -64.176,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Cruz Roja Venezolana — Sucre', 'Sede de la Cruz Roja Venezolana, Municipio Sucre, Cumaná',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'SUCRE'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | mantas y cobijas | artículos de higiene personal', '', '',
    'Reconocido oficialmente por la Alcaldía de Cumaná como uno de los únicos centros de acopio oficiales del Municipio Sucre. | Fuente: Comunicado oficial Alcaldía de Cumaná · Protección Civil y Administración de Desastres Estado Sucre | Maps: https://maps.google.com/?q=Cruz+Roja+Venezolana+Cuman%C3%A1',
    10.456, -64.172,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('E/S Virgen del Valle 2', 'Estación de Servicio Virgen del Valle 2, Cumaná',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'SUCRE'))),
    'agua potable | alimentos no perecederos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', 'Lunes a viernes, 7:30am - 5:00pm',
    'Recolecta destinada a las víctimas del sismo en Caracas. Alimentos: enlatados, arroz, pasta, granos, harina, leche en polvo. Ropa y sábanas deben entregarse limpias y clasificadas. | Fuente: Flyer ¡Manos a la obra por Caracas! | Maps: https://maps.google.com/?q=Estaci%C3%B3n+de+Servicio+Virgen+del+Valle+2+Cuman%C3%A1',
    null, null,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Protección Civil Sucre — Sedes oficiales', 'Sedes de Protección Civil y Administración de Desastres, Municipio Sucre, Cumaná',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'SUCRE'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | mantas y cobijas | artículos de higiene personal', '', '',
    'Reconocido oficialmente por la Alcaldía de Cumaná como uno de los únicos centros de acopio oficiales del Municipio Sucre. | Fuente: Comunicado oficial Alcaldía de Cumaná · Protección Civil y Administración de Desastres Estado Sucre | Maps: https://maps.google.com/?q=Protecci%C3%B3n+Civil+Cuman%C3%A1+Sucre',
    10.4548, -64.171,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('UNESR — Núcleo Mariscal Antonio José de Sucre', 'Universidad Nacional Experimental Simón Rodríguez, Núcleo Mariscal Antonio José de Sucre, Cumaná',
    (select id from public.parroquia where nombre = 'ALTAGRACIA'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'SUCRE'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado', '', '8:30am - 5:30pm',
    'Insumos médicos: gasas, alcohol, algodón y jeringas. Campaña de Solidaridad Universitaria. | Fuente: Flyer UNESR · #SolidaridadUniversitaria | Maps: https://maps.google.com/?q=UNESR+N%C3%BAcleo+Cuman%C3%A1',
    10.46, -64.173,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('UNESR — Núcleo Mariscal Antonio José de Sucre', 'Universidad Nacional Experimental Simón Rodríguez, Núcleo Mariscal Antonio José de Sucre, Mariguitar',
    (select id from public.parroquia where nombre = 'MARIGUITAR'
      and municipio_id = (select id from public.municipio where nombre = 'BOLIVAR'
        and estado_id = (select id from public.estado where nombre = 'SUCRE'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado', '', '8:30am - 5:30pm',
    'Insumos médicos: gasas, alcohol, algodón y jeringas. Campaña de Solidaridad Universitaria. | Fuente: Flyer UNESR · #SolidaridadUniversitaria | Maps: https://maps.google.com/?q=UNESR+Mariguitar+Sucre',
    10.434, -63.917,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Universidad de Los Andes — Núcleo Táchira', 'Núcleo Táchira de la ULA, San Cristóbal',
    (select id from public.parroquia where nombre = 'LA CONCORDIA'
      and municipio_id = (select id from public.municipio where nombre = 'SAN CRISTOBAL'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: Lista colaborativa @lorenadavilaaaaa | Maps: https://maps.google.com/?q=ULA+N%C3%BAcleo+T%C3%A1chira+San+Crist%C3%B3bal',
    7.766, -72.23,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Ven Únete — Sede Civil', 'Sede de Civil, Edificio A, Cochineras, San Cristóbal',
    (select id from public.parroquia where nombre = 'LA CONCORDIA'
      and municipio_id = (select id from public.municipio where nombre = 'SAN CRISTOBAL'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'agua potable | alimentos no perecederos | kits de primeros auxilios | mantas y cobijas | linternas, pilas y cargadores portátiles', '', 'A partir del jueves 25 de junio',
    'Fuente: Flyer Ven Únete · La fuerza estudiantil que transforma | Maps: https://maps.google.com/?q=UNET+Cochineras+San+Crist%C3%B3bal',
    7.767, -72.216,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Rotaract Zona Táchira — Revista Rotaria', 'Revista Rotaria, frente a la Cruz Roja, San Cristóbal',
    (select id from public.parroquia where nombre = 'LA CONCORDIA'
      and municipio_id = (select id from public.municipio where nombre = 'SAN CRISTOBAL'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | artículos de higiene personal | pañales de bebé | pañales de adulto | linternas, pilas y cargadores portátiles | alimentos para mascotas | cascos de protección | abrigos y otros implementos de protección', '+584147121207', '',
    'Alimentos no perecederos que no necesiten cocción. Reciben también toallas sanitarias, perrarina, gatarina, powerbanks (baterías recargables), y guantes de protección para trabajar con escombros. | Fuente: Flyer Rotaract Zona Táchira | Maps: https://maps.google.com/?q=Revista+Rotaria+San+Crist%C3%B3bal',
    7.765093, -72.222636,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Rotaract Zona Táchira — Edificio Rotario Dr. Augusto Peña Sosa', 'Edificio Rotario Dr. Augusto Peña Sosa, Piso 2, Avenida 19 de Abril, San Cristóbal',
    (select id from public.parroquia where nombre = 'LA CONCORDIA'
      and municipio_id = (select id from public.municipio where nombre = 'SAN CRISTOBAL'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | artículos de higiene personal | pañales de bebé | pañales de adulto | linternas, pilas y cargadores portátiles | alimentos para mascotas | cascos de protección | abrigos y otros implementos de protección', '', '8:00am - 4:00pm',
    'Alimentos no perecederos que no necesiten cocción. Reciben también toallas sanitarias, perrarina, gatarina, powerbanks (baterías recargables), y guantes de protección para trabajar con escombros. | Fuente: Flyer Rotaract Zona Táchira | Maps: https://maps.google.com/?q=Edificio+Rotario+Augusto+Pe%C3%B1a+Sosa+San+Crist%C3%B3bal',
    7.767114, -72.228487,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('MUN UCAT — Boulevard de la UCAT', 'Boulevard de la UCAT, sede vieja, Barrio Obrero, San Cristóbal',
    (select id from public.parroquia where nombre = 'LA CONCORDIA'
      and municipio_id = (select id from public.municipio where nombre = 'SAN CRISTOBAL'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'agua potable | ropa en buen estado | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | alimentos para mascotas', '', '25 y 26 de junio',
    'Reciben ropa para todas las edades. | Fuente: Flyer MUN UCAT · Recolección de donaciones | Maps: https://maps.google.com/?q=UCAT+sede+vieja+Barrio+Obrero+San+Crist%C3%B3bal',
    7.7607, -72.235,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Hotel Eurobuilding El Tama — Idea Market local 5', 'Hotel Eurobuilding El Tama, Idea Market, local 5, San Cristóbal',
    (select id from public.parroquia where nombre = 'LA CONCORDIA'
      and municipio_id = (select id from public.municipio where nombre = 'SAN CRISTOBAL'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: Lista colaborativa @lorenadavilaaaaa | Maps: https://maps.google.com/?q=Hotel+Eurobuilding+El+Tama+San+Crist%C3%B3bal',
    7.775, -72.205,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Supermarket SC', 'Centro de Acopio Supermarket SC, San Cristóbal',
    (select id from public.parroquia where nombre = 'LA CONCORDIA'
      and municipio_id = (select id from public.municipio where nombre = 'SAN CRISTOBAL'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '',
    'Fuente: Lista colaborativa @lorenadavilaaaaa | Maps: https://maps.google.com/?q=Supermarket+SC+San+Crist%C3%B3bal',
    7.7669, -72.225,
    'supermarket_sc');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Madeco — Centro de Acopio', 'Madeco, Av. Cuatricentenaria, San Cristóbal',
    (select id from public.parroquia where nombre = 'LA CONCORDIA'
      and municipio_id = (select id from public.municipio where nombre = 'SAN CRISTOBAL'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado | mantas y cobijas | alimentos para mascotas', '', '',
    'Reciben también sábanas. Iniciativa por el 51° aniversario de Madeco. Donaciones destinadas a Caracas y La Guaira. | Fuente: Flyer @madeco_contigo · 51 Aniversario | Maps: https://maps.google.com/?q=Madeco+Av+Cuatricentenaria+San+Crist%C3%B3bal',
    7.7669, -72.225,
    'madeco_contigo');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Centro de Acopio UNET — FUNDEUNET', 'Centro de Acopio UNET (Universidad Nacional Experimental del Táchira), San Cristóbal',
    (select id from public.parroquia where nombre = 'LA CONCORDIA'
      and municipio_id = (select id from public.municipio where nombre = 'SAN CRISTOBAL'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado | alimentos para mascotas', '', '',
    'Reciben ropa nueva o usada en buen estado y limpia (camisas, pantalones, zapatos, sacos); alimentos no perecederos (arroz, pasta, latas, aceite, granos); medicamentos no vencidos (analgésicos, antibióticos, vendajes, desinfectantes); y alimentos para mascotas (croquetas y latas para perros y gatos). Si no puedes llevar la donación, contacta al Ing. Manuel Altuve (Representante al Consejo Universitario de Egresados UNET) y la pasarán a buscar. | Fuente: Flyer FUNDEUNET (Fundación de Egresados UNET) · Ing. Manuel Altuve | Maps: https://maps.google.com/?q=UNET+San+Crist%C3%B3bal',
    7.768, -72.227,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Centro de Acopio Universitario — FCCU, Cogobierno y Alpha', 'Sede Industrial, Edificio A, al lado de Proveeduría (pasando la peluquería), San Cristóbal',
    (select id from public.parroquia where nombre = 'LA CONCORDIA'
      and municipio_id = (select id from public.municipio where nombre = 'SAN CRISTOBAL'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'agua potable | alimentos no perecederos | ropa en buen estado | mantas y cobijas | pañales de bebé | artículos para niños', '', 'Recepción a partir del viernes 26 de junio, desde las 8:00am',
    'Necesitan mucha agua, leche en polvo de bebé y ropa de bebé. Todo debe entregarse limpio y en buen estado. Iniciativa universitaria de FCCU (Federación de Centros Universitarios), Cogobierno Estudiantil y Alpha. | Fuente: Flyer @alphauniversidad · Solidaridad con Venezuela | Maps: https://maps.google.com/?q=UNET+Sede+Industrial+San+Crist%C3%B3bal',
    7.768, -72.227,
    'alphauniversidad');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Policlínica Táchira', 'Av. Rotaria',
    (select id from public.parroquia where nombre = 'LA CONCORDIA'
      and municipio_id = (select id from public.municipio where nombre = 'SAN CRISTOBAL'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'alimentos no perecederos | ropa en buen estado | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario | Maps: https://maps.google.com/?q=7.7587,-72.2142',
    7.7587, -72.2142,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Universidades experimental del Tachira (UNET)', 'Pueblo nuevo, San Cristóbal',
    (select id from public.parroquia where nombre = 'LA CONCORDIA'
      and municipio_id = (select id from public.municipio where nombre = 'SAN CRISTOBAL'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'agua potable | medicamentos e insumos médicos | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario | Maps: https://maps.google.com/?q=7.7923,-72.2018',
    7.7923, -72.2018,
    'ven.unete');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Rotaract Zona Táchira — Brave Community Fitness', 'Brave Community Fitness, al lado del Hotel Manuel, San Antonio del Táchira',
    (select id from public.parroquia where nombre = 'LA CONCORDIA'
      and municipio_id = (select id from public.municipio where nombre = 'SAN CRISTOBAL'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | artículos de higiene personal | pañales de bebé | pañales de adulto | linternas, pilas y cargadores portátiles | alimentos para mascotas | cascos de protección | abrigos y otros implementos de protección', '+573508741816', '',
    'Alimentos no perecederos que no necesiten cocción. Reciben también toallas sanitarias, perrarina, gatarina, powerbanks (baterías recargables), y guantes de protección para trabajar con escombros. | Fuente: Flyer Rotaract Zona Táchira | Maps: https://maps.google.com/?q=Brave+Community+Fitness+San+Antonio+T%C3%A1chira',
    7.8146, -72.443,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Rotaract Zona Táchira — Centro Médico Rotario César Darío González', 'Centro Médico Rotario César Darío González, Táriba',
    (select id from public.parroquia where nombre = 'TARIBA'
      and municipio_id = (select id from public.municipio where nombre = 'CARDENAS'
        and estado_id = (select id from public.estado where nombre = 'TACHIRA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | artículos de higiene personal | pañales de bebé | pañales de adulto | linternas, pilas y cargadores portátiles | alimentos para mascotas | cascos de protección | abrigos y otros implementos de protección', '+582763949051', '',
    'Alimentos no perecederos que no necesiten cocción. Reciben también toallas sanitarias, perrarina, gatarina, powerbanks (baterías recargables), y guantes de protección para trabajar con escombros. | Fuente: Flyer Rotaract Zona Táchira | Maps: https://maps.google.com/?q=Centro+M%C3%A9dico+Rotario+C%C3%A9sar+Dar%C3%ADo+Gonz%C3%A1lez+T%C3%A1riba',
    7.8186, -72.2236,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sociedad civil', 'Municipio Pampanito: Pampanito I, Urb. Villa Hermosa, 4ta calle, Casa N° 377',
    (select id from public.parroquia where nombre = 'PAMPANITO'
      and municipio_id = (select id from public.municipio where nombre = 'PAMPANITO'
        and estado_id = (select id from public.estado where nombre = 'TRUJILLO'))),
    'alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado', 'Laudelino Vásquez (04129843407)', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=9.366914,-70.436787',
    9.366914, -70.436787,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Centro de Acopio Municipio Sucre', 'Urb. El Trompillo 2, parroquia Valmore Rodríguez, casa #39, Municipio Sucre',
    (select id from public.parroquia where nombre = 'SABANA DE MENDOZA'
      and municipio_id = (select id from public.municipio where nombre = 'SUCRE'
        and estado_id = (select id from public.estado where nombre = 'TRUJILLO'))),
    'medicamentos e insumos médicos | alimentos no perecederos | ropa en buen estado', 'Gabriela Delgado 0412-1644063', '',
    'Fuente: Flyer Venezuela Unida · @cazamosfakenews · @lavidadenos | Maps: https://maps.google.com/?q=Urb+El+Trompillo+Valmore+Rodr%C3%ADguez+Sucre+Trujillo',
    9.472, -70.74,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sociedad civil', 'Municipio Trujillo Capital. Centro Comercial Plaza Marina. Local 30',
    (select id from public.parroquia where nombre = 'CRISTOBAL MENDOZA'
      and municipio_id = (select id from public.municipio where nombre = 'TRUJILLO'
        and estado_id = (select id from public.estado where nombre = 'TRUJILLO'))),
    'alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado', 'Luis Pulgar 0412-6840791', '',
    'Fuente: Lista colaborativa de @marielozadab y @nathaliesayago | Maps: https://maps.google.com/?q=9.3667,-70.4333',
    9.3667, -70.4333,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Casa Prada — Sociedad Civil', 'Av. Principal La Floresta, sector Santa Elena, Casa G-11 (Casa Prada), Valera',
    (select id from public.parroquia where nombre = 'MERCEDES DIAZ'
      and municipio_id = (select id from public.municipio where nombre = 'VALERA'
        and estado_id = (select id from public.estado where nombre = 'TRUJILLO'))),
    'medicamentos e insumos médicos | alimentos no perecederos | ropa en buen estado', 'Edgar Prada 0424-7137359', '',
    'Fuente: Flyer Venezuela Unida · @cazamosfakenews · @lavidadenos | Maps: https://maps.google.com/?q=Av+Principal+La+Floresta+Santa+Elena+Valera',
    9.3187, -70.6036,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('RELEVECA', 'Ciudad Ojeda, Centro Comercial Reycall, frente a la E/S La Tropicana',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | artículos de higiene personal | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado en sitio · Confirmado por Venezuela Unida @cazamosfakenews | Maps: https://maps.google.com/?q=Centro+Comercial+Reycall+Ciudad+Ojeda',
    10.1887, -71.3109,
    'releveca_ca');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Bomberos de Ciudad Ojeda', 'Plaza Bolívar de Ciudad Ojeda, Zulia · Horario: lunes a sábado, 9:00 a.m. a 6:00 p.m.',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/dwuTqXtVctu29ZANA',
    10.1968, -71.3151,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Frutería al lado del Banco Mercantil — Centro de Acopio', 'Frutería al lado del Banco Mercantil, Lagunillas, Ciudad Ojeda · Horario: lunes a sábado, 9:00 a.m. a 8:00 p.m.',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/pWeX2YJHeDQqob5x5',
    10.1985, -71.3143,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('TMS', 'Calle Córdova, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | mantas y cobijas | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://share.google/pIGOYGdrhfOUlb7Jj',
    10.1968, -71.3151,
    'tmsvenezuela');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Medisonrisa', 'Calle Farías, Centro Comercial Plaza Mayor, Local 5, Ciudad Ojeda 4019, Zulia',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://share.google/pIGOYGdrhfOUlb7Jj',
    10.1968, -71.3151,
    'medisonrisa');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Fundación Anticancerosa — Ciudad Ojeda', 'C. Santa Mónica con Carretera N, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/TVoWNMVvbJoPn8VS7',
    10.1968, -71.3151,
    'fundacionanticancerosa');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Fundación Divino Niño', 'Av. 44 con Calle Vargas, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/kMffXDbN2VDvT7Cd9',
    10.1968, -71.3151,
    'fundaciondivinonino');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Club de Leones — Ciudad Ojeda', 'Carretera N, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/mbmvEbJxueHc7GKL8',
    10.1968, -71.3151,
    'clubdeleonesciudadojeda');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Colegio San Agustín — Ciudad Ojeda', 'Carretera N, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/kPhvX559UwU7cksU9',
    10.1968, -71.3151,
    'uepsanagustin');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Instituto San José — Lagunillas', 'Lagunillas, Ciudad Ojeda, Zulia',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/uk3BT74sErFS3tYK8',
    10.1968, -71.3151,
    'institutosanjoselags');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Politécnico Santiago Mariño — Ciudad Ojeda', 'Calle Cardón, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/FsPPjsBN5WRiV58n9',
    10.1968, -71.3151,
    'psmciudadojeda');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('TEALCA — Ciudad Ojeda', 'Av. Intercomunal, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/5FqeWHqRDJL5WiLq9',
    10.1968, -71.3151,
    'tealcaciudadojeda8406');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('SIZUCA', 'Carretera N, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/YdTz2XprLhX4xtxE9',
    10.1968, -71.3151,
    'sizucave');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('CC Las Américas — Ciudad Ojeda', 'Calle Trujillo, Casco Central, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/VGcYzC9STkzGGFN9A',
    10.1968, -71.3151,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Club Árabe — Ciudad Ojeda', 'Av. 33, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/rG8pe2vyHjCjW8LS6',
    10.1968, -71.3151,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Inversiones Kely', 'Ciudad Urdaneta, El Danto, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/34MxznjBZkSjzQuA9',
    10.1968, -71.3151,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Whatever Cosmetics', 'Casco Central, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/RnVq47N328pCbQzE6',
    10.1968, -71.3151,
    'whatever.cosmetics');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Nilo Home', 'Calle Vargas, frente a la Plaza Bolívar, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/fPNBigJBENwZwa8F6',
    10.1968, -71.3151,
    'nilohome_');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Colnetwork', 'Av. Alonso con Calle Trujillo, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/8RWvT8q5isH8m5Pf8',
    10.1968, -71.3151,
    'colnetwork');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Lubritodo', 'Avenida Bolívar, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/oXbJns7B65Srnzbp7',
    10.1968, -71.3151,
    'lubritodo.ca');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Frutería Don Víctor', 'Ciudad Ojeda, Zulia',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/VdrdEV5oMaDjmdjc7',
    10.1968, -71.3151,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Papichys — todas sus sedes', 'Todas las sedes de Papichys, Ciudad Ojeda y alrededores',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/eefisxTfDZ5hSVw56',
    10.1968, -71.3151,
    'papichyszulia');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Tito Grill', 'Barrio Libertad, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/3aP6AS7yHfuL3PUq7',
    10.1968, -71.3151,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Eduardo Burguer', 'Carretera N, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://share.google/pIGOYGdrhfOUlb7Jj',
    10.1968, -71.3151,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('La Pizzería Ve', 'Urbanización Libertad, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/UdnhPdcgvZV9tpXFA',
    10.1968, -71.3151,
    'la_pizzeria.ve');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Bocados Burguers', 'Lagunillas, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/yrt1gdCg5hH8Wqdf6',
    10.1968, -71.3151,
    'bocados.burguers');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sanoa', 'Calle Nueva Esparta, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/NNUad9jfjYKmUnYVA',
    10.1968, -71.3151,
    'sanoa.ve');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Tottys Pets', 'Detrás de la bomba Millenium, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | artículos de higiene personal | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/naNyu8uQnGphemD2A',
    10.1968, -71.3151,
    'tottyspets');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Rutas Sin Límites', 'Casco Central, Ciudad Ojeda',
    (select id from public.parroquia where nombre = 'ELEAZAR LOPEZ C'
      and municipio_id = (select id from public.municipio where nombre = 'LAGUNILLAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | mantas y cobijas | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=Casco+Central+Ciudad+Ojeda',
    10.1968, -71.3151,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Acopio Cabimas - Punto 1 (frente Hotel Costa Sol)', 'Carretera H, frente al Hotel Costa Sol (antiguo El Remanso), Cabimas',
    (select id from public.parroquia where nombre = 'AMBROSIO'
      and municipio_id = (select id from public.municipio where nombre = 'CABIMAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | artículos de higiene personal', '', '',
    'Fuente: Flyer Alcaldía Bolivariana de Cabimas | Maps: https://maps.google.com/?q=10.395,-71.445',
    10.395, -71.445,
    'alcaldiabcabimas_');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Acopio Cabimas - Punto 2 (frente Corpoelec)', 'Avenida 32 con Carretera H, frente a las oficinas de Corpoelec, Cabimas',
    (select id from public.parroquia where nombre = 'AMBROSIO'
      and municipio_id = (select id from public.municipio where nombre = 'CABIMAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | artículos de higiene personal', '', '',
    'Fuente: Flyer Alcaldía Bolivariana de Cabimas | Maps: https://maps.google.com/?q=10.39,-71.447',
    10.39, -71.447,
    'alcaldiabcabimas_');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Acopio Cabimas - Punto 3 (CC Borjas, Xtrema 98.9FM)', 'Carretera H, Centro Comercial Borjas, estación radial Xtrema 98.9FM, Cabimas',
    (select id from public.parroquia where nombre = 'AMBROSIO'
      and municipio_id = (select id from public.municipio where nombre = 'CABIMAS'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | artículos de higiene personal', '', '',
    'Fuente: Flyer Alcaldía Bolivariana de Cabimas | Maps: https://maps.google.com/?q=10.385,-71.449',
    10.385, -71.449,
    'alcaldiabcabimas_');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Colegio de Médicos del Zulia', 'Av. 16 con Calle 56, Maracaibo 4005',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'medicamentos e insumos médicos | kits de primeros auxilios', '', '',
    'Fuente: Flyer uBag · Puntos de recolección Maracaibo | Maps: https://maps.google.com/?q=Colegio+de+M%C3%A9dicos+Maracaibo+Av+16+Calle+56',
    10.665, -71.62,
    'comezu_2021');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('"Korea Japón Motor"', 'Av. 15 Delicias con Calle 69, pasando la Clínica de Izot, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Flyer comunitario centros de acopio Maracaibo | Maps: https://maps.google.com/?q=Av+15+Delicias+Calle+69+Maracaibo',
    10.648, -71.623,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('"Pandaventura" CC Galerías', 'CC Galerías Mall, planta baja, frente al Restaurante Oasis, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | abrigos y otros implementos de protección', '', '',
    'Fuente: Flyer comunitario centros de acopio Maracaibo | Maps: https://maps.google.com/?q=CC+Galer%C3%ADas+Mall+Maracaibo',
    10.674, -71.608,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Basílica de Chiquinquirá', 'Av. 12 con Calle 96, final Paseo Las Ciencias, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | artículos de higiene personal', '', '',
    'Fuente: Flyer uBag · Puntos de recolección Maracaibo | Maps: https://maps.google.com/?q=Bas%C3%ADlica+Chiquinquir%C3%A1+Maracaibo',
    10.638, -71.638,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de Maracaibo — Plaza de la República', 'Plaza de la República, Calle 77 (5 de Julio) con Av. 3Y, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '8:00am - 6:00pm',
    'Fuente: Flyer oficial Alcaldía Bolivariana de Maracaibo · @alcaldiabmcbo | Maps: https://maps.google.com/?q=Plaza+de+la+Rep%C3%BAblica+Calle+77+Maracaibo',
    10.671, -71.616,
    'alcaldiabmcbo');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de Maracaibo — Estación Central del Tranvía', 'Av. 2 El Milagro, dentro del Parque Vereda del Lago, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '8:00am - 6:00pm',
    'Fuente: Flyer oficial Alcaldía Bolivariana de Maracaibo · @alcaldiabmcbo | Maps: https://maps.google.com/?q=Parque+Vereda+del+Lago+Maracaibo',
    10.685, -71.609,
    'alcaldiabmcbo');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de Maracaibo — Plaza Canta Claro', 'Plaza Canta Claro, Urbanización Canta Claro, entre calles 51 y 52, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '8:00am - 6:00pm',
    'Fuente: Flyer oficial Alcaldía Bolivariana de Maracaibo · @alcaldiabmcbo | Maps: https://maps.google.com/?q=Urbanizaci%C3%B3n+Canta+Claro+Maracaibo',
    10.658, -71.602,
    'alcaldiabmcbo');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de Maracaibo — Centro Deportivo y Cultura Patria Joven', 'Av. 92 y 94, entre calles 79G y 79H, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '8:00am - 6:00pm',
    'Fuente: Flyer oficial Alcaldía Bolivariana de Maracaibo · @alcaldiabmcbo | Maps: https://maps.google.com/?q=Centro+Deportivo+Patria+Joven+Maracaibo',
    10.643, -71.644,
    'alcaldiabmcbo');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de Maracaibo — Plaza Para Todos (Antigua Plaza de Toros)', 'Plaza Para Todos (Antigua Plaza de Toros), Av. 16 Guajira con prolongación Circunvalación 2, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto', '', '8:00am - 6:00pm',
    'Fuente: Flyer oficial Alcaldía Bolivariana de Maracaibo · @alcaldiabmcbo | Maps: https://maps.google.com/?q=Antigua+Plaza+de+Toros+Maracaibo',
    10.639, -71.648,
    'alcaldiabmcbo');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Grupo Nezco Venezuela — Maracaibo', 'Av. 12 entre 68-69, Local 69-95, Sector Tierra Negra, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | ropa en buen estado | mantas y cobijas | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal', '+584246081907', '',
    'También reciben calzado. Grupo Nezco coordina con empresas de transporte aliadas la distribución de ayudas a zonas afectadas, incluyendo Caracas y otras comunidades impactadas. | Fuente: Flyer Grupo Nezco Venezuela CA · @siempremimaracaibo | Maps: https://maps.google.com/?q=Av+12+entre+68+69+Tierra+Negra+Maracaibo',
    10.663, -71.621,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('U.E. Nuestra Sra. del Valle — VALLEMUN', 'Unidad Educativa Nuestra Sra. del Valle, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | materiales para refugio', '', 'Viernes 26 de junio, 8:00am - 5:00pm',
    'Iniciativa del Comité Organizador y delegados de VALLEMUN (Model of United Nations) de la Unidad Educativa Nuestra Sra. del Valle. | Fuente: Flyer VALLEMUN · @siempremimaracaibo · @rodriguezgusmary_ | Maps: https://maps.google.com/?q=Unidad+Educativa+Nuestra+Se%C3%B1ora+del+Valle+Maracaibo',
    10.661, -71.608,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Elio''s Bakery Shop — Kiosko Azul', 'Kiosko Azul, Zona Oeste, Valle Claro, frente a los edificios, al lado de Súper Fruty, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal', '', 'A partir de las 4:30pm',
    'El Kiosko Azul de Elio''s Bakery Shop se convirtió en Centro de Acopio Activo. Además, TODO lo vendido el día de hoy será un aporte para ayudar a Venezuela. | Fuente: Flyer @eliosbakeryshop · @siempremimaracaibo | Maps: https://maps.google.com/?q=Valle+Claro+Zona+Oeste+Maracaibo',
    10.68, -71.64,
    'eliosbakeryshop');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Bakery Motion — Plaza 75', 'Plaza 75, Local 1, Calle 75 con Avenida 3H, Sector La Lago, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado | mantas y cobijas', '', '',
    'También reciben zapatos en buen estado. | Fuente: Flyer @bakerymotion · @siempremimaracaibo | Maps: https://maps.google.com/?q=Plaza+75+Calle+75+Avenida+3H+La+Lago+Maracaibo',
    10.668, -71.623,
    'bakerymotion');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('BioSouthTech / UNIMED — Clínica Centro Médico Docente Paraíso', 'Clínica Centro Médico Docente Paraíso — Piso 1 (Unidad de Investigación Dr. "Shubert Camacho" UNIMED) y Planta Baja (Unidad de Anatomía Patológica, Dra. Iría Lozano), Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'medicamentos e insumos médicos | kits de primeros auxilios', '', '',
    'Centro de acopio de INSUMOS MÉDICOS exclusivamente. Reciben: gasas, agua oxigenada, tapabocas, vendas, solución fisiológica, catéteres, adhesivo, jeringas, equipos de infusión, alcohol, guantes de látex. Dos puntos en la clínica: Piso 1 (UNIMED) y Planta Baja (Anatomía Patológica). | Fuente: Flyer oficial BioSouthTech · UNIMED · @noticiaaldia | Maps: https://maps.google.com/?q=Cl%C3%ADnica+Centro+M%C3%A9dico+Docente+Para%C3%ADso+Maracaibo',
    10.67, -71.616,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Cruz Roja Venezolana — Filial Maracaibo', 'Sede de la Cruz Roja Venezolana Filial Maracaibo, Av. 11 con esquina Calle 83, Sector Veritas, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal', '', 'A partir de las 7:00am',
    'Fuente: Flyer oficial @cruzrojamaracaibo · Flyer uBag | Maps: https://maps.google.com/?q=Cruz+Roja+Venezolana+Maracaibo+Av+11+Calle+83',
    10.665, -71.615,
    'cruzrojamaracaibo');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Facultad de Medicina LUZ — Plaza Paul Moreno Camacho', 'Plaza Paul Moreno Camacho, Facultad de Medicina, Universidad del Zulia, Maracaibo · Horario: viernes 26 de junio, 8:00 a.m. a 6:00 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | pañales para niños y adultos', '', '',
    'Fuente: Comunicado oficial Facultad de Medicina LUZ · Dr. Sergio Osorio Morales, Decano | Maps: https://maps.google.com/?q=Facultad+de+Medicina+LUZ+Maracaibo',
    10.661, -71.63,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Synergy — CC Doral Center Mall', 'Synergy, CC Doral Center Mall, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | artículos de higiene personal', '', '',
    'Fuente: Flyer uBag · Puntos de recolección Maracaibo | Maps: https://maps.google.com/?q=Synergy+Doral+Center+Mall+Maracaibo',
    10.692, -71.625,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Synergy — Mall Paseo San Francisco', 'Synergy, Mall Paseo San Francisco, San Francisco (zona metropolitana de Maracaibo)',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | artículos de higiene personal', '', '',
    'Fuente: Flyer uBag · Puntos de recolección Maracaibo | Maps: https://maps.google.com/?q=Synergy+Mall+Paseo+San+Francisco+Zulia',
    10.61, -71.66,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sede Regional de Un Nuevo Tiempo (UNT Zulia)', 'Avenida 3F con Avenida Universidad',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | mantas y cobijas | artículos de higiene personal | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Flyer comunitario centros de acopio Maracaibo | Maps: https://maps.google.com/?q=Avenida+3F+con+Universidad+Maracaibo',
    10.6545, -71.6402,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sede de Vente Zulia', 'Calle 70 con Av. 15A y 15B, N° 15A-39, calle paralela a Nebabrica',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | mantas y cobijas | artículos de higiene personal | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '',
    'Fuente: Flyer comunitario centros de acopio Maracaibo | Maps: https://maps.google.com/?q=10.652693,-71.637836',
    10.652693, -71.637836,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Pin Zulia', 'Pin Zulia, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | artículos de higiene personal | linternas, pilas y cargadores portátiles | cascos de protección', '', '9:00am - 9:00pm, hasta el domingo 28/06',
    'Las medicinas deben estar vigentes. | Fuente: Flyer @pinzulia · Somos punto de apoyo | Maps: https://maps.app.goo.gl/CV9v9ysfYsr1KLJ37',
    null, null,
    'pinzulia');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Pitts Bowling', 'CC Costa Verde, Av. Bella Vista, Maracaibo 4002',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | artículos de higiene personal', '', '',
    'Fuente: Flyer uBag · Puntos de recolección Maracaibo | Maps: https://maps.google.com/?q=Pitts+Bowling+CC+Costa+Verde+Maracaibo',
    10.672, -71.62,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Proyecto Mujeres × Studio Velu — Gym Lago Club', 'Gym Lago Club, Hotel Tibisay, Av. El Milagro, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'medicamentos e insumos médicos | artículos de higiene personal | ropa en buen estado | mantas y cobijas | alimentos para mascotas', '', '',
    'Iniciativa específica para mujeres y niñas, y para animales afectados. Reciben kits menstruales (toallas sanitarias, tampones, toallitas húmedas, pañales, analgésico, ibuprofeno, gel antibacterial), ropa interior nueva para niñas y mujeres, mantas y toallas, alimento para perros y gatos (perrarina y gatarina), insumos veterinarios y de primeros auxilios, correa y arnés para animales, soluciones y sulfadiazina de plata, tazas de comida y agua. | Fuente: Flyer @proyectomujeres × @studiovelu | Maps: https://maps.google.com/?q=Hotel+Tibisay+Av+El+Milagro+Maracaibo',
    10.677, -71.601,
    'proyectomujeres');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Coremotif Functional Training Center', 'Coremotif Functional Training Center, Maracaibo · Dirección por DM @coremotif_vzla',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal | ropa en buen estado | alimentos para mascotas', '', '',
    'Fuente: Story @chubetoto · @coremotif_vzla | Maps: https://maps.google.com/?q=Coremotif+Maracaibo',
    10.674, -71.62,
    'coremotif_vzla');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('CEVAZ — Sede Las Mercedes', 'Centro Venezolano Americano del Zulia (CEVAZ), Sede Las Mercedes, Maracaibo · Horario: lunes a viernes 8:00 a.m. a 5:00 p.m. · Sábados 8:00 a.m. a 4:00 p.m. · Domingos 8:00 a.m. a 2:00 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | mantas y cobijas | linternas, pilas y cargadores portátiles', '', '',
    'Reciben gasas, vendas (elásticas y de algodón), adhesivo, alcohol, agua oxigenada, solución fisiológica, jeringas, guantes de látex, tapabocas, catéteres, equipos de infusión, linternas con pilas. Medicamentos con fecha de vencimiento vigente: analgésicos (paracetamol, ibuprofeno), antitérmicos, antibióticos, antisépticos, cremas para quemaduras, tratamientos para enfermedades crónicas (hipertensión, diabetes). Alimentos: agua mineral embotellada, productos enlatados (preferiblemente con abrefácil), arroz, granos, leche en polvo, fórmulas infantiles, barras de cereal. Higiene y refugio: jabón, papel higiénico, toallas húmedas y sanitarias, pañales (infantiles y de adultos), sábanas y cobijas limpias en buen estado. | Fuente: Flyer oficial @cevaz_zulia | Maps: https://maps.google.com/?q=CEVAZ+Las+Mercedes+Maracaibo',
    10.68, -71.608,
    'cevaz_zulia');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('CEVAZ — Sede La Limpia', 'Centro Venezolano Americano del Zulia (CEVAZ), Sede La Limpia, Maracaibo · Horario: lunes a viernes 8:00 a.m. a 5:00 p.m. · Sábados 8:00 a.m. a 4:00 p.m. · Domingos 8:00 a.m. a 2:00 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | mantas y cobijas | linternas, pilas y cargadores portátiles', '', '',
    'Reciben gasas, vendas, alcohol, agua oxigenada, solución fisiológica, jeringas, guantes de látex, tapabocas, catéteres, equipos de infusión, linternas con pilas. Medicamentos con vencimiento vigente: analgésicos, antitérmicos, antibióticos, antisépticos, cremas para quemaduras, tratamientos para hipertensión y diabetes. Alimentos: agua, enlatados con abrefácil, arroz, granos, leche en polvo, fórmulas infantiles, barras de cereal. Jabón, papel higiénico, toallas húmedas y sanitarias, pañales, sábanas y cobijas limpias. | Fuente: Flyer oficial @cevaz_zulia | Maps: https://maps.google.com/?q=CEVAZ+La+Limpia+Maracaibo',
    10.7, -71.63,
    'cevaz_zulia');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sambil Maracaibo — Lobby Goajira', 'Sambil Maracaibo, Lobby Goajira, Av. 17 Los Haticos, Maracaibo · Horario: desde las 6:00 a.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | ropa en buen estado | mantas y cobijas', '', '',
    'Donaciones enviadas a las zonas afectadas a través de Cáritas Venezuela. | Fuente: Story @tusambilmcbo · Cáritas Venezuela | Maps: https://maps.google.com/?q=Sambil+Maracaibo',
    10.628, -71.631,
    'tusambilmcbo');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Centro de Arte de Maracaibo Lía Bermúdez (CAMLB)', 'Sede del CAMLB, frente al Terminal Lacustre, Plaza Baralt, Maracaibo · Horario: todos los días, 9:00 a.m. a 5:00 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado | artículos de higiene personal | pañales de bebé', '', '',
    'Fuente: Flyer @camliabermudez | Maps: https://maps.google.com/?q=Centro+de+Arte+L%C3%ADa+Berm%C3%BAdez+Plaza+Baralt+Maracaibo',
    10.636, -71.612,
    'camliabermudez');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Arena Panter — CC Costa Verde', 'Arena Panter, CC Costa Verde, Av. Bella Vista, Maracaibo · Horario: 2:00 p.m. a 10:00 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | ropa en buen estado | artículos de higiene personal | pañales de bebé | alimentos para mascotas', '', '',
    'Fuente: Flyer @arenapanter · @cccostaverde | Maps: https://maps.google.com/?q=Arena+Panter+CC+Costa+Verde+Maracaibo',
    10.672, -71.62,
    'arenapanter');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Parroquia San Antonio María Claret', 'Calle 78 Dr. Portillo con Av. 3E',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | mantas y cobijas | artículos de higiene personal | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '8:00am - 4:00pm',
    'Fuente: Flyer comunitario centros de acopio Maracaibo | Maps: https://maps.google.com/?q=Calle+78+Dr+Portillo+Av+3E+Maracaibo',
    10.6727, -71.616,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Fresconi Fresh Market', 'Av. 4 Bella Vista con calle 74 (antiguo Fresconi), Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | ropa en buen estado | medicamentos e insumos médicos | colchones, almohadas y colchones inflables | linternas, pilas y cargadores portátiles | cascos de protección', '+584246514415', 'Jueves, viernes y sábado, 8:00am - 7:00pm',
    'Las medicinas deben estar vigentes (no vencidas). También reciben colchonetas. | Fuente: Flyer Fresconi Fresh Market | Maps: https://maps.google.com/?q=Av+4+Bella+Vista+calle+74+Maracaibo',
    10.663, -71.619,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Hogar Clínica San Rafael', 'Calle 64 con Av. 3F, Sector Las Mercedes',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | mantas y cobijas | artículos de higiene personal | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', '8:00am - 4:00pm',
    'Fuente: Flyer comunitario centros de acopio Maracaibo | Maps: https://maps.google.com/?q=Hogar+Cl%C3%ADnica+San+Rafael+Maracaibo',
    10.666, -71.619,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Ludus Box', 'Barrio Paraíso, Calle 80 entre Av. 19 y 19A, Maracaibo 4002',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | ropa en buen estado | mantas y cobijas | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal', '', 'Jueves hasta 8:00pm · Viernes 6:00am - 8:00pm · Sábado 6:00am - 12:00m',
    'También reciben zapatos en buen estado. | Fuente: Flyer oficial @ludusbox | Maps: https://maps.google.com/?q=Barrio+Para%C3%ADso+Calle+80+Av+19+Maracaibo',
    10.663, -71.609,
    'ludusbox');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Imagolab C.A. (Centro de Imágenes)', 'Calle 76 entre Av. 3H y 3Y, Edificio Villa Ota II, tercer piso',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | mantas y cobijas | ropa en buen estado | artículos de higiene personal | abrigos y otros implementos de protección | cascos de protección | pañales de bebé | pañales de adulto | artículos para niños | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables | alimentos para mascotas', '+584146339894', 'Lunes a viernes, 8:30am - 6:00pm',
    'Fuente: Reportes verificados de @imagolab.ve · Flyer comunitario centros de acopio Maracaibo | Maps: https://maps.app.goo.gl/FRq8wyRKg1a7ikiYA',
    10.6695, -71.617,
    'imagolab.ve');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Protección Civil Maracaibo', 'Av. 15 Delicias con Av. 16 Los Haticos, al lado de Terminal Terrestre Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | mantas y cobijas | artículos de higiene personal | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '+584141479763', '',
    'Fuente: Flyer comunitario centros de acopio Maracaibo | Maps: https://maps.google.com/?q=Protecci%C3%B3n+Civil+Maracaibo+Terminal+Terrestre',
    10.63, -71.65,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('CAFI', 'Galpón 1, Residencias Santa Lucía, Av. El Milagro',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | ropa en buen estado | mantas y cobijas | artículos de higiene personal | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables', '', 'A partir del 26/06, 10:00am',
    'Fuente: Flyer comunitario centros de acopio Maracaibo | Maps: https://maps.google.com/?q=Residencias+Santa+Luc%C3%ADa+Av+El+Milagro+Maracaibo',
    10.69, -71.628,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alfred''s Coffee Bar', 'Av 5 de Julio con Av Bella Vista',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | artículos de higiene personal', '', '',
    'Fuente: Reporte de cuenta oficial verificada | Maps: https://maps.google.com/?q=10.6656,-71.608',
    10.6656, -71.608,
    'alfredscoffeebar');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Basilica de la Chinita', 'Av. 12 con calle 96, final Paseo Ciencias, Maracaibo, Zulia',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos', '', '',
    'Fuente: Reporte de cuenta oficial verificada | Maps: https://maps.google.com/?q=10.6423,-71.6144',
    10.6423, -71.6144,
    'basilicachinita');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Farmacia SAAS Las Mercedes', 'Avenida Bella Vista con Avenida Universidad',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | artículos de higiene personal', '', '',
    'Fuente: Reporte de cuenta oficial verificada | Maps: https://maps.google.com/?q=10.6816,-71.6056',
    10.6816, -71.6056,
    'https://www.instagram.com/saas.lasmercedes/');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Complejo Educativo Profesor Adelis Fusil', 'Complejo Deportivo Niños Cantores, Av. 55 con Calle 96D, Maracaibo · Horario: sábado desde las 8:00 a.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/USWh22h7uom7GogU6',
    10.645, -71.628,
    'rayoescuela');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('La Casona — Sector Lanamericano', 'Av. 86, Sector Lanamericano, Maracaibo · Horario: lunes a sábado, 9:00 a.m. a 8:00 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/gZdQuvf7mgpNHaND9',
    10.692, -71.671,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Iglesia María Inmaculada', 'Av. 15G con calle 50, Urb. La California, Maracaibo · Horario: martes a viernes, 4:30 p.m. a 5:30 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | artículos para niños', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=Av+15G+calle+50+La+California+Maracaibo',
    10.668, -71.626,
    'lainmaculadamcbo');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Iglesia Tiempos de Reino', 'Frente al Estadio Luis Aparicio, al lado del galpón de Gramoca, Maracaibo · Horario: 9:00 a.m. a 12:00 a.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=Estadio+Luis+Aparicio+Maracaibo',
    10.665, -71.65,
    'Tiemposdereinomcbo');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Iglesia San Miguel Arcángel', 'Parroquia San Miguel Arcángel, Calle 100 Sabaneta, frente a la Clínica Zulia, Maracaibo · Horario: 8:00 a.m. a 7:00 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | ropa en buen estado', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/TEVva55ViA1Nntth7',
    10.633, -71.64,
    'caritas.sanmiguelarcangel');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Papeleras Ramírez', 'Av. 28 La Limpia, Sector Los Postes Negros, Maracaibo · Horario: lunes a sábado, 8:00 a.m. a 6:00 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://share.google/LGVufsDrhu8GKe16R',
    10.69, -71.63,
    'papelerasramirez');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Farmacias YA! — Av. Universidad', 'Av. 12 con calle 61, Local 61-17, diagonal a la Clínica Paraíso, Maracaibo · Horario: lunes a domingo, 7:00 a.m. a 10:00 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | linternas, pilas y cargadores portátiles', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=Farmacias+YA+Av+12+calle+61+Maracaibo',
    10.668, -71.609,
    'farmaciasya');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Farmacias YA! — Millennium', 'Av. Fuerzas Armadas con calle 20, diagonal al Hospital Adolfo Pons (entre Fasto y Fresh Market), Maracaibo · Horario: lunes a domingo, 7:00 a.m. a 10:00 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | linternas, pilas y cargadores portátiles', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://share.google/9sPkkS79qEo9pmCRo',
    10.654, -71.64,
    'farmaciasya');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Escuela de Futsal TECNOPAGOS F.S.', 'Sector Los Estanques, Av. 51, detrás del Hotel Maruma, Maracaibo · Horario: sábado y domingo, 9:00 a.m. a 3:00 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/SbH1djo1HjakxYV47',
    10.606, -71.6516,
    'somostecnopagosfs');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Parroquia Nuestra Señora del Perpetuo Socorro', 'Av. 9B con calle 74, Sector Tierra Negra, Maracaibo · Horario: 9:00 a.m. a 7:00 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/ZRmyM63UexJhXXVv8',
    10.679, -71.617,
    'pperpetuosocorro.oficial');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Fundación PALUZ', 'Calle 69 con Av. Bella Vista y Santa Rita, Maracaibo · Horario: desde 9:00 a.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'medicamentos e insumos médicos', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.google.com/?q=Calle+69+Av+Bella+Vista+Maracaibo',
    10.672, -71.611,
    'somospaluz');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('U.E. Colegio Antonio Rosmini', 'Av. Milagro Norte con calle 25, Sector Barrio Los Pescadores, Maracaibo · Horario: lunes a sábado, 8:00 a.m. a 12:00 p.m.',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/9eNEJRAJRgXSU7H36',
    10.685, -71.605,
    'ue_antoniorosmini');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Iglesia San Pedro Apóstol', 'Haticos por arriba, Sector El Progreso, Maracaibo',
    (select id from public.parroquia where nombre = 'BOLIVAR'
      and municipio_id = (select id from public.municipio where nombre = 'MARACAIBO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/wWx8CcyhYAwKtYpH7',
    10.674, -71.62,
    'sanpedro_iglesia');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Alcaldía de San Francisco — Centro de Acopio', 'San Francisco, estado Zulia',
    (select id from public.parroquia where nombre = 'MARCIAL HERNANDEZ'
      and municipio_id = (select id from public.municipio where nombre = 'SAN FRANCISCO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'medicamentos e insumos médicos | agua potable | alimentos no perecederos | artículos de higiene personal', '', '',
    'Fuente: Story @alcaldiabsanfco · Alcalde Héctor Soto | Maps: https://maps.google.com/?q=Alcald%C3%ADa+de+San+Francisco+Zulia',
    10.5739, -71.6486,
    'alcaldiabsanfco');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Luxor Graphic', 'Luxor Graphic, San Francisco, sector La Coromoto, calle 165, frente al Gimnasio Atlas, estado Zulia',
    (select id from public.parroquia where nombre = 'MARCIAL HERNANDEZ'
      and municipio_id = (select id from public.municipio where nombre = 'SAN FRANCISCO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | mantas y cobijas', '', '',
    'Iniciativa “Unidos por Caracas”. | Fuente: Story Llaveros Mcbo · Luxor Graphic | Maps: https://maps.google.com/?q=Luxor+Graphic+San+Francisco+La+Coromoto+Zulia',
    10.571, -71.647,
    null);
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('CEVAZ — Sede San Francisco', 'Centro Venezolano Americano del Zulia (CEVAZ), Sede San Francisco, estado Zulia · Horario: lunes a viernes 8:00 a.m. a 5:00 p.m. · Sábados 8:00 a.m. a 4:00 p.m. · Domingos 8:00 a.m. a 2:00 p.m.',
    (select id from public.parroquia where nombre = 'MARCIAL HERNANDEZ'
      and municipio_id = (select id from public.municipio where nombre = 'SAN FRANCISCO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | mantas y cobijas | linternas, pilas y cargadores portátiles', '', '',
    'Reciben gasas, vendas, alcohol, agua oxigenada, solución fisiológica, jeringas, guantes de látex, tapabocas, catéteres, equipos de infusión, linternas con pilas. Medicamentos con vencimiento vigente: analgésicos, antitérmicos, antibióticos, antisépticos, cremas para quemaduras, tratamientos para hipertensión y diabetes. Alimentos: agua, enlatados con abrefácil, arroz, granos, leche en polvo, fórmulas infantiles, barras de cereal. Jabón, papel higiénico, toallas húmedas y sanitarias, pañales, sábanas y cobijas limpias. | Fuente: Flyer oficial @cevaz_zulia | Maps: https://maps.google.com/?q=CEVAZ+San+Francisco+Zulia',
    10.575, -71.65,
    'cevaz_zulia');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Sede Vente San Francisco', 'Avenida 10 entre Calles 15 y 16A, Sierra Maestra, San Francisco · Horario: miércoles a domingo, 7:00 a.m. a 7:00 p.m.',
    (select id from public.parroquia where nombre = 'MARCIAL HERNANDEZ'
      and municipio_id = (select id from public.municipio where nombre = 'SAN FRANCISCO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/eTCfKxvrkWsXKCAS6',
    10.584, -71.6405,
    'sanfrancisco_conmariacorina');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Colegio Javier', 'Sierra Maestra, Calle 8, San Francisco, Zulia · Horario: sábado 27 de junio, 7:00 a.m. a 4:00 p.m.',
    (select id from public.parroquia where nombre = 'MARCIAL HERNANDEZ'
      and municipio_id = (select id from public.municipio where nombre = 'SAN FRANCISCO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/jzaFJpfieuX93SedA',
    10.575, -71.64,
    'u.e.colegiojavier');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Nodo Sur Fitness', 'Calle 12 entre avenida 17 y 18, San Francisco, Zulia · Horario: lunes a sábado, 6:00 a.m. a 8:00 p.m.',
    (select id from public.parroquia where nombre = 'MARCIAL HERNANDEZ'
      and municipio_id = (select id from public.municipio where nombre = 'SAN FRANCISCO'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | abrigos y otros implementos de protección | cascos de protección | artículos de limpieza | materiales para refugio | linternas, pilas y cargadores portátiles | colchones, almohadas y colchones inflables | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/zKmheFPRVWaukmZ56',
    10.575, -71.64,
    'nodosurfitness');
  insert into public.institucion (nombre, direccion, parroquia_id, tipos_ayuda, telefono, horario, notas, latitud, longitud, instagram)
  values ('Club UGAVI', 'Casco central, Villa del Rosario, Zulia · Horario: sábado, 8:00 a.m. a 8:00 p.m.',
    (select id from public.parroquia where nombre = 'DONALDO GARCIA'
      and municipio_id = (select id from public.municipio where nombre = 'ROSARIO DE PERIJA'
        and estado_id = (select id from public.estado where nombre = 'ZULIA'))),
    'agua potable | alimentos no perecederos | medicamentos e insumos médicos | kits de primeros auxilios | artículos de higiene personal | pañales de bebé | pañales de adulto | artículos para niños | ropa en buen estado | mantas y cobijas | linternas, pilas y cargadores portátiles | alimentos para mascotas', '', '',
    'Fuente: Reporte comunitario verificado | Maps: https://maps.app.goo.gl/YBeNyZoUn4oc8Jhj7',
    10.327, -72.282,
    'ugavired');

end; $$;

-- Stats
-- Total instituciones: 310
-- Insertadas: 310
-- Sin mapeo: 1
--
-- Sin mapeo:
--   La Guaira / Catia → Parque del Oeste Alí Primera
