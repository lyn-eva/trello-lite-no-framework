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
   list.setAttribute("draggable", "true");
   list.innerHTML = `<div class="list-hdr"><div class="list-title"><h3>My List</h3><textarea maxlength="696"></textarea></div><button><i class="fas fa-ellipsis-h"></i></button></div><ul class="list-main"></ul>`;

   list.insertBefore(listMenu, list.firstElementChild);
   list.appendChild(addCardBtn);

   // eve
   const listMenuBtn = list.children[1].lastElementChild;
   listMenuBtn.onclick = () => {
      listMenu.classList.toggle("list-menu-dropped");
   };
   //delete
   const deleteList = listMenu.children[1].firstElementChild;
   deleteList.onclick = () => {
      list.remove();
   };
   // add
   (() => {
      let num_of_card = 0;
      addCardBtn.onclick = function () {
         const ctr = this.previousElementSibling;
         ctr.appendChild(cardComponent(listId, num_of_card));
         num_of_card++;
      };
   })();
   // rename
   const renameList = list.children[1].firstElementChild;
   const listName = renameList.children;
   setTimeout(() => setFocus(renameList, listName[1], listName[0].textContent), 0);

   renameList.ondblclick = () => {
      setFocus(renameList, listName[1], listName[0].textContent);
   };
   renameList.addEventListener("focusout", () => {
      FocusOut(renameList, listName);
   });

   //drop
   cardDropOperation(list.children[2]);
   // listDragDrop(list);
   return list;
}
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
   setTimeout(() => setFocus(cardContentCtr, cardContent[1], cardContent[0].textContent), 0);

   cardContentCtr.ondblclick = () => {
      setFocus(cardContentCtr, cardContent[1], cardContent[0].textContent);
   };
   cardContentCtr.addEventListener("focusout", () => {
      FocusOut(cardContentCtr, cardContent);
   });

   cardDragOperation(cardBlock);
   return cardBlock;
}

function listDragDrop(list) {
   // console.log(list);
   list.ondragstart = function(e) {
      if (e.target.classList.contains("card-block")) return;
      this.classList.add("dragged-item");
      disableListEve("add");
      setTimeout(() => this.style.display = "none", 0);  
   }
   
   list.ondragover = function(e) {
      e.preventDefault();
   }
   
   list.ondragenter = function(e) {
      console.log('target', e.target);
      console.log('currenttarget', e.currentTarget);
      if (e.target.classList.contains("card-block")) return;
      removeDragHover("card-block"); //
      this.classList.add("drag-enter");
   }
   list.ondragleave = function() {
      this.classList.remove("drag-enter");
   }
   
   list.ondrop = function(e) {
      e.preventDefault();
      if (e.target.classList.contains("card-block")) return;
      disableListEve("remove");
      const card = document.querySelector(".dragged-item");
      console.log(card);
      this.after(card);
      this.classList.remove("drag-enter"); ///
   }
   
   list.ondragend = function(e) {
      disableListEve("remove");
      this.style.display = "block";
      this.classList.remove("drag-enter"); ///
      this.classList.remove("dragged-item") ///
   }
}
function disableListEve(cond) {
   const lists = document.querySelectorAll(".list-ctr");
   lists.forEach(list => list.classList[cond]("disable-pointer-eve"));
}

function cardDropOperation(ctr) {
   ctr.ondragover = (e) => {
      e.preventDefault();
   }
   ctr.ondragenter = function(e) { ///
      if (this.getBoundingClientRect().height > 17) return;
      removeDragHover("card-block"); //
      this.classList.add("drag-enter");
   }
   ctr.ondragleave = function() {
      this.classList.remove("drag-enter");
   }
   ctr.ondrop = function(e) {
      e.preventDefault();
      if (this.children.length > 1) return;
      const card = document.querySelector(".dragged-item");
      this.appendChild(card);
      this.classList.remove("drag-enter");
   };
}
function cardDragOperation(item) {
   item.ondragstart = function (e) {
      disableCardEve(this, "none", "add");
   };
   item.ondragover = (e) => {
      e.preventDefault();
   };
   item.ondragenter = function(e) {
      removeDragHover("card-block");
      this.classList.add("drag-enter");
   }
   item.ondrop = function(e) {
      e.preventDefault();
      const card = document.querySelector(".dragged-item");
      this.parentElement.insertBefore(card, this);
      this.classList.remove("drag-enter");
   };
   item.ondragend = function (e) {
      // this.classList.remove("drag-enter");
      removeDragHover("card-block");
      disableCardEve(this, "block", "remove");
   };
}
function removeDragHover(className) {
   const nodes = document.querySelectorAll(className);
   nodes.forEach(node => {
      node.classList.remove("drag-enter");
   });
}
function disableCardEve(target, display, addRem) {
   const cards = document.querySelectorAll(".card-block");
   target.classList[addRem]("dragged-item");
   cards.forEach((card) => {
      card.classList[addRem]("disable-pointer-eve");
   });
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