# Abrar Mughal — 3D Glass Portfolio

This version adds:

- 3D / glassmorphism visual design
- Profile photo picker
- Project screenshot picker
- Multiple screenshot selection (first image is used as the card cover)
- GitHub + live demo fields
- Local browser persistence for projects and profile photo
- Responsive layout

## Important

The upload system in this static version stores images/projects in the browser's localStorage. It does NOT upload them to GitHub or a cloud server.

For a true production portfolio where you can log in from any device and upload projects permanently, connect the project manager to:

Firebase Authentication + Firestore + Firebase Storage

That would give you a real admin dashboard and cloud image storage.

## Customize

Edit the email and LinkedIn URL in `index.html`, then add your real project links.

## Run

Open `index.html` in a browser or use VS Code Live Server.
