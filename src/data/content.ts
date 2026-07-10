// -----------------------------------------------------------------------------
// Single source of truth for every view (Lobby, Poker, Chess, Straight).
// Edit here and all three "tables" update.
// -----------------------------------------------------------------------------

export type PlayingCard = { rank: string; suit: '♠' | '♥' | '♦' | '♣' }

export interface Project {
  id: string
  name: string
  tagline: string
  blurb: string // 1–2 sentence plain-English summary
  highlights: string[] // resume-grade bullet points
  stack: string[]
  period: string
  repo?: string
  demo?: string
  image?: string // real screenshot / GIF shown in the modal & classic card
  featured: boolean
  // Poker flavor
  card: PlayingCard // the card this project is dealt as
  handRank: string // e.g. "Royal Flush" — a playful strength label
  // Chess flavor
  phase: 'opening' | 'midgame' | 'endgame'
  piece: '♟' | '♞' | '♝' | '♜' | '♛' | '♚'
}

export interface Experience {
  role: string
  org: string
  location: string
  period: string
  bullets: string[]
  current?: boolean
}

export const profile = {
  name: 'Aakash Shahani',
  initials: 'AS',
  pronouns: 'he/him',
  tagline: 'Builder of ML systems, real-time pipelines & AI agents.',
  // A short, sharp intro used on the Straight view.
  intro:
    'Computer Science grad from the University of South Florida. I build production-grade ML and data systems — real-time streaming pipelines, agentic RAG platforms, fraud models, and AI agents that reason under uncertainty. I care about rigor: honest evaluation, leakage-free pipelines, tests that fail on the right things.',
  location: 'Tampa, FL',
  email: 'aakashs@usf.edu',
  phone: '863-616-3789',
  github: 'https://github.com/aakashshahani',
  githubUser: 'aakashshahani',
  linkedin: 'https://linkedin.com/in/aakash-shahani',
  // Poker/chess flavor lines used across themed views
  pokerLine: 'Reads the table. Plays the long game. Folds the ego, not the hand.',
  chessLine: 'Thinks in openings, midgames, and endgames — on and off the board.',
}

// Three role-targeted resumes, each a downloadable PDF in /public/resumes.
export const resumes = [
  {
    id: 'swe',
    label: 'Software Engineer',
    file: '/resumes/Aakash_Shahani_SWE.pdf',
    blurb: 'Backend, distributed systems, infra.',
  },
  {
    id: 'ds',
    label: 'Data Scientist',
    file: '/resumes/Aakash_Shahani_DS.pdf',
    blurb: 'ML, experimentation, statistics.',
  },
  {
    id: 'de',
    label: 'Data Engineer',
    file: '/resumes/Aakash_Shahani_DE.pdf',
    blurb: 'Pipelines, streaming, warehousing.',
  },
] as const

export const experience: Experience[] = [
  {
    role: 'ML Research Assistant',
    org: 'CSSAI Lab, University of South Florida',
    location: 'Tampa, FL',
    period: 'Oct 2025 — Present',
    current: true,
    bullets: [
      'Benchmarking 3 model families (fine-tuned RoBERTa, a GPT-class model via the OpenAI Batch API, and few-shot LLaMA 3 on Groq) to classify negotiation-dialogue behavior per turn, validated against a human-labeled gold set at Cohen’s κ 0.76 across 1,030 turns.',
      'Built a reproducible batch-inference and evaluation harness (versioned JSONL pipelines, automated scoring) with a PhD mentor and a graduate researcher for model comparisons and ablations across 1,000+ labeled turns.',
    ],
  },
  {
    role: 'AI Research Assistant',
    org: 'University of South Florida',
    location: 'Tampa, FL',
    period: 'Aug 2024 — Apr 2025',
    bullets: [
      'Engineered an end-to-end bioinformatics pipeline pulling protein sequences from the UniProt REST API and applying MMseqs2 clustering at a 30% similarity threshold to cut redundancy and build a diverse training set.',
      'Designed and trained an LSTM binding-site classifier (BCE loss, Adam + grid search, dropout, LR scheduling), benchmarking against CLAPE-SMB and SCRIBER with k-fold cross-validation.',
    ],
  },
]

