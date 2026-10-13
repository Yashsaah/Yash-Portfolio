export const profile = {
  name: "Yash Kumar Sah",
  firstName: "Yash",
  location: "Kathmandu, Nepal",
  role: "Recent A-Level graduate · AI, mathematics & emerging tech",
  email: "yashsah4522@gmail.com",
  phone: "+977 9821567878",
  // tel: link form — no spaces
  phoneHref: "tel:+9779821567878",
  headline: ["Building", "machines that", "understand", "people."],
  // The word in the headline rendered in serif italic + gradient
  headlineAccentIndex: 2,
  school: "St. Xavier's College, Maitighar",
  intro:
    "A recent A-Level graduate from St. Xavier's College, Maitighar, deep in artificial intelligence and mathematics. I build things that see, decide and move — and I like problems that ask for logic and creativity at the same time.",
  availability: "Open to research & AI collaborations",
  /* Rendered as chips in the hero */
  curious: ["Artificial intelligence", "Mathematics", "Emerging tech", "Problem solving"],
  socials: [
    { label: "GitHub", href: "https://github.com/Yashsaah", handle: "@Yashsaah" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/yash-kumar-sah-367332337/",
      handle: "yash-kumar-sah",
    },
    { label: "Email", href: "mailto:yashsah4522@gmail.com", handle: "yashsah4522@gmail.com" },
  ],
};

export const stats = [
  { value: "3+", label: "Research & build projects shipped" },
  { value: "2024", label: "Gandhi Scholarship awardee" },
  { value: "2×", label: "National podium finishes" },
];

/* Deliberately terse — a label and the names, nothing more. */
export const skills = {
  heading: "Tech I reach for",
  groups: [
    { label: "Languages", accent: "lime", items: "Python, C++, JavaScript" },
    { label: "AI / ML", accent: "violet", items: "PyTorch, TensorFlow, CNNs, Grad-CAM" },
    { label: "Computer Vision", accent: "cyan", items: "OpenCV, gesture & gaze tracking, real-time inference" },
    { label: "Embedded", accent: "amber", items: "ESP-32, Arduino, motor drivers, sensors" },
    { label: "Web", accent: "coral", items: "React, Tailwind, REST APIs, Vercel" },
    { label: "Systems", accent: "cyan", items: "Kali Linux, shell scripting, Git" },
  ],
};

/* `blurb` is what the card shows; `description` and `detail` only appear
   once a project is opened. */
