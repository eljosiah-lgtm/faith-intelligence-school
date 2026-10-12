# Faith Intelligence School – Classroom (installable web app)

Faith Intelligence School, Oghara, Delta State, Nigeria.

Everything is in plain files, with **no folders**, so you can upload them straight from a phone.

| File | What it is |
|---|---|
| `index.html` | The whole app and all classroom notes |
| `manifest.webmanifest` | Lets Android install it like an app |
| `sw.js` | Saves the app for offline use and fetches updates |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` | App icons |

## Put it online with GitHub Pages
1. On github.com, create a new **public** repository (for example `deltaclassroom`).
2. Choose **Add file → Upload files** and upload the **7 app files** in the table above (not the ZIP itself; this README is optional). Commit.
3. Open **Settings → Pages**. Under **Build and deployment**, set **Source: Deploy from a branch**, **Branch: main**, **Folder: / (root)**, then **Save**.
4. After a minute your app is at `https://YOUR-USERNAME.github.io/deltaclassroom/`.

All links inside the app are relative, so it works under that repository address.

## Install on Android (no Play Store)
Open the address in **Chrome**, tap **⋮ → Install app** (or **Add to Home screen**). The app then opens full screen from the home screen and works offline after the first visit.

## Updating notes later
- To change notes or anything in the app: upload the new `index.html` to the repository (same file name, replace the old one) and commit.
- Phones pick up the new version the next time the app is opened with internet. No reinstall is needed, and the saved offline copy is replaced automatically.
- Only if you add, rename or remove a file, edit `sw.js`: change `const VERSION = 'v1';` to `'v2'` (and list any new file in `CORE`).
