// club.js — Clubs & Chapters Event Modal with Categories + Register Button

document.addEventListener("DOMContentLoaded", () => {
  const clubCards = document.querySelectorAll(".club-card");
  const clubModal = document.getElementById("clubModal");
  const clubName = document.getElementById("clubName");
  const ongoingContainer = document.getElementById("ongoingEvents");
  const forthcomingContainer = document.getElementById("forthcomingEvents");
  const closeClubModal = document.getElementById("btnCloseClubModal");

  // 🎯 Club data with categories and register links
  const clubEvents = {
    // 🦁 LEO CLUB
    "Leo Club": {
      ongoing: {
        awareness: [
          {
            name: "Blood Donation Drive",
            time: "10:00 AM - 4:00 PM",
            venue: "Main Hall",
            date: "29 Oct 2025",
            desc: "A life-saving event encouraging students to donate blood for those in need.",
            link: "https://example.com/register-blood",
            img: "firstaid.jpg"
          }
        ],
        cultural: [
          {
            name: "Charity Music Fest",
            time: "6:00 PM - 9:00 PM",
            venue: "Auditorium",
            date: "30 Oct 2025",
            desc: "An evening of music to raise funds for local orphanages.",
            link: "https://example.com/register-music",
            img: "Rj-Hunt-scaled.jpg"
          }
        ]
      },
      forthcoming: {
        technical: [
          {
            name: "AI for Social Good",
            time: "10:00 AM - 1:00 PM",
            venue: "CSE Block, Room 301",
            date: "5 Nov 2025",
            desc: "Workshop on using AI to solve community problems.",
            link: "https://example.com/register-ai",
            img: "ai.jpg"
          }
        ],
        awareness: [
          {
            name: "Clean Vellore Campaign",
            time: "9:00 AM",
            venue: "Campus Gate",
            date: "7 Nov 2025",
            desc: "A cleanliness drive involving students and residents.",
            link: "https://example.com/register-cleanvellore",
            img: "clean.jpg"
          }
        ]
      }
    },

    // 📝 TAMIL LITERARY CLUB
    "Tamil Literary Club": {
      ongoing: {
        cultural: [
          {
            name: "Poetry Week",
            time: "2:00 PM - 5:00 PM",
            venue: "Auditorium",
            date: "28–31 Oct 2025",
            desc: "Celebrating Tamil poets and their timeless verses.",
            link: "https://example.com/register-poetry",
            img: "Spoken.jpg"
          }
        ],
        awareness: [
          {
            name: "Tamil Heritage Talk",
            time: "3:00 PM - 4:30 PM",
            venue: "Seminar Hall",
            date: "30 Oct 2025",
            desc: "Guest lecture on the evolution of Tamil language and literature.",
            link: "https://example.com/register-heritage",
            img: "tamil-culture.jpg"
          }
        ]
      },
      forthcoming: {
        cultural: [
          {
            name: "Kavithai Night",
            time: "6:30 PM",
            venue: "Open Air Theatre",
            date: "10 Nov 2025",
            desc: "A mesmerizing evening of poems and performances.",
            link: "https://example.com/register-kavithai",
            img: "poetric.jpg"
          }
        ],
        technical: [
          {
            name: "Tamil E-Publishing Workshop",
            time: "11:00 AM - 2:00 PM",
            venue: "Language Lab",
            date: "12 Nov 2025",
            desc: "Learn digital publishing tools for Tamil books and blogs.",
            link: "https://example.com/register-epublish",
            img: "epublish.png"
          }
        ]
      }
    },

    // 🤝 ROTARACT CLUB
    "Rotaract Club": {
      ongoing: {
        awareness: [
          {
            name: "Career Guidance Workshop",
            time: "3:00 PM - 5:00 PM",
            venue: "Block B, Room 204",
            date: "28–30 Oct 2025",
            desc: "Interactive sessions with alumni and HR professionals.",
            link: "https://example.com/register-career",
            img: "images/career-guidance.jpg"
          }
        ],
        technical: [
          {
            name: "Resume Building Bootcamp",
            time: "11:00 AM - 1:00 PM",
            venue: "Training Room 2",
            date: "30 Oct 2025",
            desc: "Practical tips for creating impactful resumes.",
            link: "https://example.com/register-resume",
            img: "images/resume.jpg"
          }
        ]
      },
      forthcoming: {
        awareness: [
          {
            name: "Tree Plantation Drive",
            time: "8:00 AM",
            venue: "Eco Park",
            date: "8 Nov 2025",
            desc: "Join hands to make our campus greener.",
            link: "https://example.com/register-tree",
            img: "IND-dbcPune-001-1.jpg"
          }
        ],
        cultural: [
          {
            name: "Rotaract Fest",
            time: "6:00 PM - 9:00 PM",
            venue: "Main Lawn",
            date: "15 Nov 2025",
            desc: "An evening celebrating service, fun, and community spirit.",
            link: "https://example.com/register-fest",
            img: "images/rotaract-fest.jpg"
          }
        ]
      }
    },

    // 🎙 COMMUNITY RADIO CLUB
    "Community Radio Club": {
      ongoing: {
        technical: [
          {
            name: "Podcast Recording: Campus Voices",
            time: "1:00 PM - 3:00 PM",
            venue: "Studio Room",
            date: "29 Oct 2025",
            desc: "Recording discussions on student life and social issues.",
            link: "https://example.com/register-podcast",
            img: "images/podcast.jpg"
          }
        ],
        awareness: [
          {
            name: "Women Empowerment Talk Show",
            time: "2:30 PM - 4:00 PM",
            venue: "Media Studio",
            date: "30 Oct 2025",
            desc: "Broadcast on women achievers from local communities.",
            link: "https://example.com/register-women",
            img: "images/talkshow.jpg"
          }
        ]
      },
      forthcoming: {
        cultural: [
          {
            name: "Radio Jockey Hunt",
            time: "11:00 AM",
            venue: "Media Lab",
            date: "12 Nov 2025",
            desc: "Auditions for the next campus RJ. Be the voice of students!",
            link: "https://example.com/register-rj",
            img: "images/rj-hunt.jpg"
          }
        ],
        technical: [
          {
            name: "Sound Mixing Workshop",
            time: "10:00 AM - 12:30 PM",
            venue: "Audio Lab",
            date: "15 Nov 2025",
            desc: "Hands-on training on audio editing and mixing.",
            link: "https://example.com/register-sound",
            img: "images/sound-mixing.jpg"
          }
        ]
      }
    }
  };

  // 🖱️ Open modal when a club card is clicked
  clubCards.forEach(card => {
    card.addEventListener("click", () => {
      const name = card.querySelector("h4").innerText.replace(/^[^\w]+/, "").trim();
      clubName.textContent = name;
      ongoingContainer.innerHTML = "";
      forthcomingContainer.innerHTML = "";

      const clubData = clubEvents[name];
      if (!clubData) return;

      renderCategoryEvents(clubData.ongoing, ongoingContainer, "Ongoing Events");
      renderCategoryEvents(clubData.forthcoming, forthcomingContainer, "Forthcoming Events");

      clubModal.classList.add("show");
      clubModal.style.display = "flex";
    });
  });

  // 🧱 Render category sections
  function renderCategoryEvents(categorySet, container, title) {
    if (!categorySet) {
      container.innerHTML = "<p>No events available.</p>";
      return;
    }

    Object.keys(categorySet).forEach(category => {
      const section = document.createElement("div");
      section.classList.add("event-category");
      section.innerHTML = `<h3 style="color:#4cafef;margin-top:10px;">${category.toUpperCase()} EVENTS</h3>`;
      categorySet[category].forEach(event => section.appendChild(createEventCard(event)));
      container.appendChild(section);
    });
  }

  // 🎟️ Create event card
  function createEventCard(event) {
    const div = document.createElement("div");
    div.classList.add("event-card");
    div.innerHTML = `
      ${event.img ? `<img src="${event.img}" alt="${event.name}" class="event-img">` : ""}
      <div class="event-info">
        <h4>${event.name}</h4>
        <p><strong>🕒</strong> ${event.time}</p>
        <p><strong>📍</strong> ${event.venue}</p>
        <p><strong>📅</strong> ${event.date}</p>
        <p>${event.desc}</p>
        <a href="${event.link}" target="_blank" class="join-btn">Register Now</a>
      </div>
    `;
    return div;
  }

  // ❌ Close modal
  closeClubModal.addEventListener("click", closeModal);
  clubModal.addEventListener("click", (e) => {
    if (e.target === clubModal) closeModal();
  });

  function closeModal() {
    clubModal.classList.remove("show");
    setTimeout(() => {
      clubModal.style.display = "none";
    }, 200);
  }
});
