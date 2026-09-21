const defaults = [
  {
    name: "CyberGuard",
    desc: "Cybersecurity learning and scanner app with password tools, phishing URL checks, security checklist, news and quizzes.",
    details: "CyberGuard is a Flutter-based cybersecurity learning and utility app. It combines learning modules with practical security tools such as password strength checking, password generation, phishing URL checking, security checklists and quizzes. The project also explores local storage and API-based features.",
    tech: ["Flutter","Dart","Hive","REST APIs"],
    github: "https://github.com/abrar4465/cyber-Gaurd-assistant",
    live: "",
    images: [],
    mark: "CG"
  },
  {
    name: "Eagle Eye Security",
    desc: "Flutter desktop shop-management concept for products, billing, sales reports and dashboards.",
    details: "Eagle Eye Security is a Flutter desktop inventory and billing application concept. It includes product management, stock updates, sales reporting, billing totals and local Hive storage. The interface was designed for a practical CCTV/security shop workflow.",
    tech: ["Flutter","Dart","Hive","Desktop"],
    github: "https://github.com/abrar4465/eagle-eye-security",
    live: "",
    images: [],
    mark: "EE"
  },
  {
    name: "Grain Marketplace",
    desc: "FYP marketplace concept connecting farmers and buyers through grain listings and competitive bidding.",
    details: "A grain-focused marketplace concept for connecting farmers and buyers. Farmers can publish grain listings while buyers can view listings and participate in competitive bidding. The project is designed around a clear marketplace workflow and data-driven decision making.",
    tech: ["Flutter","Backend","Database"],
    github: "",
    live: "",
    images: [],
    mark: "GM"
  }
];

const STORAGE_KEY = "abrarProjects3D_v2";
const OLD_STORAGE_KEY = "abrarProjects3D";

let saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
if (!saved) {
  const old = JSON.parse(localStorage.getItem(OLD_STORAGE_KEY) || "[]");
  saved = old.map(p => ({
    ...p,
    images: p.images?.length ? p.images : (p.image ? [p.image] : [])
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

let projects = [...defaults, ...saved];
let editingIndex = -1;
let selectedExistingImages = [];

const grid = document.getElementById("projectGrid");
const pd = document.getElementById("projectDialog");
const form = document.getElementById("projectForm");
const files = document.getElementById("pImage");
const preview = document.getElementById("preview");
const detailsDialog = document.getElementById("detailsDialog");
const detailsContent = document.getElementById("detailsContent");

const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[m]));

const url = u => {
  try {
    const x = new URL(u);
    return /^https?:$/.test(x.protocol) ? x.href : "#";
  } catch {
    return "#";
  }
};

function projectImages(p) {
  if (Array.isArray(p.images) && p.images.length) return p.images;
  if (p.image) return [p.image];
  return [];
}

function render() {
  grid.innerHTML = projects.map((p, i) => {
    const imgs = projectImages(p);
    const cover = imgs[0];
    return `
      <article class="project glass" data-project-index="${i}" tabindex="0" role="button" aria-label="Open ${esc(p.name)} details">
        <div class="project-img">
          ${cover
            ? `<img src="${cover}" alt="${esc(p.name)} screenshot">`
            : `<div class="project-placeholder">${esc(p.mark || String(i + 1).padStart(2,"0"))}</div>`}
          <div class="view-project">View project ↗</div>
          ${imgs.length > 1 ? `<span class="image-count">▧ ${imgs.length} screenshots</span>` : ""}
        </div>
        <div class="project-body">
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.desc)}</p>
          <div class="chips">${(p.tech || []).map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
          <div class="project-card-footer">
            <span class="details-link">View details →</span>
            <div class="links">
              ${p.github ? `<a href="${url(p.github)}" target="_blank" rel="noopener" data-external="true">GitHub ↗</a>` : ""}
              ${p.live ? `<a href="${url(p.live)}" target="_blank" rel="noopener" data-external="true">Live ↗</a>` : ""}
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".project").forEach(card => {
    const index = Number(card.dataset.projectIndex);
    card.addEventListener("click", e => {
      if (e.target.closest("[data-external]")) return;
      openDetails(index);
    });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDetails(index);
      }
    });
  });
}

function openDetails(index) {
  const p = projects[index];
  if (!p) return;

  const imgs = projectImages(p);
  detailsContent.innerHTML = `
    <div class="details-hero">
      <div>
        <small>PROJECT CASE STUDY</small>
        <h2>${esc(p.name)}</h2>
        <p>${esc(p.desc)}</p>
        <div class="chips">${(p.tech || []).map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
        <div class="details-actions">
          ${p.github ? `<a class="btn solid" href="${url(p.github)}" target="_blank" rel="noopener">GitHub ↗</a>` : ""}
          ${p.live ? `<a class="btn glass" href="${url(p.live)}" target="_blank" rel="noopener">Live Demo ↗</a>` : ""}
        </div>
      </div>
    </div>

    ${imgs.length ? `
      <section class="details-section">
        <div class="details-section-head"><small>SCREENSHOTS</small><span>${imgs.length} image${imgs.length === 1 ? "" : "s"}</span></div>
        <div class="screenshot-gallery">
          ${imgs.map((img, n) => `<button class="screenshot-item" type="button" data-gallery-index="${n}"><img src="${img}" alt="${esc(p.name)} screenshot ${n+1}"><span>Open ${n+1}</span></button>`).join("")}
        </div>
      </section>
    ` : ""}

    <section class="details-section">
      <small>OVERVIEW</small>
      <p class="details-text">${esc(p.details || p.desc)}</p>
    </section>
  `;

  detailsContent.querySelectorAll(".screenshot-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const n = Number(btn.dataset.galleryIndex);
      openImageViewer(imgs, n, p.name);
    });
  });

  detailsDialog.showModal();
}

function openImageViewer(images, start, title) {
  let index = start;
  const viewer = document.createElement("dialog");
  viewer.className = "image-viewer";
  viewer.innerHTML = `
    <button class="viewer-close" type="button">×</button>
    <button class="viewer-prev" type="button" aria-label="Previous screenshot">‹</button>
    <img class="viewer-image" alt="">
    <button class="viewer-next" type="button" aria-label="Next screenshot">›</button>
    <div class="viewer-caption"></div>
  `;
  document.body.appendChild(viewer);

  const image = viewer.querySelector(".viewer-image");
  const caption = viewer.querySelector(".viewer-caption");

  function update() {
    image.src = images[index];
    image.alt = `${title} screenshot ${index + 1}`;
    caption.textContent = `${title} · ${index + 1} / ${images.length}`;
  }

  viewer.querySelector(".viewer-close").onclick = () => {
    viewer.close();
    viewer.remove();
  };
  viewer.querySelector(".viewer-prev").onclick = () => {
    index = (index - 1 + images.length) % images.length;
    update();
  };
  viewer.querySelector(".viewer-next").onclick = () => {
    index = (index + 1) % images.length;
    update();
  };
  viewer.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") viewer.querySelector(".viewer-prev").click();
    if (e.key === "ArrowRight") viewer.querySelector(".viewer-next").click();
    if (e.key === "Escape") viewer.close();
  });
  viewer.addEventListener("close", () => viewer.remove());

  update();
  viewer.showModal();
}

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  projects = [...defaults, ...saved];
  render();
}

function resetForm() {
  form.reset();
  editingIndex = -1;
  selectedExistingImages = [];
  preview.innerHTML = "";
  document.getElementById("projectFormTitle").textContent = "Add your project";
  document.getElementById("cancelEdit").textContent = "Cancel";
}

function showPreview() {
  preview.innerHTML = selectedExistingImages.map((img, i) => `
    <div class="preview-item">
      <img src="${img}" alt="Existing screenshot ${i+1}">
      <button type="button" data-remove-existing="${i}">×</button>
    </div>
  `).join("");

  [...files.files].forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = () => {
      preview.insertAdjacentHTML("beforeend", `
        <div class="preview-item">
          <img src="${reader.result}" alt="New screenshot ${i+1}">
          <span class="new-badge">NEW</span>
        </div>
      `);
    };
    reader.readAsDataURL(file);
  });

  preview.querySelectorAll("[data-remove-existing]").forEach(btn => {
    btn.onclick = () => {
      selectedExistingImages.splice(Number(btn.dataset.removeExisting), 1);
      showPreview();
    };
  });
}

files.onchange = showPreview;

document.getElementById("addBtn").onclick = () => {
  resetForm();
  pd.showModal();
};

document.getElementById("closeDialog").onclick = () => pd.close();
document.getElementById("cancelEdit").onclick = () => pd.close();

form.onsubmit = async e => {
  e.preventDefault();

  const newImages = [];
  for (const f of [...files.files]) {
    newImages.push(await imageData(f));
  }

  const p = {
    name: pName.value.trim(),
    desc: pDesc.value.trim(),
    details: pDetails.value.trim(),
    tech: pTech.value.split(",").map(x => x.trim()).filter(Boolean),
    github: pGithub.value.trim(),
    live: pLive.value.trim(),
    images: [...selectedExistingImages, ...newImages],
    mark: pName.value.trim().slice(0, 2).toUpperCase()
  };

  if (editingIndex >= 0) {
    saved[editingIndex] = p;
  } else {
    saved.push(p);
  }

  saveProjects();
  resetForm();
  pd.close();
};

document.getElementById("resetBtn").onclick = () => {
  if (confirm("Delete all projects added through this browser?")) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(OLD_STORAGE_KEY);
    saved = [];
    projects = [...defaults];
    render();
    pd.close();
  }
};

function imageData(file) {
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const max = 1200;
        const s = Math.min(1, max / im.width);
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(im.width * s));
        c.height = Math.max(1, Math.round(im.height * s));
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", .82));
      };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

// Profile photo
const profD = document.getElementById("profileDialog");
const profFile = document.getElementById("profileFile");

document.getElementById("profileBtn").onclick = () => profD.showModal();
document.getElementById("profileUpload").onclick = () => profD.showModal();
document.getElementById("closeProfile").onclick = () => profD.close();

profFile.onchange = () => {
  const f = profFile.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => document.getElementById("profilePreview").innerHTML = `<img src="${r.result}" alt="profile preview">`;
  r.readAsDataURL(f);
};

document.getElementById("profileForm").onsubmit = async e => {
  e.preventDefault();
  const data = await imageData(profFile.files[0]);
  localStorage.setItem("abrarProfile3D", data);
  applyProfile(data);
  profD.close();
};

document.getElementById("removeProfile").onclick = () => {
  localStorage.removeItem("abrarProfile3D");
  applyProfile("");
  profD.close();
};

function applyProfile(data) {
  const box = document.getElementById("profileImage");
  box.querySelector("img")?.remove();
  if (data) {
    const im = document.createElement("img");
    im.src = data;
    im.alt = "Abrar Mughal profile";
    box.prepend(im);
  }
}

applyProfile(localStorage.getItem("abrarProfile3D") || "");

document.getElementById("closeDetails").onclick = () => detailsDialog.close();

document.getElementById("hamb").onclick = () => {
  const n = document.querySelector("nav");
  n.style.display = n.style.display === "flex" ? "none" : "flex";
  n.style.position = "absolute";
  n.style.top = "60px";
  n.style.right = "10px";
  n.style.flexDirection = "column";
  n.style.padding = "18px";
  n.style.borderRadius = "15px";
  n.className = "glass";
};

render();
