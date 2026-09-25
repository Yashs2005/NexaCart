import iphone16 from "./assets/iphone16.jpg";
import samsungs25 from "./assets/Samsungs25.webp";

// =====================================================
// NEXACART - FINAL CUSTOMER VIEW DATA
// 15 CATEGORIES × 20 PRODUCTS = 300 PRODUCTS
// =====================================================

// =====================================================
// ALL PRODUCT JPG IMAGES
// Automatically loads every product image from:
// src/assets/products/<category-folder>/<Product-Name>.jpg
// =====================================================

const productImages = import.meta.glob(
  "./assets/products/**/*.jpg",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

// =====================================================
// CATEGORY FOLDER NAMES
// =====================================================

const productImageFolders = {
  "Fruits & Vegetables": "fruits-vegetables",
  "Dairy & Breakfast": "dairy-breakfast",
  "Snacks & Munchies": "snacks-munchies",
  Beverages: "beverages",
  "Staples & Essentials": "staples-essentials",
  "Bakery & Biscuits": "bakery-biscuits",
  "Personal Care": "personal-care",
  "Home Care": "home-care",
  "Baby Care": "baby-care",
  "Beauty & Cosmetics": "beauty-cosmetics",
  Electronics: "electronics",
  Fashion: "fashion",
  "Home & Kitchen": "home-kitchen",
  "Toys & Games": "toys-games",
  "Pets Care": "pets-care",
};

// =====================================================
// GET PRODUCT IMAGE
// =====================================================

function getProductImage(category, name) {
  const folder = productImageFolders[category];

  if (!folder || !name) {
    return "";
  }

  const filename =
    `${name.replace(/\s+/g, "-")}.jpg`;

  const imagePath =
    `./assets/products/${folder}/${filename}`;

  return productImages[imagePath] || "";
}

// =====================================================
// CREATE PRODUCTS
// =====================================================

function createProducts(
  category,
  names,
  prices,
  units,
  ratings,
  startId
) {
  return names.map((name, index) => ({
    id: startId + index,
    name,
    category,
    price: prices[index],
    unit: units[index],
    stock: 20 + (index % 6) * 5,
    rating: ratings[index],

    // AUTOMATIC PRODUCT IMAGE
    image: getProductImage(category, name),
  }));
}

// =====================================================
// 1. FRUITS & VEGETABLES
// =====================================================

const fruitsVegetables = createProducts(
  "Fruits & Vegetables",
  [
    "Apple",
    "Banana",
    "Mango",
    "Orange",
    "Grapes",
    "Watermelon",
    "Papaya",
    "Pomegranate",
    "Guava",
    "Pineapple",
    "Kiwi",
    "Strawberry",
    "Tomato",
    "Potato",
    "Onion",
    "Cucumber",
    "Carrot",
    "Green Bell Pepper",
    "Green Chili",
    "Spinach",
  ],
  [
    149, 49, 99, 79, 119,
    39, 69, 159, 79, 89,
    199, 149, 49, 39, 39,
    49, 59, 69, 79, 29,
  ],
  [
    "1 Kg", "1 Kg", "1 Kg", "1 Kg", "500 g",
    "1 Kg", "1 Kg", "1 Kg", "1 Kg", "1 Piece",
    "3 Pieces", "250 g", "1 Kg", "1 Kg", "1 Kg",
    "1 Kg", "1 Kg", "500 g", "250 g", "250 g",
  ],
  [
    4.5, 4.4, 4.6, 4.3, 4.5,
    4.4, 4.3, 4.6, 4.2, 4.4,
    4.5, 4.2, 4.4, 4.5, 4.5,
    4.3, 4.4, 4.3, 4.2, 4.4,
  ],
  1001
);

// =====================================================
// 2. DAIRY & BREAKFAST
// =====================================================

const dairyBreakfast = createProducts(
  "Dairy & Breakfast",
  [
    "Fresh Milk",
    "Toned Milk",
    "Full Cream Milk",
    "Curd",
    "Greek Yogurt",
    "Butter",
    "Cheese Slices",
    "Cheese Block",
    "Paneer",
    "Cream",
    "Buttermilk",
    "Lassi",
    "Eggs",
    "Bread",
    "Brown Bread",
    "Multigrain Bread",
    "Corn Flakes",
    "Oats",
    "Muesli",
    "Honey",
  ],
  [
    68, 62, 72, 70, 120,
    58, 125, 145, 110, 75,
    30, 45, 85, 45, 55,
    65, 165, 115, 225, 180,
  ],
  [
    "1 L", "1 L", "1 L", "500 g", "400 g",
    "100 g", "200 g", "200 g", "200 g", "200 ml",
    "500 ml", "500 ml", "12 Pieces", "400 g", "400 g",
    "400 g", "500 g", "500 g", "500 g", "250 g",
  ],
  [
    4.5, 4.5, 4.4, 4.4, 4.3,
    4.6, 4.4, 4.5, 4.5, 4.2,
    4.3, 4.4, 4.5, 4.4, 4.3,
    4.4, 4.5, 4.5, 4.3, 4.4,
  ],
  1021
);

// =====================================================
// 3. SNACKS & MUNCHIES
// =====================================================

const snacks = createProducts(
  "Snacks & Munchies",
  [
    "Potato Chips",
    "Masala Chips",
    "Salted Chips",
    "Nachos",
    "Cheese Nachos",
    "Bhujia",
    "Aloo Bhujia",
    "Mixture",
    "Peanut Masala",
    "Roasted Peanuts",
    "Popcorn",
    "Cheese Popcorn",
    "Cream Biscuits",
    "Chocolate Biscuits",
    "Salt Biscuits",
    "Cookies",
    "Namkeen",
    "Sev",
    "Khakhra",
    "Instant Noodles",
  ],
  [
    30, 30, 30, 55, 65,
    55, 55, 65, 60, 55,
    60, 75, 35, 40, 30,
    80, 65, 55, 70, 70,
  ],
  [
    "100 g", "100 g", "100 g", "150 g", "150 g",
    "200 g", "200 g", "200 g", "200 g", "200 g",
    "100 g", "100 g", "120 g", "120 g", "120 g",
    "200 g", "200 g", "200 g", "200 g", "4 Pack",
  ],
  [
    4.4, 4.3, 4.4, 4.5, 4.4,
    4.5, 4.4, 4.3, 4.4, 4.3,
    4.5, 4.4, 4.3, 4.4, 4.2,
    4.5, 4.3, 4.4, 4.5, 4.5,
  ],
  1041
);

// =====================================================
// 4. BEVERAGES
// =====================================================

const beverages = createProducts(
  "Beverages",
  [
    "Orange Juice",
    "Apple Juice",
    "Mango Juice",
    "Pineapple Juice",
    "Mixed Fruit Juice",
    "Guava Juice",
    "Litchi Juice",
    "Cranberry Juice",
    "Lemon Drink",
    "Mango Drink",
    "Cola",
    "Lemon Soda",
    "Ginger Ale",
    "Tonic Water",
    "Sparkling Water",
    "Mineral Water",
    "Energy Drink",
    "Iced Tea",
    "Cold Coffee",
    "Chocolate Milkshake",
  ],
  [
    120, 130, 110, 125, 120,
    105, 125, 180, 40, 40,
    45, 45, 95, 100, 60,
    20, 120, 90, 110, 130,
  ],
  [
    "1 L", "1 L", "1 L", "1 L", "1 L",
    "1 L", "1 L", "1 L", "750 ml", "750 ml",
    "750 ml", "750 ml", "300 ml", "750 ml", "750 ml",
    "1 L", "250 ml", "1 L", "250 ml", "250 ml",
  ],
  [
    4.4, 4.3, 4.5, 4.3, 4.4,
    4.2, 4.3, 4.1, 4.2, 4.3,
    4.4, 4.2, 4.3, 4.2, 4.4,
    4.5, 4.3, 4.4, 4.2, 4.4,
  ],
  1061
);

// =====================================================
// 5. STAPLES & ESSENTIALS
// =====================================================

const staplesEssentials = createProducts(
  "Staples & Essentials",
  [
    "Wheat Atta",
    "Multigrain Atta",
    "Basmati Rice",
    "Sona Masoori Rice",
    "Brown Rice",
    "Toor Dal",
    "Moong Dal",
    "Masoor Dal",
    "Chana Dal",
    "Urad Dal",
    "Rajma",
    "Kabuli Chana",
    "Black Chana",
    "Poha",
    "Suji",
    "Besan",
    "Daliya",
    "Sugar",
    "Salt",
    "Jaggery",
  ],
  [
    245, 310, 430, 270, 290,
    145, 135, 105, 100, 140,
    170, 145, 105, 75, 65,
    100, 85, 55, 25, 90,
  ],
  [
    "5 Kg", "5 Kg", "5 Kg", "5 Kg", "5 Kg",
    "1 Kg", "1 Kg", "1 Kg", "1 Kg", "1 Kg",
    "1 Kg", "1 Kg", "1 Kg", "1 Kg", "1 Kg",
    "1 Kg", "1 Kg", "1 Kg", "1 Kg", "1 Kg",
  ],
  [
    4.5, 4.4, 4.6, 4.5, 4.4,
    4.5, 4.4, 4.3, 4.4, 4.3,
    4.5, 4.4, 4.3, 4.5, 4.4,
    4.5, 4.3, 4.4, 4.5, 4.4,
  ],
  1081
);

// =====================================================
// 6. BAKERY & BISCUITS
// =====================================================

const bakeryBiscuits = createProducts(
  "Bakery & Biscuits",
  [
    "White Bread",
    "Brown Bread",
    "Multigrain Bread",
    "Whole Wheat Bread",
    "Milk Bread",
    "Burger Buns",
    "Hot Dog Buns",
    "Pav",
    "Croissant",
    "Chocolate Croissant",
    "Cream Biscuits",
    "Chocolate Biscuits",
    "Digestive Biscuits",
    "Salt Biscuits",
    "Butter Cookies",
    "Chocolate Cookies",
    "Oat Cookies",
    "Rusk",
    "Fruit Cake",
    "Chocolate Cake",
  ],
  [
    40, 55, 65, 60, 50,
    55, 60, 35, 90, 110,
    35, 40, 70, 30, 80,
    90, 85, 65, 180, 450,
  ],
  [
    "400 g", "400 g", "400 g", "400 g", "400 g",
    "4 Pieces", "4 Pieces", "6 Pieces", "2 Pieces", "2 Pieces",
    "120 g", "120 g", "250 g", "120 g", "200 g",
    "200 g", "200 g", "200 g", "300 g", "500 g",
  ],
  [
    4.4, 4.3, 4.4, 4.5, 4.3,
    4.4, 4.2, 4.4, 4.5, 4.4,
    4.3, 4.4, 4.5, 4.2, 4.5,
    4.4, 4.3, 4.4, 4.3, 4.5,
  ],
  1101
);

// =====================================================
// 7. PERSONAL CARE
// =====================================================

const personalCare = createProducts(
  "Personal Care",
  [
    "Bath Soap",
    "Body Wash",
    "Hand Wash",
    "Face Wash",
    "Shampoo",
    "Conditioner",
    "Hair Oil",
    "Hair Serum",
    "Toothpaste",
    "Toothbrush",
    "Mouthwash",
    "Deodorant",
    "Body Lotion",
    "Hand Cream",
    "Lip Balm",
    "Shaving Cream",
    "Razor",
    "Comb",
    "Tissues",
    "Wet Wipes",
  ],
  [
    120, 220, 160, 180, 250,
    230, 180, 350, 110, 100,
    230, 220, 280, 160, 110,
    150, 220, 80, 100, 120,
  ],
  [
    "4 Pack", "250 ml", "250 ml", "100 ml", "340 ml",
    "180 ml", "200 ml", "100 ml", "150 g", "1 Piece",
    "500 ml", "150 ml", "400 ml", "50 g", "4.5 g",
    "100 g", "1 Pack", "1 Piece", "1 Box", "80 Wipes",
  ],
  [
    4.3, 4.4, 4.4, 4.5, 4.5,
    4.4, 4.3, 4.5, 4.5, 4.3,
    4.4, 4.3, 4.4, 4.2, 4.4,
    4.3, 4.2, 4.1, 4.3, 4.4,
  ],
  1121
);

// =====================================================
// 8. HOME CARE
// =====================================================

const homeCare = createProducts(
  "Home Care",
  [
    "Floor Cleaner",
    "Toilet Cleaner",
    "Glass Cleaner",
    "Kitchen Cleaner",
    "Dishwash Liquid",
    "Dishwash Bar",
    "Laundry Detergent",
    "Washing Powder",
    "Fabric Conditioner",
    "Bleach",
    "Disinfectant",
    "Room Freshener",
    "Garbage Bags",
    "Scrub Pad",
    "Cleaning Brush",
    "Broom",
    "Mop",
    "Dustpan",
    "Microfiber Cloth",
    "Air Freshener",
  ],
  [
    220, 190, 180, 200, 160,
    55, 260, 300, 230, 110,
    250, 220, 150, 80, 120,
    180, 350, 100, 150, 200,
  ],
  [
    "1 L", "1 L", "500 ml", "500 ml", "500 ml",
    "200 g", "2 Kg", "2 Kg", "1 L", "500 ml",
    "1 L", "300 ml", "30 Bags", "6 Pads", "1 Piece",
    "1 Piece", "1 Piece", "1 Piece", "5 Pieces", "2 Pack",
  ],
  [
    4.4, 4.3, 4.2, 4.3, 4.5,
    4.3, 4.4, 4.4, 4.3, 4.1,
    4.4, 4.2, 4.3, 4.2, 4.3,
    4.4, 4.4, 4.2, 4.4, 4.3,
  ],
  1141
);

// =====================================================
// 9. BABY CARE
// =====================================================

const babyCare = createProducts(
  "Baby Care",
  [
    "Baby Diapers",
    "Newborn Diapers",
    "Baby Wipes",
    "Baby Lotion",
    "Baby Shampoo",
    "Baby Soap",
    "Baby Powder",
    "Baby Oil",
    "Baby Cream",
    "Baby Wash",
    "Baby Toothbrush",
    "Baby Toothpaste",
    "Baby Feeding Bottle",
    "Baby Sipper",
    "Baby Bib",
    "Baby Towel",
    "Baby Blanket",
    "Baby Comb",
    "Baby Nail Clipper",
    "Baby Wet Wipes",
  ],
  [
    799, 699, 180, 220, 240,
    120, 270, 270, 250, 400,
    120, 150, 350, 300, 180,
    350, 650, 100, 150, 200,
  ],
  [
    "34 Pieces", "24 Pieces", "72 Wipes", "200 ml", "200 ml",
    "3 Pack", "400 g", "200 ml", "100 g", "200 ml",
    "1 Piece", "50 g", "250 ml", "250 ml", "2 Pack",
    "1 Piece", "1 Piece", "1 Piece", "1 Piece", "80 Wipes",
  ],
  [
    4.5, 4.4, 4.5, 4.4, 4.4,
    4.3, 4.3, 4.4, 4.5, 4.4,
    4.2, 4.3, 4.5, 4.4, 4.2,
    4.5, 4.4, 4.3, 4.3, 4.4,
  ],
  1161
);

// =====================================================
// 10. BEAUTY & COSMETICS
// =====================================================

const beautyCosmetics = createProducts(
  "Beauty & Cosmetics",
  [
    "Face Cream",
    "Face Serum",
    "Moisturizer",
    "Sunscreen",
    "Face Mask",
    "Face Scrub",
    "Lipstick",
    "Lip Gloss",
    "Nail Polish",
    "Mascara",
    "Eyeliner",
    "Eyeshadow Palette",
    "Compact Powder",
    "Foundation",
    "Blush",
    "Perfume",
    "Body Mist",
    "Hair Gel",
    "Hair Wax",
    "Beard Oil",
  ],
  [
    300, 550, 350, 450, 180,
    220, 450, 300, 180, 350,
    250, 650, 350, 600, 400,
    900, 450, 180, 250, 350,
  ],
  [
    "50 g", "30 ml", "100 ml", "50 g", "100 g",
    "100 g", "4 g", "10 ml", "8 ml", "10 ml",
    "5 ml", "12 Shades", "9 g", "30 ml", "5 g",
    "100 ml", "120 ml", "150 g", "100 g", "50 ml",
  ],
  [
    4.4, 4.5, 4.4, 4.5, 4.2,
    4.3, 4.4, 4.3, 4.4, 4.3,
    4.4, 4.5, 4.2, 4.4, 4.3,
    4.4, 4.3, 4.2, 4.3, 4.5,
  ],
  1181
);

// =====================================================
// 11. ELECTRONICS
// =====================================================

const electronics = [
  {
    id: 1201,
    name: "iPhone 16",
    category: "Electronics",
    price: 64900,
    unit: "128 GB",
    image: iphone16,
    stock: 15,
    rating: 4.7,
  },
  {
    id: 1202,
    name: "Samsung Galaxy S25",
    category: "Electronics",
    price: 61499,
    unit: "128 GB",
    image: samsungs25,
    stock: 15,
    rating: 4.6,
  },
  {
    id: 1203,
    name: "Wireless Earbuds",
    category: "Electronics",
    price: 1499,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "Wireless Earbuds"
    ),
    stock: 30,
    rating: 4.3,
  },
  {
    id: 1204,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 2499,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "Bluetooth Speaker"
    ),
    stock: 25,
    rating: 4.4,
  },
  {
    id: 1205,
    name: "Smart Watch",
    category: "Electronics",
    price: 2999,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "Smart Watch"
    ),
    stock: 25,
    rating: 4.3,
  },
  {
    id: 1206,
    name: "Power Bank",
    category: "Electronics",
    price: 1499,
    unit: "10000 mAh",
    image: getProductImage(
      "Electronics",
      "Power Bank"
    ),
    stock: 30,
    rating: 4.4,
  },
  {
    id: 1207,
    name: "USB Cable",
    category: "Electronics",
    price: 399,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "USB Cable"
    ),
    stock: 50,
    rating: 4.2,
  },
  {
    id: 1208,
    name: "Fast Charger",
    category: "Electronics",
    price: 1299,
    unit: "25W",
    image: getProductImage(
      "Electronics",
      "Fast Charger"
    ),
    stock: 35,
    rating: 4.4,
  },
  {
    id: 1209,
    name: "Wireless Charger",
    category: "Electronics",
    price: 1799,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "Wireless Charger"
    ),
    stock: 25,
    rating: 4.3,
  },
  {
    id: 1210,
    name: "Laptop Stand",
    category: "Electronics",
    price: 1299,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "Laptop Stand"
    ),
    stock: 25,
    rating: 4.4,
  },
  {
    id: 1211,
    name: "Computer Mouse",
    category: "Electronics",
    price: 599,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "Computer Mouse"
    ),
    stock: 40,
    rating: 4.3,
  },
  {
    id: 1212,
    name: "Wireless Mouse",
    category: "Electronics",
    price: 799,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "Wireless Mouse"
    ),
    stock: 35,
    rating: 4.4,
  },
  {
    id: 1213,
    name: "Keyboard",
    category: "Electronics",
    price: 899,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "Keyboard"
    ),
    stock: 35,
    rating: 4.3,
  },
  {
    id: 1214,
    name: "Wireless Keyboard",
    category: "Electronics",
    price: 1299,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "Wireless Keyboard"
    ),
    stock: 30,
    rating: 4.4,
  },
  {
    id: 1215,
    name: "Webcam",
    category: "Electronics",
    price: 1999,
    unit: "1080p",
    image: getProductImage(
      "Electronics",
      "Webcam"
    ),
    stock: 25,
    rating: 4.3,
  },
  {
    id: 1216,
    name: "USB Hub",
    category: "Electronics",
    price: 899,
    unit: "4 Port",
    image: getProductImage(
      "Electronics",
      "USB Hub"
    ),
    stock: 30,
    rating: 4.2,
  },
  {
    id: 1217,
    name: "Headphones",
    category: "Electronics",
    price: 1999,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "Headphones"
    ),
    stock: 25,
    rating: 4.4,
  },
  {
    id: 1218,
    name: "Gaming Headset",
    category: "Electronics",
    price: 2499,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "Gaming Headset"
    ),
    stock: 20,
    rating: 4.3,
  },
  {
    id: 1219,
    name: "Mobile Holder",
    category: "Electronics",
    price: 499,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "Mobile Holder"
    ),
    stock: 45,
    rating: 4.2,
  },
  {
    id: 1220,
    name: "LED Desk Lamp",
    category: "Electronics",
    price: 999,
    unit: "1 Piece",
    image: getProductImage(
      "Electronics",
      "LED Desk Lamp"
    ),
    stock: 30,
    rating: 4.4,
  },
];

