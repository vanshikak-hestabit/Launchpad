1. INSTALL MKCERT ::
- sudo apt install mkcert
- mkcert -install

2. GENERATE CERTIFICATES (Inside week5/day4/nginx/certs/) ::
- mkcert myapp.local

3. ADD DOMAIN TO HOSTS FILE (edit /etc/hosts) ::
- 127.0.0.1 myapp.local

4. WRITE CONFIGURATION IN NGINX.CONF ::

5. MAKE A STATIC PAGE ::

6. PREPARE DOCKERFILE ::

7. BUILD IMAGE ::
- docker build -t nginx-ssl .

8. RUN CONTAINER ::
- docker run -d -p 80:80 p 443:443 nginx-ssl

9. TEST ::
- https://myapp.local
