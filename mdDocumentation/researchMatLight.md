# Materials and Lights

### 1st = Starting Point vs 2nd = new color settings
![Starting point](./refPictures/researchMatLight/0_Starting_point.png)
![Starting point](./refPictures/researchMatLight/1_recommendation_color.png)

### New color settings
  
"To have more accurate colors do this:  
const color = new Color(0x800080);
color.convertSRGBToLinear()"  
[Ref =>](https://discoverthreejs.com/tips-and-tricks/#lights)  
=> OBSERVATION = need to use THREE.Color(), otherwise doesn't work (convertSRGBToLinear only works if the color is an instance of Color) 

### 1st = Starting Point vs 2nd = New renderer settings
![Starting point](./refPictures/researchMatLight/0_Starting_point.png)
![Starting point](./refPictures/researchMatLight/2_recommendation_renderer.png)

"For (nearly) accurate colors, use these settings for the renderer:
renderer.gammaFactor = 2.2;
renderer.outputEncoding = THREE.sRGBEncoding;"  
[Ref =>](https://discoverthreejs.com/tips-and-tricks/#lights)  

### 1st = Starting Point vs 2nd = New renderer settings + new color settings

![Starting point](./refPictures/researchMatLight/0_Starting_point.png)
![Starting point](./refPictures/researchMatLight/3_color_renderer.png)

=> OBSERVATION = works well together, the shadows are less harsh

### 1st = New settings vs 2nd = New settings + Ambient light

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);  
scene.add(ambientLight);  
=> OBSERVATION = can really wash out the picture if use too much (can have problems with volumes if the shadows don't let us read it)




### Mesh Lambert Material

Doesn’t work for shiny materials, but for matte materials like cloth it will give very similar results to MeshPhongMaterial but is faster.

## Research Lighting

### Recommendations

* Direct lights (SpotLight, PointLight, RectAreaLight, and DirectionalLight) are slow. Use as few direct lights as possible in your scenes.
* Avoid adding and removing lights from your scene since this requires the WebGLRenderer to recompile all shader programs (it does cache the programs so subsequent times that you do this it will be faster than the first). Instead, use light.visible = false or light.intensiy = 0.
* Turn on renderer.physicallyCorrectLights for accurate lighting that uses SI units.
* Use a CameraHelper to visualize the shadow camera’s viewing frustum.
* Make the shadow frustum as small as possible.
* Remember that point light shadows are more expensive than other shadow types since they must render six times (once in each direction), compared with a single time for DirectionalLight and SpotLight shadows.
* While we’re on the topic of PointLight shadows, note that the CameraHelper only visualizes one out of six of the shadow directions when used to visualize point light shadows. It’s still useful, but you’ll need to use your imagination for the other five directions.