// =====================================================
// 12. FASHION
// =====================================================

const fashion = createProducts(
  "Fashion",
  [
    "Men T-Shirt",
    "Women T-Shirt",
    "Men Shirt",
    "Women Top",
    "Men Jeans",
    "Women Jeans",
    "Men Track Pants",
    "Women Leggings",
    "Men Hoodie",
    "Women Hoodie",
    "Men Shorts",
    "Women Dress",
    "Men Sneakers",
    "Women Sneakers",
    "Casual Shoes",
    "Sports Shoes",
    "Backpack",
    "Handbag",
    "Wallet",
    "Wrist Watch",
  ],
  [
    499, 449, 799, 699, 1299,
    1199, 699, 499, 999, 899,
    599, 1199, 1799, 1699, 1499,
    1999, 899, 1299, 599, 1499,
  ],
  [
    "1 Piece", "1 Piece", "1 Piece", "1 Piece",
    "1 Piece", "1 Piece", "1 Piece", "1 Piece",
    "1 Piece", "1 Piece", "1 Piece", "1 Piece",
    "1 Pair", "1 Pair", "1 Pair", "1 Pair",
    "1 Piece", "1 Piece", "1 Piece", "1 Piece",
  ],
  [
    4.3, 4.4, 4.4, 4.3, 4.5,
    4.4, 4.3, 4.4, 4.5, 4.4,
    4.2, 4.5, 4.4, 4.5, 4.3,
    4.4, 4.5, 4.3, 4.2, 4.4,
  ],
  1221
);

