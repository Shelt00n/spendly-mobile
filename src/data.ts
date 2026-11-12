export type CategoryId = "food" | "transport" | "home" | "fun" | "health" | "shopping" | "salary" | "freelance";

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  color: string;
  income?: boolean;
}

export interface Transaction {
  id: string;
  amount: number; // > 0 доход, < 0 расход
  category: CategoryId;
  note: string;
  date: string; // YYYY-MM-DD
}

export const CATEGORIES: Category[] = [
  { id: "food", label: "Еда", emoji: "🍜", color: "#FF8A5B" },
  { id: "transport", label: "Транспорт", emoji: "🚇", color: "#5B8CFF" },
  { id: "home", label: "Дом", emoji: "🏠", color: "#9B6BFF" },
  { id: "fun", label: "Досуг", emoji: "🎬", color: "#FF5BA8" },
  { id: "health", label: "Здоровье", emoji: "💊", color: "#2EC4A0" },
  { id: "shopping", label: "Покупки", emoji: "🛍️", color: "#F5B83D" },
  { id: "salary", label: "Зарплата", emoji: "💼", color: "#B8E62E", income: true },
  { id: "freelance", label: "Фриланс", emoji: "💻", color: "#3DD9F5", income: true },
];

export const categoryById = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;

const d = (day: number) => `2026-11-${String(day).padStart(2, "0")}`;

export const SEED: Transaction[] = [
  { id: "t1", amount: -186, category: "food", note: "Кофе и круассан", date: d(12) },
  { id: "t2", amount: -48, category: "transport", note: "Метро", date: d(12) },
  { id: "t3", amount: 14500, category: "freelance", note: "Оплата за лендинг", date: d(11) },
  { id: "t4", amount: -1240, category: "shopping", note: "Кроссовки, распродажа", date: d(11) },
  { id: "t5", amount: -620, category: "fun", note: "Кино на двоих", date: d(10) },
  { id: "t6", amount: -2150, category: "food", note: "Супермаркет на неделю", date: d(9) },
  { id: "t7", amount: -380, category: "health", note: "Аптека", date: d(8) },
  { id: "t8", amount: -4200, category: "home", note: "Коммунальные услуги", date: d(7) },
  { id: "t9", amount: -310, category: "transport", note: "Такси", date: d(6) },
  { id: "t10", amount: 32000, category: "salary", note: "Зарплата", date: d(5) },
  { id: "t11", amount: -890, category: "food", note: "Ресторан", date: d(4) },
  { id: "t12", amount: -540, category: "fun", note: "Подписки", date: d(3) },
];

export const MONTHLY_BUDGET = 18000;

export const fmt = (n: number, sign = false) => {
  const s = Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign ? (n < 0 ? "−" : "+") : ""}${s} ₴`;
};

export const dayLabel = (iso: string) => {
  const [, m, day] = iso.split("-").map(Number);
  if (iso === d(12)) return "Сегодня";
  if (iso === d(11)) return "Вчера";
  const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  return `${day} ${months[m - 1]}`;
};
