import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const req=createRequire(import.meta.url);const {chromium}=req(process.env.BEKA_PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});const context=await browser.newContext();
const admin=await context.newPage();const event=await context.newPage();const consoleErrors=[];const external=[];
for(const page of [admin,event]){page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});page.on('pageerror',e=>consoleErrors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:5173/')&&!r.url().startsWith('ws://127.0.0.1:5173/')&&!r.url().startsWith('data:'))external.push(r.url());});}
await admin.goto('http://127.0.0.1:5173/admin');await admin.getByRole('button',{name:'Configuração do evento',exact:true}).click();
await event.goto('http://127.0.0.1:5173/evento-demo');await event.waitForSelector('h1');
await admin.getByLabel('Nome demonstrativo').fill('Evento em duas abas');await event.getByRole('heading',{name:'Evento em duas abas',exact:false}).waitFor();
await admin.getByLabel('Modalidade',{exact:false}).selectOption('Pedidos individuais');await event.waitForFunction(()=>document.querySelector('.event-mode-card select')?.value==='Pedidos individuais');
await admin.getByRole('button',{name:'Restaurar demonstração'}).click();await admin.getByRole('button',{name:'Restaurar dados iniciais'}).click();await event.getByRole('heading',{name:'Encontro Horizonte',exact:false}).waitFor();
assert.deepEqual(consoleErrors,[]);assert.deepEqual(external,[]);
console.log('PASS: alterações e restauração entre abas da mesma origem; nenhum erro de console/página e nenhuma requisição externa em execução.');await browser.close();
