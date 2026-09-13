import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly elementsCard: Locator;

  constructor(private readonly page: Page) {
    this.elementsCard = page.getByRole('link', { name: 'Elements', exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async goToElements(): Promise<void> {
    await this.elementsCard.click();
    await this.page.waitForURL('**/elements');
  }
}
