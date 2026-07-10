# How to publish your GitHub landing page

GitHub shows a special "profile README" at the top of **github.com/aakashshahani**.
It comes from a repo whose name is **exactly your username**.

## Steps

1. Create a new **public** repository named exactly:

   ```
   aakashshahani
   ```

   > GitHub will show a hint: _"aakashshahani/aakashshahani is a ✨special✨ repository
   > that you can use to add a README.md to your GitHub profile."_ That confirms you
   > named it right. Check **"Add a README file"**.

2. Replace that repo's `README.md` with the one in this folder
   (`github-profile/README.md`), then commit.

### From the command line

```bash
# in an empty folder
git clone https://github.com/aakashshahani/aakashshahani.git
cd aakashshahani
cp /path/to/portfolio/github-profile/README.md README.md
git add README.md
git commit -m "Add profile README"
git push
```

3. Open **github.com/aakashshahani** — the landing page is live.

## Notes

- Update the portfolio link (`https://aakashshahani.vercel.app`) once you deploy the
  site, so both this section and the badge point to the real URL.
- The stats cards (`github-readme-stats`, streak stats) render live from your public
  activity — nothing to configure. If a card doesn't load, it's usually the free host
  rate-limiting; it recovers on its own.
- The 🂡 card glyphs are Unicode playing cards; if any render oddly on your OS you can
  swap them for ♠ ♥ ♦ ♣.
