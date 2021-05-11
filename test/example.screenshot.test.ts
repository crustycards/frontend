import * as puppeteer from 'puppeteer';
import {createMockJwt} from '../src/server/testMock/jwt';

it('navigates to Google', async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.setViewport({
      width: 320,
      height: 568,
      deviceScaleFactor: 1,
    });
    await page.goto('http://localhost:3000/');

    let image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
    await page.setCookie({
      name: 'authToken',
      value: createMockJwt('users/test')
    });
    await page.reload();
    image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
    await browser.close();
});