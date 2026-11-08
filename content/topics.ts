// Topic clusters: every article belongs to exactly one topic, and each topic
// has a hub page at /topics/<slug> with a pillar article (the broad guide the
// rest of the topic links up to).
//
// An article's topic is its Category when that matches a topic name (the admin
// editor only offers topic names). Articles saved before topics existed still
// carry older free-text categories, so they are mapped below by slug, then by
// their old category, until they are next saved in the admin panel.

export type Topic = {
  slug: string;
  name: string;
  description: string;
  pillar: string; // slug of the topic's pillar article
};

export const TOPICS: Topic[] = [
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    description:
      "How large language models, chatbots and AI agents actually work, and what each new model means for you. Start with the plain-English guide to LLMs, then follow the latest releases, risks and debates.",
    pillar: "large-language-models-explained",
  },
  {
    slug: "chips-and-data-centers",
    name: "Chips & Data Centers",
    description:
      "The semiconductors, GPUs and memory chips behind the AI boom, and the data centers that run them. Learn how chips are made and why the companies building them move the whole market.",
    pillar: "semiconductors-explained",
  },
  {
    slug: "computing-and-gaming",
    name: "Computing & Gaming",
    description:
      "What happens inside your computer, from the CPU and RAM to storage and binary, plus the laptops and consoles built on them. Clear answers to everyday questions like why restarting fixes things.",
    pillar: "how-cpus-actually-work",
  },
  {
    slug: "internet-and-cloud",
    name: "Internet & Cloud",
    description:
      "Follow a single click from your browser to a server and back. DNS, email, streaming, fibre, undersea cables and the cloud, each explained in plain language.",
    pillar: "how-does-the-internet-actually-work",
  },
  {
    slug: "wireless-and-5g",
    name: "Wi-Fi, 5G & Wireless",
    description:
      "The radio technology that keeps you connected: Wi-Fi, 5G, Bluetooth, eSIM, NFC, GPS and satellite internet. How each one works, and why it sometimes doesn't.",
    pillar: "how-wifi-actually-works",
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity & Privacy",
    description:
      "Practical guides to staying safe online, from passwords, passkeys and two-factor authentication to VPNs and firewalls, plus the biggest hacks, leaks and privacy cases explained.",
    pillar: "cybersecurity-basics-everyone-should-know",
  },
  {
    slug: "smartphones",
    name: "Smartphones & Cameras",
    description:
      "How the screen, camera and chips inside your phone work, and what the newest phones and foldables actually change. Explained without the spec-sheet jargon.",
    pillar: "how-oled-displays-work",
  },
  {
    slug: "batteries-and-charging",
    name: "Batteries & Charging",
    description:
      "How lithium-ion batteries store energy, why phones get hot, how wireless and fast charging work, and what solid-state batteries could change for phones and electric cars.",
    pillar: "lithium-ion-batteries-explained",
  },
  {
    slug: "clean-energy",
    name: "Clean Energy",
    description:
      "Solar panels, wind turbines, nuclear and fusion: how each one turns a natural force into electricity, and how close they are to powering the grid.",
    pillar: "renewable-energy-technology",
  },
  {
    slug: "wearables-vr-and-audio",
    name: "Wearables, VR & Audio",
    description:
      "Smartwatches, VR headsets, smart glasses and headphones: the sensors, screens and sound tricks that make wearable tech work, and what it can tell you about your health.",
    pillar: "wearable-technology-and-health",
  },
  {
    slug: "robots-and-self-driving",
    name: "Robots & Self-Driving",
    description:
      "How self-driving cars see the road, how robots learn to work alongside people, and how drones keep themselves in the air.",
    pillar: "how-self-driving-cars-work",
  },
  {
    slug: "space-tech",
    name: "Space Tech",
    description:
      "Reusable rockets, space debris and the telescopes watching the universe. How the technology of spaceflight works, explained for curious readers.",
    pillar: "how-rockets-land-themselves-explained",
  },
  {
    slug: "health-and-biotech",
    name: "Health & Biotech",
    description:
      "AI in medicine, gene editing, mRNA vaccines and brain-computer interfaces: how technology is changing the way we diagnose and treat disease.",
    pillar: "ai-in-healthcare",
  },
];

export const TOPIC_NAMES = TOPICS.map((topic) => topic.name);

const BY_SLUG = new Map(TOPICS.map((topic) => [topic.slug, topic]));
const BY_NAME = new Map(TOPICS.map((topic) => [topic.name.toLowerCase(), topic]));

