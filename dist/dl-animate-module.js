export default 

class DLAnimate{
	constructor(){
		this.raf = window.requestAnimationFrame || 
				  window.webkitRequestAnimationFrame ||
				  window.msRequestAnimationFrame;		  

		let divTest = document.createElement("div");

		/* checking browser for necessary opportunities */
		this.canAnimate = (typeof this.raf === "function") &&
					  ("classList" in divTest) &&
					  typeof divTest.style.transition !== undefined;

		if(this.canAnimate){
			this.raf = this.raf.bind(window);
		}

		/* requestAnimationFrame queue */
		this.frames = [];
		this.framesRun = false;
	}

	show(el, options = {}){
		if(!this.canAnimate){
			this._show(el);
		}

		if(!this._isHidden(el)){
			return;
		}

		/* merge defaults and users options */
		let settings = this._calcOptions(options);

		/* set handler on animation finish */
		this._setFinishHandler(el, settings.track, settings.duration, () => {
			this._removeClasses(el, settings.classNames.enterActive);
			this._removeClasses(el, settings.classNames.enterTo);
			settings.afterEnter(el);
		});

		this._show(el);
		this._addClasses(el, settings.classNames.enter);
		settings.beforeEnter(el);
		
		this._addFrame(() => {
			this._addClasses(el, settings.classNames.enterActive);
		});

		this._addFrame(() => {
			this._removeClasses(el, settings.classNames.enter);
			this._addClasses(el, settings.classNames.enterTo);
		});
	}

	hide(el, options = {}){
		if(!this.canAnimate){
			this._hide(el);
		}

		if(this._isHidden(el)){
			return;
		}

		let settings = this._calcOptions(options);

		this._setFinishHandler(el, settings.track, settings.duration, () => {
			this._hide(el);
			this._removeClasses(el, settings.classNames.leaveActive);
			this._removeClasses(el, settings.classNames.leaveTo);
			options.systemOnEnd && options.systemOnEnd();
			settings.afterLeave(el);
		});

		this._addClasses(el, settings.classNames.leave);
		
		settings.beforeLeave(el);
		
		this._addFrame(() => {
			this._addClasses(el, settings.classNames.leaveActive);
		});

		this._addFrame(() => {
			this._addClasses(el, settings.classNames.leaveTo);
			this._removeClasses(el, settings.classNames.leave);
		});
	}

	insert(target, el, options = {}, before = null){
		this._hide(el);
		target.insertBefore(el, before);
		this.show(el, options);
	}

	remove(el, options = {}){
		options.systemDoneCallback = function(){
			el.parentNode.removeChild(el);
		}

		this.hide(el, options);
	}

	_setFinishHandler(el, track, duration, fn){
		let eventName;
		let isCssTrack = true;

		if(track === 'transition'){
			eventName = 'transitionend';
		}
		else if(track === 'animation'){
			eventName = 'animationend';
		}
		else{
			isCssTrack = false;
		}

		if(isCssTrack){
			let handler = function(){
				el.removeEventListener(eventName, handler);
				fn();
			};

			el.addEventListener(eventName, handler);
		}
		else{
			setTimeout(fn, duration);
		}
	}

	_calcOptions(options){
		let name = (options.name !== undefined) ? options.name : 'dl-nothing-doing-class';
		let classNames = this._mergeSettings(this._classNames(name), options.classNames);

		delete options.classNames;

		let defaults = {
			name: '',
			track: 'transition',
			duration: null,
			classNames: classNames,
			beforeEnter(el){},
			afterEnter(el){},
			beforeLeave(el){},
			afterLeave(el){},
			systemDoneCallback(el){}
		}

		let norm = this._mergeSettings(defaults, options);

		/* analize track & duration error */

		return norm;
	}

	_classNames(name){
		return {
			enter: name + '-enter',
			enterActive: name + '-enter-active',
			enterTo: name + '-enter-to',
			leave: name + '-leave',
			leaveActive: name + '-leave-active',
			leaveTo: name + '-leave-to'
		}
	}

	_addFrame(fn){
		this.frames.push(fn);

		if(!this.framesRun){
			this._nextFrame();
		}
	}

	_nextFrame(){
		if(this.frames.length === 0){
			this.framesRun = false;
			return;
		}

		let frame = this.frames.shift();

		this.raf(() => {
			this.raf(() => {
				frame();
				this._nextFrame();
			});
		});
	}

	_addClasses(el, str){
		let arr = str.split(' ');

		for(let i = 0; i < arr.length; i++){
			el.classList.add(arr[i]);
		}
	}

	_removeClasses(el, str){
		let arr = str.split(' ');

		for(let i = 0; i < arr.length; i++){
			el.classList.remove(arr[i]);
		}
	}

	_mergeSettings(defaults, extra){
		if(typeof extra !== "object"){
			return defaults;
		}

		let res = {};

		for(let k in defaults){
			res[k] = (extra[k] !== undefined) ? extra[k] : defaults[k];
		}
		
		return res;
	}

	_hide(el){
		el.style.display = 'none';
	}

	_show(el){
		el.style.removeProperty('display');
		
		if(this._isHidden(el)){
			el.style.display = 'block';
		}
	}

	_isHidden(el){
		return this._getStyle(el, 'display') === 'none';
	}

	_getStyle(el, prop){
		return getComputedStyle(el)[prop];
	}
}