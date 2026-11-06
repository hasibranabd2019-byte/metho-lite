const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const money=n=>'৳'+(Number(n||0)/100).toLocaleString('bn-BD',{maximumFractionDigits:2});const bnSmall=['শূন্য','এক','দুই','তিন','চার','পাঁচ','ছয়','সাত','আট','নয়','দশ','এগারো','বারো','তেরো','চৌদ্দ','পনেরো','ষোলো','সতেরো','আঠারো','উনিশ','বিশ','একুশ','বাইশ','তেইশ','চব্বিশ','পঁচিশ','ছাব্বিশ','সাতাশ','আটাশ','ঊনত্রিশ','ত্রিশ','একত্রিশ','বত্রিশ','তেত্রিশ','চৌত্রিশ','পঁয়ত্রিশ','ছত্রিশ','সাঁইত্রিশ','আটত্রিশ','ঊনচল্লিশ','চল্লিশ','একচল্লিশ','বিয়াল্লিশ','তেতাল্লিশ','চুয়াল্লিশ','পঁয়তাল্লিশ','ছেচল্লিশ','সাতচল্লিশ','আটচল্লিশ','ঊনপঞ্চাশ','পঞ্চাশ','একান্ন','বাহান্ন','তিপ্পান্ন','চুয়ান্ন','পঞ্চান্ন','ছাপ্পান্ন','সাতান্ন','আটান্ন','ঊনষাট','ষাট','একষট্টি','বাষট্টি','তেষট্টি','চৌষট্টি','পঁয়ষট্টি','ছেষট্টি','সাতষট্টি','আটষট্টি','ঊনসত্তর','সত্তর','একাত্তর','বাহাত্তর','তিয়াত্তর','চুয়াত্তর','পঁচাত্তর','ছিয়াত্তর','সাতাত্তর','আটাত্তর','ঊনআশি','আশি','একাশি','বিরাশি','তিরাশি','চুরাশি','পঁচাশি','ছিয়াশি','সাতাশি','আটাশি','ঊননব্বই','নব্বই','একানব্বই','বিরানব্বই','তিরানব্বই','চুরানব্বই','পঁচানব্বই','ছিয়ানব্বই','সাতানব্বই','আটানব্বই','নিরানব্বই'];function banglaNumberWords(n){n=Math.floor(Math.abs(Number(n)||0));if(n<100)return bnSmall[n];const parts=[];const add=(v,label)=>{if(v){parts.push(banglaNumberWords(v)+' '+label);}};if(n>=10000000){add(Math.floor(n/10000000),'কোটি');n%=10000000;}if(n>=100000){add(Math.floor(n/100000),'লক্ষ');n%=100000;}if(n>=1000){add(Math.floor(n/1000),'হাজার');n%=1000;}if(n>=100){add(Math.floor(n/100),'শত');n%=100;}if(n)parts.push(bnSmall[n]);return parts.join(' ');}
const cart=new Map();let cooldownUntil=0,cooldownTimer=null,bdTree=[];
const DHAKA_THANAS=['আদাবর','এয়ারপোর্ট','বাড্ডা','বনানী','বংশাল','ভাষানটেক','ক্যান্টনমেন্ট','চকবাজার','দারুস সালাম','দক্ষিণখান','ডেমরা','ধানমন্ডি','গেন্ডারিয়া','গুলশান','হাজারীবাগ','যাত্রাবাড়ী','কদমতলী','কাফরুল','কলাবাগান','কামরাঙ্গীরচর','খিলগাঁও','খিলক্ষেত','কোতোয়ালি','লালবাগ','মিরপুর মডেল','মোহাম্মদপুর','মতিঝিল','মুগদা','নিউ মার্কেট','পল্লবী','পল্টন মডেল','রমনা মডেল','রামপুরা','রূপনগর','সবুজবাগ','শাহ আলী','শাহবাগ','শেরে বাংলা নগর','শ্যামপুর','সূত্রাপুর','শাহজাহানপুর','তেজগাঁও','তেজগাঁও শিল্পাঞ্চল','তুরাগ','হাতিরঝিল','উত্তরা মডেল','উত্তরখান','উত্তরা পশ্চিম','ভাটারা','ওয়ারী'];
const fallbackDistricts=['বাগেরহাট','বান্দরবান','বরগুনা','বরিশাল','ভোলা','বগুড়া','ব্রাহ্মণবাড়িয়া','চাঁদপুর','চট্টগ্রাম','চুয়াডাঙ্গা','কক্সবাজার','কুমিল্লা','ঢাকা','দিনাজপুর','ফরিদপুর','ফেনী','গাইবান্ধা','গাজীপুর','গোপালগঞ্জ','হবিগঞ্জ','জামালপুর','যশোর','ঝালকাঠি','ঝিনাইদহ','জয়পুরহাট','খাগড়াছড়ি','খুলনা','কিশোরগঞ্জ','কুড়িগ্রাম','কুষ্টিয়া','লক্ষ্মীপুর','লালমনিরহাট','মাদারীপুর','মাগুরা','মানিকগঞ্জ','মেহেরপুর','মৌলভীবাজার','মুন্সীগঞ্জ','ময়মনসিংহ','নওগাঁ','নড়াইল','নারায়ণগঞ্জ','নরসিংদী','নাটোর','নেত্রকোণা','নীলফামারী','নোয়াখালী','পাবনা','পঞ্চগড়','পটুয়াখালী','পিরোজপুর','রাজবাড়ী','রাজশাহী','রাঙ্গামাটি','রংপুর','সাতক্ষীরা','শরীয়তপুর','শেরপুর','সিরাজগঞ্জ','সুনামগঞ্জ','সিলেট','টাঙ্গাইল','ঠাকুরগাঁও'];
async function api(path,opt={}){const r=await fetch(path,{...opt,headers:{'content-type':'application/json',...(opt.headers||{})}}),d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'অনুরোধ ব্যর্থ');return d;}
function fillSelect(el,items,placeholder){el.innerHTML='<option value="">'+placeholder+'</option>'+items.map(x=>'<option value="'+esc(x.bn_name||x)+'">'+esc(x.bn_name||x)+'</option>').join('');}
async function loadLocations(){const d=$('#district'),u=$('#upazila');fillSelect(d,[...new Set([...fallbackDistricts,'ঢাকা (সিটি)'])].sort((a,b)=>a.localeCompare(b,'bn')),'জেলা নির্বাচন করুন');let loading=null;const ensureGeoData=()=>{if(bdTree.length)return Promise.resolve(bdTree);if(!loading)loading=fetch('/data/bd-admin.json',{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{bdTree=data;const selected=d.value,list=bdTree.flatMap(x=>x.districts||[]);if(!list.some(x=>x.bn_name==='ঢাকা (সিটি)'))list.push({bn_name:'ঢাকা (সিটি)'});list.sort((a,b)=>a.bn_name.localeCompare(b.bn_name,'bn'));fillSelect(d,list,'জেলা নির্বাচন করুন');if(selected)d.value=selected;return bdTree;}).catch(()=>{loading=null;return bdTree;});return loading;};const renderUpazilas=()=>{const isDhakaCity=d.value==='ঢাকা (সিটি)',found=bdTree.flatMap(x=>x.districts||[]).find(x=>x.bn_name===d.value),list=(isDhakaCity?DHAKA_THANAS:(found?.upazilas||[])).slice().sort((a,b)=>String(a.bn_name||a).localeCompare(String(b.bn_name||b),'bn'));fillSelect(u,list,d.value?(list.length?'উপজেলা / থানা নির্বাচন করুন':'তালিকা পাওয়া যায়নি'):'আগে জেলা নির্বাচন করুন');u.disabled=!d.value;u.required=isDhakaCity;};d.onfocus=()=>{ensureGeoData().then(renderUpazilas);};d.onchange=()=>{if(bdTree.length)renderUpazilas();else{u.disabled=true;u.innerHTML='<option value="">উপজেলার তালিকা লোড হচ্ছে…</option>';ensureGeoData().then(renderUpazilas);}};return {ensureGeoData};}
function renderBanners(banners){const host=$('#hero-slides'),dots=$('#hero-dots');const list=(banners||[]).filter(x=>x.image_url);host.innerHTML=list.map((b,i)=>'<div class="hero-slide '+(i===0?'active':'')+'"><img src="'+esc(b.image_url)+'" alt="'+esc(b.alt_text||'মেঠো')+'" loading="'+(i===0?'eager':'lazy')+'" decoding="async" '+(i===0?'fetchpriority="high"':'')+'></div>').join('');dots.innerHTML=list.length>1?list.map((_,i)=>'<button type="button" data-dot="'+i+'" class="'+(!i?'active':'')+'" aria-label="ব্যানার '+(i+1)+'"></button>').join(''):'';if(list.length>1){let index=0;const show=n=>{index=(n+list.length)%list.length;host.querySelectorAll('.hero-slide').forEach((x,i)=>x.classList.toggle('active',i===index));dots.querySelectorAll('button').forEach((x,i)=>x.classList.toggle('active',i===index));};dots.querySelectorAll('button').forEach(x=>x.onclick=()=>show(Number(x.dataset.dot)));setInterval(()=>show(index+1),5000);}}
async function loadConfig(){try{const d=await api('/api/config'),s=d.settings||{};if(s.logo_url)$('#brand-logo').src=s.logo_url;if(s.phone){const p=String(s.phone).replace(/[^+0-9]/g,'');$('#call-button').href='tel:'+p;$('#call-button').hidden=false;}if(s.primary_color)document.documentElement.style.setProperty('--green',s.primary_color);if(s.accent_color)document.documentElement.style.setProperty('--gold',s.accent_color);const social=$('#social-links');social.innerHTML=(s.whatsapp_link?'<a class="whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp" href="'+esc(s.whatsapp_link)+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.33.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.44-8.44ZM12.06 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.85 9.85 0 1 1 8.38 4.64Zm5.42-7.38c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.88-.78-1.48-1.74-1.65-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.07-.8.38-.28.3-1.05 1.02-1.05 2.49s1.08 2.88 1.23 3.08c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z"/></svg><span>WhatsApp</span></a>':'')+(s.messenger_link?'<a class="messenger" target="_blank" rel="noopener" aria-label="Messenger" href="'+esc(s.messenger_link)+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0C5.1 0 0 4.9 0 11.5c0 3.45 1.42 6.53 3.72 8.62.2.18.32.43.33.7l.07 2.2a.7.7 0 0 0 .98.63l2.46-1.08c.21-.1.45-.11.67-.05.12.03.24.06.36.08.99.23 2.12.35 3.41.35 6.9 0 12-4.9 12-11.45C24 4.9 18.9 0 12 0Zm1.2 15.47-3.05-3.25a.9.9 0 0 0-1.1-.16l-3.36 1.8c-.36.2-.75-.2-.52-.55l3.25-4.86a.9.9 0 0 1 1.38-.13l3.05 3.25a.9.9 0 0 0 1.1.16l3.36-1.8c.36-.2.75.2.52.55l-3.25 4.86a.9.9 0 0 1-1.38.13Z"/></svg><span>Messenger</span></a>':'');renderBanners(d.banners||[]);}catch(e){console.warn('Site settings unavailable',e);}}
const productQty=new Map();
function selectedVariant(productId){return document.querySelector('.variant-choice[data-product="'+productId+'"].selected');}
function updateProductCard(productId){const chosen=selectedVariant(productId),variantId=Number(chosen?.dataset.variant),add=document.querySelector('.add[data-id="'+productId+'"]'),qty=document.querySelector('.quantity-stepper[data-product="'+productId+'"] output'),hasSameProduct=[...cart.values()].some(x=>Number(x.product_id)===Number(productId));if(add){add.textContent=!cart.size?'অর্ডার করুন':hasSameProduct?'আপনার অর্ডারে যুক্ত করুন':'আপনার অর্ডারের সাথে যুক্ত করুন';add.disabled=!variantId||cart.has(variantId);}if(qty)qty.textContent=String(productQty.get(variantId)||1);}function updateAllProductCards(){document.querySelectorAll('.add[data-id]').forEach(b=>updateProductCard(Number(b.dataset.id)));}
async function loadProducts(){const root=$('#products-grid');try{const d=await api('/api/products');root.innerHTML=(d.products||[]).map(p=>'<article class="product">'+(p.image_url?'<img class="product-image" src="'+esc(p.image_url)+'" alt="'+esc(p.name)+'" loading="lazy" decoding="async">':'<div class="product-image"></div>')+'<div class="product-body"><h3>'+esc(p.name)+'</h3><p>'+esc(p.description)+'</p><div class="product-price" id="price'+p.id+'">'+money((p.variants.find(v=>v.price_paisa>0)||p.variants[0]||{}).price_paisa)+' <small id="price-size'+p.id+'" style="color:#888;font-size:12px;font-weight:400">('+esc((p.variants.find(v=>v.price_paisa>0)||p.variants[0]||{}).label||'')+')</small></div><div class="variant-options" role="group" aria-label="পণ্যের সাইজ">'+p.variants.map(v=>'<button type="button" class="variant-choice '+(v.id===(p.variants.find(x=>x.price_paisa>0)||p.variants[0]||{}).id?'selected':'')+'" data-product="'+p.id+'" data-variant="'+v.id+'" '+((v.price_paisa<=0)?'disabled':'')+'><span class="variant-check">✓</span>'+esc(v.label)+'</button>').join('')+'</div><div class="quantity-stepper" data-product="'+p.id+'"><span class="quantity-label">সংখ্যা</span><button type="button" data-qty="minus" aria-label="পরিমাণ কমান">−</button><output>১</output><button type="button" data-qty="plus" aria-label="পরিমাণ বাড়ান">+</button></div><button class="add" data-id="'+p.id+'" '+(p.variants.every(v=>v.price_paisa<=0)?'disabled':'')+'>অর্ডার করুন</button></div></article>').join('')||'এখন কোনো পণ্য পাওয়া যাচ্ছে না।';
root.querySelectorAll('.variant-choice').forEach(b=>b.onclick=()=>{const p=d.products.find(x=>x.id===Number(b.dataset.product)),v=p?.variants.find(x=>x.id===Number(b.dataset.variant));if(!v)return;root.querySelectorAll('.variant-choice[data-product="'+p.id+'"]').forEach(x=>x.classList.toggle('selected',x===b));$('#price'+p.id).firstChild.textContent=money(v.price_paisa)+' ';$('#price-size'+p.id).textContent='('+v.label+')';updateProductCard(p.id);});
root.querySelectorAll('.quantity-stepper button').forEach(b=>b.onclick=()=>{const pId=Number(b.closest('.quantity-stepper').dataset.product),vId=Number(selectedVariant(pId)?.dataset.variant);if(!vId)return;const current=productQty.get(vId)||1;productQty.set(vId,Math.max(1,Math.min(10,current+(b.dataset.qty==='plus'?1:-1))));updateProductCard(pId);});
root.querySelectorAll('.add').forEach(b=>{const productId=Number(b.dataset.id);updateProductCard(productId);b.onclick=()=>{if(b.disabled)return;const p=d.products.find(x=>x.id===productId),chosen=selectedVariant(p.id),v=p.variants.find(x=>x.id===Number(chosen?.dataset.variant));if(!v||cart.has(v.id))return;cart.set(v.id,{product_id:p.id,variant_id:v.id,product_name:p.name,variant_label:v.label,image_url:p.image_url||'',unit_price_paisa:v.price_paisa,weight_kg:v.weight_kg,quantity:productQty.get(v.id)||1});updateAllProductCards();renderCart();renderCheckoutTotals();showCartToast();};});
}catch{root.textContent='পণ্য লোড করা যাচ্ছে না। পরে আবার চেষ্টা করুন।';}}

let cartToastTimer=null;function showCartToast(){let toast=$('#cart-toast');if(!toast){toast=document.createElement('div');toast.id='cart-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');toast.className='cart-toast';document.body.appendChild(toast);}toast.innerHTML='<img class="cart-toast-cat" src="https://ghhljiclxtgzxndalztj.supabase.co/storage/v1/object/public/metho-lite-assets/1000097387.gif" alt="" aria-hidden="true" onerror="this.hidden=true"><span class="cart-toast-text">কার্টে পণ্য যোগ হয়েছে।<br>অর্ডার সম্পন্ন করতে নিচে যান।</span>';toast.classList.remove('is-visible','is-hiding');document.body.classList.add('cart-toast-open');void toast.offsetWidth;toast.classList.add('is-visible');if(cartToastTimer)clearTimeout(cartToastTimer);cartToastTimer=setTimeout(()=>{toast.classList.remove('is-visible');toast.classList.add('is-hiding');document.body.classList.remove('cart-toast-open');},4000);}

