document.addEventListener("DOMContentLoaded", () => {

    const API = "https://6852a7200594059b23ce857f.mockapi.io"


    async function fetchData(endpoint, callback) {
        try {
            const res = await fetch(`${API}${endpoint}`)
            const data = await res.json()
            callback(data)
            loader.style.display = "none"
        } catch (err) {
            console.error(err)
        }
    }
    window.onload = () => {
        fetchData(`/car`, cardRender)
    }


    modalBtn.addEventListener("click", () => {
        modal.classList.toggle("show")
        document.body.classList.toggle("overflow")
    })
    cancelModal.addEventListener("click", () => {
        modal.classList.add("show")
        document.body.classList.remove("overflow")
    })
    modal.onclick = (e) => {
        if (e.target.id === "modal") {
            modal.classList.add("show")
            document.body.classList.remove("overflow")
        }
    }


    const wrapperEl = document.querySelector('.wrapper')
    function cardRender(data) {
        wrapperEl.innerHTML = null
        const fr = document.createDocumentFragment()
        data.forEach((item) => {
            const article = document.createElement('article')
            article.classList = "max-w-xs w-full overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 mx-auto"
            article.setAttribute("data-aos", "zoom-in-up")
            article.innerHTML = `
						<div class="px-4 py-2">
							<h1
								class="text-xl font-bold text-gray-800 uppercase dark:text-white"
							>
								${item.name}
							</h1>
							<i class="mt-1 text-sm text-gray-600 dark:text-gray-400 block">
								${item.brand}
							</i>
							<strong class="mt-1 text-sm text-gray-600 dark:text-gray-400">
								${item.color}
							</strong>
							<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
								${item.guarantee}
							</p>
						</div>

						<img
							class="object-cover bg-white w-full h-48 mt-2"
							loading="lazy"
							src="${item.image}"
							alt="NIKE AIR"
						/>

						<div
							class="flex items-center justify-between px-4 py-2 bg-gray-900"
						>
							<h3 class="text-lg font-bold text-white">$${item.price}</h3>
							<button
                            data-id="${item.id}"
                            name="deleteBtn"
								class="cursor-pointer px-2 py-1 text-xs font-semibold text-gray-900 uppercase transition-colors duration-300 transform bg-white rounded hover:bg-gray-200 focus:bg-gray-400 focus:outline-none"
							>
								Delete
							</button>
						</div>
        `
            fr.appendChild(article)
        })
        wrapperEl.appendChild(fr)
    }


    const formEl = document.querySelector('.form')
    formEl.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!carName.value.trim()) return null
        if (!carPrice.value.trim()) return null
        if (!cardBrand.value.trim()) return null
        if (!carColor.value.trim()) return null
        if (!carGuarantee.value.trim()) return null

        let carInfo = {
            name: carName.value,
            price: Number(carPrice.value),
            brand: cardBrand.value,
            color: carColor.value,
            guarantee: Number(carGuarantee.value)
        }

        fetch(`${API}/car`, {
            method: "POST",
            body: JSON.stringify(carInfo),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                carName.value = null
                carPrice.value = null
                cardBrand.value = null
                carColor.value = null
                carGuarantee.value = null
                modal.classList.add("show")
                document.body.classList.remove("overflow")
                confirmModal.classList.add("showConfirm")
                setTimeout(() => {
                    confirmModal.classList.remove("showConfirm")
                }, 1500)
                fetchData(`/car`, cardRender)
            })
    })


    wrapperEl.addEventListener('click', (e) => {
        if (e.target.name === 'deleteBtn') {
            const id = e.target.dataset.id
            fetch(`${API}/car/${id}`, {
                method: "DELETE"
            })
                .then(() => {
                    deleteModal.classList.add("showDelete")
                    setTimeout(() => {
                        deleteModal.classList.remove("showDelete")
                    }, 1000)
                    fetchData(`/car`, cardRender)
                })
        }
    })
})