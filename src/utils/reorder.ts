export const reorder = ({
  fromId,
  referenceId,
  list,
}: {
  fromId: number;
  referenceId: number;
  list: { id: number }[];
}) => {
  const copiedList = [...list];
  const moveIndex = copiedList.findIndex((item) => item.id === fromId);
  if (!referenceId) {
    return insert([...copiedList], moveIndex, copiedList.length - 1);
  }
  const targetIndex = copiedList.findIndex((item) => item.id === referenceId);
  return insert([...copiedList], moveIndex, targetIndex);
};

const insert = (list: unknown[], from: number, to: number) => {
  const removedItem = list.splice(from, 1)[0];
  list.splice(to, 0, removedItem);
  return list;
};

const insertTask = (
  list: unknown[],
  from: number,
  to: number,
  isDifferenBoard: boolean
) => {
  const copiedList = [...list];
  console.log('insert,task,list,pre', copiedList);
  console.log('insert,task,from,to', from, to);
  const removedItem = list.splice(from, 1)[0];
  if (from < to && isDifferenBoard) {
    to = to - 1;
  }
  list.splice(to, 0, removedItem);
  console.log('insert,task,list,after', list);
  return list;
};

export const reorderTask = ({
  fromId,
  referenceId,
  list,
  toBoardId,
  fromBoardId,
}: {
  fromId: number;
  referenceId: number;
  list: { id: number }[];
  toBoardId: number;
  fromBoardId: number;
}) => {
  const copiedList = [...list];
  const moveIndex = copiedList.findIndex((item) => item.id === fromId);

  const isDifferenBoard = !(toBoardId === fromBoardId);
  if (!referenceId) {
    return insertTask(
      [...copiedList],
      moveIndex,
      copiedList.length - 1,
      isDifferenBoard
    );
  }
  const targetIndex = copiedList.findIndex((item) => item.id === referenceId);
  return insertTask([...copiedList], moveIndex, targetIndex, isDifferenBoard);
};