export const education = {
  school: 'University of South Florida',
  degree: 'B.S. in Computer Science',
  location: 'Tampa, FL',
  period: 'Graduated Dec 2025',
  coursework: [
    'Data Structures & Algorithms',
    'Operating Systems',
    'Computer Architecture',
    'Distributed Systems',
    'Database Design',
    'Big Data Storage & Analysis',
    'Software Testing',
    'Probability & Statistics',
  ],
}

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Languages',
    items: ['Python', 'Go', 'C/C++', 'Java', 'TypeScript', 'SQL', 'Bash'],
  },
  {
    group: 'Backend & Distributed',
    items: [
      'FastAPI',
      'Node / Next.js',
      'Apache Kafka',
      'Apache Spark',
      'Redis',
      'WebSockets',
      'gRPC / REST',
      'System design',
    ],
  },
  {
    group: 'ML & Data',
    items: [
      'PyTorch',
      'XGBoost',
      'scikit-learn',
      'pandas',
      'SHAP',
      'RAG',
      'LLM / Anthropic APIs',
      'FAISS / pgvector',
    ],
  },
  {
    group: 'Cloud & DevOps',
    items: [
      'AWS',
      'Azure',
      'Docker',
      'Kubernetes',
      'GitHub Actions',
      'Prometheus / Grafana',
      'Linux',
    ],
  },
  {
    group: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'pgvector', 'Parquet'],
  },
]

