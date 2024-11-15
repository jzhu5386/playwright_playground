import { Locator, Page, expect } from '@playwright/test';
import { convertStringToNumber } from '../helpers/utils';
import { editTodoItemInfo } from '../helpers/Types';

export class ToDoPage {
  readonly headerText: Locator;
  readonly toDoInput: Locator;
  readonly toDoTitle: Locator;
  readonly itemCount: Locator;
  readonly todoItems: Locator;
  readonly toggleAllBtn: Locator;
  readonly clearCompletedBtn: Locator;
  readonly completeToggle;

  page: Page;

  constructor(page: Page) {
    this.page = page;
    this.toDoInput = this.page.getByPlaceholder('What needs to be done?');
    this.headerText = this.page.locator('header h1');
    this.toDoTitle = this.page.getByTestId('todo-title');
    this.itemCount = this.page.getByTestId('todo-count');
    this.completeToggle = this.page.getByLabel('Toggle Todo');
    this.todoItems = this.page.getByTestId('todo-item');
    this.toggleAllBtn = this.page.locator('#toggle-all');
    this.clearCompletedBtn = this.page.getByRole('button', {
      name: 'Clear completed',
    });
  }

  async goto() {
    await this.page.goto('/todomvc/#/');
  }

  async fillToDOInput(inputValue: string) {
    await this.toDoInput.fill(inputValue);
    await this.toDoInput.press('Enter');
    await expect(this.toDoInput).toBeEmpty();
  }

  async editToDoItems(editInfoList: editTodoItemInfo[]) {
    const todoList = await this.todoItems.all();
    const originalNames = editInfoList.map(each => each.original);

    for (const eachToDoItem of todoList) {
      const itemName = await eachToDoItem.locator(this.toDoTitle).textContent();
      if (originalNames.includes(itemName!)) {
        await eachToDoItem.dblclick();
        await eachToDoItem
          .getByLabel('Edit')
          .fill(editInfoList[originalNames.indexOf(itemName!)].edited);
        await eachToDoItem.getByLabel('Edit').press('Enter');
      }
    }
  }

  /**
   * This method takes in the list of tasks that we want to mark as complete
   * and check corresponding status once checked
   * @param completedItems
   */
  async markItemsTobeComplete(completedItems?: string[]) {
    const todoList = await this.todoItems.all();
    let initialCount = await this.getToDoItemsCount();
    for (const eachToDoItem of todoList) {
      const itemName = await eachToDoItem.locator(this.toDoTitle).textContent();
      if (completedItems === undefined || completedItems?.includes(itemName!)) {
        const status = await eachToDoItem.getAttribute('class');
        if (status !== undefined && !status?.includes('completed')) {
          await eachToDoItem.getByLabel('Toggle Todo').click();
          await expect(eachToDoItem).toHaveClass('completed');
          const currentCount = await this.getToDoItemsCount();
          expect(currentCount + 1).toEqual(initialCount);
          initialCount = currentCount;
        }
      }
    }
  }

  /**
   * This method takes in the list of tasks that we want to mark as complete
   * and check corresponding status once checked
   * @param completedItems
   */
  async markItemsTobeInComplete(inComplete?: string[]) {
    const todoList = await this.todoItems.all();
    let initialCount = await this.getToDoItemsCount();
    for (const eachToDoItem of todoList) {
      const itemName = await eachToDoItem.locator(this.toDoTitle).textContent();
      if (inComplete === undefined || inComplete?.includes(itemName!)) {
        // only do the toggle of item is truly in completed status
        const status = await eachToDoItem.getAttribute('class');
        if (status !== undefined && status?.includes('completed')) {
          await eachToDoItem.getByLabel('Toggle Todo').click();
          await expect(eachToDoItem).toHaveClass('');
          const currentCount = await this.getToDoItemsCount();
          expect(currentCount - 1).toEqual(initialCount);
          initialCount = currentCount;
        }
      }
    }
  }

  async validateHeaderText(expectedText: string) {
    expect(this.headerText).toContainText(expectedText);
  }

  async checkTodoList(expectedList: string[]) {
    await expect(this.toDoTitle).toHaveText(expectedList);
  }

  async checkToDoItemCount(count: number) {
    await expect(this.itemCount).toHaveText(
      `${count} ${count === 1 ? 'item' : 'items'} left`,
    );
  }

  async getToDoItemsCount(): Promise<number> {
    const itemCountText = await this.itemCount.textContent();
    return itemCountText != null
      ? convertStringToNumber(itemCountText)
      : -99999;
  }

  async createDefaultTodos(TODO_ITEMS: string[]) {
    // create a new todo locator
    for (const item of TODO_ITEMS) {
      await this.toDoInput.fill(item);
      await this.toDoInput.press('Enter');
    }
  }

  async deleteAllItems() {
    let todoList = await this.todoItems.all();
    while (todoList.length > 0) {
      await todoList[0].hover();
      await todoList[0].locator('button').click();
      todoList = await this.todoItems.all();
    }
  }

  async filterList(filterOption: 'All' | 'Active' | 'Completed') {
    await this.page.getByRole('link', { name: filterOption }).click();
  }

  async toggleAll() {
    await this.toggleAllBtn.click();
  }

  async clearCompleted() {
    await this.clearCompletedBtn.click();
  }

  async checkClearCompletedBtnVisibility(visible: boolean) {
    if (visible) {
      await expect(this.clearCompletedBtn).toBeVisible();
    } else {
      await expect(this.clearCompletedBtn).toBeHidden();
    }
  }

  async checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
    return await page.waitForFunction(e => {
      return JSON.parse(localStorage['react-todos']).length === e;
    }, expected);
  }

  async checkNumberOfCompletedTodosInLocalStorage(
    page: Page,
    expected: number,
  ) {
    return await page.waitForFunction(e => {
      return (
        JSON.parse(localStorage['react-todos']).filter(
          (todo: any) => todo.completed,
        ).length === e
      );
    }, expected);
  }

  async checkTodosInLocalStorage(page: Page, title: string) {
    return await page.waitForFunction(t => {
      return JSON.parse(localStorage['react-todos'])
        .map((todo: any) => todo.title)
        .includes(t);
    }, title);
  }
}
