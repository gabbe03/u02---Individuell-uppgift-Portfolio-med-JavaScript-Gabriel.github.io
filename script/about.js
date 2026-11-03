document.addEventListener("DOMContentLoaded", loadAboutData);

async function loadAboutData() {
  try {
    const response = await fetch("../data/about.json");
    if (!response.ok) {
      throw new Error(`about.json answered with status ${response.status}`);
    }

    const data = await response.json();
    renderList("work-list", data.work);
    renderList("education-list", data.education);
  } catch (error) {
    console.error("Could not load about.json:", error);
    showAboutError();
  }
}

function showAboutError() {
  const message = `<p class="status-error" role="alert">Could not load this information. Please try again later.</p>`;
  document.getElementById("work-list").innerHTML = message;
  document.getElementById("education-list").innerHTML = message;
}

function renderList(containerId, items) {
  const container = document.getElementById(containerId);

  container.innerHTML = items.map(createJobHTML).join("");
}

function createJobHTML(item) {
  const locationHTML = item.location;

  return `
    <article class="job">
      <div class="job-top">
        <h3 class="job-title">${item.title}</h3>
        <span class="badge">${item.type}</span>
      </div>
      <div class="job-bottom">
        <div class="job-meta">
          <span>
            <img class="location-icon" alt="" src="../img/office-building-icon.svg" />
            ${item.organization}
          </span>
          <span>
         <img class="location-icon" alt="" src="../img/location-icon.svg" />
         ${item.location}
       </span>
        </div>
        <span class="job-date">
          <img class="date-icon" alt="" src="../img/calender-icon.png" />
          ${item.date}
        </span>
      </div>
    </article>
  `;
}
