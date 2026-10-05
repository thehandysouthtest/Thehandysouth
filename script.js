document.querySelector(".request-form").addEventListener("submit",function(){const button=this.querySelector("button[type=submit]");button.disabled=true;button.innerHTML="Sending…";});
document.querySelectorAll(".helper-form").forEach(function(form){form.addEventListener("submit",function(){const button=this.querySelector("button[type=submit]");button.disabled=true;button.innerHTML="Sending…";});});

(function(){
  const blockedPatterns = [
    /n[i1!|]gg[ae3]r/i,
    /f[a@]gg?[o0]t/i,
    /k[i1]ke/i,
    /sp[i1]c/i,
    /ch[i1]nk/i,
    /tr[a@]nn[y1]/i,
    /r[e3]t[a@]rd/i,
    /c[o0]on/i,
    /wetb[a@]ck/i,
    /g[o0]ok/i,
    /p[o0]rn/i,
    /p[o0]rn[o0]gr[a@]ph/i,
    /n[u0]d[e3]/i,
    /n[a@]ked/i,
    /s[e3]x[u4][a@]l/i,
    /s[e3]x/i,
    /bl[o0]wj[o0]b/i,
    /h[a@]ndj[o0]b/i,
    /f[u4]ck/i,
    /sh[i1]t/i,
    /b[i1]tch/i,
    /c[u4]nt/i,
    /d[a@]mn/i,
    /b[a@]st[a@]rd/i,
    /[a@]ssh[o0]le/i
  ];
  function hasBlockedContent(value){
    const normalized = String(value || "").toLowerCase()
      .replace(/[\s\W_]+/g," ")
      .replace(/(.)\1{3,}/g,"$1$1");
    return blockedPatterns.some(function(pattern){ return pattern.test(normalized); });
  }
  function setupFilter(form){
    if(!form) return;
    form.addEventListener("submit",function(e){
      const fields = Array.from(form.querySelectorAll("input, textarea, select"))
        .filter(function(el){ return el.type !== "hidden"; });
      const combined = fields.map(function(el){ return el.value; }).join(" ");
      const warning = form.querySelector(".content-warning");
      if(hasBlockedContent(combined)){
        e.preventDefault();
        if(warning){
          warning.textContent = "Please remove profanity, sexual content, or hateful/racist language before submitting. The Handy South is for respectful service requests.";
          warning.classList.add("show");
        }
        return;
      }
      if(warning) warning.classList.remove("show");
      const button=form.querySelector("button[type=submit]");
      if(button){button.disabled=true;button.innerHTML="Sending…";}
    });
  }
  setupFilter(document.querySelector(".request-form"));
  setupFilter(document.querySelector(".helper-form"));
})();


(function(){
  const searchInput=document.getElementById("jobSearch");
  const locationInput=document.getElementById("jobLocation");
  const categorySelect=document.getElementById("jobCategory");
  const button=document.getElementById("jobSearchButton");
  const count=document.getElementById("jobResultsCount");
  const cards=Array.from(document.querySelectorAll(".listing-card[data-job-search]"));
  if(!searchInput||!locationInput||!categorySelect||!button||!count) return;
  function runSearch(){
    const term=searchInput.value.trim().toLowerCase();
    const location=locationInput.value.trim().toLowerCase();
    const category=categorySelect.value;
    let visible=0;
    cards.forEach(function(card){
      const matchesTerm=!term || card.dataset.jobSearch.includes(term);
      const matchesLocation=!location || card.dataset.jobLocation.includes(location);
      const matchesCategory=!category || card.dataset.jobCategory===category;
      const show=matchesTerm&&matchesLocation&&matchesCategory;
      card.classList.toggle("is-hidden",!show);
      if(show) visible++;
    });
    count.textContent=visible===0 ? "No matching jobs found. Try a different search." : "Showing "+visible+" job listing"+(visible===1?"":"s")+".";
  }
  button.addEventListener("click",runSearch);
  [searchInput,locationInput].forEach(function(input){input.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();runSearch();}});});
  categorySelect.addEventListener("change",runSearch);
})();
