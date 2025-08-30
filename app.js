
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}


const reveal = new IntersectionObserver((entries)=>{
  for(const e of entries){
    if(e.isIntersecting){ e.target.classList.add('visible'); reveal.unobserve(e.target); }
  }
}, { threshold:.15 });
document.querySelectorAll('[data-animate]').forEach(el=>reveal.observe(el));

// ===== Marquee pause on hover =====
document.querySelectorAll('.marquee').forEach(m=>{
  m.addEventListener('mouseenter', ()=> m.style.animationPlayState = 'paused');
  m.addEventListener('mouseleave', ()=> m.style.animationPlayState = 'running');
});

// ===== Estimator logic =====
const damageTypeEl = document.getElementById('damageType');
const optionsWrap = document.getElementById('optionsWrap');
const majorGroups = document.getElementById('majorGroups');
const minorGroups = document.getElementById('minorGroups');
const totalEl = document.getElementById('total');
const selectedCountEl = document.getElementById('selectedCount');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');
const companyEl = document.getElementById('company');

function updateTotal() {
  const checks = optionsWrap.querySelectorAll('input[type="checkbox"]:checked');
  let total = 0;
  checks.forEach(c => total += Number(c.dataset.price || 0));
  totalEl.textContent = '₹' + total.toLocaleString('en-IN');
  selectedCountEl.textContent = `${checks.length} item${checks.length!==1?'s':''} selected`;
}

function bindCheckboxes() {
  optionsWrap.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.removeEventListener('change', updateTotal);
    cb.addEventListener('change', updateTotal);
  });
}

if (damageTypeEl) {
  damageTypeEl.addEventListener('change', () => {
    optionsWrap.classList.remove('hidden');
    if (damageTypeEl.value === 'major') {
      majorGroups.classList.remove('hidden');
      minorGroups.classList.add('hidden');
    } else if (damageTypeEl.value === 'minor') {
      minorGroups.classList.remove('hidden');
      majorGroups.classList.add('hidden');
    } else {
      majorGroups.classList.add('hidden');
      minorGroups.classList.add('hidden');
    }
    // reset selections when changing type
    optionsWrap.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateTotal();
    bindCheckboxes();
  });
  bindCheckboxes();
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    companyEl.value = '';
    damageTypeEl.value = '';
    optionsWrap.classList.add('hidden');
    optionsWrap.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateTotal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    const company = companyEl.value || '(not selected)';
    const type = damageTypeEl.value || '(not selected)';
    const items = Array.from(optionsWrap.querySelectorAll('input[type="checkbox"]:checked')).map(cb => {
      const label = cb.parentElement.textContent.trim();
      const price = Number(cb.dataset.price || 0);
      return `• ${label}`;
    });
    const total = totalEl.textContent.replace('₹', '');
    const content = [
      'Suzail Motors — Quick Estimate',
      '----------------------------------------',
      `Company: ${company}`,
      `Damage Type: ${type}`,
      '',
      'Selected Items:',
      ...(items.length ? items : ['(none)']),
      '',
      `Total Estimate: ₹${total}`,
      '',
      `Generated on: ${new Date().toLocaleString()}`
    ].join('\n');

    const blob = new Blob([content], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estimate.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// ===== Contact form (demo) =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(contactForm).entries());
    alert(`Thanks, ${data.name}! We'll reach out at ${data.email}.`);
    contactForm.reset();
  });
}

// ===== Year =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
