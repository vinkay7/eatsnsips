const menus = {
  rice: {
    title: "Rice-Based",
    image: "assets/menu-rice.jpeg",
    alt: "Rice-based menu board",
    items: [
      ["Basmati jollof and chicken", "N3,500"],
      ["Chinese fried rice and chicken", "N5,000"],
      ["Fried rice and chicken", "N3,500"],
      ["Native rice / fish / egg", "N2,500"],
      ["Chicken rice cake (Masa)", "N350"],
      ["Ofada rice / beans with Ofada sauce", "N2,500"],
      ["Basmati white rice, sides, veggies, tomatoes chicken stew", "N3,500"],
      ["Basmati white rice, beef curry sauce", "N3,300"],
      ["Basmati white rice, gizzard sauce", "N4,000"]
    ]
  },
  special: {
    title: "Special Meals",
    image: "assets/menu-special.jpeg",
    alt: "Special meals menu board",
    items: [
      ["Creamy pasta", "N5,000"],
      ["Loaded stir fried pasta", "N3,000"],
      ["Sea food spaghetti", "N9,000"],
      ["Stir fried spaghetti", "N3,000"],
      ["Loaded fries", "N6,000"],
      ["Irish fries, ketchup, fried egg, sausage", "N3,000"],
      ["Plantain fries assorted with chicken", "N3,500"]
    ]
  },
  spaghetti: {
    title: "Spaghetti-Based",
    image: "assets/menu-spaghetti.jpeg",
    alt: "Spaghetti-based menu board",
    items: [
      ["White spaghetti, beef curry sauce, boiled eggs, plantain", "N3,500"],
      ["White spaghetti, tomatoes chicken stew", "N3,500"],
      ["Boiled Irish potatoes with fish sauce", "N2,000"],
      ["Yamarita, egg sauce", "N2,500"]
    ]
  },
  noodles: {
    title: "Noodles",
    image: "assets/menu-noodles.jpeg",
    alt: "Noodles menu board",
    items: [
      ["Stir fried noodles, boiled eggs", "N1,500"],
      ["Loaded stir fried noodles", "N3,500"],
      ["Chinese rice sticks (choice protein)", "N3,000"],
      ["Sea food noodles", "N9,000"],
      ["Foreign egg noodles", "N5,000"]
    ]
  },
  kebabs: {
    title: "Kebabs",
    image: "assets/menu-kebabs.jpeg",
    alt: "Kebabs menu board",
    items: [
      ["Offals", "N1,000"],
      ["Chevon (goat)", "N1,000"],
      ["Beef", "N1,000"],
      ["Peppered pomo", "N1,500"]
    ]
  },
  salads: {
    title: "Salads",
    image: "assets/menu-salads.jpeg",
    alt: "Salads menu board",
    items: [
      ["Fruit salad", "Ask"],
      ["Vegetable salads", "Ask"],
      ["Chicken salad", "Ask"]
    ]
  },
  sides: {
    title: "Sides",
    image: "assets/menu-sides.jpeg",
    alt: "Sides menu board",
    items: [
      ["Sausage (2)", "N300"],
      ["Plantain (5)", "N500"],
      ["Egg curds five pieces / two pieces", "N1,000 / N500"],
      ["Boiled eggs", "N250"],
      ["Stir fried shrimps", "N1,000"],
      ["Fish", "N1,000"],
      ["Beef", "N300"],
      ["Chicken", "Big N3,500 · Medium N2,500 · Small N2,000"]
    ]
  },
  sips: {
    title: "Sips",
    image: "assets/menu-sips.jpeg",
    alt: "Sips menu board",
    items: [
      ["Cocktail", "N2,000 / N1,200"],
      ["Mocktail", "N2,000 / N1,200"],
      ["Chapman", "N2,000 / N1,200"],
      ["Pure fruit juice", "N1,000"],
      ["Fruit infused water", "N1,500"],
      ["Smoothies", "N2,000 / N3,000"],
      ["Vegetable juices", "N1,500 / N2,000"],
      ["Dietary needs juices", "Ask"]
    ]
  }
};

