// Recent public repositories via GitHub's unauthenticated REST API — no
// token, no backend. Note: this is NOT the same as GitHub's "pinned repos"
// (that requires an authenticated GraphQL call, which can't be done safely
// from static client JS), so the section is labeled "Recent Repositories."
// Fails silently (hides the section) if the API is unreachable/rate-limited.
export async function initGithubActivity(containerId, username) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) throw new Error('No repos returned');

    container.innerHTML = repos
      .filter((r) => !r.fork)
      .slice(0, 6)
      .map(
        (r) => `
        <article class="repo-card glass" data-reveal="scale">
          <h3><a href="${r.html_url}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.name)}</a></h3>
          <p>${escapeHtml(r.description || 'No description provided.')}</p>
          <div class="repo-meta">
            ${r.language ? `<span>${escapeHtml(r.language)}</span>` : ''}
            <span>★ ${r.stargazers_count}</span>
            <span>Updated ${new Date(r.updated_at).toLocaleDateString()}</span>
          </div>
        </article>`
      )
      .join('');

    container.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
  } catch (e) {
    const section = container.closest('section');
    if (section) section.style.display = 'none';
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
