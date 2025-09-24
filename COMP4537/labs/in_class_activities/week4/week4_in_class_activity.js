const http=require('http');

http.createServer((req,res)=>{
    console.log('The server received a request:');
    res.writeHead(200,{'Content-Type':'text/html','Access-Control-Allow-Origin':'*'});
    res.end('Hello Attackers\n');
    }).listen(3000, '0.0.0.0', ()=>{
    console.log('Server is listening on port 3000');
});