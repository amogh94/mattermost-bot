const puppeteer = require('puppeteer');
const { expect }  = require('chai');

const loginEmail = process.env.MATTERMOST_EMAIL;
const loginPassword = process.env.MATTERMOST_PWD;
const mattermostProjectUrl = 'https://chat.alt-code.org/csc510-f19/channels/project';
let browser;
let page;

async function respondWithPageData ( input_text ){
        await page.waitForSelector('#post_textbox');

        // Focus on post textbox and press enter. Unlike above, We do this since here there is no submit button to click. only option is to focus and then press enter
        await page.focus('#post_textbox');
        await page.keyboard.type(input_text);
        await page.keyboard.press('Enter');

        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(1000);
        
        await page.waitForSelector('.post-message__text');

        let nodes = [];

        nodes = await page.evaluate( param => {
            param = Array.from(document.querySelectorAll('.post-message__text'));
            return param.map( ( {innerText}) => innerText );
        }, nodes);

        return nodes;
}

describe('AI Bot Integration and Automation test using Puppeteer', function () {

    this.timeout(5000000);
    beforeEach(async () => {
        browser = await puppeteer.launch({headless:true});
        page = await browser.newPage();

        await page.goto(mattermostProjectUrl, {waitUntil: 'networkidle0'});

        // Login
        await page.type('input[id=loginId]', loginEmail);
        await page.type('input[id=loginPassword]', loginPassword);
        await page.click('button[id=loginButton]');

        // Wait for redirect
        await page.waitForNavigation();
    });

    afterEach(async () => {
         await browser.close();
     });

    it('should have the correct page title', async () => {
        expect(await page.title()).to.contain('Mattermost');   
    });

    it('Should contain greeting response when greeting message is received', async () => {  
        let nodes = await respondWithPageData("Hi Guerdon");
        expect(nodes[nodes.length-1]).to.contain('Hi I am Guerdon');
    });

    it('Should contain tone of text when using Guerdon Classifier', async () => {
        let nodes = await respondWithPageData("Classify my text ; Good Work guys");
        expect(nodes[nodes.length-1]).to.contain('Positive');
    });

    it('Should contain message with link for trained classifier', async () => {
        let nodes = await respondWithPageData("Train my classifier ; https://drive.google.com/dsfdsfffxcv.csv");
        expect(nodes[nodes.length-1]).to.contain('please find your classifier at');
    });

    it('Should contain tone of the given text classifed using user classifier', async () => {
        let nodes = await respondWithPageData("Test the classifier ; https://drive.google.com/dsfdsfffxcv.pkl ; Good job Guerdon");
        expect(nodes[nodes.length-1]).to.contain('Positive');
    });

    it('Mattermost top n users should return top users', async () => {
        let nodes = await respondWithPageData("Find top 2 users");
        expect(nodes[nodes.length-1]).to.contain('XYZ : 20 points');
    });

});