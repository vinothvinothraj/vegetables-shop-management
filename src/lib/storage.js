export const STORAGE_KEYS = {
  products: "products",
  purchases: "purchases",
  sales: "sales",
  expenses: "expenses",
  userSession: "userSession",
  theme: "theme",
  lang: "lang",
};

export function createPlaceholderImage(label = "Product") {
  const text = encodeURIComponent(label.slice(0, 2).toUpperCase());
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#10b981"/><stop offset="1" stop-color="#0f766e"/></linearGradient></defs><rect width="200" height="200" rx="28" fill="url(#g)"/><circle cx="100" cy="100" r="58" fill="rgba(255,255,255,0.14)"/><text x="100" y="118" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="#fff">${text}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const sampleData = {
  products: [
    {
      id: "prod-gova",
      name: "Gova",
      category: "Local Greens",
      unit: "kg",
      pricePerKg: 240,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVJ1zp6hZdZi9-No8KKcPceZjfBkjaN1y5Kg&s",
      active: true,
    },
    {
      id: "prod-carrot",
      name: "Carrot",
      category: "Root Veg",
      unit: "kg",
      pricePerKg: 300,
      image: "https://www.thespruceeats.com/thmb/pZ2yFDDyBmS9BVTSWasxKgAHJuE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/carrots1-355722c899f641de96a80e3c1aa666b4.jpg",
      active: true,
    },
    {
      id: "prod-leeks",
      name: "Leeks",
      category: "Allium",
      unit: "kg",
      pricePerKg: 340,
      image: "https://www.burpee.com/media/burpee20/default/Images/Content/CLP%20Vegetables/CATID-2370_Leeks.jpg",
      active: true,
    },
    {
      id: "prod-brinjal",
      name: "Brinjal",
      category: "Root Veg",
      unit: "kg",
      pricePerKg: 180,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn4BF3zqsSIf4LFAPLZJb9l3IyF0jcuapPtQ&s",
      active: true,
    },
    {
      id: "prod-beans",
      name: "Beans",
      category: "Pods",
      unit: "kg",
      pricePerKg: 340,
      image: "https://www.incredibleseeds.ca/cdn/shop/products/BeanBush-Provider_460x@2x.jpg?v=1679716832",
      active: true,
    },
    {
      id: "prod-chilli",
      name: "Chilliy",
      category: "Spicy",
      unit: "kg",
      pricePerKg: 420,
      image: "https://t4.ftcdn.net/jpg/09/73/27/75/360_F_973277569_Cau7g1HGrTJaRz80ScKGUfEKY2t4ozXv.jpg",
      active: true,
    },
    {
      id: "prod-potato",
      name: "Potato",
      category: "Root Veg",
      unit: "kg",
      pricePerKg: 180,
      image: "https://videocdn.cdnpk.net/videos/78d5ac29-f27b-55d2-b67a-1bdcfa2dc5a3/horizontal/thumbnails/large.jpg?semt=ais_hybrid&item_id=6191200&w=740&q=80",
      active: true,
    },
    {
      id: "prod-tomato",
      name: "Tomato",
      category: "Fresh",
      unit: "kg",
      pricePerKg: 260,
      image: "https://ajeanneinthekitchen.com/wp-content/uploads/2024/08/image.png?w=700",
      active: true,
    },
  ],
};

export function readStorage(key, fallback = null) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function clearStorageKeys(keys) {
  if (typeof window === "undefined") {
    return;
  }

  keys.forEach((key) => window.localStorage.removeItem(key));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function isSameDay(dateA, dateB) {
  return dateA.toISOString().slice(0, 10) === dateB.toISOString().slice(0, 10);
}

export function isSameMonth(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth()
  );
}

export function sumBy(items, getter) {
  return items.reduce((sum, item) => sum + Number(getter(item) || 0), 0);
}
