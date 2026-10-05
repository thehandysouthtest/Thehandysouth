/* The Handy South — test marketplace behavior */
(function () {
  const KEY = "thehandysouth_test_v2";
  const blockedPatterns = [/n[i1!|]gg[ae3]r/i,/f[a@]gg?[o0]t/i,/k[i1]ke/i,/sp[i1]c/i,/ch[i1]nk/i,/tr[a@]nn[y1]/i,/r[e3]t[a@]rd/i,/c[o0]on/i,/wetb[a@]ck/i,/g[o0]ok/i,/p[o0]rn/i,/p[o0]rn[o0]gr[a@]ph/i,/n[u0]d[e3]/i,/n[a@]ked/i,/s[e3]x/i,/bl[o0]wj[o0]b/i,/h[a@]ndj[o0]b/i,/f[u4]ck/i,/sh[i1]t/i,/b[i1]tch/i,/c[u4]nt/i,/d[a@]mn/i,/b[a@]st[a@]rd/i,/[a@]ssh[o0]le/i];
  const normalize = v => String(v || "").toLowerCase().replace(/[\s\W_]+/g," ").replace(/(.)\1{3,}/g,"$1$1");
  const blocked = v => blockedPatterns.some(p => p.test(normalize(v)));
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {jobs:[],helpers:[],interests:[]}; } catch { return {jobs:[],helpers:[],interests:[]}; } };
  const save = d => localStorage.setItem(KEY, JSON.stringify(d));
  const status = msg => { const el=document.getElementById("testConsoleStatus"); if(el) el.textContent=msg; };
  function protectForm(form) {
    if(!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const vals=[...form.querySelectorAll("input,textarea,select")].filter(x=>x.type!=="hidden").map(x=>x.value).join(" ");
      const warning=form.querySelector(".content-warning");
      if(blocked(vals)){ if(warning){warning.textContent="Please remove profanity, sexual content, or hateful/racist language before submitting.";warning.classList.add("show");} return; }
      if(warning) warning.classList.remove("show");
      const button=form.querySelector('button[type="submit"]'); if(button){button.disabled=true;button.textContent="Saving test data…";}
      const d=read(); const data=Object.fromEntries(new FormData(form).entries());
      if(form.classList.contains("request-form")){
        d.jobs.push({id:Date.now(),service:data.service,location:data.location,description:data.description,name:data.name,contact:data.contact,createdAt:new Date().toISOString(),status:"Open"});
        save(d); status("Job saved to this browser. The matching engine can now rank helpers for it.");
      } else if(form.classList.contains("helper-form")) {
        d.helpers.push({id:Date.now(),name:data.helper_name,location:data.helper_location,skills:data.skills,contact:data.helper_contact,available:true});
        save(d); status("Helper profile saved privately to this browser. New jobs can now be matched against the listed skills.");
      }
      setTimeout(()=>{form.reset();if(button){button.disabled=false;button.textContent="Saved ✓";}},400);
    });
  }
  protectForm(document.querySelector(".request-form"));
  protectForm(document.querySelector(".helper-form"));
  protectForm(document.querySelector(".helper-interest-form"));
  const searchInput=document.getElementById("jobSearch"),locationInput=document.getElementById("jobLocation"),category=document.getElementById("jobCategory"),searchBtn=document.getElementById("jobSearchButton"),count=document.getElementById("jobResultsCount");
  const runSearch=()=>{if(!searchInput||!locationInput||!category||!count)return;const term=normalize(searchInput.value),loc=normalize(locationInput.value),cat=category.value;let n=0;document.querySelectorAll(".listing-card[data-job-search]").forEach(card=>{const show=(!term||normalize(card.dataset.jobSearch).includes(term))&&(!loc||normalize(card.dataset.jobLocation).includes(loc))&&(!cat||card.dataset.jobCategory===cat);card.classList.toggle("is-hidden",!show);if(show)n++;});count.textContent=n?"Showing "+n+" job listing"+(n===1?"":"s")+".":"No matching jobs found. Try another search.";};
  if(searchBtn) searchBtn.addEventListener("click",runSearch);
  [searchInput,locationInput].forEach(el=>el&&el.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();runSearch();}}));
  if(category) category.addEventListener("change",runSearch);
  const detail=document.getElementById("job-detail"),marketplace=document.getElementById("marketplace");
  document.querySelectorAll(".job-details-button").forEach(btn=>btn.addEventListener("click",()=>{const card=btn.closest(".listing-card");document.getElementById("detailJobTitle").textContent=card.querySelector("h4").textContent;document.getElementById("detailJobPay").textContent=card.dataset.jobPay||"Pay to be agreed";document.getElementById("detailJobLocation").textContent=card.querySelector(".listing-location").textContent;document.getElementById("detailJobCategory").textContent=card.dataset.jobCategory||"Other";document.getElementById("detailJobDescription").textContent=card.querySelector("p").textContent;marketplace.hidden=true;detail.hidden=false;detail.scrollIntoView({behavior:"smooth"}); }));
  const back=document.getElementById("backToJobs");if(back)back.onclick=()=>{detail.hidden=true;marketplace.hidden=false;marketplace.scrollIntoView({behavior:"smooth"});};
  const helperDetail=document.getElementById("helper-interest");
  document.querySelectorAll(".helper-interest-button").forEach(btn=>btn.addEventListener("click",()=>{const card=btn.closest(".helper-card");document.getElementById("interestHelperName").textContent=card.dataset.helperName;document.getElementById("interestHelperLocation").textContent=card.dataset.helperLocation;document.getElementById("interestHelperSpecialty").textContent=card.dataset.helperSpecialty;document.getElementById("interestHelperNameField").value=card.dataset.helperName;document.getElementById("interestHelperLocationField").value=card.dataset.helperLocation;document.getElementById("interestHelperSpecialtyField").value=card.dataset.helperSpecialty;marketplace.hidden=true;helperDetail.hidden=false;helperDetail.scrollIntoView({behavior:"smooth"}); }));
  const backHelpers=document.getElementById("backToHelpers");if(backHelpers)backHelpers.onclick=()=>{helperDetail.hidden=true;marketplace.hidden=false;marketplace.scrollIntoView({behavior:"smooth"});};
  const clear=document.getElementById("clearTestData");if(clear)clear.onclick=()=>{localStorage.removeItem(KEY);status("Test activity cleared from this browser.");};
  const d=read();if(d.jobs.length||d.helpers.length||d.interests.length)status("Test data is active on this device: "+d.jobs.length+" job(s), "+d.helpers.length+" helper profile(s), "+d.interests.length+" connection request(s).");
})();