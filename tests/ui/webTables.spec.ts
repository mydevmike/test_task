import { aldenRecord } from '../../src/data/webTablesData';
import { expect, test } from '../../src/fixtures/test';

test.describe('Web Tables', () => {
  test('adds a new record via registration form', async ({ homePage, webTablesPage }) => {
    await homePage.open();
    await homePage.goToElements();
    await webTablesPage.openFromSidebar();
    await webTablesPage.clickAdd();
    await webTablesPage.fillRegistrationForm(aldenRecord);
    await webTablesPage.submitForm();
    await webTablesPage.expectRecordInTable(aldenRecord);
  });
});
