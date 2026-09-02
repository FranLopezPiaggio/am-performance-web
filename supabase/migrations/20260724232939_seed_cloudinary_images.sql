-- Migration generated at 2026-07-25T02:29:39.548Z
-- Seeds product_images from Cloudinary root-level assets
-- Maps provider_code to Cloudinary image for products lacking real images
-- STATUS: DISABLED FOR PROD PUSH - data adjusted locally; re-enable when data refresh needed.

BEGIN;

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  '3a3efe1e-98cf-4fb3-8f29-91360b2fc5fa',
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
  '0380fee8-ab56-454f-85c1-c9ad52178659',
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
  '25d17c42-8e81-4dbb-9090-1f1254f6d37e',
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
  '32019694-3eeb-402d-86ec-72b1d2f7348d',
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
  '50592a18-a1a9-4b94-a12b-c4906f0e34f1',
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
  'c5bb710a-44a5-4f58-b759-38318f9525ba',
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
  '7bc3eda2-924e-4712-ba87-fe8662237772',
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
  '04eeab12-7ae1-4f2c-8eec-7f9371e982d9',
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
  '2929c048-e178-4aec-a969-0d1b30b86bc6',
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
  'ea3af921-14a2-43a0-8116-acf41673171b',
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
  '45ad248e-2c7a-4cec-9e14-e8f995858e51',
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
  'c1871fe9-b1df-4fee-9d8b-6cf82a288fea',
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
  '364b1409-e30c-4d46-8c2d-bcf82a8de7b7',
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
  'd4480a69-d121-4ae1-a14b-ce65ec40ca3d',
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
  '33c42b02-0b86-4f9a-a3b1-04860e28c4a7',
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
  'deff477b-79bd-4a13-8bc7-91a869469bf1',
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
  '3e1dfdab-ce42-4533-9c9d-f505c56c6a98',
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
  '6c71e3c4-5bb4-4f57-9900-0a325fbe337f',
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
  '849613aa-4df4-453a-83d3-b5ea05e0c18e',
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
  '16be9875-8aa2-4464-82ee-4cdc22b74882',
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
  '986bbb2d-521a-4fe1-b431-e9de848cfecb',
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
  '5cad4ef9-c72c-4a01-9611-d5fdd73b049e',
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
  '79149c74-735c-4f4c-9537-05345422732f',
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
  '9a1c3ade-196e-4bfb-91c2-ef6334dd7815',
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
  '5b32092c-3aee-4216-a718-8015d5ce3feb',
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
  '5f034e71-8748-446e-b9a4-1c971d293284',
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
  '7d1de859-a265-48bb-8ebd-33d14535c548',
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
  'b25891ba-a9d7-4a1b-9651-ef3cb8e804ab',
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
  'adabd2ec-3cce-4ecc-bbd6-cdeb63999bf8',
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
  '7ce03424-3556-4735-be1b-67ee90db0df0',
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
  'b66a4a05-0852-499e-a29a-c2f8c402aff8',
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
  'e81b3b28-f94c-4fe9-a3f0-8d5206ac5e7a',
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
  'd293230d-83ed-4f89-a62f-c8c0b2fe7653',
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
  'acbb26ab-4b19-4ccd-9a6b-62bc81cd73dc',
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
  '473db2e7-7395-464b-9a94-9dc081135f5a',
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
  '007eb0d7-aecb-4d84-a541-8c4b15a1301e',
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
  '3f13b1a2-30a8-4a24-a9f2-6cdd55b98fe5',
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
  'a7e811c0-a51c-41d7-b314-73320566328d',
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
  '77b444d0-eccf-43dd-8b90-b59b6d9d0aab',
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
  '88408409-b7c7-4dfb-b5d4-a88b2f810745',
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
  '7a466ecb-23f5-420f-98e8-a535641b509e',
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
  '39ee187d-e228-4f52-b55c-8f2286cc6cd4',
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
  '44147b3d-6bbd-4d3f-b9ba-57de96db5fd6',
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
  '26a63d92-516d-4483-ba70-6e338dbbff6b',
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
  'b3cf9830-cc0b-4e14-adc5-9ec52b3a602e',
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
  '18e23f38-6e39-4c8e-b6fb-88045cdb7a51',
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
  'ff3ff4a3-56e8-4fd3-a3c7-6d70563bf87a',
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
  '1546d9dd-4ed7-4ec2-9bb7-4533fe7523c7',
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
  '757a1c5c-1790-4246-b6f7-7495c3e4cd9a',
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
  '468a2524-2313-48bf-852c-42513e4f0aab',
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
  '509392ff-bcf1-4fa8-aea5-f0a924a61796',
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
  'ecf3a3a3-d23c-4341-aeb2-038fc3c8f68b',
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
