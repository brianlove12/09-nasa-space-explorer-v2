// Fun space facts array
const spaceFacts = [
	"Did you know? The largest volcano in the solar system is Olympus Mons on Mars!",
	"Did you know? Neutron stars can spin at a rate of 600 times per second!",
	"Did you know? A day on Venus is longer than its year.",
	"Did you know? There are more stars in the universe than grains of sand on Earth.",
	"Did you know? Jupiter has 95 known moons!",
	"Did you know? The Sun accounts for 99.86% of the mass in our solar system.",
	"Did you know? Saturn could float in water because it is mostly made of gas.",
	"Did you know? The footprints on the Moon will remain for millions of years.",
	"Did you know? Light from the Sun takes about 8 minutes to reach Earth.",
	"Did you know? The Milky Way galaxy is about 100,000 light-years across!"
,
	"Did you know? Mercury has no atmosphere, so its sky is always black.",
	"Did you know? The Great Red Spot on Jupiter is a giant storm bigger than Earth.",
	"Did you know? Uranus rotates on its side, unlike any other planet.",
	"Did you know? The International Space Station travels at 28,000 km/h.",
	"Did you know? Pluto is smaller than Earth's Moon.",
	"Did you know? The hottest planet in our solar system is Venus.",
	"Did you know? Comets are made of ice, dust, and rocky material.",
	"Did you know? The first living creatures in space were fruit flies.",
	"Did you know? The Andromeda Galaxy will collide with the Milky Way in about 4 billion years.",
	"Did you know? A spoonful of a neutron star would weigh about a billion tons!"
];

// Pick a random fact and display it
const spaceFactDiv = document.getElementById('spaceFact');
if (spaceFactDiv) {
	const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
	spaceFactDiv.textContent = randomFact;
}
// Use the provided CDN JSON feed for APOD-style entries
const apodDataUrl = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';
// Get the button, date inputs, and gallery elements from the page
const getImageBtn = document.getElementById('getImageBtn');
const startDateInput = document.getElementById('startDateInput');
const endDateInput = document.getElementById('endDateInput');
const gallery = document.getElementById('gallery');

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}
// ...existing code...

// Add a click event listener to the button
// Function to render gallery items
function renderGallery(data) {
	gallery.innerHTML = '';
	if (data.length === 0) {
		gallery.innerHTML = '<p>No space images found for this date range.</p>';
		return;
	}
	data.forEach(item => {
		const itemDiv = document.createElement('div');
		itemDiv.className = 'gallery-item';
		let mediaElement;
		if (item.media_type === 'image') {
			// Display image
			mediaElement = document.createElement('img');
			mediaElement.src = item.url;
			mediaElement.alt = item.title;
		} else if (item.media_type === 'video') {
			// For YouTube videos, show thumbnail image with a clickable link
			if (item.url.includes('youtube.com/embed') && item.thumbnail_url) {
				mediaElement = document.createElement('a');
				mediaElement.href = item.url;
				mediaElement.target = '_blank';
				const thumbImg = document.createElement('img');
				thumbImg.src = item.thumbnail_url;
				thumbImg.alt = item.title + ' (YouTube video)';
				mediaElement.appendChild(thumbImg);
			} else if (item.media_type === 'video' && item.thumbnail_url) {
				// For other videos, show thumbnail image with a clickable link
				mediaElement = document.createElement('a');
				mediaElement.href = item.url;
				mediaElement.target = '_blank';
				const thumbImg = document.createElement('img');
				thumbImg.src = item.thumbnail_url;
				thumbImg.alt = item.title + ' (video)';
				mediaElement.appendChild(thumbImg);
			} else {
				// Fallback: embed video in iframe
				mediaElement = document.createElement('iframe');
				mediaElement.src = item.url;
				mediaElement.width = '100%';
				mediaElement.height = '200';
				mediaElement.allow = 'fullscreen';
			}
		}
		const titleElement = document.createElement('p');
		titleElement.textContent = `Title: ${item.title}`;
		titleElement.style.fontWeight = 'bold';
		const dateElement = document.createElement('p');
		dateElement.textContent = `Date: ${item.date}`;
		if (mediaElement) itemDiv.appendChild(mediaElement);
		itemDiv.appendChild(titleElement);
		itemDiv.appendChild(dateElement);
		gallery.appendChild(itemDiv);

		// Add click event to open modal with details
		itemDiv.addEventListener('click', () => {
			showModal(item);
		});
	});
}

// Modal logic
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('closeModal');
const modalMedia = document.getElementById('modalMedia');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');

function showModal(item) {
	// Clear previous content
	modalMedia.innerHTML = '';
	// Show larger image or video
	if (item.media_type === 'image') {
		const img = document.createElement('img');
		img.src = item.hdurl || item.url;
		img.alt = item.title;
		modalMedia.appendChild(img);
	} else if (item.media_type === 'video') {
		if (item.url.includes('youtube.com/embed')) {
			const iframe = document.createElement('iframe');
			iframe.src = item.url;
			iframe.width = '100%';
			iframe.height = '350';
			iframe.allow = 'fullscreen';
			modalMedia.appendChild(iframe);
		} else if (item.thumbnail_url) {
			const a = document.createElement('a');
			a.href = item.url;
			a.target = '_blank';
			const thumbImg = document.createElement('img');
			thumbImg.src = item.thumbnail_url;
			thumbImg.alt = item.title + ' (video)';
			a.appendChild(thumbImg);
			modalMedia.appendChild(a);
		} else {
			const iframe = document.createElement('iframe');
			iframe.src = item.url;
			iframe.width = '100%';
			iframe.height = '350';
			iframe.allow = 'fullscreen';
			modalMedia.appendChild(iframe);
		}
	}
	// Set title, date, and explanation
	modalTitle.textContent = item.title;
	modalDate.textContent = `Date: ${item.date}`;
	modalExplanation.textContent = item.explanation;
	// Show modal
	modal.style.display = 'flex';
}

// Close modal when X is clicked
closeModalBtn.addEventListener('click', () => {
	modal.style.display = 'none';
});

// Close modal when clicking outside modal content
modal.addEventListener('click', (event) => {
	if (event.target === modal) {
		modal.style.display = 'none';
	}
});

let allApodData = [];

// Show loading message before fetching
gallery.innerHTML = '<div class="loading-message">Loading space photos…</div>';
// Fetch all APOD data once on page load
fetch(apodDataUrl)
	.then(response => response.json())
	.then(data => {
		allApodData = data;
		renderGallery(allApodData); // Show all items by default
	})
	.catch(error => {
		console.error('Error fetching APOD data:', error);
		gallery.innerHTML = '<p>Failed to fetch space images. Please try again.</p>';
	});

// Add a click event listener to the button
getImageBtn.addEventListener('click', () => {
	// Filter by date range if both dates are selected
	const startDateStr = startDateInput.value;
	const endDateStr = endDateInput.value;
	let filteredData = allApodData;
	if (startDateStr && endDateStr) {
		const startDate = new Date(startDateStr);
		const endDate = new Date(endDateStr);
		const startDateFormatted = formatDate(startDate);
		const endDateFormatted = formatDate(endDate);
		filteredData = allApodData.filter(item => {
			return item.date >= startDateFormatted && item.date <= endDateFormatted;
		});
	}
	renderGallery(filteredData);
});