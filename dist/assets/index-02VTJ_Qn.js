(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}})();let _=null;function H(a){_=a}function I(a){const t=document.querySelectorAll(".nav-link"),e=document.querySelectorAll(".tab-content"),n=document.querySelector(".nav-links");e.forEach(o=>{o.classList.remove("active"),o.setAttribute("aria-hidden","true")}),t.forEach(o=>{o.classList.remove("active"),o.setAttribute("aria-selected","false")});const s=document.getElementById(a);s&&(s.classList.add("active"),s.setAttribute("aria-hidden","false"));const i=document.querySelector(`.nav-link[data-tab="${a}"]`);i&&(i.classList.add("active"),i.setAttribute("aria-selected","true")),n&&n.classList.remove("open"),window.scrollTo({top:0,behavior:"smooth"}),typeof _=="function"&&_(a)}function G(){const a=document.querySelectorAll(".nav-link");document.querySelectorAll(".tab-content").forEach(e=>{const n=e.classList.contains("active");e.setAttribute("aria-hidden",n?"false":"true")}),a.forEach(e=>{const n=e.classList.contains("active");e.setAttribute("aria-selected",n?"true":"false")})}function T(){document.querySelectorAll("[data-tab]").forEach(a=>{a.addEventListener("click",t=>{t.preventDefault(),I(a.getAttribute("data-tab"))})})}function R(){const a=document.querySelector(".nav-toggle"),t=document.querySelector(".nav-links");a&&t&&a.addEventListener("click",()=>t.classList.toggle("open"))}let P="en";function q(){return P}function F(a){P=a}function W(a){const t=document.getElementById("lang-en"),e=document.getElementById("lang-nl");if(!t||!e)return;const n=async s=>{q()!==s&&(F(s),t.classList.toggle("active",s==="en"),e.classList.toggle("active",s==="nl"),t.setAttribute("aria-pressed",s==="en"?"true":"false"),e.setAttribute("aria-pressed",s==="nl"?"true":"false"),typeof a=="function"&&await a())};t.addEventListener("click",()=>n("en")),e.addEventListener("click",()=>n("nl"))}function j(){const a=document.querySelectorAll(".about-section, .service-card, .review-card, .welcome-intro, .about-stats, .about-heading, .intro-heading, .intro-bullets li, .intro-highlight, .location-card, .schedule-table, .pricing-cards");a.forEach(e=>e.classList.add("reveal")),document.querySelectorAll(".intro-bullets").forEach(e=>{e.querySelectorAll("li.reveal").forEach((n,s)=>{n.style.setProperty("--i",s)})});const t=new IntersectionObserver(e=>{e.forEach(n=>{n.isIntersecting&&(n.target.classList.add("revealed"),t.unobserve(n.target))})},{threshold:.1});a.forEach(e=>t.observe(e))}let x={};function K(a,t){return t.split(".").reduce((e,n)=>e&&e[n]!=null?e[n]:null,a)}function g(a){return K(x,a)??a}async function B(){const a=q();try{const t=await fetch(`content/${a}/ui.json`);if(t.ok)return x=await t.json(),x}catch{}if(a!=="en")try{const t=await fetch("content/en/ui.json");t.ok&&(x=await t.json())}catch{}return x}function M(){document.querySelectorAll("[data-i18n]").forEach(a=>{const t=a.getAttribute("data-i18n"),e=g(t);e!=null&&(a.getAttribute("aria-label")!==null?a.setAttribute("aria-label",e):a.textContent=e)})}async function $(a){const t=q();let e=await fetch(`content/${t}/${a}`);if(!e.ok&&t!=="en"&&(e=await fetch(`content/en/${a}`)),!e.ok)throw new Error(`Content not found: ${t}/${a}`);return e.text()}function v(a){const t={},e=a.split(`
`).filter(n=>n.trim());for(const n of e){const s=n.indexOf(":");if(s===-1)continue;const i=n.substring(0,s).trim(),o=n.substring(s+1).trim();t[i]?(Array.isArray(t[i])||(t[i]=[t[i]]),t[i].push(o)):t[i]=o}return t}function k(a){return a.split(`
---
`).filter(t=>t.trim())}async function U(){const[a,t]=await Promise.all([$("welcome-hero.txt"),$("welcome-intro.txt")]),e=v(a),n=v(t),s=document.getElementById("hero-content");s&&(s.innerHTML=`
      <h1>${e.title||""}</h1>
      <p class="hero-subtitle">${e.subtitle||""}</p>
      <p class="hero-text">${e.tagline||""}</p>
      <a href="#${e.button1_tab}" class="btn" data-tab="${e.button1_tab}">${e.button1_text}</a>
      ${e.button2_text?`<a href="#${e.button2_tab}" class="btn btn-outline" data-tab="${e.button2_tab}" style="margin-left: 12px;">${e.button2_text}</a>`:""}
    `);const i=document.getElementById("welcome-intro");if(!i)return;let o="";if(n.heading){const c=Array.isArray(n.heading)?n.heading:[n.heading];o+=`<h2 class="intro-heading">${c[0]}</h2>`}if(n.subheading&&(o+=`<p class="intro-subheading">${n.subheading}</p>`),n.paragraph&&(Array.isArray(n.paragraph)?n.paragraph:[n.paragraph]).forEach((d,r)=>{o+=`<p class="intro-paragraph">${d}</p>`,r===1&&n.highlight&&(o+=`<div class="intro-highlight"><p>${n.highlight}</p></div>`)}),n.heading2&&(o+=`<h3 class="intro-heading2">${n.heading2}</h3>`),n.bullet){const c=Array.isArray(n.bullet)?n.bullet:[n.bullet];o+='<ul class="intro-bullets">',c.forEach(d=>{const[r,m]=d.split("|").map(p=>p.trim());o+=`<li><strong>${r}</strong><span>${m}</span></li>`}),o+="</ul>"}i.innerHTML=o}function E(a,t){let e="";if(a.section_title&&(e+=`<h3 class="about-section-title">${a.section_title}</h3>`),a.section_subtitle&&(e+=`<p class="about-coach-title">${a.section_subtitle}</p>`),a.section_quote&&(e+=`<blockquote class="about-coach-quote">"${a.section_quote}"</blockquote>`),t){let o=function(){i.length&&(e+='<ul class="intro-bullets">',i.forEach(c=>{const[d,r]=c.split("|").map(m=>m.trim());e+=`<li><strong>${d}</strong><span>${r||""}</span></li>`}),e+="</ul>",i=[])};var n=o;const s=t.split(`
`).filter(c=>c.trim());let i=[];for(const c of s){const d=c.indexOf(":");if(d===-1)continue;const r=c.substring(0,d).trim().toLowerCase(),m=c.substring(d+1).trim();r!=="bullet"&&o(),r==="paragraph"?e+=`<p class="about-paragraph">${m}</p>`:r==="heading2"?e+=`<h3 class="intro-heading2">${m}</h3>`:r==="bullet"&&i.push(m)}o()}else{const s=a.paragraph?Array.isArray(a.paragraph)?a.paragraph:[a.paragraph]:[],i=a.bullet?Array.isArray(a.bullet)?a.bullet:[a.bullet]:[];s.forEach(o=>{e+=`<p class="about-paragraph">${o}</p>`}),i.length&&(e+='<ul class="intro-bullets">',i.forEach(o=>{const[c,d]=o.split("|").map(r=>r.trim());e+=`<li><strong>${c}</strong><span>${d||""}</span></li>`}),e+="</ul>")}return e}async function V(){const a=await $("about-calisthenics-skill-lab.txt"),t=k(a),e=v(t[0]),n=t.slice(1),s=n.map(h=>v(h)),i=e.stat?Array.isArray(e.stat)?e.stat:[e.stat]:[],o=(e.heading||"").split(" "),c=o.slice(-2).join(" "),d=o.slice(0,-2).join(" ");let r="",m=0,p=[];function b(){if(p.length===0)return"";const h=`
      <div class="about-columns">
        ${p.map(u=>`<div class="about-column">${E(u)}</div>`).join(`
`)}
      </div>
    `;return p=[],h}for(let h=0;h<s.length;h++){const u=s[h],w=n[h];if(u.layout==="cta"){r+=b();const f=u.cta_tab||"contact",y=u.cta_button||"Get Started";r+=`<div class="about-cta"><p class="about-cta-text">${u.cta_text||""}</p><a href="#${f}" class="btn" data-tab="${f}">${y}</a></div>`}else if(u.layout==="stacked"){r+=b();const f=u.section_image||"",y=f?`<img src="${f}" alt="${u.section_title||""}" onerror="this.parentElement.innerHTML='<div class=\\'image-placeholder\\'><span>Photo</span></div>'">`:'<div class="image-placeholder"><span>Photo</span></div>';r+=`
        <div class="about-section-stacked">
          <div class="about-section-text">${E(u,w)}</div>
          <div class="about-section-image-stacked">${y}</div>
        </div>
      `}else if(u.layout==="text-only")p.push(u);else{r+=b();const f=u.section_image||"",y=f?`<img src="${f}" alt="${u.section_title||""}" onerror="this.parentElement.innerHTML='<div class=\\'image-placeholder\\'><span>Photo</span></div>'">`:'<div class="image-placeholder"><span>Photo</span></div>',A=m%2===0;m++,r+=`
        <div class="about-section ${A?"image-left":"image-right"}">
          <div class="about-section-image">${y}</div>
          <div class="about-section-text">${E(u,w)}</div>
        </div>
      `}}r+=b();const l=document.getElementById("about-content");l&&(l.innerHTML=`
    <h2 class="about-heading">${d} <span class="accent">${c}</span></h2>
    ${i.length?`
      <div class="about-stats">
        ${i.map(h=>{const[u,w]=h.split("|").map(f=>f.trim());return`<div class="stat"><span class="stat-number">${u}</span><span class="stat-label">${w}</span></div>`}).join(`
`)}
      </div>
    `:""}
    ${r}
  `)}async function z(){const a=await $("location-info.txt"),t=v(a);return`
    <div class="expanded-section">
      <h3 class="expanded-section-title">${t.heading||"Location"}</h3>
      <div class="location-card">
        <h4>${t.location_name||""}</h4>
        <a href="${t.maps_url||"#"}" class="btn" target="_blank" rel="noopener">📍 Open in Google Maps</a>
      </div>
    </div>
  `}async function J(a){const t=await $(a),e=v(t),n=e.outdoor?Array.isArray(e.outdoor)?e.outdoor:[e.outdoor]:[],s=e.indoor?Array.isArray(e.indoor)?e.indoor:[e.indoor]:[];return`
    <div class="expanded-section">
      <h3 class="expanded-section-title">${e.heading||"Locations"}</h3>
      ${n.length?`
        <h4 class="locations-subheading">${e.outdoor_heading||"Outdoor"}</h4>
        <div class="locations-list">
          ${n.map(i=>{const[o,c]=i.split("|").map(d=>d.trim());return`<a href="${c}" class="location-item" target="_blank" rel="noopener">📍 ${o}</a>`}).join(`
`)}
        </div>
      `:""}
      ${s.length?`
        <h4 class="locations-subheading">${e.indoor_heading||"Indoor"}</h4>
        <div class="locations-list">
          ${s.map(i=>{const[o,c]=i.split("|").map(d=>d.trim());return`<a href="${c}" class="location-item" target="_blank" rel="noopener">🏠 ${o}</a>`}).join(`
`)}
        </div>
      `:""}
    </div>
  `}async function Q(a){const t=await $(a),e=v(t),n=e.plan?Array.isArray(e.plan)?e.plan:[e.plan]:[];return`
    <div class="expanded-section">
      <h3 class="expanded-section-title">${e.heading||"Pricing"}</h3>
      <div class="pricing-cards">
        ${n.map(s=>{const i=s.split("|").map(o=>o.trim());return`
              <div class="pricing-card">
                <span class="pricing-frequency">${i[0]}</span>
                <span class="pricing-per-class">${i[1]}</span>
              </div>
            `}).join(`
`)}
      </div>
    </div>
  `}async function X(){const a=await $("schedule-info.txt"),t=v(a),e=t.day?Array.isArray(t.day)?t.day:[t.day]:[],n=t.plan?Array.isArray(t.plan)?t.plan:[t.plan]:[];return`
    <div class="expanded-section">
      <h3 class="expanded-section-title">${t.heading||"Schedule"}</h3>
      <p class="expanded-section-subtitle">${t.subtitle||""}</p>
      <div class="schedule-table">
        <table>
          <thead>
            <tr><th>Day</th><th>Time</th></tr>
          </thead>
          <tbody>
            ${e.map(s=>{const[i,o]=s.split("|").map(c=>c.trim());return`<tr><td>${i}</td><td>${o}</td></tr>`}).join(`
`)}
          </tbody>
        </table>
      </div>
      ${n.length?`
        <h4 class="schedule-pricing-heading">${t.pricing_heading||"Pricing"}</h4>
        <div class="pricing-cards">
          ${n.map(s=>{const i=s.split("|").map(o=>o.trim());return`
                <div class="pricing-card">
                  <span class="pricing-frequency">${i[0]}</span>
                  <span class="pricing-per-class">${i[1]}</span>
                  <span class="pricing-total">${i[2]}</span>
                </div>
              `}).join(`
`)}
        </div>
      `:""}
      ${t.note?`<p class="schedule-note">${t.note}</p>`:""}
    </div>
  `}async function Y(){const a=await $("training-menu.txt"),t=k(a),e=v(t[0]),n=t.slice(1).map(p=>v(p)),s=(e.heading||"Programs").split(" "),i=s.slice(-1)[0],o=s.slice(0,-1).join(" "),c=document.getElementById("services-content");if(!c)return;c.innerHTML=`
    <h2 class="section-title">${o?o+" ":""}<span class="accent">${i}</span></h2>
    <p class="section-subtitle">${e.subtitle||""}</p>
    <div class="services-grid">
      ${n.map((p,b)=>{const l=Array.isArray(p.detail)?p.detail:[p.detail];return`
            <div class="service-card" data-card-index="${b}">
              <h3>${p.name||""}</h3>
              <p>${p.description||""}</p>
              <ul class="service-details">
                ${l.map(h=>`<li>${h}</li>`).join(`
`)}
              </ul>
              <span class="service-price">${p.price||""}</span>
            </div>
          `}).join(`
`)}
    </div>
    <div class="service-expanded" id="service-expanded"></div>
  `;const d=c.querySelectorAll(".service-card");let r=-1;const m=document.getElementById("service-expanded");d.forEach((p,b)=>{p.addEventListener("click",async()=>{if(r===b){m.innerHTML="",m.classList.remove("open"),p.classList.remove("selected"),r=-1;return}d.forEach(L=>L.classList.remove("selected")),p.classList.add("selected"),r=b;const l=n[b],h=l.expanded_detail?Array.isArray(l.expanded_detail)?l.expanded_detail:[l.expanded_detail]:[],u=l.image||"";let w="",f="",y="",A="";l.include_location==="true"&&(w=await z()),l.include_schedule==="true"&&(f=await X()),l.location_file&&(y=await J(l.location_file)),l.pricing_file&&(A=await Q(l.pricing_file)),m.innerHTML=`
        <div class="expanded-inner">
          <div class="expanded-image">
            ${u?`<img src="${u}" alt="${l.name}" onerror="this.parentElement.innerHTML='<div class=\\'image-placeholder\\'><span>Photo: ${l.name}</span></div>'">`:`<div class="image-placeholder"><span>Photo: ${l.name}</span></div>`}
          </div>
          <div class="expanded-details">
            <h3>${l.name||""}</h3>
            <p class="expanded-text">${l.expanded||l.description||""}</p>
            ${h.length?`
              <ul class="service-details">
                ${h.map(L=>`<li>${L}</li>`).join(`
`)}
              </ul>
            `:""}
            <span class="service-price">${l.price||""}</span>
            <a href="#contact" class="btn expanded-cta" data-tab="contact">Get Started</a>
          </div>
        </div>
        ${f}
        ${w}
        ${A}
        ${y}
      `,m.classList.add("open"),m.querySelectorAll("[data-tab]").forEach(L=>{L.addEventListener("click",N=>{N.preventDefault(),I(L.getAttribute("data-tab"))})}),m.scrollIntoView({behavior:"smooth",block:"nearest"})})})}function Z(){const a=document.getElementById("contact-form"),t=document.getElementById("form-status");a&&a.addEventListener("submit",async e=>{e.preventDefault();const n={name:document.getElementById("name").value,email:document.getElementById("email").value,subject:document.getElementById("subject").value,message:document.getElementById("message").value};t.textContent=g("form.success"),t.className="form-status success",a.reset(),console.log("Form data (no endpoint configured):",n),setTimeout(()=>{t.textContent="",t.className="form-status"},5e3)})}async function tt(){const a=await $("contact-info.txt"),t=v(a),e=(t.form_options||"").split("|").map(c=>c.trim()),n=Array.isArray(t.location)?t.location:[t.location],[s,i]=(t.instagram||"").split("|").map(c=>c.trim()),o=document.getElementById("contact-content");o&&(o.innerHTML=`
    <h2 class="section-title">Get in <span class="accent">Touch</span></h2>
    <p class="section-subtitle">${t.subtitle||""}</p>
    <div class="contact-grid">
      <form id="contact-form" class="contact-form">
        <div class="form-group">
          <label for="name">${g("form.name")}</label>
          <input type="text" id="name" name="name" required placeholder="${g("form.namePlaceholder")}">
        </div>
        <div class="form-group">
          <label for="email">${g("form.email")}</label>
          <input type="email" id="email" name="email" required placeholder="${g("form.emailPlaceholder")}">
        </div>
        <div class="form-group">
          <label for="subject">${g("form.subject")}</label>
          <select id="subject" name="subject" required>
            <option value="" disabled selected>${g("form.subjectPlaceholder")}</option>
            ${e.map(c=>`<option value="${c.toLowerCase()}">${c}</option>`).join(`
`)}
          </select>
        </div>
        <div class="form-group">
          <label for="message">${g("form.message")}</label>
          <textarea id="message" name="message" rows="5" required placeholder="${g("form.messagePlaceholder")}"></textarea>
        </div>
        <button type="submit" class="btn btn-submit">${g("form.submit")}</button>
        <div id="form-status" class="form-status" aria-live="polite"></div>
      </form>
      <div class="contact-info">
        <div class="info-item">
          <h4>${t.location_label||g("contact.locationLabel")}</h4>
          ${n.map(c=>`<p>${c}</p>`).join(`
`)}
        </div>
        <div class="info-item">
          <h4>Email</h4>
          <p>${t.email||""}</p>
        </div>
        <div class="info-item">
          <h4>${t.social_label||g("contact.socialLabel")}</h4>
          <div class="social-links">
            ${s?`<a href="${i}" class="social-link" target="_blank" rel="noopener">${s}</a>`:""}
          </div>
        </div>
      </div>
    </div>
  `,Z())}async function et(){const a=await $("athlete-reviews.txt"),t=k(a),e=v(t[0]),n=t.slice(1).map(i=>v(i)),s=document.getElementById("reviews-content");s&&(s.innerHTML=`
    <h2 class="section-title">What Our <span class="accent">Athletes</span> Say</h2>
    <p class="section-subtitle">${e.subtitle||""}</p>
    <div class="reviews-grid">
      ${n.map(i=>`
            <div class="review-card">
              <div class="review-stars">${"★".repeat(parseInt(i.stars)||5)}</div>
              <p class="review-text">"${i.text||""}"</p>
              <div class="review-author"><span class="author-name">— ${i.author||""}</span></div>
            </div>
          `).join(`
`)}
    </div>
    <div class="reviews-cta">
      <p>See all our reviews on</p>
      <a href="${e.google_maps_url||"#"}" class="btn btn-outline" target="_blank" rel="noopener">Google Maps</a>
    </div>
  `)}const at={welcome:U,about:V,services:Y,contact:tt,reviews:et},nt=["welcome","about","services","contact","reviews"];function O(a){return at[a]??null}const S=new Set;function st(){const a=document.querySelector(".tab-content.active");return a?a.id:nt[0]}async function C(a){if(S.has(a))return;const t=O(a);t&&(await t(),S.add(a))}async function D(a){await C(a),T(),j()}async function it(){await B(),M();const a=st();await C(a),H(D),T(),G(),j()}async function ot(){await B(),M();for(const a of S){const t=O(a);t&&await t()}T(),j()}document.addEventListener("DOMContentLoaded",()=>{W(ot),R(),H(D),it()});
