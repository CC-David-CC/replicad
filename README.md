# Replicad primitive model preview

This app creates box and cylinder solids in a browser worker with Replicad. Enter dimensions in millimetres, save an editable `.replicad.json` project in My files, and create an STL or STEP model there. Open saved projects from the app or from Files. STL and STEP are exports, not editable project files. Upload a project using Files first.

This is a primitive generator, not a full CAD editor: there is no 3D preview, CAD source editor, assemblies, or validation for manufacturing. The project format is specific to this app. Test exported geometry in an appropriate viewer and independently verify it before manufacturing.

The app uses the shared account file service; temporary guest Linux files are separate. Browser storage syncs with the account server when available. It checks file versions and asks before replacing other files. Each window owns its worker and file subscription; closing or cancelling stops its worker. Existing unsaved parameter changes prompt before opening another project or closing the window.

Source entry: `index.mjs`; worker: `workers/engine.mjs`; dependencies and build settings: `package.json`. Build with the shared public app builder, which bundles dependencies privately. See `docs/APP_UNIFICATION_PROGRESS.md` for current validation and remaining work.
