# Deploy

## Done
- Private GitHub repo: https://github.com/LauhithN/netflix-birthday-site
- Production build passes (`npm run build`)
- Local production server verified at http://localhost:3000
- Temporary public tunnel (while `npm run start` is running): https://odd-rabbits-kick.loca.lt

## Vercel permanent host (one-time login)

```bash
cd ~/Projects/netflix-birthday-site
npx vercel login          # complete in browser
npx vercel --yes --prod   # prints the permanent URL
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
