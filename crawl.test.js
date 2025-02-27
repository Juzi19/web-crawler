const {normalizeURL,getURLsFromHTML,extract_text} = require('./crawl.js')
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

//extract input test
test('extract input',()=>{
    const inputHTMLBody = `
    <html>
        <head><title>Testseite</title></head>
        <body>
            <h1>Überschrift</h1>
            <p>Ein Absatz.</p>
            <small>Kleine Schrift.</small>
            <ul><li>Liste 1</li><li>Liste 2</li></ul>
        </body>
    </html>`;
    const actual = extract_text(inputHTMLBody);
    const expected = {
        "text": ["Ein Absatz.", "Kleine Schrift."],
        "headlines": ['Überschrift'],
        "title": ['Testseite'],
        "lists": ['<li>Liste 1</li><li>Liste 2</li>']
    };
    expect(actual).toEqual(expected);  
})
test('extract input',()=>{
    const inputHTMLBody = `
    <html>
        <head><title>Testseite</title></head>
        <body>
            <h1>Überschrift</h1>
            <p>Ein Absatz.</p>
            <small>Kleine Schrift.</small>
        </body>
    </html>`;
    const actual = extract_text(inputHTMLBody);
    const expected = {
        "text": ["Ein Absatz.", "Kleine Schrift."],
        "headlines": ['Überschrift'],
        "title": ['Testseite'],
        "lists": []
    };
    expect(actual).toEqual(expected);  
})
 