// =====================================================
// 13. HOME & KITCHEN
// =====================================================

const homeKitchen = createProducts(
  "Home & Kitchen",
  [
    "Dinner Plate Set",
    "Coffee Mug",
    "Glass Set",
    "Water Bottle",
    "Lunch Box",
    "Storage Container",
    "Kitchen Knife",
    "Cutting Board",
    "Frying Pan",
    "Cooking Pot",
    "Pressure Cooker",
    "Kettle",
    "Mixer Grinder",
    "Toaster",
    "Electric Chopper",
    "Bedsheet",
    "Pillow",
    "Blanket",
    "Table Lamp",
    "Bathroom Sink",
  ],
  [
    499, 149, 299, 399, 299,
    450, 250, 300, 799, 999,
    2499, 1299, 2999, 1799, 1499,
    799, 499, 1299, 999, 3999,
  ],
  [
    "6 Pieces", "1 Piece", "6 Pieces", "1 L",
    "1 Piece", "3 Pieces", "1 Piece", "1 Piece",
    "1 Piece", "1 Piece", "3 L", "1.5 L",
    "750 W", "750 W", "1 Piece", "Double Bed",
    "2 Pieces", "Double Bed", "1 Piece", "1 Piece",
  ],
  [
    4.4, 4.3, 4.4, 4.5, 4.3,
    4.4, 4.2, 4.4, 4.5, 4.4,
    4.5, 4.3, 4.4, 4.3, 4.4,
    4.5, 4.4, 4.3, 4.2, 4.3,
  ],
  1241
);

