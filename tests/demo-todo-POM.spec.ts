import { test } from '@playwright/test';
import { ToDoPage } from './pages/ToDoPage';
import { editTodoItemInfo } from './helpers/Types';

const TODO_ITEMS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment',
];

test.describe('New Todo @regression', () => {
  let todoPage: ToDoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new ToDoPage(page);
    await todoPage.goto();
    await todoPage.createDefaultTodos(TODO_ITEMS);
  });

  test('should allow me to delete all items and add todo items, validate input status, added items', async ({
    page,
  }) => {
    await todoPage.deleteAllItems();
    for (let index = 0; index < TODO_ITEMS.length; index++) {
      await todoPage.fillToDOInput(TODO_ITEMS[index]);
      await todoPage.checkTodoList(TODO_ITEMS.slice(0, index + 1));
      await todoPage.checkNumberOfTodosInLocalStorage(page, index + 1);
    }
  });

  test('should be able to complete/incomplete all tasks', async () => {
    await todoPage.markItemsTobeComplete();
    await todoPage.markItemsTobeInComplete();
  });

  test('should be able to edit completed/incompleted tasks', async () => {
    // we will make edits on items that is not completed and completed
    const EDIT_INFO: editTodoItemInfo[] = [
      {
        original: 'buy some cheese',
        edited: 'Edited cheese',
      },
      {
        original: 'book a doctors appointment',
        edited: 'Edited Doc Appointment',
      },
    ];

    // complete first 2 todoItems
    await todoPage.markItemsTobeComplete(TODO_ITEMS.slice(0, 2));
    await todoPage.editToDoItems(EDIT_INFO);

    const EDITED_ITEM = structuredClone(TODO_ITEMS);
    EDITED_ITEM[0] = EDIT_INFO[0].edited;
    EDITED_ITEM[2] = EDIT_INFO[1].edited;
    await todoPage.checkTodoList(EDITED_ITEM);
    await todoPage.checkToDoItemCount(1);
  });

  test(`should be able to filter on completed and incomplete items`, async () => {
    // complete first 2 todoItems
    await todoPage.markItemsTobeComplete(TODO_ITEMS.slice(0, 2));

    //now we will filter the list by All, Completed and Active
    await todoPage.filterList('All');
    await todoPage.checkTodoList(TODO_ITEMS);

    await todoPage.filterList('Active');
    await todoPage.checkTodoList(TODO_ITEMS.slice(2, 3));

    await todoPage.filterList('Completed');
    await todoPage.checkTodoList(TODO_ITEMS.slice(0, 2));
  });
});
