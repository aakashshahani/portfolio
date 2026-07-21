// -----------------------------------------------------------------------------
// Single source of truth for the site. Edit here and every section updates.
// -----------------------------------------------------------------------------

export interface Project {
  id: string
  name: string
  tagline: string
  blurb: string // 1–2 sentence plain-English summary
  highlights: string[] // resume-grade bullet points
  metrics: { value: string; label: string }[] // headline numbers shown on the row
  stack: string[]
  period: string
  repo?: string
  demo?: string
  image?: string // real screenshot / GIF
  featured: boolean
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
  role: 'Software & ML Engineer',
  tagline: 'Builder of ML systems, real-time pipelines & AI agents.',
  intro:
    'Computer Science grad from the University of South Florida. I build production-grade ML and data systems — real-time streaming pipelines, batch data lakehouses on AWS, agentic RAG platforms, fraud models, and AI agents that reason under uncertainty. I care about rigor: honest evaluation, leakage-free pipelines, tests that fail on the right things.',
  location: 'Tampa, FL',
  email: 'aakashs@usf.edu',
  phone: '863-616-3789',
  github: 'https://github.com/aakashshahani',
  githubUser: 'aakashshahani',
  linkedin: 'https://linkedin.com/in/aakash-shahani',
  availability: 'Open to software, ML & data roles',
}

// A single one-page resume, downloadable from /public/resumes.
export const resumes = [
  {
    id: 'resume',
    label: 'Resume',
    file: '/resumes/Aakash_Shahani_Resume.pdf',
    blurb: 'One-page overview.',
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
    group: 'Data Engineering',
    items: [
      'Apache Airflow',
      'dbt',
      'Apache Iceberg',
      'Athena / Glue',
      'Trino',
      'Great Expectations',
      'Star schema / SCD2',
    ],
  },
  {
    group: 'Cloud & DevOps',
    items: [
      'AWS (S3/Glue/Athena)',
      'Terraform',
      'Docker',
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
    id: 'scholarlens',
    name: 'ScholarLens',
    tagline: 'Agentic RAG platform that finds contradictions across papers.',
    blurb:
      'A full-stack research platform that decomposes papers into claims and flags contradictions using a two-stage retriever plus an LLM judge — deployed live with multi-user isolation.',
    highlights: [
      'Architected an agentic RAG platform that decomposes papers into claims and flags contradictions via a two-stage BM25 + dense pre-filter and an LLM judge, cutting ~4,500 pairwise LLM calls by over 90%.',
      'Eliminated ~400MB of torch memory that was OOM-crashing a 512MB host by selecting the embedding model on measured class separation and migrating to a hosted embedding API.',
      'Ran 6 analyses per paper concurrently for a 5× speedup at equal API cost; served pgvector (HNSW) search behind a cross-encoder reranker at nDCG@5 0.98, with Fernet-encrypted keys.',
    ],
    metrics: [
      { value: '0.98', label: 'nDCG@5' },
      { value: '−90%', label: 'LLM calls' },
      { value: '5×', label: 'analysis speedup' },
    ],
    stack: ['FastAPI', 'Next.js', 'pgvector', 'Anthropic API', 'BM25', 'Docker'],
    period: 'May 2026 — Present',
    repo: 'https://github.com/aakashshahani/ScholarLens',
    demo: 'https://scholarlens-research.vercel.app',
    image: '/projects/scholarlens.webp',
    featured: true,
  },
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
    metrics: [
      { value: '88%', label: 'test coverage' },
      { value: '2', label: 'game environments' },
      { value: '95%', label: 'CI on bb/100' },
    ],
    stack: ['Python', 'LangGraph', 'FastAPI', 'pokerkit', 'WebSockets', 'Ollama'],
    period: '2025',
    repo: 'https://github.com/aakashshahani/pokersim',
    image: '/projects/pokersim.webp',
    featured: true,
  },
  {
    id: 'urbanflow',
    name: 'UrbanFlow',
    tagline: 'Urban-mobility data lakehouse on AWS.',
    blurb:
      'An end-to-end batch data lakehouse: Airflow ingests NYC taxi trips and weather into Apache Iceberg tables on S3, dbt models them into a star schema, and Athena and Trino query them — deployed on real AWS with Terraform.',
    highlights: [
      'Built an end-to-end lakehouse over ~3M NYC taxi trips: Airflow orchestration (dynamic task mapping for backfills, retries, SLAs) → Apache Iceberg on S3 → dbt medallion (bronze → silver → gold star schema with an SCD Type 2 zone dimension) → Athena / Trino.',
      'Cut Athena bytes scanned 97% (4.81 MB → 0.13 MB on a single-day query) by day-partitioning the Iceberg fact table; guaranteed idempotent backfills via Iceberg MERGE, holding fact_trips at 2.87M rows with 0 duplicates across re-runs.',
      'Gated the pipeline with Great Expectations + 17 dbt tests that fail before bad data reaches gold; provisioned all AWS (S3, Glue, Athena) with Terraform and ran the same models on Athena in the cloud and Trino locally — 25 models and tests green on Athena.',
    ],
    metrics: [
      { value: '−97%', label: 'Athena bytes scanned' },
      { value: '2.87M', label: 'trips modeled' },
      { value: '0', label: 'dupes on backfill' },
    ],
    stack: ['Apache Airflow', 'dbt', 'Apache Iceberg', 'AWS (S3/Glue/Athena)', 'Trino', 'Terraform', 'Great Expectations'],
    period: 'Jul 2026',
    repo: 'https://github.com/aakashshahani/urbanflow',
    image: '/projects/urbanflow.png',
    featured: true,
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
    metrics: [
      { value: '0', label: 'dupes on crash test' },
      { value: '~700ms', label: 'micro-batches' },
      { value: '9', label: 'services' },
    ],
    stack: ['Kafka', 'Spark Streaming', 'PostgreSQL', 'Docker', 'Grafana', 'Prometheus'],
    period: 'Mar — May 2026',
    repo: 'https://github.com/aakashshahani/tradepulse',
    image: '/projects/tradepulse.gif',
    featured: true,
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
    metrics: [
      { value: '15×', label: 'base-rate PR-AUC' },
      { value: '590K', label: 'transactions' },
      { value: '438', label: 'features, skew-tested' },
    ],
    stack: ['XGBoost', 'SHAP', 'FastAPI', 'imbalanced-learn', 'W&B', 'Docker'],
    period: 'Jan — Feb 2026',
    repo: 'https://github.com/aakashshahani/fraudguard',
    image: '/projects/fraudguard.webp',
    featured: false,
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
    metrics: [
      { value: '+0.124', label: 'AUC vs baseline' },
      { value: '2.8ms', label: 'p99 serving' },
      { value: '+80%', label: 'CTR in A/B replay' },
    ],
    stack: ['PyTorch', 'FAISS', 'FastAPI', 'PyArrow', 'Docker'],
    period: 'Jul 2026',
    repo: 'https://github.com/aakashshahani/newsrec',
    image: '/projects/newsrec.webp',
    featured: false,
  },
]