// =====================================================
// 14. TOYS & GAMES
// =====================================================

const toysGames = createProducts(
  "Toys & Games",
  [
    "Teddy Bear",
    "Toy Car",
    "Remote Control Car",
    "Toy Train",
    "Building Blocks",
    "Puzzle Game",
    "Board Game",
    "Monopoly Game",
    "Chess Board",
    "Ludo Game",
    "Rubik's Cube",
    "Toy Kitchen Set",
    "Doll",
    "Doll House",
    "Soft Toy",
    "Baby Rattle",
    "Stacking Rings",
    "Toy Doctor Set",
    "Drawing Kit",
    "Educational Game",
  ],
  [
    499, 199, 899, 599, 499,
    299, 399, 599, 499, 199,
    249, 699, 399, 1299, 599,
    149, 199, 499, 349, 449,
  ],
  [
    "1 Piece", "1 Piece", "1 Piece", "1 Set",
    "100 Pieces", "1 Set", "1 Set", "1 Set",
    "1 Set", "1 Set", "1 Piece", "1 Set",
    "1 Piece", "1 Set", "1 Piece", "1 Piece",
    "1 Set", "1 Set", "1 Set", "1 Set",
  ],
  [
    4.5, 4.3, 4.4, 4.2, 4.5,
    4.4, 4.5, 4.6, 4.4, 4.3,
    4.4, 4.5, 4.3, 4.4, 4.5,
    4.4, 4.3, 4.4, 4.2, 4.5,
  ],
  1261
);

