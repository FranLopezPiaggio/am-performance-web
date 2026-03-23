# Reuqest and response for table orders

## Request Header (raw)

```
GET /admin?view=orders&_rsc=d47qg HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate, br, zstd
Accept-Language: en-US,en;q=0.9
Connection: keep-alive
Cookie: .... (the cookies are here but i prefer no share)
Host: localhost:3000
Referer: http://localhost:3000/admin?view=products
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
User
```

## Networking Response

```response
2:"$Sreact.fragment"
4:I["[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)",["/_next/static/chunks/node_modules_next_0i_2bnf._.js","/_next/static/chunks/node_modules_%40supabase_auth-js_dist_module_0.pzobh._.js","/_next/static/chunks/node_modules_motion-dom_dist_es_0smvfil._.js","/_next/static/chunks/node_modules_framer-motion_dist_es_129u8xh._.js","/_next/static/chunks/node_modules_0s6ennv._.js","/_next/static/chunks/src_12raj_d._.js","/_next/static/chunks/src_app_layout_tsx_004glpo._.js"],"SegmentViewNode"]
6:I["[project]/node_modules/next/dist/client/components/client-page.js [app-client] (ecmascript)",["/_next/static/chunks/node_modules_next_0i_2bnf._.js","/_next/static/chunks/node_modules_%40supabase_auth-js_dist_module_0.pzobh._.js","/_next/static/chunks/node_modules_motion-dom_dist_es_0smvfil._.js","/_next/static/chunks/node_modules_framer-motion_dist_es_129u8xh._.js","/_next/static/chunks/node_modules_0s6ennv._.js","/_next/static/chunks/src_12raj_d._.js","/_next/static/chunks/src_app_layout_tsx_004glpo._.js"],"ClientPageRoot"]
7:I["[project]/src/app/admin/page.tsx [app-client] (ecmascript)",["/_next/static/chunks/node_modules_next_0i_2bnf._.js","/_next/static/chunks/node_modules_%40supabase_auth-js_dist_module_0.pzobh._.js","/_next/static/chunks/node_modules_motion-dom_dist_es_0smvfil._.js","/_next/static/chunks/node_modules_framer-motion_dist_es_129u8xh._.js","/_next/static/chunks/node_modules_0s6ennv._.js","/_next/static/chunks/src_12raj_d._.js","/_next/static/chunks/src_app_layout_tsx_004glpo._.js","/_next/static/chunks/_01bs~om._.js","/_next/static/chunks/src_app_admin_layout_tsx_0vyh_ql._.js","/_next/static/chunks/src_0_6tpcy._.js","/_next/static/chunks/node_modules_lucide-react_dist_esm_icons_0ne8reg._.js","/_next/static/chunks/src_app_admin_page_tsx_03savhv._.js"],"default"]
10:I["[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)",["/_next/static/chunks/node_modules_next_0i_2bnf._.js","/_next/static/chunks/node_modules_%40supabase_auth-js_dist_module_0.pzobh._.js","/_next/static/chunks/node_modules_motion-dom_dist_es_0smvfil._.js","/_next/static/chunks/node_modules_framer-motion_dist_es_129u8xh._.js","/_next/static/chunks/node_modules_0s6ennv._.js","/_next/static/chunks/src_12raj_d._.js","/_next/static/chunks/src_app_layout_tsx_004glpo._.js"],"OutletBoundary"]
12:"$Sreact.suspense"
1f:I["[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)",["/_next/static/chunks/node_modules_next_0i_2bnf._.js","/_next/static/chunks/node_modules_%40supabase_auth-js_dist_module_0.pzobh._.js","/_next/static/chunks/node_modules_motion-dom_dist_es_0smvfil._.js","/_next/static/chunks/node_modules_framer-motion_dist_es_129u8xh._.js","/_next/static/chunks/node_modules_0s6ennv._.js","/_next/static/chunks/src_12raj_d._.js","/_next/static/chunks/src_app_layout_tsx_004glpo._.js"],"ViewportBoundary"]
29:I["[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)",["/_next/static/chunks/node_modules_next_0i_2bnf._.js","/_next/static/chunks/node_modules_%40supabase_auth-js_dist_module_0.pzobh._.js","/_next/static/chunks/node_modules_motion-dom_dist_es_0smvfil._.js","/_next/static/chunks/node_modules_framer-motion_dist_es_129u8xh._.js","/_next/static/chunks/node_modules_0s6ennv._.js","/_next/static/chunks/src_12raj_d._.js","/_next/static/chunks/src_app_layout_tsx_004glpo._.js"],"MetadataBoundary"]
b:D"$d"
b:D"$c"
b:D"$f"
b:["$","$L10",null,{"children":["$","$12",null,{"name":"Next.MetadataOutlet","children":"$@13"},"$c","$11",1]},"$c","$e",1]
15:D"$18"
15:D"$16"
15:D"$19"
15:null
1a:D"$1c"
1a:D"$1b"
1a:D"$1e"
20:D"$22"
20:D"$21"
1a:["$","$L1f","e329ed0cv",{"children":"$L20"},"$1b","$1d",1]
23:D"$25"
23:D"$24"
23:D"$27"
2b:D"$2d"
2b:D"$2c"
23:["$","div","e329ed0cm",{"hidden":true,"children":["$","$L29",null,{"children":["$","$12",null,{"name":"Next.Metadata","children":"$L2b"},"$24","$2a",1]},"$24","$28",1]},"$24","$26",1]
0:{"f":[["children","admin","children","__PAGE__?{\"view\":\"orders\"}",["__PAGE__?{\"view\":\"orders\"}",{}],[["$","$2","c",{"children":[["$","$L4","c-page",{"type":"page","pagePath":"admin/page.tsx","children":["$","$L6",null,{"Component":"$7","serverProvidedParams":{"searchParams":{"view":"orders"},"params":{},"promises":null}},null,"$5",1]},null,"$3",1],[["$","script","script-0",{"src":"/_next/static/chunks/src_0_6tpcy._.js","async":true,"nonce":"$undefined"},null,"$8",0],["$","script","script-1",{"src":"/_next/static/chunks/node_modules_lucide-react_dist_esm_icons_0ne8reg._.js","async":true,"nonce":"$undefined"},null,"$9",0],["$","script","script-2",{"src":"/_next/static/chunks/src_app_admin_page_tsx_03savhv._.js","async":true,"nonce":"$undefined"},null,"$a",0]],"$b"]},null,"$1",0],{},null,false,null],["$","$2","h",{"children":["$15","$1a","$23"]},null,"$14",0],false]],"q":"?view=orders","i":true,"S":false,"h":null,"b":"development"}
20:D"$2e"
20:[["$","meta","0",{"charSet":"utf-8"},"$c","$2f",0],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"},"$c","$30",0]]
13:D"$31"
13:null
2b:D"$32"
2b:[["$","title","0",{"children":"AM Performance | High Performance Equipment"},"$c","$33",0],["$","meta","1",{"name":"description","content":"Equipamiento deportivo de alto rendimiento. Moderno, tÃ©cnico y brutalista."},"$c","$34",0]]
```
