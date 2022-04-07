# trace-border-animation

## [demo](https://seegg.github.io/trace-border-animation/)
A configurable ReactJS wrapper component to animate tracing a border around wrapped contents.
The component also accepts css classes to manipulate the container element.

An example:
```
<AnimateTraceBorder borderWidth={5} borderColour={"red"} borderRadius={5} borderStyle={"solid"} animationDuration={1000} speed={0} squareWindow={false} inset={true} trigger={"focus"}>
  <p>Trace Borders</p>
  <div className="demo">
*.bundle.js
  </div>
</AnimateTraceBorder>
```

![Trace border](./docs/images/img1.png?raw=true)


Trying to fighure out how to properly emulate the border radius while animating and connecting it to seperate borders was a doozy. But it turns out simple ratios was good enough. 
```
verticalRadius = current/finalRadius * current;
horizontalRadius = current;
cornerRadius = verticalRadius horizontalRadius;
```
Switch vertical and horizontal components around for different different corners.


![Trace border](./docs/images/radiuses.png?raw=true)