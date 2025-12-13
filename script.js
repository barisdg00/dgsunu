/* ====== PROJE JS: sayfa gezinme, typewriter, kalp partiküller, müzik ====== */

let currentPage = 1;
const totalPages = 8; // 1..8

window.onload = () => {
  showPage(1);

  // kalp partikülleri
  startBackgroundHearts();

  // ⭐ yıldız tozu efekti
  startStarDust();
};

/* ========== SAYFA GÖSTER / GİZLE ========== */
function showPage(n){
  // tüm sayfaları gizle
  for(let i=1;i<=totalPages;i++){
    const el = document.getElementById("page"+i);
    if(!el) continue;
    el.classList.remove("active");
    el.classList.add("left");

    // mesaj reset
    const p = el.querySelector(".msg-text");
    if(p) p.textContent = "";
  }

  // aktif sayfa
  const show = document.getElementById("page"+n);
  if(!show) return;
  show.classList.remove("left");
  show.classList.add("active");
  currentPage = n;

  // typewriter
  const txt = show.querySelector(".msg-text");
  if(txt && txt.dataset.fulltext){
    typeWriter(txt, txt.dataset.fulltext, 30);
  }

  // 7. sayfa (sen) özel efekt
  if(n === 7){
    sparkleSpecial(show);
  }

  // 8. sayfa (final orbit)
  if(n === 8){
    const orbits = show.querySelectorAll(".orbit img");
    orbits.forEach(im=>{
      im.style.filter = "drop-shadow(0 8px 30px rgba(255,60,100,0.35))";
    });
  }
}

/* ========== İLERİ SAYFA ========== */
function nextPage(){
  stopAllMusic(); // ⬅️ önceki kişinin müziğini kapat

  const next = currentPage + 1;
  if(next > totalPages) return;

  showPage(next);
  currentPage = next;

  playCurrentMusic(); // ⬅️ yeni kişinin müziğini çal

  if(next === totalPages){
    setTimeout(()=> startHeartRain(14), 900);
  }
}

/* ========== TYPEWRITER ========== */
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
      setTimeout(step, speed + (Math.random()*20 - 10));
    } else {
      cursor.remove();
    }
  }
  step();
}

/* ========== 7. SAYFA ÖZEL PARLAMA ========== */
function sparkleSpecial(section){
  const photo = section.querySelector(".photo-box");
  if(!photo) return;

  photo.style.transition = "transform 0.9s ease, box-shadow 0.6s ease";
  photo.style.transform = "scale(1.05)";
  photo.style.boxShadow = "0 26px 90px rgba(255,60,120,0.35)";

  setTimeout(()=>{
    photo.style.transform = "";
  },1200);
}

/* ========== KALP PARTİKÜLLER (ARKA PLAN) ========== */
let heartInterval;
function startBackgroundHearts(){
  heartInterval = setInterval(createParticleHeart, 850);
}

function createParticleHeart(){
  const d = document.createElement("div");
  d.className = "particle-heart";
  d.innerHTML = "❤";

  d.style.left = Math.random()*100 + "vw";
  d.style.top = "-10px";
  d.style.fontSize = (14 + Math.random()*30) + "px";
  d.style.color = `rgba(255, ${80+Math.random()*100}, ${120+Math.random()*80}, 0.9)`;
  d.style.filter = "drop-shadow(0 0 26px rgba(255,80,150,0.55))";

  const dur = 6 + Math.random()*6;
  d.style.animationDuration = dur + "s";

  document.body.appendChild(d);
  setTimeout(()=> d.remove(), dur*1000 + 300);
}

/* ========== SON SAYFA KALP YAĞMURU ========== */
function startHeartRain(count=12){
  let i = 0;
  const id = setInterval(()=>{
    const h = document.createElement("div");
    h.className = "particle-heart";
    h.innerHTML = "❤";

    h.style.left = Math.random()*100 + "vw";
    h.style.fontSize = (32 + Math.random()*40) + "px";
    h.style.color = `rgba(255, ${60+Math.random()*100}, ${100+Math.random()*80}, 1)`;
    h.style.filter = "drop-shadow(0 0 20px rgba(255,70,140,0.8))";

    const dur = 2 + Math.random()*1.6;
    h.style.animationDuration = dur + "s";

    document.body.appendChild(h);
    setTimeout(()=> h.remove(), dur*1000 + 200);

    i++;
    if(i>=count) clearInterval(id);
  },100);
}

