import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const testTasks = [
  {
    title: 'Create one task',
    description: 'In our collection will appear one document',
    date: new Date(2020, 9, 1, 13, 22).toString(),
    owner: 'Max',
    implementer: 'Joe'
  },
  {
    title: 'Second task',
    description: 'We can check collision',
    date: new Date(2021, 9, 1, 13, 22).toString(),
    owner: 'Jane',
    implementer: 'Don'
  }
];

describe('TaskController ', () => {
  let app: INestApplication;
  let _firstTaskId: string, _secondTaskId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Collection manipulation ', () => {
    it('should get empty array', () => {
      return  request(app.getHttpServer())
        .get('/task/all')
        .expect(200, []);
    });

    it('should add new task', () => {
      return request(app.getHttpServer())
        .post('/task/create')
        .send({
          task: testTasks[0]
        })
        .set('Accept', 'application/json')
        .expect(201)
        .expect((res)=> {
          for(const prop in testTasks[0]) {
            expect(res.body).toHaveProperty(prop, testTasks[0][prop]);
          }
          _firstTaskId = res.body._id;
        })
    });

    it('should return only one task', () => {
      return request(app.getHttpServer())
        .get('/task/all')
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(1);
          for(const prop in testTasks[0]) {
            expect(res.body[0]).toHaveProperty(prop, testTasks[0][prop]);
          }
        })
    });

    it('should add second tasks', () => {
      return request(app.getHttpServer())
        .post('/task/create')
        .send({
          task: testTasks[1]
        }).expect((res) => {
          _secondTaskId = res.body._id;
        });
    });


    it('should return two tasks', () => {
      return request(app.getHttpServer())
        .get('/task/all')
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(2);
        })
    });

    it('should return search result', () => {
      return request(app.getHttpServer())
        .get('/task')
        .query({searchString: 'one task'})
        .expect(200)
        .expect((res) => {
          for(const prop in testTasks[0]) {
            expect(res.body[0]).toHaveProperty(prop, testTasks[0][prop]);
          }
        })
    });

    it('should remove document', () => {
      return request(app.getHttpServer())
        .post('/task/delete')
        .send({taskId: _firstTaskId})
        .set('Accept', 'application/json')
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('ok', 1);
          expect(res.body).toHaveProperty('deletedCount', 1);
        })
    });

    it('should return last task', () => {
      return request(app.getHttpServer())
        .get('/task/all')
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(1);
        })
    });

    it('should remove last document', () => {
      return request(app.getHttpServer())
        .post('/task/delete')
        .send({taskId: _secondTaskId})
        .set('Accept', 'application/json')
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('ok', 1);
          expect(res.body).toHaveProperty('deletedCount', 1);
        })
    });

    it('should return last task', () => {
      return request(app.getHttpServer())
        .get('/task/all')
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(0);
        })
    });
  });
});