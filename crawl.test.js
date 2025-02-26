const {normalizeURL,getURLsFromHTML} = require('./crawl.js')
const {test, expect} = require('@jest/globals')

test('normalizeURL strip protocol',()=>{
    const input = 'https://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
})

test('normalizeURL capitals',()=>{
    const input = 'https://BLOG.boot.dev/path/';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
})
test('normalizeURL strip http',()=>{
    const input = 'http://BLOG.boot.dev/path/';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
})
//URL from HTML test
test('getURLSFromHTML absolute',()=>{
    const inputHTMLBody = '<html><body><a href="https://blog.boot.dev/path">Hi</a></body></html>';
    const inputBaseURL ='https://blog.boot.dev' 
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ['https://blog.boot.dev/path'];
    expect(actual).toEqual(expected);  
})
test('getURLSFromHTML relative',()=>{
    const inputHTMLBody = '<html><body><a href="/path">Hi</a></body></html>';
    const inputBaseURL ='https://blog.boot.dev' 
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ['https://blog.boot.dev/path'];
    expect(actual).toEqual(expected);  
})
test('getURLSFromHTML invalid',()=>{
    const inputHTMLBody = '<html><body><a href="invalid">Hi</a></body></html>';
    const inputBaseURL ='https://blog.boot.dev' 
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = [];
    expect(actual).toEqual(expected);  
})
test('getURLSFromHTML multiple',()=>{
    const inputHTMLBody = '<html><body><a href="/path">Hi</a><a href="/path2">Hi</a></body></html>';
    const inputBaseURL ='https://blog.boot.dev' 
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ['https://blog.boot.dev/path', 'https://blog.boot.dev/path2'];
    expect(actual).toEqual(expected);  
})