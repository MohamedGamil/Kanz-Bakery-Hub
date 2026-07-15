/**
 * Idempotent seed script — safe to run multiple times.
 * Categories and products are keyed on their `slug` (UNIQUE constraint).
 * ON CONFLICT (slug) DO UPDATE keeps data fresh without creating duplicates.
 *
 * Run with:  pnpm --filter @workspace/api-server seed
 */

import { sql } from "drizzle-orm";
import { db, pool, categoriesTable, productsTable } from "@workspace/db";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

// ---------------------------------------------------------------------------
// Category data
// ---------------------------------------------------------------------------

const CATEGORIES = [
  {
    name: "Breads",
    slug: "breads",
    description: "Artisan loaves baked fresh every morning — sourdoughs, baguettes, and more.",
    imageUrl: img("1509440159596-0249088772ff"),
    sortOrder: 1,
  },
  {
    name: "Pastries",
    slug: "pastries",
    description: "Buttery, flaky pastries made with pure French butter and slow-laminated dough.",
    imageUrl: img("1555507036-ab1f4038808a"),
    sortOrder: 2,
  },
  {
    name: "Cakes",
    slug: "cakes",
    description: "Celebration cakes and everyday indulgences crafted layer by layer.",
    imageUrl: img("1578985545062-69928b1d9587"),
    sortOrder: 3,
  },
  {
    name: "Cookies & Biscuits",
    slug: "cookies",
    description: "Hand-portioned cookies and delicate biscuits baked to golden perfection.",
    imageUrl: img("1499636136210-6f4ee915583e"),
    sortOrder: 4,
  },
  {
    name: "Arabic Sweets",
    slug: "arabic-sweets",
    description: "Traditional Middle Eastern confections made with honey, nuts, and rose water.",
    imageUrl: img("1519996529931-28324d5a630e"),
    sortOrder: 5,
  },
  {
    name: "Beverages",
    slug: "beverages",
    description: "Specialty coffees, aromatic teas, and warm drinks to complement every bite.",
    imageUrl: img("1509042239860-f550ce710b93"),
    sortOrder: 6,
  },
] as const;

// ---------------------------------------------------------------------------
// Product data  (categorySlug links to the categories above)
// ---------------------------------------------------------------------------

