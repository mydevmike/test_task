/** Registration form payload for Web Tables modal. */
export type WebTableRecord = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
};

export const aldenRecord: WebTableRecord = {
  firstName: 'Alden',
  lastName: 'Cantrell',
  age: '30',
  email: 'test@test.com',
  salary: '12345',
  department: 'QA',
};
