const sizeP = document.getElementById('unit-size');
const cnxUnit = document.getElementById('cnx-unit');
const unitMain = document.getElementById('unit-main');

let accentPicker = document.getElementById("accentPicker");

let bg1Picker = document.getElementById("bg1Picker");
let text1Picker = document.getElementById("text1Picker");

let bg2Picker = document.getElementById("bg2Picker");
let text2Picker = document.getElementById("text2Picker");

// let overlay = document.getElementsByClassName("overlay")[0];

const large = 570;
const medium = 400;
const small = 320;
const xsmall = 288;

//-------------------objects---------------
//-----------------------------------------

const status = {
    // unitWidth - number
    // unitHeight - number
    // size - (large / medium / small / xsmall)
    // layout - (portrait / landscape)
    // slideType - (cover/description/bullet)
    slideType: "cover"
}

const sliderUnit = {
    // activeSlide
    // previousSlide
    // nextSlide
    slideDuration: 8000
}

//-----------------------------------------
//-----------------------------------------

// gets player dimensions 
// also updates status.layout
function unitSize() {
    let width = cnxUnit.clientWidth;
    let height = cnxUnit.clientHeight;
    
    status.unitWidth = width; // update status object
    status.unitHeight = height; // update status object
    
    if (width >= 400) {
        unitMain.className = ""
        unitMain.classList.add("landscape");
        status.layout = "landscape"; // update status object
    } else {
        unitMain.className = ""
        unitMain.classList.add("portrait");
        status.layout = "portrait"; // update status object
    }
    return [width, height]
} unitSize();


// updates status object with size type (large/medium/small/xsmall)
function updateSizeType() {
    let arr = unitSize();
    
    if (arr[0] >= large) {
        status.size = "large"; 
    } else if(arr[0] >= medium){
        status.size = "medium";
    } else if(arr[0] >= small){
        status.size = "small";
    } else if(arr[0] >= xsmall){
        status.size = "xsmall";
    } else if(arr[0] <= xsmall){
        status.size = "xsmall";
    }
}updateSizeType();


// adds a size type class on the player main wrapper
function addSizeClassOnPlayer(){
    switch (status.size) {
        case "large":
        cnxUnit.className = "";
        cnxUnit.classList.add("large");
        break;
        
        case "medium":
        cnxUnit.className = "";
        cnxUnit.classList.add("medium");
        break;
        
        case "small":
        cnxUnit.className = "";
        cnxUnit.classList.add("small");
        break;
        
        case "xsmall":
        cnxUnit.className = "";
        cnxUnit.classList.add("xsmall");
        break;
        
        default:
        break;
    }
}addSizeClassOnPlayer();

//if the player is portrait then the bottom part is dinamically computed (1/4 * player width)
// we do this in order to have a total ratio of 4/5 
function bottomSizeforPortrait() {
    let isPortrait = status.layout;
    let oneFourth = unitSize()[0]/4;
    if (isPortrait == "portrait") {
        document.documentElement.style
        .setProperty('--bottomSectionHeight', `${oneFourth}px`);
    } else {
        document.documentElement.style
        .setProperty('--bottomSectionHeight', "72px");
    }
}bottomSizeforPortrait();



//-----------slider-------------
//------------------------------

// after pressing start reading slider is triggered
function startReading() {
    let coverwidth = document.querySelector(".cover img").clientWidth;
    let cover = document.querySelector(".cover");
    let bottomDiscovered = document.querySelector(".unit-bottom[discovered]");
    let logo = document.querySelector(".logo");
    let details = document.querySelector("#cnx-unit .details");
    
    // document.querySelector("span[data-type='cover']").setAttribute("style", "background: var(--accentSlider)");
    
    details.classList.remove("hide"); // details next to logo
    cover.setAttribute("style", `transform: translateX(-${coverwidth}px)`); // move cover out of view
    bottomDiscovered.classList.add("hide"); // hide title and content related to cover
    setTimeout(function() { cover.classList.add('hide') }, 1000);// hide cover after it's out of view
    logo.classList = "logo" // start logo flip animation
    status.slideType = "description"; // update slider object
    startSliderLoop();
}


function startSliderLoop() {
    let slider = document.querySelector(".slider");
    let sliderFirst = slider.firstElementChild;
    let bottomSlider = document.querySelector(".unit-bottom[slider]");
    
    sliderFirst.setAttribute("active", ""); // show first slide of slider
    bottomSlider.classList.remove("hide"); // show bottom side of slider
    bottomSlider.firstElementChild.classList.remove("hide"); // show bottom content of slider
    centerImages(sliderFirst);

    // update slider object
    sliderUnit.activeSlide = sliderFirst;
    sliderUnit.nextSlide = sliderFirst.nextElementSibling;
    sliderUnit.activeSlide.setAttribute("active", "");
    sliderUnit.previousSlide = sliderFirst;
    status.slideType = sliderFirst.getAttribute("data-type");

    // loop();
    getSlideTitle();// replaces slide title text with data-title from the .slide html element
}


//-------------------------------------
//-------------------------------------
//-------------------------------------

