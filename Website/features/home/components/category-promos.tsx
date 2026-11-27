import Image from "next/image";
import Link from "next/link";

type Promo = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  image: string;
  imageAlt: string;
};

const promos = [
  {
    href: "/shop",
    eyebrow: "لپ‌تاپ‌های روزمره و حرفه‌ای",
    title: "برای هر نیاز، یک انتخاب دقیق",
    description: "از کارهای روزمره تا طراحی و برنامه‌نویسی، مدل مناسب خودت را پیدا کن.",
    action: "مشاهده لپ‌تاپ‌ها",
    image: "/images/home/laptop-workspace-brand.jpg",
    imageAlt: "لپ‌تاپ مناسب کار روزمره",
  },
  {
    href: "/shop",
    eyebrow: "هندزفری و هدفون",
    title: "جزئیات صدا را از دست نده",
    description: "برای موسیقی، تماس یا بازی، صدایی شفاف و اتصال پایدار را تجربه کن.",
    action: "مشاهده محصولات صوتی",
    image: "/images/home/headphones-brand.jpg",
    imageAlt: "هدفون و محصولات صوتی دیجیتال",
  },
] as const satisfies readonly Promo[];

const outdoorEssentialsPromos = [
  {
    href: "/shop",
    eyebrow: "لوازم جانبی لپ‌تاپ",
    title: "میز کارت را حرفه‌ای‌تر کن",
    description: "ماوس، کیبورد، هاب و شارژر مناسب را کنار لپ‌تاپت داشته باش.",
    action: "مشاهده لوازم جانبی",
    image: "/images/home/laptop-brand-gold.jpg",
    imageAlt: "لپ‌تاپ و لوازم جانبی میز کار",
  },
  {
    href: "/shop",
    eyebrow: "پیشنهادهای ویژه",
    title: "خرید هوشمند با قیمت بهتر",
    description: "محصولات منتخب دیجیتال را با شرایط مناسب‌تر بررسی و مقایسه کن.",
    action: "مشاهده پیشنهادها",
    image: "/images/home/laptop-brand-teal.jpg",
    imageAlt: "مجموعه لپ‌تاپ‌های منتخب فروشگاه",
  },
] as const satisfies readonly Promo[];

function PromoGrid({ items, label }: { items: readonly Promo[]; label: string }) {
  return (
    <section aria-label={label} className="bg-background px-4 pb-10 text-white sm:px-8 sm:pb-14 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1700px] gap-5 lg:grid-cols-2 lg:gap-6">
        {items.map((promo) => (
          <Link key={promo.href} href={promo.href} className="group relative block min-h-[32rem] overflow-hidden rounded-3xl border border-black/10 shadow-xl shadow-black/15 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:min-h-[40rem] lg:min-h-[48rem]">
            <Image src={promo.image} alt={promo.imageAlt} fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
            <span className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent" aria-hidden="true" />

            <span className="relative z-10 flex min-h-[32rem] items-start px-5 py-8 sm:min-h-[40rem] sm:px-9 sm:py-10 lg:min-h-[48rem] lg:px-10 lg:py-12">
              <span className="block w-full min-w-0 text-right drop-shadow-md">
                <span className="inline-flex min-h-8 items-center rounded-full border border-white/35 bg-black/40 px-3 text-xs font-black text-white backdrop-blur-sm sm:min-h-9 sm:px-4 sm:text-sm">{promo.eyebrow}</span>
                <strong className="mt-4 block whitespace-nowrap text-[clamp(1rem,2.2vw,2.25rem)] font-black leading-tight tracking-[-0.04em]">{promo.title}</strong>
                <span className="mt-3 block text-sm font-medium leading-7 text-white/85 sm:text-base">{promo.description}</span>
                <span className="mt-5 inline-flex min-h-10 items-center gap-1 rounded-xl bg-primary px-4 text-xs font-black text-primary-foreground shadow-lg shadow-primary-shadow sm:min-h-11 sm:text-sm">
                  {promo.action}
                  <span className="material-symbols-rounded text-lg" aria-hidden="true">arrow_back</span>
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CategoryPromos() {
  return <PromoGrid items={promos} label="دسته‌بندی‌های منتخب" />;
}

export function OutdoorEssentialsPromos() {
  return <PromoGrid items={outdoorEssentialsPromos} label="لوازم دیجیتال منتخب" />;
}
