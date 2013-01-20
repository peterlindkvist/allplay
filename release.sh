rake assets:precompile
cp public/assets/application.js public/static/application.js
cp public/assets/application.css public/static/application.css
rake assets:clean

git commit -am 'release to heroku'
git pull
git push
git push heroku master