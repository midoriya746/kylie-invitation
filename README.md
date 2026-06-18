Kylie's 7th Birthday — GitHub Pages Deployment
===========================================

Instructions to publish this invitation on GitHub Pages (static site):

1) Create a new repository on GitHub (e.g., `kylie-7-invitation`).

2) From your local project folder run these commands in a terminal:

```bash
git init
git add .
git commit -m "Initial invitation"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Replace `USERNAME` and `REPO` with your GitHub username and repository name.

3) The included GitHub Actions workflow will automatically deploy the repository root to GitHub Pages when you push to `main` (or `master`).

4) After the workflow runs (check the Actions tab), open the Pages settings in your repo to see the published URL (usually `https://USERNAME.github.io/REPO/`).

Notes
-----
- If you prefer a custom domain, add a `CNAME` file with your domain in the project root before pushing.
- If you name the repository `USERNAME.github.io` and push to `main`, your site will be available at `https://USERNAME.github.io/`.
- The QR generator and share button will use the repository URL once the site is published.
- RSVP responses also keep a local backup in the browser so the host can export a CSV if the Google Sheets link is unavailable.

Need help pushing or want me to generate a `CNAME` or branch strategy? Tell me your GitHub username and repo name and I can generate exact commands.
