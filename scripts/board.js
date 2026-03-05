let currentDraggedElement = null;

function updateBoard() {
  const statusTypes = ["todo", "inProgress", "review", "done"];
  for (let i = 0; i < statusTypes.length; i++) {
    const status = statusTypes[i];
    const container = document.getElementById(status);
    if (container) {
      processColumn(status, container);
    }
  }
}

function processColumn(status, container) {
  let filtered = [];
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].status === status) {
      filtered.push(tasks[i]);
    }
  }
  container.innerHTML = "";
  container.classList.remove("highlight");
  fillContainer(filtered, container);
}

function fillContainer(subset, container) {
  if (subset.length === 0) {
    container.innerHTML = nothingToDoTemplate();
    return;
  }
  for (let i = 0; i < subset.length; i++) {
    const taskData = prepareTaskData(subset[i]);
    container.innerHTML += toDoTaskTemplate(taskData);
  }
}

function prepareTaskData(element) {
  const stats = getSubtaskStats(element.subtasks);
  const categoryClass = element.category.toLowerCase().replace(/\s+/g, "-");
  const avatars = generateAvatarsHtml(element.assigned_to);
  return {
    id: element.taskId,
    title: element.title,
    description: element.description,
    category: element.category,
    categoryClass: categoryClass,
    priority: element.priority,
    hasSubtasks: stats.hasSubtasks,
    subtaskInfo: stats.text,
    progressWidth: stats.percent,
    avatarsHtml: avatars,
  };
}

function getSubtaskStats(subtasks) {
  const subtaskArray = subtasks ? Object.values(subtasks) : [];
  const total = subtaskArray.length;
  let doneCount = 0;
  for (let i = 0; i < total; i++) {
    if (subtaskArray[i].is_done) {
      doneCount++;
    }
  }
  return {
    total: total,
    hasSubtasks: total > 0,
    percent: total > 0 ? (doneCount / total) * 100 : 0,
    text: `${doneCount}/${total} Subtasks`,
  };
}

function startdragging(id) {
  currentDraggedElement = id;
}

function dragover(ev) {
  ev.preventDefault();
}

function highlight(id) {
  document.getElementById(id).classList.add("highlight");
}

function unhighlight(id) {
  document.getElementById(id).classList.remove("highlight");
}

function moveTo(newStatus) {
  const index = tasks.findIndex((t) => t.taskId === currentDraggedElement);
  if (index !== -1) {
    const movedTask = tasks.splice(index, 1)[0];
    movedTask.status = newStatus;
    tasks.push(movedTask);
    updateBoard();
  }
}

function generateAvatarsHtml(assignedTo) {
  if (!assignedTo) return "";
  let html = "";
  const contactIds = Object.keys(assignedTo);

  for (let i = 0; i < contactIds.length; i++) {
    const contact = contacts.find((c) => c.id === contactIds[i]);
    if (contact) {
      const initials = (contact.firstName[0] + contact.lastName[0]).toUpperCase();
      html += avatarTemplate(contact.color, initials);
    }
  }
  return html;
}