// Articles published before topics existed: article slug -> topic slug.
const LEGACY_ARTICLE_TOPIC: Record<string, string> = {
  "large-language-models-explained": "artificial-intelligence",
  "the-rise-of-open-source-ai": "artificial-intelligence",
  "why-ai-chatbots-make-things-up-explained": "artificial-intelligence",
  "gpt-6-and-intelligent-ui-explained-chatgpt-s-biggest-redesign-yet": "artificial-intelligence",
  "gemini-4-argon-explained": "artificial-intelligence",
  "kimi-k3-1-pro-explained": "artificial-intelligence",
  "the-x-subscription-grok-cursor-premium-explained": "artificial-intelligence",
  "apple-intelligence-china-qwen-explained": "artificial-intelligence",
  "openai-buys-pierre-computer-explained": "artificial-intelligence",
  "how-ai-agents-are-changing-work": "artificial-intelligence",
  "ai-in-education": "artificial-intelligence",
  "the-ethics-of-artificial-intelligence": "artificial-intelligence",
  "bill-gates-ai-warning-explained-the-most-dangerous-technology-ever": "artificial-intelligence",
  "anthropic-5-percent-pledge-musk-spacex-giveaway-explained": "artificial-intelligence",
  "meta-muse-10m-downloads-chat-leak-explained": "artificial-intelligence",
  "semiconductors-explained": "chips-and-data-centers",
  "how-gpus-actually-work": "chips-and-data-centers",
  "tensor-cores-vs-cuda-cores": "chips-and-data-centers",
  "microsoft-s-maia-300-ai-chip-explained": "chips-and-data-centers",
  "samsung-s-80-billion-quarter-explained-why-ai-s-hunger-for-memory-chips-broke-ev": "chips-and-data-centers",
  "marvell-lumentum-115-billion-deal-explained": "chips-and-data-centers",
  "inside-the-data-centers-powering-ai": "chips-and-data-centers",
  "quantum-computing-explained": "chips-and-data-centers",
  "ai-stock-selloff-explained": "chips-and-data-centers",
  "tech-crash-october-2026-explained": "artificial-intelligence",
  "how-cpus-actually-work": "computing-and-gaming",
  "why-computers-only-understand-zeros-and-ones": "computing-and-gaming",
  "how-ram-actually-works-explained": "computing-and-gaming",
  "how-ssds-actually-work-explained": "computing-and-gaming",
  "what-happens-when-you-delete-a-file": "computing-and-gaming",
  "why-restarting-fixes-problems-explained": "computing-and-gaming",
  "how-do-3d-printers-actually-work": "computing-and-gaming",
  "how-qr-codes-actually-work": "computing-and-gaming",
  "apple-m6-macbook-pro-imac-explained": "computing-and-gaming",
  "apple-touchscreen-macbook-pro-explained": "computing-and-gaming",
  "surface-laptop-ultra-explained": "computing-and-gaming",
  "ps6-price-shock-explained": "computing-and-gaming",
  "gta-6-explained-release-date-price-platforms-and-what-s-actually-confirmed": "computing-and-gaming",
  "how-does-the-internet-actually-work": "internet-and-cloud",
  "how-dns-works-the-internet-s-phone-book": "internet-and-cloud",
  "how-email-actually-works": "internet-and-cloud",
  "how-streaming-video-actually-works": "internet-and-cloud",
  "fibre-broadband-explained": "internet-and-cloud",
  "undersea-internet-cables-explained": "internet-and-cloud",
  "how-cloud-computing-works": "internet-and-cloud",
  "what-is-edge-computing": "internet-and-cloud",
  "how-wifi-actually-works": "wireless-and-5g",
  "why-wifi-slow-at-night": "wireless-and-5g",
  "how-5g-changes-connectivity": "wireless-and-5g",
  "why-is-5g-slower-than-4g": "wireless-and-5g",
  "esim-explained": "wireless-and-5g",
  "how-bluetooth-works": "wireless-and-5g",
  "how-tap-to-pay-works-nfc-explained": "wireless-and-5g",
  "how-gps-works-explained-from-satellites-to-your-phone": "wireless-and-5g",
  "satellite-internet-explained": "wireless-and-5g",
  "cybersecurity-basics-everyone-should-know": "cybersecurity",
  "passkeys-explained-end-of-passwords": "cybersecurity",
  "two-factor-authentication-explained": "cybersecurity",
  "how-password-managers-work-explained": "cybersecurity",
  "what-is-a-vpn-explained": "cybersecurity",
  "how-do-firewalls-actually-work": "cybersecurity",
  "how-ransomware-works-explained": "cybersecurity",
  "how-does-face-unlock-actually-work": "cybersecurity",
  "why-deepfakes-look-so-real-explained": "cybersecurity",
  "ai-discovered-php-flaw-explained": "cybersecurity",
  "openai-ai-found-948-linux-root-exploits-explained": "artificial-intelligence",
  "binance-6-billion-hack-explained": "cybersecurity",
  "meta-25-billion-privacy-fine-explained": "cybersecurity",
  "cash-app-15m-settlement-explained": "cybersecurity",
  "blockchain-beyond-crypto": "cybersecurity",
  "how-oled-displays-work": "smartphones",
  "how-touchscreens-actually-work": "smartphones",
  "how-camera-image-sensors-work": "smartphones",
  "why-phone-photos-look-better-than-dslr": "smartphones",
  "galaxy-s27-ultra-explained": "smartphones",
  "apple-iphone-duo-foldable-explained": "smartphones",
  "samsung-2027-foldable-revolution-explained": "smartphones",
  "oppo-find-x10-explained": "smartphones",
  "oneplus-ace-7-pro-explained": "smartphones",
  "why-phones-slow-down-after-updates": "smartphones",
  "lithium-ion-batteries-explained": "batteries-and-charging",
  "solid-state-batteries-explained": "batteries-and-charging",
  "why-phones-get-hot-when-charging": "batteries-and-charging",
  "how-wireless-charging-actually-works": "batteries-and-charging",
  "can-you-charge-laptop-with-phone-charger": "batteries-and-charging",
  "does-dark-mode-save-battery": "batteries-and-charging",
  "why-evs-lose-range-in-winter-explained": "batteries-and-charging",
  "renewable-energy-technology": "clean-energy",
  "how-solar-panels-actually-work": "clean-energy",
  "how-wind-turbines-actually-work-explained": "clean-energy",
  "small-modular-reactors-explained": "clean-energy",
  "fusion-energy-explained": "clean-energy",
  "wearable-technology-and-health": "wearables-vr-and-audio",
  "how-do-vr-headsets-actually-work": "wearables-vr-and-audio",
  "how-do-smart-glasses-actually-work": "wearables-vr-and-audio",
  "how-noise-cancelling-headphones-actually-work": "wearables-vr-and-audio",
  "sony-mdr-3r-walkman-headphones-explained": "wearables-vr-and-audio",
  "why-your-voice-sounds-different-on-recordings-explained": "wearables-vr-and-audio",
  "apple-welcome-home-event-explained": "wearables-vr-and-audio",
  "how-self-driving-cars-work": "robots-and-self-driving",
  "robots-beyond-the-factory-floor": "robots-and-self-driving",
  "agibot-go-3-preview-explained": "robots-and-self-driving",
  "tesla-cybertruck-production-ending-explained": "robots-and-self-driving",
  "how-do-drones-actually-work": "robots-and-self-driving",
  "how-rockets-land-themselves-explained": "space-tech",
  "space-debris-kessler-syndrome-explained": "space-tech",
  "nasa-save-hubble-telescope-2032-rescue-explained": "space-tech",
  "ai-in-healthcare": "health-and-biotech",
  "crispr-and-gene-editing-explained-rewriting-life-s-code": "health-and-biotech",
  "how-mrna-vaccines-work-explained": "health-and-biotech",
  "brain-computer-interfaces-explained": "health-and-biotech",
};

