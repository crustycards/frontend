import * as puppeteer from 'puppeteer';
import {createMockJwt} from '../src/server/testMock/jwt';
import {mockUserServiceClient} from '../src/server/testMock/mockUserServiceClient';
import * as sinon from 'sinon';
import {User} from '../proto-gen-out/crusty_cards_api/model_pb';

afterEach(() => {
  sinon.restore();
});

it('navigates to Google', async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.setViewport({
      width: 320,
      height: 568,
      deviceScaleFactor: 1,
    });
    await page.goto('http://localhost:3000/');
    await page.setCookie({
      name: 'authToken',
      value: createMockJwt('users/test')
    });

    let image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
    let stub = sinon.stub();
    sinon.replace(mockUserServiceClient, 'getUser', stub);
    const user = new User();
    user.setName('users/test');
    user.setDisplayName('Tommy');
    await page.reload();
    // stub.yield(null, user);
    image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
    await browser.close();
});