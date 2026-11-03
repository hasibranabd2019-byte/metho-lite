(()=>{ 
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>'৳'+Number(v||0).toLocaleString('bn-BD');
const date=v=>{try{return new Date(v).toLocaleString('bn-BD',{dateStyle:'medium',timeStyle:'short'});}catch{return '';}};
document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-invoice-order]');if(!b)return;
 const original=b.textContent;b.disabled=true;b.textContent='ইনভয়েস তৈরি হচ্ছে…';let sheet;
 try{
  if(typeof window.html2pdf!=='function')throw Error('PDF সুবিধাটি লোড হয়নি।');
  const r=await fetch('/api/invoice',{method:'POST',headers:{'content-type':'application/json'},cache:'no-store',body:JSON.stringify({orderCode:b.dataset.invoiceOrder,phone:b.dataset.invoicePhone})});
  const d=await r.json();if(!r.ok)throw Error(d.error||'ইনভয়েস পাওয়া যায়নি।');
  const o=d.order||{},s=d.settings||{},items=o.items||[];if(!items.length)throw Error('পণ্যের তথ্য পাওয়া যায়নি।');
  const invoiceLogo=String(s.logo_url||'https://ghhljiclxtgzxndalztj.supabase.co/storage/v1/object/public/metho-assets/1793449380540-eaec6960eb30.png');
  const rows=items.map((x,i)=>'<tr><td class="c">'+(i+1).toLocaleString('bn-BD')+'</td><td><b>'+esc(x.product_name)+'</b><br><small>'+Number(x.package_kg||0).toLocaleString('bn-BD')+' কেজি</small></td><td class="c">'+Number(x.quantity||0).toLocaleString('bn-BD')+'</td><td class="r">'+money(x.unit_price)+'</td><td class="r">'+money(x.line_total)+'</td></tr>').join('');
  sheet=document.createElement('div');sheet.id='metho-invoice-pdf';sheet.style.cssText='position:absolute;left:-10000px;top:0;z-index:0;opacity:1;pointer-events:none;width:190mm;box-sizing:border-box;background:#fff;color:#18251b;padding:10mm;font:12px/1.6 Arial,"Noto Sans Bengali",sans-serif';
  sheet.innerHTML='<style>#metho-invoice-pdf *{box-sizing:border-box}#metho-invoice-pdf .logo{width:54px;height:54px;object-fit:contain;display:block;margin:0 auto 4px}#metho-invoice-pdf table{width:100%;border-collapse:collapse;font-size:10px;margin-top:8px}#metho-invoice-pdf th{padding:6px 4px;background:#194b26;color:#fff;text-align:left}#metho-invoice-pdf td{padding:6px 4px;border-bottom:1px solid #e1e8df}#metho-invoice-pdf .c{text-align:center}#metho-invoice-pdf .r{text-align:right;white-space:nowrap}#metho-invoice-pdf .customer{background:#f2f6f0;padding:9px;border-radius:6px;margin:10px 0}#metho-invoice-pdf .totals{width:58%;margin:10px 0 0 auto;border-top:1px solid #dce5dc;padding-top:7px}#metho-invoice-pdf .total{display:flex;justify-content:space-between;padding:3px 0}#metho-invoice-pdf .grand{border-top:2px solid #194b26;color:#194b26;font-size:15px;font-weight:700;padding-top:6px}#metho-invoice-pdf .footer{margin-top:12px;padding:10px 12px;background:#173d22;border-radius:7px;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:10px;font-weight:700}#metho-invoice-pdf .footer img{width:45px;height:45px;object-fit:contain;background:#fff;border-radius:5px;padding:3px}#metho-invoice-pdf .qr{border-top:1px dashed #cbd8ca;margin:12px auto 8px;padding-top:8px;text-align:center}#metho-invoice-pdf .qr img{width:88px;height:88px}</style>'+
  '<div style="text-align:center;border-bottom:2px solid #194b26;padding-bottom:9px;margin-bottom:10px">'+'<img class="logo" crossorigin="anonymous" src="'+esc(invoiceLogo)+'" alt="মেঠো লোগো">'+'<div style="font-size:24px;font-weight:700;color:#194b26">'+esc(s.brand_name||'মেঠো')+'</div><div style="font-size:11px;color:#5c6c5e;letter-spacing:1px">METHO</div><h2 style="font-size:18px;margin:5px 0 0;color:#194b26">'+esc(s.invoice_title||'বিক্রয় ইনভয়েস')+'</h2></div>'+
  '<div style="display:flex;justify-content:space-between;margin-bottom:10px"><div><b>অর্ডার নং:</b> '+esc(o.order_code)+'<br><b>তারিখ:</b> '+esc(date(o.created_at))+'</div><div style="text-align:right"><b>পেমেন্ট:</b> '+(o.payment_method==='ADVANCE'?'অগ্রিম পেমেন্ট':'ক্যাশ অন ডেলিভারি')+'</div></div>'+
  '<div class="customer"><b style="color:#194b26">ক্রেতার তথ্য</b><br><b>নাম:</b> '+esc(o.customer_name)+'<br><b>মোবাইল:</b> '+esc(o.phone_masked)+'<br><b>ঠিকানা:</b> '+esc(o.address)+'</div>'+
  '<table><thead><tr><th style="width:8%;text-align:center">ক্রম</th><th style="width:38%">পণ্যের বিবরণ</th><th style="width:13%;text-align:center">পরিমাণ</th><th style="width:20%;text-align:right">একক দাম</th><th style="width:21%;text-align:right">মোট</th></tr></thead><tbody>'+rows+'</tbody></table>'+
  '<div class="totals"><div class="total"><span>পণ্যের মূল্য</span><b>'+money(items.reduce((n,x)=>n+Number(x.line_total||0),0))+'</b></div><div class="total"><span>ডেলিভারি চার্জ</span><b>'+money(o.delivery_fee)+'</b></div><div class="total grand"><span>সর্বমোট</span><b>'+money(o.total_amount)+'</b></div></div>'+
  (s.invoice_note?'<p style="margin-top:12px;color:#5c6c5e">'+esc(s.invoice_note)+'</p>':'')+
  '<section class="qr"><b style="color:#194b26">ইনভয়েস যাচাই ও তথ্য</b><div id="metho-invoice-qr" style="display:flex;justify-content:center;margin:6px auto"></div><small style="color:#68776a">QR কোড স্ক্যান করে ইনভয়েসের তথ্য যাচাই করুন</small></section>'+
  '<footer class="footer"><div style="display:flex;align-items:center;gap:9px">'+'<img crossorigin="anonymous" src="'+esc(invoiceLogo)+'" alt="মেঠো লোগো">'+'<span>প্রকৃতির উপহার</span></div><span style="white-space:nowrap;text-align:center">☎ 01356880999</span><span style="text-align:right;line-height:1.6">মেঠোর সাথে থাকার জন্য<br>ধন্যবাদ।</span></footer>';
  document.body.appendChild(sheet);
  if(window.QRCode){new window.QRCode(sheet.querySelector('#metho-invoice-qr'),{text:JSON.stringify({brand:'METHO',invoice:o.order_code,total:o.total_amount}),width:110,height:110,colorDark:'#173d22',colorLight:'#ffffff'});}
  const logoImages=[...sheet.querySelectorAll('img')];await Promise.all(logoImages.map(img=>{if(img.complete&&img.naturalWidth)return Promise.resolve();return new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;});}));
  if(document.fonts?.ready)await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const pdfOptions={margin:0,filename:'METHO-Invoice-'+String(o.order_code).replace(/[^A-Z0-9-]/gi,'')+'.pdf',image:{type:'jpeg',quality:.98},html2canvas:{scale:1.7,useCORS:true,allowTaint:false,backgroundColor:'#fff',logging:false,windowWidth:Math.max(sheet.scrollWidth,720),windowHeight:Math.max(sheet.scrollHeight,900),scrollX:0,scrollY:0},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy']}};
  const worker=window.html2pdf().set(pdfOptions).from(sheet);
  const canvas=await worker.toCanvas().get('canvas');
  if(!canvas||canvas.width<100||canvas.height<100)throw Error('ইনভয়েসের PDF ছবি তৈরি হয়নি। আবার চেষ্টা করুন।');
  const ctx=canvas.getContext('2d',{willReadFrequently:true});let visiblePixels=0;for(let y=10;y<canvas.height;y+=Math.max(1,Math.floor(canvas.height/20))){for(let x=10;x<canvas.width;x+=Math.max(1,Math.floor(canvas.width/20))){const p=ctx.getImageData(x,y,1,1).data;if(p[0]<245||p[1]<245||p[2]<245){visiblePixels++;if(visiblePixels>3)break;}}if(visiblePixels>3)break;}
  if(visiblePixels<1)throw Error('ইনভয়েস ফাঁকা তৈরি হচ্ছে। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।');
  const pdf=await worker.toPdf().get('pdf');
  if(!pdf||typeof pdf.save!=='function')throw Error('PDF ফাইল প্রস্তুত হয়নি। আবার চেষ্টা করুন।');
  pdf.save(pdfOptions.filename);
 }catch(x){alert(x.message||'ইনভয়েস ডাউনলোড করা যায়নি।');}finally{sheet?.remove();b.disabled=false;b.textContent=original;}
});
})();