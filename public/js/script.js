(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

function uploadImage(e){
  if (e.target.files.length > 5 || e.target.files.length < 5) {
    alert("Please upload 5 images");
    e.target.value = "";
  }
}

function editUploadImage(e){
  if (e.target.files.length > 5) {
    alert("Upload 5 images less than 5 images.");
    e.target.value = "";
  }
}

timeago.render(document.querySelectorAll('.timeago'));


function handleStarInput(element) {
  console.log(element.value);
  for (let i = 1; i <= element.value; i++) {
    console.log("bright");
    let idName = "star" + i + "Font";
    let star = document.getElementById(idName);
    star.style.color = "#ff9705";
  }
  let newVal = Number(element.value) + 1;
  console.log(newVal);
  for (let i = newVal; i <= 5; i++) {
    console.log("fade");
    let idName = "star" + i + "Font";
    let star = document.getElementById(idName);
    star.style.color = "gainsboro";
  }
}

function addInputAndButton(e, showSelected) {
  let input = document.getElementById("hidden-category-input");

  const arr = JSON.parse(input.value);

  arr.push(e.target.value);

  input.value = JSON.stringify(arr);

  let btn = document.createElement("span");
  btn.className = "category-selected-btn";
  btn.innerText = e.target.value;

  showSelected.appendChild(btn);
  return;
}

function handleCategorySelect(e) {

  let showSelected = document.getElementById("selectedCategory");

  let btns = document.getElementsByClassName("category-selected-btn");

  if (btns.length == 0) {
    addInputAndButton(e, showSelected);
    return;
  }

  let selectedOptions = Array.from(btns).map(btn => btn.innerText);

  if (!selectedOptions.includes(e.target.value)) {
    addInputAndButton(e, showSelected);
    return;
  }
}

function handleToggleGstSwitch(e) {
  let isChecked = e.target.checked;
  let listsText = document.getElementsByClassName("card-text");
  console.log("here");

  if(isChecked){
    for (let listsPrice of listsText) {
      const end = listsPrice.innerText.indexOf('/');
      const result = listsPrice.innerText.substring(1, end);
      console.log(result);
      let price = (parseInt(result.replace(",","")));

      let tax = ((price*18)/100);
  
      listsPrice.innerHTML = `&#x20B9;${(price + tax).toLocaleString("en-IN")} /per night`;
  
    }
  }else{
    for (let listsPrice of listsText) {
      const end = listsPrice.innerText.indexOf('/');
      const result = listsPrice.innerText.substring(1, end);
      console.log(result);
      let price = (parseInt(result.replace(",","")));

      let previousPrice = price/(118/100);
  
      listsPrice.innerHTML = `&#x20B9;${previousPrice.toLocaleString("en-IN")} /per night`;
  
    }
  }
}
