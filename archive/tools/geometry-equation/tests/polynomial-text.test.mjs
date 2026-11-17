import test from 'node:test';
import assert from 'node:assert/strict';
import {tidyPolynomialText} from '../production/polynomial-text.mjs';

test('a bracketed coefficient formula is written the way a person writes it',()=>{
  assert.equal(tidyPolynomialText('(5) + (-4)*x + (1)*x^2'),'x^2-4x+5');
  assert.equal(tidyPolynomialText('(5) + (0)*x + (-1)*x^2'),'-x^2+5');
  assert.equal(tidyPolynomialText('(-17) + (11)*x'),'11x-17');
  assert.equal(tidyPolynomialText('(3) + (2)*x + (-1)*x^2'),'-x^2+2x+3');
  assert.equal(tidyPolynomialText('x^2-4*x+5'),'x^2-4x+5');
  assert.equal(tidyPolynomialText('(x-1)^2+3'),'x^2-2x+4');
  assert.equal(tidyPolynomialText('(1/2)*x^2 - 3'),'x^2/2-3');
  assert.equal(tidyPolynomialText('-x^3+x'),'-x^3+x');
  assert.equal(tidyPolynomialText('x-x'),'0');
});
test('the shown variable letter replaces x, and a polynomial in another letter is left alone',()=>{
  assert.equal(tidyPolynomialText('(5) + (0)*x + (-1)*x^2',{shown:'k'}),'-k^2+5');
  assert.equal(tidyPolynomialText('k^2+1',{variable:'k',shown:'k'}),'k^2+1');
  assert.equal(tidyPolynomialText('k^2+1'),'k^2+1');
});
test('anything that is not a one-variable polynomial with rational coefficients comes back exactly as written',()=>{
  for(const text of ['sqrt(2)*x+1','2*sqrt(3)','x^(1/2)','a*x+1','(x+1)/(x-1)','1/x','x^9','x^-1','x**2','  ','y=x+1','|x|','3x²','1+'])assert.equal(tidyPolynomialText(text),text,text);
  assert.equal(tidyPolynomialText(5),5);
});