export const projects = [
  {
    index: "01",
    title: "Vision Drive",
    kicker: "Assistive robotics",
    tagline: "A wheelchair you steer with a gesture and a glance",
    year: "2025 — ongoing",
    status: "In development",
    accent: "violet",
    image: "/images/vision-drive.jpeg",
    imageAlt: "Vision Drive prototype chassis — ESP-32, motor driver and battery pack",
    blurb:
      "A CNN reads hand gestures while a second pipeline tracks pupil movement. An ESP-32 turns both into motor commands — for people who can't use a joystick.",
    description:
      "An assistive mobility prototype for people who cannot operate a conventional joystick. A convolutional neural network reads the user's hand gestures, while a second vision pipeline tracks pupil movement — together they translate intent into direction, speed and stop commands.",
    detail:
      "The perception stack runs against a live camera feed and streams commands to an ESP-32 on the chassis, which drives the motors through an H-bridge. The prototype validates the full loop end to end: frame in, gesture and gaze classified, wheels turning — untethered, on battery.",
    contributions: [
      "CNN gesture classifier trained on a self-collected dataset",
      "Pupil-tracking pipeline for hands-free steering",
      "ESP-32 firmware and the vision-to-motor protocol",
      "Drive chassis, power and motor-driver hardware",
    ],
    built:
      "Python and OpenCV run the vision pipeline against a live camera feed — a CNN classifies the gesture, a second pass tracks the pupil. Commands stream over serial to C++ firmware on an ESP-32, which drives the motors through an H-bridge.",
    stack: ["Python", "OpenCV", "CNN", "ESP-32", "C++"],
    links: [{ label: "View on GitHub", href: "https://github.com/Yashsaah/Vision-Drive" }],
  },
  {
    index: "02",
    title: "Interpretable Medical Imaging",
    kicker: "Interpretability",
    tagline: "Teaching diagnostic models to show their work",
    year: "2025",
    status: "Research",
    accent: "cyan",
    sim: "gradcam",
    blurb:
      "CNNs that detect pneumonia in chest X-rays and glaucoma in retinal scans — then show their working, because a model can be right for the wrong reason.",
    description:
      "CNNs trained to detect pneumonia in chest X-rays and glaucoma in retinal scans, then made to justify themselves. Grad-CAM maps the gradients flowing into the last convolutional layer back onto the input, turning every prediction into a heatmap over the pixels it actually rested on.",
    detail:
      "Accuracy alone is not enough in a clinical setting. By mapping class-activation gradients onto the original scan, the work separates genuine pathological signal from dataset artefacts — and makes each prediction something a human expert can challenge rather than simply accept.",
    contributions: [
      "Classifiers trained on MedMNIST across two imaging conditions",
      "Grad-CAM overlays exposing the evidence per prediction",
      "Failure analysis where confidence rested on artefacts",
    ],
    built:
      "One CNN per condition, trained in Python on the MedMNIST biomedical image collection — chest X-rays for pneumonia, retinal images for glaucoma. Grad-CAM hooks the last convolutional layer, weights the feature maps by their gradients, and renders the result as a heatmap over the original scan.",
    stack: ["Python", "MedMNIST", "CNN", "Grad-CAM"],
    links: [{ label: "View on GitHub", href: "https://github.com/Yashsaah/medical-imaging-cnn" }],
  },
  {
    index: "03",
    title: "Blackbox Research",
    kicker: "Research & product",
    tagline: "What networks learn, and a place to publish it",
    year: "2025",
    status: "Live",
    accent: "amber",
    sim: "blackbox",
    blurb:
      "Research into how neural networks generalize, explain themselves and compress — published through a site taken from empty repository to live URL.",
    description:
      "Built at the Incubate Nepal research camp: a complete web application for an AI research group, taken from an empty repository to a deployed, publicly accessible product inside the length of the programme.",
    detail:
      "Researched neural network generalization, interpretability, and efficiency through Double Descent, Grad-CAM, and the Lottery Ticket Hypothesis (LTH).",
    contributions: [
      "Researched neural network generalization, interpretability and efficiency — through double descent, Grad-CAM and the Lottery Ticket Hypothesis",
      "Built the group's website and published the research on it",
      "Deployed our CNN model for medical diagnosis behind the site",
    ],
    built:
      "A React front end deployed on Vercel, publishing the write-ups for each research thread. The trained CNN sits behind it so the medical-diagnosis model can be run from the page rather than only from a notebook.",
    /* No `stack` here — the "How it's built" panel covers it, and the dialog
       drops the Built-with column when the field is absent. */
    links: [{ label: "Visit live site", href: "https://blackbox-research.vercel.app/" }],
  },
];

export const achievements = [
  {
    year: "National",
    title: "First Runner-Up — National SET Exhibition",
    org: "St. Xavier's College",
    accent: "violet",
    description: "Second nationally, against project teams from across the country.",
  },
  {
    year: "National",
    title: "Silver Medal — National Maths League",
    org: "Budhanilkantha School (BNKS)",
    accent: "cyan",
    description: "Silver at a nationwide competitive mathematics championship.",
  },
  {
    year: "2024 — 2026",
    title: "Mahatma Gandhi Scholarship Awardee",
    org: "Embassy of India",
    accent: "amber",
    description:
      "A merit scholarship for high school, awarded for academic excellence and held across the 2024–2026 term.",
  },
];

export const marqueeItems = [
  "Computer Vision",
  "ESP-32",
  "CNN",
  "Grad-CAM",
  "Robotics",
  "C++",
  "Python",
  "React",
  "Kali Linux",
  "Machine Learning",
  "Arduino",
  "Academic Research",
  "Leadership",
];

export const navLinks = [
  { id: "skills", label: "Skills" },
  { id: "work", label: "Projects" },
  { id: "awards", label: "Awards" },
  { id: "contact", label: "Contact" },
];
