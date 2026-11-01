async function loadRepos() {
  const response = await fetch("https://api.github.com/users/gabbe03/repos");
  const repos = await response.json();
}