/* ========== 🎵 KİŞİYE ÖZEL MÜZİK ========== */
function stopAllMusic(){
  document.querySelectorAll(".personMusic").forEach(m=>{
    m.pause();
    m.currentTime = 0;
  });
}

function playCurrentMusic(){
  const page = document.getElementById("page"+currentPage);
  if(!page) return;

  const music = page.querySelector(".personMusic");
  if(music){
    music.volume = 0.5;
    music.play();
  }
}
/* ====== MOBİL ÖZEL EFEKTLER ====== */

/* (3) SAYFAYA GÖRE ARKA PLAN */
const bgColors = {
  1: "linear-gradient(180deg,#3a0a1f,#12060c)",
  2: "linear-gradient(180deg,#4b0f2b,#14070f)",
  3: "linear-gradient(180deg,#2e0d3a,#0e0614)",
  4: "linear-gradient(180deg,#4a1010,#120606)",
  5: "linear-gradient(180deg,#3d0d1a,#100608)",
  6: "linear-gradient(180deg,#2a0a0a,#080303)",
  7: "linear-gradient(180deg,#5a0f2f,#1a050d)",
  8: "linear-gradient(180deg,#000000,#120000)"
};

function updateBackground(){
  document.body.style.background = bgColors[currentPage] || bgColors[1];
}

/* showPage SONUNA otomatik bağla */
const _oldShowPage = showPage;
showPage = function(n){
  _oldShowPage(n);
  updateBackground();
  highlightWords();
};

/* (4) FOTOĞRAF YAVAŞ ZOOM (KEN BURNS) */
document.querySelectorAll(".photo-box img").forEach(img=>{
  img.style.animation = "slowZoom 18s ease-in-out infinite alternate";
});

/* (5) MESAJDA KELİME VURGULAMA */
function highlightWords(){
  document.querySelectorAll(".msg-text").forEach(p=>{
    if(!p.dataset.fulltext) return;
    let t = p.dataset.fulltext;
    t = t.replace(/iyi ki/gi,'<span class="hl">iyi ki</span>');
    t = t.replace(/seni seviyorum/gi,'<span class="hl glow">seni seviyorum</span>');
    p.innerHTML = t;
  });
}

/* (6) SON KİŞİ: YILDIZ PATLAMASI */
function starBurst(){
  for(let i=0;i<20;i++){
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = Math.random()*100+"vw";
    s.style.top = Math.random()*100+"vh";
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),2000);
  }
}

/* 7. sayfaya girince tetikle */
const _oldSparkle = sparkleSpecial;
sparkleSpecial = function(section){
  _oldSparkle(section);
  starBurst();
};

/* (8) GERİ BUTONU */
const backBtn = document.createElement("button");
backBtn.innerText = "←";
backBtn.className = "back-btn";
backBtn.onclick = ()=>{
  if(currentPage>1) showPage(currentPage-1);
};
document.body.appendChild(backBtn);

/* (9) TELEFONU SALLA → KALP PATLAMASI */
let lastShake = 0;
window.addEventListener("devicemotion",e=>{
  const a = e.accelerationIncludingGravity;
  const power = Math.abs(a.x)+Math.abs(a.y)+Math.abs(a.z);
  if(power>28 && Date.now()-lastShake>1200){
    startHeartRain(8);
    lastShake = Date.now();
  }
});

/* (10) FOTOĞRAFA UZUN BAS → GİZLİ MESAJ */
document.querySelectorAll(".photo-box").forEach(box=>{
  let timer;
  box.addEventListener("touchstart",()=>{
    timer=setTimeout(()=>{
      alert("💌 Bunu sadece sen görüyorsun...");
    },1200);
  });
  box.addEventListener("touchend",()=>clearTimeout(timer));
});

/* ====== YILDIZ TOZU BAŞLAT ====== */
function startStarDust(){
  setInterval(() => {
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = Math.random() * 100 + "vw";
    s.style.animationDuration = (6 + Math.random() * 6) + "s";
    s.style.opacity = Math.random();
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 12000);
  }, 250);
}

/* ========== KULLANIM NOTU ==========
- Her kişi sayfasına ekle:
  <audio class="personMusic" src="audio/kisiX.mp3"></audio>

- Müzik butona basınca başlar (tarayıcı kuralı)
- GitHub Pages uyumlu
================================== */
