// Job openings for the careers page.
// To add an opening, copy the example below into the array. Each job is also
// published to Google Jobs as JobPosting structured data, so keep
// datePosted / validThrough accurate (YYYY-MM-DD) and remove filled roles.

const jobOpenings = [
    /* {
        title: "Sales Engineer",
        department: "Sales & Marketing",
        location: "Dubai, UAE",
        type: "Full-Time",            // Full-Time | Part-Time | Contract | Internship
        datePosted: "2026-09-01",
        validThrough: "2026-12-31",
        description: "We are looking for an experienced Sales Engineer with a strong background in water pumping systems and solar solutions."
    }, */
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('jobs-container');
    const emptyState = document.getElementById('no-jobs-msg');
    if (!container) return;

    if (jobOpenings.length === 0) {
        emptyState.hidden = false;
        return;
    }

    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;

    container.innerHTML = jobOpenings.map((job) => `
        <article class="card job">
            <span class="job-dept">${esc(job.department)}</span>
            <h2>${esc(job.title)}</h2>
            <div class="job-meta">
                <span class="chip">${icon('pin')} ${esc(job.location)}</span>
                <span class="chip">${icon('clock')} ${esc(job.type)}</span>
            </div>
            <p>${esc(job.description)}</p>
            <a class="btn btn-primary btn-sm" href="mailto:info@saspumps.com?subject=${encodeURIComponent('Application: ' + job.title)}">
                Apply now ${icon('arrow')}
            </a>
        </article>`).join('');

    // Structured data for Google Jobs
    const employmentType = (t) => String(t).toUpperCase().replace(/[\s-]+/g, '_');
    const postings = jobOpenings.map((job) => ({
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description: `<p>${esc(job.description)}</p>`,
        datePosted: job.datePosted,
        validThrough: job.validThrough,
        employmentType: employmentType(job.type),
        hiringOrganization: {
            '@type': 'Organization',
            name: 'Shaduf Al Sahra Trading',
            sameAs: 'https://saspumps.com/',
            logo: 'https://saspumps.com/assets/icons/icon-512.png'
        },
        jobLocation: {
            '@type': 'Place',
            address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressRegion: 'Dubai', addressCountry: 'AE' }
        }
    }));
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify(postings);
    document.head.appendChild(ld);
});
