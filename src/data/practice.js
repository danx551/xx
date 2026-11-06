import { topics } from "./curriculum.js";
const fmt = (n) =>
  new Intl.NumberFormat("fr-FR", { maximumSignificantDigits: 5 }).format(n);
const numeric = (question, value, unit, steps) => ({
  question,
  value,
  unit,
  steps,
});
const written = (question, steps) => ({ question, steps, unit: null });
const builders = {
  concentration: (n) => {
    const c = 0.02 + n * 0.01,
      V = 0.1,
      m = c * V * 58.5;
    return n < 2
      ? numeric(
          `Préparer ${V * 1000} mL de NaCl à ${fmt(c)} mol·L⁻¹. M = 58,5 g·mol⁻¹. Quelle masse peser ?`,
          m,
          "g",
          [
            `Convertir V = ${V} L.`,
            `n = cV = ${fmt(c * V)} mol.`,
            `m = nM = ${fmt(m)} g.`,
            `Peser, dissoudre dans un peu d’eau, transférer quantitativement dans la fiole jaugée de 100,0 mL, rincer et compléter au trait.`,
          ],
        )
      : numeric(
          `Un capteur exige 100,0 mL d’une solution à ${fmt(c)} mol·L⁻¹. Le stock est à 1,00 mol·L⁻¹. Quel volume de stock faut-il prélever ?`,
          c * 100,
          "mL",
          [
            `La quantité de soluté se conserve : cmVm = cfVf.`,
            `Vm = cfVf/cm = ${fmt(c)}×100/1 = ${fmt(c * 100)} mL.`,
            `Utiliser une pipette graduée adaptée si ce volume n’est pas disponible en pipette jaugée. Compléter à 100,0 mL, et non ajouter 100 mL d’eau.`,
          ],
        );
  },
  beer: (n) => {
    const A = 0.3 + 0.15 * n,
      F = n > 1 ? 20 : 1;
    return numeric(
      `Une solution ${n > 1 ? "d’encre diluée 20 fois" : "étalon"} a une absorbance A = ${fmt(A)}. ε = 50000 L·mol⁻¹·cm⁻¹, ℓ = 1,0 cm. Déterminer la concentration ${n > 1 ? "avant dilution" : "mesurée"} en µmol·L⁻¹.`,
      (A / 50000) * 1e6 * F,
      "µmol·L⁻¹",
      [
        `Beer-Lambert est applicable à la solution diluée dans la gamme linéaire : A = εℓc.`,
        `cmesurée = A/(εℓ) = ${fmt(A / 50000)} mol·L⁻¹.`,
        `cinitiale = ${F} × cmesurée = ${fmt((A / 50000) * F)} mol·L⁻¹.`,
        `Multiplier par 10⁶ pour exprimer en µmol·L⁻¹ : ${fmt((A / 50000) * 1e6 * F)}.`,
      ],
    );
  },
  conductivity: (n) => {
    const c = 1 + n,
      lambda = 0.01264;
    return n < 2
      ? numeric(
          `NaCl est dissous à ${c} mmol·L⁻¹. λNa = 5,01×10⁻³ et λCl = 7,63×10⁻³ S·m²·mol⁻¹. Calculer σ en mS·m⁻¹.`,
          c * lambda * 1000,
          "mS·m⁻¹",
          [
            `NaCl → Na⁺ + Cl⁻ : chaque ion est à ${c} mol·m⁻³.`,
            `σ = (λNa+λCl)c = 0,01264×${c} = ${fmt(c * lambda)} S·m⁻¹.`,
            `Donc σ = ${fmt(c * lambda * 1000)} mS·m⁻¹.`,
          ],
        )
      : numeric(
          `Un contrôle de saumure très diluée donne σ = ${fmt(c * lambda)} S·m⁻¹. Seul NaCl contribue. λNa+λCl = 0,01264 S·m²·mol⁻¹. Déterminer c en mmol·L⁻¹.`,
          c,
          "mmol·L⁻¹",
          [
            `σ = (λNa+λCl)c en unités SI.`,
            `c = σ/(λNa+λCl) = ${c} mol·m⁻³.`,
            `1 mol·m⁻³ = 1 mmol·L⁻¹ : c = ${c} mmol·L⁻¹.`,
          ],
        );
  },
  gas: (n) => {
    const V = 100 + 50 * n,
      T = 298.15,
      P = 101300,
      amount = (P * V * 1e-6) / (8.314 * T);
    return numeric(
      `Un gaz ${n === 3 ? "issu de la réaction 1:1 entre un acide et HCO₃⁻" : "recueilli dans une seringue"} occupe ${V} mL à 25 °C et 1013 hPa. R = 8,314 J·mol⁻¹·K⁻¹. Déterminer ${n === 3 ? "la quantité de HCO₃⁻ consommée" : "la quantité de gaz"} en mmol.`,
      amount * 1000,
      "mmol",
      [
        `P = 101300 Pa ; V = ${fmt(V * 1e-6)} m³ ; T = 298,15 K.`,
        `PV = nRT, donc n = PV/(RT) = ${fmt(amount)} mol.`,
        n === 3
          ? "La stœchiométrie 1:1 donne n(HCO₃⁻ consommé) = n(gaz)."
          : "Le modèle suppose un gaz peu dense loin de sa liquéfaction.",
        `Résultat : ${fmt(amount * 1000)} mmol.`,
      ],
    );
  },
  spectra: (n) =>
    written(
      [
        "Un spectre IR montre une bande large vers 3300 cm⁻¹ et aucune bande vers 1700 cm⁻¹. Choisir entre éthanol et acide éthanoïque. Justifier.",
        "Un spectre montre une bande forte vers 1710 cm⁻¹ et une très large bande entre 2500 et 3200 cm⁻¹. Quel groupe est suggéré ? Peut-on identifier à lui seul une molécule unique ?",
        "Deux produits ont une bande C=O vers 1720 cm⁻¹. Seul le produit A montre deux bandes fines vers 2750 et 2850 cm⁻¹. Proposer une distinction aldéhyde/cétone.",
        "Le spectre d’un produit brut a le même maximum UV-visible que le produit pur mais une absorption supplémentaire entre 400 et 500 nm. Peut-on affirmer qu’il est pur ?",
      ][n],
      [
        [
          "Le creux large est compatible avec O–H d’un alcool.",
          "L’acide éthanoïque devrait montrer une bande C=O forte, ici absente.",
          "Parmi les deux candidats, retenir l’éthanol ; la conclusion repose sur la comparaison aux bandes attendues.",
        ],
        [
          "La combinaison C=O et O–H très large est caractéristique d’un groupe carboxyle.",
          "Elle suggère un acide carboxylique.",
          "Plusieurs molécules peuvent posséder ce groupe : une identification unique exige d’autres données.",
        ],
        [
          "Les deux candidats contiennent un carbonyle.",
          "Les bandes supplémentaires du C–H aldéhydique orientent A vers l’aldéhyde.",
          "L’absence de ces bandes oriente l’autre vers la cétone, dans le cadre des candidats proposés et de la résolution du spectre.",
        ],
        [
          "Un maximum commun est compatible avec la présence du produit attendu.",
          "L’absorption supplémentaire suggère une ou plusieurs impuretés absorbantes, ou un effet de matrice à vérifier.",
          "Un spectre commun sur une seule région ne prouve jamais à lui seul la pureté.",
        ],
      ][n],
    ),
  titration: (n) => {
    const VE = 12 + n * 2,
      coef = n > 1 ? 2 : 1,
      F = n === 3 ? 10 : 1,
      result = ((0.1 * VE) / (20 * coef)) * F;
    return numeric(
      `On titre 20,0 mL ${n === 3 ? "d’une solution commerciale diluée dix fois" : "de solution"} par HO⁻ à 0,100 mol·L⁻¹. VE = ${VE},0 mL ${coef === 2 ? "à la seconde équivalence du diacide H₂A (H₂A+2HO⁻ → A²⁻+2H₂O)" : "pour AH+HO⁻ → A⁻+H₂O"}. Déterminer la concentration ${F > 1 ? "commerciale" : "titrée"}.`,
      result,
      "mol·L⁻¹",
      [
        `À cette équivalence, n(acide) = n(HO⁻)/${coef}.`,
        `c = cBVE/(${coef}VA) = 0,100×${VE}/(${coef}×20) = ${fmt(result / F)} mol·L⁻¹.`,
        F > 1
          ? `La dilution par 10 impose ccommerciale = 10c = ${fmt(result)} mol·L⁻¹.`
          : "Les volumes peuvent rester en mL dans ce rapport car les unités se simplifient.",
        "Ajouter de l’eau au bécher ne modifie pas la quantité d’acide de la prise d’essai.",
      ],
    );
  },
  proton: (n) =>
    written(
      [
        "Écrire les deux couples et la réaction entre CH₃COOH et l’eau. Quel est le rôle de l’eau ?",
        "Écrire la réaction entre NH₃ et l’eau. Quel est le rôle de l’eau cette fois ?",
        "Montrer que HCO₃⁻ est amphotère avec deux demi-équations. Vérifier les charges.",
        "Un carbonate reçoit successivement deux protons de H₃O⁺ puis libère du CO₂. Écrire les deux transferts et le bilan avec CO₃²⁻.",
      ][n],
      [
        [
          "Couples : CH₃COOH/CH₃COO⁻ et H₃O⁺/H₂O.",
          "CH₃COOH cède H⁺, l’eau le capte.",
          "CH₃COOH + H₂O ⇌ CH₃COO⁻ + H₃O⁺ ; l’eau est une base. Charges totales nulles de part et d’autre.",
        ],
        [
          "Couples : NH₄⁺/NH₃ et H₂O/HO⁻.",
          "L’eau cède H⁺ ; NH₃ le capte.",
          "NH₃ + H₂O ⇌ NH₄⁺ + HO⁻ ; l’eau est un acide.",
        ],
        [
          "HCO₃⁻ + H⁺ ⇌ H₂CO₃ : il agit comme une base.",
          "HCO₃⁻ ⇌ CO₃²⁻ + H⁺ : il agit comme un acide.",
          "Les charges sont conservées : 0 = 0 et −1 = −2+1. Il appartient donc à deux couples et est amphotère.",
        ],
        [
          "CO₃²⁻ + H₃O⁺ → HCO₃⁻ + H₂O.",
          "HCO₃⁻ + H₃O⁺ → H₂CO₃ + H₂O, puis H₂CO₃ → CO₂ + H₂O.",
          "En sommant : CO₃²⁻ + 2H₃O⁺ → CO₂ + 3H₂O. Deux protons sont consommés par carbonate.",
        ],
      ][n],
    ),
  ph: (n) => {
    const pH = 3 + n * 2;
    return n < 2
      ? numeric(
          `Une solution a pH = ${pH},0 à 25 °C. Calculer [H₃O⁺] en mol·L⁻¹.`,
          10 ** -pH,
          "mol·L⁻¹",
          [
            `pH = −log₁₀([H₃O⁺]/c°), donc [H₃O⁺] = c°10⁻ᵖᴴ.`,
            `[H₃O⁺] = 10⁻${pH} = ${fmt(10 ** -pH)} mol·L⁻¹.`,
            `La solution est ${pH < 7 ? "acide" : "neutre"} à 25 °C.`,
          ],
        )
      : numeric(
          `Une eau de contrôle a pH = ${pH},0 à 25 °C. Ke = 10⁻¹⁴. Calculer [HO⁻] en mol·L⁻¹, puis qualifier la solution.`,
          10 ** (pH - 14),
          "mol·L⁻¹",
          [
            `[H₃O⁺] = 10⁻${pH} mol·L⁻¹.`,
            `[HO⁻] = Ke/[H₃O⁺] = 10^(${pH}−14) = ${fmt(10 ** (pH - 14))} mol·L⁻¹.`,
            `À 25 °C, pH ${pH === 7 ? "= 7 : neutre" : "> 7 : basique"}.`,
          ],
        );
  },
  carbonate: (n) => {
    const va = 20 + 10 * n,
      c = 0.1,
      nacid = (c * va) / 1000,
      nco2 = nacid / 2,
      V = ((nco2 * 8.314 * 298.15) / 101300) * 1000;
    return numeric(
      `On verse ${va},0 mL d’acide fort ([H₃O⁺] = 0,100 mol·L⁻¹) sur 2,00 g de CaCO₃ (M = 100,1 g·mol⁻¹). CaCO₃+2H₃O⁺ → Ca²⁺+CO₂+3H₂O. À 25 °C et 101300 Pa, quel volume de CO₂ obtient-on en mL ? R = 8,314.`,
      V * 1000,
      "mL",
      [
        `ncarbonate = 2/100,1 = 0,01998 mol ; nacide = 0,100×${va / 1000} = ${fmt(nacid)} mol.`,
        `xmax = min(ncarbonate ; nacide/2) = ${fmt(nco2)} mol. L’acide est limitant.`,
        `nCO₂ = xmax ; V = nRT/P = ${fmt(V)} L = ${fmt(V * 1000)} mL.`,
        `Il reste du carbonate : toute la masse initiale n’a pas réagi.`,
      ],
    );
  },
  wave: (n) => {
    const f = [440, 1000, 40000, 25000][n];
    return n < 2
      ? numeric(
          `Dans l’air (c = 340 m·s⁻¹), une note a f = ${f} Hz. Déterminer sa longueur d’onde.`,
          340 / f,
          "m",
          [
            `Une onde périodique vérifie c = λf.`,
            `λ = c/f = 340/${f} = ${fmt(340 / f)} m.`,
            `La fréquence ne mesure pas l’amplitude du son.`,
          ],
        )
      : numeric(
          `Un sonar dans l’air (c = 340 m·s⁻¹) émet à ${f / 1000} kHz et reçoit l’écho après ${n === 2 ? 3000 : 4200} µs. Déterminer la distance de l’obstacle, émetteur et récepteur confondus.`,
          (340 * (n === 2 ? 0.003 : 0.0042)) / 2,
          "m",
          [
            `Le temps est un aller-retour : 2d = cΔt.`,
            `Δt = ${n === 2 ? "0,0030" : "0,0042"} s.`,
            `d = cΔt/2 = ${fmt((340 * (n === 2 ? 0.003 : 0.0042)) / 2)} m.`,
            `La fréquence permettrait aussi de calculer λ, mais elle n’est pas nécessaire à cette distance.`,
          ],
        );
  },
  sound: (n) => {
    const L = 60 + 10 * n;
    return n < 2
      ? numeric(
          `Un sonomètre indique ${L} dB. I₀ = 10⁻¹² W·m⁻². Quelle intensité sonore cela représente-t-il ?`,
          1e-12 * 10 ** (L / 10),
          "W·m⁻²",
          [
            `L/10 = log₁₀(I/I₀), donc I/I₀ = 10^(L/10).`,
            `I = I₀10^(L/10) = 10⁻¹²×10^${L / 10} = ${fmt(1e-12 * 10 ** (L / 10))} W·m⁻².`,
            `Un niveau n’est pas une intensité : préciser l’unité W·m⁻².`,
          ],
        )
      : numeric(
          `${n === 3 ? "Une installation de concert" : "Deux machines"} comporte ${n === 3 ? 4 : 2} sources indépendantes identiques donnant chacune ${L} dB au point d’écoute. Quel niveau total obtient-on ?`,
          L + 10 * Math.log10(n === 3 ? 4 : 2),
          "dB",
          [
            `Les intensités de sources indépendantes s’ajoutent : Itotal = NIune.`,
            `Ltotal = 10log₁₀(NIune/I₀) = Lune+10log₁₀N.`,
            `Ltotal = ${L}+10log₁₀(${n === 3 ? 4 : 2}) = ${fmt(L + 10 * Math.log10(n === 3 ? 4 : 2))} dB.`,
            `On n’additionne pas ${L}+${L} dB.`,
          ],
        );
  },
  attenuation: (n) => {
    const A = 12 + 6 * n,
      d = 2 * 10 ** (A / 20);
    return n < 2
      ? numeric(
          `Une source ponctuelle isotrope est mesurée à 2,0 m puis à ${n === 0 ? 4 : 20} m. Sans absorption, quelle atténuation géométrique est attendue ?`,
          20 * Math.log10((n === 0 ? 4 : 20) / 2),
          "dB",
          [
            `I ∝ 1/d² donc A = 10log₁₀(I₁/I₂) = 20log₁₀(d₂/d₁).`,
            `A = 20log₁₀(${n === 0 ? 4 : 20}/2) = ${fmt(20 * Math.log10((n === 0 ? 4 : 20) / 2))} dB.`,
            `Le niveau final est le niveau initial moins cette atténuation.`,
          ],
        )
      : numeric(
          `Une pompe ponctuelle doit devenir ${A} dB moins forte qu’à 2,0 m. En champ libre sans absorption, à quelle distance doit-on se placer ?`,
          d,
          "m",
          [
            `A = 20log₁₀(d₂/d₁).`,
            `A/20 = log₁₀(d₂/d₁) puis d₂/d₁ = 10^(A/20).`,
            `d₂ = 2×10^(${A}/20) = ${fmt(d)} m.`,
            `Dans une salle réfléchissante cette estimation peut être insuffisante.`,
          ],
        );
  },
  doppler: (n) => {
    const v = 10 + 5 * n,
      c = 340,
      f = 1000;
    return n < 2
      ? numeric(
          `Une source à 1000 Hz ${n === 0 ? "s’approche" : "s’éloigne"} à ${v} m·s⁻¹ d’un récepteur fixe. c = 340 m·s⁻¹. Calculer fR.`,
          (c * f) / (n === 0 ? c - v : c + v),
          "Hz",
          [
            `Le son sera ${n === 0 ? "plus aigu, fR > f₀" : "plus grave, fR < f₀"}.`,
            `fR = f₀c/(c ${n === 0 ? "−" : "+"} v).`,
            `fR = 1000×340/(${340}${n === 0 ? "−" : "+"}${v}) = ${fmt((c * f) / (n === 0 ? c - v : c + v))} Hz.`,
            `Le résultat a le sens prévu.`,
          ],
        )
      : numeric(
          `Un véhicule garde la même vitesse radiale et émet une fréquence constante inconnue. On mesure fA = ${fmt((c * f) / (c - v))} Hz à l’approche et fE = ${fmt((c * f) / (c + v))} Hz à l’éloignement. c = 340 m·s⁻¹. Déterminer sa vitesse en km·h⁻¹.`,
          v * 3.6,
          "km·h⁻¹",
          [
            `Éliminer f₀ entre les deux expressions : v/c = (fA−fE)/(fA+fE).`,
            `v ≈ ${v} m·s⁻¹ (fréquences arrondies).`,
            `v ≈ ${v}×3,6 = ${v * 3.6} km·h⁻¹.`,
            `Cette élimination exige une même fréquence émise et une même valeur de vitesse radiale.`,
          ],
        );
  },
  redshift: (n) => {
    const v = (n + 1) * 100000,
      lambda = 656.3 * (1 + ((n % 2 === 0 ? 1 : -1) * v) / 3e8);
    return numeric(
      `Une galaxie ${n % 2 === 0 ? "s’éloigne" : "s’approche"} à ${v / 1000} km·s⁻¹. λ₀ = 656,3 nm ; c = 3,00×10⁸ m·s⁻¹. Dans l’approximation non relativiste, quelle longueur d’onde observe-t-on ?`,
      lambda,
      "nm",
      [
        `La vitesse radiale signée est vr = ${n % 2 === 0 ? "+" : "−"}${v} m·s⁻¹.`,
        `λR = λ₀(1+vr/c).`,
        `λR = ${fmt(lambda)} nm.`,
        `λR ${n % 2 === 0 ? ">" : "<"} λ₀ : décalage vers le ${n % 2 === 0 ? "rouge" : "bleu"}. Le rapport |vr/c| reste très petit.`,
      ],
    );
  },
  diffraction: (n) => {
    const lambda = [532, 633, 650, 405][n],
      D = 1.5 + n * 0.5,
      a = 80 + n * 20,
      L = (2 * lambda * 1e-9 * D) / (a * 1e-6);
    return n < 2
      ? numeric(
          `Un laser de ${lambda} nm éclaire une fente de largeur ${a} µm. L’écran est à ${fmt(D)} m. Calculer la largeur totale centrale L en cm, en justifiant l’approximation.`,
          L * 100,
          "cm",
          [
            `λ = ${lambda}×10⁻⁹ m et a = ${a}×10⁻⁶ m.`,
            `λ/a = ${fmt(lambda / a / 1000)} ≪ 1, donc sinθ ≈ tanθ ≈ θ.`,
            `L = 2λD/a = ${fmt(L)} m = ${fmt(L * 100)} cm.`,
            `Le facteur 2 vient de la largeur complète entre les deux premières extinctions.`,
          ],
        )
      : numeric(
          `Un contrôle sans contact d’un ${n === 2 ? "cheveu" : "fil textile"} utilise λ = ${lambda} nm et D = ${fmt(D)} m. La largeur centrale entière vaut ${fmt(L * 100)} cm. Quel diamètre déduit-on, en µm ?`,
          a,
          "µm",
          [
            `L = ${fmt(L)} m. La figure est assimilée à celle d’une fente de largeur égale au diamètre.`,
            `L ≈ 2λD/a donc La = 2λD et a = 2λD/L.`,
            `a ≈ ${a}×10⁻⁶ m = ${a} µm.`,
            `θ ≈ λ/a ≪ 1 : l’approximation est cohérente a posteriori.`,
          ],
        );
  },
  diffgraph: (n) => {
    const k = 1.6e-6,
      L = 0.01 + n * 0.002,
      a = k / L;
    return n < 2
      ? numeric(
          `La droite L = k/a a k = 1,60×10⁻⁶ m². Pour un fil, L = ${fmt(L * 100)} cm. Quel diamètre en µm ?`,
          a * 1e6,
          "µm",
          [
            `L = ${fmt(L)} m.`,
            `a = k/L = ${fmt(a)} m = ${fmt(a * 1e6)} µm.`,
            `La pente a bien la dimension longueur².`,
          ],
        )
      : numeric(
          `Un atelier contrôle un fil avec k = 1,60×10⁻⁶ m² supposé exact, L = ${fmt(L * 100)} cm et u(L) = 1,0 mm. Calculer u(a) en µm.`,
          ((a * 0.001) / L) * 1e6,
          "µm",
          [
            `a = k/L = ${fmt(a * 1e6)} µm.`,
            `Pour k exact, u(a) = a u(L)/L.`,
            `u(a) = ${fmt(a * 1e6)}×0,001/${fmt(L)} = ${fmt(((a * 0.001) / L) * 1e6)} µm.`,
            `Si k était incertain, sa contribution relative s’ajouterait quadratiquement.`,
          ],
        );
  },
  circular: (n) => {
    const d = (50 + n * 20) * 1e-3,
      lambda = 550e-9;
    return n < 2
      ? numeric(
          `Un objectif circulaire de diamètre ${d * 1000} mm observe à λ = 550 nm. Calculer le rayon angulaire de la première extinction en µrad.`,
          ((1.22 * lambda) / d) * 1e6,
          "µrad",
          [
            `d = ${fmt(d)} m et λ = 550×10⁻⁹ m.`,
            `θdiff = 1,22λ/d.`,
            `θdiff = ${fmt((1.22 * lambda) / d)} rad = ${fmt(((1.22 * lambda) / d) * 1e6)} µrad.`,
            `Un diamètre plus grand donne une tache angulaire plus petite.`,
          ],
        )
      : numeric(
          `Un analyseur voit un diamètre central L = ${40 + n * 2} mm sur un capteur à D = 350 mm. Laser λ = 635 nm. La particule est assimilée à une ouverture circulaire. Déterminer son diamètre en µm.`,
          ((2.44 * 0.35 * 635e-9) / ((40 + n * 2) * 0.001)) * 1e6,
          "µm",
          [
            `L/2 ≈ Dθ avec θ ≈ 1,22λ/a.`,
            `L ≈ 2,44Dλ/a donc a ≈ 2,44Dλ/L.`,
            `En SI, a = ${fmt(((2.44 * 0.35 * 635e-9) / ((40 + n * 2) * 0.001)) * 1e6)} µm.`,
            `Le facteur 2,44 associe le diamètre total de la tache et le premier minimum circulaire.`,
          ],
        );
  },
  interference: (n) => {
    const ratio = [2, 2.5, 3, 3.5][n],
      lambda = 600,
      delta = ratio * lambda;
    return written(
      `Deux sources en phase émettent à λ = 600 nm. ${n < 2 ? "Leurs trajets diffèrent" : "Dans un capteur, on ajoute à l’un des trajets une longueur"} de ${delta} nm. Déterminer la nature des interférences et préciser la condition d’extinction totale.`,
      [
        `δ/λ = ${delta}/600 = ${ratio}.`,
        `Ce rapport est ${n % 2 === 0 ? "entier : les ondes arrivent en phase, interférences constructives" : "demi-entier : les ondes arrivent en opposition de phase, interférences destructives"}.`,
        n % 2 === 0
          ? "Pour deux amplitudes A égales, l’amplitude résultante vaut 2A."
          : "Une amplitude nulle nécessite des amplitudes incidentes égales ; sinon le minimum est non nul.",
        "Le raisonnement suppose l’absence d’autre déphasage initial.",
      ],
    );
  },
  young: (n) => {
    const D = 1.2 + 0.3 * n,
      b = 0.2 + n * 0.1,
      lambda = 532 + n * 20,
      i = (lambda * 1e-9 * D) / (b * 1e-3);
    return n < 2
      ? numeric(
          `Des fentes d’Young séparées de ${fmt(b)} mm sont éclairées à ${lambda} nm dans l’air. D = ${fmt(D)} m. Déterminer l’interfrange en mm.`,
          i * 1000,
          "mm",
          [
            `b = ${fmt(b * 0.001)} m ; λ = ${lambda}×10⁻⁹ m.`,
            `i = λD/b = ${fmt(i)} m = ${fmt(i * 1000)} mm.`,
            `Il s’agit de l’écart entre deux centres clairs successifs, pas d’un clair à un sombre.`,
          ],
        )
      : numeric(
          `Un capteur relève ${n === 2 ? 6 : 9} maxima successifs sur une distance de ${fmt(i * 1000 * (n === 2 ? 5 : 8))} mm. Les trous sont séparés de ${fmt(b)} mm, l’écran est à ${fmt(D)} m. Retrouver λ en nm.`,
          lambda,
          "nm",
          [
            `Les ${n === 2 ? 6 : 9} maxima délimitent ${n === 2 ? 5 : 8} intervalles.`,
            `i = distance/${n === 2 ? 5 : 8} ≈ ${fmt(i * 1000)} mm.`,
            `λ = ib/D ≈ ${lambda} nm.`,
            `Mesurer plusieurs intervalles réduit l’influence d’une erreur de lecture fixe sur la distance totale.`,
          ],
        );
  },
  thinfilm: (n) => {
    const lambda = [470, 530, 590, 750][n],
      e = lambda / 6.8;
    return n < 2
      ? numeric(
          `Une couche d’indice n = 1,7 renforce λ = ${lambda} nm au premier ordre k = 0. Le chemin optique fourni est ΔL = 2ne−λ/2. Quelle épaisseur e en nm ?`,
          e,
          "nm",
          [
            `Renforcement : ΔL = kλ = 0.`,
            `2ne−λ/2 = 0 donc e = λ/(4n).`,
            `e = ${lambda}/6,8 = ${fmt(e)} nm.`,
            `La phase à la réflexion est déjà incluse dans ΔL.`,
          ],
        )
      : numeric(
          `Une aile irisée contient des couches de ${fmt(e)} nm, d’indice 1,7. Le modèle donne ΔL = 2ne−λ/2. Quelle longueur d’onde est renforcée à k = 0 ?`,
          lambda,
          "nm",
          [
            `ΔL = 0 pour k = 0, donc λ = 4ne.`,
            `λ ≈ 4×1,7×${fmt(e)} = ${lambda} nm.`,
            `La couleur dépend de cet ordre ; d’autres épaisseurs pourraient correspondre à d’autres ordres.`,
            `Ne pas réappliquer un déphasage de réflexion déjà inclus.`,
          ],
        );
  },
  acousticdiff: (n) => {
    const f = [440, 1760, 600, 1200][n],
      r = 343 / f,
      theta = Math.asin(r);
    return n < 2
      ? numeric(
          `Une porte de largeur 1,0 m diffracte un son de ${f} Hz. c = 343 m·s⁻¹. Calculer le demi-angle θ en degrés à partir de sinθ = λ/a.`,
          (theta * 180) / Math.PI,
          "°",
          [
            `λ = c/f = ${fmt(r)} m.`,
            `θ = arcsin(λ/a) = ${fmt(theta)} rad.`,
            `θ = ${fmt((theta * 180) / Math.PI)}°.`,
            `L’approximation des petits angles doit être contrôlée et n’est pas acceptable à 440 Hz.`,
          ],
        )
      : written(
          `Deux signaux reçus sont s₁ = sin(2πft) et s₂ = sin(2πft+φ), avec f = ${f} Hz. Écrire leur somme pour φ = ${n === 2 ? "0" : "π"} et expliquer son amplitude.`,
          [
            n === 2
              ? "Avec φ = 0, les deux sinus sont identiques."
              : "Avec φ = π, sin(x+π) = −sin(x).",
            n === 2
              ? "s = 2sin(2πft) : amplitude 2."
              : "s = 0 : les signaux se compensent exactement.",
            "La fréquence ne change pas. L’annulation totale exige des amplitudes égales.",
          ],
        );
  },
  lens: (n) => {
    const focal = [0.2, 0.1, 0.15, 0.3][n],
      object = [-0.3, -0.3, -0.25, -50][n],
      image = 1 / (1 / focal + 1 / object);
    return numeric(
      `Une lentille convergente ${n === 3 ? "observe un lampadaire lointain" : "forme l’image d’un objet réel"}. f′ = ${fmt(focal * 100)} cm, OA = ${fmt(object)} m (axe orienté vers la droite). Déterminer OA′ en cm, puis le sens de l’image.`,
      image * 100,
      "cm",
      [
        `1/OA′ = 1/f′ + 1/OA = 1/${focal} + 1/(${object}).`,
        `OA′ = 1/(1/f′+1/OA) = ${fmt(image)} m = ${fmt(image * 100)} cm.`,
        `γ = OA′/OA = ${fmt(image / object)} < 0 : image renversée.`,
        `OA′ > 0 : l’image est réelle et peut être recueillie sur un écran.${n === 3 ? " Comme |OA| ≫ f′, OA′ est une bonne estimation de f′." : ""}`,
      ],
    );
  },
  afocal: (n) => {
    const f1 = [500, 900, 600, 1200][n],
      f2 = [20, 25, 10, 40][n];
    return n < 2
      ? numeric(
          `Une lunette afocale possède f′objectif = ${f1} mm et f′oculaire = ${f2} mm. Quelle distance entre ses centres optiques, en cm ?`,
          (f1 + f2) / 10,
          "cm",
          [
            `Afocal signifie que des rayons parallèles émergent parallèles entre eux.`,
            `Placer F′₁ = F₂ : O₁O₂ = f′₁+f′₂.`,
            `d = ${f1}+${f2} = ${f1 + f2} mm = ${(f1 + f2) / 10} cm.`,
            `L’image intermédiaire réelle est dans le plan focal commun et l’image finale est à l’infini.`,
          ],
        )
      : written(
          `Construire un faisceau venant d’une étoile hors axe dans une lunette afocale (f′₁ = ${f1} mm ; f′₂ = ${f2} mm). Décrire une construction avec deux rayons et placer l’image intermédiaire.`,
          [
            "Tracer l’axe, O₁ puis O₂ séparés de f′₁+f′₂ ; placer F′₁ = F₂.",
            "Un rayon passant par O₁ n’est pas dévié. Son intersection avec le plan focal commun définit B₁.",
            "Tracer B₁O₂ : ce rayon n’est pas dévié par l’oculaire et définit la direction de sortie.",
            "Un second rayon incident parallèle au premier converge après l’objectif vers B₁ ; après l’oculaire il ressort parallèlement à B₁O₂.",
            "L’image intermédiaire est réelle et renversée ; le faisceau sortant parallèle indique l’image finale à l’infini.",
          ],
        );
  },
  magnification: (n) => {
    const f1 = [900, 600, 450, 1200][n],
      f2 = [25, 4, 30, 10][n];
    return n < 2
      ? numeric(
          `Une lunette ${n === 0 ? "70/900" : "50/600"} utilise un oculaire de ${f2} mm. Quel est son grossissement positif ?`,
          f1 / f2,
          "sans unité",
          [
            `La notice donne la focale objectif : f′₁ = ${f1} mm.`,
            `G = f′₁/f′₂ = ${f1}/${f2} = ${f1 / f2}.`,
            `Le premier nombre de la notice est un diamètre : il n’intervient pas dans ce calcul.`,
            `Avec les angles orientés, le rapport serait négatif car la lunette renverse l’image.`,
          ],
        )
      : numeric(
          `Pour photographier un détail, on veut un grossissement de ${f1 / f2}. L’objectif a une focale de ${f1} mm. Quelle focale d’oculaire choisir ?`,
          f2,
          "mm",
          [
            `G = f′₁/f′₂.`,
            `Gf′₂ = f′₁ donc f′₂ = f′₁/G.`,
            `f′₂ = ${f1}/${f1 / f2} = ${f2} mm.`,
            `Vérifier ensuite la résolution et la luminosité : un grand grossissement ne garantit pas un détail net.`,
          ],
        );
  },
  resolution: (n) => {
    const ell = [0.07, 0.23, 44, 0.04][n],
      D = [280, 10400, 195000, 1500][n],
      eps = 3e-4;
    return n < 2
      ? numeric(
          `Un détail de ${fmt(ell)} m est à ${D} m. Calculer son angle apparent à l’œil nu en µrad. Seuil de l’œil : 300 µrad.`,
          (ell / D) * 1e6,
          "µrad",
          [
            `Petits angles : α ≈ ℓ/D.`,
            `α = ${ell}/${D} = ${fmt(ell / D)} rad = ${fmt((ell / D) * 1e6)} µrad.`,
            `Cet angle est inférieur à 300 µrad : détail non résolu à l’œil nu selon ce critère.`,
            `Avec une lunette, il faudra Gα > ε et une résolution instrumentale suffisante.`,
          ],
        )
      : numeric(
          `Une ${n === 2 ? "pale de 44 m est à 195 km" : "lettre de 4 cm est à 1,5 km"}. Le seuil de l’œil est ε = 3,0×10⁻⁴ rad. Quel grossissement seuil calcule-t-on pour distinguer le détail (hors diffraction) ?`,
          (eps * D) / ell,
          "sans unité",
          [
            `α ≈ ℓ/D = ${fmt(ell / D)} rad.`,
            `Gα ≥ ε au seuil : Gmin = εD/ℓ.`,
            `Gmin ≈ ${fmt((eps * D) / ell)}.`,
            `Si l’énoncé exige que l’angle dépasse strictement ε, choisir G strictement supérieur à cette valeur ; pour le confort à 4ε, multiplier ce seuil par 4.`,
          ],
        );
  },
  uncertainty: (n) => {
    const ref = 100,
      x = [102, 104, 106, 108][n],
      u = 3;
    return numeric(
      `Un diamètre mesuré vaut (${x} ± 3) µm, incertitude-type. La référence 100 µm est supposée exacte. Calculer l’écart normalisé z puis conclure au critère z ≤ 2.`,
      Math.abs(x - ref) / u,
      "sans unité",
      [
        `Écart normalisé : z = |x−xref|/u(x).`,
        `z = |${x}−100|/3 = ${fmt(Math.abs(x - ref) / u)}.`,
        `z ${Math.abs(x - ref) / u <= 2 ? "≤ 2 : compatible" : " > 2 : non compatible"} selon le critère fourni.`,
        `Ce résultat ne prouve pas la conformité individuelle de tous les objets à une norme.`,
      ],
    );
  },
};
export const exercises = topics.flatMap((topic) =>
  [0, 1, 2, 3].map((n) => ({
    id: `${topic.id}-${n + 1}`,
    topic: topic.id,
    chapter: topic.chapter,
    level: n + 1,
    title: [
      "Prendre les bons réflexes",
      "Appliquer avec précision",
      "Enchaîner les étapes",
      "Transférer à une situation nouvelle",
    ][n],
    origin: "Exercice original — application",
    ...builders[topic.id](n),
  })),
);
export function parseAnswer(raw) {
  const normalized = String(raw)
    .trim()
    .replace(/\s/g, "")
    .replace(/,/g, ".")
    .replace(/[×·]10\^?/g, "e")
    .replace(/\*10\*\*/g, "e")
    .replace(/\*10\^/g, "e")
    .replace(/−/g, "-");
  return normalized === "" ? NaN : Number(normalized);
}
export function isCorrect(raw, expected) {
  const n = parseAnswer(raw);
  return (
    Number.isFinite(n) &&
    Math.abs(n - expected) <= Math.max(Math.abs(expected) * 0.015, 1e-14)
  );
}
export const questionBank = topics.flatMap((topic) =>
  [
    ["Cours", `Expliquer : ${topic.title}.`, topic.understand],
    [
      "Calcul",
      `Résoudre puis interpréter l’exemple : ${topic.title}.`,
      topic.apply,
    ],
    [
      "Démonstration",
      `Justifier les relations et leurs limites : ${topic.title}.`,
      topic.master,
    ],
    [
      "Documents",
      `Quels indices relever dans un document sur « ${topic.title} » et comment les exploiter ?`,
      `${topic.recognize} Données et unités : ${topic.data} Démarche : ${topic.solve.join(" ")}`,
    ],
    [
      "Pièges",
      `Quelle erreur peut invalider une résolution sur « ${topic.title} » ?`,
      topic.traps,
    ],
    [
      "Transversal",
      `Comment adapter cette méthode à des données indirectes ou à une autre situation ?`,
      topic.variants,
    ],
  ].map(([category, question, answer], n) => ({
    id: `question-${topic.id}-${n}`,
    topic: topic.id,
    chapter: topic.chapter,
    category,
    question,
    answer,
    priority: topic.chapter >= 4 ? (n < 4 ? 1 : 2) : n < 2 ? 2 : 3,
    evaluation:
      n === 1
        ? "Choisir une relation, convertir les unités et interpréter le résultat."
        : "Mobiliser les hypothèses et expliquer le raisonnement avec précision.",
    method: topic.solve,
    trap: topic.traps,
    variant: topic.variants,
  })),
);
