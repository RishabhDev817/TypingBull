export interface PracticePassage {
  id: string;
  title: string;
  category: string;
  text: string;
  lineEstimate?: number;
}

export interface PracticeLevel {
  level: number;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  type: 'story' | 'stamina-essay';
  icon: string;
  targetWPM: number;
  color: string;
  passages: PracticePassage[];
}

export const PRACTICE_LEVELS: PracticeLevel[] = [
  // ─── Level 1: Storytelling (Short Fable) ──────────────────────────
  {
    level: 1,
    name: 'Level 1: The Whispering Valley',
    tagline: 'Pastoral Fable & Cadence',
    description: 'A gentle narrative introducing fundamental sentence flow, clean spacing, and standard punctuation.',
    badge: 'Beginner • Story',
    type: 'story',
    icon: '🌱',
    targetWPM: 30,
    color: '#10B981',
    passages: [
      {
        id: 'l1-p1',
        title: 'Morning in the Valley',
        category: 'Storytelling',
        text: 'The morning sun rose gently over the emerald hills, painting the river with strokes of liquid gold. In the meadow below, a young deer paused by the edge of the crystal spring, listening to the melodic songs of early robins. Every pine needle glistened with dew, and a quiet breeze carried the sweet scent of wild honeysuckle through the tranquil forest trail.',
      },
      {
        id: 'l1-p2',
        title: 'The Orchard Path',
        category: 'Storytelling',
        text: 'Along the winding stone wall of the old orchard, sweet apples hung heavy on mossy boughs. Thomas carried a willow basket in his left hand, whistling a cheerful melody as autumn leaves danced around his boots. The afternoon air was crisp and refreshing, promising warm cider and crackling hearth fires as twilight approached.',
      },
    ],
  },

  // ─── Level 2: Storytelling (Craftsmanship & Dialogue) ────────────
  {
    level: 2,
    name: 'Level 2: The Clockmaker of Prague',
    tagline: 'Narrative Detail & Dialogue',
    description: 'An engaging story featuring dialogue quotes, commas, hyphens, and rhythmic punctuation.',
    badge: 'Novice • Story',
    type: 'story',
    icon: '🕰️',
    targetWPM: 34,
    color: '#06B6D4',
    passages: [
      {
        id: 'l2-p1',
        title: 'The Clockmaker’s Loupe',
        category: 'Storytelling',
        text: 'Inside the timber workshop, dozens of polished brass pendulums swung in soothing harmony. Master Joseph adjusted his jeweler loupe and gently placed a ruby escapement into the celestial clockwork. "Patience," he whispered to his young apprentice, "is the invisible gear that holds every true masterpiece together." Outside on the cobbled street, snow began to fall upon the medieval rooftops.',
      },
      {
        id: 'l2-p2',
        title: 'The Silver Music Box',
        category: 'Storytelling',
        text: 'On the cedar workbench lay an antique silver music box adorned with delicate swallows. When Joseph turned the miniature brass key, a cascade of pure, resonant notes filled the room like shimmering raindrops. "Listen closely," he remarked with a warm smile, "for each vibration tells the story of the artisan who carved it over two centuries ago."',
      },
    ],
  },

  // ─── Level 3: Storytelling (Maritime Adventure) ──────────────────
  {
    level: 3,
    name: 'Level 3: The Siren Reef Lighthouse',
    tagline: 'Maritime Adventure & Elements',
    description: 'A sea tale with stormy atmosphere, dramatic pacing, and varied sentence structures.',
    badge: 'Intermediate • Story',
    type: 'story',
    icon: '🌊',
    targetWPM: 38,
    color: '#3B82F6',
    passages: [
      {
        id: 'l3-p1',
        title: 'The Keeper’s Vigil',
        category: 'Maritime Story',
        text: 'High atop the granite tower, Captain Caleb stared out across the churn of Siren Reef. Dark thunderclouds tumbled over the horizon, yet the giant prism lens threw a steady, golden beam five leagues into the darkness. "Keep your watch true," Caleb reminded himself, tightening his wool collar against the salt spray. A distant schooner answered with a single whistle blast of gratitude.',
      },
      {
        id: 'l3-p2',
        title: 'Calm After the Gale',
        category: 'Maritime Story',
        text: 'By sunrise, the ferocious storm had surrendered to glass-like waters of cerulean blue. White gulls circled lazily around the iron balcony, dipping toward the gentle swells below. Caleb polished the brass reflectors until they gleamed like polished mirrors, confident that every passing sailor would find safe passage along the rugged northern coastline.',
      },
    ],
  },

  // ─── Level 4: Storytelling (Exploration & Travel) ────────────────
  {
    level: 4,
    name: 'Level 4: The Cartographer of Alexandria',
    tagline: 'Historical Exploration & Lore',
    description: 'Rich descriptive narrative introducing historical terms, geographical names, and compound sentences.',
    badge: 'Intermediate • Adventure',
    type: 'story',
    icon: '🗺️',
    targetWPM: 42,
    color: '#6366F1',
    passages: [
      {
        id: 'l4-p1',
        title: 'The Uncharted Archipelago',
        category: 'Historical Fiction',
        text: 'In the grand library of Alexandria, parchment scrolls lay unfurled beneath hanging oil lamps. Helena dipped her reed pen into sepia ink, tracing the mysterious coastlines of an uncharted eastern archipelago. With compass and brass divider in hand, she calculated celestial latitudes by the light of the North Star, mapping islands where ancient navigators spoke of coral lagoons and fragrant cinnamon groves.',
      },
    ],
  },

  // ─── Level 5: Storytelling (The Cloud Forest) ────────────────────
  {
    level: 5,
    name: 'Level 5: The Cloud Forest Expedition',
    tagline: 'Descriptive Ecology & Prose',
    description: 'Atmospheric narrative with complex clauses, sensory imagery, and botanical vocabulary.',
    badge: 'Advanced • Narrative',
    type: 'story',
    icon: '🌿',
    targetWPM: 46,
    color: '#8B5CF6',
    passages: [
      {
        id: 'l5-p1',
        title: 'Canopy of the Quetzal',
        category: 'Expedition Tale',
        text: 'The highland mist drifted through the jungle canopy like spun silver thread. Maya adjusted her camera lens and stepped across a moss-covered root bridge suspended over the rushing ravine. Suddenly, a brilliant flash of emerald and crimson feathers darted across the ferns—the resplendent quetzal had appeared, its long emerald tail feathers trailing like silk banners through the moist mountain breeze.',
      },
    ],
  },

  // ─── Level 6: Storytelling (The Starlight Express) ───────────────
  {
    level: 6,
    name: 'Level 6: The Starlight Express',
    tagline: 'Rhythmic Mechanical Prose',
    description: 'High-speed literary prose simulating mechanical cadence, tempo changes, and narrative acceleration.',
    badge: 'Advanced • Prose',
    type: 'story',
    icon: '🚂',
    targetWPM: 50,
    color: '#A855F7',
    passages: [
      {
        id: 'l6-p1',
        title: 'Midnight Crossing',
        category: 'Literary Prose',
        text: 'The heavy steel locomotive roared across the mountain trestle bridge, its coal furnace glowing like molten magma in the midnight frost. Wheels clicked in relentless, mesmerizing cadence over the iron rails: clack-clack, clack-clack. Inside the mahogany dining carriage, brass lanterns swayed gently while travelers sipped black tea, gazing at distant alpine constellations reflected on frozen alpine lakes below.',
      },
    ],
  },

  // ─── Level 7: Massive Stamina Essay (Neuroscience & Cognition) ───
  {
    level: 7,
    name: 'Level 7: Cognitive Neuroplasticity',
    tagline: 'Massive Stamina Essay (20+ Lines)',
    description: 'A dense, long academic essay on neural network remodeling, synaptic plasticity, and executive function.',
    badge: 'Stamina • 20+ Lines',
    type: 'stamina-essay',
    icon: '🧠',
    targetWPM: 52,
    color: '#EC4899',
    passages: [
      {
        id: 'l7-p1',
        title: 'Synaptic Adaptation and Executive Neurobiology',
        category: 'Cognitive Neuroscience',
        lineEstimate: 22,
        text: 'The human brain represents one of the most sophisticated self-modifying dynamic systems in biological science. Historically viewed as a static, hardwired organ following adolescence, contemporary neuroimaging—specifically high-resolution functional magnetic resonance imaging (fMRI) and diffusion tensor tractography—has decisively demonstrated that structural neuroplasticity persists across the entire human lifespan.\n\nAt the cellular level, long-term potentiation (LTP) serves as the primary electrophysiological substrate for memory consolidation and skill acquisition. When pre-synaptic axons undergo repetitive high-frequency stimulation, glutamate receptors—predominantly AMPA and NMDA ionotropic channels—experience coordinated upregulation along the post-synaptic density. This biochemical cascade promotes dendritic spine enlargement, increases local synaptic conductance, and accelerates intracellular calcium influx, ultimately modulating gene transcription factors such as CREB.\n\nFurthermore, the prefrontal cortex mediates executive functioning through reciprocal dopaminergic and noradrenergic projections connected with the striatum and thalamus. When an individual engages in deliberate, high-repetition motor training—such as touch typing or musical instrument mastery—cortical representations within the primary somatosensory cortex undergo quantifiable territorial expansion. Consequently, cognitive stamina is not an immutable genetic endowment; rather, it is a malleable neurological adaptation forged through disciplined attentional focus and systematic psychomotor repetition.',
      },
    ],
  },

  // ─── Level 8: Massive Stamina Essay (Astrophysics & Relativity) ──
  {
    level: 8,
    name: 'Level 8: Relativistic Astrophysics',
    tagline: 'Massive Stamina Essay (22+ Lines)',
    description: 'An extensive treatise exploring spacetime curvature, gravitational wave observatories, and black hole accretion disks.',
    badge: 'Stamina • 22+ Lines',
    type: 'stamina-essay',
    icon: '🔭',
    targetWPM: 55,
    color: '#F43F5E',
    passages: [
      {
        id: 'l8-p1',
        title: 'Spacetime Curvature and Gravitational Wave Astronomy',
        category: 'Astrophysical Physics',
        lineEstimate: 24,
        text: 'The theoretical formulation of general relativity by Albert Einstein in 1915 replaced Newtonian mechanical gravitation with a geometric paradigm: mass-energy curves the four-dimensional manifold of spacetime, and objects traverse geodesics within that curved continuum. For over a century, astronomical observations of perihelion precession in Mercury and gravitational deflection of starlight during total solar eclipses provided empirical validation; however, the most dramatic confirmation emerged with the direct detection of gravitational radiation.\n\nIn September 2015, the Laser Interferometer Gravitational-Wave Observatory (LIGO) recorded GW150914—an ephemeral transient ripple in spacetime generated by the inspiral and coalescence of two binary black holes possessing masses approximately 36 and 29 times that of our sun. Operating across four-kilometer baseline arms, LIGO’s Michelson-type laser interferometers detected spatial strain displacements on the order of 10^-21 meters, an infinitesimal perturbation smaller than one ten-thousandth the diameter of a single proton.\n\nBeyond gravitational wave detection, the Event Horizon Telescope (EHT) successfully resolved the millimeter-wavelength shadow of the supermassive black hole at the core of galaxy Messier 87 (M87*), measuring an estimated mass of 6.5 billion solar equivalents. The surrounding relativistic accretion disk exhibits profound Doppler beaming and frame-dragging effects, corroborating Kerr metric solutions. These monumental scientific milestones confirm that the cosmos is an intensely dynamic tapestry governed by elegant mathematical principles.',
      },
    ],
  },

  // ─── Level 9: Massive Stamina Essay (Computer Science & Cryptography) ─
  {
    level: 9,
    name: 'Level 9: Distributed Computing & Cryptography',
    tagline: 'Massive Stamina Essay (24+ Lines)',
    description: 'A deep exploration of consensus protocols, Byzantine fault tolerance, zero-knowledge proofs, and distributed systems.',
    badge: 'Stamina • 24+ Lines',
    type: 'stamina-essay',
    icon: '💻',
    targetWPM: 58,
    color: '#D97706',
    passages: [
      {
        id: 'l9-p1',
        title: 'Consensus Architectures and Cryptographic Primitives',
        category: 'Computer Science',
        lineEstimate: 25,
        text: 'Modern distributed computational architectures must balance three irreconcilable guarantees described by Eric Brewer’s CAP theorem: consistency, availability, and partition tolerance. In adversarial decentralized topologies where network nodes communicate over asynchronous and potentially compromised channels, achieving state consensus requires mathematically rigorous fault-tolerant protocols. The classical Byzantine Generals Problem demonstrates that without cryptographic signing primitives, no deterministic consensus protocol can tolerate more than one-third malicious participants.\n\nTo overcome these limitations, contemporary consensus engines deploy hybrid paradigms combining leader-based state machine replication—such as the Raft and Paxos algorithms—with threshold cryptographic signatures. In high-throughput decentralized ledgers, Proof-of-Stake (PoS) protocols employ verifiable random functions (VRFs) and Casper-style slashing conditions to disincentivize equivocation and long-range reorganization attacks, guaranteeing deterministic finality within bounded epoch intervals.\n\nConcurrently, the development of non-interactive zero-knowledge succinct arguments of knowledge (zk-SNARKs) and polynomial commitment schemes (such as KZG commitments) has revolutionized both privacy and vertical scalability. By offloading resource-intensive state transition computations to off-chain provers who generate succinct mathematical validity certificates, decentralized networks can verify thousands of transactions per second on resource-constrained verifier hardware. Thus, computer science bridges pure number theory with global socioeconomic coordination.',
      },
    ],
  },

  // ─── Level 10: Massive Stamina Essay (Oceanography & Ecosystems) ──
  {
    level: 10,
    name: 'Level 10: Deep-Sea Oceanography',
    tagline: 'Massive Stamina Essay (26+ Lines)',
    description: 'An expansive essay on the global thermohaline conveyor, hydrothermal vent ecology, and oceanic carbon sequestration.',
    badge: 'Stamina • 26+ Lines',
    type: 'stamina-essay',
    icon: '🐋',
    targetWPM: 60,
    color: '#0D9488',
    passages: [
      {
        id: 'l10-p1',
        title: 'The Oceanic Conveyor and Chemosynthetic Abyssal Ecosystems',
        category: 'Marine Oceanography',
        lineEstimate: 26,
        text: 'Covering more than seventy percent of Earth’s surface, the global ocean operates as the primary planetary thermoregulatory engine. The Atlantic Meridional Overturning Circulation (AMOC)—a vital component of the global thermohaline conveyor belt—transports warm, saline surface waters from the equatorial tropics toward subpolar northern latitudes. As these water masses release latent thermal energy into the atmosphere, evaporative cooling and sea-ice brine rejection dramatically increase local fluid density, triggering deep convection and the formation of North Atlantic Deep Water (NADW).\n\nIn the abyssal benthic zones descending four thousand meters below the photic epipelagic layer, hydrostatic pressure exceeds four hundred atmospheres, and temperatures hover barely above freezing. Despite absolute darkness, hydrothermal vent systems discovered along mid-ocean ridge spreading axes support thriving endemic biological communities completely independent of solar photosynthesis. Chemolithoautotrophic bacteria utilize hydrogen sulfide, methane, and dissolved iron venting from submarine fissures to synthesize organic macromolecules through sulfur oxidation.\n\nThese primary producers form the obligate trophic base supporting giant vestimentiferan tube worms (Riftia pachyptila), bathymodiolin mussels, and blind vent shrimp harboring symbiotic sulfur-oxidizing endosymbionts. Concurrently, the biological carbon pump continually transfers particulate organic carbon from euphotic surface waters into deep sedimentary reservoirs, sequestering gigatons of atmospheric carbon dioxide over millennial epochs. Preserving the integrity of these oceanic biogeochemical cycles is imperative for maintaining global climatic equilibrium.',
      },
    ],
  },

  // ─── Level 11: Massive Stamina Essay (Macroeconomics & Finance) ──
  {
    level: 11,
    name: 'Level 11: Macroeconomic Equilibrium',
    tagline: 'Massive Stamina Essay (28+ Lines)',
    description: 'A dense analytical investigation into sovereign monetary policy, inflation vectors, and global currency dynamics.',
    badge: 'Stamina • 28+ Lines',
    type: 'stamina-essay',
    icon: '📊',
    targetWPM: 62,
    color: '#4F46E5',
    passages: [
      {
        id: 'l11-p1',
        title: 'Monetary Architecture, Yield Curve Inversion, and Liquidity Shocks',
        category: 'Macroeconomic Theory',
        lineEstimate: 28,
        text: 'The orchestration of sovereign monetary policy operates through the delicate transmission mechanism linking central bank policy rates, commercial bank reserve requirements, and open-market asset operations. In the aftermath of extraordinary quantitative easing regimens, central banks must navigate complex balance-sheet runoff protocols while anchoring medium-term inflation expectations to statutory targets. When short-term policy yields exceed long-term sovereign bond yields, the resulting inverted yield curve historically signals structural liquidity contractions and impending macroeconomic deceleration.\n\nSimultaneously, international currency exchange dynamics are governed by interest rate parity conditions and purchasing power differentials. Under the Mundell-Fleming trilemma (the open-economy macroeconomic trilemma), sovereign nations cannot simultaneously maintain a fixed foreign exchange rate, free capital mobility, and an autonomous monetary policy. Consequently, developing market economies facing foreign debt obligations denominated in reserve currencies often experience severe balance-of-payments vulnerability during episodes of rapid global monetary tightening.\n\nFurthermore, modern portfolio theory and capital asset pricing models (CAPM) must continuously adapt to exogenous geopolitical disruptions, supply chain re-shoring, and energy transition expenditures. As financial institutions integrate algorithmic high-frequency market-making protocols and collateralized debt derivatives into automated liquidity frameworks, systemic counterparty risk demands transparent regulatory capitalization ratios. True economic stability requires harmonious synchronization between fiscal stimulus measures and prudent central banking oversight.',
      },
    ],
  },

  // ─── Level 12: Massive Stamina Essay (Philosophy of Science) ─────
  {
    level: 12,
    name: 'Level 12: Epistemology & Quantum Mechanics',
    tagline: 'The Grandmaster Stamina Essay (30 Lines)',
    description: 'The ultimate typing endurance test: a 30-line philosophical and scientific exploration of quantum indeterminacy and epistemology.',
    badge: 'Grandmaster • 30 Lines',
    type: 'stamina-essay',
    icon: '🏛️',
    targetWPM: 65,
    color: '#7C3AED',
    passages: [
      {
        id: 'l12-p1',
        title: 'Epistemological Foundations, Falsification, and Quantum Indeterminacy',
        category: 'Philosophy of Science',
        lineEstimate: 30,
        text: 'The trajectory of human scientific inquiry has been characterized by a perpetual tension between strict empirical inductivism and theoretical rationalism. In his foundational treatise on the logic of scientific discovery, philosopher Karl Popper demonstrated that no finite quantity of corroborating empirical observations can conclusively verify an inductive hypothesis, whereas a single reproducible counterexample possesses the deductive capacity to falsify it. Science does not progress toward absolute metaphysical certitude; rather, it evolves through an iterative sequence of conjectures, refutations, and paradigm shifts as articulated by Thomas Kuhn.\n\nThis epistemological humility reached its zenith with the emergence of non-relativistic quantum mechanics in the early twentieth century. Werner Heisenberg’s uncertainty principle established an inescapable mathematical constraint on simultaneous measurements: the product of the uncertainties in a particle’s position and linear momentum cannot be less than reduced Planck’s constant divided by two. Unlike classical Newtonian determinism—which posited a clockwork universe wherein complete knowledge of initial conditions guaranteed comprehensive predictability—quantum ontology is intrinsically probabilistic.\n\nThe Copenhagen interpretation, championed by Niels Bohr, asserts that physical attributes do not exist in definite states prior to measurement; instead, quantum systems evolve according to deterministic wave equations until thermodynamic interaction with a macroscopic measurement apparatus induces wave function collapse. Alternative theoretical frameworks—including Hugh Everett’s Many-Worlds interpretation and de Broglie-Bohm pilot-wave mechanics—seek to resolve the measurement problem without invoking non-unitary state reduction. To master the art of disciplined transcription across these philosophical frontiers requires rigorous mental fortitude, unyielding stamina, and supreme cognitive precision.',
      },
    ],
  },
];

/**
 * Calculates dynamic allocated countdown time in seconds based on character count and target WPM.
 * Formula: ((totalCharacters / 5) / targetWPM) * 60 + safety buffer.
 * Minimum allocated time is 30s.
 */
export function calculateAllocatedTime(text: string, targetWPM: number): number {
  const wordCount = text.length / 5;
  const rawSeconds = (wordCount / targetWPM) * 60;
  // Provide a 15% safety buffer so challenging texts are tough but achievable without frustration
  return Math.max(30, Math.ceil((rawSeconds * 1.15) / 5) * 5);
}