const PRODUCTS: {
  name: string;
  slug: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  price: string;
  imageUrl: string;
  ingredients?: string;
  allergens: string[];
  dietaryLabels: string[];
  available: boolean;
  featured: boolean;
}[] = [
  // ── Breads ───────────────────────────────────────────────────────────────
  {
    name: "Classic Sourdough",
    slug: "classic-sourdough",
    categorySlug: "breads",
    shortDescription: "Slow-fermented, chewy crumb with a blistered golden crust.",
    description:
      "Our flagship sourdough is fermented for 18 hours with a house starter that dates back to our founding. The result is a complex, mildly tangy loaf with an open crumb and a deeply caramelised crust — perfect toasted with butter or alongside soup.",
    price: "14.00",
    imageUrl: img("1586444248902-2f64eddc13df"),
    ingredients: "Stoneground wheat flour, filtered water, sea salt, live sourdough starter.",
    allergens: ["gluten", "wheat"],
    dietaryLabels: ["Vegan", "No Added Sugar"],
    available: true,
    featured: true,
  },
  {
    name: "French Baguette",
    slug: "french-baguette",
    categorySlug: "breads",
    shortDescription: "Traditional baguette with a crisp crust and airy interior.",
    description:
      "Baked in the classic French tradition: high hydration dough, long cold proof, and a fierce oven with steam injection. Each baguette has a shattering crust and a soft, irregular crumb. Best eaten within hours of baking.",
    price: "6.50",
    imageUrl: img("1509440159596-0249088772ff"),
    ingredients: "Type 65 wheat flour, water, salt, fresh yeast.",
    allergens: ["gluten", "wheat"],
    dietaryLabels: ["Vegan", "No Added Sugar"],
    available: true,
    featured: true,
  },
  {
    name: "Olive & Rosemary Focaccia",
    slug: "olive-rosemary-focaccia",
    categorySlug: "breads",
    shortDescription: "Dimpled, olive-oil-rich flatbread topped with Kalamata olives.",
    description:
      "A generous slab of Ligurian-style focaccia drizzled with extra-virgin olive oil, scattered with Kalamata olives, and finished with fresh rosemary and flaky sea salt. Cut into squares and share.",
    price: "11.00",
    imageUrl: img("1464349095431-e9a21285b5f3"),
    ingredients: "Wheat flour, water, extra-virgin olive oil, Kalamata olives, fresh rosemary, sea salt, yeast.",
    allergens: ["gluten", "wheat"],
    dietaryLabels: ["Vegan"],
    available: true,
    featured: false,
  },
  {
    name: "Multigrain Sandwich Loaf",
    slug: "multigrain-sandwich-loaf",
    categorySlug: "breads",
    shortDescription: "Hearty, seeded loaf — soft inside, crackly seed crust outside.",
    description:
      "Packed with sunflower seeds, pumpkin seeds, linseeds, and rolled oats, this loaf is as nutritious as it is delicious. The crumb is soft and slightly chewy — ideal for sandwiches and avocado toast.",
    price: "12.50",
    imageUrl: img("1509440159596-0249088772ff"),
    ingredients: "Whole wheat flour, rye flour, water, mixed seeds (sunflower, pumpkin, linseed), rolled oats, honey, yeast, salt.",
    allergens: ["gluten", "wheat", "oats"],
    dietaryLabels: ["High Fibre"],
    available: true,
    featured: false,
  },

  // ── Pastries ─────────────────────────────────────────────────────────────
  {
    name: "Butter Croissant",
    slug: "butter-croissant",
    categorySlug: "pastries",
    shortDescription: "84 layers of pure AOP butter laminated into honeyed perfection.",
    description:
      "Made with Isigny AOP butter and a three-day lamination process, our croissants achieve the elusive combination of shattering crust and feather-light interior. Eat warm for the full effect.",
    price: "5.50",
    imageUrl: img("1555507036-ab1f4038808a"),
    ingredients: "Wheat flour, AOP butter, whole milk, caster sugar, fresh yeast, salt.",
    allergens: ["gluten", "wheat", "dairy", "eggs"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: true,
  },
  {
    name: "Pain au Chocolat",
    slug: "pain-au-chocolat",
    categorySlug: "pastries",
    shortDescription: "Two rods of 70% dark chocolate wrapped in laminated dough.",
    description:
      "The same butter-laminated dough as our croissant, rolled around two bars of Valrhona Guanaja 70% dark chocolate. The chocolate melts into rich, bittersweet ribbons that contrast beautifully with the flaky pastry.",
    price: "6.00",
    imageUrl: img("1569864358642-9d1684040f43"),
    ingredients: "Wheat flour, AOP butter, whole milk, Valrhona dark chocolate (70%), caster sugar, fresh yeast, salt.",
    allergens: ["gluten", "wheat", "dairy", "eggs", "soy"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: true,
  },
  {
    name: "Cinnamon Roll",
    slug: "cinnamon-roll",
    categorySlug: "pastries",
    shortDescription: "Soft enriched dough, brown sugar cinnamon filling, cream cheese glaze.",
    description:
      "Generous spirals of soft enriched dough filled with Ceylon cinnamon and dark brown sugar, baked until golden, then blanketed in a tangy cream cheese glaze. Gooey in the centre, caramelised on the outside.",
    price: "7.00",
    imageUrl: img("1612929633738-8fe44f7ec841"),
    ingredients: "Wheat flour, whole milk, eggs, butter, brown sugar, Ceylon cinnamon, cream cheese, icing sugar, vanilla.",
    allergens: ["gluten", "wheat", "dairy", "eggs"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: false,
  },
  {
    name: "Almond Croissant",
    slug: "almond-croissant",
    categorySlug: "pastries",
    shortDescription: "Day-old croissant filled and coated with frangipane, toasted almonds.",
    description:
      "A classic Parisian pastry-shop tradition: yesterday's croissant soaked in rum syrup, filled with almond frangipane, topped with more frangipane and flaked almonds, then baked to a golden, crisp finish. Rich, nutty, and deeply satisfying.",
    price: "6.50",
    imageUrl: img("1569050467447-ce54b3bbc37d"),
    ingredients: "Croissant (wheat flour, butter, milk, eggs, yeast, salt), almond frangipane (ground almonds, butter, sugar, eggs), flaked almonds, rum syrup.",
    allergens: ["gluten", "wheat", "dairy", "eggs", "tree nuts"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: false,
  },

  // ── Cakes ─────────────────────────────────────────────────────────────────
  {
    name: "Dark Chocolate Layer Cake",
    slug: "dark-chocolate-layer-cake",
    categorySlug: "cakes",
    shortDescription: "Three layers of deep chocolate sponge with ganache and mirror glaze.",
    description:
      "A showstopper of a cake: three layers of Valrhona cocoa sponge sandwiched with dark chocolate ganache, frosted with chocolate Swiss meringue buttercream, and finished with a glossy mirror glaze. Intensely chocolatey without being cloying.",
    price: "58.00",
    imageUrl: img("1578985545062-69928b1d9587"),
    ingredients: "Wheat flour, Valrhona cocoa, eggs, caster sugar, butter, whole milk, dark chocolate (70%), cream.",
    allergens: ["gluten", "wheat", "dairy", "eggs", "soy"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: true,
  },
  {
    name: "Classic New York Cheesecake",
    slug: "classic-new-york-cheesecake",
    categorySlug: "cakes",
    shortDescription: "Dense, velvety cream cheese filling on a buttered digestive base.",
    description:
      "Baked low and slow in a water bath for a flawlessly smooth, crack-free top. Rich Philadelphia cream cheese, sour cream, and a hint of vanilla on a golden digestive biscuit crust. Served chilled, plain or with seasonal berry compote.",
    price: "52.00",
    imageUrl: img("1571877227200-a0d98ea607e9"),
    ingredients: "Cream cheese, sour cream, eggs, caster sugar, vanilla extract, digestive biscuits, unsalted butter.",
    allergens: ["gluten", "wheat", "dairy", "eggs"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: false,
  },
  {
    name: "Strawberry Shortcake",
    slug: "strawberry-shortcake",
    categorySlug: "cakes",
    shortDescription: "Light vanilla sponge, Chantilly cream, and fresh strawberries.",
    description:
      "A Japanese-inspired strawberry shortcake: impossibly light and airy chiffon sponge, whipped Chantilly cream, and whole strawberries arranged inside and out. Delicate, not-too-sweet, and beautiful to present.",
    price: "48.00",
    imageUrl: img("1565958011703-44f9829ba187"),
    ingredients: "Wheat flour, eggs, caster sugar, neutral oil, whole milk, double cream, strawberries, vanilla pod.",
    allergens: ["gluten", "wheat", "dairy", "eggs"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: false,
  },
  {
    name: "Lemon Drizzle Loaf",
    slug: "lemon-drizzle-loaf",
    categorySlug: "cakes",
    shortDescription: "Zesty, moist lemon sponge soaked in sharp lemon syrup.",
    description:
      "Freshly zested and juiced Amalfi lemons go into both the batter and the soaking syrup that drenches the warm loaf straight from the oven. The result is a fiercely lemony, ultra-moist crumb under a crackled sugar crust.",
    price: "22.00",
    imageUrl: img("1541599468348-e96984315921"),
    ingredients: "Wheat flour, eggs, butter, caster sugar, Amalfi lemon zest and juice, baking powder.",
    allergens: ["gluten", "wheat", "dairy", "eggs"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: false,
  },

  // ── Cookies & Biscuits ────────────────────────────────────────────────────
  {
    name: "Chocolate Chip Cookies",
    slug: "chocolate-chip-cookies",
    categorySlug: "cookies",
    shortDescription: "Brown-butter dough, Callebaut chips — crispy edge, gooey centre.",
    description:
      "The dough is made with browned butter and rested overnight to develop a deep toffee note. Loaded with 60% Callebaut chocolate chips and finished with Maldon sea salt, these are the cookies that keep customers coming back.",
    price: "4.00",
    imageUrl: img("1499636136210-6f4ee915583e"),
    ingredients: "Wheat flour, browned butter, brown sugar, caster sugar, eggs, Callebaut chocolate chips (60%), vanilla, bicarbonate of soda, Maldon sea salt.",
    allergens: ["gluten", "wheat", "dairy", "eggs", "soy"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: true,
  },
  {
    name: "French Macarons (Box of 6)",
    slug: "french-macarons-box-6",
    categorySlug: "cookies",
    shortDescription: "Delicate almond meringue shells with seasonal fillings.",
    description:
      "Crisp-footed almond meringue shells with a chewy interior, sandwiched with seasonal ganaches and buttercreams. Flavours rotate weekly — ask your barista what's in today. Packaged in a gift box of six.",
    price: "18.00",
    imageUrl: img("1558326567-98ae2405596b"),
    ingredients: "Ground almonds, icing sugar, egg whites, caster sugar, cream, butter, natural flavourings.",
    allergens: ["tree nuts", "eggs", "dairy"],
    dietaryLabels: ["Gluten Free", "Vegetarian"],
    available: true,
    featured: false,
  },
  {
    name: "Pistachio Shortbread",
    slug: "pistachio-shortbread",
    categorySlug: "cookies",
    shortDescription: "Melt-in-the-mouth buttery shortbread studded with pistachios.",
    description:
      "Scottish-style shortbread — pure butter, flour, and sugar — enriched with ground pistachios for a subtle nuttiness and a beautiful pale green hue. Finished with a dip in white chocolate and a sprinkle of crushed pistachios.",
    price: "5.50",
    imageUrl: img("1558961363-fa8fdf82db35"),
    ingredients: "Wheat flour, unsalted butter, icing sugar, ground pistachios, white chocolate, sea salt.",
    allergens: ["gluten", "wheat", "dairy", "tree nuts"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: false,
  },
  {
    name: "Oatmeal Raisin Cookies",
    slug: "oatmeal-raisin-cookies",
    categorySlug: "cookies",
    shortDescription: "Chewy, spiced oat cookies packed with golden raisins.",
    description:
      "Old-fashioned rolled oats, warm cinnamon and nutmeg, and plump Sultana raisins combine in a cookie that is thick, chewy, and deeply satisfying. A classic that earns its place alongside the fancier options on the counter.",
    price: "3.50",
    imageUrl: img("1483695028939-5bb13f8648b0"),
    ingredients: "Rolled oats, wheat flour, butter, brown sugar, eggs, Sultana raisins, cinnamon, nutmeg, vanilla, bicarbonate of soda.",
    allergens: ["gluten", "wheat", "oats", "dairy", "eggs"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: false,
  },

  // ── Arabic Sweets ─────────────────────────────────────────────────────────
  {
    name: "Mixed Nut Baklava",
    slug: "mixed-nut-baklava",
    categorySlug: "arabic-sweets",
    shortDescription: "Layers of crisp filo, spiced mixed nuts, and rose-water syrup.",
    description:
      "Forty layers of hand-brushed filo pastry filled with a mixture of pistachios, walnuts, and cashews seasoned with cinnamon and clove. Baked to a shattering crisp then drenched with rose-water and orange-blossom honey syrup.",
    price: "24.00",
    imageUrl: img("1519996529931-28324d5a630e"),
    ingredients: "Filo pastry (wheat flour, water, salt), clarified butter, pistachios, walnuts, cashews, honey, rose water, orange blossom water, cinnamon, clove.",
    allergens: ["gluten", "wheat", "dairy", "tree nuts"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: true,
  },
  {
    name: "Kunafa Nabulsieh",
    slug: "kunafa-nabulsieh",
    categorySlug: "arabic-sweets",
    shortDescription: "Shredded pastry over soft Nabulsi cheese, soaked in sugar syrup.",
    description:
      "Authentic Palestinian-style kunafa: a layer of fine-shred kataifi pastry crisp-baked in clarified butter, filled with stretchy Nabulsi cheese, inverted and soaked in fragrant sugar syrup. Topped with crushed pistachios and served warm.",
    price: "18.00",
    imageUrl: img("1563729784474-d77dbb933a9e"),
    ingredients: "Kataifi (shredded wheat pastry), Nabulsi cheese, clarified butter, sugar syrup (sugar, rose water, lemon), pistachios.",
    allergens: ["gluten", "wheat", "dairy", "tree nuts"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: true,
  },
  {
    name: "Basbousa with Cream",
    slug: "basbousa-with-cream",
    categorySlug: "arabic-sweets",
    shortDescription: "Semolina cake soaked in syrup, filled with clotted cream.",
    description:
      "A beloved Egyptian semolina cake moistened with orange-blossom syrup and filled with a thick layer of ashta (clotted cream). Topped with a blanched almond and a dusting of desiccated coconut. Soft, fragrant, and naturally sweet.",
    price: "8.00",
    imageUrl: img("1576618148400-f54bed99fcfd"),
    ingredients: "Fine semolina, desiccated coconut, butter, yoghurt, sugar, baking powder, ashta cream, orange blossom syrup, almonds.",
    allergens: ["gluten", "wheat", "dairy", "tree nuts"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    featured: false,
  },
  {
    name: "Date & Cardamom Ma'amoul",
    slug: "date-cardamom-maamoul",
    categorySlug: "arabic-sweets",
    shortDescription: "Moulded semolina biscuits stuffed with cardamom-spiced Medjool dates.",
    description:
      "A staple of Eid celebrations across the Levant, our ma'amoul are filled with a smooth paste of Medjool dates perfumed with cardamom and rose water, encased in delicate semolina and plain flour shells, and dusted with icing sugar.",
    price: "12.00",
    imageUrl: img("1554520735-0a6b8b6ce8b7"),
    ingredients: "Fine semolina, plain flour, clarified butter, Medjool dates, cardamom, rose water, icing sugar.",
    allergens: ["gluten", "wheat", "dairy"],
    dietaryLabels: ["Vegan", "Vegetarian"],
    available: true,
    featured: false,
  },

  // ── Beverages ─────────────────────────────────────────────────────────────
  {
    name: "Specialty Espresso",
    slug: "specialty-espresso",
    categorySlug: "beverages",
    shortDescription: "Single-origin espresso with bright acidity and chocolate finish.",
    description:
      "Pulled on a La Marzocca Linea PB, our rotating single-origin espresso is sourced from small farms in Ethiopia and Colombia. Expect floral aromatics, a bright citrus hit, and a long chocolate finish. Available as single or double.",
    price: "9.00",
    imageUrl: img("1509042239860-f550ce710b93"),
    ingredients: "Specialty coffee, filtered water.",
    allergens: [],
    dietaryLabels: ["Vegan", "Gluten Free"],
    available: true,
    featured: false,
  },
  {
    name: "Cardamom Rose Latte",
    slug: "cardamom-rose-latte",
    categorySlug: "beverages",
    shortDescription: "Espresso, steamed milk, cardamom syrup, and dried rose petals.",
    description:
      "Inspired by Saudi qahwa, this latte layers a double espresso with house-made cardamom syrup, velvety steamed whole milk, and a garnish of dried rose petals. Sweet, spiced, and aromatic — it drinks like a hug.",
    price: "14.00",
    imageUrl: img("1495474472287-4d71bcdd2085"),
    ingredients: "Specialty espresso, whole milk, cardamom syrup (cardamom, sugar, water), dried rose petals.",
    allergens: ["dairy"],
    dietaryLabels: ["Vegetarian", "Gluten Free"],
    available: true,
    featured: true,
  },
  {
    name: "Moroccan Mint Tea",
    slug: "moroccan-mint-tea",
    categorySlug: "beverages",
    shortDescription: "Pot of Chinese gunpowder green tea with fresh Nana mint and sugar.",
    description:
      "Served in a traditional silver teapot poured high to create a froth, our Moroccan mint tea is brewed with Chinese gunpowder green tea and a generous handful of fresh Nana mint, sweetened to taste with rock sugar on the side.",
    price: "12.00",
    imageUrl: img("1544145945-f90425340c7e"),
    ingredients: "Gunpowder green tea, fresh Nana mint, rock sugar, water.",
    allergens: [],
    dietaryLabels: ["Vegan", "Gluten Free"],
    available: true,
    featured: false,
  },
  {
    name: "Dark Hot Chocolate",
    slug: "dark-hot-chocolate",
    categorySlug: "beverages",
    shortDescription: "Thick drinking chocolate made with 70% Valrhona, steamed milk.",
    description:
      "True European-style hot chocolate — thick, rich, and barely sweet. Made with shaved Valrhona Guanaja 70% dissolved into steamed whole milk, finished with a dusting of cocoa powder. Not a powder mix in sight.",
    price: "13.00",
    imageUrl: img("1550617931-e17a7b70dce2"),
    ingredients: "Valrhona dark chocolate (70%), whole milk, cocoa powder.",
    allergens: ["dairy", "soy"],
    dietaryLabels: ["Vegetarian", "Gluten Free"],
    available: true,
    featured: false,
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("🌱 Starting seed…\n");

  const catSlugs = CATEGORIES.map((c) => c.slug);
  const prodSlugs = PRODUCTS.map((p) => p.slug);

  // 0. Clean up data that is NOT part of the canonical seed set ──────────────
  //    Order: reviews → products → categories  (respects FK constraints)
  console.log("Cleaning up non-seed data…");

  // Delete reviews whose product is not in the seed
  await db.execute(
    sql.raw(`
      DELETE FROM reviews
      WHERE product_id IN (
        SELECT id FROM products WHERE slug NOT IN (${prodSlugs.map((s) => `'${s}'`).join(",")})
      )
    `)
  );

  // Delete products not in the seed
  await db.execute(
    sql.raw(`
      DELETE FROM products WHERE slug NOT IN (${prodSlugs.map((s) => `'${s}'`).join(",")})
    `)
  );

  // Delete categories not in the seed
  await db.execute(
    sql.raw(`
      DELETE FROM categories WHERE slug NOT IN (${catSlugs.map((s) => `'${s}'`).join(",")})
    `)
  );

  // 1. Upsert categories ─────────────────────────────────────────────────────
  console.log(`Upserting ${CATEGORIES.length} categories…`);
  await db
    .insert(categoriesTable)
    .values(CATEGORIES.map((c) => ({ ...c })))
    .onConflictDoUpdate({
      target: categoriesTable.slug,
      set: {
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        imageUrl: sql`excluded.image_url`,
        sortOrder: sql`excluded.sort_order`,
      },
    });

  // 2. Fetch all categories → slug-to-id map ─────────────────────────────────
  const allCategories = await db.select().from(categoriesTable);
  const catIdBySlug: Record<string, number> = {};
  for (const cat of allCategories) {
    catIdBySlug[cat.slug] = cat.id;
  }

  // 3. Upsert products ────────────────────────────────────────────────────────
  console.log(`Upserting ${PRODUCTS.length} products…`);
  const productRows = PRODUCTS.map(({ categorySlug, ...rest }) => {
    const categoryId = catIdBySlug[categorySlug];
    if (!categoryId) throw new Error(`Unknown category slug: "${categorySlug}"`);
    return { ...rest, categoryId };
  });

  await db
    .insert(productsTable)
    .values(productRows)
    .onConflictDoUpdate({
      target: productsTable.slug,
      set: {
        name: sql`excluded.name`,
        shortDescription: sql`excluded.short_description`,
        description: sql`excluded.description`,
        price: sql`excluded.price`,
        imageUrl: sql`excluded.image_url`,
        categoryId: sql`excluded.category_id`,
        ingredients: sql`excluded.ingredients`,
        allergens: sql`excluded.allergens`,
        dietaryLabels: sql`excluded.dietary_labels`,
        available: sql`excluded.available`,
        featured: sql`excluded.featured`,
      },
    });

  console.log("\n✅ Seed complete.");
  console.log(`   ${CATEGORIES.length} categories  •  ${PRODUCTS.length} products`);
}

/** Exported so it can be called from the admin seed endpoint without closing the pool. */
export { main as runSeed };

// CLI entry point only — not executed when imported as a module
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
  main()
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    })
    .finally(() => pool.end());
}