// The person behind the projects — journey + languages.
export const story = {
  narrative:
    'Grew up in Hong Kong, moved to Hyderabad in grade 9, came to Tampa for college. Three cities, three school systems, six languages.',
  stops: [
    {
      place: 'Hong Kong',
      label: 'Grew up',
      note: 'Spent most of my life here, switching between Cantonese, Mandarin, and English every day.',
    },
    {
      place: 'Hyderabad, India',
      label: 'Grade 9 → high school',
      note: 'Moved across the world at 14 and finished high school in a new country.',
    },
    {
      place: 'Tampa, FL',
      label: 'College → now',
      note: 'B.S. in Computer Science at USF, graduated Dec 2025. Now doing ML research at the CSSAI Lab.',
    },
  ],
  languages: [
    { name: 'English', native: 'English' },
    { name: 'Cantonese', native: '廣東話' },
    { name: 'Mandarin', native: '普通话' },
    { name: 'Hindi', native: 'हिन्दी' },
    { name: 'Sindhi', native: 'سنڌي' },
    { name: 'French', native: 'Français' },
  ],
}

// Current research — the "Now" block.
export const currentWork = {
  title: 'Negotiation Behavior & Cue Classification',
  org: 'CSSAI Lab @ USF',
  status: 'In progress',
  blurb:
    'AI-assisted negotiation-coaching research: classifying strategic-adaptation cues turn-by-turn against the Heunis et al. (2024) framework, benchmarking fine-tuned RoBERTa, GPT, and LLaMA 3, and validating against human annotation at κ 0.76 over 1,030 dialogue turns.',
  tags: ['Research', 'LLMs', 'Human eval', 'RoBERTa / GPT / LLaMA 3'],
}
