document.addEventListener('DOMContentLoaded', () => {

  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const hamburger = document.getElementById('hamburger');
  const closeBtn = document.getElementById('sidebar-close');
  const navLinks = document.querySelector('.nav-links');

  function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  }

  hamburger.addEventListener('click', openSidebar);
  closeBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  // Tapping a nav link should close the mobile drawer so it doesn't cover the page
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });

  let allProjects = [];

  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      renderPersonalInfo(data.personalInfo);
      renderSkills(data.skills);

      allProjects = data.projects;
      renderProjectFilters(allProjects);
      renderProjects(allProjects);

      renderCertifications(data.certifications);
      renderEducation(data.education);
    })
    .catch(error => console.error('Data pipeline error:', error));

  function renderPersonalInfo(info) {
    document.getElementById('hero-name').textContent = info.name;
    document.getElementById('hero-role').textContent = info.role;
    document.getElementById('hero-tagline').textContent = info.tagline;
    document.getElementById('sidebar-logo').textContent = info.name;
    document.getElementById('mobile-topbar-name').textContent = info.name;

    const socialHtml = `
      <a href="${info.github}" target="_blank" class="social-btn">GitHub &#8599;</a>
      <a href="mailto:${info.email}" class="social-btn">Email &#9993;</a>
    `;
    document.getElementById('sidebar-socials').innerHTML = socialHtml;

    document.querySelector('footer p').innerHTML = `&copy; ${new Date().getFullYear()} ${info.name}. Built for Web Development 1.`;
  }

  function renderSkills(skillsData) {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';
    skillsData.forEach(group => {
      const items = group.items.map(i => `<li>${i}</li>`).join('');
      container.innerHTML += `<article class="skill-category"><h3>${group.category}</h3><ul>${items}</ul></article>`;
    });
  }

  function renderProjectFilters(projects) {
    const filterContainer = document.getElementById('project-filters');

    const uniqueTags = new Set();
    projects.forEach(p => p.tags.forEach(tag => uniqueTags.add(tag)));

    let filterHtml = `<button class="filter-btn active" data-filter="all">All</button>`;

    uniqueTags.forEach(tag => {
      filterHtml += `<button class="filter-btn" data-filter="${tag}">${tag}</button>`;
    });

    filterContainer.innerHTML = filterHtml;

    const filterButtons = filterContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const filterValue = e.target.getAttribute('data-filter');
        if (filterValue === 'all') {
          renderProjects(allProjects);
        } else {
          const filtered = allProjects.filter(p => p.tags.includes(filterValue));
          renderProjects(filtered);
        }
      });
    });
  }

  function renderProjects(projectsData) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    projectsData.forEach(project => {
      const tags = project.tags.map(t => `<span class="tag">${t}</span>`).join('');
      container.innerHTML += `
        <article class="project-card">
          <img src="${project.image}" alt="${project.title}">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tags">${tags}</div>
          <a href="${project.link}" target="_blank">View Code</a>
        </article>
      `;
    });
  }

  function renderCertifications(certsData) {
    const container = document.getElementById('certifications-container');
    if (!certsData) return;
    container.innerHTML = '';

    certsData.forEach(cert => {
      container.innerHTML += `
        <article class="timeline-item">
          <h3>${cert.title}</h3>
          <strong>${cert.issuer}</strong> | <span>${cert.date}</span>
          <p>${cert.description}</p>
        </article>
      `;
    });
  }

  function renderEducation(educationData) {
    const container = document.getElementById('education-container');
    container.innerHTML = '';
    educationData.forEach(edu => {
      container.innerHTML += `
        <article class="timeline-item">
          <h3>${edu.title}</h3>
          <strong>${edu.institution}</strong> | <span>${edu.period}</span>
          <p>${edu.description}</p>
        </article>
      `;
    });
  }

  // Highlight the current section's link in the sidebar as the user scrolls
  const sections = document.querySelectorAll('main section[id]');
  const sidebarLinks = document.querySelectorAll('.nav-links a');

  const setActive = (id) => {
    sidebarLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
  };

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }
});