// =====================================================
// 15. PETS CARE
// =====================================================

const petsCare = createProducts(
  "Pets Care",
  [
    "Dog Food",
    "Cat Food",
    "Puppy Food",
    "Kitten Food",
    "Dog Treats",
    "Cat Treats",
    "Dog Biscuits",
    "Cat Biscuits",
    "Pet Shampoo",
    "Pet Conditioner",
    "Pet Soap",
    "Pet Grooming Brush",
    "Pet Feeding Bowl",
    "Pet Water Bowl",
    "Dog Collar",
    "Dog Leash",
    "Cat Collar",
    "Pet Toy Ball",
    "Pet Chew Toy",
    "Pet Bedding",
  ],
  [
    699, 650, 750, 700, 280,
    250, 220, 200, 300, 350,
    180, 250, 220, 250, 300,
    450, 220, 180, 300, 850,
  ],
  [
    "3 Kg", "2 Kg", "3 Kg", "2 Kg", "200 g",
    "200 g", "500 g", "400 g", "200 ml", "200 ml",
    "3 Pack", "1 Piece", "1 Piece", "1 Piece", "1 Piece",
    "1 Piece", "1 Piece", "1 Piece", "1 Piece", "1 Piece",
  ],
  [
    4.5, 4.4, 4.5, 4.4, 4.3,
    4.3, 4.4, 4.2, 4.4, 4.3,
    4.2, 4.4, 4.3, 4.3, 4.4,
    4.4, 4.2, 4.3, 4.4, 4.5,
  ],
  1281
);

