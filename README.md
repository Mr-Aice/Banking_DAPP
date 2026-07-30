# Banking_DAPP

This repository is configured for **static website hosting** (HTML + PDF) using **GitHub Pages**.

## Upload files
- Put your main page at `/index.html`.
- Upload your PDF file in the repository root (or any subfolder), for example: `/brochure.pdf`.

## Launch website
1. Push your HTML/PDF files to the `main` branch.
2. Go to **GitHub → Settings → Pages**.
3. Ensure the source is set to **GitHub Actions**.
4. The workflow `.github/workflows/deploy-pages.yml` will publish the site automatically.

The `.nojekyll` file is included to ensure static files are served directly without Jekyll processing.
