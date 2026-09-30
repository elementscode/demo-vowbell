import { Request, Response, sql } from "@elements/app";

const INLINE = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);
const YEAR = 31536000;

interface PhotoBytes {
  hash: string;
  contentType: string;
  data: Buffer;
}

/** An uploaded photo. The hash in the url makes it safe to cache forever. */
export default function servePhoto(req: Request, res: Response) {
  let p = sql<PhotoBytes>(
    `select hash, contentType, data from photos where id = ${req.params.id} and data is not null`,
  ).firstOrThrow("photo not found");

  if (req.params.hash !== p.hash) {
    res.status(404);
    return res.end();
  }

  if (INLINE.has(p.contentType)) {
    res.setHeader("Content-Type", p.contentType);
  } else {
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment");
  }

  res.setHeader("Cache-Control", `public, max-age=${YEAR}, immutable`);

  return p.data;
}
