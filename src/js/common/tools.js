let classNameOper = {
    addClass(dom,class_name){
        if(Object.prototype.toString.call(dom) === "[object NodeList]"){
            dom.forEach((value,index) => value.className = value.className + " " + class_name);
        }else{
            dom.className = dom.className + " " + class_name; 
        }
    },
    removeClass(dom,class_name){
        let rc = (dom) => {
            let currentClassName = dom.className,
                pattern = new RegExp("(\\s+|^)"+class_name+"(\\s+|$)");
            let result = pattern.exec(currentClassName);
            if(result){
                dom.className = currentClassName.substring(0,result.index) + currentClassName.substring(result.index+class_name.length+1);
            }
        };
        if(Object.prototype.toString.call(dom) === "[object NodeList]"){
            dom.forEach((value,index) => void rc(value));
        }else{
            rc(dom);
        }
    }
};

export {classNameOper};