/* Menu items mapping for order form */
const menuItemsByCategory = {
  "Rice-Based": [
    "Basmati Jollof/Chicken",
    "Chinese Fried Rice/Chicken",
    "Fried Rice/Chicken",
    "Native Rice/Fish/Egg",
    "Ofada Rice/Beans"
  ],
  "Special Meals": [
    "Creamy Pasta",
    "Loaded Stir Fried Pasta",
    "Sea Food Spaghetti",
    "Loaded Fries",
    "Plantain Fries Assorted"
  ],
  "Sips": [
    "Cocktail",
    "Mocktail",
    "Chapman",
    "Pure Fruit Juice",
    "Smoothies",
    "Vegetable Juices",
    "Dietary Needs Juices"
  ],
  "Spaghetti": [],
  "Noodles": [],
  "Kebabs": [],
  "Salads": [],
  "Sides": []
};

/* ========== NAVIGATION & MENU TABS ========== */
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const tabs = document.querySelectorAll(".tab");
const menuTitle = document.querySelector("#menuTitle");
const menuImage = document.querySelector("#menuImage");
const menuItemsEl = document.querySelector("#menuItems");

function renderMenu(key) {
  const menu = menus[key];
  menuTitle.textContent = menu.title;
  menuImage.src = menu.image;
  menuImage.alt = menu.alt;
  menuItemsEl.innerHTML = menu.items
    .map(([name, price]) => `
      <div class="menu-item">
        <strong>${name}</strong>
        <span>${price}</span>
      </div>
    `)
    .join("");
}

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    renderMenu(tab.dataset.menu);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

renderMenu("rice");

/* ========== MULTI-STEP ORDER FORM ========== */
const orderForm = document.getElementById("orderForm");
const formStatus = document.getElementById("formStatus");
const formSuccess = document.getElementById("formSuccess");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const orderType = document.getElementById("orderType");
const menuCategory = document.getElementById("menuCategory");
const deliveryType = document.getElementById("deliveryType");
const deliveryFields = document.getElementById("deliveryFields");
const orderItemsContainer = document.getElementById("orderItemsContainer");
const addItemBtn = document.getElementById("addItemBtn");
const progressSteps = document.querySelectorAll(".progress-step");

let currentStep = 1;
let totalSteps = 6;
let itemCount = 1;

function showStep(step) {
  const allSteps = document.querySelectorAll(".form-step");
  allSteps.forEach(s => s.classList.remove("active"));

  /* Determine if step 4 should be shown */
  const orderTypeVal = orderType ? orderType.value : "";
  const isRegular = orderTypeVal === "Regular meal";

  if (step === 4 && isRegular) {
    if (currentStep < step) {
      step = 5;
    } else {
      step = 3;
    }
  }

  currentStep = step;

  const targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
  if (targetStep) {
    targetStep.classList.add("active");
  }

  progressSteps.forEach(ps => {
    const psStep = parseInt(ps.dataset.step);
    ps.classList.remove("active", "completed");
    if (psStep === currentStep) ps.classList.add("active");
    else if (psStep < currentStep) ps.classList.add("completed");
  });

  prevBtn.style.display = currentStep === 1 ? "none" : "inline-flex";
  if (currentStep === 6) {
    nextBtn.style.display = "none";
    submitBtn.style.display = "inline-flex";
  } else {
    nextBtn.style.display = "inline-flex";
    submitBtn.style.display = "none";
  }

  formStatus.textContent = "";
}

function validateCurrentStep() {
  const activeStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  if (!activeStep) return true;

  const requiredInputs = activeStep.querySelectorAll("[required]");
  for (let input of requiredInputs) {
    if (!input.value.trim()) {
      input.focus();
      formStatus.textContent = "Please fill in all required fields.";
      formStatus.style.color = "var(--red)";
      return false;
    }
  }
  return true;
}

