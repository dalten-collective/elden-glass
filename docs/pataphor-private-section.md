# Private Pataphor section

`/pataphor` belongs to the existing site. The rest of the thesis stays public.
Visitors given the shared password can read the section without an account.
Sessions last 12 hours. Closing the section removes the browser cookie.

## Deployment configuration

Set these server-only environment variables in Vercel for Preview and Production:

- `PATAPHOR_PASSWORD`: a randomly generated shared password, at least 16 characters.
- `PATAPHOR_CONTENT_KEY`: a canonical base64-encoded, randomly generated 32-byte key.

The key must match the encrypted article. Keep both values in private credential
storage; do not paste them into GitHub, PR descriptions, or client environment
variables. Do not use a `NEXT_PUBLIC_` prefix. Missing or invalid configuration
keeps the section closed. Redeploy after changing environment variables.

Changing the password revokes existing sessions. Changing the content key also
requires resealing the article. The password is safe to share with invitees; the
content key is only for the maintainer and hosting configuration.

This repository is public, so the private prose is encrypted at rest with
AES-256-GCM. Only `content/pages/pataphor.mdx.enc` is committed. The authenticated
server route decrypts it and passes the MDX to the existing renderer. Public
content loaders, search, feeds, and LLM endpoints do not read the encrypted file.
The generic navigation entry and password entrance are publicly discoverable.
An invited reader can copy or share what they can read.

## Editing the article

Keep the plaintext MDX at `secrets/pataphor.mdx` and private runtime values in
`.env.local`, with permissions restricted to the owner. Both paths are ignored
by Git. Preserve a private backup of the MDX and content key.

After editing the MDX, explicitly seal it from the repository root:

```sh
node --env-file=.env.local scripts/seal-pataphor.mjs
```

Do not turn sealing into a build hook: CI must build without the plaintext or
keys, and normal builds must not rewrite tracked files. Never commit the
plaintext or an environment file. Compile and inspect the authenticated page
locally before publishing a new encrypted artifact.

## Verification and release

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.
Verify anonymous HTML and RSC responses contain only the entrance; wrong
passwords fail; successful login renders the MDX; logout closes it. Check
`Cache-Control: private, no-store` and `X-Robots-Tag: noindex` on the protected
route. Confirm public pages still load and public search/LLM feeds contain no
private prose. Verify the deployed preview after configuration as well.

Follow `AGENTS.md`: feature branch into `dev`, request `rabsef-bicrym` review,
let them merge, validate deployed `dev`, then review a `dev` to `main` PR.
