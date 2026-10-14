import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const req=createRequire(import.meta.url);
const {chromium}=req(process.env.BEKA_PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.setDefaultTimeout(8000); const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base='http://127.0.0.1:5173';
mkdirSync('test-results',{recursive:true});
for(const route of ['/','/servicos','/cardapio','/me-surpreenda','/contratacao','/evento-demo','/admin']){
 const response=await page.goto(base+route);assert.equal(response.status(),200);await page.waitForSelector('h1');await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.some(i=>i.complete&&i.naturalWidth===0)),false,`Imagem quebrada: ${route}`);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow desktop: ${route}`);
 if(route==='/'||route==='/admin')await page.screenshot({path:'test-results/'+(route==='/'?'home':'admin')+'-desktop.png',fullPage:true});
}
await page.goto(base+'/cardapio');
await page.getByRole('button',{name:'Sem álcool',exact:true}).click();assert.equal(await page.locator('.drink-card').count(),2);
await page.getByRole('button',{name:'Todos',exact:true}).click();await page.getByRole('textbox',{name:'Buscar por nome ou ingrediente'}).fill('alecrim');assert.equal(await page.locator('.drink-card').count(),1);
await page.getByRole('button',{name:'Ver detalhes de Jardim de Sicília'}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
await page.goto(base+'/me-surpreenda');await page.getByRole('button',{name:'Cítrico',exact:true}).click();await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.getByRole('button',{name:'Sem álcool',exact:true}).click();await page.getByRole('button',{name:'Descobrir meu drink'}).click();assert.match(await page.locator('.result-card').innerText(),/Brisa de Verão/);
await page.goto(base+'/contratacao');await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.getByRole('button',{name:'Continuar',exact:true}).click();assert.equal(await page.getByRole('alert').count(),1);
await page.getByLabel('Nome do evento').fill('Evento Teste Navegador');await page.getByLabel('Tipo de evento').selectOption('Corporativo');await page.getByLabel('Data pretendida').fill('2027-06-20');await page.getByLabel('Convidados estimados').fill('80');await page.getByLabel('Horário de início').fill('19:00');await page.getByLabel('Horário de término').fill('23:00');await page.getByLabel('Local do evento').fill('Espaço demonstrativo');
for(let i=0;i<4;i++)await page.getByRole('button',{name:'Continuar',exact:true}).click();
await page.getByLabel('Nome fictício').fill('Pessoa Demo');await page.getByLabel('E-mail fictício').fill('demo@example.com');await page.getByLabel('Telefone fictício').fill('11999990000');await page.getByRole('button',{name:'Continuar',exact:true}).click();assert.match(await page.locator('.review-block').innerText(),/Evento Teste Navegador/);
await page.getByRole('button',{name:'Voltar',exact:true}).click();assert.equal(await page.getByLabel('Nome fictício').inputValue(),'Pessoa Demo');await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.getByRole('button',{name:'Enviar solicitação demonstrativa'}).click();await page.locator('.booking-success').waitFor();
await page.goto(base+'/admin');await page.getByRole('button',{name:'Solicitações',exact:false}).first().click();assert.match(await page.locator('tbody').innerText(),/Evento Teste Navegador/);await page.getByRole('button',{name:'Abrir Evento Teste Navegador'}).click();await page.getByRole('dialog').locator('select').selectOption('Em análise');await page.keyboard.press('Escape');
await page.getByRole('button',{name:'Drinks',exact:true}).click();await page.getByRole('button',{name:'Editar Aurora Rosé',exact:true}).click();await page.getByLabel('Nome *',{exact:true}).fill('Aurora Teste');await page.getByRole('button',{name:'Salvar drink'}).click();
await page.goto(base+'/cardapio');assert.match(await page.locator('.drink-grid').innerText(),/Aurora Teste/);await page.reload();assert.match(await page.locator('.drink-grid').innerText(),/Aurora Teste/);
await page.goto(base+'/admin');await page.getByRole('button',{name:'Ingredientes',exact:true}).click();
// Locate by exact first-cell text to avoid matching ingredients in recipe names.
const rows=page.locator('tbody tr');for(let i=0;i<await rows.count();i++){if(await rows.nth(i).locator('td').first().innerText()==='Gin'){await rows.nth(i).getByRole('checkbox').uncheck();break;}}
await page.goto(base+'/me-surpreenda');await page.getByRole('button',{name:'Cítrico',exact:true}).click();await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.getByRole('button',{name:'Com álcool',exact:true}).click();await page.getByRole('button',{name:'Descobrir meu drink'}).click();assert.doesNotMatch(await page.locator('.result-card').innerText(),/Jardim de Sicília/);
await page.goto(base+'/evento-demo');await page.getByRole('button',{name:'Adicionar Brisa de Verão',exact:true}).click();await page.getByRole('button',{name:'Ver pedido',exact:false}).click();await page.getByLabel('Nome fictício para retirada').fill('Mesa Teste');await page.getByRole('button',{name:'Confirmar pedido demonstrativo'}).click();assert.match(await page.locator('.order-tracking').innerText(),/Pedido recebido/);
const lastId=await page.evaluate(()=>sessionStorage.getItem('beka-last-order'));
await page.goto(base+'/admin');await page.getByRole('button',{name:'Pedidos',exact:true}).click();await page.getByLabel('Estado do pedido '+lastId,{exact:true}).selectOption('Em preparação');
await page.goto(base+'/evento-demo');await page.getByRole('tab',{name:'Meu pedido'}).click();assert.match(await page.locator('.tracking-steps .done').last().innerText(),/Em preparação/);
await page.getByLabel('Modelo demonstrativo').selectOption('Pedidos individuais');await page.getByRole('tab',{name:'Cardápio',exact:true}).click();await page.getByRole('button',{name:'Adicionar Brisa de Verão',exact:true}).click();await page.getByRole('button',{name:'Ver pedido',exact:false}).click();assert.match(await page.getByRole('dialog').innerText(),/Pagamento futuro indisponível/);await page.getByLabel('Como deseja receber?').selectOption('Entrega ao convidado');await page.getByLabel('Mesa ou identificação fictícia').fill('Mesa 12');await page.getByRole('button',{name:'Confirmar pedido demonstrativo'}).click();assert.match(await page.locator('.order-summary').innerText(),/Entrega ao convidado/);
await page.goto(base+'/admin');await page.getByRole('button',{name:'Restaurar demonstração'}).click();await page.getByRole('button',{name:'Restaurar dados iniciais'}).click();await page.reload();const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('beka-demo-v1')));assert.equal(saved.drinks[0].name,'Aurora Rosé');assert.equal(saved.requests.length,3);assert.equal(saved.orders.length,2);
for(const width of [390,768]){await page.setViewportSize({width,height:900});for(const route of ['/','/servicos','/cardapio','/me-surpreenda','/contratacao','/evento-demo','/admin']){await page.goto(base+route);await page.waitForSelector('h1');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow ${width}: ${route}`);if(width===390&&(route==='/'||route==='/evento-demo'||route==='/admin'))await page.screenshot({path:'test-results/'+(route==='/'?'home':route.slice(1))+'-mobile.png',fullPage:true});}}
assert.deepEqual(errors,[]);writeFileSync('test-results/browser-report.json',JSON.stringify({passed:true,consoleErrors:errors,viewports:[1440,768,390],flows:['7 rotas','busca e filtros','modal e Escape','recomendação sem álcool','validação e contratação completa','edição e persistência','ingrediente indisponível','pedido e status','modo individual e entrega','restauração']},null,2));console.log('PASS: rotas, fluxos críticos e responsividade em 1440, 768 e 390 px; nenhum erro de página.');await browser.close();


