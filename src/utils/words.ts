export const DEVELOPER_WORDS = [
  "const", "let", "function", "import", "export", "return", "default", "class", "interface",
  "component", "useState", "useEffect", "useMemo", "useCallback", "git", "commit", "push",
  "pull", "merge", "checkout", "rebase", "docker", "kubernetes", "typescript", "javascript",
  "tailwindcss", "postcss", "framer-motion", "howler", "vite", "package", "dependencies",
  "compiler", "bundle", "async", "await", "promise", "resolve", "reject", "fetch", "axios",
  "graphql", "query", "mutation", "schema", "database", "mongodb", "postgres", "redis",
  "server", "client", "request", "response", "headers", "cookies", "session", "token",
  "auth", "login", "signup", "logout", "dashboard", "settings", "profile", "admin",
  "user", "index", "style", "script", "markup", "document", "window",
  "element", "selector", "margin", "padding", "border", "flexbox", "grid", "relative",
  "absolute", "fixed", "sticky", "display", "opacity", "transition", "transform",
  "animation", "trigger", "variant", "animate", "exit", "motion", "div", "span",
  "button", "input", "textarea", "select", "form", "label", "header", "footer", "main",
  "section", "article", "aside", "nav", "anchor", "image", "media", "canvas", "svg"
];

export const WALL_STREET_WORDS = [
  "bullish", "bearish", "leverage", "liquidity", "dividend", "equity", "derivative", "option",
  "futures", "commodities", "portfolio", "arbitrage", "valuation", "capital", "revenue",
  "margin", "collateral", "insolvency", "volatility", "amortization",
  "capitalization", "depreciation", "earnings", "ebitda", "inflation", "deflation",
  "stagflation", "recession", "depression", "bull", "bear", "stock", "bond", "share", "asset",
  "liability", "balance", "sheet", "cash", "flow", "statement", "ledger", "account",
  "audit", "tax", "tariff", "trade", "exchange", "market", "index", "ticker", "volume",
  "yield", "coupon", "maturity", "principal", "interest", "rate", "discount", "premium",
  "spread", "ask", "bid", "broker", "dealer", "clearing", "settlement", "custody",
  "regulation", "compliance", "sec", "fed", "treasury", "macroeconomics", "microeconomics"
];

export const STANDARD_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we",
  "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their",
  "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make",
  "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your",
  "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only",
  "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work",
  "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day",
  "most", "us"
];

export function getRandomWords(pool: string[], count = 50): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    words.push(pool[randomIndex]);
  }
  return words;
}
