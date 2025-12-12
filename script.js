/* ====== PROJE JS: sayfa gezinme, typewriter, kalp partiküller, son efekti ====== */

let currentPage = 1;
const totalPages = 8; // 1..8

window.onload = () => {
  showPage(1);
  // hafif kalp partiküllerini başlat
  startBackgroundHearts();
};

/* gösterme/gizleme */
function showPage(n){
  // temizle
  for(let i=1;i<=totalPages;i++){
    const el = document.getElementById("page"+i);
    if(!el) continue;
    el.classList.remove("active");
    el.classList.add("left");
    // reset mesaj alanı
    const p = el.querySelector(".msg-text");
    if(p) { p.textContent = ""; }
  }

  // gösterilecek
  const show = document.getElementById("page"+n);
  if(!show) return;
  show.classList.remove("left");
  show.classList.add("active");
  currentPage = n;

  // typewriter tetikle (eğer msg-text varsa)
  const txt = show.querySelector(".msg-text");
  if(txt && txt.dataset.fulltext){
    typeWriter(txt, txt.dataset.fulltext, 30);
  }

  // eğer 7. sayfa (son kişi) ise özel parlama
  if(n === 7){
    sparkleSpecial(show);
  }

  // final sayfa (8) ise orbit animasyonlarını göster (zaten CSS'de dönüyor)
  if(n === 8){
    // ekstra efekt: foto etrafında hafif glow
    const orbits = show.querySelectorAll(".orbit img");
    orbits.forEach((im,i)=> {
      im.style.filter = "drop-shadow(0 8px 30px rgba(255,60,100,0.25))";
    });
  }
}

/* ileri sayfa */
function nextPage(){
  const next = currentPage + 1;
  if(next > totalPages) return;
  showPage(next);
  // eğer final page ise 2sn sonra kalp yağdır
  if(next === totalPages){
    setTimeout(()=> startHeartRain(12), 900);
  }
}

/* ========== TYPEWRITER (yavaşça yazdırır) ========== */
function typeWriter(element, text, speed=40){
  element.textContent = "";
  let i = 0;
  const cursor = document.createElement("span");
  cursor.className = "type-cursor";
  element.parentNode.appendChild(cursor);

  function step(){
    if(i < text.length){
      element.textContent += text.charAt(i);
      i++;
      setTimeout(step, speed + (Math.random()*20 - 10)); // hafif varyasyon
    } else {
      // yazma bitti, cursor kaldır
      cursor.remove();
    }
  }
  step();
}

/* ========== ÖZEL: 7. SAYFA İÇİN PARLAK EFECTLER ========== */
function sparkleSpecial(section){
  // foto kutusuna hafif glow ve pop
  const photo = section.querySelector(".photo-box");
  if(!photo) return;
  photo.style.transition = "transform 0.9s ease, box-shadow 0.6s ease";
  photo.style.transform = "scale(1.03)";
  photo.style.boxShadow = "0 24px 80px rgba(255,60,120,0.25)";
  // kısa süre sonra geri al
  setTimeout(()=>{ photo.style.transform = ""; }, 1200);
}

/* ========== ARKA PLAN KALP PARTİKÜLLERİ (BELİRGİN) ========= */
let heartInterval;
function startBackgroundHearts(){
  // düşük freq, performans gözetir
  heartInterval = setInterval(()=>{
    createParticleHeart();
  }, 900);
}

function createParticleHeart(){
  const d = document.createElement("div");
  d.className = "particle-heart";
  d.style.left = Math.random()*100 + "vw";

  // boyut + parlaklık arttı
  d.style.fontSize = (12 + Math.random()*28) + "px";

  // daha görünür renk + opaklık
  d.style.color = `rgba(255, ${80+Math.floor(Math.random()*80)}, ${120+Math.floor(Math.random()*40)}, ${0.75 + Math.random()*0.25})`;

  d.innerHTML = "❤";
  d.style.top = "-10px";

  // parlak glow
  d.style.filter = "drop-shadow(0 0 24px rgba(255,80,140,0.45))";

  const dur = 6 + Math.random()*6;
  d.style.animationDuration = dur + "s";
  document.body.appendChild(d);
  setTimeout(()=> d.remove(), dur*1000 + 300);
}

/* ========== SON SAYFA KALP YAĞMURU (ÇOK BELİRGİN) ======== */
function startHeartRain(count=10){
  let i=0;
  const id = setInterval(()=>{
    const h = document.createElement("div");
    h.className = "particle-heart";
    h.style.left = Math.random()*100 + "vw";

    // daha büyük boyut
    h.style.fontSize = (28 + Math.random()*40) + "px";

    // yüksek opak kırmızı/pembe
    h.style.color = `rgba(255, ${50+Math.floor(Math.random()*100)}, ${100+Math.floor(Math.random()*80)}, 1)`;

    // güçlü parıltı
    h.style.filter = "drop-shadow(0 0 18px rgba(255,70,140,0.75))";

    const dur = 2 + Math.random()*1.6;
    h.style.animationDuration = dur + "s";

    document.body.appendChild(h);
    setTimeout(()=> h.remove(), dur*1000 + 150);

    i++;
    if(i>=count) clearInterval(id);
  }, 100);
}

/* ========== KULLANIM NOTU ==========
- Mesajları değiştirmek için: index.html'deki <p class="msg-text" data-fulltext="..."> içine
  uzun metnini yaz (data-fulltext attribute'u). Bu attribute içindeki metin typewriter ile gösterilir.
- Foto dosyalarını projenin köküne koy: kisi1.jpg ... kisi6.jpg ve opsiyonel center.jpg
- Responsive ayarlar style.css içinde hazır.
=====================================*/
