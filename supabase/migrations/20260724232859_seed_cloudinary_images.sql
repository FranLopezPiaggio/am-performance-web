-- Migration generated at 2026-07-25T02:28:59.345Z
-- Seeds product_images from Cloudinary root-level assets
-- Maps provider_code to Cloudinary image for products lacking real images
-- STATUS: DISABLED FOR PROD PUSH - data adjusted locally; re-enable when data refresh needed.

BEGIN;

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '47283788-255f-4fed-a2ba-a236932835ff',
  '8a70aebd-f3da-4d1e-ae5f-9c5f34c91da3',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928145/c81_otldpz.webp',
  'polea multifuncional smith',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'f0c398ab-e759-4ca1-a7a2-feb6d5ed04c8',
  'a75f27ac-5f31-4156-9d87-4fa48cb07267',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928144/cc14_xbfmkj.webp',
  'bike erg',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '9389b21b-e1e9-4e97-ad1a-00a338c828c4',
  '00bc3504-4f9d-4661-89f8-a4e83b991fe5',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928123/fb16_v2xz4k.webp',
  'polea doble enfrentada',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '07ef4f44-1015-47a8-af8c-39ac73f62ea4',
  'ad978b8b-64d0-41af-a8de-4c118c2f4e12',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928123/fb17_cvl9w7.webp',
  'polea doble en v',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '82663d14-a28d-410c-ba3d-05ce76516a9e',
  '27fbe88b-173a-43ac-acc4-8412b4951329',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928122/ff06_jtkf3t.webp',
  'press de hombros',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '82663d14-a28d-410c-ba3d-05ce76516a9e',
  '289657ba-7827-4804-98c3-24623d7c5a0d',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928122/ff06_jtkf3t.webp',
  'Prensa de Hombros (Shoulder Press)',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'd35e4555-757a-4970-8f79-863cc53bdfbf',
  '107d3648-b2ba-4ed4-94da-459c2bb3f123',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928096/ff08_dxgerx.webp',
  'press de pecho',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'd35e4555-757a-4970-8f79-863cc53bdfbf',
  '04b6019f-d1fc-4d57-a556-4cbfde8aa91b',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928096/ff08_dxgerx.webp',
  'Prensa de Pecho Ancha (Wide Chest Press)',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'd35e4555-757a-4970-8f79-863cc53bdfbf',
  'e1a3ffeb-5994-4ad7-a39e-93e441ce13f3',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928096/ff08_dxgerx.webp',
  'Prensa de Pecho Inclinada (Incline Chest Press)',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'd35e4555-757a-4970-8f79-863cc53bdfbf',
  '7c995d9a-bdd9-496f-b4d8-ca7fe7ba14b4',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928096/ff08_dxgerx.webp',
  'pecho a disco',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'd35e4555-757a-4970-8f79-863cc53bdfbf',
  '4d1928f3-aa6a-487e-93ab-e9829bf80e4a',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928096/ff08_dxgerx.webp',
  'Prensa de Pecho Plana (Chest Press)',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '02f13635-dc34-46fb-8674-353375254570',
  '31536cce-634a-4018-bcab-fb5251d582de',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928096/ff24_cjvfyt.webp',
  'maquina de gluteos',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '61db986a-e199-4b19-9c06-eb39879527b9',
  '18e622b5-a434-48a0-8a19-2c2b78b82fa8',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928096/ff29_kwqci5.webp',
  'maquina dorsalera individual',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '51afd18b-8833-40cb-9c34-7cd8254a7b23',
  '7600294e-db3b-4fe6-9e78-bde89f352890',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928096/ff33_uxio4s.webp',
  'Remo Bajo Pro',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '51afd18b-8833-40cb-9c34-7cd8254a7b23',
  'b1d04144-d511-4462-9914-0a4b23017fdd',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928096/ff33_uxio4s.webp',
  'Remo Bajo (Low Row)',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '51afd18b-8833-40cb-9c34-7cd8254a7b23',
  '575c4a4a-71a0-4619-aa20-ab816dcd37b1',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928096/ff33_uxio4s.webp',
  'maquina remo',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'c1102ad3-e9c7-4edd-a984-54c1e1fc51d6',
  'f2d94f8e-9d22-4127-be0b-f244c7868974',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928096/ff34_fre4uy.webp',
  'maquina remo con apoyo',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '3e61e922-2cad-4e1b-855f-81245ada34f9',
  'acce9cc0-c307-4b71-b97e-b948365bc56f',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928095/ff36_sumclz.webp',
  'banco plano',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '679198dd-f593-4d50-8115-7fbdf1d0e51b',
  '64ae5818-ac3b-43c6-b32e-0a5e5604f396',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928096/ff37_zexlkl.webp',
  'banco abdominales',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'a23c53dc-c58b-4690-848c-1871abf6fd37',
  '43107d12-dd1d-4cf4-91a2-92d676e885f5',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928095/ff38_fiwpgd.webp',
  'Prensa de Piernas a 45 Grados',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'a23c53dc-c58b-4690-848c-1871abf6fd37',
  '65a0d3f6-5ead-475c-a716-9f1a0aa097aa',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928095/ff38_fiwpgd.webp',
  'banco 90 grados',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '33901cd9-8466-4d47-849c-efb1a47660e9',
  '92d153b3-72e3-4235-af82-ea93bfb4753f',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928095/ff39_utgwep.webp',
  'banco multiangular',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'e6e6a4df-94f3-4395-b63f-8d3092a9b6d3',
  '01b5aa85-bbc7-482c-b37f-1e6cdde99d3f',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928095/ff42_d6lmj8.webp',
  'banco olimpico inclinado',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'e6e6a4df-94f3-4395-b63f-8d3092a9b6d3',
  '5dc61534-9b1f-40ec-a965-ebf23eef8d87',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928095/ff42_d6lmj8.webp',
  'Banco Militar Olímpico',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '41f826bd-8b47-4dd2-b97f-f49408c9a01b',
  '6b326277-0c91-4636-b1b9-0a2f12044714',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928079/ff43_lorohu.webp',
  'banco olimpico declinado',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '8ae3073b-4202-47e3-ae47-a623fceaeaf2',
  '339cc364-8416-4028-b352-8c3bc678f5c8',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928078/ff44_ish1g6.webp',
  'Máquina de Bíceps Scott',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '8ae3073b-4202-47e3-ae47-a623fceaeaf2',
  '043e0873-5de9-4ee5-beb9-fd13b07f1d59',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928078/ff44_ish1g6.webp',
  'banco scott',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '446e564b-dff3-4774-a709-255e3ab7f32c',
  'e936fe09-566c-4392-97c6-20b3ef51af1f',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928078/ff45_eq8uaz.webp',
  'banco lumbar',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '4e1e1886-3db8-45aa-a68a-9438ea12f874',
  '0047bf4a-a728-4ce4-bd18-c14ba95db3e6',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928078/ff50_oxiwrc.webp',
  'rack sentadilla',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '644436a5-a483-45c6-8ee2-d1015bf24f30',
  '472218f7-f4ad-4f69-a0f9-55b07a1d2a7b',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928078/ff54_aihhij.webp',
  'porta discos',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '280efe6b-8647-4b64-898c-b403e366c202',
  '7a4601b3-5800-49a9-a0f7-c35026ff27bc',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928078/ff63_mdovw2.webp',
  'maquina smith recta',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '280efe6b-8647-4b64-898c-b403e366c202',
  'e3f8f03b-5172-4cf7-8888-b31e1cc8bc59',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928078/ff63_mdovw2.webp',
  'maquina smith inclinada',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '06a0cfa7-09e5-4d79-9418-00e1e29786c2',
  '7685d31c-308d-4ae6-a1e4-00016b0613a6',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928078/ff87_x8bni9.webp',
  'cuadricep y femorales',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '8930d7a4-1336-4ebe-bf1c-05337a949a52',
  '0a72c9cc-0feb-44bc-945f-322e29cc8070',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928077/ff89_dvdrd3.webp',
  'maquina dorsalera & remo',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'ca722a4a-deb9-4cbe-a69e-0e1f584df550',
  'e42ab014-a28e-4687-9cde-f2805b50d7b0',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928077/ff94_xz1xar.webp',
  'Vuelos laterales a polea',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'ca722a4a-deb9-4cbe-a69e-0e1f584df550',
  '75df2a71-7f88-42d2-a0a0-f93f1137abcf',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928077/ff94_xz1xar.webp',
  'Vuelos Laterales de Deltoides',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '85225ba2-d090-4387-bdc8-6a8ac9e41f54',
  '2113e64d-a98d-4245-99ad-f037c0375970',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928061/g25_t8kb4w.png',
  'remo bajo a disco',
  0,
  true,
  'png',
  'image/png',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '85225ba2-d090-4387-bdc8-6a8ac9e41f54',
  '6e6654aa-2884-4853-af6a-ade66620eb44',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928061/g25_t8kb4w.png',
  'Remo en Barra T (T-Bar Row)',
  0,
  true,
  'png',
  'image/png',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '369406c7-87e8-4068-ab9a-327707a00822',
  '7583d0dd-5c77-4eb2-a9b6-652eeca25e4a',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928061/g30_jqnpuh.png',
  'remo bajo inclinado a disco',
  0,
  true,
  'png',
  'image/png',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '369406c7-87e8-4068-ab9a-327707a00822',
  '154bcb8a-f5b3-4f92-8ff2-2d849601d9d6',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928061/g30_jqnpuh.png',
  'Remo Inclinado a Nivel (Incline Level Row)',
  0,
  true,
  'png',
  'image/png',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'dc1a61f4-132a-41b1-96f7-4356e42b41d7',
  '818187d0-ed13-42f5-bb94-1f4b22beb9ee',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928061/g35_nxghcw.png',
  'hombro a discos',
  0,
  true,
  'png',
  'image/png',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '18894964-00a1-4ed3-9aba-7673b96179e3',
  'da69cd08-d5f6-4771-8362-d46151cebc9f',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928034/g50_jcfypd.png',
  'Prensa de Piernas (Leg Press)',
  0,
  true,
  'png',
  'image/png',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '18894964-00a1-4ed3-9aba-7673b96179e3',
  'db7bf805-24cb-4ade-910b-25ffc7600fe2',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928034/g50_jcfypd.png',
  'prensa',
  0,
  true,
  'png',
  'image/png',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '5bdd654c-2408-4029-b359-97fa4ed30315',
  '03f49f5f-face-4eb3-8022-de24868ec8f1',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928034/g55_b1co5c.webp',
  'cuadricep a disco',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '5bdd654c-2408-4029-b359-97fa4ed30315',
  '2fc4a4a9-4a5f-48bc-83e1-2fc05c81f47e',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928034/g55_b1co5c.webp',
  'Extensión de Piernas (Leg Extension)',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'b18acc30-def1-4f9e-9725-2ca5e44526fd',
  '67f58897-3894-486e-ad9a-75d879fa997a',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928034/g65_v1gc6a.png',
  'Banco con Rack para Barra de Bíceps',
  0,
  true,
  'png',
  'image/png',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'b18acc30-def1-4f9e-9725-2ca5e44526fd',
  '563895a0-3b17-48b2-9fb2-52177ffc37e4',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928034/g65_v1gc6a.png',
  'Máquina de Bíceps Alternada',
  0,
  true,
  'png',
  'image/png',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'eda9b572-5360-4115-930d-c7d0c0c9d875',
  'dbcfda00-d3df-4d34-bfd7-27a5d4b04f0a',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928033/spl36_ypqiri.webp',
  'prensa 90 grados',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '9d451abe-4b19-4362-b69f-41af69131091',
  'c61911e6-d816-4b85-a71f-f26636b912bd',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928032/wg116_kzrljt.webp',
  'estribo triangular polea',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '819c6eb4-bee9-4c85-aee8-60ca19e3af08',
  '681148cf-bb09-4e75-a4db-93b421a30c23',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928031/wg118_oohdxf.webp',
  'manubrio v tricep',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'a8ff1fed-28a0-4492-8e7d-70e04404d0f0',
  'd9b4a06d-e192-4854-99fc-1a3b1048e2df',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928031/wg126_r2vk4x.webp',
  'manubrio recto',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'de502919-8788-4059-a7c9-97436438ce45',
  '6d603263-f4d0-49c6-a1c8-392570962113',
  'https://res.cloudinary.com/dwnebky4o/image/upload/v1784928031/wg130_bovir9.webp',
  'kit de agarre dorsalera',
  0,
  true,
  'webp',
  'image/webp',
  'active'
);

COMMIT;
