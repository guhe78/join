function makeArray(data) {
  let array = Object.entries(data).map(([key, value]) => ({
    firebaseKey: key,
    ...value,
  }));
  return array;
}

function getPriorityIcon(priority) {
  switch (priority) {
    case "low":
      return priorityLowIcon();
    case "medium":
      return priorityMediumIcon();
    case "urgent":
      return priorityUrgentIcon();
    default:
      return "";
  }
}
