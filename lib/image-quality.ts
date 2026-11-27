/** Responsive, resolution-aware versions of the existing sample image URLs.
 * This never enlarges source photography itself; the image provider must have
 * adequate source resolution to deliver a sharp image at the requested width.
 */
export function responsiveImage(url:string,requestedWidth:number){
 if(!url.startsWith("https://images.unsplash.com/"))return url;
 const width=Math.max(200,Math.min(3840,Math.round(requestedWidth)));
 const separator=url.includes("?")?"&":"?";
 return /([?&])w=\d+/.test(url)
  ?url.replace(/([?&])w=\d+/,(_,prefix:string)=>prefix+"w="+width)
  :url+separator+"w="+width;
}
export function imageSrcSet(url:string,widths:readonly number[]){
 if(!url.startsWith("https://images.unsplash.com/"))return undefined;
 return widths.map(width=>responsiveImage(url,width)+" "+width+"w").join(", ");
}
