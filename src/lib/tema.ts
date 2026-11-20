import { temaPorTrilha } from "@/lib/temas-trilha";


export const CHAVE_TEMA = "integra-jovem:tema";

export const CHAVE_LUZ = "integra-jovem:luz";
export const LUZ_MINIMA = 30;
export const LUZ_MAXIMA = 100;

export const CHAVE_CORES_CLARO = "integra-jovem:cores-claro";

export const scriptTemaInicial = `try{var d=document.documentElement;if(localStorage.getItem("${CHAVE_TEMA}")==="light"){d.dataset.theme="light"}var l=Number(localStorage.getItem("${CHAVE_LUZ}"));if(l>=${LUZ_MINIMA}&&l<=${LUZ_MAXIMA}){d.style.setProperty("--luz",String(l))}var c=JSON.parse(localStorage.getItem("${CHAVE_CORES_CLARO}")||"null");if(c&&c.vars){for(var k in c.vars){if(k.indexOf("--")===0){d.style.setProperty(k,String(c.vars[k]))}}}}catch(e){}try{var d=document.documentElement;var p=location.pathname.split("/");var t=p[1]==="trilhas"&&${JSON.stringify(temaPorTrilha)}[decodeURIComponent(p[2]||"")];if(t){d.dataset.trilha=t}}catch(e){}`;
