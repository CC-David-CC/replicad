import {setOC,makeBox,makeCylinder} from 'replicad';
import init from 'replicad-opencascadejs';
import wasm from '../node_modules/replicad-opencascadejs/dist/replicad_single.wasm';
let ready;
self.onmessage=async ({data})=>{try{ready??=init({locateFile:name=>name.endsWith('.wasm')?wasm:name}).then(setOC);await ready;const shape=data.kind==='box'?makeBox([0,0,0],[data.width,data.depth,data.height]):makeCylinder(data.width/2,data.height);try{const bytes=await (data.format==='step'?shape.blobSTEP():shape.blobSTL({binary:true})).arrayBuffer();self.postMessage({id:data.id,bytes},[bytes]);}finally{shape.delete();}}catch(error){self.postMessage({id:data.id,error:String(error?.message||error)});}};
