import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { WebTableRecord } from '../data/webTablesData';

export class WebTablesPage {
  readonly webTablesMenuItem: Locator;
  readonly addButton: Locator;
  readonly submitButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly ageInput: Locator;
  readonly salaryInput: Locator;
  readonly departmentInput: Locator;
  readonly tableRows: Locator;

  constructor(private readonly page: Page) {
    this.webTablesMenuItem = page.getByRole('link', { name: 'Web Tables', exact: true });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.submitButton = page.locator('#submit');
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#userEmail');
    this.ageInput = page.locator('#age');
    this.salaryInput = page.locator('#salary');
    this.departmentInput = page.locator('#department');
    this.tableRows = page.locator('table tbody tr');
  }

  async openFromSidebar(): Promise<void> {
    await this.webTablesMenuItem.click();
    await this.page.waitForURL('**/webtables');
    await expect(this.page.getByRole('heading', { name: 'Web Tables' })).toBeVisible();
  }

  async clickAdd(): Promise<void> {
    await this.addButton.click();
    await expect(this.firstNameInput).toBeVisible();
  }

  async fillRegistrationForm(record: WebTableRecord): Promise<void> {
    await this.firstNameInput.fill(record.firstName);
    await this.lastNameInput.fill(record.lastName);
    await this.emailInput.fill(record.email);
    await this.ageInput.fill(record.age);
    await this.salaryInput.fill(record.salary);
    await this.departmentInput.fill(record.department);
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
    await expect(this.firstNameInput).toBeHidden();
  }

  rowByEmail(email: string): Locator {
    return this.tableRows.filter({ hasText: email });
  }

  async expectRecordInTable(record: WebTableRecord): Promise<void> {
    const row = this.rowByEmail(record.email);
    await expect(row).toBeVisible();
    await expect(row).toContainText(record.firstName);
    await expect(row).toContainText(record.lastName);
    await expect(row).toContainText(record.age);
    await expect(row).toContainText(record.salary);
    await expect(row).toContainText(record.department);
  }
}
