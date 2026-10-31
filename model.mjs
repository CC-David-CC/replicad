export const PROJECT='codi.primitive-model/1';
export function normalizeModel(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.format!==PROJECT||!['box','cylinder'].includes(value.shape))throw Error('Not a valid primitive model project.');
 const {shape,width,depth,height}=value,holeDiameter=Object.hasOwn(value,'holeDiameter')?value.holeDiameter:0,holeX=Object.hasOwn(value,'holeX')?value.holeX:0,holeY=Object.hasOwn(value,'holeY')?value.holeY:0;
 if(![width,depth,height].every(n=>typeof n==='number'&&Number.isFinite(n)&&n>0&&n<=10000))throw Error('Dimensions must be greater than 0 and at most 10000 mm.');
 if(typeof holeDiameter!=='number'||!Number.isFinite(holeDiameter)||holeDiameter<0||holeDiameter>10000)throw Error('Hole diameter must be 0 or a positive number in millimetres.');
 if(![holeX,holeY].every(n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=10000))throw Error('Hole offsets must be finite numbers within ±10000 mm.');
 if(holeDiameter>0&&(shape==='box'?(Math.abs(holeX)+holeDiameter/2>=width/2||Math.abs(holeY)+holeDiameter/2>=depth/2):Math.hypot(holeX,holeY)+holeDiameter/2>=width/2))throw Error('The hole must fit fully inside the shape.');
 return {format:PROJECT,shape,width,depth,height,holeDiameter,holeX,holeY};
}
