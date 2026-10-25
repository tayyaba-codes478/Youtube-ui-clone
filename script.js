
const videos = [
  {
    id: 1,
    title: "Complete Web Development Roadmap for Beginners",
    channel: "CodeWithHarry",
    avatar: "</>",
    category: "Coding",
    views: "1.2M",
    age: "3 days ago",
    duration: "18:42",
    image: "photo-1498050108023-c5249f4df085",
    color: "#7c3aed"
  },
  {
    id: 2,
    title: "My Dream Gaming Setup | Ultimate RGB Desk Tour",
    channel: "Tech Zone",
    avatar: "TZ",
    category: "Gaming",
    views: "856K",
    age: "5 days ago",
    duration: "12:36",
    image: "photo-1593305841991-05c297ba4575",
    color: "#ec4899"
  },
  {
    id: 3,
    title: "Beautiful Places That Look Almost Unreal",
    channel: "Travel Diaries",
    avatar: "TD",
    category: "Travel",
    views: "2.4M",
    age: "1 week ago",
    duration: "14:08",
    image: "photo-1470770841072-f978cf4d019e",
    color: "#0ea5e9"
  },
  {
    id: 4,
    title: "Easy Pasta Recipe | Delicious Food in 15 Minutes",
    channel: "Food Stories",
    avatar: "FS",
    category: "Cooking",
    views: "924K",
    age: "2 days ago",
    duration: "09:25",
    image: "photo-1473093295043-cdd812d0e601",
    color: "#f97316"
  },
  {
    id: 5,
    title: "Peaceful Music for Studying and Relaxing",
    channel: "Calm Vibes",
    avatar: "♫",
    category: "Music",
    views: "3.5M",
    age: "6 days ago",
    duration: "32:15",
    image: "photo-1470225620780-dba8ba36b745",
    color: "#06b6d4"
  },
  {
    id: 6,
    title: "Learn JavaScript from Zero | Beginner Tutorial",
    channel: "Dev Academy",
    avatar: "DA",
    category: "Education",
    views: "640K",
    age: "4 days ago",
    duration: "24:18",
    image: "photo-1516321318423-f06f85e504b3",
    color: "#8b5cf6"
  },
  {
    id: 7,
    title: "A Dreamy Mountain Escape | Travel Vlog",
    channel: "Wander World",
    avatar: "WW",
    category: "Travel",
    views: "1.8M",
    age: "1 week ago",
    duration: "16:44",
    image: "photo-1464822759023-fed622ff2c3b",
    color: "#14b8a6"
  },
  {
    id: 8,
    title: "The Ultimate Guide to a Clean Desk Setup",
    channel: "Modern Space",
    avatar: "MS",
    category: "Technology",
    views: "478K",
    age: "2 days ago",
    duration: "11:52",
    image: "photo-1497366754035-f200968a6e72",
    color: "#6366f1"
  },
  {
    id: 9,
    title: "Creative Graphic Design Ideas to Try Today",
    channel: "Design Daily",
    avatar: "DD",
    category: "Design",
    views: "719K",
    age: "5 days ago",
    duration: "10:27",
    image: "photo-1558655146-d09347e92766",
    color: "#d946ef"
  },
  {
    id: 10,
    title: "Morning Routine for a More Productive Day",
    channel: "Daily Growth",
    avatar: "DG",
    category: "Lifestyle",
    views: "1.1M",
    age: "3 days ago",
    duration: "08:16",
    image: "photo-1499209974431-9dddcece7f88",
    color: "#f59e0b"
  },
  {
    id: 11,
    title: "Explore the Night Sky | Space and Stars",
    channel: "Beyond Earth",
    avatar: "BE",
    category: "Education",
    views: "2.1M",
    age: "1 week ago",
    duration: "15:31",
    image: "photo-1462331940025-496dfbfc7564",
    color: "#3b82f6"
  },
  {
    id: 12,
    title: "Aesthetic Workspace Ideas for Creators",
    channel: "Creative Corner",
    avatar: "CC",
    category: "Design",
    views: "532K",
    age: "6 days ago",
    duration: "13:09",
    image: "photo-1497366811353-6870744d04b2",
    color: "#a855f7"
  }
];

