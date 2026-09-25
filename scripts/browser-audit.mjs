import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const base=process.env.TAKONO_TEST_URL||'http://127.0.0.1:3000';
const browser=await chromium.launch({channel:'chrome',headless:true});
const output=process.env.TAKONO_AUDIT_DIR||'/tmp/takono-phase4-audit';
await fs.mkdir(output,{recursive:true});
const results=[];
const tokenFile=process.env.TAKONO_TEST_TOKEN_FILE;
const roleTokens=tokenFile?JSON.parse(await fs.readFile(tokenFile,'utf8')):{};
const brokenImages=page=>page.locator('img').evaluateAll(images=>images.filter(image=>image.complete&&image.naturalWidth===0).map(image=>image.currentSrc||image.src));
try {
 for(const width of [375,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900}});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const path of ['/','/destinations','/about','/how-it-works','/login']){
   await page.goto(base+'/#'+path);await page.waitForTimeout(1100);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
   results.push({width,path,overflow,errors:[...errors],brokenImages:await brokenImages(page)});
   await page.screenshot({path:`${output}/${width}-${path.replaceAll('/','_')||'home'}.png`,fullPage:true});
  }
  await context.close();
 }
 if(process.env.TAKONO_TEST_PASSWORD||tokenFile){
  for(const [role,email,paths] of [
   ['traveler','traveler@takono.id',['/app','/app/smart-guide','/app/events','/app/rewards','/app/local-discovery','/app/album','/app/profile']],
   ['manager','manager@bungkul.id',['/manager']],['government','dinas@surabaya.go.id',['/government']],['admin','admin@takono.id',['/admin','/manager','/government']]]){
   const context=await browser.newContext({viewport:{width:375,height:812}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   if(roleTokens[role]){
    await page.addInitScript(token=>localStorage.setItem('takono_token',token),roleTokens[role]);
   }else{
    await page.goto(base+'/#/login');await page.getByLabel('Email',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill(process.env.TAKONO_TEST_PASSWORD);await page.getByRole('button',{name:'Masuk',exact:true}).click();await page.waitForTimeout(1000);
    if(await page.getByRole('alert').count())throw new Error(`Login audit gagal untuk ${role}`);
   }
   for(const path of paths){await page.goto(base+'/#'+path);await page.waitForTimeout(1400);results.push({role,path,width:375,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),errors:[...errors],alerts:await page.getByRole('alert').allTextContents(),brokenImages:await brokenImages(page)});await page.screenshot({path:`${output}/${role}-${path.replaceAll('/','_')}.png`,fullPage:true});}
   if(role==='manager'){
    await page.getByRole('button',{name:'Explore Points'}).click();await page.getByRole('button',{name:'Tambah',exact:true}).click();
    await page.getByRole('button',{name:'+ Tambah Mini Quiz'}).click();
    results.push({role,interaction:'open create Explore Point + Quiz',dialog:await page.getByRole('dialog').isVisible(),errors:[...errors]});
   }
   if(role==='admin'){
    await page.goto(base+'/#/admin');await page.waitForTimeout(800);const row=page.locator('article').filter({hasText:'manager@bungkul.id'});await row.getByRole('button',{name:'Edit'}).click();
    results.push({role,interaction:'edit Manager assignment',destinationSelector:await page.getByLabel('Destinasi penugasan').isVisible(),errors:[...errors]});
   }
   // Revoke only the session created by this audit.
   await page.evaluate(async()=>{const token=localStorage.getItem('takono_token');if(token)await fetch('/api/auth/logout',{method:'POST',headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});});await context.close();
  }
 }
 console.log(JSON.stringify(results,null,2));
 await fs.writeFile(`${output}/results.json`,JSON.stringify(results,null,2));
}finally{await browser.close();}
