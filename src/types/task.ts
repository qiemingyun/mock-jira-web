export interface Task {
  id: number;
  name: string;
  processorId: number;
  projectId: number;
  // task
  groupId: number;
  boardId: number;
  // bug or task
  typeId: number;
  note: string;
}
