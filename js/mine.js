// nav side
let innerNavWidth = $("nav .inner-content").outerWidth(true);
let outerNavWidth = $("nav .out-content").outerWidth(true);
innerNavWidth -= outerNavWidth;
(function () {
    $("nav").animate({ left: `-${innerNavWidth}px` }, 0);
    $(".links li").animate({ top: 300 }, 500)
    $("nav .out-content .fa-bars").removeClass("d-none");
    $("nav .out-content .fa-xmark").addClass("d-none");
    searchByName("");
})()
// to close side nav
new WOW().init();
function closeNav() {
    
    // $("nav .links li").removeClass("fadeInUpBig");
    // $("nav .links li").addClass("fadeOutDownBig");
    $("nav").animate({ left: `-${innerNavWidth}px` }, 500);
    $("nav .out-content .fa-bars").removeClass("d-none");
    $("nav .out-content .fa-xmark").addClass("d-none");
    // ===========(X)=============
    $(".links li").animate({ top: 300 }, 500)
    // ========================
}
// to open side nav
function openNav() {
    // $("nav .links li").addClass("fadeInUpBig");
    // $("nav .links li").removeClass("fadeOutDownBig");
    $("nav").animate({ left: `0px` }, 500);
    $("nav .out-content .fa-xmark").removeClass("d-none");
    $("nav .out-content .fa-bars").addClass("d-none");
    // ===========(X)=============
    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({ top: 0 }, (i + 5) * 100)
    }
    // ===========================
}
$("nav .out-content .fa-xmark").click(function () {
    closeNav();
})
$("nav .out-content .fa-bars").click(function () {
    openNav()
})
// loading screen
$("document").ready(function(){
    $(".loadingScreen").fadeOut(1000);
    $("body").css("overflow" , "auto");
})
// first display
let innerData = document.querySelector("#allData");
let innerSearchInput = document.querySelector("#searchPosition");
let innerDetails = document.querySelector(".meal-details .row");

async function getMealDetails(idMeal) {
    $(".loadingScreen").fadeIn(300);
    innerData.innerHTML = "";
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
    res = await res.json();
    displayMealDetails(res.meals[0]);
    $(".loadingScreen").fadeOut(1000);
}
// ===========(X)=============
function displayMealDetails(details) {
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        if (details[`strIngredient${i}`]) {
            ingredients += `<span class="alert alert-info m-2 p-1">${details[`strMeasure${i}`]} ${details[`strIngredient${i}`]}</span>`
        }
    }

    let tags = details.strTags?.split(",");
    if (!tags) tags = []

    let cartonaTags = ``;
    for (let i = 0; i < tags.length; i++) {
        cartonaTags += `<span class="alert alert-danger m-2 p-1">${tags[i]}</span>`
    }