// Safely load saved data from localStorage
function loadSavedIds(key) {
  try {
    const savedData = JSON.parse(localStorage.getItem(key) || "[]");

    if (!Array.isArray(savedData)) {
      return new Set();
    }

    return new Set(
      savedData.filter(id =>
        Number.isInteger(id) && videos.some(video => video.id === id)
      )
    );
  } catch (error) {
    return new Set();
  }
}

// Save data to localStorage
function saveIds(key, ids) {
  try {
    localStorage.setItem(key, JSON.stringify([...ids]));
    return true;
  } catch (error) {
    showToast("Browser storage unavailable. Changes may not be saved.");
    return false;
  }
}

const grid = document.getElementById("videoGrid");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const categoryBar = document.getElementById("categoryBar");
const resultCount = document.getElementById("resultCount");
const sectionTitle = document.getElementById("sectionTitle");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");

let activeCategory = "All";
let searchTerm = "";
let activeView = "Home";

// Load saved Likes and Watch Later when the page opens
let favorites = loadSavedIds("tubespace_likes");
let watchLater = loadSavedIds("tubespace_watch_later");

let history = new Set();
let toastTimer;

function imageUrl(photoId) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function getFilteredVideos() {
  let list = [...videos];

  if (activeView === "Liked videos") {
    list = list.filter(video => favorites.has(video.id));
  } else if (activeView === "Watch later") {
    list = list.filter(video => watchLater.has(video.id));
  } else if (activeView === "History") {
    list = list.filter(video => history.has(video.id));
  } else if (activeView === "Trending") {
    list = list.slice().reverse();
  } else if (activeView === "Shorts") {
    list = list.filter(video => video.id % 2 === 0);
  } else if (
    ["Music", "Gaming", "Technology", "Travel", "Cooking"].includes(activeView)
  ) {
    list = list.filter(video => video.category === activeView);
  }

  if (activeCategory !== "All") {
    list = list.filter(video => video.category === activeCategory);
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();

    list = list.filter(video =>
      video.title.toLowerCase().includes(term) ||
      video.channel.toLowerCase().includes(term) ||
      video.category.toLowerCase().includes(term)
    );
  }

  return list;
}

function renderVideos() {
  const filtered = getFilteredVideos();

  resultCount.textContent = `${filtered.length} videos`;
  grid.innerHTML = "";

  emptyState.classList.toggle("hidden", filtered.length !== 0);
  grid.classList.toggle("hidden", filtered.length === 0);

  filtered.forEach((video, index) => {
    const isFavorite = favorites.has(video.id);
    const isSaved = watchLater.has(video.id);

    const card = document.createElement("article");
    card.className = "video-card";
    card.style.animationDelay = `${Math.min(index * 35, 250)}ms`;

    card.innerHTML = `
      <div class="thumbnail-wrap">
        <img
          class="thumbnail"
          src="${imageUrl(video.image)}"
          alt="${video.title} thumbnail"
          loading="${index < 6 ? "eager" : "lazy"}"
        >

        <span class="duration">${video.duration}</span>

        <div class="card-actions">
          <button
            class="card-action ${isSaved ? "selected" : ""}"
            data-action="save"
            data-id="${video.id}"
            aria-label="Save to Watch Later"
            title="Watch later"
          >${isSaved ? "✓" : "◷"}</button>

          <button
            class="card-action ${isFavorite ? "selected" : ""}"
            data-action="like"
            data-id="${video.id}"
            aria-label="Like video"
            title="Like"
          >${isFavorite ? "♥" : "♡"}</button>
        </div>
      </div>

      <div class="video-info">
        <div class="channel-avatar"
          style="background:linear-gradient(135deg, ${video.color}, #1f2039)">
          ${video.avatar}
        </div>

        <div class="video-details">
          <h3 class="video-title">${video.title}</h3>
          <p class="channel-name">
            ${video.channel} <span class="verified">✓</span>
          </p>
          <p class="video-meta">
            ${video.views} views <span>·</span> ${video.age}
          </p>
        </div>
      </div>
    `;

    const thumbnail = card.querySelector(".thumbnail");

    thumbnail.addEventListener("error", event => {
      event.currentTarget.style.display = "none";
      event.currentTarget.parentElement.style.background =
        `linear-gradient(135deg, ${video.color}, #171321)`;
    });

    card.querySelector(".thumbnail-wrap").addEventListener("click", event => {
      if (event.target.closest(".card-action")) return;

      history.add(video.id);
      showToast("Thumbnail preview only — video playback isn't included.");
    });

    card.querySelectorAll(".card-action").forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();

        const id = Number(button.dataset.id);
        const action = button.dataset.action;

        if (action === "like") {
          if (favorites.has(id)) {
            favorites.delete(id);

            if (saveIds("tubespace_likes", favorites)) {
              showToast("Removed from liked videos");
            }
          } else {
            favorites.add(id);

            if (saveIds("tubespace_likes", favorites)) {
              showToast("Added to liked videos ♥");
            }
          }
        }

        if (action === "save") {
          if (watchLater.has(id)) {
            watchLater.delete(id);

            if (saveIds("tubespace_watch_later", watchLater)) {
              showToast("Removed from Watch Later");
            }
          } else {
            watchLater.add(id);

            if (saveIds("tubespace_watch_later", watchLater)) {
              showToast("Saved to Watch Later ◷");
            }
          }
        }

        renderVideos();
      });
    });

    grid.appendChild(card);
  });
}

