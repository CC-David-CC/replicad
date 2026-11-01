# Replicad primitive model preview

This app creates box and cylinder solids in a browser worker with Replicad. Enter dimensions in millimetres and an optional through-hole diameter (0 means no hole) and X/Y offsets from the center, then select **Build preview** to inspect the actual generated geometry: drag to rotate, scroll or pinch to zoom. The preview reports solid volume in mm³ and total surface area in mm², including the inside of any through-hole. For example, a 40 × 40 × 20 mm box with a 10 mm hole has a volume of approximately 30,429.2 mm³. Rebuild the preview after changing dimensions. Older projects without a hole setting open with no hole; projects without offsets use the center. The hole must fit fully inside the selected shape. Save an editable `.replicad.json` project in My files, and create an STL or STEP model there. Open saved projects from the app or from Files. STL and STEP are exports, not editable project files. Upload a project using Files first.

This is a primitive generator with at most one vertical through-hole, not a full CAD editor: there is no CAD source editor, assemblies, or validation for manufacturing. The project format is specific to this app. The preview requires browser WebGL and is an inspection aid, not a manufacturing check. Independently verify exported geometry before manufacturing.

**Cancel preview** stops the current preview calculation without closing the
window. If an earlier preview exists, it remains visible; rebuild to see any
new dimensions. Cancelling a preview is separate from cancelling a model export.

The app uses the shared account file service; temporary guest Linux files are separate. Browser storage syncs with the account server when available. It checks file versions and asks before replacing other files. Each window owns its worker and file subscription; closing or cancelling stops its worker. Existing unsaved parameter changes prompt before opening another project or closing the window. Project saves and model exports capture their destination and dimensions when started; edits made afterward remain in the window and are identified as newer than the saved snapshot.

Source entry: `index.mjs`; viewer: `preview.mjs`; worker: `workers/engine.mjs`; dependencies and build settings: `package.json`. Build with the shared public app builder, which bundles dependencies privately. See `docs/APP_UNIFICATION_PROGRESS.md` for current validation and remaining work.

Local desktop, emulated-phone and 4K and live emulated-phone account tests compare area and volume with analytical values and verify offset hole vertices in exported box and cylinder STL files, boundary rejection, preview, project sync and fresh-session reopening. STL is a triangulated approximation; independently check any model before fabrication.

A persistent notice reports when My files synchronization detects that the saved project changed, became unavailable, or has conflicting copies. Your current parameters remain open; save a copy or resolve conflicts in Files. Project and model writes also identify immediate conflicts.

Opening another project and replacing project or model files use desktop confirmations. Cancelling preserves the current work; a parameter or target file changed while confirmation is open prevents the operation. Geometry is generated locally and must be independently checked before fabrication.

The app asks before closing while a project save or model export is
in progress, even when the parameters were clean before the operation began.
Cancelling or failing restores the previous unsaved state unless parameters
changed in the meantime. An already-dispatched file write may still complete
after the window closes.
