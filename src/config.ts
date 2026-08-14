// One name so the header and the OG card cannot drift onto different faces.
export const BRAND_FONT = "IBM Plex Sans";

export const SITE = {
  website: "https://blog.alunduil.com/",
  author: "Alex Brandt",
  profile: "https://github.com/alunduil",
  desc: "Working notes from a production software engineer on reliability, observability, and feedback-loop systems.",
  title: "alunduil",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/alunduil/blog.alunduil.com/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "Europe/London",
  // Public per-site Cloudflare Web Analytics beacon ID. Created once by
  // hand (dashboard → Analytics & Logs → Web Analytics → add blog.alunduil.com).
  // Leave Cloudflare's automatic injection off: the beacon ships from
  // Layout.astro, so edge injection would double-count every pageview.
  cloudflareWebAnalyticsToken: "3cda180b29054d619e163d6cafee3119",
} as const;
