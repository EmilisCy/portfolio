import '../css/styles.css';
// You might need to find a suitable obfuscator that works in the browser or do it manually

/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link');

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu');
};
navLink.forEach(n => n.addEventListener('click', linkAction));

/*=============== SHADOW HEADER ===============*/
const shadowHeader = () => {
    const header = document.getElementById('header');
    // When the scroll is greater than 50 viewport height, add the shadow-header class to the header tag
    window.scrollY >= 50 ? header.classList.add('shadow-header')
                         : header.classList.remove('shadow-header');
};
window.addEventListener('scroll', shadowHeader);

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
    const scrollUpElement = document.getElementById('scroll-up');
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
    window.scrollY >= 350 ? scrollUpElement.classList.add('show-scroll')
                          : scrollUpElement.classList.remove('show-scroll');
};
window.addEventListener('scroll', scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollDown = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            sectionsClass.classList.add('active-link');
        } else {
            sectionsClass.classList.remove('active-link');
        }
    });
};
window.addEventListener('scroll', scrollActive);

/*=============== DARK LIGHT THEME ===============*/
const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'ri-sun-line';

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

// We validate if the user previously chose a topic
if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme);
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true // Animations repeat
});

sr.reveal(`.home__perfil, .about__image, .contact__mail`, { origin: 'right' });
sr.reveal(`.home__name, .home__info,
      .about__container .section__title-1, .about__info,
      .contact__social, .contact__data`, { origin: 'left' });
sr.reveal(`.services__card, .projects__card, .logos`, { interval: 100 });

document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            document.getElementById('contact-message').textContent = 'Thank you for your message!';
            form.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    document.getElementById('contact-message').textContent = data.errors.map(error => error.message).join(', ');
                } else {
                    document.getElementById('contact-message').textContent = 'Oops! There was a problem submitting your form';
                }
            });
        }
    }).catch(error => {
        document.getElementById('contact-message').textContent = 'Oops! There was a problem submitting your form';
    });
});

document.addEventListener('DOMContentLoaded', () => {
  // Select all the popup containers, buttons, and close buttons
  const buttons = document.querySelectorAll('.projects__button');
  const popups = document.querySelectorAll('.projects__popup-container');
  const closeButtons = document.querySelectorAll('.projects__close-btn');

  // Open modal on button click
  buttons.forEach(button => {
      button.addEventListener('click', (event) => {
          event.preventDefault(); // Prevent the default action (like page jump)
          const popupId = button.getAttribute('href');
          const popup = document.querySelector(popupId);
          if (popup) {
              popup.classList.add('active');
          }
      });
  });

  // Close modal on close button click
  closeButtons.forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
          popups.forEach(popup => {
              popup.classList.remove('active');
          });
      });
  });

  // Close modal when clicking outside of the modal content
  popups.forEach(popup => {
      popup.addEventListener('click', (event) => {
          if (event.target === popup) {
              popup.classList.remove('active');
          }
      });
  });
});
