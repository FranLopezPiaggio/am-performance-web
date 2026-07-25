-- Migration generated at 2026-07-25T02:30:23.291Z
-- Seeds product_images from Cloudinary root-level assets
-- Maps provider_code to Cloudinary image for products lacking real images

BEGIN;

-- Delete existing placeholder records for products getting real images
DELETE FROM product_images
WHERE product_id IN (
  '8a70aebd-f3da-4d1e-ae5f-9c5f34c91da3',
  'a75f27ac-5f31-4156-9d87-4fa48cb07267',
  '00bc3504-4f9d-4661-89f8-a4e83b991fe5',
  'ad978b8b-64d0-41af-a8de-4c118c2f4e12',
  '27fbe88b-173a-43ac-acc4-8412b4951329',
  '289657ba-7827-4804-98c3-24623d7c5a0d',
  '107d3648-b2ba-4ed4-94da-459c2bb3f123',
  '04b6019f-d1fc-4d57-a556-4cbfde8aa91b',
  'e1a3ffeb-5994-4ad7-a39e-93e441ce13f3',
  '7c995d9a-bdd9-496f-b4d8-ca7fe7ba14b4',
  '4d1928f3-aa6a-487e-93ab-e9829bf80e4a',
  '31536cce-634a-4018-bcab-fb5251d582de',
  '18e622b5-a434-48a0-8a19-2c2b78b82fa8',
  '7600294e-db3b-4fe6-9e78-bde89f352890',
  'b1d04144-d511-4462-9914-0a4b23017fdd',
  '575c4a4a-71a0-4619-aa20-ab816dcd37b1',
  'f2d94f8e-9d22-4127-be0b-f244c7868974',
  'acce9cc0-c307-4b71-b97e-b948365bc56f',
  '64ae5818-ac3b-43c6-b32e-0a5e5604f396',
  '43107d12-dd1d-4cf4-91a2-92d676e885f5',
  '65a0d3f6-5ead-475c-a716-9f1a0aa097aa',
  '92d153b3-72e3-4235-af82-ea93bfb4753f',
  '01b5aa85-bbc7-482c-b37f-1e6cdde99d3f',
  '5dc61534-9b1f-40ec-a965-ebf23eef8d87',
  '6b326277-0c91-4636-b1b9-0a2f12044714',
  '339cc364-8416-4028-b352-8c3bc678f5c8',
  '043e0873-5de9-4ee5-beb9-fd13b07f1d59',
  'e936fe09-566c-4392-97c6-20b3ef51af1f',
  '0047bf4a-a728-4ce4-bd18-c14ba95db3e6',
  '472218f7-f4ad-4f69-a0f9-55b07a1d2a7b',
  '7a4601b3-5800-49a9-a0f7-c35026ff27bc',
  'e3f8f03b-5172-4cf7-8888-b31e1cc8bc59',
  '7685d31c-308d-4ae6-a1e4-00016b0613a6',
  '0a72c9cc-0feb-44bc-945f-322e29cc8070',
  'e42ab014-a28e-4687-9cde-f2805b50d7b0',
  '75df2a71-7f88-42d2-a0a0-f93f1137abcf',
  '2113e64d-a98d-4245-99ad-f037c0375970',
  '6e6654aa-2884-4853-af6a-ade66620eb44',
  '7583d0dd-5c77-4eb2-a9b6-652eeca25e4a',
  '154bcb8a-f5b3-4f92-8ff2-2d849601d9d6',
  '818187d0-ed13-42f5-bb94-1f4b22beb9ee',
  'da69cd08-d5f6-4771-8362-d46151cebc9f',
  'db7bf805-24cb-4ade-910b-25ffc7600fe2',
  '03f49f5f-face-4eb3-8022-de24868ec8f1',
  '2fc4a4a9-4a5f-48bc-83e1-2fc05c81f47e',
  '67f58897-3894-486e-ad9a-75d879fa997a',
  '563895a0-3b17-48b2-9fb2-52177ffc37e4',
  'dbcfda00-d3df-4d34-bfd7-27a5d4b04f0a',
  'c61911e6-d816-4b85-a71f-f26636b912bd',
  '681148cf-bb09-4e75-a4db-93b421a30c23',
  'd9b4a06d-e192-4854-99fc-1a3b1048e2df',
  '6d603263-f4d0-49c6-a1c8-392570962113'
) AND (image_url = '/img/download.jpg' OR image_url IS NULL);

INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary, format, mime_type, status)
VALUES (
  'a8405d4f-0f9b-49ce-9e3a-c79f7044b7cc',
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
  'b3d378ac-dff5-4c09-b6b8-d43bf6d6b48f',
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
  '176c1746-3d14-405e-84d3-97dd54951e2b',
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
  '8614c5e8-4168-4ffc-871a-c64cd8e88f48',
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
  '4b7d8a4d-c45a-48a6-8b6c-78f5dcdb8014',
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
  '55aa6b87-9e8a-42b2-86f2-4178c5188289',
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
  '0b842c68-efa6-4945-a2ed-0a08690d85bf',
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
  'fcb8e5a8-80a1-4ff7-8ae0-9e2f3e98988c',
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
  '371593f6-9ce1-4f32-ba0c-bed30d98a2ad',
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
  '29e7519d-a415-4912-af11-85070b6e69d8',
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
  '9b4a4d86-da7f-47f0-b919-36395c5abae0',
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
  'c09627aa-784a-4358-aae2-38b5fd0528d4',
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
  '9d441658-aa36-4054-9f00-8bf07d1d5a6f',
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
  'c058188b-d437-44d9-bdbd-ce920c3cf80a',
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
  '362375c3-d88b-425c-8938-ae6155a6db00',
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
  '1d67acb7-56f8-426a-90b1-3e1f6cdd1386',
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
  '2ee2910b-5712-45d1-b681-8b479b5fee0e',
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
  '00714154-69df-46f5-bc82-0bbe69492303',
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
  '222c841a-5839-4363-89b6-b966686ed168',
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
  'a432a14f-a538-4873-9706-0ee33734c0e9',
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
  '0aef60f6-f39c-41dd-8370-c294e57f15c8',
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
  '47101af6-f2fd-42be-9737-468a5e3f57e9',
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
  '678512fb-526f-4417-b03d-a9ded3297110',
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
  '99e2e2da-0958-4232-89f5-deeb3ad43157',
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
  '5164cf55-a65d-4406-947b-36f4b5ace091',
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
  'a6ff7e00-130c-4313-941c-2d6b0cd0d678',
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
  'f0b12eb3-dc86-4188-8686-9493bbe686b9',
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
  'f7b54829-3fbc-4f47-a2cc-05388136e4a3',
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
  '1e7a54f2-af58-47c2-be6d-e19d96e4f961',
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
  '24b59eaa-b5b8-41bb-81d8-2644fc92fd02',
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
  '33ca1f99-a42b-4cd2-8e08-5e95aec901cd',
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
  'e6c9b3c0-4d72-4189-9a2e-9f2f2d58fb37',
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
  'e5fb79d0-8874-44ab-bd91-c8e7687fd870',
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
  'e39718db-9d97-4a62-bfbc-2d61e51ec606',
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
  '8b0b84e0-902d-4fe4-8bc3-a02c1722a624',
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
  '563589b9-6409-4469-82d5-731bbc1dca80',
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
  '6c280ebc-95ea-4d21-9e62-2ed8bcacf3cc',
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
  '68f260d4-1698-4a22-8d70-98a30845ed5d',
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
  'a7563336-ba06-47b7-bb21-bd18ee6f935a',
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
  'ae79d83b-f2ed-46c0-9d9a-54dc4a3e9479',
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
  '65cc6ec4-ee34-450d-97b4-4f90922d6ae2',
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
  '8123c9f2-65a8-4b72-b1e6-f129b2e6bebf',
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
  'f3b455b2-f59f-4308-b35a-537e45693a21',
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
  'd98eda92-69b3-45dc-a0a9-fa2b2c2a5893',
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
  '8e342527-1a4e-447c-8295-133daaed1127',
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
  '25dcc5ae-623b-4028-a9aa-766055242172',
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
  'dd6ce2b6-057b-4a9c-b115-83973e7eef41',
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
  'a0517ded-400a-4e35-aa8f-892e29b7586e',
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
  '8e9e5323-9fc5-4a32-88e7-4e8a6864b6da',
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
  '3b88e67a-e40c-4afd-afda-c778a8164d39',
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
  '06e132b9-2863-4fb3-8e4c-75e35dce31cf',
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
  '846a3ed8-7496-48c0-ad0c-619a8b93c090',
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