const cover = document.querySelector(".cover");
const slide1 = document.querySelector("div[data-type='description']");
const slide1Bottom = document.querySelector(".unit-bottom div[description]");
const slide2 = document.querySelector("div[data-type='bullet-list']");
const slide2Bottom = document.querySelector(".unit-bottom div[bullet-list]");
const slide3 = document.querySelector("div[data-type='quote']");
const slide3Bottom = document.querySelector(".unit-bottom div[quote]");


const details = document.querySelector("#cnx-unit .details");

function checkSlideVIsibility() {
    let visible;
    if (!cover.classList.contains("hide")) {
        visible = cover
    } else if(!slide1.classList.contains("hide"))  {
        visible = slide1
    }else if(!slide2.classList.contains("hide"))  {
        visible = slide2
    }else if(!slide3.classList.contains("hide"))  {
        visible = slide3
    }
    return visible;
}

function previewCover() {
    let visible = checkSlideVIsibility();
    let clsName = (visible == cover) ? visible.className : visible.getAttribute("data-type");

    let bottom = document.querySelector(".unit-wrapper div[slider]");

    details.classList.add("hide");
    
    // hide old stuff
    bottom.classList.add("hide");
    visible.classList.add("hide");

    // show new stuff
    cover.classList.remove("hide");
    document.querySelector("div[discovered].unit-bottom").classList.remove("hide");
}

function previewSlide1() {
    let visible = checkSlideVIsibility();
    let clsName = (visible == cover) ? visible.className : visible.getAttribute("data-type");
    let bottom;

    if (clsName == "cover") {
        bottom = document.querySelector(`.unit-wrapper div[${clsName}]`)
    } else{
        bottom = document.querySelector(`.unit-wrapper div[discovered] div[${clsName}]`)
    }

    details.classList.remove("hide");
    
    // hide old stuff
    bottom.classList.add("hide");
    visible.classList.add("hide");

    // show new stuff
    slide1.setAttribute("active", "");
    slide1.classList.remove("hide");
    document.querySelector("div[slider].unit-bottom").classList.remove("hide");
    slide1Bottom.classList.remove("hide");
    getSlideTitle("description");
}

function previewSlide2() {
    let visible = checkSlideVIsibility();
    let clsName = (visible == cover) ? visible.className : visible.getAttribute("data-type");
    let bottom;

    if (clsName == "cover") {
        bottom = document.querySelector(`.unit-wrapper div[${clsName}]`)
    } else{
        bottom = document.querySelector(`.unit-wrapper div[discovered] div[${clsName}]`)
    }

    details.classList.remove("hide");
    
    // hide old stuff
    bottom.classList.add("hide");
    visible.classList.add("hide");

    // show new stuff
    slide2.setAttribute("active", "");
    slide2.classList.remove("hide");
    document.querySelector("div[slider].unit-bottom").classList.remove("hide");
    slide2Bottom.classList.remove("hide");
    getSlideTitle("bullet-list");
    bulletAnimation() 
}

function previewSlide3() {
    let visible = checkSlideVIsibility();
    let clsName = (visible == cover) ? visible.className : visible.getAttribute("data-type");
    let bottom;

    if (clsName == "cover") {
        bottom = document.querySelector(`.unit-wrapper div[${clsName}]`)
    } else{
        bottom = document.querySelector(`.unit-wrapper div[discovered] div[${clsName}]`)
    }

    details.classList.remove("hide");
    
    // hide old stuff
    bottom.classList.add("hide");
    visible.classList.add("hide");

    // show new stuff
    slide3.setAttribute("active", "");
    slide3.classList.remove("hide");
    document.querySelector("div[slider].unit-bottom").classList.remove("hide");
    slide3Bottom.classList.remove("hide");
    getSlideTitle("quote");

}


//-------------------------------------
//-------------------------------------
//-------------------------------------


function getSlideTitle(el) {
    let asd = el;
    let titleText = document.querySelector(`.slide[data-type="${asd}"]`).getAttribute("data-title");
    let slideTitletoReplace = document.querySelector(".details .slide-title");
    
    setTimeout(function() { 
        slideTitletoReplace.innerHTML = titleText;
    }, 200);
    
}

function centerImages(slide){
    let image = slide.querySelector("img");
    let unitWidth = unitSize()[0];

    document.documentElement.style.setProperty('--shrinkDuration', `${sliderUnit.slideDuration/1000}s`);
    image.classList.remove("shrinkImage");
    image.setAttribute("style", `position: relative; left: -${(image.clientWidth - unitWidth)/2}px;`);
    image.classList.add("shrinkImage");
}

//-------------------animations----------------
//---------------------------------------------

