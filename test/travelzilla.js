let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

let bnbID = '636ba27e36fa9b9069f5888b';

chai.use(chaiHttp);

describe('Validate Event', () => {

    describe('Test 1 : BnBs is getting displayed', () => {
        it('It should display BnBs', async () => {
            await chai
                .request('http://localhost:3001')
                .get('/bnbs/')
                .then((res)=> {
                    chai.expect(res).to.have.status(200);
                });
        });
    })

    describe('Test 2 : Viewing a incorrect BnB', () => {
        it('It should return status code 400', async () => {
            await chai
                .request('http://localhost:3001')
                .get('/bnbs/' + bnbID)
                .then((res) => {
                    chai.expect(res).to.have.status(400);
                  })
        });
    });

    describe('Test 3 : Giving incomplete credentials', () => {
        it('It should return status code 400', async () => {
            await chai
                .request('http://localhost:3001')
                .post('/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ username:'testtest' })
                .then((res) => {
                    chai.expect(res).to.have.status(400);
                })
        });
    });

    describe('Test 4 : Giving Complete details for registration', () => {
        it('It should register the user', async () => {
            await chai
                .request('http://localhost:3001')
                .post('/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ username:'testtesttest',email:'testtesttest@gmail.com',password:'12345' })
                .then((res) => {
                    chai.expect(res).to.have.status(200);
                })
        });
    });

});