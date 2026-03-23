import { getState } from "./state";

export function getTasks() {
  return getState().tasks;
}

export function addTask(task) {
  const state = getState();
  state.tasks.push(task);
}
