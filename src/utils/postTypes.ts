import { z } from "astro/zod";

export const postTypeSchema = z.enum(["story", "practice", "how-to"]);
