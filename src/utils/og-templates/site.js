import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

const COLORS = {
  cream: "#F4EFE6",
  black: "#0A0A0A",
  red: "#D5232A",
  blue: "#1E4FA1",
  yellow: "#F1C232",
};

const STROKE = 8;

const block = (background, extra = {}) => ({
  type: "div",
  props: { style: { background, display: "flex", ...extra } },
});

export default async () => {
  const hostname = new URL(SITE.website).hostname;

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
                      alignItems: "flex-start",
                      padding: "32px 64px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 168,
                            fontWeight: 700,
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                          },
                          children: SITE.title,
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 28,
                            fontWeight: 400,
                            marginTop: 28,
                            maxWidth: "92%",
                            lineHeight: 1.35,
                          },
                          children: SITE.desc,
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
                block(COLORS.yellow, { width: 96 }),
                {
                  type: "div",
                  props: {
                    style: {
                      flex: 1,
                      background: COLORS.cream,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 64px",
                      fontSize: 32,
                      fontWeight: 700,
                    },
                    children: [
                      {
                        type: "div",
                        props: { children: SITE.author },
                      },
                      {
                        type: "div",
                        props: { children: hostname },
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
      fonts: await loadGoogleFonts(
        SITE.title + SITE.desc + SITE.author + hostname
      ),
    }
  );
};
