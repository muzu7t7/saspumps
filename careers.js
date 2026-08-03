// This file contains the job openings for the careers page.
// To add or remove openings, simply edit the 'jobOpenings' array below.

const jobOpenings = [
    /* {
         title: "Sales Engineer",
         department: "Sales & Marketing",
         location: "Dubai, UAE",
         type: "Full-Time",
         description: "We are actively looking for an experienced Sales Engineer with a strong background in water pumping systems and solar solutions."
     },
     {
         title: "Service Technician",
         department: "Maintenance",
         location: "Dubai, UAE",
         type: "Full-Time",
         description: "Seeking a skilled technician to handle installation, troubleshooting, and maintenance of our pumping and energy systems."
     } */
];

document.addEventListener('DOMContentLoaded', () => {
    const jobsContainer = document.getElementById('jobs-container');
    const noJobsMsg = document.getElementById('no-jobs-msg');

    if (!jobsContainer) return;

    if (jobOpenings.length === 0) {
        noJobsMsg.style.display = 'block';
    } else {
        jobOpenings.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card fade-in-up';

            card.innerHTML = `
                <h3 class="job-title">${job.title}</h3>
                <div class="job-meta">
                    <span><i class="fas fa-briefcase"></i> ${job.department}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="fas fa-clock"></i> ${job.type}</span>
                </div>
                <p class="job-desc">${job.description}</p>
                <a href="mailto:info@saspumps.com?subject=Application for ${encodeURIComponent(job.title)}" class="btn-primary-sm">Apply Now</a>
            `;

            jobsContainer.appendChild(card);
        });
    }
});
