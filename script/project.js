const USERNAME = "gabbe03";
const API_URL = `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=30`;
const DEFAULT_IMAGE = "../img/project-1.png";

loadProjects();

async function loadProjects() {
  const grid = document.getElementById("project-grid");
  const status = document.getElementById("project-status");

  showLoading(status);

  try {
    const [repos, extras] = await Promise.all([fetchRepos(), fetchExtras()]);

    const ownRepos = repos.filter((repo) => !repo.fork);

    if (ownRepos.length === 0) {
      showMessage(status, "No public repositories found.");
      return;
    }

    grid.innerHTML = ownRepos
      .map((repo) => createCardHTML(repo, extras[repo.name]))
      .join("");

    status.innerHTML = "";
  } catch (error) {
    console.error(error);
    showError(status, error);
  }
}

async function fetchRepos() {
  const response = await fetch(API_URL, {
    signal: AbortSignal.timeout(10000),
  });

  if (response.status === 403 || response.status === 429) {
    throw new Error(
      "GitHub is limiting requests right now. Please wait a while and reload the page.",
    );
  }
  if (response.status === 404) {
    throw new Error(`Could not find the GitHub user "${USERNAME}".`);
  }
  if (!response.ok) {
    throw new Error(`GitHub answered with error code ${response.status}.`);
  }

  return response.json();
}

async function fetchExtras() {
  try {
    const response = await fetch("../data/project.json");
    if (!response.ok) return {};
    return await response.json();
  } catch {
    return {};
  }
}

function createCardHTML(repo, extra = {}) {
  const image = extra?.image || DEFAULT_IMAGE;
  const description = repo.description || "No description yet.";
  const stack = repo.language || "Not specified";
  const liveUrl = repo.homepage;

  const liveLink = liveUrl
    ? `<a class="project-link" href="${escapeHTML(liveUrl)}" target="_blank" rel="noopener">
         <img class="project-link-icon" src="../img/link-icon.png" alt="" />Live Preview
       </a>`
    : "";

  return `
    <article class="project-card">
      <img class="project-img" src="${escapeHTML(image)}" alt="Preview of ${escapeHTML(repo.name)}" />
      <div class="project-body">
        <h3 class="project-name">${escapeHTML(repo.name)}</h3>
        <p class="project-desc">${escapeHTML(description)}</p>
        <p class="project-stack">
          <span class="project-stack-label">Tech stack :</span>
          ${escapeHTML(stack)}
        </p>
        <div class="project-links">
          ${liveLink}
          <a class="project-link" href="${escapeHTML(repo.html_url)}" target="_blank" rel="noopener">
            <img class="project-link-icon" src="../img/github-icon.svg" alt="" />View Code
          </a>
        </div>
      </div>
    </article>
  `;
}

function showLoading(status) {
  status.innerHTML = `
    <div class="spinner" aria-hidden="true"></div>
    <p>Loading projects…</p>
  `;
}

function showMessage(status, text) {
  status.innerHTML = `<p>${escapeHTML(text)}</p>`;
}

function showError(status, error) {
  let text;
  if (error.name === "TimeoutError") {
    text = "GitHub took too long to answer. Please try again.";
  } else if (error instanceof TypeError) {
    text =
      "Could not reach GitHub. Check your internet connection and try again.";
  } else {
    text = error.message;
  }

  status.innerHTML = `
    <p class="status-error" role="alert">${escapeHTML(text)}</p>
    <button type="button" id="retry-button" class="retry-button">Try again</button>
  `;

  document
    .getElementById("retry-button")
    .addEventListener("click", loadProjects);
}

function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
