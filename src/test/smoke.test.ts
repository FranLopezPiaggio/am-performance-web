import { describe, it, expect } from 'vitest';

describe('Smoke test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });

  it('should access DOM APIs in jsdom', () => {
    const div = document.createElement('div');
    div.textContent = 'hello';
    expect(div.textContent).toBe('hello');
  });
});
