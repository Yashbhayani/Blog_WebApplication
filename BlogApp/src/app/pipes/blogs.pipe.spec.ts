import { BlogsPipe } from './blogs.pipe';

describe('BlogsPipe', () => {
  it('create an instance', () => {
    const pipe = new BlogsPipe();
    expect(pipe).toBeTruthy();
  });
});
