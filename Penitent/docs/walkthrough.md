# Review walkthrough
1. Open the homepage and Chapter 01; show original editorial direction and clothing-only categories.
2. Filter hoodies by size/colour. Open Quiet Hours Tee and show the sold-out XL variant in Ink.
3. Choose M, add twice, and show one merged line. Change quantity and refresh to demonstrate persistence.
4. In developer tools, submit an invalid quantity or a fake price using the normal CSRF token. Quantity is rejected; fake prices never change totals.
5. Use sample contact/address details, choose gift packaging, and create a demo preview. Show that the bag and inventory remain unchanged.
6. Sign in privately at /admin; edit product copy, update a variant's inventory, and show the storefront reflecting the update.
7. Explain the database diagram, cart row lock, inventory version, and server validation. Show PostgreSQL test evidence.
8. Review mobile navigation, saved pieces, and clearly labelled demo policies.

Do not record passwords or expose local secret files in a shared walkthrough. A captioned recording is available at videos/penitent-walkthrough.webm. No external client message has been sent.


