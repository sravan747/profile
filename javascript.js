const intro = document.getElementById("intro");
const website = document.getElementById("website");
const loader = document.getElementById("loader-progress");
const percent = document.getElementById("loading-percent");

let loading = 0;

const loadingTimer = setInterval(() => {
     loading += 1;
     loader.style.width = loading + "%";
     percent.textContent = loading;
     if (loading >= 100) {
          clearInterval(loadingTimer);
          setTimeout(() => {
               intro.style.transition =
                    "opacity 0.8s cubic-bezier(.16,1,.3,1)";
               intro.style.opacity = "0";
               website.style.display = "block";
               setTimeout(() => {
                    intro.style.display = "none";
                    startAnimations();
               }, 800);
          }, 250);
     }
}, 30);

/* =scroll re */

function startAnimations() {
     const revealElements =
          document.querySelectorAll(".reveal");

     const observer =
          new IntersectionObserver(
               (entries) => {
                    entries.forEach(entry => {
                         if (entry.isIntersecting) {
                              entry.target.classList.add("visible");
                         }
                    });
               },
               {
                    threshold: 0.15
               }
          );

     revealElements.forEach(element => {
          observer.observe(element);
     });

     /*
       Immediately reveal home title
     */

     setTimeout(() => {
          document
               .querySelectorAll("#home .reveal")
               .forEach(element => {
                    element.classList.add("visible");
               });
     }, 100);

     initNavigation();
     initCursor();
     initScrollEffects();
     initSpotlight();
}

/* navigation*/

function initNavigation() {
     const sections =
          document.querySelectorAll(".section");
     const navLinks =
          document.querySelectorAll(".nav-link");

     const sectionObserver =
          new IntersectionObserver(
               (entries) => {
                    entries.forEach(entry => {
                         if (entry.isIntersecting) {
                              const id =
                                   entry.target.getAttribute("id");

                              navLinks.forEach(link => {
                                   link.classList.remove("active");

                                   if (
                                        link.getAttribute("href")
                                        === "#" + id
                                   ) {
                                        link.classList.add("active");
                                   }
                              });
                         }
                    });
               },
               {
                    threshold: 0.45
               }
          );

     sections.forEach(section => {
          sectionObserver.observe(section);
     });
}

/* cursor  */

function initCursor() {
     const cursor =
          document.querySelector(".cursor-light");

     window.addEventListener("mousemove", (event) => {
          cursor.style.left =
               event.clientX + "px";
          cursor.style.top =
               event.clientY + "px";
          cursor.style.opacity = "1";
     });

     document.addEventListener("mouseleave", () => {
          cursor.style.opacity = "0";
     });
}


function initScrollEffects() {
     const heroTitle =
          document.querySelector(".hero-title");

     const heroDescription =
          document.querySelector(".hero-description");

     const heroGrid =
          document.querySelector(".hero-grid");

     const projects =
          document.querySelectorAll(".project");

     window.addEventListener("scroll", () => {
          const scroll =
               window.scrollY;

          /*
             HERO PARALLAX
          */

          if (heroTitle) {
               const movement =
                    Math.min(scroll * 0.25, 150);
               heroTitle.style.transform =
                    `translateY(-${movement}px)`;
               heroTitle.style.opacity =
                    Math.max(
                         0,
                         1 - scroll / 650
                    );
          }

          if (heroDescription) {
               const movement =
                    Math.min(scroll * 0.15, 80);
               heroDescription.style.transform =
                    `translateY(-${movement}px)`;
               heroDescription.style.opacity =
                    Math.max(
                         0,
                         1 - scroll / 450
                    );
          }

          /*
             HERO GRID MOVEMENT
          */

          if (heroGrid) {
               heroGrid.style.transform =
                    `translateY(${scroll * 0.08}px)`;
          }

          /*
             PROJECT SCALE
          */

          projects.forEach(project => {
               const rect =
                    project.getBoundingClientRect();
               const center =
                    window.innerHeight / 2;
               const distance =
                    Math.abs(
                         rect.top +
                         rect.height / 2 -
                         center
                    );

               const scale =
                    Math.max(
                         0.94,
                         1 - distance / 5000
                    );

               project.style.transform =
                    `scale(${scale})`;
          });
     });
}


/*  smooth */

document.addEventListener("mouseleave", () => {
     document
          .querySelectorAll(".project-visual")
          .forEach(visual => {
               visual.style.transform =
                    "translate(0, 0)";
          });
});

const WORDS = "SRAVAN EDUBILLI DEVELOPER CODE BUILD EXPERIMENT LEARN".split(" ");
const LIGHT_RADIUS = 110;

let wallSpans = [];
let spanPositions = [];
let mouseX = -9999;
let mouseY = -9999;
let frameQueued = false;

function fillTextWall() {
     const wall = document.querySelector(".text-wall");
     if (!wall) return;

     const fragment = document.createDocumentFragment();

     const rowCount = Math.ceil(window.innerHeight / 18);
     const wordsPerRow = 40;

     for (let r = 0; r < rowCount; r++) {
          const p = document.createElement("p");

          for (let i = 0; i < wordsPerRow; i++) {
               const span = document.createElement("span");

               span.textContent =
                    WORDS[(r + i) % WORDS.length] + "\u00A0\u00A0";

               p.appendChild(span);
          }

          fragment.appendChild(p);
     }

     wall.replaceChildren(fragment);

     wallSpans = Array.from(wall.querySelectorAll("span"));

     refreshSpotlightPositions();
}

function refreshSpotlightPositions() {
     spanPositions = wallSpans.map(span => {
          const rect = span.getBoundingClientRect();

          return {
               x: rect.left + rect.width / 2,
               y: rect.top + rect.height / 2
          };
     });
}

function updateWords() {
     frameQueued = false;

     wallSpans.forEach((span, index) => {
          const position = spanPositions[index];

          const distance = Math.hypot(
               position.x - mouseX,
               position.y - mouseY
          );

          const shouldGlow = distance < LIGHT_RADIUS;
          const isGlowing = span.classList.contains("lit");

          if (shouldGlow !== isGlowing) {
               span.classList.toggle("lit", shouldGlow);
          }
     });
}

function scheduleUpdate() {
     if (!frameQueued) {
          frameQueued = true;
          requestAnimationFrame(updateWords);
     }
}

function initSpotlight() {
     fillTextWall();

     window.addEventListener("resize", () => {
          fillTextWall();
     });

     window.addEventListener("scroll", () => {
          refreshSpotlightPositions();
     }, { passive: true });

     window.addEventListener("mousemove", event => {
          mouseX = event.clientX;
          mouseY = event.clientY;

          scheduleUpdate();
     });

     document.addEventListener("mouseleave", () => {
          mouseX = -9999;
          mouseY = -9999;

          scheduleUpdate();
     });
}
