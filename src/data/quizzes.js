const q = (topic, chapter, question, choices) => ({
  id: `qcm-${topic}`,
  topic: topic.replace(/-bis$/, ""),
  chapter,
  question,
  choices: choices.map(([text, correct, explanation]) => ({
    text,
    correct,
    explanation,
  })),
});
export const quizzes = [
  q(
    "concentration",
    1,
    "Diluer 20 fois pour obtenir 100,0 mL : que faut-il faire ?",
    [
      [
        "Prélever 5,00 mL de mère puis compléter à 100,0 mL.",
        true,
        "Vm = Vf/F = 5,00 mL.",
      ],
      [
        "Ajouter 100,0 mL d’eau à 5,00 mL de mère.",
        false,
        "Le volume final serait environ 105 mL.",
      ],
      [
        "Conserver la quantité de soluté du prélèvement.",
        true,
        "Le soluté n’est ni créé ni consommé.",
      ],
      [
        "Utiliser uniquement une éprouvette pour une préparation précise.",
        false,
        "Une pipette et une fiole jaugées sont plus adaptées.",
      ],
    ],
  ),
  q(
    "concentration-bis",
    1,
    "Une solution a w = 10 %, ρ = 1200 g·L⁻¹ et M = 60 g·mol⁻¹. Que vaut c ?",
    [
      ["2,0 mol·L⁻¹", true, "c = 0,10×1200/60 = 2,0."],
      ["200 mol·L⁻¹", false, "Le titre 10 % vaut 0,10, pas 10."],
      ["120 g·L⁻¹ est sa concentration massique.", true, "wρ = 120 g·L⁻¹."],
      ["12 mol·L⁻¹", false, "Il faut diviser la concentration massique par M."],
    ],
  ),
  q("beer", 1, "Dans le domaine de Beer-Lambert, à λ et cuve fixées…", [
    ["Doubler c double A.", true, "A = εℓc."],
    ["A est exprimée en mol·L⁻¹.", false, "A est sans unité."],
    [
      "Une droite A(c) permet un dosage.",
      true,
      "La mesure est comparée à une gamme étalon.",
    ],
    [
      "Un spectre A(λ) est la même chose qu’une courbe A(c).",
      false,
      "Les variables en abscisse et les objectifs diffèrent.",
    ],
  ]),
  q("beer-bis", 1, "Pourquoi travailler au maximum d’absorption ?", [
    [
      "Pour une meilleure sensibilité.",
      true,
      "La variation d’absorbance par variation de concentration est élevée.",
    ],
    [
      "Pour rendre toute solution linéaire quelle que soit c.",
      false,
      "La loi garde un domaine de validité.",
    ],
    ["Pour pouvoir ignorer le blanc.", false, "Le blanc reste nécessaire."],
  ]),
  q("conductivity", 1, "Avec λ en S·m²·mol⁻¹, que faut-il utiliser ?", [
    ["[X] en mol·m⁻³.", true, "Le produit a alors l’unité S·m⁻¹."],
    ["1 mmol·L⁻¹ = 1 mol·m⁻³.", true, "10⁻³ mol / 10⁻³ m³ = 1 mol·m⁻³."],
    [
      "[X] en mol·L⁻¹ sans conversion.",
      false,
      "Cela introduit un facteur 1000.",
    ],
    [
      "Seulement les ions titrés, jamais les spectateurs.",
      false,
      "Tous les ions contribuent.",
    ],
  ]),
  q("conductivity-bis", 1, "La dissolution complète de CaCl₂ à c apporte…", [
    ["[Ca²⁺] = c.", true, "Un ion calcium par formule."],
    ["[Cl⁻] = 2c.", true, "Deux ions chlorure par formule."],
    ["[Cl⁻] = c/2.", false, "Le coefficient 2 multiplie la concentration."],
  ]),
  q("gas", 1, "Quelles conversions conviennent pour PV = nRT en SI ?", [
    ["145 mL = 145×10⁻⁶ m³.", true, "1 mL = 10⁻⁶ m³."],
    ["25 °C = 298,15 K.", true, "T = θ+273,15."],
    ["1013 hPa = 1013 Pa.", false, "Il faut multiplier par 100."],
    [
      "Le modèle est exact à toute pression.",
      false,
      "Les interactions deviennent importantes à forte densité.",
    ],
  ]),
  q("gas-bis", 1, "Dans le modèle idéal, à mêmes P et T, le volume molaire…", [
    ["Vaut RT/P.", true, "Diviser PV = nRT par nP."],
    [
      "Dépend de la masse molaire du gaz.",
      false,
      "M n’apparaît pas dans RT/P.",
    ],
    ["Permet de calculer n = V/Vm.", true, "Vm est le volume par mole."],
  ]),
  q(
    "spectra",
    1,
    "Un spectre IR en transmittance présente un creux vers 1700 cm⁻¹…",
    [
      [
        "Il peut traduire une absorption C=O.",
        true,
        "Comparer position, largeur et intensité à la table.",
      ],
      [
        "Il identifie toujours une molécule unique.",
        false,
        "De nombreux groupes carbonylés absorbent dans cette région.",
      ],
      [
        "Le creux est une transmission maximale.",
        false,
        "Le creux correspond à moins de lumière transmise.",
      ],
    ],
  ),
  q("spectra-bis", 1, "Que peut-on déduire d’un seul λmax = 660 nm ?", [
    [
      "Une absorption est maximale dans le rouge.",
      true,
      "660 nm appartient au rouge visible.",
    ],
    [
      "Le vert est forcément entièrement absorbé.",
      false,
      "Il faut observer le reste du spectre.",
    ],
    [
      "La couleur exacte se déduit du spectre transmis complet.",
      true,
      "Le spectre complet compte, pas seulement son maximum.",
    ],
  ]),
  q("titration", 1, "À la seconde équivalence de H₂A + 2HO⁻ → A²⁻ + 2H₂O…", [
    [
      "n(H₂A initial) = n(HO⁻ versé)/2.",
      true,
      "Le rapport stœchiométrique vaut 1:2.",
    ],
    ["cAVA = cBVE dans tous les cas.", false, "Il faut ici cAVA = cBVE/2."],
    [
      "Ajouter de l’eau au bécher change nécessairement VE.",
      false,
      "La quantité d’acide prélevée ne change pas.",
    ],
    [
      "Le pH équivalent est forcément 7.",
      false,
      "Cela dépend du système acide-base.",
    ],
  ]),
  q("titration-bis", 1, "Comment repérer une équivalence ?", [
    [
      "Intersection de deux segments en conductimétrie.",
      true,
      "C’est la rupture de pente.",
    ],
    [
      "Extremum de |dpH/dV| dans le saut.",
      true,
      "Cela repère l’inflexion du suivi pH-métrique.",
    ],
    [
      "Toujours le minimum de σ.",
      false,
      "Les deux pentes ne sont pas toujours de signes opposés.",
    ],
  ]),
  q("proton", 2, "Quelles affirmations de Brønsted sont correctes ?", [
    ["Un acide cède H⁺.", true, "C’est sa définition."],
    [
      "Une base capte un électron.",
      false,
      "Capter H⁺ définit une base de Brønsted ; un électron relève de l’oxydoréduction.",
    ],
    ["HCO₃⁻ est amphotère.", true, "Il peut devenir H₂CO₃ ou CO₃²⁻."],
    [
      "Les deux conjugués diffèrent d’un proton.",
      true,
      "Ils sont reliés par perte ou capture de H⁺.",
    ],
  ]),
  q("proton-bis", 2, "Dans NH₃ + H₂O ⇌ NH₄⁺ + HO⁻…", [
    ["L’eau est l’acide.", true, "Elle cède un proton."],
    ["NH₃ est la base.", true, "Il capte un proton."],
    ["La charge totale augmente.", false, "Elle vaut zéro de chaque côté."],
  ]),
  q("ph", 2, "Si le pH passe de 3 à 5…", [
    ["[H₃O⁺] est divisée par 100.", true, "10⁻⁵/10⁻³ = 10⁻²."],
    ["[H₃O⁺] est divisée par 2.", false, "L’échelle est logarithmique."],
    [
      "La solution devient moins acide.",
      true,
      "La concentration en oxonium diminue.",
    ],
    [
      "La solution devient forcément basique à 25 °C.",
      false,
      "pH = 5 reste inférieur à 7.",
    ],
  ]),
  q("ph-bis", 2, "À 25 °C, une solution de pH 12 a…", [
    ["[HO⁻] = 10⁻² mol·L⁻¹.", true, "10⁻¹⁴/10⁻¹² = 10⁻²."],
    ["[H₃O⁺] = 12 mol·L⁻¹.", false, "[H₃O⁺] = 10⁻¹² mol·L⁻¹."],
    [
      "Un pH sans unité.",
      true,
      "Le logarithme porte sur une grandeur réduite sans dimension.",
    ],
  ]),
  q("carbonate", 2, "Un carbonate CO₃²⁻ transformé en CO₂ consomme…", [
    ["Deux protons.", true, "CO₃²⁻ → HCO₃⁻ → H₂CO₃."],
    [
      "Un proton comme HCO₃⁻.",
      false,
      "HCO₃⁻ nécessite un proton, CO₃²⁻ en nécessite deux.",
    ],
    [
      "Une quantité donnée par nacide/2 si l’acide monoprotique est limitant.",
      true,
      "Le coefficient de l’acide est 2.",
    ],
  ]),
  q(
    "carbonate-bis",
    2,
    "La réaction du vinaigre avec le bicarbonate fait mousser car…",
    [
      ["Un gaz CO₂ se forme.", true, "H₂CO₃ peut se décomposer en CO₂ et eau."],
      [
        "La mousse prouve une efficacité nettoyante supérieure.",
        false,
        "Ce n’est pas une mesure d’efficacité.",
      ],
      [
        "Un transfert de proton a lieu.",
        true,
        "L’acide éthanoïque cède H⁺ à HCO₃⁻.",
      ],
    ],
  ),
  q("wave", 3, "Pour une onde sonore périodique…", [
    ["λ = c/f.", true, "c = λ/T et f = 1/T."],
    ["La période s’exprime en Hz.", false, "La période est en secondes."],
    ["Le son traverse le vide.", false, "Il exige un milieu matériel."],
    [
      "L’énergie se propage sans transport global de matière.",
      true,
      "Le milieu oscille localement.",
    ],
  ]),
  q(
    "wave-bis",
    3,
    "Un écho revient après 6 ms, c = 340 m·s⁻¹. Quelle distance ?",
    [
      ["1,02 m.", true, "d = 340×0,006/2."],
      ["2,04 m.", false, "C’est la distance aller-retour."],
      [
        "0,00102 m.",
        false,
        "Une conversion de ms a été appliquée une fois de trop.",
      ],
    ],
  ),
  q(
    "sound",
    3,
    "Deux sources indépendantes identiques produisent chacune 70 dB au même point…",
    [
      [
        "Le total vaut environ 73 dB.",
        true,
        "Les intensités doublent : gain 10log₁₀2.",
      ],
      ["Le total vaut 140 dB.", false, "Les décibels ne s’additionnent pas."],
      [
        "La puissance reçue par surface double.",
        true,
        "I est la puissance par unité de surface.",
      ],
    ],
  ),
  q("sound-bis", 3, "Un niveau augmente de 20 dB. Alors…", [
    ["L’intensité est multipliée par 100.", true, "10^(20/10) = 100."],
    [
      "L’intensité est multipliée par 20.",
      false,
      "La relation est logarithmique.",
    ],
    ["L₀ = 0 dB signifie I = 0.", false, "Cela signifie I = I₀, non nul."],
  ]),
  q(
    "attenuation",
    3,
    "En champ libre, doubler la distance à une source ponctuelle…",
    [
      ["Divise I par 4.", true, "I ∝ 1/d²."],
      ["Fait perdre environ 6 dB.", true, "20log₁₀2 ≈ 6."],
      [
        "Divise le niveau en dB par 4.",
        false,
        "Le niveau diminue de 6 dB, il n’est pas divisé par 4.",
      ],
    ],
  ),
  q(
    "attenuation-bis",
    3,
    "Fermer une fenêtre pour réduire le bruit relève principalement du modèle…",
    [
      [
        "D’atténuation par un obstacle, avec réflexion et absorption.",
        true,
        "Le matériau modifie l’énergie transmise.",
      ],
      [
        "De la seule dispersion géométrique.",
        false,
        "La distance n’a pas changé.",
      ],
      [
        "D’un changement nécessaire de fréquence de la source.",
        false,
        "La source peut rester identique.",
      ],
    ],
  ),
  q("doppler", 3, "Source mobile approchant un récepteur fixe, v < c…", [
    ["fR = f₀c/(c−v).", true, "Le dénominateur diminue donc fR augmente."],
    ["fR = c/(c−v).", false, "La formule serait sans dimension, il manque f₀."],
    [
      "La célérité du milieu augmente avec v.",
      false,
      "Le mouvement change les arrivées, pas la célérité du milieu.",
    ],
  ]),
  q("doppler-bis", 3, "Pour un radar à réflexion à faible vitesse…", [
    ["Δf ≈ 2f₀v/c.", true, "L’aller-retour produit une double interaction."],
    [
      "Il faut connaître la composante radiale de v.",
      true,
      "Seul le mouvement selon la ligne de visée intervient dans ce modèle.",
    ],
    [
      "La relation source mobile simple suffit toujours.",
      false,
      "La réflexion impose un autre modèle.",
    ],
  ]),
  q("redshift", 3, "Une raie passe de 656,3 nm à 655,6 nm…", [
    [
      "La source se rapproche dans le modèle radial.",
      true,
      "La longueur d’onde diminue : décalage vers le bleu.",
    ],
    ["La fréquence reçue augmente.", true, "f = c/λ."],
    ["La source s’éloigne.", false, "L’éloignement donnerait λR > λ₀."],
  ]),
  q("redshift-bis", 3, "La relation Δλ/λ₀ ≈ vr/c est utilisée ici…", [
    ["Lorsque |vr| ≪ c.", true, "C’est une approximation non relativiste."],
    [
      "Pour toute vitesse, même proche de c.",
      false,
      "Il faut alors une relation relativiste.",
    ],
    [
      "Avec vr positif pour l’éloignement.",
      true,
      "Cela donne Δλ positif, vers le rouge.",
    ],
  ]),
  q(
    "diffraction",
    4,
    "On divise par deux la largeur d’une fente, à λ et D fixées. En petits angles…",
    [
      ["La largeur centrale double.", true, "L = 2λD/a."],
      [
        "L’angle caractéristique est divisé par deux.",
        false,
        "θ ≈ λ/a : il double.",
      ],
      [
        "La fréquence lumineuse est modifiée.",
        false,
        "La diffraction ne change pas f dans le même milieu.",
      ],
    ],
  ),
  q("diffraction-bis", 4, "Dans L ≈ 2λD/a…", [
    [
      "L désigne la largeur totale entre premières extinctions.",
      true,
      "Le demi-angle correspond à L/2.",
    ],
    ["Le facteur 2 vient des deux côtés de l’axe.", true, "L = 2Dtanθ."],
    [
      "θ peut être entré en degrés dans θ ≈ λ/a.",
      false,
      "Cette approximation nécessite des radians.",
    ],
  ]),
  q(
    "diffgraph",
    4,
    "Le graphique L(m) en fonction de 1/a(m⁻¹) est linéaire. Sa pente…",
    [
      ["Est en m².", true, "m/(m⁻¹) = m²."],
      ["Vaut 2λD.", true, "L = (2λD)(1/a)."],
      ["Est sans unité.", false, "Les axes ont des unités différentes."],
    ],
  ),
  q("diffgraph-bis", 4, "Pour a = k/L avec k exact et u(L)/L = 5 %…", [
    [
      "u(a)/a = 5 %.",
      true,
      "Les incertitudes relatives sont identiques pour une inversion avec k exact.",
    ],
    ["u(a) = 5 µm pour tout a.", false, "u(a) dépend de la valeur de a."],
    [
      "Augmenter L peut réduire l’erreur relative si u(L) est fixe.",
      true,
      "Le rapport u(L)/L diminue.",
    ],
  ]),
  q(
    "circular",
    4,
    "Un objectif passe de 50 mm à 100 mm de diamètre à λ fixée…",
    [
      [
        "L’angle limite de diffraction est divisé par deux.",
        true,
        "θdiff = 1,22λ/d.",
      ],
      [
        "La lumière recueillie est multipliée par quatre.",
        true,
        "La surface varie comme d².",
      ],
      [
        "Son grossissement double forcément.",
        false,
        "G dépend des focales, pas du diamètre.",
      ],
    ],
  ),
  q(
    "circular-bis",
    4,
    "Le diamètre de la tache centrale d’Airy sur écran vaut…",
    [
      ["L ≈ 2,44λD/d.", true, "Deux fois le rayon associé à 1,22λ/d."],
      ["L ≈ 1,22λD/d.", false, "C’est le rayon."],
      [
        "L ≈ 2λD/d exactement pour toute géométrie.",
        false,
        "Le facteur est celui d’une fente et il faut des approximations.",
      ],
    ],
  ),
  q("interference", 4, "Deux sources cohérentes en phase. Si δ = 2,5λ…", [
    ["Elles arrivent en opposition de phase.", true, "2,5 est demi-entier."],
    [
      "L’amplitude totale est toujours nulle.",
      false,
      "L’annulation exige aussi des amplitudes égales.",
    ],
    ["Le minimum est destructif.", true, "C’est une condition d’opposition."],
  ]),
  q("interference-bis", 4, "Dans un milieu homogène d’indice n…", [
    ["ΔL = nδ.", true, "Le chemin optique pondère les distances par n."],
    ["λ = λ₀/n.", true, "La fréquence est conservée, la célérité diminue."],
    [
      "ΔL = kλ avec λ dans le milieu est la bonne condition générale.",
      false,
      "Employer ΔL avec λ₀, ou δ avec λ.",
    ],
  ]),
  q(
    "young",
    4,
    "On mesure entre le premier et le sixième maximum : 15 mm. Alors…",
    [
      ["i = 3 mm.", true, "Il y a cinq intervalles."],
      ["i = 2,5 mm.", false, "Six maxima ne délimitent pas six interfranges."],
      [
        "Un maximum et le minimum voisin sont séparés de i/2.",
        true,
        "Dans le modèle régulier de Young.",
      ],
    ],
  ),
  q("young-bis", 4, "Dans i = λD/b, doubler b à D et λ fixées…", [
    ["Divise i par deux.", true, "b est au dénominateur."],
    [
      "Double la largeur de chaque fente.",
      false,
      "b est une séparation, pas une largeur.",
    ],
    [
      "Ne change pas la fréquence.",
      true,
      "Le dispositif redistribue l’intensité sans changer la source.",
    ],
  ]),
  q("thinfilm", 4, "Le modèle donne ΔL = 2ne−λ/2. Au renforcement k = 0…", [
    ["e = λ/(4n).", true, "Imposer ΔL = 0 donne 2ne = λ/2."],
    ["e = λ/(2n).", false, "Le terme λ/2 a été oublié."],
    [
      "Le modèle inclut déjà un effet de réflexion.",
      true,
      "Le terme de demi-longueur d’onde encode cet effet.",
    ],
  ]),
  q("thinfilm-bis", 4, "Pour mesurer une épaisseur sur neuf couches…", [
    [
      "On convertit la longueur photographique par la barre d’échelle puis on divise par 9.",
      true,
      "La barre établit le facteur photo/réalité.",
    ],
    [
      "On réduit l’influence d’une erreur de lecture donnée.",
      true,
      "La même erreur sur la distance totale est divisée par neuf sur une couche.",
    ],
    [
      "On obtient automatiquement une incertitude nulle.",
      false,
      "La lecture et l’échelle restent incertaines.",
    ],
  ]),
  q("acousticdiff", 4, "Pour λ/a = 0,78, on veut θ avec sinθ = λ/a…", [
    ["θ = arcsin(0,78) ≈ 0,895 rad.", true, "L’angle est grand."],
    [
      "θ = 0,78 rad est une approximation très précise.",
      false,
      "L’erreur dépasse largement celle des petits angles usuels.",
    ],
    ["θ vaut environ 51°.", true, "Conversion rad→degrés."],
  ]),
  q(
    "acousticdiff-bis",
    4,
    "Deux sinus de même fréquence et amplitude ont φ = π…",
    [
      ["Leur somme est nulle.", true, "sin(x+π) = −sin(x)."],
      [
        "Leur fréquence est doublée.",
        false,
        "On superpose, on ne multiplie pas les signaux.",
      ],
      [
        "L’annulation peut disparaître si les amplitudes diffèrent.",
        true,
        "Il reste alors une amplitude égale à leur différence en module.",
      ],
    ],
  ),
  q(
    "lens",
    5,
    "Objet réel situé 30 cm avant une lentille convergente de f′ = 20 cm…",
    [
      ["OA = −30 cm.", true, "L’axe est orienté dans le sens de propagation."],
      ["OA′ = +60 cm.", true, "1/OA′ = 1/20−1/30 = 1/60."],
      ["γ = +2.", false, "γ = 60/(−30) = −2, image renversée."],
    ],
  ),
  q("lens-bis", 5, "Un objet à l’infini hors de l’axe forme son image…", [
    [
      "Dans le plan focal image.",
      true,
      "Chaque direction incidente converge vers un point de ce plan.",
    ],
    [
      "Toujours exactement au foyer F′.",
      false,
      "F′ correspond à la direction parallèle à l’axe.",
    ],
    [
      "Réelle pour la lentille convergente.",
      true,
      "Les rayons convergent effectivement.",
    ],
  ]),
  q("afocal", 5, "Une lunette astronomique de Kepler est afocale si…", [
    [
      "F′₁ = F₂.",
      true,
      "L’image de l’objectif est dans le plan focal objet de l’oculaire.",
    ],
    [
      "O₁O₂ = f′₁+f′₂.",
      true,
      "C’est la conséquence géométrique pour deux convergentes.",
    ],
    ["F′₁ = F′₂.", false, "Il faut le foyer objet de l’oculaire."],
    [
      "L’image intermédiaire est à l’infini.",
      false,
      "C’est l’image finale ; l’image intermédiaire est réelle à distance finie.",
    ],
  ]),
  q("afocal-bis", 5, "Pour construire un faisceau hors axe dans une lunette…", [
    [
      "Le rayon passant par O₁ définit B₁ dans le plan focal.",
      true,
      "Il n’est pas dévié par la première lentille.",
    ],
    [
      "Le rayon B₁O₂ donne la direction de sortie.",
      true,
      "Il traverse le centre de l’oculaire sans déviation.",
    ],
    [
      "Tous les rayons incidents doivent passer par O₁ et O₂.",
      false,
      "Un faisceau comporte plusieurs trajets ; chaque lentille dévie en général les rayons.",
    ],
  ]),
  q("magnification", 5, "Une lunette 70/900 avec oculaire de 10 mm donne…", [
    ["G = 90.", true, "900/10 = 90."],
    ["G = 7.", false, "70 mm est le diamètre, pas la focale."],
    [
      "Une image renversée dans le modèle à deux convergentes.",
      true,
      "Le rapport des angles orientés est négatif.",
    ],
  ]),
  q(
    "magnification-bis",
    5,
    "On remplace l’oculaire de 20 mm par un de 5 mm, même objectif…",
    [
      [
        "Le grossissement est multiplié par 4.",
        true,
        "G est inversement proportionnel à f′₂.",
      ],
      [
        "Le diamètre de l’objectif augmente.",
        false,
        "L’objectif reste le même.",
      ],
      [
        "Le pouvoir de résolution dû à la diffraction est automatiquement multiplié par 4.",
        false,
        "Il dépend de λ et du diamètre de l’objectif.",
      ],
    ],
  ),
  q("resolution", 5, "Un détail de 7 cm est à 280 m, ε = 3×10⁻⁴ rad…", [
    ["α ≈ 2,5×10⁻⁴ rad.", true, "0,07/280."],
    ["Il est résolu à l’œil nu selon ce seuil.", false, "α < ε."],
    [
      "G = 15 suffit selon le seul critère de l’œil.",
      true,
      "Gα = 3,75×10⁻³ rad > ε.",
    ],
  ]),
  q(
    "resolution-bis",
    5,
    "Deux étoiles sont séparées à G = 100 mais pas à G = 50. ε = 3×10⁻⁴ rad. Alors…",
    [
      ["3×10⁻⁶ < α ≤ 6×10⁻⁶ rad.", true, "100α > ε et 50α ≤ ε."],
      [
        "α = 3×10⁻⁴ rad forcément.",
        false,
        "On encadre α, on ne connaît pas une valeur unique.",
      ],
      [
        "La diffraction de l’instrument peut aussi limiter l’observation.",
        true,
        "Le critère oculaire n’est pas la seule contrainte.",
      ],
    ],
  ),
  q(
    "uncertainty",
    5,
    "Une mesure m = (103 ± 2) µm est comparée à une référence exacte de 100 µm…",
    [
      ["z = 1,5.", true, "|103−100|/2."],
      ["Elle est compatible au critère z ≤ 2.", true, "1,5 ≤ 2."],
      [
        "La compatibilité prouve que la valeur vraie est 100 µm.",
        false,
        "Une compatibilité ne démontre pas une identité exacte.",
      ],
    ],
  ),
  q(
    "uncertainty-bis",
    5,
    "Pour une moyenne de N mesures indépendantes d’écart-type s…",
    [
      [
        "u(moyenne) = s/√N.",
        true,
        "L’incertitude sur la moyenne décroît ainsi.",
      ],
      ["u(moyenne) = s/N.", false, "La racine est nécessaire."],
      [
        "Les erreurs systématiques sont nécessairement supprimées.",
        false,
        "La répétition ne supprime pas un biais commun.",
      ],
    ],
  ),
];
export function gradeQuiz(selected, choices) {
  const expected = choices
    .map((c, i) => (c.correct ? i : -1))
    .filter((i) => i >= 0);
  return (
    selected.length === expected.length &&
    expected.every((i) => selected.includes(i))
  );
}
