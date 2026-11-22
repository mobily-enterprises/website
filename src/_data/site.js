// Facts about the site and the places it links to, each in one place.
export default {
  name: "Mobily Enterprises",
  url: "https://mobilyenterprises.com",
  tagline: "Software where people and AI work together.",
  github: "https://github.com/mobily-enterprises",

  // The AI Research Diary, where our research is published. Every diary link on the site starts here.
  diaryUrl: "https://research.mobilyenterprises.com/",
  diarySource: "https://github.com/mobily-enterprises/research-diary",

  vibe64: {
    url: "https://vibe64.dev",
    source: "https://github.com/mobily-enterprises/vibe64",
  },
  mercbot: {
    url: "https://mercbot.ai",
    source: "https://github.com/mobily-enterprises/mercbot",
  },

  nav: [
    { label: "Vibe64", url: "/vibe64/", icon: "code" },
    { label: "Mercbot", url: "/mercbot/", icon: "chat" },
    { label: "Research", url: "/research/", icon: "flask" },
    { label: "About", url: "/about/", icon: "people" },
  ],

  year: new Date().getUTCFullYear(),
};