function normalizeCheckoutArea(value){return String(value||'').normalize('NFKC').toLocaleLowerCase().replace(/[০-৯]/g,x=>String('০১২৩৪৫৬৭৮৯'.indexOf(x))).replace(/(জেলা|উপজেলা|থানা|district|upazila|upzilla|thana|zila)/g,' ').replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();}
function normalizeCheckoutRoman(value){return normalizeCheckoutArea(value).replace(/ae|aa/g,'a').replace(/ee|ii/g,'i').replace(/oo|ou/g,'u').replace(/bh/g,'b').replace(/ph/g,'f').replace(/chh?/g,'c').replace(/sh/g,'s').replace(/zh|z/g,'j').replace(/kh/g,'k').replace(/gh/g,'g').replace(/th/g,'t').replace(/dh/g,'d').replace(/[ckq]/g,'k').replace(/[vw]/g,'b').replace(/e/g,'a');}
function checkoutAreaDistance(a,b){const x=Array.from(a),y=Array.from(b);if(Math.abs(x.length-y.length)>2)return 99;let row=Array.from({length:y.length+1},(_,i)=>i);for(let i=1;i<=x.length;i++){const next=[i];for(let j=1;j<=y.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(x[i-1]===y[j-1]?0:1));row=next;}return row[y.length];}
function checkoutAreaHas(text,alias){const t=' '+normalizeCheckoutRoman(text)+' ',a=normalizeCheckoutRoman(alias);if(!a)return false;if(t.includes(' '+a+' '))return true;const words=t.trim().split(' '),parts=a.split(' ');for(let i=0;i<=words.length-parts.length;i++){if(parts.every((p,j)=>{const w=words[i+j],limit=p.length>=9?2:p.length>=5?1:0;return w===p||checkoutAreaDistance(w,p)<=limit;}))return true;}const key=value=>normalizeCheckoutRoman(value).replace(/\s+/g,'').replace(/[iy]/g,'i').replace(/[ou]/g,'a').replace(/[zgj]/g,'j').replace(/[wb]/g,'b'),target=key(alias);for(let start=0;start<words.length;start++)for(let count=1;count<=3&&start+count<=words.length;count++){const candidate=key(words.slice(start,start+count).join(' ')),limit=target.length>=10?2:target.length>=5?1:0;if(candidate===target||limit>0&&Math.abs(candidate.length-target.length)<=limit&&checkoutAreaDistance(candidate,target)<=limit)return true;}return false;}
const CHECKOUT_SPELLING_ALIASES={
 'জীবননগর':['জীবন নগর','জিবন নগর','জিবননগর','jibon nogor','zibon nagar','jibon nagar','jibonnogor','jibannagar','zibonnagar','zibonnogor'],
 'মিরপুর':['mirpur','mir poor','meerpur','mirpur dhaka'],
 'মিরপুর ডিওএইচএস':['mirpur dohs','dohs mirpur','mirpur defence officers housing society'],
 'পল্লবী':['pallabi','pallaby'],
 'রূপনগর':['rupnagar','rup nagar'],
 'শাহ আলী':['shah ali','shahali'],
 'দারুস সালাম':['darus salam','darussalam'],
 'কাফরুল':['kafrul'],
 'বাড্ডা':['badda'],
 'গুলশান':['gulshan'],
 'ধানমন্ডি':['dhanmondi'],
 'মোহাম্মদপুর':['mohammadpur','mohammedpur'],
 'উত্তরা':['uttara'],
 'নিউ মার্কেট':['new market','newmarket'],
 'মহেশপুর':['maheshpur','moheshpur','mohesphur','mohespoor','mohespor','mohespur','mahespur','mahespoor'],
 'ঝিনাইদহ':['jhenaidah','jhenidah'],
 'চুয়াডাঙ্গা':['chuadanga','chuadanga'],
 'ঢাকা':['dhaka'],
 'শ্রীমঙ্গল':['sreemangal','shreemangal','srimangal','shrimangal','shrimongol','srimongol','shri mongol','sree mongol','shree mongol']
};
function checkoutAreaHasName(text,name){return checkoutAreaHas(text,name)||(CHECKOUT_SPELLING_ALIASES[name]||[]).some(alias=>checkoutAreaHas(text,alias));}
const CHECKOUT_ENGLISH_DISTRICT_ALIASES={
 'বাগেরহাট':['Bagerhat'],'বান্দরবান':['Bandarban'],'বরগুনা':['Barguna'],'বরিশাল':['Barishal','Barisal'],'ভোলা':['Bhola'],'বগুড়া':['Bogura','Bogra'],'ব্রাহ্মণবাড়িয়া':['Brahmanbaria'],'চাঁদপুর':['Chandpur'],'চট্টগ্রাম':['Chattogram','Chittagong'],'চুয়াডাঙ্গা':['Chuadanga'],'কক্সবাজার':['Coxs Bazar',"Cox's Bazar",'Cox Bazar'],'কুমিল্লা':['Cumilla','Comilla'],'ঢাকা':['Dhaka'],'দিনাজপুর':['Dinajpur'],'ফরিদপুর':['Faridpur'],'ফেনী':['Feni'],'গাইবান্ধা':['Gaibandha'],'গাজীপুর':['Gazipur'],'গোপালগঞ্জ':['Gopalganj'],'হবিগঞ্জ':['Habiganj'],'জামালপুর':['Jamalpur','Jamal Pur','Zamalpur','Zamal Pur'],'যশোর':['Jashore','Jessore'],'ঝালকাঠি':['Jhalokati','Jhalakathi'],'ঝিনাইদহ':['Jhenaidah','Jhenidah'],'জয়পুরহাট':['Joypurhat'],'খাগড়াছড়ি':['Khagrachhari','Khagrachari'],'খুলনা':['Khulna'],'কিশোরগঞ্জ':['Kishoreganj'],'কুড়িগ্রাম':['Kurigram'],'কুষ্টিয়া':['Kushtia'],'লক্ষ্মীপুর':['Lakshmipur'],'লালমনিরহাট':['Lalmonirhat'],'মাদারীপুর':['Madaripur'],'মাগুরা':['Magura'],'মানিকগঞ্জ':['Manikganj'],'মেহেরপুর':['Meherpur'],'মৌলভীবাজার':['Moulvibazar'],'মুন্সীগঞ্জ':['Munshiganj'],'ময়মনসিংহ':['Mymensingh'],'নওগাঁ':['Naogaon'],'নড়াইল':['Narail'],'নারায়ণগঞ্জ':['Narayanganj'],'নরসিংদী':['Narsingdi'],'নাটোর':['Natore'],'নেত্রকোণা':['Netrokona'],'নীলফামারী':['Nilphamari'],'নোয়াখালী':['Noakhali'],'পাবনা':['Pabna'],'পঞ্চগড়':['Panchagarh'],'পটুয়াখালী':['Patuakhali'],'পিরোজপুর':['Pirojpur'],'রাজবাড়ী':['Rajbari'],'রাজশাহী':['Rajshahi'],'রাঙ্গামাটি':['Rangamati'],'রংপুর':['Rangpur'],'সাতক্ষীরা':['Satkhira'],'শরীয়তপুর':['Shariatpur'],'শেরপুর':['Sherpur'],'সিরাজগঞ্জ':['Sirajganj'],'সুনামগঞ্জ':['Sunamganj'],'সিলেট':['Sylhet'],'টাঙ্গাইল':['Tangail'],'ঠাকুরগাঁও':['Thakurgaon']
};
function checkoutSuggestionMatchScore(query,name,extraNames=[]){
 const normalize=value=>normalizeCheckoutRoman(value).replace(/[iy]/g,'i').replace(/[ou]/g,'a').replace(/[zgj]/g,'j').replace(/[wb]/g,'b');
 const q=normalize(query),qWords=q.split(' ').filter(Boolean),names=[name,...(CHECKOUT_SPELLING_ALIASES[name]||[]),...(CHECKOUT_ENGLISH_DISTRICT_ALIASES[name]||[]),...extraNames];
 if(normalizeCheckoutArea(query).replace(/\s/g,'').length<3)return 0;
 let best=0;
 for(const value of names.filter(Boolean)){
  const n=normalize(value),nWords=n.split(' ').filter(Boolean);
  if(!n)continue;
  if(q===n){best=Math.max(best,100);continue;}
  if(qWords.length>1){
   if((' '+n+' ').includes(' '+q+' ')){best=Math.max(best,96);continue;}
   if(n.startsWith(q+' ')){best=Math.max(best,92);continue;}
   if(qWords.length===nWords.length&&qWords.every((word,i)=>word===nWords[i])){best=Math.max(best,96);continue;}
   if(qWords.length===nWords.length&&qWords.every((word,i)=>{const limit=word.length>=8&&nWords[i].length>=8?1:0;return word.length>=5&&Math.abs(word.length-nWords[i].length)<=limit&&checkoutAreaDistance(word,nWords[i])<=limit;})){best=Math.max(best,45);}
   continue;
  }
  for(const word of nWords){
   if(word===q){best=Math.max(best,100);continue;}
   if(q.length>=3&&word.startsWith(q)){best=Math.max(best,78);continue;}
   if(q.length>=6){const limit=q.length>=9&&word.length>=9?1:0;if(limit&&Math.abs(q.length-word.length)<=limit&&checkoutAreaDistance(q,word)<=limit)best=Math.max(best,40);}
  }
 }
 return best;
}
function checkoutSuggestionMatches(query,name,extraNames=[]){return checkoutSuggestionMatchScore(query,name,extraNames)>0;}