// bulletlist animation
function bulletAnimation() {
    let titles = document.querySelectorAll(".content[bullet-list] ul li")
    let bulletItemDuration = Math.round((sliderUnit.slideDuration-1000) / titles.length);

    setTimeout(function() { 
        titles.forEach(function(element, i){
            let prevElement = (element.previousElementSibling !== null) ? element.previousElementSibling : element ;
            let itemBody = element.getElementsByClassName('item-body')[0];
            let prevItemBody = (prevElement !== null) ? prevElement.getElementsByClassName('item-body')[0] : null;
            let itemHeight = itemBody.scrollHeight;
            // console.log(prevElement.getElementsByClassName('item-body')[0]);
    
            setTimeout(() => {
                if(element.classList == "active") {
                    prevItemBody.setAttribute("style", `max-height:0px`);
                    element.classList.remove("active");
                } else {
                    prevElement.classList.remove("active");
                    element.classList.add("active")
                    prevItemBody.setAttribute("style", `max-height:0px`);
                    itemBody.setAttribute("style", `max-height: ${itemHeight}px`);
                }
            }, (i * bulletItemDuration)-2);
        }); 
    }, 1000);

    titles.forEach(function(element, i){
        element.className = "";
        element.getElementsByClassName('item-body')[0].setAttribute("style", `max-height:0px`);
    });

}


//cover animation
function animationsOnLoad(){
    let slideType = status.slideType;
    
    if(slideType == "cover") {
        
        let title = document.querySelector(".content.cover .title-wrapper");
        let subtitle = document.querySelector(".content.cover .subtitle-wrapper");
        let footer = document.querySelector(".unit-bottom[cover] footer");
        
        subtitle.classList.remove("bounceUp");
        title.classList.remove("bounceUp");
        
        title.classList.add("bounceUp");
        setTimeout(function(){ 
            subtitle.classList.add("bounceUp");
        }, 400);
        setTimeout(function(){ 
            footer.classList.add("bounceUp");
        }, 800);
        
        
    } else if (slideType == "description"){
        // do stuff
    }
    
}


function changeSubtitle() {
    let subtitle = document.getElementsByClassName("slide-title")[0];
    let width = subtitle.offsetWidth;
    subtitle.classList.add("hideSubTitle");
    setTimeout(function() { 
        subtitle.setAttribute("style", `transform: translateX(-${width}px)`);
    }, 300);
    setTimeout(function() { 
        subtitle.setAttribute("style", ``);
    }, 600);
    setTimeout(function() { 
        subtitle.classList.remove("hideSubTitle");
        subtitle.classList.add("showSubTitle");
    }, 900);
    setTimeout(function() { 

        subtitle.className = "slide-title";
    }, 2000);
}


//----------------aux functions---------------
//---------------------------------------------


function pageBig() {
    document.documentElement.style
    .setProperty('--pageWidth', "1070px");
    setTimeout(function() { 
        triggerOnResize() 
    }, 1000);
}

function pageNormal() {
    document.documentElement.style
    .setProperty('--pageWidth', "960px");
    setTimeout(function() { 
        triggerOnResize() ;
    }, 1000);
}


function setColoronpicker() {
    let accent = getComputedStyle(document.documentElement).getPropertyValue('--accentMain');
    accentPicker.value = accent.replace(/\s/g, '');

    let bg1 = getComputedStyle(document.documentElement).getPropertyValue('--bg1');
    bg1Picker.value = bg1.replace(/\s/g, '');

    let bg2 = getComputedStyle(document.documentElement).getPropertyValue('--bg2');
    bg2Picker.value = bg2.replace(/\s/g, '');
}

accentPicker.addEventListener("input", function() {
    document.documentElement.style
    .setProperty('--accentMain', `${accentPicker.value}`);
    let substring = accentPicker.value.substr(1);
    setTextaccentColor(substring);
}, false);

bg1Picker.addEventListener("input", function() {
    document.documentElement.style
    .setProperty('--bg1', `${bg1Picker.value}`);
    let substring = bg1Picker.value.substr(1);
    setText1Color(substring);
}, false);

bg2Picker.addEventListener("input", function() {
    document.documentElement.style.setProperty('--bg2', `${bg2Picker.value}`);
    let substring = bg2Picker.value.substr(1);
    setText2Color(substring);
}, false);

function setText1Color(el) {
    let color = getContrastYIQ(el)
    document.documentElement.style.setProperty('--text1', `${color}`);
}

function setText2Color(el) {
    let color = getContrastYIQ(el)
    document.documentElement.style.setProperty('--text2', `${color}`);
}

function setTextaccentColor(el) {
    let color = getContrastYIQ(el)
    document.documentElement.style.setProperty('--accentText', `${color}`);
}



function triggerOnResize() {
    unitSize();
    updateSizeType();
    // displayInfo();
    addSizeClassOnPlayer();
    bottomSizeforPortrait();
}

function triggerOnLoad() {
   animationsOnLoad();
   setColoronpicker();
    // preCountDown();
}

//---------------------------------------------
//---------------------------------------------

window.onresize = triggerOnResize;
window.onload = triggerOnLoad;


function getContrastYIQ(hexcolor){
	var r = parseInt(hexcolor.substr(0,2),16);
	var g = parseInt(hexcolor.substr(2,2),16);
	var b = parseInt(hexcolor.substr(4,2),16);
	var yiq = ((r*299)+(g*587)+(b*114))/1000;
	return (yiq >= 128) ? 'black' : 'white';
}