function setCategory(category) {
  activeCategory = category;

  document.querySelectorAll(".category").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === category
    );
  });

  renderVideos();
}

function setView(view) {
  activeView = view;

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle("active", button.dataset.nav === view);
  });

  const titles = {
    Home: "Recommended videos",
    Shorts: "Quick discoveries",
    Subscriptions: "Explore creators",
    History: "Your watch history",
    "Watch later": "Saved for later",
    "Liked videos": "Your liked videos",
    Trending: "Trending videos",
    Music: "Music videos",
    Gaming: "Gaming videos",
    Technology: "Technology videos",
    Travel: "Travel videos",
    Cooking: "Cooking videos"
  };

  sectionTitle.textContent = titles[view] || `${view} videos`;
  searchTerm = "";
  searchInput.value = "";

  if (
    ["Music", "Gaming", "Technology", "Travel", "Cooking"].includes(view)
  ) {
    setCategory("All");
  } else {
    renderVideos();
  }

  if (window.innerWidth <= 760) {
    document.body.classList.remove("mobile-menu-open");
  }
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();

  searchTerm = searchInput.value.trim();
  activeView = "Home";

  sectionTitle.textContent = searchTerm
    ? `Results for "${searchTerm}"`
    : "Recommended videos";

  renderVideos();
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  activeView = "Home";

  sectionTitle.textContent = searchTerm
    ? `Results for "${searchTerm}"`
    : "Recommended videos";

  renderVideos();
});

categoryBar.addEventListener("click", event => {
  const button = event.target.closest(".category");
  if (!button) return;

  activeView = "Home";
  setCategory(button.dataset.category);

  sectionTitle.textContent = button.dataset.category === "All"
    ? "Recommended videos"
    : `${button.dataset.category} videos`;
});

document.querySelectorAll(".nav-link").forEach(button => {
  button.addEventListener("click", () => {
    setView(button.dataset.nav);
  });
});

document.getElementById("menuBtn").addEventListener("click", () => {
  if (window.innerWidth <= 760) {
    document.body.classList.toggle("mobile-menu-open");
  } else {
    document.body.classList.toggle("sidebar-collapsed");
  }
});

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("light");

  const isLight = document.body.classList.contains("light");
  document.getElementById("themeBtn").textContent = isLight ? "☾" : "☀";

  showToast(isLight ? "Light mode enabled" : "Dark mode enabled");
});

document.getElementById("surpriseBtn").addEventListener("click", () => {
  const video = videos[Math.floor(Math.random() * videos.length)];

  activeView = "Home";
  searchTerm = "";
  searchInput.value = "";

  setCategory("All");
  sectionTitle.textContent = "Your surprise pick";

  const cards = [...document.querySelectorAll(".video-card")];

  const selectedCard = cards.find(card =>
    card.querySelector(".video-title")?.textContent === video.title
  );

  if (selectedCard) {
    selectedCard.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  showToast(`Today's pick: ${video.title}`);
});

document.getElementById("exploreBtn").addEventListener("click", () => {
  document.querySelector(".section-heading").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

document.getElementById("resetBtn").addEventListener("click", () => {
  activeView = "Home";
  searchTerm = "";
  searchInput.value = "";

  setCategory("All");
  sectionTitle.textContent = "Recommended videos";
});

document.getElementById("profileBtn").addEventListener("click", () => {
  showToast("Welcome to TubeSpace! This is a front-end demo.");
});

// Display videos, including previously saved Likes and Watch Later
renderVideos();