const CHECKOUT_DHAKA_THANAS=['মিরপুর','পল্লবী','রূপনগর','শাহ আলী','দারুস সালাম','কাফরুল','ভাষানটেক','ক্যান্টনমেন্ট','বাড্ডা','ভাটারা','গুলশান','বনানী','তেজগাঁও','শেরে বাংলা নগর','মোহাম্মদপুর','আদাবর','ধানমন্ডি','কলাবাগান','রমনা','শাহবাগ','পল্টন','মতিঝিল','শাহজাহানপুর','খিলগাঁও','রামপুরা','মুগদা','সবুজবাগ','যাত্রাবাড়ী','কদমতলী','ডেমরা','শ্যামপুর','সূত্রাপুর','ওয়ারী','গেন্ডারিয়া','বংশাল','লালবাগ','চকবাজার','হাজারীবাগ','কামরাঙ্গীরচর','নিউ মার্কেট','উত্তরা','দক্ষিণখান','উত্তরখান','খিলক্ষেত','তুরাগ','এয়ারপোর্ট','হাতিরঝিল'];
const CHECKOUT_EXPANDED_LOCALITIES=[
 ['পল্লবী','মিরপুর ডিওএইচএস',['mirpur dohs','dohs mirpur','mirpur defence officers housing society']],
 ['গুলশান','বারিধারা ডিপ্লোমেটিক জোন',['baridhara diplomatic zone']],
 ['বনানী','বনানী ডিওএইচএস',['banani dohs']],
 ['ক্যান্টনমেন্ট','মহাখালী ডিওএইচএস',['mohakhali dohs']],
 ['মিরপুর মডেল','মিরপুর ৩',['mirpur 3']],['মিরপুর মডেল','মিরপুর ৪',['mirpur 4']],['মিরপুর মডেল','মিরপুর ৫',['mirpur 5']],['মিরপুর মডেল','মিরপুর ৭',['mirpur 7']],['মিরপুর মডেল','মিরপুর ৮',['mirpur 8']],['মিরপুর মডেল','মিরপুর ৯',['mirpur 9']],
 ['পল্লবী','মিরপুর ১৩',['mirpur 13']],['শাহ আলী','মিরপুর ১৫',['mirpur 15']],['শাহ আলী','মিরপুর ১৬',['mirpur 16']],
 ['পল্লবী','ইস্টার্ন হাউজিং',['eastern housing']],['পল্লবী','আলুব্দী',['alubdi']],
 ['রূপনগর','দুয়ারীপাড়া',['duaripara','duari para']],['রূপনগর','রূপনগর আবাসিক এলাকা',['rupnagar residential area']],
 ['কাফরুল','মনিপুর',['monipur']],['কাফরুল','বাউনিয়াবাদ',['bauniabad']],['কাফরুল','পূরবী',['purabi']],
 ['শাহ আলী','শাহ আলীবাগ',['shah alibagh','shah ali bag']],['দারুস সালাম','মিরপুর বাংলা কলেজ',['mirpur bangla college']],
 ['শেরে বাংলা নগর','জাতীয় সংসদ ভবন এলাকা',['jatiya sangsad bhaban','national parliament']],['শেরে বাংলা নগর','চন্দ্রিমা উদ্যান',['chandrima uddan']],
 ['তেজগাঁও','সাতরাস্তা',['satrasta','saat rasta']],['তেজগাঁও','নাবিস্কো',['nabisco']],['তেজগাঁও','বিজয় সরণি',['bijoy sarani','bijoy soroni']],
 ['গুলশান','কালাচাঁদপুর',['kalachandpur','kala chandpur']],['গুলশান','নর্দ্দা',['nadda','norda']],['গুলশান','জগন্নাথপুর',['jagannathpur']],
 ['বাড্ডা','প্রগতি সরণি',['pragati sarani','progoti shoroni']],['বাড্ডা','উলন',['ulon']],['বাড্ডা','হাজীপাড়া',['hazipara','hajipara']],
 ['ভাটারা','ছোলমাইদ',['cholmaida','cholmaid']],['ভাটারা','নয়ানগর',['noyanagar','nayanagar']],
 ['রামপুরা','পূর্ব রামপুরা',['east rampura']],['রামপুরা','হাজীপাড়া',['hazipara','hajipara']],
 ['মোহাম্মদপুর','বাবর রোড',['babar road']],['মোহাম্মদপুর','শেখেরটেক',['shekhertek','shekher tek']],['মোহাম্মদপুর','চাঁদ উদ্যান',['chand uddan']],
 ['আদাবর','মোহাম্মদী হাউজিং',['mohammadi housing']],
 ['উত্তরা মডেল','উত্তরা সেক্টর ২',['uttara sector 2','uttara 2']],['উত্তরা মডেল','উত্তরা সেক্টর ৩',['uttara sector 3','uttara 3']],['উত্তরা মডেল','উত্তরা সেক্টর ৫',['uttara sector 5','uttara 5']],['উত্তরা মডেল','উত্তরা সেক্টর ৬',['uttara sector 6','uttara 6']],['উত্তরা মডেল','উত্তরা সেক্টর ৮',['uttara sector 8','uttara 8']],['উত্তরা মডেল','উত্তরা সেক্টর ৯',['uttara sector 9','uttara 9']],['উত্তরা মডেল','উত্তরা সেক্টর ১৯',['uttara sector 19','uttara 19']],['উত্তরা মডেল','উত্তরা সেক্টর ২০',['uttara sector 20','uttara 20']],
 ['উত্তরা মডেল','রাজলক্ষ্মী',['rajslakkhi','raja lakshmi']],['উত্তরা মডেল','হাউজ বিল্ডিং',['house building']],['উত্তরা মডেল','মাইলস্টোন কলেজ এলাকা',['milestone college']],
 ['দক্ষিণখান','আশকোনা হজ ক্যাম্প',['ashkona hajj camp']],['দক্ষিণখান','গাওয়াইর',['gawair']],['দক্ষিণখান','ফায়দাবাদ',['faydabad','faidabad']],
 ['উত্তরখান','মৈনারটেক',['moinartek','moinar tek']],['খিলক্ষেত','লে মেরিডিয়ান এলাকা',['le meridien']],
 ['ক্যান্টনমেন্ট','জিয়া কলোনি',['zia colony']],['ক্যান্টনমেন্ট','মাটিকাটা ইসিবি',['matikata ecb']],
 ['খিলগাঁও','দক্ষিণ বনশ্রী',['south bansree','dakshin bansree']],['সবুজবাগ','কদমতলা',['kadamtala']],['সবুজবাগ','মাদারটেক',['madartek']],['সবুজবাগ','দাসেরকান্দি',['daser kandi']],
 ['যাত্রাবাড়ী','ধলপুর',['dhalpur']],['যাত্রাবাড়ী','কাজলা',['kajla']],['যাত্রাবাড়ী','দনিয়া',['donia']],
 ['কদমতলী','মুরাদপুর',['muradpur']],['ডেমরা','কোনাপাড়া',['konapara','kona para']],['ডেমরা','আমুলিয়া মডেল টাউন',['amulia model town']],
 ['শ্যামপুর','ধোলাইপাড়',['dholaipar','dholai para']],['সূত্রাপুর','ফরাশগঞ্জ',['farashganj']],
 ['লালবাগ','বকশীবাজার',['bakshibazar']],['চকবাজার','ইমামগঞ্জ',['imamganj']],['চকবাজার','মৌলভীবাজার',['moulvibazar']],
 ['বংশাল','ইংলিশ রোড',['english road']],['মতিঝিল','কমলাপুর',['kamalapur']],['শাহবাগ','কাটাবন',['katabon']]
];
const CHECKOUT_DHAKA_LOCALITIES=[...CHECKOUT_EXPANDED_LOCALITIES,
 ['ওয়ারী','টিকাটুলি',['tikatuli','tikatuly','tikatuIi']],
 ['ওয়ারী','ওয়ারী',['wari','wary']],
 ['ওয়ারী','র‍্যাঙ্কিন স্ট্রিট',['rankin street','rankin st']],
  ['সূত্রাপুর','নারিন্দা',['narinda','narinda road']],
 ['সূত্রাপুর','লক্ষ্মীবাজার',['laxmibazar','laxmi bazar','luxmibazar']],
  ['সূত্রাপুর','ধোলাইখাল',['dholaikhal','dholaikhaal']],
 ['গেন্ডারিয়া','গেন্ডারিয়া',['gendaria','gandaria']],
 ['সূত্রাপুর','সদরঘাট',['sadarghat','sadar ghat']],
 ['সূত্রাপুর','ইসলামপুর',['islampur','islam pur']],
 ['সূত্রাপুর','পাটুয়াটুলী',['patuatuli','patuatولي']],
 ['কোতোয়ালি','বাংলাবাজার',['banglabazar','bangla bazar']],
 ['কোতোয়ালি','বাবুবাজার',['babubazar','babu bazar']],
 ['কোতোয়ালি','আর্মানিটোলা',['armanitola','arman itola']],
 ['বংশাল','বংশাল',['bangshal','banshal']],
 ['বংশাল','নবাবপুর',['nawabpur','nawab pur']],
 ['বংশাল','বেগমবাজার',['begumbazar','begum bazar']],
 ['চকবাজার','চকবাজার',['chawkbazar','chowkbazar','chawk bazar']],
 ['চকবাজার','শাঁখারীবাজার',['shankharibazar','shakhari bazar']],
 ['চকবাজার','তাঁতীবাজার',['tantibazar','tanti bazar']],
 ['লালবাগ','লালবাগ',['lalbagh','lalbag']],
 ['লালবাগ','আজিমপুর',['azimpur','azimpore']],
 ['লালবাগ','পলাশী',['palashi','palasi']],
 ['হাজারীবাগ','হাজারীবাগ',['hazaribagh','hazaribag']],
 ['কামরাঙ্গীরচর','কামরাঙ্গীরচর',['kamrangirchar','kamrangir chor']],
 ['মতিঝিল','মতিঝিল',['motijheel','motijhil']],
 ['মতিঝিল','দিলকুশা',['dilkusha','dilkusha']],
 ['মতিঝিল','ফকিরাপুল',['fakirapool','fakirapul']],
 ['মতিঝিল','আরামবাগ',['arambagh','aram bag']],
 ['মতিঝিল','শাপলা চত্বর',['shapla chattar','shapla chottor']],
 ['পল্টন','পল্টন',['paltan']],
 ['পল্টন','গুলিস্তান',['gulistan']],
 ['পল্টন','কাকরাইল',['kakrail','kakra il']],
 ['পল্টন','সেগুনবাগিচা',['segunbagicha','segun bagicha']],
 ['রমনা','রমনা',['ramna']],
 ['রমনা','শাহবাগ',['shahbag','shahbagh']],
 ['রমনা','বাংলামোটর',['banglamotor','bangla motor']],
 ['রমনা','পরীবাগ',['paribagh','pari bagh']],
 ['রমনা','মগবাজার',['moghbazar','mogbazar']],
 ['রমনা','ইস্কাটন',['eskaton','iskaton']],
 ['শাহজাহানপুর','শান্তিনগর',['shantinagar','shanti nagar']],
 ['শাহজাহানপুর','মালিবাগ',['malibagh','malibag']],
 ['শাহজাহানপুর','রাজারবাগ',['rajarbagh','rajarbag']],
 ['ধানমন্ডি','ধানমন্ডি',['dhanmondi']],
 ['ধানমন্ডি','জিগাতলা',['jigatola','zigatola']],
 ['ধানমন্ডি','কলাবাগান',['kalabagan','kalabagh']],
 ['ধানমন্ডি','হাতিরপুল',['hatirpool','hatir pul']],
 ['ধানমন্ডি','এলিফ্যান্ট রোড',['elephant road']],
 ['নিউ মার্কেট','নিউ মার্কেট',['new market','newmarket']],
 ['নিউ মার্কেট','নীলক্ষেত',['nilkhet','nil khet']],
 ['নিউ মার্কেট','কাঁটাবন',['katabon','kata bon']],
 ['নিউ মার্কেট','সায়েন্স ল্যাব',['science lab','sciencelab']],
 ['মোহাম্মদপুর','আসাদ গেট',['asad gate','asadgate']],
 ['মোহাম্মদপুর','টাউন হল',['town hall','townhall']],
 ['মোহাম্মদপুর','কৃষি মার্কেট',['krishi market','krishi bazar']],
 ['মোহাম্মদপুর','জেনেভা ক্যাম্প',['geneva camp']],
 ['মোহাম্মদপুর','লালমাটিয়া',['lalmatia']],
 ['মোহাম্মদপুর','রায়েরবাজার',['rayerbazar','rayer bazar']],
 ['আদাবর','শ্যামলী',['shyamoli']],
 ['আদাবর','আদাবর',['adabor','adabar']],
 ['আদাবর','বসিলা',['bosila','basila']],
 ['মিরপুর মডেল','মিরপুর ১',['mirpur 1','mirpur one']],
 ['মিরপুর মডেল','মিরপুর ২',['mirpur 2','mirpur two']],
 ['মিরপুর মডেল','মিরপুর ১০',['mirpur 10','mirpur ten']],
 ['পল্লবী','মিরপুর ১১',['mirpur 11','mirpur eleven']],
 ['পল্লবী','মিরপুর ১২',['mirpur 12','mirpur twelve']],
 ['পল্লবী','পল্লবী',['pallabi','pallaby']],
 ['কাফরুল','কাজীপাড়া',['kazipara','kazi para']],
 ['কাফরুল','শেওড়াপাড়া',['shewrapara','sheorapara']],
 ['কাফরুল','ইব্রাহিমপুর',['ibrahimpur']],
 ['শাহ আলী','রূপনগর',['rupnagar','rup nagar']],
 ['দারুস সালাম','গাবতলী',['gabtoli','gabtoli']],
 ['তেজগাঁও','ফার্মগেট',['farmgate','farm gate']],
 ['তেজগাঁও','কারওয়ান বাজার',['karwan bazar','karwanbazar']],
 ['তেজগাঁও','নাখালপাড়া',['nakhalpara']],
 ['তেজগাঁও','তেজতুরী বাজার',['tejturibazar','tejturi bazar']],
 ['বনানী','বনানী',['banani']],
 ['বনানী','মহাখালী',['mohakhali','mohakhali']],
 ['গুলশান','গুলশান',['gulshan']],
 ['গুলশান','নিকেতন',['niketan']],
 ['গুলশান','বারিধারা',['baridhara']],
 ['গুলশান','শাহজাদপুর',['shahjadpur','shahzadpur']],
 ['বাড্ডা','বাড্ডা',['badda']],
 ['বাড্ডা','নতুন বাজার',['natun bazar','notun bazar']],
 ['বাড্ডা','আফতাবনগর',['aftabnagar','aftab nagar']],
 ['রামপুরা','রামপুরা',['rampura']],
 ['রামপুরা','বনশ্রী',['bansree','bashree']],
 ['খিলক্ষেত','খিলক্ষেত',['khilkhet']],
 ['খিলক্ষেত','কুড়িল',['kuril']],
 ['খিলক্ষেত','নিকুঞ্জ',['nikunja','nikunjo']],
 ['উত্তরা মডেল','উত্তরা',['uttara']],
 ['উত্তরা মডেল','আজমপুর',['azampur']],
 ['উত্তরা মডেল','আব্দুল্লাহপুর',['abdullahpur']],
 ['উত্তরা মডেল','দিয়াবাড়ি',['diabari']],
 ['দক্ষিণখান','দক্ষিণখান',['dakshinkhan','dakkhin khan']],
 ['উত্তরখান','উত্তরখান',['uttarkhan']],
 ['যাত্রাবাড়ী','যাত্রাবাড়ী',['jatrabari','jatrabari']],
 ['যাত্রাবাড়ী','সায়েদাবাদ',['sayedabad','saydabad']],
 ['যাত্রাবাড়ী','শনির আখড়া',['shonir akhra','shanir akhra']],
 ['খিলগাঁও','খিলগাঁও',['khilgaon']],
 ['খিলগাঁও','গোড়ান',['goran']],
 ['সবুজবাগ','বাসাবো',['basabo','bashabo']],
 ['সবুজবাগ','মুগদা',['mugda']],
 ['সবুজবাগ','মান্ডা',['manda']],
 ['সবুজবাগ','মানিকনগর',['maniknagar','manik nagar']],
 ['খিলগাঁও','তালতলা',['taltola']],
 ['খিলগাঁও','মেরাদিয়া',['meradia']],
 ['খিলগাঁও','নন্দীপাড়া',['nandipara']],
 ['শাহজাহানপুর','শান্তিনগর',['shantinagar','shanti nagar']],
 ['শাহজাহানপুর','মালিবাগ',['malibagh','malibag']],
 ['শাহজাহানপুর','রাজারবাগ',['rajarbagh','rajarbag']],
 ['শাহবাগ','ঢাকা বিশ্ববিদ্যালয়',['dhaka university','du']],
 ['শাহবাগ','টিএসসি',['tsc']],
 ['শাহবাগ','বাংলা একাডেমি',['bangla academy']],
 ['শাহবাগ','রমনা পার্ক',['ramna park']],
 ['রমনা','বেইলি রোড',['bailey road','baily road']],
 ['রমনা','সিদ্ধেশ্বরী',['siddheswari','siddeshwari']],
 ['রমনা','কাকরাইল',['kakrail']],
 ['রমনা','মগবাজার',['moghbazar','mogbazar']],
 ['রমনা','ইস্কাটন',['eskaton','iskaton']],
 ['ধানমন্ডি','সাতমসজিদ রোড',['satmasjid road','sat masjid road']],
 ['ধানমন্ডি','রোড ২৭',['road 27','dhanmondi 27']],
 ['ধানমন্ডি','রোড ৩২',['road 32','dhanmondi 32']],
 ['ধানমন্ডি','জিগাতলা',['jigatola','zigatola']],
 ['ধানমন্ডি','রায়েরবাজার',['rayerbazar','rayer bazar']],
 ['কলাবাগান','পান্থপথ',['panthapath','panth path']],
 ['কলাবাগান','গ্রিন রোড',['green road']],
 ['কলাবাগান','হাতিরপুল',['hatirpool','hatir pul']],
 ['নিউ মার্কেট','এলিফ্যান্ট রোড',['elephant road']],
 ['নিউ মার্কেট','কাঁটাবন',['katabon','kata bon']],
 ['নিউ মার্কেট','সায়েন্স ল্যাব',['science lab','sciencelab']],
 ['নিউ মার্কেট','নীলক্ষেত',['nilkhet','nil khet']],
 ['মোহাম্মদপুর','তাজমহল রোড',['tajmahal road','taj mahal road']],
 ['মোহাম্মদপুর','নূরজাহান রোড',['nurjahan road','noorjahan road']],
 ['মোহাম্মদপুর','লালমাটিয়া',['lalmatia']],
 ['মোহাম্মদপুর','জাপান গার্ডেন সিটি',['japan garden city']],
 ['মোহাম্মদপুর','বসিলা',['bosila','basila']],
 ['মোহাম্মদপুর','রিং রোড',['ring road']],
 ['আদাবর','শ্যামলী',['shyamoli']],
 ['আদাবর','বসিলা গার্ডেন সিটি',['bosila garden city']],
 ['আদাবর','বাইতুল আমান হাউজিং',['baitul aman housing']],
 ['শেরে বাংলা নগর','আগারগাঁও',['agargaon']],
 ['শেরে বাংলা নগর','বিজয় সরণি',['bijoy sarani','bijoy saroni']],
 ['শেরে বাংলা নগর','মনিপুরীপাড়া',['monipuripara','monipuri para']],
 ['শেরে বাংলা নগর','তালতলা',['taltola']],
 ['তেজগাঁও','তেজকুনিপাড়া',['tejkunipara','tej kunipara']],
 ['তেজগাঁও','নাখালপাড়া',['nakhalpara']],
 ['তেজগাঁও','ফার্মগেট',['farmgate','farm gate']],
 ['তেজগাঁও','কারওয়ান বাজার',['karwan bazar','karwanbazar']],
 ['তেজগাঁও শিল্পাঞ্চল','তেজগাঁও শিল্প এলাকা',['tejgaon industrial area','tejgaon i a']],
 ['বনানী','চেয়ারম্যান বাড়ি',['chairman bari','chairman house']],
 ['বনানী','কাকলী',['kakoli']],
 ['বনানী','মহাখালী',['mohakhali']],
 ['গুলশান','গুলশান ১',['gulshan 1']],
 ['গুলশান','গুলশান ২',['gulshan 2']],
 ['গুলশান','নিকেতন',['niketan']],
 ['গুলশান','বারিধারা',['baridhara']],
 ['বাড্ডা','মেরুল বাড্ডা',['merul badda']],
 ['বাড্ডা','মধ্য বাড্ডা',['middle badda']],
 ['বাড্ডা','উত্তর বাড্ডা',['north badda']],
 ['বাড্ডা','সাতারকুল',['satar kul','satarkul']],
 ['বাড্ডা','আফতাবনগর',['aftabnagar','aftab nagar']],
 ['ভাটারা','বসুন্ধরা আবাসিক এলাকা',['bashundhara residential area','bashundhara r a']],
 ['ভাটারা','জোয়ার সাহারা',['joar sahara','joarshahara']],
 ['ভাটারা','নদ্দা',['nadda']],
 ['ভাটারা','বারিধারা ডিওএইচএস',['baridhara dohs']],
 ['খিলক্ষেত','কুড়িল বিশ্বরোড',['kuril biswaroad','kuril bishwaroad']],
 ['খিলক্ষেত','নিকুঞ্জ ১',['nikunja 1']],
 ['খিলক্ষেত','নিকুঞ্জ ২',['nikunja 2']],
 ['খিলক্ষেত','লেক সিটি কনকর্ড',['lake city concord']],
 ['উত্তরা মডেল','উত্তরা সেক্টর ১',['uttara sector 1','uttara 1']],
 ['উত্তরা মডেল','উত্তরা সেক্টর ৪',['uttara sector 4','uttara 4']],
 ['উত্তরা মডেল','উত্তরা সেক্টর ৭',['uttara sector 7','uttara 7']],
 ['উত্তরা মডেল','উত্তরা সেক্টর ১০',['uttara sector 10','uttara 10']],
 ['উত্তরা মডেল','উত্তরা সেক্টর ১১',['uttara sector 11','uttara 11']],
 ['উত্তরা মডেল','উত্তরা সেক্টর ১২',['uttara sector 12','uttara 12']],
 ['উত্তরা মডেল','উত্তরা সেক্টর ১৩',['uttara sector 13','uttara 13']],
 ['উত্তরা মডেল','উত্তরা সেক্টর ১৪',['uttara sector 14','uttara 14']],
 ['উত্তরা মডেল','উত্তরা সেক্টর ১৫',['uttara sector 15','uttara 15']],
 ['উত্তরা মডেল','উত্তরা সেক্টর ১৬',['uttara sector 16','uttara 16']],
 ['উত্তরা মডেল','উত্তরা সেক্টর ১৭',['uttara sector 17','uttara 17']],
 ['উত্তরা মডেল','উত্তরা সেক্টর ১৮',['uttara sector 18','uttara 18']],
 ['পল্লবী','কালশী',['kalshi']],
 ['পল্লবী','দুয়ারীপাড়া',['duaripara','duari para']],
 ['পল্লবী','মিরপুর ১১',['mirpur 11']],
 ['পল্লবী','মিরপুর ১২',['mirpur 12']],
 ['কাফরুল','সেনপাড়া পর্বতা',['senpara parbata','senpara']],
 ['কাফরুল','ইব্রাহিমপুর',['ibrahimpur']],
 ['কাফরুল','মিরপুর ১৪',['mirpur 14']],
 ['মিরপুর মডেল','মিরপুর ৬',['mirpur 6']],
 ['মিরপুর মডেল','মিরপুর ১০',['mirpur 10']],
 ['মিরপুর মডেল','পীরেরবাগ',['pirerbag','pirer bag']],
 ['দারুস সালাম','টেকনিক্যাল',['technical']],
 ['দারুস সালাম','গাবতলী',['gabtoli']],
 ['রূপনগর','রূপনগর আবাসিক এলাকা',['rupnagar residential area']],
 ['দক্ষিণখান','আশকোনা',['ashkona']],
 ['দক্ষিণখান','কাওলা',['kawla']],
 ['দক্ষিণখান','মৈনারটেক',['moinartek','moinar tek']],
 ['উত্তরখান','কাচকুড়া',['kachkura','kach kura']],
 ['উত্তরখান','মাজার রোড',['mazar road']],
 ['তুরাগ','দিয়াবাড়ি',['diabari']],
 ['তুরাগ','আব্দুল্লাহপুর',['abdullahpur']],
 ['এয়ারপোর্ট','বিমানবন্দর এলাকা',['airport area','hazrat shahjalal airport']],
 ['এয়ারপোর্ট','কাওলা',['kawla']],
 ['ক্যান্টনমেন্ট','ইসিবি চত্বর',['ecb chattar','ecb']],
 ['ক্যান্টনমেন্ট','মাটিকাটা',['matikata']],
 ['ক্যান্টনমেন্ট','ঢাকা ক্যান্টনমেন্ট',['dhaka cantonment']],
 ['কদমতলী','জুরাইন',['jurain']],
 ['কদমতলী','মাতুয়াইল',['matuail']],
 ['কদমতলী','দনিয়া',['donia']],
 ['কদমতলী','রায়েরবাগ',['rayerbag','rayer bag']],
 ['ডেমরা','সারুলিয়া',['sarulia']],
 ['ডেমরা','আমুলিয়া',['amulia']],
 ['ডেমরা','স্টাফ কোয়ার্টার',['staff quarter','staff quarters']],
 ['শ্যামপুর','শ্যামপুর শিল্প এলাকা',['shyampur industrial area']],
 ['শ্যামপুর','পোস্তগোলা',['postogola','postogola bridge']],
 ['কামরাঙ্গীরচর','রসুলপুর',['rasulpur']],
 ['হাজারীবাগ','রায়েরবাজার',['rayerbazar','rayer bazar']],
 ['সূত্রাপুর','গোপীবাগ',['gopibagh','gopi bagh']],
 ['সূত্রাপুর','ফরাশগঞ্জ',['farashganj']],
 ['ওয়ারী','গোপীবাগ',['gopibagh','gopi bagh']],
 ['ওয়ারী','ধোলাইখাল',['dholaikhal','dholaikhaal']],
 ['বংশাল','নবাবপুর রোড',['nawabpur road']],
 ['চকবাজার','বকশীবাজার',['bakshibazar','bakshi bazar']],
 ['চকবাজার','চুড়িহাট্টা',['churihatta']],
 ['পল্টন','পুরানা পল্টন',['purana paltan']],
 ['পল্টন','প্রেস ক্লাব',['press club']],
 ['পল্টন','বায়তুল মোকাররম',['baitul mukarram','baitul mukarram']],
 ['মতিঝিল','ফকিরাপুল',['fakirapool','fakirapul']],
 ['মতিঝিল','আরামবাগ',['arambagh','aram bag']],
 ['যাত্রাবাড়ী','কাজলা',['kajla']],
 ['যাত্রাবাড়ী','ধলপুর',['dhalpur']],
 ['যাত্রাবাড়ী','সায়েদাবাদ',['sayedabad']],
 ['সবুজবাগ','বাসাবো',['basabo','bashabo']],
 ['সবুজবাগ','মুগদা',['mugda']],
 ['রামপুরা','পূর্ব রামপুরা',['east rampura']],
 ['রামপুরা','হাতিরঝিল সংলগ্ন এলাকা',[]],
 ['বাড্ডা','মেরুল বাড্ডা',['merul badda']],
 ['দারুস সালাম','গাবতলী',['gabtoli','gabtoli bus terminal']],
 ['আদাবর','শ্যামলী',['shyamoli']],
 ['কাফরুল','কাজীপাড়া',['kazipara','kazi para','kajipara']],
 ['কাফরুল','শেওড়াপাড়া',['shewrapara','sheorapara','sheora para']],
 ['কাফরুল','কচুক্ষেত',['kochukhet','kachukhet']],
 ['কাফরুল','ইব্রাহিমপুর',['ibrahimpur']],
 ['শেরে বাংলা নগর','আগারগাঁও',['agargaon','agar gaon']],
 ['ক্যান্টনমেন্ট','সেনানিবাস এলাকা',['senanibas','cantonment area','dhaka cantonment']],
 ['বনানী','মহাখালী',['mohakhali']],
 ['গুলশান','বারিধারা',['baridhara']],
 ['গুলশান','নিকেতন',['niketan']],
 ['ভাটারা','বসুন্ধরা আবাসিক এলাকা',['bashundhara','bashundhara residential area','bashundhara r a']],
 ['বাড্ডা','আফতাবনগর',['aftabnagar','aftab nagar']],
 ['বাড্ডা','সাঁতারকুল',['satarkul','satar kul']],
 ['ভাটারা','বেরাইদ',['beraid','bera id']],
 ['রামপুরা','বনশ্রী',['bansree','bashree','bonoshree']],
 ['তুরাগ','বাউনিয়া',['baunia','baunia bazar']],
 ['উত্তরা মডেল','আব্দুল্লাহপুর',['abdullahpur','abdullah pur']],
 ['হাতিরঝিল','হাতিরঝিল',['hatirjheel','hatir jheel']],
 ['কোতোয়ালি','কাপ্তান বাজার কমপ্লেক্স',["kaptan bazar","kaptan bazaar","kaptan bazar complex","কাপ্তান বাজার","কাপ্তান বাজার কমপ্লেক্স"]],
 ['তেজগাঁও','কারওয়ান বাজার',["karwan bazar","kawran bazar","karwan bazaar","কারওয়ান বাজার","কাওরান বাজার"]],
 ['পল্টন','গুলিস্তান শপিং কমপ্লেক্স',["gulistan shopping complex","গুলিস্তান মার্কেট","গুলিস্তান"]],
 ['পল্টন','বঙ্গবাজার',["bangabazar","bangabazar market","বঙ্গবাজার"]],
 ['কোতোয়ালি','বাংলাবাজার বই মার্কেট',["banglabazar book market","bangla bazar","বাংলাবাজার"]],
 ['কোতোয়ালি','বাবুবাজার চালের আড়ত',["babubazar rice market","babu bazar","বাবুবাজার"]],
 ['কোতোয়ালি','বাদামতলী ফলের বাজার',["badamtoli fruit market","badamtoli bazar","বাদামতলী"]],
 ['কোতোয়ালি','ইসলামপুর কাপড়ের বাজার',["islampur cloth market","islampur bazar","ইসলামপুর"]],
 ['কোতোয়ালি','মৌলভীবাজার পাইকারি মার্কেট',["moulvibazar wholesale market","moulvi bazar","মৌলভীবাজার"]],
 ['কোতোয়ালি','মিটফোর্ড ওষুধের বাজার',["mitford medicine market","mitford market","মিটফোর্ড"]],
 ['কোতোয়ালি','শাঁখারী বাজার',["shankhari bazar","shakhari bazar","শাঁখারীবাজার"]],
 ['কোতোয়ালি','তাঁতীবাজার',["tanti bazar","tantibazar","তাঁতী বাজার"]],
 ['কোতোয়ালি','পাটুয়াটুলী',["patuatuli market","পাটুয়াটুলী"]],
 ['কোতোয়ালি','শ্যামবাজার',["shyambazar","shyam bazar","শ্যামবাজার"]],
 ['কোতোয়ালি','সোয়ারীঘাট মাছের আড়ত',["swarighat fish market","swarighat","সোয়ারীঘাট"]],
 ['লালবাগ','পোস্তা কাঁচা চামড়ার বাজার',["posta rawhide market","posta bazar","পোস্তা"]],
 ['বংশাল','নবাবপুর রোড মার্কেট',["nawabpur road market","nawabpur market","নবাবপুর"]],
 ['বংশাল','বংশাল সাইকেল মার্কেট',["bangshal bicycle market","bangshal market","বংশাল"]],
 ['বংশাল','বেগমবাজার পুরোনো কাপড়ের বাজার',["begum bazar old clothes market","begumbazar","বেগমবাজার"]],
 ['চকবাজার','চকবাজার',["chawkbazar market","chowkbazar","chawk bazar","চকবাজার"]],
 ['চকবাজার','গাউছিয়া মার্কেট',["gausia market","gausia","গাউছিয়া"]],
 ['নিউ মার্কেট','নিউ মার্কেট',["new market dhaka","newmarket","নিউ মার্কেট"]],
 ['নিউ মার্কেট','নিউ সুপার মার্কেট',["new super market","new super market dhaka","নিউ সুপার মার্কেট"]],
 ['নিউ মার্কেট','চাঁদনী চক মার্কেট',["chandni chowk market","chandni chok","চাঁদনী চক"]],
 ['নিউ মার্কেট','চন্দ্রিমা সুপার মার্কেট',["chandrima super market","চন্দ্রিমা মার্কেট"]],
 ['নিউ মার্কেট','নূরজাহান মার্কেট',["nurjahan market","নূরজাহান"]],
 ['নিউ মার্কেট','বদরুদ্দোজা সুপার মার্কেট',["badruddoza super market","badruddoza market","বদরুদ্দোজা"]],
 ['নিউ মার্কেট','এলিফ্যান্ট রোড জুতার মার্কেট',["elephant road shoe market","elephant road market","এলিফ্যান্ট রোড"]],
 ['ধানমন্ডি','ধানমন্ডি হকার্স মার্কেট',["dhanmondi hawkers market","ধানমন্ডি হকার্স"]],
 ['ধানমন্ডি','মেট্রো শপিং মল',["metro shopping mall","মেট্রো শপিং মল"]],
 ['ধানমন্ডি','সীমান্ত সম্ভার',["shimanto shambhar","shimanto sambhar","সীমান্ত সম্ভার"]],
 ['ধানমন্ডি','সীমান্ত স্কয়ার',["shimanto square","সীমান্ত স্কয়ার"]],
 ['ধানমন্ডি','রাপা প্লাজা',["rapa plaza","রাপা প্লাজা"]],
 ['ধানমন্ডি','অর্চার্ড পয়েন্ট',["orchard point","অর্চার্ড পয়েন্ট"]],
 ['ধানমন্ডি','হ্যাপি আর্কেড',["happy arcade","হ্যাপি আর্কেড"]],
 ['ধানমন্ডি','কম্পিউটার সিটি সেন্টার',["computer city center","computer city centre","কম্পিউটার সিটি সেন্টার"]],
 ['ধানমন্ডি','সুভাস্তু আর্কেড',["suvastu arcade","subastu arcade","সুভাস্তু আর্কেড"]],
 ['ধানমন্ডি','মতলিব প্লাজা',["motalib plaza","motolib plaza","মতলব প্লাজা"]],
 ['শাহবাগ','আজিজ সুপার মার্কেট',["aziz super market","aziz market","আজিজ সুপার মার্কেট"]],
 ['শাহবাগ','শাহবাগ ফুলের বাজার',["shahbagh flower market","শাহবাগ ফুলের বাজার"]],
 ['তেজগাঁও','আইডিবি ভবন বিসিএস কম্পিউটার সিটি',["idb bhaban market","bcs computer city","idb computer city","আইডিবি ভবন"]],
 ['তেজগাঁও','পান্থপথ ফার্নিচার মার্কেট',["panthapath furniture market","পান্থপথ ফার্নিচার"]],
 ['তেজগাঁও','বসুন্ধরা সিটি',["bashundhara city","বসুন্ধরা সিটি"]],
 ['গুলশান','পুলিশ প্লাজা কনকর্ড',["police plaza concord","police plaza","পুলিশ প্লাজা"]],
 ['গুলশান','গুলশান ১ ডিএনসিসি মার্কেট',["gulshan 1 dncc market","gulshan dncc market","গুলশান ডিএনসিসি মার্কেট"]],
 ['গুলশান','গুলশান ২ ডিএনসিসি মার্কেট',["gulshan 2 dncc market","গুলশান ২ ডিএনসিসি মার্কেট"]],
 ['গুলশান','পিংক সিটি শপিং সেন্টার',["pink city shopping center","pink city","পিংক সিটি"]],
 ['গুলশান','তাহের টাওয়ার',["taher tower","তাহের টাওয়ার"]],
 ['বনানী','বনানী সুপার মার্কেট',["banani super market","banani market","বনানী সুপার মার্কেট"]],
 ['বাড্ডা','বিসমিল্লাহ ফার্নিচার মার্কেট',["bismillah furniture market","বিসমিল্লাহ ফার্নিচার"]],
 ['বাড্ডা','নতুন বাজার মার্কেট',["notun bazar market","natun bazar market","নতুন বাজার"]],
 ['মহাখালী','মহাখালী ডিএনসিসি মার্কেট',["mohakhali dncc market","মহাখালী ডিএনসিসি মার্কেট"]],
 ['উত্তরা মডেল','রাজলক্ষ্মী কমপ্লেক্স',["rajlaxmi complex","rajslakkhi market","রাজলক্ষ্মী কমপ্লেক্স"]],
 ['উত্তরা মডেল','রাজউক উত্তরা কমার্শিয়াল কমপ্লেক্স',["rajuk uttara commercial complex","রাজউক উত্তরা কমার্শিয়াল কমপ্লেক্স"]],
 ['উত্তরা মডেল','মাসকট প্লাজা',["mascot plaza","মাসকট প্লাজা"]],
 ['উত্তরা মডেল','সেন্টারপয়েন্ট',["centrepoint uttara","centerpoint uttara","সেন্টারপয়েন্ট"]],
 ['উত্তরা মডেল','সৈয়দ গ্র্যান্ড সেন্টার',["syed grand center","সৈয়দ গ্র্যান্ড সেন্টার"]],
 ['মিরপুর মডেল','শাহ আলী প্লাজা',["shah ali plaza","শাহ আলী প্লাজা"]],
 ['মিরপুর মডেল','মিরপুর হোপ মার্কেট',["mirpur hope market","hope market mirpur","মিরপুর হোপ মার্কেট"]],
 ['মিরপুর মডেল','মিরপুর মুক্তিযোদ্ধা সুপার মার্কেট',["mirpur muktijoddha super market","মুক্তিযোদ্ধা সুপার মার্কেট"]],
 ['মিরপুর মডেল','মিরপুর স্টেডিয়াম ফার্নিচার মার্কেট',["mirpur stadium furniture market","মিরপুর স্টেডিয়াম মার্কেট"]],
 ['মিরপুর মডেল','মুক্ত বাংলা শপিং কমপ্লেক্স',["mukto bangla shopping complex","মুক্ত বাংলা শপিং কমপ্লেক্স"]],
 ['মিরপুর মডেল','গাবতলী পশুর হাট',["gabtoli cattle market","gabtoli hat","গাবতলী পশুর হাট"]],
 ['খিলগাঁও','খিলগাঁও রেলগেট ফার্নিচার মার্কেট',["khilgaon railgate furniture market","খিলগাঁও রেলগেট"]],
 ['খিলগাঁও','খিলগাঁও তালতলা মার্কেট',["khilgaon taltola market","taltola market","খিলগাঁও তালতলা"]],
 ['আদাবর','শ্যামলী স্কয়ার শপিং মল',["shyamoli square shopping mall","shyamoli square","শ্যামলী স্কয়ার"]],
 ['মতিঝিল','বায়তুল মোকাররম মার্কেট',["baitul mukarram market","বায়তুল মোকাররম মার্কেট"]],
 ['পল্টন','ফুলবাড়িয়া সুপার মার্কেট',["fulbaria super market","ফুলবাড়িয়া সুপার মার্কেট"]],
 ['পল্টন','পীর ইয়ামেনী মার্কেট',["pir yameni market","pir yemeni market","পীর ইয়ামেনী মার্কেট"]],
 ['পল্টন','সিদ্দিক বাজার',["siddique bazar","siddik bazar","সিদ্দিক বাজার"]],
 ['পল্টন','স্টেডিয়াম মার্কেট',["stadium market gulistan","স্টেডিয়াম মার্কেট"]],
 ['পল্টন','পলওয়েল সুপার মার্কেট',["polwel super market","polwel market","পলওয়েল সুপার মার্কেট"]],
 ['কোতোয়ালি','ধোলাইখাল',["dholaikhal market","ধোলাইখাল"]],
 ['কোতোয়ালি','আর্মানিটোলা মার্কেট',["armanitola market","আর্মানিটোলা"]],
 ['লালবাগ','বাদামতলী',["badamtoli","বাদামতলী বাজার"]],
 ['তেজগাঁও','তেজতুরী বাজার',["tejturi bazar","tejturi market","তেজতুরী বাজার"]],
 ['তেজগাঁও','আগারগাঁও ফুলের বাজার',["agargaon flower market","আগারগাঁও ফুলের বাজার"]],
 ['শাহবাগ','ঢাকা বিশ্ববিদ্যালয়',["university of dhaka","dhaka university","du","ঢাকা বিশ্ববিদ্যালয়"]],
 ['লালবাগ','বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়',["bangladesh university of engineering and technology","buet","বুয়েট"]],
 ['শাহবাগ','বাংলাদেশ মেডিকেল বিশ্ববিদ্যালয়',["bangladesh medical university","bsmmu","bangabandhu sheikh mujib medical university","বিএমইউ"]],
 ['শেরে বাংলা নগর','শেরেবাংলা কৃষি বিশ্ববিদ্যালয়',["sher e bangla agricultural university","sau dhaka","শেরেবাংলা কৃষি বিশ্ববিদ্যালয়"]],
 ['তেজগাঁও','বাংলাদেশ টেক্সটাইল বিশ্ববিদ্যালয়',["bangladesh university of textiles","butex","বুটেক্স"]],
 ['ক্যান্টনমেন্ট','বাংলাদেশ ইউনিভার্সিটি অব প্রফেশনালস',["bangladesh university of professionals","bup","বিইউপি"]],
 ['কোতোয়ালি','জগন্নাথ বিশ্ববিদ্যালয়',["jagannath university","jnu","জগন্নাথ বিশ্ববিদ্যালয়"]],
 ['ভাটারা','নর্থ সাউথ বিশ্ববিদ্যালয়',["north south university","nsu","নর্থ সাউথ ইউনিভার্সিটি"]],
 ['ভাটারা','ইন্ডিপেনডেন্ট ইউনিভার্সিটি বাংলাদেশ',["independent university bangladesh","iub","আইইউবি"]],
 ['বাড্ডা','ব্র্যাক বিশ্ববিদ্যালয়',["brac university","bracu","ব্র্যাক ইউনিভার্সিটি"]],
 ['বাড্ডা','ইস্ট ওয়েস্ট বিশ্ববিদ্যালয়',["east west university","ewu","ইস্ট ওয়েস্ট ইউনিভার্সিটি"]],
 ['তেজগাঁও','আহছানউল্লা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়',["ahsanullah university of science and technology","aust","আহছানউল্লা বিশ্ববিদ্যালয়"]],
 ['কলাবাগান','ইউনিভার্সিটি অব এশিয়া প্যাসিফিক',["university of asia pacific","uap","ইউএপি"]],
 ['খিলক্ষেত','আমেরিকান ইন্টারন্যাশনাল ইউনিভার্সিটি বাংলাদেশ',["american international university bangladesh","aiub","এআইইউবি"]],
 ['তেজগাঁও','সাউথইস্ট বিশ্ববিদ্যালয়',["southeast university","seu","সাউথইস্ট ইউনিভার্সিটি"]],
 ['ধানমন্ডি','ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি',["daffodil international university","diu","ড্যাফোডিল বিশ্ববিদ্যালয়"]],
 ['রমনা','স্টামফোর্ড বিশ্ববিদ্যালয় বাংলাদেশ',["stamford university bangladesh","stamford university","স্টামফোর্ড বিশ্ববিদ্যালয়"]],
 ['রূপনগর','বাংলাদেশ ইউনিভার্সিটি অব বিজনেস অ্যান্ড টেকনোলজি',["bangladesh university of business and technology","bubt","বিইউবিটি"]],
 ['উত্তরা মডেল','ওয়ার্ল্ড ইউনিভার্সিটি অব বাংলাদেশ',["world university of bangladesh","wub","ওয়ার্ল্ড ইউনিভার্সিটি"]],
 ['উত্তরা মডেল','শান্ত-মারিয়াম ইউনিভার্সিটি অব ক্রিয়েটিভ টেকনোলজি',["shanto mariam university","smuct","শান্ত মারিয়াম বিশ্ববিদ্যালয়"]],
 ['উত্তরা মডেল','উত্তরা বিশ্ববিদ্যালয়',["uttara university","উত্তরা ইউনিভার্সিটি"]],
 ['বাড্ডা','ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি',["united international university","uiu","ইউআইইউ"]],
 ['বনানী','ইউনিভার্সিটি অব সাউথ এশিয়া',["university of south asia","south asia university","ইউনিভার্সিটি অব সাউথ এশিয়া"]],
 ['বনানী','প্রেসিডেন্সি বিশ্ববিদ্যালয়',["presidency university","প্রেসিডেন্সি ইউনিভার্সিটি"]],
 ['ভাটারা','ইউনিভার্সিটি অব ইনফরমেশন টেকনোলজি অ্যান্ড সায়েন্সেস',["university of information technology and sciences","uits","ইউআইটিএস"]],
 ['বনানী','প্রাইমএশিয়া বিশ্ববিদ্যালয়',["primeasia university","prime asia university","প্রাইমএশিয়া"]],
 ['মোহাম্মদপুর','ইউনিভার্সিটি অব লিবারেল আর্টস বাংলাদেশ',["university of liberal arts bangladesh","ulab","ইউল্যাব"]],
 ['উত্তরা মডেল','অ্যাডভান্সড/আতীশ দীপঙ্কর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়',["atish dipankar university of science and technology","adust","আতীশ দীপঙ্কর বিশ্ববিদ্যালয়"]],
 ['খিলগাঁও','বাংলাদেশ ইসলামী বিশ্ববিদ্যালয়',["bangladesh islami university","biu","বাংলাদেশ ইসলামী বিশ্ববিদ্যালয়"]],
 ['আদাবর','এএসএ ইউনিভার্সিটি বাংলাদেশ',["asa university bangladesh","asaub","এএসএ ইউনিভার্সিটি"]],
 ['তুরাগ','বিজিএমইএ ইউনিভার্সিটি অব ফ্যাশন অ্যান্ড টেকনোলজি',["bgmea university of fashion and technology","buft","বিইউএফটি"]],
 ['তেজগাঁও','সোনারগাঁও বিশ্ববিদ্যালয়',["sonargaon university","su","সোনারগাঁও ইউনিভার্সিটি"]],
 ['ভাটারা','কানাডিয়ান ইউনিভার্সিটি অব বাংলাদেশ',["canadian university of bangladesh","cub","কানাডিয়ান ইউনিভার্সিটি"]],
 ['বনানী','ইউনিভার্সিটি অব স্কলার্স',["university of scholars","ius","ইউনিভার্সিটি অব স্কলার্স"]],
 ['খিলগাঁও','সেন্ট্রাল ইউনিভার্সিটি অব সায়েন্স অ্যান্ড টেকনোলজি',["central university of science and technology","cust","সেন্ট্রাল ইউনিভার্সিটি"]],
 ['উত্তরা মডেল','টেগোর ইউনিভার্সিটি অব ক্রিয়েটিভ আর্টস',["tagore university of creative arts","tuca","টেগোর ইউনিভার্সিটি"]],
 ['ধানমন্ডি','আনোয়ার খান মডার্ন ইউনিভার্সিটি',["anwer khan modern university","akmu","আনোয়ার খান মডার্ন ইউনিভার্সিটি"]],
 ['উত্তরা মডেল','জেডএনআরএফ ইউনিভার্সিটি অব ম্যানেজমেন্ট সায়েন্সেস',["znrf university of management sciences","zums","জেডএনআরএফ ইউনিভার্সিটি"]],
 ['উত্তরা মডেল','ইন্টারন্যাশনাল স্ট্যান্ডার্ড ইউনিভার্সিটি',["international standard university","isu","ইন্টারন্যাশনাল স্ট্যান্ডার্ড ইউনিভার্সিটি"]]
];
const CHECKOUT_DHAKA_SUBURBS=[
 ['ঢাকা','সাভার',['সাভার','savar','আশুলিয়া','আশুলিয়া','ashulia','ashulia bazar','বিরুলিয়া','বিরুলিয়া','birulia']],
 ['ঢাকা','কেরানীগঞ্জ',['কেরানীগঞ্জ','keraniganj','কেরানিগঞ্জ','জিঞ্জিরা','jinjira','জিঞ্জিরা','হাসনাবাদ','hasnabad','তেঘরিয়া','তেঘড়িয়া','tegharia','teghoria','ঝিলমিল','jilmil']],
 ['গাজীপুর','গাজীপুর সদর',['টঙ্গী','tongi']],
 ['নারায়ণগঞ্জ','নারায়ণগঞ্জ সদর',['ফতুল্লা','fatullah','fatulla','সিদ্ধিরগঞ্জ','siddhirganj','siddhirgonj']]
];
const CHECKOUT_AREA_ONLY_DISTRICTS=new Set(['খাগড়াছড়ি','খুলনা','চট্টগ্রাম','রাজশাহী']);
const CHECKOUT_DISTRICTS=['ঝিনাইদহ','ঢাকা','চট্টগ্রাম','কুমিল্লা','বগুড়া','যশোর','বরিশাল','কক্সবাজার','ময়মনসিংহ','নোয়াখালী','ফরিদপুর','গাজীপুর','নারায়ণগঞ্জ','নরসিংদী','মুন্সীগঞ্জ','মানিকগঞ্জ','টাঙ্গাইল','কিশোরগঞ্জ','গোপালগঞ্জ','মাদারীপুর','রাজবাড়ী','শরীয়তপুর','চাঁদপুর','লক্ষ্মীপুর','ফেনী','ব্রাহ্মণবাড়িয়া','খুলনা','সাতক্ষীরা','বাগেরহাট','নড়াইল','মাগুরা','কুষ্টিয়া','চুয়াডাঙ্গা','মেহেরপুর','রাজশাহী','নাটোর','নওগাঁ','পাবনা','সিরাজগঞ্জ','জয়পুরহাট','চাঁপাইনবাবগঞ্জ','রংপুর','দিনাজপুর','গাইবান্ধা','কুড়িগ্রাম','লালমনিরহাট','নীলফামারী','পঞ্চগড়','ঠাকুরগাঁও','সিলেট','সুনামগঞ্জ','মৌলভীবাজার','হবিগঞ্জ','জামালপুর','শেরপুর','নেত্রকোণা','বরগুনা','পটুয়াখালী','ভোলা','পিরোজপুর','ঝালকাঠি','রাঙ্গামাটি','খাগড়াছড়ি','বান্দরবান'];
function resolveCheckoutArea(address){
 const full=String(address||''),districts=bdTree.flatMap(x=>x.districts||[]);
 const districtLabel=full.match(/(?:^|[,;،]\s*)(?:জেলা|district)\s*[:：-]?\s*([^,;،]+)/i)?.[1]?.trim()||full.match(/([^,;،]+?)\s*(?:জেলা|district)\s*$/i)?.[1]?.trim()||'';
 const upazilaLabel=full.match(/(?:উপজেলা|upazila|upzilla|থানা|thana)\s*[:：-]?\s*([^,;،]+)/i)?.[1]?.trim()||full.match(/([^,;،]+?)\s*(?:উপজেলা|upazila|upzilla|থানা|thana)\s*$/i)?.[1]?.trim()||'';
 const matchDistrict=value=>districts.filter(d=>checkoutAreaHasName(value,d.bn_name)||checkoutAreaHas(value,d.en_name));
 const matchUpazilas=(value,scope=districts)=>scope.flatMap(d=>(d.upazilas||[]).filter(u=>checkoutAreaHasName(value,u.bn_name)||checkoutAreaHas(value,u.en_name)).map(u=>({district:d.bn_name,upazila:u.bn_name})));
 if(checkoutAreaHas(full,'নীলক্ষেত')&&checkoutAreaHas(full,'ঢাকা দক্ষিণ'))return {district:'ঢাকা (সিটি)',upazila:'নিউ মার্কেট'};
 const cityLocality=CHECKOUT_DHAKA_LOCALITIES.find(([thana,locality,aliases])=>checkoutAreaHasName(full,locality)||(aliases||[]).some(alias=>checkoutAreaHas(full,alias)));
 if(cityLocality)return {district:'ঢাকা (সিটি)',upazila:cityLocality[0]};
 const metroSuburb=CHECKOUT_DHAKA_SUBURBS.find(([district,upazila,aliases])=>aliases.some(alias=>checkoutAreaHasName(full,alias)));
 if(metroSuburb)return {district:metroSuburb[0],upazila:metroSuburb[1],suburb:true};
 const explicitDistricts=districtLabel?matchDistrict(districtLabel):[];
 if(explicitDistricts.length===1){
  const d=explicitDistricts[0],explicitUps=upazilaLabel?matchUpazilas(upazilaLabel,[d]):matchUpazilas(full,[d]);
  return explicitUps.length===1?{district:d.bn_name,upazila:explicitUps[0].upazila}:{district:d.bn_name,upazila:'',...(CHECKOUT_AREA_ONLY_DISTRICTS.has(d.bn_name)?{areaOnly:true,areaLabel:d.bn_name}:{})};
 }
 if(explicitDistricts.length>1)return {district:'',upazila:''};
 if(!explicitDistricts.length&&districtLabel)return {district:'',upazila:''};
 if(!explicitDistricts.length&&upazilaLabel){
  const explicitUps=matchUpazilas(upazilaLabel);
  const unique=[...new Map(explicitUps.map(x=>[x.district+'|'+x.upazila,x])).values()];
  if(unique.length===1)return unique[0];
  if(unique.length>1)return {district:'',upazila:''};
 }
 const hasDhaka=checkoutAreaHasName(full,'ঢাকা')||checkoutAreaHas(full,'dhaka');
 const dhakaThana=CHECKOUT_DHAKA_THANAS.find(x=>checkoutAreaHasName(full,x));
 if(hasDhaka&&dhakaThana&&/(মিরপুর|উত্তরা|পল্লবী|গুলশান|ধানমন্ডি|বাড্ডা|মোহাম্মদপুর|নীলক্ষেত|এয়ারপোর্ট|বিমানবন্দর|ঢাকা শহর|dhaka city|mirpur|uttara|pallabi|gulshan|dhanmondi|badda|mohammadpur)/i.test(full))return {district:'ঢাকা (সিটি)',upazila:dhakaThana};
 if(bdTree.length){
  const namedDistricts=matchDistrict(full),upMatches=matchUpazilas(full);
  const uniqueUps=[...new Map(upMatches.map(x=>[x.district+'|'+x.upazila,x])).values()];
  if(uniqueUps.length){
   const related=uniqueUps.filter(u=>namedDistricts.some(d=>d.bn_name===u.district));
   if(related.length===1)return related[0];
   if(related.length>1)return {district:'',upazila:''};
   if(uniqueUps.length===1)return uniqueUps[0];
   return {district:'',upazila:''};
  }
  if(namedDistricts.length===1){const d=namedDistricts[0].bn_name;return {district:d,upazila:'',...(CHECKOUT_AREA_ONLY_DISTRICTS.has(d)?{areaOnly:true,areaLabel:d}:{})};}
  if(namedDistricts.length>1)return {district:'',upazila:''};
 }
 const thana=CHECKOUT_DHAKA_THANAS.find(x=>checkoutAreaHasName(full,x));
 if(thana&&hasDhaka)return {district:'ঢাকা (সিটি)',upazila:thana};
 if((checkoutAreaHas(full,'ঢাকা শহর')||checkoutAreaHas(full,'dhaka city'))&&hasDhaka)return {district:'ঢাকা (সিটি)',upazila:'ঢাকা শহর'};
 if(checkoutAreaHasName(full,'মহেশপুর'))return {district:'ঝিনাইদহ',upazila:'মহেশপুর'};
 const district=CHECKOUT_DISTRICTS.find(x=>checkoutAreaHasName(full,x));
 if(district&&CHECKOUT_AREA_ONLY_DISTRICTS.has(district))return {district,upazila:'',areaOnly:true,areaLabel:district};
 if(checkoutAreaHasName(full,'খুলনা বিশ্ববিদ্যালয়')||checkoutAreaHas(full,'khulna university'))return {district:'খুলনা',upazila:'',areaOnly:true,areaLabel:'খুলনা বিশ্ববিদ্যালয়'};
 return {district:district||'',upazila:''};
}
function selectedCheckoutArea(){const district=$('#district')?.value||'',upazila=$('#upazila')?.value||'';if(district&&upazila)return {district,upazila,manual:true};if(checkoutSuggestedArea&&checkoutSelectedAreaSuffix&&String($('#address')?.value||'').includes(checkoutSelectedAreaSuffix))return checkoutSuggestedArea;return null;}
function checkoutNeedsZoneChoice(area){return !area?.district||(!area.upazila&&!area.areaOnly);}
function updateAddressResolution(){const box=$('#address-resolution');if(!box)return;const raw=String($('#address')?.value||'').trim(),manual=selectedCheckoutArea(),area=manual||resolveCheckoutArea(raw),choiceBox=$('#delivery-zone-choice');if(!raw&&!manual){box.textContent='';if(choiceBox)choiceBox.hidden=true;selectedDeliveryZoneChoice='';return;}const needsChoice=checkoutNeedsZoneChoice(area);if(choiceBox)choiceBox.hidden=!needsChoice;if(!needsChoice)selectedDeliveryZoneChoice='';if(area.district&&area.upazila){const city=area.district==='ঢাকা (সিটি)'||area.district==='ঢাকা (শহর)';box.textContent=(city?'থানা: ':'উপজেলা: ')+area.upazila+' · জেলা: '+area.district;}else if(area.areaOnly){box.textContent='এরিয়া: '+(area.areaLabel||area.district)+' · জেলা: '+area.district;}else if(area.district){box.textContent='জেলা: '+area.district+' · উপজেলা/থানা নিশ্চিত নয়';}else{box.textContent='এলাকা এখনো শনাক্ত হয়নি — নিচে ডেলিভারি অঞ্চল নির্বাচন করুন।';}}
let checkoutSuggestionItems=[],checkoutSelectedAreaSuffix='',checkoutSuggestedArea=null,addressSuggestionTimer=null,selectedDeliveryZoneChoice='';
function removeSelectedAreaFragments(address,selected){
 const aliases=[selected.upazila,selected.district,...(selected.locationAliases||[]),...(CHECKOUT_SPELLING_ALIASES[selected.upazila]||[]),...(CHECKOUT_SPELLING_ALIASES[selected.district]||[]),...(CHECKOUT_ENGLISH_DISTRICT_ALIASES[selected.district]||[])].filter(Boolean);
 const compact=value=>normalizeCheckoutArea(value).replace(/\s+/g,'').replace(/[qkc]/g,'k').replace(/[iy]/g,'i').replace(/[ou]/g,'a').replace(/[zgj]/g,'j').replace(/[wb]/g,'b');
 const targets=aliases.flatMap(value=>normalizeCheckoutArea(value).split(' ')).filter(word=>word.length>=4).map(compact);
 const tokens=[...String(address||'').matchAll(/[\p{L}\p{N}]+/gu)];
 const remove=new Set();
 const matchedSearchWords=(selected.matchedQueries||[]).flatMap(query=>normalizeCheckoutArea(query).split(' ')).filter(Boolean).map(compact);
 for(const token of tokens){
  const word=compact(token[0]);
  // Search fragments may be only two letters (e.g. "kh"); remove an
  // exact matched query token even when it is too short for fuzzy matching.
  if(matchedSearchWords.includes(word)){remove.add(token.index);continue;}
  if(word.length<3)continue;
  if(targets.some(target=>target.startsWith(word)||word.startsWith(target)))remove.add(token.index);
 }
 let result=String(address||'');
 for(const token of tokens.reverse())if(remove.has(token.index))result=result.slice(0,token.index)+result.slice(token.index+token[0].length);
 return result.replace(/\s+([,;،])/g,'$1').replace(/([,;،])\s*([,;،])/g,'$1').replace(/^\s*[,;،]+\s*|\s*[,;،]+\s*$/g,'').replace(/\s{2,}/g,' ').trim();
}

