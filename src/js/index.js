import '../css/base/guge.scss';
import '../css/base/head.scss';
import '../css/index.scss';
import '../css/base/foot.scss';
import {Slider} from '../js/common/slider';
import {PubSubEvent} from '../js/common/pubSubEvent';

let init = function(){
    initSlider();
};
let initSlider = function(){
    let sliderContext = document.getElementById("indexSliderWrap"),
        sliderItemNodeList = sliderContext.querySelectorAll(".sliderItem"),
        prevButton = sliderContext.querySelector('.js-sliderButtonPrev'),
        nextButton = sliderContext.querySelector('.js-sliderButtonNext');
    let currentIndex = 0,
        totalSliderLength = sliderItemNodeList.length,
        bindEvent,getPrevItem,getNextItem;
    let SliderInstance = new Slider(sliderContext,{
        interval:3000,
        direction:"left"
    });

    PubSubEvent.subscribe("sliderIndex",function(index){
        currentIndex = index;
    });
    bindEvent = function(){
        let prevItem = null,
            nextItem = null;
        prevButton.addEventListener("mouseenter",() => {
            prevItem = getPrevItem();
        },false);
        nextButton.addEventListener("mouseenter",() => {
            nextItem = getNextItem();
        },false);
        prevButton.addEventListener('click',() => {
            if(prevItem){
                SliderInstance.gotoItem("right",prevItem);
                prevItem = getPrevItem();
            }
        },false);
        nextButton.addEventListener('click',() => {
            if(nextItem){
                SliderInstance.gotoItem("left",nextItem);
                nextItem = getNextItem();
            }
        },false);
    };
    getPrevItem = function(){
        let preIndex = 0;
        if(0 == currentIndex){
            preIndex = totalSliderLength - 1;
        }else{
            preIndex = currentIndex -1;
        }
        return SliderInstance.getNextItem("right",preIndex);
    }
    getNextItem = function(){
        let nextIndex = 0;
        if(totalSliderLength - 1 != currentIndex){
            nextIndex = currentIndex + 1;
        }
        return SliderInstance.getNextItem("left",nextIndex);
    }
    bindEvent();
}
init();