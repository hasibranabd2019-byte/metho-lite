const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}});
const error=(message,status=400)=>json({error:message},status);
const enc=b=>btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const bytes=s=>new TextEncoder().encode(s);
async function sha(s){return enc(await crypto.subtle.digest('SHA-256',bytes(s)));}
async function hashPassword(password,salt){const key=await crypto.subtle.importKey('raw',bytes(password),'PBKDF2',false,['deriveBits']);return enc(await crypto.subtle.deriveBits({name:'PBKDF2',salt:bytes(salt),iterations:100000,hash:'SHA-256'},key,256));}
const random=()=>enc(crypto.getRandomValues(new Uint8Array(32)));
const cookie=(v,age)=>'metho_session='+v+'; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age='+age;
function getCookie(req){const c=(req.headers.get('Cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('metho_session='));return c?c.slice(14):'';}
async function readBody(req){try{return await req.json();}catch{return null;}}

function normalizeAreaText(value){return String(value||'').normalize('NFKC').toLocaleLowerCase().replace(/[০-৯]/g,x=>String('০১২৩৪৫৬৭৮৯'.indexOf(x))).replace(/(জেলা|উপজেলা|থানা|district|upazila|upzilla|thana|zila)/g,' ').replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();}
function normalizeAreaRoman(value){return normalizeAreaText(value).replace(/bh/g,'v').replace(/ph/g,'f').replace(/ae/g,'a').replace(/e/g,'a').replace(/[ckq]/g,'k');}
function deliveryZoneForDistrict(district){const key=normalizeAreaText(district).replace(/\s+/g,'');if(key==='ঝিনাইদহ'||key==='jhenaidah')return 'jhenaidah';if(key==='ঢাকাশহর'||key==='ঢাকাসিটি')return 'dhaka_city';return 'outside_dhaka';}
function calculateBaseDeliveryFee(district,grams){if(!district||!grams)return 0;const zone=deliveryZoneForDistrict(district),kg=Math.ceil(Number(grams)/1000);if(zone==='jhenaidah')return 6000+Math.max(0,kg-1)*2000;if(zone==='dhaka_city')return 11500+Math.max(0,kg-1)*2000;if(grams<=500)return 11500;if(grams<=1000)return 13500;return 13500+Math.max(0,kg-1)*2000;}
function areaDistance(a,b){const x=Array.from(a),y=Array.from(b);if(Math.abs(x.length-y.length)>2)return 99;let row=Array.from({length:y.length+1},(_,i)=>i);for(let i=1;i<=x.length;i++){const next=[i];for(let j=1;j<=y.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(x[i-1]===y[j-1]?0:1));row=next;}return row[y.length];}
function areaHas(text,alias){
 const t=' '+normalizeAreaRoman(text)+' ',a=normalizeAreaRoman(alias);
 if(!a)return false;
 if(t.includes(' '+a+' '))return true;
 const words=t.trim().split(' '),parts=a.split(' ');
 for(let i=0;i<=words.length-parts.length;i++){
  if(parts.every((p,j)=>{const w=words[i+j],limit=p.length>=9?2:p.length>=5?1:0;return w===p||areaDistance(w,p)<=limit;}))return true;
 }
 // Also compare adjacent words as one place name (e.g. "zamal pur" / "jamalpur").
 const key=value=>normalizeAreaRoman(value).replace(/\s+/g,'').replace(/[iy]/g,'i').replace(/[ou]/g,'a').replace(/[zgj]/g,'j').replace(/[wb]/g,'b'),target=key(alias);
 for(let start=0;start<words.length;start++)for(let count=1;count<=3&&start+count<=words.length;count++){
  const candidate=key(words.slice(start,start+count).join(' ')),limit=target.length>=10?2:target.length>=5?1:0;
  if(candidate===target||limit>0&&Math.abs(candidate.length-target.length)<=limit&&areaDistance(candidate,target)<=limit)return true;
 }
 return false;
}
const addressSpellingAliases={'জীবননগর':['জীবন নগর','জিবন নগর','জিবননগর','jibon nogor','zibon nagar','jibon nagar','jibonnogor','jibannagar','zibonnagar','zibonnogor']};
function areaHasName(text,name){return areaHas(text,name)||(addressSpellingAliases[name]||[]).some(alias=>areaHas(text,alias));}

const districtAliases=[['ঝিনাইদহ',['jhenaidah','jhenidah']],['ঢাকা',['dhaka']],['চট্টগ্রাম',['chattogram','chittagong']],['কুমিল্লা',['cumilla','comilla']],['বগুড়া',['bogura','bogra']],['যশোর',['jashore','jessore']],['বরিশাল',['barishal','barisal']],['কক্সবাজার',['cox bazar','coxs bazar']],['ময়মনসিংহ',['mymensingh']],['নোয়াখালী',['noakhali']],['ফরিদপুর',['faridpur']],['গাজীপুর',['gazipur']],['নারায়ণগঞ্জ',['narayanganj']],['নরসিংদী',['narsingdi']],['মুন্সীগঞ্জ',['munshiganj']],['মানিকগঞ্জ',['manikganj']],['টাঙ্গাইল',['tangail']],['কিশোরগঞ্জ',['kishoreganj']],['গোপালগঞ্জ',['gopalganj']],['মাদারীপুর',['madaripur']],['রাজবাড়ী',['rajbari']],['শরীয়তপুর',['shariatpur']],['চাঁদপুর',['chandpur']],['লক্ষ্মীপুর',['lakshmipur']],['ফেনী',['feni']],['ব্রাহ্মণবাড়িয়া',['brahmanbaria']],['খুলনা',['khulna']],['সাতক্ষীরা',['satkhira']],['বাগেরহাট',['bagerhat']],['নড়াইল',['narail']],['মাগুরা',['magura']],['কুষ্টিয়া',['kushtia']],['চুয়াডাঙ্গা',['chuadanga']],['মেহেরপুর',['meherpur']],['রাজশাহী',['rajshahi']],['নাটোর',['natore']],['নওগাঁ',['naogaon']],['পাবনা',['pabna']],['সিরাজগঞ্জ',['sirajganj']],['জয়পুরহাট',['joypurhat']],['চাঁপাইনবাবগঞ্জ',['chapainawabganj']],['রংপুর',['rangpur']],['দিনাজপুর',['dinajpur']],['গাইবান্ধা',['gaibandha']],['কুড়িগ্রাম',['kurigram']],['লালমনিরহাট',['lalmonirhat']],['নীলফামারী',['nilphamari']],['পঞ্চগড়',['panchagarh']],['ঠাকুরগাঁও',['thakurgaon']],['সিলেট',['sylhet']],['সুনামগঞ্জ',['sunamganj']],['মৌলভীবাজার',['moulvibazar']],['হবিগঞ্জ',['habiganj']],['জামালপুর',['jamalpur','jamal pur','zamalpur','zamal pur']],['শেরপুর',['sherpur']],['নেত্রকোণা',['netrokona']],['বরগুনা',['barguna']],['পটুয়াখালী',['patuakhali']],['ভোলা',['bhola']],['পিরোজপুর',['pirojpur']],['ঝালকাঠি',['jhalokati']],['রাঙ্গামাটি',['rangamati']],['খাগড়াছড়ি',['khagrachhari']],['বান্দরবান',['bandarban']]];
const dhakaCityLocalities=[
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
 ['হাতিরঝিল','হাতিরঝিল',['hatirjheel','hatir jheel']]
];
const dhakaMetroSuburbAliases=[
 ['ঢাকা','সাভার',['সাভার','savar','আশুলিয়া','আশুলিয়া','ashulia','বিরুলিয়া','বিরুলিয়া','birulia']],
 ['ঢাকা','কেরানীগঞ্জ',['কেরানীগঞ্জ','keraniganj','কেরানিগঞ্জ','জিঞ্জিরা','jinjira','হাসনাবাদ','hasnabad','তেঘরিয়া','তেঘড়িয়া','tegharia','teghoria','ঝিলমিল','jilmil']],
 ['গাজীপুর','গাজীপুর সদর',['টঙ্গী','tongi']],
 ['নারায়ণগঞ্জ','নারায়ণগঞ্জ সদর',['ফতুল্লা','fatullah','fatulla','সিদ্ধিরগঞ্জ','siddhirganj','siddhirgonj']]
];
const dhakaThanaAliases=['মিরপুর','পল্লবী','রূপনগর','শাহ আলী','দারুস সালাম','কাফরুল','ভাষানটেক','ক্যান্টনমেন্ট','বাড্ডা','ভাটারা','গুলশান','বনানী','তেজগাঁও','শেরে বাংলা নগর','মোহাম্মদপুর','আদাবর','ধানমন্ডি','কলাবাগান','রমনা','শাহবাগ','পল্টন','মতিঝিল','শাহজাহানপুর','খিলগাঁও','রামপুরা','মুগদা','সবুজবাগ','যাত্রাবাড়ী','কদমতলী','ডেমরা','শ্যামপুর','সূত্রাপুর','ওয়ারী','গেন্ডারিয়া','বংশাল','লালবাগ','চকবাজার','হাজারীবাগ','কামরাঙ্গীরচর','নিউ মার্কেট','উত্তরা','দক্ষিণখান','উত্তরখান','খিলক্ষেত','তুরাগ','এয়ারপোর্ট','mirpur','pallabi','rupnagar','shah ali','darus salam','kafrul','bhashantek','cantonment','badda','bhatara','gulshan','banani','tejgaon','mohammadpur','adabor','dhanmondi','kalabagan','ramna','shahbag','paltan','motijheel','shahjahanpur','khilgaon','rampura','mugda','sabujbagh','jatrabari','kadamtali','demra','shyampur','sutrapur','wari','gandaria','bangshal','lalbagh','chawkbazar','hazaribagh','kamrangirchar','new market','uttara','dakshinkhan','uttarkhan','khilkhet','turag','airport'];
let addressGeoTreePromise;
async function getAddressGeoTree(){if(!addressGeoTreePromise)addressGeoTreePromise=fetch('https://iqbalhasandev.github.io/bangladesh-geo-json/bangladesh-geo.json',{headers:{'accept':'application/json'}}).then(r=>{if(!r.ok)throw new Error('Geo data unavailable');return r.json();}).catch(e=>{addressGeoTreePromise=null;throw e;});return addressGeoTreePromise;}
async function resolveAddressArea(address,providedDistrict='',providedUpazila=''){
 const raw=String(address||''),pd=String(providedDistrict||'').trim(),pu=String(providedUpazila||'').trim();
 const explicitDistrict=String(raw.match(/(?:জেলা|district)\s*[:：-]?\s*([^,;،]+)/i)?.[1]||'').trim();
 const explicitUpazila=String(raw.match(/(?:উপজেলা|upazila|upzilla|থানা|thana)\s*[:：-]?\s*([^,;،]+)/i)?.[1]||'').trim();
 // A customer-selected district/upazila pair takes precedence over ambiguous place-name matches.
 if(pd&&pu){
  if(pd==='ঢাকা (শহর)'||pd==='ঢাকা (সিটি)')return {district:'ঢাকা (শহর)',upazila:pu};
  try{const tree=await getAddressGeoTree(),districts=tree.flatMap(x=>x.districts||[]),d=districts.find(x=>x.bn_name===pd||x.en_name===pd),u=d?.upazilas?.find(x=>x.bn_name===pu||x.en_name===pu);if(d&&u)return {district:d.bn_name,upazila:u.bn_name};}catch(e){console.error('[METHO_ADDRESS_GEO_LOOKUP_FAILED]',String(e));}
 }
 const text=raw+' '+pd+' '+pu+' '+explicitDistrict+' '+explicitUpazila;
 if(areaHas(text,'নীলক্ষেত')&&areaHas(text,'ঢাকা দক্ষিণ'))return {district:'ঢাকা (শহর)',upazila:'নিউ মার্কেট'};
 const cityLocality=dhakaCityLocalities.find(([thana,locality,aliases])=>areaHasName(text,locality)||(aliases||[]).some(alias=>areaHas(text,alias)));
 if(cityLocality)return {district:'ঢাকা (শহর)',upazila:cityLocality[0]};
 const metroSuburb=dhakaMetroSuburbAliases.find(([district,upazila,aliases])=>aliases.some(x=>areaHas(text,x)));
 if(metroSuburb)return {district:metroSuburb[0],upazila:metroSuburb[1]};
 const thana=dhakaThanaAliases.find(x=>areaHas(text,x));if(thana)return {district:'ঢাকা (শহর)',upazila:explicitUpazila||thana};
 if(areaHas(text,'ঢাকা শহর')||areaHas(text,'dhaka city'))return {district:'ঢাকা (শহর)',upazila:explicitUpazila||'ঢাকা শহর'};
 try{
  const tree=await getAddressGeoTree(),districts=tree.flatMap(x=>x.districts||[]);
  // Prefer an explicitly named district when checking a same-named upazila.
  const explicit=districts.find(d=>areaHasName(raw,d.bn_name)||areaHas(raw,d.en_name));
  if(explicit){for(const u of explicit.upazilas||[])if(areaHasName(raw,u.bn_name)||areaHas(raw,u.en_name))return {district:explicit.bn_name,upazila:u.bn_name};}
  for(const d of districts)for(const u of d.upazilas||[])if(areaHasName(raw,u.bn_name)||areaHas(raw,u.en_name))return {district:d.bn_name,upazila:u.bn_name};
  const found=districts.find(d=>areaHasName(raw,d.bn_name)||areaHas(raw,d.en_name));if(found)return {district:found.bn_name,upazila:explicitUpazila};
 }catch(e){console.error('[METHO_ADDRESS_GEO_LOOKUP_FAILED]',String(e));}
 const match=districtAliases.find(([bn,aliases])=>[bn,...aliases].some(x=>areaHas(raw,x)));
 return {district:match?.[0]||'অনির্ধারিত',upazila:explicitUpazila||pu};
}

function formatStoredAddress(address,upazila,district){
 const raw=String(address||'').trim(),u=String(upazila||'').trim(),d=String(district||'').trim();
 const clean=raw.replace(/^(?:গ্রাম\/এরিয়া|এরিয়া|এলাকা|গ্রাম)\s*[:：]?\s*/,'').replace(/[,;،]+\s*(?:উপজেলা\/থানা|উপজেলা|থানা|জেলা|সিটি করপোরেশন)\s*[:：][^,;،]*/g,'').trim();
 if(d==='ঢাকা (শহর)'){
  const north=['উত্তরা','উত্তরা পশ্চিম','তুরাগ','দক্ষিণখান','উত্তরখান','খিলক্ষেত','এয়ারপোর্ট','বিমানবন্দর','গুলশান','বনানী','বাড্ডা','ভাটারা','তেজগাঁও','তেজগাঁও শিল্পাঞ্চল','মিরপুর','পল্লবী','রূপনগর','শাহ আলী','কাফরুল','ক্যান্টনমেন্ট','ভাষানটেক','আদাবর','মোহাম্মদপুর','শেরে বাংলা নগর','দারুস সালাম'];
  const corporation=north.some(x=>u.includes(x))?'ঢাকা উত্তর':'ঢাকা দক্ষিণ';
  return 'এরিয়া: '+clean+', থানা: '+u+', সিটি করপোরেশন: '+corporation;
 }
 return 'গ্রাম/এরিয়া: '+clean+', উপজেলা/থানা: '+u+', জেলা: '+d;
}

function steadfastAddress(address,upazila,district){
 const parts=[],labels={area:'',upazila:'',district:'',corporation:''};
 for(const raw of String(address||'').split(/[;,،]/)){const s=raw.trim();if(!s)continue;const m=s.match(/^(গ্রাম\/এরিয়া|এরিয়া|এলাকা|উপজেলা\/থানা|উপজেলা|থানা|জেলা|সিটি করপোরেশন)\s*[:：]?\s*(.*)$/);if(m){const k=/^(গ্রাম\/এরিয়া|এরিয়া|এলাকা)$/.test(m[1])?'area':/^(উপজেলা\/থানা|উপজেলা|থানা)$/.test(m[1])?'upazila':m[1]==='জেলা'?'district':'corporation';if(m[2]&&!labels[k])labels[k]=m[2].trim();continue;}if(!parts.some(x=>x.toLocaleLowerCase()===s.toLocaleLowerCase()))parts.push(s);}
 const area=labels.area||parts.join(', '),u=labels.upazila||String(upazila||'').trim(),d=labels.district||String(district||'').trim();
 if(d==='ঢাকা (শহর)')return ['এরিয়া: '+area,'থানা: '+u,'সিটি করপোরেশন: '+(labels.corporation||'ঢাকা')].filter(x=>!x.endsWith(': ')).join(', ');
 return ['গ্রাম/এরিয়া: '+area,'উপজেলা/থানা: '+u,'জেলা: '+d].filter(x=>!x.endsWith(': ')).join(', ');
}
const statusNames={pending:'অপেক্ষমাণ',payment_verified:'পেমেন্ট যাচাই সম্পন্ন',accepted:'গৃহীত',rejected:'বাতিল',processing:'প্রসেসিং',shipped:'কুরিয়ারে পাঠানো',delivered:'ডেলিভারি সম্পন্ন',cancelled:'ক্যানসেল'};
async function adminFor(req,env){const t=getCookie(req);if(!t)return null;return await env.DB.prepare("SELECT a.id,a.username,a.display_name FROM sessions s JOIN admins a ON a.id=s.admin_id WHERE s.token_hash=? AND s.expires_at>CURRENT_TIMESTAMP").bind(await sha(t)).first();}
async function steadfast(env,path,method='GET',body){const key=env.STEADFAST_API_KEY,secret=env.STEADFAST_SECRET_KEY;if(!key||!secret)throw new Error('Steadfast API credentials Cloudflare Pages Production environment-এ সেট করা নেই।');let base=String(env.STEADFAST_BASE_URL||'https://portal.steadfast.com.bd/api/v1').trim().replace(/\/+$/,'');if(!/\/api\/v1$/i.test(base))base+='/api/v1';let parsed;try{parsed=new URL(base);}catch{throw new Error('STEADFAST_BASE_URL সঠিক URL নয়।');}if(parsed.protocol!=='https:'||!['portal.steadfast.com.bd','portal.packzy.com'].includes(parsed.hostname))throw new Error('STEADFAST_BASE_URL অবশ্যই Steadfast-এর অনুমোদিত HTTPS API ঠিকানা হতে হবে।');const r=await fetch(base+path,{method,headers:{'Api-Key':key,'Secret-Key':secret,'Content-Type':'application/json','Accept':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});const raw=await r.text();let d={};try{d=raw?JSON.parse(raw):{};}catch{}if(!r.ok||d.status==='error'){const detail=String(d.message||raw||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,280);const ray=r.headers.get('cf-ray');const server=r.headers.get('server');throw new Error((d.message||'Steadfast API অনুরোধ ব্যর্থ (HTTP '+r.status+')')+(detail&&detail!==d.message?' | Response: '+detail:'')+(server?' | Server: '+server:'')+(ray?' | Ray: '+ray:''));}return d;}
const escapeTelegramHtml=value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
async function sendOrderTelegram(env,message){const token=env.TELEGRAM_BOT_TOKEN,chat=env.TELEGRAM_CHAT_ID;if(!token||!chat)return {sent:false,reason:'Telegram not configured'};const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);try{const r=await fetch('https://api.telegram.org/bot'+token+'/sendMessage',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chat,text:message,parse_mode:'HTML',disable_web_page_preview:true}),signal:controller.signal});const d=await r.json().catch(()=>({}));if(!r.ok||d.ok!==true){console.error('[METHO_TELEGRAM_ORDER_FAILED]',r.status,d.description||'Telegram send failed');return {sent:false,reason:d.description||'Telegram send failed'};}return {sent:true};}finally{clearTimeout(timer);}}
const storageConfig=env=>{const base=String(env.SUPABASE_URL||'https://ghhljiclxtgzxndalztj.supabase.co').replace(/\/+$/,'')+'/storage/v1';const branch=String(env.CF_PAGES_BRANCH||'');const defaultBucket=branch&&branch!=='main'?'metho-lite-preview-assets':'metho-lite-assets';const bucket=String(env.SUPABASE_STORAGE_BUCKET||defaultBucket);if(!/^[a-z0-9][a-z0-9_-]{1,62}$/.test(bucket))throw new Error('Storage bucket configuration is invalid.');return {base,bucket};};
async function storeImage(env,value,folder='media'){const s=String(value||'');if(!s.startsWith('data:image/'))return s;if(!/^data:image\/(png|jpeg|webp|gif|avif);base64,/i.test(s))throw new Error('ছবির ফরম্যাট সঠিক নয়।');const key=env.SUPABASE_SERVICE_ROLE_KEY;if(!key)throw new Error('ছবি সংরক্ষণের Storage সংযোগ নেই।');const mime=s.slice(5,s.indexOf(';')).toLowerCase(),ext=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','image/avif':'avif'})[mime];const raw=Uint8Array.from(atob(s.slice(s.indexOf(',')+1)),c=>c.charCodeAt(0));if(!raw.length||raw.length>10485760)throw new Error('ছবিটি ১০ MB সীমার মধ্যে হতে হবে।');const name=folder+'/'+Date.now().toString(36)+'-'+random().slice(0,12)+'.'+ext,{base,bucket}=storageConfig(env);const r=await fetch(base+'/object/'+bucket+'/'+name.split('/').map(encodeURIComponent).join('/'),{method:'POST',headers:{apikey:key,authorization:'Bearer '+key,'content-type':mime,'x-upsert':'false'},body:raw});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||'ছবি Storage-এ সংরক্ষণ করা যায়নি।');return base+'/object/public/'+bucket+'/'+name.split('/').map(encodeURIComponent).join('/');}
async function api(req,env){const u=new URL(req.url),p=u.pathname,m=req.method;
 if(p==='/api/ant-animation'&&m==='GET'){
  const key=env.SUPABASE_SERVICE_ROLE_KEY;
  if(!key)return new Response('Animation storage is not configured',{status:503});
  const {base,bucket}=storageConfig(env);
  const publicUrl=base+'/object/public/'+bucket+'/metho-ant.gif';
  const cacheHeaders={'content-type':'image/gif','cache-control':'public, max-age=86400, stale-while-revalidate=604800'};
  const existing=await fetch(publicUrl);
  if(existing.ok)return new Response(existing.body,{headers:cacheHeaders});
  const source=await fetch('https://metho-bd.pages.dev/metho-ant.gif');
  if(!source.ok)return new Response('Legacy ant animation source unavailable',{status:502});
  const bytes=await source.arrayBuffer();
  if(bytes.byteLength>5*1024*1024)return new Response('Animation file is too large',{status:413});
  const upload=await fetch(base+'/object/'+bucket+'/metho-ant.gif',{method:'POST',headers:{apikey:key,authorization:'Bearer '+key,'content-type':'image/gif','x-upsert':'true'},body:bytes});
  if(!upload.ok){const detail=await upload.text();console.error('Ant animation copy failed:',upload.status,detail);return new Response('Could not copy ant animation to METHO Lite storage',{status:502});}
  return new Response(bytes,{headers:cacheHeaders});
 }
 if(p==='/api/health'&&m==='GET')return json({ok:true,service:'metho-lite'});
 if(p==='/api/visit'&&m==='POST'){const d=await readBody(req),id=String(d?.visitor_id||'');if(!/^[a-f0-9-]{32,36}$/i.test(id))return error('ভিজিটর আইডি সঠিক নয়।');const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dhaka',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());await env.DB.prepare('INSERT INTO site_visitors(visitor_id,visit_date,last_seen) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(visitor_id,visit_date) DO UPDATE SET last_seen=CURRENT_TIMESTAMP').bind(id,date).run();return json({ok:true});}
 if(p==='/api/config'&&m==='GET'){const rows=await env.DB.prepare("SELECT key,value FROM site_settings WHERE key IN ('phone','logo_url','whatsapp_link','messenger_link','primary_color','accent_color')").all();const settings={};for(const x of rows.results){try{settings[x.key]=JSON.parse(x.value);}catch{settings[x.key]=x.value;}}const b=await env.DB.prepare('SELECT id,image_url,alt_text FROM hero_banners WHERE active=1 ORDER BY sort_order,id').all();return json({settings,banners:b.results},200,{'cache-control':'public, max-age=60, stale-while-revalidate=300'});}
 if(p==='/api/products'&&m==='GET'){const r=await env.DB.prepare("SELECT p.id,p.name,p.description,p.image_url,v.id variant_id,v.label,v.weight_kg,v.price_paisa FROM products p LEFT JOIN variants v ON v.product_id=p.id AND v.active=1 WHERE p.active=1 ORDER BY p.sort_order,v.weight_kg").all();const map=new Map();for(const x of r.results){if(!map.has(x.id))map.set(x.id,{id:x.id,name:x.name,description:x.description,image_url:x.image_url,variants:[]});if(x.variant_id)map.get(x.id).variants.push({id:x.variant_id,label:x.label,weight_kg:x.weight_kg,price_paisa:x.price_paisa});}return json({products:Array.from(map.values())},200,{'cache-control':'public, max-age=60, stale-while-revalidate=300'});}
 if(p==='/api/auth/status'&&m==='GET'){const c=await env.DB.prepare('SELECT COUNT(*) AS n FROM admins').first();return json({configured:c.n===2,logged_in:!!(await adminFor(req,env))});}
 if(p==='/api/auth/setup'&&m==='POST'){const c=await env.DB.prepare('SELECT COUNT(*) AS n FROM admins').first();if(c.n!==0)return error('অ্যাডমিন সেটআপ ইতোমধ্যে সম্পন্ন হয়েছে।',409);const d=await readBody(req);if(!d||!Array.isArray(d.admins)||d.admins.length!==2)return error('ঠিক দুইজন অ্যাডমিনের তথ্য দিন।');const usernames=new Set();const stmts=[env.DB.prepare('INSERT INTO admin_setup_guard(id) VALUES(1)')];for(const a of d.admins){if(!/^[a-zA-Z0-9_.-]{3,30}$/.test(a.username||'')||!a.display_name||String(a.display_name).length>60||typeof a.password!=='string'||a.password.length<12||a.password.length>128)return error('ইউজারনেম, নাম বা পাসওয়ার্ডের নিয়ম ঠিক নেই।');usernames.add(a.username.toLowerCase());const salt=random(),ph=await hashPassword(a.password,salt);stmts.push(env.DB.prepare('INSERT INTO admins(username,display_name,password_hash,password_salt) VALUES(?,?,?,?)').bind(a.username,a.display_name,ph,salt));}if(usernames.size!==2)return error('দুইটি আলাদা ইউজারনেম দিন।');try{await env.DB.batch(stmts);}catch{return error('সেটআপ সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।',409);}return json({ok:true});}
 if(p==='/api/auth/login'&&m==='POST'){const d=await readBody(req);if(!d||typeof d.username!=='string'||typeof d.password!=='string')return error('ইউজারনেম ও পাসওয়ার্ড দিন।');const a=await env.DB.prepare('SELECT * FROM admins WHERE username=?').bind(d.username).first();if(!a||await hashPassword(d.password,a.password_salt)!==a.password_hash)return error('লগইন তথ্য সঠিক নয়।',401);const t=random();await env.DB.prepare("INSERT INTO sessions(token_hash,admin_id,expires_at) VALUES(?,?,datetime('now','+7 days'))").bind(await sha(t),a.id).run();return json({ok:true},200,{'set-cookie':cookie(t,604800)});}
 if(p==='/api/auth/logout'&&m==='POST'){const t=getCookie(req);if(t)await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha(t)).run();return json({ok:true},200,{'set-cookie':cookie('',0)});}
 if(p==='/api/orders'&&m==='POST'){const d=await readBody(req);if(!d||!d.customer_name||!d.phone||!d.address||!Array.isArray(d.items)||d.items.length<1||d.items.length>10||!['cod','advance'].includes(d.payment_method))return error('অর্ডারের প্রয়োজনীয় তথ্য পূরণ করুন।');const name=String(d.customer_name).trim();let phone=String(d.phone).replace(/[\s()-]/g,'');if(phone.startsWith('+880'))phone='0'+phone.slice(4);else if(phone.startsWith('880'))phone='0'+phone.slice(3);if(name.length<2||name.length>80||!/^01[3-9]\d{8}$/.test(phone)||String(d.address).trim().length<5)return error('নাম, মোবাইল নম্বর বা ঠিকানা সঠিক নয়।');const recent=await env.DB.prepare("SELECT id FROM orders WHERE phone=? AND created_at>=datetime('now','-60 seconds') ORDER BY id DESC LIMIT 1").bind(phone).first();if(recent)return error('এক মিনিটের মধ্যে আবার অর্ডার করা যাবে না। অনুগ্রহ করে অপেক্ষা করুন।',429);const ids=d.items.map(x=>Number(x.variant_id));if(new Set(ids).size!==ids.length||ids.some(x=>!Number.isInteger(x)||x<1))return error('পণ্যের তালিকা সঠিক নয়।');const marks=ids.map(()=>'?').join(',');const got=await env.DB.prepare('SELECT v.id,v.product_id,v.label,v.weight_kg,v.price_paisa,v.stock_qty,p.name product_name FROM variants v JOIN products p ON p.id=v.product_id WHERE v.active=1 AND p.active=1 AND v.id IN ('+marks+')').bind(...ids).all();if(got.results.length!==ids.length)return error('নির্বাচিত পণ্য পাওয়া যাচ্ছে না।',409);const byId=new Map(got.results.map(x=>[x.id,x]));let total=0,billableGrams=0;const lines=[];for(const it of d.items){const v=byId.get(Number(it.variant_id)),q=Number(it.quantity);if(!Number.isInteger(q)||q<1||q>10||v.price_paisa<=0)return error('পণ্যের পরিমাণ বা মূল্য সঠিক নয়।');const line=v.price_paisa*q;total+=line;billableGrams+=Number(v.weight_kg)*1000*q;lines.push({v,q,line});}if(total>100000000)return error('অর্ডারের মোট মূল্য সীমার বাইরে।');const area=await resolveAddressArea(d.address,d.district,d.upazila),district=area.district,upazila=area.upazila;if(!district||district==='অনির্ধারিত')return error('ঠিকানা থেকে জেলা/এলাকা নিশ্চিত করা যায়নি। অনুগ্রহ করে ঠিকানায় উপজেলা ও জেলার নাম যোগ করে আবার চেষ্টা করুন।');const baseDeliveryFee=calculateBaseDeliveryFee(district,billableGrams);const codFee=d.payment_method==='cod'?Math.ceil(total/100):0;const deliveryFee=baseDeliveryFee+codFee;const payableTotal=total+deliveryFee;const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Dhaka',year:'2-digit',month:'2-digit',day:'2-digit'}).formatToParts(new Date()),part=k=>parts.find(x=>x.type===k).value,dateKey=part('year')+part('month')+part('day');const seq=await env.DB.batch([env.DB.prepare('INSERT INTO order_sequences(date_key,last_seq) VALUES(?,1) ON CONFLICT(date_key) DO UPDATE SET last_seq=last_seq+1').bind(dateKey),env.DB.prepare('SELECT last_seq FROM order_sequences WHERE date_key=?').bind(dateKey)]);const n=Number(seq[1]?.results?.[0]?.last_seq||0);if(!n)return error('অর্ডার নম্বর তৈরি করা যায়নি। আবার চেষ্টা করুন।',503);const orderCode='ML'+dateKey+'-'+String(n).padStart(5,'0');const lat=d.latitude==null||d.latitude===''?null:Number(d.latitude),lon=d.longitude==null||d.longitude===''?null:Number(d.longitude);if((lat===null)!==(lon===null)||lat!==null&&(!Number.isFinite(lat)||lat<-90||lat>90)||lon!==null&&(!Number.isFinite(lon)||lon<-180||lon>180))return error('GPS লোকেশনের তথ্য সঠিক নয়।');const stmts=[env.DB.prepare('INSERT INTO orders(order_code,customer_name,phone,district,upazila,address,payment_method,subtotal_paisa,delivery_fee_paisa,billable_weight_grams,note,latitude,longitude,courier_disabled) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,1)').bind(orderCode,name,phone,String(district).slice(0,60),String(upazila).slice(0,60),formatStoredAddress(String(d.address).trim(),upazila,district),d.payment_method,total,deliveryFee,billableGrams,String(d.note||'').slice(0,300),lat,lon)];for(const x of lines){stmts.push(env.DB.prepare('INSERT INTO order_items(order_id,variant_id,product_name,variant_label,quantity,unit_price_paisa,line_total_paisa) VALUES((SELECT id FROM orders WHERE order_code=?),?,?,?,?,?,?)').bind(orderCode,x.v.id,x.v.product_name,x.v.label,x.q,x.v.price_paisa,x.line));}try{await env.DB.batch(stmts);}catch{return error('অর্ডার জমা হয়নি। আবার চেষ্টা করুন।',409);}const inserted=await env.DB.prepare('SELECT id FROM orders WHERE order_code=?').bind(orderCode).first();if(!inserted)return error('অর্ডার জমা হয়নি। আবার চেষ্টা করুন।',409);const moneyBn=n=>'৳'+(Number(n||0)/100).toLocaleString('en-US');
const esc=escapeTelegramHtml;
const itemLines=lines.map((x,i)=>(i+1)+'. '+esc(x.v.product_name)+' — '+esc(x.v.label)+' × '+x.q);
const addressParts=[String(d.address||'').trim(),upazila?'উপজেলা: '+upazila:'',district&&district!=='অনির্ধারিত'?'জেলা: '+district:''].filter(Boolean).map(esc);
const telegramMessage='🛍️ <b>মেঠোতে নতুন অর্ডার</b>\n'+'<b>অর্ডার:</b> '+esc(orderCode)+'\n'+'<b>নাম:</b> '+esc(name)+'\n'+'<b>মোবাইল:</b> '+esc(phone)+'\n'+'<b>ঠিকানা:</b> '+addressParts.join(', ')+'\n'+'<b>পণ্যসমূহ:</b>\n'+itemLines.join('\n')+'\n'+'<b>মোট:</b> '+moneyBn(payableTotal)+'\n'+'<b>পেমেন্ট:</b> '+(d.payment_method==='cod'?'ক্যাশ অন ডেলিভারি':'অগ্রিম পেমেন্ট')+'\n'+'<b>অবস্থা:</b> পেন্ডিং — অ্যাডমিনের অনুমোদন অপেক্ষমাণ';
try{await sendOrderTelegram(env,telegramMessage);}catch(e){console.error('[METHO_TELEGRAM_ORDER_ERROR]',String(e?.message||e));}return json({ok:true,order_code:orderCode,subtotal_paisa:total,delivery_fee_paisa:deliveryFee,total_paisa:payableTotal,billable_weight_grams:billableGrams,cooldown_seconds:60});}
 if(p==='/api/invoice'&&m==='POST'){const d=await readBody(req),digits=s=>String(s||'').replace(/[০-৯]/g,x=>String('০১২৩৪৫৬৭৮৯'.indexOf(x))),code=digits(d?.orderCode).trim().toUpperCase();let phone=digits(d?.phone).replace(/[\s()-]/g,'');if(phone.startsWith('+880'))phone='0'+phone.slice(4);else if(phone.startsWith('880'))phone='0'+phone.slice(3);if(!/^ML[0-9]{6}-[0-9]{5}$/.test(code)||!/^01[3-9]\d{8}$/.test(phone))return error('সঠিক অর্ডার নম্বর ও ১১ সংখ্যার মোবাইল নম্বর দিন।');const o=await env.DB.prepare('SELECT id,order_code,customer_name,phone,district,address,payment_method,subtotal_paisa,delivery_fee_paisa,created_at FROM orders WHERE order_code=? AND phone=? LIMIT 1').bind(code,phone).first();if(!o)return error('এই অর্ডার নম্বর ও মোবাইল নম্বরের মিল পাওয়া যায়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।',404);const ir=await env.DB.prepare('SELECT oi.product_name,v.weight_kg AS package_kg,oi.quantity,oi.unit_price_paisa AS unit_price,oi.line_total_paisa AS line_total FROM order_items oi JOIN variants v ON v.id=oi.variant_id WHERE oi.order_id=? ORDER BY oi.id').bind(o.id).all();const rows=await env.DB.prepare('SELECT key,value FROM site_settings WHERE key IN (\'logo_url\',\'brand_name\',\'invoice_title\',\'invoice_note\',\'invoice_footer\')').all(),settings={};for(const x of rows.results){try{settings[x.key]=JSON.parse(x.value);}catch{settings[x.key]=x.value;}}return json({ok:true,order:{order_code:o.order_code,customer_name:o.customer_name,phone_masked:phone.slice(0,5)+'***',address:o.address,created_at:o.created_at,payment_method:o.payment_method==='advance'?'ADVANCE':'COD',delivery_fee:Number(o.delivery_fee_paisa||0)/100,total_amount:(Number(o.subtotal_paisa||0)+Number(o.delivery_fee_paisa||0))/100,items:ir.results.map(x=>({...x,unit_price:Number(x.unit_price||0)/100,line_total:Number(x.line_total||0)/100}))},settings:{brand_name:settings.brand_name||'মেঠো',logo_url:settings.logo_url||'',invoice_title:settings.invoice_title||'বিক্রয় ইনভয়েস',invoice_note:settings.invoice_note||'',invoice_footer:settings.invoice_footer||'মেঠো থেকে কেনাকাটার জন্য ধন্যবাদ।'}});}
 if(p.startsWith('/api/admin/')){const a=await adminFor(req,env);if(!a)return error('লগইন প্রয়োজন।',401);
  if(p==='/api/admin/media/migrate-legacy'&&m==='POST'){
   if(env.MEDIA_MIGRATION_ENABLED!=='true')return error('মিডিয়া স্থানান্তর বন্ধ আছে। Preview-তে আলাদা অনুমোদন ও যাচাই ছাড়া চালানো যাবে না।',403);
   if(!env.SUPABASE_SERVICE_ROLE_KEY)return error('Storage secret অনুপস্থিত।',503);
   const d=await readBody(req),dryRun=d?.dry_run!==false,limit=Math.max(1,Math.min(5,Number.isInteger(Number(d?.limit))?Number(d.limit):2));
   const [ps,bs,logoRow]=await Promise.all([
    env.DB.prepare("SELECT id,image_url FROM products WHERE image_url LIKE 'data:image/%' ORDER BY id LIMIT ?").bind(limit).all(),
    env.DB.prepare("SELECT id,image_url FROM hero_banners WHERE image_url LIKE 'data:image/%' ORDER BY id LIMIT ?").bind(limit).all(),
    env.DB.prepare("SELECT value FROM site_settings WHERE key='logo_url'").first()
   ]);
   let logoValue=logoRow?.value;try{logoValue=JSON.parse(logoValue);}catch{}
   const candidates=[...ps.results.map(x=>({type:'product',id:String(x.id),value:x.image_url})),...bs.results.map(x=>({type:'banner',id:String(x.id),value:x.image_url}))];
   if(typeof logoValue==='string'&&logoValue.startsWith('data:image/'))candidates.push({type:'logo',id:'logo_url',value:logoValue});
   candidates.splice(limit);
   if(dryRun)return json({dry_run:true,batch_limit:limit,batch_candidates:candidates.length,backup:'প্রতিটি আসল ছবি Storage-এ রেখে backup reference তৈরি হবে; Base64 আর D1-এ থাকবে না।',next_step:'POST-এ dry_run:false এবং confirm:true দিয়ে সর্বোচ্চ নির্ধারিত batch চালান।'});
   if(d?.confirm!==true)return error('স্থানান্তরের জন্য confirm:true প্রয়োজন।',400);
   await env.DB.prepare("CREATE TABLE IF NOT EXISTS media_migration_backups (id INTEGER PRIMARY KEY AUTOINCREMENT,entity_type TEXT NOT NULL,entity_id TEXT NOT NULL,original_storage_url TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE(entity_type,entity_id))").run();
   const migrated={products:0,banners:0,logo:0},failed=[];
   for(const x of candidates){
    try{
     const folder=x.type==='product'?'media/products':x.type==='banner'?'media/banners':'media/logo';
     const url=await storeImage(env,x.value,folder);
     let update;
     if(x.type==='product')update=env.DB.prepare('UPDATE products SET image_url=? WHERE id=? AND image_url=?').bind(url,Number(x.id),x.value);
     else if(x.type==='banner')update=env.DB.prepare('UPDATE hero_banners SET image_url=? WHERE id=? AND image_url=?').bind(url,Number(x.id),x.value);
     else update=env.DB.prepare("UPDATE site_settings SET value=?,updated_at=CURRENT_TIMESTAMP WHERE key='logo_url' AND value=?").bind(JSON.stringify(url),JSON.stringify(x.value));
     const backup=env.DB.prepare('INSERT INTO media_migration_backups(entity_type,entity_id,original_storage_url) VALUES(?,?,?) ON CONFLICT(entity_type,entity_id) DO NOTHING').bind(x.type,x.id,url);
     const result=await env.DB.batch([backup,update]);
     if(Number(result?.[1]?.meta?.changes||0)>0)migrated[x.type==='product'?'products':x.type==='banner'?'banners':'logo']++;
    }catch(e){failed.push({type:x.type,id:x.id,message:String(e.message||'Migration failed').slice(0,180)});}
   }
   return json({ok:failed.length===0,migrated,failed,remaining:'পরবর্তী dry-run-এ অবশিষ্ট ছবি দেখা যাবে।',backup:'মূল ছবির Storage URL media_migration_backups টেবিলে রাখা হয়েছে; rollback সম্ভব।'});
  }


 if(p==='/api/admin/orders/new-count'&&m==='GET'){const r=await env.DB.prepare("SELECT COUNT(*) AS count FROM orders o LEFT JOIN admin_order_reads ar ON ar.order_id=o.id AND ar.admin_id=? WHERE o.status IN ('pending','payment_verified') AND ar.order_id IS NULL").bind(a.id).first();return json({count:Number(r?.count||0)});}
 if(p==='/api/admin/orders'&&m==='GET'){const r=await env.DB.prepare("SELECT o.*,CASE WHEN o.status IN ('pending','payment_verified') AND ar.order_id IS NULL THEN 1 ELSE 0 END AS is_new_for_me FROM orders o LEFT JOIN admin_order_reads ar ON ar.order_id=o.id AND ar.admin_id=? ORDER BY o.id DESC LIMIT 300").bind(a.id).all();const ids=r.results.map(o=>o.id),items=ids.length?await env.DB.prepare('SELECT order_id,variant_id,product_name,variant_label,quantity,unit_price_paisa,line_total_paisa FROM order_items WHERE order_id IN ('+ids.map(()=>'?').join(',')+') ORDER BY order_id,id').bind(...ids).all():{results:[]};const grouped=new Map();for(const item of items.results){if(!grouped.has(item.order_id))grouped.set(item.order_id,[]);grouped.get(item.order_id).push({variant_id:item.variant_id,product_name:item.product_name,variant_label:item.variant_label,quantity:item.quantity,unit_price_paisa:item.unit_price_paisa,line_total_paisa:item.line_total_paisa});}const out=r.results.map(o=>({...o,status_bn:statusNames[o.status]||o.status,items:grouped.get(o.id)||[]}));return json({orders:out});}
 const orderView=p.match(/^\/api\/admin\/orders\/(\d+)\/view$/);if(orderView&&m==='POST'){const id=Number(orderView[1]);const exists=await env.DB.prepare('SELECT id FROM orders WHERE id=?').bind(id).first();if(!exists)return error('অর্ডার পাওয়া যায়নি।',404);await env.DB.prepare('INSERT INTO admin_order_reads(admin_id,order_id) VALUES(?,?) ON CONFLICT(admin_id,order_id) DO NOTHING').bind(a.id,id).run();return json({ok:true});}
 const om=p.match(/^\/api\/admin\/orders\/(\d+)$/);if(om&&m==='PATCH'){const d=await readBody(req),orderId=Number(om[1]);if(d&&d.edit===true){
 const current=await env.DB.prepare('SELECT status,courier_consignment_id,courier_tracking_code,payment_method FROM orders WHERE id=?').bind(orderId).first();
 if(!current)return error('অর্ডার পাওয়া যায়নি।',404);
 if(['rejected','cancelled','shipped','delivered'].includes(current.status)||current.courier_consignment_id||current.courier_tracking_code)return error('এই অর্ডারটি কুরিয়ারে পাঠানো বা চূড়ান্ত হয়েছে; সম্পাদনা করা যাবে না।',409);
 const name=String(d.customer_name||'').trim(),digits=x=>String(x||'').replace(/[০-৯]/g,x=>String('০১২৩৪৫৬৭৮৯'.indexOf(x)));
 const phone=digits(d.phone).replace(/[\s()+-]/g,'');
 const address=String(d.address||'').trim(),area=await resolveAddressArea(address,d.district,d.upazila),district=area.district,upazila=area.upazila;
 if(!district||district==='অনির্ধারিত')return error('ঠিকানা থেকে জেলা/এলাকা নিশ্চিত করা যায়নি। উপজেলা ও জেলার নামসহ ঠিকানা দিন।');
 if(name.length<2||name.length>80)return error('গ্রাহকের নাম ২–৮০ অক্ষরের মধ্যে দিন।');
 if(!/^01[3-9]\d{8}$/.test(phone))return error('সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।');
 if(address.length<5||address.length>500)return error('সম্পূর্ণ ঠিকানা অন্তত ৫ অক্ষর এবং সর্বোচ্চ ৫০০ অক্ষরের মধ্যে দিন।');
 const requested=Array.isArray(d.items)?d.items:[];if(!requested.length||requested.length>12)return error('কমপক্ষে একটি এবং সর্বোচ্চ ১২টি পণ্য লাইন দিন।');
 const quantities=new Map();for(const x of requested){const vid=Number(x.variant_id),q=Number(x.quantity);if(!Number.isInteger(vid)||vid<1||!Number.isInteger(q)||q<1||q>10)return error('পণ্যের ভ্যারিয়েন্ট বা পরিমাণ সঠিক নয়।');quantities.set(vid,(quantities.get(vid)||0)+q);}
 if([...quantities.values()].some(q=>q>10))return error('একই পণ্যের সর্বোচ্চ পরিমাণ ১০টি হতে পারবে।');
 const ids=[...quantities.keys()],marks=ids.map(()=>'?').join(',');
 const found=await env.DB.prepare('SELECT v.id,v.label,v.weight_kg,v.price_paisa,p.name product_name FROM variants v JOIN products p ON p.id=v.product_id WHERE v.active=1 AND p.active=1 AND v.id IN ('+marks+')').bind(...ids).all();
 if(found.results.length!==ids.length)return error('নির্বাচিত পণ্যের কোনোটি বর্তমানে বিক্রির জন্য নেই।',409);
 let subtotal=0,billableGrams=0;const lines=[];for(const v of found.results){const q=quantities.get(v.id),line=Number(v.price_paisa)*q;if(!Number.isSafeInteger(line)||line<=0)return error('পণ্যের মূল্য সঠিক নয়।');subtotal+=line;billableGrams+=Number(v.weight_kg)*1000*q;lines.push({v,q,line});}
 if(subtotal>100000000)return error('অর্ডারের মোট মূল্য সীমার বাইরে।');
 const baseDeliveryFee=calculateBaseDeliveryFee(district,billableGrams);
 const deliveryFee=baseDeliveryFee+(current.payment_method==='cod'?Math.ceil(subtotal/100):0);
 const batch=[env.DB.prepare('UPDATE orders SET customer_name=?,phone=?,district=?,upazila=?,address=?,subtotal_paisa=?,delivery_fee_paisa=?,billable_weight_grams=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND courier_consignment_id IS NULL AND courier_tracking_code IS NULL').bind(name,phone,district,upazila,formatStoredAddress(address,upazila,district),subtotal,deliveryFee,billableGrams,orderId),env.DB.prepare('DELETE FROM order_items WHERE order_id=?').bind(orderId)];
 for(const x of lines)batch.push(env.DB.prepare('INSERT INTO order_items(order_id,variant_id,product_name,variant_label,quantity,unit_price_paisa,line_total_paisa) VALUES(?,?,?,?,?,?,?)').bind(orderId,x.v.id,x.v.product_name,x.v.label,x.q,x.v.price_paisa,x.line));
 try{await env.DB.batch(batch);}catch(e){return error('অর্ডার সংরক্ষণ হয়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।',409);}
 return json({ok:true,message:'অর্ডার সংশোধন সংরক্ষিত হয়েছে।',subtotal_paisa:subtotal,delivery_fee_paisa:deliveryFee,billable_weight_grams:billableGrams});
 }if(d&&typeof d.courier_disabled==='boolean'){await env.DB.prepare('UPDATE orders SET courier_disabled=? WHERE id=?').bind(d.courier_disabled?1:0,orderId).run();return json({ok:true});}if(!d||!Object.prototype.hasOwnProperty.call(statusNames,d.status))return error('স্ট্যাটাস সঠিক নয়।');const current=await env.DB.prepare('SELECT status FROM orders WHERE id=?').bind(orderId).first();if(!current)return error('অর্ডার পাওয়া যায়নি।',404);if(['rejected','cancelled'].includes(current.status))return error('বাতিল অর্ডারের স্ট্যাটাস আর পরিবর্তন করা যাবে না।',409);if(['rejected','cancelled'].includes(d.status)){const items=await env.DB.prepare('SELECT variant_id,SUM(quantity) quantity FROM order_items WHERE order_id=? GROUP BY variant_id').bind(orderId).all();const batch=[];for(const it of items.results)batch.push(env.DB.prepare("UPDATE variants SET stock_qty=stock_qty+? WHERE id=? AND EXISTS(SELECT 1 FROM orders WHERE id=? AND status NOT IN ('rejected','cancelled'))").bind(it.quantity,it.variant_id,orderId));batch.push(env.DB.prepare("UPDATE orders SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND status NOT IN ('rejected','cancelled')").bind(d.status,orderId));await env.DB.batch(batch);}else if(d.status==='accepted') await env.DB.prepare("UPDATE orders SET status=?,courier_disabled=0,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(d.status,orderId).run();else await env.DB.prepare("UPDATE orders SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(d.status,orderId).run();return json({ok:true});}
 if(p==='/api/admin/variants'&&m==='GET'){const r=await env.DB.prepare('SELECT v.id,v.product_id,v.label,v.price_paisa,v.stock_qty,p.name product_name FROM variants v JOIN products p ON p.id=v.product_id ORDER BY p.sort_order,v.weight_kg').all();return json({variants:r.results});}
 const vm=p.match(/^\/api\/admin\/variants\/(\d+)$/);if(vm&&m==='PATCH'){const d=await readBody(req),price=Number(d?.price_taka);if(!Number.isSafeInteger(price)||price<0||price>1000000)return error('বিক্রয়মূল্য সঠিক নয়।');const r=await env.DB.prepare('UPDATE variants SET price_paisa=? WHERE id=?').bind(price*100,Number(vm[1])).run();if(!r.meta.changes)return error('ভ্যারিয়েন্ট পাওয়া যায়নি।',404);return json({ok:true});}
 if(p==='/api/admin/products'&&m==='GET'){const r=await env.DB.prepare('SELECT id,slug,name,description,image_url,active,sort_order FROM products ORDER BY sort_order,id').all();return json({products:r.results});}
 if(p==='/api/admin/products'&&m==='POST'){const d=await readBody(req),name=String(d?.name||'').trim(),variants=Array.isArray(d?.variants)?d.variants:[];let productImage=String(d?.image_url||'');try{productImage=await storeImage(env,productImage,'media/products');}catch(e){return error(e.message,503);}if(name.length<2||name.length>100)return error('পণ্যের নাম দিন।');if(variants.length!==2||![1,2].every(w=>variants.some(v=>Number(v.weight_kg)===w&&Number.isSafeInteger(Number(v.price_taka))&&Number(v.price_taka)>=0&&Number(v.price_taka)<=1000000)))return error('১ ও ২ কেজির সঠিক বিক্রয়মূল্য দিন।');const slug='item-'+Date.now().toString(36);const r=await env.DB.prepare('INSERT INTO products(slug,name,description,image_url,sort_order) VALUES(?,?,?,?,(SELECT COALESCE(MAX(sort_order),0)+1 FROM products))').bind(slug,name,String(d.description||'').slice(0,1500),productImage.slice(0,2000)).run();const id=r.meta.last_row_id;const byWeight=w=>variants.find(v=>Number(v.weight_kg)===w);await env.DB.batch([env.DB.prepare('INSERT INTO variants(product_id,label,weight_kg,price_paisa,stock_qty) VALUES(?,?,1,?,?)').bind(id,'১ কেজি',Number(byWeight(1).price_taka)*100,0),env.DB.prepare('INSERT INTO variants(product_id,label,weight_kg,price_paisa,stock_qty) VALUES(?,?,2,?,?)').bind(id,'২ কেজি',Number(byWeight(2).price_taka)*100,0)]);return json({ok:true,id});}
 const pm=p.match(/^\/api\/admin\/products\/(\d+)$/);if(pm&&m==='PATCH'){const d=await readBody(req),name=String(d?.name||'').trim();if(name.length<2||name.length>100)return error('পণ্যের নাম সঠিক নয়।');let productImage=String(d.image_url||'');try{productImage=await storeImage(env,productImage,'media/products');}catch(e){return error(e.message,503);}const r=await env.DB.prepare('UPDATE products SET name=?,description=?,image_url=?,active=? WHERE id=?').bind(name,String(d.description||'').slice(0,1500),productImage.slice(0,2000),d.active===false?0:1,Number(pm[1])).run();if(!r.meta.changes)return error('পণ্য পাওয়া যায়নি।',404);return json({ok:true});}
 if(p.startsWith('/api/admin/files')){
  const key=env.SUPABASE_SERVICE_ROLE_KEY,{base,bucket}=storageConfig(env);
  if(!key)return error('File Manager চালু করতে Cloudflare-এ SUPABASE_SERVICE_ROLE_KEY secret যুক্ত করতে হবে।',503);
  const headers={apikey:key,authorization:'Bearer '+key,'content-type':'application/json'};
  const trimSlashes=s=>{s=String(s||'');while(s.startsWith('/'))s=s.slice(1);while(s.endsWith('/'))s=s.slice(0,-1);return s;};const safePath=s=>{s=trimSlashes(s);if(!s||s.length>500||s.split('/').some(x=>!x||x==='.'||x==='..'||x.indexOf(String.fromCharCode(92))>=0||Array.from(x).some(c=>c.charCodeAt(0)<32)))return null;return s;};
  const storage=async(path,method='GET',body)=>fetch(base+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
  if(p==='/api/admin/files'&&m==='GET'){
   const prefix=trimSlashes(u.searchParams.get('prefix'));
   if(prefix.length>400||prefix.split('/').some(x=>x==='..'))return error('ফোল্ডারের পথ সঠিক নয়।');
   const offset=Math.max(0,Math.min(100000,Number.parseInt(u.searchParams.get('offset')||'0',10)||0));
   const r=await storage('/object/list/'+bucket,'POST',{prefix:prefix?prefix+'/':'',limit:100,offset,sortBy:{column:'created_at',order:'desc'}});
   const d=await r.json().catch(()=>({}));
   if(!r.ok)return error(d.message||'ফাইল তালিকা আনা যায়নি।',r.status);
   const [products,settings,banners]=await Promise.all([
    env.DB.prepare('SELECT image_url FROM products').all(),
    env.DB.prepare('SELECT value FROM site_settings').all(),
    env.DB.prepare('SELECT image_url FROM hero_banners').all()
   ]);
   const usedUrls=new Set();
   const collectUrls=(value,depth=0)=>{
    if(depth>6||value==null)return;
    if(typeof value==='string'){
     const s=value.trim();
     if(/^https?:\/\//i.test(s)){usedUrls.add(s.split('?')[0]);return;}
     try{const parsed=JSON.parse(s);if(parsed!==value)collectUrls(parsed,depth+1);}catch{}
    }else if(Array.isArray(value))value.forEach(x=>collectUrls(x,depth+1));
    else if(typeof value==='object')Object.values(value).forEach(x=>collectUrls(x,depth+1));
   };
   products.results.forEach(x=>collectUrls(x.image_url));
   settings.results.forEach(x=>collectUrls(x.value));
   banners.results.forEach(x=>collectUrls(x.image_url));
   const publicBase=base+'/object/public/'+bucket+'/';
   const files=(Array.isArray(d)?d:[]).filter(x=>x.name).map(x=>{
    const name=String(x.name),path=[prefix,name].filter(Boolean).join('/');
    const isFolder=!x.id&&!x.metadata;
    const url=publicBase+path.split('/').map(encodeURIComponent).join('/');
    return {name,path,id:x.id||null,metadata:x.metadata||{},created_at:x.created_at||x.updated_at||null,isFolder,url:isFolder?'':url,used:!isFolder&&(path==='metho-ant.gif'||usedUrls.has(url))};
   });
   const usedBytes=files.reduce((n,x)=>n+Number(x.metadata?.size||0),0);
   return json({prefix,files,used_bytes:usedBytes,public_base:publicBase,bucket,offset,hasMore:Array.isArray(d)&&d.length===100});
  }
if(p==='/api/admin/files/upload'&&m==='POST'){const d=await readBody(req),name=String(d?.name||''),folder=trimSlashes(d?.folder);const mime=String(d?.mime||'');if(!/^[a-zA-Z0-9._ -]{1,150}$/.test(name)||!['image/jpeg','image/png','image/webp','image/avif','image/gif'].includes(mime)||typeof d?.data!=='string'||d.data.length>14000000)return error('ফাইলের নাম, ধরন বা আকার সঠিক নয়।');const path=safePath((folder?folder+'/':'')+name);if(!path)return error('ফাইলের পথ সঠিক নয়।');let raw;try{raw=Uint8Array.from(atob(d.data.replace(/^data:[^,]+,/,'').replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));}catch{return error('ফাইল পড়া যায়নি।');}if(!raw.length||raw.length>10485760)return error('ফাইল সর্বোচ্চ ১০ MB হতে পারবে।');const r=await fetch(base+'/object/'+bucket+'/'+path.split('/').map(encodeURIComponent).join('/'),{method:'POST',headers:{apikey:key,authorization:'Bearer '+key,'content-type':mime,'x-upsert':'true'},body:raw});const d2=await r.json().catch(()=>({}));if(!r.ok)return error(d2.message||'আপলোড ব্যর্থ হয়েছে।',r.status);return json({ok:true,path,url:base+'/object/public/'+bucket+'/'+path.split('/').map(encodeURIComponent).join('/')});}
  if(p==='/api/admin/files/folder'&&m==='POST'){const d=await readBody(req),raw=String(d?.path||''),path=safePath(raw),parts=path?path.split('/'):[];if(!path||parts.some(x=>! /^[a-zA-Z0-9._ -]{1,80}$/.test(x)))return error('ফোল্ডারের নাম সঠিক নয়।');const png=Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/n2cAAAAASUVORK5CYII='),c=>c.charCodeAt(0));const r=await fetch(base+'/object/'+bucket+'/'+(path+'/.folder.png').split('/').map(encodeURIComponent).join('/'),{method:'POST',headers:{apikey:key,authorization:'Bearer '+key,'content-type':'image/png','x-upsert':'true'},body:png});const d2=await r.json().catch(()=>({}));if(!r.ok)return error(d2.message||'ফোল্ডার তৈরি করা যায়নি।',r.status);return json({ok:true});}
  if(p==='/api/admin/files/rename'&&m==='POST'){const d=await readBody(req),from=safePath(d?.from),to=safePath(d?.to);if(!from||!to)return error('ফাইলের নাম সঠিক নয়।');if(from==='metho-ant.gif')return error('পিঁপড়ার অ্যানিমেশন ওয়েবসাইটে ব্যবহৃত — এটি rename করা যাবে না।',409);const oldUrl=base+'/object/public/'+bucket+'/'+from.split('/').map(encodeURIComponent).join('/');const refs=await Promise.all([env.DB.prepare('SELECT image_url FROM products').all(),env.DB.prepare("SELECT value FROM site_settings WHERE key='logo_url'").first(),env.DB.prepare('SELECT image_url FROM hero_banners').all()]);const used=[...refs[0].results.map(x=>x.image_url),refs[1]?.value,...refs[2].results.map(x=>x.image_url)].some(x=>String(x||'').includes(oldUrl));if(used)return error('এই ফাইলটি বর্তমানে ওয়েবসাইটে ব্যবহৃত হচ্ছে। আগে ছবির রেফারেন্স পরিবর্তন করুন।',409);const r=await storage('/object/move','POST',{bucketId:bucket,sourceKey:from,destinationKey:to});const d2=await r.json().catch(()=>({}));if(!r.ok)return error(d2.message||'নাম পরিবর্তন করা যায়নি।',r.status);return json({ok:true});}
  if(p==='/api/admin/files/delete'&&m==='POST'){const d=await readBody(req),paths=Array.isArray(d?.paths)?d.paths:[];if(!paths.length||paths.length>50)return error('এক থেকে ৫০টি ফাইল নির্বাচন করুন।');const clean=paths.map(safePath);if(clean.some(x=>!x))return error('ফাইলের পথ সঠিক নয়।');if(clean.includes('metho-ant.gif'))return error('পিঁপড়ার অ্যানিমেশন ওয়েবসাইটে ব্যবহৃত — এটি ডিলিট করা যাবে না।',409);const refs=await Promise.all([env.DB.prepare('SELECT image_url FROM products').all(),env.DB.prepare("SELECT value FROM site_settings WHERE key='logo_url'").first(),env.DB.prepare('SELECT image_url FROM hero_banners').all()]);const urls=[...refs[0].results.map(x=>x.image_url),refs[1]?.value,...refs[2].results.map(x=>x.image_url)].map(x=>String(x||''));for(const path of clean){const url=base+'/object/public/'+bucket+'/'+path.split('/').map(encodeURIComponent).join('/');if(urls.some(x=>x.includes(url)))return error('নির্বাচিত ফাইলের মধ্যে ওয়েবসাইটে ব্যবহৃত ছবি আছে। আগে রেফারেন্স পরিবর্তন করুন।',409);}const r=await fetch(base+'/object/'+bucket,{method:'DELETE',headers,body:JSON.stringify({prefixes:clean})});const d2=await r.json().catch(()=>({}));if(!r.ok)return error(d2.message||'ফাইল মুছতে সমস্যা হয়েছে।',r.status);return json({ok:true,deleted:clean.length});}
 }
 if(p==='/api/admin/settings'&&m==='GET'){const rows=await env.DB.prepare('SELECT key,value FROM site_settings').all();const settings={};for(const x of rows.results){try{settings[x.key]=JSON.parse(x.value);}catch{settings[x.key]=x.value;}}return json({settings});}
 if(p==='/api/admin/settings'&&m==='PUT'){const d=await readBody(req);if(!d||typeof d!=='object')return error('সেটিংস সঠিক নয়।');if(typeof d.logo_url==='string'&&d.logo_url.startsWith('data:image/')){try{d.logo_url=await storeImage(env,d.logo_url,'media/logo');}catch(e){return error(e.message,503);}}const allowed=['phone','logo_url','whatsapp_link','messenger_link','primary_color','accent_color'];const stmts=[];for(const key of allowed){if(Object.prototype.hasOwnProperty.call(d,key)){const value=String(d[key]??'');if(value.length>1500000)return error('ছবির ফাইল অনেক বড়।');if(['logo_url','whatsapp_link','messenger_link'].includes(key)&&value&&!/^(https:\/\/|data:image\/(png|jpeg|webp|gif|avif);base64,)/i.test(value))return error('লিংক বা ছবির ফরম্যাট সঠিক নয়।');if(key==='phone'&&value&&!/^[+0-9 -]{7,20}$/.test(value))return error('ফোন নম্বর সঠিক নয়।');stmts.push(env.DB.prepare('INSERT INTO site_settings(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP').bind(key,JSON.stringify(value)));}}if(stmts.length)await env.DB.batch(stmts);return json({ok:true});}
 if(p==='/api/admin/banners'&&m==='GET'){const r=await env.DB.prepare('SELECT * FROM hero_banners ORDER BY sort_order,id').all();return json({banners:r.results});}
 if(p==='/api/admin/banners'&&m==='POST'){const d=await readBody(req);let image=String(d?.image_url||'');if(!/^(https:\/\/|data:image\/(png|jpeg|webp|gif|avif);base64,)/i.test(image)||image.length>15000000)return error('সঠিক ছবি নির্বাচন করুন (সর্বোচ্চ ১০ MB)।');try{image=await storeImage(env,image,'media/banners');}catch(e){return error(e.message,503);}const r=await env.DB.prepare('INSERT INTO hero_banners(image_url,alt_text,sort_order) VALUES(?,?,(SELECT COALESCE(MAX(sort_order),0)+1 FROM hero_banners))').bind(image,String(d.alt_text||'মেঠো ব্যানার').slice(0,120)).run();return json({ok:true,id:r.meta.last_row_id});}
 const bm=p.match(/^\/api\/admin\/banners\/(\d+)$/);if(bm&&m==='PATCH'){const d=await readBody(req);let image=String(d?.image_url||'');if(!/^(https:\/\/|data:image\/(png|jpeg|webp|gif|avif);base64,)/i.test(image)||image.length>15000000)return error('সঠিক ছবি নির্বাচন করুন (সর্বোচ্চ ১০ MB)।');try{image=await storeImage(env,image,'media/banners');}catch(e){return error(e.message,503);}await env.DB.prepare('UPDATE hero_banners SET image_url=?,alt_text=? WHERE id=?').bind(image,String(d.alt_text||'মেঠো ব্যানার').slice(0,120),Number(bm[1])).run();return json({ok:true});}if(bm&&m==='DELETE'){await env.DB.prepare('DELETE FROM hero_banners WHERE id=?').bind(Number(bm[1])).run();return json({ok:true});}
 if(p==='/api/admin/courier/orders'&&m==='GET'){const r=await env.DB.prepare("SELECT * FROM orders WHERE status IN ('accepted','processing','shipped','delivered') ORDER BY created_at DESC,id DESC LIMIT 300").all();const ids=r.results.map(o=>o.id),items=ids.length?await env.DB.prepare('SELECT order_id,product_name,variant_label,quantity,unit_price_paisa,line_total_paisa FROM order_items WHERE order_id IN ('+ids.map(()=>'?').join(',')+') ORDER BY order_id,id').bind(...ids).all():{results:[]};const grouped=new Map();for(const item of items.results){if(!grouped.has(item.order_id))grouped.set(item.order_id,[]);grouped.get(item.order_id).push({product_name:item.product_name,variant_label:item.variant_label,quantity:item.quantity,unit_price_paisa:item.unit_price_paisa,line_total_paisa:item.line_total_paisa});}const out=r.results.map(o=>({...o,items:grouped.get(o.id)||[]}));return json({orders:out.filter(o=>o.status==='accepted'&&!o.courier_consignment_id&&!o.courier_tracking_code),history:out.filter(o=>o.courier_consignment_id||o.courier_tracking_code),courier_configured:!!(env.STEADFAST_API_KEY&&env.STEADFAST_SECRET_KEY)});}
 if(p==='/api/admin/courier/activate-approved'&&m==='POST'){const r=await env.DB.prepare("UPDATE orders SET courier_disabled=0,updated_at=CURRENT_TIMESTAMP WHERE status='accepted' AND courier_consignment_id IS NULL AND courier_tracking_code IS NULL").run();return json({ok:true,activated:Number(r?.meta?.changes||0),message:'অনুমোদিত অর্ডার সক্রিয় করা হয়েছে।'});}
 if(p==='/api/admin/steadfast/balance'&&m==='GET'){try{return json(await steadfast(env,'/get_balance'));}catch(e){return error(e.message,503);}}
 const single=p.match(/^\/api\/admin\/orders\/(\d+)\/steadfast$/);if(single&&m==='POST'){const id=Number(single[1]),o=await env.DB.prepare("SELECT * FROM orders WHERE id=? AND status='accepted' AND courier_disabled=0 AND courier_consignment_id IS NULL AND courier_tracking_code IS NULL").bind(id).first();if(!o)return error('এই অর্ডারটি বুকিংয়ের উপযুক্ত নয়, নিষ্ক্রিয় অথবা আগে বুক হয়েছে।',409);const payload={invoice:o.order_code,recipient_name:o.customer_name,recipient_phone:o.phone,recipient_address:steadfastAddress(o.address,o.upazila,o.district),cod_amount:o.payment_method==='advance'?0:Math.round((o.subtotal_paisa+(o.delivery_fee_paisa||0))/100),note:o.note||''};try{const d=await steadfast(env,'/create_order','POST',payload),x=d.consignment||d,cid=String(x.consignment_id||x.id||''),tracking=String(x.tracking_code||'');if(!cid&&!tracking)throw new Error('Steadfast response-এ Consignment ID পাওয়া যায়নি।');await env.DB.prepare("UPDATE orders SET courier_consignment_id=?,courier_tracking_code=?,updated_at=CURRENT_TIMESTAMP,status='shipped' WHERE id=? AND courier_disabled=0 AND courier_consignment_id IS NULL").bind(cid||null,tracking||null,id).run();return json({ok:true,message:'Steadfast booking সম্পন্ন হয়েছে।',consignment_id:cid,tracking_code:tracking,response:d});}catch(e){return error(e.message,502);}}
 if(p==='/api/admin/steadfast/bulk'&&m==='POST'){const d=await readBody(req),ids=Array.isArray(d?.ids)?[...new Set(d.ids.map(Number))]:[];if(!ids.length||ids.length>50||ids.some(x=>!Number.isInteger(x)||x<1))return error('১ থেকে ৫০টি সঠিক অর্ডার নির্বাচন করুন।');const marks=ids.map(()=>'?').join(','),r=await env.DB.prepare("SELECT * FROM orders WHERE id IN ("+marks+") AND status='accepted' AND courier_disabled=0 AND courier_consignment_id IS NULL AND courier_tracking_code IS NULL").bind(...ids).all();if(r.results.length!==ids.length)return error('নির্বাচিত অর্ডারের কিছু বুকিংয়ের উপযুক্ত নয় বা নিষ্ক্রিয়।',409);const rows=[];for(const o of r.results){rows.push({id:o.id,payload:{invoice:o.order_code,recipient_name:o.customer_name,recipient_phone:o.phone,recipient_address:steadfastAddress(o.address,o.upazila,o.district),cod_amount:o.payment_method==='advance'?0:Math.round((o.subtotal_paisa+(o.delivery_fee_paisa||0))/100),note:o.note||''}});}try{const result=await steadfast(env,'/create_order/bulk-order','POST',{data:JSON.stringify(rows.map(x=>x.payload))}),items=Array.isArray(result.data)?result.data:(Array.isArray(result.consignment)?result.consignment:Array.isArray(result)?result:[]);let booked=0;const byInvoice=new Map(items.map(x=>[String(x.invoice||''),x]));for(const row of rows){const x=byInvoice.get(String(row.payload.invoice))||{},cid=String(x.consignment_id||x.id||''),tracking=String(x.tracking_code||'');if(x.status==='success'&&(cid||tracking)){const saved=await env.DB.prepare("UPDATE orders SET courier_consignment_id=?,courier_tracking_code=?,updated_at=CURRENT_TIMESTAMP,status='shipped' WHERE id=? AND courier_disabled=0 AND courier_consignment_id IS NULL AND courier_tracking_code IS NULL").bind(cid||null,tracking||null,row.id).run();if(Number(saved?.meta?.changes||0)>0)booked++;}}return json({ok:true,booked,total:rows.length,message:booked+'টি অর্ডার বুক হয়েছে; মোট '+rows.length+'টি পাঠানো হয়েছিল।',response:result});}catch(e){return error(e.message,502);}}
 const track=p.match(/^\/api\/admin\/orders\/(\d+)\/track$/);if(track&&m==='POST'){const id=Number(track[1]),o=await env.DB.prepare('SELECT courier_consignment_id,courier_tracking_code FROM orders WHERE id=?').bind(id).first();if(!o||!o.courier_consignment_id&&!o.courier_tracking_code)return error('কুরিয়ার বুকিং পাওয়া যায়নি।',404);try{const result=await steadfast(env,o.courier_consignment_id?'/status_by_cid/'+encodeURIComponent(o.courier_consignment_id):'/status_by_trackingcode/'+encodeURIComponent(o.courier_tracking_code)),status=result.delivery_status||result.deliveryStatus||result.status||result.consignment?.delivery_status||'অজানা';await env.DB.prepare('UPDATE orders SET courier_status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(String(status).slice(0,120),id).run();return json({ok:true,deliveryStatus:status,response:result});}catch(e){return error(e.message,502);}}
 const ret=p.match(/^\/api\/admin\/orders\/(\d+)\/return$/);if(ret&&m==='POST'){const id=Number(ret[1]),o=await env.DB.prepare('SELECT courier_consignment_id FROM orders WHERE id=?').bind(id).first();if(!o?.courier_consignment_id)return error('Consignment ID পাওয়া যায়নি।',404);const d=await readBody(req);try{return json({ok:true,message:'Return request পাঠানো হয়েছে।',response:await steadfast(env,'/create_return_request','POST',{consignment_id:o.courier_consignment_id,reason:String(d?.reason||'Customer return').slice(0,250)})});}catch(e){return error(e.message,502);}}
 if(p==='/api/admin/analytics'&&m==='GET'){const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dhaka',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const [t,w,mo,daily,monthly]=await Promise.all([env.DB.prepare('SELECT COUNT(*) n FROM site_visitors WHERE visit_date=?').bind(today).first(),env.DB.prepare("SELECT COUNT(*) n FROM site_visitors WHERE visit_date>=date(?,'-6 day')").bind(today).first(),env.DB.prepare("SELECT COUNT(*) n FROM site_visitors WHERE substr(visit_date,1,7)=substr(?,1,7)").bind(today).first(),env.DB.prepare("SELECT visit_date,COUNT(*) visitors FROM site_visitors WHERE visit_date>=date(?,'-29 day') GROUP BY visit_date ORDER BY visit_date").bind(today).all(),env.DB.prepare("SELECT substr(created_at,1,7) month,COUNT(*) orders FROM orders GROUP BY substr(created_at,1,7) ORDER BY month DESC LIMIT 12").all()]);return json({today:Number(t?.n||0),week:Number(w?.n||0),month:Number(mo?.n||0),daily_visitors:daily.results,monthly_orders:monthly.results});}
 return error('এন্ডপয়েন্ট পাওয়া যায়নি।',404);}
 return null;}
export default {async fetch(req,env){try{const p=new URL(req.url).pathname;if(p.startsWith('/api/'))return (await api(req,env))||error('এন্ডপয়েন্ট পাওয়া যায়নি।',404);return env.ASSETS.fetch(req);}catch(e){const detail=String(e?.stack||e?.message||e).slice(0,4000);console.error('[METHO_API_ERROR]',detail);try{await env.DB.prepare("INSERT INTO site_settings(key,value,updated_at) VALUES('__debug_last_error',?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP").bind(JSON.stringify({path:new URL(req.url).pathname,error:detail,at:new Date().toISOString()})).run();}catch(logError){console.error('[METHO_LOG_WRITE_FAILED]',String(logError?.message||logError));}return json({error:'সার্ভারে সমস্যা হয়েছে।'},500);}}};