function renderAddressSuggestions(){
 const box=$('#address-suggestions'),fullRaw=String($('#address')?.value||'').trim();
 if(!box)return;
 // A selected canonical area is now plain, locked text: never re-search it.
 const raw=(checkoutSelectedAreaSuffix&&fullRaw.includes(checkoutSelectedAreaSuffix)?fullRaw.replace(checkoutSelectedAreaSuffix,''):fullRaw).replace(/[,;،]+\s*$/,'').trim();
 if(!raw){box.hidden=true;box.innerHTML='';checkoutSuggestionItems=[];return;}
 // Search every word and adjacent word-group in the complete address, not only
 // the final comma-separated part. This supports locality-first entries such as
 // "wireless chandpur" and "wireless, chandpur sadar".
 const words=raw.match(/[\p{L}\p{N}]+/gu)||[],queries=[];
 const genericAddressWords=new Set([
  'bazar','bazaar','bajaar','market','hat','haat','road','rd','street','st','lane','para','village','gram','union','post','postoffice','dakghar','near','beside','opposite','bridge','school','college','mosque','ward','sector','block','division','district','upazila','upzilla','thana','bangladesh',
  'বাজার','হাট','রোড','রাস্তা','সড়ক','পাড়া','গ্রাম','ইউনিয়ন','পোস্ট','ডাকঘর','কাছাকাছি','সামনে','পাশে','ব্রিজ','স্কুল','কলেজ','মসজিদ','ওয়ার্ড','সেক্টর','ব্লক','বিভাগ','জেলা','উপজেলা','থানা','বাংলাদেশ'
 ]);
 // Ignore generic address vocabulary as standalone search terms. Search
 // meaningful words and their nearby combinations across the whole address.
 for(let size=Math.min(3,words.length);size>=1;size--){
  for(let i=0;i<=words.length-size;i++){
   const group=words.slice(i,i+size),normalized=group.map(normalizeCheckoutArea);
   const meaningful=group.filter((word,index)=>!genericAddressWords.has(normalized[index]));
   if(!meaningful.length)continue;
   // Keep the complete phrase (e.g. "boyra bazar") so a locality is
   // matched as a place, while also searching meaningful words separately.
   const fullQuery=group.join(' '),meaningfulQuery=meaningful.join(' ');
   if(normalizeCheckoutArea(fullQuery).replace(/\s/g,'').length>=3)queries.push(fullQuery);
   if(meaningfulQuery!==fullQuery&&normalizeCheckoutArea(meaningfulQuery).replace(/\s/g,'').length>=3)queries.push(meaningfulQuery);
  }
 }
 const districts=bdTree.flatMap(x=>x.districts||[]),items=[];
 const matchesAny=(names)=>queries.some(q=>checkoutSuggestionMatches(q,names[0],names.slice(1)));
 const add=(district,upazila,name,englishNames=[],displayName='')=>{
  const districtNames=[district,...(CHECKOUT_ENGLISH_DISTRICT_ALIASES[district]||[])];
  const locationNames=[name||upazila||district,...(CHECKOUT_SPELLING_ALIASES[name||upazila||district]||[]),...englishNames];
  const locationScore=Math.max(0,...queries.map(q=>checkoutSuggestionMatchScore(q,name||upazila||district,locationNames.slice(1))));
  const districtScore=Math.max(0,...queries.map(q=>checkoutSuggestionMatchScore(q,district,districtNames.slice(1))));
  const districtMatched=districtScore>0,locationMatched=locationScore>0;
  if(!districtMatched&&!locationMatched)return;
  const key=district+'|'+upazila+'|'+name;
  if(items.some(x=>x.key===key))return;
  const matchedQueries=[...new Set(queries.filter(q=>checkoutSuggestionMatches(q,name||upazila||district,locationNames.slice(1))||checkoutSuggestionMatches(q,district,districtNames.slice(1))))];
  items.push({key,district,upazila,label:displayName?displayName+', '+district:(upazila?upazila+', '+district:district),localityName:displayName,districtMatched,locationMatched,locationAliases:locationNames,matchedQueries,locationScore,matchScore:locationScore*10+districtScore});
 };
 for(const d of districts){
  for(const u of d.upazilas||[])add(d.bn_name,u.bn_name,u.bn_name,[u.en_name,u.name].filter(Boolean));
 }
 // Keep suggestions useful even when the external geography file is unavailable.
 for(const thana of CHECKOUT_DHAKA_THANAS)add('ঢাকা (সিটি)',thana,thana);
 for(const [thana,locality,aliases] of CHECKOUT_DHAKA_LOCALITIES)add('ঢাকা (সিটি)',thana,locality,aliases,locality);
 // Recognize common named places as canonical localities, not leftover
 // fragments after the district token is removed.
 add('খুলনা','','খুলনা বিশ্ববিদ্যালয়',['khulna university','khulna university campus'],'খুলনা বিশ্ববিদ্যালয়');
 add('ঢাকা','সাভার','ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি',['daffodil international university','diu','ড্যাফোডিল বিশ্ববিদ্যালয়'],'ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি');
 add('খুলনা','','বয়রা বাজার',['boyra bazar','boyra bazaar','boira bazar','boyra bazar khulna'],'বয়রা বাজার');
 add('চুয়াডাঙ্গা','জীবননগর','জীবননগর');
 add('ঝিনাইদহ','মহেশপুর','মহেশপুর');
 const explicitDistricts=[...new Set([...districts.map(d=>d.bn_name),...CHECKOUT_DISTRICTS].filter(name=>matchesAny([name,...(CHECKOUT_ENGLISH_DISTRICT_ALIASES[name]||[])])))];
 // If a name is both a district and another district's upazila (e.g.
 // Sherpur), retain both plausible choices instead of hiding the upazila.
 let relevantItems=explicitDistricts.length?items.filter(x=>(explicitDistricts.includes(x.district)&&(!x.upazila||x.locationMatched))||(x.upazila&&x.locationMatched)):items;
 const bestLocationScore=Math.max(0,...relevantItems.map(x=>x.locationScore||0));
 if(bestLocationScore>=90)relevantItems=relevantItems.filter(x=>(x.locationScore||0)>=90);
 else if(bestLocationScore>=75)relevantItems=relevantItems.filter(x=>(x.locationScore||0)>=75);
 relevantItems.sort((a,b)=>b.matchScore-a.matchScore);
 checkoutSuggestionItems=relevantItems.slice(0,7);
 box.innerHTML=checkoutSuggestionItems.map((x,i)=>'<button type="button" class="address-suggestion" role="option" aria-selected="false" data-address-suggestion="'+i+'"><span class="address-suggestion-name">'+esc(x.label)+'</span><small>'+(x.upazila?(x.district==='ঢাকা (সিটি)'?'থানা':'উপজেলা'):'জেলা')+'</small></button>').join('');
 box.hidden=!checkoutSuggestionItems.length;
 box.querySelectorAll('[data-address-suggestion]').forEach(button=>button.onclick=()=>{
  const selected=checkoutSuggestionItems[Number(button.dataset.addressSuggestion)];if(!selected)return;
  const address=$('#address'),parts=removeSelectedAreaFragments(address.value,selected);
  const suffix=selected.district==='ঢাকা (সিটি)'&&selected.upazila?(selected.localityName?'এলাকা: '+selected.localityName+', ':'')+'থানা: '+selected.upazila+', জেলা: ঢাকা (সিটি)':selected.localityName?'এলাকা: '+selected.localityName+', জেলা: '+selected.district:selected.upazila?'উপজেলা: '+selected.upazila+', জেলা: '+selected.district:'জেলা: '+selected.district;
  if(!parts.includes(selected.upazila||selected.district))address.value=parts+(parts?', ':'')+suffix;
  else if(selected.upazila&&!parts.includes(selected.district))address.value=parts+', জেলা: '+selected.district;
  checkoutSelectedAreaSuffix=suffix;checkoutSuggestedArea={district:selected.district,upazila:selected.upazila||'',suggested:true};box.hidden=true;checkoutSuggestionItems=[];updateAddressResolution();renderCheckoutTotals();address.focus();
 });
}

