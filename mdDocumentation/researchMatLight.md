# Materials and Lights 💡

### 1st = Starting Point vs 2nd = new color setting
![Starting point](./refPictures/researchMatLight/0_Starting_point.png)
![New color setting](./refPictures/researchMatLight/1_recommendation_color.png)

### New color setting 🎨
  
To have more accurate colors do this:  
const color = new Color(0x800080);
color.convertSRGBToLinear()  
[Ref =>](https://discoverthreejs.com/tips-and-tricks/#lights)  
  
=> OBSERVATION = need to use THREE.Color(), otherwise doesn't work (convertSRGBToLinear only works if the color is an instance of Color) 

### 1st = Starting Point vs 2nd = New renderer settings 
![Starting point](./refPictures/researchMatLight/0_Starting_point.png)
![New renderer settings](./refPictures/researchMatLight/2_recommendation_renderer.png)

For (nearly) accurate colors, use these settings for the renderer:
renderer.gammaFactor = 2.2;
renderer.outputEncoding = THREE.sRGBEncoding;  
[Ref =>](https://discoverthreejs.com/tips-and-tricks/#lights)  

### 1st = Starting Point vs 2nd = New renderer settings + new color settings 

![Starting point](./refPictures/researchMatLight/0_Starting_point.png)
![New settings](./refPictures/researchMatLight/3_color_renderer.png)

=> OBSERVATION = works well together, the shadows are less harsh

### 1st = New settings vs 2nd = New settings + Ambient light 

![New settings](./refPictures/researchMatLight/3_color_renderer.png)
![Ambient light](./refPictures/researchMatLight/4_ambient_light.png)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);  
scene.add(ambientLight);  
  
=> OBSERVATION = can really wash out the picture if use too much (can have problems with volumes if the shadows don't let us read it => might improve with animation => easier for the eye to tell things appart if they are moving individually).

### 1st = New settings (with ambient light) vs 2nd = New direction for the directional light 

![New settings](./refPictures/researchMatLight/4_ambient_light.png)
![Change light direction](./refPictures/researchMatLight/5_new_lights_coordinates.png)

Before: shadowLight.position.set(150, 350, 350);
After: shadowLight.position.set(-150, 100, 250);
  

=> OBSERVATION = Not so important at the moment, since will probably change it again when the layout will be final.

### Comparison 1st try vs last 😎

![Starting point](./refPictures/researchMatLight/0_Starting_point.png)
![Starting point](./refPictures/researchMatLight/5_new_lights_coordinates.png)
