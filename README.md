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

Depth applies only to boxes and is disabled for cylinders. Switching shapes
preserves any entered box depth; if a cylinder is saved while that field is
empty or invalid, the compatible project uses the cylinder diameter for its
unused depth value.

The desktop restore reference follows the project most recently opened or
saved. Unsaved parameter edits are not a recovery snapshot; save the project
before refreshing. Local desktop and emulated-phone account tests cover
switching projects, generating a preview, saving and reopening after refresh.

When a restored project is missing or invalid, its stale desktop reference is
cleared so it will not fail again on each refresh; the original file is not
changed. A conflict or other temporary read failure keeps the reference. Local
desktop and emulated-phone tests exercise recovery, the real browser CAD
preview, account synchronization and reopening. Physical touch and fabrication
remain unverified.

Projects containing unrecognized fields are rejected rather than opened and
silently rewritten without them. Keep the original file; this version cannot
edit extensions to the primitive-model format. Legacy projects with the
previously optional hole fields still open normally.

If a restored project is temporarily unavailable or conflicted, **Retry saved project** reopens it once storage is available. Unsaved parameter changes require confirmation before retry; cancelling keeps them. Opening or saving another project clears the retry target. Local registered-account desktop and emulated-phone tests cover an injected read failure, cancellation and confirmation, server sync, and recovery of unchanged original parameters. Physical touch and manufactured geometry were not tested.

The in-app **Try a first model** guide uses a 40 × 40 × 20 mm box with no hole and an expected 32,000 mm³ volume. Width is X, box depth is Y, height and the through-hole axis are Z, and hole offsets are X/Y from the center. STL has no unit label: import it as millimetres and check the dimensions. STEP is intended for CAD exchange; verify dimensions and units in the receiving program. These instructions do not establish manufacturing suitability.

The preview reports the measurements of the model actually visible. If dimensions change, a new build fails, or a build is cancelled, it labels the visible model as the earlier preview and retains its volume and surface area; build again to see current dimensions. A preview display failure explicitly marks the view uncertain. Local desktop and emulated-phone account tests check retained measurements after invalid input, save, sync and reopening.

If a destination or file operation changes while a project or export folder
chooser is open, the old folder choice is rejected and the current destination
is kept. Choose a folder again before saving. Local desktop and phone-sized
registered-account tests cover changed project names and export format, actual
preview and STEP creation, project sync and fresh-browser reopening. Physical
touch and manufacturing validation remain unverified.

Opening or saving a project suggests a model filename in the same folder with
the same name, such as `/Lab/Sensor.stl` for `/Lab/Sensor.replicad.json`.
A plain filename saves at the root of My files. Use a path beginning with
`/` to name a folder. Saving adds `.replicad.json` to a project name without
an extension. Exporting adds `.stl` or `.step` according to the selected
format. If you supplied an extension, it must match the selected format.
Changing the format updates an existing STL or STEP extension. If you edit the export filename or use
its folder chooser, that destination remains yours for the current window;
changing projects does not replace it. A fresh window suggests the opened
project's name again. Existing files still require version-checked replacement.
Local registered-account desktop and emulated-phone tests opened an account
project, built a preview, measured an actual exported 51 mm STL, checked server
sync, saved a copy while retaining a custom model path, closed and reopened the
original. Physical touch and manufactured geometry remain unverified.

The visible preview also reports its measured X × Y × Z bounding extents in
millimetres from the geometry kernel. These are approximate, rounded model
bounds, including its outer envelope rather than any hole diameter or wall
thickness. If a build fails or dimensions change, the extents continue to
describe the earlier visible model. Local registered-account desktop and
emulated-phone tests compare a holed box with actual exported STL vertices,
save and sync the project, reopen it in a fresh session and inspect a cylinder.
STL has no units; verify units, geometry and clearances independently before
fabrication. Physical devices and manufactured parts were not tested.

## Browser commands

The signed-in desktop's in-page command registry provides `inspect` and
`set-parameters` for the open primitive model. An edit supplies the complete
model and the current inspected revision; invalid dimensions or holes and stale
revisions are rejected. The command updates the normal parameters and dirty
state. Use Build preview and Save project in the app; changing parameters does
not automatically build geometry. A preview is not a manufacturing check.
These commands do not provide remote agent access.
