# Launch

Three jobs, in order: go live on the address you already have, add your own domain, and keep the old address and the QR code working for good.

Before any of them, run the launch gate. It builds the site exactly as production does and must pass:

```bash
npm run launch-check
```

CI runs it on every push too (the "Launch check" step).

> I couldn't open Vercel's or Cloudflare's documentation from the session that wrote this, so menu names below are from memory. Where a value matters (DNS records), the steps tell you to copy it from the dashboard instead of from here.

## A. Go live

### 1. Merge the branch

1. On GitHub, open **cianmccaul/portfolio → Pull requests → New pull request**.
2. Base: `main`. Compare: `claude/funny-goodall-qa5ewp`. **Create pull request**.
3. Wait for the **CI** check to go green: type check, unit tests, build, CV PDF, launch check.
4. **Merge pull request**, then **Confirm merge**.

What happens next, by itself:

- Vercel builds `main` as **Production**. Production builds hide every TODO and everything still waiting for approval.
- CI runs on `main`. If the CV's text changed, it commits a fresh `public/Cian-McCaul-CV.pdf`, and Vercel deploys again with it. Expect two production deployments a minute or two apart.

### 2. Check the production deployment

1. Vercel dashboard → the **portfolio** project → **Deployments**. The newest **Production** deployment should be **Ready**, built from the merge commit (and, a minute later, from CI's "Update CV PDF" commit if there was one).
2. Open **https://cianmccaul.vercel.app** in a private window and check:
   - [ ] Home: the proof strip, the BodyMed Hub band, the work list, Contact.
   - [ ] **/work/bodymed-hub/** (and **/work/clinic-platform** redirects to it).
   - [ ] **/work/email-triage/** and **/work/jarvis/**.
   - [ ] **/about/**, **/cv/**, **/colophon/**, a made-up address such as **/nope** (the 404 page).
   - [ ] **/cv.pdf** downloads the one-page CV.
   - [ ] **/links/index.html** (the QR code's address) opens the links card.
   - [ ] No amber TODO boxes and no "Pending approval" markers anywhere.
3. Share a link in a private message to yourself (WhatsApp, LinkedIn or iMessage) to see the social image.

### 3. Turn on the BodyMed figures, once the owner agrees

The switch is `approvals.bodymedMetrics` in `content/resume.json`. One switch publishes everything listed in `docs/todo-content.md` under "The launch figures".

1. First settle the one open check that switch would publish: the tools the Hub was weighed against. In `content/hub.json`, under `replaced.pending`, correct `text` to match what the owner confirms was dropped, then delete the `todo` line. (The launch check refuses to pass while the switch is on and that `todo` is still there.)
2. In `content/resume.json`, change `"bodymedMetrics": false` to `"bodymedMetrics": true`.
3. Commit to `main` (on GitHub: edit the file, **Commit changes** directly to `main`).
4. CI regenerates the CV PDF with the two approved lines (checked: still one page, 93% full) and commits it. Vercel deploys.
5. Check: the 14.5% figure in the home page's BodyMed Hub band, the Results on /work/bodymed-hub/, the BodyMed line in Experience, and the CV.

## B. Your own domain

Use **cianmccaul.com** or **cianmccaul.dev**. Both work the same way. A `.dev` address only works over HTTPS, which Vercel provides automatically.

### 1. Buy it on Cloudflare

1. Cloudflare dashboard → **Domain Registration → Register Domains**.
2. Search for the name, buy it. Cloudflare sells at cost, with WHOIS privacy included.
3. A domain registered with Cloudflare always uses Cloudflare's DNS, so its DNS settings are already in the same dashboard.

### 2. Point it at Vercel

1. Vercel → **portfolio → Settings → Domains → Add**. Type the domain (for example `cianmccaul.com`), and accept adding `www.cianmccaul.com` too.
2. Choose which one is the main address. Use the bare domain (`cianmccaul.com`) and let `www` redirect to it.
3. Vercel then shows each domain as **Invalid configuration**, with the exact DNS records it wants: usually an **A** record for the bare domain and a **CNAME** for `www`. **Copy the values Vercel shows**. Don't use values from a blog post; Vercel has changed them over time.
4. Cloudflare → your domain → **DNS → Records → Add record**:
   - Type **A**, Name `@`, IPv4 address: the value from Vercel. **Proxy status: DNS only** (grey cloud).
   - Type **CNAME**, Name `www`, Target: the value from Vercel. **Proxy status: DNS only** (grey cloud).
   - "DNS only" matters: with Cloudflare's proxy on (orange cloud), Vercel can't issue the certificate or see real visitors.
5. Back in Vercel, the domains turn **Valid** within minutes, sometimes an hour, and the HTTPS certificate is issued automatically.

### 3. Email: hello@ to your Outlook

1. Cloudflare → your domain → **Email → Email Routing → Get started** (or **Enable Email Routing**).
2. **Destination addresses → Add destination address**: your Outlook address. Cloudflare emails it a verification link; click it.
3. **Routing rules → Custom addresses → Create address**: custom address `hello`, action **Send to an email**, destination your Outlook address. **Save**.
4. Cloudflare offers to add the DNS records Email Routing needs (MX records and an SPF TXT record). Accept: **Add records and enable**.
5. Test it: send an email to `hello@yourdomain` from another account and check it arrives in Outlook.

Email Routing only receives. Replies go out from your Outlook address unless you set up a separate sending service, which isn't needed for a portfolio: recruiters will reply to whatever address writes to them.

### 4. Change the site to the new address

Two lines, then everything else follows:

1. `astro.config.mjs`: `site: 'https://cianmccaul.com'`.
2. `content/resume.json`: `basics.url` to `https://cianmccaul.com`, and `basics.email` to `hello@cianmccaul.com`.

What changes by itself on the next build: every canonical URL, the social image URLs (`og:image`), the sitemap and robots.txt, the JSON-LD, the vCard on /links, the email on every page, and the CV PDF (CI regenerates it with the new address and email). Run `npm run launch-check`; it checks that every canonical URL is on the new domain.

Then, by hand:

- [ ] LinkedIn: **Contact info → Website** and the Featured link (see `docs/linkedin.md`).
- [ ] GitHub profile: **Website**.
- [ ] Any demo README that links back to the portfolio (`pulsepay-demo`'s does).

## C. Keep cianmccaul.vercel.app and /links working

The QR code on your business card points to **https://cianmccaul.vercel.app/links/index.html**. It has to work for as long as the cards exist.

- **Keep the `.vercel.app` address serving the site.** Adding a custom domain doesn't remove it. In **Settings → Domains**, don't set `cianmccaul.vercel.app` to redirect anywhere. It serves the same deployment, and every page's canonical URL points search engines at the new domain, so there's no duplicate-content problem.
- **Keep `/links/index.html` as a real file.** The site is built with one folder per page (`build.format: 'directory'` in `astro.config.mjs`), so `dist/links/index.html` exists. Don't move `src/pages/links/index.astro`. Don't add `"cleanUrls": true` or a `"trailingSlash"` rule to `vercel.json`: both would redirect that exact address. A redirect would probably still reach the page, but there's no reason to risk it. The launch check fails if the file is missing.
- **Check it after every change to hosting:** scan the QR code with your phone camera, or open https://cianmccaul.vercel.app/links/index.html.
- If you ever reprint the cards, point the new QR code at `https://yourdomain/links/` and keep this address working anyway.
