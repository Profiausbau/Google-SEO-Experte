import express from "express";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const app = express();

app.get("/meta-checker/api/check", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Keine URL angegeben" });

    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const result = {
      title: doc.querySelector("title")?.textContent || "",
      description: doc.querySelector("meta[name='description']")?.content || "",
      canonical: doc.querySelector("link[rel='canonical']")?.href || "",
      robots: doc.querySelector("meta[name='robots']")?.content || "",
      author: doc.querySelector("meta[name='author']")?.content || "",
      ogTitle: doc.querySelector("meta[property='og:title']")?.content || "",
      ogDescription: doc.querySelector("meta[property='og:description']")?.content || "",
      ogImage: doc.querySelector("meta[property='og:image']")?.content || "",
      twitterTitle: doc.querySelector("meta[name='twitter:title']")?.content || "",
      twitterDescription: doc.querySelector("meta[name='twitter:description']")?.content || "",
      twitterImage: doc.querySelector("meta[name='twitter:image']")?.content || "",
      h1: [...doc.querySelectorAll("h1")].map(h=>h.textContent),
      h2: [...doc.querySelectorAll("h2")].map(h=>h.textContent),
      h3: [...doc.querySelectorAll("h3")].map(h=>h.textContent),
      bold: [...doc.querySelectorAll("b,strong")].map(b=>b.textContent),
      images: {
        total: doc.querySelectorAll("img").length,
        withAlt: [...doc.querySelectorAll("img")].filter(i=>i.alt).length
      },
      links: {
        total: doc.querySelectorAll("a").length,
        internal: [...doc.querySelectorAll("a")].filter(a => new URL(a.href, url).hostname === new URL(url).hostname).length,
        external: [...doc.querySelectorAll("a")].filter(a => new URL(a.href, url).hostname !== new URL(url).hostname).length
      },
      wordCount: doc.body.textContent.split(/\s+/).filter(Boolean).length
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static(".")); // damit index.html läuft

app.listen(3000, () => console.log("MetaChecker läuft auf http://localhost:3000"));
