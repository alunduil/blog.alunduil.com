import { defineAstroPaperConfig } from "./src/types/config.ts";

export default defineAstroPaperConfig({
  site: {
    url: "https://blog.alunduil.com/",
    title: "alunduil",
    description: "Working notes from a production software engineer on reliability, observability, and feedback-loop systems.",
    author: "Alex Brandt",
    profile: "https://github.com/alunduil",
    ogImage: "og.png",
    lang: "en",
    timezone: "Europe/London",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/alunduil", rel: "me" },
    { name: "linkedin", url: "https://www.linkedin.com/in/alunduil/" },
    { name: "bluesky",  url: "https://bsky.app/profile/alunduil.com" },
    { name: "mail",     url: "mailto:alunduil@gmail.com" },
  ],
  shareLinks: [
    { name: "linkedin", url: "https://www.linkedin.com/sharing/share-offsite/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
