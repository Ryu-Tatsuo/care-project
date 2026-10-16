/* ==========================================================================
   ÉPURE BOTANIQUE — main.js
   Hair & Skin Care Store interactions:
   - Header sticky state & mobile drawer
   - Category filtering (All, Hair, Skin, Body)
   - Cart drawer, quantities, remove, local storage
   - WhatsApp order checkout generator
   - Multi-language switcher (EN, FR, AR) with full RTL Arabic support
   - Routine tabs (Cleansing, Hydration, Treatment)
   - Newsletter signup with validation and confirmation
   - Toast notifications & scroll reveal
   ========================================================================== */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const track = window.__track || function () {};

  /* -- Language Switcher & Dictionary -------------------------------------- */
  const languageSelect = document.querySelector("[data-language]");
  let currentLanguage = "en";

  const translations = {
    en: {
      "language.label": "Language",
      "announcement.copy": "Complimentary botanical travel oil on orders over €70 — ",
      "announcement.link": "discover the hair & skin ritual",
      "nav.collection": "Treatments",
      "nav.atelier": "Atelier",
      "nav.ingredients": "Ingredients",
      "nav.routine": "The Routine",
      "nav.care": "Care & FAQ",
      "hero.eyebrow": "Atelier de soins botaniques · Provence — est. 2018",
      "hero.title": "Nurture your <em>natural glow</em>.",
      "hero.lede": "High-performance hair and skin botanical care, formulated with cold-pressed restorative oils, bio-fermented botanicals, and plant ceramides. Pure, effective, and deeply replenishing.",
      "hero.explore": "Shop treatments",
      "hero.story": "Our philosophy",
      "hero.shipping": "Free worldwide delivery from €70",
      "hero.returns": "30-day gentle guarantee",
      "marquee.botanical": "100% Cold-Pressed Botanicals",
      "marquee.clean": "Sulfate & Silicone Free",
      "marquee.cruelty": "Leaping Bunny Certified",
      "marquee.refillable": "Recyclable Glass & Refills",
      "marquee.dermatologist": "Dermatologist Tested",
      "collection.eyebrow": "The Formulations",
      "collection.title": "Essential hair & skincare treatments.",
      "collection.copy": "Every formula is clean, balanced to scalp and skin physiological pH, and packed with nutrient-dense botanical actives.",
      "filter.all": "All Care",
      "filter.hair": "Hair Care",
      "filter.skin": "Skin Care",
      "filter.body": "Body Care",
      "atelier.eyebrow": "The Atelier",
      "atelier.title": "Crafted with reverence for nature.",
      "atelier.copy1": "Founded in Provence in 2018, Épure Botanique bridges age-old botanical wisdom with modern dermal and trichological science. We believe true hair and skin health starts with gentle, restorative plant nutrients.",
      "atelier.copy2": "Every treatment is freshly blended in small batches, avoiding silicones, heavy mineral waxes, synthetic fragrances, and aggressive detergents. Only bio-compatible active botanicals.",
      "atelier.signature": "— Camille & Julien Vaneau, founders",
      "stats.founded": "Founded in Provence",
      "stats.actives": "Active botanicals",
      "stats.natural": "Plant-origin ingredients",
      "stats.satisfaction": "Customer ritual satisfaction",
      "routine.eyebrow": "The Daily Ritual",
      "routine.title": "How to care for scalp, hair & skin.",
      "routine.copy": "Simple mindful steps create resilient shine, balanced moisture, and a fortified skin barrier.",
      "routine.step1Title": "Purify & Tone",
      "routine.step1Copy": "Cleanse skin and scalp with gentle plant-derived micellar bases to respect the natural barrier.",
      "routine.step2Title": "Infuse Botanical Hydration",
      "routine.step2Copy": "Mist floral hydrosols or apply bio-fermented hyaluronic acid while the epidermis is receptive.",
      "routine.step3Title": "Target & Restore",
      "routine.step3Copy": "Apply rich ceramide creams or hair bond repairing masks to nourish deep cellular layers.",
      "routine.step4Title": "Seal with Elixir",
      "routine.step4Copy": "Lock in hydration with 2–3 drops of golden cold-pressed oil on face, hair lengths, and scalp.",
      "reviews.eyebrow": "Client Testimonials",
      "reviews.title": "Loved for transformational results.",
      "reviews.quote1": "“The Élixir Botanique completely transformed my dry hair ends and soothed my sensitive scalp in two weeks. A true staple!”",
      "reviews.quote2": "“Crème Céleste gave my skin that dewy, rested finish without feeling greasy. The texture is pure poetry.”",
      "reviews.quote3": "“Finally a clean hair and skin brand that smells incredible naturally and works better than luxury department store brands.”",
      "faq.eyebrow": "Client Care",
      "faq.title": "Frequently Asked Questions",
      "cta.eyebrow": "The Botanical Club",
      "cta.title": "Join our inner circle.",
      "cta.copy": "Receive early access to seasonal harvests, tailored hair & skin guides, and 10% off your first order.",
      "cta.email": "Your email address",
      "cta.subscribe": "Subscribe",
      "cta.consent": "I agree to the <a href=\"privacy.html\">privacy policy</a> and consent to receive emails.",
      "cta.note": "No spam. Unsubscribe anytime.",
      "product.add": "Add to bag",
      "cart.title": "Your Care Bag",
      "cart.empty": "Your bag is empty. Explore our botanical treatments.",
      "cart.total": "Total",
      "cart.checkout": "Order via WhatsApp",
      "cart.note": "We will finalize your order directly in WhatsApp.",
      "cart.close": "Close shopping bag",
      "footer.description": "Atelier de soins botaniques crafting clean, restorative treatments for hair and skin. Provence, France.",
      "footer.location": "Aix-en-Provence, France",
      "footer.whatsapp": "Order & Consult on WhatsApp",
      "footer.shop": "Treatments",
      "footer.hair": "Hair Care",
      "footer.skin": "Skin Care",
      "footer.body": "Body Care",
      "footer.atelier": "Atelier",
      "footer.story": "Our Story",
      "footer.ingredients": "Botanical Sourcing",
      "footer.sustainability": "Refills & Eco-Glass",
      "footer.care": "Customer Care",
      "footer.shipping": "Shipping & Guarantee",
      "footer.returns": "Returns Policy",
      "footer.faq": "FAQ & Consultation"
    },
    fr: {
      "language.label": "Langue",
      "announcement.copy": "Huile botanique de voyage offerte dès 70 € d'achat — ",
      "announcement.link": "découvrir le rituel cheveux & peau",
      "nav.collection": "Soins",
      "nav.atelier": "L'Atelier",
      "nav.ingredients": "Ingrédients",
      "nav.routine": "Le Rituel",
      "nav.care": "Conseils & FAQ",
      "hero.eyebrow": "Atelier de soins botaniques · Provence — fondé en 2018",
      "hero.title": "Révélez votre <em>éclat naturel</em>.",
      "hero.lede": "Des soins botaniques d'exception pour cheveux et peau, formulés à base d'huiles végétales pressées à froid, de céramides végétales et d'actifs purs. Sains, ciblés et profondément réparateurs.",
      "hero.explore": "Découvrir les soins",
      "hero.story": "Notre philosophie",
      "hero.shipping": "Livraison offerte dès 70 €",
      "hero.returns": "Garantie sérénité 30 jours",
      "marquee.botanical": "100 % Botanique Pressé à Froid",
      "marquee.clean": "Sans Sulfates ni Silicones",
      "marquee.cruelty": "Certifié Cruelty-Free",
      "marquee.refillable": "Verre Recyclable & Recharges",
      "marquee.dermatologist": "Testé Sous Contrôle Dermatologique",
      "collection.eyebrow": "Les Formulations",
      "collection.title": "L'essentiel pour les cheveux et la peau.",
      "collection.copy": "Chaque formule respecte le pH physiologique du cuir chevelu et de l'épiderme, gorgée d'actifs botaniques concentrés.",
      "filter.all": "Tous les soins",
      "filter.hair": "Soins Cheveux",
      "filter.skin": "Soins Visage",
      "filter.body": "Soins Corps",
      "atelier.eyebrow": "L'Atelier",
      "atelier.title": "Créé dans le plus grand respect du vivant.",
      "atelier.copy1": "Fondée en Provence en 2018, Épure Botanique associe le savoir végétal traditionnel aux découvertes dermo-cosmétiques modernes. Nous croyons qu'une peau et des cheveux éclatants naissent de nutriments purs et bienveillants.",
      "atelier.copy2": "Chaque soin est élaboré en séries limitées, sans silicones, sans dérivés pétrochimiques, sans parfums synthétiques ni détergents agressifs. Uniquement des actifs botaniques biocompatibles.",
      "atelier.signature": "— Camille & Julien Vaneau, fondateurs",
      "stats.founded": "Fondé en Provence",
      "stats.actives": "Actifs botaniques purs",
      "stats.natural": "Ingrédients d'origine végétale",
      "stats.satisfaction": "Satisfaction rituel clients",
      "routine.eyebrow": "Le Rituel Quotidien",
      "routine.title": "Comment choyer cheveux & peau.",
      "routine.copy": "Des gestes simples et conscients pour une fibre fortifiée, une brillance durable et une barrière cutanée saine.",
      "routine.step1Title": "Purifier & Tonifier",
      "routine.step1Copy": "Nettoyez la peau et le cuir chevelu avec des bases lavantes végétales douces qui préservent la barrière protectrice.",
      "routine.step2Title": "Infuser l'Hydratation",
      "routine.step2Copy": "Vaporisez un hydrolat floral ou appliquez un sérum hyaluronique végétal sur une peau encore fraîche.",
      "routine.step3Title": "Cibler & Réparer",
      "routine.step3Copy": "Appliquez une crème aux céramides ou un masque réparateur pour nourrir intensément la fibre.",
      "routine.step4Title": "Sceller avec l'Élixir",
      "routine.step4Copy": "Verrouillez l'hydratation avec 2 à 3 gouttes d'huile végétale dorée sur le visage et les pointes.",
      "reviews.eyebrow": "Avis de notre communauté",
      "reviews.title": "Reconnu pour des bienfaits visibles.",
      "reviews.quote1": "« L’Élixir Botanique a métamorphosé mes pointes abîmées et apaisé mon cuir chevelu en deux semaines. Un indispensable ! »",
      "reviews.quote2": "« La Crème Céleste illumine mon teint sans laisser de film gras. Une sensation de confort absolue toute la journée. »",
      "reviews.quote3": "« Enfin une marque de soins propres qui sent bon naturellement et donne de meilleurs résultats que les grands soins de luxe. »",
      "faq.eyebrow": "Conseils & Soins",
      "faq.title": "Questions Fréquentes",
      "cta.eyebrow": "Le Club Botanique",
      "cta.title": "Rejoignez notre cercle intime.",
      "cta.copy": "Bénéficiez d'un accès privilégié aux nouvelles récoltes, de guides beauté sur mesure et de 10 % sur votre première commande.",
      "cta.email": "Votre adresse e-mail",
      "cta.subscribe": "S’inscrire",
      "cta.consent": "J’accepte la <a href=\"privacy.html\">politique de confidentialité</a> et de recevoir les e-mails.",
      "cta.note": "Aucun spam. Désinscription à tout moment.",
      "product.add": "Ajouter au sac",
      "cart.title": "Votre Sac de Soins",
      "cart.empty": "Votre panier est vide. Découvrez nos soins botaniques.",
      "cart.total": "Total",
      "cart.checkout": "Commander sur WhatsApp",
      "cart.note": "Nous préparons les détails de votre commande directement sur WhatsApp.",
      "cart.close": "Fermer le panier",
      "footer.description": "Atelier de soins botaniques formulant des rituels purs et bienfaisants pour les cheveux et la peau. Provence, France.",
      "footer.location": "Aix-en-Provence, France",
      "footer.whatsapp": "Conseils & Commande WhatsApp",
      "footer.shop": "Soins",
      "footer.hair": "Cheveux",
      "footer.skin": "Visage",
      "footer.body": "Corps",
      "footer.atelier": "L'Atelier",
      "footer.story": "Notre Histoire",
      "footer.ingredients": "Nos Plantes",
      "footer.sustainability": "Flacons & Recharges",
      "footer.care": "Service Client",
      "footer.shipping": "Livraison & Retours",
      "footer.returns": "Garantie 30 Jours",
      "footer.faq": "FAQ & Diagnostics"
    },
    ar: {
      "language.label": "اللغة",
      "announcement.copy": "زيت نباتي فاخر بحجم السفر مجاناً عند الشراء بأكثر من 70 يورو — ",
      "announcement.link": "اكتشفي روتين العناية بالشعر والبشرة",
      "nav.collection": "المستحضرات",
      "nav.atelier": "المختبر",
      "nav.ingredients": "المكونات",
      "nav.routine": "الروتين",
      "nav.care": "العناية والأسئلة",
      "hero.eyebrow": "مختبر العناية النباتية · بروفانس — تأسس عام 2018",
      "hero.title": "استعيدي <em>نضارتك الطبيعية</em>.",
      "hero.lede": "عناية نباتية متقدمة وفائقة النقاء للشعر والبشرة، معززة بزيوت معصورة على البارد وسيراميدات نباتية نشطة. نقاء استثنائي وترميم عميق.",
      "hero.explore": "تصفح المنتجات",
      "hero.story": "فلسفتنا",
      "hero.shipping": "شحن مجاني للطلبات فوق 70 يورو",
      "hero.returns": "ضمان استرجاع هادئ لمدة 30 يوماً",
      "marquee.botanical": "100% مستخلصات نباتية معصورة على البارد",
      "marquee.clean": "خالٍ من الكبريتات والسيليكون",
      "marquee.cruelty": "معتمد وخالٍ من القسوة على الحيوانات",
      "marquee.refillable": "زجاج معاد تدويره وعبوات إعادة التعبئة",
      "marquee.dermatologist": "مختبر جلدياً وتحت إشراف الخبراء",
      "collection.eyebrow": "التراكيب الطبيعية",
      "collection.title": "أساسيات العناية المتكاملة بالشعر والبشرة.",
      "collection.copy": "تركيبات متوازنة بدقة لتلائم درجة الحموضة الطبيعية للبشرة وفروة الرأس وغنية بمضادات الأكسدة الفعالة.",
      "filter.all": "جميع المنتجات",
      "filter.hair": "عناية الشعر",
      "filter.skin": "عناية البشرة",
      "filter.body": "عناية الجسم",
      "atelier.eyebrow": "المختبر النباتي",
      "atelier.title": "صُنعت بانسجام تام مع الطبيعة.",
      "atelier.copy1": "تأسست إيبور بوتانيك في بروفانس عام 2018 لتمزج بين أسرار الأعشاب العريقة وأحدث علوم خلايا البشرة والشعر، مؤمنين بأن الجمال المستدام ينبع من تغذية نقية وصادقة.",
      "atelier.copy2": "تُحضر منتجاتنا بكميات صغيرة ومدروسة، دون أي سيليكون أو بارابين أو عطور اصطناعية أو مواد كيميائية حادة.",
      "atelier.signature": "— كاميل وجوليان فانو، المؤسسان",
      "stats.founded": "تأسست في بروفانس",
      "stats.actives": "مكونات نباتية نشطة",
      "stats.natural": "مكونات طبيعية المصدر",
      "stats.satisfaction": "نسبة رضا العملاء عن الروتين",
      "routine.eyebrow": "الروتين اليومي",
      "routine.title": "كيف تعتنين بشعرك وبشرتك.",
      "routine.copy": "خطوات مدروسة وبسيطة تمنحك لمعاناً حيوياً وترطيباً عميقاً يحمي حاجز البشرة.",
      "routine.step1Title": "التنقية والتنعيم",
      "routine.step1Copy": "تنظيف لطيف بالخلاصات الميسيلارية النباتية لا يجرد البشرة أو فروة الرأس من الزيوت الوقائية الطبيعية.",
      "routine.step2Title": "إمداد الترطيب النباتي",
      "routine.step2Copy": "رش ماء الورد النقي أو توزيع قطرات حمض الهيالورونيك النباتي عندما تكون المسام مهيأة للامتصاص.",
      "routine.step3Title": "العلاج والترميم",
      "routine.step3Copy": "استخدام كريم السيراميد الغني أو ماسك إصلاح روابط الشعر لتغذية ألياف الشعر وخلايا البشرة بعمق.",
      "routine.step4Title": "حماية وحبس الترطيب بالإكسير",
      "routine.step4Copy": "تثبيت الرطوبة بقطرتين أو ثلاث من الزيت الذهبي المعصور على الوجه، أطراف الشعر، وفروة الرأس.",
      "reviews.eyebrow": "آراء وتجارب العملاء",
      "reviews.title": "نتائج ملموسة نالت إعجاب الجميع.",
      "reviews.quote1": "«إكسير الشعر النباتي أحدث فارقاً حقيقياً في أطراف شعري المتقصفة وهدأ فروة رأسي خلال أسبوعين فقط. مستحضر مذهل!»",
      "reviews.quote2": "«كريم سيليست منح بشرتي نضارة ورطوبة مخملية فائقة دون أدنى ملمس دهني مزعج. أفضل كريم جربته.»",
      "reviews.quote3": "«أخيراً منتجات عناية نظيفة وصحية برائحة الأعشاب الطبيعية الفاخرة ونتائج تتفوق على أفخم الماركات العالمية.»",
      "faq.eyebrow": "العناية والاستفسارات",
      "faq.title": "الأسئلة الشائعة",
      "cta.eyebrow": "نادي النباتات الطبيعية",
      "cta.title": "انضمي إلى مجتمعنا الخاص.",
      "cta.copy": "احصلي على أسبقية طلب التراكيب الجديدة، إرشادات عناية خاصة، وخصم 10% على طلبك الأول.",
      "cta.email": "بريدك الإلكتروني",
      "cta.subscribe": "اشتراك",
      "cta.consent": "أوافق على <a href=\"privacy.html\">سياسة الخصوصية</a> واستقبال رسائل العناية.",
      "cta.note": "لا نرسل رسائل مزعجة إطلاقاً. يمكنك إلغاء الاشتراك في أي وقت.",
      "product.add": "إضافة إلى السلة",
      "cart.title": "حقيبة العناية الخاصة بك",
      "cart.empty": "حقيبتك فارغة. تصفحي مستحضراتنا النباتية.",
      "cart.total": "المجموع",
      "cart.checkout": "طلب عبر واتساب",
      "cart.note": "سيتم تجهيز تفاصيل طلبك مباشرة في محادثة واتساب.",
      "cart.close": "إغلاق الحقيبة",
      "footer.description": "مختبر عناية نباتية متخصص في تحضير مستحضرات استثنائية ونظيفة للشعر والبشرة. بروفانس، فرنسا.",
      "footer.location": "إيكس أون بروفانس، فرنسا",
      "footer.whatsapp": "استشارة وطلب عبر واتساب",
      "footer.shop": "المستحضرات",
      "footer.hair": "عناية الشعر",
      "footer.skin": "عناية البشرة",
      "footer.body": "عناية الجسم",
      "footer.atelier": "المختبر",
      "footer.story": "قصتنا",
      "footer.ingredients": "مصادر الأعشاب",
      "footer.sustainability": "العبوات وإعادة التعبئة",
      "footer.care": "خدمة العملاء",
      "footer.shipping": "الشحن والضمان",
      "footer.returns": "سياسة الاستبدال",
      "footer.faq": "الأسئلة والتشخيص"
    }
  };
  Object.assign(translations.en, {"discovery.search":"Search treatments","discovery.sort":"Sort treatments","discovery.featured":"Featured","discovery.low":"Price: low to high","discovery.high":"Price: high to low","discovery.rating":"Top rated","discovery.found":"treatments found","cart.free":"Free delivery unlocked","cart.remaining":"Add €{amount} for free delivery"});
  Object.assign(translations.fr, {"discovery.search":"Rechercher un soin","discovery.sort":"Trier les soins","discovery.featured":"À la une","discovery.low":"Prix croissant","discovery.high":"Prix décroissant","discovery.rating":"Mieux notés","discovery.found":"soins trouvés","cart.free":"Livraison offerte débloquée","cart.remaining":"Ajoutez {amount} € pour la livraison offerte"});
  Object.assign(translations.ar, {"discovery.search":"ابحث عن مستحضر","discovery.sort":"ترتيب المستحضرات","discovery.featured":"مميّزة","discovery.low":"السعر: من الأقل","discovery.high":"السعر: من الأعلى","discovery.rating":"الأعلى تقييماً","discovery.found":"مستحضرات","cart.free":"تم تفعيل التوصيل المجاني","cart.remaining":"أضف {amount} € للحصول على التوصيل المجاني"});

  function applyLanguage(lang) {
    currentLanguage = translations[lang] ? lang : "en";
    const dict = translations[currentLanguage];
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) {
        el.setAttribute("placeholder", dict[key]);
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-aria");
      if (dict[key]) {
        el.setAttribute("aria-label", dict[key]);
      }
    });

    if (languageSelect) {
      languageSelect.value = currentLanguage;
    }
    const search = document.querySelector("[data-product-search]");
    if (search) search.placeholder = dict["discovery.search"];
    const sort = document.querySelector("[data-product-sort]");
    if (sort) {
      sort.setAttribute("aria-label", dict["discovery.sort"]);
      Array.from(sort.options).forEach(function (option) {
        const key = option.value === "price-low" ? "discovery.low" : option.value === "price-high" ? "discovery.high" : option.value === "rating" ? "discovery.rating" : "discovery.featured";
        option.textContent = dict[key];
      });
    }

    try {
      localStorage.setItem("epure_lang", currentLanguage);
    } catch (e) {}

    renderCart();
    if (typeof updateProducts === "function") updateProducts();
  }

  if (languageSelect) {
    languageSelect.addEventListener("change", function (e) {
      applyLanguage(e.target.value);
    });
  }

  /* -- Header state & Mobile Menu ------------------------------------------ */
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");

  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.querySelectorAll("a").forEach(a => a.removeAttribute("aria-current"));
        link.setAttribute("aria-current", "true");
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -- Marquee pause/play -------------------------------------------------- */
  const marqueeToggle = document.querySelector("[data-marquee-toggle]");
  const marqueeTrack = document.querySelector(".marquee-track");
  if (marqueeToggle && marqueeTrack) {
    marqueeToggle.addEventListener("click", function () {
      const isPaused = marqueeTrack.style.animationPlayState === "paused";
      marqueeTrack.style.animationPlayState = isPaused ? "running" : "paused";
      marqueeToggle.setAttribute("aria-pressed", isPaused ? "false" : "true");
      marqueeToggle.textContent = isPaused ? "Pause" : "Play";
    });
  }

  /* -- Product Category Filter --------------------------------------------- */
  const filterButtons = document.querySelectorAll("[data-filter]");
  const productGrid = document.querySelector(".collection-grid");
  const productSearch = document.querySelector("[data-product-search]");
  const productSort = document.querySelector("[data-product-sort]");
  const concernFilter = document.querySelector("[data-concern-filter]");
  const resultSummary = document.querySelector("[data-result-summary]");
  const emptyState = document.querySelector("[data-empty-state]");
  const catalog = Array.isArray(window.EPURE_PRODUCTS) ? window.EPURE_PRODUCTS : [];
  let activeFilter = "all";
  let activeConcern = "all";

  function cardMarkup(p) {
    return `<article class="card" data-reveal data-product-id="${p.id}" data-category="${p.category}">
      <div class="card-visual">${p.tag ? `<span class="tag ${p.tagGold ? "tag--gold" : ""}">${p.tag}</span>` : ""}<svg class="bottle" style="--liquid:${p.liquid}" aria-hidden="true"><use href="#flacon-care"></use></svg></div>
      <div class="card-body"><div class="card-meta"><p class="card-family">${p.family}</p><span class="card-size">${p.size || ""}</span></div>
      <button class="card-title" type="button" data-product-view="${p.id}" aria-label="View details for ${p.name}"><h3>${p.name}</h3></button><p class="card-note">${p.notes}</p>
      <div class="card-foot"><span class="price">${p.currencySymbol || "€"}${p.price}</span><button class="add-btn" type="button" data-add="${p.name}" aria-label="Add ${p.name} to bag" data-add-id="${p.id}" data-add-price="${p.price}" data-add-currency="${p.currencySymbol || "€"}"><span data-i18n="product.add">Add to bag</span></button></div></div></article>`;
  }
  if (productGrid && !productGrid.querySelector(".card") && catalog.length) productGrid.innerHTML = catalog.map(cardMarkup).join("");
  function updateProducts() {
    if (!productGrid) return;
    const query = (productSearch && productSearch.value || "").toLowerCase().trim();
    const sort = productSort && productSort.value;
    const cards = Array.from(productGrid.querySelectorAll(".card"));
    const visible = cards.filter(function (card) {
      const p = catalog.find(item => item.id === card.dataset.productId) || {};
      const text = (card.textContent + " " + (p.concerns || []).join(" ")).toLowerCase();
      return (activeFilter === "all" || card.dataset.category === activeFilter) && (activeConcern === "all" || (p.concerns || []).indexOf(activeConcern) !== -1) && (!query || text.indexOf(query) !== -1);
    });
    visible.sort(function (a, b) {
      const pa = catalog.find(item => item.id === a.dataset.productId) || {}, pb = catalog.find(item => item.id === b.dataset.productId) || {};
      if (sort === "price-low") return pa.price - pb.price;
      if (sort === "price-high") return pb.price - pa.price;
      if (sort === "rating") return (pb.rating || 0) - (pa.rating || 0);
      return 0;
    });
    cards.forEach(card => { card.hidden = visible.indexOf(card) === -1; });
    visible.forEach(card => productGrid.appendChild(card));
    if (resultSummary) resultSummary.textContent = `${visible.length} ${translations[currentLanguage]["discovery.found"]}`;
    if (emptyState) emptyState.hidden = visible.length !== 0;
  }
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
    filterButtons.forEach(function (button) {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
      const targetCategory = btn.getAttribute("data-filter");
      activeFilter = targetCategory;
      updateProducts();
    });
  });
  if (productSearch) productSearch.addEventListener("input", updateProducts);
  if (productSort) productSort.addEventListener("change", updateProducts);
  if (concernFilter) concernFilter.addEventListener("change", function () { activeConcern = concernFilter.value; updateProducts(); });
  const clearProducts = document.querySelector("[data-clear-products]");
  if (clearProducts) clearProducts.addEventListener("click", function () { activeFilter = "all"; activeConcern = "all"; if (productSearch) productSearch.value = ""; if (concernFilter) concernFilter.value = "all"; filterButtons[0] && filterButtons[0].click(); updateProducts(); });
  updateProducts();

  /* -- Product detail modal ----------------------------------------------- */
  const productModal = document.querySelector("[data-product-modal]");
  const productBackdrop = document.querySelector("[data-product-backdrop]");
  const productDetail = document.querySelector("[data-product-detail]");
  const productClose = document.querySelector("[data-product-close]");
  function closeProduct() { if (!productModal) return; productModal.hidden = true; productBackdrop.hidden = true; document.body.classList.remove("modal-is-open"); }
  function openProduct(id) {
    const p = catalog.find(item => item.id === id); if (!p || !productModal) return;
    productDetail.innerHTML = `<p class="eyebrow">${p.family}</p><h2 id="product-modal-title">${p.name}</h2><p class="modal-rating"><span class="stars">★★★★★</span> ${p.rating || "—"} (${p.reviews || 0} reviews)</p><p class="modal-price">${p.currencySymbol || "€"}${p.price} · ${p.size || ""}</p>
      <div class="detail-sections"><section><h3>Benefits</h3><p>${p.benefits || p.notes}</p></section><section><h3>Full ingredients</h3><p>${p.ingredients || p.notes}</p></section><section><h3>How to use</h3><p>${p.howToUse || "Apply as part of your ritual."}</p></section><section><h3>Suitability & warnings</h3><p>${p.suitability || "Suitable for everyday use."}</p><p class="warning">${p.warnings || "Patch test before use."}</p></section><section><h3>Shipping & returns</h3><p>${p.shipping || "Ships in 2–4 business days."} ${p.returns || "30-day returns on unopened items."}</p></section></div>
      <div class="detail-actions"><button class="btn btn--primary" type="button" data-add="${p.name}" data-add-id="${p.id}" data-add-price="${p.price}">Add to bag</button></div>`;
    productModal.hidden = false; productBackdrop.hidden = false; document.body.classList.add("modal-is-open"); productClose.focus();
  }
  document.addEventListener("click", function (e) { const view = e.target.closest("[data-product-view]"); if (view) openProduct(view.dataset.productView); });
  if (productClose) productClose.addEventListener("click", closeProduct);
  if (productBackdrop) productBackdrop.addEventListener("click", closeProduct);

  /* -- Routine Tabs -------------------------------------------------------- */
  const routineTabs = document.querySelectorAll("[role='tab']");
  routineTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      routineTabs.forEach(function (t) {
        t.setAttribute("aria-selected", "false");
        t.setAttribute("tabindex", "-1");
      });
      tab.setAttribute("aria-selected", "true");
      tab.removeAttribute("tabindex");

      const targetId = tab.getAttribute("aria-controls");
      document.querySelectorAll("[role='tabpanel']").forEach(function (panel) {
        if (panel.id === targetId) {
          panel.removeAttribute("hidden");
        } else {
          panel.setAttribute("hidden", "true");
        }
      });
    });
  });

  /* -- Toast notifications ------------------------------------------------- */
  const toastEl = document.querySelector("[data-toast]");
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 2800);
  }

  /* -- Shopping Bag / Cart Drawer ------------------------------------------ */
  const bagButton = document.querySelector(".bag-button");
  const bagCountEl = document.querySelector("[data-bag-count]");
  const cartDrawer = document.querySelector("[data-cart-drawer]");
  const cartBackdrop = document.querySelector("[data-cart-backdrop]");
  const cartClose = document.querySelector("[data-cart-close]");
  const cartItemsEl = document.querySelector("[data-cart-items]");
  const cartEmptyEl = document.querySelector("[data-cart-empty]");
  const cartTotalEl = document.querySelector("[data-cart-total]");
  const cartCheckoutBtn = document.querySelector("[data-cart-checkout]");

  let cart = [];
  try {
    const saved = localStorage.getItem("epure_cart");
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  function saveCart() {
    try {
      localStorage.setItem("epure_cart", JSON.stringify(cart));
    } catch (e) {}
  }

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.removeAttribute("hidden");
    if (cartBackdrop) cartBackdrop.removeAttribute("hidden");
    setTimeout(() => cartDrawer.classList.add("is-open"), 10);
    if (bagButton) bagButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("cart-is-open");
    if (cartClose) cartClose.focus();
  }

  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove("is-open");
    setTimeout(() => {
      cartDrawer.setAttribute("hidden", "true");
      if (cartBackdrop) cartBackdrop.setAttribute("hidden", "true");
    }, 260);
    if (bagButton) bagButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("cart-is-open");
    if (bagButton) bagButton.focus();
  }

  if (bagButton) bagButton.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);

  function renderCart() {
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    if (bagCountEl) bagCountEl.textContent = totalCount;
    if (bagCountEl) bagCountEl.classList.toggle("is-visible", totalCount > 0);
    if (bagButton) bagButton.setAttribute("aria-label", `${currentLanguage === "ar" ? "حقيبة التسوق" : currentLanguage === "fr" ? "Sac de courses" : "Shopping bag"}, ${totalCount} ${currentLanguage === "fr" ? "articles" : currentLanguage === "ar" ? "عنصر" : "items"}`);

    const totalSum = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    if (cartTotalEl) cartTotalEl.textContent = `€${totalSum.toFixed(2)}`;
    const progress = document.querySelector("[data-shipping-progress]");
    if (progress) {
      const copy = translations[currentLanguage];
      progress.textContent = totalSum >= 70 ? copy["cart.free"] : copy["cart.remaining"].replace("{amount}", (70 - totalSum).toFixed(2));
    }

    if (cartCheckoutBtn) {
      cartCheckoutBtn.disabled = cart.length === 0;
    }

    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
      if (cartEmptyEl) cartEmptyEl.style.display = "block";
      return;
    }

    if (cartEmptyEl) cartEmptyEl.style.display = "none";

    cart.forEach(function (item, index) {
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="cart-item-price">€${item.price.toFixed(2)} each · <strong>€${(item.price * item.qty).toFixed(2)}</strong></span>
        </div>
        <div class="cart-item-controls">
          <button type="button" class="qty-btn" data-dec="${index}" aria-label="Decrease quantity">−</button>
          <span class="qty-num" aria-live="polite">${item.qty}</span>
          <button type="button" class="qty-btn" data-inc="${index}" aria-label="Increase quantity">+</button>
          <button type="button" class="del-btn" data-del="${index}" aria-label="Remove item">Remove</button>
        </div>
      `;
      cartItemsEl.appendChild(el);
    });

    cartItemsEl.querySelectorAll("[data-inc]").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = parseInt(btn.getAttribute("data-inc"), 10);
        cart[idx].qty += 1;
        saveCart();
        renderCart();
      });
    });

    cartItemsEl.querySelectorAll("[data-dec]").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = parseInt(btn.getAttribute("data-dec"), 10);
        if (cart[idx].qty > 1) {
          cart[idx].qty -= 1;
        } else {
          cart.splice(idx, 1);
        }
        saveCart();
        renderCart();
      });
    });

    cartItemsEl.querySelectorAll("[data-del]").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = parseInt(btn.getAttribute("data-del"), 10);
        cart.splice(idx, 1);
        saveCart();
        renderCart();
      });
    });
  }

  // Add to Bag buttons
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const id = btn.getAttribute("data-add-id");
    const name = btn.getAttribute("data-add");
    const price = parseFloat(btn.getAttribute("data-add-price") || "0");

    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    saveCart();
    renderCart();
    showToast(`${name} added to your care bag`);
    track("add_to_bag", { product: name });
    openCart();
  });

  // WhatsApp Checkout: collect customer details before handing off
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener("click", function () {
      if (cart.length === 0) return;
      const orderModal = document.querySelector("[data-order-modal]");
      const orderBackdrop = document.querySelector("[data-order-backdrop]");
      if (orderModal && orderBackdrop) {
        orderModal.hidden = false; orderBackdrop.hidden = false; document.body.classList.add("modal-is-open");
        const first = orderModal.querySelector("input"); if (first) first.focus();
        return;
      }
      sendWhatsApp({});
    });
  }
  function sendWhatsApp(customer) {
      if (cart.length === 0) return;
      const totalSum = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
      let itemsList = cart.map(i => `• ${i.name} (x${i.qty}) — €${(i.price * i.qty).toFixed(2)}`).join("%0A");

      let greeting = "Hello Épure Botanique, I would like to place an order for:";
      if (currentLanguage === "fr") {
        greeting = "Bonjour Épure Botanique, je souhaite commander les soins suivants :";
      } else if (currentLanguage === "ar") {
        greeting = "مرحباً إيبور بوتانيك، أود إتمام طلب مستحضرات العناية التالية:";
      }

      const totalLabel = currentLanguage === "ar" ? "المجموع الكلي" : "Total";
      const customerLine = customer.name ? `%0A%0AName: ${encodeURIComponent(customer.name)}%0AEmail: ${encodeURIComponent(customer.email)}%0ADelivery: ${encodeURIComponent(customer.address)}%0ANote: ${encodeURIComponent(customer.note || "")}` : "";
      const message = `${encodeURIComponent(greeting)}%0A%0A${itemsList}%0A%0A*${totalLabel}: €${totalSum.toFixed(2)}*${customerLine}%0A%0AThank you!`;
      const phone = "212645905882";
      const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

      track("cta_click", { label: "whatsapp_checkout" });
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }
  const orderModal = document.querySelector("[data-order-modal]");
  const orderBackdrop = document.querySelector("[data-order-backdrop]");
  const orderForm = document.querySelector("[data-order-form]");
  function closeOrder() { if (orderModal) orderModal.hidden = true; if (orderBackdrop) orderBackdrop.hidden = true; document.body.classList.remove("modal-is-open"); }
  const orderClose = document.querySelector("[data-order-close]");
  if (orderClose) orderClose.addEventListener("click", closeOrder);
  if (orderBackdrop) orderBackdrop.addEventListener("click", closeOrder);
  if (orderForm) orderForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!orderForm.checkValidity()) { orderForm.reportValidity(); return; }
      const data = Object.fromEntries(new FormData(orderForm).entries());
      closeOrder(); closeCart(); sendWhatsApp(data);
    });
  document.addEventListener("keydown", function (e) {
    const activeDialog = productModal && !productModal.hidden ? productModal :
      orderModal && !orderModal.hidden ? orderModal :
      cartDrawer && !cartDrawer.hidden ? cartDrawer : null;
    if (e.key === "Tab" && activeDialog) {
      const focusable = activeDialog.querySelectorAll("button:not([disabled]), a[href], input, select, textarea");
      if (focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    if (e.key !== "Escape") return;
    if (productModal && !productModal.hidden) { closeProduct(); if (productClose) productClose.focus(); return; }
    if (orderModal && !orderModal.hidden) { closeOrder(); if (cartCheckoutBtn) cartCheckoutBtn.focus(); return; }
    if (cartDrawer && !cartDrawer.hidden) { closeCart(); return; }
    if (navLinks && navLinks.classList.contains("is-open")) {
      navLinks.classList.remove("is-open"); menuToggle && menuToggle.setAttribute("aria-expanded", "false"); menuToggle && menuToggle.focus();
    }
  });

  /* -- Newsletter Form ----------------------------------------------------- */
  const newsletterForm = document.querySelector("[data-newsletter]");
  const formError = document.querySelector("[data-error]");
  const successBox = document.querySelector("[data-success]");
  const confirmLink = document.querySelector("[data-confirm-link]");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (formError) formError.textContent = "";

      const emailInput = newsletterForm.querySelector("input[name='email']");
      const consentBox = newsletterForm.querySelector("input[name='consent']");
      const hpField = newsletterForm.querySelector("input[name='website']");

      if (!emailInput.value || !consentBox.checked) {
        if (formError) formError.textContent = "Please provide an email and consent to privacy terms.";
        return;
      }

      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailInput.value,
            consent: consentBox.checked,
            website: hpField ? hpField.value : ""
          })
        });
        const data = await res.json();
        if (data.ok) {
          newsletterForm.style.display = "none";
          if (successBox) successBox.style.display = "block";
          if (data.confirmation_url && confirmLink) {
            confirmLink.href = data.confirmation_url;
            confirmLink.removeAttribute("hidden");
          }
          track("newsletter_subscribe", { label: "footer_club" });
        } else {
          if (formError) formError.textContent = data.error || "Subscription failed.";
        }
      } catch (err) {
        if (formError) formError.textContent = "Network error. Please try again later.";
      }
    });
  }

  /* -- Reveal on scroll ---------------------------------------------------- */
  const revealElements = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("is-visible"));
  }

  // Update dynamic year
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Restore preferred language
  const savedLang = localStorage.getItem("epure_lang");
  if (savedLang) {
    applyLanguage(savedLang);
  } else {
    applyLanguage("en");
  }

  renderCart();
})();
