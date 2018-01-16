'use strict'; // necessary for es6 output in node
import { AppPage } from './app.po';

describe('App', function() {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('My app!');
  });
});