export const projects: Project[] = [
  {
    id: 'pokersim',
    name: 'PokerSim',
    tagline: 'A platform for evaluating AI agents under hidden information.',
    blurb:
      'A poker table where the players are AI agents that reason out loud and call real math tools. The same engine also runs a sealed-bid auction — and recovers known game theory, proving it measures strategy, not just poker.',
    highlights: [
      'Built a platform (not a bot): the same agent + evaluation machinery drives Texas Hold’em and a sealed-bid auction, and recovers game theory (truthful bidding wins second-price, shading wins first-price).',
      'Engineered a real tool-calling (ReAct) LLM agent that decides which tools to call — equity, pot odds, opponent reads — and chains them, with every action validated and clamped to a legal move.',
      'Scored play honestly: bb/100 with 95% confidence intervals, duplicate-hand variance reduction, and an Elo ladder; flags rate-limited runs as untrustworthy instead of reporting noise.',
      'Shipped a live web table you can play against the AI with a coach in your ear. 88 tests, 88% coverage, CI green. Free to run on local models.',
    ],
    stack: ['Python', 'LangGraph', 'FastAPI', 'pokerkit', 'WebSockets', 'Ollama'],
    period: '2025',
    repo: 'https://github.com/aakashshahani/pokersim',
    image: '/projects/pokersim.webp',
    featured: true,
    card: { rank: 'A', suit: '♠' },
    handRank: 'Royal Flush',
    phase: 'endgame',
    piece: '♚',
  },
  {
    id: 'scholarlens',
    name: 'ScholarLens',
    tagline: 'Agentic RAG platform that finds contradictions across papers.',
    blurb:
      'A full-stack research platform that decomposes papers into claims and flags contradictions using a two-stage retriever plus an LLM judge — deployed live with multi-user isolation.',
    highlights: [
      'Architected an agentic RAG platform that decomposes papers into claims and flags contradictions via a two-stage BM25 + dense pre-filter and an LLM judge, hitting macro-F1 0.788 / κ 0.683 while cutting ~4,500 pairwise LLM calls by over 90%.',
      'Eliminated ~400MB of torch memory that was OOM-crashing a 512MB host by selecting the embedding model on measured class separation and migrating to a hosted embedding API.',
      'Ran 6 analyses per paper concurrently for a 5× speedup at equal API cost; served pgvector (HNSW) search behind a cross-encoder reranker at nDCG@5 0.98, with Fernet-encrypted keys.',
    ],
    stack: ['FastAPI', 'Next.js', 'pgvector', 'Anthropic API', 'BM25', 'Docker'],
    period: 'May 2026 — Present',
    repo: 'https://github.com/aakashshahani/ScholarLens',
    demo: 'https://scholarlens-research.vercel.app',
    image: '/projects/scholarlens.webp',
    featured: true,
    card: { rank: 'K', suit: '♦' },
    handRank: 'Straight Flush',
    phase: 'endgame',
    piece: '♛',
  },
  {
    id: 'tradepulse',
    name: 'TradePulse',
    tagline: 'Real-time streaming pipeline with exactly-once guarantees.',
    blurb:
      'Ingests live Coinbase trades through Kafka into Spark Structured Streaming, producing 1-minute OHLC candles with exactly-once guarantees — proven by a mid-stream crash test with zero duplicates.',
    highlights: [
      'Ingested live Coinbase trades through a 6-partition Kafka topic into 1-minute OHLC candles in Spark Structured Streaming; guaranteed exactly-once output via event-time watermarks and idempotent writes (0 duplicate candles on a mid-stream crash test).',
      'Sustained sub-second 600–800ms micro-batches under ~1,500 rows/sec bursts across 9 Dockerized services with a dead-letter queue, checkpoint recovery, and Prometheus/Grafana observability.',
      'Validated by 20 tests (incl. a Testcontainers integration test) in GitHub Actions CI.',
    ],
    stack: ['Kafka', 'Spark Streaming', 'PostgreSQL', 'Docker', 'Grafana', 'Prometheus'],
    period: 'Mar — May 2026',
    repo: 'https://github.com/aakashshahani/tradepulse',
    image: '/projects/tradepulse.gif',
    featured: true,
    card: { rank: 'Q', suit: '♣' },
    handRank: 'Four of a Kind',
    phase: 'midgame',
    piece: '♜',
  },
  {
    id: 'fraudguard',
    name: 'FraudGuard',
    tagline: 'Leakage-free, end-to-end ML fraud detection.',
    blurb:
      'A fraud classifier on 590K IEEE-CIS transactions built under a pre-registered protocol with strict leakage controls, reaching ~15× the base-rate PR-AUC on a hold-out scored exactly once.',
    highlights: [
      'Built a leakage-free pipeline on 590K IEEE-CIS transactions (3.5% fraud) with a strict temporal split, reconstructed client identities, and point-in-time aggregation — each enforced by a failing test; reached 0.53 PR-AUC (~15× baseline) on a hold-out scored once.',
      'Used SHAP to confirm 95% of model signal traces to real transaction content, and tuned a cost-based threshold catching 63% of fraud.',
      'Deployed a FastAPI service with a training-serving skew test verifying parity across all 438 features; containerized and validated by 24 tests in CI.',
    ],
    stack: ['XGBoost', 'SHAP', 'FastAPI', 'imbalanced-learn', 'W&B', 'Docker'],
    period: 'Jan — Feb 2026',
    repo: 'https://github.com/aakashshahani/fraudguard',
    image: '/projects/fraudguard.webp',
    featured: false,
    card: { rank: 'J', suit: '♥' },
    handRank: 'Full House',
    phase: 'midgame',
    piece: '♝',
  },
  {
    id: 'newsrec',
    name: 'NewsRec',
    tagline: 'Cold-start news recommender that beats ID-based baselines.',
    blurb:
      'A content-based two-tower retriever on the MIND dataset that solves cold-start with text embeddings, beating ID-based baselines by +0.124 AUC and serving candidates at 2.8ms p99.',
    highlights: [
      'Trained a content-based two-tower retriever on the MIND dataset that beat ID-based baselines by +0.124 AUC (~23%) across 73,152 impressions by embedding article text to solve cold-start.',
      'Ran an A/B replay that lifted simulated click-through from 10.5% to 18.8% (+80%, 95% CI [+7.9, +8.9] pts).',
      'Served candidate generation at 2.8ms p99 over 3,000 users by precomputing item vectors into a FAISS HNSW index so the request path never loads a model; Docker + 17 tests in CI.',
    ],
    stack: ['PyTorch', 'FAISS', 'FastAPI', 'PyArrow', 'Docker'],
    period: 'Jul 2026',
    repo: 'https://github.com/aakashshahani/newsrec',
    image: '/projects/newsrec.webp',
    featured: false,
    card: { rank: '10', suit: '♠' },
    handRank: 'Flush',
    phase: 'midgame',
    piece: '♞',
  },
]

