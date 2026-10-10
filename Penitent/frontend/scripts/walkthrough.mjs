import { chromium } from 'playwright';
import { readFile, mkdir, rename } from 'node:fs/promises';
const credentials=Object.fromEntries((await readFile('../backend/Penitent.Api/.env.local','utf8')).trim().split(/\r?\n/).map(line=>line.split(/=(.*)/s).slice(0,2)));
await mkdir('../docs/videos',{recursive:true});
const browser=await chromium.launch();
const context=await browser.newContext({baseURL:'http://localhost:5173',viewport:{width:1280,height:900},recordVideo:{dir:'../docs/videos',size:{width:1280,height:900}}});
async function mutate(path,body,method='POST'){const token=(await(await context.request.get('/api/v1/security/csrf')).json()).token;const response=await context.request.fetch('/api/v1'+path,{method,headers:{'Content-Type':'application/json','Origin':'http://localhost:5173','X-CSRF-TOKEN':token},data:body});if(!response.ok())throw new Error('Walkthrough request failed: '+response.status());return response.status()===204?null:response.json();}
await mutate('/admin/login',{email:credentials.Admin__Email,password:credentials.Admin__Password});
const initial=(await(await context.request.get('/api/v1/admin/products')).json()).items.find(p=>p.slug==='quiet-hours-tee');const initialVariant=initial.variants.find(v=>v.sku==='PN-01-Ink-S');
if(initialVariant.stock!==8)await mutate('/admin/products/'+initial.id+'/variants/'+initialVariant.id,{sku:initialVariant.sku,sizeId:initialVariant.sizeId,colourId:initialVariant.colourId,stock:8,version:initialVariant.version},'PUT');
const page=await context.newPage();
async function caption(text){await page.evaluate(text=>{document.getElementById('walkthrough-caption')?.remove();const box=document.createElement('div');box.id='walkthrough-caption';box.textContent=text;box.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:14px 25px;background:#25251ff2;color:white;border:1px solid #a0a38b;font:14px Arial;z-index:999;max-width:90vw;text-align:center';document.body.append(box);},text);await page.waitForTimeout(2200);}
await page.goto('/');await caption('PENITENT — Chapter 01. An original clothing experience.');
await page.goto('/shop');await caption('Browse clothing with categories, sizes, colours, and price filters.');
await page.goto('/products/quiet-hours-tee');await page.getByRole('button',{name:'M',exact:true}).click();await caption('Choose a size and colour. Sold-out variants cannot be selected.');
await page.getByRole('button',{name:'Add to bag'}).click();await page.waitForTimeout(800);await page.goto('/bag');await page.getByLabel('Quantity for Quiet Hours Tee').fill('2');await page.getByLabel('Quantity for Quiet Hours Tee').blur();await caption('The server owns prices and quantity validation. Your bag survives refresh.');
const bad=await mutate('/cart/items',{variantId:2,quantity:0}).catch(e=>e.message);
await caption('An invalid quantity was rejected by the backend.');
await page.goto('/checkout');
for(const[label,value]of [['Email','demo@example.test'],['Mobile number','9876543210'],['Full name','Demo Visitor'],['Address','12 Sample Street'],['City','Bengaluru'],['State','Karnataka'],['PIN code','560001']])await page.getByLabel(label,{exact:true}).fill(value);
await page.getByRole('combobox',{name:'Packaging',exact:true}).selectOption('gift');await page.getByLabel('Gift message (optional)').fill('A thoughtful beginning.');await page.getByRole('button',{name:'Create demo preview'}).click();await page.waitForTimeout(900);await caption('Checkout validates sample details. No payment, order, or stock deduction.');
await page.goto('/admin');await page.getByRole('button',{name:/Quiet Hours Tee/}).click();await page.getByRole('combobox',{name:'Choose variant',exact:true}).selectOption({label:'PN-01-Ink-S · 8 in stock'});await page.getByLabel('Stock',{exact:true}).fill('7');await page.getByRole('button',{name:'Save variant'}).click();await page.waitForTimeout(900);await caption('Private product management updates real PostgreSQL inventory.');
await page.goto('/products/quiet-hours-tee');await page.getByRole('button',{name:'S',exact:true}).click();await caption('The storefront now shows 7 available. Backend changes are live.');
const catalogue=await(await context.request.get('/api/v1/admin/products')).json();const product=catalogue.items.find(p=>p.slug==='quiet-hours-tee');const variant=product.variants.find(v=>v.sku==='PN-01-Ink-S');
await mutate('/admin/products/'+product.id+'/variants/'+variant.id,{sku:variant.sku,sizeId:variant.sizeId,colourId:variant.colourId,stock:8,version:variant.version},'PUT');
await mutate('/admin/logout');
const video=page.video();await page.close();await context.close();const path=await video.path();await rename(path,'../docs/videos/penitent-walkthrough.webm');await browser.close();console.log('Walkthrough saved.');


