/**
 * Seed całego menu z Figmy (676:2407):
 *   - menuPage singleton (intro + reservation copy)
 *   - 8 kategorii menu (Przystawki, Zupy, Dania mięsne, Ryby, Wege, Sałatki, Menu dziecięce, Desery)
 *   - 45+ pozycji menu z opisami i cenami
 *
 * Idempotentny — używa createOrReplace ze stałymi ID.
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/seed-menu.ts
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-05-16',
  token,
  useCdn: false,
})

const ls = (pl: string, en: string) => ({ _type: 'localeString', pl, en })
const lt = (pl: string, en: string) => ({ _type: 'localeText', pl, en })

type CatSlug =
  | 'przystawki'
  | 'zupy'
  | 'dania-miesne'
  | 'ryby'
  | 'wege'
  | 'salatki'
  | 'menu-dzieciece'
  | 'desery'

const categories: Array<{
  slug: CatSlug
  order: number
  name: ReturnType<typeof ls>
  description: ReturnType<typeof lt>
}> = [
  {
    slug: 'przystawki',
    order: 10,
    name: ls('Przystawki', 'Starters'),
    description: lt(
      'Na dobry początek, gdy chcesz zaostrzyć apetyt lub podzielić się smakiem.',
      'A good start — for whetting the appetite or sharing the flavour.',
    ),
  },
  {
    slug: 'zupy',
    order: 20,
    name: ls('Zupy', 'Soups'),
    description: lt(
      'Ciepłe, sycące i zdrowe. Idealne na szybki posiłek.',
      'Warm, hearty, and healthy. Perfect for a quick meal.',
    ),
  },
  {
    slug: 'dania-miesne',
    order: 30,
    name: ls('Dania mięsne', 'Mains'),
    description: lt(
      'Mięso od lokalnych dostawców, bez zbędnych dodatków.',
      'Meat from local suppliers, no unnecessary extras.',
    ),
  },
  {
    slug: 'ryby',
    order: 40,
    name: ls('Ryby', 'Fish'),
    description: lt(
      'Smacznie i z korzyścią dla Twojego ciała.',
      'Delicious and good for your body.',
    ),
  },
  {
    slug: 'wege',
    order: 50,
    name: ls('Dania wegetariańskie', 'Vegetarian'),
    description: lt(
      'Natura na talerzu. Idealne na każdą porę dnia.',
      'Nature on the plate. Perfect any time of day.',
    ),
  },
  {
    slug: 'salatki',
    order: 60,
    name: ls('Sałatki', 'Salads'),
    description: lt(
      'Świeżość, która od razu poprawia nastrój.',
      'Freshness that lifts the mood right away.',
    ),
  },
  {
    slug: 'menu-dzieciece',
    order: 70,
    name: ls('Menu dziecięce', 'Kids menu'),
    description: lt('Jedzenie, które dzieci zjedzą do końca.', 'Food kids actually finish.'),
  },
  {
    slug: 'desery',
    order: 80,
    name: ls('Desery', 'Desserts'),
    description: lt('Słodko, świeżo i bez wyrzutów sumienia.', 'Sweet, fresh, and guilt-free.'),
  },
]

type Item = {
  id: string
  category: CatSlug
  order: number
  name: ReturnType<typeof ls>
  description?: ReturnType<typeof lt>
  price: number
  diet?: string[]
}

const items: Item[] = [
  // === Przystawki ===
  {
    id: 'tatar-wolowy',
    category: 'przystawki',
    order: 10,
    name: ls('Tatar wołowy', 'Beef tartare'),
    description: lt(
      'Masło, sos chrzanowy, cebula, ogórek konserwowy, pieczarki',
      'Butter, horseradish sauce, onion, pickled cucumber, mushrooms',
    ),
    price: 42,
  },
  {
    id: 'sledz-po-rosyjsku',
    category: 'przystawki',
    order: 20,
    name: ls('Śledź po rosyjsku', 'Russian-style herring'),
    description: lt(
      'Ogórek konserwowy, cebulka, jajko, kawior, sos z Normandii',
      'Pickled cucumber, onion, egg, caviar, Normandy sauce',
    ),
    price: 24,
  },
  {
    id: 'krewetki-z-patelni',
    category: 'przystawki',
    order: 30,
    name: ls('Krewetki z patelni', 'Pan-fried shrimp'),
    description: lt(
      'Czosnek, masełko, natka pietruszki, grzanki',
      'Garlic, butter, parsley, toasts',
    ),
    price: 42,
  },
  {
    id: 'zoladki-gesie',
    category: 'przystawki',
    order: 40,
    name: ls('Żołądki gęsie', 'Goose gizzards'),
    description: lt(
      'Żołądki duszone w śmietanie z boczniakami',
      'Gizzards stewed in cream with oyster mushrooms',
    ),
    price: 42,
  },

  // === Zupy ===
  {
    id: 'tradycyjny-rosol',
    category: 'zupy',
    order: 10,
    name: ls('Tradycyjny rosół', 'Traditional broth'),
    price: 16,
  },
  {
    id: 'rosol-z-koldunami',
    category: 'zupy',
    order: 20,
    name: ls('Rosół z kołdunami wołowymi', 'Broth with beef dumplings'),
    price: 24,
  },
  {
    id: 'zurek-w-chlebie',
    category: 'zupy',
    order: 30,
    name: ls('Żurek w chlebie na wędzonce', 'Żurek in bread bowl, with smoked meat'),
    description: lt('jajko', 'egg'),
    price: 28,
  },
  {
    id: 'krem-chrzanowy',
    category: 'zupy',
    order: 40,
    name: ls('Krem chrzanowy', 'Horseradish cream soup'),
    description: lt('Placuszki ziemniaczane, prażony boczek', 'Potato pancakes, roasted bacon'),
    price: 23,
  },
  {
    id: 'barszcz-z-uszkami',
    category: 'zupy',
    order: 50,
    name: ls('Barszcz czerwony z uszkami mięsnymi', 'Red borscht with meat dumplings'),
    price: 24,
  },

  // === Dania mięsne ===
  {
    id: 'kotlet-sezam',
    category: 'dania-miesne',
    order: 10,
    name: ls('Kotlet Sezam', 'Sezam cutlet'),
    description: lt(
      'Pierś kurczaka faszerowana, frytki, sałatka ze świeżych warzyw',
      'Stuffed chicken breast, fries, fresh vegetable salad',
    ),
    price: 46,
  },
  {
    id: 'stek-ze-schabu',
    category: 'dania-miesne',
    order: 20,
    name: ls(
      'Stek ze schabu w boczku z sosem borowikowym',
      'Pork loin steak wrapped in bacon, porcini sauce',
    ),
    description: lt(
      'Stek, ziemniaki gratin, dziki brokuł',
      'Steak, gratin potatoes, wild broccoli',
    ),
    price: 52,
  },
  {
    id: 'jaskowe-danie',
    category: 'dania-miesne',
    order: 30,
    name: ls('Jaśkowe danie', 'Jaśko’s plate'),
    description: lt(
      'Kotlet schabowy, pierogi ruskie, zestaw surówek',
      'Pork cutlet, Russian dumplings, fresh salads',
    ),
    price: 46,
  },
  {
    id: 'sznycel-cielecy',
    category: 'dania-miesne',
    order: 40,
    name: ls('Sznycel cielęcy frykando', 'Veal frikando schnitzel'),
    description: lt(
      'Parzybroda z ziemniakami, mix sałat, sos vinaigrette',
      'Cabbage-potato stew, mixed salad, vinaigrette',
    ),
    price: 58,
  },
  {
    id: 'befsztyk-wolowy',
    category: 'dania-miesne',
    order: 50,
    name: ls('Befsztyk wołowy z masłem czosnkowym', 'Beef steak with garlic butter'),
    description: lt(
      'Pieczone ziemniaki, sałatka ze świeżych warzyw',
      'Roasted potatoes, fresh vegetable salad',
    ),
    price: 85,
  },
  {
    id: 'golonka',
    category: 'dania-miesne',
    order: 60,
    name: ls('Golonka', 'Pork knuckle'),
    description: lt(
      'Kopytka grzybowe, sos chrzanowy, kiszone warzywa i grzyby',
      'Mushroom dumplings, horseradish sauce, pickled vegetables and mushrooms',
    ),
    price: 57,
  },
  {
    id: 'zeberka-bbq',
    category: 'dania-miesne',
    order: 70,
    name: ls('Żeberka w sosie barbecue', 'Ribs in BBQ sauce'),
    description: lt('Ziemniaki opiekane, surówka Coleslaw', 'Roasted potatoes, coleslaw'),
    price: 57,
  },
  {
    id: 'pierogi-z-cielecina',
    category: 'dania-miesne',
    order: 80,
    name: ls('Pierogi z cielęciną', 'Veal dumplings'),
    description: lt(
      'Orzech włoski, ser lazur, sos z zielonego pieprzu, świeże warzywa',
      'Walnut, blue cheese, green pepper sauce, fresh vegetables',
    ),
    price: 49,
  },
  {
    id: 'meat-pie',
    category: 'dania-miesne',
    order: 90,
    name: ls('Meat pie', 'Meat pie'),
    description: lt(
      'Gulasz wołowy w cieście francuskim, sos serowy, fasolka szparagowa, batat',
      'Beef stew in puff pastry, cheese sauce, green beans, sweet potato',
    ),
    price: 52,
  },
  {
    id: 'policzki-wieprzowe',
    category: 'dania-miesne',
    order: 100,
    name: ls('Policzki wieprzowe', 'Pork cheeks'),
    description: lt(
      'Batat w boczku, ziemniaki z chrzanem, sałata z zielonej fasolki',
      'Bacon-wrapped sweet potato, horseradish potatoes, green bean salad',
    ),
    price: 52,
  },
  {
    id: 'filet-kurczaka-kurki',
    category: 'dania-miesne',
    order: 110,
    name: ls('Filet kurczaka w sosie kurkowym', 'Chicken fillet, chanterelle sauce'),
    description: lt('Kopytka, mix sałat', 'Dumplings, mixed salad'),
    price: 48,
  },
  {
    id: 'cheeseburger',
    category: 'dania-miesne',
    order: 120,
    name: ls('Cheeseburger', 'Cheeseburger'),
    description: lt('Hamburger wołowy, frytki, surówka Coleslaw', 'Beef burger, fries, coleslaw'),
    price: 49,
  },
  {
    id: 'kurczak-supreme',
    category: 'dania-miesne',
    order: 130,
    name: ls('Kurczak supreme', 'Chicken supreme'),
    description: lt(
      'Pomidory, gorgonzola, maślane puree, młody szpinak, sos z zielonego pieprzu',
      'Tomatoes, gorgonzola, butter mash, baby spinach, green pepper sauce',
    ),
    price: 48,
  },
  {
    id: 'filet-z-indyka-kapary',
    category: 'dania-miesne',
    order: 140,
    name: ls('Filet z indyka w sosie kaparowym', 'Turkey fillet, caper sauce'),
    description: lt(
      'Gnocchi z suszonymi pomidorami, cukinia, pomidor',
      'Gnocchi with sun-dried tomatoes, zucchini, tomato',
    ),
    price: 53,
  },
  {
    id: 'filet-z-kaczki-sv',
    category: 'dania-miesne',
    order: 150,
    name: ls('Filet z kaczki sous vide', 'Sous-vide duck fillet'),
    description: lt(
      'Kopytka z jabłkiem, sos z malin, mus z palonego jabłka',
      'Apple dumplings, raspberry sauce, burnt-apple mousse',
    ),
    price: 58,
  },

  // === Ryby ===
  {
    id: 'okon-morski',
    category: 'ryby',
    order: 10,
    name: ls('Okoń morski', 'Sea bass'),
    description: lt(
      'Zielone warzywa z patelni, ziemniaczki puree, dip cytrusowy',
      'Pan-fried green vegetables, mashed potatoes, citrus dip',
    ),
    price: 52,
  },
  {
    id: 'mietus',
    category: 'ryby',
    order: 20,
    name: ls('Miętus z sosem cytrynowo-kaparowym', 'Burbot with lemon-caper sauce'),
    description: lt(
      'Maślane puree, faszerowana cukinia, dziki brokuł',
      'Butter mash, stuffed zucchini, wild broccoli',
    ),
    price: 54,
  },

  // === Wege ===
  {
    id: 'placki-smietana',
    category: 'wege',
    order: 10,
    name: ls('Chrupiące placki ze śmietaną', 'Crispy potato pancakes with cream'),
    price: 28,
    diet: ['vegetarian'],
  },
  {
    id: 'placki-sos-grzybowy',
    category: 'wege',
    order: 20,
    name: ls('Chrupiące placki z sosem grzybowym', 'Crispy potato pancakes with mushroom sauce'),
    price: 33,
    diet: ['vegetarian'],
  },
  {
    id: 'tagliatelle-szpinak',
    category: 'wege',
    order: 30,
    name: ls('Tagliatelle ze szpinakiem i mascarpone', 'Tagliatelle with spinach and mascarpone'),
    price: 35,
    diet: ['vegetarian'],
  },
  {
    id: 'pennette-losos',
    category: 'wege',
    order: 40,
    name: ls('Makaron pennette z pieczonym łososiem', 'Pennette with roasted salmon'),
    price: 43,
  },
  {
    id: 'pierogi-ruskie',
    category: 'wege',
    order: 50,
    name: ls('Pierogi ruskie', 'Russian dumplings'),
    price: 26,
    diet: ['vegetarian'],
  },
  {
    id: 'curry-tofu',
    category: 'wege',
    order: 60,
    name: ls('Wegetariańskie curry z tofu', 'Vegetarian tofu curry'),
    price: 35,
    diet: ['vegetarian', 'vegan'],
  },

  // === Sałatki ===
  {
    id: 'salatka-z-kurczakiem',
    category: 'salatki',
    order: 10,
    name: ls('Sałatka z kurczakiem', 'Chicken salad'),
    description: lt(
      'Ogórek, pomidor, jajko, sałata, ananas, feta, cebula, sos vinegrette, pieczywo czosnkowe',
      'Cucumber, tomato, egg, lettuce, pineapple, feta, onion, vinaigrette, garlic bread',
    ),
    price: 35,
  },
  {
    id: 'salatka-poledwiczka',
    category: 'salatki',
    order: 20,
    name: ls('Sałatka z polędwiczką wieprzową', 'Pork tenderloin salad'),
    description: lt(
      'Puder z boczku, sałata, papryka, pomidor, cebula, oliwki, ogórek, parmezan, jalapeño, sos musztardowy, pieczywo czosnkowe',
      'Bacon crumbs, lettuce, pepper, tomato, onion, olives, cucumber, parmesan, jalapeño, mustard dressing, garlic bread',
    ),
    price: 39,
  },
  {
    id: 'salatka-grecka',
    category: 'salatki',
    order: 30,
    name: ls('Sałatka grecka', 'Greek salad'),
    description: lt(
      'Ogórek, pomidor, papryka, cebula, oliwki, ser feta, sos vinegrette, pieczywo czosnkowe',
      'Cucumber, tomato, pepper, onion, olives, feta, vinaigrette, garlic bread',
    ),
    price: 29,
    diet: ['vegetarian'],
  },

  // === Menu dziecięce ===
  {
    id: 'rosolek-z-kluseczkami',
    category: 'menu-dzieciece',
    order: 10,
    name: ls('Rosołek z kluseczkami', 'Mini broth with noodles'),
    price: 12,
  },
  {
    id: 'zupka-pomidorowa',
    category: 'menu-dzieciece',
    order: 20,
    name: ls('Zupka pomidorowa', 'Tomato soup'),
    price: 12,
    diet: ['vegetarian'],
  },
  {
    id: 'poledwiczka-panierowana',
    category: 'menu-dzieciece',
    order: 30,
    name: ls('Polędwiczka drobiowa panierowana', 'Breaded chicken tenders'),
    description: lt('Frytki, marchewka', 'Fries, carrot'),
    price: 28,
  },
  {
    id: 'nalesniki-nutella',
    category: 'menu-dzieciece',
    order: 40,
    name: ls('Naleśniki z bananem i nutellą', 'Pancakes with banana and Nutella'),
    price: 26,
    diet: ['vegetarian'],
  },
  {
    id: 'quesadilla',
    category: 'menu-dzieciece',
    order: 50,
    name: ls('Quesadilla z kurczakiem', 'Chicken quesadilla'),
    description: lt('Tortilla pszenna, ser, sos', 'Wheat tortilla, cheese, sauce'),
    price: 30,
  },

  // === Desery ===
  {
    id: 'jablecznik',
    category: 'desery',
    order: 10,
    name: ls('Jabłecznik na gorąco', 'Warm apple pie'),
    description: lt(
      'Sos czekoladowy, lody waniliowe, puder miętowy',
      'Chocolate sauce, vanilla ice cream, mint dust',
    ),
    price: 25,
    diet: ['vegetarian'],
  },
  {
    id: 'sernik',
    category: 'desery',
    order: 20,
    name: ls('Sernik', 'Cheesecake'),
    description: lt('Świeże owoce, syrop klonowy', 'Fresh fruit, maple syrup'),
    price: 25,
    diet: ['vegetarian'],
  },
  {
    id: 'beza',
    category: 'desery',
    order: 30,
    name: ls('Beza', 'Meringue'),
    description: lt(
      'Mascarpone, sos malinowy, świeże owoce',
      'Mascarpone, raspberry sauce, fresh fruit',
    ),
    price: 28,
    diet: ['vegetarian'],
  },
  {
    id: 'tiramisu',
    category: 'desery',
    order: 40,
    name: ls('Tiramisu pistacjowe', 'Pistachio tiramisu'),
    price: 28,
    diet: ['vegetarian'],
  },
  {
    id: 'krem-brulee',
    category: 'desery',
    order: 50,
    name: ls('Krem brulee', 'Crème brûlée'),
    price: 28,
    diet: ['vegetarian'],
  },
]

async function main() {
  console.log('Seedowanie kategorii…')
  for (const c of categories) {
    await client.createOrReplace({
      _id: `menuCategory-${c.slug}`,
      _type: 'menuCategory',
      name: c.name,
      slug: { _type: 'slug', current: c.slug },
      description: c.description,
      order: c.order,
    })
  }
  console.log(`✓ ${categories.length} kategorii zapisanych`)

  console.log('Seedowanie pozycji menu…')
  for (const item of items) {
    await client.createOrReplace({
      _id: `menuItem-${item.id}`,
      _type: 'menuItem',
      name: item.name,
      description: item.description,
      price: item.price,
      category: { _type: 'reference', _ref: `menuCategory-${item.category}` },
      diet: item.diet,
      order: item.order,
      available: true,
    })
  }
  console.log(`✓ ${items.length} pozycji zapisanych`)

  console.log('Seedowanie menuPage…')
  await client.createOrReplace({
    _id: 'menuPage',
    _type: 'menuPage',
    pageIntro: {
      eyebrow: ls('Nasze menu', 'Our menu'),
      title: ls('Najświeższe jedzenie w Stalowej Woli', 'The freshest food in Stalowa Wola'),
      subtitle: lt(
        'Dania stworzone po to, żebyś zjadł pysznie, świeżo i bez wyrzutów sumienia.',
        'Dishes created so you can eat well, fresh, and guilt-free.',
      ),
      ctaLabel: ls('Sprawdź menu', 'Browse menu'),
    },
    reservationSection: {
      title: ls('Zarezerwuj stolik w restauracji Sezam', 'Book a table at Sezam restaurant'),
      description: lt(
        'Zadzwoń, a nasz zespół znajdzie dla Ciebie najlepszy stolik.',
        'Call us — our team will find the best table for you.',
      ),
    },
    seo: {
      _type: 'seoMeta',
      metaTitle: {
        pl: 'Menu Restauracji Sezam Stalowa Wola — przystawki, zupy, mięsa, desery',
        en: 'Sezam Restaurant Menu Stalowa Wola — starters, soups, mains, desserts',
      },
      metaDescription: {
        pl: 'Pełne menu Restauracji Zajazdu Sezam: przystawki, zupy, dania mięsne i rybne, opcje wegetariańskie, sałatki, menu dla dzieci, desery.',
        en: 'Full Sezam Restaurant menu: starters, soups, meat and fish mains, vegetarian options, salads, kids menu, desserts.',
      },
      noIndex: false,
    },
  })
  console.log('✓ menuPage zapisany')
}

await main()