nextBtn.addEventListener("click", () => {
  if (!validateCurrentStep()) return;
  let nextStep = currentStep + 1;
  const orderTypeVal = orderType ? orderType.value : "";
  if (nextStep === 4 && orderTypeVal === "Regular meal") {
    nextStep = 5;
  }
  if (nextStep <= totalSteps) {
    showStep(nextStep);
  }
});

prevBtn.addEventListener("click", () => {
  let prevStep = currentStep - 1;
  const orderTypeVal = orderType ? orderType.value : "";
  if (prevStep === 4 && orderTypeVal === "Regular meal") {
    prevStep = 3;
  }
  if (prevStep >= 1) {
    showStep(prevStep);
  }
});

function populateItemDropdown(selectEl) {
  const category = menuCategory ? menuCategory.value : "";
  const items = menuItemsByCategory[category] || [];
  selectEl.innerHTML = '<option value="">Select an item</option>';
  if (items.length > 0) {
    items.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      selectEl.appendChild(opt);
    });
    selectEl.style.display = "block";
    const customInput = selectEl.parentElement.querySelector(".item-custom-input");
    if (customInput) customInput.style.display = "none";
  } else {
    selectEl.style.display = "none";
    const customInput = selectEl.parentElement.querySelector(".item-custom-input");
    if (customInput) {
      customInput.style.display = "block";
      customInput.setAttribute("required", "");
      customInput.placeholder = `Type your ${category || "menu"} item`;
    }
  }
}

menuCategory.addEventListener("change", () => {
  const allSelects = orderItemsContainer.querySelectorAll(".item-select");
  allSelects.forEach(sel => populateItemDropdown(sel));
});

addItemBtn.addEventListener("click", () => {
  itemCount++;
  const row = document.createElement("div");
  row.className = "order-item-row";
  row.innerHTML = `
    <label>Item
      <select name="item_${itemCount}" class="item-select" data-index="${itemCount}">
        <option value="">Select an item</option>
      </select>
      <input type="text" name="item_custom_${itemCount}" class="item-custom-input" placeholder="Type exact item name" style="display:none;">
    </label>
    <label>Quantity <input name="quantity_${itemCount}" type="number" min="1" value="1" placeholder="Qty" required></label>
    <button type="button" class="btn-remove-item" onclick="this.parentElement.remove()">Remove</button>
  `;
  orderItemsContainer.appendChild(row);
  const newSelect = row.querySelector(".item-select");
  populateItemDropdown(newSelect);
});

deliveryType.addEventListener("change", () => {
  deliveryFields.style.display = deliveryType.value === "Delivery" ? "block" : "none";
});

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "Sending your order request...";
  formStatus.style.color = "var(--muted)";
  const formData = new FormData(orderForm);
  const data = Object.fromEntries(formData.entries());
  const items = [];
  const rows = orderItemsContainer.querySelectorAll(".order-item-row");
  rows.forEach(row => {
    const select = row.querySelector(".item-select");
    const customInput = row.querySelector(".item-custom-input");
    const quantityInput = row.querySelector('input[type="number"]');
    const name = select.style.display !== "none" ? select.value : customInput.value;
    const quantity = quantityInput.value;
    if (name && quantity) items.push({ name, quantity });
  });
  data.items = items;
  try {
    const response = await fetch("/api/send-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Submission failed");
    orderForm.style.display = "none";
    document.querySelector(".form-progress").style.display = "none";
    formSuccess.style.display = "flex";
    formStatus.textContent = "";
  } catch (error) {
    formStatus.textContent = "Something went wrong. Please try again or contact us directly.";
    formStatus.style.color = "var(--red)";
  }
});

populateItemDropdown(document.querySelector(".item-select"));