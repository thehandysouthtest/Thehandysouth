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
  setupFilter(document.querySelector(".helper-interest-form"));
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



(function(){
  const detail=document.getElementById("job-detail");
  const back=document.getElementById("backToJobs");
  const marketplace=document.getElementById("marketplace");
  if(!detail) return;
  const title=document.getElementById("detailJobTitle");
  const pay=document.getElementById("detailJobPay");
  const location=document.getElementById("detailJobLocation");
  const category=document.getElementById("detailJobCategory");
  const description=document.getElementById("detailJobDescription");
  const matchTitle=document.getElementById("matchJobTitle");
  const matchPay=document.getElementById("matchJobPay");
  const matchLocation=document.getElementById("matchJobLocation");
  const matchDescription=document.getElementById("matchJobDescription");

  document.querySelectorAll(".job-details-button").forEach(function(button){
    button.addEventListener("click",function(){
      const card=button.closest(".listing-card");
      const jobTitle=card.querySelector("h4").textContent.trim();
      const jobDescription=card.querySelector(".listing-card p").textContent.trim();
      const jobPay=card.dataset.jobPay || "Pay to be agreed";
      const jobLocation=card.querySelector(".listing-location").textContent.trim();
      const jobCategory=card.dataset.jobCategory || "Other";
      title.textContent=jobTitle;
      pay.textContent=jobPay;
      location.textContent=jobLocation;
      category.textContent=jobCategory.charAt(0).toUpperCase()+jobCategory.slice(1);
      description.textContent=jobDescription;
      matchTitle.value=jobTitle;
      matchPay.value=jobPay;
      matchLocation.value=jobLocation;
      matchDescription.value=jobDescription;
      marketplace.hidden=true;
      detail.hidden=false;
      detail.scrollIntoView({behavior:"smooth",block:"start"});
      history.replaceState(null,"","#job-detail");
    });
  });

  back.addEventListener("click",function(){
    detail.hidden=true;
    marketplace.hidden=false;
    marketplace.scrollIntoView({behavior:"smooth",block:"start"});
    history.replaceState(null,"","#marketplace");
  });

  const matchForm=document.querySelector(".match-form");
  if(matchForm){
    matchForm.addEventListener("submit",function(){
      const button=matchForm.querySelector("button[type=submit]");
      if(button){button.disabled=true;button.innerHTML="Sending…";}
    });
  }
})();


(function(){
  const marketplace=document.getElementById("marketplace");
  const detail=document.getElementById("helper-interest");
  const back=document.getElementById("backToHelpers");
  if(!marketplace||!detail) return;
  const name=document.getElementById("interestHelperName");
  const location=document.getElementById("interestHelperLocation");
  const specialty=document.getElementById("interestHelperSpecialty");
  const nameField=document.getElementById("interestHelperNameField");
  const locationField=document.getElementById("interestHelperLocationField");
  const specialtyField=document.getElementById("interestHelperSpecialtyField");

  document.querySelectorAll(".helper-interest-button").forEach(function(button){
    button.addEventListener("click",function(){
      const card=button.closest(".helper-card");
      name.textContent=card.dataset.helperName;
      location.textContent=card.dataset.helperLocation;
      specialty.textContent=card.dataset.helperSpecialty;
      nameField.value=card.dataset.helperName;
      locationField.value=card.dataset.helperLocation;
      specialtyField.value=card.dataset.helperSpecialty;
      marketplace.hidden=true;
      detail.hidden=false;
      detail.scrollIntoView({behavior:"smooth",block:"start"});
      history.replaceState(null,"","#helper-interest");
    });
  });

  back.addEventListener("click",function(){
    detail.hidden=true;
    marketplace.hidden=false;
    marketplace.scrollIntoView({behavior:"smooth",block:"start"});
    history.replaceState(null,"","#marketplace");
  });

  const form=document.querySelector(".helper-interest-form");
  if(form){
    form.addEventListener("submit",function(){
      const button=form.querySelector("button[type=submit]");
      if(button){button.disabled=true;button.innerHTML="Sending…";}
    });
  }
})();
