/* The Handy South — marketplace behavior, email delivery, and local test listings */
(function () {
  const KEY = "thehandysouth_test_v3";
  const FORMSPREE_URL = "https://formspree.io/f/xjygvqbb";
  const blockedPatterns = [/n[i1!|]gg[ae3]r/i,/f[a@]gg?[o0]t/i,/k[i1]ke/i,/sp[i1]c/i,/ch[i1]nk/i,/tr[a@]nn[y1]/i,/r[e3]t[a@]rd/i,/c[o0]on/i,/wetb[a@]ck/i,/g[o0]ok/i,/p[o0]rn/i,/p[o0]rn[o0]gr[a@]ph/i,/n[u0]d[e3]/i,/n[a@]ked/i,/s[e3]x/i,/bl[o0]wj[o0]b/i,/h[a@]ndj[o0]b/i,/f[u4]ck/i,/sh[i1]t/i,/b[i1]tch/i,/c[u4]nt/i,/d[a@]mn/i,/b[a@]st[a@]rd/i,/[a@]ssh[o0]le/i];
  const normalize = v => String(v || "").toLowerCase().replace(/[\s\W_]+/g," ").replace(/(.)\1{3,}/g,"$1$1");
  const blocked = v => blockedPatterns.some(p => p.test(normalize(v)));
  const emptyData = () => ({jobs:[],helpers:[],interests:[]});
  const read = () => { try { const d=JSON.parse(localStorage.getItem(KEY)); return d&&typeof d==="object"?{...emptyData(),...d}:emptyData(); } catch { return emptyData(); } };
  const save = d => localStorage.setItem(KEY,JSON.stringify(d));
  const status = msg => { const el=document.getElementById("testConsoleStatus"); if(el) el.textContent=msg; };
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const warn = (form,msg) => { const el=form.querySelector(".content-warning"); if(el){el.textContent=msg;el.classList.add("show");} };
  const clearWarn = form => { const el=form.querySelector(".content-warning"); if(el) el.classList.remove("show"); };
  const button = (el,text,disabled) => { if(el){el.disabled=disabled;el.textContent=text;} };

  async function sendToFormspree(form,data) {
    const endpoint=form.getAttribute("action")||FORMSPREE_URL;
    const response=await fetch(endpoint,{method:"POST",headers:{"Accept":"application/json"},body:data});
    let result={}; try{result=await response.json();}catch{}
    if(!response.ok) throw new Error(result?.errors?.map(e=>e.message).join(", ")||"The notification service did not accept the submission.");
    return result;
  }

  function renderLocalListings() {
    const d=read(), jobsBoard=document.querySelector(".jobs-board"), helpersBoard=document.querySelector(".helpers-board");
    if(!jobsBoard||!helpersBoard)return;
    jobsBoard.querySelectorAll(".local-test-job").forEach(el=>el.remove());
    helpersBoard.querySelectorAll(".local-test-helper").forEach(el=>el.remove());
    const viewJobs=jobsBoard.querySelector('[data-view-all="jobs"]'), viewHelpers=helpersBoard.querySelector('[data-view-all="helpers"]');

    d.jobs.slice().reverse().forEach(job=>{
      const article=document.createElement("article");
      article.className="listing-card local-test-job";
      article.dataset.jobSearch=normalize([job.service,job.description].join(" "));
      article.dataset.jobLocation=normalize(job.location);
      article.dataset.jobCategory="";
      article.dataset.jobPay=job.budget||job.pay||"Pay to be agreed";
      article.dataset.localId=job.id;
      article.innerHTML='<div class="listing-top"><span class="status-dot"></span><span>New request</span><span class="listing-location">'+escapeHtml(job.location)+'</span></div><h4>'+escapeHtml(job.service)+'</h4><p>'+escapeHtml(job.description)+'</p><div class="listing-meta"><span>📌 Help Wanted</span><span>💰 Budget: '+escapeHtml(job.budget||job.pay||"To be discussed")+'</span></div><button class="text-button job-details-button" type="button">View full job →</button>';
      if(viewJobs)jobsBoard.insertBefore(article,viewJobs);else jobsBoard.appendChild(article);
      wireJobButton(article.querySelector(".job-details-button"));
    });

    d.helpers.slice().reverse().forEach(helper=>{
      const article=document.createElement("article");
      article.className="helper-card local-test-helper";
      article.dataset.helperName=helper.name; article.dataset.helperLocation=helper.location; article.dataset.helperSpecialty=helper.skills; article.dataset.localId=helper.id;
      const initial=String(helper.name||"H").trim().charAt(0).toUpperCase()||"H";
      article.innerHTML='<div class="helper-avatar">'+escapeHtml(initial)+'</div><div class="helper-info"><h4>'+escapeHtml(helper.name)+'</h4><p>'+escapeHtml(helper.location)+'</p><div class="helper-specialty"><strong>Specialty:</strong> '+escapeHtml(helper.skills)+'</div><span class="availability">● Available</span><button class="text-button helper-interest-button" type="button">Send interest to The Handy South →</button></div>';
      if(viewHelpers)helpersBoard.insertBefore(article,viewHelpers);else helpersBoard.appendChild(article);
      wireHelperButton(article.querySelector(".helper-interest-button"));
    });

    const jobBadge=jobsBoard.querySelector(".count-badge"), helperBadge=helpersBoard.querySelector(".count-badge");
    if(jobBadge)jobBadge.textContent=jobsBoard.querySelectorAll(".listing-card:not(.is-hidden)").length;
    if(helperBadge)helperBadge.textContent=helpersBoard.querySelectorAll(".helper-card").length;
    if(d.jobs.length||d.helpers.length||d.interests.length) status("Test data is active on this device: "+d.jobs.length+" job(s), "+d.helpers.length+" helper profile(s), "+d.interests.length+" connection request(s).");
  }

  function wireJobButton(btn) {
    if(!btn||btn.dataset.wired)return; btn.dataset.wired="1";
    btn.addEventListener("click",()=>{
      const card=btn.closest(".listing-card"), detail=document.getElementById("job-detail"), marketplace=document.getElementById("marketplace"); if(!card||!detail)return;
      document.getElementById("detailJobTitle").textContent=card.querySelector("h4").textContent;
      document.getElementById("detailJobPay").textContent=card.dataset.jobPay||"Pay to be agreed";
      document.getElementById("detailJobLocation").textContent=card.querySelector(".listing-location")?.textContent||"Local";
      document.getElementById("detailJobCategory").textContent=card.dataset.jobCategory||"Other";
      document.getElementById("detailJobDescription").textContent=card.querySelector("p")?.textContent||"";
      const fields={matchJobTitle:"detailJobTitle",matchJobPay:"detailJobPay",matchJobLocation:"detailJobLocation",matchJobDescription:"detailJobDescription"};
      Object.entries(fields).forEach(([target,source])=>{const el=document.getElementById(target);if(el)el.value=document.getElementById(source).textContent;});
      const matchId=document.getElementById("matchJobId"); if(matchId)matchId.value=card.dataset.localId||"";
      marketplace.hidden=true; detail.hidden=false; detail.scrollIntoView({behavior:"smooth"});
    });
  }

  function wireHelperButton(btn) {
    if(!btn||btn.dataset.wired)return; btn.dataset.wired="1";
    btn.addEventListener("click",()=>{
      const card=btn.closest(".helper-card"), helperDetail=document.getElementById("helper-interest"), marketplace=document.getElementById("marketplace"); if(!card||!helperDetail)return;
      document.getElementById("interestHelperName").textContent=card.dataset.helperName;
      document.getElementById("interestHelperLocation").textContent=card.dataset.helperLocation;
      document.getElementById("interestHelperSpecialty").textContent=card.dataset.helperSpecialty;
      document.getElementById("interestHelperNameField").value=card.dataset.helperName;
      document.getElementById("interestHelperLocationField").value=card.dataset.helperLocation;
      document.getElementById("interestHelperSpecialtyField").value=card.dataset.helperSpecialty;
      marketplace.hidden=true; helperDetail.hidden=false; helperDetail.scrollIntoView({behavior:"smooth"});
    });
  }

  async function handleFormSubmit(form) {
    const vals=[...form.querySelectorAll("input,textarea,select")].filter(x=>x.type!=="hidden").map(x=>x.value).join(" ");
    clearWarn(form);
    if(blocked(vals)){warn(form,"Please remove profanity, sexual content, or hateful/racist language before submitting.");return;}
    const submit=form.querySelector('button[type="submit"]'); button(submit,"Sending…",true);
    const formData=new FormData(form), d=read();
    try {
      await sendToFormspree(form,formData);
      const data=Object.fromEntries(formData.entries());
      if(form.classList.contains("request-form") || form.classList.contains("helper-form")) {
        const shared = await saveSharedSubmission(form, data);
        if (shared) {
          if (form.classList.contains("request-form")) d.jobs.push(shared);
          else d.helpers.push(shared);
        }
      }
      if(form.classList.contains("request-form")){
        d.jobs.push({id:Date.now(),service:data.service,location:data.location,description:data.description,name:data.name,contact:data.contact,budget:data.budget,createdAt:new Date().toISOString(),status:"Open"});
        save(d); renderLocalListings(); status("Job submitted successfully. It was sent to The Handy South and added to this device's job board.");
      } else if(form.classList.contains("helper-form")){
        d.helpers.push({id:Date.now(),name:data.helper_name,location:data.helper_location,skills:data.skills,contact:data.helper_contact,available:true,createdAt:new Date().toISOString()});
        save(d); renderLocalListings(); status("Helper profile submitted successfully. It was sent to The Handy South and added to this device's helper board.");
      } else if(form.classList.contains("helper-interest-form")){
        d.interests.push({id:Date.now(),helper:data.helper_name,client:data.client_name,message:data.client_message,createdAt:new Date().toISOString()});
        save(d); status("Connection request sent successfully to The Handy South.");
      } else if(form.classList.contains("match-form")){
        d.interests.push({id:Date.now(),job:data.job_title,helper:data.helper_name,message:data.helper_message,createdAt:new Date().toISOString()});
        save(d); status("Job interest sent successfully to The Handy South.");
      }
      form.reset(); button(submit,"Sent ✓",false);
      setTimeout(()=>{if(submit)submit.textContent=form.classList.contains("request-form")?"Send my request →":form.classList.contains("helper-form")?"Join the helper list →":form.classList.contains("helper-interest-form")?"Send interest →":"Send my interest →";},1800);
    } catch(error) {
      console.error("The Handy South submission failed:",error);
      warn(form,"We couldn't send this submission right now. Please try again. Your information was not marked as submitted.");
      button(submit,"Try again →",false);
    }
  }

  function protectForm(form){if(!form||form.dataset.wired)return;form.dataset.wired="1";form.addEventListener("submit",e=>{e.preventDefault();handleFormSubmit(form);});}
  protectForm(document.querySelector(".request-form"));
  protectForm(document.querySelector(".helper-form"));
  protectForm(document.querySelector(".helper-interest-form"));
  protectForm(document.querySelector(".match-form"));
  document.querySelectorAll(".job-details-button").forEach(wireJobButton);
  document.querySelectorAll(".helper-interest-button").forEach(wireHelperButton);

  const searchInput=document.getElementById("jobSearch"), locationInput=document.getElementById("jobLocation"), category=document.getElementById("jobCategory"), searchBtn=document.getElementById("jobSearchButton"), count=document.getElementById("jobResultsCount");
  const runSearch=()=>{if(!searchInput||!locationInput||!category||!count)return;const term=normalize(searchInput.value),loc=normalize(locationInput.value),cat=category.value;let n=0;document.querySelectorAll(".listing-card[data-job-search]").forEach(card=>{const show=(!term||normalize(card.dataset.jobSearch).includes(term))&&(!loc||normalize(card.dataset.jobLocation).includes(loc))&&(!cat||!card.dataset.jobCategory||card.dataset.jobCategory===cat);card.classList.toggle("is-hidden",!show);if(show)n++;});count.textContent=n?"Showing "+n+" job listing"+(n===1?"":"s")+".":"No matching jobs found. Try another search.";};
  if(searchBtn)searchBtn.addEventListener("click",runSearch);
  [searchInput,locationInput].forEach(el=>el&&el.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();runSearch();}}));
  if(category)category.addEventListener("change",runSearch);
  document.querySelectorAll(".view-all-button").forEach(btn=>btn.addEventListener("click",()=>{const board=document.querySelector(btn.dataset.viewAll==="jobs"?".jobs-board":".helpers-board");if(board)board.scrollIntoView({behavior:"smooth",block:"start"});}));

  const detail=document.getElementById("job-detail"), marketplace=document.getElementById("marketplace"), back=document.getElementById("backToJobs");
  if(back)back.onclick=()=>{detail.hidden=true;marketplace.hidden=false;marketplace.scrollIntoView({behavior:"smooth"});};
  const helperDetail=document.getElementById("helper-interest"), backHelpers=document.getElementById("backToHelpers");
  if(backHelpers)backHelpers.onclick=()=>{helperDetail.hidden=true;marketplace.hidden=false;marketplace.scrollIntoView({behavior:"smooth"});};
  const clear=document.getElementById("clearTestData");
  if(clear)clear.onclick=()=>{localStorage.removeItem(KEY);renderLocalListings();status("Test activity cleared from this browser.");};


  // Shared Supabase marketplace
  const SUPABASE_URL = "https://gyfdtdxnbtkutjbiqgzi.supabase.co";
  const SUPABASE_KEY = "sb_publishable_mgnjBH30_1_fCJxkor4HDQ_9df3ckHv";

  async function supabaseFetch(path, options={}) {
    const headers = {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
      "Content-Type": "application/json",
      ...(options.headers || {})
    };
    const response = await fetch(SUPABASE_URL + "/rest/v1/" + path, {...options, headers});
    if (!response.ok) {
      let msg = "Shared marketplace request failed.";
      try { const body = await response.json(); msg = body.message || body.hint || msg; } catch {}
      throw new Error(msg);
    }
    return response.status === 204 ? null : response.json();
  }

  async function loadSharedMarketplace() {
    try {
      const [jobs, helpers] = await Promise.all([
        supabaseFetch("jobs?select=*&status=eq.Open&order=created_at.desc"),
        supabaseFetch("helpers?select=*&available=eq.true&order=created_at.desc")
      ]);
      const d = read();
      d.jobs = jobs || [];
      d.helpers = helpers || [];
      save(d);
      renderLocalListings();
      status("Live marketplace connected: " + d.jobs.length + " job(s) and " + d.helpers.length + " helper(s).");
    } catch (error) {
      console.error("Shared marketplace load failed:", error);
      status("Live marketplace is temporarily unavailable. Showing the local test listings.");
    }
  }

  async function saveSharedSubmission(form, data) {
    if (form.classList.contains("request-form")) {
      const rows = await supabaseFetch("jobs", {
        method: "POST",
        headers: {"Prefer":"return=representation"},
        body: JSON.stringify({
          service: data.service,
          location: data.location,
          description: data.description,
          name: data.name,
          contact: data.contact,
          budget: data.budget,
          status: "Open"
        })
      });
      return rows?.[0];
    }
    if (form.classList.contains("helper-form")) {
      const rows = await supabaseFetch("helpers", {
        method: "POST",
        headers: {"Prefer":"return=representation"},
        body: JSON.stringify({
          name: data.helper_name,
          location: data.helper_location,
          skills: data.skills,
          contact: data.helper_contact,
          available: true
        })
      });
      return rows?.[0];
    }
    return null;
  }

  renderLocalListings();
  loadSharedMarketplace();
})();