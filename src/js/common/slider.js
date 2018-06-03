import {PubSubEvent} from './pubSubEvent';
class Slider {
    constructor(domContext,options){
        if(!domContext) return;
        options = options || {};
        this.domContext = domContext;//上下文
        this.itemClassName = options.itemClassName || "sliderItem";
        this.itemNodeList = this.domContext.querySelectorAll("."+this.itemClassName);//所有item数组
        this.animationTime = options.animationTime || 600;//动画时间
        this.currentIndex = options.currentIndex || 0;//当前显示的item索引
        this.lifeCount = this.itemNodeList.length;//item的数量
        this.interval = options.interval || 5000;//滑动间隔（自动模式）
        this.auto = options.auto || true;//是否自动滑动
        this.direction = options.direction || "left";//滑动方向
        this.timer = null;
        this.timerObj = {};
        if(this.auto){
            this.start();
        }
        bindEvent.call(this);
    }
    slideLeft(currentItem,nextItem){
        currentItem = currentItem || this.itemNodeList[this.currentIndex];
        if(this.lifeCount - 1 == this.currentIndex){
            this.currentIndex = 0;
        }else{
            ++ this.currentIndex;
        }
        PubSubEvent.publish("sliderIndex",[this.currentIndex]);
        currentItem.style.left = "-100%";
        nextItem.style.left = 0;
    }
    slideRight(currentItem,nextItem){
        currentItem = currentItem || this.itemNodeList[this.currentIndex];
        if(0 == this.currentIndex){
            this.currentIndex = this.lifeCount - 1;
        }else{
            -- this.currentIndex;
        }
        PubSubEvent.publish("sliderIndex",[this.currentIndex]);
        currentItem.style.left = "100%";
        nextItem.style.left = 0;
    }
    gotoItem(dir,nextItem){
        let that = this;
        dir = dir || that.direction;
        // let nextItem = getNextItem.call(that,dir,index);
        if(dir == "left"){
            that.slideLeft(null,nextItem);
        }else{
            that.slideRight(null,nextItem);
        }
    }
    start(){
        let that = this;
        that.timer = setInterval(() => {
            if(that.direction == "left"){
                let nextItem = that.getNextItem();
                var timeOutLeft = setTimeout(() => {
                    if(!that.timer||!nextItem) return;
                    that.slideLeft(null,nextItem);
                    that.timerObj["timeOutLeft"] = null;
                }, that.animationTime);
                that.timerObj["timeOutLeft"] = timeOutLeft;
            }else{
                let nextItem = that.getNextItem();
                var timeOutRight=setTimeout(() => {
                    if(!that.timer||!nextItem) return;
                    that.slideRight(null,nextItem);
                    that.timerObj["timeOutRight"] = null;
                }, that.animationTime);
                that.timerObj["timeOutRight"] = timeOutRight;
            }
        }, that.interval);
    }
    stop(){
        clearInterval(this.timer);
        this.timer = null;
        clearTimer.call(this);
    }
    getNextItem(dir,nextIndex){
        let nextItem = null;
        if(!dir){
            if(this.direction == "left"){
                if(this.lifeCount - 1 == this.currentIndex){
                    nextItem = this.itemNodeList[0];
                }else{
                    nextItem = this.itemNodeList[this.currentIndex+1];
                }
                nextItem.style.zIndex = -1;
                nextItem.style.left = "100%";
            }else{
                if(0 == this.currentIndex){
                    nextItem = this.itemNodeList[this.lifeCount - 1];
                }else{
                    nextItem = this.itemNodeList[this.currentIndex-1];
                }
                nextItem.style.zIndex = -1;
                nextItem.style.left = "-100%";
            }
        }else{
            nextItem = this.itemNodeList[nextIndex];
            nextItem.style.zIndex = -1;
            if(dir == "right"){
                nextItem.style.left = "-100%";
            }else{
                nextItem.style.left = "100%";
            }
        }
        setTimeout(() => {
            nextItem.style.zIndex = "";
        }, this.animationTime);
        return nextItem;
    }
}
//私有方法
function bindEvent(){
    let that = this;
    this.domContext.addEventListener("mouseenter", () => {
        that.stop();
    }, false);
    this.domContext.addEventListener("mouseleave", () => {
        if(!that.timer){
            that.start();
        }
    }, false);
}
function clearTimer(){
    let timerObj = this.timerObj,keyArray = Object.keys(timerObj),key;
    for(key of keyArray){
        if(timerObj[key]){
            clearTimeout(timerObj[key]);
            timerObj[key] = null;
        }
    }
}
export {Slider} ;