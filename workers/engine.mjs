import {setOC,makeBox,makeCylinder,measureVolume} from 'replicad';
import {normalizeModel,PROJECT} from '../model.mjs';
import init from 'replicad-opencascadejs';
import wasm from '../node_modules/replicad-opencascadejs/dist/replicad_single.wasm';
let ready;
self.onmessage=async ({data})=>{let solid,tool,result;try{
 const model=normalizeModel({format:PROJECT,shape:data.kind,width:data.width,depth:data.depth,height:data.height,holeDiameter:data.holeDiameter??0});if(!['stl','step'].includes(data.format))throw Error('Choose STL or STEP export.');
 ready??=init({locateFile:name=>name.endsWith('.wasm')?wasm:name}).then(setOC);await ready;
 solid=model.shape==='box'?makeBox([0,0,0],[model.width,model.depth,model.height]):makeCylinder(model.width/2,model.height);
 if(model.holeDiameter){const margin=Math.max(1,model.height*.01),center=model.shape==='box'?[model.width/2,model.depth/2,-margin]:[0,0,-margin];tool=makeCylinder(model.holeDiameter/2,model.height+2*margin,center);result=solid.cut(tool);}else result=solid;
 const volume=measureVolume(result);if(!Number.isFinite(volume)||volume<=0)throw Error('Could not measure the solid.');const bytes=await (data.format==='step'?result.blobSTEP():result.blobSTL({binary:true})).arrayBuffer();self.postMessage({id:data.id,bytes,volume},[bytes]);
 }catch(error){self.postMessage({id:data.id,error:String(error?.message||error)});}finally{if(result&&result!==solid)result.delete();tool?.delete();solid?.delete();}};
