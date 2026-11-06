const {chromium}=require('C:/Users/Rsaee/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path');
(async()=>{
const out=path.resolve('outputs'), url='file:///'+out.replace(/\\/g,'/')+'/financial-dashboard.html';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const p=await browser.newPage({viewport:{width:1440,height:1100}});let errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url);
 await p.selectOption('#committee','الفعاليات');if(await p.locator('#invoiceCount').innerText()!=='2')throw Error('committee failed');
 await p.selectOption('#semester','past');if(!await p.locator('#stateContent').isVisible())throw Error('semester empty failed');
 await p.evaluate(()=>resetFilters());
 await p.screenshot({path:out+'/desktop-dashboard.png',fullPage:true});
 await p.evaluate(()=>openExport());await p.selectOption('#export-status','unpaid');await p.evaluate(()=>previewReport());await p.evaluate(()=>openExport(true));if(await p.locator('#export-status').inputValue()!=='unpaid')throw Error('export scope persistence failed');await p.evaluate(()=>closeModal());
 await p.evaluate(()=>openInvoice('FTC-1047'));await p.screenshot({path:out+'/desktop-invoice.png'});await p.evaluate(()=>closeModal());
 for(const state of ['loading','empty','error']){await p.evaluate(s=>setState(s),state);await p.screenshot({path:out+'/state-'+state+'.png',fullPage:true})}
 await p.evaluate(()=>setState('normal'));await p.setViewportSize({width:390,height:844});await p.screenshot({path:out+'/mobile-overview.png'});
 await p.addStyleTag({content:'.bottomnav{position:absolute;top:auto;bottom:0}body{position:relative}'});await p.screenshot({path:out+'/mobile-dashboard.png',fullPage:true});
 await p.goto(url+'?view=report');await p.setViewportSize({width:794,height:1123});await p.pdf({path:out+'/financial-report-A4.pdf',format:'A4',printBackground:true,preferCSSPageSize:true});await p.screenshot({path:out+'/report-A4.png',fullPage:true});
 await p.goto(url);await p.setViewportSize({width:1440,height:1100});await p.evaluate(()=>openExport());await p.evaluate(()=>previewReport());await p.screenshot({path:out+'/desktop-report-preview.png'});
 await p.setViewportSize({width:390,height:844});await p.evaluate(()=>closeModal());await p.evaluate(()=>openExport());await p.screenshot({path:out+'/mobile-export.png'});await p.evaluate(()=>closeModal());await p.evaluate(()=>openInvoice('FTC-1047'));await p.screenshot({path:out+'/mobile-invoice.png'});await p.locator('.dialog').evaluate(e=>e.scrollTop=e.scrollHeight);await p.screenshot({path:out+'/mobile-attachment.png'});
 await p.evaluate(()=>closeModal());
 for(const w of [360,390,768,1440]){await p.setViewportSize({width:w,height:900});if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('overflow '+w)}
 console.log(JSON.stringify({errors,checks:'committee, semester empty, export persistence, responsive 360/390/768/1440',report:'financial-report-A4.pdf'}));if(errors.length)throw Error(errors.join('\n'));
}finally{await browser.close()}
})();
