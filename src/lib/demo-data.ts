export type DemoProduct = {
  id: string;
  name: string;
  category: string;
  unit: string;
  pricePerKg: number;
  image: string;
  active: boolean;
};

export type DemoPurchase = {
  id: string;
  date: string;
  supplierName: string;
  productId: string;
  vegetableName: string;
  quantity: number;
  pricePerKg: number;
  total: number;
};

export type DemoSaleItem = {
  id: string;
  productId: string;
  productName: string;
  vegetableName: string;
  qty: number;
  price: number;
  total: number;
  image: string;
  unit: string;
};

export type DemoSale = {
  id: string;
  date: string;
  customerName: string;
  items: DemoSaleItem[];
  grandTotal: number;
};

export type DemoExpense = {
  id: string;
  date: string;
  type: string;
  amount: number;
  note: string;
};

export type DemoStockRow = {
  productId: string;
  vegetableName: string;
  category: string;
  image: string;
  unit: string;
  pricePerKg: number;
  purchased: number;
  sold: number;
  remaining: number;
};

export const demoSeedData = {
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
      id: "prod-tomato",
      name: "Tomato",
      category: "Fresh",
      unit: "kg",
      pricePerKg: 260,
      image: "https://ajeanneinthekitchen.com/wp-content/uploads/2024/08/image.png?w=700",
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
  ] satisfies DemoProduct[],
  purchases: [
    {
      id: "pur-001",
      date: "2026-04-01",
      supplierName: "Green Valley Traders",
      productId: "prod-gova",
      vegetableName: "Gova",
      quantity: 30,
      pricePerKg: 220,
      total: 6600,
    },
    {
      id: "pur-002",
      date: "2026-04-03",
      supplierName: "Fresh Lanka",
      productId: "prod-carrot",
      vegetableName: "Carrot",
      quantity: 20,
      pricePerKg: 280,
      total: 5600,
    },
    {
      id: "pur-003",
      date: "2026-04-05",
      supplierName: "Island Growers",
      productId: "prod-tomato",
      vegetableName: "Tomato",
      quantity: 25,
      pricePerKg: 240,
      total: 6000,
    },
    {
      id: "pur-004",
      date: "2026-04-07",
      supplierName: "Nadee Supplies",
      productId: "prod-beans",
      vegetableName: "Beans",
      quantity: 18,
      pricePerKg: 310,
      total: 5580,
    },
    {
      id: "pur-005",
      date: "2026-04-09",
      supplierName: "Harvest Depot",
      productId: "prod-leeks",
      vegetableName: "Leeks",
      quantity: 15,
      pricePerKg: 300,
      total: 4500,
    },
  ] satisfies DemoPurchase[],
  sales: [
    {
      id: "sal-001",
      date: "2026-04-02",
      customerName: "Sun Market",
      items: [
        {
          id: "sal-001-item-1",
          productId: "prod-tomato",
          productName: "Tomato",
          vegetableName: "Tomato",
          qty: 5,
          price: 320,
          total: 1600,
          image: "https://ajeanneinthekitchen.com/wp-content/uploads/2024/08/image.png?w=700",
          unit: "kg",
        },
        {
          id: "sal-001-item-2",
          productId: "prod-carrot",
          productName: "Carrot",
          vegetableName: "Carrot",
          qty: 3,
          price: 340,
          total: 1020,
          image: "https://www.thespruceeats.com/thmb/pZ2yFDDyBmS9BVTSWasxKgAHJuE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/carrots1-355722c899f641de96a80e3c1aa666b4.jpg",
          unit: "kg",
        },
      ],
      grandTotal: 2620,
    },
    {
      id: "sal-002",
      date: "2026-04-04",
      customerName: "City Cafe",
      items: [
        {
          id: "sal-002-item-1",
          productId: "prod-beans",
          productName: "Beans",
          vegetableName: "Beans",
          qty: 4,
          price: 380,
          total: 1520,
          image: "https://www.incredibleseeds.ca/cdn/shop/products/BeanBush-Provider_460x@2x.jpg?v=1679716832",
          unit: "kg",
        },
        {
          id: "sal-002-item-2",
          productId: "prod-leeks",
          productName: "Leeks",
          vegetableName: "Leeks",
          qty: 2,
          price: 420,
          total: 840,
          image: "https://www.burpee.com/media/burpee20/default/Images/Content/CLP%20Vegetables/CATID-2370_Leeks.jpg",
          unit: "kg",
        },
      ],
      grandTotal: 2360,
    },
    {
      id: "sal-003",
      date: "2026-04-06",
      customerName: "Lanka Stores",
      items: [
        {
          id: "sal-003-item-1",
          productId: "prod-gova",
          productName: "Gova",
          vegetableName: "Gova",
          qty: 5,
          price: 260,
          total: 1300,
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVJ1zp6hZdZi9-No8KKcPceZjfBkjaN1y5Kg&s",
          unit: "kg",
        },
        {
          id: "sal-003-item-2",
          productId: "prod-beans",
          productName: "Beans",
          vegetableName: "Beans",
          qty: 3,
          price: 390,
          total: 1170,
          image: "https://www.incredibleseeds.ca/cdn/shop/products/BeanBush-Provider_460x@2x.jpg?v=1679716832",
          unit: "kg",
        },
      ],
      grandTotal: 2470,
    },
    {
      id: "sal-004",
      date: "2026-04-08",
      customerName: "Fresh Mart",
      items: [
        {
          id: "sal-004-item-1",
          productId: "prod-tomato",
          productName: "Tomato",
          vegetableName: "Tomato",
          qty: 4,
          price: 330,
          total: 1320,
          image: "https://ajeanneinthekitchen.com/wp-content/uploads/2024/08/image.png?w=700",
          unit: "kg",
        },
      ],
      grandTotal: 1320,
    },
    {
      id: "sal-005",
      date: "2026-04-10",
      customerName: "",
      items: [
        {
          id: "sal-005-item-1",
          productId: "prod-carrot",
          productName: "Carrot",
          vegetableName: "Carrot",
          qty: 2,
          price: 360,
          total: 720,
          image: "https://www.thespruceeats.com/thmb/pZ2yFDDyBmS9BVTSWasxKgAHJuE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/carrots1-355722c899f641de96a80e3c1aa666b4.jpg",
          unit: "kg",
        },
        {
          id: "sal-005-item-2",
          productId: "prod-leeks",
          productName: "Leeks",
          vegetableName: "Leeks",
          qty: 1,
          price: 390,
          total: 390,
          image: "https://www.burpee.com/media/burpee20/default/Images/Content/CLP%20Vegetables/CATID-2370_Leeks.jpg",
          unit: "kg",
        },
      ],
      grandTotal: 1110,
    },
  ] satisfies DemoSale[],
  expenses: [
    {
      id: "exp-001",
      date: "2026-04-01",
      type: "Rent",
      amount: 25000,
      note: "Shop rent",
    },
    {
      id: "exp-002",
      date: "2026-04-04",
      type: "Transport",
      amount: 3500,
      note: "Market pickup",
    },
    {
      id: "exp-003",
      date: "2026-04-06",
      type: "Salary",
      amount: 42000,
      note: "Helper salary",
    },
    {
      id: "exp-004",
      date: "2026-04-08",
      type: "Utilities",
      amount: 7800,
      note: "Electricity and water",
    },
    {
      id: "exp-005",
      date: "2026-04-10",
      type: "Packaging",
      amount: 2600,
      note: "Bags and labels",
    },
  ] satisfies DemoExpense[],
  stock: [
    {
      productId: "prod-gova",
      vegetableName: "Gova",
      category: "Local Greens",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVJ1zp6hZdZi9-No8KKcPceZjfBkjaN1y5Kg&s",
      unit: "kg",
      pricePerKg: 240,
      purchased: 30,
      sold: 5,
      remaining: 25,
    },
    {
      productId: "prod-carrot",
      vegetableName: "Carrot",
      category: "Root Veg",
      image: "https://www.thespruceeats.com/thmb/pZ2yFDDyBmS9BVTSWasxKgAHJuE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/carrots1-355722c899f641de96a80e3c1aa666b4.jpg",
      unit: "kg",
      pricePerKg: 300,
      purchased: 20,
      sold: 5,
      remaining: 15,
    },
    {
      productId: "prod-leeks",
      vegetableName: "Leeks",
      category: "Allium",
      image: "https://www.burpee.com/media/burpee20/default/Images/Content/CLP%20Vegetables/CATID-2370_Leeks.jpg",
      unit: "kg",
      pricePerKg: 340,
      purchased: 15,
      sold: 3,
      remaining: 12,
    },
    {
      productId: "prod-tomato",
      vegetableName: "Tomato",
      category: "Fresh",
      image: "https://ajeanneinthekitchen.com/wp-content/uploads/2024/08/image.png?w=700",
      unit: "kg",
      pricePerKg: 260,
      purchased: 25,
      sold: 9,
      remaining: 16,
    },
    {
      productId: "prod-beans",
      vegetableName: "Beans",
      category: "Pods",
      image: "https://www.incredibleseeds.ca/cdn/shop/products/BeanBush-Provider_460x@2x.jpg?v=1679716832",
      unit: "kg",
      pricePerKg: 340,
      purchased: 18,
      sold: 7,
      remaining: 11,
    },
  ] satisfies DemoStockRow[],
} satisfies {
  products: DemoProduct[];
  purchases: DemoPurchase[];
  sales: DemoSale[];
  expenses: DemoExpense[];
  stock: DemoStockRow[];
};

function latestDateFromRecords(records) {
  return records.reduce((latest, record) => {
    const current = new Date(record.date);
    return !latest || current > latest ? current : latest;
  }, null);
}

const latestDemoDate =
  latestDateFromRecords([
    ...demoSeedData.purchases,
    ...demoSeedData.sales,
    ...demoSeedData.expenses,
  ]) || new Date();

export const demoDefaultReportDate = latestDemoDate.toISOString().slice(0, 10);
