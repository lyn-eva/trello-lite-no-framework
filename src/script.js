const addList = document.getElementById("add-list");
const mainCtr = document.querySelector(".main-ctr");

// Eve Listeners
(() => {
   // iife
   let num_of_list = 0;
   addList.onclick = () => {
      const newList = listComponent(num_of_list);
      mainCtr.insertBefore(newList, addList.parentElement);
      num_of_list++;
   };
})();

// Components
function listComponent(nthList) {
   let listId = `l${nthList}`;
   const addCardBtn = document.createElement("div");
   addCardBtn.setAttribute("class", "add-card");
   addCardBtn.innerHTML = `<div class="list-fdr"><button><i class="fas fa-plus"></i>Add a card</button></div>`;
   const listMenu = document.createElement("div");
   listMenu.setAttribute("class", "list-menu");
   listMenu.innerHTML = `<h4>List Actions</h4><ul><li>Delete List</li><li>Sort by (Alphabetically)</li></ul>`;
   const list = document.createElement("div");
   list.setAttribute("class", "list-ctr");
   list.setAttribute("id", listId);
   list.innerHTML = `<div class="list-hdr"><div class="list-title"><h3>My List</h3><textarea maxlength="696"></textarea></div><button><i class="fas fa-ellipsis-h"></i></button></div><ul class="list-main"></ul>`;

   list.insertBefore(listMenu, list.firstElementChild);
   list.appendChild(addCardBtn);

   // eve
   const listMenuBtn = list.children[1].lastElementChild;
   listMenuBtn.onclick = () => {
      listMenu.classList.toggle("list-menu-dropped");
   };

   const deleteList = listMenu.children[1].firstElementChild;
   deleteList.onclick = () => {
      list.remove();
   };
   (() => {
      let num_of_card = 0;
      addCardBtn.onclick = function () {
         //just want to use "this" :)
         const ctr = this.previousElementSibling;
         ctr.appendChild(cardComponent(listId, num_of_card));
         num_of_card++;
      };
   })();
   // rename
   const renameList = list.children[1].firstElementChild;
   const listName = renameList.children;
   setTimeout(
      () => setFocus(renameList, listName[1], listName[0].textContent),
      0
   );

   renameList.ondblclick = () => {
      setFocus(renameList, listName[1], listName[0].textContent);
   };
   renameList.addEventListener("focusout", () => {
      FocusOut(renameList, listName);
   });
   //drag and drop
   // dropOperation(list.children[2]);

   return list;
}

// function dropOperation(list) {
//    // eve
//    list.ondragover = (e) => {
//       e.preventDefault();
//       list.classList.add("drag-enter");
//    }
//    list.ondragleave = (e) => {
//       list.classList.remove("drag-enter");
//    }
//    list.ondragend = (e) => {
//       list.classList.remove("drag-enter");
//    }
//    list.ondrop = e => {
//       // console.log(Math.round(list.getBoundingClientRect().top));
//       // console.log(Math.round(list.getBoundingClientRect().bottom));
//       // console.log(e.clientY);
//       e.preventDefault();
//       const dragID = e.dataTransfer.getData("text/plain");
//       const cd = document.getElementById(dragID);

//       list.appendChild(cd);
//    }
// }

function cardComponent(listID, no) {
   const cardBlock = document.createElement("li");
   const attr = {
      class: "card-block",
      draggable: "true",
      id: listID + "-" + no,
      tabindex: "0",
   };
   for (key in attr) {
      cardBlock.setAttribute(key, attr[key]);
   }
   const card = document.createElement("div");
   card.setAttribute("class", "card");
   card.innerHTML = `<div class="card-ctr"><div class="labels"></div><div class="card-content"><p>a simple note</p><textarea maxlength="696" tabindex="-1"></textarea></div><i class="fas fa-pen"></i></div>`;
   const del = document.createElement("i");
   del.setAttribute("class", "fas fa-trash");
   card.firstElementChild.appendChild(del);
   cardBlock.appendChild(card);

   //delete eve
   del.onclick = () => {
      cardBlock.classList.add("delete-card"); //
      cardBlock.addEventListener("animationend", function () {
         cardBlock.remove();
      });
   };
   // rename eve
   const cardContentCtr = card.firstElementChild.children[1]; //
   const cardContent = cardContentCtr.children; //
   setTimeout(
      () =>
         setFocus(cardContentCtr, cardContent[1], cardContent[0].textContent),
      0
   );

   cardContentCtr.ondblclick = () => {
      setFocus(cardContentCtr, cardContent[1], cardContent[0].textContent);
   };
   cardContentCtr.addEventListener("focusout", () => {
      FocusOut(cardContentCtr, cardContent);
   });

   dragOperation(cardBlock);

   return cardBlock;
}

function dragOperation(item) {
   item.ondragstart = function (e) {
      e.dataTransfer.setData("text/plain", this.id);
      disablePointerEve(this, "block");
   };

   item.ondragover = (e) => {
      e.preventDefault();
   };

   item.ondrop = (e) => {
      e.preventDefault();
      const original = document.getElementById(e.dataTransfer.getData("text/plain"));
      const clone = original.parentElement.removeChild(original);
      e.target.parentElement.insertBefore(clone, e.target);

      disablePointerEve(clone, "block");
   };

   item.ondragend = function () {
      disablePointerEve(this, "block");
   };
}

function disablePointerEve(target, display) {
   const cards = document.querySelectorAll(".card-block");
   cards.forEach((card) => card.classList.add("dragged"));

   display == "none" ? target.classList.add("dragged-item") : target.classList.remove("dragged-item");
   setTimeout(() => target.style.display = display, 0);
}

function setFocus(inpCtr, realTxt, txt) {
   inpCtr.classList.add("rename");
   focusTextInput(realTxt, txt);
}

function focusTextInput(content, currentTxt) {
   content.value = currentTxt;
   content.focus();
   content.select();
}

function FocusOut(inpCtr, nodes) {
   nodes[0].textContent = nodes[1].value;
   inpCtr.classList.remove("rename");
}
