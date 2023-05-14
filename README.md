# Color.js


## Create a new Color object:
There are many different ways to initialize a Color object:
```
// Create transparent color (red, green, blue and alpha will have the value 0 - so it is a fully transparent black)
const myColor1 = new Color();

// Create red color from hexadecimal number syntax - allways use the eight-value syntax (last two values are the transparency)
const myColor2 = new Color(0xFF0000FF);

// Create pink color from CSS color keyword
const myColor3 = new Color('hotpink');

// Create blue color from CSS color syntax - you can also use 'rgba(0, 0, 255, 1)' or 'rgba(0 0 255 / 1)'
const myColor4 = new Color('rgb(0, 0, 255)');

// Create green color from CSS hex color syntax - you can also use '#0F0' or '#0F0F' or '#00FF00FF'
const myColor5 = new Color('#00FF00');

// Create green color from other Color object
const myColor6 = new Color(myColor5);

// Create yellow color with 50% transparency from object with r, g, b, a properties
const myColor7 = new Color({
  r: 255,
  g: 255,
  b: 0,
  a: 0.5
});

// Create magenta color with 50% transparency from object with red, green, blue, alpha properties
const myColor8 = new Color({
  red:   255,
  green: 0,
  blue:  255,
  alpha: 0.5
});

// Create color from a function (in this example a random one of four given colors)
const myColor9 = new Color(function(propertyObject) {
  const items = [
    '#f00',
    'rgba(0, 255, 255, .3)',
    0x0000FF00,
    'lime'
  ];
  return items[Math.floor(Math.random()*items.length)];
});
```

## Methods:

### Reset the color
```
myColor.setRgb(r, g, b);

myColor.setRgba(r, g, b, a);

myColor.setColor(color); // same as 'new Color(color)' constructor

myColor.setHSV(h, s, v);
```

### Get the color in different formats
```
myColor.getHSV();

myColor.getCss();

myColor.getCssRgb();

myColor.getCssRgba();

myColor.getCssHex();

myColor.getRgb();

myColor.getRgba();

myColor.getRgbNumber();

myColor.getRgbaNumber();
```

### Get specific values of the color
```
myColor.getRed();

myColor.getGreen();

myColor.getBlue();

myColor.getAlpha();
```

### Transform the color
```
myColor.applyMatrixFilter(M);

myColor.applyColorFilter(color);

myColor.brightness(brightness);

myColor.brightnessRgba(r, g, b, a);

myColor.invert();

myColor.invertAlpha();
```

### Transform the Color object into a different type of value
The methods below are not typically called directly, but allow the Color object to be used in many scenarios, such as `element.style.color = myColor`;
```
myColor.toString();

myColor.toNumber();

myColor.toArray();
```
