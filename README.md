# kclcybersoc

the website for kcl cyber security society, at **[kclcybersoc.org.uk](https://kclcybersoc.org.uk)**.

static html in the society's terminal house style (black on off-white, ibm plex
mono + jetbrains mono), no build step. hosted on github pages with a custom domain.

- **`/`** &rarr; `index.html`: the landing page (what we do, next event, contact).
- **`/phonelinks`** &rarr; `phonelinks/index.html`: the link-in-bio page for the
  instagram bio. built from the [cybersoc-ig](https://github.com/iamzainrizwan/cybersoc-ig)
  template, so it matches the posts and stories.

## editing it

**the links on `/phonelinks`:** edit the `LINKS` array near the bottom of
`phonelinks/index.html`. each item is `{ label, note, url }`; `hot: true` draws
the button inverted (use it for whatever's on this week).

**the landing page:** plain html in `index.html`. the next event is the
`<div class="event">` block; the contact row is the `.links` list. colours and
the terminal chrome are css variables at the top (`--ink`, `--paper`, `--dim`).

**fonts** live in `fonts/`, the shield logo in `assets/`. keep asset paths
root-absolute (`/fonts/...`, `/assets/...`) so they work from `/phonelinks` too.

## run it locally

```
python3 -m http.server
```

then open http://localhost:8000 (and http://localhost:8000/phonelinks/).

## deploy

push to `main`. github pages serves it, and `CNAME` points the custom domain at
it. dns is four A records for the apex `kclcybersoc.org.uk` &rarr; github pages,
plus a `www` cname; enforce https in **settings &rarr; pages** once the cert is
issued.

## house style

- lowercase copy, apart from terminal output that really is uppercase.
- black, off-white and one grey. no colour, no emoji.
- one inverted keyword per headline (`cyber [security] society`).

run by kcl cyber security society.
