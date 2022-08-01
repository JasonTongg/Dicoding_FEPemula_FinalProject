let addButton = [document.querySelector(".nav .addBook"), document.querySelector(".nav .fixedAddBook")];
let addForm = document.querySelector(".overlay");
let addFormItem = document.querySelector(".overlay .form");
let formSubmit = document.querySelector(".overlay .form .submit");
let unRead = document.querySelector("main .unread .listItem");
let read = document.querySelector("main .read .listItem");
let deleteBook = document.querySelectorAll("main .unread .listItem .item .deleteButton");
let selesaiBaca = document.querySelectorAll("main .unread .listItem .item .selesaiBaca");
let confirmForm = document.querySelector(".confirm");
let konfirmasi = document.querySelector(".confirm .konfirmasi");
let batal = document.querySelector(".confirm .batal");
let belumSelesaiBaca = document.querySelectorAll("main .read .listItem .item .belumSelesaiBaca");
let searchBarInput = document.querySelector(".nav .searchBar input");
let searchBar = document.querySelector(".nav .searchBar");

let deleteId = 0;
let count =0;
let deleteParent;
let listItem = JSON.parse(localStorage.getItem("listItem")) ? JSON.parse(localStorage.getItem("listItem")) : [];
let readItem = JSON.parse(localStorage.getItem("readItem")) ? JSON.parse(localStorage.getItem("readItem")) : [];

let renderAllItem = (list = listItem, read = readItem) => {
    renderBook(list);
    renderReadBook(read);
    reInit();
    renderAllItemButton();
}

let filterList = () => {
    readItem = readItem.filter(item => item!==undefined);
    listItem = listItem.filter(item => item!==undefined);
    localStorage.setItem("listItem", JSON.stringify(listItem));
    localStorage.setItem("readItem", JSON.stringify(readItem));
}

let renderAllItemButton = () => {
    renderReadedBook();
    renderDeleteBook();
}

let reInit = () => {
    deleteBook = document.querySelectorAll("main .unread .listItem .item .deleteButton");
    konfirmasi = document.querySelector(".konfirmasi");
    batal = document.querySelector(".batal");
    selesaiBaca = document.querySelectorAll("main .unread .listItem .item .selesaiBaca");
    deleteBook = [...deleteBook, ...document.querySelectorAll("main .read .listItem .item .deleteButton")]
    belumSelesaiBaca = document.querySelectorAll("main .read .listItem .item .belumSelesaiBaca");
}

let clearAddForm = () => {
    document.querySelector(".overlay .form #judul").value = '';
    document.querySelector(".overlay .form #penulis").value = '';
    document.querySelector(".overlay .form #tahun").value = '';
}

let renderDeleteBook = () => {
    deleteBook.forEach(item => {
        item.addEventListener("click", (e) => {
            deleteId = +e.target.closest(".item").getAttribute("id");
            deleteParent = e.target.closest(".item").parentElement.parentElement;
            confirmForm.classList.add("muncul");
        })
    })
}

let renderReadedBook = () => {
    let index;
    belumSelesaiBaca.forEach(item => {
        item.addEventListener("click", (e) => {
            index = +e.target.closest(".item").getAttribute("id");
            listItem.push(readItem[index]);
            readItem.splice(index,1);
            filterList();
            renderAllItem(listItem,readItem);
        })
    })
    selesaiBaca.forEach(item => {
        item.addEventListener("click", (e) => {
            index = +e.target.closest(".item").getAttribute("id");
            readItem.push(listItem[index]);
            listItem.splice(index,1);
            filterList();
            renderAllItem(listItem,readItem);
        })
    })
}

let renderBook = (list) => {
    unRead.innerHTML = '';
    clearAddForm();
    let markup = ``;
    list?.forEach((item, idx) => {
        markup = `
        <div class="item" id="${idx}">
            <div class="info">
                <h3>${item.judul}</h3>
                <p class="penulis">Penulis: ${item.penulis}</p>
                <p class="tahun">Tahun: ${item.tahun}</p>
            </div>
            <div class="buttons">
                <button class="selesaiBaca">Selesai dibaca</button>
                <button class="deleteButton">Hapus buku</button>
            </div>
        </div>
        `;
        unRead.insertAdjacentHTML("beforeend", markup);
    })
}

let renderReadBook = (list) => {
    read.innerHTML = '';
    clearAddForm();
    let markup = ``;
    list?.forEach((item, idx) => {
        markup = `
        <div class="item" id="${idx}">
            <div class="info">
                <h3>${item.judul}</h3>
                <p class="penulis">Penulis: ${item.penulis}</p>
                <p class="tahun">Tahun: ${item.tahun}</p>
            </div>
            <div class="buttons">
                <button class="belumSelesaiBaca">Belum selesai dibaca</button>
                <button class="deleteButton">Hapus buku</button>
            </div>
        </div>
        `;
        read.insertAdjacentHTML("beforeend", markup);
    })
}

[confirmForm, batal, konfirmasi].forEach(item => {
    item.addEventListener("click", (e) => {
        if(e.target.classList.contains("confirm") || e.target.classList.contains("batal") || e.target.classList.contains("konfirmasi")){
            confirmForm.classList.remove("muncul");
        }
    })
})

konfirmasi.addEventListener("click", () => {
    if(deleteParent.classList.contains("read")){
        readItem.splice(deleteId,1);
        renderReadBook(readItem);
        localStorage.setItem("readItem", JSON.stringify(readItem));
    }
    else{
        listItem.splice(deleteId,1);
        renderBook(listItem);
        localStorage.setItem("listItem", JSON.stringify(listItem));
    }
    reInit();
    renderAllItemButton();
})

addButton.forEach(item => {
    item.addEventListener("click", () => {
        addForm.classList.add("muncul");
        addFormItem.classList.add("pelan");
    })
})

addForm.addEventListener("click", (e) => {
    if(e.target.classList.contains("overlay")){
        addForm.classList.remove("muncul");
    }
})

addFormItem.addEventListener("submit", (e) => {
    e.preventDefault();
    let newBook = {
        judul: document.querySelector(".overlay .form #judul").value,
        penulis: document.querySelector(".overlay .form #penulis").value,
        tahun: document.querySelector(".overlay .form #tahun").value,
    }
    if(document.querySelector(".overlay .form #radio").checked){
        readItem.push(newBook);
        renderReadBook(readItem);
        localStorage.setItem("readItem", JSON.stringify(readItem));
    }
    else{
        listItem.push(newBook);
        renderBook(listItem);
        localStorage.setItem("listItem", JSON.stringify(listItem));
    }
    
    reInit();
    renderAllItemButton();
    addForm.classList.remove("muncul");
})

searchBar.addEventListener("submit", (e) => {
    e.preventDefault();
})

searchBarInput.addEventListener("change", () => {
    renderBook(listItem.filter(item => item.judul.includes(searchBarInput.value)));
    renderReadBook(readItem.filter(item => item.judul.includes(searchBarInput.value)));
    reInit();
    renderAllItemButton();
})

let init = () => {
    renderAllItem();
}
init();
