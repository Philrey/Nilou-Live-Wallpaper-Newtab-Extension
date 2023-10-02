let sites = ''
let debugMode = true
let sample = {
    "list": [
        {
            "name":"Google",
            "origin":"https://google.com",
            "url":"https://google.com"
        },
        {
            "name":"Youtube",
            "origin":"https://youtube.com",
            "url":"https://youtube.com"
        }
    ]
}
let addBtnDom = `<a id="btnOpenAddSiteModal" class="add-new-card">
                    <img class="card-image" src="./images/icons8_add_64px.png" alt="">
                    <span class="card-name">New Speed Dial </span>
                </a>`

//Utilities
function getElmnt(id) {
    return document.getElementById(id)
}

function log(msg) {
    if (debugMode)
        console.log(msg)
}

//Events
function resizeBackground() {
    console.log('Resized')
}

function addSite() {
    let name = getElmnt('inpName').value
    let url = getElmnt('inpUrl').value

    if (name.length <= 0 || url.length <= 0) {
        console.log('Please fillup all fields')
        return
    }

    if (sites.list != undefined) {
        let urlProperty = new URL(url)
        sites.list.push({
            name,
            url,
            origin: urlProperty.origin
        })

        let jsonString = JSON.stringify(sites)
        localStorage.setItem('sites',jsonString)
        location.reload()
    }
}

function saveSiteChanges() {
    let name = getElmnt('inpEditName').value
    let url = getElmnt('inpEditUrl').value
    let indexSlctd = parseInt(getElmnt('indexSelected').textContent)

    if (name.length <= 0 || url.length <= 0) {
        console.log('Please fillup all fields')
        return
    }

    if (sites.list != undefined) {
        let urlProperty = new URL(url)
        sites.list[indexSlctd] = {
            name,
            url,
            origin: urlProperty.origin
        }

        let jsonString = JSON.stringify(sites)
        localStorage.setItem('sites',jsonString)
        location.reload()
    }
}

function deleteSite() {
    let indexSlctd = parseInt(getElmnt('indexSelected').textContent)

    if (sites.list != undefined) {
        sites.list.splice(indexSlctd,1)

        let jsonString = JSON.stringify(sites)
        localStorage.setItem('sites',jsonString)
        location.reload()
    }
}

function loadSites() {
    let result = localStorage.getItem('sites')
    if (result == null) {
        console.log('Sites not found. Using sample as default')
        localStorage.setItem('sites',JSON.stringify(sample))
        sites = sample
    } else {
        result = JSON.parse(result)
        sites = result
    }

    //Build cards DOMS
    let htmlResult = ''
    sites.list.forEach((site,n) => {
        htmlResult += `
        <div class="link-card">
            <img id="${ 'site'+n }" src="./images/icons8_more_64px.png" class="options-btn" alt="" srcset="">
            <a href="${ site.url }" class="link-card-container">
                <img class="card-image" src="http://www.google.com/s2/favicons?sz=64&domain=${ site.url }" alt="">
            </a>
            <span class="card-name">${ site.name }</span>
            
        </div>`
    })
    htmlResult += addBtnDom

    let listHolder = getElmnt('links-holder-id')
    listHolder.style.visibility = 'hidden'
    listHolder.innerHTML = htmlResult
    listHolder.style.visibility = 'visible'
}

function closeModal() {
    let modal = getElmnt('mainModal')
    modal.style.visibility = 'hidden'
}

function openModalAdd() {
    let modal = getElmnt('mainModal')
    let addMdl = getElmnt('addSiteModal')
    let editMdl = getElmnt('editSiteModal')

    addMdl.style.display = 'block'
    editMdl.style.display = 'none'
    modal.style.visibility = 'visible'
}

function openModalEdit(index) {
    log('Modifiying '+index)
    let modal = getElmnt('mainModal')
    let addMdl = getElmnt('addSiteModal')
    let editMdl = getElmnt('editSiteModal')
    let indexSlctd = getElmnt('indexSelected')

    let name = getElmnt('inpEditName')
    let url = getElmnt('inpEditUrl')

    name.value = sites.list[index].name
    url.value = sites.list[index].url
    indexSlctd.textContent = index

    //Set visibility
    addMdl.style.display = 'none'
    editMdl.style.display = 'block'
    modal.style.visibility = 'visible'

    //Update Modal Values
}

//Process Starts Here
function main() {
    loadSites()
    let btnCloseModalAdd = getElmnt('btnCloseModalAdd')
    let btnCloseModalEdit = getElmnt('btnCloseModalEdit')
    let btnOpenModal = getElmnt('btnOpenAddSiteModal')
    let btnSaveNewSite = getElmnt('btnAddSite')
    let btnSaveEditedSite = getElmnt('btnEditSite')
    let btnDeleteSite = getElmnt('btnDeleteSite')
    let linkContainer = getElmnt('linkContainer')

    btnOpenModal.addEventListener('click',openModalAdd)
    btnCloseModalAdd.addEventListener('click',closeModal)
    btnCloseModalEdit.addEventListener('click',closeModal)
    btnSaveNewSite.addEventListener('click',addSite)
    btnSaveEditedSite.addEventListener('click',saveSiteChanges)
    btnDeleteSite.addEventListener('click',deleteSite)
    
    sites.list.forEach((sites,n) => {
        let item = getElmnt('site'+n)
        item.addEventListener('click',() => openModalEdit(n))
    })
    setTimeout(() => {
        linkContainer.style.display = 'block'
    }, 50)
}

main()