// Career as a real chess game — the Ruy Lopez (a.k.a. "The Spanish"): a
// principled, classical opening. Each half-move maps to a milestone, with
// chess annotations (! good, !! brilliant) on the strongest results.
export type Annotation = '' | '!' | '!!' | '?!'
export interface CareerMove {
  no: string // "1.", "1...", etc.
  move: string // algebraic notation
  side: 'w' | 'b'
  note: string
  annotation?: Annotation
  phase: 'opening' | 'midgame' | 'endgame'
  projectId?: string // links a move to a project (for click-to-scroll)
}

export const openingName = 'The Ruy Lopez'
export const careerMoves: CareerMove[] = [
  { no: '1.', move: 'e4', side: 'w', note: 'Enrolled — B.S. Computer Science, University of South Florida', phase: 'opening' },
  { no: '1…', move: 'e5', side: 'b', note: 'AI Research Assistant — bioinformatics ETL + an LSTM binding-site classifier', phase: 'opening' },
  { no: '2.', move: 'Nf3', side: 'w', note: 'FraudGuard — leakage-free fraud ML, ~15× base-rate PR-AUC', annotation: '!', phase: 'midgame', projectId: 'fraudguard' },
  { no: '2…', move: 'Nc6', side: 'b', note: 'TradePulse — exactly-once real-time streaming pipeline', annotation: '!', phase: 'midgame', projectId: 'tradepulse' },
  { no: '3.', move: 'Bb5', side: 'w', note: 'NewsRec — cold-start recommender, +0.124 AUC over baselines', phase: 'midgame', projectId: 'newsrec' },
  { no: '3…', move: 'a6', side: 'b', note: 'ML Research Assistant @ CSSAI Lab — negotiation-behavior classification', annotation: '!', phase: 'endgame' },
  { no: '4.', move: 'Ba4', side: 'w', note: 'ScholarLens — agentic RAG platform, macro-F1 0.788, deployed live', annotation: '!!', phase: 'endgame', projectId: 'scholarlens' },
  { no: '4…', move: 'Nf6', side: 'b', note: 'PokerSim — AI agents reasoning under hidden information', annotation: '!!', phase: 'endgame', projectId: 'pokersim' },
  { no: '5.', move: 'O-O', side: 'w', note: 'Castled — graduated Dec 2025, playing for the win', phase: 'endgame' },
]

// A chess.com-style rating curve for the "Endgame" — trajectory, not literal Elo.
export const ratingCurve: { label: string; rating: number; note: string }[] = [
  { label: '’22', rating: 1200, note: 'Started CS' },
  { label: '’24', rating: 1520, note: 'First research role' },
  { label: '’25', rating: 1810, note: 'Graduated + shipped projects' },
  { label: '’26', rating: 2050, note: 'Research + flagship builds' },
]

// Current research — shown as "the hand still in play" / the endgame in progress.
export const currentWork = {
  title: 'Negotiation Behavior & Cue Classification',
  org: 'CSSAI Lab @ USF',
  status: 'In progress',
  blurb:
    'AI-assisted negotiation-coaching research: classifying strategic-adaptation cues turn-by-turn against the Heunis et al. (2024) framework, benchmarking fine-tuned RoBERTa, GPT, and LLaMA 3, and validating against human annotation at κ 0.76 over 1,030 dialogue turns.',
  tags: ['Research', 'LLMs', 'Human eval', 'RoBERTa / GPT / LLaMA 3'],
}
