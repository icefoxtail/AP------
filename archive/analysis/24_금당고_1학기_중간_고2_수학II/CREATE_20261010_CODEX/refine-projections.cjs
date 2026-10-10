const fs=require("node:fs"),path=require("node:path"),p=path.join(__dirname,"author-create.mjs");let s=fs.readFileSync(p,"utf8");
s=s.replace("tpl:'TPL_LIMIT_MULTI_METHOD_CHECK'","tpl:'TPL_LIMIT_RATIONALIZATION'");
s=s.replace("tpl:'TPL_LIMIT_ASYMPTOTIC_RELATION'","tpl:'TPL_LIMIT_OPERATION_LAWS'");
s=s.replaceAll("tpl:'TPL_LIMIT_POLYNOMIAL_RECONSTRUCTION'","tpl:'TPL_LIMIT_FINITE_CONDITION_PARAMETER'");
fs.writeFileSync(p,s,"utf8");
