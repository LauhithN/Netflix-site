# Deploy

## Done
- Private GitHub repo: https://github.com/LauhithN/netflix-birthday-site
- Production build passes (`npm run build`)

## Vercel (one-time login required)

```bash
cd ~/Projects/netflix-birthday-site
npx vercel login          # complete in browser
npx vercel --yes --prod   # deploys and prints the URL
```

Optional env in Vercel project settings:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

Keep the GitHub repo **private**. After deploy, open the URL on her phone and your smart TV browser.

## Local preview

```bash
npm run build && npm run start
# http://localhost:3000
```
