import {setOC,makeBox,makeCylinder,measureVolume,measureArea} from 'replicad';
import {normalizeModel,PROJECT} from '../model.mjs';
import init from 'replicad-opencascadejs';
import wasm from '../node_modules/replicad-opencascadejs/dist/replicad_single.wasm';
let ready;
self.onmessage=async ({data})=>{let solid,tool,result,bbox;try{
 const model=normalizeModel({format:PROJECT,shape:data.kind,width:data.width,depth:data.depth,height:data.height,holeDiameter:data.holeDiameter??0,holeX:data.holeX??0,holeY:data.holeY??0});if(!['stl','step'].includes(data.format))throw Error('Choose STL or STEP export.');
 ready??=init({locateFile:name=>name.endsWith('.wasm')?wasm:name}).then(setOC);await ready;
 solid=model.shape==='box'?makeBox([0,0,0],[model.width,model.depth,model.height]):makeCylinder(model.width/2,model.height);
 if(model.holeDiameter){const margin=Math.max(1,model.height*.01),center=model.shape==='box'?[model.width/2+model.holeX,model.depth/2+model.holeY,-margin]:[model.holeX,model.holeY,-margin];tool=makeCylinder(model.holeDiameter/2,model.height+2*margin,center);result=solid.cut(tool);}else result=solid;
 bbox=result.boundingBox;const [min,max]=bbox.bounds,extent=max.map((v,i)=>v-min[i]);if(extent.some(v=>!Number.isFinite(v)||v<=0))throw Error('Could not measure the solid extents.');const volume=measureVolume(result),area=measureArea(result);if(!Number.isFinite(volume)||volume<=0||!Number.isFinite(area)||area<=0)throw Error('Could not measure the solid.');const bytes=await (data.format==='step'?result.blobSTEP():result.blobSTL({binary:true})).arrayBuffer();self.postMessage({id:data.id,bytes,volume,area,extent},[bytes]);
 }catch(error){self.postMessage({id:data.id,error:String(error?.message||error)});}finally{bbox?.delete();if(result&&result!==solid)result.delete();tool?.delete();solid?.delete();}};
