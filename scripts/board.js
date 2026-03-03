let toDos = [
  {
    id: 1,
    title: "shopping",
    category: "open",
  },
  {
    id: 2,
    title: "finish project",
    category: "inProgress",
  },
  {
    id: 3,
    title: "car wash",
    category: "review",
  },
  {
    id: 4,
    title: "call mom",
    category: "close",
  },
  {
    id: 5,
    title: "go to the gym",
    category: "open",
  },
];

let currentDraggedElement;

function init() {
  const openToDos = toDos.filter((toDo) => toDo.category === "open");
  const inProgressToDos = toDos.filter(
    (toDo) => toDo.category === "inProgress",
  );
  const reviewToDos = toDos.filter((toDo) => toDo.category === "review");
  const closedToDos = toDos.filter((toDo) => toDo.category === "close");
  const openToDoContainer = document.getElementById("open");
  const inProgressToDoContainer = document.getElementById("inProgress");
  const reviewToDoContainer = document.getElementById("review");
  const closedToDoContainer = document.getElementById("close");
  openToDoContainer.innerHTML = "";
  inProgressToDoContainer.innerHTML = "";
  reviewToDoContainer.innerHTML = "";
  closedToDoContainer.innerHTML = "";
  openToDoContainer.classList.remove("highlight");
  closedToDoContainer.classList.remove("highlight");
  inProgressToDoContainer.classList.remove("highlight");
  reviewToDoContainer.classList.remove("highlight");
  renderContainer(openToDos, openToDoContainer);
  renderContainer(inProgressToDos, inProgressToDoContainer);
  renderContainer(reviewToDos, reviewToDoContainer);
  renderContainer(closedToDos, closedToDoContainer);
}

function renderContainer(toDoBox, containerElement) {
  if (toDoBox.length === 0) {
    containerElement.innerHTML = nothingToDoTemplate();
  } else {
    let html = "";
    for (let index = 0; index < toDoBox.length; index++) {
      const element = toDoBox[index];
      html += toDoTaskTemplate(element);
    }
    containerElement.innerHTML = html;
  }
}

function startdragging(id) {
  currentDraggedElement = id;
}

function dragover(ev) {
  ev.preventDefault();
}

function highlight(id) {
  const element = document.getElementById(id);
  element.classList.add("highlight");
}

function unhighlight(id) {
  const element = document.getElementById(id);
  element.classList.remove("highlight");
}

function moveTo(category) {
  const toDoIndex = toDos.findIndex(
    (toDo) => toDo.id === currentDraggedElement,
  );
  if (toDoIndex !== -1) {
    toDos[toDoIndex].category = category;
    init();
  }
}