// =====================================================
// ALL PRODUCTS
// TOTAL = 300
// =====================================================

export const productsData = [
  ...fruitsVegetables,
  ...dairyBreakfast,
  ...snacks,
  ...beverages,
  ...staplesEssentials,
  ...bakeryBiscuits,
  ...personalCare,
  ...homeCare,
  ...babyCare,
  ...beautyCosmetics,
  ...electronics,
  ...fashion,
  ...homeKitchen,
  ...toysGames,
  ...petsCare,
];

// =====================================================
// EXACTLY 15 CATEGORIES
// =====================================================

export const categories = [
  "Fruits & Vegetables",
  "Dairy & Breakfast",
  "Snacks & Munchies",
  "Beverages",
  "Staples & Essentials",
  "Bakery & Biscuits",
  "Personal Care",
  "Home Care",
  "Baby Care",
  "Beauty & Cosmetics",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Toys & Games",
  "Pets Care",
];

// =====================================================
// CATEGORY VISUALS
// =====================================================

export const categoryVisuals = {
  "Fruits & Vegetables": [
    "🍎",
    "🥭",
    "🥕",
    "🥬",
  ],

  "Dairy & Breakfast": [
    "🥛",
    "🧈",
    "🥚",
    "🍞",
  ],

  "Snacks & Munchies": [
    "🍿",
    "🍪",
    "🥨",
    "🍜",
  ],

  Beverages: [
    "🧃",
    "🥤",
    "🍹",
    "💧",
  ],

  "Staples & Essentials": [
    "🌾",
    "🍚",
    "🫘",
    "🧂",
  ],

  "Bakery & Biscuits": [
    "🍞",
    "🥐",
    "🍪",
    "🎂",
  ],

  "Personal Care": [
    "🧴",
    "🧼",
    "🪥",
    "🧴",
  ],

  "Home Care": [
    "🧹",
    "🧽",
    "🧼",
    "🪣",
  ],

  "Baby Care": [
    "👶",
    "🍼",
    "🧸",
    "🧴",
  ],

  "Beauty & Cosmetics": [
    "💄",
    "💅",
    "🧴",
    "💋",
  ],

  Electronics: [
    "📱",
    "🎧",
    "⌚",
    "🔌",
  ],

  Fashion: [
    "👕",
    "👖",
    "👟",
    "👜",
  ],

  "Home & Kitchen": [
    "🍳",
    "🏠",
    "🛋️",
    "🍽️",
  ],

  "Toys & Games": [
    "🧸",
    "🚗",
    "🎲",
    "🎮",
  ],

  "Pets Care": [
    "🐶",
    "🐱",
    "🦴",
    "🐾",
  ],
};