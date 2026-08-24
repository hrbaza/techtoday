import type { Article } from "./types";

export const set2: Article[] = [
  {
    slug: "what-is-edge-computing",
    title: "What Is Edge Computing and Why It Matters",
    category: "Cloud & Infrastructure",
    excerpt:
      "Edge computing moves processing closer to where data is created. Here is what that means, why it is growing, and where you already benefit from it.",
    date: "2026-08-16",
    dateLabel: "August 16, 2026",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=82",
    imageAlt: "Glowing network connections across a dark globe",
    body: [
      { type: "h2", text: "Bringing computing closer to home" },
      {
        type: "p",
        text: "For most of the past two decades, the trend in technology moved in one direction: toward the cloud. Data was collected on devices and sent to giant, distant data centres where the real work happened. Edge computing reverses part of that journey. Instead of sending everything far away, it processes data close to where it is created — on or near the device itself.",
      },
      {
        type: "p",
        text: "The edge in edge computing simply means the outer edge of the network, near the user, rather than the centre where the big data centres sit. It is not a replacement for the cloud but a complement to it, handling the tasks that benefit from being nearby while the cloud continues to do the heavy lifting that can wait.",
      },
      { type: "h2", text: "The problem the edge solves" },
      {
        type: "p",
        text: "Sending data to a distant data centre and waiting for an answer takes time. Usually that delay, called latency, is small enough not to matter. But for some applications, even a fraction of a second is too long. A self-driving car deciding whether to brake cannot wait for a round trip to a server hundreds of miles away.",
      },
      {
        type: "p",
        text: "There is also the sheer volume of data. Modern sensors, cameras, and machines generate enormous streams of information. Sending all of it across the internet would be slow, expensive, and often pointless. Edge computing lets a device analyse data locally and send only the useful summary onward, saving bandwidth and cost.",
      },
      { type: "h2", text: "Everyday examples you already use" },
      {
        type: "p",
        text: "Edge computing is not a distant idea; it is already woven into daily life, usually invisibly.",
      },
      {
        type: "list",
        items: [
          "Smartphones that recognise faces or voices on the device, without sending your data away",
          "Smart doorbells and cameras that detect a person locally before alerting you",
          "Cars that process sensor data instantly to assist with braking and steering",
          "Factory machines that spot a fault on the production line in real time",
          "Voice assistants that handle simple commands offline for a faster response",
        ],
      },
      {
        type: "p",
        text: "In each case, doing the work nearby makes the experience faster, cheaper, or more private — and sometimes all three at once.",
      },
      { type: "h2", text: "Speed, privacy, and reliability" },
      {
        type: "p",
        text: "The three biggest advantages of the edge are speed, privacy, and reliability. Speed comes from cutting the distance data must travel. Privacy improves because sensitive information — your face, your voice, your location — can be handled on the device and never uploaded. Reliability increases because a device that thinks for itself keeps working even when the internet connection drops.",
      },
      {
        type: "quote",
        text: "The cloud gives you scale. The edge gives you speed. The most capable systems now use both, each where it fits best.",
      },
      { type: "h2", text: "Why AI made the edge essential" },
      {
        type: "p",
        text: "Artificial intelligence accelerated the move to the edge. AI models used to be so large that they could only run in data centres. But researchers learned to shrink and optimise models so they could run on smaller chips inside phones, cameras, and cars. This unlocked features that feel instant and work without a connection.",
      },
      {
        type: "p",
        text: "Running AI at the edge also eases pressure on central data centres and networks. If millions of devices can each handle simple recognition tasks on their own, the cloud is freed to focus on the harder problems that genuinely require its scale. The two layers work as a team rather than competitors.",
      },
      {
        type: "p",
        text: "A helpful way to picture the division of labour is a busy restaurant. The chefs in the kitchen — the cloud — handle the heavy, complex cooking that benefits from scale and specialised equipment. The waiter at your table — the edge — handles the quick, immediate needs: taking your order, refilling your water, answering a simple question without walking back to the kitchen each time. Neither could run the restaurant alone, but together they deliver a fast, smooth experience. Edge and cloud computing work the same way, each taking the tasks it is best suited to and passing the rest along. As the chips inside everyday devices keep improving, more of the immediate work shifts to the edge, while the cloud remains the kitchen where the truly demanding jobs are done.",
      },
      { type: "h2", text: "The trade-offs" },
      {
        type: "p",
        text: "Edge computing is not free of challenges. Spreading computation across countless devices makes systems harder to manage, update, and secure. A single data centre is easier to patch than a million scattered gadgets. Keeping all those devices safe from attackers and up to date is a real and ongoing burden.",
      },
      {
        type: "p",
        text: "There are also physical limits. Small devices have limited power, memory, and cooling, so they cannot match the raw capability of a data centre. Designers must decide carefully which tasks belong at the edge and which should still travel to the cloud — a balance that shifts as chips get more capable.",
      },
      { type: "h2", text: "Where this is heading" },
      {
        type: "p",
        text: "As chips grow more powerful and efficient, more intelligence will move to the edge. Expect devices that understand speech, images, and context locally, responding instantly and protecting your data by keeping it on hand. The future is not cloud versus edge but a smooth spectrum, with each task running wherever it makes the most sense.",
      },
      {
        type: "p",
        text: "For most people, the details will stay invisible. You will simply notice that your devices feel faster, more private, and more dependable — the quiet payoff of moving computing a little closer to home.",
      },
    ],
  },
  {
    slug: "the-rise-of-open-source-ai",
    title: "The Rise of Open-Source AI Models",
    category: "Artificial Intelligence",
    excerpt:
      "Open-source AI models let anyone download, study, and run powerful systems. Here is why that shift matters for developers, businesses, and everyday users.",
    date: "2026-08-14",
    dateLabel: "August 14, 2026",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=82",
    imageAlt: "Streams of green code on a dark screen",
    body: [
      { type: "h2", text: "Two paths for artificial intelligence" },
      {
        type: "p",
        text: "As AI has grown more powerful, a quiet but important debate has taken shape over how these systems should be shared. On one side are closed models, offered only as a service through a company's own website or interface. On the other are open models, which anyone can download, inspect, and run on their own computers. The choice between them shapes who controls this technology.",
      },
      {
        type: "p",
        text: "Both approaches have serious supporters and real trade-offs. Understanding the difference helps make sense of much of the news about AI — including debates over safety, competition, and national policy.",
      },
      { type: "h2", text: "What open source actually means" },
      {
        type: "p",
        text: "In software, open source has long meant that the underlying code is public. Anyone can read it, change it, and build on it. Open-source AI extends this idea to models. Instead of only offering answers through a paid service, developers release the model's trained parameters — the numbers that make it work — for others to use freely.",
      },
      {
        type: "p",
        text: "The definitions get blurry in practice. Some models release everything, including the training data and methods. Others release only the finished parameters under conditions. Purists argue about where the line truly sits, but for most people the key point is simple: an open model can be downloaded and run without asking permission from the company that made it.",
      },
      { type: "h2", text: "Why open models matter" },
      {
        type: "p",
        text: "Open models change the balance of power in several practical ways.",
      },
      {
        type: "list",
        items: [
          "Control — organisations can run models on their own hardware, keeping sensitive data in-house.",
          "Cost — after download, running a model locally can be far cheaper than paying per request.",
          "Customisation — developers can adapt and fine-tune a model for a specific task or language.",
          "Transparency — researchers can study how a model behaves and where it fails.",
          "Resilience — a business is not tied to one provider's pricing, rules, or availability.",
        ],
      },
      {
        type: "p",
        text: "For a hospital, a bank, or a government that cannot send confidential data to an outside service, these benefits are not luxuries. They are the difference between using AI at all and leaving it on the shelf.",
      },
      { type: "h2", text: "The safety debate" },
      {
        type: "p",
        text: "Openness cuts both ways. The same freedom that lets a researcher study a model also lets a bad actor misuse it. Once a capable model is downloaded and shared, it cannot be recalled. Critics worry this makes it harder to prevent misuse, from generating scams to producing harmful content.",
      },
      {
        type: "quote",
        text: "Open models spread capability widely. The question is whether the benefits of transparency outweigh the risks of losing control.",
      },
      {
        type: "p",
        text: "Supporters counter that transparency is itself a form of safety. When many independent experts can examine a model, flaws are found and fixed faster than in a closed system that only its owner can inspect. They also argue that concentrating powerful AI in a few private companies carries its own risks. There is no settled answer, and reasonable people disagree.",
      },
      { type: "h2", text: "The surprising quality of open models" },
      {
        type: "p",
        text: "A few years ago, open models lagged far behind the best closed systems. That gap has narrowed dramatically. Well-designed open models now handle many everyday tasks — writing, summarising, coding, answering questions — at a level that satisfies most practical needs, even if the very largest closed models still lead on the hardest problems.",
      },
      {
        type: "p",
        text: "This progress matters because it lowers the barrier to building with AI. A small startup, a university lab, or an individual developer can now create useful products without a giant budget, simply by downloading a capable model and adapting it. That accessibility is fuelling a wave of experimentation.",
      },
      {
        type: "p",
        text: "This wave matters beyond the technology world. When the barrier to building with AI falls, innovation is no longer confined to a few wealthy companies. Researchers in universities, developers in smaller countries, and hobbyists working evenings can all contribute, adapt models to local languages, and tackle problems the big providers may never prioritise. History suggests that this kind of broad access tends to produce unexpected and valuable results, precisely because so many different people are free to try. Open models also create a healthy check on the closed ones: when a capable free alternative exists, commercial providers must keep improving and pricing fairly, because customers always have somewhere else to go. That quiet competitive pressure may prove one of the most important consequences of the open-source approach, benefiting even those who never touch an open model themselves.",
      },
      { type: "h2", text: "What it means for you" },
      {
        type: "p",
        text: "Even if you never download a model yourself, the rise of open-source AI affects the tools you use. It drives competition, which tends to improve quality and lower prices. It gives the companies you rely on more choice, reducing the chance that a single provider controls the whole market. And it lets local languages and niche needs be served, because anyone can adapt a model rather than waiting for a big company to do it.",
      },
      {
        type: "p",
        text: "The story of open-source AI is still being written. What is already clear is that it has turned artificial intelligence from something a handful of companies control into something a much wider community can build with — and that shift will shape the technology for years to come.",
      },
    ],
  },
  {
    slug: "how-self-driving-cars-work",
    title: "How Self-Driving Cars Actually Work",
    category: "Mobility",
    excerpt:
      "Self-driving cars combine sensors, maps, and AI to perceive the road and make decisions. Here is a clear look at how they work and why full autonomy is hard.",
    date: "2026-08-12",
    dateLabel: "August 12, 2026",
    readTime: "9 min read",
    image:
      "https://images.unsplash.com/photo-1553260168-69b041873e65?auto=format&fit=crop&w=1600&q=82",
    imageAlt: "Modern car interior with a digital dashboard display",
    body: [
      { type: "h2", text: "Teaching a car to see and decide" },
      {
        type: "p",
        text: "A self-driving car has to do something humans do effortlessly and yet find almost impossible to explain: perceive a complex, changing world and make safe decisions in real time. To pull this off, engineers break the challenge into three broad jobs — sensing the environment, understanding it, and acting on that understanding. Each relies on a different set of technologies working in concert.",
      },
      {
        type: "p",
        text: "The result is a car that reads the road many times per second, predicts what other people and vehicles will do, and steers, accelerates, and brakes accordingly. Understanding those three jobs is the key to seeing why the technology is both impressive and still unfinished.",
      },
      { type: "h2", text: "The senses: how a car perceives" },
      {
        type: "p",
        text: "A self-driving car cannot rely on a single sensor, because each has weaknesses. Instead it blends several, a technique called sensor fusion, so that the strengths of one cover the blind spots of another.",
      },
      {
        type: "list",
        items: [
          "Cameras — see colour, read signs and lane markings, and recognise traffic lights, but struggle in glare or darkness.",
          "Radar — measures the distance and speed of objects and works well in rain or fog, but sees the world in low detail.",
          "Lidar — bounces laser pulses to build a precise 3D map of surroundings, but is costly and can be affected by heavy weather.",
          "Ultrasonic sensors — handle close-range tasks like parking and detecting nearby obstacles.",
        ],
      },
      {
        type: "p",
        text: "By combining these, the car builds a single, reliable picture of everything around it — far more consistent than any one sensor could provide alone.",
      },
      { type: "h2", text: "The brain: understanding the scene" },
      {
        type: "p",
        text: "Raw sensor data is just numbers until software makes sense of it. This is where artificial intelligence takes over. Trained on vast amounts of driving data, the car's software identifies pedestrians, cyclists, other vehicles, road edges, and signs, then tracks how each is moving.",
      },
      {
        type: "p",
        text: "Crucially, the system also predicts what will happen next. Will that pedestrian step off the kerb? Is that car about to change lanes? Good prediction is what separates a safe autonomous system from a dangerous one, and it is one of the hardest parts of the whole problem because human behaviour is not always logical.",
      },
      {
        type: "quote",
        text: "Perceiving the road is difficult. Predicting what unpredictable humans will do next is harder still.",
      },
      { type: "h2", text: "The hands: making it move" },
      {
        type: "p",
        text: "Once the car understands the scene and has predicted how it will evolve, it must decide on an action — maintain speed, slow down, change lanes, stop — and then execute it smoothly. This planning layer weighs safety, comfort, and the rules of the road, then sends precise commands to the steering, throttle, and brakes.",
      },
      {
        type: "p",
        text: "Detailed digital maps often assist here, telling the car about lane layouts, speed limits, and junctions before its sensors even see them. The car constantly compares the live sensor view against the map to know exactly where it is, down to a few centimetres.",
      },
      { type: "h2", text: "The levels of autonomy" },
      {
        type: "p",
        text: "Not all self-driving is equal. The industry uses a scale from zero to five. At the lower levels, the car assists but the human must stay fully in control — think adaptive cruise control or lane-keeping. At the higher levels, the car handles more, until at the top level it needs no human at all, anywhere. Most cars sold today sit in the assisted range, where the driver remains responsible.",
      },
      {
        type: "p",
        text: "This distinction matters enormously for safety. A system that drives well most of the time but occasionally needs a human to grab the wheel demands constant attention — which is exactly the kind of vigilance humans are bad at maintaining when they feel the car is doing the work.",
      },
      {
        type: "p",
        text: "This is why the middle of the autonomy scale is, in some ways, the most dangerous place to be. A system that is good but not fully trustworthy invites complacency: the more capable it appears, the more tempting it is to stop paying attention, exactly when attention is still required. Engineers and regulators are acutely aware of this trap. Some companies have chosen to skip the awkward middle ground entirely, aiming straight for full autonomy in limited, well-mapped areas rather than selling half-measures to ordinary drivers. Others take the opposite view, arguing that gradual improvement, with the human always responsible, is the safer path to earning trust. Both approaches are being tested on real roads today, and which one proves wiser is still an open question — one that will shape not just the technology, but how comfortable the public feels sharing the road with it.",
      },
      { type: "h2", text: "Why full autonomy is taking so long" },
      {
        type: "p",
        text: "Building a car that drives well in good conditions is achievable. Building one that handles every rare, strange, and dangerous situation — the so-called edge cases — is extraordinarily hard. A ball rolling into the road, an unusual construction layout, a police officer waving traffic through a red light: humans handle these with common sense that machines still lack.",
      },
      {
        type: "p",
        text: "Because a driving mistake can cost lives, the bar for safety is rightly very high. That is why fully driverless cars have rolled out slowly, city by city, rather than arriving everywhere at once. The technology is genuinely remarkable, but the last few percent of reliability is proving to be the hardest — and most important — part of the journey.",
      },
    ],
  },
  {
    slug: "quantum-computing-explained",
    title: "Quantum Computing Explained Simply",
    category: "Computing",
    excerpt:
      "Quantum computers promise to solve problems ordinary machines cannot. Here is a plain-language guide to how they work and what they might actually be good for.",
    date: "2026-08-10",
    dateLabel: "August 10, 2026",
    readTime: "9 min read",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1600&q=82",
    imageAlt: "Abstract glowing blue and gold quantum computing visualisation",
    body: [
      { type: "h2", text: "A different kind of computer" },
      {
        type: "p",
        text: "Quantum computing is one of the most hyped and least understood topics in technology. Headlines promise machines that will break all encryption or cure disease overnight. The reality is more subtle and, in its own way, more interesting. A quantum computer is not simply a faster version of the laptop on your desk. It is a fundamentally different kind of machine, built to exploit the strange rules of the very small.",
      },
      {
        type: "p",
        text: "To understand why it matters, you first have to accept that it will not replace ordinary computers for everyday tasks. Instead, it aims to solve a narrow set of problems that are effectively impossible for even the largest traditional supercomputers.",
      },
      { type: "h2", text: "Bits versus qubits" },
      {
        type: "p",
        text: "An ordinary computer stores information in bits, each of which is either a zero or a one. Everything your computer does — text, images, video, calculations — is ultimately built from long strings of these two values. It is simple, reliable, and astonishingly powerful when scaled up.",
      },
      {
        type: "p",
        text: "A quantum computer uses quantum bits, or qubits. Thanks to a property called superposition, a qubit can exist in a blend of zero and one at the same time. It is not that we simply do not know its value; the qubit genuinely holds a combination of both possibilities until it is measured. This is where quantum computing gets its unusual power.",
      },
      { type: "h2", text: "Superposition and entanglement" },
      {
        type: "p",
        text: "Superposition means that a group of qubits can represent many combinations at once. Where a handful of ordinary bits can hold a single number, the same number of qubits can, in a sense, explore a vast range of numbers simultaneously. Add more qubits and this space grows explosively.",
      },
      {
        type: "quote",
        text: "A quantum computer does not try every answer one by one. It uses the physics of interference to make wrong answers cancel out and right answers stand out.",
      },
      {
        type: "p",
        text: "The second key property is entanglement, where qubits become linked so that the state of one instantly relates to another, no matter the distance between them. Entanglement lets a quantum computer coordinate its qubits in ways that have no equivalent in ordinary computing, and it is essential to how quantum algorithms work.",
      },
      { type: "h2", text: "What quantum computers might do" },
      {
        type: "p",
        text: "Quantum machines are not general-purpose speed boosters. They excel only at specific kinds of problems where their strange properties give an advantage. The most promising areas share a common feature: an enormous number of possibilities that must be searched or simulated.",
      },
      {
        type: "list",
        items: [
          "Simulating molecules and materials, which could speed up drug and battery discovery",
          "Optimising complex systems such as logistics networks or financial portfolios",
          "Certain kinds of search and mathematics that underlie modern encryption",
          "Advancing scientific research into chemistry and physics that classical machines model poorly",
        ],
      },
      {
        type: "p",
        text: "Notably, simulating the quantum world of atoms and molecules is something classical computers do badly, because nature at that scale is itself quantum. Using a quantum machine to model quantum chemistry is one of the field's most genuinely promising applications.",
      },
      {
        type: "p",
        text: "Encryption is the application that draws the most headlines, and it deserves a careful word. Much of today's online security relies on mathematical problems that ordinary computers cannot solve quickly. A large, reliable quantum computer could, in theory, crack some of these, which is why researchers are already developing new 'post-quantum' encryption designed to resist such machines. Importantly, this threat is years away and is being addressed well in advance, so there is no cause for alarm — but it explains why the field attracts so much attention from governments and security experts.",
      },
      {
        type: "p",
        text: "It is just as important to stress what quantum computers will not do. They will not make your spreadsheets load faster, your videos stream more smoothly, or your everyday apps run better. For the overwhelming majority of computing tasks, an ordinary processor is not merely adequate but superior, because it is cheaper, simpler, and already extremely fast. Quantum machines are specialists for a narrow class of problems, not a general upgrade — a distinction that a great deal of breathless coverage manages to blur. Keeping that distinction clear is the best defence against both hype and disappointment.",
      },
      { type: "h2", text: "The enormous engineering challenge" },
      {
        type: "p",
        text: "Building a useful quantum computer is fiendishly difficult. Qubits are extraordinarily fragile. The slightest heat, vibration, or stray electromagnetic signal can disturb them and destroy the delicate quantum state, a problem called decoherence. To hold qubits still, many machines must be chilled to temperatures colder than deep space.",
      },
      {
        type: "p",
        text: "Errors are the central obstacle. Today's quantum computers make mistakes far too often for serious work, so a huge research effort focuses on error correction — using many physical qubits to build one reliable logical qubit. Progress is real but slow, and practical, large-scale machines remain years away.",
      },
      { type: "h2", text: "A realistic view of the future" },
      {
        type: "p",
        text: "It is easy to be swept up in the hype or dismiss quantum computing as science fiction. The truth sits between the two. Quantum computers will almost certainly never replace your phone or laptop. But for a narrow band of extremely hard problems, they may one day do things no classical machine ever could.",
      },
      {
        type: "p",
        text: "The most likely future is a partnership: classical computers handling everyday work and quantum machines called upon, like specialist tools, for the rare problems that suit them. Whether that future arrives in ten years or thirty, the science being done today is quietly laying the groundwork for it.",
      },
    ],
  },
];
