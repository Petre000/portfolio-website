document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding content
            const targetTab = button.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});

// --- Modal Gallery Logic ---
const projectImages = {
    kitchenMixer: [
        { src: 'images/Slide1.JPG', caption: 'Title Slide' },
        { src: 'images/Slide2.JPG', caption: 'Project Overview' },
        { src: 'images/Slide3.JPG', caption: 'Problem Statement' },
        { src: 'images/Slide4.JPG', caption: 'Concept Development' },
        { src: 'images/Slide5.JPG', caption: 'Selection Process' },
        { src: 'images/New_6.png', caption: 'Final Concept' },
        { src: 'images/Slide7.JPG', caption: 'Part Diagrams' },
        { src: 'images/Slide8.JPG', caption: 'Gear Train Details' },
        { src: 'images/New_9.png', caption: 'Motor Specifications' },
        { src: 'images/Slide10.JPG', caption: 'CAD Assembly' },
        { src: 'images/Slide11.JPG', caption: 'Exploded View' },
        { src: 'images/Slide12.JPG', caption: 'Budget & Costing' },
        { src: 'images/Slide13.JPG', caption: 'Engineering Standards' },
        { src: 'images/Slide14.JPG', caption: 'Societal Impact' },
        { src: 'images/Slide15.JPG', caption: 'Conclusion' }
    ]
};

let currentProject = '';
let currentSlideIndex = 0;

const modal = document.getElementById('project-modal');
const modalImg = document.getElementById('modal-img');
const captionText = document.getElementById('modal-caption');

function openModal(projectId) {
    currentProject = projectId;
    currentSlideIndex = 0;
    
    if (projectImages[projectId] && projectImages[projectId].length > 0) {
        updateModalContent();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
    // Let fade transition finish before resetting text
    setTimeout(() => {
        modalImg.src = '';
        captionText.innerHTML = '';
    }, 300);
}

function changeSlide(direction) {
    const images = projectImages[currentProject];
    if (!images) return;
    
    currentSlideIndex += direction;
    
    // Loop around
    if (currentSlideIndex >= images.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = images.length - 1;
    }
    
    updateModalContent();
}

function updateModalContent() {
    const images = projectImages[currentProject];
    if (images && images[currentSlideIndex]) {
        modalImg.src = images[currentSlideIndex].src;
        captionText.innerHTML = `${images[currentSlideIndex].caption} (${currentSlideIndex + 1}/${images.length})`;
    }
}

// Close modal if user clicks outside the image container
modal.addEventListener('click', function(e) {
    if (e.target === modal || e.target.classList.contains('modal-gallery-container')) {
        closeModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (!modal.classList.contains('show')) return;
    
    if (event.key === 'Escape') {
        closeModal();
    } else if (event.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (event.key === 'ArrowRight') {
        changeSlide(1);
    }
});
