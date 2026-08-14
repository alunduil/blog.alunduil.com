import satori from "satori";
import { SITE } from "@/config";
import loadBrandFonts from "../loadBrandFonts";
import { COLORS, STROKE, block } from "./mondrian";

const formatDate = (date, timezone) =>
  new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timezone,
  }).format(date);

const TAG_LIMIT = 3;
const TAG_CHAR_LIMIT = 12;

const truncate = tag =>
  tag.length > TAG_CHAR_LIMIT ? tag.slice(0, TAG_CHAR_LIMIT - 1) + "…" : tag;

export default async post => {
  const hostname = new URL(SITE.website).hostname;
  const pubDate = formatDate(
    post.data.pubDatetime,
    post.data.timezone ?? SITE.timezone
  );
  const titleSize = post.data.title.length > 60 ? 64 : 84;
  const tags = post.data.tags.slice(0, TAG_LIMIT).map(truncate);

  return satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: COLORS.black,
          padding: STROKE,
          gap: STROKE,
          fontFamily: "IBM Plex Sans",
          color: COLORS.black,
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "row",
                gap: STROKE,
                height: 96,
              },
              children: [
                block(COLORS.red, { width: 280 }),
                block(COLORS.cream, { flex: 1 }),
                block(COLORS.blue, { width: 120 }),
                block(COLORS.yellow, { width: 200 }),
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "row",
                gap: STROKE,
                flex: 1,
              },
              children: [
                block(COLORS.blue, { width: 96 }),
                {
                  type: "div",
                  props: {
                    style: {
                      flex: 1,
                      background: COLORS.cream,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      padding: "32px 64px",
                      overflow: "hidden",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: titleSize,
                            fontWeight: 700,
                            lineHeight: 1.1,
                            letterSpacing: "-0.01em",
                            overflow: "hidden",
                          },
                          children: post.data.title,
                        },
                      },
                    ],
                  },
                },
                block(COLORS.yellow, { width: 120 }),
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "row",
                gap: STROKE,
                height: 132,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      width: 200,
                      background: COLORS.yellow,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 6,
                      padding: "0 20px",
                      fontSize: 22,
                      color: COLORS.black,
                      overflow: "hidden",
                    },
                    children: tags.map(tag => ({
                      type: "div",
                      props: {
                        style: { whiteSpace: "nowrap" },
                        children: `#${tag}`,
                      },
                    })),
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      flex: 1,
                      background: COLORS.cream,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 56px",
                      fontSize: 28,
                    },
                    children: [
                      {
                        type: "div",
                        props: { children: pubDate },
                      },
                      {
                        type: "div",
                        props: {
                          style: { fontWeight: 700 },
                          children: hostname,
                        },
                      },
                    ],
                  },
                },
                block(COLORS.blue, { width: 120 }),
                block(COLORS.red, { width: 220 }),
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadBrandFonts(),
    }
  );
};
