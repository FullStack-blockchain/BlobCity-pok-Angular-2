import { MyprojectPage } from './app.po';

describe('myproject App', () => {
  let page: MyprojectPage;

  beforeEach(() => {
    page = new MyprojectPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