// ===========================
    innerDetails.innerHTML = `
    <div class="col-md-4">
                    <img src="${details.strMealThumb}" alt="" class="img-fluid rounded-2">
                    <h3>${details.strMeal}</h3>
                </div>
                <div class="col-md-8">
                    <h3>Instructions</h3>
                    <p>${details.strInstructions}</p>
                    <h2>Area : <span>${details.strArea}</span></h2>
                    <h2>Category : <span>${details.strCategory}</span></h2>
                    <h2>Recipes :</h2>
                    <div class="d-flex g-3 flex-wrap">
                    ${ingredients}
                    </div>
                    <h2>Recipes :</h2>
                    <div class="d-flex g-3 flex-wrap mb-3">
                    ${cartonaTags}
                    </div>
                    <a target="_blank" href="${details.strSource}" class="btn btn-success">Source</a>
                    <a target="_blank" href="${details.strYoutube}" class="btn btn-danger">Youtube</a>
                </div>
    `
}
function displayMeals(arr) {
    let cartona = "";
    for (let i = 0; i < arr.length; i++) {
        cartona += `<div class="col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2" onclick="getMealDetails('${arr[i].idMeal}')">
            <div>
                <img src="${arr[i].strMealThumb}" alt="" class="w-100">
            </div>
            <div class="layer position-absolute d-flex align-items-center text-dark">
                <h3>${arr[i].strMeal}</h3>
            </div>
        </div>
    </div>`
    }
    innerData.innerHTML = cartona;
}
function displaySearchInputs() {
    closeNav();
    innerData.innerHTML = "";
    innerDetails.innerHTML = "";
    innerSearchInput.innerHTML = `
    <div class="row">
            <div class="col-md-6">
                <input type="text" placeholder="Search By Name" class="form-control bg-transparent" onkeyup="searchByName(this.value)">
            </div>
            <div class="col-md-6">
                <input type="text" placeholder="Search By First Letter" class="form-control bg-transparent text-white" onkeyup="searchByLetter(this.value)">
            </div>
        </div>
    `
}
async function searchByName(name) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    res = await res.json();
    displayMeals(res.meals);
}
async function searchByLetter(letter) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    res = await res.json();
    displayMeals(res.meals);
}
async function getCategories() {
    closeNav();
    $(".loadingScreen").fadeIn(300);
    innerSearchInput.innerHTML = "";
    innerData.innerHTML = "";
    innerDetails.innerHTML = "";
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    res = await res.json();
    displayCategories(res.categories);
    $(".loadingScreen").fadeOut(1000);

}
function displayCategories(arr) {
    let cartona = "";

    for (let i = 0; i < arr.length; i++) {
        cartona += `<div class="col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2" onclick="getCategorieMeals('${arr[i].strCategory}')">
            <div>
                <img src="${arr[i].strCategoryThumb}" alt="" class="w-100">
            </div>
            <div class="layer position-absolute d-flex align-items-center justify-content-center flex-wrap text-dark p-2 text-center">
                <h3>${arr[i].strCategory}</h3>
                <p>${arr[i].strCategoryDescription.slice(0, 90)}</h3>
            </div>
        </div>
    </div>`
    }
    innerData.innerHTML = cartona;
}
async function getCategorieMeals(category) {
    $(".loadingScreen").fadeIn(300);
    innerData.innerHTML = "";
    innerDetails.innerHTML = "";
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    res = await res.json();
    displayMeals(res.meals);
    $(".loadingScreen").fadeOut(1000);
}
async function getArea() {
    $(".loadingScreen").fadeIn(300);
    closeNav();
    innerSearchInput.innerHTML = "";
    innerData.innerHTML = "";
    innerDetails.innerHTML = "";
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    res = await res.json();
    displayArea(res.meals);
    $(".loadingScreen").fadeOut(1000);
}
function displayArea(arr) {
    let cartona = "";
    for (let i = 0; i < arr.length; i++) {
        cartona += `<div class="col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2 text-center text-white" onclick="getAreaMeals('${arr[i].strArea}')">
            <div>
            <i class="fa-solid fa-house-laptop fa-3x"></i>
            <h3>${arr[i].strArea}</h3>

            </div>
        </div>
    </div>`
    }
    innerData.innerHTML = cartona;
}
async function getAreaMeals(area) {
    $(".loadingScreen").fadeIn(300);
    innerData.innerHTML = "";
    innerDetails.innerHTML = "";
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    res = await res.json();
    displayMeals(res.meals);
    $(".loadingScreen").fadeOut(1000);
}
async function getIngredients() {
    $(".loadingScreen").fadeIn(300);
    closeNav();
    innerSearchInput.innerHTML = "";
    innerData.innerHTML = "";
    innerDetails.innerHTML = "";
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    res = await res.json();
    displayIngredients(res.meals.slice(0, 20));
    $(".loadingScreen").fadeOut(1000);
}
function displayIngredients(arr) {
    let cartona = "";
    for (let i = 0; i < arr.length; i++) {
        cartona += `<div class="col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2 text-center text-white" onclick="getIngredientMeals('${arr[i].strIngredient}')">
            <div>
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${arr[i].strIngredient}</h3>
            <p>${arr[i].strDescription.slice(0, 140)}</p>

            </div>
        </div>
    </div>`
    }
    innerData.innerHTML = cartona;
}
async function getIngredientMeals(ingredient) {
    $(".loadingScreen").fadeIn(300);
    innerData.innerHTML = "";
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    res = await res.json()
    displayMeals(res.meals);
    $(".loadingScreen").fadeOut(1000);
}
function displayContacts() {
    closeNav();
    innerSearchInput.innerHTML = "";
    innerDetails.innerHTML = "";
    innerData.innerHTML = `
    <div class="col-md-6">
                        <input type="text" id="nameInput" placeholder="Enter Your Name" class="form-control" onkeyup="checkValidation()">
                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Special characters and numbers not allowed
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="text" id="emailInput" placeholder="Enter Your Email" class="form-control" onkeyup="checkValidation()">
                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Email not valid *exemple@yyy.zzz
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="text" id="phoneInput" placeholder="Enter Your Phone" class="form-control" onkeyup="checkValidation()">
                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid Phone Number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="text" id="ageInput" placeholder="Enter Your Age" class="form-control" onkeyup="checkValidation()">
                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid age
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="password" id="passwordInput" placeholder="Enter Your Password" class="form-control" onkeyup="checkValidation()">
                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid password *Minimum eight characters, at least one letter and one number:*
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="password" id="repasswordInput" placeholder="Repassword" class="form-control" onkeyup="checkValidation()">
                        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid repassword 
                        </div>
                    </div>
                    <div class="text-center">
                        <button class="btn btn-outline-danger disabled" id="buttonSubmit">Submit</button>
                    </div>
    `
}
function nameValidation() {
    let regex = /^[a-zA-z]+$/
    return regex;
}
function emailValidation() {
    let regex = /^[a-zA-z]\w+@[a-zA-Z]{3,12}\.[a-z]{2,8}$/
    return regex;
}
function phoneValidation() {
    let regex = /^(01)[0125][0-9]{8}$/
    return regex;
}
function ageValidation() {
    let regex = /^[1-9]?[0-9]{1}$|^100$/
    return regex;
}
function passwordValidation() {
    let regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/
    return regex;
}
function repasswordValidation() {
    return $("#repasswordInput").val() == $("#passwordInput").val();
}
let nameInputOn = false;
let emailInputOn = false;
let phoneInputOn = false;
let ageInputOn = false;
let passwordInputOn = false;
let repasswordInputOn = false;
$("#nameInput").focus(function () {
    nameInputOn = true;
})
$("#emailInput").focus(function () {
    emailInputOn = true;
})
$("#phoneInput").focus(function () {
    phoneInputOn = true;
})
$("#ageInput").focus(function () {
    ageInputOn = true;
})
$("#passwordInput").focus(function () {
    passwordInputOn = true;
})
$("#repasswordInput").focus(function () {
    repasswordInputOn = true;
})
function checkValidation() {
    if (nameInputOn) {
        if (nameValidation().test($("#nameInput").val())) {
            $("#nameAlert").addClass("d-none").removeClass("d-block");
        } else {
            $("#nameAlert").addClass("d-block").removeClass("d-none");
        }
    }
    if (emailInputOn) {
        if (emailValidation().test($("#emailInput").val())) {
            $("#emailAlert").addClass("d-none").removeClass("d-block");
        } else {
            $("#emailAlert").addClass("d-block").removeClass("d-none");
        }
    }
    if (phoneInputOn) {
        if (phoneValidation().test($("#phoneInput").val())) {
            $("#phoneAlert").addClass("d-none").removeClass("d-block")
        } else {
            $("#phoneAlert").addClass("d-block").removeClass("d-none")
        }
    }
    if (ageInputOn) {
        if (ageValidation().test($("#ageInput").val())) {
            $("#ageAlert").addClass("d-none").removeClass("d-block")
        } else {
            $("#ageAlert").addClass("d-block").removeClass("d-none")
        }
    }
    if (passwordInputOn) {
        if (passwordValidation().test($("#passwordInput").val())) {
            $("#passwordAlert").addClass("d-none").removeClass("d-block")
        } else {
            $("#passwordAlert").addClass("d-block").removeClass("d-none")
        }
    }
    if (repasswordInputOn) {
        if (repasswordValidation()) {
            $("#repasswordAlert").addClass("d-none").removeClass("d-block")
        } else {
            $("#repasswordAlert").addClass("d-block").removeClass("d-none")
        }
    }
    if (nameValidation().test($("#nameInput").val()) && emailValidation().test($("#emailInput").val()) && phoneValidation().test($("#phoneInput").val()) && ageValidation().test($("#ageInput").val()) && passwordValidation().test($("#passwordInput").val()) && repasswordValidation()) {
        $("#buttonSubmit").removeClass("disabled")
    } else {
        $("#buttonSubmit").addClass("disabled")
    }
}