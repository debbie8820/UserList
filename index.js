const INDEX_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users"
const dataPanel = document.querySelector("#dataPanel")
const pagination = document.querySelector("#pagination")
const searchInput = document.querySelector("#searchInput")
const searchButton = document.querySelector("#searchButton")
const searchBar = document.querySelector("#searchBar")
const moreinfo = document.querySelector("#moreinfo")
const favoriteList = JSON.parse(localStorage.getItem("favoriteList")) || []
let likedButtons = []
const User_Per_Page = 12


const userInfo = [];
let filteredUser = [];


//Functions
const renderListByPage = (page) => {
	const data = filteredUser.length? filteredUser :　userInfo
	const startIndex =  (page - 1) * 12
	const endIndex = page * 12
	return data.slice(startIndex, endIndex)
}


const renderDataPanel = (arrays) => {
	let allUsers = ""
	arrays.forEach((item)=>{allUsers += 
		`<div class="col-md-3 my-3 d-flex align-self-stretch">
	        <div class="card shadow-sm" style="width: 18rem;">
	          <div class="px-4 pt-4 pb-2">
	            <img class="userPic card-img-top shadow-lg p-2 rounded-circle" src="${item.avatar}" alt="user-picture">
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


const searchUserName = () => {
	filteredUser = []
	const targetUser = searchInput.value.trim().toLowerCase()
	userInfo.forEach((user)=>{
		const name = user.name + " " + user.surname
			if(name.toLowerCase().includes(targetUser)){
				filteredUser.push(user)
			}
		})
			if(!filteredUser.length){
				alert("No user found!")
		}else{
			renderDataPanel(filteredUser)
		}
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


//將localStorage favoritelist 載入愛心
const renderFavoriteIcon = () => {
	likedButtons = document.querySelectorAll(".fa-heart")
	likedButtons.forEach((item) => {
		if (favoriteList.some((user)=> user.id === Number(item.dataset.id))){
			item.classList.toggle('fas')
			item.classList.toggle('far')
		}
	})	
}


const addToFavorite = (userIndex) => {
	// const favoriteList = JSON.parse(localStorage.getItem("favoriteList")) || [] //要從localStorage拿才能拿到之前儲存的資料，如果直接設favoriteList=[],每次重新整理後都會是空字串，沒辦法儲存資料
	if (favoriteList.some(item => item.id - 601 === userIndex)){
		alert("You've added this before and the user is removed from your favorite!")
	}else{
		console.log("addUserIndex", userIndex)
		favoriteList.push(userInfo[userIndex])
		alert("This user is added to your favorite!")
	}
	localStorage.setItem("favoriteList", JSON.stringify(favoriteList))
}


const removeFromFavorite = (userIndex) => {
	const targetIndex = favoriteList.findIndex(item =>　item.id - 601 === userIndex)
	favoriteList.splice(targetIndex , 1)
	localStorage.setItem("favoriteList", JSON.stringify(favoriteList))
}

//Execution
 axios.get(INDEX_URL).then((response)=>{
	userInfo.push(...response.data.results)
	renderDataPanel(renderListByPage(1))
	renderPagination(userInfo.length)
	renderFavoriteIcon()
});


dataPanel.addEventListener("click", function onclicked(){
	const userIndex = Number(event.target.dataset.id) - 601

	if(event.target.matches(".fa-portrait")){	
		showModal(userIndex)
	}else if (event.target.matches(".fa-heart")){
		if (event.target.matches(".far")){
			addToFavorite(userIndex)
		}else if(event.target.matches(".fas")){
			removeFromFavorite(userIndex)
		}
		event.target.classList.toggle('fas')
		event.target.classList.toggle('far')
	}
})

//搜尋username
searchBar.addEventListener("submit", function onclickedSubmit(e){
	event.preventDefault()
	searchUserName()
	renderDataPanel(renderListByPage(1))
	renderPagination(filteredUser.length)
})

//分頁
pagination.addEventListener("click", function onclickedPage(){
	if(event.target.tagName !== "A") return
		else{
			renderDataPanel(renderListByPage(event.target.dataset.id))
			renderFavoriteIcon()
		}
})