// Older free-text categories -> topic slug, for anything not listed above.
const LEGACY_CATEGORY_TOPIC: Record<string, string> = {
  "Artificial Intelligence": "artificial-intelligence",
  "AI & Society": "artificial-intelligence",
  "AI & Work": "artificial-intelligence",
  "Computing": "computing-and-gaming",
  "Infrastructure": "chips-and-data-centers",
  "Cloud & Infrastructure": "internet-and-cloud",
  "Networks": "internet-and-cloud",
  "Security": "cybersecurity",
  "Cybersecurity": "cybersecurity",
  "Web3": "cybersecurity",
  "Gadgets": "smartphones",
  "Green Tech": "clean-energy",
  "Energy": "clean-energy",
  "Space": "space-tech",
  "Health Technology": "health-and-biotech",
  "Biotech": "health-and-biotech",
  "Mobility": "robots-and-self-driving",
  "Robotics": "robots-and-self-driving",
};

const FALLBACK = BY_SLUG.get("computing-and-gaming")!;

export function getTopic(slug: string): Topic | undefined {
  return BY_SLUG.get(slug);
}

export function topicFor(post: { slug: string; category: string }): Topic {
  return (
    BY_NAME.get(post.category.trim().toLowerCase()) ??
    BY_SLUG.get(LEGACY_ARTICLE_TOPIC[post.slug] ?? "") ??
    BY_SLUG.get(LEGACY_CATEGORY_TOPIC[post.category.trim()] ?? "") ??
    FALLBACK
  );
}

export function topicPath(topic: Topic): string {
  return `/topics/${topic.slug}`;
}
