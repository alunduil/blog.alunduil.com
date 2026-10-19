import { getCollection } from "astro:content";
import { postFeed } from "@/utils/postFeed";
import { useTranslations } from "@/i18n";
import config from "@/config";

export async function GET() {
  const t = useTranslations(config.site.lang);

  return postFeed(await getCollection("reviews"), {
    title: `${t.pages.reviewsTitle} | ${config.site.title}`,
    description: t.pages.reviewsDesc,
  });
}
