const services=new Set(['Administración de arriendos','Corretaje','Asesoría legal','Otra consulta']);
export function validateContact(data){
 if(!data||typeof data!=='object')return 'Solicitud inválida.';
 for(const [key,max] of [['name',100],['email',254],['phone',30],['commune',80],['message',4000],['service',80]])if(data[key]!=null&&(typeof data[key]!=='string'||data[key].length>max))return 'Revise los datos de su consulta.';
 if(!data.name?.trim()||data.name.trim().length<2)return 'Ingrese su nombre.';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email||''))return 'Ingrese un correo válido.';
 if(!services.has(data.service))return 'Seleccione un servicio.';
 if(!data.message||data.message.trim().length<10)return 'Cuéntenos un poco más sobre su consulta.';
 if(data.consent!=='on')return 'Necesitamos su autorización para contactarle.';
 if(/[\r\n]/.test(data.name+data.email))return 'Revise el nombre y el correo.';
 return null;
}
const json=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export default{async fetch(request,env){
 const url=new URL(request.url);
 if(url.hostname==='www.integrall.cl')return Response.redirect('https://integrall.cl'+url.pathname+url.search,308);
 if(url.pathname==='/api/contact'){
  if(request.method!=='POST')return json({error:'Método no permitido.'},405);
  if(request.headers.get('Origin')!==url.origin)return json({error:'Origen no permitido.'},403);
  if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'Formato no permitido.'},415);
  if(Number(request.headers.get('Content-Length')||0)>16000)return json({error:'La consulta es demasiado extensa.'},413);
  let data;try{const raw=await request.text();if(raw.length>16000)return json({error:'La consulta es demasiado extensa.'},413);data=JSON.parse(raw)}catch{return json({error:'Solicitud inválida.'},400)}
  if(data?.website)return json({ok:true});
  const error=validateContact(data);if(error)return json({error},400);
  if(!Number.isFinite(data.started)||Date.now()-data.started<2000)return json({error:'Espere unos segundos antes de enviar.'},429);
  if(env.CONTACT_LIMITER){const {success}=await env.CONTACT_LIMITER.limit({key:request.headers.get('CF-Connecting-IP')||'unknown'});if(!success)return json({error:'Ha enviado varias consultas. Inténtelo en un minuto.'},429)}
  if(!env.EMAIL)return json({error:'El envío del formulario aún se está habilitando.'},503);
  try{await env.EMAIL.send({from:env.EMAIL_FROM,to:env.CONTACT_TO,subject:`Consulta web · ${data.service}`,replyTo:data.email,text:`Nueva consulta desde integrall.cl\n\nNombre: ${data.name.trim()}\nCorreo: ${data.email}\nTeléfono: ${data.phone||'No indicado'}\nComuna: ${data.commune||'No indicada'}\nServicio: ${data.service}\n\n${data.message.trim()}\n\nEl remitente autorizó ser contactado para responder esta consulta.`});return json({ok:true})}catch(error){console.error('Contact delivery failed',error.name);return json({error:'No pudimos entregar su consulta en este momento.'},502)}
 }
 if(url.pathname.startsWith('/api/'))return json({error:'No encontrado.'},404);
 return env.ASSETS.fetch(request);
}};
