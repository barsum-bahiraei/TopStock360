export type HeroSlide = {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  categoryId?: number;
  href?: string;
  external?: boolean;
  linkLabel?: string;
  showInstagramLogo?: boolean;
};

export const heroSlides: HeroSlide[] = [
  {
    eyebrow: "خرید اقساطی تاپ استوک ۳۶۰",
    title: "محصول دیجیتال دلخواهت را قسطی بخر",
    description: "با ۲۵٪ پیش‌پرداخت و سه فقره چک، لپ‌تاپ و تجهیزات دیجیتال مورد نیازت را همین امروز تهیه کن.",
    image: "/images/home/laptop-workspace.jpg",
    imageAlt: "لپ‌تاپ روی میز کار",
  },
  {
    eyebrow: "هندزفری و هدفون",
    title: "صدایی شفاف برای هر لحظه",
    description: "از مکالمه روزمره تا موسیقی و بازی، هندزفری مناسب سبک استفاده خود را انتخاب کنید.",
    image: "/images/home/hero-headphones.jpg",
    imageAlt: "هدفون و تجهیزات صوتی دیجیتال",
  },
  {
    eyebrow: "لپ‌تاپ‌های حرفه‌ای",
    title: "قدرت بیشتر برای کار و بازی",
    description: "مدل مناسب برنامه‌نویسی، طراحی و گیمینگ را با مشخصات دقیق مقایسه و انتخاب کن.",
    image: "/images/home/laptop-premium.jpg",
    imageAlt: "لپ‌تاپ حرفه‌ای با نورپردازی مدرن",
  },
  {
    eyebrow: "لوازم جانبی دیجیتال",
    title: "میز کارت را کامل کن",
    description: "ماوس، کیبورد، شارژر و لوازم جانبی کاربردی را برای یک تجربه سریع‌تر و راحت‌تر انتخاب کنید.",
    image: "/images/home/laptop-office.jpg",
    imageAlt: "لپ‌تاپ مناسب کار و لوازم جانبی دیجیتال",
  },
];