function checkoutDeliveryZone(district){const d=String(district||'').trim().toLowerCase().replace(/[\s।,().-]/g,'');if(['jhenaidah','ঝিনাইদহ'].includes(d))return 'jhenaidah';if(['dhaka_city','ঢাকাসিটি','ঢাকাশহর'].includes(d))return 'dhaka_city';return 'outside_dhaka';}
function deliveryCharge(district,grams){if(!district||!grams)return 0;const zone=checkoutDeliveryZone(district),kg=Math.ceil(grams/1000);if(zone==='jhenaidah')return 6000+Math.max(0,kg-1)*2000;if(zone==='dhaka_city')return 11500+Math.max(0,kg-1)*2000;if(grams<=500)return 11500;if(grams<=1000)return 13500;return 13500+Math.max(0,kg-1)*2000;}let deliveryDetailsOpen=false;
function renderCheckoutTotals(){
 const box=$('#delivery-summary');if(!box)return;
 const subtotal=[...cart.values()].reduce((s,x)=>s+x.unit_price_paisa*x.quantity,0);
 const grams=[...cart.values()].reduce((s,x)=>s+Number(x.weight_kg||0)*1000*x.quantity,0);
 const area=selectedCheckoutArea()||resolveCheckoutArea($('#address')?.value||''),district=area.district||'';
 const needsChoice=checkoutNeedsZoneChoice(area),zone=needsChoice?(selectedDeliveryZoneChoice||''):checkoutDeliveryZone(district);
 const baseFee=zone?deliveryCharge(zone,grams):0,payment=document.querySelector('input[name="payment"]:checked')?.value||'cod';
 const codFee=baseFee&&payment==='cod'?Math.ceil(subtotal/100):0,fee=baseFee+codFee,total=subtotal+fee,extraKg=Math.max(0,Math.ceil(grams/1000)-1);
 let rateText='',weightText=grams?(grams>=1000?(grams/1000).toLocaleString('bn-BD',{maximumFractionDigits:2})+' কেজি':grams.toLocaleString('bn-BD')+' গ্রাম'):'—';
 if(!grams)rateText='পণ্য নির্বাচন করলে কুরিয়ার চার্জ দেখা যাবে।';else if(!zone)rateText='ডেলিভারি অঞ্চল নির্বাচন করলে চার্জ নির্ধারিত হবে।';else if(zone==='jhenaidah')rateText='ঝিনাইদহ জেলার ভেতরে: প্রথম ১ কেজি '+money(6000)+' + অতিরিক্ত প্রতি কেজি '+money(2000);else if(zone==='dhaka_city')rateText='ঢাকা শহরের ভেতরে: প্রথম ১ কেজি '+money(11500)+' + অতিরিক্ত প্রতি কেজি '+money(2000);else if(grams<=500)rateText='ঢাকা শহরের বাইরে: ৫০০ গ্রাম পর্যন্ত '+money(11500);else if(grams<=1000)rateText='ঢাকা শহরের বাইরে: ৫০১ গ্রাম থেকে ১ কেজি '+money(13500);else rateText='ঢাকা শহরের বাইরে: প্রথম ১ কেজি '+money(13500)+' + অতিরিক্ত প্রতি কেজি '+money(2000);
 const zoneLabel=zone==='jhenaidah'?'ঝিনাইদহ জেলার ভেতরে':zone==='dhaka_city'?'ঢাকা সিটির ভেতরে':zone==='outside_dhaka'?'ঢাকা সিটির বাইরে':'নির্বাচন বাকি';
 const rows=(!zone||!grams)?'':'<div class="delivery-detail-row"><span>ডেলিভারি অঞ্চল:</span><strong>'+esc(zoneLabel)+'</strong></div><div class="delivery-detail-row"><span>ঠিকানা শনাক্ত:</span><strong>'+esc(area.district?(area.upazila||area.areaLabel||area.district):'গ্রাহকের নির্বাচিত অঞ্চল')+'</strong></div><div class="delivery-detail-row"><span>পণ্যের ওজন:</span><strong>'+weightText+'</strong></div><div class="delivery-detail-row"><span>কুরিয়ার রেট:</span><strong>'+rateText+'</strong></div>'+(extraKg?'<div class="delivery-detail-row"><span>অতিরিক্ত ওজন:</span><strong>'+extraKg.toLocaleString('bn-BD')+' কেজি × '+money(2000)+' = '+money(extraKg*2000)+'</strong></div>':'')+'<div class="delivery-detail-row"><span>কুরিয়ার চার্জ:</span><strong>'+money(baseFee)+'</strong></div>'+(payment==='cod'?'<div class="delivery-detail-row"><span>COD (১%):</span><strong>'+money(codFee)+'</strong></div>':'<div class="delivery-detail-row"><span>COD:</span><strong>নেই (অগ্রিম পেমেন্ট)</strong></div>')+'<div class="delivery-detail-row delivery-detail-total"><span>মোট ডেলিভারি:</span><strong>'+money(fee)+'</strong></div>';
 const chargeLabel=!grams?'পণ্য নির্বাচন করুন':!zone?'অঞ্চল নির্বাচন করুন':money(fee);
 box.innerHTML='<div class="delivery-row"><span>পণ্যের মোট দাম</span><strong>'+money(subtotal)+'</strong></div><div class="delivery-row"><span>ডেলিভারি চার্জ</span><strong>'+chargeLabel+'</strong></div><button type="button" class="delivery-details-toggle" style="display:inline-flex;width:auto;min-height:0;padding:4px 8px;margin-top:4px;font-size:12px;line-height:1.2;gap:6px" aria-expanded="'+(deliveryDetailsOpen?'true':'false')+'" aria-controls="delivery-details-panel"><span>ডেলিভারি চার্জের বিস্তারিত</span><span class="delivery-details-chevron" aria-hidden="true">'+(deliveryDetailsOpen?'⌃':'⌄')+'</span></button><div id="delivery-details-panel" class="delivery-details-panel" '+(deliveryDetailsOpen?'':'hidden')+'>'+rows+(!zone&&grams?'<p class="delivery-detail-hint">ঠিকানা থেকে উপজেলা/থানা নিশ্চিত হয়নি। উপরের তিনটি অঞ্চলের একটি নির্বাচন করুন।</p>':(!grams?'<p class="delivery-detail-hint">'+rateText+'</p>':''))+'</div><div class="delivery-row delivery-total"><span>মোট পরিশোধযোগ্য মূল্য</span><strong>'+money(total)+'</strong></div><small class="delivery-words">('+banglaNumberWords(Math.floor(total/100))+' টাকা)</small>';
 const toggle=box.querySelector('.delivery-details-toggle');if(toggle)toggle.onclick=()=>{deliveryDetailsOpen=!deliveryDetailsOpen;renderCheckoutTotals();};
}
function renderCart(){const el=$('#cart-summary'),a=[...cart.values()];if(!a.length){el.textContent='এখনো কোনো পণ্য নির্বাচন করা হয়নি।';return;}const total=a.reduce((s,x)=>s+x.unit_price_paisa*x.quantity,0);el.innerHTML=a.map(x=>'<div class="cart-line" style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #eee">'+(x.image_url?'<img src="'+esc(x.image_url)+'" alt="'+esc(x.product_name)+'" style="width:64px;height:64px;object-fit:cover;border-radius:8px">':'<div style="width:64px;height:64px;background:#f2f2f2;border-radius:8px"></div>')+'<div style="flex:1;min-width:0"><strong>'+esc(x.product_name)+'</strong><div style="color:#888;font-size:12px">('+esc(x.variant_label)+')</div><div>'+money(x.unit_price_paisa)+' × '+x.quantity+' টি</div><div style="display:flex;align-items:center;gap:7px;margin-top:7px"><button type="button" data-cart-action="minus" data-variant="'+x.variant_id+'" aria-label="পরিমাণ কমান" style="width:30px;height:30px;border:1px solid #ccc;border-radius:6px;background:#fff;font-size:18px">−</button><span style="min-width:22px;text-align:center;font-weight:600">'+x.quantity+'</span><button type="button" data-cart-action="plus" data-variant="'+x.variant_id+'" aria-label="পরিমাণ বাড়ান" style="width:30px;height:30px;border:1px solid #ccc;border-radius:6px;background:#fff;font-size:18px">+</button><button type="button" data-cart-action="remove" data-variant="'+x.variant_id+'" style="margin-left:5px;border:0;background:#fff0f0;color:#c62828;border-radius:6px;padding:6px 9px;font-size:12px">রিমুভ</button></div></div><strong style="white-space:nowrap">'+money(x.unit_price_paisa*x.quantity)+'</strong></div>').join('')+'<div class="cart-grand-total" style="display:flex;justify-content:flex-end;align-items:center;gap:10px;margin-top:14px;color:#16803c;font-size:22px;font-weight:800;text-align:right"><span>মোট:</span><div style="display:flex;flex-direction:column;align-items:flex-end"><strong>'+money(total)+'</strong></div></div>';el.querySelectorAll('[data-cart-action]').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.variant),item=cart.get(id);if(!item)return;const action=b.dataset.cartAction;if(action==='remove'){const removed=cart.get(id);cart.delete(id);updateAllProductCards();}else if(action==='minus')item.quantity=Math.max(1,item.quantity-1);else if(action==='plus')item.quantity=Math.min(10,item.quantity+1);renderCart();renderCheckoutTotals();});}
function locationKey(value){let key=String(value||'').normalize('NFKC').toLocaleLowerCase().replace(/district|upazila|upzilla|thana|zila|জেলা|উপজেলা|থানা/g,' ').replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();const aliases={'chittagong':'chattogram','comilla':'cumilla','bogra':'bogura','jessore':'jashore','barisal':'barishal','cox s bazar':'cox bazar'};return aliases[key]||key;}
function findBdLocation(address){const districts=bdTree.flatMap(x=>x.districts||[]),districtKeys=['state_district','county','district','city','municipality','state','region','province'],upazilaKeys=['county','municipality','city_district','town','suburb','village','hamlet','neighbourhood','city','locality'];const candidates=keys=>keys.map(k=>address?.[k]).filter(Boolean).map(String);const matches=(candidate,obj)=>{const c=locationKey(candidate);return !!c&&[obj.en_name,obj.bn_name,obj.name,...(obj.aliases||[])].filter(Boolean).map(locationKey).some(n=>n&&(c===n||c.startsWith(n+' ')||c.endsWith(' '+n)));};let upMatch=null;for(const c of candidates(upazilaKeys)){for(const d of districts){const u=(d.upazilas||[]).find(x=>matches(c,x));if(u){upMatch={district:d,upazila:u};break;}}if(upMatch)break;}let district=upMatch?.district||null;if(!district){for(const c of candidates(districtKeys)){district=districts.find(d=>matches(c,d));if(district)break;}}return {district,upazila:upMatch?.upazila||null};}
function formatDeliveryAddress(location,upazila,district){const normalize=value=>String(value||'').normalize('NFKC').toLocaleLowerCase().replace(/^(উপজেলা|জেলা|upazila|upzilla|district)\s*[:：-]?\s*/i,'').replace(/\s*(উপজেলা|জেলা|upazila|upzilla|district)$/i,'').replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();const selected=new Set([normalize(upazila),normalize(district)].filter(Boolean));const seen=new Set();const locality=String(location||'').split(',').map(part=>part.trim()).filter(part=>{if(!part||/^(বিভাগ|পোস্ট\s*কোড|পোস্টাল\s*কোড|postal\s*code|postcode|zip|division)\s*[:：-]?/i.test(part)||/^(বাংলাদেশ|bangladesh)$/i.test(part)||/^[0-9০-৯]{4,6}$/.test(part)||/(বিভাগ|division)$/i.test(part))return false;const key=normalize(part);if(!key||selected.has(key)||seen.has(key))return false;seen.add(key);return true;}).join(', ');return [locality,upazila?'উপজেলা: '+upazila:'',district?'জেলা: '+district:''].filter(Boolean).join(', ');}
function showOrderConfirmation(order,payload,area){const previous=$('#order-confirmation-modal');if(previous)previous.remove();const callHref=$('#call-button')?.getAttribute('href')||'',address=formatDeliveryAddress(payload.address,area.upazila,area.district),date=new Intl.DateTimeFormat('bn-BD',{dateStyle:'long',timeStyle:'short',timeZone:'Asia/Dhaka'}).format(new Date());const row=(label,value)=>'<div class="order-confirmation-row"><span>'+label+'</span><strong>'+esc(value)+'</strong></div>';const modal=document.createElement('div');modal.id='order-confirmation-modal';modal.className='order-confirmation-backdrop';modal.innerHTML='<section class="order-confirmation-card" role="dialog" aria-modal="true" aria-labelledby="order-confirmation-title"><button type="button" class="order-confirmation-close" aria-label="বন্ধ করুন">×</button><div class="order-confirmation-mark">✓</div><h2 id="order-confirmation-title">আপনার অর্ডার সফল হয়েছে!</h2><p class="order-confirmation-note">অর্ডারটি অ্যাডমিনের অনুমোদনের অপেক্ষায় আছে।</p><div class="order-confirmation-details">'+row('অর্ডার নম্বর',order.order_code)+row('তারিখ',date)+row('নাম',payload.customer_name)+row('ফোন নম্বর',payload.phone)+row('সম্পূর্ণ ঠিকানা',address)+row('পণ্যের মূল্য',money(order.subtotal_paisa))+row('ডেলিভারি চার্জ',money(order.delivery_fee_paisa))+'<div class="order-confirmation-row order-confirmation-grand"><span>সর্বমোট</span><strong>'+money(order.total_paisa)+'</strong></div></div><p class="order-confirmation-call-text">কোনো পরিবর্তন থাকলে কল করুন</p>'+(callHref&&callHref!=='tel:'?'<a class="order-confirmation-call" href="'+esc(callHref)+'">☎ কল করুন</a>':'')+'<div class="order-confirmation-actions"><button type="button" class="primary invoice-download-btn" data-invoice-order="'+esc(order.order_code)+'" data-invoice-phone="'+esc(payload.phone)+'">ইনভয়েস ডাউনলোড করুন</button><button type="button" class="primary go-top-btn order-confirmation-logo-btn" data-go-top aria-label="উপরে যান"><span class="order-confirmation-brand-text">মেঠো</span></button></div></section>';document.body.appendChild(modal);const close=()=>modal.remove();modal.querySelector('.order-confirmation-close').onclick=close;modal.addEventListener('click',e=>{if(e.target===modal)close();});modal.querySelector('[data-go-top]').addEventListener('click',()=>{close();window.scrollTo({top:0,behavior:'smooth'});});modal.querySelector('.order-confirmation-close').focus();}
function updateCooldown(){const left=Math.max(0,Math.ceil((cooldownUntil-Date.now())/1000)),b=$('#submit-order');b.disabled=left>0;b.textContent=left?'আবার অর্ডার করতে অপেক্ষা করুন ০০:'+String(left).padStart(2,'0'):'অর্ডার কনফার্ম করুন';if(cooldownTimer)clearTimeout(cooldownTimer);if(left)cooldownTimer=setTimeout(updateCooldown,250);}
function startCooldown(seconds=60){cooldownUntil=Date.now()+seconds*1000;updateCooldown();}
$('#use-location').onclick=()=>{const b=$('#use-location'),st=$('#location-status');if(!navigator.geolocation){st.textContent='এই ব্রাউজারে GPS সুবিধা নেই। ঠিকানা নিজে লিখুন।';return;}b.disabled=true;st.textContent='GPS থেকে আপনার বর্তমান অবস্থান নেওয়া হচ্ছে…';navigator.geolocation.getCurrentPosition(async pos=>{const {latitude,longitude}=pos.coords;$('#latitude').value=latitude;$('#longitude').value=longitude;try{const url='https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+encodeURIComponent(latitude)+'&lon='+encodeURIComponent(longitude)+'&accept-language=bn';const response=await fetch(url,{headers:{'Accept':'application/json'}});if(!response.ok)throw Error('reverse geocoding unavailable');const d=await response.json(),a=d.address||{};await locationLoader.then(x=>x.ensureGeoData());const found=findBdLocation(a),district=found.district;if(district){$('#district').value=district.bn_name;$('#district').dispatchEvent(new Event('change'));if(found.upazila)$('#upazila').value=found.upazila.bn_name;}const parts=[a.house_number,a.road,a.neighbourhood,a.quarter,a.village,a.hamlet,a.suburb,found.upazila?.bn_name,district?.bn_name].filter(Boolean);if(parts.length)$('#address').value=[...new Set(parts)].join(', ');renderCheckoutTotals();st.textContent='GPS লোকেশন পাওয়া গেছে। '+(district?'জেলা '+district.bn_name+' ও '+(found.upazila?.bn_name||'এলাকা')+' ঠিকানা ঘরে যোগ হয়েছে।':'জেলা নিশ্চিতভাবে শনাক্ত হয়নি—ঠিকানা নিজে যাচাই করুন।');}catch{st.textContent='GPS স্থানাঙ্ক পাওয়া গেছে। জেলা, উপজেলা ও ঠিকানা নিজে যাচাই করে পূরণ করুন।';}finally{b.disabled=false;}},err=>{st.textContent=err.code===1?'লোকেশন অনুমতি দেওয়া হয়নি। ব্রাউজারের Location permission চালু করে আবার চেষ্টা করুন।':'GPS পাওয়া যায়নি। ফোনের Location চালু করে আবার চেষ্টা করুন।';b.disabled=false;},{enableHighAccuracy:true,timeout:20000,maximumAge:0});};$('#manual-address-toggle').onclick=async()=>{const panel=$('#manual-address-fields'),button=$('#manual-address-toggle'),opening=panel.hidden;panel.hidden=!opening;button.setAttribute('aria-expanded',String(opening));button.innerHTML=opening?'জেলা, উপজেলা নির্বাচন বন্ধ করুন <span aria-hidden="true">⌃</span>':'অথবা নিজে জেলা, উপজেলা নির্বাচন করুন <span aria-hidden="true">⌄</span>';if(opening){await locationLoader.then(x=>x.ensureGeoData());$('#district').focus();}};$('#district').addEventListener('change',()=>{updateAddressResolution();renderCheckoutTotals();});$('#upazila').addEventListener('change',()=>{updateAddressResolution();renderCheckoutTotals();});document.querySelectorAll('input[name="delivery-zone-choice"]').forEach(x=>x.addEventListener('change',()=>{selectedDeliveryZoneChoice=x.value;renderCheckoutTotals();}));$('#address').addEventListener('input',e=>{selectedDeliveryZoneChoice='';document.querySelectorAll('input[name="delivery-zone-choice"]').forEach(x=>x.checked=false);if(checkoutSelectedAreaSuffix&&!String($('#address').value||'').includes(checkoutSelectedAreaSuffix)){checkoutSelectedAreaSuffix='';checkoutSuggestedArea=null;}const deleting=!!(e.inputType&&e.inputType.startsWith('delete'));if(addressSuggestionTimer)clearTimeout(addressSuggestionTimer);if(deleting)$('#address-suggestions').hidden=true;addressSuggestionTimer=setTimeout(()=>{if(deleting){updateAddressResolution();renderCheckoutTotals();return;}locationLoader.then(x=>x.ensureGeoData()).then(()=>{updateAddressResolution();renderCheckoutTotals();renderAddressSuggestions();}).catch(()=>{updateAddressResolution();renderCheckoutTotals();renderAddressSuggestions();});},deleting?350:220);});document.querySelectorAll('input[name="payment"]').forEach(x=>x.addEventListener('change',renderCheckoutTotals));$('#order-form').onsubmit=async e=>{e.preventDefault();const msg=$('#form-message'),btn=$('#submit-order');if(!cart.size){msg.textContent='আগে অন্তত একটি পণ্য নির্বাচন করুন।';return;}if(Date.now()<cooldownUntil)return;btn.disabled=true;msg.className='';msg.textContent='ঠিকানা যাচাই করে অর্ডার জমা হচ্ছে…';try{await locationLoader.then(x=>x.ensureGeoData());const fdata=new FormData(e.currentTarget),address=String(fdata.get('address')||'').trim(),area=selectedCheckoutArea()||resolveCheckoutArea(address),needsChoice=checkoutNeedsZoneChoice(area);if(needsChoice&&!selectedDeliveryZoneChoice)throw Error('ডেলিভারি চার্জ নির্ধারণ করতে নিচের তিনটি অঞ্চলের একটি নির্বাচন করুন।');const payload={customer_name:fdata.get('name'),phone:fdata.get('phone'),district:area.district||'',upazila:area.upazila||'',delivery_zone:needsChoice?selectedDeliveryZoneChoice:'',address,note:fdata.get('note'),payment_method:fdata.get('payment'),latitude:fdata.get('latitude')||null,longitude:fdata.get('longitude')||null,items:[...cart.values()].map(x=>({variant_id:x.variant_id,quantity:x.quantity}))};renderCheckoutTotals();const r=await fetch('/api/orders',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}),d=await r.json();if(!r.ok){if(r.status===429)startCooldown(60);throw Error(d.error||'অর্ডার জমা হয়নি।');}cart.clear();updateAllProductCards();renderCart();msg.className='success';msg.textContent='আপনার অর্ডার সফল হয়েছে। অর্ডার নম্বর '+d.order_code;const confirmationArea=needsChoice?{district:selectedDeliveryZoneChoice==='dhaka_city'?'ঢাকা (শহর)':selectedDeliveryZoneChoice==='jhenaidah'?'ঝিনাইদহ':'ঢাকা শহরের বাইরে',upazila:''}:area;showOrderConfirmation(d,payload,confirmationArea);startCooldown(d.cooldown_seconds||60);}catch(x){msg.className='error';msg.textContent=x.message;btn.disabled=false;}};
function trackVisitor(){try{const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dhaka'}).format(new Date());if(localStorage.getItem('metho_visitor_date')===today)return;let id=localStorage.getItem('metho_visitor_id');if(!id){id=crypto.randomUUID();localStorage.setItem('metho_visitor_id',id);}fetch('/api/visit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({visitor_id:id})}).then(r=>{if(r.ok)localStorage.setItem('metho_visitor_date',today);}).catch(()=>{});}catch{}}
document.addEventListener('click',e=>{if(e.target.closest('[data-go-top]'))window.scrollTo({top:0,behavior:'smooth'});});$('#year').textContent=new Date().getFullYear();const locationLoader=loadLocations();renderCheckoutTotals();loadConfig();loadProducts();trackVisitor();
