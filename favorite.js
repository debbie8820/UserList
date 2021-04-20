const INDEX_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users"
const dataPanel = document.querySelector("#dataPanel")
const pagination = document.querySelector("#pagination")
const searchInput = document.querySelector("#searchInput")
const searchButton = document.querySelector("#searchButton")
const searchBar = document.querySelector("#searchBar")
let likedButtons = []
const User_Per_Page = 12




const userInfo = [];
const favoriteList = JSON.parse(localStorage.getItem("favoriteList"));

//Functions
const renderListByPage = (page) => {
	const startIndex =  (page - 1) * 12
	const endIndex = page * 12
	return favoriteList.slice(startIndex, endIndex)
}


const renderDataPanel = (arrays) => {
	let allUsers = ""
	arrays.forEach((item)=>{allUsers += 
		`<div class="col-md-3 my-3 d-flex align-self-stretch">
	        <div class="card shadow-sm" style="width: 18rem;">
	          <div class="px-4 pt-4 pb-2">
	              <img class="userPic card-img-top shadow-lg pt-2 rounded-circle" src="${item.avatar}" alt="user-picture">
	          </div>
	          <div class="card-body justify-content-center pb-4">
	              <h3 class="font-weight-bold mb-3 p-3">${item.name}&ensp;${item.surname}</h3>
	              <div id="moreinfo" class="moreinfo w-100">
	              	  <i class="mx-3 far fa-portrait fa-2x" data-toggle="modal" data-target="#user-modal" data-id="${item.id}"></i>
	              	  <i class="mx-3 far fa-heart fa-2x" data-id="${item.id}"></i>
	              </div>
	          </div>
	        </div>
        </div>`
})
	dataPanel.innerHTML = allUsers
}



const showModal = (userIndex) => {
 	const User = userInfo[userIndex]
 	const modalTitle =  document.querySelector("#modalTitle")
	const modalUserName =  document.querySelector("#modalUserName")
	const modalGenderRegion =  document.querySelector("#modalGenderRegion")
	const modalBirthAge =  document.querySelector("#modalBirthAge")
	const modalEmail =  document.querySelector("#modalEmail")
	const modalImage =  document.querySelector("#modalImage")
	const modalInfoUpdated = document.querySelector("#modalInfoUpdated")
 	modalTitle.innerText = `Get to know more about ${User.name}!`
 	modalUserName.innerText = `${User.name} ${User.surname}`
 	modalGenderRegion.innerHTML = `Gender: ${User.gender}&ensp; Region: ${User.region}` 
 	modalBirthAge.innerHTML = `Birthday: ${User.birthday}&ensp; Age: ${User.age}`
 	modalInfoUpdated.innerText = `Last updated: ${User.updated_at}`
 	modalEmail.innerText = `${User.email}`
 	modalImage.innerHTML = `<img class="mx-4 my-3 rounded" src="${User.avatar}" alt="userPicture">`
 }


const renderPagination = (amount) => {
	const endPage = Math.ceil(amount / User_Per_Page)
	let rawHTML = ''
	for(page=1; page<= endPage; page++){
			rawHTML += `<li class="page-item"><a class="page-link" data-id="${page}" href="#">${page}</a></li>`
	}
	pagination.innerHTML = rawHTML
}

const renderFavoriteIcon = () => {
	likedButtons = document.querySelectorAll(".fa-heart")
	likedButtons.forEach((item) => {
		if (favoriteList.some((user)=> user.id === Number(item.dataset.id))){
			item.classList.toggle('fas')
			item.classList.toggle('far')
		}
	})	
}


const removeFromFavorite = (userIndex) => {
	const targetIndex = favoriteList.findIndex(item =>　item.id - 601 === userIndex)
	favoriteList.splice(targetIndex , 1)
	localStorage.setItem("favoriteList", JSON.stringify(favoriteList))
	renderDataPanel(renderListByPage(1))
	renderPagination(favoriteList.length)
	renderFavoriteIcon()
	
}


axios.get(INDEX_URL).then((response)=>{
	userInfo.push(...response.data.results)
	renderDataPanel(renderListByPage(1))
	renderPagination(favoriteList.length)
	renderFavoriteIcon()
});



dataPanel.addEventListener("click", function onclicked(){
	const userIndex = Number(event.target.dataset.id) - 601

	if(event.target.matches(".fa-portrait")){	
		showModal(userIndex)
	}else if (event.target.matches(".fa-heart")){
		removeFromFavorite(userIndex)
		event.target.classList.toggle('fas')
		event.target.classList.toggle('far')
		alert("The user is removed!")
	}
})

pagination.addEventListener("click", function onclickedPage(){
	if(event.target.tagName !== "A")return
		else{
			renderDataPanel(renderListByPage(event.target.dataset.id))
		}
})


