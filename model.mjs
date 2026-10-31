export const PROJECT='codi.primitive-model/1';
export function normalizeModel(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.format!==PROJECT||!['box','cylinder'].includes(value.shape))throw Error('Not a valid primitive model project.');
 const {shape,width,depth,height}=value,holeDiameter=Object.hasOwn(value,'holeDiameter')?value.holeDiameter:0;
 if(![width,depth,height].every(n=>typeof n==='number'&&Number.isFinite(n)&&n>0&&n<=10000))throw Error('Dimensions must be greater than 0 and at most 10000 mm.');
 if(typeof holeDiameter!=='number'||!Number.isFinite(holeDiameter)||holeDiameter<0||holeDiameter>10000)throw Error('Hole diameter must be 0 or a positive number in millimetres.');
 if(holeDiameter>0&&holeDiameter>=(shape==='box'?Math.min(width,depth):width))throw Error('The centered hole must be smaller than the surrounding shape.');
 return {format:PROJECT,shape,width,depth,height,holeDiameter};
}
