> Javascrupt library to control CSS transitions and animations

## Idea

Often we need to animate DOM elements, in particular when they are shows up or hides.

This library provides native CSS3 animations and transitions by add/remove 3 special animation classes: 
*-enter, *-enter-active, *-enter-active-to 
and 3 classes for hide element:
*-leave, *-leave-active, *-leave-active-to 


## Install

### NPM + Babel
```
$ npm i dl-animate --save
```
```js
import DLAnimate from 'dl-animate/dist/dl-animate-module';

let anyName = new DLAnimate();
```

### Simple
```html
<script src="https://unpkg.com/dl-animate"></script>
```
## Usage samples on jsfiddle
You also can find this samples on https://github.com/dmitry-lavrik/dl-aniamte/tree/master/demos  

| Description | Link |
|---|---|
| Nice show/hide element |  https://jsfiddle.net/88fg95w1/ |
| Nice append/remove element |  https://jsfiddle.net/eLhnzLL7/ |
| Events callback |  https://jsfiddle.net/n8r78jr4/ |
| Hard duration |  https://jsfiddle.net/hcdcx51f/ |
| Insert element before other |  https://jsfiddle.net/4qnzL450/ |
| Keyframes + animation | https://jsfiddle.net/98a4aeee/ |
| User classNames | https://jsfiddle.net/3vn9j63n/ |
| Start values in enter-leave classes | https://jsfiddle.net/L74sb1nh/ |

## Methods of DLAnimate instance

### show(DOMElemenet, options)
Show element with animation only if element is hidden now.

### hide(DOMElemenet, options)
Hide element with animation only if element is visible now.

### insert(parentElemenet, newElement, options, [insertBeforeElement = null])
Insert newElement to parentElemenet and animate after it.  

If insertBeforeElement is null, newElement append in parentElemenet.  

If insertBeforeElement is other child of parentElemenet, newElement will insert before insertBeforeElement.

### remove(DOMElemenet, options)
Hide element with animation and then remove element from DOM.

## Options
It's very important argument for all methods!  

| Name  | Type  | Description  | Default  | Sample  |
|---|---|---|---|---|
| name  | String |  string for class names generation |  dl-nothing-doing-class | https://jsfiddle.net/88fg95w1/
| track  | String |  how we control end of animation (transition, animation, none) | transition | https://jsfiddle.net/98a4aeee/
| duration  | Number |  integer number to stop animation when track is 'none' | null | https://jsfiddle.net/hcdcx51f/
| classNames  | Object |  object with class names, which we use instead of auto generated | {} | https://jsfiddle.net/3vn9j63n/
| beforeEnter  | Function |  callback before element enter | function(el){} | https://jsfiddle.net/n8r78jr4/
| afterEnter  | Function |  callback when element was entered | function(el){} | https://jsfiddle.net/n8r78jr4/
| beforeLeave  | Function |  callback before element leave | function(el){} | https://jsfiddle.net/n8r78jr4/
| afterLeave  | Function |  callback when element was leaved | function(el){} | https://jsfiddle.net/n8r78jr4/

A more detailed description in the creation process.
